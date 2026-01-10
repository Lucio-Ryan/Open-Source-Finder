import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Create server-side Supabase client
function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie errors in read-only contexts
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie errors in read-only contexts
          }
        },
      },
    }
  );
}

// GET - Get votes for an alternative or user's vote
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alternativeId = searchParams.get('alternativeId');
  const userId = searchParams.get('userId');

  const supabase = createServerSupabaseClient();

  // Get vote counts for an alternative
  if (alternativeId) {
    // Get the vote score from the alternatives table (cached)
    const { data: alternative, error: altError } = await supabase
      .from('alternatives')
      .select('vote_score')
      .eq('id', alternativeId)
      .single();

    if (altError) {
      return NextResponse.json({ error: 'Failed to fetch vote score' }, { status: 500 });
    }

    // If userId is provided, also get the user's vote
    let userVote = null;
    if (userId) {
      const { data: vote } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('alternative_id', alternativeId)
        .eq('user_id', userId)
        .single();
      
      userVote = vote?.vote_type || null;
    }

    return NextResponse.json({
      voteScore: alternative?.vote_score || 0,
      userVote,
    });
  }

  return NextResponse.json({ error: 'alternativeId is required' }, { status: 400 });
}

// POST - Create or update a vote
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
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

    // If voteType is 0, remove the vote
    if (voteType === 0) {
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('alternative_id', alternativeId);

      if (deleteError) {
        console.error('Error deleting vote:', deleteError);
        return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 });
      }
    } else {
      // Upsert the vote (insert or update)
      const { error: upsertError } = await supabase
        .from('votes')
        .upsert(
          {
            user_id: user.id,
            alternative_id: alternativeId,
            vote_type: voteType,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,alternative_id',
          }
        );

      if (upsertError) {
        console.error('Error upserting vote:', upsertError);
        return NextResponse.json({ error: 'Failed to save vote' }, { status: 500 });
      }
    }

    // Get updated vote score
    const { data: alternative, error: altError } = await supabase
      .from('alternatives')
      .select('vote_score')
      .eq('id', alternativeId)
      .single();

    if (altError) {
      console.error('Error fetching updated score:', altError);
    }

    return NextResponse.json({
      success: true,
      voteScore: alternative?.vote_score || 0,
      userVote: voteType === 0 ? null : voteType,
    });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
