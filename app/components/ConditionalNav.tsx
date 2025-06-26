'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import AuthNav from './authNav'
import RootNav from './rootNav'
import { supabase } from '@/lib/supabase'
import SmartLoader from '@/app/components/loader/SmartLoader'

const ConditionalNav = () => {
  const { getSession } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial auth check
    const checkAuth = async () => {
      try {
        const { session } = await getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up real-time auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        // Clear all user data when signed out
        try {
          const { cache } = await import('@/lib/utils/cache');
          cache.clearAllUserData();
        } catch (error) {
          console.warn('Failed to clear user data on sign out:', error);
        }
      }
      
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [getSession])

  if (isLoading) {
    return <SmartLoader />
  }

  return isAuthenticated ? <RootNav /> : <AuthNav />
}

export default ConditionalNav 