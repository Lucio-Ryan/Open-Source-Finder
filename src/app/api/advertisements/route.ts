import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// GET - Fetch active, approved advertisements
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const adType = searchParams.get('type');
    
    const now = new Date();
    
    // First, deactivate any expired ads
    await Advertisement.updateMany(
      {
        is_active: true,
        expires_at: { $lte: now }
      },
      {
        is_active: false,
        updated_at: now
      }
    );
    
    const filter: any = {
      status: 'approved',
      is_active: true,
      paid_at: { $ne: null }, // Must be paid
      $or: [
        { expires_at: null },
        { expires_at: { $gt: now } }
      ]
    };
    
    if (adType) {
      filter.ad_type = adType;
    }
    
    // Order by approved_at ascending (oldest approved first)
    const advertisements = await Advertisement.find(filter)
      .sort({ approved_at: 1 })
      .lean();
    
    // Transform to match expected format
    const transformedAds = advertisements.map(ad => ({
      id: ad._id.toString(),
      name: ad.name,
      description: ad.description,
      ad_type: ad.ad_type,
      company_name: ad.company_name,
      company_website: ad.company_website,
      company_logo: ad.company_logo,
      headline: ad.headline,
      cta_text: ad.cta_text,
      destination_url: ad.destination_url,
      icon_url: ad.icon_url,
      short_description: ad.short_description,
      status: ad.status,
      is_active: ad.is_active,
      priority: ad.priority,
      start_date: ad.start_date,
      end_date: ad.end_date,
      approved_at: ad.approved_at,
      created_at: ad.created_at,
      updated_at: ad.updated_at
    }));
    
    return NextResponse.json({ advertisements: transformedAds });
  } catch (error) {
    console.error('Error in GET /api/advertisements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Submit a new advertisement (requires authentication)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    
    // Require authentication
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to submit an advertisement' },
        { status: 401 }
      );
    }
    
    const body = await request.json();

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

    const advertisement = await Advertisement.create({
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
      user_id: new mongoose.Types.ObjectId(user.id),
      submitter_name: submitter_name || null,
      submitter_email,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      status: 'pending',
      is_active: false,
      priority: 0,
      payment_id: null,
      paid_at: null,
      payment_amount: null
    });

    return NextResponse.json({
      success: true,
      message: 'Advertisement submitted successfully! It will be reviewed by our team.',
      advertisement: {
        id: advertisement._id,
        name: advertisement.name,
        status: advertisement.status
      },
    });
  } catch (error) {
    console.error('Error in POST /api/advertisements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
