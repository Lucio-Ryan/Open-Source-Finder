import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative, Category, ProprietarySoftware } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
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
    await connectToDatabase();

    // Build the filter
    const filter: any = { approved: true };

    // Apply time frame filter
    if (startDate) {
      filter.created_at = { $gte: startDate };
    }

    // Apply category filter
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) {
        filter.categories = category._id;
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

    // Apply alternative-to filter
    if (proprietarySlug) {
      const proprietary = await ProprietarySoftware.findOne({ slug: proprietarySlug }).lean();
      if (proprietary) {
        filter.alternative_to = proprietary._id;
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

    // Build sort options
    let sortOptions: any = {};
    let useAggregation = false;
    
    switch (sortBy) {
      case 'vote_score':
        // Use aggregation to sort: positive scores desc, then 0/null, then negative scores
        useAggregation = true;
        break;
      case 'stars':
        sortOptions = { stars: -1 };
        break;
      case 'newest':
        sortOptions = { created_at: -1 };
        break;
      case 'health_score':
        sortOptions = { health_score: -1 };
        break;
      default:
        useAggregation = true;
    }

    // Get total count
    const total = await Alternative.countDocuments(filter);

    let data: any[];
    
    if (useAggregation) {
      // Use aggregation pipeline to sort properly: positive > 0/null > negative
      data = await Alternative.aggregate([
        { $match: filter },
        {
          $addFields: {
            // Create a sort priority: 1 for positive, 2 for 0/null, 3 for negative
            sortPriority: {
              $cond: {
                if: { $gt: [{ $ifNull: ['$vote_score', 0] }, 0] },
                then: 1,
                else: {
                  $cond: {
                    if: { $lt: [{ $ifNull: ['$vote_score', 0] }, 0] },
                    then: 3,
                    else: 2
                  }
                }
              }
            },
            // Absolute value for secondary sort within each priority group
            absVoteScore: { $abs: { $ifNull: ['$vote_score', 0] } }
          }
        },
        // Sort by priority first, then by absolute value desc (so higher positives come first, more negative comes last), then by date
        { $sort: { sortPriority: 1, absVoteScore: -1, created_at: -1 } },
        { $skip: offset },
        { $limit: limit },
        // Lookup categories
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories'
          }
        },
        // Lookup tags
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags'
          }
        },
        // Lookup tech_stacks
        {
          $lookup: {
            from: 'techstacks',
            localField: 'tech_stacks',
            foreignField: '_id',
            as: 'tech_stacks'
          }
        },
        // Lookup alternative_to
        {
          $lookup: {
            from: 'proprietarysoftwares',
            localField: 'alternative_to',
            foreignField: '_id',
            as: 'alternative_to'
          }
        }
      ]);
    } else {
      // Use regular find with sort for non-vote sorting
      data = await Alternative.find(filter)
        .populate('categories', 'id name slug')
        .populate('tags', 'id name slug')
        .populate('tech_stacks', 'id name slug type')
        .populate('alternative_to', 'id name slug')
        .sort(sortOptions)
        .skip(offset)
        .limit(limit)
        .lean();
    }

    // Transform the data
    const alternatives = data.map((item: any) => ({
      id: item._id,
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
      categories: item.categories || [],
      tags: item.tags || [],
      tech_stacks: item.tech_stacks || [],
      alternative_to: item.alternative_to || [],
    }));

    return NextResponse.json({
      alternatives,
      total,
      page,
      limit,
      hasMore: total > offset + limit
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
