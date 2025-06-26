'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import SmartLoader from '@/app/components/loader/SmartLoader'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { getSession } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!session || error) {
          console.log('No session found, redirecting to mobile-sign-in')
          router.push('/mobile-sign-in')
          return
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (!user || userError) {
          console.log('Invalid session, redirecting to mobile-sign-in')
          router.push('/mobile-sign-in')
          return
        }

        console.log('Valid session found:', session)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/mobile-sign-in')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(false)
      } else if (event === 'SIGNED_OUT') {
        // Clear all user data when signed out
        try {
          const { cache } = await import('@/lib/utils/cache');
          cache.clearAllUserData();
        } catch (error) {
          console.warn('Failed to clear user data on sign out:', error);
        }
        router.push('/mobile-sign-in')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <SmartLoader />
  }

  return (
    <div className='bg-white'>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 font-sans text-gray-800">
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </main>
    </div>
  )
}