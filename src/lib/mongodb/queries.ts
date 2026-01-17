import { connectToDatabase } from './connection';
import {
  Alternative,
  Category,
  TechStack,
  Tag,
  ProprietarySoftware,
  Vote,
  Discussion,
  CreatorNotification,
  Advertisement,
  User,
  IAlternative,
  ICategory,
  ITechStack,
  ITag,
  IProprietarySoftware,
} from './models';
import mongoose from 'mongoose';

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
  backlink_verified: boolean;
  backlink_url: string | null;
  sponsor_featured_until: string | null;
  sponsor_priority_until: string | null;
  sponsor_payment_id: string | null;
  sponsor_paid_at: string | null;
  newsletter_included: boolean;
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
  created_at: string;
  icon_url?: string | null;
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
    last_commit: alt.last_commit ? alt.last_commit.toISOString().split('T')[0] : null,
    contributors: alt.contributors || 0,
    license: alt.license,
    is_self_hosted: alt.is_self_hosted,
    health_score: alt.health_score,
    vote_score: alt.vote_score || 0,
    featured: alt.featured,
    approved: alt.approved,
    rejection_reason: alt.rejection_reason,
    rejected_at: alt.rejected_at ? alt.rejected_at.toISOString() : null,
    submitter_name: alt.submitter_name,
    submitter_email: alt.submitter_email,
    user_id: alt.user_id ? alt.user_id.toString() : null,
    screenshots: alt.screenshots || [],
    submission_plan: alt.submission_plan || 'free',
    backlink_verified: alt.backlink_verified || false,
    backlink_url: alt.backlink_url,
    sponsor_featured_until: alt.sponsor_featured_until ? alt.sponsor_featured_until.toISOString() : null,
    sponsor_priority_until: alt.sponsor_priority_until ? alt.sponsor_priority_until.toISOString() : null,
    sponsor_payment_id: alt.sponsor_payment_id,
    sponsor_paid_at: alt.sponsor_paid_at ? alt.sponsor_paid_at.toISOString() : null,
    newsletter_included: alt.newsletter_included || false,
    created_at: alt.created_at ? alt.created_at.toISOString() : new Date().toISOString(),
    updated_at: alt.updated_at ? alt.updated_at.toISOString() : new Date().toISOString(),
    categories: (alt.categories || []).map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      created_at: c.created_at ? c.created_at.toISOString() : new Date().toISOString(),
    })),
    tags: (alt.tags || []).map((t: any) => ({
      id: t._id.toString(),
      name: t.name,
      slug: t.slug,
      created_at: t.created_at ? t.created_at.toISOString() : new Date().toISOString(),
    })),
    tech_stacks: (alt.tech_stacks || []).map((ts: any) => ({
      id: ts._id.toString(),
      name: ts.name,
      slug: ts.slug,
      type: ts.type,
      created_at: ts.created_at ? ts.created_at.toISOString() : new Date().toISOString(),
    })),
    alternative_to: (alt.alternative_to || []).map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      website: p.website,
      created_at: p.created_at.toISOString(),
    })),
  };
}

// ============ ALTERNATIVES ============

export async function getAlternatives(options?: {
  approved?: boolean;
  featured?: boolean;
  limit?: number;
  sortBy?: 'health_score' | 'stars' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}): Promise<AlternativeWithRelations[]> {
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
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ [sortBy]: sortOrder });

  if (options?.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }

  const alternatives = await queryBuilder.lean();
  return alternatives.map(transformAlternative);
}

export async function getAlternativeBySlug(slug: string): Promise<AlternativeWithRelations | null> {
  await connectToDatabase();

  const alternative = await Alternative.findOne({ slug, approved: true })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .lean();

  if (!alternative) return null;
  return transformAlternative(alternative);
}

export async function getAlternativesByCategory(categorySlug: string): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) return [];

  const alternatives = await Alternative.find({
    categories: category._id,
    approved: true,
  })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ health_score: -1 })
    .lean();

  return alternatives.map(transformAlternative);
}

export async function getAlternativesByTag(tagSlug: string): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const tag = await Tag.findOne({ slug: tagSlug }).lean();
  if (!tag) return [];

  const alternatives = await Alternative.find({
    tags: tag._id,
    approved: true,
  })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ health_score: -1 })
    .lean();

  return alternatives.map(transformAlternative);
}

export async function getAlternativesByTechStack(techSlug: string): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const techStack = await TechStack.findOne({ slug: techSlug }).lean();
  if (!techStack) return [];

  const alternatives = await Alternative.find({
    tech_stacks: techStack._id,
    approved: true,
  })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ health_score: -1 })
    .lean();

  return alternatives.map(transformAlternative);
}

export async function getAlternativesFor(proprietarySlug: string): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const proprietary = await ProprietarySoftware.findOne({ slug: proprietarySlug }).lean();
  if (!proprietary) return [];

  const alternatives = await Alternative.find({
    alternative_to: proprietary._id,
    approved: true,
  })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ health_score: -1 })
    .lean();

  return alternatives.map(transformAlternative);
}

export async function getSelfHostedAlternatives(): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const alternatives = await Alternative.find({
    is_self_hosted: true,
    approved: true,
  })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ health_score: -1 })
    .lean();

  return alternatives.map(transformAlternative);
}

export async function getFeaturedAlternatives(): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const now = new Date();

  // Get sponsored alternatives first
  const sponsors = await Alternative.find({
    approved: true,
    submission_plan: 'sponsor',
    sponsor_priority_until: { $gt: now },
  })
    .populate('categories')
    .populate('tags')
    .populate('tech_stacks')
    .populate('alternative_to')
    .sort({ sponsor_paid_at: -1 })
    .lean();

  const sponsorCount = sponsors.length;
  const remainingSlots = Math.max(0, 9 - sponsorCount);

  // Get regular featured alternatives
  let featured: any[] = [];
  if (remainingSlots > 0) {
    const sponsorIds = sponsors.map((s: any) => s._id);
    featured = await Alternative.find({
      approved: true,
      featured: true,
      _id: { $nin: sponsorIds },
    })
      .populate('categories')
      .populate('tags')
      .populate('tech_stacks')
      .populate('alternative_to')
      .sort({ health_score: -1 })
      .limit(remainingSlots)
      .lean();
  }

  const combined = [...sponsors, ...featured];
  return combined.map(transformAlternative);
}

export async function searchAlternatives(query: string): Promise<AlternativeWithRelations[]> {
  await connectToDatabase();

  const alternatives = await Alternative.find({
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

  return alternatives.map(transformAlternative);
}

// ============ CATEGORIES ============

export async function getCategories(): Promise<CategoryWithCount[]> {
  await connectToDatabase();

  const categories = await Category.find().sort({ name: 1 }).lean();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (category: any) => {
      const count = await Alternative.countDocuments({
        categories: category._id,
        approved: true,
      });
      return {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        created_at: category.created_at ? category.created_at.toISOString() : new Date().toISOString(),
        count,
      };
    })
  );

  return categoriesWithCounts;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  await connectToDatabase();

  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;

  const count = await Alternative.countDocuments({
    categories: (category as any)._id,
    approved: true,
  });

  return {
    id: (category as any)._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    created_at: category.created_at ? category.created_at.toISOString() : new Date().toISOString(),
    count,
  };
}

// ============ TECH STACKS ============

export async function getTechStacks(): Promise<TechStackWithCount[]> {
  await connectToDatabase();

  const techStacks = await TechStack.find().sort({ name: 1 }).lean();

  const techStacksWithCounts = await Promise.all(
    techStacks.map(async (ts: any) => {
      const count = await Alternative.countDocuments({
        tech_stacks: ts._id,
        approved: true,
      });
      return {
        id: ts._id.toString(),
        name: ts.name,
        slug: ts.slug,
        type: ts.type,
        created_at: ts.created_at.toISOString(),
        count,
      };
    })
  );

  return techStacksWithCounts;
}

export async function getTechStackBySlug(slug: string): Promise<TechStackWithCount | null> {
  await connectToDatabase();

  const techStack = await TechStack.findOne({ slug }).lean();
  if (!techStack) return null;

  const count = await Alternative.countDocuments({
    tech_stacks: (techStack as any)._id,
    approved: true,
  });

  return {
    id: (techStack as any)._id.toString(),
    name: techStack.name,
    slug: techStack.slug,
    type: techStack.type,
    created_at: techStack.created_at.toISOString(),
    count,
  };
}

// ============ TAGS ============

export async function getTags(): Promise<TagWithCount[]> {
  await connectToDatabase();

  const tags = await Tag.find().sort({ name: 1 }).lean();

  const tagsWithCounts = await Promise.all(
    tags.map(async (tag: any) => {
      const count = await Alternative.countDocuments({
        tags: tag._id,
        approved: true,
      });
      return {
        id: tag._id.toString(),
        name: tag.name,
        slug: tag.slug,
        created_at: tag.created_at.toISOString(),
        count,
      };
    })
  );

  return tagsWithCounts;
}

export async function getTagBySlug(slug: string): Promise<TagWithCount | null> {
  await connectToDatabase();

  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) return null;

  const count = await Alternative.countDocuments({
    tags: (tag as any)._id,
    approved: true,
  });

  return {
    id: (tag as any)._id.toString(),
    name: tag.name,
    slug: tag.slug,
    created_at: tag.created_at.toISOString(),
    count,
  };
}

// ============ PROPRIETARY SOFTWARE ============

export async function getProprietarySoftware(): Promise<ProprietaryWithCount[]> {
  await connectToDatabase();

  const software = await ProprietarySoftware.find()
    .populate('categories')
    .sort({ name: 1 })
    .lean();

  const softwareWithCounts = await Promise.all(
    software.map(async (sw: any) => {
      const count = await Alternative.countDocuments({
        alternative_to: sw._id,
        approved: true,
      });
      return {
        id: sw._id.toString(),
        name: sw.name,
        slug: sw.slug,
        description: sw.description,
        website: sw.website,
        icon_url: sw.icon_url || null,
        created_at: sw.created_at.toISOString(),
        categories: (sw.categories || []).map((c: any) => ({
          id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon: c.icon,
          created_at: c.created_at.toISOString(),
        })),
        alternative_count: count,
      };
    })
  );

  return softwareWithCounts;
}

export async function getProprietaryBySlug(slug: string): Promise<ProprietaryWithCount | null> {
  await connectToDatabase();

  const software = await ProprietarySoftware.findOne({ slug })
    .populate('categories')
    .lean();

  if (!software) return null;

  const count = await Alternative.countDocuments({
    alternative_to: (software as any)._id,
    approved: true,
  });

  return {
    id: (software as any)._id.toString(),
    name: software.name,
    slug: software.slug,
    description: software.description,
    website: software.website,
    icon_url: (software as any).icon_url || null,
    created_at: software.created_at.toISOString(),
    categories: ((software as any).categories || []).map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      created_at: c.created_at.toISOString(),
    })),
    alternative_count: count,
  };
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

  const user = await User.findById(userId).select('-password').lean();
  if (!user) return null;

  const count = await Alternative.countDocuments({
    user_id: new mongoose.Types.ObjectId(userId),
    approved: true,
  });

  return {
    id: (user as any)._id.toString(),
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
    alternatives_count: count,
  };
}

export async function getCreatorProfileByEmail(email: string): Promise<CreatorProfile | null> {
  await connectToDatabase();

  const user = await User.findOne({ email: email.toLowerCase() }).select('-password').lean();
  if (!user) return null;

  const count = await Alternative.countDocuments({
    user_id: (user as any)._id,
    approved: true,
  });

  return {
    id: (user as any)._id.toString(),
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
    alternatives_count: count,
  };
}

// ============ STATS ============

export async function getStats(): Promise<{
  totalAlternatives: number;
  totalCategories: number;
  totalTechStacks: number;
  totalTags: number;
}> {
  await connectToDatabase();

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
}

// ============ VOTES ============

export async function getVoteScore(alternativeId: string): Promise<number> {
  await connectToDatabase();

  const result = await Vote.aggregate([
    { $match: { alternative_id: new mongoose.Types.ObjectId(alternativeId) } },
    { $group: { _id: null, total: { $sum: '$vote_type' } } },
  ]);

  return result[0]?.total || 0;
}

export async function getUserVote(userId: string, alternativeId: string): Promise<number | null> {
  await connectToDatabase();

  const vote = await Vote.findOne({
    user_id: new mongoose.Types.ObjectId(userId),
    alternative_id: new mongoose.Types.ObjectId(alternativeId),
  }).lean();

  return vote?.vote_type || null;
}

export async function upsertVote(
  userId: string,
  alternativeId: string,
  voteType: number
): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();

  try {
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

    // Update vote_score on alternative
    const newScore = await getVoteScore(alternativeId);
    await Alternative.findByIdAndUpdate(alternativeId, { vote_score: newScore });

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting vote:', error);
    return { success: false, error: error.message };
  }
}
