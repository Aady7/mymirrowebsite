import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categories = searchParams.get('categories')?.split(',') || [];
    const gender = searchParams.get('gender');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build the query
    let query = supabase
      .from('outfits_v2')
      .select(`
        id,
        category,
        top_id,
        bottom_id,
        rank,
        gender,
        top:products_v2!outfits_v2_top_id_fkey(
          id,
          title,
          image,
          price,
          brand
        ),
        bottom:products_v2!outfits_v2_bottom_id_fkey(
          id,
          title,
          image,
          price,
          brand
        )
      `);

    // Filter by categories if provided
    if (categories.length > 0 && categories[0] !== '') {
      query = query.in('category', categories);
    }

    // Filter by gender if provided
    if (gender) {
      query = query.eq('gender', gender);
    }

    // Order by rank and apply pagination
    query = query
      .order('rank', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch outfits', details: error.message },
        { status: 500 }
      );
    }

    // Format the response
    const formattedOutfits = (data || []).map(outfit => ({
      id: outfit.id,
      category: outfit.category,
      top_id: outfit.top_id,
      bottom_id: outfit.bottom_id,
      rank: outfit.rank,
      top: Array.isArray(outfit.top) ? outfit.top[0] : outfit.top,
      bottom: Array.isArray(outfit.bottom) ? outfit.bottom[0] : outfit.bottom,
    }));

    return NextResponse.json({
      outfits: formattedOutfits,
      total: formattedOutfits.length,
      hasMore: formattedOutfits.length === limit
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
