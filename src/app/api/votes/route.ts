import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { getVoteScore, getUserVote, upsertVote } from '@/lib/mongodb/queries';

// GET - Get votes for an alternative or user's vote
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alternativeId = searchParams.get('alternativeId');
  const userId = searchParams.get('userId');

  // Get vote counts for an alternative
  if (alternativeId) {
    try {
      const voteScore = await getVoteScore(alternativeId);

      // If userId is provided, also get the user's vote
      let userVote = null;
      if (userId) {
        userVote = await getUserVote(userId, alternativeId);
      }

      return NextResponse.json({
        voteScore,
        userVote,
      });
    } catch (error) {
      console.error('Error fetching vote score:', error);
      return NextResponse.json({ error: 'Failed to fetch vote score' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'alternativeId is required' }, { status: 400 });
}

// POST - Create or update a vote
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to vote' }, { status: 401 });
    }

    const body = await request.json();
    const { alternativeId, voteType } = body;

    if (!alternativeId) {
      return NextResponse.json({ error: 'alternativeId is required' }, { status: 400 });
    }

    if (voteType !== 1 && voteType !== -1 && voteType !== 0) {
      return NextResponse.json({ error: 'voteType must be 1, -1, or 0' }, { status: 400 });
    }

    const result = await upsertVote(user.id, alternativeId, voteType);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save vote' }, { status: 500 });
    }

    // Get updated vote score
    const newVoteScore = await getVoteScore(alternativeId);

    return NextResponse.json({
      success: true,
      voteScore: newVoteScore,
      userVote: voteType === 0 ? null : voteType,
    });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
