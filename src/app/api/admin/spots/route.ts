import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAllSpotsForAdmin } from '@/lib/supabase-data';

// 管理画面用スポット一覧取得API（非表示スポットも含む）
export async function GET() {
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Supabaseから全スポットを取得（非表示スポット含む）
    const spots = await getAllSpotsForAdmin();
    
    // 既存のJSONレスポンス形式と互換性を保つ
    const response = {
      spots: spots,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching admin spots:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spots' 
    }, { status: 500 });
  }
}