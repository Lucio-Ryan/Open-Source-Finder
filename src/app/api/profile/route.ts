import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserProfile, updateUserProfile } from '@/lib/mongodb/auth';

// Force dynamic rendering for routes that use cookies
export const dynamic = 'force-dynamic';

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(user.id);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, website, github_username, avatar_url, twitter_username, linkedin_url, youtube_url, discord_username } = body;

    // Validate inputs
    if (name && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    if (bio && (typeof bio !== 'string' || bio.length > 500)) {
      return NextResponse.json({ error: 'Bio must be less than 500 characters' }, { status: 400 });
    }

    if (website && (typeof website !== 'string' || website.length > 255)) {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 });
    }

    if (github_username && (typeof github_username !== 'string' || github_username.length > 39)) {
      return NextResponse.json({ error: 'Invalid GitHub username' }, { status: 400 });
    }

    const { success, error } = await updateUserProfile(user.id, {
      name,
      bio,
      website,
      github_username,
      avatar_url,
      twitter_username,
      linkedin_url,
      youtube_url,
      discord_username,
    });

    if (!success) {
      return NextResponse.json({ error: error || 'Failed to update profile' }, { status: 500 });
    }

    const updatedProfile = await getUserProfile(user.id);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
