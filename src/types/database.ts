export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alternatives: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string | null;
          long_description: string | null;
          icon_url: string | null;
          website: string;
          github: string;
          stars: number | null;
          forks: number | null;
          last_commit: string | null;
          contributors: number | null;
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
          screenshots: string[] | null;
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
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_description?: string | null;
          long_description?: string | null;
          icon_url?: string | null;
          website: string;
          github: string;
          stars?: number | null;
          forks?: number | null;
          last_commit?: string | null;
          contributors?: number | null;
          license?: string | null;
          is_self_hosted?: boolean;
          health_score?: number;
          vote_score?: number;
          featured?: boolean;
          approved?: boolean;
          submitter_name?: string | null;
          submitter_email?: string | null;
          user_id?: string | null;
          screenshots?: string[] | null;
          submission_plan?: 'free' | 'sponsor';
          backlink_verified?: boolean;
          backlink_url?: string | null;
          sponsor_featured_until?: string | null;
          sponsor_priority_until?: string | null;
          sponsor_payment_id?: string | null;
          sponsor_paid_at?: string | null;
          newsletter_included?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string | null;
          long_description?: string | null;
          icon_url?: string | null;
          website?: string;
          github?: string;
          stars?: number | null;
          forks?: number | null;
          last_commit?: string | null;
          contributors?: number | null;
          license?: string | null;
          is_self_hosted?: boolean;
          health_score?: number;
          vote_score?: number;
          featured?: boolean;
          approved?: boolean;
          submitter_name?: string | null;
          submitter_email?: string | null;
          user_id?: string | null;
          screenshots?: string[] | null;
          submission_plan?: 'free' | 'sponsor';
          backlink_verified?: boolean;
          backlink_url?: string | null;
          sponsor_featured_until?: string | null;
          sponsor_priority_until?: string | null;
          sponsor_payment_id?: string | null;
          sponsor_paid_at?: string | null;
          newsletter_included?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      advertisements: {
        Row: {
          id: string;
          name: string;
          description: string;
          ad_type: 'banner' | 'popup' | 'card';
          company_name: string;
          company_website: string;
          company_logo: string | null;
          headline: string | null;
          cta_text: string;
          destination_url: string;
          icon_url: string | null;
          short_description: string | null;
          is_active: boolean;
          priority: number;
          status: 'pending' | 'approved' | 'rejected';
          rejection_reason: string | null;
          approved_at: string | null;
          approved_by: string | null;
          start_date: string | null;
          end_date: string | null;
          user_id: string | null;
          submitter_name: string | null;
          submitter_email: string;
          impressions: number;
          clicks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          ad_type: 'banner' | 'popup' | 'card';
          company_name: string;
          company_website: string;
          company_logo?: string | null;
          headline?: string | null;
          cta_text?: string;
          destination_url: string;
          icon_url?: string | null;
          short_description?: string | null;
          is_active?: boolean;
          priority?: number;
          status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          user_id?: string | null;
          submitter_name?: string | null;
          submitter_email: string;
          impressions?: number;
          clicks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          ad_type?: 'banner' | 'popup' | 'card';
          company_name?: string;
          company_website?: string;
          company_logo?: string | null;
          headline?: string | null;
          cta_text?: string;
          destination_url?: string;
          icon_url?: string | null;
          short_description?: string | null;
          is_active?: boolean;
          priority?: number;
          status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          user_id?: string | null;
          submitter_name?: string | null;
          submitter_email?: string;
          impressions?: number;
          clicks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          linkedin_url?: string | null;
          youtube_url?: string | null;
          discord_username?: string | null;
          role?: 'user' | 'admin' | 'moderator';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          linkedin_url?: string | null;
          youtube_url?: string | null;
          discord_username?: string | null;
          role?: 'user' | 'admin' | 'moderator';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          alternative_id: string;
          vote_type: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          alternative_id: string;
          vote_type: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          alternative_id?: string;
          vote_type?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_alternative_id_fkey";
            columns: ["alternative_id"];
            isOneToOne: false;
            referencedRelation: "alternatives";
            referencedColumns: ["id"];
          }
        ];
      };
      tech_stacks: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          type?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      proprietary_software: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          website: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          website: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          website?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      alternative_categories: {
        Row: {
          alternative_id: string;
          category_id: string;
        };
        Insert: {
          alternative_id: string;
          category_id: string;
        };
        Update: {
          alternative_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alternative_categories_alternative_id_fkey"
            columns: ["alternative_id"]
            isOneToOne: false
            referencedRelation: "alternatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ];
      };
      alternative_tags: {
        Row: {
          alternative_id: string;
          tag_id: string;
        };
        Insert: {
          alternative_id: string;
          tag_id: string;
        };
        Update: {
          alternative_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alternative_tags_alternative_id_fkey"
            columns: ["alternative_id"]
            isOneToOne: false
            referencedRelation: "alternatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ];
      };
      alternative_tech_stacks: {
        Row: {
          alternative_id: string;
          tech_stack_id: string;
        };
        Insert: {
          alternative_id: string;
          tech_stack_id: string;
        };
        Update: {
          alternative_id?: string;
          tech_stack_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alternative_tech_stacks_alternative_id_fkey"
            columns: ["alternative_id"]
            isOneToOne: false
            referencedRelation: "alternatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_tech_stacks_tech_stack_id_fkey"
            columns: ["tech_stack_id"]
            isOneToOne: false
            referencedRelation: "tech_stacks"
            referencedColumns: ["id"]
          }
        ];
      };
      alternative_to: {
        Row: {
          alternative_id: string;
          proprietary_id: string;
        };
        Insert: {
          alternative_id: string;
          proprietary_id: string;
        };
        Update: {
          alternative_id?: string;
          proprietary_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alternative_to_alternative_id_fkey"
            columns: ["alternative_id"]
            isOneToOne: false
            referencedRelation: "alternatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_to_proprietary_id_fkey"
            columns: ["proprietary_id"]
            isOneToOne: false
            referencedRelation: "proprietary_software"
            referencedColumns: ["id"]
          }
        ];
      };
      proprietary_categories: {
        Row: {
          proprietary_id: string;
          category_id: string;
        };
        Insert: {
          proprietary_id: string;
          category_id: string;
        };
        Update: {
          proprietary_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proprietary_categories_proprietary_id_fkey"
            columns: ["proprietary_id"]
            isOneToOne: false
            referencedRelation: "proprietary_software"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proprietary_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience types for the app
export type Alternative = Database['public']['Tables']['alternatives']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type TechStack = Database['public']['Tables']['tech_stacks']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];
export type ProprietarySoftware = Database['public']['Tables']['proprietary_software']['Row'];

// Discussion types
export interface Discussion {
  id: string;
  alternative_id: string;
  user_id: string;
  content: string;
  request_creator_response: boolean;
  parent_id: string | null;
  is_creator_response: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscussionWithAuthor extends Discussion {
  author: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
  replies?: DiscussionWithAuthor[];
}

export interface CreatorNotification {
  id: string;
  creator_id: string;
  alternative_id: string;
  discussion_id: string;
  type: 'response_request' | 'new_discussion';
  message: string;
  is_read: boolean;
  created_at: string;
  alternative?: {
    name: string;
    slug: string;
  };
  discussion?: {
    content: string;
    author?: {
      name: string | null;
      avatar_url: string | null;
    };
  };
}

// Extended types with relations
export interface AlternativeWithRelations extends Alternative {
  categories: Category[];
  tags: Tag[];
  tech_stacks: TechStack[];
  alternative_to: ProprietarySoftware[];
}

export interface CategoryWithCount extends Category {
  count: number;
}

export interface TechStackWithCount extends TechStack {
  count: number;
}

export interface TagWithCount extends Tag {
  count: number;
}

export interface ProprietaryWithCount extends ProprietarySoftware {
  categories: Category[];
  alternative_count: number;
}

// Creator profile type for displaying on alternative pages
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

// Advertisement types
export type AdType = 'banner' | 'popup' | 'card';
export type AdStatus = 'pending' | 'approved' | 'rejected';

export interface Advertisement {
  id: string;
  name: string;
  description: string;
  ad_type: AdType;
  company_name: string;
  company_website: string;
  company_logo: string | null;
  headline: string | null;
  cta_text: string;
  destination_url: string;
  icon_url: string | null;
  short_description: string | null;
  is_active: boolean;
  priority: number;
  status: AdStatus;
  rejection_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
  start_date: string | null;
  end_date: string | null;
  user_id: string | null;
  submitter_name: string | null;
  submitter_email: string;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface AdvertisementInsert {
  name: string;
  description: string;
  ad_type: AdType;
  company_name: string;
  company_website: string;
  company_logo?: string | null;
  headline?: string | null;
  cta_text?: string;
  destination_url: string;
  icon_url?: string | null;
  short_description?: string | null;
  user_id?: string | null;
  submitter_name?: string | null;
  submitter_email: string;
  start_date?: string | null;
  end_date?: string | null;
}
