export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_comment_likes_comment"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_comment_active: boolean | null
          like_count: number | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_comment_active?: boolean | null
          like_count?: number | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_comment_active?: boolean | null
          like_count?: number | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_comments_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "popular_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_comments_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_size: number | null
          id: string
          image_url: string
          mime_type: string | null
          original_filename: string | null
          post_id: string | null
          post_type: Database["public"]["Enums"]["image_type_enum"] | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_url: string
          mime_type?: string | null
          original_filename?: string | null
          post_id?: string | null
          post_type?: Database["public"]["Enums"]["image_type_enum"] | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_url?: string
          mime_type?: string | null
          original_filename?: string | null
          post_id?: string | null
          post_type?: Database["public"]["Enums"]["image_type_enum"] | null
        }
        Relationships: []
      }
      post_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bookmarks_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "popular_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookmarks_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_votes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
          vote_type: Database["public"]["Enums"]["vote_type_enum"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
          vote_type: Database["public"]["Enums"]["vote_type_enum"]
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
          vote_type?: Database["public"]["Enums"]["vote_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_votes_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "popular_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_votes_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category_id: string
          content: string | null
          cooking_time: number | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_enum"] | null
          dislike_count: number | null
          id: string
          ingredients: string | null
          is_post_active: boolean | null
          is_user_active: boolean | null
          item_condition:
            | Database["public"]["Enums"]["item_condition_enum"]
            | null
          like_count: number | null
          pickup_location: string | null
          post_type: Database["public"]["Enums"]["post_type_enum"] | null
          servings: number | null
          share_status: Database["public"]["Enums"]["share_status_enum"] | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category_id: string
          content?: string | null
          cooking_time?: number | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_enum"] | null
          dislike_count?: number | null
          id?: string
          ingredients?: string | null
          is_post_active?: boolean | null
          is_user_active?: boolean | null
          item_condition?:
            | Database["public"]["Enums"]["item_condition_enum"]
            | null
          like_count?: number | null
          pickup_location?: string | null
          post_type?: Database["public"]["Enums"]["post_type_enum"] | null
          servings?: number | null
          share_status?: Database["public"]["Enums"]["share_status_enum"] | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category_id?: string
          content?: string | null
          cooking_time?: number | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_enum"] | null
          dislike_count?: number | null
          id?: string
          ingredients?: string | null
          is_post_active?: boolean | null
          is_user_active?: boolean | null
          item_condition?:
            | Database["public"]["Enums"]["item_condition_enum"]
            | null
          like_count?: number | null
          pickup_location?: string | null
          post_type?: Database["public"]["Enums"]["post_type_enum"] | null
          servings?: number | null
          share_status?: Database["public"]["Enums"]["share_status_enum"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      popular_posts: {
        Row: {
          category_id: string | null
          category_name: string | null
          content: string | null
          cooking_time: number | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_enum"] | null
          dislike_count: number | null
          id: string | null
          ingredients: string | null
          is_post_active: boolean | null
          is_user_active: boolean | null
          item_condition:
            | Database["public"]["Enums"]["item_condition_enum"]
            | null
          like_count: number | null
          pickup_location: string | null
          post_type: Database["public"]["Enums"]["post_type_enum"] | null
          score: number | null
          servings: number | null
          share_status: Database["public"]["Enums"]["share_status_enum"] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_enum: "top" | "middle" | "bottom"
      image_type_enum: "share" | "recipe" | "profile" | "etc"
      item_condition_enum: "new" | "like_new" | "good" | "fair" | "poor"
      post_type_enum: "recipe" | "share"
      role_enum: "ADMIN" | "MANAGER" | "USER"
      share_status_enum: "available" | "reserved" | "completed" | "cancelled"
      vote_type_enum: "like" | "dislike"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_enum: ["top", "middle", "bottom"],
      image_type_enum: ["share", "recipe", "profile", "etc"],
      item_condition_enum: ["new", "like_new", "good", "fair", "poor"],
      post_type_enum: ["recipe", "share"],
      role_enum: ["ADMIN", "MANAGER", "USER"],
      share_status_enum: ["available", "reserved", "completed", "cancelled"],
      vote_type_enum: ["like", "dislike"],
    },
  },
} as const
