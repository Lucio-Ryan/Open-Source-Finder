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
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  short_description: { type: String, default: null },
  website: { type: String, required: true },
  github: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  license: { type: String, default: 'MIT' },
  is_self_hosted: { type: Boolean, default: true },
  health_score: { type: Number, default: 80 },
  approved: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// Categories to be used
const categoryDefinitions = [
  { name: 'Video Recording', slug: 'video-recording' },
  { name: 'Video Hosting', slug: 'video-hosting' },
  { name: 'Code Editors', slug: 'code-editors' },
  { name: 'Developer Tools', slug: 'developer-tools' },
  { name: 'API Development', slug: 'api-development' },
  { name: 'Project Management', slug: 'project-management' },
  { name: 'Issue Tracking', slug: 'issue-tracking' },
  { name: 'Backend as a Service', slug: 'backend-as-a-service' },
  { name: 'Cloud Platform', slug: 'cloud-platform' },
  { name: 'Deployment', slug: 'deployment' },
  { name: 'Hosting', slug: 'hosting' },
  { name: 'Analytics', slug: 'analytics' },
  { name: 'Product Analytics', slug: 'product-analytics' },
  { name: 'User Behavior', slug: 'user-behavior' },
  { name: 'Monitoring', slug: 'monitoring' },
  { name: 'Observability', slug: 'observability' },
  { name: 'File Storage', slug: 'file-storage' },
  { name: 'Cloud Storage', slug: 'cloud-storage' },
  { name: 'File Sync', slug: 'file-sync' },
  { name: 'Office Suite', slug: 'office-suite' },
  { name: 'Documents', slug: 'documents' },
  { name: 'Spreadsheets', slug: 'spreadsheets' },
  { name: 'Collaboration', slug: 'collaboration' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Self-Hosted', slug: 'self-hosted' },
  { name: 'Privacy', slug: 'privacy' },
];

// Proprietary software alternatives 20-40 from open_source_alternatives.md
interface AlternativeData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  website: string;
  github: string;
  is_self_hosted: boolean;
  categoryNames: string[];
}

const alternativesData: Record<string, AlternativeData[]> = {
  'loom': [
    {
      name: 'PeerTube',
      slug: 'peertube',
      short_description: 'Decentralized video hosting platform',
      description: 'PeerTube is a free, decentralized and federated video platform that uses peer-to-peer technology to reduce load on individual servers.',
      website: 'https://joinpeertube.org/',
      github: 'https://github.com/Chocobozzz/PeerTube',
      is_self_hosted: true,
      categoryNames: ['Video Hosting', 'Video Recording', 'Self-Hosted']
    },
    {
      name: 'OBS Studio',
      slug: 'obs-studio-loom',
      short_description: 'Open-source video recording and streaming',
      description: 'OBS Studio is free and open-source software for video recording and live streaming with powerful configuration options.',
      website: 'https://obsproject.com/',
      github: 'https://github.com/obsproject/obs-studio',
      is_self_hosted: true,
      categoryNames: ['Video Recording', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'RecordScreen.io',
      slug: 'recordscreen-io',
      short_description: 'Simple screen recording in browser',
      description: 'A simple, free screen recording tool that works directly in your browser without requiring any installation.',
      website: 'https://recordscreen.io/',
      github: 'https://github.com/nicholasyang2022/recordscreen',
      is_self_hosted: false,
      categoryNames: ['Video Recording', 'Developer Tools', 'Open Source']
    }
  ],
  'sublime-text': [
    {
      name: 'VS Code',
      slug: 'vs-code-sublime',
      short_description: 'The open-source core of the world\'s most popular code editor',
      description: 'Visual Studio Code is a lightweight but powerful source code editor with built-in support for many languages and a rich extension ecosystem.',
      website: 'https://code.visualstudio.com/',
      github: 'https://github.com/microsoft/vscode',
      is_self_hosted: true,
      categoryNames: ['Code Editors', 'Developer Tools', 'Open Source']
    },
    {
      name: 'Pulsar',
      slug: 'pulsar',
      short_description: 'Community-led fork of the Atom text editor',
      description: 'A modern, hackable text editor that continues the legacy of Atom with community-driven development and improvements.',
      website: 'https://pulsar-edit.dev/',
      github: 'https://github.com/pulsar-edit/pulsar',
      is_self_hosted: true,
      categoryNames: ['Code Editors', 'Developer Tools', 'Open Source']
    },
    {
      name: 'Lite XL',
      slug: 'lite-xl',
      short_description: 'Lightweight and fast code editor',
      description: 'A lightweight, fast, and extensible text editor written in Lua and C, focusing on simplicity and performance.',
      website: 'https://lite-xl.com/',
      github: 'https://github.com/lite-xl/lite-xl',
      is_self_hosted: true,
      categoryNames: ['Code Editors', 'Developer Tools', 'Open Source']
    }
  ],
  'postman': [
    {
      name: 'Hoppscotch',
      slug: 'hoppscotch',
      short_description: 'Open-source API development ecosystem',
      description: 'Hoppscotch is a lightweight, web-based API development suite that helps you create requests faster with a beautiful interface.',
      website: 'https://hoppscotch.io/',
      github: 'https://github.com/hoppscotch/hoppscotch',
      is_self_hosted: true,
      categoryNames: ['API Development', 'Developer Tools', 'Open Source']
    },
    {
      name: 'Insomnia',
      slug: 'insomnia',
      short_description: 'The open-source API client for GraphQL, REST, and gRPC',
      description: 'A powerful and easy-to-use API client that helps you design, debug, and test APIs with support for GraphQL, REST, and gRPC.',
      website: 'https://insomnia.rest/',
      github: 'https://github.com/Kong/insomnia',
      is_self_hosted: true,
      categoryNames: ['API Development', 'Developer Tools', 'Open Source']
    },
    {
      name: 'Bruno',
      slug: 'bruno',
      short_description: 'Fast and Git-friendly open-source API client',
      description: 'Bruno is a fast and Git-friendly open-source API client that stores collections directly in a folder on your filesystem using a plain text markup language.',
      website: 'https://www.usebruno.com/',
      github: 'https://github.com/usebruno/bruno',
      is_self_hosted: true,
      categoryNames: ['API Development', 'Developer Tools', 'Self-Hosted']
    }
  ],
  'linear': [
    {
      name: 'Plane',
      slug: 'plane',
      short_description: 'Open-source project management tool',
      description: 'Plane is an open-source project management tool that helps you track issues, manage sprints, and collaborate with your team.',
      website: 'https://plane.so/',
      github: 'https://github.com/makeplane/plane',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Issue Tracking', 'Self-Hosted']
    },
    {
      name: 'Focalboard',
      slug: 'focalboard',
      short_description: 'Open-source alternative to Trello, Notion, and Asana',
      description: 'A project management tool that helps you organize tasks with kanban boards, tables, and calendars.',
      website: 'https://www.focalboard.com/',
      github: 'https://github.com/mattermost/focalboard',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Issue Tracking', 'Open Source']
    },
    {
      name: 'OpenProject',
      slug: 'openproject',
      short_description: 'Open-source project management software',
      description: 'A comprehensive tool for project planning, scheduling, and collaboration with support for agile and traditional methodologies.',
      website: 'https://www.openproject.org/',
      github: 'https://github.com/opf/openproject',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Issue Tracking', 'Self-Hosted']
    }
  ],
  'jira': [
    {
      name: 'Taiga',
      slug: 'taiga',
      short_description: 'Open-source project management for agile teams',
      description: 'Taiga is an open-source project management platform designed for agile teams with support for Scrum and Kanban methodologies.',
      website: 'https://taiga.io/',
      github: 'https://github.com/taigaio/taiga-back',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Issue Tracking', 'Self-Hosted']
    },
    {
      name: 'Redmine',
      slug: 'redmine',
      short_description: 'Flexible project management web application',
      description: 'A mature and feature-rich tool for tracking issues, projects, and time with support for multiple projects and flexible access control.',
      website: 'https://www.redmine.org/',
      github: 'https://github.com/redmine/redmine',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Issue Tracking', 'Self-Hosted']
    },
    {
      name: 'Leantime',
      slug: 'leantime',
      short_description: 'Strategic project management for non-project managers',
      description: 'Leantime is a strategic project management system designed for non-project managers with a focus on simplicity and lean methodology.',
      website: 'https://leantime.io/',
      github: 'https://github.com/leantime/leantime',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Issue Tracking', 'Open Source']
    }
  ],
  'firebase': [
    {
      name: 'Supabase',
      slug: 'supabase',
      short_description: 'The open-source Firebase alternative',
      description: 'Supabase is an open-source Firebase alternative that provides a Postgres database, authentication, instant APIs, and real-time subscriptions.',
      website: 'https://supabase.com/',
      github: 'https://github.com/supabase/supabase',
      is_self_hosted: true,
      categoryNames: ['Backend as a Service', 'Developer Tools', 'Self-Hosted']
    },
    {
      name: 'Appwrite',
      slug: 'appwrite',
      short_description: 'Open-source backend for web and mobile apps',
      description: 'A secure and easy-to-use backend server that provides APIs for authentication, databases, storage, and functions.',
      website: 'https://appwrite.io/',
      github: 'https://github.com/appwrite/appwrite',
      is_self_hosted: true,
      categoryNames: ['Backend as a Service', 'Developer Tools', 'Self-Hosted']
    },
    {
      name: 'PocketBase',
      slug: 'pocketbase',
      short_description: 'Open-source backend in a single file',
      description: 'PocketBase is an open-source backend consisting of embedded database, real-time subscriptions, auth management, and admin dashboard in a single file.',
      website: 'https://pocketbase.io/',
      github: 'https://github.com/pocketbase/pocketbase',
      is_self_hosted: true,
      categoryNames: ['Backend as a Service', 'Developer Tools', 'Self-Hosted']
    }
  ],
  'heroku': [
    {
      name: 'Dokku',
      slug: 'dokku',
      short_description: 'The smallest PaaS implementation you\'ve ever seen',
      description: 'Dokku is a docker-powered PaaS that helps you build and manage the lifecycle of applications using Git push deployments.',
      website: 'https://dokku.com/',
      github: 'https://github.com/dokku/dokku',
      is_self_hosted: true,
      categoryNames: ['Cloud Platform', 'Deployment', 'Self-Hosted']
    },
    {
      name: 'CapRover',
      slug: 'caprover',
      short_description: 'Easy-to-use app deployment and server manager',
      description: 'A platform that simplifies the process of deploying and managing apps on your own servers with automatic SSL and Docker support.',
      website: 'https://caprover.com/',
      github: 'https://github.com/caprover/caprover',
      is_self_hosted: true,
      categoryNames: ['Cloud Platform', 'Deployment', 'Self-Hosted']
    },
    {
      name: 'Coolify',
      slug: 'coolify',
      short_description: 'Self-hosted Heroku and Netlify alternative',
      description: 'An open-source, self-hostable alternative to Heroku and Netlify with support for multiple programming languages and automatic deployments.',
      website: 'https://coolify.io/',
      github: 'https://github.com/coollabsio/coolify',
      is_self_hosted: true,
      categoryNames: ['Cloud Platform', 'Deployment', 'Self-Hosted']
    }
  ],
  'vercel': [
    {
      name: 'Coolify',
      slug: 'coolify-vercel',
      short_description: 'Self-hosted Heroku and Netlify alternative',
      description: 'An open-source, self-hostable alternative to Vercel with support for Next.js, static sites, and automatic deployments.',
      website: 'https://coolify.io/',
      github: 'https://github.com/coollabsio/coolify',
      is_self_hosted: true,
      categoryNames: ['Hosting', 'Deployment', 'Self-Hosted']
    },
    {
      name: 'Dokku',
      slug: 'dokku-vercel',
      short_description: 'The smallest PaaS implementation',
      description: 'A simple and powerful platform for deploying and managing applications using Docker and Git push deployments.',
      website: 'https://dokku.com/',
      github: 'https://github.com/dokku/dokku',
      is_self_hosted: true,
      categoryNames: ['Hosting', 'Deployment', 'Self-Hosted']
    },
    {
      name: 'Railway',
      slug: 'railway',
      short_description: 'Infrastructure made simple',
      description: 'Railway is a deployment platform that makes it easy to deploy and run applications with automatic builds and deployments.',
      website: 'https://railway.app/',
      github: 'https://github.com/railwayapp/railway',
      is_self_hosted: false,
      categoryNames: ['Hosting', 'Deployment', 'Cloud Platform']
    }
  ],
  'netlify': [
    {
      name: 'Coolify',
      slug: 'coolify-netlify',
      short_description: 'Self-hosted Heroku and Netlify alternative',
      description: 'An open-source, self-hostable alternative to Netlify with support for static sites, serverless functions, and automatic deployments.',
      website: 'https://coolify.io/',
      github: 'https://github.com/coollabsio/coolify',
      is_self_hosted: true,
      categoryNames: ['Hosting', 'Deployment', 'Self-Hosted']
    },
    {
      name: 'Surge',
      slug: 'surge',
      short_description: 'Simple static web publishing',
      description: 'A simple command-line tool for publishing static websites with a single command.',
      website: 'https://surge.sh/',
      github: 'https://github.com/sintaxi/surge',
      is_self_hosted: false,
      categoryNames: ['Hosting', 'Deployment', 'Developer Tools']
    },
    {
      name: 'Cloudflare Pages',
      slug: 'cloudflare-pages',
      short_description: 'JAMstack platform for frontend developers',
      description: 'A free, fast, and secure way to deploy your JAMstack sites directly from your Git repository.',
      website: 'https://pages.cloudflare.com/',
      github: 'https://github.com/cloudflare/workers-sdk',
      is_self_hosted: false,
      categoryNames: ['Hosting', 'Deployment', 'Cloud Platform']
    }
  ],
  'google-analytics': [
    {
      name: 'Matomo',
      slug: 'matomo',
      short_description: 'Open-source web analytics platform',
      description: 'Matomo is a powerful, open-source web analytics platform that gives you full control over your data with privacy-focused features.',
      website: 'https://matomo.org/',
      github: 'https://github.com/matomo-org/matomo',
      is_self_hosted: true,
      categoryNames: ['Analytics', 'Privacy', 'Self-Hosted']
    },
    {
      name: 'Plausible',
      slug: 'plausible',
      short_description: 'Simple and privacy-friendly web analytics',
      description: 'A lightweight and easy-to-use analytics tool that doesn\'t use cookies and is fully compliant with GDPR, CCPA, and PECR.',
      website: 'https://plausible.io/',
      github: 'https://github.com/plausible/analytics',
      is_self_hosted: true,
      categoryNames: ['Analytics', 'Privacy', 'Self-Hosted']
    },
    {
      name: 'Umami',
      slug: 'umami',
      short_description: 'Simple, easy to use, self-hosted web analytics',
      description: 'A simple, fast, privacy-focused alternative to Google Analytics that respects user privacy and provides essential metrics.',
      website: 'https://umami.is/',
      github: 'https://github.com/umami-software/umami',
      is_self_hosted: true,
      categoryNames: ['Analytics', 'Privacy', 'Self-Hosted']
    }
  ],
  'mixpanel': [
    {
      name: 'PostHog',
      slug: 'posthog',
      short_description: 'Open-source product analytics',
      description: 'PostHog is an open-source product analytics platform with event tracking, session recording, feature flags, and A/B testing.',
      website: 'https://posthog.com/',
      github: 'https://github.com/PostHog/posthog',
      is_self_hosted: true,
      categoryNames: ['Product Analytics', 'Analytics', 'Self-Hosted']
    },
    {
      name: 'June',
      slug: 'june',
      short_description: 'Simple product analytics for B2B SaaS',
      description: 'A tool that helps you understand how users are interacting with your product with pre-built reports and analytics.',
      website: 'https://www.june.so/',
      github: 'https://github.com/june-so/june',
      is_self_hosted: false,
      categoryNames: ['Product Analytics', 'Analytics', 'Open Source']
    },
    {
      name: 'Countly',
      slug: 'countly',
      short_description: 'Product analytics for mobile and web',
      description: 'An open-source, privacy-focused product analytics platform for mobile, web, and desktop applications.',
      website: 'https://count.ly/',
      github: 'https://github.com/Countly/countly-server',
      is_self_hosted: true,
      categoryNames: ['Product Analytics', 'Analytics', 'Self-Hosted']
    }
  ],
  'amplitude': [
    {
      name: 'PostHog',
      slug: 'posthog-amplitude',
      short_description: 'Open-source product analytics',
      description: 'PostHog is an open-source product analytics platform with event tracking, session recording, feature flags, and A/B testing.',
      website: 'https://posthog.com/',
      github: 'https://github.com/PostHog/posthog',
      is_self_hosted: true,
      categoryNames: ['Product Analytics', 'Analytics', 'Self-Hosted']
    },
    {
      name: 'Matomo',
      slug: 'matomo-amplitude',
      short_description: 'Open-source web analytics platform',
      description: 'A powerful and privacy-focused alternative to Amplitude that gives you full control over your data.',
      website: 'https://matomo.org/',
      github: 'https://github.com/matomo-org/matomo',
      is_self_hosted: true,
      categoryNames: ['Product Analytics', 'Analytics', 'Self-Hosted']
    },
    {
      name: 'Metabase',
      slug: 'metabase',
      short_description: 'Open-source business intelligence tool',
      description: 'Metabase is an open-source business intelligence tool that lets you ask questions about your data and display answers in easy-to-understand formats.',
      website: 'https://www.metabase.com/',
      github: 'https://github.com/metabase/metabase',
      is_self_hosted: true,
      categoryNames: ['Product Analytics', 'Analytics', 'Self-Hosted']
    }
  ],
  'hotjar': [
    {
      name: 'PostHog',
      slug: 'posthog-hotjar',
      short_description: 'Open-source product analytics with session recording',
      description: 'PostHog includes session recording and heatmaps alongside product analytics, feature flags, and A/B testing.',
      website: 'https://posthog.com/',
      github: 'https://github.com/PostHog/posthog',
      is_self_hosted: true,
      categoryNames: ['User Behavior', 'Analytics', 'Self-Hosted']
    },
    {
      name: 'OpenReplay',
      slug: 'openreplay',
      short_description: 'Open-source session replay for developers',
      description: 'A tool that allows you to record and replay user sessions to understand how users interact with your application.',
      website: 'https://openreplay.com/',
      github: 'https://github.com/openreplay/openreplay',
      is_self_hosted: true,
      categoryNames: ['User Behavior', 'Analytics', 'Self-Hosted']
    },
    {
      name: 'Microsoft Clarity',
      slug: 'microsoft-clarity',
      short_description: 'Free behavioral analytics tool',
      description: 'A free tool from Microsoft that provides session recordings and heatmaps to understand user behavior.',
      website: 'https://clarity.microsoft.com/',
      github: 'https://github.com/nicholasyang2022/clarity',
      is_self_hosted: false,
      categoryNames: ['User Behavior', 'Analytics', 'Open Source']
    }
  ],
  'datadog': [
    {
      name: 'Grafana',
      slug: 'grafana',
      short_description: 'Open-source platform for monitoring and observability',
      description: 'Grafana is an open-source analytics and monitoring platform that works with various data sources to create dashboards and alerts.',
      website: 'https://grafana.com/',
      github: 'https://github.com/grafana/grafana',
      is_self_hosted: true,
      categoryNames: ['Monitoring', 'Observability', 'Self-Hosted']
    },
    {
      name: 'Prometheus',
      slug: 'prometheus',
      short_description: 'Open-source monitoring and alerting toolkit',
      description: 'A popular tool for collecting and storing time-series data with a powerful query language and alerting capabilities.',
      website: 'https://prometheus.io/',
      github: 'https://github.com/prometheus/prometheus',
      is_self_hosted: true,
      categoryNames: ['Monitoring', 'Observability', 'Self-Hosted']
    },
    {
      name: 'Zabbix',
      slug: 'zabbix',
      short_description: 'Enterprise-class open-source monitoring',
      description: 'A mature, enterprise-grade monitoring solution for networks, servers, cloud services, and applications.',
      website: 'https://www.zabbix.com/',
      github: 'https://github.com/zabbix/zabbix',
      is_self_hosted: true,
      categoryNames: ['Monitoring', 'Observability', 'Self-Hosted']
    }
  ],
  'dropbox': [
    {
      name: 'Nextcloud',
      slug: 'nextcloud',
      short_description: 'Open-source content collaboration platform',
      description: 'Nextcloud is a self-hosted productivity platform that keeps you in control with file sync, share, collaboration, and communication features.',
      website: 'https://nextcloud.com/',
      github: 'https://github.com/nextcloud/server',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'Cloud Storage', 'Self-Hosted']
    },
    {
      name: 'OwnCloud',
      slug: 'owncloud',
      short_description: 'Open-source file sync and share',
      description: 'A secure and reliable platform for storing and sharing your files on your own server with enterprise features.',
      website: 'https://owncloud.com/',
      github: 'https://github.com/owncloud/core',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'Cloud Storage', 'Self-Hosted']
    },
    {
      name: 'Seafile',
      slug: 'seafile',
      short_description: 'High-performance file sync and share',
      description: 'Seafile is an open-source file hosting platform with high performance, reliability, and enterprise-grade security.',
      website: 'https://www.seafile.com/',
      github: 'https://github.com/haiwen/seafile',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'Cloud Storage', 'Self-Hosted']
    }
  ],
  'google-drive': [
    {
      name: 'Nextcloud',
      slug: 'nextcloud-gdrive',
      short_description: 'Open-source content collaboration platform',
      description: 'Nextcloud provides file sync, share, and collaboration features with support for office documents and team collaboration.',
      website: 'https://nextcloud.com/',
      github: 'https://github.com/nextcloud/server',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'Cloud Storage', 'Self-Hosted']
    },
    {
      name: 'Pydio Cells',
      slug: 'pydio-cells',
      short_description: 'Open-source file sharing and management',
      description: 'A modern and secure platform for managing and sharing your files with team collaboration features.',
      website: 'https://pydio.com/',
      github: 'https://github.com/pydio/cells',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'Cloud Storage', 'Self-Hosted']
    },
    {
      name: 'FileBrowser',
      slug: 'filebrowser',
      short_description: 'Web file browser and manager',
      description: 'A web file browser that provides a clean interface for managing files with sharing and user management features.',
      website: 'https://filebrowser.org/',
      github: 'https://github.com/filebrowser/filebrowser',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'Cloud Storage', 'Self-Hosted']
    }
  ],
  'onedrive': [
    {
      name: 'Nextcloud',
      slug: 'nextcloud-onedrive',
      short_description: 'Open-source content collaboration platform',
      description: 'Nextcloud is a self-hosted platform that provides file sync and share features similar to OneDrive with privacy and control.',
      website: 'https://nextcloud.com/',
      github: 'https://github.com/nextcloud/server',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'File Sync', 'Self-Hosted']
    },
    {
      name: 'OwnCloud',
      slug: 'owncloud-onedrive',
      short_description: 'Open-source file sync and share',
      description: 'A secure and reliable platform for storing and sharing your files on your own server.',
      website: 'https://owncloud.com/',
      github: 'https://github.com/owncloud/core',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'File Sync', 'Self-Hosted']
    },
    {
      name: 'Syncthing',
      slug: 'syncthing',
      short_description: 'Continuous file synchronization',
      description: 'Syncthing is a continuous file synchronization program that synchronizes files between two or more computers in real time.',
      website: 'https://syncthing.net/',
      github: 'https://github.com/syncthing/syncthing',
      is_self_hosted: true,
      categoryNames: ['File Storage', 'File Sync', 'Self-Hosted']
    }
  ],
  'microsoft-office': [
    {
      name: 'LibreOffice',
      slug: 'libreoffice',
      short_description: 'Open-source office productivity suite',
      description: 'LibreOffice is a free and powerful office suite with applications for word processing, spreadsheets, presentations, and more.',
      website: 'https://www.libreoffice.org/',
      github: 'https://github.com/LibreOffice/core',
      is_self_hosted: true,
      categoryNames: ['Office Suite', 'Documents', 'Open Source']
    },
    {
      name: 'OnlyOffice',
      slug: 'onlyoffice',
      short_description: 'Open-source online office suite',
      description: 'A comprehensive office suite that provides online editors for documents, spreadsheets, and presentations with real-time collaboration.',
      website: 'https://www.onlyoffice.com/',
      github: 'https://github.com/ONLYOFFICE/DocumentServer',
      is_self_hosted: true,
      categoryNames: ['Office Suite', 'Documents', 'Self-Hosted']
    },
    {
      name: 'Collabora Office',
      slug: 'collabora-office',
      short_description: 'Enterprise-ready LibreOffice online',
      description: 'Collabora Online is a powerful LibreOffice-based online office suite with support for all major document formats.',
      website: 'https://www.collaboraoffice.com/',
      github: 'https://github.com/CollaboraOnline/online',
      is_self_hosted: true,
      categoryNames: ['Office Suite', 'Documents', 'Self-Hosted']
    }
  ],
  'google-docs': [
    {
      name: 'CryptPad',
      slug: 'cryptpad',
      short_description: 'End-to-end encrypted collaboration suite',
      description: 'CryptPad is a privacy-first collaborative office suite with end-to-end encryption for documents, spreadsheets, and presentations.',
      website: 'https://cryptpad.fr/',
      github: 'https://github.com/cryptpad/cryptpad',
      is_self_hosted: true,
      categoryNames: ['Documents', 'Collaboration', 'Privacy']
    },
    {
      name: 'Etherpad',
      slug: 'etherpad',
      short_description: 'Open-source real-time collaborative editor',
      description: 'A lightweight and easy-to-use tool for collaborating on text documents in real-time with multiple users.',
      website: 'https://etherpad.org/',
      github: 'https://github.com/ether/etherpad-lite',
      is_self_hosted: true,
      categoryNames: ['Documents', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'OnlyOffice',
      slug: 'onlyoffice-docs',
      short_description: 'Open-source online office suite',
      description: 'OnlyOffice provides collaborative document editing with full Microsoft Office compatibility.',
      website: 'https://www.onlyoffice.com/',
      github: 'https://github.com/ONLYOFFICE/DocumentServer',
      is_self_hosted: true,
      categoryNames: ['Documents', 'Collaboration', 'Self-Hosted']
    }
  ],
  'google-sheets': [
    {
      name: 'Grist',
      slug: 'grist',
      short_description: 'Open-source relational spreadsheet',
      description: 'Grist combines the flexibility of a spreadsheet with the power of a database, allowing you to organize and analyze data effectively.',
      website: 'https://www.getgrist.com/',
      github: 'https://github.com/gristlabs/grist-core',
      is_self_hosted: true,
      categoryNames: ['Spreadsheets', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'Luckysheet',
      slug: 'luckysheet',
      short_description: 'Online spreadsheet with Excel-like features',
      description: 'A powerful and feature-rich online spreadsheet that supports formulas, charts, pivot tables, and real-time collaboration.',
      website: 'https://github.com/dream-num/Luckysheet',
      github: 'https://github.com/dream-num/Luckysheet',
      is_self_hosted: true,
      categoryNames: ['Spreadsheets', 'Collaboration', 'Open Source']
    },
    {
      name: 'NocoDB',
      slug: 'nocodb',
      short_description: 'Open-source Airtable alternative',
      description: 'NocoDB turns any database into a smart spreadsheet with a beautiful interface and powerful features.',
      website: 'https://nocodb.com/',
      github: 'https://github.com/nocodb/nocodb',
      is_self_hosted: true,
      categoryNames: ['Spreadsheets', 'Collaboration', 'Self-Hosted']
    }
  ]
};

async function seedAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // First, ensure all categories exist
    console.log('\n📁 Creating categories...');
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    
    for (const catDef of categoryDefinitions) {
      const category = await Category.findOneAndUpdate(
        { slug: catDef.slug },
        { name: catDef.name, slug: catDef.slug },
        { upsert: true, new: true }
      );
      categoryMap[catDef.name] = category._id;
      console.log(`   ✅ Category: ${catDef.name}`);
    }

    // Get proprietary software (20-40)
    const proprietaryList = [
      'loom', 'sublime-text', 'postman', 'linear', 'jira',
      'firebase', 'heroku', 'vercel', 'netlify', 'google-analytics',
      'mixpanel', 'amplitude', 'hotjar', 'datadog', 'dropbox',
      'google-drive', 'onedrive', 'microsoft-office', 'google-docs', 'google-sheets'
    ];

    for (const propSlug of proprietaryList) {
      const proprietary = await ProprietarySoftware.findOne({ slug: propSlug });
      
      if (!proprietary) {
        console.log(`\n⚠️  Proprietary software not found: ${propSlug}`);
        continue;
      }

      console.log(`\n🔍 Adding alternatives for ${proprietary.name}...`);
      
      const altsToAdd = alternativesData[propSlug] || [];
      
      for (const altData of altsToAdd) {
        try {
          // Get category IDs for this alternative
          const categoryIds = altData.categoryNames
            .map(name => categoryMap[name])
            .filter(id => id !== undefined);

          const alt = await Alternative.findOneAndUpdate(
            { slug: altData.slug },
            { 
              name: altData.name,
              slug: altData.slug,
              description: altData.description,
              short_description: altData.short_description,
              website: altData.website,
              github: altData.github,
              is_self_hosted: altData.is_self_hosted,
              categories: categoryIds,
              approved: true,
              $addToSet: { alternative_to: proprietary._id },
              updated_at: new Date() 
            },
            { upsert: true, new: true }
          );
          console.log(`   ✅ Added/Updated: ${alt.name} (${altData.categoryNames.join(', ')})`);
        } catch (err: any) {
          console.error(`   ❌ Error adding ${altData.name}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Finished adding alternatives for proprietary software 20-40!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
