import { NextRequest, NextResponse } from "next/server";

interface PhonePeRefundResponse {
  refundId: string;
  amount: number;
  state: "PENDING" | "COMPLETED" | "FAILED";
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    const refundBody = {
      merchantRefundId: `refund_${Date.now()}`,
      originalMerchantOrderId: "newtxn123456",
      amount: 1234,
    };

    console.log("Creating refund with body:", refundBody);

    const res = await fetch(
      `https://api-preprod.phonepe.com/apis/pg-sandbox/payments/v2/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
        body: JSON.stringify(refundBody),
      }
    );

    const data: PhonePeRefundResponse = await res.json();
    console.log("PhonePe refund response:", data);
    
    // PhonePe returns refundId, amount, and state
    if (data.refundId && data.state) {
      return NextResponse.json({ 
        success: true,
        refundId: refundBody.merchantRefundId, // Use our merchantRefundId for status checks
        amount: data.amount,
        state: data.state,
        message: `Refund ${data.state.toLowerCase()}: ${data.refundId}`
      });
    } else {
      console.error("Invalid refund response:", data);
      return NextResponse.json({ 
        success: false, 
        message: "Invalid refund response",
        error: data 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
