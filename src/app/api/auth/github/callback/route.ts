import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateOAuthUser } from '@/lib/mongodb/auth';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
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
    return NextResponse.redirect(`${baseUrl}/login?error=github_denied`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${baseUrl}/api/auth/github/callback`,
      }),
    });

    const tokenData: GitHubTokenResponse = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('GitHub token error:', tokenData.error_description || tokenData.error);
      return NextResponse.redirect(`${baseUrl}/login?error=github_token_failed`);
    }

    // Fetch user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const githubUser: GitHubUser = await userRes.json();

    // Fetch verified email if not public
    let email = githubUser.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const emails: GitHubEmail[] = await emailsRes.json();
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || emails.find((e) => e.verified)?.email || null;
    }

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=github_no_email`);
    }

    const { user, error } = await findOrCreateOAuthUser({
      provider: 'github',
      oauthId: String(githubUser.id),
      email,
      name: githubUser.name,
      avatarUrl: githubUser.avatar_url,
      githubUsername: githubUser.login,
    });

    if (error || !user) {
      console.error('GitHub OAuth user error:', error);
      return NextResponse.redirect(`${baseUrl}/login?error=github_auth_failed`);
    }

    return NextResponse.redirect(`${baseUrl}${returnTo}`);
  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=github_callback_failed`);
  }
}
