import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (isUsingMockData) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Get the current user from the server client
    const serverClient = createServerClient();
    const { data: { user } } = await serverClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // Verify ownership and get the alternative
    const { data: existing, error: fetchError } = await supabase
      .from('alternatives')
      .select('id, submitter_email, user_id, submission_plan')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Alternative not found' },
        { status: 404 }
      );
    }

    // Verify the user owns this alternative
    if (existing.submitter_email !== user.email && existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to upgrade this alternative' },
        { status: 403 }
      );
    }

    // If already sponsored, return current dates
    if (existing.submission_plan === 'sponsor') {
      const { data: altData } = await supabase
        .from('alternatives')
        .select('sponsor_featured_until, sponsor_priority_until')
        .eq('id', params.id)
        .single();

      return NextResponse.json({
        success: true,
        features: {
          featured_until: altData?.sponsor_featured_until,
          priority_until: altData?.sponsor_priority_until,
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
    const { data: updated, error: updateError } = await supabase
      .from('alternatives')
      .update({
        submission_plan: 'sponsor',
        approved: true,
        sponsor_featured_until: featuredUntil.toISOString(),
        sponsor_priority_until: priorityUntil.toISOString(),
        sponsor_payment_id: paymentId,
        sponsor_paid_at: now.toISOString(),
        newsletter_included: true,
        rejection_reason: null,
        rejected_at: null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
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
