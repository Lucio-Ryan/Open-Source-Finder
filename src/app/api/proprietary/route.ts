import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();

  const { data: software, error } = await supabase
    .from('proprietary_software')
    .select('id, name, slug')
    .order('name');

  if (error) {
    console.error('Error fetching proprietary software:', error);
    return NextResponse.json({ software: [] });
  }

  return NextResponse.json({ software });
}
