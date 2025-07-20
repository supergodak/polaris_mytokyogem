'use client';

import { useState, useEffect } from 'react';
import { SpotCard } from '@/components/features/spot-card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Spot } from '@/types/spot';

export default function Home() {
  const { language } = useLanguage();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSpots = async () => {
      console.log('🏠 [HOME] Starting to fetch spots...');
      setIsLoading(true);
      try {
        console.log('🚀 [HOME] Calling /api/spots/supabase...');
        const response = await fetch('/api/spots/supabase');
        console.log('📡 [HOME] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 [HOME] API response data:', data);
          console.log('📋 [HOME] Spots array:', data.spots);
          console.log('🔢 [HOME] Spots count:', data.spots?.length || 0);
          setSpots(data.spots);
          console.log('✅ [HOME] State updated with', data.spots?.length || 0, 'spots');
        } else {
          console.error('❌ [HOME] Response not ok:', response.status);
        }
      } catch (error) {
        console.error('💥 [HOME] Error fetching spots:', error);
        // フォールバックとして既存データを使用
      } finally {
        setIsLoading(false);
        console.log('🏁 [HOME] Fetch completed');
      }
    };

    fetchSpots();
  }, []);

  const heading = language === 'ja' 
    ? '東京の隠れたジェム' 
    : 'Hidden Gems in Tokyo';
  
  const subheading = language === 'ja'
    ? '一人旅にぴったりのローカルスポット'
    : 'Perfect local spots for solo travelers';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {heading}
        </h1>
        <p className="text-gray-600">
          {subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
