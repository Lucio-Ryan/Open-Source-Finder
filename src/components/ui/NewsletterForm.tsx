'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Terminal } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center space-x-3 py-4 text-brand font-mono">
        <CheckCircle className="w-5 h-5" />
        <span>subscription_confirmed</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-lg text-white placeholder-muted font-mono focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3.5 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>loading...</span>
          </>
        ) : (
          <span>Subscribe_</span>
        )}
      </button>
    </form>
  );
}
