'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SpotCard } from '@/components/features/spot-card';
import { getAllSpotsSync } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Spot } from '@/types/spot';

export default function FavoritesPage() {
  const { language } = useLanguage();
  const { favoriteIds, isLoading } = useFavorites();
  const [favoriteSpots, setFavoriteSpots] = useState<Spot[]>([]);

  useEffect(() => {
    // お気に入りのスポットのみをフィルタリング
    const allSpots = getAllSpotsSync();
    const filtered = allSpots.filter(spot => favoriteIds.includes(spot.id));
    setFavoriteSpots(filtered);
  }, [favoriteIds]);

  const heading = language === 'ja' 
    ? '気になるスポット' 
    : 'Favorite Spots';
  
  const emptyMessage = language === 'ja'
    ? 'まだ気になるスポットがありません。'
    : 'No favorite spots yet.';

  const backToListText = language === 'ja'
    ? '一覧に戻る'
    : 'Back to List';

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">
            {language === 'ja' ? '読み込み中...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {heading}
        </h1>
        <p className="text-gray-600">
          {favoriteSpots.length > 0 
            ? `${favoriteSpots.length} ${language === 'ja' ? '件' : favoriteSpots.length === 1 ? 'spot' : 'spots'}`
            : emptyMessage
          }
        </p>
      </div>

      {favoriteSpots.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤍</div>
          <p className="text-gray-500 mb-6">{emptyMessage}</p>
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">←</span>
            {backToListText}
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="mr-2">←</span>
              {backToListText}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}