"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Create a Supabase client for the browser
  const supabase = createPagesBrowserClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}