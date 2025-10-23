import { apiAdminServer } from '@/api/exam-cards/apiClient';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    const apiResponse = await apiAdminServer.post('/auth/login', { username, password });
    console.log("apiResponse", apiResponse.data.data.accessToken);
    const token = apiResponse.data.data.accessToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication failed: token not provided by API',
        },
        { status: 502 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set HttpOnly cookies
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    const refreshToken = apiResponse?.data?.refreshToken;
    if (refreshToken) {
      response.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);

    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unknown error occurred from API';

      return NextResponse.json(
        {
          success: false,
          message: apiMessage,
          code: status,
          details: error.response?.data || null,
        },
        { status }
      );
    }

    // Handle unexpected (non-Axios) errors
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message || 'An unexpected error occurred during login',
        code: 500,
      },
      { status: 500 }
    );
  }
}
