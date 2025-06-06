'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import AuthNav from './authNav'
import RootNav from './rootNav'
import { supabase } from '@/lib/supabase'

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [getSession])

  if (isLoading) {
    return (
      <nav className="bg-white shadow-md h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </nav>
    )
  }

  return isAuthenticated ? <RootNav /> : <AuthNav />
}

export default ConditionalNav 