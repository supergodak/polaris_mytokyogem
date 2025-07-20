import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getFileContent, createCommitWithFiles } from '@/lib/github';
import { Spot } from '@/types/spot';

// NextAuth設定をインポート
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

// GitHub経由でスポットを作成
export async function POST(request: NextRequest) {
  console.log('🔧 [GitHub API] POST request received');
  
  try {
    // 認証・認可チェック
    const session = await getServerSession(authOptions);
    console.log('👤 [GitHub API] Session:', session?.user?.email || 'No user');
    console.log('🔐 [GitHub API] Full session:', JSON.stringify(session, null, 2));
    console.log('👮 [GitHub API] User object:', JSON.stringify(session?.user, null, 2));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [GitHub API] Authorization failed - no admin role');
      console.error('📋 Session details:', {
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userRole: (session?.user as any)?.role,
        sessionKeys: session ? Object.keys(session) : []
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { spot, images } = await request.json();
    
    // バリデーション
    if (!spot.title?.ja || !spot.primaryCategory) {
      return NextResponse.json({ 
        error: 'Required fields missing' 
      }, { status: 400 });
    }

    // 現在のspots.jsonを取得
    const { content: spotsContent } = await getFileContent('data/spots.json');
    const spotsData = JSON.parse(spotsContent);
    
    // 新しいIDを生成
    const id = generateSpotId(spot.title.ja, spot.primaryCategory);
    
    // 画像URLを生成
    const imageUrls: string[] = [];
    const imageFiles: Array<{ path: string; content: Buffer; encoding: 'base64' }> = [];
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        const fileName = `${id}_${Date.now()}_${i}.jpg`;
        const imagePath = `public/uploads/${fileName}`;
        const imageUrl = `/uploads/${fileName}`;
        
        imageUrls.push(imageUrl);
        imageFiles.push({
          path: imagePath,
          content: Buffer.from(imageData, 'base64'),
          encoding: 'base64',
        });
      }
    }
    
    // 新しいスポットデータを作成
    const newSpot: Spot = {
      id,
      title: spot.title,
      description: spot.description,
      shortDescription: spot.shortDescription,
      images: imageUrls,
      location: {
        lat: spot.location.lat,
        lng: spot.location.lng,
        hideExactLocation: spot.location.hideExactLocation || false,
        address: spot.location.address
      },
      primaryCategory: spot.primaryCategory,
      genre: spot.genre || [],
      travelStyle: spot.travelStyle || [],
      soloFriendly: spot.soloFriendly || false,
      businessHours: spot.businessHours || { ja: '', en: '' },
      access: spot.access || { ja: '', en: '' },
      tips: spot.tips || { ja: '', en: '' },
      isHidden: spot.isHidden || false,
      reactions: {
        interested: 0,
        visited: 0
      },
      createdBy: 'ひとりあそび研究所',
      createdAt: new Date().toISOString()
    };
    
    // スポットリストに追加
    spotsData.spots.push(newSpot);
    spotsData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // ファイルリストを作成
    const files = [
      {
        path: 'data/spots.json',
        content: JSON.stringify(spotsData, null, 2),
        encoding: 'utf-8' as const,
      },
      ...imageFiles,
    ];
    
    // GitHubにコミット
    const commitMessage = `Add new spot: ${spot.title.ja}

Added via admin panel by ${session.user.email || 'admin'}`;
    
    await createCommitWithFiles(files, commitMessage);
    
    return NextResponse.json({ 
      success: true, 
      spot: newSpot,
      message: 'Spot created successfully. It will appear on the site in 2-3 minutes.'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ [GitHub API] Error creating spot:', error);
    
    // GitHub API特有のエラーを詳細に記録
    if (error && typeof error === 'object' && 'status' in error) {
      const githubError = error as { status?: number; message?: string };
      console.error('GitHub API Error Status:', githubError.status);
      console.error('GitHub API Error Message:', githubError.message);
    }
    
    // 環境変数の問題かチェック
    if (error instanceof Error && error.message.includes('GitHub token')) {
      return NextResponse.json({ 
        error: 'GitHub configuration error',
        details: 'GitHub token is not configured. Please check Netlify environment variables.',
        required: ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO']
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create spot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// スポットを更新
export async function PUT(request: NextRequest) {
  console.log('🔧 [GitHub API] PUT request received');
  
  try {
    // 認証・認可チェック
    const session = await getServerSession(authOptions);
    console.log('👤 [GitHub API] Session:', session?.user?.email || 'No user');
    console.log('🔐 [GitHub API] Full session:', JSON.stringify(session, null, 2));
    console.log('👮 [GitHub API] User object:', JSON.stringify(session?.user, null, 2));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [GitHub API] Authorization failed - no admin role');
      console.error('📋 Session details:', {
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userRole: (session?.user as any)?.role,
        sessionKeys: session ? Object.keys(session) : []
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, spot, images } = await request.json();
    
    // 現在のspots.jsonを取得
    const { content: spotsContent } = await getFileContent('data/spots.json');
    const spotsData = JSON.parse(spotsContent);
    
    // スポットを検索
    const spotIndex = spotsData.spots.findIndex((s: Spot) => s.id === id);
    if (spotIndex === -1) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }
    
    // 画像の処理
    const imageUrls: string[] = [...(spot.images || [])];
    const imageFiles: Array<{ path: string; content: Buffer; encoding: 'base64' }> = [];
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
          // 新しい画像
          const base64Data = imageData.split(',')[1];
          const fileName = `${id}_${Date.now()}_${i}.jpg`;
          const imagePath = `public/uploads/${fileName}`;
          const imageUrl = `/uploads/${fileName}`;
          
          imageUrls.push(imageUrl);
          imageFiles.push({
            path: imagePath,
            content: Buffer.from(base64Data, 'base64'),
            encoding: 'base64',
          });
        }
      }
    }
    
    // スポットを更新
    spotsData.spots[spotIndex] = {
      ...spotsData.spots[spotIndex],
      ...spot,
      images: imageUrls,
      id, // IDは変更不可
    };
    
    spotsData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // ファイルリストを作成
    const files = [
      {
        path: 'data/spots.json',
        content: JSON.stringify(spotsData, null, 2),
        encoding: 'utf-8' as const,
      },
      ...imageFiles,
    ];
    
    // GitHubにコミット
    const commitMessage = `Update spot: ${spot.title.ja}

Updated via admin panel by ${session.user.email || 'admin'}`;
    
    await createCommitWithFiles(files, commitMessage);
    
    return NextResponse.json({ 
      success: true,
      spot: spotsData.spots[spotIndex],
      message: 'Spot updated successfully. Changes will appear on the site in 2-3 minutes.'
    });

  } catch (error) {
    console.error('❌ [GitHub API] Error updating spot:', error);
    
    // GitHub API特有のエラーを詳細に記録
    if (error && typeof error === 'object' && 'status' in error) {
      const githubError = error as { status?: number; message?: string };
      console.error('GitHub API Error Status:', githubError.status);
      console.error('GitHub API Error Message:', githubError.message);
    }
    
    // 環境変数の問題かチェック
    if (error instanceof Error && error.message.includes('GitHub token')) {
      return NextResponse.json({ 
        error: 'GitHub configuration error',
        details: 'GitHub token is not configured. Please check Netlify environment variables.',
        required: ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO']
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update spot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ID生成ヘルパー関数
function generateSpotId(title: string, category: string): string {
  const safeTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 20);
  
  const categoryPrefix = category.slice(0, 4);
  const timestamp = Date.now().toString().slice(-6);
  
  return `${categoryPrefix}-${safeTitle}-${timestamp}`;
}