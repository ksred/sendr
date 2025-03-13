import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = ['/chat', '/'];

// List of paths that are only accessible to non-authenticated users
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const path = request.nextUrl.pathname;

  // Redirect root to chat for logged in users
  if (path === '/' && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  // Check if the path requires authentication
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.includes(path) && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
};
