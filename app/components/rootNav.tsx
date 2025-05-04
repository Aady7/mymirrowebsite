'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Navigation() {
  const { signOut } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/style-quiz" className="text-xl font-bold text-indigo-600">
                Style Quiz
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/style-quiz"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Quiz
              </Link>
              <Link
                href="/recommendations"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Recommendations
              </Link>
              <Link
                href="/cart"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Cart
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 