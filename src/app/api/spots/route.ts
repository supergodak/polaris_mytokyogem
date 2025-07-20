import { NextResponse } from 'next/server';
import { getAllSpots } from '@/lib/supabase-data';

// Supabase経由でスポット一覧を取得
export async function GET() {
  try {
    console.log('🔧 [Supabase API] GET spots request received');
    
    const spots = await getAllSpots();
    
    console.log(`✅ [Supabase API] Retrieved ${spots.length} spots`);
    
    // JSONファイル形式に合わせて返す
    const response = {
      spots,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ [Supabase API] Error fetching spots:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch spots from Supabase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}