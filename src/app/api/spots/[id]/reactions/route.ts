import { NextRequest, NextResponse } from 'next/server';
import { getSpotById, updateSpotReactions } from '@/lib/supabase-data';

// リアクション更新API
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { action, type } = await request.json();
    
    // バリデーション
    if (!action || !type) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action' 
      }, { status: 400 });
    }
    
    if (!['interested', 'visited'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid reaction type' 
      }, { status: 400 });
    }

    // 現在のスポットを取得
    const currentSpot = await getSpotById(id);
    
    if (!currentSpot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // リアクション数を更新
    const currentReactions = currentSpot.reactions || { interested: 0, visited: 0 };
    const newReactions = { ...currentReactions };
    
    if (action === 'add') {
      newReactions[type as keyof typeof newReactions] = (newReactions[type as keyof typeof newReactions] || 0) + 1;
    } else if (action === 'remove' && newReactions[type as keyof typeof newReactions] > 0) {
      newReactions[type as keyof typeof newReactions] = newReactions[type as keyof typeof newReactions] - 1;
    }

    // Supabaseでリアクションを更新
    const success = await updateSpotReactions(id, newReactions);
    
    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to update reactions' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      reactions: newReactions
    });

  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}