'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'mytokyogem_favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ローカルストレージに保存
  const saveFavorites = useCallback((ids: string[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // お気に入りの追加/削除
  const toggleFavorite = useCallback(async (spotId: string) => {
    const isFavorite = favoriteIds.includes(spotId);
    const newFavorites = isFavorite
      ? favoriteIds.filter(id => id !== spotId)
      : [...favoriteIds, spotId];

    // 楽観的更新
    saveFavorites(newFavorites);

    // APIを呼び出してカウントを更新
    try {
      const response = await fetch(`/api/spots/${spotId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isFavorite ? 'remove' : 'add',
          type: 'interested'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reaction');
      }

      const data = await response.json();
      return data.reactions;
    } catch (error) {
      console.error('Error updating reaction:', error);
      // エラー時は元に戻す
      saveFavorites(favoriteIds);
      throw error;
    }
  }, [favoriteIds, saveFavorites]);

  // 特定のスポットがお気に入りかチェック
  const isFavorite = useCallback((spotId: string) => {
    return favoriteIds.includes(spotId);
  }, [favoriteIds]);

  // お気に入りの数を取得
  const getFavoriteCount = useCallback(() => {
    return favoriteIds.length;
  }, [favoriteIds]);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    isLoading
  };
}