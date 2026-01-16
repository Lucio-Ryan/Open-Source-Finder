import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Policy } from '@/lib/mongodb/models';

// GET /api/policies/:type - Fetch a specific policy
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;

    // Validate policy type
    if (!['privacy', 'terms', 'refund'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid policy type' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const policy = await Policy.findOne({ type });
    
    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: policy._id,
      type: policy.type,
      title: policy.title,
      content: policy.content,
      updated_at: policy.updated_at,
      created_at: policy.created_at
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policy' },
      { status: 500 }
    );
  }
}
