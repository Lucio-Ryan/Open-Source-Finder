import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Code, ChevronRight, Blocks } from 'lucide-react';
import { getTechStacks } from '@/lib/mongodb/queries';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Browse Open Source Software by Tech Stack',
  description: 'Discover open source alternatives by programming language and technology stack. Filter by Python, JavaScript, TypeScript, Go, Rust, React, Vue, Docker and more. Find tools built with your preferred technologies.',
  alternates: {
    canonical: '/tech-stacks',
  },
};

// Stack type order for display
const stackTypeOrder = [
  'Language',
  'Framework',
  'Tool',
  'SaaS',
  'Analytics',
  'Monitoring',
  'Cloud',
  'Hosting',
  'DB',
  'CI',
  'API',
  'Storage',
  'Messaging',
  'App',
  'Network',
];

// Map type to display label
const typeLabels: Record<string, string> = {
  Language: 'Languages',
  Framework: 'Frameworks',
  Tool: 'Tools',
  SaaS: 'SaaS & APIs',
  Analytics: 'Analytics',
  Monitoring: 'Monitoring',
  Cloud: 'Cloud Providers',
  Hosting: 'Hosting',
  DB: 'Databases',
  CI: 'CI/CD',
  API: 'API & Protocols',
  Storage: 'Storage',
  Messaging: 'Messaging & Queues',
  App: 'Applications',
  Network: 'Networking',
};

export default async function TechStacksPage() {
  let techStacks: Awaited<ReturnType<typeof getTechStacks>> = [];
  
  try {
    techStacks = await getTechStacks();
  } catch (error) {
    console.error('Error fetching tech-stacks page data:', error);
  }

  // Group tech stacks by type
  const groupedStacks = techStacks.reduce((acc, stack) => {
    const type = (stack as any).type || 'Tool';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(stack);
    return acc;
  }, {} as Record<string, typeof techStacks>);

  // Sort groups by stackTypeOrder
  const sortedGroups = Object.entries(groupedStacks).sort(([a], [b]) => {
    const indexA = stackTypeOrder.indexOf(a);
    const indexB = stackTypeOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Blocks className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">
              Tech Stacks<span className="text-brand">_</span>
            </h1>
          </div>
          <p className="text-muted font-mono text-sm">
            <span className="text-brand">$</span> Discover top tech stacks powering popular open-source projects
          </p>
          <p className="text-muted/70 text-sm mt-2">
            {techStacks.length} technologies available
          </p>
        </div>
      </div>

      {/* Tech Stack Groups */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col divide-y divide-border overflow-clip border-y border-border">
          {sortedGroups.map(([type, stacks]) => (
            <div key={type} className="flex flex-wrap gap-3 py-4 overflow-clip md:gap-4 md:py-5">
              <div className="relative w-28 mt-0.5 font-mono text-sm font-semibold text-brand md:w-32">
                {typeLabels[type] || type}
                <hr className="absolute -inset-y-6 right-0 z-10 h-auto w-px border-r border-border" />
              </div>
              
              <div className="flex-1 flex flex-wrap gap-2">
                {stacks.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/tech-stacks/${tech.slug}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg border border-border hover:border-brand/40 hover:bg-brand/5 transition-all group"
                  >
                    <span className="text-sm text-white group-hover:text-brand transition-colors">
                      {tech.name}
                    </span>
                    {tech.count > 0 && (
                      <span className="text-xs text-muted font-mono">
                        ({tech.count})
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
