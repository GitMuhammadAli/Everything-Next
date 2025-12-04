import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The middleware enforces the X-Demo-Auth header for this route
  const token = request.headers.get('x-demo-auth')

  return NextResponse.json({
    ok: true,
    message: 'Access granted to secure-demo route',
    receivedToken: token,
    note: 'This route is protected by middleware which requires X-Demo-Auth',
  })
}

export async function POST(request: Request) {
  const token = request.headers.get('x-demo-auth')
  const body = await request.json().catch(() => ({}))

  return NextResponse.json({
    ok: true,
    method: 'POST',
    body,
    receivedToken: token,
  })
}
