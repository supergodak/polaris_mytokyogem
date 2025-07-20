import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/supabase';

// 画像アップロードAPI
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ 
        error: 'No files uploaded' 
      }, { status: 400 });
    }

    // Supabase Storageのバケット名
    const bucketName = 'spot-images';

    const uploadedFiles: string[] = [];

    for (const file of files) {
      // ファイル名の生成（タイムスタンプ + オリジナル名）
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${originalName}`;

      // ファイルサイズチェック（10MB制限）
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ 
          error: `File ${file.name} is too large. Maximum size is 10MB.` 
        }, { status: 400 });
      }

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ 
          error: `File ${file.name} is not an image.` 
        }, { status: 400 });
      }

      try {
        // ファイルをSupabase Storageにアップロード
        const buffer = await file.arrayBuffer();
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return NextResponse.json({ 
            error: `Failed to upload file ${file.name}: ${error.message}` 
          }, { status: 500 });
        }

        // 公開URLを生成
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        
        uploadedFiles.push(publicUrl);
      } catch (saveError) {
        console.error(`Error saving file ${file.name}:`, saveError);
        return NextResponse.json({ 
          error: `Failed to save file ${file.name}` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      urls: uploadedFiles 
    }, { status: 200 });

  } catch (uploadError) {
    console.error('Error uploading files:', uploadError);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// アップロード可能なファイル形式一覧
export async function GET() {
  return NextResponse.json({
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: '10MB',
    maxFiles: 5
  });
}