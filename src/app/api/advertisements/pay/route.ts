import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// Pricing configuration
const PRICES = {
  banner: 49,
  card: 99,
  popup: 99, // Legacy, kept for compatibility
};

// POST - Process payment for an approved advertisement
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const body = await request.json();
    const { advertisement_id } = body;

    if (!advertisement_id) {
      return NextResponse.json(
        { error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }

    // Find the advertisement
    const advertisement = await Advertisement.findOne({
      _id: new mongoose.Types.ObjectId(advertisement_id),
      user_id: new mongoose.Types.ObjectId(user.id)
    });

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (advertisement.paid_at) {
      return NextResponse.json(
        { error: 'This advertisement has already been paid for' },
        { status: 400 }
      );
    }

    // Check if approved
    if (advertisement.status !== 'approved') {
      return NextResponse.json(
        { error: 'Only approved advertisements can be paid for' },
        { status: 400 }
      );
    }

    // Get the price based on ad type
    const adType = advertisement.ad_type as keyof typeof PRICES;
    const price = PRICES[adType] || 99;

    // Generate a mock payment ID (in production, integrate with Stripe/PayPal)
    // For now, we'll simulate a successful payment
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Calculate expiration date (7 days from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Update the advertisement with payment info
    await Advertisement.findByIdAndUpdate(advertisement._id, {
      payment_id: paymentId,
      paid_at: now,
      payment_amount: price,
      expires_at: expiresAt,
      is_active: true, // Activate the ad after payment
      updated_at: now
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully! Your advertisement is now live for 7 days.',
      payment: {
        payment_id: paymentId,
        amount: price,
        currency: 'USD',
        advertisement_id: advertisement._id.toString(),
        expires_at: expiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error in POST /api/advertisements/pay:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
