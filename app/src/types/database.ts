// Handschriftlich gepflegte Entsprechung der Supabase-CLI-generierten Typen (`supabase gen types
// typescript`), exakt nach den Migrationen unter `supabase/migrations/`. Wird von `createClient<Database>`
// in `src/lib/supabase.ts` verwendet — einzige Quelle der Wahrheit für die Tabellenstruktur im
// TypeScript-Code. Bei jeder Schemaänderung (neue Migration) ist diese Datei entsprechend nachzuführen.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          role: Database['public']['Enums']['user_role'];
          trust_score: number;
          trust_level: Database['public']['Enums']['trust_level'];
          reports_count: number;
          confirmed_reports: number;
          rejected_reports: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: Database['public']['Enums']['user_role'];
          trust_score?: number;
          trust_level?: Database['public']['Enums']['trust_level'];
          reports_count?: number;
          confirmed_reports?: number;
          rejected_reports?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: Database['public']['Enums']['user_role'];
          trust_score?: number;
          trust_level?: Database['public']['Enums']['trust_level'];
          reports_count?: number;
          confirmed_reports?: number;
          rejected_reports?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: Database['public']['Enums']['location_category'];
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          opening_hours: Json | null;
          images: string[];
          is_sponsored: boolean;
          sponsored_until: string | null;
          owner_user_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: Database['public']['Enums']['location_category'];
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          opening_hours?: Json | null;
          images?: string[];
          is_sponsored?: boolean;
          sponsored_until?: string | null;
          owner_user_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: Database['public']['Enums']['location_category'];
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          opening_hours?: Json | null;
          images?: string[];
          is_sponsored?: boolean;
          sponsored_until?: string | null;
          owner_user_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      artists: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          image_url: string | null;
          genres: string[];
          instagram_url: string | null;
          spotify_url: string | null;
          youtube_url: string | null;
          tiktok_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          bio?: string | null;
          image_url?: string | null;
          genres?: string[];
          instagram_url?: string | null;
          spotify_url?: string | null;
          youtube_url?: string | null;
          tiktok_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          image_url?: string | null;
          genres?: string[];
          instagram_url?: string | null;
          spotify_url?: string | null;
          youtube_url?: string | null;
          tiktok_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          location_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string | null;
          image_url: string | null;
          is_sponsored: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          location_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          image_url?: string | null;
          is_sponsored?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          location_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          image_url?: string | null;
          is_sponsored?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      event_artists: {
        Row: {
          event_id: string;
          artist_id: string;
        };
        Insert: {
          event_id: string;
          artist_id: string;
        };
        Update: {
          event_id?: string;
          artist_id?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          target_type: Database['public']['Enums']['favorite_target_type'];
          target_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: Database['public']['Enums']['favorite_target_type'];
          target_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: Database['public']['Enums']['favorite_target_type'];
          target_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          occupancy_level: Database['public']['Enums']['occupancy_level'];
          wait_time_minutes: number | null;
          mood: string | null;
          music_genre: string | null;
          comment: string | null;
          latitude: number;
          longitude: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_id: string;
          occupancy_level: Database['public']['Enums']['occupancy_level'];
          wait_time_minutes?: number | null;
          mood?: string | null;
          music_genre?: string | null;
          comment?: string | null;
          latitude: number;
          longitude: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_id?: string;
          occupancy_level?: Database['public']['Enums']['occupancy_level'];
          wait_time_minutes?: number | null;
          mood?: string | null;
          music_genre?: string | null;
          comment?: string | null;
          latitude?: number;
          longitude?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      report_flags: {
        Row: {
          id: string;
          report_id: string;
          flagged_by_user_id: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          flagged_by_user_id: string;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          flagged_by_user_id?: string;
          reason?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      specials: {
        Row: {
          id: string;
          location_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          category: string | null;
          start_date: string;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          is_recurring: boolean;
          is_sponsored: boolean;
          priority: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          category?: string | null;
          start_date: string;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          is_recurring?: boolean;
          is_sponsored?: boolean;
          priority?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          category?: string | null;
          start_date?: string;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          is_recurring?: boolean;
          is_sponsored?: boolean;
          priority?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      happy_hours: {
        Row: {
          id: string;
          location_id: string;
          title: string;
          description: string | null;
          weekday: Database['public']['Enums']['weekday'];
          start_time: string;
          end_time: string;
          offer_text: string | null;
          is_sponsored: boolean;
          priority: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          title: string;
          description?: string | null;
          weekday: Database['public']['Enums']['weekday'];
          start_time: string;
          end_time: string;
          offer_text?: string | null;
          is_sponsored?: boolean;
          priority?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          title?: string;
          description?: string | null;
          weekday?: Database['public']['Enums']['weekday'];
          start_time?: string;
          end_time?: string;
          offer_text?: string | null;
          is_sponsored?: boolean;
          priority?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          target_type: Database['public']['Enums']['review_target_type'];
          target_id: string;
          rating: number;
          comment_text: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: Database['public']['Enums']['review_target_type'];
          target_id: string;
          rating: number;
          comment_text?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: Database['public']['Enums']['review_target_type'];
          target_id?: string;
          rating?: number;
          comment_text?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      review_flags: {
        Row: {
          id: string;
          review_id: string;
          flagged_by_user_id: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          flagged_by_user_id: string;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          flagged_by_user_id?: string;
          reason?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          related_type: Database['public']['Enums']['favorite_target_type'] | null;
          related_id: string | null;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          related_type?: Database['public']['Enums']['favorite_target_type'] | null;
          related_id?: string | null;
          title: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          related_type?: Database['public']['Enums']['favorite_target_type'] | null;
          related_id?: string | null;
          title?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      location_live_status: {
        Row: {
          location_id: string | null;
          report_count: number | null;
          is_confident: boolean | null;
          wait_time_minutes: number | null;
          last_reported_at: string | null;
          occupancy_level: Database['public']['Enums']['occupancy_level'] | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: 'user' | 'location_manager' | 'admin' | 'super_admin';
      trust_level: 'new_member' | 'trusted' | 'experienced' | 'top_member';
      location_category: 'club' | 'bar';
      favorite_target_type: 'location' | 'artist' | 'event';
      occupancy_level: 'low' | 'medium' | 'high';
      review_target_type: 'location' | 'artist';
      weekday: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    };
    CompositeTypes: Record<string, never>;
  };
};
