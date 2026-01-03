import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';

export async function PUT(
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

    const body = await request.json();
    const supabase = createAdminClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('alternatives')
      .select('id, submitter_email')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Alternative not found' },
        { status: 404 }
      );
    }

    if (existing.submitter_email !== user.email) {
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
    const { error: updateError } = await supabase
      .from('alternatives')
      .update({
        name,
        short_description,
        description,
        long_description,
        icon_url: icon_url || null,
        website,
        github,
        is_self_hosted: is_self_hosted || false,
        license: license || null,
        screenshots: screenshots?.length > 0 ? screenshots : null,
        updated_at: new Date().toISOString(),
        // Clear rejection fields when user edits - this resubmits for review
        approved: false,
        rejection_reason: null,
        rejected_at: null,
      })
      .eq('id', params.id);

    if (updateError) {
      console.error('Error updating alternative:', updateError);
      return NextResponse.json(
        { error: 'Failed to update alternative' },
        { status: 500 }
      );
    }

    // Update categories
    if (category_ids !== undefined) {
      // Delete existing
      await supabase
        .from('alternative_categories')
        .delete()
        .eq('alternative_id', params.id);

      // Insert new
      if (category_ids.length > 0) {
        const categoryInserts = category_ids.map((categoryId: string) => ({
          alternative_id: params.id,
          category_id: categoryId,
        }));
        await supabase.from('alternative_categories').insert(categoryInserts);
      }
    }

    // Update alternative_to
    if (alternative_to_ids !== undefined) {
      // Delete existing
      await supabase
        .from('alternative_to')
        .delete()
        .eq('alternative_id', params.id);

      // Insert new
      if (alternative_to_ids.length > 0) {
        const altToInserts = alternative_to_ids.map((propId: string) => ({
          alternative_id: params.id,
          proprietary_id: propId,
        }));
        await supabase.from('alternative_to').insert(altToInserts);
      }
    }

    // Update tech stacks
    if (tech_stack_ids !== undefined) {
      // Delete existing
      await supabase
        .from('alternative_tech_stacks')
        .delete()
        .eq('alternative_id', params.id);

      // Insert new
      if (tech_stack_ids.length > 0) {
        const techStackInserts = tech_stack_ids.map((techStackId: string) => ({
          alternative_id: params.id,
          tech_stack_id: techStackId,
        }));
        await supabase.from('alternative_tech_stacks').insert(techStackInserts);
      }
    }

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
    if (isUsingMockData) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('alternatives')
      .select(`
        *,
        alternative_categories(category_id, categories(*)),
        alternative_to(proprietary_id, proprietary_software(*))
      `)
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Alternative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ alternative: data });
  } catch (error) {
    console.error('Error in GET /api/alternatives/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
