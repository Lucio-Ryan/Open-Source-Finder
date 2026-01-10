import { createAdminClient } from '@/lib/supabase/admin';
import type { 
  AlternativeWithRelations, 
  CategoryWithCount, 
  TechStackWithCount, 
  TagWithCount,
  ProprietaryWithCount 
} from '@/types/database';

// Use admin client for all queries (doesn't rely on cookies, works at build time)
const createClient = createAdminClient;

// ============ ALTERNATIVES ============

export async function getAlternatives(options?: {
  approved?: boolean;
  featured?: boolean;
  limit?: number;
  sortBy?: 'health_score' | 'stars' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `);

  if (options?.approved !== undefined) {
    query = query.eq('approved', options.approved);
  }
  
  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured);
  }

  const sortBy = options?.sortBy || 'health_score';
  const sortOrder = options?.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching alternatives:', error);
    return [];
  }

  return transformAlternatives(data);
}

export async function getAlternativeBySlug(slug: string): Promise<AlternativeWithRelations | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('slug', slug)
    .eq('approved', true)
    .single();

  if (error || !data) {
    console.error('Error fetching alternative:', error);
    return null;
  }

  const transformed = transformAlternatives([data]);
  return transformed[0] || null;
}

export async function getAlternativesByCategory(categorySlug: string): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories!inner(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('alternative_categories.category_id', category.id)
    .eq('approved', true)
    .order('health_score', { ascending: false });

  if (error) {
    console.error('Error fetching alternatives by category:', error);
    return [];
  }

  return transformAlternatives(data);
}

export async function getAlternativesByTag(tagSlug: string): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  const { data: tag } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagSlug)
    .single();

  if (!tag) return [];

  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags!inner(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('alternative_tags.tag_id', tag.id)
    .eq('approved', true)
    .order('health_score', { ascending: false });

  if (error) {
    console.error('Error fetching alternatives by tag:', error);
    return [];
  }

  return transformAlternatives(data);
}

export async function getAlternativesByTechStack(techSlug: string): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  const { data: techStack } = await supabase
    .from('tech_stacks')
    .select('id')
    .eq('slug', techSlug)
    .single();

  if (!techStack) return [];

  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks!inner(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('alternative_tech_stacks.tech_stack_id', techStack.id)
    .eq('approved', true)
    .order('health_score', { ascending: false });

  if (error) {
    console.error('Error fetching alternatives by tech stack:', error);
    return [];
  }

  return transformAlternatives(data);
}

export async function getAlternativesFor(proprietarySlug: string): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  const { data: proprietary } = await supabase
    .from('proprietary_software')
    .select('id')
    .eq('slug', proprietarySlug)
    .single();

  if (!proprietary) return [];

  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to!inner(proprietary_id, proprietary_software(*))
    `)
    .eq('alternative_to.proprietary_id', proprietary.id)
    .eq('approved', true)
    .order('health_score', { ascending: false });

  if (error) {
    console.error('Error fetching alternatives for proprietary:', error);
    return [];
  }

  return transformAlternatives(data);
}

export async function getSelfHostedAlternatives(): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('is_self_hosted', true)
    .eq('approved', true)
    .order('health_score', { ascending: false });

  if (error) {
    console.error('Error fetching self-hosted alternatives:', error);
    return [];
  }

  return transformAlternatives(data);
}

export async function getFeaturedAlternatives(): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  // First, get ALL active sponsors (those with sponsor_priority_until in the future)
  const now = new Date().toISOString();
  
  const { data: sponsors, error: sponsorsError } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('approved', true)
    .eq('submission_plan', 'sponsor')
    .gt('sponsor_priority_until', now)
    .order('sponsor_paid_at', { ascending: false });

  // Then get regular featured alternatives to fill remaining slots
  const sponsorCount = sponsors?.length || 0;
  const remainingSlots = Math.max(0, 9 - sponsorCount);
  
  let featured: any[] = [];
  if (remainingSlots > 0) {
    const { data: featuredData, error: featuredError } = await supabase
      .from('alternatives')
      .select(`
        *,
        alternative_categories(category_id, categories(*)),
        alternative_tags(tag_id, tags(*)),
        alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
        alternative_to(proprietary_id, proprietary_software(*))
      `)
      .eq('approved', true)
      .eq('featured', true)
      .order('health_score', { ascending: false })
      .limit(remainingSlots);

    if (!featuredError && featuredData) {
      featured = featuredData;
    }
  }

  if (sponsorsError) {
    console.error('Error fetching sponsored alternatives:', sponsorsError);
  }

  // Combine sponsors first (all of them), then featured (removing duplicates)
  const sponsorIds = new Set((sponsors || []).map(s => s.id));
  const uniqueFeatured = featured.filter(f => !sponsorIds.has(f.id));
  
  const combined = [...(sponsors || []), ...uniqueFeatured];
  
  return transformAlternatives(combined);
}

export async function searchAlternatives(query: string): Promise<AlternativeWithRelations[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('alternatives')
    .select(`
      *,
      alternative_categories(category_id, categories(*)),
      alternative_tags(tag_id, tags(*)),
      alternative_tech_stacks(tech_stack_id, tech_stacks(*)),
      alternative_to(proprietary_id, proprietary_software(*))
    `)
    .eq('approved', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('health_score', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error searching alternatives:', error);
    return [];
  }

  return transformAlternatives(data);
}

// ============ CATEGORIES ============

export async function getCategories(): Promise<CategoryWithCount[]> {
  const supabase = createClient();
  
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (catError || !categories) {
    console.error('Error fetching categories:', catError);
    return [];
  }

  // Get counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from('alternative_categories')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);
      
      return {
        ...category,
        count: count || 0,
      };
    })
  );

  return categoriesWithCounts;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const supabase = createClient();
  
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !category) {
    return null;
  }

  const { count } = await supabase
    .from('alternative_categories')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', category.id);

  return {
    ...category,
    count: count || 0,
  };
}

// ============ TECH STACKS ============

export async function getTechStacks(): Promise<TechStackWithCount[]> {
  const supabase = createClient();
  
  const { data: techStacks, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('name');

  if (error || !techStacks) {
    console.error('Error fetching tech stacks:', error);
    return [];
  }

  const techStacksWithCounts = await Promise.all(
    techStacks.map(async (ts) => {
      const { count } = await supabase
        .from('alternative_tech_stacks')
        .select('*', { count: 'exact', head: true })
        .eq('tech_stack_id', ts.id);
      
      return {
        ...ts,
        count: count || 0,
      };
    })
  );

  return techStacksWithCounts;
}

export async function getTechStackBySlug(slug: string): Promise<TechStackWithCount | null> {
  const supabase = createClient();
  
  const { data: techStack, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !techStack) {
    return null;
  }

  const { count } = await supabase
    .from('alternative_tech_stacks')
    .select('*', { count: 'exact', head: true })
    .eq('tech_stack_id', techStack.id);

  return {
    ...techStack,
    count: count || 0,
  };
}

// ============ TAGS ============

export async function getTags(): Promise<TagWithCount[]> {
  const supabase = createClient();
  
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error || !tags) {
    console.error('Error fetching tags:', error);
    return [];
  }

  const tagsWithCounts = await Promise.all(
    tags.map(async (tag) => {
      const { count } = await supabase
        .from('alternative_tags')
        .select('*', { count: 'exact', head: true })
        .eq('tag_id', tag.id);
      
      return {
        ...tag,
        count: count || 0,
      };
    })
  );

  return tagsWithCounts;
}

export async function getTagBySlug(slug: string): Promise<TagWithCount | null> {
  const supabase = createClient();
  
  const { data: tag, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !tag) {
    return null;
  }

  const { count } = await supabase
    .from('alternative_tags')
    .select('*', { count: 'exact', head: true })
    .eq('tag_id', tag.id);

  return {
    ...tag,
    count: count || 0,
  };
}

// ============ PROPRIETARY SOFTWARE ============

export async function getProprietarySoftware(): Promise<ProprietaryWithCount[]> {
  const supabase = createClient();
  
  const { data: software, error } = await supabase
    .from('proprietary_software')
    .select(`
      *,
      proprietary_categories(category_id, categories(*))
    `)
    .order('name');

  if (error || !software) {
    console.error('Error fetching proprietary software:', error);
    return [];
  }

  const softwareWithCounts = await Promise.all(
    software.map(async (sw: any) => {
      const { count } = await supabase
        .from('alternative_to')
        .select('*', { count: 'exact', head: true })
        .eq('proprietary_id', sw.id);
      
      return {
        id: sw.id,
        name: sw.name,
        slug: sw.slug,
        description: sw.description,
        website: sw.website,
        created_at: sw.created_at,
        categories: sw.proprietary_categories?.map((pc: any) => pc.categories) || [],
        alternative_count: count || 0,
      };
    })
  );

  return softwareWithCounts;
}

export async function getProprietaryBySlug(slug: string): Promise<ProprietaryWithCount | null> {
  const supabase = createClient();
  
  const { data: software, error } = await supabase
    .from('proprietary_software')
    .select(`
      *,
      proprietary_categories(category_id, categories(*))
    `)
    .eq('slug', slug)
    .single();

  if (error || !software) {
    return null;
  }

  const { count } = await supabase
    .from('alternative_to')
    .select('*', { count: 'exact', head: true })
    .eq('proprietary_id', software.id);

  return {
    id: software.id,
    name: software.name,
    slug: software.slug,
    description: software.description,
    website: software.website,
    created_at: software.created_at,
    categories: (software as any).proprietary_categories?.map((pc: any) => pc.categories) || [],
    alternative_count: count || 0,
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
  screenshots?: string[];
  category_ids: string[];
  tag_ids: string[];
  tech_stack_ids: string[];
  alternative_to_ids: string[];
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = createClient();

  // Insert the alternative (not approved by default)
  const { data: alternative, error: altError } = await supabase
    .from('alternatives')
    .insert({
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
      screenshots: data.screenshots,
      health_score: 50, // Default score for new submissions
      approved: false, // Requires manual approval
      featured: false,
    })
    .select()
    .single();

  if (altError || !alternative) {
    console.error('Error submitting alternative:', altError);
    return { success: false, error: altError?.message || 'Failed to submit' };
  }

  // Insert category relations
  if (data.category_ids.length > 0) {
    await supabase.from('alternative_categories').insert(
      data.category_ids.map((categoryId) => ({
        alternative_id: alternative.id,
        category_id: categoryId,
      }))
    );
  }

  // Insert tag relations
  if (data.tag_ids.length > 0) {
    await supabase.from('alternative_tags').insert(
      data.tag_ids.map((tagId) => ({
        alternative_id: alternative.id,
        tag_id: tagId,
      }))
    );
  }

  // Insert tech stack relations
  if (data.tech_stack_ids.length > 0) {
    await supabase.from('alternative_tech_stacks').insert(
      data.tech_stack_ids.map((techStackId) => ({
        alternative_id: alternative.id,
        tech_stack_id: techStackId,
      }))
    );
  }

  // Insert alternative_to relations
  if (data.alternative_to_ids.length > 0) {
    await supabase.from('alternative_to').insert(
      data.alternative_to_ids.map((proprietaryId) => ({
        alternative_id: alternative.id,
        proprietary_id: proprietaryId,
      }))
    );
  }

  return { success: true, id: alternative.id };
}

// ============ HELPER FUNCTIONS ============

function transformAlternatives(data: any[]): AlternativeWithRelations[] {
  return data.map((item) => ({
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
    submitter_name: item.submitter_name,
    submitter_email: item.submitter_email,
    user_id: item.user_id,
    screenshots: item.screenshots,
    featured: item.featured,
    approved: item.approved,
    rejection_reason: item.rejection_reason,
    rejected_at: item.rejected_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
    // Submission plan fields
    submission_plan: item.submission_plan || 'free',
    backlink_verified: item.backlink_verified || false,
    backlink_url: item.backlink_url,
    sponsor_featured_until: item.sponsor_featured_until,
    sponsor_priority_until: item.sponsor_priority_until,
    sponsor_payment_id: item.sponsor_payment_id,
    sponsor_paid_at: item.sponsor_paid_at,
    newsletter_included: item.newsletter_included || false,
    categories: item.alternative_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
    tags: item.alternative_tags?.map((at: any) => at.tags).filter(Boolean) || [],
    tech_stacks: item.alternative_tech_stacks?.map((ats: any) => ats.tech_stacks).filter(Boolean) || [],
    alternative_to: item.alternative_to?.map((at: any) => at.proprietary_software).filter(Boolean) || [],
  }));
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
  const supabase = createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    console.error('Error fetching creator profile:', error);
    return null;
  }

  // Get count of approved alternatives by this user
  const { count } = await supabase
    .from('alternatives')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('approved', true);

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    website: profile.website,
    github_username: profile.github_username,
    twitter_username: profile.twitter_username,
    linkedin_url: profile.linkedin_url,
    youtube_url: profile.youtube_url,
    discord_username: profile.discord_username,
    alternatives_count: count || 0,
  };
}

export async function getCreatorProfileByEmail(email: string): Promise<CreatorProfile | null> {
  const supabase = createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !profile) {
    console.error('Error fetching creator profile by email:', error);
    return null;
  }

  // Get count of approved alternatives by this user
  const { count } = await supabase
    .from('alternatives')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .eq('approved', true);

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    website: profile.website,
    github_username: profile.github_username,
    twitter_username: profile.twitter_username,
    linkedin_url: profile.linkedin_url,
    youtube_url: profile.youtube_url,
    discord_username: profile.discord_username,
    alternatives_count: count || 0,
  };
}

// ============ STATS ============

export async function getStats(): Promise<{
  totalAlternatives: number;
  totalCategories: number;
  totalTechStacks: number;
  totalTags: number;
}> {
  const supabase = createClient();

  const [alternatives, categories, techStacks, tags] = await Promise.all([
    supabase.from('alternatives').select('*', { count: 'exact', head: true }).eq('approved', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('tech_stacks').select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalAlternatives: alternatives.count || 0,
    totalCategories: categories.count || 0,
    totalTechStacks: techStacks.count || 0,
    totalTags: tags.count || 0,
  };
}
