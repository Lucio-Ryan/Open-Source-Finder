// Software Alternative Types
export interface Alternative {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  website: string;
  github?: string;
  stars?: number;
  forks?: number;
  lastCommit?: string;
  contributors?: number;
  license?: string;
  logo?: string;
  categories: string[];
  tags: string[];
  alternativeTo: string[];
  isSelfHosted: boolean;
  techStack?: string[];
  healthScore: number;
  pricing: 'free' | 'freemium' | 'paid' | 'open-source';
  createdAt: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
}

export interface ProprietarySoftware {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  icon_url?: string | null;
  website: string;
  categories: string[];
  alternativeCount: number;
}

export interface TechStack {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  selfHosted?: boolean;
  techStack?: string;
  sortBy?: 'stars' | 'recent' | 'name' | 'healthScore';
}

export interface SubmissionForm {
  name: string;
  website: string;
  github?: string;
  description: string;
  categories: string[];
  alternativeTo: string[];
  email: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}
