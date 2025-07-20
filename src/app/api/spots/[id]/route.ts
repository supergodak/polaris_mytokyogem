import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import fs from 'fs/promises';
import path from 'path';
import { Spot } from '@/types/spot';

const SPOTS_FILE_PATH = path.join(process.cwd(), 'data/spots.json');

// 個別スポット取得API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);
    
    const spot = spots.spots.find((s: Spot) => s.id === id);
    
    if (!spot || spot.isHidden) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }
    
    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error fetching spot:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spot' 
    }, { status: 500 });
  }
}

// スポット更新API
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    
    // スポットを検索
    const spotIndex = spots.spots.findIndex((s: Spot) => s.id === id);
    
    if (spotIndex === -1) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // 既存のスポットデータを保持しつつ更新
    const existingSpot = spots.spots[spotIndex];
    const updatedSpot: Spot = {
      ...existingSpot,
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: formData.images || existingSpot.images,
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
      isHidden: formData.isHidden !== undefined ? formData.isHidden : (existingSpot.isHidden || false),
      reactions: existingSpot.reactions, // リアクションは保持
      createdBy: existingSpot.createdBy, // 作成者も保持
      createdAt: existingSpot.createdAt || new Date().toISOString() // 作成日時も保持
    };

    // スポットを更新
    spots.spots[spotIndex] = updatedSpot;
    spots.lastUpdated = new Date().toISOString().split('T')[0];

    // ファイルに保存
    await fs.writeFile(SPOTS_FILE_PATH, JSON.stringify(spots, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      spot: updatedSpot 
    });

  } catch (error) {
    console.error('Error updating spot:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// スポット削除API（オプション）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 既存データを読み込み
    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);
    
    // スポットを検索
    const spotIndex = spots.spots.findIndex((s: Spot) => s.id === id);
    
    if (spotIndex === -1) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // スポットを削除
    spots.spots.splice(spotIndex, 1);
    spots.lastUpdated = new Date().toISOString().split('T')[0];

    // ファイルに保存
    await fs.writeFile(SPOTS_FILE_PATH, JSON.stringify(spots, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true 
    });

  } catch (error) {
    console.error('Error deleting spot:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}