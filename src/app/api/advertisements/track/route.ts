import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isUsingMockData } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    if (isUsingMockData) {
      return NextResponse.json({ success: true, message: 'Mock mode - tracking disabled' });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action'); // 'click' or 'impression'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Increment the appropriate counter
    const column = action === 'click' ? 'clicks' : 'impressions';
    
    // Get current value
    const { data: current } = await supabase
      .from('advertisements')
      .select(column)
      .eq('id', id)
      .single();

    if (current) {
      // Increment and update
      const currentValue = (current as Record<string, number>)[column] || 0;
      await supabase
        .from('advertisements')
        .update({ [column]: currentValue + 1 })
        .eq('id', id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
