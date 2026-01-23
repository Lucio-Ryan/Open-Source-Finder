import { Metadata } from 'next';
import { Terminal } from 'lucide-react';
import { AuthForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Sign In | OS Finder',
  description: 'Sign in to your OS Finder account to manage your submitted alternatives',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-brand/10 border border-brand/30 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
            Welcome back<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono text-xs sm:text-sm mt-2">
            Sign in to manage your alternatives
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}
