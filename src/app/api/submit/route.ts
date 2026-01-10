import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

type AlternativeInsert = Database['public']['Tables']['alternatives']['Insert'];
type SubmissionPlan = 'free' | 'sponsor';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get current user's profile ID if authenticated
async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if we're using mock data (no real database)
    if (isUsingMockData) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set up Supabase credentials in .env.local',
          debug: {
            hint: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file',
            docsUrl: 'https://supabase.com/docs/guides/getting-started'
          }
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const supabase = createAdminClient();
    
    // Get current user ID if logged in
    const userId = await getCurrentUserId();

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
      tag_ids,
      tech_stack_ids,
      alternative_to_ids,
      submitter_name,
      submitter_email,
      screenshots,
      // New plan-related fields
      submission_plan = 'free' as SubmissionPlan,
      backlink_verified = false,
      backlink_url,
      sponsor_payment_id,
    } = body;

    // Validate required fields
    if (!name || !short_description || !description || !website || !github) {
      return NextResponse.json(
        { error: 'Name, short description, description, website, and GitHub repository are required' },
        { status: 400 }
      );
    }

    // Validate plan-specific requirements
    if (submission_plan === 'free' && !backlink_verified) {
      return NextResponse.json(
        { error: 'Backlink verification is required for free submissions. Please add the Open Source Finder badge to your README.' },
        { status: 400 }
      );
    }

    // For sponsor plan, we'd typically verify payment here
    // In a real implementation, you'd verify with Stripe or similar
    if (submission_plan === 'sponsor' && !sponsor_payment_id) {
      return NextResponse.json(
        { error: 'Payment is required for sponsor submissions.' },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('alternatives')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An alternative with this name already exists' },
        { status: 409 }
      );
    }

    // Calculate sponsor dates (7 days from now for sponsor plan)
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Determine approval status based on plan
    // Sponsor: auto-approved, Free: requires manual approval
    const isAutoApproved = submission_plan === 'sponsor';

    // Insert the alternative
    const insertData: AlternativeInsert = {
      name,
      slug,
      description,
      short_description: short_description || null,
      long_description: long_description || null,
      icon_url: icon_url || null,
      website,
      github,
      is_self_hosted: is_self_hosted || false,
      license: license || null,
      health_score: 50,
      approved: isAutoApproved,
      featured: submission_plan === 'sponsor', // Sponsors are featured
      submitter_name: submitter_name || null,
      submitter_email: submitter_email || null,
      screenshots: screenshots?.length > 0 ? screenshots : null,
      user_id: userId,
      // Plan-specific fields
      submission_plan,
      backlink_verified: submission_plan === 'free' ? backlink_verified : false,
      backlink_url: submission_plan === 'free' ? backlink_url : null,
      sponsor_featured_until: submission_plan === 'sponsor' ? sevenDaysLater.toISOString() : null,
      sponsor_priority_until: submission_plan === 'sponsor' ? sevenDaysLater.toISOString() : null,
      sponsor_payment_id: submission_plan === 'sponsor' ? sponsor_payment_id : null,
      sponsor_paid_at: submission_plan === 'sponsor' ? now.toISOString() : null,
    };

    const { data: alternative, error: altError } = await supabase
      .from('alternatives')
      .insert(insertData)
      .select()
      .single();

    if (altError || !alternative) {
      console.error('Error creating alternative:', altError);
      return NextResponse.json(
        { 
          error: 'Failed to create alternative',
          debug: {
            message: altError?.message || 'Unknown error',
            code: altError?.code || null,
            details: altError?.details || null,
            hint: altError?.hint || null,
          }
        },
        { status: 500 }
      );
    }

    // Insert relations
    const relationPromises = [];

    if (category_ids?.length > 0) {
      relationPromises.push(
        supabase.from('alternative_categories').insert(
          category_ids.map((categoryId: string) => ({
            alternative_id: alternative.id,
            category_id: categoryId,
          }))
        )
      );
    }

    if (tag_ids?.length > 0) {
      relationPromises.push(
        supabase.from('alternative_tags').insert(
          tag_ids.map((tagId: string) => ({
            alternative_id: alternative.id,
            tag_id: tagId,
          }))
        )
      );
    }

    if (tech_stack_ids?.length > 0) {
      relationPromises.push(
        supabase.from('alternative_tech_stacks').insert(
          tech_stack_ids.map((techStackId: string) => ({
            alternative_id: alternative.id,
            tech_stack_id: techStackId,
          }))
        )
      );
    }

    if (alternative_to_ids?.length > 0) {
      relationPromises.push(
        supabase.from('alternative_to').insert(
          alternative_to_ids.map((proprietaryId: string) => ({
            alternative_id: alternative.id,
            proprietary_id: proprietaryId,
          }))
        )
      );
    }

    await Promise.all(relationPromises);

    // Return plan-specific success message
    const successMessage = submission_plan === 'sponsor'
      ? 'Your project is now live! It will be featured on the homepage for 7 days and included in our weekly newsletter.'
      : 'Alternative submitted successfully! It will be reviewed within approximately 1 week before being published.';

    return NextResponse.json({
      success: true,
      message: successMessage,
      id: alternative.id,
      slug: alternative.slug,
      plan: submission_plan,
      approved: isAutoApproved,
      features: submission_plan === 'sponsor' ? {
        featured_until: sevenDaysLater.toISOString(),
        priority_until: sevenDaysLater.toISOString(),
        newsletter: true,
      } : null,
    });
  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to submit an alternative' });
}
