import { supabase } from './supabase';
import { Database } from './supabase';
import { Spot } from '@/types/spot';

type SpotRow = Database['public']['Tables']['spots']['Row'];
type SpotInsert = Database['public']['Tables']['spots']['Insert'];
type SpotUpdate = Database['public']['Tables']['spots']['Update'];

// 型変換ヘルパー関数
function convertSpotToRow(spot: Spot): SpotInsert {
  return {
    id: spot.id,
    title_ja: spot.title.ja,
    title_en: spot.title.en || null,
    short_description_ja: spot.shortDescription.ja,
    short_description_en: spot.shortDescription.en || null,
    description_ja: spot.description.ja,
    description_en: spot.description.en || null,
    images: spot.images,
    location_lat: spot.location.lat,
    location_lng: spot.location.lng,
    location_hide_exact: spot.location.hideExactLocation,
    location_address_ja: spot.location.address.ja,
    location_address_en: spot.location.address.en || null,
    primary_category: spot.primaryCategory,
    genre: spot.genre,
    travel_style: spot.travelStyle,
    solo_friendly: spot.soloFriendly,
    business_hours_ja: spot.businessHours?.ja || null,
    business_hours_en: spot.businessHours?.en || null,
    access_ja: spot.access?.ja || null,
    access_en: spot.access?.en || null,
    tips_ja: spot.tips?.ja || null,
    tips_en: spot.tips?.en || null,
    is_hidden: spot.isHidden,
    reactions_interested: spot.reactions?.interested || 0,
    reactions_visited: spot.reactions?.visited || 0,
    created_by: spot.createdBy,
    created_at: spot.createdAt,
  };
}

function convertRowToSpot(row: SpotRow): Spot {
  return {
    id: row.id,
    title: {
      ja: row.title_ja,
      en: row.title_en || '',
    },
    shortDescription: {
      ja: row.short_description_ja,
      en: row.short_description_en || '',
    },
    description: {
      ja: row.description_ja,
      en: row.description_en || '',
    },
    images: row.images || [],
    location: {
      lat: row.location_lat,
      lng: row.location_lng,
      hideExactLocation: row.location_hide_exact || false,
      address: {
        ja: row.location_address_ja,
        en: row.location_address_en || '',
      },
    },
    primaryCategory: row.primary_category,
    genre: row.genre || [],
    travelStyle: row.travel_style || [],
    soloFriendly: row.solo_friendly || false,
    businessHours: {
      ja: row.business_hours_ja || '',
      en: row.business_hours_en || '',
    },
    access: {
      ja: row.access_ja || '',
      en: row.access_en || '',
    },
    tips: {
      ja: row.tips_ja || '',
      en: row.tips_en || '',
    },
    isHidden: row.is_hidden || false,
    reactions: {
      interested: row.reactions_interested || 0,
      visited: row.reactions_visited || 0,
    },
    createdBy: row.created_by || '',
    createdAt: row.created_at,
  };
}

// スポット一覧を取得
export async function getAllSpots(): Promise<Spot[]> {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching spots:', error);
    throw new Error(`Failed to fetch spots: ${error.message}`);
  }

  return data.map(convertRowToSpot);
}

// 管理者用スポット一覧（非表示含む）
export async function getAllSpotsForAdmin(): Promise<Spot[]> {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching spots for admin:', error);
    throw new Error(`Failed to fetch spots: ${error.message}`);
  }

  return data.map(convertRowToSpot);
}

// 単一スポットを取得
export async function getSpotById(id: string): Promise<Spot | null> {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // スポットが見つからない
    }
    console.error('Error fetching spot:', error);
    throw new Error(`Failed to fetch spot: ${error.message}`);
  }

  return convertRowToSpot(data);
}

// スポットを作成
export async function createSpot(spot: Spot): Promise<Spot> {
  const spotData = convertSpotToRow(spot);
  
  const { data, error } = await supabase
    .from('spots')
    .insert(spotData)
    .select()
    .single();

  if (error) {
    console.error('Error creating spot:', error);
    throw new Error(`Failed to create spot: ${error.message}`);
  }

  return convertRowToSpot(data);
}

// スポットを更新
export async function updateSpot(id: string, updates: Partial<Spot>): Promise<Spot> {
  // 部分更新用のデータを準備
  const updateData: Partial<SpotUpdate> = {};
  
  if (updates.title) {
    updateData.title_ja = updates.title.ja;
    updateData.title_en = updates.title.en || null;
  }
  
  if (updates.shortDescription) {
    updateData.short_description_ja = updates.shortDescription.ja;
    updateData.short_description_en = updates.shortDescription.en || null;
  }
  
  if (updates.description) {
    updateData.description_ja = updates.description.ja;
    updateData.description_en = updates.description.en || null;
  }
  
  if (updates.images !== undefined) {
    updateData.images = updates.images;
  }
  
  if (updates.location) {
    updateData.location_lat = updates.location.lat;
    updateData.location_lng = updates.location.lng;
    updateData.location_hide_exact = updates.location.hideExactLocation;
    updateData.location_address_ja = updates.location.address.ja;
    updateData.location_address_en = updates.location.address.en || null;
  }
  
  if (updates.primaryCategory !== undefined) {
    updateData.primary_category = updates.primaryCategory;
  }
  
  if (updates.genre !== undefined) {
    updateData.genre = updates.genre;
  }
  
  if (updates.travelStyle !== undefined) {
    updateData.travel_style = updates.travelStyle;
  }
  
  if (updates.soloFriendly !== undefined) {
    updateData.solo_friendly = updates.soloFriendly;
  }
  
  if (updates.businessHours) {
    updateData.business_hours_ja = updates.businessHours.ja || null;
    updateData.business_hours_en = updates.businessHours.en || null;
  }
  
  if (updates.access) {
    updateData.access_ja = updates.access.ja || null;
    updateData.access_en = updates.access.en || null;
  }
  
  if (updates.tips) {
    updateData.tips_ja = updates.tips.ja || null;
    updateData.tips_en = updates.tips.en || null;
  }
  
  if (updates.isHidden !== undefined) {
    updateData.is_hidden = updates.isHidden;
  }
  
  if (updates.reactions) {
    updateData.reactions_interested = updates.reactions.interested;
    updateData.reactions_visited = updates.reactions.visited;
  }

  const { data, error } = await supabase
    .from('spots')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating spot:', error);
    throw new Error(`Failed to update spot: ${error.message}`);
  }

  return convertRowToSpot(data);
}

// スポットを削除
export async function deleteSpot(id: string): Promise<void> {
  const { error } = await supabase
    .from('spots')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting spot:', error);
    throw new Error(`Failed to delete spot: ${error.message}`);
  }
}

// 画像をSupabase Storageにアップロード
export async function uploadImageToSupabase(
  file: File | Buffer, 
  fileName: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('spot-images')
    .upload(fileName, file, {
      upsert: true,
      contentType: file instanceof File ? file.type : 'image/jpeg',
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // 公開URLを取得
  const { data: urlData } = supabase.storage
    .from('spot-images')
    .getPublicUrl(data.path);

  // ダブルスラッシュを修正
  const cleanUrl = urlData.publicUrl.replace(/\/\/+/g, '/').replace(':/', '://');
  
  console.log('📸 [Storage] Upload successful:', {
    fileName,
    path: data.path,
    originalUrl: urlData.publicUrl,
    cleanUrl
  });

  return cleanUrl;
}

// Base64画像をSupabase Storageにアップロード
export async function uploadBase64ImageToSupabase(
  base64Data: string,
  fileName: string
): Promise<string> {
  // Base64データからBufferを作成
  const buffer = Buffer.from(base64Data, 'base64');
  
  return uploadImageToSupabase(buffer, fileName);
}