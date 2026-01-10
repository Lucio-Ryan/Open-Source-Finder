'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Loader2, 
  Mail, 
  CheckCircle, 
  Circle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface SponsoredAlternative {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string | null;
  website: string;
  sponsor_paid_at: string | null;
  sponsor_featured_until: string | null;
  newsletter_included: boolean;
}

// Get the Monday and Sunday of a week containing the given date
function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export default function AdminNewsletterPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sponsors, setSponsors] = useState<SponsoredAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Calculate week range based on offset
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + (currentWeekOffset * 7));
  const weekRange = getWeekRange(targetDate);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (!authLoading && profile && profile.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchSponsors = async () => {
      if (profile?.role !== 'admin') return;
      
      setLoading(true);
      const supabase = createClient();
      
      // Get sponsors who were paid/approved during the selected week
      const { data, error } = await supabase
        .from('alternatives')
        .select('id, name, slug, description, icon_url, website, sponsor_paid_at, sponsor_featured_until, newsletter_included')
        .eq('submission_plan', 'sponsor')
        .eq('approved', true)
        .gte('sponsor_paid_at', weekRange.start.toISOString())
        .lte('sponsor_paid_at', weekRange.end.toISOString())
        .order('sponsor_paid_at', { ascending: true });

      if (error) {
        console.error('Error fetching sponsors:', error);
      } else {
        setSponsors(data || []);
      }
      setLoading(false);
    };

    fetchSponsors();
  }, [profile, currentWeekOffset, weekRange.start, weekRange.end]);

  const toggleNewsletterIncluded = async (alternativeId: string, currentValue: boolean) => {
    setSaving(alternativeId);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('alternatives')
      .update({ newsletter_included: !currentValue })
      .eq('id', alternativeId);

    if (error) {
      console.error('Error updating newsletter status:', error);
      alert('Failed to update. Please try again.');
    } else {
      setSponsors(prev => prev.map(s => 
        s.id === alternativeId ? { ...s, newsletter_included: !currentValue } : s
      ));
    }
    setSaving(null);
  };

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return null;
  }

  const includedCount = sponsors.filter(s => s.newsletter_included).length;
  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center font-mono text-muted hover:text-brand mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../admin
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-mono">
                Newsletter Tracking<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono text-sm">
                Track sponsored alternatives for weekly newsletter
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-8 bg-surface border border-border rounded-xl p-4">
          <button
            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Week
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-white font-mono">
              <Calendar className="w-5 h-5 text-brand" />
              <span className="text-lg font-semibold">
                {formatDate(weekRange.start)} - {formatDate(weekRange.end)}
              </span>
              {isCurrentWeek && (
                <span className="px-2 py-0.5 bg-brand/20 text-brand text-xs rounded-full">
                  Current Week
                </span>
              )}
            </div>
            <p className="text-muted text-sm mt-1">
              {sponsors.length} sponsor{sponsors.length !== 1 ? 's' : ''} • {includedCount} marked for newsletter
            </p>
          </div>
          
          <button
            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg transition-colors"
          >
            Next Week
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sponsors List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : sponsors.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <Mail className="w-16 h-16 text-muted/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No sponsors this week</h3>
            <p className="text-muted font-mono text-sm">
              No sponsored alternatives were approved during this week.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">
              <div className="col-span-1">Newsletter</div>
              <div className="col-span-4">Alternative</div>
              <div className="col-span-3">Sponsored Date</div>
              <div className="col-span-2">Featured Until</div>
              <div className="col-span-2">Actions</div>
            </div>

            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className={`grid grid-cols-12 gap-4 items-center bg-surface border rounded-xl p-5 transition-colors ${
                  sponsor.newsletter_included 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-border hover:border-brand/30'
                }`}
              >
                {/* Checkbox */}
                <div className="col-span-1">
                  <button
                    onClick={() => toggleNewsletterIncluded(sponsor.id, sponsor.newsletter_included)}
                    disabled={saving === sponsor.id}
                    className="relative"
                  >
                    {saving === sponsor.id ? (
                      <Loader2 className="w-6 h-6 text-brand animate-spin" />
                    ) : sponsor.newsletter_included ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted hover:text-brand transition-colors" />
                    )}
                  </button>
                </div>

                {/* Alternative Info */}
                <div className="col-span-4 flex items-center gap-3">
                  {sponsor.icon_url ? (
                    <Image
                      src={sponsor.icon_url}
                      alt={sponsor.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-brand font-bold">
                      {sponsor.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-white">{sponsor.name}</h3>
                      <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-muted text-xs line-clamp-1 max-w-xs">
                      {sponsor.description.replace(/<[^>]*>/g, '').slice(0, 60)}...
                    </p>
                  </div>
                </div>

                {/* Sponsored Date */}
                <div className="col-span-3">
                  <span className="text-white font-mono text-sm">
                    {sponsor.sponsor_paid_at ? new Date(sponsor.sponsor_paid_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </span>
                </div>

                {/* Featured Until */}
                <div className="col-span-2">
                  <span className="text-muted font-mono text-sm">
                    {sponsor.sponsor_featured_until ? new Date(sponsor.sponsor_featured_until).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center gap-2">
                  <Link
                    href={`/alternatives/${sponsor.slug}`}
                    target="_blank"
                    className="p-2 text-muted hover:text-brand border border-border hover:border-brand/50 rounded-lg transition-colors"
                    title="View listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-mono text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg transition-colors"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary for Newsletter */}
        {sponsors.length > 0 && includedCount > 0 && (
          <div className="mt-8 bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 font-mono">
              Newsletter Summary<span className="text-brand">_</span>
            </h3>
            <div className="bg-dark rounded-lg p-4 font-mono text-sm">
              <p className="text-muted mb-3">// Sponsored alternatives for this week&apos;s newsletter:</p>
              <ul className="space-y-2">
                {sponsors.filter(s => s.newsletter_included).map((sponsor, index) => (
                  <li key={sponsor.id} className="text-white">
                    <span className="text-brand">{index + 1}.</span> {sponsor.name} - {sponsor.website}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
