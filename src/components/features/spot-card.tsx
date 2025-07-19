'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spot } from '@/types/spot';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';

interface SpotCardProps {
  spot: Spot;
}

export function SpotCard({ spot }: SpotCardProps) {
  const { language } = useLanguage();
  
  const title = getLocalizedContent(spot.title, language);
  const shortDescription = getLocalizedContent(spot.shortDescription, language);
  const address = getLocalizedContent(spot.location.address, language);

  return (
    <Card className="h-full">
      <div className="relative h-48 w-full">
        {spot.images[0] ? (
          <Image
            src={spot.images[0]}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        {spot.soloFriendly && (
          <Badge 
            variant="solo" 
            className="absolute top-2 left-2"
          >
            {language === 'ja' ? '一人旅向け' : 'Solo Friendly'}
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {shortDescription}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {spot.genre.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="genre" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mb-3">{address}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>❤️ {spot.reactions.interested}</span>
            <span>✅ {spot.reactions.visited}</span>
          </div>
          <Link href={`/spots/${spot.id}`}>
            <Button size="sm">
              {language === 'ja' ? '詳細' : 'Details'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}