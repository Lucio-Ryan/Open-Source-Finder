import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative } from '@/lib/mongodb/models';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { parseGitHubUrl } from '@/lib/github';

// The verification file that users need to add to their repo
const CLAIM_VERIFICATION_FILENAME = '.opensourcefinder-verify';

// Generate a unique verification code for a user claiming a repo
function generateVerificationCode(userId: string, alternativeId: string): string {
  return `opensourcefinder-claim-${userId}-${alternativeId}`;
}

// POST - Initiate a claim request (get verification instructions)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to claim a project' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { github } = body;

    if (!github) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    // Find the alternative by GitHub URL
    const alternative = await Alternative.findOne({ 
      github: github.toLowerCase() 
    });

    if (!alternative) {
      return NextResponse.json(
        { error: 'This project is not in our database' },
        { status: 404 }
      );
    }

    // Check if user already owns this alternative
    if (alternative.user_id?.toString() === user.id) {
      return NextResponse.json(
        { error: 'You already own this project' },
        { status: 400 }
      );
    }

    // Check if already owned by someone else
    if (alternative.user_id) {
      return NextResponse.json(
        { error: 'This project is already claimed by another user' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode(user.id, alternative._id.toString());

    return NextResponse.json({
      success: true,
      alternative: {
        id: alternative._id.toString(),
        name: alternative.name,
        slug: alternative.slug,
        github: alternative.github,
      },
      verification: {
        filename: CLAIM_VERIFICATION_FILENAME,
        content: verificationCode,
        instructions: [
          `Create a file named "${CLAIM_VERIFICATION_FILENAME}" in the root of your repository`,
          `Add this exact content to the file: ${verificationCode}`,
          `Commit and push the file to your main/master branch`,
          `Click "Verify Ownership" to complete the claim`,
        ],
      },
    });
  } catch (error) {
    console.error('Error initiating claim:', error);
    return NextResponse.json(
      { error: 'Failed to initiate claim' },
      { status: 500 }
    );
  }
}

// PUT - Verify the claim (check if file exists in repo)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to verify a claim' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { alternativeId } = body;

    if (!alternativeId) {
      return NextResponse.json(
        { error: 'Alternative ID is required' },
        { status: 400 }
      );
    }

    // Find the alternative
    const alternative = await Alternative.findById(alternativeId);

    if (!alternative) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if already owned
    if (alternative.user_id) {
      if (alternative.user_id.toString() === user.id) {
        return NextResponse.json(
          { error: 'You already own this project' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'This project is already claimed by another user' },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(alternative.github);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL in database' },
        { status: 400 }
      );
    }

    // Generate the expected verification code
    const expectedCode = generateVerificationCode(user.id, alternative._id.toString());

    // Try to fetch the verification file from GitHub
    // Try multiple branch names
    const branches = ['main', 'master'];
    let fileContent: string | null = null;
    let fetchError: string | null = null;

    for (const branch of branches) {
      try {
        const url = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${branch}/${CLAIM_VERIFICATION_FILENAME}`;
        const response = await fetch(url, {
          headers: {
            'Accept': 'text/plain',
            'Cache-Control': 'no-cache',
          },
        });

        if (response.ok) {
          fileContent = (await response.text()).trim();
          break;
        }
      } catch (err) {
        fetchError = `Failed to fetch from ${branch} branch`;
      }
    }

    if (!fileContent) {
      return NextResponse.json({
        success: false,
        verified: false,
        error: `Verification file "${CLAIM_VERIFICATION_FILENAME}" not found in your repository. Make sure you've committed and pushed the file to the main or master branch.`,
      });
    }

    // Check if the content matches
    if (fileContent !== expectedCode) {
      return NextResponse.json({
        success: false,
        verified: false,
        error: 'Verification code does not match. Make sure you copied the exact verification code provided.',
        expected: expectedCode,
        found: fileContent.substring(0, 100), // Show first 100 chars for debugging
      });
    }

    // Success! Update the alternative with the user's ownership
    await Alternative.findByIdAndUpdate(alternativeId, {
      user_id: user.id,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Ownership verified successfully! You now own this project.',
      alternative: {
        id: alternative._id.toString(),
        name: alternative.name,
        slug: alternative.slug,
      },
    });
  } catch (error) {
    console.error('Error verifying claim:', error);
    return NextResponse.json(
      { error: 'Failed to verify claim' },
      { status: 500 }
    );
  }
}
