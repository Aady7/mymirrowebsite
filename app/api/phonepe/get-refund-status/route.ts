import { NextRequest, NextResponse } from "next/server";
interface getRefundStatusResponse{
    originalMerchantOrderId: string;
    amount:number,
    state:"PENDING" | "CONFIRMED"| "COMPLETED" | "FAILED";
    timestamp:number;
    refundId:number;
    errorCode:"string"

}
export async function POST( req:NextRequest){
    const{token, merchantRefundId}= await req.json();
    if(!token|| !merchantRefundId){
        return NextResponse.json({error:"Missing token or merchant ID", status:400});
       
    }
    try{
        const res=await await fetch(
            `https://api-preprod.phonepe.com/apis/pg-sandbox/payments/v2/refund/${merchantRefundId}/status`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `O-Bearer ${token}`,
              },
            }
          );
         const data= await res.json();
         return NextResponse.json(data);

    }
    catch(err){
        NextResponse.json({error:"Failed fetch  refund status", staus:500}) 
    }


}