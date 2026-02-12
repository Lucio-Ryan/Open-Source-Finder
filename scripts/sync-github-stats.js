#!/usr/bin/env node

/**
 * GitHub Stats Sync Cron Script
 * 
 * Standalone script that triggers the GitHub sync API endpoint.
 * Can be run via:
 *   - Render.com cron jobs
 *   - Cloudflare Workers (scheduled)
 *   - System crontab
 *   - GitHub Actions (scheduled workflow)
 * 
 * Usage:
 *   node scripts/sync-github-stats.js
 * 
 * Environment variables:
 *   SITE_URL     - Base URL of the site (default: http://localhost:3000)
 *   CRON_SECRET  - Auth token for the sync endpoint
 *   SYNC_LIMIT   - Max repos per run (default: 50)
 * 
 * Recommended cron schedule: every 6 hours
 *   0 */6 * * * node scripts/sync-github-stats.js
 */

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || '';
const SYNC_LIMIT = process.env.SYNC_LIMIT || '50';

async function syncGitHubStats() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting GitHub stats sync...`);
  console.log(`  Target: ${SITE_URL}/api/github-stats/sync`);
  console.log(`  Limit: ${SYNC_LIMIT} repos per batch`);

  try {
    const url = new URL('/api/github-stats/sync', SITE_URL);
    url.searchParams.set('limit', SYNC_LIMIT);

    const headers = {
      'Content-Type': 'application/json',
    };

    if (CRON_SECRET) {
      headers['Authorization'] = `Bearer ${CRON_SECRET}`;
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`[${new Date().toISOString()}] Sync completed in ${elapsed}s`);
    console.log(`  Synced:  ${result.synced}`);
    console.log(`  Skipped: ${result.skipped}`);
    console.log(`  Errors:  ${result.errors}`);
    console.log(`  Total:   ${result.total}`);

    if (result.errorDetails && result.errorDetails.length > 0) {
      console.log(`  Error details:`);
      result.errorDetails.forEach(err => {
        console.log(`    - ${err.slug}: ${err.error}`);
      });
    }

    // Exit with error code if there were failures
    if (result.errors > 0 && result.synced === 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Sync failed:`, error.message || error);
    process.exit(1);
  }
}

syncGitHubStats();
