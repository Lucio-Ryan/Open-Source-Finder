import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { SiteSettings } from '@/lib/mongodb/models';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Default settings
const defaultSettings = {
  showSubmitButton: true,
  showDashboardButton: true,
  showNewsletterSection: true,
  showLegalSection: true,
  showSubmitResourcesFooter: true,
};

// GET: Retrieve public site settings (no auth required)
export async function GET() {
  try {
    await connectToDatabase();

    // Get settings or return defaults
    const settings = await SiteSettings.findOne({ key: 'global' }).lean();
    
    if (!settings) {
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json({
      showSubmitButton: settings.showSubmitButton ?? true,
      showDashboardButton: settings.showDashboardButton ?? true,
      showNewsletterSection: settings.showNewsletterSection ?? true,
      showLegalSection: settings.showLegalSection ?? true,
      showSubmitResourcesFooter: settings.showSubmitResourcesFooter ?? true,
    });
  } catch (error) {
    console.error('Public site settings GET error:', error);
    // Return defaults on error
    return NextResponse.json(defaultSettings);
  }
}
