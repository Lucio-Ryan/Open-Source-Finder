import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// PUT - Resubmit a rejected advertisement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();
    
    // Find the advertisement
    const advertisement = await Advertisement.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user_id: new mongoose.Types.ObjectId(user.id)
    });

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    // Only rejected ads can be resubmitted
    if (advertisement.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Only rejected advertisements can be resubmitted' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      company_name,
      company_website,
      company_logo,
      headline,
      cta_text,
      destination_url,
      icon_url,
      short_description,
    } = body;

    // Validate required fields
    if (!name || !description || !company_name || !company_website || !destination_url) {
      return NextResponse.json(
        { error: 'Name, description, company name, company website, and destination URL are required' },
        { status: 400 }
      );
    }

    // Update the advertisement and set status back to pending
    await Advertisement.findByIdAndUpdate(advertisement._id, {
      name,
      description,
      company_name,
      company_website,
      company_logo: company_logo || null,
      headline: headline || null,
      cta_text: cta_text || 'Learn More',
      destination_url,
      icon_url: icon_url || null,
      short_description: short_description || null,
      status: 'pending',
      rejection_reason: null,
      updated_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Advertisement resubmitted successfully for review'
    });
  } catch (error) {
    console.error('Error in PUT /api/advertisements/[id]/resubmit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
