import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';
import { mockAlternatives, mockProprietary } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], proprietaryMatches: [] });
  }

  // If using mock data, search mock alternatives
  if (isUsingMockData) {
    const lowerQuery = query.toLowerCase();
    
    // Search alternatives by name/description
    const directResults = mockAlternatives.filter(alt => 
      alt.name.toLowerCase().includes(lowerQuery) ||
      alt.description.toLowerCase().includes(lowerQuery)
    );

    // Search proprietary software and find alternatives for them
    const matchingProprietary = mockProprietary.filter(prop =>
      prop.name.toLowerCase().includes(lowerQuery)
    );
    
    // Get alternatives for matching proprietary software
    const proprietaryAlternatives = mockAlternatives.filter(alt =>
      alt.proprietarySoftware?.some(prop => 
        matchingProprietary.some(mp => mp.slug === prop.slug)
      )
    );

    // Combine and deduplicate results
    const allResults = [...directResults];
    proprietaryAlternatives.forEach(alt => {
      if (!allResults.find(r => r.id === alt.id)) {
        allResults.push(alt);
      }
    });

    // Transform mock data to expected format
    const results = allResults.map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      short_description: item.short_description,
      long_description: null,
      icon_url: item.icon_url,
      website: item.website,
      github: item.github,
      stars: item.stars,
      forks: item.forks,
      last_commit: null,
      contributors: null,
      license: item.license,
      is_self_hosted: item.is_self_hosted,
      health_score: item.health_score,
      featured: item.featured,
      approved: item.approved,
      submitter_name: item.submitter_name,
      submitter_email: item.submitter_email,
      screenshots: item.screenshots,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      categories: item.categories || [],
      tags: item.tags || [],
      tech_stacks: item.techStacks || [],
      alternative_to: item.proprietarySoftware || [],
    }));

    return NextResponse.json({ 
      results,
      proprietaryMatches: matchingProprietary.map(p => ({ name: p.name, slug: p.slug }))
    });
  }

  const supabase = createAdminClient();
  const lowerQuery = query.toLowerCase();

  // First, search for matching proprietary software
  const { data: matchingProprietary } = await supabase
    .from('proprietary_software')
    .select('id, name, slug')
    .ilike('name', `%${query}%`)
    .limit(10);

  // Get IDs of matching proprietary software
  const proprietaryIds = matchingProprietary?.map(p => p.id) || [];

  // Search alternatives:
  // 1. By name/description match
  // 2. By being an alternative to matching proprietary software
  let combinedResults: any[] = [];

  // Direct search by name/description
  const { data: directResults, error: directError } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('approved', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
    .order('health_score', { ascending: false })
    .limit(20);

  if (!directError && directResults) {
    combinedResults = [...directResults];
  }

  // If we found matching proprietary software, get alternatives for them
  if (proprietaryIds.length > 0) {
    const { data: proprietaryAlternatives, error: propError } = await supabase
      .from('alternatives')
      .select(`
        *,
        alternative_categories(category_id, categories(*)),
        alternative_tags(tag_id, tags(*)),
        alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
        alternative_to!inner(proprietary_id, proprietary_software(*))
      `)
      .eq('approved', true)
      .in('alternative_to.proprietary_id', proprietaryIds)
      .order('health_score', { ascending: false })
      .limit(20);

    if (!propError && proprietaryAlternatives) {
      // Merge results, avoiding duplicates
      proprietaryAlternatives.forEach((alt: any) => {
        if (!combinedResults.find((r: any) => r.id === alt.id)) {
          combinedResults.push(alt);
        }
      });
    }
  }

  // Transform the data to match the expected format
  const results = combinedResults.map((item: any) => ({
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
    featured: item.featured,
    approved: item.approved,
    submitter_name: item.submitter_name,
    submitter_email: item.submitter_email,
    screenshots: item.screenshots,
    submission_plan: item.submission_plan,
    sponsor_priority_until: item.sponsor_priority_until,
    sponsor_featured_until: item.sponsor_featured_until,
    created_at: item.created_at,
    updated_at: item.updated_at,
    categories: item.alternative_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
    tags: item.alternative_tags?.map((at: any) => at.tags).filter(Boolean) || [],
    tech_stacks: item.alternative_tech_stacks?.map((ats: any) => ats.tech_stacks).filter(Boolean) || [],
    alternative_to: item.alternative_to?.map((at: any) => at.proprietary_software).filter(Boolean) || [],
  }));

  // Sort by health score
  results.sort((a, b) => (b.health_score || 0) - (a.health_score || 0));

  return NextResponse.json({ 
    results: results.slice(0, 20),
    proprietaryMatches: matchingProprietary?.map(p => ({ name: p.name, slug: p.slug })) || []
  });
}
