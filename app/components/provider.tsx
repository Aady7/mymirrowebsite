"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ReactNode } from "react";
import { useAuth } from '@/lib/hooks/useAuth';

export const CartContext = createContext<{ cartCount: number, refreshCart: () => void }>({ cartCount: 0, refreshCart: () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { getSession } = useAuth ? useAuth() : { getSession: async () => ({ session: null }) };

  const fetchCartCount = async () => {
    try {
      const { session } = await getSession();
      if (!session) return setCartCount(0);
      const supabase = createPagesBrowserClient();
      const { data: userData, error } = await supabase
        .from('users_updated')
        .select('cart_items')
        .eq('user_id', session.user.id)
        .single();
      if (error) return setCartCount(0);
      const items = userData?.cart_items ? JSON.parse(userData.cart_items) : [];
      setCartCount(items.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => { fetchCartCount(); }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart: fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  // Create a Supabase client for the browser
  const supabase = createPagesBrowserClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionContextProvider>
  );
}