'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const { signOut } = useAuth()
   
  //state change to desktop to mobile or mobile to desktop
  const [isOpen,setIsOpen]=useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link href="/style-quiz" className="text-2xl font-bold text-indigo-600">
              Style Quiz
            </Link>
          </div>
          {/* DeskTop Navigation*/}
          <div className="hidden sm:flex space-x-6">
            <Link
              href="/style-quiz"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Quiz
            </Link>
            <Link
              href="/homepage"
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
              href="/cart"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Cart
            </Link>
            <Link
              href="/aboutpage"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              AboutUs
            </Link>
          </div>
          {/*Sigout*/}
          <div className="flex items-center">
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          {/*Mobile */}
          <div className='sm:hidden'>
            <button 
            onClick={()=>setIsOpen(!isOpen)}
            className='text-gray-700 focus:outline-none'
            arial-label='Toggle Menu'
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
           <div className="sm:hidden mt-2 space-y-2">
           <Link href="/style-quiz" className="block text-gray-700 hover:text-indigo-600">
             Quiz
           </Link>
           <Link href="/homepage" className="block text-gray-700 hover:text-indigo-600">
             Home
           </Link>
           <Link href="/recommendations" className="block text-gray-700 hover:text-indigo-600">
             Recommendations
           </Link>
           <Link href="/cart" className="block text-gray-700 hover:text-indigo-600">
             Cart
           </Link>
           <Link
              href="/aboutpage"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              AboutUs
            </Link>
           <button
             onClick={signOut}
             className="block w-full text-left text-indigo-700 hover:text-red-500 mt-2"
           >
             Sign Out
           </button>
         </div>
        )}
      </div>
    </nav>
  )
} 