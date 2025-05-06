'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Navigation from '@/app/components/rootNav'


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
        const { session, error } = await getSession()
        if (!session || error) {
          router.push('/sign-in')
    
          return
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/sign-in')
      }
    }
    
    checkAuth()
    
    
    
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-100">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 