import { connectToDatabase } from './connection';
import {
  Alternative,
  Category,
  TechStack,
  Tag,
  ProprietarySoftware,
  Vote,
  User,
} from './models';
import { queryCache, CacheKeys, withCache, invalidateOnWrite, CacheTTL } from './cache';
import mongoose from 'mongoose';
import type { AlternativeTagsData } from '@/types/database';

// ============ TYPE DEFINITIONS ============

export interface AlternativeWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  long_description: string | null;
  icon_url: string | null;
  website: string;
  github: string;
  stars: number;
  forks: number;
  last_commit: string | null;
  contributors: number;
  license: string | null;
  is_self_hosted: boolean;
  health_score: number;
  vote_score: number;
  featured: boolean;
  approved: boolean;
  rejection_reason: string | null;
  rejected_at: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  user_id: string | null;
  screenshots: string[];
  submission_plan: 'free' | 'sponsor';
  sponsor_featured_until: string | null;
  sponsor_priority_until: string | null;
  sponsor_payment_id: string | null;
  sponsor_paid_at: string | null;
  newsletter_included: boolean;
  discount_code: string | null;
  discount_percentage: number | null;
  discount_description: string | null;
  discount_expires_at: string | null;
  alternative_tags: AlternativeTagsData | null;
  created_at: string;
  updated_at: string;
  categories: CategoryData[];
  tags: TagData[];
  tech_stacks: TechStackData[];
  alternative_to: ProprietaryData[];
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface CategoryWithCount extends CategoryData {
  count: number;
}

export interface TechStackData {
  id: string;
  name: string;
  slug: string;
  type: string;
  created_at: string;
}

export interface TechStackWithCount extends TechStackData {
  count: number;
}

export interface TagData {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface TagWithCount extends TagData {
  count: number;
}

export interface ProprietaryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  icon_url: string | null;
  created_at: string;
}

export interface ProprietaryWithCount extends ProprietaryData {
  categories: CategoryData[];
  alternative_count: number;
}

// ============ HELPER FUNCTIONS ============

function transformAlternative(alt: any): AlternativeWithRelations {
  return {
    id: alt._id.toString(),
    name: alt.name,
    slug: alt.slug,
    description: alt.description,
    short_description: alt.short_description,
    long_description: alt.long_description,
    icon_url: alt.icon_url,
    website: alt.website,
    github: alt.github,
    stars: alt.stars || 0,
    forks: alt.forks || 0,
    last_commit: alt.last_commit ? new Date(alt.last_commit).toISOString().split('T')[0] : null,
    contributors: alt.contributors || 0,
    license: alt.license,
    is_self_hosted: alt.is_self_hosted,
    health_score: alt.health_score,
    vote_score: alt.vote_score || 0,
    featured: alt.featured,
    approved: alt.approved,
    rejection_reason: alt.rejection_reason,
    rejected_at: alt.rejected_at ? new Date(alt.rejected_at).toISOString() : null,
    submitter_name: alt.submitter_name,
    submitter_email: alt.submitter_email,
    user_id: alt.user_id ? alt.user_id.toString() : null,
    screenshots: alt.screenshots || [],
    submission_plan: alt.submission_plan || 'free',
    sponsor_featured_until: alt.sponsor_featured_until ? new Date(alt.sponsor_featured_until).toISOString() : null,
    sponsor_priority_until: alt.sponsor_priority_until ? new Date(alt.sponsor_priority_until).toISOString() : null,
    sponsor_payment_id: alt.sponsor_payment_id,
    sponsor_paid_at: alt.sponsor_paid_at ? new Date(alt.sponsor_paid_at).toISOString() : null,
    newsletter_included: alt.newsletter_included || false,
    discount_code: alt.discount_code || null,
    discount_percentage: alt.discount_percentage || null,
    discount_description: alt.discount_description || null,
    discount_expires_at: alt.discount_expires_at ? new Date(alt.discount_expires_at).toISOString() : null,
    created_at: alt.created_at ? new Date(alt.created_at).toISOString() : new Date().toISOString(),
    updated_at: alt.updated_at ? new Date(alt.updated_at).toISOString() : new Date().toISOString(),
    categories: (alt.categories || []).map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      created_at: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
    })),
    tags: (alt.tags || []).map((t: any) => ({
      id: t._id.toString(),
      name: t.name,
      slug: t.slug,
      created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
    })),
    tech_stacks: (alt.tech_stacks || []).map((ts: any) => ({
      id: ts._id.toString(),
      name: ts.name,
      slug: ts.slug,
      type: ts.type,
      created_at: ts.created_at ? new Date(ts.created_at).toISOString() : new Date().toISOString(),
    })),
    alternative_to: (alt.alternative_to || []).map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      website: p.website,
      icon_url: p.icon_url || null,
      created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
    })),
    alternative_tags: alt.alternative_tags || { alerts: [], highlights: [], platforms: [], properties: [] },
  };
}

// Common population fields to reduce duplication
const ALTERNATIVE_POPULATE_FIELDS = [
  { path: 'categories', select: '_id name slug description icon created_at' },
  { path: 'tags', select: '_id name slug created_at' },
  { path: 'tech_stacks', select: '_id name slug type created_at' },
  { path: 'alternative_to', select: '_id name slug description website icon_url created_at' },
];

// Lean transform options for better performance
const LEAN_OPTIONS = { virtuals: false, getters: false };

// ============ OPTIMIZED ALTERNATIVES QUERIES ============

export async function getAlternatives(options?: {
  approved?: boolean;
  featured?: boolean;
  limit?: number;
  sortBy?: 'health_score' | 'stars' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.alternatives(options);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const query: any = {};
    if (options?.approved !== undefined) {
      query.approved = options.approved;
    }
    if (options?.featured !== undefined) {
      query.featured = options.featured;
    }

    const sortBy = options?.sortBy || 'health_score';
    const sortOrder = options?.sortOrder === 'asc' ? 1 : -1;

    let queryBuilder = Alternative.find(query)
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ [sortBy]: sortOrder })
      .lean(LEAN_OPTIONS);

    if (options?.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    const alternatives = await queryBuilder;
    return alternatives.map(transformAlternative);
  });
}

export async function getAlternativeBySlug(slug: string): Promise<AlternativeWithRelations | null> {
  const cacheKey = CacheKeys.alternativeBySlug(slug);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const alternative = await Alternative.findOne({ slug, approved: true })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .lean(LEAN_OPTIONS);

    if (!alternative) return null;
    return transformAlternative(alternative);
  });
}

export async function getAlternativesByCategory(categorySlug: string): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.alternativesByCategory(categorySlug);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    // Use aggregation to avoid N+1 query
    const category = await Category.findOne({ slug: categorySlug }).select('_id').lean();
    if (!category) return [];

    const alternatives = await Alternative.find({
      categories: category._id,
      approved: true,
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ health_score: -1 })
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

export async function getAlternativesByTag(tagSlug: string): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.alternativesByTag(tagSlug);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const tag = await Tag.findOne({ slug: tagSlug }).select('_id').lean();
    if (!tag) return [];

    const alternatives = await Alternative.find({
      tags: tag._id,
      approved: true,
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ health_score: -1 })
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

export async function getAlternativesByTechStack(techSlug: string): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.alternativesByTechStack(techSlug);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const techStack = await TechStack.findOne({ slug: techSlug }).select('_id').lean();
    if (!techStack) return [];

    const alternatives = await Alternative.find({
      tech_stacks: techStack._id,
      approved: true,
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ health_score: -1 })
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

export async function getAlternativesFor(proprietarySlug: string): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.alternativesFor(proprietarySlug);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const proprietary = await ProprietarySoftware.findOne({ slug: proprietarySlug }).select('_id').lean();
    if (!proprietary) return [];

    const alternatives = await Alternative.find({
      alternative_to: proprietary._id,
      approved: true,
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ health_score: -1 })
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

export async function getSelfHostedAlternatives(): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.selfHostedAlternatives();
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const alternatives = await Alternative.find({
      is_self_hosted: true,
      approved: true,
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ health_score: -1 })
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

export async function getFeaturedAlternatives(): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.featuredAlternatives();
  
  return withCache(cacheKey, CacheTTL.SHORT, async () => {
    await connectToDatabase();

    const now = new Date();

    // Use a single aggregation pipeline to get both sponsored and featured
    const pipeline = [
      {
        $match: { approved: true }
      },
      {
        $addFields: {
          isSponsor: {
            $and: [
              { $eq: ['$submission_plan', 'sponsor'] },
              { $gt: ['$sponsor_priority_until', now] }
            ]
          }
        }
      },
      {
        $sort: { isSponsor: -1 as const, sponsor_paid_at: -1 as const, health_score: -1 as const }
      },
      {
        $match: {
          $or: [
            { isSponsor: true },
            { featured: true }
          ]
        }
      },
      { $limit: 9 },
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
    ];

    const results = await Alternative.aggregate(pipeline);
    return results.map(transformAlternative);
  });
}

export async function searchAlternatives(query: string): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.search(query);
  
  return withCache(cacheKey, CacheTTL.SHORT, async () => {
    await connectToDatabase();

    // Use regex search for compatibility
    const alternatives = await Alternative.find({
      approved: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { short_description: { $regex: query, $options: 'i' } },
      ],
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ health_score: -1 })
      .limit(20)
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

// ============ OPTIMIZED CATEGORIES QUERIES ============

export async function getCategories(): Promise<CategoryWithCount[]> {
  const cacheKey = CacheKeys.categoriesWithCount();
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    // Use aggregation pipeline to get counts in a single query
    const pipeline = [
      {
        $lookup: {
          from: 'alternatives',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$categoryId', '$categories'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          icon: 1,
          created_at: 1,
          count: 1
        }
      },
      { $sort: { name: 1 as const } }
    ];

    const categories = await Category.aggregate(pipeline);
    
    return categories.map((category: any) => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      created_at: category.created_at ? new Date(category.created_at).toISOString() : new Date().toISOString(),
      count: category.count,
    }));
  });
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const cacheKey = CacheKeys.categoryBySlug(slug);
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      { $match: { slug } },
      {
        $lookup: {
          from: 'alternatives',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$categoryId', '$categories'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      }
    ];

    const results = await Category.aggregate(pipeline);
    if (results.length === 0) return null;

    const category = results[0];
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      created_at: category.created_at ? new Date(category.created_at).toISOString() : new Date().toISOString(),
      count: category.count,
    };
  });
}

// ============ OPTIMIZED TECH STACKS QUERIES ============

export async function getTechStacks(): Promise<TechStackWithCount[]> {
  const cacheKey = CacheKeys.techStacksWithCount();
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      {
        $lookup: {
          from: 'alternatives',
          let: { techId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$techId', '$tech_stacks'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          type: 1,
          created_at: 1,
          count: 1
        }
      },
      { $sort: { name: 1 as const } }
    ];

    const techStacks = await TechStack.aggregate(pipeline);
    
    return techStacks.map((ts: any) => ({
      id: ts._id.toString(),
      name: ts.name,
      slug: ts.slug,
      type: ts.type,
      created_at: ts.created_at ? new Date(ts.created_at).toISOString() : new Date().toISOString(),
      count: ts.count,
    }));
  });
}

export async function getTechStackBySlug(slug: string): Promise<TechStackWithCount | null> {
  const cacheKey = CacheKeys.techStackBySlug(slug);
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      { $match: { slug } },
      {
        $lookup: {
          from: 'alternatives',
          let: { techId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$techId', '$tech_stacks'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      }
    ];

    const results = await TechStack.aggregate(pipeline);
    if (results.length === 0) return null;

    const techStack = results[0];
    return {
      id: techStack._id.toString(),
      name: techStack.name,
      slug: techStack.slug,
      type: techStack.type,
      created_at: techStack.created_at ? new Date(techStack.created_at).toISOString() : new Date().toISOString(),
      count: techStack.count,
    };
  });
}

// ============ OPTIMIZED TAGS QUERIES ============

export async function getTags(): Promise<TagWithCount[]> {
  const cacheKey = CacheKeys.tagsWithCount();
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      {
        $lookup: {
          from: 'alternatives',
          let: { tagId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$tagId', '$tags'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          created_at: 1,
          count: 1
        }
      },
      { $sort: { name: 1 as const } }
    ];

    const tags = await Tag.aggregate(pipeline);
    
    return tags.map((tag: any) => ({
      id: tag._id.toString(),
      name: tag.name,
      slug: tag.slug,
      created_at: tag.created_at ? new Date(tag.created_at).toISOString() : new Date().toISOString(),
      count: tag.count,
    }));
  });
}

export async function getTagBySlug(slug: string): Promise<TagWithCount | null> {
  const cacheKey = CacheKeys.tagBySlug(slug);
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      { $match: { slug } },
      {
        $lookup: {
          from: 'alternatives',
          let: { tagId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$tagId', '$tags'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      }
    ];

    const results = await Tag.aggregate(pipeline);
    if (results.length === 0) return null;

    const tag = results[0];
    return {
      id: tag._id.toString(),
      name: tag.name,
      slug: tag.slug,
      created_at: tag.created_at ? new Date(tag.created_at).toISOString() : new Date().toISOString(),
      count: tag.count,
    };
  });
}

// ============ OPTIMIZED LANGUAGE QUERIES ============
// Languages are TechStacks with type "Language"

export interface LanguageWithCount {
  id: string;
  name: string;
  slug: string;
  count: number;
  totalStars: number;
}

export async function getLanguages(): Promise<LanguageWithCount[]> {
  const cacheKey = CacheKeys.languages();
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      { $match: { type: 'Language' } },
      {
        $lookup: {
          from: 'alternatives',
          let: { techId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$techId', '$tech_stacks'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalStars: { $sum: '$stars' }
              }
            }
          ],
          as: 'stats'
        }
      },
      {
        $addFields: {
          count: { $ifNull: [{ $arrayElemAt: ['$stats.count', 0] }, 0] },
          totalStars: { $ifNull: [{ $arrayElemAt: ['$stats.totalStars', 0] }, 0] },
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          count: 1,
          totalStars: 1,
        }
      },
      { $sort: { count: -1 as const, name: 1 as const } }
    ];

    const languages = await TechStack.aggregate(pipeline);
    
    return languages
      .filter((lang: any) => lang.count > 0)
      .map((lang: any) => ({
        id: lang._id.toString(),
        name: lang.name,
        slug: lang.slug,
        count: lang.count,
        totalStars: lang.totalStars,
      }));
  });
}

export async function getLanguageBySlug(slug: string): Promise<LanguageWithCount | null> {
  const cacheKey = CacheKeys.languageBySlug(slug);
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      { $match: { slug, type: 'Language' } },
      {
        $lookup: {
          from: 'alternatives',
          let: { techId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$techId', '$tech_stacks'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalStars: { $sum: '$stars' }
              }
            }
          ],
          as: 'stats'
        }
      },
      {
        $addFields: {
          count: { $ifNull: [{ $arrayElemAt: ['$stats.count', 0] }, 0] },
          totalStars: { $ifNull: [{ $arrayElemAt: ['$stats.totalStars', 0] }, 0] },
        }
      }
    ];

    const results = await TechStack.aggregate(pipeline);
    if (results.length === 0) return null;

    const lang = results[0];
    return {
      id: lang._id.toString(),
      name: lang.name,
      slug: lang.slug,
      count: lang.count,
      totalStars: lang.totalStars,
    };
  });
}

export async function getAlternativesByLanguage(languageSlug: string): Promise<AlternativeWithRelations[]> {
  const cacheKey = CacheKeys.alternativesByLanguage(languageSlug);
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    const techStack = await TechStack.findOne({ slug: languageSlug, type: 'Language' }).select('_id').lean();
    if (!techStack) return [];

    const alternatives = await Alternative.find({
      tech_stacks: techStack._id,
      approved: true,
    })
      .populate(ALTERNATIVE_POPULATE_FIELDS)
      .sort({ stars: -1 })
      .lean(LEAN_OPTIONS);

    return alternatives.map(transformAlternative);
  });
}

// ============ OPTIMIZED PROPRIETARY SOFTWARE QUERIES ============

export async function getProprietarySoftware(): Promise<ProprietaryWithCount[]> {
  const cacheKey = CacheKeys.proprietarySoftware();
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      // Lookup categories
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      // Lookup alternative count
      {
        $lookup: {
          from: 'alternatives',
          let: { propId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$propId', '$alternative_to'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          alternative_count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      },
      { $sort: { name: 1 as const } }
    ];

    const software = await ProprietarySoftware.aggregate(pipeline);
    
    return software.map((sw: any) => ({
      id: sw._id.toString(),
      name: sw.name,
      slug: sw.slug,
      description: sw.description,
      website: sw.website,
      icon_url: sw.icon_url || null,
      created_at: sw.created_at ? new Date(sw.created_at).toISOString() : new Date().toISOString(),
      categories: (sw.categories || []).map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        created_at: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
      })),
      alternative_count: sw.alternative_count,
    }));
  });
}

export async function getProprietaryBySlug(slug: string): Promise<ProprietaryWithCount | null> {
  const cacheKey = CacheKeys.proprietaryBySlug(slug);
  
  return withCache(cacheKey, CacheTTL.LONG, async () => {
    await connectToDatabase();

    const pipeline = [
      { $match: { slug } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $lookup: {
          from: 'alternatives',
          let: { propId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$propId', '$alternative_to'] },
                    { $eq: ['$approved', true] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'alternativeCount'
        }
      },
      {
        $addFields: {
          alternative_count: {
            $ifNull: [{ $arrayElemAt: ['$alternativeCount.count', 0] }, 0]
          }
        }
      }
    ];

    const results = await ProprietarySoftware.aggregate(pipeline);
    if (results.length === 0) return null;

    const software = results[0];
    return {
      id: software._id.toString(),
      name: software.name,
      slug: software.slug,
      description: software.description,
      website: software.website,
      icon_url: software.icon_url || null,
      created_at: software.created_at ? new Date(software.created_at).toISOString() : new Date().toISOString(),
      categories: (software.categories || []).map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        created_at: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
      })),
      alternative_count: software.alternative_count,
    };
  });
}

// ============ SUBMISSION ============

export async function submitAlternative(data: {
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  icon_url?: string;
  website: string;
  github: string;
  is_self_hosted: boolean;
  license?: string;
  submitter_name?: string;
  submitter_email?: string;
  user_id?: string;
  screenshots?: string[];
  category_ids: string[];
  tag_ids: string[];
  tech_stack_ids: string[];
  alternative_to_ids: string[];
  submission_plan?: 'free' | 'sponsor';
}): Promise<{ success: boolean; error?: string; id?: string }> {
  await connectToDatabase();

  try {
    const alternative = await Alternative.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      long_description: data.long_description,
      icon_url: data.icon_url,
      website: data.website,
      github: data.github,
      is_self_hosted: data.is_self_hosted,
      license: data.license,
      submitter_name: data.submitter_name,
      submitter_email: data.submitter_email,
      user_id: data.user_id ? new mongoose.Types.ObjectId(data.user_id) : null,
      screenshots: data.screenshots || [],
      health_score: 50,
      approved: data.submission_plan === 'sponsor',
      featured: false,
      submission_plan: data.submission_plan || 'free',
      categories: data.category_ids.map((id) => new mongoose.Types.ObjectId(id)),
      tags: data.tag_ids.map((id) => new mongoose.Types.ObjectId(id)),
      tech_stacks: data.tech_stack_ids.map((id) => new mongoose.Types.ObjectId(id)),
      alternative_to: data.alternative_to_ids.map((id) => new mongoose.Types.ObjectId(id)),
    });

    // Invalidate relevant caches
    invalidateOnWrite(['alternatives', 'categories', 'tags', 'techstack', 'proprietary']);

    return { success: true, id: alternative._id.toString() };
  } catch (error: any) {
    console.error('Error submitting alternative:', error);
    return { success: false, error: error.message || 'Failed to submit' };
  }
}

// ============ CREATOR PROFILES ============

export interface CreatorProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  github_username: string | null;
  twitter_username: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  discord_username: string | null;
  alternatives_count: number;
}

export async function getCreatorProfileByUserId(userId: string): Promise<CreatorProfile | null> {
  await connectToDatabase();

  // Use aggregation to get user with count in single query
  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'alternatives',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user_id', '$$userId'] },
                  { $eq: ['$approved', true] }
                ]
              }
            }
          },
          { $count: 'count' }
        ],
        as: 'alternativesCount'
      }
    },
    {
      $addFields: {
        alternatives_count: {
          $ifNull: [{ $arrayElemAt: ['$alternativesCount.count', 0] }, 0]
        }
      }
    },
    {
      $project: { password: 0, alternativesCount: 0 }
    }
  ];

  const results = await User.aggregate(pipeline);
  if (results.length === 0) return null;

  const user = results[0];
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    website: user.website,
    github_username: user.github_username,
    twitter_username: user.twitter_username,
    linkedin_url: user.linkedin_url,
    youtube_url: user.youtube_url,
    discord_username: user.discord_username,
    alternatives_count: user.alternatives_count,
  };
}

export async function getCreatorProfileByEmail(email: string): Promise<CreatorProfile | null> {
  await connectToDatabase();

  const pipeline = [
    { $match: { email: email.toLowerCase() } },
    {
      $lookup: {
        from: 'alternatives',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user_id', '$$userId'] },
                  { $eq: ['$approved', true] }
                ]
              }
            }
          },
          { $count: 'count' }
        ],
        as: 'alternativesCount'
      }
    },
    {
      $addFields: {
        alternatives_count: {
          $ifNull: [{ $arrayElemAt: ['$alternativesCount.count', 0] }, 0]
        }
      }
    },
    {
      $project: { password: 0, alternativesCount: 0 }
    }
  ];

  const results = await User.aggregate(pipeline);
  if (results.length === 0) return null;

  const user = results[0];
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    website: user.website,
    github_username: user.github_username,
    twitter_username: user.twitter_username,
    linkedin_url: user.linkedin_url,
    youtube_url: user.youtube_url,
    discord_username: user.discord_username,
    alternatives_count: user.alternatives_count,
  };
}

// ============ STATS ============

// Maximum number of sponsored alternatives allowed at one time
export const MAX_SPONSORED_ALTERNATIVES = 15;

export async function getActiveSponsorCount(): Promise<number> {
  const cacheKey = 'sponsors:active-count';
  
  return withCache(cacheKey, CacheTTL.SHORT, async () => {
    await connectToDatabase();

    const now = new Date();
    const count = await Alternative.countDocuments({
      submission_plan: 'sponsor',
      sponsor_priority_until: { $gt: now },
      approved: true,
    });

    return count;
  });
}

export async function canAcceptNewSponsor(): Promise<{ canAccept: boolean; currentCount: number; maxCount: number }> {
  const currentCount = await getActiveSponsorCount();
  return {
    canAccept: currentCount < MAX_SPONSORED_ALTERNATIVES,
    currentCount,
    maxCount: MAX_SPONSORED_ALTERNATIVES,
  };
}

export async function getStats(): Promise<{
  totalAlternatives: number;
  totalCategories: number;
  totalTechStacks: number;
  totalTags: number;
}> {
  const cacheKey = CacheKeys.stats();
  
  return withCache(cacheKey, CacheTTL.MEDIUM, async () => {
    await connectToDatabase();

    // Execute all counts in parallel
    const [alternatives, categories, techStacks, tags] = await Promise.all([
      Alternative.countDocuments({ approved: true }),
      Category.countDocuments(),
      TechStack.countDocuments(),
      Tag.countDocuments(),
    ]);

    return {
      totalAlternatives: alternatives,
      totalCategories: categories,
      totalTechStacks: techStacks,
      totalTags: tags,
    };
  });
}

// ============ VOTES ============

export async function getVoteScore(alternativeId: string): Promise<number> {
  await connectToDatabase();

  // Get vote_score directly from the Alternative document (cached in document)
  const alternative = await Alternative.findById(alternativeId)
    .select('vote_score')
    .lean();
  return alternative?.vote_score || 0;
}

export async function getUserVote(userId: string, alternativeId: string): Promise<number | null> {
  await connectToDatabase();

  const vote = await Vote.findOne({
    user_id: new mongoose.Types.ObjectId(userId),
    alternative_id: new mongoose.Types.ObjectId(alternativeId),
  })
    .select('vote_type')
    .lean();

  return vote?.vote_type || null;
}

export async function upsertVote(
  userId: string,
  alternativeId: string,
  voteType: number
): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();

  try {
    // Get the user's existing vote (if any)
    const existingVote = await Vote.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      alternative_id: new mongoose.Types.ObjectId(alternativeId),
    })
      .select('vote_type')
      .lean();

    const oldVoteValue = existingVote?.vote_type || 0;
    const newVoteValue = voteType === 0 ? 0 : voteType;
    const scoreDelta = newVoteValue - oldVoteValue;

    if (voteType === 0) {
      // Remove vote
      await Vote.deleteOne({
        user_id: new mongoose.Types.ObjectId(userId),
        alternative_id: new mongoose.Types.ObjectId(alternativeId),
      });
    } else {
      // Upsert vote
      await Vote.findOneAndUpdate(
        {
          user_id: new mongoose.Types.ObjectId(userId),
          alternative_id: new mongoose.Types.ObjectId(alternativeId),
        },
        { vote_type: voteType },
        { upsert: true }
      );
    }

    // Update vote_score on alternative by adding the delta
    if (scoreDelta !== 0) {
      await Alternative.findByIdAndUpdate(alternativeId, { $inc: { vote_score: scoreDelta } });
    }

    // Invalidate vote-related caches
    invalidateOnWrite(['votes']);

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting vote:', error);
    return { success: false, error: error.message };
  }
}

// Export cache utilities for use in API routes
export { queryCache, CacheKeys, withCache, invalidateOnWrite };
