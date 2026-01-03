'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertTriangle, Terminal } from 'lucide-react';

interface DebugResult {
  timestamp: string;
  environment: {
    isUsingMockData: boolean;
    hasSupabaseUrl: boolean;
    hasAnonKey: boolean;
    hasServiceRoleKey: boolean;
    usingKey: string;
    nodeEnv: string;
  };
  tests: {
    categoriesQuery?: {
      success: boolean;
      count: number;
      error: string | null;
      sample: any[];
    };
    alternativesQuery?: {
      success: boolean;
      count: number;
      error: string | null;
      sample: any[];
    };
    insertCapability?: {
      success: boolean;
      error?: string;
      message?: string;
      code?: string;
      hint?: string;
    };
  };
}

export default function DebugPage() {
  const [result, setResult] = useState<DebugResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ success }: { success: boolean | undefined }) => {
    if (success === undefined) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return success 
      ? <CheckCircle className="w-5 h-5 text-brand" />
      : <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand mb-4 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 font-mono">
            <Terminal className="w-8 h-8 inline mr-3 text-brand" />
            debug_diagnostics<span className="text-brand">_</span>
          </h1>
          <p className="text-muted">
            Test your database connection and submission system.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Run Button */}
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="mb-8 inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Running...' : 'Run Diagnostics'}
        </button>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 font-mono">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Environment */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-mono text-brand mb-4">// environment</h2>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Supabase URL:</span>
                  <StatusIcon success={result.environment.hasSupabaseUrl} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Anon Key:</span>
                  <StatusIcon success={result.environment.hasAnonKey} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Service Role Key:</span>
                  <StatusIcon success={result.environment.hasServiceRoleKey} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Using Key:</span>
                  <span className={result.environment.usingKey === 'service_role' ? 'text-brand' : 'text-yellow-400'}>
                    {result.environment.usingKey}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Mock Data Mode:</span>
                  <span className={result.environment.isUsingMockData ? 'text-yellow-400' : 'text-brand'}>
                    {result.environment.isUsingMockData ? 'Yes (No real DB)' : 'No (Using real DB)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Test */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-mono text-brand mb-4 flex items-center gap-2">
                <StatusIcon success={result.tests.categoriesQuery?.success} />
                // categories_query
              </h2>
              {result.tests.categoriesQuery && (
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-muted">Count: <span className="text-white">{result.tests.categoriesQuery.count}</span></p>
                  {result.tests.categoriesQuery.error && (
                    <p className="text-red-400">Error: {result.tests.categoriesQuery.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Alternatives Test */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-mono text-brand mb-4 flex items-center gap-2">
                <StatusIcon success={result.tests.alternativesQuery?.success} />
                // alternatives_query
              </h2>
              {result.tests.alternativesQuery && (
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-muted">Count: <span className="text-white">{result.tests.alternativesQuery.count}</span></p>
                  {result.tests.alternativesQuery.error && (
                    <p className="text-red-400">Error: {result.tests.alternativesQuery.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Insert Test */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-mono text-brand mb-4 flex items-center gap-2">
                <StatusIcon success={result.tests.insertCapability?.success} />
                // insert_capability
              </h2>
              {result.tests.insertCapability && (
                <div className="space-y-2 font-mono text-sm">
                  {result.tests.insertCapability.success ? (
                    <p className="text-brand">{result.tests.insertCapability.message}</p>
                  ) : (
                    <>
                      <p className="text-red-400">Error: {result.tests.insertCapability.error}</p>
                      {result.tests.insertCapability.code && (
                        <p className="text-muted">Code: {result.tests.insertCapability.code}</p>
                      )}
                      {result.tests.insertCapability.hint && (
                        <p className="text-yellow-400">Hint: {result.tests.insertCapability.hint}</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Troubleshooting */}
            {!result.tests.insertCapability?.success && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6">
                <h2 className="text-lg font-mono text-yellow-400 mb-4">// troubleshooting</h2>
                <div className="space-y-4 text-sm">
                  {result.environment.isUsingMockData && (
                    <div>
                      <p className="text-white font-medium mb-2">❌ No database connection</p>
                      <p className="text-muted">Add your Supabase credentials to <code className="text-brand">.env.local</code></p>
                    </div>
                  )}
                  {!result.environment.hasServiceRoleKey && !result.environment.isUsingMockData && (
                    <div>
                      <p className="text-white font-medium mb-2">⚠️ Using anon key (may have RLS restrictions)</p>
                      <ol className="text-muted list-decimal list-inside space-y-1">
                        <li>Go to your Supabase Dashboard → Project Settings → API</li>
                        <li>Copy the <code className="text-brand">service_role</code> key (keep it secret!)</li>
                        <li>Add to <code className="text-brand">.env.local</code>: <code className="text-brand">SUPABASE_SERVICE_ROLE_KEY=your-key</code></li>
                        <li>Restart your dev server</li>
                      </ol>
                    </div>
                  )}
                  {result.tests.insertCapability?.error?.includes('42501') && (
                    <div>
                      <p className="text-white font-medium mb-2">🔒 RLS Policy blocking inserts</p>
                      <p className="text-muted">Run the SQL in <code className="text-brand">supabase/fix-rls-policies.sql</code> in your Supabase SQL Editor</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <p className="text-center text-muted text-xs font-mono">
              Last run: {result.timestamp}
            </p>
          </div>
        )}

        {/* Instructions if no result */}
        {!result && !loading && (
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-lg font-mono text-brand mb-4">// getting_started</h2>
            <div className="space-y-4 text-muted text-sm">
              <p>Click "Run Diagnostics" to test your database connection.</p>
              <p>If you haven't set up Supabase yet:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Create a project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">supabase.com</a></li>
                <li>Run the SQL from <code className="text-brand">supabase/schema.sql</code> in the SQL Editor</li>
                <li>Copy your credentials to <code className="text-brand">.env.local</code></li>
                <li>Restart your dev server</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
