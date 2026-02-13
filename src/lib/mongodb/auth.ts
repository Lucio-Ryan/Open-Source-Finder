import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectToDatabase, User, Session, IUser } from '@/lib/mongodb';
import mongoose from 'mongoose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export const COOKIE_NAME = 'auth_token';
export const TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: TOKEN_EXPIRY,
  path: '/',
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'moderator';
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(user: IUser): Promise<string> {
  const token = await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY}s`)
    .sign(JWT_SECRET);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY,
    path: '/',
  });
}

// Remove auth cookie
export function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// Get auth cookie
export function getAuthCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// Get current user from request (server-side)
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const token = getAuthCookie();
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    await connectToDatabase();

    const user = await User.findById(payload.userId).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Get current user from token string (for API routes)
export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const payload = await verifyToken(token);
    if (!payload) return null;

    await connectToDatabase();

    const user = await User.findById(payload.userId).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

// Check if user is admin or moderator
export async function isAdminOrModerator(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || user?.role === 'moderator';
}

// Sign up new user
export async function signUp(
  email: string,
  password: string,
  name?: string
): Promise<{ user: AuthUser | null; token: string | null; error: string | null }> {
  try {
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { user: null, token: null, error: 'User with this email already exists' };
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      email_verified: true, // Auto-verify for now
    });

    // Create and set auth token
    const token = await createToken(user);
    setAuthCookie(token);

    // Save session
    await Session.create({
      user_id: user._id,
      token,
      expires_at: new Date(Date.now() + TOKEN_EXPIRY * 1000),
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
      token,
      error: null,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, token: null, error: 'Failed to create account' };
  }
}

// Sign in user
export async function signIn(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; token: string | null; error: string | null }> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { user: null, token: null, error: 'Invalid email or password' };
    }

    // OAuth-only users cannot sign in with password
    if (user.oauth_provider && !user.password) {
      return { user: null, token: null, error: `This account uses ${user.oauth_provider === 'github' ? 'GitHub' : 'Google'} sign-in. Please use that instead.` };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { user: null, token: null, error: 'Invalid email or password' };
    }

    // Create token
    const token = await createToken(user);
    setAuthCookie(token);

    // Save session
    await Session.create({
      user_id: user._id,
      token,
      expires_at: new Date(Date.now() + TOKEN_EXPIRY * 1000),
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
      token,
      error: null,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, token: null, error: 'Failed to sign in' };
  }
}

// Sign out user
export async function signOut(): Promise<void> {
  try {
    const token = getAuthCookie();
    if (token) {
      await connectToDatabase();
      await Session.deleteOne({ token });
    }
    removeAuthCookie();
  } catch (error) {
    console.error('Sign out error:', error);
    removeAuthCookie();
  }
}

// Get full user profile
export async function getUserProfile(userId: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findById(userId).select('-password').lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      website: user.website,
      github_username: user.github_username,
      twitter_username: user.twitter_username,
      linkedin_url: user.linkedin_url,
      youtube_url: user.youtube_url,
      discord_username: user.discord_username,
      role: user.role,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string;
    avatar_url: string;
    bio: string;
    website: string;
    github_username: string;
    twitter_username: string;
    linkedin_url: string;
    youtube_url: string;
    discord_username: string;
  }>
): Promise<{ success: boolean; error: string | null }> {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, { $set: updates });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// Find or create user via OAuth provider (GitHub / Google)
export async function findOrCreateOAuthUser(params: {
  provider: 'github' | 'google';
  oauthId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  githubUsername?: string | null;
}): Promise<{ user: AuthUser | null; token: string | null; error: string | null }> {
  try {
    await connectToDatabase();

    // 1. Try to find by OAuth provider + id
    let user = await User.findOne({
      oauth_provider: params.provider,
      oauth_id: params.oauthId,
    });

    if (!user) {
      // 2. Try to find by email — link this OAuth identity to existing account
      user = await User.findOne({ email: params.email.toLowerCase() });

      if (user) {
        // Link the OAuth identity to the existing user
        user.oauth_provider = params.provider;
        user.oauth_id = params.oauthId;
        if (!user.avatar_url && params.avatarUrl) {
          user.avatar_url = params.avatarUrl;
        }
        if (params.provider === 'github' && params.githubUsername && !user.github_username) {
          user.github_username = params.githubUsername;
        }
        user.email_verified = true;
        await user.save();
      } else {
        // 3. Create new user
        user = await User.create({
          email: params.email.toLowerCase(),
          password: null,
          name: params.name || params.email.split('@')[0],
          avatar_url: params.avatarUrl,
          email_verified: true,
          oauth_provider: params.provider,
          oauth_id: params.oauthId,
          github_username: params.provider === 'github' ? params.githubUsername : null,
        });
      }
    } else {
      // Update avatar / name if missing
      let changed = false;
      if (!user.avatar_url && params.avatarUrl) {
        user.avatar_url = params.avatarUrl;
        changed = true;
      }
      if (!user.name && params.name) {
        user.name = params.name;
        changed = true;
      }
      if (changed) await user.save();
    }

    // Create token & session
    const token = await createToken(user);
    setAuthCookie(token);

    await Session.create({
      user_id: user._id,
      token,
      expires_at: new Date(Date.now() + TOKEN_EXPIRY * 1000),
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
      token,
      error: null,
    };
  } catch (error) {
    console.error('OAuth findOrCreate error:', error);
    return { user: null, token: null, error: 'Failed to authenticate with OAuth' };
  }
}
