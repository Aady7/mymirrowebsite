import { NextResponse } from "next/server";
import { useState } from "react";

export function usePhonePeAuth() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("Idle");

  const fetchAuthToken = async () => {
    setAuthLoading(true);
    setStatus("Fetching authentication token...");

    try {
      const response = await fetch("/api/phonepe/get-auth-token", { method: "POST" });
      const data = await response.json();
      if (data.access_token) {
        setAuthToken(data.access_token);
        setStatus("Authentication successful!");
      } else {
        setError(true);
        setStatus("Authentication failed!");
      }
    } catch {
      setError(true);
      setStatus("Error fetching token");
    } finally {
      setAuthLoading(false);
    }
  };
 

  return { authToken, fetchAuthToken, authLoading, error, status };
}
