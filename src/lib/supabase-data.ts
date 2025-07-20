import { supabase, Database } from './supabase';
import { Spot } from '@/types/spot';

type SpotRow = Database['public']['Tables']['spots']['Row'];
type SpotInsert = Database['public']['Tables']['spots']['Insert'];

// Supabaseの行をSpot型に変換
function convertSupabaseRowToSpot(row: SpotRow): Spot {
  return {
    id: row.id,
    title: {
      ja: row.title_ja,
      en: row.title_en || ''
    },
    shortDescription: {
      ja: row.short_description_ja,
      en: row.short_description_en || ''
    },
    description: {
      ja: row.description_ja,
      en: row.description_en || ''
    },
    images: row.images || [],
    location: {
      lat: row.location_lat,
      lng: row.location_lng,
      hideExactLocation: row.location_hide_exact || false,
      address: {
        ja: row.location_address_ja,
        en: row.location_address_en || ''
      }
    },
    primaryCategory: row.primary_category,
    genre: row.genre || [],
    travelStyle: row.travel_style || [],
    soloFriendly: row.solo_friendly !== false,
    businessHours: {
      ja: row.business_hours_ja || '',
      en: row.business_hours_en || ''
    },
    access: {
      ja: row.access_ja || '',
      en: row.access_en || ''
    },
    tips: {
      ja: row.tips_ja || '',
      en: row.tips_en || ''
    },
    isHidden: row.is_hidden || false,
    reactions: {
      interested: row.reactions_interested || 0,
      visited: row.reactions_visited || 0
    },
    createdBy: row.created_by || 'ひとりあそび研究所',
    createdAt: row.created_at
  };
}

// Spot型をSupabaseの挿入形式に変換
function convertSpotToSupabaseInsert(spot: Omit<Spot, 'id' | 'createdAt'>): SpotInsert {
  return {
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
    solo_friendly: spot.soloFriendly !== false,
    business_hours_ja: spot.businessHours?.ja || '',
    business_hours_en: spot.businessHours?.en || '',
    access_ja: spot.access?.ja || '',
    access_en: spot.access?.en || '',
    tips_ja: spot.tips?.ja || '',
    tips_en: spot.tips?.en || '',
    is_hidden: spot.isHidden || false,
    reactions_interested: spot.reactions?.interested || 0,
    reactions_visited: spot.reactions?.visited || 0,
    created_by: spot.createdBy || 'ひとりあそび研究所'
  };
}

// 公開スポット一覧取得（非表示スポットを除外）
export async function getAllSpots(): Promise<Spot[]> {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching spots:', error);
    return [];
  }

  return data.map(convertSupabaseRowToSpot);
}

// 管理者用スポット一覧取得（非表示スポット含む）
export async function getAllSpotsForAdmin(): Promise<Spot[]> {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin spots:', error);
    return [];
  }

  return data.map(convertSupabaseRowToSpot);
}

// 個別スポット取得
export async function getSpotById(id: string): Promise<Spot | null> {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching spot:', error);
    return null;
  }

  return convertSupabaseRowToSpot(data);
}

// スポット作成
export async function createSpot(spotData: Omit<Spot, 'id' | 'createdAt'>): Promise<Spot | null> {
  const insertData = convertSpotToSupabaseInsert(spotData);
  
  const { data, error } = await supabase
    .from('spots')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Error creating spot:', error);
    return null;
  }

  return convertSupabaseRowToSpot(data);
}

// スポット更新
export async function updateSpot(id: string, spotData: Partial<Spot>): Promise<Spot | null> {
  const updateData: Partial<SpotInsert> = {};
  
  if (spotData.title) {
    updateData.title_ja = spotData.title.ja;
    updateData.title_en = spotData.title.en;
  }
  if (spotData.shortDescription) {
    updateData.short_description_ja = spotData.shortDescription.ja;
    updateData.short_description_en = spotData.shortDescription.en;
  }
  if (spotData.description) {
    updateData.description_ja = spotData.description.ja;
    updateData.description_en = spotData.description.en;
  }
  if (spotData.images !== undefined) {
    updateData.images = spotData.images;
  }
  if (spotData.location) {
    updateData.location_lat = spotData.location.lat;
    updateData.location_lng = spotData.location.lng;
    updateData.location_hide_exact = spotData.location.hideExactLocation;
    if (spotData.location.address) {
      updateData.location_address_ja = spotData.location.address.ja;
      updateData.location_address_en = spotData.location.address.en;
    }
  }
  if (spotData.primaryCategory) {
    updateData.primary_category = spotData.primaryCategory;
  }
  if (spotData.genre !== undefined) {
    updateData.genre = spotData.genre;
  }
  if (spotData.travelStyle !== undefined) {
    updateData.travel_style = spotData.travelStyle;
  }
  if (spotData.soloFriendly !== undefined) {
    updateData.solo_friendly = spotData.soloFriendly;
  }
  if (spotData.businessHours) {
    updateData.business_hours_ja = spotData.businessHours.ja;
    updateData.business_hours_en = spotData.businessHours.en;
  }
  if (spotData.access) {
    updateData.access_ja = spotData.access.ja;
    updateData.access_en = spotData.access.en;
  }
  if (spotData.tips) {
    updateData.tips_ja = spotData.tips.ja;
    updateData.tips_en = spotData.tips.en;
  }
  if (spotData.isHidden !== undefined) {
    updateData.is_hidden = spotData.isHidden;
  }
  if (spotData.reactions) {
    updateData.reactions_interested = spotData.reactions.interested;
    updateData.reactions_visited = spotData.reactions.visited;
  }

  const { data, error } = await supabase
    .from('spots')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating spot:', error);
    return null;
  }

  return convertSupabaseRowToSpot(data);
}

// スポット削除
export async function deleteSpot(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('spots')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting spot:', error);
    return false;
  }

  return true;
}

// リアクション更新
export async function updateSpotReactions(id: string, reactions: { interested: number; visited: number }): Promise<boolean> {
  const { error } = await supabase
    .from('spots')
    .update({
      reactions_interested: reactions.interested,
      reactions_visited: reactions.visited
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating reactions:', error);
    return false;
  }

  return true;
}