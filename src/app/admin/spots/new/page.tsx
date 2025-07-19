'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagSelector } from '@/components/ui/tag-selector';
import { ImageUpload } from '@/components/ui/image-upload';
import { LocationPicker } from '@/components/ui/location-picker';
import { PRIMARY_CATEGORIES } from '@/lib/tags';

interface SpotFormData {
  title: {
    ja: string;
    en: string;
  };
  description: {
    ja: string;
    en: string;
  };
  shortDescription: {
    ja: string;
    en: string;
  };
  images: File[];
  location: {
    lat: number;
    lng: number;
    hideExactLocation: boolean;
    address: {
      ja: string;
      en: string;
    };
  };
  primaryCategory: string;
  genre: string[];
  travelStyle: string[];
  soloFriendly: boolean;
  businessHours: {
    ja: string;
    en: string;
  };
  access: {
    ja: string;
    en: string;
  };
  tips: {
    ja: string;
    en: string;
  };
  publishedAt: string;
  expiresAt: string;
}

export default function NewSpotPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SpotFormData>({
    title: { ja: '', en: '' },
    description: { ja: '', en: '' },
    shortDescription: { ja: '', en: '' },
    images: [],
    location: {
      lat: 35.6762,
      lng: 139.6503,
      hideExactLocation: false,
      address: { ja: '', en: '' }
    },
    primaryCategory: '',
    genre: [],
    travelStyle: [],
    soloFriendly: true,
    businessHours: { ja: '', en: '' },
    access: { ja: '', en: '' },
    tips: { ja: '', en: '' },
    publishedAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  if (!session?.user) {
    router.push('/admin/login');
    return null;
  }

  const handleInputChange = (field: string, value: any, lang?: 'ja' | 'en') => {
    setFormData(prev => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof SpotFormData],
            [lang]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleLocationAddressChange = (lang: 'ja' | 'en', value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: {
          ...prev.location.address,
          [lang]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: 実際のAPI呼び出しを実装
      console.log('Form data:', formData);
      
      // 仮の処理 - 実際にはAPI経由でJSONファイルを更新
      alert('スポットが登録されました（開発中のため仮実装）');
      router.push('/admin');
    } catch (error) {
      console.error('Error saving spot:', error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">新しいスポットを追加</h1>
        <Link href="/admin">
          <Button variant="outline">管理画面に戻る</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">基本情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル（日本語）*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title.ja}
                  onChange={(e) => handleInputChange('title', e.target.value, 'ja')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: カウンター席が心地よいクラフトビールバー"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル（英語）
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  短い説明（日本語）*
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.shortDescription.ja}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value, 'ja')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="一覧ページで表示される短い説明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  短い説明（英語）
                </label>
                <textarea
                  rows={3}
                  value={formData.shortDescription.en}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value, 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細説明（日本語）*
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description.ja}
                  onChange={(e) => handleInputChange('description', e.target.value, 'ja')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="詳細ページで表示される詳しい説明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細説明（英語）
                </label>
                <textarea
                  rows={5}
                  value={formData.description.en}
                  onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 画像 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">画像</h2>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImagesChange={(files) => handleInputChange('images', files)}
              maxImages={5}
            />
          </CardContent>
        </Card>

        {/* カテゴリー・タグ */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">カテゴリー・タグ</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                基本カテゴリー *
              </label>
              <select
                required
                value={formData.primaryCategory}
                onChange={(e) => handleInputChange('primaryCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">カテゴリーを選択してください</option>
                {Object.entries(PRIMARY_CATEGORIES).map(([key, tag]) => (
                  <option key={key} value={key}>
                    {tag.ja}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ジャンルタグ
              </label>
              <TagSelector
                selectedTags={formData.genre}
                onTagChange={(tags) => handleInputChange('genre', tags)}
                placeholder="ジャンルタグを検索・選択..."
                maxTags={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                旅行スタイルタグ
              </label>
              <TagSelector
                selectedTags={formData.travelStyle}
                onTagChange={(tags) => handleInputChange('travelStyle', tags)}
                placeholder="旅行スタイルタグを検索・選択..."
                maxTags={15}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="soloFriendly"
                checked={formData.soloFriendly}
                onChange={(e) => handleInputChange('soloFriendly', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="soloFriendly" className="ml-2 text-sm text-gray-700">
                一人旅向けスポット
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 位置情報 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">位置情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationPicker
              lat={formData.location.lat}
              lng={formData.location.lng}
              onLocationChange={(lat, lng) => {
                handleLocationChange('lat', lat);
                handleLocationChange('lng', lng);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所（日本語）*
                </label>
                <input
                  type="text"
                  required
                  value={formData.location.address.ja}
                  onChange={(e) => handleLocationAddressChange('ja', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="東京都渋谷区渋谷2-10-15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所（英語）
                </label>
                <input
                  type="text"
                  value={formData.location.address.en}
                  onChange={(e) => handleLocationAddressChange('en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hideExactLocation"
                checked={formData.location.hideExactLocation}
                onChange={(e) => handleLocationChange('hideExactLocation', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hideExactLocation" className="ml-2 text-sm text-gray-700">
                詳細位置を表示しない（隠れ家スポット用）
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 詳細情報 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">詳細情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  営業時間（日本語）
                </label>
                <input
                  type="text"
                  value={formData.businessHours.ja}
                  onChange={(e) => handleInputChange('businessHours', e.target.value, 'ja')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 18:00-02:00 (月-土) / 日曜定休"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  営業時間（英語）
                </label>
                <input
                  type="text"
                  value={formData.businessHours.en}
                  onChange={(e) => handleInputChange('businessHours', e.target.value, 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アクセス（日本語）
                </label>
                <input
                  type="text"
                  value={formData.access.ja}
                  onChange={(e) => handleInputChange('access', e.target.value, 'ja')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 渋谷駅から徒歩5分"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アクセス（英語）
                </label>
                <input
                  type="text"
                  value={formData.access.en}
                  onChange={(e) => handleInputChange('access', e.target.value, 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ひとりあそびのコツ（日本語）
                </label>
                <textarea
                  rows={3}
                  value={formData.tips.ja}
                  onChange={(e) => handleInputChange('tips', e.target.value, 'ja')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="一人で楽しむためのコツやアドバイス"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ひとりあそびのコツ（英語）
                </label>
                <textarea
                  rows={3}
                  value={formData.tips.en}
                  onChange={(e) => handleInputChange('tips', e.target.value, 'en')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI翻訳で自動生成されます"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 公開設定 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">公開設定</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公開開始日
                </label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公開終了日
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 送信ボタン */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin">
            <Button type="button" variant="outline">
              キャンセル
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : 'スポットを登録'}
          </Button>
        </div>
      </form>
    </div>
  );
}