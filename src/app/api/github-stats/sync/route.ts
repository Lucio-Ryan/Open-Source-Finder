import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative } from '@/lib/mongodb/models';
import { fetchGitHubStats, parseGitHubUrl } from '@/lib/github';

/**
 * GitHub API Data Synchronization Endpoint
 * 
 * POST /api/github-stats/sync
 * 
 * Fetches and updates repository metadata from GitHub API for all alternatives
 * with GitHub URLs. Designed to be called by external cron services (e.g., Render cron,
 * Cloudflare Workers, or simple crontab).
 * 
 * Headers:
 *   Authorization: Bearer <CRON_SECRET>
 * 
 * Query params:
 *   ?limit=50   - Max repos to sync per run (default: 50)
 *   ?force=true - Force sync even if recently synced
 *   ?slug=xyz   - Sync only a specific alternative
 */

// How many hours before we consider a repo "stale" and needing re-sync
const STALE_HOURS = 6;

// Rate limit: delay between GitHub API calls to avoid hitting limits
const DELAY_BETWEEN_CALLS_MS = 1200; // ~50 calls per minute, well under 5000/hr

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  // Authenticate via secret token
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
  const force = searchParams.get('force') === 'true';
  const specificSlug = searchParams.get('slug');

  try {
    await connectToDatabase();

    // Build query for alternatives that need syncing
    const query: Record<string, any> = {
      github: { $exists: true, $ne: '' },
      approved: true,
    };

    // If specific slug, only sync that one
    if (specificSlug) {
      query.slug = specificSlug;
    }

    // Unless forced, only sync stale records
    if (!force && !specificSlug) {
      const staleDate = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000);
      query.$or = [
        { github_synced_at: { $exists: false } },
        { github_synced_at: null },
        { github_synced_at: { $lt: staleDate } },
      ];
    }

    const alternatives = await Alternative.find(query)
      .select('_id name slug github stars forks contributors last_commit health_score github_synced_at')
      .sort({ github_synced_at: 1 }) // Oldest synced first
      .limit(limit)
      .lean();

    if (alternatives.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No alternatives need syncing',
        synced: 0,
        skipped: 0,
        errors: 0,
      });
    }

    let synced = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: { slug: string; error: string }[] = [];

    for (const alt of alternatives) {
      try {
        const githubUrl = alt.github;
        if (!githubUrl || !parseGitHubUrl(githubUrl)) {
          skipped++;
          continue;
        }

        // Fetch stats from GitHub API
        const stats = await fetchGitHubStats(githubUrl);
        
        if (!stats) {
          errors++;
          errorDetails.push({ slug: alt.slug, error: 'Failed to fetch GitHub stats' });
          continue;
        }

        // Check if anything actually changed
        const hasChanged = !force && (
          alt.stars !== stats.stars ||
          alt.forks !== stats.forks ||
          alt.contributors !== stats.contributors ||
          alt.health_score !== stats.healthScore
        );

        if (!hasChanged && !force && (alt as any).github_synced_at) {
          // Just update sync timestamp
          await Alternative.updateOne(
            { _id: alt._id },
            { $set: { github_synced_at: new Date() } }
          );
          skipped++;
        } else {
          // Update all fields
          await Alternative.updateOne(
            { _id: alt._id },
            {
              $set: {
                stars: stats.stars,
                forks: stats.forks,
                contributors: stats.contributors,
                last_commit: stats.lastCommit ? new Date(stats.lastCommit) : alt.last_commit,
                license: stats.license || alt.license,
                health_score: stats.healthScore,
                github_synced_at: new Date(),
                updated_at: new Date(),
              },
            }
          );
          synced++;
        }

        // Rate limiting delay between API calls
        if (alternatives.indexOf(alt) < alternatives.length - 1) {
          await sleep(DELAY_BETWEEN_CALLS_MS);
        }
      } catch (error) {
        errors++;
        errorDetails.push({
          slug: alt.slug,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const result = {
      success: true,
      message: `Sync complete: ${synced} updated, ${skipped} skipped, ${errors} errors`,
      synced,
      skipped,
      errors,
      total: alternatives.length,
      timestamp: new Date().toISOString(),
      ...(errorDetails.length > 0 && { errorDetails: errorDetails.slice(0, 10) }),
    };

    console.log(`[GitHub Sync] ${result.message}`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GitHub Sync] Fatal error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also allow GET for simple health checks / cron triggers
export async function GET(request: NextRequest) {
  return POST(request);
}
