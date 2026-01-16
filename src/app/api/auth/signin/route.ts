import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/mongodb/auth';

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

    if (error) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
