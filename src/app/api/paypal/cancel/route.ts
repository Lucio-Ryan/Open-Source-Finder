import { NextRequest, NextResponse } from 'next/server';

// GET - Handle PayPal cancel redirect
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  // Redirect to payment cancelled page
  return NextResponse.redirect(
    new URL(`/payment/cancelled${token ? `?order_id=${token}` : ''}`, request.url)
  );
}
