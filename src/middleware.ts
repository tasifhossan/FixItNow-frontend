import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secretStr = process.env.JWT_REFRESH_SECRET;
    if (!secretStr) {
      console.error('JWT_REFRESH_SECRET is not configured on the frontend');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(refreshToken, secret);

    const role = payload?.role as string;

    if (!role) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role verification against current route
    if (pathname.startsWith('/dashboard/customer') && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    }

    if (pathname.startsWith('/dashboard/technician') && role !== 'TECHNICIAN') {
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    }

    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    }
  } catch (error) {
    console.error('Cryptographic verification failed for auth token inside middleware:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

function getDashboardRoute(role: string): string {
  if (role === 'ADMIN') return '/dashboard/admin';
  if (role === 'TECHNICIAN') return '/dashboard/technician';
  return '/dashboard/customer';
}

export const config = {
  matcher: [
    '/dashboard/customer/:path*',
    '/dashboard/technician/:path*',
    '/dashboard/admin/:path*',
  ],
};
