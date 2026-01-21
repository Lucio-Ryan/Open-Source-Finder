import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import connectDB from '@/lib/mongodb/connection';
import { Alternative } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// Force dynamic rendering for routes that use cookies
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch alternatives by user_id or submitter_email
    const filter: Record<string, unknown> = {
      $or: [
        { user_id: new mongoose.Types.ObjectId(user.id) }
      ]
    };
    
    if (user.email) {
      (filter.$or as Record<string, unknown>[]).push({ submitter_email: user.email });
    }

    const data = await Alternative.find(filter)
      .select('_id name slug description approved status rejection_reason rejected_at created_at icon_url submission_plan sponsor_featured_until sponsor_priority_until')
      .sort({ created_at: -1 })
      .lean();

    // Transform to expected format
    const alternatives = data.map((alt: Record<string, unknown>) => ({
      id: (alt._id as mongoose.Types.ObjectId).toString(),
      name: alt.name,
      slug: alt.slug,
      description: alt.description,
      approved: alt.approved,
      rejection_reason: alt.rejection_reason,
      rejected_at: alt.rejected_at ? (alt.rejected_at as Date).toISOString() : null,
      created_at: (alt.created_at as Date).toISOString(),
      icon_url: alt.icon_url,
      submission_plan: alt.submission_plan,
      sponsor_featured_until: alt.sponsor_featured_until ? (alt.sponsor_featured_until as Date).toISOString() : null,
      sponsor_priority_until: alt.sponsor_priority_until ? (alt.sponsor_priority_until as Date).toISOString() : null,
    }));

    return NextResponse.json({ alternatives });
  } catch (error) {
    console.error('Error fetching user alternatives:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
