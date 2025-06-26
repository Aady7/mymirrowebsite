import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    console.log("Fetching single outfit for id:", id);
    
    if (!id) {
        return NextResponse.json({ error: "Missing outfit ID" }, { status: 400 });
    }
    
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/outfits/${id}`;
    console.log("API URL is:", apiUrl);

    try {
        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        });
        
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.log("Failed to fetch outfit:", err);
        return NextResponse.json({ error: 'Failed to fetch outfit' }, { status: 500 });
    }
} 