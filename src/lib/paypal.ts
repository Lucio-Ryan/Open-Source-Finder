// PayPal SDK Configuration
// Uses PayPal Sandbox for development/testing

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Pricing configuration
export const PRICES = {
  sponsor_submission: {
    amount: '49.00',
    currency: 'USD',
    description: 'Sponsor Plan - Featured listing for 7 days + Newsletter feature + Instant approval',
  },
  boost_alternative: {
    amount: '49.00',
    currency: 'USD',
    description: 'Boost Alternative - Featured listing for 7 days + Newsletter feature',
  },
  ad_banner: {
    amount: '49.00',
    currency: 'USD',
    description: 'Banner Advertisement - 7 days visibility',
  },
  ad_card: {
    amount: '99.00',
    currency: 'USD',
    description: 'Card Advertisement - 7 days visibility in listings grid',
  },
  ad_popup: {
    amount: '99.00',
    currency: 'USD',
    description: 'Popup Advertisement - 7 days visibility',
  },
} as const;

// Coupon codes configuration
export const COUPON_CODES: Record<string, { discount: number; description: string; validFor?: PaymentType[] }> = {
  'LAUNCH60': {
    discount: 0.60, // 60% off
    description: '60% launch discount',
    validFor: ['sponsor_submission', 'boost_alternative'],
  },
  'LISTEDDISCOUNT': {
    discount: 0.60, // 60% off
    description: '60% discount for admin-listed projects',
    validFor: ['sponsor_submission', 'boost_alternative'],
  },
};

/**
 * Apply a coupon code to a price
 */
export function applyCoupon(
  paymentType: PaymentType,
  couponCode: string
): { valid: boolean; originalAmount: string; discountedAmount: string; discount: number; description?: string } {
  const normalizedCode = couponCode.trim().toUpperCase();
  const coupon = COUPON_CODES[normalizedCode];
  const originalAmount = PRICES[paymentType].amount;
  
  if (!coupon) {
    return { valid: false, originalAmount, discountedAmount: originalAmount, discount: 0 };
  }
  
  // Check if coupon is valid for this payment type
  if (coupon.validFor && !coupon.validFor.includes(paymentType)) {
    return { valid: false, originalAmount, discountedAmount: originalAmount, discount: 0 };
  }
  
  const discountedAmount = (parseFloat(originalAmount) * (1 - coupon.discount)).toFixed(2);
  
  return {
    valid: true,
    originalAmount,
    discountedAmount,
    discount: coupon.discount,
    description: coupon.description,
  };
}

export type PaymentType = keyof typeof PRICES;

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
  payer: {
    email_address: string;
    payer_id: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
}

/**
 * Get PayPal access token using client credentials
 */
export async function getAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal token error:', error);
    throw new Error('Failed to get PayPal access token');
  }

  const data: PayPalAccessTokenResponse = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal order for payment
 */
export async function createPayPalOrder(
  paymentType: PaymentType,
  metadata: {
    userId?: string;
    submissionId?: string;
    advertisementId?: string;
    alternativeId?: string;
    projectName?: string;
    couponCode?: string;
  }
): Promise<{ orderId: string; approvalUrl: string }> {
  const accessToken = await getAccessToken();
  const priceConfig = PRICES[paymentType];

  // Apply coupon if provided
  let finalAmount: string = priceConfig.amount;
  if (metadata.couponCode) {
    const couponResult = applyCoupon(paymentType, metadata.couponCode);
    if (couponResult.valid) {
      finalAmount = couponResult.discountedAmount;
    }
  }

  // Build reference ID to track what this payment is for
  const referenceId = JSON.stringify({
    type: paymentType,
    ...metadata,
    timestamp: Date.now(),
  });

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: Buffer.from(referenceId).toString('base64'),
        description: priceConfig.description,
        amount: {
          currency_code: priceConfig.currency,
          value: finalAmount,
        },
        custom_id: metadata.submissionId || metadata.advertisementId || metadata.alternativeId || '',
      },
    ],
    application_context: {
      brand_name: 'OPEN_SRC.ME',
      landing_page: 'NO_PREFERENCE',
      shipping_preference: 'NO_SHIPPING', // Removes billing/shipping address requirement
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paypal/capture`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paypal/cancel`,
    },
  };

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal create order error:', error);
    throw new Error('Failed to create PayPal order');
  }

  const data: PayPalOrderResponse = await response.json();
  
  const approvalLink = data.links.find(link => link.rel === 'approve');
  if (!approvalLink) {
    throw new Error('No approval URL in PayPal response');
  }

  return {
    orderId: data.id,
    approvalUrl: approvalLink.href,
  };
}

/**
 * Capture a PayPal order after user approval
 */
export async function capturePayPalOrder(orderId: string): Promise<{
  success: boolean;
  captureId: string;
  status: string;
  amount: string;
  currency: string;
  payerEmail: string;
  payerName: string;
  metadata: any;
}> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal capture error:', error);
    throw new Error('Failed to capture PayPal payment');
  }

  const data: PayPalCaptureResponse = await response.json();
  
  const capture = data.purchase_units[0]?.payments?.captures[0];
  if (!capture) {
    throw new Error('No capture data in PayPal response');
  }

  // Decode the metadata from reference_id
  let metadata = {};
  try {
    const referenceId = data.purchase_units[0]?.reference_id;
    if (referenceId) {
      const decoded = Buffer.from(referenceId, 'base64').toString('utf-8');
      metadata = JSON.parse(decoded);
    }
  } catch (e) {
    console.error('Failed to decode payment metadata:', e);
  }

  return {
    success: capture.status === 'COMPLETED',
    captureId: capture.id,
    status: capture.status,
    amount: capture.amount.value,
    currency: capture.amount.currency_code,
    payerEmail: data.payer.email_address,
    payerName: `${data.payer.name.given_name} ${data.payer.name.surname}`,
    metadata,
  };
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrderDetails(orderId: string): Promise<{
  id: string;
  status: string;
  amount: string;
  currency: string;
}> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal get order error:', error);
    throw new Error('Failed to get PayPal order details');
  }

  const data = await response.json();
  
  return {
    id: data.id,
    status: data.status,
    amount: data.purchase_units[0]?.amount?.value || '0',
    currency: data.purchase_units[0]?.amount?.currency_code || 'USD',
  };
}

/**
 * Get the PayPal client ID for frontend use
 */
export function getPayPalClientId(): string {
  return PAYPAL_CLIENT_ID;
}

/**
 * Check if PayPal is configured
 */
export function isPayPalConfigured(): boolean {
  return Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
}
