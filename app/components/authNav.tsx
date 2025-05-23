'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const RootNav = () => {
    const router = useRouter()
  return (
    <nav className="bg-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/style-quiz" className="text-xl font-bold text-indigo-600">
              <Image src="/assets/logo.png"  alt='logo' width={600} height={300}  />
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
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/mobile-sign-in')}
            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign in with mobile
          </button>
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
      </div>
    </div>
  </nav>
  )
}

export default RootNav