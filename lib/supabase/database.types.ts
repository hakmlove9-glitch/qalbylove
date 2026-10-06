export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };

  public: {
    Tables: {
      admin_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          details: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          details?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          details?: Json | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      blocks: {
        Row: {
          id: string;
          blocker_id: string;
          blocked_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          blocker_id: string;
          blocked_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          blocker_id?: string;
          blocked_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      favorites: {
        Row: {
          id: string;
          user_id: string;
          favorite_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          favorite_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          favorite_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      hidden_profiles: {
        Row: {
          id: string;
          member_id: string;
          hidden_member_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          hidden_member_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          hidden_member_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      interests: {
        Row: {
          id: string;
          sender_id: string | null;
          receiver_id: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          receiver_id?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          receiver_id?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      likes: {
        Row: {
          id: string;
          user_id: string;
          liked_user_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          liked_user_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          liked_user_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      matches: {
        Row: {
          id: string;
          member_one: string;
          member_two: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          member_one: string;
          member_two: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          member_one?: string;
          member_two?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      member_details: {
        Row: {
          id: string;
          member_id: string | null;
          age: number | null;
          city: string | null;
          marital_status: string | null;
          bio: string | null;
          interests: string[] | null;
        };
        Insert: {
          id?: string;
          member_id?: string | null;
          age?: number | null;
          city?: string | null;
          marital_status?: string | null;
          bio?: string | null;
          interests?: string[] | null;
        };
        Update: {
          id?: string;
          member_id?: string | null;
          age?: number | null;
          city?: string | null;
          marital_status?: string | null;
          bio?: string | null;
          interests?: string[] | null;
        };
        Relationships: [];
      };

      member_requests: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          status: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          status?: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          status?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      member_settings: {
        Row: {
          id: string;
          member_id: string | null;
          show_profile: boolean | null;
          allow_messages: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          member_id?: string | null;
          show_profile?: boolean | null;
          allow_messages?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string | null;
          show_profile?: boolean | null;
          allow_messages?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      members: {
        Row: {
          id: string;
          username: string | null;
          email: string | null;
          password_hash: string | null;
          member_number: number | null;
          account_status: string | null;
          is_admin: boolean | null;
          is_founder: boolean | null;
          created_at: string | null;
          last_seen: string | null;
        };
        Insert: {
          id?: string;
          username?: string | null;
          email?: string | null;
          password_hash?: string | null;
          member_number?: number | null;
          account_status?: string | null;
          is_admin?: boolean | null;
          is_founder?: boolean | null;
          created_at?: string | null;
          last_seen?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          email?: string | null;
          password_hash?: string | null;
          member_number?: number | null;
          account_status?: string | null;
          is_admin?: boolean | null;
          is_founder?: boolean | null;
          created_at?: string | null;
          last_seen?: string | null;
        };
        Relationships: [];
      };

      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string | null;
          is_read: boolean | null;
          type: string | null;
          voice_url: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string | null;
          is_read?: boolean | null;
          type?: string | null;
          voice_url?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          created_at?: string | null;
          is_read?: boolean | null;
          type?: string | null;
          voice_url?: string | null;
        };
        Relationships: [];
      };

      notifications: {
        Row: {
          id: string;
          member_id: string | null;
          message: string | null;
          read: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          member_id?: string | null;
          message?: string | null;
          read?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string | null;
          message?: string | null;
          read?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      payments: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string;
          plan_id: string;
          plan_name: string;
          amount: number;
          duration_months: number;
          status: string;
          receipt_url: string | null;
          transaction_id: string | null;
          reviewed_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id: string;
          plan_id: string;
          plan_name: string;
          amount: number;
          duration_months: number;
          status: string;
          receipt_url?: string | null;
          transaction_id?: string | null;
          reviewed_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string;
          plan_id?: string;
          plan_name?: string;
          amount?: number;
          duration_months?: number;
          status?: string;
          receipt_url?: string | null;
          transaction_id?: string | null;
          reviewed_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      photos: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          is_primary: boolean | null;
          status: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          is_primary?: boolean | null;
          status?: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          is_primary?: boolean | null;
          status?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      profile_views: {
        Row: {
          id: string;
          member_id: string;
          viewer_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          viewer_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          viewer_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string | null;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          gender: string | null;
          birth_date: string | null;
          marital_status: string | null;
          governorate: string | null;
          about: string | null;
          education: string | null;
          job: string | null;
          height: string | null;
          weight: string | null;
          religious_level: string | null;
          avatar_url: string | null;
          is_active: boolean | null;
          is_approved: boolean | null;
          is_banned: boolean | null;
          is_hidden: boolean | null;
          is_premium: boolean | null;
          is_vip: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          username?: string | null;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          gender?: string | null;
          birth_date?: string | null;
          marital_status?: string | null;
          governorate?: string | null;
          about?: string | null;
          education?: string | null;
          job?: string | null;
          height?: string | null;
          weight?: string | null;
          religious_level?: string | null;
          avatar_url?: string | null;
          is_active?: boolean | null;
          is_approved?: boolean | null;
          is_banned?: boolean | null;
          is_hidden?: boolean | null;
          is_premium?: boolean | null;
          is_vip?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string | null;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          gender?: string | null;
          birth_date?: string | null;
          marital_status?: string | null;
          governorate?: string | null;
          about?: string | null;
          education?: string | null;
          job?: string | null;
          height?: string | null;
          weight?: string | null;
          religious_level?: string | null;
          avatar_url?: string | null;
          is_active?: boolean | null;
          is_approved?: boolean | null;
          is_banned?: boolean | null;
          is_hidden?: boolean | null;
          is_premium?: boolean | null;
          is_vip?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          description: string | null;
          status: string;
          resolved_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          description?: string | null;
          status?: string;
          resolved_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          reported_id?: string;
          reason?: string;
          description?: string | null;
          status?: string;
          resolved_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      subscription_codes: {
        Row: {
          id: string;
          code: string;
          plan_months: number;
          plan_price: number;
          is_used: boolean | null;
          used_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          plan_months: number;
          plan_price: number;
          is_used?: boolean | null;
          used_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          plan_months?: number;
          plan_price?: number;
          is_used?: boolean | null;
          used_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          price: number;
          duration_months: number;
          status: string;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          price: number;
          duration_months: number;
          status: string;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          plan_name?: string;
          price?: number;
          duration_months?: number;
          status?: string;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      user_subscriptions: {
        Row: {
          user_id: string;
          plan_months: number;
          start_date: string | null;
          end_date: string;
          is_premium: boolean | null;
        };
        Insert: {
          user_id: string;
          plan_months: number;
          start_date?: string | null;
          end_date: string;
          is_premium?: boolean | null;
        };
        Update: {
          user_id?: string;
          plan_months?: number;
          start_date?: string | null;
          end_date?: string;
          is_premium?: boolean | null;
        };
        Relationships: [];
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
};

type DatabaseWithoutInternals =
  Omit<Database, "__InternalSupabase">;

type DefaultSchema =
  DatabaseWithoutInternals[
    Extract<keyof Database, "public">
  ];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | {
        schema: keyof DatabaseWithoutInternals;
      },
  TableName extends (
    DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[
          DefaultSchemaTableNameOrOptions["schema"]
        ]["Tables"]
      : never
  ) = never,
> =
  DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? DatabaseWithoutInternals[
        DefaultSchemaTableNameOrOptions["schema"]
      ]["Tables"][TableName] extends {
        Row: infer R;
      }
      ? R
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][
          DefaultSchemaTableNameOrOptions
        ] extends {
          Row: infer R;
        }
        ? R
        : never
      : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | {
        schema: keyof DatabaseWithoutInternals;
      },
  TableName extends (
    DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[
          DefaultSchemaTableNameOrOptions["schema"]
        ]["Tables"]
      : never
  ) = never,
> =
  DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? DatabaseWithoutInternals[
        DefaultSchemaTableNameOrOptions["schema"]
      ]["Tables"][TableName] extends {
        Insert: infer I;
      }
      ? I
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][
          DefaultSchemaTableNameOrOptions
        ] extends {
          Insert: infer I;
        }
        ? I
        : never
      : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | {
        schema: keyof DatabaseWithoutInternals;
      },
  TableName extends (
    DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[
          DefaultSchemaTableNameOrOptions["schema"]
        ]["Tables"]
      : never
  ) = never,
> =
  DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? DatabaseWithoutInternals[
        DefaultSchemaTableNameOrOptions["schema"]
      ]["Tables"][TableName] extends {
        Update: infer U;
      }
      ? U
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][
          DefaultSchemaTableNameOrOptions
        ] extends {
          Update: infer U;
        }
        ? U
        : never
      : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | {
        schema: keyof DatabaseWithoutInternals;
      },
  EnumName extends (
    DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[
          DefaultSchemaEnumNameOrOptions["schema"]
        ]["Enums"]
      : never
  ) = never,
> =
  DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? DatabaseWithoutInternals[
        DefaultSchemaEnumNameOrOptions["schema"]
      ]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][
          DefaultSchemaEnumNameOrOptions
        ]
      : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | {
        schema: keyof DatabaseWithoutInternals;
      },
  CompositeTypeName extends (
    PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[
          PublicCompositeTypeNameOrOptions["schema"]
        ]["CompositeTypes"]
      : never
  ) = never,
> =
  PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? DatabaseWithoutInternals[
        PublicCompositeTypeNameOrOptions["schema"]
      ]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][
          PublicCompositeTypeNameOrOptions
        ]
      : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;