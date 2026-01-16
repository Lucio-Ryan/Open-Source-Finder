import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Policy, User } from '@/lib/mongodb/models';
import { verifyToken } from '@/lib/mongodb/auth';

// GET /api/policies - Fetch all policies
export async function GET() {
  try {
    await connectToDatabase();
    
    const policies = await Policy.find({}).sort({ type: 1 });

    return NextResponse.json(
      policies.map(policy => ({
        id: policy._id,
        type: policy.type,
        title: policy.title,
        content: policy.content,
        updated_at: policy.updated_at,
        created_at: policy.created_at
      }))
    );
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policies' },
      { status: 500 }
    );
  }
}

// PUT /api/policies - Update a policy (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Verify user is admin
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, title, content } = body;

    // Validate input
    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['privacy', 'terms', 'refund'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid policy type' },
        { status: 400 }
      );
    }

    // Update or create policy
    const policy = await Policy.findOneAndUpdate(
      { type },
      { 
        title, 
        content,
        updated_by: user._id 
      },
      { 
        new: true,
        upsert: true,
        runValidators: true 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Policy updated successfully',
      policy: {
        id: policy._id,
        type: policy.type,
        title: policy.title,
        content: policy.content,
        updated_at: policy.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating policy:', error);
    return NextResponse.json(
      { error: 'Failed to update policy' },
      { status: 500 }
    );
  }
}
