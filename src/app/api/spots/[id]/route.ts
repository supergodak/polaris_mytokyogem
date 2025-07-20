import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Spot } from '@/types/spot';
import { getSpotById, updateSpot, deleteSpot } from '@/lib/supabase-data';

// 個別スポット取得API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const spot = await getSpotById(id);
    
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

    // 更新データを作成
    const updateData: Partial<Spot> = {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: formData.images,
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
      isHidden: formData.isHidden
    };

    // Supabaseでスポットを更新
    const updatedSpot = await updateSpot(id, updateData);

    if (!updatedSpot) {
      return NextResponse.json({ 
        error: 'Failed to update spot' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      spot: updatedSpot 
    });

  } catch (error) {
    console.error('Error updating spot:', error);
    console.error('Spot ID:', id);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

// スポット削除API
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

    // Supabaseでスポットを削除
    const success = await deleteSpot(id);

    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to delete spot' 
      }, { status: 500 });
    }

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