// app/api/phonepe/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const res = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify({
      merchantOrderId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ORDER_ID,
      amount: 100,
      expireAfter: 1200,
      metaInfo: {
        udf1: 'test1',
        udf2: 'new param2',
        udf3: 'test3',
        udf4: 'dummy value 4',
        udf5: 'addition info ref1',
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Payment message',
        merchantUrls: {
          redirectUrl: 'http://localhost:3000/checkout', // change this in prod
        },
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
