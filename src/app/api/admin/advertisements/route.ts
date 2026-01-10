import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { AdStatus } from '@/types/database';

// Verify admin role
async function verifyAdmin() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, userId: user.id };
}

// GET - List all advertisements (admin view)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as AdStatus | 'all' | null;
    const adType = searchParams.get('type');

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabaseAdmin
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (adType) {
      query = query.eq('ad_type', adType);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ advertisements: data });
  } catch (error) {
    console.error('Admin advertisements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update advertisement (approve, reject, edit)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, rejection_reason, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Advertisement ID required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let updateData: Record<string, any> = {};

    if (action === 'approve') {
      updateData = {
        status: 'approved',
        is_active: true,
        approved_at: new Date().toISOString(),
        approved_by: auth.userId,
        rejection_reason: null,
      };
    } else if (action === 'reject') {
      updateData = {
        status: 'rejected',
        is_active: false,
        rejection_reason: rejection_reason || 'No reason provided',
      };
    } else if (action === 'deactivate') {
      updateData = {
        is_active: false,
      };
    } else if (action === 'activate') {
      updateData = {
        is_active: true,
      };
    } else {
      // Regular update - only allow specific fields
      const allowedFields = [
        'name', 'description', 'ad_type', 'company_name', 'company_website',
        'company_logo', 'headline', 'cta_text', 'destination_url', 'icon_url',
        'short_description', 'is_active', 'priority', 'start_date', 'end_date'
      ];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      }
    }

    const { data, error } = await supabaseAdmin
      .from('advertisements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: action ? `Advertisement ${action}d successfully` : 'Advertisement updated',
      advertisement: data 
    });
  } catch (error) {
    console.error('Admin advertisement update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete advertisement
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Advertisement ID required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from('advertisements')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Advertisement deleted' });
  } catch (error) {
    console.error('Admin advertisement delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
