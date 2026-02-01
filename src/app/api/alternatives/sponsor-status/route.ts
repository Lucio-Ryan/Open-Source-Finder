import { NextRequest, NextResponse } from 'next/server';
import { canAcceptNewSponsor, MAX_SPONSORED_ALTERNATIVES } from '@/lib/mongodb/queries';

export async function GET(request: NextRequest) {
  try {
    const sponsorStatus = await canAcceptNewSponsor();
    
    return NextResponse.json({
      canAccept: sponsorStatus.canAccept,
      currentCount: sponsorStatus.currentCount,
      maxCount: sponsorStatus.maxCount,
      slotsRemaining: sponsorStatus.maxCount - sponsorStatus.currentCount,
    });
  } catch (error) {
    console.error('Error fetching sponsor status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsor status' },
      { status: 500 }
    );
  }
}
