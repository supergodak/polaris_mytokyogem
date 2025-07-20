import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getSpotById, updateSpot, deleteSpot } from '@/lib/supabase-data';

// NextAuth設定
const authOptions = {
  providers: [],
  session: { strategy: 'jwt' as const },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
};

// 個別スポット取得API（Supabase対応）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔧 [Spot API] GET request for spot ID:', id);
  
  try {
    const spot = await getSpotById(id);
    
    if (!spot) {
      console.log('❌ [Spot API] Spot not found:', id);
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // 非表示スポットは管理者のみ表示
    if (spot.isHidden) {
      const session = await getServerSession(authOptions);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!session?.user || (session.user as any).role !== 'admin') {
        console.log('❌ [Spot API] Hidden spot access denied:', id);
        return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
      }
    }
    
    console.log('✅ [Spot API] Spot found:', spot.title.ja);
    return NextResponse.json(spot);
  } catch (error) {
    console.error('❌ [Spot API] Error fetching spot:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// スポット更新API（Supabase対応）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔧 [Spot API] PUT request for spot ID:', id);
  
  try {
    // 認証・認可チェック
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [Spot API] Authorization failed - no admin role');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.json();
    
    // バリデーション
    if (!formData.title?.ja || !formData.primaryCategory) {
      return NextResponse.json({ 
        error: 'Required fields missing' 
      }, { status: 400 });
    }

    // Supabaseでスポットを更新
    const updatedSpot = await updateSpot(id, formData);
    
    console.log('✅ [Spot API] Spot updated successfully:', updatedSpot.title.ja);
    
    return NextResponse.json({ 
      success: true, 
      spot: updatedSpot 
    });

  } catch (error) {
    console.error('❌ [Spot API] Error updating spot:', error);
    return NextResponse.json({ 
      error: 'Failed to update spot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// スポット削除API（Supabase対応）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔧 [Spot API] DELETE request for spot ID:', id);
  
  try {
    // 認証・認可チェック
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [Spot API] Authorization failed - no admin role');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Supabaseからスポットを削除
    await deleteSpot(id);
    
    console.log('✅ [Spot API] Spot deleted successfully:', id);
    
    return NextResponse.json({ 
      success: true 
    });

  } catch (error) {
    console.error('❌ [Spot API] Error deleting spot:', error);
    return NextResponse.json({ 
      error: 'Failed to delete spot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}