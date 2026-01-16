import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Alternative, Category, Tag, TechStack, ProprietarySoftware } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/mongodb/auth';
import mongoose from 'mongoose';

type SubmissionPlan = 'free' | 'sponsor';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get current user ID if logged in
    const user = await getCurrentUser();
    const userId = user?.id || null;

    const body = await request.json();

    const {
      name,
      short_description,
      description,
      long_description,
      icon_url,
      website,
      github,
      is_self_hosted,
      license,
      category_ids,
      tag_ids,
      tech_stack_ids,
      alternative_to_ids,
      submitter_name,
      submitter_email,
      screenshots,
      // New plan-related fields
      submission_plan = 'free' as SubmissionPlan,
      backlink_verified = false,
      backlink_url,
      sponsor_payment_id,
    } = body;

    // Validate required fields
    if (!name || !short_description || !description || !website || !github) {
      return NextResponse.json(
        { error: 'Name, short description, description, website, and GitHub repository are required' },
        { status: 400 }
      );
    }

    // Validate plan-specific requirements
    if (submission_plan === 'free' && !backlink_verified) {
      return NextResponse.json(
        { error: 'Backlink verification is required for free submissions. Please add the Open Source Finder badge to your README.' },
        { status: 400 }
      );
    }

    // For sponsor plan, we'd typically verify payment here
    if (submission_plan === 'sponsor' && !sponsor_payment_id) {
      return NextResponse.json(
        { error: 'Payment is required for sponsor submissions.' },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    // Check if an alternative with the same name or GitHub repo already exists
    const existingBySlug = await Alternative.findOne({ slug });
    const existingByGithub = await Alternative.findOne({ github: github.toLowerCase() });

    if (existingBySlug) {
      return NextResponse.json(
        { error: `An alternative with the name "${name}" already exists` },
        { status: 409 }
      );
    }

    if (existingByGithub) {
      return NextResponse.json(
        { error: 'This GitHub repository has already been submitted' },
        { status: 409 }
      );
    }

    // Calculate sponsor dates (7 days from now for sponsor plan)
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Determine approval status based on plan
    const isAutoApproved = submission_plan === 'sponsor';

    // Create the alternative
    const alternative = await Alternative.create({
      name,
      slug,
      description,
      short_description: short_description || null,
      long_description: long_description || null,
      icon_url: icon_url || null,
      website,
      github,
      is_self_hosted: is_self_hosted || false,
      license: license || null,
      health_score: 50,
      vote_score: 1,
      approved: isAutoApproved,
      featured: submission_plan === 'sponsor',
      submitter_name: submitter_name || null,
      submitter_email: submitter_email || null,
      screenshots: screenshots?.length > 0 ? screenshots : [],
      user_id: userId ? new mongoose.Types.ObjectId(userId) : null,
      // Plan-specific fields
      submission_plan,
      backlink_verified: submission_plan === 'free' ? backlink_verified : false,
      backlink_url: submission_plan === 'free' ? backlink_url : null,
      sponsor_featured_until: submission_plan === 'sponsor' ? sevenDaysLater : null,
      sponsor_priority_until: submission_plan === 'sponsor' ? sevenDaysLater : null,
      sponsor_payment_id: submission_plan === 'sponsor' ? sponsor_payment_id : null,
      sponsor_paid_at: submission_plan === 'sponsor' ? now : null,
      // Relations
      categories: category_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
      tags: tag_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
      tech_stacks: tech_stack_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
      alternative_to: alternative_to_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
    });

    // Return plan-specific success message
    const successMessage = submission_plan === 'sponsor'
      ? 'Your project is now live! It will be featured on the homepage for 7 days and included in our weekly newsletter.'
      : 'Alternative submitted successfully! It will be reviewed within approximately 1 week before being published.';

    return NextResponse.json({
      success: true,
      message: successMessage,
      id: alternative._id.toString(),
      slug: alternative.slug,
      plan: submission_plan,
      approved: isAutoApproved,
      features: submission_plan === 'sponsor' ? {
        featured_until: sevenDaysLater.toISOString(),
        priority_until: sevenDaysLater.toISOString(),
        newsletter: true,
      } : null,
    });
  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to submit an alternative' });
}
