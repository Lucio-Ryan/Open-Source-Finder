import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import { Alternative, User, Session } from '@/lib/mongodb/models';
import { verifyToken } from '@/lib/mongodb/auth';
import { cookies } from 'next/headers';

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  await connectDB();
  
  // Verify session exists
  const session = await Session.findOne({ 
    user_id: payload.userId,
    expires_at: { $gt: new Date() }
  });
  
  if (!session) return null;
  
  const user = await User.findById(payload.userId).lean();
  return user;
}

// GET - Fetch sponsored alternatives for a week range
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get('weekStart');
    const weekEnd = searchParams.get('weekEnd');
    
    if (!weekStart || !weekEnd) {
      return NextResponse.json({ error: 'Week range required' }, { status: 400 });
    }
    
    await connectDB();
    
    const sponsors = await Alternative.find({
      submission_plan: 'sponsor',
      approved: true,
      sponsor_paid_at: {
        $gte: new Date(weekStart),
        $lte: new Date(weekEnd)
      }
    })
    .select('name slug description icon_url website sponsor_paid_at sponsor_featured_until newsletter_included')
    .sort({ sponsor_paid_at: 1 })
    .lean();
    
    const transformedSponsors = sponsors.map((s: any) => ({
      id: s._id.toString(),
      name: s.name,
      slug: s.slug,
      description: s.description,
      icon_url: s.icon_url,
      website: s.website,
      sponsor_paid_at: s.sponsor_paid_at,
      sponsor_featured_until: s.sponsor_featured_until,
      newsletter_included: s.newsletter_included || false
    }));
    
    return NextResponse.json(transformedSponsors);
  } catch (error) {
    console.error('Error fetching newsletter sponsors:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

// PATCH - Update newsletter_included status for an alternative
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { alternativeId, newsletter_included } = await request.json();
    
    if (!alternativeId) {
      return NextResponse.json({ error: 'Alternative ID required' }, { status: 400 });
    }
    
    await connectDB();
    
    const updated = await Alternative.findByIdAndUpdate(
      alternativeId,
      { newsletter_included },
      { new: true }
    ).lean();
    
    if (!updated) {
      return NextResponse.json({ error: 'Alternative not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating newsletter status:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
