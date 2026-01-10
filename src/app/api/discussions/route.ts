import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create server-side Supabase client for auth
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

// Create untyped admin client for new tables (discussions, notifications)
function createUntypedAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET - Get discussions for an alternative
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alternativeId = searchParams.get('alternativeId');

  if (!alternativeId) {
    return NextResponse.json({ error: 'alternativeId is required' }, { status: 400 });
  }

  const supabase = createUntypedAdminClient();

  // Get all top-level discussions with author info
  const { data: discussions, error } = await supabase
    .from('discussions')
    .select(`
      *,
      author:profiles!discussions_user_id_fkey(id, name, avatar_url)
    `)
    .eq('alternative_id', alternativeId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }

  // Get all replies for these discussions
  const discussionIds = (discussions as any[])?.map(d => d.id) || [];
  
  let replies: any[] = [];
  if (discussionIds.length > 0) {
    const { data: replyData } = await supabase
      .from('discussions')
      .select(`
        *,
        author:profiles!discussions_user_id_fkey(id, name, avatar_url)
      `)
      .in('parent_id', discussionIds)
      .order('created_at', { ascending: true });
    
    replies = replyData || [];
  }

  // Organize replies under their parent discussions
  const discussionsWithReplies = (discussions as any[])?.map(discussion => ({
    ...discussion,
    replies: replies.filter(r => r.parent_id === discussion.id)
  })) || [];

  return NextResponse.json({ discussions: discussionsWithReplies });
}

// POST - Create a new discussion or reply
export async function POST(request: NextRequest) {
  const authClient = createServerSupabaseClient();
  
  // Get current user
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { alternativeId, content, requestCreatorResponse, parentId } = body;

  if (!alternativeId || !content) {
    return NextResponse.json({ error: 'alternativeId and content are required' }, { status: 400 });
  }

  // Use untyped admin client for new tables
  const adminClient = createUntypedAdminClient();

  // Get the alternative to check if user is the creator
  const { data: alternative } = await adminClient
    .from('alternatives')
    .select('user_id, submitter_email, name, slug')
    .eq('id', alternativeId)
    .single();

  const isCreator = alternative && (
    alternative.user_id === user.id || 
    alternative.submitter_email === user.email
  );

  // Create the discussion
  const { data: discussion, error: insertError } = await adminClient
    .from('discussions')
    .insert({
      alternative_id: alternativeId,
      user_id: user.id,
      content,
      request_creator_response: requestCreatorResponse || false,
      parent_id: parentId || null,
      is_creator_response: isCreator || false
    })
    .select(`
      *,
      author:profiles!discussions_user_id_fkey(id, name, avatar_url)
    `)
    .single();

  if (insertError) {
    console.error('Error creating discussion:', insertError);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }

  // If user requested a creator response and they're not the creator, create a notification
  if (requestCreatorResponse && !isCreator && alternative?.user_id) {
    // Get the poster's profile for the notification message
    const { data: posterProfile } = await adminClient
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    const posterName = posterProfile?.name || user.email?.split('@')[0] || 'A user';

    await adminClient
      .from('creator_notifications')
      .insert({
        creator_id: alternative.user_id,
        alternative_id: alternativeId,
        discussion_id: (discussion as any).id,
        type: 'response_request',
        message: `${posterName} requested your response on "${alternative.name}"`
      });
  }

  return NextResponse.json({ discussion });
}

// DELETE - Delete a discussion
export async function DELETE(request: NextRequest) {
  const authClient = createServerSupabaseClient();
  
  // Get current user
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const discussionId = searchParams.get('id');

  if (!discussionId) {
    return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 });
  }

  const adminClient = createUntypedAdminClient();

  // Check if user owns this discussion
  const { data: discussion } = await adminClient
    .from('discussions')
    .select('user_id')
    .eq('id', discussionId)
    .single();

  if (!discussion) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }

  if ((discussion as any).user_id !== user.id) {
    // Check if user is admin
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if ((profile as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Delete the discussion (cascade will handle replies and notifications)
  const { error: deleteError } = await adminClient
    .from('discussions')
    .delete()
    .eq('id', discussionId);

  if (deleteError) {
    console.error('Error deleting discussion:', deleteError);
    return NextResponse.json({ error: 'Failed to delete discussion' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
