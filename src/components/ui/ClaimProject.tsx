'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Loader2, 
  FileText, 
  AlertCircle,
  Github,
  ArrowRight
} from 'lucide-react';

interface ExistingAlternative {
  id: string;
  name: string;
  slug: string;
  github: string;
  hasOwner: boolean;
  approved: boolean;
}

interface ClaimVerification {
  filename: string;
  content: string;
  instructions: string[];
}

interface ClaimProjectProps {
  existingAlternative: ExistingAlternative;
  onClaimSuccess: () => void;
  onCancel: () => void;
}

export function ClaimProject({ existingAlternative, onClaimSuccess, onCancel }: ClaimProjectProps) {
  const [step, setStep] = useState<'info' | 'verify' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<ClaimVerification | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedFilename, setCopiedFilename] = useState(false);

  // Initiate the claim process
  const initiateClaim = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/submit/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ github: existingAlternative.github }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to initiate claim');
        return;
      }

      setVerification(data.verification);
      setStep('verify');
    } catch (err) {
      setError('Failed to initiate claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify the claim
  const verifyClaim = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/submit/claim', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ alternativeId: existingAlternative.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.verified) {
        setError(data.error || 'Verification failed');
        return;
      }

      setStep('success');
      setTimeout(() => {
        onClaimSuccess();
      }, 2000);
    } catch (err) {
      setError('Failed to verify claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'content' | 'filename') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'content') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedFilename(true);
        setTimeout(() => setCopiedFilename(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Extract repo URL for linking
  const repoUrl = existingAlternative.github.replace(/\.git$/, '');

  if (step === 'success') {
    return (
      <div className="bg-brand/10 border border-brand/30 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-brand" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Ownership Verified!</h3>
        <p className="text-muted">
          You now own <span className="text-brand font-semibold">{existingAlternative.name}</span>.
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Claim This Project</h3>
          <p className="text-sm text-muted">
            <span className="text-brand font-semibold">{existingAlternative.name}</span> already exists in our directory.
            {!existingAlternative.hasOwner && " You can claim ownership by verifying you control the repository."}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">
              {error === 'You must be logged in to claim a project' ? (
                <>
                  You must be logged in to claim a project.{' '}
                  <Link
                    href={`/signup?returnTo=${encodeURIComponent(`/alternatives/${existingAlternative.slug}#claim`)}`}
                    className="text-brand hover:text-brand-light underline font-semibold transition-colors"
                  >
                    Sign up
                  </Link>{' '}
                  to get started.
                </>
              ) : (
                error
              )}
            </p>
          </div>
        </div>
      )}

      {step === 'info' && (
        <>
          {/* Project info */}
          <div className="bg-dark/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Github className="w-5 h-5 text-muted" />
              <a 
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline font-mono text-sm flex items-center gap-1"
              >
                {existingAlternative.github}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className={`px-2 py-0.5 rounded ${existingAlternative.approved ? 'bg-brand/10 text-brand' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {existingAlternative.approved ? 'Approved' : 'Pending Review'}
              </span>
              <span className={`px-2 py-0.5 rounded ${existingAlternative.hasOwner ? 'bg-orange-500/10 text-orange-400' : 'bg-white/10 text-white'}`}>
                {existingAlternative.hasOwner ? 'Claimed' : 'Unclaimed'}
              </span>
            </div>
          </div>

          {existingAlternative.hasOwner ? (
            <div className="text-center py-4">
              <p className="text-muted mb-4">
                This project is already claimed by another user. If you believe this is an error, please contact support.
              </p>
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-2">How it works:</h4>
                <ol className="space-y-2 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-brand/20 text-brand rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>We&apos;ll give you a unique verification file to add to your repository</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-brand/20 text-brand rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Commit and push the file to your main/master branch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-brand/20 text-brand rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>Click verify and we&apos;ll confirm your ownership</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={initiateClaim}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-brand text-dark rounded-lg hover:bg-brand-light transition-colors font-mono font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Claim
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {step === 'verify' && verification && (
        <>
          <div className="space-y-4 mb-6">
            {/* Step 1: Filename */}
            <div className="bg-dark/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand" />
                  Step 1: Create this file in your repo root
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-dark px-3 py-2 rounded text-brand font-mono text-sm">
                  {verification.filename}
                </code>
                <button
                  onClick={() => copyToClipboard(verification.filename, 'filename')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Copy filename"
                >
                  {copiedFilename ? (
                    <CheckCircle className="w-4 h-4 text-brand" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: Content */}
            <div className="bg-dark/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">
                  Step 2: Add this exact content to the file
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-dark px-3 py-2 rounded text-white font-mono text-sm break-all">
                  {verification.content}
                </code>
                <button
                  onClick={() => copyToClipboard(verification.content, 'content')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Copy content"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-brand" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
            </div>

            {/* Step 3: Push */}
            <div className="bg-dark/50 rounded-lg p-4">
              <span className="text-sm font-semibold text-white block mb-2">
                Step 3: Commit and push to your main/master branch
              </span>
              <code className="block bg-dark px-3 py-2 rounded text-muted font-mono text-xs">
                git add {verification.filename} && git commit -m &quot;Add ownership verification&quot; && git push
              </code>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('info')}
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-mono"
            >
              Back
            </button>
            <button
              onClick={verifyClaim}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-brand text-dark rounded-lg hover:bg-brand-light transition-colors font-mono font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Verify Ownership
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
