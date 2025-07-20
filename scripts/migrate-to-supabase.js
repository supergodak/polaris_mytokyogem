const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 既存JSONデータを読み込み
const spotsFilePath = path.join(__dirname, '../data/spots.json');
const spotsData = JSON.parse(fs.readFileSync(spotsFilePath, 'utf-8'));

// JSON形式からSupabase形式に変換
function convertSpotToSupabase(spot) {
  return {
    id: spot.id, // 既存IDを保持
    title_ja: spot.title.ja,
    title_en: spot.title.en || '',
    short_description_ja: spot.shortDescription.ja,
    short_description_en: spot.shortDescription.en || '',
    description_ja: spot.description.ja,
    description_en: spot.description.en || '',
    images: spot.images || [],
    location_lat: spot.location.lat,
    location_lng: spot.location.lng,
    location_hide_exact: spot.location.hideExactLocation || false,
    location_address_ja: spot.location.address.ja,
    location_address_en: spot.location.address.en || '',
    primary_category: spot.primaryCategory,
    genre: spot.genre || [],
    travel_style: spot.travelStyle || [],
    solo_friendly: spot.soloFriendly !== false, // デフォルトtrue
    business_hours_ja: spot.businessHours?.ja || '',
    business_hours_en: spot.businessHours?.en || '',
    access_ja: spot.access?.ja || '',
    access_en: spot.access?.en || '',
    tips_ja: spot.tips?.ja || '',
    tips_en: spot.tips?.en || '',
    is_hidden: spot.isHidden || false,
    reactions_interested: spot.reactions?.interested || 0,
    reactions_visited: spot.reactions?.visited || 0,
    created_by: spot.createdBy || 'ひとりあそび研究所',
    created_at: spot.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// メイン移行処理
async function migrateData() {
  console.log('🚀 Supabaseへのデータ移行を開始します...');
  
  try {
    // 既存データを変換
    const convertedSpots = spotsData.spots.map(convertSpotToSupabase);
    
    console.log(`📊 ${convertedSpots.length}件のスポットを移行します`);
    
    // Supabaseに挿入（upsert: 存在する場合は更新）
    const { data, error } = await supabase
      .from('spots')
      .upsert(convertedSpots, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select();
    
    if (error) {
      console.error('❌ 移行エラー:', error);
      return;
    }
    
    console.log('✅ データ移行が完了しました!');
    console.log(`📝 挿入/更新されたレコード数: ${data.length}`);
    
    // 移行結果の確認
    const { data: allSpots, error: fetchError } = await supabase
      .from('spots')
      .select('id, title_ja, is_hidden')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ データ確認エラー:', fetchError);
      return;
    }
    
    console.log('\n📋 移行されたスポット一覧:');
    allSpots.forEach((spot, index) => {
      const status = spot.is_hidden ? '🔒(非表示)' : '✅(表示)';
      console.log(`${index + 1}. ${spot.title_ja} ${status}`);
    });
    
  } catch (error) {
    console.error('❌ 予期しないエラー:', error);
  }
}

// 実行
migrateData();