import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Alternative } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/mongodb/auth';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Get the current user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Verify ownership
    const existing = await Alternative.findById(params.id).lean();

    if (!existing) {
      return NextResponse.json(
        { error: 'Alternative not found' },
        { status: 404 }
      );
    }

    if ((existing as any).submitter_email !== user.email) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this alternative' },
        { status: 403 }
      );
    }

    const {
      name,
      short_description,
      description,
      long_description,
      icon_url,
      website,
      github,
      is_self_hosted,
      license,
      category_ids,
      alternative_to_ids,
      tech_stack_ids,
      screenshots,
    } = body;

    // Update the alternative
    const updateData: any = {
      name,
      short_description,
      description,
      long_description,
      icon_url: icon_url || null,
      website,
      github,
      is_self_hosted: is_self_hosted || false,
      license: license || null,
      screenshots: screenshots?.length > 0 ? screenshots : [],
      // Sponsored apps don't need approval on edit, free submissions are resubmitted for review
      approved: (existing as any).submission_plan === 'sponsor' ? true : false,
      rejection_reason: null,
      rejected_at: null,
    };

    // Update relations if provided
    if (category_ids !== undefined) {
      updateData.categories = category_ids.map((id: string) => new mongoose.Types.ObjectId(id));
    }
    if (alternative_to_ids !== undefined) {
      updateData.alternative_to = alternative_to_ids.map((id: string) => new mongoose.Types.ObjectId(id));
    }
    if (tech_stack_ids !== undefined) {
      updateData.tech_stacks = tech_stack_ids.map((id: string) => new mongoose.Types.ObjectId(id));
    }

    await Alternative.findByIdAndUpdate(params.id, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/alternatives/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const alternative = await Alternative.findById(params.id)
      .populate('categories')
      .populate('alternative_to')
      .lean();

    if (!alternative) {
      return NextResponse.json(
        { error: 'Alternative not found' },
        { status: 404 }
      );
    }

    // Transform the data
    const transformedAlt = {
      id: (alternative as any)._id.toString(),
      ...(alternative as any),
      _id: undefined,
      categories: ((alternative as any).categories || []).map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        created_at: c.created_at?.toISOString(),
      })),
      alternative_to: ((alternative as any).alternative_to || []).map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        description: p.description,
        website: p.website,
        created_at: p.created_at?.toISOString(),
      })),
    };

    return NextResponse.json({ alternative: transformedAlt });
  } catch (error) {
    console.error('Error in GET /api/alternatives/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
