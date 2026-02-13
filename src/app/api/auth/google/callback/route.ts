import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateOAuthUser, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/mongodb/auth';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const errorParam = request.nextUrl.searchParams.get('error');

  // Parse return URL from state
  let returnTo = '/dashboard';
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
      returnTo = parsed.returnTo || '/dashboard';
    } catch {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  if (errorParam || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_denied`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData: GoogleTokenResponse = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('Google token error:', tokenData.error_description || tokenData.error);
      return NextResponse.redirect(`${baseUrl}/login?error=google_token_failed`);
    }

    // Fetch user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser: GoogleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_no_email`);
    }

    const { user, token, error } = await findOrCreateOAuthUser({
      provider: 'google',
      oauthId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name || null,
      avatarUrl: googleUser.picture || null,
    });

    if (error || !user || !token) {
      console.error('Google OAuth user error:', error);
      return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
    }

    const response = NextResponse.redirect(`${baseUrl}${returnTo}`);
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=google_callback_failed`);
  }
}
