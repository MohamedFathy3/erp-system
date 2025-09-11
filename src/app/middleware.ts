  // src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getRoleFromToken(token: string | undefined): string | null {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = getRoleFromToken(token)
  const { pathname } = request.nextUrl

  // لو مفيش توكن → رجعه للـ auth
  if (!token || !role) {
    if (!pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    return NextResponse.next()
  }

  // تحقق حسب الدور
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/employee') && role !== 'employee') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // أي حاجة تانية متاحة
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth).*)', 
  ],
}
