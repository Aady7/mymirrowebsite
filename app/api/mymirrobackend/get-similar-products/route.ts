import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  const count = searchParams.get('count');
  const diverse = searchParams.get('diverse') ?? 'true';
  const personalized = searchParams.get('personalized') ?? 'false';

  console.log('query params →', { productId, count, diverse, personalized });

  if (!productId) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  }

  const backendUrl = `${process.env.API_BASE_URL}/products/${productId}/similar?count=${count ?? 10}&diverse=${diverse}&personalized=${personalized}`;
  console.log('➡️ Calling MyMirro API:', backendUrl);

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Failed to fetch similar products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

