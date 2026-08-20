import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function getDashboardRoute(role: string): string {
  if (role === 'ADMIN') return '/dashboard/admin';
  if (role === 'TECHNICIAN') return '/dashboard/technician';
  return '/dashboard/customer';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwt(token);
  const role = payload?.role as string;

  if (!role) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role verification against dashboard routes
  if (pathname.startsWith('/dashboard/customer') && role !== 'CUSTOMER') {
    return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
  }

  if (pathname.startsWith('/dashboard/technician') && role !== 'TECHNICIAN') {
    return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
  }

  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/customer/:path*',
    '/dashboard/technician/:path*',
    '/dashboard/admin/:path*',
  ],
};
