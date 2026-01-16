import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Alternative, ProprietarySoftware } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], proprietaryMatches: [] });
  }

  try {
    await connectToDatabase();
    const lowerQuery = query.toLowerCase();

    // First, search for matching proprietary software
    const matchingProprietary = await ProprietarySoftware.find({
      name: { $regex: query, $options: 'i' }
    })
      .limit(10)
      .lean();

    // Get IDs of matching proprietary software
    const proprietaryIds = matchingProprietary.map((p: any) => p._id);

    // Search alternatives by name/description
    const directResults = await Alternative.find({
      approved: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { short_description: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('categories')
      .populate('tags')
      .populate('tech_stacks')
      .populate('alternative_to')
      .sort({ health_score: -1 })
      .limit(20)
      .lean();

    // If we found matching proprietary software, get alternatives for them
    let proprietaryAlternatives: any[] = [];
    if (proprietaryIds.length > 0) {
      proprietaryAlternatives = await Alternative.find({
        approved: true,
        alternative_to: { $in: proprietaryIds },
      })
        .populate('categories')
        .populate('tags')
        .populate('tech_stacks')
        .populate('alternative_to')
        .sort({ health_score: -1 })
        .limit(20)
        .lean();
    }

    // Merge results with proprietary alternatives first, avoiding duplicates
    const combinedResults = [...proprietaryAlternatives];
    const existingIds = new Set(proprietaryAlternatives.map((r: any) => r._id.toString()));
    
    directResults.forEach((alt: any) => {
      if (!existingIds.has(alt._id.toString())) {
        combinedResults.push(alt);
      }
    });

    // Transform the data to match the expected format
    const results = combinedResults.map((item: any) => ({
      id: item._id.toString(),
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
      last_commit: item.last_commit ? new Date(item.last_commit).toISOString().split('T')[0] : null,
      contributors: item.contributors,
      license: item.license,
      is_self_hosted: item.is_self_hosted,
      health_score: item.health_score,
      vote_score: item.vote_score || 0,
      featured: item.featured,
      approved: item.approved,
      submitter_name: item.submitter_name,
      submitter_email: item.submitter_email,
      screenshots: item.screenshots || [],
      submission_plan: item.submission_plan,
      sponsor_priority_until: item.sponsor_priority_until ? new Date(item.sponsor_priority_until).toISOString() : null,
      sponsor_featured_until: item.sponsor_featured_until ? new Date(item.sponsor_featured_until).toISOString() : null,
      created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
      updated_at: item.updated_at ? new Date(item.updated_at).toISOString() : new Date().toISOString(),
      categories: (item.categories || []).map((c: any) => ({
        id: c._id?.toString() || c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        created_at: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
      })),
      tags: (item.tags || []).map((t: any) => ({
        id: t._id?.toString() || t.id,
        name: t.name,
        slug: t.slug,
        created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
      })),
      tech_stacks: (item.tech_stacks || []).map((ts: any) => ({
        id: ts._id?.toString() || ts.id,
        name: ts.name,
        slug: ts.slug,
        type: ts.type,
        created_at: ts.created_at ? new Date(ts.created_at).toISOString() : new Date().toISOString(),
      })),
      alternative_to: (item.alternative_to || []).map((p: any) => ({
        id: p._id?.toString() || p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        website: p.website,
        created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
      })),
    }));

    // Sort by health score
    results.sort((a, b) => (b.health_score || 0) - (a.health_score || 0));

    return NextResponse.json({ 
      results: results.slice(0, 20),
      proprietaryMatches: matchingProprietary.map((p: any) => ({ 
        name: p.name, 
        slug: p.slug 
      }))
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
