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

// GET - Get notifications for the current user
export async function GET(request: NextRequest) {
  const authClient = createServerSupabaseClient();
  
  // Get current user
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';

  const adminClient = createUntypedAdminClient();

  let query = adminClient
    .from('creator_notifications')
    .select(`
      *,
      alternative:alternatives(name, slug),
      discussion:discussions(content, author:profiles!discussions_user_id_fkey(name, avatar_url))
    `)
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data: notifications, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }

  // Get unread count
  const { count: unreadCount } = await adminClient
    .from('creator_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', user.id)
    .eq('is_read', false);

  return NextResponse.json({ 
    notifications: notifications || [], 
    unreadCount: unreadCount || 0 
  });
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  const authClient = createServerSupabaseClient();
  
  // Get current user
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { notificationId, markAllRead } = body;

  const adminClient = createUntypedAdminClient();

  if (markAllRead) {
    // Mark all notifications as read for this user
    const { error } = await adminClient
      .from('creator_notifications')
      .update({ is_read: true })
      .eq('creator_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking notifications as read:', error);
      return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (!notificationId) {
    return NextResponse.json({ error: 'notificationId or markAllRead is required' }, { status: 400 });
  }

  // Mark single notification as read
  const { error } = await adminClient
    .from('creator_notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('creator_id', user.id);

  if (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE - Delete a notification
export async function DELETE(request: NextRequest) {
  const authClient = createServerSupabaseClient();
  
  // Get current user
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get('id');

  if (!notificationId) {
    return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
  }

  const adminClient = createUntypedAdminClient();

  const { error } = await adminClient
    .from('creator_notifications')
    .delete()
    .eq('id', notificationId)
    .eq('creator_id', user.id);

  if (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
