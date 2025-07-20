import { createClient } from '@supabase/supabase-js';

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベース型定義
export interface Database {
  public: {
    Tables: {
      spots: {
        Row: {
          id: string;
          title_ja: string;
          title_en: string | null;
          short_description_ja: string;
          short_description_en: string | null;
          description_ja: string;
          description_en: string | null;
          images: string[] | null;
          location_lat: number;
          location_lng: number;
          location_hide_exact: boolean | null;
          location_address_ja: string;
          location_address_en: string | null;
          primary_category: string;
          genre: string[] | null;
          travel_style: string[] | null;
          solo_friendly: boolean | null;
          business_hours_ja: string | null;
          business_hours_en: string | null;
          access_ja: string | null;
          access_en: string | null;
          tips_ja: string | null;
          tips_en: string | null;
          is_hidden: boolean | null;
          reactions_interested: number | null;
          reactions_visited: number | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          title_ja: string;
          title_en?: string | null;
          short_description_ja: string;
          short_description_en?: string | null;
          description_ja: string;
          description_en?: string | null;
          images?: string[] | null;
          location_lat: number;
          location_lng: number;
          location_hide_exact?: boolean | null;
          location_address_ja: string;
          location_address_en?: string | null;
          primary_category: string;
          genre?: string[] | null;
          travel_style?: string[] | null;
          solo_friendly?: boolean | null;
          business_hours_ja?: string | null;
          business_hours_en?: string | null;
          access_ja?: string | null;
          access_en?: string | null;
          tips_ja?: string | null;
          tips_en?: string | null;
          is_hidden?: boolean | null;
          reactions_interested?: number | null;
          reactions_visited?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title_ja?: string;
          title_en?: string | null;
          short_description_ja?: string;
          short_description_en?: string | null;
          description_ja?: string;
          description_en?: string | null;
          images?: string[] | null;
          location_lat?: number;
          location_lng?: number;
          location_hide_exact?: boolean | null;
          location_address_ja?: string;
          location_address_en?: string | null;
          primary_category?: string;
          genre?: string[] | null;
          travel_style?: string[] | null;
          solo_friendly?: boolean | null;
          business_hours_ja?: string | null;
          business_hours_en?: string | null;
          access_ja?: string | null;
          access_en?: string | null;
          tips_ja?: string | null;
          tips_en?: string | null;
          is_hidden?: boolean | null;
          reactions_interested?: number | null;
          reactions_visited?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
    };
  };
}