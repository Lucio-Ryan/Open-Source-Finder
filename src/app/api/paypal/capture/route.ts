import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative, Advertisement } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// GET - Handle PayPal redirect after payment approval
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token'); // PayPal order ID
  
  if (!token) {
    return NextResponse.redirect(new URL('/payment/error?reason=missing_token', request.url));
  }

  try {
    // Capture the payment
    const captureResult = await capturePayPalOrder(token);
    
    if (!captureResult.success) {
      return NextResponse.redirect(
        new URL(`/payment/error?reason=capture_failed&status=${captureResult.status}`, request.url)
      );
    }

    const metadata = captureResult.metadata as {
      type: string;
      userId?: string;
      submissionId?: string;
      advertisementId?: string;
      projectName?: string;
    };

    await connectToDatabase();
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Handle different payment types
    if (metadata.type === 'sponsor_submission' && metadata.submissionId) {
      // Update the alternative/submission with sponsor info
      await Alternative.findByIdAndUpdate(
        new mongoose.Types.ObjectId(metadata.submissionId),
        {
          submission_plan: 'sponsor',
          sponsor_payment_id: captureResult.captureId,
          sponsor_payment_amount: parseFloat(captureResult.amount),
          sponsor_paid_at: now,
          sponsor_priority_until: expiresAt,
          sponsor_featured_until: expiresAt,
          approved: true, // Auto-approve sponsors
          approved_at: now,
          rejection_reason: null,
          rejected_at: null,
          newsletter_included: true,
          updated_at: now,
        }
      );

      return NextResponse.redirect(
        new URL(`/payment/success?type=sponsor&id=${metadata.submissionId}`, request.url)
      );
    }

    if (metadata.type?.startsWith('ad_') && metadata.advertisementId) {
      // Update the advertisement with payment info
      await Advertisement.findByIdAndUpdate(
        new mongoose.Types.ObjectId(metadata.advertisementId),
        {
          payment_id: captureResult.captureId,
          paid_at: now,
          payment_amount: parseFloat(captureResult.amount),
          expires_at: expiresAt,
          is_active: true,
          updated_at: now,
        }
      );

      return NextResponse.redirect(
        new URL(`/payment/success?type=advertisement&id=${metadata.advertisementId}`, request.url)
      );
    }

    // Unknown payment type - redirect to generic success
    return NextResponse.redirect(
      new URL(`/payment/success?capture_id=${captureResult.captureId}`, request.url)
    );

  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.redirect(
      new URL(`/payment/error?reason=capture_error`, request.url)
    );
  }
}

// POST - Capture payment programmatically (for frontend JS SDK)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Capture the payment
    const captureResult = await capturePayPalOrder(order_id);
    
    if (!captureResult.success) {
      return NextResponse.json(
        { error: 'Payment capture failed', status: captureResult.status },
        { status: 400 }
      );
    }

    const metadata = captureResult.metadata as {
      type: string;
      userId?: string;
      submissionId?: string;
      advertisementId?: string;
      projectName?: string;
    };

    await connectToDatabase();
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    let resultData: any = {
      success: true,
      capture_id: captureResult.captureId,
      amount: captureResult.amount,
      currency: captureResult.currency,
      payer_email: captureResult.payerEmail,
    };

    // Handle different payment types
    if (metadata.type === 'sponsor_submission' && metadata.submissionId) {
      await Alternative.findByIdAndUpdate(
        new mongoose.Types.ObjectId(metadata.submissionId),
        {
          submission_plan: 'sponsor',
          sponsor_payment_id: captureResult.captureId,
          sponsor_payment_amount: parseFloat(captureResult.amount),
          sponsor_paid_at: now,
          sponsor_priority_until: expiresAt,
          sponsor_featured_until: expiresAt,
          approved: true, // Auto-approve sponsors
          approved_at: now,
          rejection_reason: null,
          rejected_at: null,
          newsletter_included: true,
          updated_at: now,
        }
      );
      resultData.submission_id = metadata.submissionId;
      resultData.type = 'sponsor';
      resultData.expires_at = expiresAt.toISOString();
    }

    if (metadata.type?.startsWith('ad_') && metadata.advertisementId) {
      await Advertisement.findByIdAndUpdate(
        new mongoose.Types.ObjectId(metadata.advertisementId),
        {
          payment_id: captureResult.captureId,
          paid_at: now,
          payment_amount: parseFloat(captureResult.amount),
          expires_at: expiresAt,
          is_active: true,
          updated_at: now,
        }
      );
      resultData.advertisement_id = metadata.advertisementId;
      resultData.type = 'advertisement';
      resultData.expires_at = expiresAt.toISOString();
    }

    return NextResponse.json(resultData);

  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment capture failed' },
      { status: 500 }
    );
  }
}
