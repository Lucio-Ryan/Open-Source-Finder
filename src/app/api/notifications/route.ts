import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { CreatorNotification, Alternative, Discussion, User } from '@/lib/mongodb/models';
import mongoose from 'mongoose';

// GET - Get notifications for the current user
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';

  try {
    await connectToDatabase();

    const filter: any = { creator_id: new mongoose.Types.ObjectId(user.id) };
    if (unreadOnly) {
      filter.is_read = false;
    }

    const notifications = await CreatorNotification.find(filter)
      .populate('alternative_id', 'name slug')
      .populate({
        path: 'discussion_id',
        select: 'content user_id',
        populate: {
          path: 'user_id',
          select: 'name avatar_url'
        }
      })
      .sort({ created_at: -1 })
      .lean();

    // Get unread count
    const unreadCount = await CreatorNotification.countDocuments({
      creator_id: new mongoose.Types.ObjectId(user.id),
      is_read: false
    });

    // Transform notifications to match expected format
    const transformedNotifications = notifications.map(n => ({
      id: n._id,
      creator_id: n.creator_id,
      alternative_id: n.alternative_id ? (n.alternative_id as any)._id : null,
      discussion_id: n.discussion_id ? (n.discussion_id as any)._id : null,
      type: n.type,
      message: n.message,
      is_read: n.is_read,
      created_at: n.created_at,
      alternative: n.alternative_id ? {
        name: (n.alternative_id as any).name,
        slug: (n.alternative_id as any).slug
      } : null,
      discussion: n.discussion_id ? {
        content: (n.discussion_id as any).content,
        author: (n.discussion_id as any).user_id ? {
          name: (n.discussion_id as any).user_id.name,
          avatar_url: (n.discussion_id as any).user_id.avatar_url
        } : null
      } : null
    }));

    return NextResponse.json({ 
      notifications: transformedNotifications, 
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { notificationId, markAllRead } = body;

  try {
    await connectToDatabase();

    if (markAllRead) {
      // Mark all notifications as read for this user
      await CreatorNotification.updateMany(
        { creator_id: new mongoose.Types.ObjectId(user.id), is_read: false },
        { is_read: true }
      );

      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId or markAllRead is required' }, { status: 400 });
    }

    // Mark single notification as read
    await CreatorNotification.updateOne(
      { _id: new mongoose.Types.ObjectId(notificationId), creator_id: new mongoose.Types.ObjectId(user.id) },
      { is_read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE - Delete a notification
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get('id');

  if (!notificationId) {
    return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    await CreatorNotification.deleteOne({
      _id: new mongoose.Types.ObjectId(notificationId),
      creator_id: new mongoose.Types.ObjectId(user.id)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
