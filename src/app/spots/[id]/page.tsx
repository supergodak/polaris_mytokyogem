'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSpotById } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';

export default function SpotDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const spot = getSpotById(params.id as string);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <span className="mr-2">←</span>
        {language === 'ja' ? '一覧に戻る' : 'Back to List'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative h-64 w-full mb-4">
            {spot.images[0] ? (
              <Image
                src={spot.images[0]}
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {spot.soloFriendly && (
              <Badge variant="solo">
                {language === 'ja' ? '一人旅向け' : 'Solo Friendly'}
              </Badge>
            )}
            {spot.genre.map((genre) => (
              <Badge key={genre} variant="genre">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
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
            <div className="flex items-center space-x-4">
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
            </div>
            <Button variant="outline">
              {language === 'ja' ? 'シェア' : 'Share'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}