import { NextRequest, NextResponse } from 'next/server';
import { updateSpotReaction } from '@/lib/supabase-data';

// リアクション更新API（Supabase対応）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔧 [Reaction API] POST request for spot ID:', id);
  
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

    // Supabaseでリアクションを更新
    const updatedReactions = await updateSpotReaction(id, action, type);
    
    console.log('✅ [Reaction API] Reaction updated successfully:', {
      spotId: id,
      action,
      type,
      newReactions: updatedReactions
    });

    return NextResponse.json({ 
      success: true,
      reactions: updatedReactions
    });

  } catch (error) {
    console.error('❌ [Reaction API] Error updating reaction:', error);
    return NextResponse.json({ 
      error: 'Failed to update reaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}