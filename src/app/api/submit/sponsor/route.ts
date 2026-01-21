import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Alternative } from '@/lib/mongodb/models';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { createPayPalOrder } from '@/lib/paypal';
import mongoose from 'mongoose';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// POST - Create a sponsor submission and initiate PayPal payment
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required for sponsor submissions' },
        { status: 401 }
      );
    }

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
    } = body;

    // Validate required fields
    if (!name || !short_description || !description || !website || !github) {
      return NextResponse.json(
        { error: 'Name, short description, description, website, and GitHub repository are required' },
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

    // Create the alternative with pending sponsor status
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
      approved: false, // Will be approved after payment
      featured: false, // Will be featured after payment
      submitter_name: submitter_name || user.name || null,
      submitter_email: submitter_email || user.email || null,
      screenshots: screenshots?.length > 0 ? screenshots : [],
      user_id: new mongoose.Types.ObjectId(user.id),
      // Plan-specific fields - pending payment
      submission_plan: 'sponsor',
      sponsor_payment_status: 'pending',
      // Relations
      categories: category_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
      tags: tag_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
      tech_stacks: tech_stack_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
      alternative_to: alternative_to_ids?.map((id: string) => new mongoose.Types.ObjectId(id)) || [],
    });

    // Create PayPal order
    const { orderId, approvalUrl } = await createPayPalOrder('sponsor_submission', {
      userId: user.id,
      submissionId: alternative._id.toString(),
      projectName: name,
    });

    // Store the PayPal order ID
    await Alternative.findByIdAndUpdate(alternative._id, {
      sponsor_paypal_order_id: orderId,
    });

    return NextResponse.json({
      success: true,
      submission_id: alternative._id.toString(),
      slug: alternative.slug,
      paypal_order_id: orderId,
      approval_url: approvalUrl,
      message: 'Submission created. Complete payment to activate sponsor benefits.',
    });

  } catch (error) {
    console.error('Error creating sponsor submission:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create submission' },
      { status: 500 }
    );
  }
}
