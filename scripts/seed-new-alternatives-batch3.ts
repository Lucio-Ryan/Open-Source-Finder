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

// New proprietary software to add
const newProprietarySoftware = [
  { name: 'Webflow', slug: 'webflow', description: 'Visual web design and development platform', website: 'https://webflow.com' },
  { name: 'Squarespace', slug: 'squarespace', description: 'Website builder and hosting platform', website: 'https://squarespace.com' },
  { name: 'Wix', slug: 'wix', description: 'Cloud-based web development platform', website: 'https://wix.com' },
  { name: 'Shopify', slug: 'shopify', description: 'E-commerce platform for online stores', website: 'https://shopify.com' },
  { name: 'Heroku', slug: 'heroku', description: 'Cloud application platform', website: 'https://heroku.com' },
  { name: 'AWS Lambda', slug: 'aws-lambda', description: 'Serverless compute service', website: 'https://aws.amazon.com/lambda' },
  { name: 'Cloudflare Workers', slug: 'cloudflare-workers', description: 'Serverless execution environment', website: 'https://workers.cloudflare.com' },
  { name: 'PagerDuty', slug: 'pagerduty', description: 'Incident management platform', website: 'https://pagerduty.com' },
  { name: 'Statuspage', slug: 'statuspage', description: 'Status and incident communication tool', website: 'https://statuspage.io' },
  { name: 'LaunchDarkly', slug: 'launchdarkly', description: 'Feature flag management platform', website: 'https://launchdarkly.com' },
  { name: 'Split.io', slug: 'split-io', description: 'Feature delivery platform', website: 'https://split.io' },
  { name: 'Algolia', slug: 'algolia', description: 'Search and discovery API', website: 'https://algolia.com' },
  { name: 'Elasticsearch Cloud', slug: 'elasticsearch-cloud', description: 'Managed Elasticsearch service', website: 'https://elastic.co/cloud' },
  { name: 'Mixpanel', slug: 'mixpanel', description: 'Product analytics platform', website: 'https://mixpanel.com' },
  { name: 'Amplitude', slug: 'amplitude', description: 'Product analytics for digital products', website: 'https://amplitude.com' },
  { name: 'Hotjar', slug: 'hotjar', description: 'Behavior analytics tool', website: 'https://hotjar.com' },
  { name: 'FullStory', slug: 'fullstory', description: 'Digital experience analytics', website: 'https://fullstory.com' },
  { name: 'Sentry', slug: 'sentry-prop', description: 'Application monitoring platform', website: 'https://sentry.io' },
  { name: 'Bugsnag', slug: 'bugsnag', description: 'Error monitoring and reporting', website: 'https://bugsnag.com' },
  { name: 'LogRocket', slug: 'logrocket', description: 'Frontend monitoring and debugging', website: 'https://logrocket.com' },
  { name: 'Papertrail', slug: 'papertrail', description: 'Cloud-hosted log management', website: 'https://papertrailapp.com' },
  { name: 'Loggly', slug: 'loggly', description: 'Cloud log management service', website: 'https://loggly.com' },
  { name: 'Calendly', slug: 'calendly', description: 'Scheduling automation platform', website: 'https://calendly.com' },
  { name: 'Doodle', slug: 'doodle', description: 'Online scheduling tool', website: 'https://doodle.com' },
  { name: 'Linear', slug: 'linear', description: 'Project and issue tracking tool', website: 'https://linear.app' },
  { name: 'Asana', slug: 'asana', description: 'Work management platform', website: 'https://asana.com' },
  { name: 'Monday.com', slug: 'monday-com', description: 'Work operating system', website: 'https://monday.com' },
  { name: 'ClickUp', slug: 'clickup', description: 'Productivity and project management', website: 'https://clickup.com' },
  { name: 'Basecamp', slug: 'basecamp', description: 'Project management and team communication', website: 'https://basecamp.com' },
  { name: 'Bitbucket', slug: 'bitbucket', description: 'Git code management', website: 'https://bitbucket.org' },
  { name: 'GitLab', slug: 'gitlab-prop', description: 'DevOps lifecycle tool', website: 'https://gitlab.com' },
  { name: 'Snyk', slug: 'snyk', description: 'Security platform for developers', website: 'https://snyk.io' },
  { name: 'SonarCloud', slug: 'sonarcloud', description: 'Code quality and security service', website: 'https://sonarcloud.io' },
  { name: 'CodeClimate', slug: 'codeclimate', description: 'Automated code review', website: 'https://codeclimate.com' },
  { name: 'Dependabot', slug: 'dependabot', description: 'Automated dependency updates', website: 'https://github.com/dependabot' },
];

// Additional alternatives (batch 3 - more unique ones)
const newAlternatives = [
  // Website Builders - Alternatives to Webflow/Squarespace/Wix
  {
    name: 'Grapesjs',
    slug: 'grapesjs',
    short_description: 'Free and open-source web builder framework',
    description: 'GrapesJS is an open-source, multi-purpose web builder framework that combines different tools and features to create HTML templates without coding. It provides a drag-and-drop builder with customizable blocks and components for building websites visually.',
    website: 'https://grapesjs.com',
    github: 'https://github.com/artf/grapesjs',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['webflow', 'wix'],
    categoryKeywords: ['website builder', 'drag and drop', 'no-code', 'html']
  },
  {
    name: 'Webstudio',
    slug: 'webstudio',
    short_description: 'Open-source visual development platform',
    description: 'Webstudio is an open-source visual development platform that enables building websites without code. It provides a Webflow-like experience with full control over hosting and data, combining the ease of visual builders with developer flexibility.',
    website: 'https://webstudio.is',
    github: 'https://github.com/webstudio-is/webstudio',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['webflow'],
    categoryKeywords: ['website builder', 'visual', 'no-code', 'development']
  },
  {
    name: 'Publii',
    slug: 'publii',
    short_description: 'Desktop-based CMS for static websites',
    description: 'Publii is a desktop-based CMS for Windows, Mac, and Linux that generates static websites. It provides a visual editor with themes and plugins, creating fast, secure static sites that can be hosted anywhere including free static hosting services.',
    website: 'https://getpublii.com',
    github: 'https://github.com/GetPublii/Publii',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['squarespace', 'wix'],
    categoryKeywords: ['cms', 'static site', 'desktop', 'blog']
  },
  // E-commerce - Alternatives to Shopify
  {
    name: 'Medusa',
    slug: 'medusa',
    short_description: 'Open-source headless commerce platform',
    description: 'Medusa is an open-source headless commerce platform that provides the building blocks for digital commerce. It offers a customizable backend with plugins, multi-region support, and flexibility to build unique e-commerce experiences.',
    website: 'https://medusajs.com',
    github: 'https://github.com/medusajs/medusa',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['shopify'],
    categoryKeywords: ['e-commerce', 'headless', 'commerce', 'nodejs']
  },
  {
    name: 'Saleor',
    slug: 'saleor',
    short_description: 'GraphQL-first e-commerce platform',
    description: 'Saleor is an open-source, GraphQL-first e-commerce platform built with Python and Django. It provides a modular architecture with headless capabilities, supporting complex e-commerce requirements including multi-channel sales.',
    website: 'https://saleor.io',
    github: 'https://github.com/saleor/saleor',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['shopify'],
    categoryKeywords: ['e-commerce', 'graphql', 'python', 'headless']
  },
  {
    name: 'Bagisto',
    slug: 'bagisto',
    short_description: 'Laravel-based open-source e-commerce',
    description: 'Bagisto is an open-source e-commerce platform built on Laravel and Vue.js. It provides a multi-store, multi-currency, and multi-locale setup with an admin panel, making it suitable for building comprehensive online stores.',
    website: 'https://bagisto.com',
    github: 'https://github.com/bagisto/bagisto',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['shopify'],
    categoryKeywords: ['e-commerce', 'laravel', 'multi-store', 'php']
  },
  {
    name: 'Sylius',
    slug: 'sylius',
    short_description: 'Symfony-based e-commerce framework',
    description: 'Sylius is an open-source e-commerce platform built on Symfony framework. It provides a highly customizable solution with built-in multi-channel capabilities, API-first approach, and robust architecture for enterprise e-commerce.',
    website: 'https://sylius.com',
    github: 'https://github.com/Sylius/Sylius',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['shopify'],
    categoryKeywords: ['e-commerce', 'symfony', 'enterprise', 'php']
  },
  // Serverless - Alternatives to AWS Lambda/Cloudflare Workers
  {
    name: 'OpenFaaS',
    slug: 'openfaas',
    short_description: 'Serverless functions made simple',
    description: 'OpenFaaS makes it easy to deploy event-driven functions and microservices to Kubernetes without repetitive boilerplate coding. It supports any language and runs on any cloud with Docker and Kubernetes.',
    website: 'https://www.openfaas.com',
    github: 'https://github.com/openfaas/faas',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['aws-lambda'],
    categoryKeywords: ['serverless', 'functions', 'kubernetes', 'faas']
  },
  {
    name: 'Knative',
    slug: 'knative',
    short_description: 'Kubernetes-based serverless platform',
    description: 'Knative is an open-source Kubernetes-based platform for deploying and managing serverless workloads. It provides components for serving, eventing, and building container-based applications with automatic scaling.',
    website: 'https://knative.dev',
    github: 'https://github.com/knative/serving',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['aws-lambda', 'cloudflare-workers'],
    categoryKeywords: ['serverless', 'kubernetes', 'containers', 'scaling']
  },
  {
    name: 'Fission',
    slug: 'fission',
    short_description: 'Fast serverless functions for Kubernetes',
    description: 'Fission is an open-source, Kubernetes-native serverless framework that focuses on developer productivity and high performance. It provides fast cold-start times and supports multiple languages including Python, Node.js, Go, and more.',
    website: 'https://fission.io',
    github: 'https://github.com/fission/fission',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['aws-lambda'],
    categoryKeywords: ['serverless', 'kubernetes', 'functions', 'developer']
  },
  {
    name: 'Kubeless',
    slug: 'kubeless',
    short_description: 'Kubernetes-native serverless framework',
    description: 'Kubeless is a Kubernetes-native serverless framework that leverages Kubernetes resources to provide auto-scaling, API routing, and monitoring. It supports Python, Node.js, Ruby, and other runtimes with native Kafka triggers.',
    website: 'https://kubeless.io',
    github: 'https://github.com/kubeless/kubeless',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['aws-lambda'],
    categoryKeywords: ['serverless', 'kubernetes', 'native', 'functions']
  },
  // Incident Management - Alternatives to PagerDuty
  {
    name: 'Grafana OnCall',
    slug: 'grafana-oncall',
    short_description: 'Open-source incident response and on-call',
    description: 'Grafana OnCall is an open-source incident response and on-call management tool. It integrates with monitoring systems to route alerts, manages on-call schedules, and provides escalation policies with native Grafana integration.',
    website: 'https://grafana.com/products/oncall',
    github: 'https://github.com/grafana/oncall',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['pagerduty'],
    categoryKeywords: ['incident management', 'on-call', 'alerting', 'grafana']
  },
  {
    name: 'Keep',
    slug: 'keep-alerting',
    short_description: 'Open-source alert management platform',
    description: 'Keep is an open-source alerting CLI and platform for developers. It provides alert management, routing, and automation with support for multiple alert sources and notification channels.',
    website: 'https://www.keephq.dev',
    github: 'https://github.com/keephq/keep',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['pagerduty'],
    categoryKeywords: ['alerting', 'incident', 'cli', 'automation']
  },
  // Status Pages - Alternatives to Statuspage
  {
    name: 'Cachet',
    slug: 'cachet',
    short_description: 'Beautiful open-source status page',
    description: 'Cachet is an open-source status page system that helps you better communicate service availability. It provides incident tracking, metrics, scheduled maintenance, and subscriber notifications with a beautiful interface.',
    website: 'https://cachethq.io',
    github: 'https://github.com/CachetHQ/Cachet',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['statuspage'],
    categoryKeywords: ['status page', 'incidents', 'uptime', 'communication']
  },
  {
    name: 'Cstate',
    slug: 'cstate',
    short_description: 'Hugo-based status page generator',
    description: 'Cstate is a static status page generator built with Hugo. It creates fast, lightweight status pages that can be hosted for free on platforms like GitHub Pages or Netlify with version-controlled incident management.',
    website: 'https://cstate.netlify.app',
    github: 'https://github.com/cstate/cstate',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['statuspage'],
    categoryKeywords: ['status page', 'static', 'hugo', 'free']
  },
  {
    name: 'Statusfy',
    slug: 'statusfy',
    short_description: 'Status page system with markdown support',
    description: 'Statusfy is an open-source status page system with first-class support for markdown. It generates static status pages with incident history, scheduled maintenance, and multi-language support for global audiences.',
    website: 'https://statusfy.co',
    github: 'https://github.com/statusfy/statusfy',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['statuspage'],
    categoryKeywords: ['status page', 'markdown', 'multilingual', 'static']
  },
  // Feature Flags - Alternatives to LaunchDarkly
  {
    name: 'Unleash',
    slug: 'unleash',
    short_description: 'Open-source feature flag management',
    description: 'Unleash is an open-source feature management solution that provides gradual rollouts, A/B testing, and kill switches. It supports multiple programming languages with SDKs and can be self-hosted for complete data control.',
    website: 'https://www.getunleash.io',
    github: 'https://github.com/Unleash/unleash',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['launchdarkly', 'split-io'],
    categoryKeywords: ['feature flags', 'toggles', 'rollout', 'ab testing']
  },
  {
    name: 'Flagsmith',
    slug: 'flagsmith',
    short_description: 'Feature flag and remote config service',
    description: 'Flagsmith is an open-source feature flag and remote config service. It provides feature toggles, remote configuration, A/B testing, and analytics with both cloud and self-hosted deployment options.',
    website: 'https://flagsmith.com',
    github: 'https://github.com/Flagsmith/flagsmith',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['launchdarkly', 'split-io'],
    categoryKeywords: ['feature flags', 'config', 'ab testing', 'analytics']
  },
  {
    name: 'GrowthBook',
    slug: 'growthbook',
    short_description: 'Open-source feature flagging and A/B testing',
    description: 'GrowthBook is an open-source platform for feature flags and A/B testing built for data teams. It provides statistical analysis, integration with data warehouses, and SDK support for multiple languages.',
    website: 'https://www.growthbook.io',
    github: 'https://github.com/growthbook/growthbook',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['launchdarkly'],
    categoryKeywords: ['feature flags', 'ab testing', 'experimentation', 'data']
  },
  // Search - Alternatives to Algolia
  {
    name: 'Zinc',
    slug: 'zinc',
    short_description: 'Lightweight Elasticsearch alternative',
    description: 'Zinc is a lightweight search engine that is a drop-in replacement for Elasticsearch. It uses bluge for indexing and provides a significantly smaller resource footprint while maintaining compatibility with Elasticsearch APIs.',
    website: 'https://zincsearch-docs.zinc.dev',
    github: 'https://github.com/zincsearch/zincsearch',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['algolia', 'elasticsearch-cloud'],
    categoryKeywords: ['search', 'elasticsearch', 'lightweight', 'indexing']
  },
  {
    name: 'Manticore Search',
    slug: 'manticore-search',
    short_description: 'Fast, scalable full-text search',
    description: 'Manticore Search is an open-source database designed for search with high scalability and performance. It provides full-text search, columnar storage, and SQL-based querying with real-time indexing capabilities.',
    website: 'https://manticoresearch.com',
    github: 'https://github.com/manticoresoftware/manticoresearch',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['algolia', 'elasticsearch-cloud'],
    categoryKeywords: ['search', 'full-text', 'sql', 'realtime']
  },
  // Analytics - Alternatives to Mixpanel/Amplitude
  {
    name: 'PostHog',
    slug: 'posthog',
    short_description: 'Open-source product analytics platform',
    description: 'PostHog is an open-source product analytics platform that provides event tracking, feature flags, session recording, and A/B testing in one platform. It can be self-hosted for complete data ownership and GDPR compliance.',
    website: 'https://posthog.com',
    github: 'https://github.com/PostHog/posthog',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['mixpanel', 'amplitude'],
    categoryKeywords: ['analytics', 'product', 'tracking', 'session recording']
  },
  {
    name: 'Umami',
    slug: 'umami',
    short_description: 'Simple, fast, privacy-focused analytics',
    description: 'Umami is a simple, fast, privacy-focused alternative to Google Analytics. It tracks website usage without collecting personal data and provides a clean dashboard for understanding visitor behavior.',
    website: 'https://umami.is',
    github: 'https://github.com/umami-software/umami',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['mixpanel'],
    categoryKeywords: ['analytics', 'privacy', 'simple', 'tracking']
  },
  {
    name: 'Pirsch',
    slug: 'pirsch',
    short_description: 'Privacy-friendly web analytics',
    description: 'Pirsch is a privacy-friendly web analytics solution that does not use cookies or collect personal data. It provides simple, understandable metrics with a clean interface and GDPR compliance out of the box.',
    website: 'https://pirsch.io',
    github: 'https://github.com/pirsch-analytics/pirsch',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['mixpanel', 'amplitude'],
    categoryKeywords: ['analytics', 'privacy', 'gdpr', 'cookies']
  },
  // Session Recording - Alternatives to Hotjar/FullStory
  {
    name: 'OpenReplay',
    slug: 'openreplay',
    short_description: 'Open-source session replay platform',
    description: 'OpenReplay is a self-hosted session replay suite that lets you see what users do on your web app. It provides session recording, devtools integration, and co-browsing capabilities with complete data ownership.',
    website: 'https://openreplay.com',
    github: 'https://github.com/openreplay/openreplay',
    license: 'ELv2 License',
    is_self_hosted: true,
    alternative_to: ['hotjar', 'fullstory'],
    categoryKeywords: ['session replay', 'recording', 'debugging', 'ux']
  },
  {
    name: 'Highlight',
    slug: 'highlight-io',
    short_description: 'Full-stack monitoring with session replay',
    description: 'Highlight is an open-source monitoring platform that combines session replay, error monitoring, and logging. It provides a unified view of frontend and backend issues with automatic error grouping.',
    website: 'https://highlight.io',
    github: 'https://github.com/highlight/highlight',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['hotjar', 'fullstory', 'logrocket'],
    categoryKeywords: ['session replay', 'monitoring', 'errors', 'logging']
  },
  // Error Monitoring - Alternatives to Sentry/Bugsnag
  {
    name: 'GlitchTip',
    slug: 'glitchtip',
    short_description: 'Simple, open-source error tracking',
    description: 'GlitchTip is an open-source error tracking and performance monitoring platform compatible with Sentry SDKs. It provides error aggregation, uptime monitoring, and performance metrics with a simple, resource-efficient design.',
    website: 'https://glitchtip.com',
    github: 'https://github.com/glitchtip/glitchtip-backend',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['sentry-prop', 'bugsnag'],
    categoryKeywords: ['error tracking', 'monitoring', 'performance', 'sentry']
  },
  {
    name: 'Sentry',
    slug: 'sentry',
    short_description: 'Application monitoring platform',
    description: 'Sentry is an open-source application monitoring platform that helps developers identify and fix errors in real-time. It provides crash reporting, performance monitoring, and release tracking across multiple platforms.',
    website: 'https://sentry.io',
    github: 'https://github.com/getsentry/sentry',
    license: 'FSL License',
    is_self_hosted: true,
    alternative_to: ['bugsnag'],
    categoryKeywords: ['error tracking', 'monitoring', 'performance', 'crashes']
  },
  // Log Management - Alternatives to Papertrail/Loggly
  {
    name: 'Graylog',
    slug: 'graylog',
    short_description: 'Centralized log management platform',
    description: 'Graylog is an open-source log management platform that enables aggregating, searching, and analyzing logs from various sources. It provides real-time alerting, dashboards, and correlation of log data for troubleshooting.',
    website: 'https://graylog.org',
    github: 'https://github.com/Graylog2/graylog2-server',
    license: 'SSPL License',
    is_self_hosted: true,
    alternative_to: ['papertrail', 'loggly'],
    categoryKeywords: ['logging', 'log management', 'centralized', 'alerting']
  },
  {
    name: 'Fluentd',
    slug: 'fluentd',
    short_description: 'Unified logging layer',
    description: 'Fluentd is an open-source data collector for unified logging layer. It allows collecting data from various sources and routing to multiple destinations with a pluggable architecture supporting hundreds of plugins.',
    website: 'https://www.fluentd.org',
    github: 'https://github.com/fluent/fluentd',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['papertrail', 'loggly'],
    categoryKeywords: ['logging', 'collector', 'unified', 'plugins']
  },
  // Project Management - Alternatives to Linear/Asana
  {
    name: 'Plane',
    slug: 'plane',
    short_description: 'Open-source project planning tool',
    description: 'Plane is an open-source project planning tool that combines issue tracking, sprints, and product roadmaps. It provides a modern interface similar to Linear with self-hosting capabilities for teams requiring data control.',
    website: 'https://plane.so',
    github: 'https://github.com/makeplane/plane',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['linear', 'asana'],
    categoryKeywords: ['project management', 'issues', 'sprints', 'roadmap']
  },
  {
    name: 'Focalboard',
    slug: 'focalboard',
    short_description: 'Open-source project management',
    description: 'Focalboard is an open-source project management tool that serves as an alternative to Asana, Trello, and Notion for project tracking. It provides kanban boards, tables, and calendars with team collaboration features.',
    website: 'https://www.focalboard.com',
    github: 'https://github.com/mattermost/focalboard',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['asana', 'monday-com'],
    categoryKeywords: ['project management', 'kanban', 'boards', 'collaboration']
  },
  {
    name: 'OpenProject',
    slug: 'openproject',
    short_description: 'Open-source project management software',
    description: 'OpenProject is an open-source project management software for distributed teams. It provides project planning, scheduling, roadmaps, time tracking, and budget management with enterprise features and self-hosting options.',
    website: 'https://www.openproject.org',
    github: 'https://github.com/opf/openproject',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['asana', 'monday-com', 'clickup'],
    categoryKeywords: ['project management', 'planning', 'enterprise', 'scheduling']
  },
  {
    name: 'Taiga',
    slug: 'taiga',
    short_description: 'Agile project management platform',
    description: 'Taiga is an open-source agile project management platform that supports Scrum and Kanban methodologies. It provides sprints, user stories, issues, and wiki with a clean interface for agile teams.',
    website: 'https://taiga.io',
    github: 'https://github.com/taigaio/taiga-back',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['asana', 'clickup'],
    categoryKeywords: ['project management', 'agile', 'scrum', 'kanban']
  },
  // Git Platforms - Alternatives to GitLab/Bitbucket
  {
    name: 'Gitea',
    slug: 'gitea',
    short_description: 'Lightweight self-hosted Git service',
    description: 'Gitea is a painless self-hosted Git service that is extremely lightweight and fast. It provides repository management, code review, team collaboration, and CI/CD with minimal resource requirements.',
    website: 'https://gitea.io',
    github: 'https://github.com/go-gitea/gitea',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['gitlab-prop', 'bitbucket'],
    categoryKeywords: ['git', 'version control', 'self-hosted', 'lightweight']
  },
  {
    name: 'Forgejo',
    slug: 'forgejo',
    short_description: 'Community-driven Gitea fork',
    description: 'Forgejo is a self-hosted lightweight software forge that is a community-driven fork of Gitea. It provides a safe and inclusive environment for software development with Git hosting, issue tracking, and code review.',
    website: 'https://forgejo.org',
    github: 'https://codeberg.org/forgejo/forgejo',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['gitlab-prop', 'bitbucket'],
    categoryKeywords: ['git', 'forge', 'community', 'self-hosted']
  },
  {
    name: 'OneDev',
    slug: 'onedev',
    short_description: 'All-in-one DevOps platform',
    description: 'OneDev is an all-in-one DevOps platform providing Git management, CI/CD, Kanban board, and packages with a single executable. It features built-in CI/CD with YAML-less pipelines and powerful code search.',
    website: 'https://onedev.io',
    github: 'https://github.com/theonedev/onedev',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['gitlab-prop'],
    categoryKeywords: ['git', 'devops', 'ci/cd', 'all-in-one']
  },
  // Code Quality - Alternatives to SonarCloud/CodeClimate
  {
    name: 'SonarQube',
    slug: 'sonarqube',
    short_description: 'Continuous inspection of code quality',
    description: 'SonarQube is an open-source platform for continuous inspection of code quality to perform automatic reviews with static analysis. It detects bugs, vulnerabilities, and code smells in 30+ programming languages.',
    website: 'https://www.sonarqube.org',
    github: 'https://github.com/SonarSource/sonarqube',
    license: 'LGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['sonarcloud', 'codeclimate'],
    categoryKeywords: ['code quality', 'static analysis', 'security', 'bugs']
  },
  {
    name: 'Codacy',
    slug: 'codacy-cli',
    short_description: 'Automated code review tool',
    description: 'Codacy provides automated code review that checks every commit and pull request for issues in code quality, security, and style. The analysis tools can be run locally or integrated into CI/CD pipelines.',
    website: 'https://www.codacy.com',
    github: 'https://github.com/codacy/codacy-analysis-cli',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['codeclimate'],
    categoryKeywords: ['code review', 'quality', 'automated', 'ci/cd']
  },
  // Dependency Management - Alternatives to Dependabot
  {
    name: 'Renovate',
    slug: 'renovate',
    short_description: 'Automated dependency updates',
    description: 'Renovate is an open-source tool that automates dependency updates in your repository. It supports multiple languages and package managers, creates pull requests for updates, and provides customizable update strategies.',
    website: 'https://docs.renovatebot.com',
    github: 'https://github.com/renovatebot/renovate',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['dependabot'],
    categoryKeywords: ['dependencies', 'updates', 'automation', 'security']
  },
  // Additional Development Tools
  {
    name: 'Tilt',
    slug: 'tilt',
    short_description: 'Dev environment for Kubernetes',
    description: 'Tilt is a toolkit for fixing the pains of microservice development. It provides instant updates, intelligent rebuild, and a powerful UI for understanding your Kubernetes deployments during development.',
    website: 'https://tilt.dev',
    github: 'https://github.com/tilt-dev/tilt',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['kubernetes', 'development', 'microservices', 'local']
  },
  {
    name: 'Skaffold',
    slug: 'skaffold',
    short_description: 'Local Kubernetes development',
    description: 'Skaffold is a command-line tool that facilitates continuous development for Kubernetes applications. It handles the workflow for building, pushing, and deploying applications while watching for code changes.',
    website: 'https://skaffold.dev',
    github: 'https://github.com/GoogleContainerTools/skaffold',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['kubernetes', 'development', 'continuous', 'cli']
  },
  {
    name: 'Telepresence',
    slug: 'telepresence',
    short_description: 'Local development against remote Kubernetes',
    description: 'Telepresence enables developers to run local processes that connect to a remote Kubernetes cluster. It allows fast development loops by replacing a deployed service with a local process for debugging.',
    website: 'https://www.telepresence.io',
    github: 'https://github.com/telepresenceio/telepresence',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['kubernetes', 'development', 'debugging', 'remote']
  },
  {
    name: 'LocalStack',
    slug: 'localstack',
    short_description: 'Local AWS cloud stack',
    description: 'LocalStack provides a fully functional local AWS cloud stack for development and testing. It emulates various AWS services locally, enabling fast iterations without incurring cloud costs during development.',
    website: 'https://localstack.cloud',
    github: 'https://github.com/localstack/localstack',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['aws', 'local', 'testing', 'development']
  },
  {
    name: 'Mailpit',
    slug: 'mailpit',
    short_description: 'Email testing tool for developers',
    description: 'Mailpit is a lightweight email testing tool that captures SMTP emails during development. It provides a web UI for viewing emails, API for automated testing, and spam score analysis with minimal setup.',
    website: 'https://mailpit.axllent.org',
    github: 'https://github.com/axllent/mailpit',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['email', 'testing', 'smtp', 'development']
  },
  {
    name: 'MailHog',
    slug: 'mailhog',
    short_description: 'Web and API based SMTP testing',
    description: 'MailHog is an email testing tool that configures as an SMTP server for capturing outgoing emails. It provides a web interface for viewing messages and an API for retrieving emails in automated tests.',
    website: 'https://github.com/mailhog/MailHog',
    github: 'https://github.com/mailhog/MailHog',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['email', 'testing', 'smtp', 'api']
  },
  {
    name: 'Mockoon',
    slug: 'mockoon',
    short_description: 'Mock API server for development',
    description: 'Mockoon is the easiest and quickest way to run mock APIs locally. It provides a desktop application for creating and managing mock REST APIs with customizable responses, latency simulation, and proxy mode.',
    website: 'https://mockoon.com',
    github: 'https://github.com/mockoon/mockoon',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['api', 'mock', 'testing', 'desktop']
  },
  {
    name: 'WireMock',
    slug: 'wiremock',
    short_description: 'Flexible API mocking library',
    description: 'WireMock is a flexible library for stubbing and mocking HTTP services. It enables creating mock APIs for testing with features like request matching, response templating, and stateful scenarios.',
    website: 'https://wiremock.org',
    github: 'https://github.com/wiremock/wiremock',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['api', 'mock', 'testing', 'http']
  },
  {
    name: 'Hurl',
    slug: 'hurl',
    short_description: 'Command-line HTTP request runner',
    description: 'Hurl is a command-line tool for running HTTP requests defined in a simple plain text format. It supports testing HTTP responses with assertions, chaining requests, and integrating into CI/CD pipelines.',
    website: 'https://hurl.dev',
    github: 'https://github.com/Orange-OpenSource/hurl',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['http', 'testing', 'cli', 'requests']
  },
  {
    name: 'HTTPie',
    slug: 'httpie',
    short_description: 'Human-friendly HTTP client',
    description: 'HTTPie is a command-line HTTP client with an intuitive UI, JSON support, syntax highlighting, and persistent sessions. It makes testing APIs and debugging HTTP requests easier with expressive syntax.',
    website: 'https://httpie.io',
    github: 'https://github.com/httpie/cli',
    license: 'BSD-3-Clause License',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['http', 'client', 'cli', 'api']
  },
  // Data Engineering
  {
    name: 'Dagster',
    slug: 'dagster',
    short_description: 'Data orchestration platform',
    description: 'Dagster is an open-source data orchestrator for machine learning, analytics, and ETL. It provides a unified programming model for data pipelines with built-in testing, monitoring, and documentation.',
    website: 'https://dagster.io',
    github: 'https://github.com/dagster-io/dagster',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['data', 'orchestration', 'etl', 'pipelines']
  },
  {
    name: 'Prefect',
    slug: 'prefect',
    short_description: 'Modern workflow orchestration',
    description: 'Prefect is a workflow orchestration tool for data teams that enables building, scheduling, and monitoring data pipelines. It provides observability, retries, and caching with a Pythonic API.',
    website: 'https://www.prefect.io',
    github: 'https://github.com/PrefectHQ/prefect',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['workflow', 'orchestration', 'data', 'python']
  },
  {
    name: 'Apache Airflow',
    slug: 'apache-airflow',
    short_description: 'Platform for workflow scheduling',
    description: 'Apache Airflow is an open-source platform to programmatically author, schedule, and monitor workflows. It provides a rich UI for visualizing pipelines, managing dependencies, and monitoring progress.',
    website: 'https://airflow.apache.org',
    github: 'https://github.com/apache/airflow',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['workflow', 'scheduling', 'data', 'apache']
  },
  {
    name: 'dbt',
    slug: 'dbt',
    short_description: 'Analytics engineering tool',
    description: 'dbt (data build tool) enables analytics engineers to transform data in their warehouses by writing SQL select statements. It handles the T in ELT with version control, testing, and documentation.',
    website: 'https://www.getdbt.com',
    github: 'https://github.com/dbt-labs/dbt-core',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['analytics', 'data', 'sql', 'transformation']
  },
  {
    name: 'Airbyte',
    slug: 'airbyte',
    short_description: 'Data integration platform',
    description: 'Airbyte is an open-source data integration platform that helps replicate data from applications, APIs, and databases to warehouses and lakes. It provides hundreds of connectors with a UI for managing syncs.',
    website: 'https://airbyte.com',
    github: 'https://github.com/airbytehq/airbyte',
    license: 'ELv2 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['data', 'integration', 'etl', 'connectors']
  },
  // Terminal & CLI Tools
  {
    name: 'Warp',
    slug: 'warp-terminal',
    short_description: 'Modern, Rust-based terminal',
    description: 'Warp is a modern terminal reimagined from the ground up with AI, collaborative features, and a block-based interface. It provides intelligent command completion, workflow sharing, and a fast GPU-accelerated UI.',
    website: 'https://www.warp.dev',
    github: 'https://github.com/warpdotdev/Warp',
    license: 'Proprietary',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['terminal', 'cli', 'ai', 'modern']
  },
  {
    name: 'Alacritty',
    slug: 'alacritty',
    short_description: 'GPU-accelerated terminal emulator',
    description: 'Alacritty is a modern terminal emulator that leverages GPU acceleration to provide the fastest rendering available. It is simple, fast, and focused on doing one thing well while being highly configurable.',
    website: 'https://alacritty.org',
    github: 'https://github.com/alacritty/alacritty',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['terminal', 'gpu', 'fast', 'rust']
  },
  {
    name: 'Kitty',
    slug: 'kitty',
    short_description: 'Fast, feature-rich terminal emulator',
    description: 'Kitty is a fast, feature-rich, GPU-based terminal emulator. It supports graphics, multiple splits, tabs, and extensive customization while maintaining excellent performance through OpenGL rendering.',
    website: 'https://sw.kovidgoyal.net/kitty',
    github: 'https://github.com/kovidgoyal/kitty',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['terminal', 'gpu', 'graphics', 'splits']
  },
  {
    name: 'Zellij',
    slug: 'zellij',
    short_description: 'Modern terminal workspace',
    description: 'Zellij is a terminal workspace with batteries included. It provides terminal multiplexing with intuitive pane and tab management, session persistence, and a plugin system built on WebAssembly.',
    website: 'https://zellij.dev',
    github: 'https://github.com/zellij-org/zellij',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['terminal', 'multiplexer', 'workspace', 'rust']
  },
  {
    name: 'Starship',
    slug: 'starship',
    short_description: 'Minimal, fast shell prompt',
    description: 'Starship is a minimal, blazing-fast, and infinitely customizable prompt for any shell. It shows information contextually based on your environment with support for many programming languages and tools.',
    website: 'https://starship.rs',
    github: 'https://github.com/starship/starship',
    license: 'ISC License',
    is_self_hosted: false,
    alternative_to: [],
    categoryKeywords: ['shell', 'prompt', 'customizable', 'fast']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // Website & CMS
  'website builder': ['cms-platforms', 'developer-tools'],
  'drag and drop': ['cms-platforms', 'developer-tools'],
  'no-code': ['developer-tools', 'business-software'],
  'html': ['developer-tools', 'frontend-development'],
  'visual': ['ui-ux-design', 'developer-tools'],
  'cms': ['cms-platforms', 'content-media'],
  'static site': ['developer-tools', 'documentation'],
  'desktop': ['developer-tools', 'productivity'],
  'blog': ['cms-platforms', 'content-media'],
  
  // E-commerce
  'e-commerce': ['e-commerce', 'online-stores'],
  'headless': ['cms-platforms', 'api-development'],
  'commerce': ['e-commerce', 'online-stores'],
  'nodejs': ['developer-tools', 'backend-development'],
  'graphql': ['api-development', 'backend-development'],
  'python': ['developer-tools', 'data-analytics'],
  'laravel': ['developer-tools', 'backend-development'],
  'multi-store': ['e-commerce', 'business-software'],
  'php': ['developer-tools', 'backend-development'],
  'symfony': ['developer-tools', 'backend-development'],
  'enterprise': ['business-software', 'security-privacy'],
  
  // Serverless
  'serverless': ['devops-infrastructure', 'cloud-platforms'],
  'functions': ['devops-infrastructure', 'developer-tools'],
  'kubernetes': ['orchestration', 'devops-infrastructure'],
  'faas': ['devops-infrastructure', 'cloud-platforms'],
  'containers': ['containerization', 'devops-infrastructure'],
  'scaling': ['devops-infrastructure', 'cloud-platforms'],
  'developer': ['developer-tools'],
  'native': ['developer-tools', 'devops-infrastructure'],
  
  // Incident Management
  'incident management': ['monitoring-observability', 'devops-infrastructure'],
  'on-call': ['monitoring-observability', 'devops-infrastructure'],
  'alerting': ['monitoring-observability', 'devops-infrastructure'],
  'grafana': ['monitoring-observability', 'data-visualization'],
  'incident': ['monitoring-observability', 'devops-infrastructure'],
  'cli': ['terminal-cli', 'developer-tools'],
  'automation': ['automation', 'devops-infrastructure'],
  
  // Status Pages
  'status page': ['monitoring-observability', 'devops-infrastructure'],
  'incidents': ['monitoring-observability', 'devops-infrastructure'],
  'uptime': ['monitoring-observability', 'devops-infrastructure'],
  'communication': ['communication-collaboration', 'business-software'],
  'static': ['developer-tools', 'documentation'],
  'hugo': ['developer-tools', 'documentation'],
  'free': ['developer-tools', 'productivity'],
  'markdown': ['developer-tools', 'documentation'],
  'multilingual': ['developer-tools', 'business-software'],
  
  // Feature Flags
  'feature flags': ['developer-tools', 'devops-infrastructure'],
  'toggles': ['developer-tools', 'devops-infrastructure'],
  'rollout': ['devops-infrastructure', 'developer-tools'],
  'ab testing': ['analytics-platforms', 'developer-tools'],
  'config': ['devops-infrastructure', 'developer-tools'],
  'analytics': ['analytics-platforms', 'data-analytics'],
  'experimentation': ['analytics-platforms', 'developer-tools'],
  'data': ['data-analytics', 'database-storage'],
  
  // Search
  'search': ['developer-tools', 'data-analytics'],
  'elasticsearch': ['database-storage', 'monitoring-observability'],
  'lightweight': ['developer-tools', 'productivity'],
  'indexing': ['database-storage', 'developer-tools'],
  'full-text': ['database-storage', 'developer-tools'],
  'sql': ['database-storage', 'developer-tools'],
  'realtime': ['backend-development', 'developer-tools'],
  
  // Analytics
  'product': ['analytics-platforms', 'business-software'],
  'tracking': ['analytics-platforms', 'marketing-customer-engagement'],
  'session recording': ['analytics-platforms', 'developer-tools'],
  'privacy': ['security-privacy', 'encryption'],
  'simple': ['productivity', 'developer-tools'],
  'gdpr': ['security-privacy', 'business-software'],
  'cookies': ['security-privacy', 'developer-tools'],
  
  // Session Replay
  'session replay': ['analytics-platforms', 'developer-tools'],
  'recording': ['video-audio', 'analytics-platforms'],
  'debugging': ['developer-tools', 'testing-qa'],
  'ux': ['ui-ux-design', 'analytics-platforms'],
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'errors': ['monitoring-observability', 'developer-tools'],
  'logging': ['monitoring-observability', 'devops-infrastructure'],
  
  // Error Tracking
  'error tracking': ['monitoring-observability', 'developer-tools'],
  'performance': ['developer-tools', 'monitoring-observability'],
  'sentry': ['monitoring-observability', 'developer-tools'],
  'crashes': ['monitoring-observability', 'developer-tools'],
  
  // Log Management
  'log management': ['monitoring-observability', 'devops-infrastructure'],
  'centralized': ['devops-infrastructure', 'monitoring-observability'],
  'collector': ['monitoring-observability', 'devops-infrastructure'],
  'unified': ['devops-infrastructure', 'monitoring-observability'],
  'plugins': ['developer-tools', 'automation'],
  
  // Project Management
  'project management': ['project-management', 'business-software'],
  'issues': ['project-management', 'developer-tools'],
  'sprints': ['project-management', 'business-software'],
  'roadmap': ['project-management', 'business-software'],
  'kanban': ['project-management', 'task-management'],
  'boards': ['project-management', 'task-management'],
  'collaboration': ['document-collaboration', 'communication-collaboration'],
  'planning': ['project-management', 'business-software'],
  'scheduling': ['calendar-scheduling', 'project-management'],
  'agile': ['project-management', 'business-software'],
  'scrum': ['project-management', 'business-software'],
  
  // Git
  'git': ['version-control', 'developer-tools'],
  'version control': ['version-control', 'developer-tools'],
  'self-hosted': ['devops-infrastructure', 'security-privacy'],
  'forge': ['version-control', 'developer-tools'],
  'community': ['developer-tools', 'business-software'],
  'devops': ['devops-infrastructure', 'ci-cd'],
  'ci/cd': ['ci-cd', 'devops-infrastructure'],
  'all-in-one': ['developer-tools', 'devops-infrastructure'],
  
  // Code Quality
  'code quality': ['testing-qa', 'developer-tools'],
  'static analysis': ['testing-qa', 'security-privacy'],
  'security': ['security-privacy', 'authentication-identity'],
  'bugs': ['testing-qa', 'developer-tools'],
  'code review': ['developer-tools', 'testing-qa'],
  'quality': ['testing-qa', 'developer-tools'],
  'automated': ['automation', 'ci-cd'],
  
  // Dependencies
  'dependencies': ['developer-tools', 'security-privacy'],
  'updates': ['developer-tools', 'security-privacy'],
  
  // Development
  'development': ['developer-tools'],
  'microservices': ['devops-infrastructure', 'developer-tools'],
  'local': ['developer-tools', 'productivity'],
  'continuous': ['ci-cd', 'devops-infrastructure'],
  'remote': ['developer-tools', 'communication-collaboration'],
  'aws': ['cloud-platforms', 'devops-infrastructure'],
  'testing': ['testing-qa', 'developer-tools'],
  
  // Email Testing
  'email': ['email-newsletters', 'communication-collaboration'],
  'smtp': ['email-newsletters', 'devops-infrastructure'],
  
  // API Mocking
  'api': ['developer-tools', 'api-development'],
  'mock': ['testing-qa', 'developer-tools'],
  'http': ['developer-tools', 'api-development'],
  'requests': ['developer-tools', 'api-development'],
  'client': ['developer-tools', 'api-development'],
  
  // Data Engineering
  'orchestration': ['orchestration', 'devops-infrastructure'],
  'etl': ['etl-data-pipelines', 'data-analytics'],
  'pipelines': ['ci-cd', 'data-analytics'],
  'workflow': ['automation', 'productivity'],
  'transformation': ['data-analytics', 'etl-data-pipelines'],
  'integration': ['automation', 'developer-tools'],
  'connectors': ['developer-tools', 'automation'],
  
  // Terminal
  'terminal': ['terminal-cli', 'developer-tools'],
  'ai': ['ai-machine-learning', 'developer-tools'],
  'modern': ['developer-tools', 'productivity'],
  'gpu': ['developer-tools', 'ai-machine-learning'],
  'fast': ['developer-tools', 'backend-development'],
  'rust': ['developer-tools', 'backend-development'],
  'graphics': ['graphic-design', 'developer-tools'],
  'splits': ['developer-tools', 'productivity'],
  'multiplexer': ['terminal-cli', 'developer-tools'],
  'workspace': ['developer-tools', 'productivity'],
  'shell': ['terminal-cli', 'developer-tools'],
  'prompt': ['terminal-cli', 'developer-tools'],
  'customizable': ['developer-tools', 'productivity'],
};

async function seedNewAlternatives() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const allCategories = await Category.find().lean();
    const categoryMap = new Map(allCategories.map((c: any) => [c.slug, c._id]));
    console.log(`📂 Found ${allCategories.length} categories`);

    // First, ensure proprietary software exists
    console.log('\n📦 Adding proprietary software...');
    for (const prop of newProprietarySoftware) {
      const existing = await ProprietarySoftware.findOne({ slug: prop.slug });
      if (!existing) {
        await ProprietarySoftware.create(prop);
        console.log(`  ✅ Added: ${prop.name}`);
      }
    }

    // Get all proprietary software for linking
    const allProprietary = await ProprietarySoftware.find().lean();
    const proprietaryMap = new Map(allProprietary.map((p: any) => [p.slug, p._id]));
    console.log(`📦 Found ${allProprietary.length} proprietary software entries`);

    // Seed alternatives
    console.log('\n🌱 Seeding new alternatives (batch 3)...');
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

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedNewAlternatives();
