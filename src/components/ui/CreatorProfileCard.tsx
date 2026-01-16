import Image from 'next/image';
import { User, Globe, Github, Twitter, Linkedin, Youtube, MessageCircle, Package } from 'lucide-react';
import type { CreatorProfile } from '@/lib/mongodb/queries';

interface CreatorProfileCardProps {
  creator: CreatorProfile;
}

export function CreatorProfileCard({ creator }: CreatorProfileCardProps) {
  // Check if creator has any meaningful profile data to display
  const hasProfileData = creator.name || creator.bio || creator.avatar_url || 
    creator.website || creator.github_username || creator.twitter_username || 
    creator.linkedin_url || creator.youtube_url || creator.discord_username;

  // Don't render if there's no meaningful profile data
  if (!hasProfileData) {
    return null;
  }

  const socialLinks = [
    {
      key: 'website',
      url: creator.website,
      icon: Globe,
      label: 'Website',
      color: 'hover:text-brand',
    },
    {
      key: 'github',
      url: creator.github_username ? `https://github.com/${creator.github_username}` : null,
      icon: Github,
      label: 'GitHub',
      color: 'hover:text-white',
    },
    {
      key: 'twitter',
      url: creator.twitter_username ? `https://x.com/${creator.twitter_username}` : null,
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-blue-400',
    },
    {
      key: 'linkedin',
      url: creator.linkedin_url,
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-500',
    },
    {
      key: 'youtube',
      url: creator.youtube_url,
      icon: Youtube,
      label: 'YouTube',
      color: 'hover:text-red-500',
    },
    {
      key: 'discord',
      url: creator.discord_username ? `https://discord.com/users/${creator.discord_username}` : null,
      icon: MessageCircle,
      label: 'Discord',
      color: 'hover:text-indigo-400',
    },
  ].filter((link) => link.url);

  return (
    <div className="bg-surface rounded-xl border border-border p-6 overflow-hidden">
      <h2 className="text-lg font-mono text-brand mb-4">// creator</h2>
      
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {creator.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.name || 'Creator'}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand/30 flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-brand/30">
            <User className="w-8 h-8 text-brand" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {creator.name || 'Anonymous Creator'}
          </h3>
          
          {creator.bio && (
            <div 
              className="text-sm mt-1 text-muted line-clamp-4 prose prose-invert prose-sm max-w-none [&_p]:!mb-1 [&_p]:!mt-0 [&_p]:text-muted [&_a]:text-brand [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-white [&_em]:text-muted"
              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: creator.bio }}
            />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-brand" />
          <span className="text-muted">
            <span className="text-white font-semibold">{creator.alternatives_count}</span>
            {' '}alternative{creator.alternatives_count !== 1 ? 's' : ''} submitted
          </span>
        </div>
      </div>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-dark rounded-lg text-muted transition-colors ${link.color}`}
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
