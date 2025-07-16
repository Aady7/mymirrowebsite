// app/api/phonepe/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const res = await fetch('https://api.phonepe.com/apis/pg/checkout/v2/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify({
      merchantOrderId:`txn_${Date.now()}`,
      amount: 100,
      expireAfter:3600,
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
          redirectUrl: 'https://www.mymirror.in/checkout', // change this in prod
        },
      },
      "paymentModeConfig": {
        "enabledPaymentModes": [
            {
                "type": "UPI_INTENT"
            },
            {
                "type": "UPI_COLLECT"
            },
            {
                "type": "UPI_QR"
            },
            {
                "type": "NET_BANKING"
            },
            {
                "type": "CARD",
                "cardTypes": [
                    "DEBIT_CARD",
                    "CREDIT_CARD"
                ]
            }
        ],
      },


      
        
      
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
