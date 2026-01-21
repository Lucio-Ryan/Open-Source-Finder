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

    // Check name/slug
    if (name) {
      const slug = generateSlug(name);
      const existingBySlug = await Alternative.findOne({ slug });
      if (existingBySlug) {
        errors.push(`A project with the name "${name}" already exists`);
      }
    }

    // Check GitHub URL
    if (github) {
      const existingByGithub = await Alternative.findOne({ 
        github: github.toLowerCase() 
      });
      if (existingByGithub) {
        errors.push('This GitHub repository has already been submitted');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        duplicate: true,
        errors,
      });
    }

    return NextResponse.json({
      duplicate: false,
      errors: [],
    });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    );
  }
}
