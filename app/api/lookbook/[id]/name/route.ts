import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, userId } = await request.json();

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
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

    // Update the name
    const { data, error } = await supabase
      .from('lookbook')
      .update({ name: name.trim() })
      .eq('id', id)
      .eq('user_id', userId) // Double-check ownership
      .select()
      .single();

    if (error) {
      console.error('Error updating lookbook name:', error);
      return NextResponse.json(
        { error: 'Failed to update lookbook name' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        message: 'Lookbook name updated successfully'
      }
    });

  } catch (error) {
    console.error('Error in name update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
