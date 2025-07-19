import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs/promises';
import path from 'path';
import { Spot } from '@/types/spot';

const SPOTS_FILE_PATH = path.join(process.cwd(), 'data/spots.json');

// スポット作成API
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.json();
    
    // バリデーション
    if (!formData.title?.ja || !formData.primaryCategory) {
      return NextResponse.json({ 
        error: 'Required fields missing' 
      }, { status: 400 });
    }

    // 既存データを読み込み
    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);

    // 新しいIDを生成
    const id = generateSpotId(formData.title.ja, formData.primaryCategory);

    // 新しいスポットデータを作成
    const newSpot: Spot = {
      id,
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: formData.images || [], // フロントエンドから送信された画像URLを使用
      location: {
        lat: formData.location.lat,
        lng: formData.location.lng,
        hideExactLocation: formData.location.hideExactLocation || false,
        address: formData.location.address
      },
      primaryCategory: formData.primaryCategory,
      genre: formData.genre || [],
      travelStyle: formData.travelStyle || [],
      soloFriendly: formData.soloFriendly || false,
      businessHours: formData.businessHours || { ja: '', en: '' },
      access: formData.access || { ja: '', en: '' },
      tips: formData.tips || { ja: '', en: '' },
      isHidden: formData.isHidden || false,
      reactions: {
        interested: 0,
        visited: 0
      },
      createdBy: 'ひとりあそび研究所',
      createdAt: new Date().toISOString()
    };

    // スポットリストに追加
    spots.spots.push(newSpot);
    spots.lastUpdated = new Date().toISOString().split('T')[0];

    // ファイルに保存
    await fs.writeFile(SPOTS_FILE_PATH, JSON.stringify(spots, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      spot: newSpot 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating spot:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// スポット一覧取得API
export async function GET() {
  try {
    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);
    
    // 非表示スポットを除外
    const visibleSpots = {
      ...spots,
      spots: spots.spots.filter((spot: Spot) => !spot.isHidden)
    };
    
    return NextResponse.json(visibleSpots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spots' 
    }, { status: 500 });
  }
}

// ID生成ヘルパー関数
function generateSpotId(title: string, category: string): string {
  // タイトルから安全な文字列を生成
  const safeTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 20);
  
  // カテゴリーの略称
  const categoryPrefix = category.slice(0, 4);
  
  // タイムスタンプ
  const timestamp = Date.now().toString().slice(-6);
  
  return `${categoryPrefix}-${safeTitle}-${timestamp}`;
}