import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative } from '@/lib/mongodb/models';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Verify ownership and get the alternative
    const existing = await Alternative.findById(params.id)
      .select('submitter_email user_id submission_plan sponsor_featured_until sponsor_priority_until')
      .lean();

    if (!existing) {
      return NextResponse.json(
        { error: 'Alternative not found' },
        { status: 404 }
      );
    }

    // Verify the user owns this alternative
    if (existing.submitter_email !== user.email && existing.user_id?.toString() !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to upgrade this alternative' },
        { status: 403 }
      );
    }

    // If already sponsored, return current dates
    if (existing.submission_plan === 'sponsor') {
      return NextResponse.json({
        success: true,
        features: {
          featured_until: existing.sponsor_featured_until?.toISOString(),
          priority_until: existing.sponsor_priority_until?.toISOString(),
        },
      });
    }

    // Calculate sponsor feature dates (7 days from now)
    const now = new Date();
    const featuredUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const priorityUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Generate a mock payment ID (in production, this would come from Stripe)
    const paymentId = `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update the alternative to sponsor plan
    const updated = await Alternative.findByIdAndUpdate(
      params.id,
      {
        submission_plan: 'sponsor',
        approved: true,
        sponsor_featured_until: featuredUntil,
        sponsor_priority_until: priorityUntil,
        sponsor_payment_id: paymentId,
        sponsor_paid_at: now,
        newsletter_included: true,
        rejection_reason: null,
        rejected_at: null,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to upgrade alternative' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      features: {
        featured_until: featuredUntil.toISOString(),
        priority_until: priorityUntil.toISOString(),
      },
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
