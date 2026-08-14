import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // Optional query param: preserve destination if login page adds support later
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Base64Url-decode the JWT payload to inspect the role
  try {
    const parts = refreshToken.split('.');
    if (parts.length !== 3) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const role = payload?.role;

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
    console.error('Failed to parse auth token inside middleware:', error);
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
