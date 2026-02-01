import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative } from '@/lib/mongodb/models';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// POST - Check if project name or GitHub repo already exists
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, github } = body;

    const errors: string[] = [];
    let existingAlternative: {
      id: string;
      name: string;
      slug: string;
      github: string;
      hasOwner: boolean;
      approved: boolean;
    } | null = null;

    // Check name/slug
    if (name) {
      const slug = generateSlug(name);
      const existingBySlug = await Alternative.findOne({ slug });
      if (existingBySlug) {
        errors.push(`A project with the name "${name}" already exists`);
        existingAlternative = {
          id: existingBySlug._id.toString(),
          name: existingBySlug.name,
          slug: existingBySlug.slug,
          github: existingBySlug.github,
          hasOwner: !!existingBySlug.user_id,
          approved: existingBySlug.approved,
        };
      }
    }

    // Check GitHub URL
    if (github) {
      const existingByGithub = await Alternative.findOne({ 
        github: github.toLowerCase() 
      });
      if (existingByGithub) {
        errors.push('This GitHub repository has already been submitted');
        // Prefer the GitHub match for claiming purposes
        existingAlternative = {
          id: existingByGithub._id.toString(),
          name: existingByGithub.name,
          slug: existingByGithub.slug,
          github: existingByGithub.github,
          hasOwner: !!existingByGithub.user_id,
          approved: existingByGithub.approved,
        };
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        duplicate: true,
        errors,
        existingAlternative,
        canClaim: existingAlternative && !existingAlternative.hasOwner,
      });
    }

    return NextResponse.json({
      duplicate: false,
      errors: [],
      existingAlternative: null,
      canClaim: false,
    });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    );
  }
}
