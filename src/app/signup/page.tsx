import { Metadata } from 'next';
import { Terminal } from 'lucide-react';
import { AuthForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Sign Up | OSS_Finder',
  description: 'Create an OSS_Finder account to submit and manage open source alternatives.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 border border-brand/30 rounded-2xl mb-4">
            <Terminal className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">
            Create account<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono text-sm mt-2">
            Join the open source community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
