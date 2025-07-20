import { Spot, SpotList } from '@/types/spot';
import spotsData from '../../data/spots.json';
import { getAllSpots as getSupabaseSpots, getAllSpotsForAdmin as getSupabaseAdminSpots } from '@/lib/supabase-data';

// サーバーサイドでの直接読み込み（fallback用）
export function getAllSpotsSync(): Spot[] {
  // 非表示スポットを除外
  return (spotsData as SpotList).spots.filter(spot => !spot.isHidden);
}

// クライアントサイドでのAPI呼び出し
export async function getAllSpots(): Promise<Spot[]> {
  // サーバーサイドではSupabaseから直接取得
  if (typeof window === 'undefined') {
    try {
      return await getSupabaseSpots();
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      return getAllSpotsSync();
    }
  }
  
  try {
    const response = await fetch('/api/spots');
    if (!response.ok) {
      throw new Error('Failed to fetch spots');
    }
    const data: SpotList = await response.json();
    return data.spots;
  } catch (error) {
    console.error('Error fetching spots:', error);
    // フォールバックとして同期版を使用
    return getAllSpotsSync();
  }
}

export function getSpotById(id: string): Spot | null {
  const spots = getAllSpotsSync();
  return spots.find(spot => spot.id === id) || null;
}

export function getSpotsByGenre(genre: string): Spot[] {
  const spots = getAllSpotsSync();
  return spots.filter(spot => spot.genre.includes(genre));
}

export function getSoloFriendlySpots(): Spot[] {
  const spots = getAllSpotsSync();
  return spots.filter(spot => spot.soloFriendly);
}

// 管理画面用：非表示スポットも含めて全取得
export async function getAllSpotsForAdmin(): Promise<Spot[]> {
  // サーバーサイドではSupabaseから直接取得
  if (typeof window === 'undefined') {
    try {
      return await getSupabaseAdminSpots();
    } catch (error) {
      console.error('Error fetching admin spots from Supabase:', error);
      return (spotsData as SpotList).spots;
    }
  }
  
  try {
    // クライアントサイドではAPIを通じて取得
    const response = await fetch('/api/admin/spots');
    if (!response.ok) {
      throw new Error('Failed to fetch admin spots');
    }
    const data: SpotList = await response.json();
    return data.spots;
  } catch (error) {
    console.error('Error fetching admin spots:', error);
    // フォールバックとしてJSON版を使用
    return (spotsData as SpotList).spots;
  }
}