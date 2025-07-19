import { Spot, SpotList } from '@/types/spot';
import spotsData from '../../data/spots.json';

// サーバーサイドでの直接読み込み（fallback用）
export function getAllSpotsSync(): Spot[] {
  // 非表示スポットを除外
  return (spotsData as SpotList).spots.filter(spot => !spot.isHidden);
}

// クライアントサイドでのAPI呼び出し
export async function getAllSpots(): Promise<Spot[]> {
  // サーバーサイドではAPIを呼び出さずに直接データを返す
  if (typeof window === 'undefined') {
    return getAllSpotsSync();
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
export function getAllSpotsForAdmin(): Spot[] {
  return (spotsData as SpotList).spots;
}