import { NextRequest, NextResponse } from 'next/server';
import { signIn, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/mongodb/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { user, token, error } = await signIn(email, password);

    if (error || !token) {
      return NextResponse.json(
        { error: error || 'Sign in failed' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user,
      token,
    });
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
