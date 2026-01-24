import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github';

export const runtime = 'edge';

// In-memory cache for edge runtime
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const githubUrl = searchParams.get('github');

  if (!githubUrl) {
    return NextResponse.json(
      { error: 'Missing github URL parameter' },
      { status: 400 }
    );
  }

  // Check cache first
  const cached = cache.get(githubUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  }

  try {
    const stats = await fetchGitHubStats(githubUrl);

    if (!stats) {
      const errorResponse = {
        error: 'Failed to fetch GitHub stats. Please check the URL is valid.',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const response = {
      success: true,
      data: stats,
    };

    // Cache the response
    cache.set(githubUrl, { data: response, timestamp: Date.now() });

    // Clean old cache entries periodically (keep cache size manageable)
    if (cache.size > 500) {
      const now = Date.now();
      const keysToDelete: string[] = [];
      cache.forEach((value, key) => {
        if (now - value.timestamp > CACHE_TTL) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => cache.delete(key));
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
