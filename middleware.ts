import { NextRequest, NextResponse } from 'next/server'

// This middleware demonstrates a simple auth-gate for specific API routes
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const method = req.method

  // Basic log so you can see it trigger in your terminal
  // Note: console.log in middleware logs to server console
  console.log(`[middleware] ${method} ${pathname}`)

  // Only guard the secure-demo endpoint; allow others to pass
  if (pathname.startsWith('/api/secure-demo')) {
    const token = req.headers.get('x-demo-auth')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: missing X-Demo-Auth header' },
        { status: 401 }
      )
    }

    // You can also forward info to the route via request headers using request headers rewriting is not supported directly,
    // but you can set a response header to show middleware ran.
    const res = NextResponse.next()
    res.headers.set('x-middleware', 'passed')
    return res
  }

  // Default: let it continue
  return NextResponse.next()
}

// Limit middleware to only our demo endpoints so it doesn't affect the rest of the app
export const config = {
  matcher: [
    '/api/secure-demo/:path*',
    '/api/public-demo/:path*',
  ],
}
