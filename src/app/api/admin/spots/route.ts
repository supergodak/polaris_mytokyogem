import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAllSpotsForAdmin } from '@/lib/supabase-data';

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

// 管理画面用スポット一覧取得API（非表示スポットも含む）- Supabase対応
export async function GET() {
  console.log('🔧 [Admin Spots API] GET request received');
  
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [Admin Spots API] Authorization failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Supabaseから全スポット取得（非表示含む）
    const spots = await getAllSpotsForAdmin();
    
    console.log(`✅ [Admin Spots API] Retrieved ${spots.length} spots for admin`);
    
    // JSONファイル形式に合わせて返す
    const response = {
      spots,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ [Admin Spots API] Error fetching admin spots:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch spots',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}