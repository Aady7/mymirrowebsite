import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client using server components
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get the session
  const { data: { session } } = await supabase.auth.getSession()

  // Get the URL pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path === '/sign-in' || 
                       path === '/sign-up' || 
                       path.startsWith('/api/auth')

  // If user is logged in but trying to access a public page, redirect to style-quiz
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL('/style-quiz', request.url))
  }

  // If user is not logged in and trying to access a protected page, redirect to sign-in
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return response
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/style-quiz/:path*',
    '/recommendations/:path*',
    '/api/:path*'
  ]
} 