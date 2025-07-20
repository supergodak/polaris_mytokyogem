import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAllSpots, createSpot } from '@/lib/supabase-data';

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

    // 新しいスポットデータを作成
    const spotData = {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: formData.images || [],
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
      createdBy: 'ひとりあそび研究所'
    };

    // Supabaseにデータを保存
    const newSpot = await createSpot(spotData);

    if (!newSpot) {
      return NextResponse.json({ 
        error: 'Failed to create spot in database' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      spot: newSpot 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating spot:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

// スポット一覧取得API
export async function GET() {
  console.log('🚀 [API] /api/spots called');
  console.log('🌍 [API] Environment:', process.env.NODE_ENV);
  
  // 診断情報を収集
  const diagnostics = {
    environment: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    timestamp: new Date().toISOString()
  };
  
  console.log('🔧 [API] Diagnostics:', diagnostics);
  
  try {
    // Supabaseから公開スポットを取得
    const spots = await getAllSpots();
    console.log('📦 [API] Received spots from getAllSpots:', spots.length);
    
    // 既存のJSONレスポンス形式と互換性を保つ + 診断情報
    const response = {
      spots: spots,
      lastUpdated: new Date().toISOString().split('T')[0],
      // 開発環境でのみ診断情報を含める
      ...(process.env.NODE_ENV === 'development' && { 
        _debug: {
          spotsCount: spots.length,
          diagnostics: diagnostics
        }
      })
    };
    
    console.log('✅ [API] Returning response with', response.spots.length, 'spots');
    
    // 本番環境でもエラー情報を一時的に含める
    if (spots.length === 0) {
      return NextResponse.json({
        ...response,
        _productionDebug: {
          message: 'No spots returned from Supabase',
          diagnostics: diagnostics,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ [API] Error in GET /api/spots:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spots',
      _productionDebug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        diagnostics: diagnostics
      }
    }, { status: 500 });
  }
}

