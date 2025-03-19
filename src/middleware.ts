import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = ['/chat', '/settings'];

// List of paths that are only accessible to non-authenticated users
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  // Log the cookie for debugging
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  // Check for debug bypass parameter
  const url = request.nextUrl.clone();
  const debugBypass = url.searchParams.get('bypass_auth');
  if (debugBypass === 'true') {
    console.log('Auth bypass enabled, skipping middleware checks');
    return NextResponse.next();
  }
  
  // Get auth token from cookie
  const token = request.cookies.get('auth_token');
  console.log('Auth token present:', !!token, token ? token.value.substring(0, 10) + '...' : 'none');
  
  const path = request.nextUrl.pathname;

  // Check if user is authenticated
  const isAuthenticated = !!token?.value;
  
  // Add a debug query param to help break redirect loops
  const addDebugParam = (url: URL) => {
    if (!url.searchParams.has('debug')) {
      url.searchParams.set('debug', Date.now().toString());
    }
    return url;
  };

  // Handling the root path requires special care
  if (path === '/') {
    if (isAuthenticated) {
      // If logged in, go to chat page
      const chatUrl = new URL('/chat', request.url);
      return NextResponse.redirect(addDebugParam(chatUrl));
    }
    // If not logged in, just allow access to the root page for now
    return NextResponse.next();
  }

  // Check protected paths
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    if (!isAuthenticated) {
      // If not authenticated and trying to access protected path
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(addDebugParam(loginUrl));
    }
    // Authenticated user accessing protected path, allow
    return NextResponse.next();
  }

  // Handle auth paths
  if (authPaths.includes(path) && isAuthenticated) {
    // If authenticated and trying to access login/register
    const chatUrl = new URL('/chat', request.url);
    return NextResponse.redirect(addDebugParam(chatUrl));
  }

  // For all other paths
  return NextResponse.next();
}

// Update the matcher to only match specific paths
// Exclude root path since we're handling it with client-side logic now
export const config = {
  matcher: ['/chat', '/settings', '/login', '/register'],
};
