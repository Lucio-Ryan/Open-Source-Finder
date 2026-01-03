// GitHub API utilities for fetching repository stats

export interface GitHubStats {
  stars: number;
  forks: number;
  contributors: number;
  lastCommit: string;
  openIssues: number;
  license: string | null;
  createdAt: string;
  updatedAt: string;
  healthScore: number;
}

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { spdx_id: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubContributor {
  id: number;
}

/**
 * Extract owner and repo from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  if (!url) return null;
  
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,  // https://github.com/owner/repo
    /github\.com:([^\/]+)\/([^\/\?#]+)/,   // git@github.com:owner/repo
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { 
        owner: match[1], 
        repo: match[2].replace(/\.git$/, '') 
      };
    }
  }

  return null;
}

/**
 * Fetch GitHub repository stats
 */
export async function fetchGitHubStats(githubUrl: string): Promise<GitHubStats | null> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    console.error('Invalid GitHub URL:', githubUrl);
    return null;
  }

  const { owner, repo } = parsed;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OSS-Finder',
  };

  // Add auth token if available for higher rate limits
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Fetch repo info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers, next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!repoResponse.ok) {
      console.error(`GitHub API error for ${owner}/${repo}:`, repoResponse.status);
      return null;
    }

    const repoData: GitHubRepoResponse = await repoResponse.json();

    // Fetch contributors count (limited to first page, max 100)
    let contributorsCount = 0;
    try {
      const contributorsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=1`,
        { headers, next: { revalidate: 3600 } }
      );
      
      if (contributorsResponse.ok) {
        // Get total from Link header
        const linkHeader = contributorsResponse.headers.get('Link');
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            contributorsCount = parseInt(lastPageMatch[1], 10);
          }
        } else {
          // If no pagination, count from response
          const contributors: GitHubContributor[] = await contributorsResponse.json();
          contributorsCount = contributors.length;
        }
      }
    } catch (e) {
      console.warn('Error fetching contributors:', e);
    }

    // Calculate health score
    const healthScore = calculateHealthScore({
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      contributors: contributorsCount,
      lastCommit: repoData.pushed_at,
      openIssues: repoData.open_issues_count,
      createdAt: repoData.created_at,
    });

    return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      contributors: contributorsCount,
      lastCommit: repoData.pushed_at,
      openIssues: repoData.open_issues_count,
      license: repoData.license?.spdx_id || null,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      healthScore,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}

/**
 * Calculate a health score based on various GitHub metrics
 * Score ranges from 0-100
 */
export function calculateHealthScore(metrics: {
  stars: number;
  forks: number;
  contributors: number;
  lastCommit: string;
  openIssues: number;
  createdAt: string;
}): number {
  let score = 0;

  // Stars score (0-25 points)
  // 10k+ stars = 25, scales logarithmically
  if (metrics.stars > 0) {
    const starScore = Math.min(25, Math.log10(metrics.stars + 1) * 6.25);
    score += starScore;
  }

  // Forks score (0-15 points)
  // 1k+ forks = 15, scales logarithmically
  if (metrics.forks > 0) {
    const forkScore = Math.min(15, Math.log10(metrics.forks + 1) * 5);
    score += forkScore;
  }

  // Contributors score (0-20 points)
  // 100+ contributors = 20, scales logarithmically
  if (metrics.contributors > 0) {
    const contributorScore = Math.min(20, Math.log10(metrics.contributors + 1) * 10);
    score += contributorScore;
  }

  // Activity score based on last commit (0-30 points)
  const lastCommitDate = new Date(metrics.lastCommit);
  const now = new Date();
  const daysSinceLastCommit = (now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceLastCommit <= 7) {
    score += 30; // Very active - committed in last week
  } else if (daysSinceLastCommit <= 30) {
    score += 25; // Active - committed in last month
  } else if (daysSinceLastCommit <= 90) {
    score += 18; // Moderately active - committed in last 3 months
  } else if (daysSinceLastCommit <= 180) {
    score += 10; // Low activity - committed in last 6 months
  } else if (daysSinceLastCommit <= 365) {
    score += 5; // Stale - committed in last year
  } else {
    score += 0; // Inactive - no commits in over a year
  }

  // Project maturity bonus (0-10 points)
  const createdDate = new Date(metrics.createdAt);
  const ageInYears = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  if (ageInYears >= 5) {
    score += 10; // Established project
  } else if (ageInYears >= 2) {
    score += 7; // Mature project
  } else if (ageInYears >= 1) {
    score += 4; // Growing project
  } else {
    score += 2; // New project
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}
