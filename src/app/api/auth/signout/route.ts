import { NextResponse } from 'next/server';
import { signOut } from '@/lib/mongodb/auth';

export async function POST() {
  try {
    await signOut();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
