import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: techStacks, error } = await supabase
      .from('tech_stacks')
      .select('id, name, slug, type')
      .order('name');

    if (error) {
      console.error('Error fetching tech stacks:', error);
      return NextResponse.json({ error: 'Failed to fetch tech stacks' }, { status: 500 });
    }

    return NextResponse.json({ techStacks: techStacks || [] });
  } catch (error) {
    console.error('Error in tech-stacks API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
