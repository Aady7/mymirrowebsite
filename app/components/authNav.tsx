'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const AuthNav = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              <Image src="/assets/logo.png" alt='logo' width={150} height={75} />
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden sm:flex flex-1 justify-center items-center">
            <div className="flex space-x-8">
              <Link
                href="/"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Home
              </Link>
              <Link
                href="/style-quiz"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Style Quiz
              </Link>
              <Link
                href="/aboutpage"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                AboutUs
              </Link>
            </div>
          </div>
          
          {/* Desktop Sign In/Up Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => router.push('/sign-in')}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden mt-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="sm:hidden mt-2 space-y-2 pb-3">
            <Link 
              href="/" 
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Home
            </Link>
            <Link 
              href="/style-quiz" 
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Style Quiz
            </Link>
            <Link 
              href="/aboutpage" 
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              AboutUs
            </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button
                onClick={() => router.push('/sign-in')}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push('/sign-up')}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AuthNav