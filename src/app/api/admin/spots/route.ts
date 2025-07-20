import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import fs from 'fs/promises';
import path from 'path';

const SPOTS_FILE_PATH = path.join(process.cwd(), 'data/spots.json');

// 管理画面用スポット一覧取得API（非表示スポットも含む）
export async function GET() {
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const spotsData = await fs.readFile(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(spotsData);
    
    // 管理画面では全スポットを表示（非表示含む）
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching admin spots:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spots' 
    }, { status: 500 });
  }
}