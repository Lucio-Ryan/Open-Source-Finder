import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, SiteSettings } from '@/lib/mongodb/models';

// Force dynamic rendering for routes that use cookies
export const dynamic = 'force-dynamic';

// Verify admin role
async function verifyAdmin() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  await connectToDatabase();
  
  const profile = await User.findById(user.id).select('role').lean();

  if (!profile || profile.role !== 'admin') {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, userId: user.id };
}

// GET: Retrieve site settings
export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    await connectToDatabase();

    // Get or create default settings
    let settings = await SiteSettings.findOne({ key: 'global' }).lean();
    
    if (!settings) {
      // Create default settings
      const newSettings = await SiteSettings.create({
        key: 'global',
        showSubmitButton: true,
        showDashboardButton: true,
        showNewsletterSection: true,
        showLegalSection: true,
        showSubmitResourcesFooter: true,
      });
      // Re-fetch as lean to ensure consistent type
      settings = await SiteSettings.findById(newSettings._id).lean();
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Site settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update site settings
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const {
      showSubmitButton,
      showDashboardButton,
      showNewsletterSection,
      showLegalSection,
      showSubmitResourcesFooter,
    } = body;

    await connectToDatabase();

    // Update or create settings
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'global' },
      {
        $set: {
          showSubmitButton: showSubmitButton ?? true,
          showDashboardButton: showDashboardButton ?? true,
          showNewsletterSection: showNewsletterSection ?? true,
          showLegalSection: showLegalSection ?? true,
          showSubmitResourcesFooter: showSubmitResourcesFooter ?? true,
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Site settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
