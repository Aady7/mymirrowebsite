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


const Checkout = () => {
  const { id } = useParams();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const[vLoading, setVloading]=useState<boolean>(false);
  const[orderID, setOrderID]=useState<string| null>(null);

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
          {status==="Payment concluded successfully" && (
            <div className="mt-4 p-4 rounded-md bg-green-50">
              <p className="text-sm text-green-600">
                Payment concluded successfully.
              </p>
            </div>
          )}
          <button
            onClick={varifyPayment}
            disabled={vLoading || !orderID}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              vLoading || !orderID ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          ></button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

