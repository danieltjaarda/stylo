import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Blokkeer toegang tot interne tools in productie
  if (process.env.NODE_ENV === 'production') {
    if (pathname === '/api/feed-checker' || 
        pathname.startsWith('/api/validate-feed') ||
        pathname.startsWith('/test-')) {
      return new NextResponse('Access Denied', { 
        status: 403,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
        }
      })
    }
  }

  // Voeg robots tag toe aan interne tools
  if (pathname === '/api/feed-checker' || 
      pathname.startsWith('/api/validate-feed')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  }

  // Set security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // Set caching headers based on content type

  // Cache static assets aggressively
  if (
    pathname.startsWith('/svg icons/') ||
    pathname.startsWith('/_next/static/') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.mp4') ||
    pathname.endsWith('.webm')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
  }

  // Cache API responses for a shorter time
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
  }

  // Cache product pages
  if (pathname.startsWith('/products/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    )
  }

  // Cache collection pages
  if (
    pathname.startsWith('/bureaustoelen') ||
    pathname.startsWith('/verstelbare-bureaus') ||
    pathname.startsWith('/shop-alles')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=1200'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}



