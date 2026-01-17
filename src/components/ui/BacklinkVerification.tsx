'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface BacklinkVerificationProps {
  projectName: string;
  githubUrl: string;
  onVerificationComplete: (verified: boolean, backlinkUrl?: string) => void;
}

export function BacklinkVerification({ projectName, githubUrl, onVerificationComplete }: BacklinkVerificationProps) {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Generate embed code - this is what users need to add to their README
  const embedCode = `[![Open Source Finder](https://opensourcefinder.com/badge.svg)](https://opensourcefinder.com/alternatives/${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')})`;

  const htmlBadge = `<a href="https://opensourcefinder.com/alternatives/${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><img src="https://opensourcefinder.com/badge.svg" alt="Open Source Finder" /></a>`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const verifyBacklink = async () => {
    if (!githubUrl) {
      setErrorMessage('Please enter a GitHub repository URL first');
      setVerificationStatus('error');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/verify-backlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl }),
      });

      const result = await response.json();

      if (result.verified) {
        setVerificationStatus('success');
        onVerificationComplete(true, result.foundAt);
      } else {
        setVerificationStatus('error');
        setErrorMessage(result.message || 'Backlink not found. Please add the badge to your README and try again.');
        onVerificationComplete(false);
      }
    } catch (err) {
      setVerificationStatus('error');
      setErrorMessage('Failed to verify backlink. Please try again.');
      onVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark/50 rounded-lg p-4 border border-border">
        <h4 className="text-sm font-medium text-white mb-3 font-mono">
          Step 1: Add this badge to your README.md
        </h4>
        
        {/* Markdown version */}
        <div className="mb-4">
          <label className="text-xs text-muted mb-2 block">Markdown (recommended for GitHub)</label>
          <div className="relative">
            <pre className="bg-surface border border-border rounded-lg p-3 text-sm text-brand font-mono overflow-x-auto">
              {embedCode}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(embedCode)}
              className="absolute top-2 right-2 p-2 bg-dark border border-border rounded-md hover:border-brand/50 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-brand" />
              ) : (
                <Copy className="w-4 h-4 text-muted" />
              )}
            </button>
          </div>
        </div>

        {/* HTML version */}
        <div>
          <label className="text-xs text-muted mb-2 block">HTML (for websites)</label>
          <div className="relative">
            <pre className="bg-surface border border-border rounded-lg p-3 text-sm text-brand font-mono overflow-x-auto text-wrap">
              {htmlBadge}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(htmlBadge)}
              className="absolute top-2 right-2 p-2 bg-dark border border-border rounded-md hover:border-brand/50 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-brand" />
              ) : (
                <Copy className="w-4 h-4 text-muted" />
              )}
            </button>
          </div>
        </div>

        {/* Badge preview */}
        <div className="mt-4 pt-4 border-t border-border">
          <label className="text-xs text-muted mb-2 block">Preview</label>
          <div className="flex items-center gap-2">
            <Image 
              src="/badge.svg" 
              alt="Open Source Finder Badge Preview" 
              width={100}
              height={20}
              className="h-5 w-auto"
            />
            <span className="text-xs text-muted">← This is how the badge will look</span>
          </div>
        </div>
      </div>

      <div className="bg-dark/50 rounded-lg p-4 border border-border">
        <h4 className="text-sm font-medium text-white mb-3 font-mono">
          Step 2: Verify your backlink
        </h4>
        <p className="text-sm text-muted mb-4">
          After adding the badge to your README, click the button below to verify. 
          We&apos;ll check your repository to confirm the badge is present.
        </p>

        <button
          type="button"
          onClick={verifyBacklink}
          disabled={isVerifying || !githubUrl}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium font-mono transition-all ${
            verificationStatus === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-brand/10 border border-brand/30 text-brand hover:bg-brand/20 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : verificationStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Backlink Verified!
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Verify Backlink
            </>
          )}
        </button>

        {verificationStatus === 'error' && errorMessage && (
          <div className="mt-3 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="mt-3 flex items-start gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Great! Your backlink has been verified. You can now submit your project.</span>
          </div>
        )}
      </div>

      {!githubUrl && (
        <div className="flex items-start gap-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Please fill in your GitHub repository URL above before verifying the backlink.</span>
        </div>
      )}
    </div>
  );
}
