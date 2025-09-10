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
          is_user_active: boolean | null
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
          is_user_active?: boolean | null
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
          is_user_active?: boolean | null
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
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verifications: {
        Row: {
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          verified?: boolean | null
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
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          bookmark_count: number | null
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
          like_count: number | null
          pickup_location: string | null
          post_type: Database["public"]["Enums"]["post_type_enum"] | null
          servings: number | null
          share_status: Database["public"]["Enums"]["share_status_enum"] | null
          thumbnail_filename: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bookmark_count?: number | null
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
          like_count?: number | null
          pickup_location?: string | null
          post_type?: Database["public"]["Enums"]["post_type_enum"] | null
          servings?: number | null
          share_status?: Database["public"]["Enums"]["share_status_enum"] | null
          thumbnail_filename?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bookmark_count?: number | null
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
          like_count?: number | null
          pickup_location?: string | null
          post_type?: Database["public"]["Enums"]["post_type_enum"] | null
          servings?: number | null
          share_status?: Database["public"]["Enums"]["share_status_enum"] | null
          thumbnail_filename?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
      user_levels: {
        Row: {
          created_at: string | null
          current_level: number
          id: string
          total_posts_created: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_level?: number
          id?: string
          total_posts_created?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_level?: number
          id?: string
          total_posts_created?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_level: {
        Args: { total_posts: number }
        Returns: number
      }
      check_user_deleted: {
        Args: { user_id: string }
        Returns: boolean
      }
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_comments_with_user_nickname: {
        Args: { post_id_param: string }
        Returns: {
          content: string
          created_at: string
          id: string
          is_comment_active: boolean
          like_count: number
          post_id: string
          updated_at: string
          user_id: string
          user_nickname: string
        }[]
      }
      get_post_with_user_nickname: {
        Args: { post_id_param: string }
        Returns: {
          bookmark_count: number
          category_id: string
          content: string
          cooking_time: number
          created_at: string
          difficulty: string
          dislike_count: number
          id: string
          ingredients: string
          is_post_active: boolean
          is_user_active: boolean
          like_count: number
          pickup_location: string
          post_type: string
          servings: number
          share_status: string
          thumbnail_filename: string
          title: string
          updated_at: string
          user_id: string
          user_nickname: string
        }[]
      }
      get_user_level: {
        Args: { target_user_id: string }
        Returns: {
          current_level: number
          total_posts_created: number
          user_id: string
        }[]
      }
      soft_delete_user: {
        Args: { user_id: string }
        Returns: undefined
      }
      update_user_level_on_create: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      update_user_password: {
        Args: { new_password: string; user_email: string }
        Returns: undefined
      }
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
