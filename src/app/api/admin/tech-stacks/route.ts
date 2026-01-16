import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, TechStack } from '@/lib/mongodb/models';

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

// GET - List all tech stacks
export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    await connectToDatabase();

    const data = await TechStack.find({})
      .sort({ name: 1 })
      .lean();

    // Transform to match expected format
    const techStacks = data.map(ts => ({
      id: ts._id,
      name: ts.name,
      slug: ts.slug,
      type: ts.type,
      created_at: ts.created_at,
      updated_at: ts.updated_at
    }));

    return NextResponse.json({ techStacks });
  } catch (error) {
    console.error('Admin tech stacks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new tech stack
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { name, type } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectToDatabase();

    const slug = generateSlug(name);

    // Check if slug exists
    const existing = await TechStack.findOne({ slug }).lean();

    if (existing) {
      return NextResponse.json({ error: 'A tech stack with this name already exists' }, { status: 409 });
    }

    const techStack = await TechStack.create({
      name,
      slug,
      type: type || 'Tool',
    });

    return NextResponse.json({ 
      success: true, 
      techStack: {
        id: techStack._id,
        name: techStack.name,
        slug: techStack.slug,
        type: techStack.type
      }
    });
  } catch (error) {
    console.error('Admin tech stack create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update tech stack
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Tech stack ID required' }, { status: 400 });
    }

    await connectToDatabase();

    const updateData: Record<string, any> = {};
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (type) updateData.type = type;

    const data = await TechStack.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!data) {
      return NextResponse.json({ error: 'Tech stack not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      techStack: {
        id: data._id,
        name: data.name,
        slug: data.slug,
        type: data.type
      }
    });
  } catch (error) {
    console.error('Admin tech stack update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete tech stack
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Tech stack ID required' }, { status: 400 });
    }

    await connectToDatabase();

    await TechStack.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin tech stack delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
