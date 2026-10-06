export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      members: { Row: { id: string; user_id: string | null; name: string | null; full_name: string | null; email: string | null; gender: string | null; age: number | null; city: string | null; governorate: string | null; religion: string | null; education: string | null; occupation: string | null; marital_status: string | null; interests: string[] | null; image: string | null; bio: string | null; last_seen: string | null; created_at: string | null; username: string | null; account_status: string | null; avatar_url: string | null; status: string | null; verified: boolean | null; }; Insert: any; Update: any; };
      messages: { Row: { id: string; sender_id: string; receiver_id: string; content: string; is_read: boolean; read: boolean; created_at: string; }; Insert: any; Update: any; };
      likes: { Row: { id: string; user_id: string; member_id: string; created_at: string; }; Insert: any; Update: any; };
      favorites: { Row: { id: string; user_id: string; member_id: string; created_at: string; }; Insert: any; Update: any; };
      notifications: { Row: { id: string; user_id: string; title: string | null; message: string | null; read: boolean; created_at: string; type: string | null; member_id: string | null; }; Insert: any; Update: any; };
      profile_views: { Row: { id: string; member_id: string; viewer_id: string; created_at: string; }; Insert: any; Update: any; };
      member_details: { Row: { id: string; member_id: string; about: string | null; height: string | null; weight: string | null; created_at: string | null; }; Insert: any; Update: any; };
      member_preferences: { Row: { id: string; member_id: string; data: Json; created_at: string; }; Insert: any; Update: any; };
      member_activity: { Row: { id: string; member_id: string; type: string; text: string; created_at: string; }; Insert: any; Update: any; };
      photos: { Row: { id: string; member_id: string; url: string; created_at: string; }; Insert: any; Update: any; };
      member_photos: { Row: { id: string; member_id: string; url: string; is_primary: boolean | null; created_at: string; user_id: string | null; }; Insert: any; Update: any; };
      interests: { Row: { id: string; name: string; }; Insert: any; Update: any; };
      member_interests: { Row: { id: string; member_id: string; interest_id: string; }; Insert: any; Update: any; };
      member_requests: { Row: { id: string; sender_id: string; receiver_id: string; status: string; created_at: string; }; Insert: any; Update: any; };
      contact_requests: { Row: { id: string; sender_id: string; receiver_id: string; status: string; created_at: string; }; Insert: any; Update: any; };
      blocked_members: { Row: { id: string; blocker_id: string; blocked_id: string; created_at: string; }; Insert: any; Update: any; };
      blocks: { Row: { id: string; blocker_id: string; blocked_id: string; created_at: string; }; Insert: any; Update: any; };
      hidden_profiles: { Row: { id: string; user_id: string; member_id: string; created_at: string; }; Insert: any; Update: any; };
      subscriptions: { Row: { id: string; user_id: string; plan: string; status: string; amount: number; created_at: string; duration_months: number; }; Insert: any; Update: any; };
      payments: { Row: { id: string; user_id: string; amount: number; status: string; created_at: string; }; Insert: any; Update: any; };
      verification_requests: { Row: { id: string; member_id: string; status: string; created_at: string; }; Insert: any; Update: any; };
      reports: { Row: { id: string; reporter_id: string; reported_id: string; reason: string; created_at: string; }; Insert: any; Update: any; };
      voices: { Row: { id: string; user_id: string; url: string; created_at: string; }; Insert: any; Update: any; };
      admin_logs: { Row: { id: string; admin_id: string; action: string; details: Json | null; created_at: string | null; }; Insert: any; Update: any; };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: {};
  };
};
