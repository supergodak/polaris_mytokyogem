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

    // 既存データを読み込み
    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);
    
    // スポットを検索
    const spotIndex = spots.spots.findIndex((s: Spot) => s.id === id);
    
    if (spotIndex === -1) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // リアクション数を更新
    const spot = spots.spots[spotIndex];
    if (action === 'add') {
      spot.reactions[type] = (spot.reactions[type] || 0) + 1;
    } else if (action === 'remove' && spot.reactions[type] > 0) {
      spot.reactions[type] = spot.reactions[type] - 1;
    }

    // ファイルに保存
    await fs.writeFile(SPOTS_FILE_PATH, JSON.stringify(spots, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true,
      reactions: spot.reactions
    });

  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}