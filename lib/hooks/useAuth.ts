import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'
import { AuthError } from '@supabase/supabase-js'

export const useAuth = () => {
  const router = useRouter()

  const signInUser = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in...')
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }

      console.log('Sign in successful:', data)

      // Manually redirect after successful sign-in
      window.location.href = '/style-quiz'
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
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Force navigation to sign-in page
      window.location.href = '/sign-in'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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