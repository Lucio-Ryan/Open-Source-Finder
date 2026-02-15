import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, Server, Scale, Tag } from 'lucide-react';
import { getAlternatives, getAlternativeBySlug, getCreatorProfileByUserId, getCreatorProfileByEmail } from '@/lib/mongodb/queries';
import { AlternativeWithRelations } from '@/types/database';
import { AlternativeCard, RichTextContent, GitHubStatsCard, ScreenshotCarousel, CreatorProfileCard, AlternativeVoteSection, DiscussionSection, AlternativeTagsHeader, ClaimButton, Breadcrumbs } from '@/components/ui';
import { generateAlternativeMetadata } from '@/lib/seo/metadata';
import { buildAlternativePageSchemas } from '@/lib/seo/structured-data';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
// Allow dynamic paths not generated at build time
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Return empty array to skip static generation - all pages will be dynamically rendered
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const alternative = await getAlternativeBySlug(params.slug);
    if (!alternative) return { title: 'Not Found' };

    return generateAlternativeMetadata({
      name: alternative.name,
      slug: alternative.slug,
      description: alternative.description,
      short_description: alternative.short_description,
      stars: alternative.stars,
      license: alternative.license,
      is_self_hosted: alternative.is_self_hosted,
      icon_url: alternative.icon_url,
      categories: alternative.categories,
      alternative_to: alternative.alternative_to,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Alternative | OPEN_SRC.ME' };
  }
}

export default async function AlternativeDetailPage({ params }: Props) {
  let alternative: AlternativeWithRelations | null = null;
  
  try {
    alternative = await getAlternativeBySlug(params.slug);
  } catch (error) {
    console.error('Error fetching alternative:', error);
  }

  if (!alternative) {
    notFound();
  }

  // Fetch creator profile and similar alternatives in parallel using Promise.allSettled
  let creatorProfile = null;
  let allAlternatives: Awaited<ReturnType<typeof getAlternatives>> = [];
  
  const results = await Promise.allSettled([
    // Creator profile
    (async () => {
      if (alternative!.user_id) {
        return await getCreatorProfileByUserId(alternative!.user_id);
      } else if (alternative!.submitter_email) {
        return await getCreatorProfileByEmail(alternative!.submitter_email);
      }
      return null;
    })(),
    // Similar alternatives
    getAlternatives({ approved: true, limit: 50 })
  ]);
  
  if (results[0].status === 'fulfilled') {
    creatorProfile = results[0].value;
  } else {
    console.error('Error fetching creator profile:', results[0].reason);
  }
  
  if (results[1].status === 'fulfilled') {
    allAlternatives = results[1].value;
  } else {
    console.error('Error fetching similar alternatives:', results[1].reason);
  }
  
  // Filter similar alternatives based on categories
  const alternativeCategories = alternative.categories?.map((c: { slug: string }) => c.slug) || [];
  const similarAlternatives = allAlternatives
    .filter((a) => 
      a.id !== alternative!.id && 
      a.categories?.some((c: { slug: string }) => alternativeCategories.includes(c.slug))
    )
    .slice(0, 3);

  // Build JSON-LD structured data
  const schemas = buildAlternativePageSchemas({
    name: alternative.name,
    slug: alternative.slug,
    description: alternative.description,
    short_description: alternative.short_description,
    website: alternative.website,
    github: alternative.github,
    stars: alternative.stars ?? undefined,
    license: alternative.license,
    is_self_hosted: alternative.is_self_hosted,
    icon_url: alternative.icon_url,
    screenshots: alternative.screenshots ?? undefined,
    categories: alternative.categories,
    health_score: alternative.health_score,
    created_at: alternative.created_at,
    updated_at: alternative.updated_at,
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* JSON-LD Structured Data */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumbs for SEO */}
          <div className="mb-3">
            <Breadcrumbs items={[
              { label: 'alternatives', href: '/alternatives' },
              ...(alternative.categories?.[0] ? [{ label: alternative.categories[0].name.toLowerCase(), href: `/categories/${alternative.categories[0].slug}` }] : []),
              { label: alternative.slug, href: `/alternatives/${alternative.slug}` },
            ]} />
          </div>
          <Link
            href="/alternatives"
            className="inline-flex items-center text-muted hover:text-brand mb-4 sm:mb-6 font-mono text-sm touch-manipulation py-1"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../alternatives
          </Link>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-start justify-between gap-4">
              {/* Left side: Icon, Name, Description */}
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                {alternative.icon_url ? (
                  <Image
                    src={alternative.icon_url}
                    alt={`${alternative.name} icon`}
                    width={64}
                    height={64}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0 border border-border"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand/10 rounded-xl flex items-center justify-center text-brand font-bold text-xl sm:text-2xl flex-shrink-0 font-mono">
                    {alternative.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 font-mono truncate">
                    {alternative.name}<span className="text-brand">_</span>
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted line-clamp-2 sm:line-clamp-none max-w-2xl">
                    {alternative.short_description || alternative.description.replace(/<[^>]*>/g, '').slice(0, 150)}
                    {!alternative.short_description && alternative.description.replace(/<[^>]*>/g, '').length > 150 ? '...' : ''}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4">
                    {alternative.is_self_hosted && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-brand/10 text-brand rounded-full text-xs sm:text-sm font-medium font-mono">
                        <Server className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Self-Hosted
                      </span>
                    )}
                    {alternative.license && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-surface text-muted rounded-full text-xs sm:text-sm font-medium font-mono">
                        <Scale className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {alternative.license}
                      </span>
                    )}
                    {/* Claim button - only show if no owner and has github */}
                    {!alternative.user_id && alternative.github && (
                      <ClaimButton
                        alternative={{
                          id: alternative.id,
                          name: alternative.name,
                          slug: alternative.slug,
                          github: alternative.github,
                          hasOwner: false,
                          approved: alternative.approved || false,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right side: Alternative Tags */}
              {(alternative as any).alternative_tags && (
                <div className="hidden sm:block flex-shrink-0 max-w-xs">
                  <AlternativeTagsHeader alternativeTags={(alternative as any).alternative_tags} />
                </div>
              )}
            </div>
            
            {/* Mobile: Alternative Tags */}
            {(alternative as any).alternative_tags && (
              <div className="sm:hidden">
                <AlternativeTagsHeader alternativeTags={(alternative as any).alternative_tags} />
              </div>
            )}

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <a
                href={alternative.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-brand text-dark font-mono font-medium text-sm rounded-lg hover:bg-brand-light hover:shadow-glow transition-all touch-manipulation active:scale-[0.98]"
              >
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              {alternative.github && (
                <a
                  href={alternative.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-surface border border-border text-white font-mono font-medium text-sm rounded-lg hover:border-brand transition-colors touch-manipulation"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
              )}
            </div>

            {/* Discount Code Banner */}
            {(() => {
              const alt = alternative as any;
              const hasDiscount = alt.discount_code;
              const isExpired = alt.discount_expires_at && new Date(alt.discount_expires_at) < new Date();
              if (!hasDiscount || isExpired) return null;
              return (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 font-medium">
                    Get {alt.discount_percentage ? `${alt.discount_percentage}% off` : 'a discount'}
                  </span>
                  <span className="text-white">
                    with code <span className="font-mono font-bold text-brand">{alt.discount_code}</span>
                  </span>
                  {alt.discount_description && (
                    <span className="text-muted">· {alt.discount_description}</span>
                  )}
                  {alt.discount_expires_at && (
                    <span className="text-muted text-xs">· Expires {new Date(alt.discount_expires_at).toLocaleDateString()}</span>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Screenshots */}
            {alternative.screenshots && alternative.screenshots.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-mono text-brand mb-3 sm:mb-4">// screenshots</h2>
                <ScreenshotCarousel 
                  screenshots={alternative.screenshots} 
                  altName={alternative.name} 
                />
              </div>
            )}

            {/* About */}
            <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-mono text-brand mb-3 sm:mb-4">// about</h2>
              <RichTextContent 
                content={alternative.long_description || alternative.description}
                simple
              />
            </div>

            {/* Tags */}
            {alternative.tags && alternative.tags.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-mono text-brand mb-3 sm:mb-4">// tags</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.tags.map((tag: { id: string; name: string; slug: string }) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-surface text-muted rounded-lg hover:bg-brand/10 hover:text-brand transition-colors text-xs sm:text-sm font-medium font-mono border border-border touch-manipulation"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {alternative.tech_stacks && alternative.tech_stacks.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-mono text-brand mb-3 sm:mb-4">// tech_stack</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.tech_stacks.map((tech: { id: string; name: string; slug: string }) => (
                    <Link
                      key={tech.id}
                      href={`/tech-stacks/${tech.slug}`}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors text-xs sm:text-sm font-medium font-mono capitalize touch-manipulation"
                    >
                      {tech.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative To */}
            {alternative.alternative_to && alternative.alternative_to.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-mono text-brand mb-3 sm:mb-4">// alternative_to</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.alternative_to.map((software: { id: string; name: string; slug: string }) => (
                    <Link
                      key={software.id}
                      href={`/alternatives-to/${software.slug}`}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors text-xs sm:text-sm font-medium font-mono capitalize touch-manipulation"
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
          <div className="space-y-4 sm:space-y-6">
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
              <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-mono text-brand mb-3 sm:mb-4">// categories</h2>
                <div className="flex flex-wrap gap-2">
                  {alternative.categories.map((category: { id: string; name: string; slug: string }) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors text-xs sm:text-sm font-medium font-mono capitalize touch-manipulation"
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
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 font-mono">// similar_alternatives<span className="text-brand">_</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
