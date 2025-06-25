// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Get the token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const userData = request.cookies.get('user')?.value;

  // Define public paths that don't require authentication
  const publicPaths = ['/admin/login', '/admin/forgot-password'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Check if the path is admin related but not a public path
  if (pathname.startsWith('/admin') && !isPublicPath) {
    // If no token is present, redirect to login
    if (!accessToken || !userData) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    try {
      // Parse the user data to check for admin role
      const user = JSON.parse(userData);
      if (!user.roles || !user.roles.includes('Admin')) {
        // User is authenticated but not an admin - redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      // If there's an error parsing the user data, redirect to login
      console.error('Error parsing user data:', error);
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // If the user is already logged in and tries to access login page, redirect to portal
  if (isPublicPath && accessToken && userData) {
    try {
      // Verify they are an admin (to be extra safe)
      const user = JSON.parse(userData);
      if (user.roles && user.roles.includes('Admin')) {
        return NextResponse.redirect(new URL('/admin/portal', request.url));
      }
    } catch (error) {
      // If there's an error, let them proceed to the login page
      console.error('Error checking user role:', error);
    }
  }

  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Match unauthorized page
    '/unauthorized',
  ],
};