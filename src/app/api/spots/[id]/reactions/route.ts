import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Spot } from '@/types/spot';

const SPOTS_FILE_PATH = path.join(process.cwd(), 'data/spots.json');

// リアクション更新API
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { action, type } = await request.json();
    
    // バリデーション
    if (!action || !type) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action' 
      }, { status: 400 });
    }
    
    if (!['interested', 'visited'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid reaction type' 
      }, { status: 400 });
    }

    // スポットデータを読み込み
    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);
    
    // 対象スポットを探す
    const spotIndex = spots.spots.findIndex((spot: Spot) => spot.id === id);
    
    if (spotIndex === -1) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // リアクション数を更新
    const currentSpot = spots.spots[spotIndex];
    const currentReactions = currentSpot.reactions || { interested: 0, visited: 0 };
    
    if (action === 'add') {
      currentReactions[type as keyof typeof currentReactions] = (currentReactions[type as keyof typeof currentReactions] || 0) + 1;
    } else if (action === 'remove' && currentReactions[type as keyof typeof currentReactions] > 0) {
      currentReactions[type as keyof typeof currentReactions] = currentReactions[type as keyof typeof currentReactions] - 1;
    }

    // スポットのリアクションを更新
    spots.spots[spotIndex].reactions = currentReactions;
    
    // ファイルに保存
    await fs.writeFile(SPOTS_FILE_PATH, JSON.stringify(spots, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true,
      reactions: currentReactions
    });

  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}