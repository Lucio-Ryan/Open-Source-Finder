import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// Force dynamic rendering for routes that use cookies
export const dynamic = 'force-dynamic';

// GET - Fetch current user's advertisements
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const advertisements = await Advertisement.find({
      user_id: new mongoose.Types.ObjectId(user.id)
    })
      .sort({ created_at: -1 })
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
      rejection_reason: ad.rejection_reason,
      is_active: ad.is_active,
      priority: ad.priority,
      start_date: ad.start_date,
      end_date: ad.end_date,
      payment_id: ad.payment_id,
      paid_at: ad.paid_at,
      payment_amount: ad.payment_amount,
      expires_at: ad.expires_at,
      created_at: ad.created_at,
      updated_at: ad.updated_at
    }));
    
    return NextResponse.json({ advertisements: transformedAds });
  } catch (error) {
    console.error('Error in GET /api/advertisements/my-ads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
