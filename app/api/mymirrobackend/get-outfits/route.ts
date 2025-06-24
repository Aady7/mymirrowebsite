import { NextRequest, NextResponse } from "next/server";
export async function GET (req:NextRequest){
    const {searchParams}= new URL(req.url);
    const userId= searchParams.get('user_id');
    const limit = searchParams.get('limit');
    const min_score = searchParams.get('min_score');
    const style = searchParams.get('style');
    if (!userId) {
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
      }
      // Build full query string
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', limit);
  if (min_score) queryParams.append('min_score', min_score);
  if (style) queryParams.append('style', style);

  const apiUrl=`${process.env.NEXT_PUBLIC_BASE_URL}/outfits/${userId}?${queryParams.toString()}`;
  try{
    const res= await fetch(apiUrl, {
        method:'GET',
        headers:{
            accept: 'application/json',
        }

    })
    const data= await res.json();
    return NextResponse.json(data,{ status:res.status});

  }
  catch(err){
    console.error('Error in fetching outfits: ', err);
    return NextResponse.json({error:'some error occured while fetching outfits'}, {status:500});
  }


}