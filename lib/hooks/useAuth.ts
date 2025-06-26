import { AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export const useAuth = () => {
  const router = useRouter()

  const signInUser = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }

      console.log('Sign in successful:', data)

      // Manually redirect after successful mobile-sign-in
      router.push('/recommendations');
      return { data, error: null }
      
    } catch (error) {
      console.error('Unexpected error during sign in:', error)
      return { data: null, error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { data: null, error }
      }
      const { user } = data
      const { error: insertError } = await supabase
        .from('users')
        .upsert([
          {
            email: user?.email,
            userid:user?.id,              
            created_at: new Date().toISOString(),
          },
        ], {
          onConflict: 'userid',
          ignoreDuplicates: false
        })
        if (insertError) {
          console.error('Error inserting user into database:', insertError)
          return { data: null, error: insertError }
        }
      console.log('User inserted into database:', user?.id)
      console.log('Sign up successful:', data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      // Import cache utility and clear all user data
      const { cache } = await import('../utils/cache');
      cache.clearAllUserData();
  
      // Sign out from Supabase (this will also clear auth tokens and cookies)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
  
      console.log('Successfully cleared all user data and signed out');
      
      // Redirect to mobile-sign-in page
      router.push('/mobile-sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, try to clear data and redirect
      try {
        const { cache } = await import('../utils/cache');
        cache.clearAllUserData();
        router.push('/mobile-sign-in');
      } catch (fallbackError) {
        console.error('Fallback cleanup failed:', fallbackError);
      }
    }
  };
  

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        return { session: null, error }
      }
      
      console.log('Current session:', session)
      return { session, error: null }
    } catch (error) {
      console.error('Unexpected session error:', error)
      return { session: null, error: error as AuthError }
    }
  }

  return {
    signInUser,
    signUp,
    signOut,
    getSession,
  }
} 