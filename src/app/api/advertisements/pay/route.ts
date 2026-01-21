import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Advertisement } from '@/lib/mongodb/models';
import { createPayPalOrder, PaymentType } from '@/lib/paypal';
import mongoose from 'mongoose';

// Pricing configuration
const PRICES = {
  banner: 49,
  card: 99,
  popup: 99, // Legacy, kept for compatibility
};

// Map ad types to payment types
const AD_TYPE_TO_PAYMENT_TYPE: Record<string, PaymentType> = {
  banner: 'ad_banner',
  card: 'ad_card',
  popup: 'ad_popup',
};

// POST - Create PayPal order for an approved advertisement
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

    // Get the payment type based on ad type
    const adType = advertisement.ad_type as keyof typeof PRICES;
    const paymentType = AD_TYPE_TO_PAYMENT_TYPE[adType] || 'ad_card';

    // Create PayPal order
    const { orderId, approvalUrl } = await createPayPalOrder(paymentType, {
      userId: user.id,
      advertisementId: advertisement._id.toString(),
      projectName: advertisement.name,
    });

    // Store the PayPal order ID on the advertisement
    await Advertisement.findByIdAndUpdate(advertisement._id, {
      paypal_order_id: orderId,
      updated_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'PayPal order created. Please complete payment.',
      order_id: orderId,
      approval_url: approvalUrl,
      payment: {
        amount: PRICES[adType] || 99,
        currency: 'USD',
        advertisement_id: advertisement._id.toString(),
      }
    });
  } catch (error) {
    console.error('Error in POST /api/advertisements/pay:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
