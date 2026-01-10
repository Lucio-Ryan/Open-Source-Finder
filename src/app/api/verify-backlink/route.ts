import { NextRequest, NextResponse } from 'next/server';

// Extract owner and repo from GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('github.com')) {
      return null;
    }
    
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1].replace('.git', '') };
    }
    return null;
  } catch {
    return null;
  }
}

// Check if the README contains our backlink
async function checkReadmeForBacklink(owner: string, repo: string): Promise<{ found: boolean; url?: string }> {
  const branches = ['main', 'master', 'develop'];
  const files = ['README.md', 'readme.md', 'Readme.md', 'README'];

  for (const branch of branches) {
    for (const file of files) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
        const response = await fetch(rawUrl, {
          headers: {
            'User-Agent': 'OpenSourceFinder-BacklinkVerifier/1.0',
          },
        });

        if (response.ok) {
          const content = await response.text();
          
          // Check for various forms of our backlink
          const patterns = [
            'opensourcefinder.com',
            'open-source-finder.com',
            'OpenSourceFinder',
            'Open Source Finder',
          ];

          for (const pattern of patterns) {
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
              return { found: true, url: rawUrl };
            }
          }
        }
      } catch {
        // Continue to next file/branch
      }
    }
  }

  return { found: false };
}

// Also check the repository's website/homepage if set
async function checkRepoWebsite(owner: string, repo: string): Promise<{ found: boolean; url?: string }> {
  try {
    // Get repo info from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'OpenSourceFinder-BacklinkVerifier/1.0',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }),
      },
    });

    if (response.ok) {
      const repoData = await response.json();
      
      if (repoData.homepage) {
        // Try to fetch the homepage and check for backlink
        try {
          const homepageResponse = await fetch(repoData.homepage, {
            headers: {
              'User-Agent': 'OpenSourceFinder-BacklinkVerifier/1.0',
            },
          });

          if (homepageResponse.ok) {
            const content = await homepageResponse.text();
            if (content.toLowerCase().includes('opensourcefinder.com')) {
              return { found: true, url: repoData.homepage };
            }
          }
        } catch {
          // Website not accessible
        }
      }
    }
  } catch {
    // API error
  }

  return { found: false };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubUrl } = body;

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required', verified: false },
        { status: 400 }
      );
    }

    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL', verified: false },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Check README first
    const readmeResult = await checkReadmeForBacklink(owner, repo);
    if (readmeResult.found) {
      return NextResponse.json({
        verified: true,
        message: 'Backlink found in README!',
        foundAt: readmeResult.url,
      });
    }

    // Check website as fallback
    const websiteResult = await checkRepoWebsite(owner, repo);
    if (websiteResult.found) {
      return NextResponse.json({
        verified: true,
        message: 'Backlink found on project website!',
        foundAt: websiteResult.url,
      });
    }

    return NextResponse.json({
      verified: false,
      message: 'Backlink not found. Please add the Open Source Finder badge to your README.md and try again.',
    });

  } catch (error) {
    console.error('Error verifying backlink:', error);
    return NextResponse.json(
      { error: 'Failed to verify backlink', verified: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to verify a backlink' });
}
