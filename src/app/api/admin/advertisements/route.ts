import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

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

// GET - List all advertisements (admin view)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const adType = searchParams.get('type');

    await connectToDatabase();

    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (adType) {
      filter.ad_type = adType;
    }

    const data = await Advertisement.find(filter)
      .sort({ created_at: -1 })
      .lean();

    // Transform to match expected format
    const advertisements = data.map(ad => ({
      id: ad._id,
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
      submitter_name: ad.submitter_name,
      submitter_email: ad.submitter_email,
      rejection_reason: ad.rejection_reason,
      created_at: ad.created_at,
      updated_at: ad.updated_at
    }));

    return NextResponse.json({ advertisements });
  } catch (error) {
    console.error('Admin advertisements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update advertisement (approve, reject, edit)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, rejection_reason, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Advertisement ID required' }, { status: 400 });
    }

    await connectToDatabase();

    let updateData: Record<string, any> = {};

    if (action === 'approve') {
      updateData = {
        status: 'approved',
        is_active: true,
        approved_at: new Date(),
        approved_by: new mongoose.Types.ObjectId(auth.userId),
        rejection_reason: null,
      };
    } else if (action === 'reject') {
      updateData = {
        status: 'rejected',
        is_active: false,
        rejection_reason: rejection_reason || 'No reason provided',
      };
    } else if (action === 'deactivate') {
      updateData = {
        is_active: false,
      };
    } else if (action === 'activate') {
      updateData = {
        is_active: true,
      };
    } else {
      // Regular update - only allow specific fields
      const allowedFields = [
        'name', 'description', 'ad_type', 'company_name', 'company_website',
        'company_logo', 'headline', 'cta_text', 'destination_url', 'icon_url',
        'short_description', 'is_active', 'priority', 'start_date', 'end_date'
      ];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      }
    }

    const data = await Advertisement.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!data) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: action ? `Advertisement ${action}d successfully` : 'Advertisement updated',
      advertisement: {
        id: data._id,
        name: data.name,
        status: data.status,
        is_active: data.is_active
      }
    });
  } catch (error) {
    console.error('Admin advertisement update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete advertisement
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Advertisement ID required' }, { status: 400 });
    }

    await connectToDatabase();

    await Advertisement.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Advertisement deleted' });
  } catch (error) {
    console.error('Admin advertisement delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
