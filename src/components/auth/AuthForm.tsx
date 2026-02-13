'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null);
  
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the return URL from query params, default to dashboard
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  // Display error from OAuth redirect
  const oauthError = searchParams.get('error');
  useEffect(() => {
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        github_denied: 'GitHub sign-in was cancelled.',
        github_token_failed: 'Failed to authenticate with GitHub. Please try again.',
        github_no_email: 'Could not retrieve your email from GitHub. Please make sure your email is public or verified.',
        github_auth_failed: 'GitHub authentication failed. Please try again.',
        github_callback_failed: 'Something went wrong with GitHub sign-in. Please try again.',
        google_denied: 'Google sign-in was cancelled.',
        google_token_failed: 'Failed to authenticate with Google. Please try again.',
        google_no_email: 'Could not retrieve your email from Google.',
        google_auth_failed: 'Google authentication failed. Please try again.',
        google_callback_failed: 'Something went wrong with Google sign-in. Please try again.',
      };
      setError(errorMessages[oauthError] || 'Authentication failed. Please try again.');
    }
  }, [oauthError]);

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setOauthLoading(provider);
    const params = new URLSearchParams();
    if (returnTo !== '/dashboard') {
      params.set('returnTo', returnTo);
    }
    const qs = params.toString();
    window.location.href = `/api/auth/${provider}${qs ? `?${qs}` : ''}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          // Hard redirect to ensure cookie is picked up on full page load
          window.location.href = returnTo;
          return;
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          // Hard redirect to ensure cookie is picked up on full page load
          window.location.href = returnTo;
          return;
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {error && (
        <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs sm:text-sm font-mono">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 sm:p-4 bg-brand/10 border border-brand/30 rounded-lg text-brand text-xs sm:text-sm font-mono">
          {success}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={!!oauthLoading || loading}
          onClick={() => handleOAuthLogin('github')}
          className="w-full py-2.5 sm:py-3 bg-[#24292f] hover:bg-[#32383f] text-white font-mono font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2.5 touch-manipulation active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-[#444c56]"
        >
          {oauthLoading === 'github' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GitHubIcon className="w-5 h-5" />
          )}
          Continue with GitHub
        </button>

        <button
          type="button"
          disabled={!!oauthLoading || loading}
          onClick={() => handleOAuthLogin('google')}
          className="w-full py-2.5 sm:py-3 bg-white hover:bg-gray-100 text-gray-800 font-mono font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2.5 touch-manipulation active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        >
          {oauthLoading === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-3 text-muted font-mono">or continue with email</span>
        </div>
      </div>

      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-mono text-muted mb-1.5 sm:mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors touch-manipulation"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-mono text-muted mb-1.5 sm:mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors touch-manipulation"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs sm:text-sm font-mono text-muted mb-1.5 sm:mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors pr-12 touch-manipulation"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors p-1 touch-manipulation"
          >
            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 sm:py-3 bg-brand text-dark font-mono font-semibold text-sm rounded-lg hover:bg-brand-light transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {mode === 'login' ? 'Sign In_' : 'Create Account_'}
      </button>

      <p className="text-center text-xs sm:text-sm font-mono text-muted">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href={`/signup${returnTo !== '/dashboard' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="text-brand hover:text-brand-light transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href={`/login${returnTo !== '/dashboard' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="text-brand hover:text-brand-light transition-colors">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
