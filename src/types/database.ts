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
          featured: boolean;
          approved: boolean;
          rejection_reason: string | null;
          rejected_at: string | null;
          submitter_name: string | null;
          submitter_email: string | null;
          user_id: string | null;
          screenshots: string[] | null;
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
          featured?: boolean;
          approved?: boolean;
          submitter_name?: string | null;
          submitter_email?: string | null;
          user_id?: string | null;
          screenshots?: string[] | null;
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
          featured?: boolean;
          approved?: boolean;
          submitter_name?: string | null;
          submitter_email?: string | null;
          user_id?: string | null;
          screenshots?: string[] | null;
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
          role?: 'user' | 'admin' | 'moderator';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
export type ProprietarySoftware = Database['public']['Tables']['proprietary_software']['Row'];

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
