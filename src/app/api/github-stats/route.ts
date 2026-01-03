import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const githubUrl = searchParams.get('github');

  if (!githubUrl) {
    return NextResponse.json(
      { error: 'Missing github URL parameter' },
      { status: 400 }
    );
  }

  try {
    const stats = await fetchGitHubStats(githubUrl);

    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to fetch GitHub stats. Please check the URL is valid.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
