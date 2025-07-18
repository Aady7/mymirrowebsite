import { useState } from "react";

interface PhonePePaymentResponse {
  orderId: string;
  state: string;
  redirectUrl: string;
  expiresAt: number;
}

export function usePhonePePayment(authToken: string | null, orderId: string | null, amount: number) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [status, setStatus] = useState("Idle");

  const createPayment = async () => {
    if (!authToken) {
      setStatus("Please authenticate first");
      return;
    }

    if (!orderId) {
      setStatus("Order ID is required");
      return;
    }

    if (!amount || amount <= 0) {
      setStatus("Invalid amount");
      return;
    }

    setPaymentLoading(true);
    setStatus("Initiating payment...");

    try {
      console.log("Creating payment with:", { token: authToken, merchantOrderId: orderId, amount: amount * 100 });
      
      const res = await fetch("/api/phonepe/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: authToken, 
          merchantOrderId: orderId, 
          amount: Math.round(amount * 100) // Convert to paise and ensure it's an integer
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: PhonePePaymentResponse = await res.json();
      console.log("Payment response:", data);

      if (data.state === "PENDING") {
        setStatus("Payment initiated! Opening PhonePe IFRAME...");

        const script = document.createElement("script");
        script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.PhonePeCheckout) {
            window.PhonePeCheckout.transact({
              tokenUrl: data.redirectUrl,
              callback: (response: string) => {
                console.log("Payment callback:", response);
                setStatus(response === "USER_CANCEL" ? "Cancelled" : "Success");
              },
              type: "IFRAME",
            });
          } else {
            setStatus("PhonePe checkout script failed to load");
          }
        };

        script.onerror = () => {
          setStatus("Failed to load PhonePe checkout script");
        };
      } else {
        setStatus("Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("Error initiating payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  return { createPayment, paymentLoading, status };
}

// Add type declaration for PhonePeCheckout
declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (config: {
        tokenUrl: string;
        callback: (response: string) => void;
        type: string;
      }) => void;
    };
  }
}
