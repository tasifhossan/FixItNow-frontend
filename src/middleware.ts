import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Rely on the client-side RoleGuard component to verify user roles and access permissions.
  // This bypasses the cross-origin cookie limitation where the frontend Vercel domain
  // cannot access the HttpOnly cookie set on the backend Vercel domain.
  return NextResponse.next();
}
