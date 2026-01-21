import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { createPayPalOrder, PaymentType, PRICES } from '@/lib/paypal';

// POST - Create a PayPal order for payment
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      payment_type,
      submission_id,
      advertisement_id,
      alternative_id,
      project_name,
    } = body;

    // Validate payment type
    if (!payment_type || !Object.keys(PRICES).includes(payment_type)) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // Create PayPal order
    const { orderId, approvalUrl } = await createPayPalOrder(
      payment_type as PaymentType,
      {
        userId: user.id,
        submissionId: submission_id,
        advertisementId: advertisement_id,
        alternativeId: alternative_id,
        projectName: project_name,
      }
    );

    return NextResponse.json({
      success: true,
      order_id: orderId,
      approval_url: approvalUrl,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// GET - Get PayPal client configuration
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  
  return NextResponse.json({
    client_id: clientId,
    mode: mode,
    configured: Boolean(clientId),
  });
}
