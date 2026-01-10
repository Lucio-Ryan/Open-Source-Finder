export interface Profile {
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
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface TechStack {
  id: string;
  name: string;
  slug: string;
  type: string;
  created_at: string;
}

export interface ProprietarySoftware {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  created_at: string;
}

export interface Alternative {
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
  featured: boolean;
  approved: boolean;
  submitter_name: string | null;
  submitter_email: string | null;
  user_id: string | null;
  screenshots: string[] | null;
  created_at: string;
  updated_at: string;
  // Relations
  categories?: Category[];
  tags?: Tag[];
  tech_stacks?: TechStack[];
  alternatives_to?: ProprietarySoftware[];
}
