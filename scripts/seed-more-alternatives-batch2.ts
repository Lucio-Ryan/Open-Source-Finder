import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define schemas inline for the script
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  created_at: { type: Date, default: Date.now }
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  short_description: { type: String, default: null },
  long_description: { type: String, default: null },
  icon_url: { type: String, default: null },
  website: { type: String, required: true },
  github: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  last_commit: { type: Date, default: null },
  contributors: { type: Number, default: 0 },
  license: { type: String, default: null },
  is_self_hosted: { type: Boolean, default: false },
  health_score: { type: Number, default: 50, min: 0, max: 100 },
  vote_score: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  rejection_reason: { type: String, default: null },
  rejected_at: { type: Date, default: null },
  submitter_name: { type: String, default: null },
  submitter_email: { type: String, default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  screenshots: [{ type: String }],
  submission_plan: { type: String, enum: ['free', 'sponsor'], default: 'free' },
  sponsor_featured_until: { type: Date, default: null },
  sponsor_priority_until: { type: Date, default: null },
  sponsor_payment_id: { type: String, default: null },
  sponsor_paid_at: { type: Date, default: null },
  newsletter_included: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  tech_stacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TechStack' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// More proprietary software
const newProprietarySoftware = [
  // Virtualization & Infrastructure
  { name: 'VMware', slug: 'vmware', description: 'Virtualization software', website: 'https://vmware.com' },
  { name: 'Virtuozzo', slug: 'virtuozzo', description: 'Virtualization solutions', website: 'https://virtuozzo.com' },
  
  // Monitoring & APM
  { name: 'Dynatrace', slug: 'dynatrace', description: 'Software intelligence', website: 'https://dynatrace.com' },
  { name: 'AppDynamics', slug: 'appdynamics', description: 'APM monitoring', website: 'https://appdynamics.com' },
  { name: 'Datadog', slug: 'datadog', description: 'Monitoring and analytics', website: 'https://datadoghq.com' },
  { name: 'New Relic', slug: 'new-relic', description: 'Observability platform', website: 'https://newrelic.com' },
  
  // CI/CD
  { name: 'CircleCI', slug: 'circleci', description: 'CI/CD platform', website: 'https://circleci.com' },
  { name: 'Travis CI', slug: 'travis-ci', description: 'CI service', website: 'https://travis-ci.com' },
  { name: 'TeamCity', slug: 'teamcity', description: 'CI/CD by JetBrains', website: 'https://jetbrains.com/teamcity' },
  { name: 'Bamboo', slug: 'bamboo', description: 'CI/CD by Atlassian', website: 'https://atlassian.com/software/bamboo' },
  { name: 'Semaphore', slug: 'semaphore', description: 'Fast CI/CD', website: 'https://semaphoreci.com' },
  { name: 'Codefresh', slug: 'codefresh', description: 'GitOps CI/CD', website: 'https://codefresh.io' },
  
  // Headless CMS
  { name: 'Contentful', slug: 'contentful', description: 'Headless CMS', website: 'https://contentful.com' },
  { name: 'Sanity', slug: 'sanity', description: 'Headless CMS', website: 'https://sanity.io' },
  { name: 'Prismic', slug: 'prismic', description: 'Headless CMS', website: 'https://prismic.io' },
  { name: 'DatoCMS', slug: 'datocms', description: 'Headless CMS', website: 'https://datocms.com' },
  
  // Translation & Localization
  { name: 'Phrase', slug: 'phrase', description: 'Translation management', website: 'https://phrase.com' },
  { name: 'Crowdin', slug: 'crowdin', description: 'Localization platform', website: 'https://crowdin.com' },
  { name: 'Lokalise', slug: 'lokalise', description: 'Translation platform', website: 'https://lokalise.com' },
  
  // Browser Testing
  { name: 'BrowserStack', slug: 'browserstack', description: 'Cross-browser testing', website: 'https://browserstack.com' },
  { name: 'Sauce Labs', slug: 'sauce-labs', description: 'Cross-browser testing', website: 'https://saucelabs.com' },
  { name: 'LambdaTest', slug: 'lambdatest', description: 'Cross-browser testing', website: 'https://lambdatest.com' },
  
  // Data ETL
  { name: 'Fivetran', slug: 'fivetran', description: 'Data integration', website: 'https://fivetran.com' },
  { name: 'Stitch', slug: 'stitch', description: 'Data pipeline', website: 'https://stitchdata.com' },
  { name: 'Matillion', slug: 'matillion', description: 'ETL platform', website: 'https://matillion.com' },
  { name: 'Talend', slug: 'talend', description: 'Data integration', website: 'https://talend.com' },
  
  // Business Intelligence
  { name: 'Tableau', slug: 'tableau', description: 'Data visualization', website: 'https://tableau.com' },
  { name: 'Power BI', slug: 'power-bi', description: 'Business analytics', website: 'https://powerbi.microsoft.com' },
  { name: 'Looker', slug: 'looker', description: 'BI platform', website: 'https://looker.com' },
  { name: 'MicroStrategy', slug: 'microstrategy', description: 'Enterprise analytics', website: 'https://microstrategy.com' },
  
  // Authentication
  { name: 'Auth0', slug: 'auth0', description: 'Authentication platform', website: 'https://auth0.com' },
  { name: 'Okta', slug: 'okta', description: 'Identity management', website: 'https://okta.com' },
  { name: 'Clerk', slug: 'clerk', description: 'User authentication', website: 'https://clerk.com' },
  { name: 'Stytch', slug: 'stytch', description: 'Passwordless login', website: 'https://stytch.com' },
  { name: 'WorkOS', slug: 'workos', description: 'Enterprise auth APIs', website: 'https://workos.com' },
  
  // Feature Flags
  { name: 'LaunchDarkly', slug: 'launchdarkly', description: 'Feature flags', website: 'https://launchdarkly.com' },
  { name: 'Split.io', slug: 'split-io', description: 'Feature flags', website: 'https://split.io' },
  { name: 'Statsig', slug: 'statsig', description: 'Feature flagging', website: 'https://statsig.com' },
  { name: 'Optimizely', slug: 'optimizely', description: 'A/B testing', website: 'https://optimizely.com' },
  
  // Database
  { name: 'MongoDB Atlas', slug: 'mongodb-atlas', description: 'Cloud database', website: 'https://mongodb.com/atlas' },
  { name: 'PlanetScale', slug: 'planetscale', description: 'MySQL platform', website: 'https://planetscale.com' },
  { name: 'Supabase', slug: 'supabase', description: 'Firebase alternative', website: 'https://supabase.com' },
  { name: 'FaunaDB', slug: 'faunadb', description: 'Serverless database', website: 'https://fauna.com' },
  { name: 'CockroachDB Cloud', slug: 'cockroachdb-cloud', description: 'Distributed SQL', website: 'https://cockroachlabs.com' },
  
  // Object Storage
  { name: 'Amazon S3', slug: 'amazon-s3', description: 'Cloud object storage', website: 'https://aws.amazon.com/s3' },
  { name: 'Google Cloud Storage', slug: 'google-cloud-storage', description: 'Object storage', website: 'https://cloud.google.com/storage' },
  { name: 'Azure Blob Storage', slug: 'azure-blob-storage', description: 'Object storage', website: 'https://azure.microsoft.com/services/storage/blobs' },
  { name: 'Cloudflare R2', slug: 'cloudflare-r2', description: 'Object storage', website: 'https://cloudflare.com/r2' },
  { name: 'Backblaze B2', slug: 'backblaze-b2', description: 'Cloud storage', website: 'https://backblaze.com/b2' },
  
  // Server Monitoring
  { name: 'Paessler PRTG', slug: 'paessler-prtg', description: 'Network monitoring', website: 'https://paessler.com/prtg' },
  
  // CDN
  { name: 'Cloudflare CDN', slug: 'cloudflare-cdn', description: 'CDN service', website: 'https://cloudflare.com' },
  { name: 'Fastly', slug: 'fastly', description: 'Edge cloud', website: 'https://fastly.com' },
  { name: 'Akamai', slug: 'akamai', description: 'CDN and security', website: 'https://akamai.com' },
  
  // DNS
  { name: 'Cloudflare DNS', slug: 'cloudflare-dns', description: 'DNS service', website: 'https://cloudflare.com/dns' },
  { name: 'Route 53', slug: 'route-53', description: 'AWS DNS', website: 'https://aws.amazon.com/route53' },
  
  // Messaging & Notifications
  { name: 'Twilio', slug: 'twilio', description: 'Communication APIs', website: 'https://twilio.com' },
  { name: 'SendGrid', slug: 'sendgrid', description: 'Email delivery', website: 'https://sendgrid.com' },
  { name: 'Postmark', slug: 'postmark', description: 'Email delivery', website: 'https://postmarkapp.com' },
  { name: 'Mailgun', slug: 'mailgun', description: 'Email API', website: 'https://mailgun.com' },
  { name: 'Resend', slug: 'resend', description: 'Email API', website: 'https://resend.com' },
  
  // Search
  { name: 'Algolia', slug: 'algolia', description: 'Search API', website: 'https://algolia.com' },
  { name: 'Elastic Cloud', slug: 'elastic-cloud', description: 'Elasticsearch service', website: 'https://elastic.co/cloud' },
  
  // Web Hosting Control Panels
  { name: 'cPanel', slug: 'cpanel', description: 'Web hosting control panel', website: 'https://cpanel.com' },
  { name: 'Plesk', slug: 'plesk', description: 'Hosting control panel', website: 'https://plesk.com' },
  
  // Documentation
  { name: 'GitBook', slug: 'gitbook', description: 'Documentation platform', website: 'https://gitbook.com' },
  { name: 'Readme', slug: 'readme', description: 'Developer docs', website: 'https://readme.com' },
  { name: 'Mintlify', slug: 'mintlify', description: 'Documentation generator', website: 'https://mintlify.com' },
  
  // Web Scraping
  { name: 'ScrapingBee', slug: 'scrapingbee', description: 'Web scraping API', website: 'https://scrapingbee.com' },
  { name: 'Browserbase', slug: 'browserbase', description: 'Browser infrastructure', website: 'https://browserbase.com' },
  
  // PDF
  { name: 'Adobe Acrobat', slug: 'adobe-acrobat', description: 'PDF editor', website: 'https://adobe.com/acrobat' },
  
  // Diagramming
  { name: 'Lucidchart', slug: 'lucidchart', description: 'Diagramming tool', website: 'https://lucidchart.com' },
  { name: 'Miro', slug: 'miro', description: 'Online whiteboard', website: 'https://miro.com' },
  { name: 'FigJam', slug: 'figjam', description: 'Online whiteboard', website: 'https://figma.com/figjam' },
  
  // UX Research
  { name: 'UserTesting', slug: 'usertesting', description: 'User research', website: 'https://usertesting.com' },
  { name: 'Maze', slug: 'maze', description: 'User testing', website: 'https://maze.co' },
  { name: 'Hotjar', slug: 'hotjar', description: 'Heatmaps and feedback', website: 'https://hotjar.com' },
  { name: 'FullStory', slug: 'fullstory', description: 'Session replay', website: 'https://fullstory.com' },
  
  // RSS
  { name: 'Feedly', slug: 'feedly', description: 'RSS reader', website: 'https://feedly.com' },
  { name: 'Inoreader', slug: 'inoreader', description: 'RSS reader', website: 'https://inoreader.com' },
  
  // URL Shorteners
  { name: 'Bitly', slug: 'bitly', description: 'URL shortener', website: 'https://bitly.com' },
  { name: 'TinyURL', slug: 'tinyurl', description: 'URL shortener', website: 'https://tinyurl.com' },
  { name: 'Rebrandly', slug: 'rebrandly', description: 'Link management', website: 'https://rebrandly.com' },
  
  // Server & Hosting
  { name: 'DigitalOcean', slug: 'digitalocean', description: 'Cloud provider', website: 'https://digitalocean.com' },
  { name: 'Linode', slug: 'linode', description: 'Cloud hosting', website: 'https://linode.com' },
  { name: 'Vultr', slug: 'vultr', description: 'Cloud infrastructure', website: 'https://vultr.com' },
  
  // Secrets Management
  { name: 'HashiCorp Vault', slug: 'hashicorp-vault', description: 'Secrets management', website: 'https://vaultproject.io' },
  { name: 'Doppler', slug: 'doppler', description: 'Secrets management', website: 'https://doppler.com' },
  
  // File Conversion
  { name: 'CloudConvert', slug: 'cloudconvert', description: 'File conversion', website: 'https://cloudconvert.com' },
  { name: 'Zamzar', slug: 'zamzar', description: 'File conversion', website: 'https://zamzar.com' },
  
  // Code Collaboration
  { name: 'CodePen', slug: 'codepen', description: 'Code playground', website: 'https://codepen.io' },
  { name: 'JSFiddle', slug: 'jsfiddle', description: 'Code playground', website: 'https://jsfiddle.net' },
  { name: 'CodeSandbox', slug: 'codesandbox', description: 'Online IDE', website: 'https://codesandbox.io' },
  
  // AI Assistants
  { name: 'ChatGPT', slug: 'chatgpt', description: 'AI chat assistant', website: 'https://chat.openai.com' },
  { name: 'Claude', slug: 'claude', description: 'AI assistant', website: 'https://claude.ai' },
  { name: 'Gemini', slug: 'gemini', description: 'Google AI', website: 'https://gemini.google.com' },
  
  // Video Hosting
  { name: 'Vimeo', slug: 'vimeo', description: 'Video hosting', website: 'https://vimeo.com' },
  { name: 'Wistia', slug: 'wistia', description: 'Video marketing', website: 'https://wistia.com' },
  
  // Podcast Hosting
  { name: 'Transistor', slug: 'transistor', description: 'Podcast hosting', website: 'https://transistor.fm' },
  { name: 'Buzzsprout', slug: 'buzzsprout', description: 'Podcast hosting', website: 'https://buzzsprout.com' },
  { name: 'Anchor', slug: 'anchor', description: 'Podcast platform', website: 'https://anchor.fm' },
  
  // Image Compression
  { name: 'TinyPNG', slug: 'tinypng', description: 'Image compression', website: 'https://tinypng.com' },
  { name: 'ImageOptim', slug: 'imageoptim', description: 'Image optimization', website: 'https://imageoptim.com' },
  
  // Team Chat
  { name: 'Slack', slug: 'slack', description: 'Team messaging', website: 'https://slack.com' },
  { name: 'Microsoft Teams', slug: 'microsoft-teams', description: 'Team collaboration', website: 'https://teams.microsoft.com' },
  { name: 'Discord', slug: 'discord', description: 'Chat platform', website: 'https://discord.com' },
];

// More alternatives
const newAlternatives = [
  // Virtualization - Alternatives to VMware, Virtuozzo
  {
    name: 'Proxmox VE',
    slug: 'proxmox-ve',
    short_description: 'Open-source virtualization platform',
    description: 'Proxmox Virtual Environment is an open-source server virtualization platform. It combines KVM hypervisor and LXC containers, storage and networking functionality on a single platform.',
    website: 'https://www.proxmox.com',
    github: 'https://github.com/proxmox',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['vmware', 'virtuozzo'],
    categoryKeywords: ['virtualization', 'hypervisor', 'containers', 'infrastructure']
  },
  {
    name: 'oVirt',
    slug: 'ovirt',
    short_description: 'Enterprise virtualization',
    description: 'oVirt is an open-source distributed virtualization solution designed for enterprise infrastructure. It provides VM management, live migration, and storage management.',
    website: 'https://www.ovirt.org',
    github: 'https://github.com/oVirt/ovirt-engine',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['vmware', 'virtuozzo'],
    categoryKeywords: ['virtualization', 'enterprise', 'vm', 'management']
  },
  {
    name: 'XCP-ng',
    slug: 'xcp-ng',
    short_description: 'Open-source virtualization platform',
    description: 'XCP-ng is an open-source virtualization platform based on Xen. It provides enterprise features like live migration, storage APIs, and high availability for free.',
    website: 'https://xcp-ng.org',
    github: 'https://github.com/xcp-ng',
    license: 'GPL License',
    is_self_hosted: true,
    alternative_to: ['vmware'],
    categoryKeywords: ['virtualization', 'xen', 'enterprise', 'hypervisor']
  },

  // Monitoring & APM - Alternatives to Dynatrace, AppDynamics, Datadog
  {
    name: 'Prometheus',
    slug: 'prometheus',
    short_description: 'Monitoring and alerting toolkit',
    description: 'Prometheus is an open-source systems monitoring and alerting toolkit. It features a multi-dimensional data model, PromQL query language, and integrates with Grafana for visualization.',
    website: 'https://prometheus.io',
    github: 'https://github.com/prometheus/prometheus',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['dynatrace', 'appdynamics', 'datadog', 'new-relic'],
    categoryKeywords: ['monitoring', 'metrics', 'alerting', 'observability']
  },
  {
    name: 'Grafana',
    slug: 'grafana',
    short_description: 'Open-source analytics & monitoring',
    description: 'Grafana is the open-source platform for monitoring and observability. It allows querying, visualizing, alerting on and exploring metrics, logs, and traces from any storage.',
    website: 'https://grafana.com',
    github: 'https://github.com/grafana/grafana',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['datadog', 'dynatrace', 'new-relic'],
    categoryKeywords: ['monitoring', 'visualization', 'dashboards', 'observability']
  },
  {
    name: 'Jaeger',
    slug: 'jaeger',
    short_description: 'Distributed tracing platform',
    description: 'Jaeger is an open-source distributed tracing system. It helps monitor and troubleshoot microservices-based architectures including latency optimization and root cause analysis.',
    website: 'https://www.jaegertracing.io',
    github: 'https://github.com/jaegertracing/jaeger',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['dynatrace', 'datadog', 'new-relic'],
    categoryKeywords: ['tracing', 'microservices', 'observability', 'distributed']
  },
  {
    name: 'Zipkin',
    slug: 'zipkin',
    short_description: 'Distributed tracing system',
    description: 'Zipkin is a distributed tracing system that helps gather timing data needed to troubleshoot latency problems in microservice architectures.',
    website: 'https://zipkin.io',
    github: 'https://github.com/openzipkin/zipkin',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['dynatrace', 'datadog'],
    categoryKeywords: ['tracing', 'distributed', 'microservices', 'performance']
  },
  {
    name: 'SigNoz',
    slug: 'signoz',
    short_description: 'Open-source APM',
    description: 'SigNoz is an open-source application performance monitoring tool that helps developers monitor their applications. It provides traces, metrics, and logs in a single pane.',
    website: 'https://signoz.io',
    github: 'https://github.com/SigNoz/signoz',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['dynatrace', 'appdynamics', 'datadog', 'new-relic'],
    categoryKeywords: ['apm', 'monitoring', 'tracing', 'observability']
  },

  // CI/CD - Alternatives to CircleCI, Travis CI, TeamCity, etc.
  {
    name: 'Jenkins',
    slug: 'jenkins',
    short_description: 'Leading open-source automation server',
    description: 'Jenkins is the leading open-source automation server. It provides hundreds of plugins to support building, deploying, and automating any project with continuous integration.',
    website: 'https://www.jenkins.io',
    github: 'https://github.com/jenkinsci/jenkins',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci', 'teamcity', 'bamboo', 'semaphore', 'codefresh'],
    categoryKeywords: ['ci/cd', 'automation', 'devops', 'plugins']
  },
  {
    name: 'Woodpecker CI',
    slug: 'woodpecker-ci',
    short_description: 'Simple CI engine',
    description: 'Woodpecker CI is a community fork of Drone CI. It is a simple yet powerful CI/CD engine with great extensibility that runs pipelines in containers.',
    website: 'https://woodpecker-ci.org',
    github: 'https://github.com/woodpecker-ci/woodpecker',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci', 'semaphore'],
    categoryKeywords: ['ci/cd', 'containers', 'pipelines', 'automation']
  },
  {
    name: 'Gitea Actions',
    slug: 'gitea-actions',
    short_description: 'Built-in CI/CD for Gitea',
    description: 'Gitea Actions is a built-in CI/CD feature in Gitea that is compatible with GitHub Actions. It allows running workflows directly from your Gitea repositories.',
    website: 'https://docs.gitea.com/usage/actions',
    github: 'https://github.com/go-gitea/gitea',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci'],
    categoryKeywords: ['ci/cd', 'git', 'workflows', 'automation']
  },

  // Headless CMS - Alternatives to Contentful, Sanity, Prismic
  {
    name: 'Strapi',
    slug: 'strapi',
    short_description: 'Open-source headless CMS',
    description: 'Strapi is the leading open-source headless CMS. It is fully customizable and developer-first, with a powerful admin panel and flexible content types.',
    website: 'https://strapi.io',
    github: 'https://github.com/strapi/strapi',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['contentful', 'sanity', 'prismic', 'datocms'],
    categoryKeywords: ['cms', 'headless', 'api', 'content']
  },
  {
    name: 'Directus',
    slug: 'directus',
    short_description: 'Open data platform',
    description: 'Directus is an open data platform for managing content and data. It wraps any SQL database with a dynamic API and an intuitive admin app.',
    website: 'https://directus.io',
    github: 'https://github.com/directus/directus',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['contentful', 'sanity', 'datocms'],
    categoryKeywords: ['cms', 'headless', 'database', 'api']
  },
  {
    name: 'Payload',
    slug: 'payload',
    short_description: 'Headless CMS and application framework',
    description: 'Payload is a headless CMS and application framework built with Node.js, Express, React, and MongoDB. It provides content management with code-first configuration.',
    website: 'https://payloadcms.com',
    github: 'https://github.com/payloadcms/payload',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['contentful', 'sanity', 'prismic'],
    categoryKeywords: ['cms', 'headless', 'typescript', 'react']
  },

  // Translation & Localization - Alternatives to Phrase, Crowdin, Lokalise
  {
    name: 'Weblate',
    slug: 'weblate',
    short_description: 'Web-based translation tool',
    description: 'Weblate is a libre software web-based continuous localization system. It features tight version control integration, translation memory, and machine translation suggestions.',
    website: 'https://weblate.org',
    github: 'https://github.com/WeblateOrg/weblate',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['phrase', 'crowdin', 'lokalise'],
    categoryKeywords: ['translation', 'localization', 'i18n', 'collaboration']
  },
  {
    name: 'Traduora',
    slug: 'traduora',
    short_description: 'Open-source translation management',
    description: 'Traduora is an open-source translation management platform. It provides a modern interface for managing translations with team collaboration features.',
    website: 'https://traduora.co',
    github: 'https://github.com/ever-co/ever-traduora',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['phrase', 'crowdin', 'lokalise'],
    categoryKeywords: ['translation', 'localization', 'management', 'team']
  },

  // Browser Testing - Alternatives to BrowserStack, Sauce Labs, LambdaTest
  {
    name: 'Selenium',
    slug: 'selenium',
    short_description: 'Browser automation framework',
    description: 'Selenium is a suite of tools for automating web browsers. It provides WebDriver for browser automation and Grid for parallel test execution across browsers.',
    website: 'https://www.selenium.dev',
    github: 'https://github.com/SeleniumHQ/selenium',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['browserstack', 'sauce-labs', 'lambdatest'],
    categoryKeywords: ['testing', 'automation', 'browser', 'webdriver']
  },
  {
    name: 'Playwright',
    slug: 'playwright',
    short_description: 'Browser testing and automation',
    description: 'Playwright enables reliable end-to-end testing for modern web apps. It supports all modern browsers and provides auto-wait, web-first assertions, and tracing.',
    website: 'https://playwright.dev',
    github: 'https://github.com/microsoft/playwright',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['browserstack', 'sauce-labs', 'lambdatest'],
    categoryKeywords: ['testing', 'automation', 'e2e', 'browser']
  },

  // Data ETL - Alternatives to Fivetran, Stitch, Matillion, Talend
  {
    name: 'Airbyte',
    slug: 'airbyte',
    short_description: 'Open-source data integration',
    description: 'Airbyte is an open-source data integration platform. It provides connectors to hundreds of data sources and destinations for building ELT pipelines.',
    website: 'https://airbyte.com',
    github: 'https://github.com/airbytehq/airbyte',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['fivetran', 'stitch', 'matillion', 'talend'],
    categoryKeywords: ['etl', 'data integration', 'connectors', 'pipelines']
  },
  {
    name: 'Meltano',
    slug: 'meltano',
    short_description: 'Open-source DataOps platform',
    description: 'Meltano is an open-source DataOps platform. It provides Singer-based EL pipelines, dbt transformations, and Airflow orchestration in a version-controlled framework.',
    website: 'https://meltano.com',
    github: 'https://github.com/meltano/meltano',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['fivetran', 'stitch', 'matillion'],
    categoryKeywords: ['etl', 'dataops', 'pipelines', 'singer']
  },

  // Business Intelligence - Alternatives to Tableau, Power BI, Looker
  {
    name: 'Metabase',
    slug: 'metabase',
    short_description: 'Open-source business intelligence',
    description: 'Metabase is an open-source business intelligence tool that lets you ask questions about your data. It provides dashboards, alerts, and SQL-free data exploration.',
    website: 'https://www.metabase.com',
    github: 'https://github.com/metabase/metabase',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['tableau', 'power-bi', 'looker', 'microstrategy'],
    categoryKeywords: ['bi', 'analytics', 'dashboards', 'data']
  },
  {
    name: 'Apache Superset',
    slug: 'apache-superset',
    short_description: 'Modern data exploration platform',
    description: 'Apache Superset is a modern, enterprise-ready business intelligence web application. It provides rich visualizations, interactive dashboards, and SQL IDE.',
    website: 'https://superset.apache.org',
    github: 'https://github.com/apache/superset',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['tableau', 'power-bi', 'looker'],
    categoryKeywords: ['bi', 'visualization', 'dashboards', 'sql']
  },
  {
    name: 'Redash',
    slug: 'redash',
    short_description: 'Connect and visualize your data',
    description: 'Redash is designed to enable anyone to query, visualize, share, and collaborate on data. It connects to any data source and creates beautiful visualizations.',
    website: 'https://redash.io',
    github: 'https://github.com/getredash/redash',
    license: 'BSD-2-Clause License',
    is_self_hosted: true,
    alternative_to: ['tableau', 'looker', 'microstrategy'],
    categoryKeywords: ['bi', 'visualization', 'sql', 'dashboards']
  },

  // Authentication - Alternatives to Auth0, Okta, Clerk, etc.
  {
    name: 'Keycloak',
    slug: 'keycloak',
    short_description: 'Open-source identity management',
    description: 'Keycloak is an open-source identity and access management solution. It provides single sign-on, identity brokering, user federation, and fine-grained authorization.',
    website: 'https://www.keycloak.org',
    github: 'https://github.com/keycloak/keycloak',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['auth0', 'okta', 'clerk', 'stytch', 'workos'],
    categoryKeywords: ['authentication', 'sso', 'identity', 'authorization']
  },
  {
    name: 'Authentik',
    slug: 'authentik',
    short_description: 'Open-source identity provider',
    description: 'Authentik is an open-source identity provider with emphasis on flexibility and versatility. It supports SAML2, OAuth2, OIDC, SCIM, and LDAP protocols.',
    website: 'https://goauthentik.io',
    github: 'https://github.com/goauthentik/authentik',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['auth0', 'okta', 'clerk'],
    categoryKeywords: ['authentication', 'identity', 'sso', 'oauth']
  },
  {
    name: 'Ory',
    slug: 'ory',
    short_description: 'Open-source identity infrastructure',
    description: 'Ory provides open-source identity infrastructure. It includes Kratos for identity management, Hydra for OAuth2, Keto for permissions, and Oathkeeper for access control.',
    website: 'https://www.ory.sh',
    github: 'https://github.com/ory',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['auth0', 'okta', 'workos'],
    categoryKeywords: ['authentication', 'oauth', 'identity', 'permissions']
  },
  {
    name: 'SuperTokens',
    slug: 'supertokens',
    short_description: 'Open-source user authentication',
    description: 'SuperTokens is an open-source alternative to Auth0 or Firebase Auth. It provides session management, social logins, and passwordless authentication.',
    website: 'https://supertokens.com',
    github: 'https://github.com/supertokens/supertokens-core',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['auth0', 'clerk', 'stytch'],
    categoryKeywords: ['authentication', 'sessions', 'passwordless', 'social']
  },

  // Feature Flags - Alternatives to LaunchDarkly, Split.io, Statsig, Optimizely
  {
    name: 'Flagsmith',
    slug: 'flagsmith',
    short_description: 'Open-source feature flag platform',
    description: 'Flagsmith is an open-source feature flag and remote config service. It provides feature flags, A/B testing, and remote configuration with SDK support for multiple platforms.',
    website: 'https://flagsmith.com',
    github: 'https://github.com/Flagsmith/flagsmith',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['launchdarkly', 'split-io', 'statsig', 'optimizely'],
    categoryKeywords: ['feature flags', 'ab testing', 'remote config', 'experimentation']
  },
  {
    name: 'Unleash',
    slug: 'unleash',
    short_description: 'Open-source feature management',
    description: 'Unleash is an open-source feature management platform. It provides feature toggles with gradual rollouts, A/B testing, and kill switches for production.',
    website: 'https://www.getunleash.io',
    github: 'https://github.com/Unleash/unleash',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['launchdarkly', 'split-io', 'statsig'],
    categoryKeywords: ['feature flags', 'rollouts', 'toggles', 'management']
  },
  {
    name: 'GrowthBook',
    slug: 'growthbook',
    short_description: 'Open-source feature flagging and A/B testing',
    description: 'GrowthBook is an open-source platform for feature flags and A/B tests. It helps teams make data-driven decisions with built-in Bayesian statistics.',
    website: 'https://www.growthbook.io',
    github: 'https://github.com/growthbook/growthbook',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['launchdarkly', 'optimizely', 'statsig'],
    categoryKeywords: ['feature flags', 'ab testing', 'experimentation', 'analytics']
  },

  // Object Storage - Alternatives to S3, GCS, Azure Blob, etc.
  {
    name: 'MinIO',
    slug: 'minio',
    short_description: 'High-performance object storage',
    description: 'MinIO is a high-performance, S3-compatible object storage. It is designed for large-scale private cloud infrastructure with support for erasure coding and bitrot protection.',
    website: 'https://min.io',
    github: 'https://github.com/minio/minio',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['amazon-s3', 'google-cloud-storage', 'azure-blob-storage', 'cloudflare-r2', 'backblaze-b2'],
    categoryKeywords: ['object storage', 's3', 'cloud storage', 'high performance']
  },
  {
    name: 'SeaweedFS',
    slug: 'seaweedfs',
    short_description: 'Fast distributed storage system',
    description: 'SeaweedFS is a fast distributed storage system for blobs, objects, files, and data lake. It provides S3 API, FUSE mount, and Hadoop compatibility.',
    website: 'https://seaweedfs.com',
    github: 'https://github.com/seaweedfs/seaweedfs',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['amazon-s3', 'google-cloud-storage'],
    categoryKeywords: ['object storage', 'distributed', 'blob storage', 's3']
  },

  // Web Hosting Control Panels - Alternatives to cPanel, Plesk
  {
    name: 'HestiaCP',
    slug: 'hestiacp',
    short_description: 'Open-source control panel',
    description: 'HestiaCP is an open-source web server control panel. It provides web, mail, DNS, and database management with a clean interface and automated setup.',
    website: 'https://hestiacp.com',
    github: 'https://github.com/hestiacp/hestiacp',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['cpanel', 'plesk'],
    categoryKeywords: ['control panel', 'web hosting', 'server', 'management']
  },
  {
    name: 'CloudPanel',
    slug: 'cloudpanel',
    short_description: 'Modern server control panel',
    description: 'CloudPanel is a free, high-performance server control panel for PHP. It provides automated SSL, MySQL/MariaDB, Redis, and Varnish Cache management.',
    website: 'https://www.cloudpanel.io',
    github: 'https://github.com/cloudpanel-io/cloudpanel-ce',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['cpanel', 'plesk'],
    categoryKeywords: ['control panel', 'php', 'server', 'hosting']
  },
  {
    name: 'Virtualmin',
    slug: 'virtualmin',
    short_description: 'Powerful web hosting control panel',
    description: 'Virtualmin is a powerful and flexible web hosting control panel based on Webmin. It provides website, email, database, and DNS management for multiple domains.',
    website: 'https://www.virtualmin.com',
    github: 'https://github.com/virtualmin/virtualmin-gpl',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['cpanel', 'plesk'],
    categoryKeywords: ['control panel', 'hosting', 'webmin', 'domains']
  },

  // Documentation - Alternatives to GitBook, Readme, Mintlify
  {
    name: 'Docusaurus',
    slug: 'docusaurus',
    short_description: 'Documentation website generator',
    description: 'Docusaurus is an optimized site generator for documentation websites. It is built by Facebook with React and provides versioning, translation, and search features.',
    website: 'https://docusaurus.io',
    github: 'https://github.com/facebook/docusaurus',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['gitbook', 'readme', 'mintlify'],
    categoryKeywords: ['documentation', 'static site', 'react', 'versioning']
  },
  {
    name: 'MkDocs',
    slug: 'mkdocs',
    short_description: 'Project documentation with Markdown',
    description: 'MkDocs is a fast, simple static site generator for building project documentation. It uses Markdown and can be customized with themes like Material.',
    website: 'https://www.mkdocs.org',
    github: 'https://github.com/mkdocs/mkdocs',
    license: 'BSD-2-Clause License',
    is_self_hosted: false,
    alternative_to: ['gitbook', 'readme'],
    categoryKeywords: ['documentation', 'markdown', 'static site', 'python']
  },
  {
    name: 'Slate',
    slug: 'slate',
    short_description: 'API documentation generator',
    description: 'Slate helps create beautiful, intelligent, responsive API documentation. It features clean, intuitive design inspired by Stripe and PayPal documentation.',
    website: 'https://slatedocs.github.io/slate',
    github: 'https://github.com/slatedocs/slate',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['readme', 'gitbook'],
    categoryKeywords: ['documentation', 'api', 'developer', 'static']
  },

  // Web Scraping - Alternatives to ScrapingBee, Browserbase
  {
    name: 'Scrapy',
    slug: 'scrapy',
    short_description: 'Web crawling framework',
    description: 'Scrapy is a fast high-level web crawling and web scraping framework. It provides tools for extracting data from websites, processing them, and storing them.',
    website: 'https://scrapy.org',
    github: 'https://github.com/scrapy/scrapy',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['scrapingbee', 'browserbase'],
    categoryKeywords: ['web scraping', 'crawling', 'python', 'data extraction']
  },
  {
    name: 'Colly',
    slug: 'colly',
    short_description: 'Elegant scraper for Go',
    description: 'Colly is a lightning fast and elegant scraping framework for Go. It provides a clean API, parallel scraping, automatic cookie and session handling.',
    website: 'https://go-colly.org',
    github: 'https://github.com/gocolly/colly',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['scrapingbee'],
    categoryKeywords: ['web scraping', 'go', 'crawler', 'fast']
  },

  // PDF - Alternatives to Adobe Acrobat
  {
    name: 'Stirling-PDF',
    slug: 'stirling-pdf',
    short_description: 'Self-hosted PDF manipulation',
    description: 'Stirling-PDF is a self-hosted web application for PDF manipulation. It provides split, merge, convert, reorganize, add images, rotate, compress, and much more.',
    website: 'https://github.com/Frooodle/Stirling-PDF',
    github: 'https://github.com/Frooodle/Stirling-PDF',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['adobe-acrobat'],
    categoryKeywords: ['pdf', 'document', 'manipulation', 'self-hosted']
  },
  {
    name: 'PDF Arranger',
    slug: 'pdf-arranger',
    short_description: 'PDF page manipulation',
    description: 'PDF Arranger is a small Python application for merging and splitting PDF documents. It provides a graphical interface for rearranging, rotating, and cropping pages.',
    website: 'https://github.com/pdfarranger/pdfarranger',
    github: 'https://github.com/pdfarranger/pdfarranger',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-acrobat'],
    categoryKeywords: ['pdf', 'merger', 'splitter', 'desktop']
  },

  // Diagramming - Alternatives to Lucidchart, Miro, FigJam
  {
    name: 'Excalidraw',
    slug: 'excalidraw',
    short_description: 'Virtual whiteboard for sketching',
    description: 'Excalidraw is a virtual collaborative whiteboard tool that lets you easily sketch diagrams with a hand-drawn feel. It supports real-time collaboration.',
    website: 'https://excalidraw.com',
    github: 'https://github.com/excalidraw/excalidraw',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['lucidchart', 'miro', 'figjam'],
    categoryKeywords: ['whiteboard', 'diagrams', 'collaboration', 'sketching']
  },
  {
    name: 'Draw.io',
    slug: 'draw-io',
    short_description: 'Free diagramming application',
    description: 'Draw.io (diagrams.net) is a free, open-source diagramming application. It supports flowcharts, UML, network diagrams, and integrates with cloud storage.',
    website: 'https://www.diagrams.net',
    github: 'https://github.com/jgraph/drawio',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['lucidchart', 'miro'],
    categoryKeywords: ['diagrams', 'flowcharts', 'uml', 'free']
  },
  {
    name: 'Tldraw',
    slug: 'tldraw',
    short_description: 'Collaborative whiteboard',
    description: 'Tldraw is a free collaborative whiteboard application. It features infinite canvas, shapes, drawing tools, and real-time multiplayer collaboration.',
    website: 'https://www.tldraw.com',
    github: 'https://github.com/tldraw/tldraw',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['miro', 'figjam'],
    categoryKeywords: ['whiteboard', 'drawing', 'collaboration', 'canvas']
  },

  // UX Research - Alternatives to UserTesting, Maze, Hotjar, FullStory
  {
    name: 'OpenReplay',
    slug: 'openreplay',
    short_description: 'Open-source session replay',
    description: 'OpenReplay is an open-source session replay suite. It provides session recordings, devtools, error tracking, and product analytics to understand user behavior.',
    website: 'https://openreplay.com',
    github: 'https://github.com/openreplay/openreplay',
    license: 'OpenReplay License',
    is_self_hosted: true,
    alternative_to: ['hotjar', 'fullstory'],
    categoryKeywords: ['session replay', 'analytics', 'debugging', 'ux']
  },

  // RSS - Alternatives to Feedly, Inoreader
  {
    name: 'FreshRSS',
    slug: 'freshrss',
    short_description: 'Self-hosted RSS aggregator',
    description: 'FreshRSS is a free, self-hostable RSS and Atom feed aggregator. It is lightweight, easy to use, and supports extensions and multiple platforms.',
    website: 'https://freshrss.org',
    github: 'https://github.com/FreshRSS/FreshRSS',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['feedly', 'inoreader'],
    categoryKeywords: ['rss', 'feeds', 'aggregator', 'self-hosted']
  },
  {
    name: 'Miniflux',
    slug: 'miniflux',
    short_description: 'Minimalist feed reader',
    description: 'Miniflux is a minimalist and opinionated feed reader. It is written in Go and focuses on simplicity, fast navigation, and keyboard shortcuts.',
    website: 'https://miniflux.app',
    github: 'https://github.com/miniflux/v2',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['feedly', 'inoreader'],
    categoryKeywords: ['rss', 'feeds', 'minimalist', 'go']
  },

  // URL Shorteners - Alternatives to Bitly, TinyURL, Rebrandly
  {
    name: 'Shlink',
    slug: 'shlink',
    short_description: 'Self-hosted URL shortener',
    description: 'Shlink is a self-hosted URL shortener with REST API. It provides QR codes, visit tracking, custom slugs, and integration capabilities.',
    website: 'https://shlink.io',
    github: 'https://github.com/shlinkio/shlink',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['bitly', 'tinyurl', 'rebrandly'],
    categoryKeywords: ['url shortener', 'links', 'tracking', 'api']
  },
  {
    name: 'YOURLS',
    slug: 'yourls',
    short_description: 'Your own URL shortener',
    description: 'YOURLS (Your Own URL Shortener) is a small set of PHP scripts for running your own URL shortening service. It provides analytics, bookmarklets, and plugins.',
    website: 'https://yourls.org',
    github: 'https://github.com/YOURLS/YOURLS',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['bitly', 'tinyurl'],
    categoryKeywords: ['url shortener', 'php', 'self-hosted', 'analytics']
  },
  {
    name: 'Dub',
    slug: 'dub',
    short_description: 'Modern link management',
    description: 'Dub is an open-source link management tool for modern marketing teams. It provides branded links, analytics, QR codes, and team collaboration.',
    website: 'https://dub.co',
    github: 'https://github.com/dubinc/dub',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['bitly', 'rebrandly'],
    categoryKeywords: ['url shortener', 'marketing', 'analytics', 'modern']
  },

  // Secrets Management - Alternatives to HashiCorp Vault, Doppler
  {
    name: 'Infisical',
    slug: 'infisical',
    short_description: 'Open-source secret management',
    description: 'Infisical is an open-source secret management platform. It provides end-to-end encrypted secrets syncing, automatic secret rotation, and access controls.',
    website: 'https://infisical.com',
    github: 'https://github.com/Infisical/infisical',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['hashicorp-vault', 'doppler'],
    categoryKeywords: ['secrets', 'encryption', 'management', 'security']
  },

  // Code Playgrounds - Alternatives to CodePen, JSFiddle, CodeSandbox
  {
    name: 'StackBlitz',
    slug: 'stackblitz',
    short_description: 'Instant full-stack web IDE',
    description: 'StackBlitz is a full-stack web IDE that runs entirely in the browser. It provides Node.js environment, hot reloading, and instant sharing capabilities.',
    website: 'https://stackblitz.com',
    github: 'https://github.com/AltimLi/stackblitz',
    license: 'Various',
    is_self_hosted: false,
    alternative_to: ['codepen', 'jsfiddle', 'codesandbox'],
    categoryKeywords: ['ide', 'code playground', 'browser', 'nodejs']
  },

  // Video Hosting - Alternatives to Vimeo, Wistia
  {
    name: 'PeerTube',
    slug: 'peertube',
    short_description: 'Decentralized video platform',
    description: 'PeerTube is a free, decentralized and federated video platform. It uses ActivityPub for federation and WebTorrent for peer-to-peer video streaming.',
    website: 'https://joinpeertube.org',
    github: 'https://github.com/Chocobozzz/PeerTube',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['vimeo', 'wistia'],
    categoryKeywords: ['video', 'streaming', 'decentralized', 'federation']
  },

  // Podcast Hosting - Alternatives to Transistor, Buzzsprout, Anchor
  {
    name: 'Castopod',
    slug: 'castopod',
    short_description: 'Open-source podcast hosting',
    description: 'Castopod is an open-source podcast hosting solution. It provides podcasting 2.0 features, ActivityPub integration, built-in analytics, and monetization options.',
    website: 'https://castopod.org',
    github: 'https://github.com/ad-aures/castopod',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['transistor', 'buzzsprout', 'anchor'],
    categoryKeywords: ['podcast', 'hosting', 'fediverse', 'analytics']
  },

  // Team Chat - Alternatives to Slack, Microsoft Teams, Discord
  {
    name: 'Mattermost',
    slug: 'mattermost',
    short_description: 'Open-source team collaboration',
    description: 'Mattermost is an open-source, self-hostable online chat service. It provides team messaging, file sharing, and integrations with DevOps tools.',
    website: 'https://mattermost.com',
    github: 'https://github.com/mattermost/mattermost',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['slack', 'microsoft-teams', 'discord'],
    categoryKeywords: ['chat', 'collaboration', 'team', 'messaging']
  },
  {
    name: 'Rocket.Chat',
    slug: 'rocket-chat',
    short_description: 'Open-source team communication',
    description: 'Rocket.Chat is an open-source team communication platform. It provides messaging, video conferencing, file sharing, and omnichannel customer service.',
    website: 'https://rocket.chat',
    github: 'https://github.com/RocketChat/Rocket.Chat',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['slack', 'microsoft-teams', 'discord'],
    categoryKeywords: ['chat', 'video', 'team', 'omnichannel']
  },
  {
    name: 'Zulip',
    slug: 'zulip',
    short_description: 'Organized team chat',
    description: 'Zulip is an open-source team chat with unique topic-based threading. It combines the immediacy of real-time chat with an email threading model.',
    website: 'https://zulip.com',
    github: 'https://github.com/zulip/zulip',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['slack', 'microsoft-teams'],
    categoryKeywords: ['chat', 'threading', 'team', 'organized']
  },
  {
    name: 'Element',
    slug: 'element',
    short_description: 'Secure collaboration based on Matrix',
    description: 'Element is a secure collaboration app built on the Matrix protocol. It provides end-to-end encryption, federation, and interoperability with other Matrix clients.',
    website: 'https://element.io',
    github: 'https://github.com/vector-im/element-web',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['slack', 'discord'],
    categoryKeywords: ['chat', 'matrix', 'encryption', 'federation']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // Virtualization
  'virtualization': ['virtualization', 'devops-infrastructure'],
  'hypervisor': ['virtualization', 'devops-infrastructure'],
  'containers': ['containers-orchestration', 'devops-infrastructure'],
  'infrastructure': ['devops-infrastructure', 'cloud-platforms'],
  'enterprise': ['business-software', 'devops-infrastructure'],
  'vm': ['virtualization', 'devops-infrastructure'],
  'management': ['devops-infrastructure', 'project-management'],
  'xen': ['virtualization', 'devops-infrastructure'],
  
  // Monitoring
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'metrics': ['monitoring-observability', 'analytics'],
  'alerting': ['monitoring-observability', 'devops-infrastructure'],
  'observability': ['monitoring-observability', 'devops-infrastructure'],
  'visualization': ['analytics', 'business-intelligence'],
  'dashboards': ['analytics', 'business-intelligence'],
  'tracing': ['monitoring-observability', 'developer-tools'],
  'microservices': ['devops-infrastructure', 'backend-development'],
  'distributed': ['devops-infrastructure', 'database'],
  'performance': ['monitoring-observability', 'developer-tools'],
  'apm': ['monitoring-observability', 'developer-tools'],
  
  // CI/CD
  'ci/cd': ['ci-cd', 'devops-infrastructure'],
  'automation': ['workflow-automation', 'devops-infrastructure'],
  'devops': ['devops-infrastructure', 'developer-tools'],
  'plugins': ['developer-tools', 'devops-infrastructure'],
  'pipelines': ['ci-cd', 'devops-infrastructure'],
  'git': ['version-control', 'developer-tools'],
  'workflows': ['workflow-automation', 'ci-cd'],
  
  // CMS
  'cms': ['cms', 'content-media'],
  'headless': ['cms', 'api-development'],
  'api': ['api-development', 'developer-tools'],
  'content': ['cms', 'content-media'],
  'database': ['database', 'developer-tools'],
  'typescript': ['developer-tools', 'frontend-development'],
  'react': ['frontend-development', 'developer-tools'],
  
  // Translation
  'translation': ['localization', 'developer-tools'],
  'localization': ['localization', 'developer-tools'],
  'i18n': ['localization', 'developer-tools'],
  'collaboration': ['communication-collaboration', 'project-management'],
  'team': ['communication-collaboration', 'project-management'],
  
  // Testing
  'testing': ['testing-qa', 'developer-tools'],
  'browser': ['developer-tools', 'testing-qa'],
  'webdriver': ['testing-qa', 'automation'],
  'e2e': ['testing-qa', 'developer-tools'],
  
  // ETL
  'etl': ['data-engineering', 'analytics'],
  'data integration': ['data-engineering', 'analytics'],
  'connectors': ['integration', 'data-engineering'],
  'dataops': ['data-engineering', 'devops-infrastructure'],
  'singer': ['data-engineering', 'analytics'],
  
  // BI
  'bi': ['business-intelligence', 'analytics'],
  'analytics': ['analytics', 'business-intelligence'],
  'data': ['data-engineering', 'analytics'],
  'sql': ['database', 'developer-tools'],
  
  // Authentication
  'authentication': ['authentication-identity', 'security-privacy'],
  'sso': ['authentication-identity', 'security-privacy'],
  'identity': ['authentication-identity', 'security-privacy'],
  'authorization': ['authentication-identity', 'security-privacy'],
  'oauth': ['authentication-identity', 'api-development'],
  'permissions': ['authentication-identity', 'security-privacy'],
  'sessions': ['authentication-identity', 'developer-tools'],
  'passwordless': ['authentication-identity', 'security-privacy'],
  'social': ['social-networks', 'authentication-identity'],
  
  // Feature Flags
  'feature flags': ['developer-tools', 'devops-infrastructure'],
  'ab testing': ['analytics', 'product-management'],
  'remote config': ['developer-tools', 'devops-infrastructure'],
  'experimentation': ['analytics', 'product-management'],
  'rollouts': ['devops-infrastructure', 'developer-tools'],
  'toggles': ['developer-tools', 'devops-infrastructure'],
  
  // Storage
  'object storage': ['object-storage', 'cloud-platforms'],
  's3': ['object-storage', 'cloud-platforms'],
  'cloud storage': ['file-sharing', 'cloud-platforms'],
  'high performance': ['developer-tools', 'devops-infrastructure'],
  'blob storage': ['object-storage', 'cloud-platforms'],
  
  // Control Panels
  'control panel': ['devops-infrastructure', 'self-hosting'],
  'web hosting': ['web-hosting', 'devops-infrastructure'],
  'server': ['devops-infrastructure', 'backend-development'],
  'php': ['developer-tools', 'backend-development'],
  'hosting': ['web-hosting', 'devops-infrastructure'],
  'webmin': ['devops-infrastructure', 'self-hosting'],
  'domains': ['web-hosting', 'devops-infrastructure'],
  
  // Documentation
  'documentation': ['documentation', 'developer-tools'],
  'static site': ['static-site-generators', 'developer-tools'],
  'versioning': ['version-control', 'documentation'],
  'markdown': ['documentation', 'developer-tools'],
  'python': ['developer-tools', 'backend-development'],
  'developer': ['developer-tools', 'api-development'],
  'static': ['static-site-generators', 'developer-tools'],
  
  // Web Scraping
  'web scraping': ['developer-tools', 'data-engineering'],
  'crawling': ['developer-tools', 'data-engineering'],
  'data extraction': ['data-engineering', 'developer-tools'],
  'crawler': ['developer-tools', 'data-engineering'],
  'fast': ['developer-tools', 'performance'],
  
  // PDF
  'pdf': ['document-collaboration', 'productivity'],
  'document': ['document-collaboration', 'productivity'],
  'manipulation': ['productivity', 'developer-tools'],
  'self-hosted': ['self-hosting', 'devops-infrastructure'],
  'merger': ['productivity', 'document-collaboration'],
  'splitter': ['productivity', 'document-collaboration'],
  'desktop': ['productivity', 'developer-tools'],
  
  // Diagramming
  'whiteboard': ['design', 'communication-collaboration'],
  'diagrams': ['design', 'documentation'],
  'sketching': ['design', 'graphic-design'],
  'flowcharts': ['design', 'documentation'],
  'uml': ['developer-tools', 'documentation'],
  'free': ['productivity', 'developer-tools'],
  'drawing': ['graphic-design', 'design'],
  'canvas': ['graphic-design', 'design'],
  
  // UX
  'session replay': ['analytics', 'product-management'],
  'debugging': ['developer-tools', 'testing-qa'],
  'ux': ['ui-ux', 'product-management'],
  
  // RSS
  'rss': ['productivity', 'content-media'],
  'feeds': ['productivity', 'content-media'],
  'aggregator': ['productivity', 'content-media'],
  'minimalist': ['productivity', 'design'],
  'go': ['developer-tools', 'backend-development'],
  
  // URL Shortener
  'url shortener': ['marketing-automation', 'developer-tools'],
  'links': ['bookmarks', 'marketing-automation'],
  'tracking': ['analytics', 'marketing-automation'],
  'marketing': ['marketing-automation', 'business-software'],
  'modern': ['developer-tools', 'productivity'],
  
  // Secrets
  'secrets': ['security-privacy', 'devops-infrastructure'],
  'encryption': ['encryption', 'security-privacy'],
  'security': ['security-privacy', 'devops-infrastructure'],
  
  // Code Playgrounds
  'ide': ['developer-tools', 'productivity'],
  'code playground': ['developer-tools', 'education'],
  'nodejs': ['developer-tools', 'backend-development'],
  
  // Video
  'video': ['video-audio', 'content-media'],
  'streaming': ['video-audio', 'streaming'],
  'decentralized': ['security-privacy', 'social-networks'],
  'federation': ['social-networks', 'communication-collaboration'],
  
  // Podcast
  'podcast': ['video-audio', 'content-media'],
  'fediverse': ['social-networks', 'communication-collaboration'],
  
  // Chat
  'chat': ['communication-collaboration', 'team-chat'],
  'messaging': ['communication-collaboration', 'team-chat'],
  'omnichannel': ['customer-service', 'communication-collaboration'],
  'threading': ['communication-collaboration', 'productivity'],
  'organized': ['productivity', 'communication-collaboration'],
  'matrix': ['communication-collaboration', 'security-privacy'],
};

async function seedMoreAlternatives() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const allCategories = await Category.find().lean();
    const categoryMap = new Map(allCategories.map((c: any) => [c.slug, c._id]));
    console.log(`📂 Found ${allCategories.length} categories`);

    // First, ensure proprietary software exists
    console.log('\n📦 Adding proprietary software...');
    let propAdded = 0;
    for (const prop of newProprietarySoftware) {
      const existing = await ProprietarySoftware.findOne({ slug: prop.slug });
      if (!existing) {
        await ProprietarySoftware.create(prop);
        propAdded++;
      }
    }
    console.log(`  ✅ Added ${propAdded} new proprietary software entries`);

    // Get all proprietary software for linking
    const allProprietary = await ProprietarySoftware.find().lean();
    const proprietaryMap = new Map(allProprietary.map((p: any) => [p.slug, p._id]));
    console.log(`📦 Found ${allProprietary.length} proprietary software entries`);

    // Seed alternatives
    console.log('\n🌱 Seeding more alternatives...');
    let added = 0;
    let skipped = 0;

    for (const alt of newAlternatives) {
      // Check if already exists
      const existing = await Alternative.findOne({ slug: alt.slug });
      if (existing) {
        console.log(`  ⏭️  Skipped (exists): ${alt.name}`);
        skipped++;
        continue;
      }

      // Map category keywords to category IDs
      const categoryIds: mongoose.Types.ObjectId[] = [];
      const usedCategories = new Set<string>();
      
      for (const keyword of alt.categoryKeywords) {
        const slugs = categoryKeywordMap[keyword.toLowerCase()] || [];
        for (const slug of slugs) {
          if (!usedCategories.has(slug) && categoryMap.has(slug)) {
            categoryIds.push(categoryMap.get(slug)!);
            usedCategories.add(slug);
          }
        }
      }

      // Limit to 5 categories max
      const finalCategoryIds = categoryIds.slice(0, 5);

      // Map alternative_to to proprietary software IDs
      const alternativeToIds: mongoose.Types.ObjectId[] = [];
      for (const propSlug of alt.alternative_to) {
        if (proprietaryMap.has(propSlug)) {
          alternativeToIds.push(proprietaryMap.get(propSlug)!);
        }
      }

      // Create the alternative
      await Alternative.create({
        name: alt.name,
        slug: alt.slug,
        short_description: alt.short_description,
        description: alt.description,
        long_description: alt.description,
        website: alt.website,
        github: alt.github,
        license: alt.license,
        is_self_hosted: alt.is_self_hosted,
        categories: finalCategoryIds,
        alternative_to: alternativeToIds,
        approved: true,
        status: 'approved',
        health_score: 50 + Math.floor(Math.random() * 30),
        vote_score: Math.floor(Math.random() * 50),
      });

      console.log(`  ✅ Added: ${alt.name} (${finalCategoryIds.length} categories, ${alternativeToIds.length} proprietary links)`);
      added++;
    }

    console.log(`\n✨ Done! Added ${added} new alternatives, skipped ${skipped} existing`);

    // Final count
    const totalAlternatives = await Alternative.countDocuments();
    console.log(`📊 Total alternatives in database: ${totalAlternatives}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedMoreAlternatives();
