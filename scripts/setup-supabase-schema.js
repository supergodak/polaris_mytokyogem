const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQLスキーマ
const schema = `
-- MyTokyoGem spots table creation (v2 - existing ID compatible)
DROP TABLE IF EXISTS spots;

CREATE TABLE spots (
    -- 既存IDと互換性を保つためTEXT型を使用
    id TEXT PRIMARY KEY,
    
    -- Basic Information (多言語対応)
    title_ja TEXT NOT NULL,
    title_en TEXT,
    short_description_ja TEXT NOT NULL,
    short_description_en TEXT,
    description_ja TEXT NOT NULL,
    description_en TEXT,
    
    -- Images
    images TEXT[] DEFAULT '{}',
    
    -- Location
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    location_hide_exact BOOLEAN DEFAULT FALSE,
    location_address_ja TEXT NOT NULL,
    location_address_en TEXT,
    
    -- Categories and Tags
    primary_category TEXT NOT NULL,
    genre TEXT[] DEFAULT '{}',
    travel_style TEXT[] DEFAULT '{}',
    solo_friendly BOOLEAN DEFAULT TRUE,
    
    -- Additional Information
    business_hours_ja TEXT DEFAULT '',
    business_hours_en TEXT DEFAULT '',
    access_ja TEXT DEFAULT '',
    access_en TEXT DEFAULT '',
    tips_ja TEXT DEFAULT '',
    tips_en TEXT DEFAULT '',
    
    -- Status
    is_hidden BOOLEAN DEFAULT FALSE,
    
    -- Reactions
    reactions_interested INTEGER DEFAULT 0,
    reactions_visited INTEGER DEFAULT 0,
    
    -- Metadata
    created_by TEXT DEFAULT 'ひとりあそび研究所',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_spots_is_hidden ON spots (is_hidden);
CREATE INDEX idx_spots_primary_category ON spots (primary_category);
CREATE INDEX idx_spots_solo_friendly ON spots (solo_friendly);
CREATE INDEX idx_spots_created_at ON spots (created_at);
`;

async function setupSchema() {
  console.log('🔧 Supabaseスキーマを設定しています...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ スキーマ作成エラー:', error);
      
      // 別の方法を試す
      console.log('📋 手動実行用のSQLを表示します:');
      console.log('以下のSQLをSupabaseダッシュボードで実行してください:');
      console.log('=' * 50);
      console.log(schema);
      console.log('=' * 50);
      return false;
    }
    
    console.log('✅ スキーマが正常に作成されました!');
    return true;
    
  } catch (error) {
    console.error('❌ 予期しないエラー:', error);
    console.log('📋 手動実行用のSQLを表示します:');
    console.log(schema);
    return false;
  }
}

setupSchema();