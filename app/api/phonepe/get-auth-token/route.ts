// app/api/phonepe/get-auth-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formBody = new URLSearchParams();
  formBody.append('client_id',process.env.NEXT_PUBLIC_PHONEPE_CLIENT_ID!);
  formBody.append('client_version', process.env.NEXT_PUBLIC_PHONEPE_CLIENT_VERSION!);
  formBody.append('client_secret', process.env.NEXT_PUBLIC_PHONEPE_CLIENT_SECRET!);
  formBody.append('grant_type', 'client_credentials');

  const res = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody.toString(),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
