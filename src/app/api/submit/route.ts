import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

type AlternativeInsert = Database['public']['Tables']['alternatives']['Insert'];

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
    } = body;

    // Validate required fields
    if (!name || !short_description || !description || !website || !github) {
      return NextResponse.json(
        { error: 'Name, short description, description, website, and GitHub repository are required' },
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
      approved: false, // Requires manual approval
      featured: false,
      submitter_name: submitter_name || null,
      submitter_email: submitter_email || null,
      screenshots: screenshots?.length > 0 ? screenshots : null,
      user_id: userId, // Link to user profile if authenticated
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

    return NextResponse.json({
      success: true,
      message: 'Alternative submitted successfully! It will be reviewed before being published.',
      id: alternative.id,
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
