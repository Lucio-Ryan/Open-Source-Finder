import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, Server, Scale } from 'lucide-react';
import { getAlternatives, getAlternativeBySlug, getCreatorProfileByUserId, getCreatorProfileByEmail } from '@/lib/mongodb/queries';
import { AlternativeWithRelations } from '@/types/database';
import { AlternativeCard, RichTextContent, GitHubStatsCard, ScreenshotCarousel, CreatorProfileCard, AlternativeVoteSection, DiscussionSection } from '@/components/ui';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const alternatives = await getAlternatives({ approved: true });
  return alternatives.map((alt) => ({
    slug: alt.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const alternative = await getAlternativeBySlug(params.slug);
  if (!alternative) return { title: 'Not Found' };

  return {
    title: `${alternative.name} - Open Source Alternative | OS_Finder`,
    description: alternative.description,
  };
}

export default async function AlternativeDetailPage({ params }: Props) {
  const alternative = await getAlternativeBySlug(params.slug);

  if (!alternative) {
    notFound();
  }

  // Fetch creator profile - first try by user_id, then by submitter_email
  let creatorProfile = null;
  if (alternative.user_id) {
    creatorProfile = await getCreatorProfileByUserId(alternative.user_id);
  } else if (alternative.submitter_email) {
    creatorProfile = await getCreatorProfileByEmail(alternative.submitter_email);
  }
  
  // Get similar alternatives based on categories
  const allAlternatives = await getAlternatives({ approved: true });
  const alternativeCategories = alternative.categories?.map((c: { slug: string }) => c.slug) || [];
  const similarAlternatives = allAlternatives
    .filter((a) => 
      a.id !== alternative.id && 
      a.categories?.some((c: { slug: string }) => alternativeCategories.includes(c.slug))
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/alternatives"
            className="inline-flex items-center text-muted hover:text-brand mb-6 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../alternatives
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              {alternative.icon_url ? (
                <Image
                  src={alternative.icon_url}
                  alt={`${alternative.name} icon`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-border"
                />
              ) : (
                <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center text-brand font-bold text-2xl flex-shrink-0 font-mono">
                  {alternative.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-mono">
                  {alternative.name}<span className="text-brand">_</span>
                </h1>
                <p className="text-lg text-muted max-w-2xl">
                  {alternative.short_description || alternative.description.replace(/<[^>]*>/g, '').slice(0, 150)}
                  {!alternative.short_description && alternative.description.replace(/<[^>]*>/g, '').length > 150 ? '...' : ''}
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  {alternative.is_self_hosted && (
                    <span className="inline-flex items-center px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium font-mono">
                      <Server className="w-4 h-4 mr-1" />
                      Self-Hosted
                    </span>
                  )}
                  {alternative.license && (
                    <span className="inline-flex items-center px-3 py-1 bg-surface text-muted rounded-full text-sm font-medium font-mono">
                      <Scale className="w-4 h-4 mr-1" />
                      {alternative.license}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={alternative.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light hover:shadow-glow transition-all"
              >
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              {alternative.github && (
                <a
                  href={alternative.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-surface border border-border text-white font-mono font-medium rounded-lg hover:border-brand transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots */}
            {alternative.screenshots && alternative.screenshots.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-mono text-brand mb-4">// screenshots</h2>
                <ScreenshotCarousel 
                  screenshots={alternative.screenshots} 
                  altName={alternative.name} 
                />
              </div>
            )}

            {/* About */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-mono text-brand mb-4">// about</h2>
              <RichTextContent 
                content={alternative.long_description || alternative.description}
                simple
              />
            </div>

            {/* Tags */}
            {alternative.tags && alternative.tags.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-mono text-brand mb-4">// tags</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.tags.map((tag: { id: string; name: string; slug: string }) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="px-3 py-1.5 bg-surface text-muted rounded-lg hover:bg-brand/10 hover:text-brand transition-colors text-sm font-medium font-mono border border-border"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {alternative.tech_stacks && alternative.tech_stacks.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-mono text-brand mb-4">// tech_stack</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.tech_stacks.map((tech: { id: string; name: string; slug: string }) => (
                    <Link
                      key={tech.id}
                      href={`/tech-stacks/${tech.slug}`}
                      className="px-3 py-1.5 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors text-sm font-medium font-mono capitalize"
                    >
                      {tech.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative To */}
            {alternative.alternative_to && alternative.alternative_to.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-mono text-brand mb-4">// alternative_to</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.alternative_to.map((software: { id: string; name: string; slug: string }) => (
                    <Link
                      key={software.id}
                      href={`/alternatives-to/${software.slug}`}
                      className="px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors text-sm font-medium font-mono capitalize"
                    >
                      {software.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Discussion Section */}
            <DiscussionSection 
              alternativeId={alternative.id}
              alternativeName={alternative.name}
              creatorId={alternative.user_id}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Vote */}
            <AlternativeVoteSection 
              alternativeId={alternative.id} 
              initialScore={(alternative as any).vote_score || 0}
            />

            {/* Creator Profile */}
            {creatorProfile && (
              <CreatorProfileCard creator={creatorProfile} />
            )}

            {/* GitHub Stats - Fetched automatically from GitHub API */}
            {alternative.github && (
              <GitHubStatsCard
                githubUrl={alternative.github}
                initialStars={alternative.stars}
                initialForks={alternative.forks}
                initialContributors={alternative.contributors}
                initialLastCommit={alternative.last_commit}
                initialHealthScore={alternative.health_score}
              />
            )}

            {/* Categories */}
            {alternative.categories && alternative.categories.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-mono text-brand mb-4">// categories</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.categories.map((category: { id: string; name: string; slug: string }) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="px-3 py-1.5 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors text-sm font-medium font-mono capitalize"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Alternatives */}
        {similarAlternatives.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono">// similar_alternatives<span className="text-brand">_</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarAlternatives.map((alt) => (
                <AlternativeCard key={alt.id} alternative={alt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
