'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spot } from '@/types/spot';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';
import { generateGoogleMapsUrl } from '@/lib/maps';
import { getLocalizedTag } from '@/lib/tags';
import { useFavorites } from '@/hooks/useFavorites';

interface SpotCardProps {
  spot: Spot;
}

export function SpotCard({ spot }: SpotCardProps) {
  const { language } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentReactions, setCurrentReactions] = useState(spot.reactions);
  
  const title = getLocalizedContent(spot.title, language);
  const shortDescription = getLocalizedContent(spot.shortDescription, language);
  const address = getLocalizedContent(spot.location.address, language);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const newReactions = await toggleFavorite(spot.id);
      setCurrentReactions(newReactions);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {spot.images[0] ? (
          <Image
            src={spot.images[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            style={{
              imageOrientation: 'none',
              transform: 'rotate(0deg)',
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Solo Friendly Badge */}
        {spot.soloFriendly && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium px-2.5 py-0.5">
              🚶‍♂️ {language === 'ja' ? '一人旅向け' : 'Solo Friendly'}
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full w-10 h-10 shadow-sm flex items-center justify-center transition-colors"
          onClick={handleFavoriteClick}
          disabled={isUpdating}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite(spot.id) 
                ? "fill-red-500 text-red-500" 
                : "text-gray-600 hover:text-red-500"
            } ${isUpdating ? 'opacity-50' : ''}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Location and Reaction Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
          <div className="flex items-center text-sm">
            <Heart className="w-4 h-4 fill-red-500 text-red-500 mr-1" />
            <span className="font-medium text-gray-900">{currentReactions.interested}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/spots/${spot.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {shortDescription}
        </p>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge 
            className="text-xs px-2 py-1 bg-purple-50 text-purple-800 border-purple-200"
          >
            {getLocalizedTag(spot.primaryCategory, language)}
          </Badge>
          {spot.genre.slice(0, 1).map((genre) => (
            <Badge 
              key={genre} 
              className="text-xs px-2 py-1 bg-green-50 text-green-800 border-green-200"
            >
              {getLocalizedTag(genre, language)}
            </Badge>
          ))}
          {spot.travelStyle.slice(0, 1).map((style) => (
            <Badge 
              key={style} 
              className="text-xs px-2 py-1 bg-orange-50 text-orange-800 border-orange-200"
            >
              {getLocalizedTag(style, language)}
            </Badge>
          ))}
          
          {/* Additional tags indicator */}
          {(spot.genre.length + spot.travelStyle.length) > 2 && (
            <Badge className="text-xs px-2 py-1 text-gray-500 bg-gray-50 border-gray-200">
              +{(spot.genre.length + spot.travelStyle.length) - 2}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1">
            <span className="text-red-500 text-sm">❤️</span>
            <span className="text-sm text-gray-600">{currentReactions.interested}</span>
          </div>
          <div className="flex space-x-2">
            {!spot.location.hideExactLocation && (
              <a
                href={generateGoogleMapsUrl(spot)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 p-1"
                title={language === 'ja' ? '地図で見る' : 'View on Map'}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Link href={`/spots/${spot.id}`}>
              <Button size="sm" className="text-sm px-4 py-2">
                {language === 'ja' ? '詳細' : 'Details'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}