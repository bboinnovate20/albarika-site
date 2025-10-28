import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Clear the auth cookies
  const response = NextResponse.redirect(new URL('/auth/admin/login', request.url));
  
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}