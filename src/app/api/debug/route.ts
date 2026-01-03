import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {
      isUsingMockData,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      usingKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon',
      nodeEnv: process.env.NODE_ENV,
    },
    tests: {},
  };

  // Test database connection
  try {
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(3);
    
    debugInfo.tests.categoriesQuery = {
      success: !catError,
      count: categories?.length || 0,
      error: catError?.message || null,
      sample: categories?.slice(0, 2) || [],
    };
  } catch (err: any) {
    debugInfo.tests.categoriesQuery = {
      success: false,
      error: err.message,
    };
  }

  // Test alternatives table
  try {
    const { data: alternatives, error: altError } = await supabase
      .from('alternatives')
      .select('id, name, slug')
      .limit(3);
    
    debugInfo.tests.alternativesQuery = {
      success: !altError,
      count: alternatives?.length || 0,
      error: altError?.message || null,
      sample: alternatives?.slice(0, 2) || [],
    };
  } catch (err: any) {
    debugInfo.tests.alternativesQuery = {
      success: false,
      error: err.message,
    };
  }

  // Test insert capability (only if using real Supabase)
  if (!isUsingMockData) {
    try {
      // Test with a simple insert then delete
      const testSlug = `debug-test-${Date.now()}`;
      const { data: insertTest, error: insertError } = await supabase
        .from('alternatives')
        .insert({
          name: 'Debug Test',
          slug: testSlug,
          description: 'Test entry - will be deleted',
          website: 'https://test.com',
          github: 'https://github.com/test/test',
          health_score: 50,
          approved: false,
          featured: false,
        })
        .select()
        .single();

      if (insertError) {
        debugInfo.tests.insertCapability = {
          success: false,
          error: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        };
      } else {
        // Clean up test entry
        await supabase.from('alternatives').delete().eq('id', insertTest.id);
        debugInfo.tests.insertCapability = {
          success: true,
          message: 'Insert and delete successful',
        };
      }
    } catch (err: any) {
      debugInfo.tests.insertCapability = {
        success: false,
        error: err.message,
      };
    }
  } else {
    debugInfo.tests.insertCapability = {
      success: false,
      error: 'Using mock data - insert not available',
      hint: 'Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    };
  }

  return NextResponse.json(debugInfo, { status: 200 });
}
