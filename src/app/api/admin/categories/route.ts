import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, Category } from '@/lib/mongodb/models';

// Verify admin role
async function verifyAdmin() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  await connectToDatabase();
  
  const profile = await User.findById(user.id).select('role').lean();

  if (!profile || profile.role !== 'admin') {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, userId: user.id };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET - List all categories
export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    await connectToDatabase();

    const data = await Category.find({})
      .sort({ name: 1 })
      .lean();

    // Transform to match expected format
    const categories = data.map(c => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      created_at: c.created_at
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Admin categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, icon } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    await connectToDatabase();

    const slug = generateSlug(name);

    // Check if slug exists
    const existing = await Category.findOne({ slug }).lean();

    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon: icon || 'Folder',
    });

    return NextResponse.json({ 
      success: true, 
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon
      }
    });
  } catch (error) {
    console.error('Admin category create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, description, icon } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    await connectToDatabase();

    const updateData: Record<string, any> = {};
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description) updateData.description = description;
    if (icon) updateData.icon = icon;

    const data = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!data) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      category: {
        id: data._id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon
      }
    });
  } catch (error) {
    console.error('Admin category update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    await connectToDatabase();

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin category delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
