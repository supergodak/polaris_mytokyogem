import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

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

    // アップロードディレクトリを作成（存在しない場合）
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      // ディレクトリが既に存在する場合はエラーを無視
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      // ファイル名の生成（タイムスタンプ + オリジナル名）
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${originalName}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

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
        // ファイルを保存
        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));
        
        // 公開URLを生成
        const publicUrl = `/uploads/${fileName}`;
        uploadedFiles.push(publicUrl);
      } catch (error) {
        console.error(`Error saving file ${file.name}:`, error);
        return NextResponse.json({ 
          error: `Failed to save file ${file.name}` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      urls: uploadedFiles 
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading files:', error);
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