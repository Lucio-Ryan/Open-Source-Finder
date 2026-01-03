import Link from 'next/link';
import { Tag } from '@/types';

interface TagBadgeProps {
  tag: Tag;
  size?: 'sm' | 'md' | 'lg';
}

export function TagBadge({ tag, size = 'md' }: TagBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <Link href={`/tags/${tag.slug}`}>
      <span className={`inline-flex items-center ${sizeClasses[size]} bg-slate-100 text-slate-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors font-medium`}>
        {tag.name}
        <span className="ml-2 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">
          {tag.count}
        </span>
      </span>
    </Link>
  );
}
