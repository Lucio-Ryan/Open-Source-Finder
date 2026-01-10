import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { AdType, AdvertisementInsert } from '@/types/database';

// Get current user's profile ID if authenticated
async function getCurrentUserId(): Promise<string | null> {
  try {
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
    return user?.id || null;
  } catch {
    return null;
  }
}

// GET - Fetch active, approved advertisements
export async function GET(request: NextRequest) {
  try {
    if (isUsingMockData) {
      // Return mock data for development
      return NextResponse.json({ 
        advertisements: [],
        message: 'Mock mode - no ads configured'
      });
    }

    const { searchParams } = new URL(request.url);
    const adType = searchParams.get('type') as AdType | null;
    
    const supabase = createAdminClient();
    
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'approved')
      .eq('is_active', true)
      .order('priority', { ascending: false });
    
    if (adType) {
      query = query.eq('ad_type', adType);
    }
    
    // Filter by date if start_date/end_date are set
    const now = new Date().toISOString().split('T')[0];
    query = query
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`);
    
    const { data: advertisements, error } = await query;
    
    if (error) {
      console.error('Error fetching advertisements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch advertisements' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ advertisements: advertisements || [] });
  } catch (error) {
    console.error('Error in GET /api/advertisements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Submit a new advertisement
export async function POST(request: NextRequest) {
  try {
    if (isUsingMockData) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set up Supabase credentials.',
          debug: {
            hint: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
          }
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const supabase = createAdminClient();
    const userId = await getCurrentUserId();

    const {
      name,
      description,
      ad_type,
      company_name,
      company_website,
      company_logo,
      headline,
      cta_text,
      destination_url,
      icon_url,
      short_description,
      submitter_name,
      submitter_email,
      start_date,
      end_date,
    } = body;

    // Validate required fields
    if (!name || !description || !ad_type || !company_name || !company_website || !destination_url || !submitter_email) {
      return NextResponse.json(
        { error: 'Name, description, ad type, company name, company website, destination URL, and submitter email are required' },
        { status: 400 }
      );
    }

    // Validate ad type
    if (!['banner', 'popup', 'card'].includes(ad_type)) {
      return NextResponse.json(
        { error: 'Invalid ad type. Must be banner, popup, or card' },
        { status: 400 }
      );
    }

    const advertisementData: AdvertisementInsert = {
      name,
      description,
      ad_type,
      company_name,
      company_website,
      company_logo: company_logo || null,
      headline: headline || null,
      cta_text: cta_text || 'Learn More',
      destination_url,
      icon_url: icon_url || null,
      short_description: short_description || null,
      user_id: userId,
      submitter_name: submitter_name || null,
      submitter_email,
      start_date: start_date || null,
      end_date: end_date || null,
    };

    const { data: advertisement, error } = await supabase
      .from('advertisements')
      .insert(advertisementData)
      .select()
      .single();

    if (error) {
      console.error('Error creating advertisement:', error);
      return NextResponse.json(
        { error: 'Failed to create advertisement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Advertisement submitted successfully! It will be reviewed by our team.',
      advertisement,
    });
  } catch (error) {
    console.error('Error in POST /api/advertisements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
