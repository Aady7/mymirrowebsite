import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { visibility, userId } = await request.json();

    // Validate input
    if (typeof visibility !== 'number' || (visibility !== 0 && visibility !== 1)) {
      return NextResponse.json(
        { error: 'Invalid visibility value. Must be 0 (private) or 1 (public)' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, verify that the user owns this lookbook
    const { data: lookbook, error: fetchError } = await supabase
      .from('lookbook')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching lookbook:', fetchError);
      return NextResponse.json(
        { error: 'Lookbook not found' },
        { status: 404 }
      );
    }

    if (lookbook.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only modify your own lookbooks' },
        { status: 403 }
      );
    }

    // Update the visibility
    const { data, error } = await supabase
      .from('lookbook')
      .update({ visibility })
      .eq('id', id)
      .eq('user_id', userId) // Double-check ownership
      .select()
      .single();

    if (error) {
      console.error('Error updating lookbook privacy:', error);
      return NextResponse.json(
        { error: 'Failed to update lookbook privacy' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        visibility: data.visibility,
        message: visibility === 1 ? 'Lookbook is now public' : 'Lookbook is now private'
      }
    });

  } catch (error) {
    console.error('Error in privacy update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
