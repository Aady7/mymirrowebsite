'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AuthNav = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    // Function to handle link clicks
    const handleLinkClick = () => {
      setIsOpen(false)
    }

    // Function to handle button clicks
    const handleButtonClick = (path: string) => {
      router.push(path)
      setIsOpen(false)
     
    }

    return (
      <motion.nav 
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-lg shadow-gray-900/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" onClick={handleLinkClick} className="text-xl font-bold">
                <Image src="/assets/logo.png" alt='logo' width={150} height={75} />
              </Link>
            </motion.div>

            {/* Centered Navigation Links */}
            <div className="hidden sm:flex flex-1 justify-center items-center">
              <div className="flex space-x-8">
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
                    href="/style-quiz"
                    className="text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium tracking-wide relative group"
                  >
                    Style Quiz
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium tracking-wide relative group"
                  >
                    AboutUs
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              </div>
            </div>
            
            {/* Desktop Sign In/Up Buttons */}
            <div className="hidden sm:flex items-center space-x-4">
              <motion.button
                onClick={() => router.push('/sign-in')}
                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
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
                onClick={handleLinkClick}
                className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
              >
                Home
              </Link>
              <Link 
                href="/style-quiz" 
                onClick={handleLinkClick}
                className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
              >
                Style Quiz
              </Link>
              <Link 
                href="/about" 
                onClick={handleLinkClick}
                className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
              >
                AboutUs
              </Link>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => handleButtonClick('/sign-in')}
                  className="block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-300 px-3 py-2 rounded-md"
                >
                  Sign in
                </button>
               
              </div>
            </div>
          )}
        </div>
      </motion.nav>
    )
  }

export default AuthNav