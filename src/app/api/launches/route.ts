import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative, Category, ProprietarySoftware } from '@/lib/mongodb/models';
import { queryCache, CacheKeys } from '@/lib/mongodb/cache';
import mongoose from 'mongoose';

// Reduced field projection for better performance
const FIELD_PROJECTION = {
  _id: 1,
  name: 1,
  slug: 1,
  description: 1,
  short_description: 1,
  icon_url: 1,
  website: 1,
  github: 1,
  stars: 1,
  forks: 1,
  last_commit: 1,
  contributors: 1,
  license: 1,
  is_self_hosted: 1,
  health_score: 1,
  vote_score: 1,
  featured: 1,
  approved: 1,
  created_at: 1,
  categories: 1,
  tags: 1,
  tech_stacks: 1,
  alternative_to: 1,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get filter parameters
  const timeFrame = searchParams.get('timeFrame') || 'all';
  const categorySlug = searchParams.get('category');
  const proprietarySlug = searchParams.get('alternativeTo');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Cap at 50
  const offset = (page - 1) * limit;

  // Generate cache key
  const cacheParams = { timeFrame, categorySlug, proprietarySlug, page, limit };
  const cacheKey = CacheKeys.launches(cacheParams);
  
  // Check cache first
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

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
    await connectToDatabase();

    // Build the filter
    const filter: any = { approved: true };

    // Apply time frame filter
    if (startDate) {
      filter.created_at = { $gte: startDate };
    }

    // Apply category and proprietary filters in parallel if needed
    const filterPromises: Promise<any>[] = [];
    
    if (categorySlug) {
      filterPromises.push(
        Category.findOne({ slug: categorySlug }).select('_id').lean()
          .then(category => ({ type: 'category', data: category }))
      );
    }
    
    if (proprietarySlug) {
      filterPromises.push(
        ProprietarySoftware.findOne({ slug: proprietarySlug }).select('_id').lean()
          .then(proprietary => ({ type: 'proprietary', data: proprietary }))
      );
    }

    if (filterPromises.length > 0) {
      const results = await Promise.all(filterPromises);
      for (const result of results) {
        if (!result.data) {
          return NextResponse.json({
            alternatives: [],
            total: 0,
            page,
            limit,
            hasMore: false
          });
        }
        if (result.type === 'category') {
          filter.categories = result.data._id;
        } else if (result.type === 'proprietary') {
          filter.alternative_to = result.data._id;
        }
      }
    }

    // Use optimized aggregation pipeline with limited fields
    const [countResult, data] = await Promise.all([
      Alternative.countDocuments(filter),
      Alternative.aggregate([
        { $match: filter },
        {
          $addFields: {
            normalizedVoteScore: { $ifNull: ['$vote_score', 0] }
          }
        },
        { $sort: { normalizedVoteScore: -1 as const } },
        { $skip: offset },
        { $limit: limit },
        { $project: FIELD_PROJECTION },
        // Optimized lookups with field selection
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 1, name: 1, slug: 1 } }],
            as: 'categories'
          }
        },
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 1, name: 1, slug: 1 } }],
            as: 'tags'
          }
        },
        {
          $lookup: {
            from: 'techstacks',
            localField: 'tech_stacks',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 1, name: 1, slug: 1, type: 1 } }],
            as: 'tech_stacks'
          }
        },
        {
          $lookup: {
            from: 'proprietarysoftwares',
            localField: 'alternative_to',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 1, name: 1, slug: 1 } }],
            as: 'alternative_to'
          }
        }
      ])
    ]);

    const total = countResult;

    // Transform the data (minimal processing)
    const alternatives = data.map((item: any) => ({
      id: item._id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      short_description: item.short_description,
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
      categories: item.categories || [],
      tags: item.tags || [],
      tech_stacks: item.tech_stacks || [],
      alternative_to: item.alternative_to || [],
    }));

    const response = {
      alternatives,
      total,
      page,
      limit,
      hasMore: total > offset + limit
    };

    // Cache for 30 seconds (short TTL due to vote changes)
    queryCache.set(cacheKey, response, 30 * 1000);

    return NextResponse.json(response);

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
