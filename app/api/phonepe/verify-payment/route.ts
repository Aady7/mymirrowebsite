// app/api/phonepe/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const res = await fetch(
    `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ORDER_ID}/status`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
