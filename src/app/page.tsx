'use client';

import { SpotCard } from '@/components/features/spot-card';
import { getAllSpots } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const spots = getAllSpots();

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
