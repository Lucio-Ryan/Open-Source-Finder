import { NextResponse } from 'next/server';
import { getCurrentUser, getUserProfile } from '@/lib/mongodb/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        user: null,
        profile: null,
      });
    }

    const profile = await getUserProfile(user.id);

    return NextResponse.json({
      user,
      profile,
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
