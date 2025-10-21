import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoute = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoute.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check for auth token in cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Redirect to login if no token and accessing protected /admin routes
  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('auth/admin/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};