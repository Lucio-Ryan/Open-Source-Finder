import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Discussion, Alternative, User, CreatorNotification } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// GET - Get discussions for an alternative
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alternativeId = searchParams.get('alternativeId');

  if (!alternativeId) {
    return NextResponse.json({ error: 'alternativeId is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Get all top-level discussions with author info
    const discussions = await Discussion.find({
      alternative_id: new mongoose.Types.ObjectId(alternativeId),
      parent_id: null
    })
      .populate('user_id', 'name avatar_url')
      .sort({ created_at: -1 })
      .lean();

    // Get discussion IDs
    const discussionIds = discussions.map(d => d._id);

    // Get all replies for these discussions
    let replies: any[] = [];
    if (discussionIds.length > 0) {
      replies = await Discussion.find({
        parent_id: { $in: discussionIds }
      })
        .populate('user_id', 'name avatar_url')
        .sort({ created_at: 1 })
        .lean();
    }

    // Organize replies under their parent discussions
    const discussionsWithReplies = discussions.map(discussion => ({
      id: discussion._id,
      alternative_id: discussion.alternative_id,
      user_id: discussion.user_id,
      content: discussion.content,
      request_creator_response: discussion.request_creator_response,
      is_creator_response: discussion.is_creator_response,
      created_at: discussion.created_at,
      updated_at: discussion.updated_at,
      author: discussion.user_id ? {
        id: (discussion.user_id as any)._id,
        name: (discussion.user_id as any).name,
        avatar_url: (discussion.user_id as any).avatar_url
      } : null,
      replies: replies
        .filter(r => r.parent_id?.toString() === discussion._id?.toString())
        .map(r => ({
          id: r._id,
          alternative_id: r.alternative_id,
          user_id: r.user_id,
          content: r.content,
          request_creator_response: r.request_creator_response,
          is_creator_response: r.is_creator_response,
          parent_id: r.parent_id,
          created_at: r.created_at,
          updated_at: r.updated_at,
          author: r.user_id ? {
            id: (r.user_id as any)._id,
            name: (r.user_id as any).name,
            avatar_url: (r.user_id as any).avatar_url
          } : null
        }))
    }));

    return NextResponse.json({ discussions: discussionsWithReplies });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

// POST - Create a new discussion or reply
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { alternativeId, content, requestCreatorResponse, parentId } = body;

  if (!alternativeId || !content) {
    return NextResponse.json({ error: 'alternativeId and content are required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Get the alternative to check if user is the creator
    const alternative = await Alternative.findById(alternativeId).lean();

    const isCreator = alternative && (
      alternative.user_id?.toString() === user.id || 
      alternative.submitter_email === user.email
    );

    // Create the discussion
    const discussion = await Discussion.create({
      alternative_id: new mongoose.Types.ObjectId(alternativeId),
      user_id: new mongoose.Types.ObjectId(user.id),
      content,
      request_creator_response: requestCreatorResponse || false,
      parent_id: parentId ? new mongoose.Types.ObjectId(parentId) : null,
      is_creator_response: isCreator || false
    });

    // Get author info
    const author = await User.findById(user.id).select('name avatar_url').lean();

    const discussionResponse = {
      id: discussion._id,
      alternative_id: discussion.alternative_id,
      user_id: discussion.user_id,
      content: discussion.content,
      request_creator_response: discussion.request_creator_response,
      is_creator_response: discussion.is_creator_response,
      parent_id: discussion.parent_id,
      created_at: discussion.created_at,
      updated_at: discussion.updated_at,
      author: author ? {
        id: author._id,
        name: author.name,
        avatar_url: author.avatar_url
      } : null
    };

    // If user requested a creator response and they're not the creator, create a notification
    if (requestCreatorResponse && !isCreator && alternative?.user_id) {
      // Get the poster's profile for the notification message
      const posterProfile = await User.findById(user.id).select('name').lean();
      const posterName = posterProfile?.name || user.email?.split('@')[0] || 'A user';

      await CreatorNotification.create({
        creator_id: alternative.user_id,
        alternative_id: new mongoose.Types.ObjectId(alternativeId),
        discussion_id: discussion._id,
        type: 'response_request',
        message: `${posterName} requested your response on "${alternative.name}"`
      });
    }

    return NextResponse.json({ discussion: discussionResponse });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}

// DELETE - Delete a discussion
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const discussionId = searchParams.get('id');

  if (!discussionId) {
    return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Check if user owns this discussion
    const discussion = await Discussion.findById(discussionId).lean();

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (discussion.user_id?.toString() !== user.id) {
      // Check if user is admin
      const profile = await User.findById(user.id).select('role').lean();

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Delete all replies first
    await Discussion.deleteMany({ parent_id: new mongoose.Types.ObjectId(discussionId) });

    // Delete related notifications
    await CreatorNotification.deleteMany({ discussion_id: new mongoose.Types.ObjectId(discussionId) });

    // Delete the discussion
    await Discussion.findByIdAndDelete(discussionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return NextResponse.json({ error: 'Failed to delete discussion' }, { status: 500 });
  }
}
