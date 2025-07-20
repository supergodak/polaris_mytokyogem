import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export interface Database {
  public: {
    Tables: {
      spots: {
        Row: {
          id: string;
          title_ja: string;
          title_en: string;
          short_description_ja: string;
          short_description_en: string;
          description_ja: string;
          description_en: string;
          images: string[];
          location_lat: number;
          location_lng: number;
          location_hide_exact: boolean;
          location_address_ja: string;
          location_address_en: string;
          primary_category: string;
          genre: string[];
          travel_style: string[];
          solo_friendly: boolean;
          business_hours_ja: string;
          business_hours_en: string;
          access_ja: string;
          access_en: string;
          tips_ja: string;
          tips_en: string;
          is_hidden: boolean;
          reactions_interested: number;
          reactions_visited: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_ja: string;
          title_en?: string;
          short_description_ja: string;
          short_description_en?: string;
          description_ja: string;
          description_en?: string;
          images?: string[];
          location_lat: number;
          location_lng: number;
          location_hide_exact?: boolean;
          location_address_ja: string;
          location_address_en?: string;
          primary_category: string;
          genre?: string[];
          travel_style?: string[];
          solo_friendly?: boolean;
          business_hours_ja?: string;
          business_hours_en?: string;
          access_ja?: string;
          access_en?: string;
          tips_ja?: string;
          tips_en?: string;
          is_hidden?: boolean;
          reactions_interested?: number;
          reactions_visited?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_ja?: string;
          title_en?: string;
          short_description_ja?: string;
          short_description_en?: string;
          description_ja?: string;
          description_en?: string;
          images?: string[];
          location_lat?: number;
          location_lng?: number;
          location_hide_exact?: boolean;
          location_address_ja?: string;
          location_address_en?: string;
          primary_category?: string;
          genre?: string[];
          travel_style?: string[];
          solo_friendly?: boolean;
          business_hours_ja?: string;
          business_hours_en?: string;
          access_ja?: string;
          access_en?: string;
          tips_ja?: string;
          tips_en?: string;
          is_hidden?: boolean;
          reactions_interested?: number;
          reactions_visited?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}