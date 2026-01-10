import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  
  // Get filter parameters
  const timeFrame = searchParams.get('timeFrame') || 'all';
  const categorySlug = searchParams.get('category');
  const proprietarySlug = searchParams.get('alternativeTo');
  const sortBy = searchParams.get('sortBy') || 'vote_score';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  // Calculate date range based on time frame
  const now = new Date();
  let startDate: Date | null = null;
  
  switch (timeFrame) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      startDate = null;
  }

  try {
    // Build the base query
    let query = supabase
      .from('alternatives')
      .select(`
        *,
        alternative_categories(category_id, categories(*)),
        alternative_tags(tag_id, tags(*)),
        alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
        alternative_to(proprietary_id, proprietary_software(*))
      `, { count: 'exact' })
      .eq('approved', true);

    // Apply time frame filter
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    // Apply category filter
    if (categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (category) {
        // Get alternatives in this category
        const { data: altCats } = await supabase
          .from('alternative_categories')
          .select('alternative_id')
          .eq('category_id', category.id);

        if (altCats && altCats.length > 0) {
          const altIds = altCats.map(ac => ac.alternative_id);
          query = query.in('id', altIds);
        } else {
          // No alternatives in this category
          return NextResponse.json({
            alternatives: [],
            total: 0,
            page,
            limit,
            hasMore: false
          });
        }
      }
    }

    // Apply alternative-to filter
    if (proprietarySlug) {
      const { data: proprietary } = await supabase
        .from('proprietary_software')
        .select('id')
        .eq('slug', proprietarySlug)
        .single();

      if (proprietary) {
        const { data: altTo } = await supabase
          .from('alternative_to')
          .select('alternative_id')
          .eq('proprietary_id', proprietary.id);

        if (altTo && altTo.length > 0) {
          const altIds = altTo.map(at => at.alternative_id);
          query = query.in('id', altIds);
        } else {
          return NextResponse.json({
            alternatives: [],
            total: 0,
            page,
            limit,
            hasMore: false
          });
        }
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'vote_score':
        query = query.order('vote_score', { ascending: false });
        break;
      case 'stars':
        query = query.order('stars', { ascending: false, nullsFirst: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'health_score':
        query = query.order('health_score', { ascending: false });
        break;
      default:
        query = query.order('vote_score', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching launches:', error);
      return NextResponse.json({ error: 'Failed to fetch launches' }, { status: 500 });
    }

    // Transform the data
    const alternatives = data?.map((item: any) => ({
      id: item.id,
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
      last_commit: item.last_commit,
      contributors: item.contributors,
      license: item.license,
      is_self_hosted: item.is_self_hosted,
      health_score: item.health_score,
      vote_score: item.vote_score || 0,
      featured: item.featured,
      approved: item.approved,
      created_at: item.created_at,
      updated_at: item.updated_at,
      categories: item.alternative_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
      tags: item.alternative_tags?.map((at: any) => at.tags).filter(Boolean) || [],
      tech_stacks: item.alternative_tech_stacks?.map((ats: any) => ats.tech_stacks).filter(Boolean) || [],
      alternative_to: item.alternative_to?.map((at: any) => at.proprietary_software).filter(Boolean) || [],
    })) || [];

    return NextResponse.json({
      alternatives,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
