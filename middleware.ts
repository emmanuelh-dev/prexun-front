import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value
  const role = request.cookies.get('user-role')?.value

  if (!token) {
    console.log('No hay token, redirigiendo a login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (role === 'super_admin') {
    return NextResponse.next()
  } else if (role === 'admin' || role === 'contador') {
    if (!pathname.startsWith('/planteles')) {
      return NextResponse.redirect(new URL('/planteles', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/planteles/:path*',
    '/dashboard',
    '/planteles'
  ]
} 