import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, SubmissionDraft } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/mongodb/auth';
import mongoose from 'mongoose';

// GET - Load existing draft for the current user
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to load a draft' },
        { status: 401 }
      );
    }

    const draft = await SubmissionDraft.findOne({ 
      user_id: new mongoose.Types.ObjectId(user.id) 
    });

    if (!draft) {
      return NextResponse.json({ draft: null });
    }

    return NextResponse.json({
      draft: {
        name: draft.name,
        short_description: draft.short_description,
        description: draft.description,
        long_description: draft.long_description,
        icon_url: draft.icon_url,
        website: draft.website,
        github: draft.github,
        license: draft.license,
        is_self_hosted: draft.is_self_hosted,
        screenshots: draft.screenshots,
        category_ids: draft.category_ids,
        tag_ids: draft.tag_ids,
        tech_stack_ids: draft.tech_stack_ids,
        alternative_to_ids: draft.alternative_to_ids,
        submitter_name: draft.submitter_name,
        submitter_email: draft.submitter_email,
        submission_plan: draft.submission_plan,
        sponsor_payment_id: draft.sponsor_payment_id,
        sponsor_paid: draft.sponsor_paid,
        updated_at: draft.updated_at,
      },
    });
  } catch (error) {
    console.error('Error loading draft:', error);
    return NextResponse.json(
      { error: 'Failed to load draft' },
      { status: 500 }
    );
  }
}

// POST - Save or update draft for the current user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to save a draft' },
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
      license,
      is_self_hosted,
      screenshots,
      category_ids,
      tag_ids,
      tech_stack_ids,
      alternative_to_ids,
      submitter_name,
      submitter_email,
      submission_plan,
      sponsor_payment_id,
      sponsor_paid,
    } = body;

    const draftData = {
      user_id: new mongoose.Types.ObjectId(user.id),
      name: name || '',
      short_description: short_description || '',
      description: description || '',
      long_description: long_description || null,
      icon_url: icon_url || null,
      website: website || '',
      github: github || '',
      license: license || '',
      is_self_hosted: is_self_hosted || false,
      screenshots: screenshots || [],
      category_ids: category_ids || [],
      tag_ids: tag_ids || [],
      tech_stack_ids: tech_stack_ids || [],
      alternative_to_ids: alternative_to_ids || [],
      submitter_name: submitter_name || null,
      submitter_email: submitter_email || null,
      submission_plan: submission_plan || 'free',
      sponsor_payment_id: sponsor_payment_id || null,
      sponsor_paid: sponsor_paid || false,
    };

    // Upsert - create if doesn't exist, update if it does
    const draft = await SubmissionDraft.findOneAndUpdate(
      { user_id: new mongoose.Types.ObjectId(user.id) },
      draftData,
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Draft saved successfully',
      draft: {
        id: draft._id.toString(),
        updated_at: draft.updated_at,
      },
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

// DELETE - Delete draft for the current user
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to delete a draft' },
        { status: 401 }
      );
    }

    await SubmissionDraft.deleteOne({ 
      user_id: new mongoose.Types.ObjectId(user.id) 
    });

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
