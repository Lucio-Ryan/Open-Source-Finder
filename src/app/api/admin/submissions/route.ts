import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, Alternative } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

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

// GET - List all submissions (including unapproved)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected', 'all'

    await connectToDatabase();

    const filter: any = {};

    if (status === 'pending') {
      filter.approved = false;
      filter.rejected_at = null;
    } else if (status === 'approved') {
      filter.approved = true;
    } else if (status === 'rejected') {
      filter.rejected_at = { $ne: null };
    }

    const data = await Alternative.find(filter)
      .populate('categories', 'id name slug')
      .populate('alternative_to', 'id name slug')
      .sort({ created_at: -1 })
      .lean();

    // Transform to match expected format
    const submissions = data.map(item => ({
      id: item._id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      short_description: item.short_description,
      long_description: item.long_description,
      icon_url: item.icon_url,
      website: item.website,
      github: item.github,
      stars: item.stars,
      forks: item.forks,
      license: item.license,
      is_self_hosted: item.is_self_hosted,
      health_score: item.health_score,
      vote_score: item.vote_score,
      featured: item.featured,
      approved: item.approved,
      rejection_reason: item.rejection_reason,
      rejected_at: item.rejected_at,
      submitter_email: item.submitter_email,
      created_at: item.created_at,
      updated_at: item.updated_at,
      categories: item.categories || [],
      alternative_to: item.alternative_to || []
    }));

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Admin submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update submission (approve, reject, edit)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, rejection_reason, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
    }

    await connectToDatabase();

    let updateData: Record<string, any> = {};

    if (action === 'approve') {
      updateData.approved = true;
      updateData.rejection_reason = null;
      updateData.rejected_at = null;
    } else if (action === 'reject') {
      // Mark as rejected with reason instead of deleting
      updateData.approved = false;
      updateData.rejection_reason = rejection_reason || 'No reason provided';
      updateData.rejected_at = new Date();

      const data = await Alternative.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).lean();

      if (!data) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Submission rejected', 
        submission: {
          id: data._id,
          name: data.name,
          approved: data.approved,
          rejection_reason: data.rejection_reason
        }
      });
    } else {
      // Regular update
      const allowedFields = [
        'name', 'description', 'short_description', 'long_description',
        'website', 'github', 'icon_url', 'license', 'is_self_hosted',
        'featured', 'approved', 'health_score'
      ];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      }

      // Update slug if name changed
      if (updates.name) {
        updateData.slug = generateSlug(updates.name);
      }
    }

    const data = await Alternative.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      submission: {
        id: data._id,
        name: data.name,
        slug: data.slug,
        approved: data.approved
      }
    });
  } catch (error) {
    console.error('Admin submission update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete submission
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
    }

    await connectToDatabase();

    await Alternative.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin submission delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
