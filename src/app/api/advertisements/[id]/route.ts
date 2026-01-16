import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// GET - Fetch a single advertisement by ID (user must own it)
export async function GET(
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
    
    const advertisement = await Advertisement.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user_id: new mongoose.Types.ObjectId(user.id)
    }).lean();

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      advertisement: {
        id: advertisement._id.toString(),
        name: advertisement.name,
        description: advertisement.description,
        ad_type: advertisement.ad_type,
        company_name: advertisement.company_name,
        company_website: advertisement.company_website,
        company_logo: advertisement.company_logo,
        headline: advertisement.headline,
        cta_text: advertisement.cta_text,
        destination_url: advertisement.destination_url,
        icon_url: advertisement.icon_url,
        short_description: advertisement.short_description,
        status: advertisement.status,
        rejection_reason: advertisement.rejection_reason,
        is_active: advertisement.is_active,
        created_at: advertisement.created_at,
        updated_at: advertisement.updated_at
      }
    });
  } catch (error) {
    console.error('Error in GET /api/advertisements/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
