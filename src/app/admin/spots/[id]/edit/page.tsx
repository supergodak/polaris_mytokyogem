'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagSelector } from '@/components/ui/tag-selector';
import { ImageUpload } from '@/components/ui/image-upload';
import { LocationPicker } from '@/components/ui/location-picker';
import { PRIMARY_CATEGORIES } from '@/lib/tags';
import { Spot } from '@/types/spot';

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
  existingImages: string[];
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
  isHidden: boolean;
}

import { use } from 'react';

export default function EditSpotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSpot, setIsLoadingSpot] = useState(true);
  const [translating, setTranslating] = useState<Record<string, boolean>>({
    title: false,
    description: false,
    shortDescription: false,
    businessHours: false,
    access: false,
    tips: false,
    address: false
  });
  const [formData, setFormData] = useState<SpotFormData>({
    title: { ja: '', en: '' },
    description: { ja: '', en: '' },
    shortDescription: { ja: '', en: '' },
    images: [],
    existingImages: [],
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
    isHidden: false
  });

  useEffect(() => {
    if (session && !session.user) {
      router.push('/admin/login');
    }
  }, [session, router]);

  // 既存のスポットデータを取得
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await fetch(`/api/spots/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch spot');
        }
        const spot: Spot = await response.json();
        
        // フォームデータにセット
        setFormData({
          title: spot.title,
          description: spot.description,
          shortDescription: spot.shortDescription,
          images: [],
          existingImages: spot.images || [],
          location: spot.location,
          primaryCategory: spot.primaryCategory,
          genre: spot.genre,
          travelStyle: spot.travelStyle,
          soloFriendly: spot.soloFriendly,
          businessHours: spot.businessHours,
          access: spot.access,
          tips: spot.tips,
          isHidden: spot.isHidden || false
        });
      } catch (error) {
        console.error('Error fetching spot:', error);
        alert('スポットの読み込みに失敗しました');
        router.push('/admin');
      } finally {
        setIsLoadingSpot(false);
      }
    };

    if (session?.user) {
      fetchSpot();
    }
  }, [id, session, router]);

  if (!session?.user || isLoadingSpot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>読み込み中...</div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean | string[] | File[], lang?: 'ja' | 'en') => {
    setFormData(prev => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...(prev[field as keyof SpotFormData] as Record<string, unknown>),
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

  const handleLocationChange = (field: string, value: number | boolean) => {
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

  // リアルタイム翻訳機能
  const translateField = async (fieldType: string, jaValue: string, enValue: string) => {
    // 日本語が入力済み かつ 英語が空の場合のみ翻訳
    if (!jaValue.trim() || enValue.trim()) {
      return;
    }

    setTranslating(prev => ({ ...prev, [fieldType]: true }));

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: jaValue,
          fieldType: fieldType
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const { translatedText } = await response.json();

      // 翻訳結果を英語フィールドに自動入力
      if (fieldType === 'address') {
        handleLocationAddressChange('en', translatedText);
      } else {
        handleInputChange(fieldType, translatedText, 'en');
      }

      console.log(`Translated ${fieldType}: "${jaValue}" -> "${translatedText}"`);
    } catch (error) {
      console.error(`Translation failed for ${fieldType}:`, error);
      // 翻訳失敗時は何もしない（既存のフォールバック機能が動作）
    } finally {
      setTranslating(prev => ({ ...prev, [fieldType]: false }));
    }
  };

  // 日本語フィールドのblurハンドラー
  const handleJapaneseFieldBlur = (fieldType: string, jaValue: string) => {
    if (fieldType === 'address') {
      translateField('address', jaValue, formData.location.address.en);
    } else {
      const enValue = (formData as unknown as Record<string, { en: string }>)[fieldType]?.en || '';
      translateField(fieldType, jaValue, enValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 本番環境かどうかを判定
      const isProduction = window.location.hostname !== 'localhost';
      
      if (isProduction) {
        // 本番環境: GitHub API経由で更新
        const imageDataPromises = formData.images.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              resolve(base64.split(',')[1]);
            };
            reader.readAsDataURL(file);
          });
        });
        
        const newImageData = formData.images.length > 0 ? await Promise.all(imageDataPromises) : [];
        
        const response = await fetch('/api/admin/spots/github', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            spot: {
              ...formData,
              images: formData.existingImages,
            },
            images: newImageData,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'スポットの更新に失敗しました');
        }
        
        const data = await response.json();
        alert(data.message || 'スポットを更新しました！2-3分後に反映されます。');
        router.push('/admin');
        
      } else {
        // ローカル環境: 従来通りの処理
        let imageUrls: string[] = [...formData.existingImages];

        // 新しい画像のアップロード
        if (formData.images.length > 0) {
          const imageFormData = new FormData();
          formData.images.forEach((file) => {
            imageFormData.append('images', file);
          });

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: imageFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || '画像のアップロードに失敗しました');
          }

          const uploadData = await uploadResponse.json();
          imageUrls = [...imageUrls, ...uploadData.urls];
        }

        // スポットデータの更新
        const spotData = {
          ...formData,
          images: imageUrls
        };

        const spotResponse = await fetch(`/api/spots/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(spotData),
        });

        if (!spotResponse.ok) {
          const errorData = await spotResponse.json();
          throw new Error(errorData.error || 'スポットの更新に失敗しました');
        }

        await spotResponse.json();
        
        alert('スポットが正常に更新されました！');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error updating spot:', error);
      alert(error instanceof Error ? error.message : '更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">スポットを編集</h1>
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
                  onBlur={(e) => handleJapaneseFieldBlur('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: カウンター席が心地よいクラフトビールバー"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル（英語）
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.title ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.title}
                  />
                  {translating.title && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
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
                  onBlur={(e) => handleJapaneseFieldBlur('shortDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="一覧ページで表示される短い説明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  短い説明（英語）
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={formData.shortDescription.en}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.shortDescription ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.shortDescription}
                  />
                  {translating.shortDescription && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
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
                  onBlur={(e) => handleJapaneseFieldBlur('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="詳細ページで表示される詳しい説明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細説明（英語）
                </label>
                <div className="relative">
                  <textarea
                    rows={5}
                    value={formData.description.en}
                    onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.description ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.description}
                  />
                  {translating.description && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
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
            {/* 既存画像の表示 */}
            {formData.existingImages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">現在の画像</h3>
                <div className="grid grid-cols-3 gap-2">
                  {formData.existingImages.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`既存画像 ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            existingImages: prev.existingImages.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ImageUpload
              onImagesChange={(files) => handleInputChange('images', files)}
              maxImages={5 - formData.existingImages.length}
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
                  onBlur={(e) => handleJapaneseFieldBlur('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="東京都渋谷区渋谷2-10-15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所（英語）
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location.address.en}
                    onChange={(e) => handleLocationAddressChange('en', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.address ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.address}
                  />
                  {translating.address && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
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
                  onBlur={(e) => handleJapaneseFieldBlur('businessHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 18:00-02:00 (月-土) / 日曜定休"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  営業時間（英語）
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.businessHours.en}
                    onChange={(e) => handleInputChange('businessHours', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.businessHours ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.businessHours}
                  />
                  {translating.businessHours && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
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
                  onBlur={(e) => handleJapaneseFieldBlur('access', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 渋谷駅から徒歩5分"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アクセス（英語）
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.access.en}
                    onChange={(e) => handleInputChange('access', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.access ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.access}
                  />
                  {translating.access && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
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
                  onBlur={(e) => handleJapaneseFieldBlur('tips', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="一人で楽しむためのコツやアドバイス"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ひとりあそびのコツ（英語）
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={formData.tips.en}
                    onChange={(e) => handleInputChange('tips', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translating.tips ? "翻訳中..." : "AI翻訳で自動生成されます"}
                    disabled={translating.tips}
                  />
                  {translating.tips && (
                    <div className="absolute right-2 top-2 text-blue-500">
                      <span className="animate-spin inline-block">⟳</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 表示設定 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">表示設定</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isHidden"
                checked={formData.isHidden}
                onChange={(e) => handleInputChange('isHidden', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isHidden" className="ml-2 text-sm text-gray-700">
                非表示にする（下書き保存）
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              チェックすると一般ユーザーには表示されません
            </p>
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
            {isLoading ? '更新中...' : 'スポットを更新'}
          </Button>
        </div>
      </form>
    </div>
  );
}