"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface PhonePeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PhonePePaymentResponse {
  orderId: string;
  state: string;
  redirectUrl: string;
  expiresAt: number;
}

// Add type definition for PhonePeCheckout
declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: {
        tokenUrl: string;
        callback: (response: 'USER_CANCEL' | 'CONCLUDED') => void;
        type: string;
      }) => void;
    };
  }
}

// At the top of the file, add this type
type PaymentStatus = 
  | "Ready to start"
  | "Payment concluded successfully"
  | "Refund pending"
  | "Refund completed"
  | "Refund failed"
  | "Payment cancelled by user"
  | "Payment failed"
  | "Payment pending"
  | "Payment expired"
  | "Payment status unknown"
  | "Fetching authentication token..."
  | "Authentication successful!"
  | "Authentication failed!"
  | "Authentication error occurred!"
  | "Please authenticate first!"
  | "Initiating payment..."
  | "Payment initiated successfully! Redirecting..."
  | "Payment initiation failed!"
  | "Payment error occurred!"
  | "Error verifying payment"
  | "No Auth"
  | `Payment successful! Amount: ${number}`;

interface RefundResponse {
  success: boolean;
  refundId: string;
  amount: number;
  state: "PENDING" | "COMPLETED" | "FAILED";
  message?: string;
  error?: any;
}

interface PaymentDetail {
  amount: number;
  paymentMethod: string;
  utr: string;
  transactionId: string;
  vpa: string;
  accountType: string;
  maskedAccount: string;
}

interface RefundStatusResponse {
  success: boolean;
  refundId: string;
  originalMerchantOrderId: string;
  amount: number;
  state: "PENDING" | "COMPLETED" | "FAILED";
  timestamp: number;
  paymentDetails: PaymentDetail[];
  message?: string;
  error?: any;
}

const Checkout = () => {
  const { id } = useParams();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<PaymentStatus>("Ready to start");
  const[vLoading, setVloading]=useState<boolean>(false);
  const[orderID, setOrderID]=useState<string| null>(null);
  const [refundLoading, setRefundLoading] = useState<boolean>(false);
  const [refundStatus, setRefundStatus] = useState<string>("");
  const [merchantRefundId, setMerchantRefundId] = useState<string | null>(null);
  const [refundStatusLoading, setRefundStatusLoading] = useState(false);
  const [refundDetails, setRefundDetails] = useState<PaymentDetail[] | null>(null);
  const [canCheckStatus, setCanCheckStatus] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const merchantOrderId=process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ORDER_ID;

  const fetchAuthToken = async () => {
    setAuthLoading(true);
    setStatus("Fetching authentication token...");
    try {
      const response = await fetch("/api/phonepe/get-auth-token", {
        method: "POST",
      });
      const data: PhonePeResponse = await response.json();
      if (data.access_token) {
        setAuthToken(data.access_token);
        setStatus("Authentication successful!");
      } else {
        setError(true);
        setStatus("Authentication failed!");
      }
    } catch (err) {
      setError(true);
      setStatus("Authentication error occurred!");
    } finally {
      setAuthLoading(false);
    }
  };
  


  const createPayment = async () => {
    if (!authToken) {
      setStatus("Please authenticate first!");
      return;
    }
  
    setPaymentLoading(true);
    setStatus("Initiating payment...");
    try {
      const response = await fetch("/api/phonepe/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authToken }),
      });
  
      const data: PhonePePaymentResponse = await response.json();
      if (data.state === "PENDING") {
        setStatus("Payment initiated successfully! Redirecting...");
        setOrderID(data.orderId);
  
        const script = document.createElement("script");
        script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
        script.async = true;
        document.body.appendChild(script);
  
        script.onload = () => {
          window.PhonePeCheckout.transact({
            tokenUrl: data.redirectUrl,
            callback: (response) => {
              if (response === "USER_CANCEL") setStatus("Payment cancelled by user");
              else if (response === "CONCLUDED") setStatus("Payment concluded successfully");
            },
            type: "IFRAME",
          });
        };
      } else {
        setError(true);
        setStatus("Payment initiation failed!");
      }
    } catch (err) {
      setError(true);
      setStatus("Payment error occurred!");
    } finally {
      setPaymentLoading(false);
    }
  };
  

  const varifyPayment = async () => {
    setVloading(true);
    if (!authToken) {
      setStatus("No Auth");
      return;
    }
    try {
      const response = await fetch("/api/phonepe/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authToken }),
      });
  
      const data = await response.json();
      if (data.state === "COMPLETED") {
        setStatus(`Payment successful! Amount: ${data.amount}`);
      } else if (data.state === "FAILED") {
        setStatus("Payment failed");
      } else if (data.state === "PENDING") {
        setStatus("Payment pending");
      } else if (data.state === "EXPIRED") {
        setStatus("Payment expired");
      } else {
        setStatus("Payment status unknown");
      }
    } catch (err) {
      setError(true);
      setStatus("Error verifying payment");
    } finally {
      setVloading(false);
    }
  };
  

  // Refund function
  const createRefund = async () => {
    if (!authToken) {
      setRefundStatus("Authentication token required");
      return;
    }

    setRefundLoading(true);
    setRefundStatus("Initiating refund...");
    try {
      console.log("Making refund request...");
      const response = await fetch("/api/phonepe/create-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authToken }),
      });

      const data: RefundResponse = await response.json();
      console.log("Refund response:", data);
      
      if (response.ok && data.success) {
        const statusMessage = `Refund ${data.state.toLowerCase()}: ID ${data.refundId}`;
        console.log("Setting refund status:", statusMessage);
        setRefundStatus(`✅ ${statusMessage}`);
        
        // Store the refund ID and enable status checking
        console.log("Setting merchantRefundId:", data.refundId);
        setMerchantRefundId(data.refundId);
        console.log("Enabling status check button");
        setCanCheckStatus(true);
        
        switch (data.state) {
          case "PENDING":
            setStatus("Refund pending");
            break;
          case "COMPLETED":
            setStatus("Refund completed");
            break;
          case "FAILED":
            setStatus("Refund failed");
            break;
        }
      } else {
        setRefundStatus("❌ " + (data.message || "Refund request failed"));
        console.error("Refund error:", data.error);
      }
    } catch (err) {
      setRefundStatus("❌ An error occurred while processing refund");
      console.error("Refund error:", err);
    } finally {
      setRefundLoading(false);
    }
  };

  // Add a useEffect to monitor state changes
  useEffect(() => {
    console.log("State updated:", {
      canCheckStatus,
      merchantRefundId,
      refundStatus,
      status
    });
  }, [canCheckStatus, merchantRefundId, refundStatus, status]);

  // Function to check refund status
  //const checkRefundStatus = async (mRefundId: string) => {
  //  if (!authToken || !mRefundId) {
  //    setRefundStatus("❌ Missing required information for status check");
  //    return;
  //  }
//
//   setRefundStatusLoading(true);
//   try {
//     const response = await fetch(
//       `/api/phonepe/get-refund-status?merchantRefundId=${mRefundId}&token=${authToken}`
//     );
//
//     // Try to parse the response as JSON
//     let data: RefundStatusResponse;
//     try {
//       data = await response.json();
//     } catch (parseError) {
//       console.error("Failed to parse response:", parseError);
//       setRefundStatus("❌ Invalid response from server");
//       return;
//     }
//
//     if (response.ok && data.success) {
//       const statusMessage = `Refund ${data.state.toLowerCase()}: ID ${data.refundId}`;
//       setRefundStatus(`✅ ${statusMessage}`);
//       setLastChecked(new Date().toLocaleString());
//       
//       if (data.paymentDetails && data.paymentDetails.length > 0) {
//         setRefundDetails(data.paymentDetails);
//       }
//       
//       switch (data.state) {
//         case "PENDING":
//           setStatus("Refund pending");
//           break;
//         case "COMPLETED":
//           setStatus("Refund completed");
//           break;
//         case "FAILED":
//           setStatus("Refund failed");
//           break;
//       }
//     } else {
//       const errorMessage = data.message || "Failed to fetch refund status";
//       console.error("Refund status error:", data.error);
//       setRefundStatus(`❌ ${errorMessage}`);
//       
//       // If we get a specific error about the refund ID not being found,
//       // we should disable the check status button
//       if (response.status === 404 || errorMessage.includes("not found")) {
//         setCanCheckStatus(false);
//       }
//     }
//   } catch (err) {
//     console.error("Error checking refund status:", err);
//     setRefundStatus("❌ Network error while checking refund status");
//   } finally {
//     setRefundStatusLoading(false);
//   }
// };

  // Manual check refund status
// const handleManualStatusCheck = () => {
//   if (!authToken) {
//     setRefundStatus("❌ Authentication token required");
//     return;
//   }
//   setRefundStatus("Checking refund status...");
//   // If no refund ID exists, use a default test value
//   const refundIdToCheck = merchantRefundId || "refund_test123";
//   checkRefundStatus(refundIdToCheck);
// };

const checkRefundStatus = async () => {
  setStatus("Checking refund status...");
  try {
    const res = await fetch("/api/phonepe/get-refund-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: authToken,
        merchantRefundId: merchantRefundId, // from your frontend state or URL
      }),
    });

    const data = await res.json();

    if (data) {
      console.log(data);
      setStatus(`Refund status: ${data.data.state}`);
    } else {
      setStatus(`Refund check failed: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    setStatus("Refund status check failed");
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8">PhonePe Payment Test</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <button
              onClick={fetchAuthToken}
              disabled={authLoading || !!authToken}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                authLoading || authToken
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {authLoading ? "Authenticating..." : "Step 1: Get Auth Token"}
            </button>
            
            <button
              onClick={createPayment}
              disabled={paymentLoading || !authToken}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                paymentLoading || !authToken
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {paymentLoading ? "Processing..." : "Step 2: Initiate Payment"}
            </button>
          </div>

          <div className="mt-4 p-4 rounded-md bg-gray-50">
            <p className="text-sm font-medium text-gray-700">Status:</p>
            <p className={`text-sm ${
              error ? "text-red-600" : 
              status.includes("successful") ? "text-green-600" : 
              "text-gray-600"
            }`}>
              {status || "Ready to start"}
            </p>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-md bg-red-50">
              <p className="text-sm text-red-600">
                An error occurred. Please try again.
              </p>
            </div>
            
          )}
          {status === "Payment concluded successfully" && (
            <div className="mt-4 p-4 rounded-md bg-green-50">
              <p className="text-sm text-green-600">
                Payment concluded successfully.
              </p>
              
              {/* Always show both buttons */}
              <div className="space-y-4">
                {/* Refund Button */}
                <button
                  onClick={createRefund}
                  disabled={refundLoading || refundStatusLoading}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium ${
                    refundLoading || refundStatusLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {refundLoading 
                    ? "Processing Refund..." 
                    : "Initiate Refund"
                  }
                </button>

                {/* Check Status Button - Always visible */}
 

                {/* Refund Status */}
                {refundStatus && (
                  <div className={`mt-2 p-2 rounded text-sm ${
                    refundStatus.startsWith("✅")
                      ? "bg-green-100 text-green-700"
                      : refundStatus.startsWith("❌")
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}>
                    {refundStatus}
                    {lastChecked && (
                      <div className="mt-1 text-xs text-gray-500">
                        Last checked: {lastChecked}
                      </div>
                    )}
                  </div>
                )}

                {/* Refund Details */}
                {refundDetails && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium text-gray-900">Refund Details</h3>
                    {refundDetails.map((detail, index) => (
                      <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Amount:</div>
                          <div className="text-gray-900">₹{detail.amount / 100}</div>
                          
                          <div className="text-gray-600">Payment Method:</div>
                          <div className="text-gray-900">{detail.paymentMethod}</div>
                          
                          <div className="text-gray-600">UTR:</div>
                          <div className="text-gray-900">{detail.utr}</div>
                          
                          <div className="text-gray-600">Transaction ID:</div>
                          <div className="text-gray-900">{detail.transactionId}</div>
                          
                          <div className="text-gray-600">VPA:</div>
                          <div className="text-gray-900">{detail.vpa}</div>
                          
                          <div className="text-gray-600">Account Type:</div>
                          <div className="text-gray-900">{detail.accountType}</div>
                          
                          <div className="text-gray-600">Account:</div>
                          <div className="text-gray-900">{detail.maskedAccount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={varifyPayment}
            disabled={vLoading || !orderID}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              vLoading || !orderID ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          ></button>
                         <button
  onClick={checkRefundStatus}
  disabled={!authToken || !merchantRefundId}
  className="bg-purple-600 text-white px-4 py-2 rounded-md"
>
  Check Refund Status
</button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

