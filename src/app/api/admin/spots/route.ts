import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { 
  createSpot, 
  updateSpot, 
  getSpotById, 
  uploadBase64ImageToSupabase 
} from '@/lib/supabase-data';
import { Spot } from '@/types/spot';

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

// Supabase経由でスポットを作成
export async function POST(request: NextRequest) {
  console.log('🔧 [Supabase API] POST request received');
  
  try {
    // 認証・認可チェック
    const session = await getServerSession(authOptions);
    console.log('👤 [Supabase API] Session:', session?.user?.email || 'No user');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [Supabase API] Authorization failed - no admin role');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let spot, images;
    try {
      const body = await request.json();
      spot = body.spot;
      images = body.images;
      console.log('📥 [Supabase API] Request body parsed:', {
        hasSpot: !!spot,
        imageCount: images?.length || 0
      });
    } catch (parseError) {
      console.error('❌ [Supabase API] Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      }, { status: 400 });
    }
    
    // バリデーション
    if (!spot?.title?.ja || !spot?.primaryCategory) {
      return NextResponse.json({ 
        error: 'Required fields missing' 
      }, { status: 400 });
    }

    // 新しいIDを生成
    const id = generateSpotId(spot.title.ja, spot.primaryCategory);
    
    // 画像をSupabase Storageにアップロード
    const imageUrls: string[] = [];
    
    if (images && images.length > 0) {
      console.log(`📸 [Supabase API] Processing ${images.length} images`);
      
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        console.log(`📸 [Supabase API] Processing image ${i + 1}:`, {
          type: typeof imageData,
          isString: typeof imageData === 'string',
          startsWithDataImage: typeof imageData === 'string' ? imageData.startsWith('data:image/') : false,
          length: typeof imageData === 'string' ? imageData.length : 0
        });
        
        // Base64データかチェック
        if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
          const base64Data = imageData.split(',')[1];
          const fileName = `${id}_${Date.now()}_${i}.jpg`;
          
          try {
            console.log(`📸 [Supabase API] Uploading image: ${fileName}`);
            const imageUrl = await uploadBase64ImageToSupabase(base64Data, fileName);
            imageUrls.push(imageUrl);
            console.log(`✅ [Supabase API] Image uploaded successfully: ${fileName} -> ${imageUrl}`);
          } catch (uploadError) {
            console.error(`❌ [Supabase API] Image upload failed: ${fileName}`, uploadError);
            // エラーの詳細をログ
            if (uploadError instanceof Error) {
              console.error('Error details:', {
                message: uploadError.message,
                stack: uploadError.stack
              });
            }
            // 画像アップロードの失敗はスポット作成をブロックしない
          }
        } else {
          console.warn(`⚠️ [Supabase API] Skipping invalid image data at index ${i}`);
        }
      }
      
      console.log(`📸 [Supabase API] Image processing completed. Uploaded: ${imageUrls.length}/${images.length}`);
    } else {
      console.log('📸 [Supabase API] No images to process');
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
    
    // Supabaseにスポットを保存
    const savedSpot = await createSpot(newSpot);
    
    console.log('✅ [Supabase API] Spot created successfully:', savedSpot.id);
    
    return NextResponse.json({ 
      success: true, 
      spot: savedSpot,
      message: 'Spot created successfully and saved to Supabase.'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ [Supabase API] Error creating spot:', error);
    
    // エラーの詳細をログ
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create spot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// スポットを更新
export async function PUT(request: NextRequest) {
  console.log('🔧 [Supabase API] PUT request received');
  
  try {
    // 認証・認可チェック
    const session = await getServerSession(authOptions);
    console.log('👤 [Supabase API] Session:', session?.user?.email || 'No user');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== 'admin') {
      console.error('❌ [Supabase API] Authorization failed - no admin role');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let id, spot, images;
    try {
      const body = await request.json();
      id = body.id;
      spot = body.spot;
      images = body.images;
      console.log('📥 [Supabase API] PUT request body parsed:', {
        id,
        hasSpot: !!spot,
        imageCount: images?.length || 0
      });
    } catch (parseError) {
      console.error('❌ [Supabase API] Failed to parse PUT request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      }, { status: 400 });
    }
    
    // 既存のスポットを確認
    const existingSpot = await getSpotById(id);
    if (!existingSpot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }
    
    // 画像の処理
    const imageUrls: string[] = [...(spot.images || [])];
    
    if (images && images.length > 0) {
      console.log(`📸 [Supabase API] Processing ${images.length} images for update`);
      
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        console.log(`📸 [Supabase API] Processing update image ${i + 1}:`, {
          type: typeof imageData,
          isString: typeof imageData === 'string',
          startsWithDataImage: typeof imageData === 'string' ? imageData.startsWith('data:image/') : false,
          length: typeof imageData === 'string' ? imageData.length : 0
        });
        
        if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
          // 新しい画像
          const base64Data = imageData.split(',')[1];
          const fileName = `${id}_${Date.now()}_${i}.jpg`;
          
          try {
            console.log(`📸 [Supabase API] Uploading update image: ${fileName}`);
            const imageUrl = await uploadBase64ImageToSupabase(base64Data, fileName);
            imageUrls.push(imageUrl);
            console.log(`✅ [Supabase API] Update image uploaded successfully: ${fileName} -> ${imageUrl}`);
          } catch (uploadError) {
            console.error(`❌ [Supabase API] Update image upload failed: ${fileName}`, uploadError);
            if (uploadError instanceof Error) {
              console.error('Upload error details:', {
                message: uploadError.message,
                stack: uploadError.stack
              });
            }
            // 画像アップロードの失敗は更新をブロックしない
          }
        } else {
          console.warn(`⚠️ [Supabase API] Skipping invalid update image data at index ${i}`);
        }
      }
      
      console.log(`📸 [Supabase API] Update image processing completed. Total images: ${imageUrls.length}`);
    } else {
      console.log('📸 [Supabase API] No new images to process for update');
    }
    
    // スポットを更新
    const updatedData = {
      ...spot,
      images: imageUrls,
    };
    
    const updatedSpot = await updateSpot(id, updatedData);
    
    console.log('✅ [Supabase API] Spot updated successfully:', updatedSpot.id);
    
    return NextResponse.json({ 
      success: true,
      spot: updatedSpot,
      message: 'Spot updated successfully in Supabase.'
    });

  } catch (error) {
    console.error('❌ [Supabase API] Error updating spot:', error);
    
    // エラーの詳細をログ
    if (error instanceof Error) {
      console.error('Update error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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