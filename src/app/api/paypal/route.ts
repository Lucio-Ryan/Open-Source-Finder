import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { createPayPalOrder, PaymentType, PRICES, getPayPalClientId, getAccessToken } from '@/lib/paypal';

// Helper to pick PayPal base URL
function getPayPalBaseUrl() {
  const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
  return PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

// POST - Create a PayPal order for payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If an explicit amount is provided, allow anonymous donation creation
    if (body.amount) {
      const amount = parseFloat(String(body.amount));
      const currency = (body.currency || 'USD').toUpperCase();
      const description = body.description || 'Donation to OPEN_SRC.ME';

      if (isNaN(amount) || amount < 1) {
        return NextResponse.json({ error: 'Invalid amount. Minimum is $1' }, { status: 400 });
      }

      const accessToken = await getAccessToken();
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            description,
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'OPEN_SRC.ME',
          landing_page: 'NO_PREFERENCE',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paypal/capture`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paypal/cancel`,
        },
      };

      const res = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('PayPal create order failed:', text);
        return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
      }

      const data = await res.json();
      const approvalLink = data.links?.find((l: any) => l.rel === 'approve')?.href;
      return NextResponse.json({ success: true, order_id: data.id, approval_url: approvalLink });
    }

    // Otherwise handle internal payment types (authenticated flows)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { payment_type, submission_id, advertisement_id, alternative_id, project_name } = body;

    // Validate payment type
    if (!payment_type || !Object.keys(PRICES).includes(payment_type)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    // Create PayPal order using existing helper
    const { orderId, approvalUrl } = await createPayPalOrder(payment_type as PaymentType, {
      userId: user.id,
      submissionId: submission_id,
      advertisementId: advertisement_id,
      alternativeId: alternative_id,
      projectName: project_name,
    });

    return NextResponse.json({ success: true, order_id: orderId, approval_url: approvalUrl });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create payment' }, { status: 500 });
  }
}

// GET - Get PayPal client configuration
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  return NextResponse.json({ client_id: clientId, mode: mode, configured: Boolean(clientId && process.env.PAYPAL_CLIENT_SECRET) });
}
