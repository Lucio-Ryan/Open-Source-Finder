import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action'); // 'click' or 'impression'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    await connectToDatabase();

    // Increment the appropriate counter
    const column = action === 'click' ? 'clicks' : 'impressions';
    
    await Advertisement.findByIdAndUpdate(id, {
      $inc: { [column]: 1 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
