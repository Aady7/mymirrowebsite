'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useContext } from 'react'
import { CartContext } from '@/app/components/provider'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.nav 
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-lg shadow-gray-900/5"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" onClick={handleLinkClick} className="text-2xl font-bold">
              <Image src="/assets/logo.png" alt='logo' width={100} height={30} />
            </Link>
          </motion.div>
          
          {/* Desktop Navigation*/}
          <div className="hidden sm:flex space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/style-quiz"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium tracking-wide relative group"
              >
                Quiz
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium tracking-wide relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium tracking-wide relative group"
              >
                Recommendations
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/aboutpage"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium tracking-wide relative group"
              >
                AboutUs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Sign Out Button */}
          <div className="hidden sm:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart" className="relative focus:outline-none" tabIndex={0} aria-label="Cart">
                <Image 
                  src="/assets/cartIcon.svg" 
                  alt="Cart" 
                  width={24} 
                  height={24}
                  className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors"
                />
                {cartCount > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 border-2 border-white z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            <motion.button
              onClick={handleSignOut}
              disabled={isLoading}
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 tracking-wide"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </motion.button>
          </div>

          {/*Mobile Menu Button */}
          <div className='sm:hidden flex items-center space-x-4'>
            {/* Cart Icon for Mobile */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart" onClick={handleLinkClick} className="relative">
                <button className='text-gray-700 focus:outline-none p-1'>
                  <Image 
                    src="/assets/cartIcon.svg" 
                    alt="Cart" 
                    width={24} 
                    height={24}
                    className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors"
                  />
                  {cartCount > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 border-2 border-white z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>
              </Link>
            </motion.div>
            
            {/* Hamburger Menu Button */}
            <motion.button 
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors'
              aria-label='Toggle Menu'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
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
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/*Mobile Dropdown*/}
        {isOpen && (
          <div className="sm:hidden mt-2 space-y-2 pb-3">
            <Link 
              href="/" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/style-quiz" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Quiz
            </Link>
            <Link 
              href="/dashboard" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Recommendations
            </Link>
            <Link 
              href="/lookbook" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              LookBook
            </Link>
            <Link 
              href="/cart" 
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Cart
            </Link>
            <Link
              href="/aboutpage"
              onClick={handleLinkClick}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
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
    </motion.nav>
  )
} 