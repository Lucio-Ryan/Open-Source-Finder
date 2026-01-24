import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Alternative, ProprietarySoftware } from '@/lib/mongodb';
import { queryCache, CacheKeys } from '@/lib/mongodb/cache';

// Optimized field selections to reduce data transfer
const ALTERNATIVE_SELECT = '_id name slug description short_description icon_url website github stars forks last_commit contributors license is_self_hosted health_score vote_score featured approved submission_plan sponsor_priority_until created_at categories tags tech_stacks alternative_to';
const POPULATION_OPTIONS = [
  { path: 'categories', select: '_id name slug description icon' },
  { path: 'tags', select: '_id name slug' },
  { path: 'tech_stacks', select: '_id name slug type' },
  { path: 'alternative_to', select: '_id name slug description website' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], proprietaryMatches: [] });
  }

  // Normalize query for caching
  const normalizedQuery = query.toLowerCase().trim();
  const cacheKey = CacheKeys.search(normalizedQuery);
  
  // Check cache first
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    await connectToDatabase();

    // Use Promise.all for parallel queries
    const [matchingProprietary, directResults] = await Promise.all([
      // Search proprietary software
      ProprietarySoftware.find({
        name: { $regex: query, $options: 'i' }
      })
        .select('_id name slug')
        .limit(10)
        .lean(),
      
      // Search alternatives - use text search if available, fallback to regex
      Alternative.find({
        approved: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { short_description: { $regex: query, $options: 'i' } },
        ],
      })
        .select(ALTERNATIVE_SELECT)
        .populate(POPULATION_OPTIONS)
        .sort({ health_score: -1 })
        .limit(25)
        .lean(),
    ]);

    // Get alternatives for matching proprietary software (only if matches found)
    let proprietaryAlternatives: any[] = [];
    const proprietaryIds = matchingProprietary.map((p: any) => p._id);
    
    if (proprietaryIds.length > 0) {
      proprietaryAlternatives = await Alternative.find({
        approved: true,
        alternative_to: { $in: proprietaryIds },
      })
        .select(ALTERNATIVE_SELECT)
        .populate(POPULATION_OPTIONS)
        .sort({ health_score: -1 })
        .limit(20)
        .lean();
    }

    // Merge results efficiently using a Map
    const resultMap = new Map();
    
    // Add proprietary alternatives first (they're more relevant)
    for (const alt of proprietaryAlternatives) {
      resultMap.set(alt._id.toString(), alt);
    }
    
    // Add direct matches
    for (const alt of directResults) {
      const id = alt._id.toString();
      if (!resultMap.has(id)) {
        resultMap.set(id, alt);
      }
    }

    // Transform to final format
    const results = Array.from(resultMap.values())
      .slice(0, 20)
      .map((item: any) => ({
        id: item._id.toString(),
        name: item.name,
        slug: item.slug,
        description: item.description,
        short_description: item.short_description,
        icon_url: item.icon_url,
        website: item.website,
        github: item.github,
        stars: item.stars,
        forks: item.forks,
        last_commit: item.last_commit ? new Date(item.last_commit).toISOString().split('T')[0] : null,
        contributors: item.contributors,
        license: item.license,
        is_self_hosted: item.is_self_hosted,
        health_score: item.health_score,
        vote_score: item.vote_score || 0,
        featured: item.featured,
        approved: item.approved,
        submission_plan: item.submission_plan,
        sponsor_priority_until: item.sponsor_priority_until ? new Date(item.sponsor_priority_until).toISOString() : null,
        created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
        categories: (item.categories || []).map((c: any) => ({
          id: c._id?.toString() || c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon: c.icon,
        })),
        tags: (item.tags || []).map((t: any) => ({
          id: t._id?.toString() || t.id,
          name: t.name,
          slug: t.slug,
        })),
        tech_stacks: (item.tech_stacks || []).map((ts: any) => ({
          id: ts._id?.toString() || ts.id,
          name: ts.name,
          slug: ts.slug,
          type: ts.type,
        })),
        alternative_to: (item.alternative_to || []).map((p: any) => ({
          id: p._id?.toString() || p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          website: p.website,
        })),
      }));

    const response = { 
      results,
      proprietaryMatches: matchingProprietary.map((p: any) => ({ 
        name: p.name, 
        slug: p.slug 
      }))
    };

    // Cache the response for 30 seconds
    queryCache.set(cacheKey, response, 30 * 1000);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
