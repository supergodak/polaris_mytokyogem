'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/ui/image-gallery';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';
import { generateGoogleMapsUrl, generateGoogleMapsDirectionsUrl } from '@/lib/maps';
import { getLocalizedTag } from '@/lib/tags';
import { useFavorites } from '@/hooks/useFavorites';
import { trackSpotView, trackOutboundLink } from '@/lib/analytics';
import { Spot } from '@/types/spot';

export default function SpotDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentReactions, setCurrentReactions] = useState({ interested: 0, visited: 0 });

  // スポットデータを取得
  useEffect(() => {
    const fetchSpot = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/spots/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setSpot(data);
          setCurrentReactions(data.reactions || { interested: 0, visited: 0 });
        } else {
          console.error('Failed to fetch spot:', response.status);
          setSpot(null);
        }
      } catch (error) {
        console.error('Error fetching spot:', error);
        setSpot(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSpot();
    }
  }, [params.id]);

  // スポット閲覧をトラッキング
  useEffect(() => {
    if (spot) {
      const title = getLocalizedContent(spot.title, language);
      trackSpotView(spot.id, title);
    }
  }, [spot, language]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">
            {language === 'ja' ? '読み込み中...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ja' ? 'スポットが見つかりません' : 'Spot not found'}
          </h1>
          <Link href="/">
            <Button>{language === 'ja' ? 'ホームに戻る' : 'Back to Home'}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = getLocalizedContent(spot.title, language);
  const description = getLocalizedContent(spot.description, language);
  const address = getLocalizedContent(spot.location.address, language);
  const businessHours = getLocalizedContent(spot.businessHours, language);
  const access = getLocalizedContent(spot.access, language);
  const tips = getLocalizedContent(spot.tips, language);

  const handleFavoriteClick = async () => {
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <span className="mr-2">←</span>
        {language === 'ja' ? '一覧に戻る' : 'Back to List'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {/* 画像ギャラリー */}
          <ImageGallery 
            images={spot.images} 
            alt={title}
            className="mb-4"
          />

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="genre" className="bg-purple-100 text-purple-800">
              {getLocalizedTag(spot.primaryCategory, language)}
            </Badge>
            {spot.genre.map((genre) => (
              <Badge key={genre} variant="genre">
                {getLocalizedTag(genre, language)}
              </Badge>
            ))}
            {spot.travelStyle.slice(0, 3).map((style) => (
              <Badge key={style} variant="default" className="bg-green-100 text-green-800">
                {getLocalizedTag(style, language)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <button
              onClick={handleFavoriteClick}
              disabled={isUpdating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-base transition-all ${
                isFavorite(spot.id)
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-xl">{isFavorite(spot.id) ? '❤️' : '🤍'}</span>
              <span>
                {language === 'ja' ? '気になる' : 'Favorite'}
                <span className="ml-1">({currentReactions.interested})</span>
              </span>
            </button>
          </div>
          <p className="text-gray-700 mb-6">{description}</p>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                {language === 'ja' ? '基本情報' : 'Basic Information'}
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {language === 'ja' ? '住所' : 'Address'}
                </h4>
                <p className="text-gray-600">{address}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {language === 'ja' ? '営業時間' : 'Business Hours'}
                </h4>
                <p className="text-gray-600">{businessHours}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {language === 'ja' ? 'アクセス' : 'Access'}
                </h4>
                <p className="text-gray-600">{access}</p>
              </div>
              {!spot.location.hideExactLocation && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'ja' ? '地図' : 'Map'}
                  </h4>
                  <div className="flex space-x-2">
                    <a
                      href={generateGoogleMapsUrl(spot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        trackOutboundLink(generateGoogleMapsUrl(spot), 'google_maps_view');
                        window.open(generateGoogleMapsUrl(spot), '_blank');
                      }}
                    >
                      📍 {language === 'ja' ? '地図で見る' : 'View on Map'}
                    </a>
                    <a
                      href={generateGoogleMapsDirectionsUrl(spot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        trackOutboundLink(generateGoogleMapsDirectionsUrl(spot), 'google_maps_directions');
                        window.open(generateGoogleMapsDirectionsUrl(spot), '_blank');
                      }}
                    >
                      🚶 {language === 'ja' ? '経路案内' : 'Directions'}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                {language === 'ja' ? 'ひとりあそびのコツ' : 'Solo Travel Tips'}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{tips}</p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            {/* 行ってきたボタンは一旦非表示 */}
            {/* <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                <span>❤️</span>
                <span>{spot.reactions.interested}</span>
                <span className="text-sm">{language === 'ja' ? '気になる' : 'Interested'}</span>
              </button>
              <button className="flex items-center space-x-2 text-green-600 hover:text-green-800">
                <span>✅</span>
                <span>{spot.reactions.visited}</span>
                <span className="text-sm">{language === 'ja' ? '行ってきた' : 'Visited'}</span>
              </button>
            </div> */}
            <div></div>
            <Button variant="outline">
              {language === 'ja' ? 'シェア' : 'Share'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}