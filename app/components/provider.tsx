"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactNode } from "react";
import { NotificationProvider } from './common/NotificationContext';
import NotificationContainer from './common/NotificationContainer';

console.log('🔥 PROVIDER FILE LOADED - CartProvider module initialization');

export const CartContext = createContext<{ cartCount: number, refreshCart: () => Promise<void> }>({ cartCount: 0, refreshCart: async () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  console.log('🎯 CartProvider component initialized');
  const [cartCount, setCartCount] = useState(0);
  const session = useSession();
  const supabase = useSupabaseClient();

  const fetchCartCount = useCallback(async () => {
    try {
      console.log('🔄 Fetching cart count...');
      console.log('📋 Session status:', !!session?.user, 'User ID:', session?.user?.id);
      
      if (!session?.user) {
        console.log('❌ No session available, setting cart count to 0');
        setCartCount(0);
        return;
      }

      const { data: userData, error } = await supabase
        .from('users_updated')
        .select('cart_items')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('❌ Error fetching cart items:', error);
        setCartCount(0);
        return;
      }

      const items = userData?.cart_items ? JSON.parse(userData.cart_items) : [];
      console.log('📦 Cart items found:', items.length, items);
      
      // Calculate total quantity (sum of all item quantities)
      const totalQuantity = items.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      console.log('🔢 Total cart quantity:', totalQuantity);
      
      setCartCount(totalQuantity);
    } catch (error) {
      console.error('❌ Cart fetch error:', error);
      setCartCount(0);
    }
  }, [session, supabase]);

  useEffect(() => { 
    console.log('🚀 CartProvider mounted, session available:', !!session?.user);
    // Fetch cart count whenever session changes
    fetchCartCount();
  }, [session, fetchCartCount]);

  // Create a refreshCart function that uses the current session from context
  const refreshCart = useCallback(async () => {
    console.log('🔄 refreshCart called, using session from context:', !!session?.user);
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  console.log('🌟 PROVIDERS COMPONENT RENDERING');
  // Create a Supabase client for the browser
  const supabase = createPagesBrowserClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <NotificationProvider>
        <CartProvider>
          {children}
          <NotificationContainer />
        </CartProvider>
      </NotificationProvider>
    </SessionContextProvider>
  );
}