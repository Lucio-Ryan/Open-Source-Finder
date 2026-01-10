'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, MessageCircle, Check, CheckCheck, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { CreatorNotification } from '@/types/database';

interface NotificationsPanelProps {
  className?: string;
}

export default function NotificationsPanel({ className = '' }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<CreatorNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        setError(data.error || 'Failed to load notifications');
      }
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`bg-surface border border-border rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-mono text-brand">// notifications</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-brand animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-mono text-brand">// notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-brand/20 text-brand rounded-full text-xs font-mono">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs text-muted hover:text-brand transition-colors font-mono"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
          <p className="text-muted font-mono text-sm">No notifications yet</p>
          <p className="text-muted/70 text-xs mt-1">
            You&apos;ll be notified when users request your response
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.is_read
                  ? 'bg-dark/30 border-border'
                  : 'bg-brand/5 border-brand/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {notification.discussion?.author?.avatar_url ? (
                    <Image
                      src={notification.discussion.author.avatar_url}
                      alt="User"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">
                      {notification.message}
                    </p>
                    {notification.discussion?.content && (
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        &quot;{notification.discussion.content}&quot;
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted font-mono">
                        {formatDate(notification.created_at)}
                      </span>
                      {notification.alternative && (
                        <Link
                          href={`/alternatives/${notification.alternative.slug}#discussion`}
                          className="text-xs text-brand hover:text-brand-light font-mono flex items-center gap-1"
                          onClick={() => !notification.is_read && markAsRead(notification.id)}
                        >
                          View discussion
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 text-muted hover:text-brand transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
