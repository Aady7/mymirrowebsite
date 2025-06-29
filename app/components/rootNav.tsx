'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useContext } from 'react'
import { CartContext } from './provider'

export default function Navigation() {
  const { signOut } = useAuth()
  const router = useRouter()
   
  //state change to desktop to mobile or mobile to desktop
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { cartCount } = useContext(CartContext)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      setIsOpen(false) // Close menu when signing out
      await signOut()
      router.push('/mobile-sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle link clicks
  const handleLinkClick = () => {

   setIsOpen(false)

  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={handleLinkClick} className="text-2xl font-bold text-indigo-600">
              <Image src="/assets/logo.png" alt='logo' width={100} height={30} />
            </Link>
          </div>
          {/* Desktop Navigation*/}
          <div className="hidden sm:flex space-x-6">
            <Link
              href="/style-quiz-new"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Quiz
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/recommendations"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Recommendations
            </Link>
            <Link
              href="/aboutpage"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              AboutUs
            </Link>
          </div>

          {/* Desktop Sign Out Button */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/cart" className="relative focus:outline-none" tabIndex={0} aria-label="Cart">
              <Image 
                src="/assets/cartIcon.svg" 
                alt="Cart" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#007e90] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 border-2 border-white z-10">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out"
            >
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>

          {/*Mobile Menu Button */}
          <div className='sm:hidden flex items-center space-x-4'>
            {/* Cart Icon for Mobile */}
            <Link href="/cart" onClick={handleLinkClick} className="relative">
              <button className='text-gray-700 focus:outline-none p-1'>
                <Image 
                  src="/assets/cartIcon.svg" 
                  alt="Cart" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#007e90] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 border-2 border-white z-10">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-700 focus:outline-none'
              aria-label='Toggle Menu'
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

        {/*Mobile Dropdown*/}
        {isOpen && (
          <div className="sm:hidden mt-2 space-y-2 pb-3">
            <Link 
              href="/" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Home
            </Link>
            <Link 
              href="/style-quiz-new" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Quiz
            </Link>
            <Link 
              href="/recommendations" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Recommendations
            </Link>
            <Link 
              href="/cart" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              Cart
            </Link>
            <Link
              href="/aboutpage"
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              AboutUs
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
            >
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
} 