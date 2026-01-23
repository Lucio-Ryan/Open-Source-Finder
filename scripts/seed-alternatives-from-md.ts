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
  backlink_verified: { type: Boolean, default: false },
  backlink_url: { type: String, default: null },
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

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Category mapping based on alternative type/description
interface CategoryMapping {
  keywords: string[];
  categories: string[];
}

const categoryMappings: CategoryMapping[] = [
  // Communication & Chat
  { keywords: ['slack', 'teams', 'chat', 'messaging', 'team communication', 'discord'], categories: ['team-chat-messaging', 'communication-collaboration', 'business-software'] },
  
  // Project Management
  { keywords: ['trello', 'asana', 'kanban', 'project management', 'agile', 'monday', 'linear'], categories: ['project-management', 'task-management', 'productivity'] },
  
  // Note-taking & Knowledge
  { keywords: ['notion', 'evernote', 'note', 'knowledge', 'wiki', 'documentation'], categories: ['note-taking', 'knowledge-management', 'productivity'] },
  
  // Analytics
  { keywords: ['analytics', 'google analytics', 'tracking', 'metrics'], categories: ['analytics-platforms', 'data-analytics', 'business-intelligence'] },
  
  // Design & Creative
  { keywords: ['photoshop', 'illustrator', 'design', 'image editing', 'graphic', 'photo'], categories: ['graphic-design', 'design-creative', 'photo-editing'] },
  { keywords: ['figma', 'ui', 'ux', 'prototyping', 'wireframe'], categories: ['ui-ux-design', 'prototyping-wireframing', 'design-creative'] },
  { keywords: ['video edit', 'davinci', 'premiere', 'video'], categories: ['video-audio', 'content-media', 'design-creative'] },
  
  // Issue Tracking
  { keywords: ['jira', 'issue tracking', 'bug', 'ticket'], categories: ['project-management', 'developer-tools', 'testing-qa'] },
  
  // Video Conferencing
  { keywords: ['zoom', 'video conferencing', 'meeting', 'call'], categories: ['video-conferencing', 'communication-collaboration', 'business-software'] },
  
  // CMS
  { keywords: ['wordpress', 'cms', 'content management', 'headless'], categories: ['content-management-cms', 'blogging-platforms', 'content-media'] },
  
  // Code Repository
  { keywords: ['github', 'bitbucket', 'git', 'repository', 'source code'], categories: ['version-control', 'developer-tools', 'ci-cd'] },
  
  // Database
  { keywords: ['mongodb', 'mysql', 'database', 'sql', 'redis', 'postgresql'], categories: ['database-storage', 'relational-databases', 'nosql-databases'] },
  
  // CI/CD
  { keywords: ['jenkins', 'ci/cd', 'continuous integration', 'deployment', 'github actions'], categories: ['ci-cd', 'developer-tools', 'devops-infrastructure'] },
  
  // Email Marketing
  { keywords: ['mailchimp', 'email marketing', 'newsletter'], categories: ['email-newsletters', 'marketing-customer-engagement', 'business-software'] },
  
  // Password Management
  { keywords: ['1password', 'lastpass', 'password', 'vault'], categories: ['password-management', 'security-privacy', 'authentication-identity'] },
  
  // Documentation & Wiki
  { keywords: ['confluence', 'wiki', 'documentation'], categories: ['knowledge-management', 'documentation', 'document-collaboration'] },
  
  // Container & Virtualization
  { keywords: ['docker', 'kubernetes', 'container', 'virtualization', 'k8s', 'k3s'], categories: ['containerization', 'orchestration', 'devops-infrastructure'] },
  
  // File Storage
  { keywords: ['dropbox', 'google drive', 'file storage', 'sync', 'cloud storage'], categories: ['file-sharing', 'object-storage', 'backup-recovery'] },
  
  // Calendar & Scheduling
  { keywords: ['calendly', 'calendar', 'scheduling', 'booking', 'doodle'], categories: ['calendar-scheduling', 'productivity', 'business-software'] },
  
  // Time Tracking
  { keywords: ['toggl', 'harvest', 'time tracking', 'timesheet'], categories: ['time-tracking', 'productivity', 'human-resources-hr'] },
  
  // Monitoring
  { keywords: ['datadog', 'monitoring', 'observability', 'logging', 'metrics', 'uptime', 'apm'], categories: ['monitoring-observability', 'devops-infrastructure', 'analytics-platforms'] },
  
  // API
  { keywords: ['postman', 'api', 'rest', 'graphql'], categories: ['api-development', 'developer-tools', 'testing-qa'] },
  
  // CRM
  { keywords: ['salesforce', 'hubspot', 'crm', 'customer relationship'], categories: ['crm-sales', 'business-software', 'marketing-customer-engagement'] },
  
  // Automation
  { keywords: ['zapier', 'automation', 'workflow', 'integration'], categories: ['automation', 'productivity', 'business-software'] },
  
  // Forms & Surveys
  { keywords: ['typeform', 'jotform', 'form', 'survey'], categories: ['forms-surveys', 'marketing-customer-engagement', 'business-software'] },
  
  // Low-Code / Internal Tools
  { keywords: ['retool', 'low-code', 'internal tools', 'admin panel'], categories: ['developer-tools', 'business-software', 'automation'] },
  
  // Airtable / No-Code Database
  { keywords: ['airtable', 'no-code database', 'spreadsheet database'], categories: ['database-management', 'productivity', 'business-software'] },

  // E-commerce
  { keywords: ['shopify', 'e-commerce', 'ecommerce', 'store', 'woocommerce'], categories: ['e-commerce', 'online-stores', 'business-software'] },

  // Learning Management
  { keywords: ['teachable', 'lms', 'learning', 'course', 'education'], categories: ['education-learning', 'learning-management-lms', 'online-courses'] },

  // Customer Support
  { keywords: ['zendesk', 'intercom', 'helpdesk', 'support', 'ticketing'], categories: ['customer-support-success', 'business-software', 'communication-collaboration'] },

  // Search
  { keywords: ['algolia', 'elasticsearch', 'search', 'indexing'], categories: ['developer-tools', 'database-storage', 'api-development'] },

  // Backend as a Service
  { keywords: ['firebase', 'backend', 'baas', 'serverless'], categories: ['serverless', 'cloud-platforms', 'developer-tools'] },

  // Feature Flags
  { keywords: ['launchdarkly', 'feature flag', 'a/b test', 'experiment'], categories: ['developer-tools', 'testing-qa', 'devops-infrastructure'] },

  // Notifications
  { keywords: ['onesignal', 'notification', 'push'], categories: ['developer-tools', 'marketing-customer-engagement', 'communication-collaboration'] },

  // Status Page
  { keywords: ['statuspage', 'status', 'uptime'], categories: ['monitoring-observability', 'devops-infrastructure', 'customer-support-success'] },

  // Secrets Management
  { keywords: ['vault', 'secret', 'credential'], categories: ['security-privacy', 'devops-infrastructure', 'encryption'] },

  // Document Signing
  { keywords: ['docusign', 'signature', 'signing'], categories: ['business-software', 'productivity', 'automation'] },

  // Invoicing
  { keywords: ['freshbooks', 'invoice', 'billing'], categories: ['finance-accounting', 'business-software', 'e-commerce'] },

  // Media Server
  { keywords: ['plex', 'media server', 'streaming'], categories: ['video-audio', 'content-media', 'file-sharing'] },

  // URL Shortener
  { keywords: ['bitly', 'url shortener', 'link'], categories: ['marketing-customer-engagement', 'developer-tools', 'analytics-platforms'] },

  // Bookmark Manager
  { keywords: ['raindrop', 'pocket', 'bookmark', 'read-later'], categories: ['bookmarks-reading', 'productivity', 'note-taking'] },

  // Diagram/Whiteboard
  { keywords: ['miro', 'lucidchart', 'whiteboard', 'diagram', 'drawing'], categories: ['design-creative', 'productivity', 'document-collaboration'] },

  // Personal Finance
  { keywords: ['mint', 'ynab', 'budget', 'finance'], categories: ['finance-budgeting', 'productivity', 'business-software'] },

  // RSS Reader
  { keywords: ['feedly', 'rss', 'feed'], categories: ['bookmarks-reading', 'content-media', 'productivity'] },

  // Home Automation
  { keywords: ['smartthings', 'home automation', 'iot', 'smart home'], categories: ['home-automation', 'developer-tools', 'productivity'] },

  // Photo Management
  { keywords: ['google photos', 'photo', 'gallery', 'image'], categories: ['photo-editing', 'digital-asset-management', 'file-sharing'] },

  // Static Site Generator
  { keywords: ['static site', 'hugo', 'jekyll'], categories: ['content-management-cms', 'developer-tools', 'blogging-platforms'] },

  // Authentication
  { keywords: ['auth0', 'authentication', 'identity', 'sso', 'oauth'], categories: ['authentication-identity', 'security-privacy', 'developer-tools'] },

  // Podcast
  { keywords: ['anchor', 'podcast'], categories: ['podcasting', 'content-media', 'video-audio'] },

  // Comments
  { keywords: ['disqus', 'comment'], categories: ['social-media', 'content-media', 'developer-tools'] },

  // ERP
  { keywords: ['sap', 'erp'], categories: ['erp-operations', 'business-software', 'finance-accounting'] },

  // Social Network
  { keywords: ['twitter', 'social', 'mastodon', 'microblog'], categories: ['social-media', 'communication-collaboration', 'content-media'] },

  // Video Platform
  { keywords: ['youtube', 'video platform', 'peertube'], categories: ['video-audio', 'content-media', 'social-media'] },

  // Link in Bio
  { keywords: ['linktree', 'link in bio', 'bio'], categories: ['social-media', 'marketing-customer-engagement', 'productivity'] },

  // Screen Recording
  { keywords: ['loom', 'screen record', 'obs'], categories: ['screen-recording', 'video-audio', 'content-media'] },

  // AI/ML Tools
  { keywords: ['openai', 'chatgpt', 'llm', 'language model', 'ai', 'machine learning'], categories: ['ai-machine-learning', 'developer-tools', 'automation'] },

  // Vector Database
  { keywords: ['pinecone', 'vector', 'embedding', 'similarity search'], categories: ['database-storage', 'ai-machine-learning', 'developer-tools'] },

  // Game Development
  { keywords: ['unity', 'unreal', 'game engine', 'game development'], categories: ['game-development', 'developer-tools', 'design-creative'] },

  // Terminal/Shell
  { keywords: ['iterm', 'terminal', 'shell', 'command line', 'cli'], categories: ['developer-tools', 'productivity', 'command-line-tools'] },

  // Code Editor
  { keywords: ['vs code', 'vscode', 'vim', 'editor', 'ide'], categories: ['developer-tools', 'productivity', 'text-editors'] },

  // Music Production
  { keywords: ['ableton', 'audio', 'music', 'daw', 'production'], categories: ['video-audio', 'content-media', 'design-creative'] },

  // 3D Modeling
  { keywords: ['maya', 'cad', '3d modeling', 'blender', 'autocad'], categories: ['design-creative', '3d-modeling', 'developer-tools'] },

  // VPN
  { keywords: ['vpn', 'wireguard', 'openvpn', 'tunnel'], categories: ['networking', 'security-privacy', 'devops-infrastructure'] },

  // Backup
  { keywords: ['backup', 'backblaze', 'restore', 'archive'], categories: ['backup-recovery', 'devops-infrastructure', 'file-sharing'] },

  // DNS
  { keywords: ['dns', 'adblock', 'ad-blocking', 'pihole'], categories: ['networking', 'security-privacy', 'devops-infrastructure'] },

  // Reverse Proxy
  { keywords: ['nginx', 'reverse proxy', 'load balancer', 'proxy'], categories: ['networking', 'devops-infrastructure', 'web-servers'] },

  // Email Server
  { keywords: ['email server', 'mail server', 'smtp', 'imap'], categories: ['communication-collaboration', 'devops-infrastructure', 'business-software'] },

  // Dashboard
  { keywords: ['dashboard', 'homepage', 'launcher', 'startpage'], categories: ['productivity', 'developer-tools', 'business-software'] },

  // Screenshot Tool
  { keywords: ['screenshot', 'screen capture', 'snagit'], categories: ['productivity', 'design-creative', 'developer-tools'] },

  // API Gateway
  { keywords: ['api gateway', 'gateway', 'api management'], categories: ['api-development', 'developer-tools', 'devops-infrastructure'] },

  // Queue/Messaging
  { keywords: ['queue', 'message broker', 'kafka', 'rabbitmq', 'sqs'], categories: ['developer-tools', 'devops-infrastructure', 'backend-services'] },

  // Scheduled Jobs
  { keywords: ['scheduler', 'cron', 'workflow', 'job scheduling', 'airflow'], categories: ['automation', 'devops-infrastructure', 'developer-tools'] },

  // Serverless
  { keywords: ['lambda', 'serverless', 'faas', 'functions'], categories: ['serverless', 'cloud-platforms', 'developer-tools'] },

  // Infrastructure as Code
  { keywords: ['terraform', 'infrastructure', 'iac', 'pulumi'], categories: ['devops-infrastructure', 'developer-tools', 'cloud-platforms'] },

  // Service Mesh
  { keywords: ['istio', 'service mesh', 'linkerd', 'consul'], categories: ['networking', 'devops-infrastructure', 'containerization'] },

  // Incident Management
  { keywords: ['pagerduty', 'incident', 'on-call', 'alerting'], categories: ['monitoring-observability', 'devops-infrastructure', 'business-software'] },

  // Business Intelligence
  { keywords: ['tableau', 'bi', 'business intelligence', 'visualization', 'dashboard'], categories: ['business-intelligence', 'data-analytics', 'analytics-platforms'] },

  // Web Scraping
  { keywords: ['scraping', 'crawler', 'web scraping', 'selenium', 'puppeteer'], categories: ['developer-tools', 'automation', 'data-analytics'] },

  // PDF Generation
  { keywords: ['pdf', 'document', 'report generation'], categories: ['developer-tools', 'automation', 'business-software'] },

  // Data Pipeline
  { keywords: ['etl', 'data pipeline', 'fivetran', 'data integration'], categories: ['data-analytics', 'developer-tools', 'automation'] },

  // Data Warehouse
  { keywords: ['snowflake', 'data warehouse', 'olap', 'analytics database'], categories: ['database-storage', 'data-analytics', 'business-intelligence'] },

  // Testing Framework
  { keywords: ['cypress', 'testing', 'test framework', 'e2e', 'end-to-end'], categories: ['testing-qa', 'developer-tools', 'automation'] },

  // Load Testing
  { keywords: ['load testing', 'performance testing', 'stress test', 'benchmark'], categories: ['testing-qa', 'developer-tools', 'devops-infrastructure'] },

  // Mocking
  { keywords: ['mock', 'api mock', 'stub', 'fake api'], categories: ['testing-qa', 'developer-tools', 'api-development'] },

  // API Documentation
  { keywords: ['api doc', 'swagger', 'openapi', 'gitbook', 'readme'], categories: ['documentation', 'developer-tools', 'api-development'] },

  // Design System
  { keywords: ['storybook', 'design system', 'component library', 'ui kit'], categories: ['ui-ux-design', 'developer-tools', 'design-creative'] },

  // Form/Validation
  { keywords: ['formik', 'form', 'validation', 'schema'], categories: ['developer-tools', 'frontend-frameworks', 'productivity'] },

  // State Management
  { keywords: ['redux', 'state management', 'store', 'mobx'], categories: ['developer-tools', 'frontend-frameworks', 'productivity'] },

  // CSS Framework
  { keywords: ['tailwind', 'css', 'bootstrap', 'styling'], categories: ['frontend-frameworks', 'developer-tools', 'ui-ux-design'] },

  // Component Library
  { keywords: ['material ui', 'component', 'ui library', 'react components'], categories: ['frontend-frameworks', 'developer-tools', 'ui-ux-design'] },

  // Animation
  { keywords: ['animation', 'framer motion', 'gsap', 'motion'], categories: ['frontend-frameworks', 'design-creative', 'developer-tools'] },

  // Charts
  { keywords: ['chart', 'd3', 'graph', 'visualization', 'plotly'], categories: ['data-analytics', 'developer-tools', 'business-intelligence'] },

  // Tables
  { keywords: ['table', 'grid', 'data grid', 'ag grid'], categories: ['developer-tools', 'frontend-frameworks', 'productivity'] },

  // Rich Text Editor
  { keywords: ['editor', 'wysiwyg', 'rich text', 'tinymce'], categories: ['developer-tools', 'content-management-cms', 'productivity'] },

  // Markdown
  { keywords: ['markdown', 'md', 'typora'], categories: ['developer-tools', 'note-taking', 'productivity'] },

  // Git GUI
  { keywords: ['gitkraken', 'git gui', 'git client', 'sourcetree'], categories: ['version-control', 'developer-tools', 'productivity'] },

  // Database GUI
  { keywords: ['tableplus', 'database gui', 'sql client', 'dbeaver'], categories: ['database-management', 'developer-tools', 'productivity'] },

  // Docker GUI
  { keywords: ['docker gui', 'container gui', 'portainer'], categories: ['containerization', 'devops-infrastructure', 'developer-tools'] },

  // Kubernetes GUI
  { keywords: ['lens', 'kubernetes gui', 'k8s gui', 'k9s'], categories: ['orchestration', 'devops-infrastructure', 'developer-tools'] },

  // Security Scanner
  { keywords: ['snyk', 'security scan', 'vulnerability', 'sast'], categories: ['security-privacy', 'developer-tools', 'devops-infrastructure'] },

  // Localization
  { keywords: ['lokalise', 'localization', 'i18n', 'translation'], categories: ['developer-tools', 'productivity', 'business-software'] },

  // Email Testing
  { keywords: ['mailtrap', 'email testing', 'smtp testing'], categories: ['developer-tools', 'testing-qa', 'email-newsletters'] },

  // Payment
  { keywords: ['stripe', 'payment', 'billing', 'checkout'], categories: ['e-commerce', 'business-software', 'finance-accounting'] },

  // Web Analytics Additional
  { keywords: ['fullstory', 'session replay', 'user recording', 'heatmap'], categories: ['analytics-platforms', 'marketing-customer-engagement', 'business-software'] },

  // Feedback
  { keywords: ['canny', 'feedback', 'feature request', 'roadmap'], categories: ['customer-support-success', 'business-software', 'productivity'] },

  // Video Platform
  { keywords: ['twitch', 'streaming', 'live stream', 'broadcast'], categories: ['video-audio', 'content-media', 'social-media'] },

  // Workflow
  { keywords: ['airflow', 'orchestration', 'data workflow', 'pipeline'], categories: ['automation', 'data-analytics', 'devops-infrastructure'] },

  // CLI Framework
  { keywords: ['cli', 'command line', 'terminal app', 'tui'], categories: ['developer-tools', 'command-line-tools', 'productivity'] },

  // Browser
  { keywords: ['chrome', 'browser', 'web browser', 'firefox'], categories: ['productivity', 'developer-tools', 'security-privacy'] },

  // Mobile Apps
  { keywords: ['android', 'mobile app', 'ios app', 'smartphone'], categories: ['productivity', 'communication-collaboration', 'security-privacy'] },

  // Passkey/Passwordless Auth
  { keywords: ['passkey', 'passwordless', 'webauthn', 'magic link'], categories: ['authentication-identity', 'security-privacy', 'developer-tools'] },

  // Resume Builder
  { keywords: ['resume', 'cv builder', 'curriculum'], categories: ['productivity', 'business-software', 'design-creative'] },

  // Inventory Management
  { keywords: ['inventory', 'parts', 'stock', 'warehouse'], categories: ['business-software', 'erp-operations', 'productivity'] },

  // Recipe Management
  { keywords: ['recipe', 'cooking', 'meal plan', 'grocery'], categories: ['productivity', 'home-automation', 'business-software'] },

  // Fleet/GPS Tracking
  { keywords: ['gps', 'fleet', 'tracking', 'vehicle'], categories: ['business-software', 'productivity', 'maps-navigation'] },

  // Digital Signage
  { keywords: ['signage', 'display', 'screen', 'kiosk'], categories: ['content-media', 'marketing-customer-engagement', 'business-software'] },

  // Network Monitoring
  { keywords: ['snmp', 'network monitoring', 'nagios', 'librenms'], categories: ['monitoring-observability', 'networking', 'devops-infrastructure'] },

  // Spreadsheet
  { keywords: ['spreadsheet', 'excel', 'sheets', 'calc'], categories: ['productivity', 'business-software', 'data-analytics'] },

  // Office Suite
  { keywords: ['office', 'word processor', 'libreoffice', 'onlyoffice'], categories: ['productivity', 'business-software', 'document-collaboration'] },

  // Presentation
  { keywords: ['presentation', 'slides', 'powerpoint', 'keynote'], categories: ['productivity', 'design-creative', 'business-software'] },

  // Mind Mapping
  { keywords: ['mind map', 'brainstorm', 'concept map'], categories: ['productivity', 'note-taking', 'design-creative'] },

  // Remote Desktop
  { keywords: ['remote desktop', 'teamviewer', 'vnc', 'rdp'], categories: ['productivity', 'devops-infrastructure', 'business-software'] },

  // File Transfer
  { keywords: ['file transfer', 'file share', 'wetransfer', 'send files'], categories: ['file-sharing', 'productivity', 'security-privacy'] },

  // QR/Barcode
  { keywords: ['qr code', 'barcode', 'scan'], categories: ['developer-tools', 'productivity', 'business-software'] },

  // CalDAV/CardDAV
  { keywords: ['caldav', 'carddav', 'calendar server', 'contacts server'], categories: ['calendar-scheduling', 'productivity', 'communication-collaboration'] },

  // CRM Personal
  { keywords: ['personal crm', 'relationship', 'contact manager'], categories: ['crm-sales', 'productivity', 'communication-collaboration'] },

  // Speed Test
  { keywords: ['speed test', 'bandwidth', 'network speed'], categories: ['networking', 'developer-tools', 'productivity'] },

  // Pastebin
  { keywords: ['pastebin', 'paste', 'code snippet', 'gist'], categories: ['developer-tools', 'productivity', 'note-taking'] },

  // Changelog
  { keywords: ['changelog', 'release note', 'update log'], categories: ['developer-tools', 'documentation', 'marketing-customer-engagement'] },

  // SSL/Certificate
  { keywords: ['ssl', 'certificate', 'certbot', 'acme', 'letsencrypt'], categories: ['security-privacy', 'devops-infrastructure', 'networking'] },

  // Firewall
  { keywords: ['firewall', 'pfsense', 'opnsense', 'iptables'], categories: ['networking', 'security-privacy', 'devops-infrastructure'] },

  // LDAP/Identity
  { keywords: ['ldap', 'active directory', 'identity management', 'directory'], categories: ['authentication-identity', 'security-privacy', 'devops-infrastructure'] },

  // Time Series Database
  { keywords: ['time series', 'timescaledb', 'influxdb', 'victoriametrics'], categories: ['database-storage', 'monitoring-observability', 'data-analytics'] },

  // Graph Database
  { keywords: ['graph database', 'neo4j', 'dgraph', 'knowledge graph'], categories: ['database-storage', 'data-analytics', 'developer-tools'] },

  // Object Storage
  { keywords: ['object storage', 's3', 'minio', 'blob storage'], categories: ['object-storage', 'devops-infrastructure', 'file-sharing'] },

  // Cache
  { keywords: ['cache', 'memcached', 'hazelcast', 'in-memory'], categories: ['database-storage', 'developer-tools', 'devops-infrastructure'] },

  // Streaming Platform
  { keywords: ['redpanda', 'kafka', 'event streaming', 'pub/sub'], categories: ['developer-tools', 'devops-infrastructure', 'data-analytics'] },

  // Web Server
  { keywords: ['web server', 'litespeed', 'apache', 'http server'], categories: ['web-servers', 'devops-infrastructure', 'networking'] },

  // Tunneling
  { keywords: ['tunnel', 'ngrok', 'expose', 'localhost'], categories: ['developer-tools', 'networking', 'devops-infrastructure'] },

  // Torrent
  { keywords: ['torrent', 'bittorrent', 'p2p', 'download'], categories: ['file-sharing', 'productivity', 'content-media'] },

  // Maps/Navigation
  { keywords: ['maps', 'navigation', 'openstreetmap', 'gps'], categories: ['maps-navigation', 'productivity', 'business-software'] },
];

// All alternatives from the markdown file - COMPLETE LIST
const alternatives = [
  // ============ COMMUNICATION & CHAT ============
  // Alternative to Slack
  {
    name: 'Mattermost',
    website: 'https://mattermost.com',
    github: 'https://github.com/mattermost/mattermost-server',
    short_description: 'Enterprise-grade messaging platform for secure team communication',
    long_description: 'Mattermost is an open-source, enterprise-grade messaging platform that provides secure team communication with features like channels, direct messaging, video calls, and extensive integrations. It offers full data ownership and can be self-hosted on your infrastructure.',
    alternative_to: 'Slack',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Rocket.Chat',
    website: 'https://rocket.chat',
    github: 'https://github.com/RocketChat/Rocket.Chat',
    short_description: 'Feature-rich team communication platform with omnichannel support',
    long_description: 'Rocket.Chat is a comprehensive team collaboration platform offering real-time messaging, video conferencing, file sharing, and omnichannel customer support capabilities. It supports multiple deployment options including self-hosted on-premises.',
    alternative_to: 'Slack',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Zulip',
    website: 'https://zulip.org',
    github: 'https://github.com/zulip/zulip',
    short_description: 'Threaded team chat with powerful organization features',
    long_description: 'Zulip is a unique team chat application with threaded conversations that make it easy to follow discussions across multiple topics. It offers real-time messaging, video calls, and extensive integration capabilities while remaining fully self-hostable.',
    alternative_to: 'Slack',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Alternative to Microsoft Teams
  {
    name: 'Element',
    website: 'https://element.io',
    github: 'https://github.com/vector-im/element-web',
    short_description: 'Secure, decentralized messaging built on the Matrix protocol',
    long_description: 'Element is a secure, decentralized messaging application built on the open Matrix protocol. It offers end-to-end encryption, voice/video calls, and room-based communication. Users can self-host their own Matrix server for complete data control.',
    alternative_to: 'Microsoft Teams',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Project Management - Alternative to Trello
  {
    name: 'Focalboard',
    website: 'https://www.focalboard.com',
    github: 'https://github.com/mattermost/focalboard',
    short_description: 'Open-source project management with Kanban and Table views',
    long_description: 'Focalboard is an open-source, self-hosted project management tool that offers Kanban boards, table views, and customizable templates. Developed by Mattermost, it provides seamless integration with existing workflows and complete data ownership.',
    alternative_to: 'Trello',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Taiga',
    website: 'https://taiga.io',
    github: 'https://github.com/taigaio/taiga-back',
    short_description: 'Agile project management for software development teams',
    long_description: 'Taiga is an agile project management platform designed specifically for software development teams. It supports Scrum and Kanban methodologies with features including backlogs, sprints, user stories, and burndown charts while remaining fully self-hostable.',
    alternative_to: 'Trello',
    is_self_hosted: true,
    license: 'MPL 2.0'
  },
  {
    name: 'Wekan',
    website: 'https://wekan.github.io',
    github: 'https://github.com/wekan/wekan',
    short_description: 'Trello-like Kanban board with full self-hosting capabilities',
    long_description: 'Wekan is an open-source Kanban board application that provides a Trello-like experience with full self-hosting support. It features drag-and-drop cards, lists, checklists, and real-time collaboration while keeping all data on your own server.',
    alternative_to: 'Trello',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Alternative to Asana
  {
    name: 'OpenProject',
    website: 'https://www.openproject.org',
    github: 'https://github.com/opf/openproject',
    short_description: 'Enterprise project management with Gantt charts and collaboration',
    long_description: 'OpenProject is a comprehensive open-source project management software offering Gantt charts, time tracking, wikis, and team collaboration features. It supports both classic and agile project management methodologies with full self-hosting capabilities.',
    alternative_to: 'Asana',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  
  // Alternative to Notion
  {
    name: 'AppFlowy',
    website: 'https://appflowy.io',
    github: 'https://github.com/AppFlowy-IO/AppFlowy',
    short_description: 'Privacy-focused alternative to Notion with notes and project tools',
    long_description: 'AppFlowy is an open-source alternative to Notion that emphasizes privacy and user control. It offers notes, documents, kanban boards, and databases while allowing complete self-hosting and data ownership without any cloud dependencies.',
    alternative_to: 'Notion',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Logseq',
    website: 'https://logseq.com',
    github: 'https://github.com/logseq/logseq',
    short_description: 'Privacy-first networked thought with outliner and knowledge base',
    long_description: 'Logseq is a privacy-first knowledge management application that works as a networked thought tool. It features outline-based notes, bidirectional linking, and block references while storing all data locally and supporting Git-based synchronization.',
    alternative_to: 'Notion',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Outline',
    website: 'https://www.getoutline.com',
    github: 'https://github.com/outline/outline',
    short_description: 'Modern wiki with knowledge base and documentation features',
    long_description: 'Outline is a modern, open-source wiki application designed for team knowledge sharing and documentation. It features real-time collaboration, powerful search, and integrations with popular tools while supporting full self-hosting.',
    alternative_to: 'Notion',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  
  // Analytics - Alternative to Google Analytics
  {
    name: 'Matomo',
    website: 'https://matomo.org',
    github: 'https://github.com/matomo-org/matomo',
    short_description: 'Full-featured analytics platform respecting user privacy',
    long_description: 'Matomo (formerly Piwik) is a comprehensive open-source analytics platform that provides detailed website analytics while respecting user privacy. It offers goals, funnels, heatmaps, and A/B testing with full data ownership and GDPR compliance through self-hosting.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Umami',
    website: 'https://umami.is',
    github: 'https://github.com/umami-software/umami',
    short_description: 'Simple, privacy-focused analytics with easy deployment',
    long_description: 'Umami is a simple, privacy-focused web analytics solution that provides essential metrics without collecting personal data. It features a clean dashboard, real-time data, and easy deployment while being lightweight and fully self-hostable.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Plausible Analytics',
    website: 'https://plausible.io',
    github: 'https://github.com/plausible/analytics',
    short_description: 'Lightweight privacy-friendly website analytics alternative',
    long_description: 'Plausible is a lightweight, privacy-friendly analytics tool that tracks website visitors without collecting personal data or using cookies. It provides essential metrics through a simple interface while being fully open-source and self-hostable.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'PostHog',
    website: 'https://posthog.com',
    github: 'https://github.com/PostHog/posthog',
    short_description: 'Product analytics with feature flags and experimentation',
    long_description: 'PostHog is an open-source product analytics platform offering insights into user behavior, feature flags, A/B testing, and session recording. It provides full control over data through self-hosting while offering enterprise-grade analytics capabilities.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Design & Creative - Alternative to Adobe Photoshop
  {
    name: 'GIMP',
    website: 'https://www.gimp.org',
    github: 'https://github.com/GNOME/gimp',
    short_description: 'Powerful open-source image editing with professional features',
    long_description: 'GIMP is a professional-grade open-source image editing software offering layers, masks, filters, brushes, and advanced color correction. It rivals Photoshop in functionality while remaining completely free and open-source with cross-platform support.',
    alternative_to: 'Adobe Photoshop',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Krita',
    website: 'https://krita.org',
    github: 'https://github.com/KDE/krita',
    short_description: 'Digital painting application for artists and illustrators',
    long_description: 'Krita is a professional digital painting application designed for artists, illustrators, and concept artists. It features advanced brush engines, color management, and animation tools while being optimized for creative workflows and completely open-source.',
    alternative_to: 'Adobe Photoshop',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Darktable',
    website: 'https://www.darktable.org',
    github: 'https://github.com/darktable-org/darktable',
    short_description: 'Professional photography workflow and raw developer',
    long_description: 'Darktable is an open-source photography workflow application and raw developer. It provides non-destructive editing, color management, and professional tools for photographers to manage and enhance their images with precise control.',
    alternative_to: 'Adobe Photoshop',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  
  // Alternative to Adobe Illustrator
  {
    name: 'Inkscape',
    website: 'https://inkscape.org',
    github: 'https://gitlab.com/inkscape/inkscape',
    short_description: 'Vector graphics editor with full SVG support',
    long_description: 'Inkscape is a professional vector graphics editor that provides complete SVG editing capabilities with tools for illustration, diagramming, and typography. It offers features comparable to Adobe Illustrator while being completely free and open-source.',
    alternative_to: 'Adobe Illustrator',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  
  // Alternative to DaVinci Resolve
  {
    name: 'Shotcut',
    website: 'https://shotcut.org',
    github: 'https://github.com/mltframework/shotcut',
    short_description: 'Free cross-platform video editing with professional features',
    long_description: 'Shotcut is a free, open-source video editing application that supports a wide range of formats and features including 4K editing, filters, and audio mixing. It provides a professional editing experience without the cost of proprietary alternatives.',
    alternative_to: 'DaVinci Resolve',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Olive',
    website: 'https://olivevideoeditor.org',
    github: 'https://github.com/olive-editor/olive',
    short_description: 'Non-linear video editing with modern interface',
    long_description: 'Olive is a free, open-source non-linear video editor aiming to provide professional features in a modern, intuitive interface. It supports multiple tracks, effects, and color grading while being developed as community-driven software.',
    alternative_to: 'DaVinci Resolve',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Kdenlive',
    website: 'https://kdenlive.org',
    github: 'https://github.com/KDE/kdenlive',
    short_description: 'Feature-rich video editing for Linux and cross-platform',
    long_description: 'Kdenlive is a powerful open-source video editor supporting multi-track editing, effects, transitions, and audio mixing. It integrates with the KDE ecosystem while providing professional editing capabilities across multiple platforms.',
    alternative_to: 'DaVinci Resolve',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  
  // Issue Tracking - Alternative to Jira
  {
    name: 'Redmine',
    website: 'https://www.redmine.org',
    github: 'https://github.com/redmine/redmine',
    short_description: 'Flexible issue tracking with project management features',
    long_description: 'Redmine is a flexible open-source project management and issue tracking web application. It supports multiple projects, wikis, forums, and time tracking with extensive plugin ecosystem while being fully self-hostable on your infrastructure.',
    alternative_to: 'Jira',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Bugzilla',
    website: 'https://www.bugzilla.org',
    github: 'https://github.com/bugzilla/bugzilla',
    short_description: 'Industry-standard bug tracking system with powerful search',
    long_description: 'Bugzilla is one of the oldest and most widely used open-source bug tracking systems. It offers powerful search capabilities, email notifications, workflow management, and comprehensive reporting while remaining fully self-hostable.',
    alternative_to: 'Jira',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  
  // Video Conferencing - Alternative to Zoom
  {
    name: 'Jitsi Meet',
    website: 'https://jitsi.org/jitsi-meet',
    github: 'https://github.com/jitsi/jitsi-meet',
    short_description: 'Secure video conferencing with no account required',
    long_description: 'Jitsi Meet is a free, open-source video conferencing solution offering HD video meetings, screen sharing, and chat without requiring accounts. It can be used via the public instance or self-hosted for complete privacy and data control.',
    alternative_to: 'Zoom',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'BigBlueButton',
    website: 'https://bigbluebutton.org',
    github: 'https://github.com/bigbluebutton/bigbluebutton',
    short_description: 'Virtual classroom and web conferencing platform',
    long_description: 'BigBlueButton is an open-source web conferencing system designed specifically for online learning and virtual classrooms. It features whiteboards, polling, breakout rooms, and recording capabilities while supporting full self-hosting.',
    alternative_to: 'Zoom',
    is_self_hosted: true,
    license: 'LGPL-3.0 License'
  },
  {
    name: 'Nextcloud Talk',
    website: 'https://nextcloud.com/talk',
    github: 'https://github.com/nextcloud/spreed',
    short_description: 'Secure video calls integrated with file collaboration',
    long_description: 'Nextcloud Talk provides secure video and audio conferencing integrated with the Nextcloud ecosystem. It offers end-to-end encryption, screen sharing, and chat while being part of a comprehensive self-hosted collaboration platform.',
    alternative_to: 'Zoom',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  
  // CMS - Alternative to WordPress
  {
    name: 'Strapi',
    website: 'https://strapi.io',
    github: 'https://github.com/strapi/strapi',
    short_description: 'Headless CMS with API-first architecture',
    long_description: 'Strapi is a modern, open-source headless CMS that provides a flexible API-first approach to content management. It features a beautiful admin panel, custom content types, and extensive plugin ecosystem while being fully self-hostable.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Ghost',
    website: 'https://ghost.org',
    github: 'https://github.com/TryGhost/Ghost',
    short_description: 'Professional publishing platform with newsletter features',
    long_description: 'Ghost is a modern open-source publishing platform designed for professional content creators. It offers a clean writing experience, membership/subscription features, and integrated newsletter capabilities with full self-hosting support.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Drupal',
    website: 'https://www.drupal.org',
    github: 'https://github.com/drupal/drupal',
    short_description: 'Enterprise CMS with powerful content modeling',
    long_description: 'Drupal is a powerful open-source content management framework for building complex websites and applications. It offers advanced content modeling, multilingual support, and enterprise-grade security with extensive customization capabilities.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Directus',
    website: 'https://directus.io',
    github: 'https://github.com/directus/directus',
    short_description: 'Headless CMS that turns SQL databases into APIs',
    long_description: 'Directus is an open-source data platform that transforms any SQL database into a headless CMS with a beautiful admin app. It provides real-time APIs, content management, and file storage with full self-hosting capabilities.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  
  // Code Repository - Alternative to GitHub
  {
    name: 'Gitea',
    website: 'https://gitea.io',
    github: 'https://github.com/go-gitea/gitea',
    short_description: 'Lightweight self-hosted git service with full features',
    long_description: 'Gitea is a lightweight, self-hosted Git service written in Go. It provides a full-featured GitHub alternative including issues, pull requests, CI/CD, and package management with minimal resource requirements and easy deployment.',
    alternative_to: 'GitHub',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'GitLab',
    website: 'https://gitlab.com',
    github: 'https://gitlab.com/gitlab-org/gitlab',
    short_description: 'Complete DevOps platform with CI/CD and container registry',
    long_description: 'GitLab is a comprehensive DevOps platform offering source code management, CI/CD pipelines, container registry, and security scanning. It provides both cloud-hosted and self-managed deployment options with enterprise-grade features.',
    alternative_to: 'GitHub',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Forgejo',
    website: 'https://forgejo.org',
    github: 'https://codeberg.org/forgejo/forgejo',
    short_description: 'Community-driven fork of Gitea with fork independence',
    long_description: 'Forgejo is a community-driven, non-fork fork of Gitea focusing on fork independence and governance. It provides the same lightweight git hosting capabilities with strong community values and full self-hosting support.',
    alternative_to: 'GitHub',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'OneDev',
    website: 'https://onedev.io',
    github: 'https://github.com/theonedev/onedev',
    short_description: 'All-in-one DevOps platform with issue tracking and CI/CD',
    long_description: 'OneDev is a self-contained DevOps platform offering Git repository hosting, issue tracking, CI/CD pipelines, and package registry. It provides a GitHub/Bitbucket-like experience with powerful automation capabilities for self-hosted environments.',
    alternative_to: 'Bitbucket',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Database - Alternative to MongoDB
  {
    name: 'PostgreSQL',
    website: 'https://www.postgresql.org',
    github: 'https://github.com/postgres/postgres',
    short_description: 'Advanced open-source relational database with JSON support',
    long_description: 'PostgreSQL is a powerful, open-source object-relational database system known for its reliability, data integrity, and advanced features. It supports JSON/JSONB for document-style data alongside traditional relational tables with full ACID compliance.',
    alternative_to: 'MongoDB',
    is_self_hosted: true,
    license: 'PostgreSQL License'
  },
  {
    name: 'CouchDB',
    website: 'https://couchdb.apache.org',
    github: 'https://github.com/apache/couchdb',
    short_description: 'Document database with multi-master replication',
    long_description: 'Apache CouchDB is an open-source document database with JSON documents and a powerful query engine. It offers multi-master replication, offline synchronization, and conflict resolution with a RESTful API for easy integration.',
    alternative_to: 'MongoDB',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'ArangoDB',
    website: 'https://www.arangodb.com',
    github: 'https://github.com/arangodb/arangodb',
    short_description: 'Multi-model database supporting documents, graphs, and keys',
    long_description: 'ArangoDB is a native multi-model database supporting key/value, document, and graph data models in a single engine. It provides flexible querying across different data models with strong consistency and horizontal scalability.',
    alternative_to: 'MongoDB',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Alternative to MySQL
  {
    name: 'TiDB',
    website: 'https://pingcap.com/tidb',
    github: 'https://github.com/pingcap/tidb',
    short_description: 'MySQL-compatible distributed database with HTAP capabilities',
    long_description: 'TiDB is an open-source, MySQL-compatible distributed database that supports Hybrid Transactional and Analytical Processing (HTAP). It provides horizontal scalability, strong consistency, and real-time analytics with MySQL protocol compatibility.',
    alternative_to: 'MySQL',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'DuckDB',
    website: 'https://duckdb.org',
    github: 'https://github.com/duckdb/duckdb',
    short_description: 'In-process SQL OLAP database for analytics workloads',
    long_description: 'DuckDB is an in-process SQL OLAP database designed for analytical workloads. It provides fast columnar storage, full SQL support, and zero-configuration operation while running entirely within the application process without a separate server.',
    alternative_to: 'MySQL',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Alternative to Redis
  {
    name: 'KeyDB',
    website: 'https://docs.keydb.dev',
    github: 'https://github.com/JohnSully/KeyDB',
    short_description: 'High-performance Redis alternative with multi-threading',
    long_description: 'KeyDB is a high-performance fork of Redis focusing on speed and efficiency. It provides multi-threaded architecture, active replication, and SSD persistence while maintaining Redis protocol compatibility for seamless migration.',
    alternative_to: 'Redis',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Dragonfly',
    website: 'https://www.dragonflydb.io',
    github: 'https://github.com/dragonflydb/dragonfly',
    short_description: 'Modern Redis alternative with incredible performance',
    long_description: 'Dragonfly is a modern in-memory data store designed to be a drop-in Redis replacement with dramatically better performance. It implements Redis protocols while providing new features like multi-threaded architecture and improved memory efficiency.',
    alternative_to: 'Redis',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  
  // CI/CD - Alternative to Jenkins
  {
    name: 'Drone',
    website: 'https://www.drone.io',
    github: 'https://github.com/harness/drone',
    short_description: 'Container-native CI/CD platform with modern architecture',
    long_description: 'Drone is a modern container-native CI/CD platform that runs each pipeline step in isolated Docker containers. It provides a clean YAML configuration, extensive plugin ecosystem, and native Kubernetes support for cloud-native deployments.',
    alternative_to: 'Jenkins',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Argo Workflows',
    website: 'https://argoproj.github.io/workflows',
    github: 'https://github.com/argoproj/argo-workflows',
    short_description: 'Kubernetes-native workflow engine for CI/CD and ML pipelines',
    long_description: 'Argo Workflows is an open-source workflow engine for orchestrating parallel jobs on Kubernetes. It provides container-native CI/CD capabilities with sophisticated workflow control, artifact management, and integration with cloud-native tools.',
    alternative_to: 'Jenkins',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Woodpecker CI',
    website: 'https://woodpecker-ci.org',
    github: 'https://github.com/woodpecker-ci/woodpecker',
    short_description: 'Simple CI engine inspired by Drone with GitHub/GitLab support',
    long_description: 'Woodpecker CI is a simple yet powerful CI engine that provides GitHub Actions-like functionality with a clean interface. It supports multiple backends, container-based pipelines, and extensive plugin ecosystem while being fully open-source.',
    alternative_to: 'GitHub Actions',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Email Marketing - Alternative to Mailchimp
  {
    name: 'Listmonk',
    website: 'https://listmonk.app',
    github: 'https://github.com/knadh/listmonk',
    short_description: 'Self-hosted newsletter with high performance and features',
    long_description: 'Listmonk is a high-performance, self-hosted newsletter and mailing list manager packed into a single binary. It features a beautiful dashboard, campaign management, templates, and detailed analytics while being incredibly easy to deploy and maintain.',
    alternative_to: 'Mailchimp',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Mautic',
    website: 'https://www.mautic.org',
    github: 'https://github.com/mautic/mautic',
    short_description: 'Marketing automation platform with email campaigns',
    long_description: 'Mautic is an open-source marketing automation platform providing email marketing, campaign management, lead scoring, and customer journey orchestration. It offers enterprise-grade features with full self-hosting capabilities and extensive customization.',
    alternative_to: 'Mailchimp',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Keila',
    website: 'https://www.keila.io',
    github: 'https://github.com/pentacent/keila',
    short_description: 'Simple and reliable email newsletter alternative to Mailchimp',
    long_description: 'Keila is a reliable and easy-to-use open-source email newsletter tool designed as a Mailchimp alternative. It provides campaign management, contact segmentation, and templates with straightforward self-hosting deployment.',
    alternative_to: 'Mailchimp',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Postal',
    website: 'https://postalserver.io',
    github: 'https://github.com/postalserver/postal',
    short_description: 'Complete mail server for sending and receiving emails',
    long_description: 'Postal is a complete open-source mail server designed for sending and receiving transactional and marketing emails. It provides SMTP handling, bounce processing, webhooks, and detailed analytics for self-hosted email infrastructure.',
    alternative_to: 'Mailchimp',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Password Management - Alternative to 1Password
  {
    name: 'Bitwarden',
    website: 'https://bitwarden.com',
    github: 'https://github.com/bitwarden/server',
    short_description: 'Open-source password manager with cloud and self-host options',
    long_description: 'Bitwarden is a secure, open-source password manager offering encrypted storage for passwords, notes, and payment info. It provides both cloud-hosted and self-hosted options with clients for all platforms and zero-knowledge security architecture.',
    alternative_to: '1Password',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Vaultwarden',
    website: 'https://github.com/dani-garcia/vaultwarden',
    github: 'https://github.com/dani-garcia/vaultwarden',
    short_description: 'Lightweight Bitwarden server written in Rust',
    long_description: 'Vaultwarden is an alternative implementation of the Bitwarden server API, written in Rust for maximum efficiency. It provides full Bitwarden compatibility with minimal resource requirements, making it ideal for self-hosted deployments on limited hardware.',
    alternative_to: '1Password',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'KeePassXC',
    website: 'https://keepassxc.org',
    github: 'https://github.com/keepassxreboot/keepassxc',
    short_description: 'Modern cross-platform KeePass password manager',
    long_description: 'KeePassXC is a modern, cross-platform password manager based on KeePassX with enhanced features including browser integration, TOTP generation, and automatic form filling. It stores databases locally with strong encryption for maximum security.',
    alternative_to: '1Password',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Pass',
    website: 'https://www.passwordstore.org',
    github: 'https://git.zx2c4.com/password-store',
    short_description: 'UNIX command-line password manager using GPG',
    long_description: 'Pass is a simple, open-source command-line password manager that stores passwords in GPG-encrypted files within a git repository. It provides a minimalist approach to password management with shell completion and integration capabilities.',
    alternative_to: 'LastPass',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  
  // Documentation & Wiki - Alternative to Confluence
  {
    name: 'BookStack',
    website: 'https://www.bookstackapp.com',
    github: 'https://github.com/BookStackApp/BookStack',
    short_description: 'Simple, self-hosted knowledge base and documentation',
    long_description: 'BookStack is a simple, open-source platform for organizing and storing information in a knowledge base format. It features a WYSIWYG editor, bookshelf organization, permissions system, and full-text search with straightforward self-hosting deployment.',
    alternative_to: 'Confluence',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'XWiki',
    website: 'https://www.xwiki.org',
    github: 'https://github.com/xwiki/xwiki',
    short_description: 'Enterprise wiki with powerful extensibility',
    long_description: 'XWiki is an enterprise-grade open-source wiki offering powerful content management, application development, and collaboration features. It provides a programmable platform with dynamic content, templates, and extensive customization capabilities.',
    alternative_to: 'Confluence',
    is_self_hosted: true,
    license: 'LGPL-2.1 License'
  },
  {
    name: 'Docmost',
    website: 'https://docmost.com',
    github: 'https://github.com/docmost/docmost',
    short_description: 'Modern collaborative wiki with Notion-like experience',
    long_description: 'Docmost is an open-source collaborative wiki and documentation software designed as a modern alternative to Confluence and Notion. It features real-time editing, file uploads, and a clean interface with full self-hosting support.',
    alternative_to: 'Confluence',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'DokuWiki',
    website: 'https://www.dokuwiki.org',
    github: 'https://github.com/splitbrain/dokuwiki',
    short_description: 'Simple-to-use wiki with no database required',
    long_description: 'DokuWiki is a standards-compliant, simple-to-use wiki that requires no database. It stores content in text files with syntax similar to MediaWiki, offers full-text search, access control lists, and extensive plugin ecosystem for customization.',
    alternative_to: 'Confluence',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  
  // UI/UX Design - Alternative to Figma
  {
    name: 'Penpot',
    website: 'https://penpot.app',
    github: 'https://github.com/penpot/penpot',
    short_description: 'Open-source design and prototyping platform',
    long_description: 'Penpot is the first true open-source design and prototyping platform that works with open web standards. It provides design tools, prototyping capabilities, and design system features while being the first platform-agnostic design tool for distributed teams.',
    alternative_to: 'Figma',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  
  // Container & Virtualization - Alternative to Docker Desktop
  {
    name: 'Podman',
    website: 'https://podman.io',
    github: 'https://github.com/containers/podman',
    short_description: 'Daemonless container engine with Docker-compatible API',
    long_description: 'Podman is a daemonless container engine for developing, managing, and running OCI containers. It provides a Docker-compatible CLI, supports rootless containers, and integrates with systemd while maintaining full compatibility with existing Docker workflows.',
    alternative_to: 'Docker Desktop',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Colima',
    website: 'https://github.com/abiosoft/colima',
    github: 'https://github.com/abiosoft/colima',
    short_description: 'Container runtime on macOS with minimal setup',
    long_description: 'Colima is an open-source container runtime that provides Docker-compatible container support on macOS with minimal configuration. It uses Lima under the hood and supports both Docker and containerd runtimes for easy container development.',
    alternative_to: 'Docker Desktop',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Alternative to Kubernetes
  {
    name: 'K3s',
    website: 'https://k3s.io',
    github: 'https://github.com/k3s-io/k3s',
    short_description: 'Lightweight Kubernetes for IoT and edge computing',
    long_description: 'K3s is a lightweight, certified Kubernetes distribution designed for production workloads from the IoT edge to the cloud. It provides a single binary with embedded components for easy installation and operation with significantly reduced resource requirements.',
    alternative_to: 'Kubernetes',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Rancher',
    website: 'https://www.rancher.com',
    github: 'https://github.com/rancher/rancher',
    short_description: 'Complete Kubernetes management platform',
    long_description: 'Rancher is a complete open-source Kubernetes management platform that provides centralized authentication, access control, and multi-cluster management. It simplifies Kubernetes operations across hybrid and multi-cloud environments with intuitive interfaces.',
    alternative_to: 'Kubernetes',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'MicroK8s',
    website: 'https://microk8s.io',
    github: 'https://github.com/canonical/microk8s',
    short_description: 'Lightweight upstream Kubernetes for development and IoT',
    long_description: 'MicroK8s is a low-ops, minimal Kubernetes distribution that installs in a single snap. It provides a lightweight, upstream Kubernetes experience with addons for common services like Istio, Prometheus, and Knative for rapid deployment.',
    alternative_to: 'Kubernetes',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Additional Project Management - Alternative to Monday.com
  {
    name: 'Worklenz',
    website: 'https://worklenz.com',
    github: 'https://github.com/isp-relay/worklenz',
    short_description: 'Open-source project management with Monday.com-like interface',
    long_description: 'Worklenz is a powerful open-source self-hosted alternative that provides full control over your data, workflows, and project management needs. It features a modern interface similar to Monday.com with customizable dashboards and automated workflows.',
    alternative_to: 'Monday.com',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Plane',
    website: 'https://plane.so',
    github: 'https://github.com/makeplane/plane',
    short_description: 'Issue tracking and project management with clean interface',
    long_description: 'Plane is an open-source project management tool for issue tracking and project planning. It provides a clean, intuitive interface with features for agile development, roadmaps, and team collaboration while supporting full self-hosting.',
    alternative_to: 'Monday.com',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Vikunja',
    website: 'https://vikunja.io',
    github: 'https://github.com/go-vikunja/app',
    short_description: 'Self-hosted task and project manager with API-first design',
    long_description: 'Vikunja is a self-hosted task and project manager positioned as an open-source alternative to Todoist or ClickUp. It supports lists, Kanban boards, Gantt charts, and offers a powerful API for integrations with full data ownership.',
    alternative_to: 'Monday.com',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Tillywork',
    website: 'https://tillywork.com',
    github: 'https://github.com/tillywork/tillywork',
    short_description: 'Open-source work management software with modules',
    long_description: 'Tillywork is an open-source, self-hostable work management software designed for team collaboration. It features multiple modules for different workflows with customizable features and full data control for organizations.',
    alternative_to: 'Monday.com',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // No-Code Database - Alternative to Airtable
  {
    name: 'NocoDB',
    website: 'https://nocodb.com',
    github: 'https://github.com/nocodb/nocodb',
    short_description: 'Turns any database into an Airtable-like spreadsheet',
    long_description: 'NocoDB is the fastest and easiest way to build databases online. It transforms any relational database (MySQL, PostgreSQL, etc.) into an Airtable-like spreadsheet interface with intuitive UI, multiple views, and powerful automations while being fully self-hostable.',
    alternative_to: 'Airtable',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Baserow',
    website: 'https://baserow.io',
    github: 'https://gitlab.com/bramw/baserow',
    short_description: 'Open-source no-code database and application builder',
    long_description: 'Baserow is an open-source no-code platform for building databases and applications. It offers diverse data visualization, no-code full-feature application building, and is a great Airtable alternative with no vendor lock-in and full self-hosting capabilities.',
    alternative_to: 'Airtable',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Grist',
    website: 'https://www.getgrist.com',
    github: 'https://github.com/gristlabs/grist-core',
    short_description: 'Spreadsheet-database hybrid with powerful automation',
    long_description: 'Grist is a capable alternative to Airtable that focuses on being a modern spreadsheet with database capabilities. It offers powerful formulas, automation, and data management features with both cloud-hosted and self-hosted options.',
    alternative_to: 'Airtable',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Teable',
    website: 'https://teable.io',
    github: 'https://github.com/teableio/teable',
    short_description: 'Superfast Airtable alternative with SQL database backend',
    long_description: 'Teable is a superfast, open-source Airtable alternative built with a real SQL database backend. It provides high performance, full database power, and intuitive spreadsheet interface with complete self-hosting capabilities.',
    alternative_to: 'Airtable',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Rowy',
    website: 'https://www.rowy.io',
    github: 'https://github.com/rowyio/rowy',
    short_description: 'Low-code Airtable alternative for Firebase and Supabase',
    long_description: 'Rowy is an open-source low-code platform that works as an Airtable alternative for Firebase and Supabase backends. It provides spreadsheet interfaces, cloud functions, and integrations while being fully self-hostable.',
    alternative_to: 'Airtable',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // CRM - Alternative to Salesforce
  {
    name: 'Twenty',
    website: 'https://twenty.com',
    github: 'https://github.com/twentyhq/twenty',
    short_description: 'Modern open-source CRM with clean interface',
    long_description: 'Twenty is a modern, open-source CRM alternative to Salesforce that is fully customizable, affordable, and powered by the community. It offers contact management, deal tracking, and email integration with full self-hosting for complete data control.',
    alternative_to: 'Salesforce',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'SuiteCRM',
    website: 'https://suitecrm.com',
    github: 'https://github.com/salesagility/SuiteCRM',
    short_description: 'Feature-rich open-source CRM with extensive modules',
    long_description: 'SuiteCRM presents itself as the open source alternative to Salesforce with enterprise-grade features. It offers contact management, sales automation, marketing campaigns, and project management with full self-hosting capabilities.',
    alternative_to: 'Salesforce',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Odoo CRM',
    website: 'https://www.odoo.com',
    github: 'https://github.com/odoo/odoo',
    short_description: 'Integrated CRM with business app ecosystem',
    long_description: 'Odoo CRM is an open-source customer relationship management solution integrated with the Odoo business app ecosystem. It provides lead scoring, sales pipeline management, and forecasting with seamless integration to other business applications.',
    alternative_to: 'Salesforce',
    is_self_hosted: true,
    license: 'LGPL-3.0 License'
  },
  {
    name: 'EspoCRM',
    website: 'https://www.espocrm.com',
    github: 'https://github.com/espocrm/espocrm',
    short_description: 'Lightweight and modern open-source CRM',
    long_description: 'EspoCRM is a lightweight, modern open-source CRM designed for small and medium businesses. It provides contact management, sales pipeline, document management, and email integration with a clean interface and full self-hosting capabilities.',
    alternative_to: 'HubSpot',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'YetiForce',
    website: 'https://yetiforce.org',
    github: 'https://github.com/YetiForceCompany/YetiForceCRM',
    short_description: 'Comprehensive open-source CRM for enterprises',
    long_description: 'YetiForce is a comprehensive open-source CRM designed for enterprises with features for sales, project management, and customer service. It offers advanced reporting, automation, and multi-currency support with full self-hosting capabilities.',
    alternative_to: 'Salesforce',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  
  // Workflow Automation - Alternative to Zapier
  {
    name: 'n8n',
    website: 'https://n8n.io',
    github: 'https://github.com/n8n-io/n8n',
    short_description: 'Powerful workflow automation with extensive integrations',
    long_description: 'n8n (short for Node meets Node) is a free and open-source workflow automation tool designed for self-hosting with full control over data and workflows. It provides extensive integrations, custom nodes, and a powerful visual workflow editor.',
    alternative_to: 'Zapier',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'ActivePieces',
    website: 'https://www.activepieces.com',
    github: 'https://github.com/activepieces/activepieces',
    short_description: 'Open-source automation with user-friendly interface',
    long_description: 'ActivePieces is an open-source automation tool that provides a user-friendly alternative to Zapier. It features a visual flow builder, template marketplace, and extensive integrations with full self-hosting support.',
    alternative_to: 'Zapier',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Huginn',
    website: 'https://github.com/huginn/huginn',
    github: 'https://github.com/huginn/huginn',
    short_description: 'Self-hosted agent system for automation and monitoring',
    long_description: 'Huginn is a self-hosted system for building agents that perform automated tasks for you online. It can read the web, watch for events, and take actions with full data control and privacy for self-hosted deployments.',
    alternative_to: 'Zapier',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Node-RED',
    website: 'https://nodered.org',
    github: 'https://github.com/node-red/node-red',
    short_description: 'Flow-based programming for IoT and automation',
    long_description: 'Node-RED is a flow-based programming tool for wiring together hardware devices, APIs, and online services. It provides a browser-based flow editor with extensive nodes for IoT, automation, and integration workflows with full self-hosting capabilities.',
    alternative_to: 'Zapier',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Automatisch',
    website: 'https://automatisch.io',
    github: 'https://github.com/automatisch/automatisch',
    short_description: 'Open-source business automation platform',
    long_description: 'Automatisch is an open-source business automation platform that connects your apps and automates workflows. It provides a Zapier-like experience with extensive integrations while supporting full self-hosting for complete data control.',
    alternative_to: 'Zapier',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Windmill',
    website: 'https://www.windmill.dev',
    github: 'https://github.com/windmill-labs/windmill',
    short_description: 'Developer-centric automation with code-first approach',
    long_description: 'Windmill is a developer-centric open-source automation platform with a code-first approach. It allows building complex workflows using TypeScript, Python, or Go while providing a Zapier-like interface for simpler automations with full self-hosting.',
    alternative_to: 'Zapier',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Forms & Surveys - Alternative to Typeform
  {
    name: 'Typebot',
    website: 'https://typebot.io',
    github: 'https://github.com/baptistemont/typebot.io',
    short_description: 'Conversational form builder with modern interface',
    long_description: 'Typebot is an open-source conversational form builder that provides a modern, engaging interface similar to Typeform. It supports logic jumps, calculations, and integrations while being fully self-hostable for complete data ownership.',
    alternative_to: 'Typeform',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Formbricks',
    website: 'https://formbricks.com',
    github: 'https://github.com/formbricks/formbricks',
    short_description: 'Open-source form and survey platform with targeting',
    long_description: 'Formbricks is an open-source form and survey platform designed for modern teams. It provides beautiful forms, survey workflows, and user targeting capabilities with full self-hosting support and GDPR compliance.',
    alternative_to: 'Typeform',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'HeyForm',
    website: 'https://heyform.net',
    github: 'https://github.com/heyform/heyform',
    short_description: 'Easy-to-use form builder for quizzes and surveys',
    long_description: 'HeyForm is an open-source form builder that creates surveys, quizzes, and polls with an easy-to-use interface. It provides conditional logic, calculations, and beautiful templates with straightforward self-hosting deployment.',
    alternative_to: 'Jotform',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'SurveyJS',
    website: 'https://surveyjs.io',
    github: 'https://github.com/surveyjs/survey-library',
    short_description: 'JavaScript form and survey library with visual editor',
    long_description: 'SurveyJS is an open-source JavaScript form and survey library with a visual form builder. It provides extensive question types, themes, and integration capabilities for embedding forms in any application with full customization.',
    alternative_to: 'Typeform',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Internal Tools - Alternative to Retool
  {
    name: 'Appsmith',
    website: 'https://appsmith.com',
    github: 'https://github.com/appsmithorg/appsmith',
    short_description: 'Open-source low-code platform for building internal tools',
    long_description: 'Appsmith is an open-source low-code platform for building internal tools, dashboards, and admin panels. It provides drag-and-drop widgets, API integrations, and customizable workflows with full self-hosting capabilities.',
    alternative_to: 'Retool',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Budibase',
    website: 'https://budibase.com',
    github: 'https://github.com/Budibase/budibase',
    short_description: 'Low-code platform with built-in database and auth',
    long_description: 'Budibase is an open-source low-code platform for building internal tools quickly. It features a built-in database, authentication, and automations with beautiful UI components while supporting full self-hosting for complete data control.',
    alternative_to: 'Retool',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'ToolJet',
    website: 'https://tooljet.com',
    github: 'https://github.com/ToolJet/ToolJet',
    short_description: 'Open-source low-code framework for internal apps',
    long_description: 'ToolJet is an open-source low-code framework for building and deploying internal applications. It provides drag-and-drop UI builder, data connectors, and extensive integrations with both cloud and self-hosted deployment options.',
    alternative_to: 'Retool',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'ILLA Builder',
    website: 'https://illa.cloud',
    github: 'https://github.com/illacloud/illa-builder',
    short_description: 'Open-source internal tool builder with AI features',
    long_description: 'ILLA Builder is an open-source internal tool builder that combines low-code development with AI capabilities. It provides drag-and-drop interface, real-time collaboration, and extensive component library with full self-hosting support.',
    alternative_to: 'Retool',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  
  // Discord Alternative
  {
    name: 'Revolt',
    website: 'https://revolt.chat',
    github: 'https://github.com/revoltchat/revolt',
    short_description: 'User-friendly Discord alternative with focus on privacy',
    long_description: 'Revolt is an open-source, user-friendly Discord alternative designed with privacy in mind. It offers real-time messaging, voice channels, and customization while being fully self-hostable with no data collection or tracking.',
    alternative_to: 'Discord',
    is_self_hosted: true,
    license: 'MIT License'
  },
  
  // Time Tracking - Alternative to Toggl
  {
    name: 'Kimai',
    website: 'https://www.kimai.org',
    github: 'https://github.com/kimai/kimai',
    short_description: 'Free open-source time tracking with invoicing',
    long_description: 'Kimai is a free, open-source time tracking software with invoicing capabilities. It provides timesheets, project tracking, and reporting with a web-based interface and full self-hosting support for complete data control.',
    alternative_to: 'Toggl',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'ActivityWatch',
    website: 'https://activitywatch.net',
    github: 'https://github.com/ActivityWatch/activitywatch',
    short_description: 'Privacy-focused automated time tracking',
    long_description: 'ActivityWatch is an open-source, privacy-focused automated time tracking application. It monitors application and website usage, tracks time spent on projects, and stores all data locally with full user control and no cloud collection.',
    alternative_to: 'RescueTime',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  
  // File Storage - Alternative to Dropbox
  {
    name: 'Nextcloud',
    website: 'https://nextcloud.com',
    github: 'https://github.com/nextcloud/server',
    short_description: 'Complete self-hosted cloud with collaboration features',
    long_description: 'Nextcloud is a complete self-hosted cloud solution providing file sync, share, and collaboration features. It offers calendar, contacts, video conferencing, and document editing with full data ownership and enterprise-grade security.',
    alternative_to: 'Dropbox',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Seafile',
    website: 'https://www.seafile.com',
    github: 'https://github.com/haiwen/seafile',
    short_description: 'High-performance file sync and sharing',
    long_description: 'Seafile is an open-source, high-performance file sync and sharing solution with built-in document collaboration. It provides file encryption, version control, and team collaboration features with full self-hosting capabilities.',
    alternative_to: 'Dropbox',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'OwnCloud',
    website: 'https://owncloud.org',
    github: 'https://github.com/owncloud/core',
    short_description: 'Self-hosted file sync and sharing platform',
    long_description: 'OwnCloud is an open-source self-hosted file sync and sharing platform that gives you control over your data. It provides secure file sharing, calendar, contacts, and document collaboration with extensive app ecosystem and full data control.',
    alternative_to: 'Dropbox',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Pydio',
    website: 'https://pydio.com',
    github: 'https://github.com/pydio/cells',
    short_description: 'Enterprise file sharing and collaboration',
    long_description: 'Pydio (now Pydio Cells) is an open-source enterprise file sharing and collaboration platform. It provides secure file management, sharing, and sync capabilities with advanced features for compliance and governance with full self-hosting support.',
    alternative_to: 'Google Drive',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  
  // Note-Taking - Alternative to Evernote
  {
    name: 'Joplin',
    website: 'https://joplinapp.org',
    github: 'https://github.com/laurent22/joplin',
    short_description: 'Cross-platform note-taking with end-to-end encryption',
    long_description: 'Joplin is an open-source, cross-platform note-taking and to-do application with end-to-end encryption. It supports notes, notebooks, tags, and synchronization across devices while storing all data locally or on your own server.',
    alternative_to: 'Evernote',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Trilium Notes',
    website: 'https://github.com/zadam/trilium',
    github: 'https://github.com/zadam/trilium',
    short_description: 'Hierarchical note-taking with rich formatting',
    long_description: 'Trilium Notes is an open-source, hierarchical note-taking application with rich formatting capabilities. It provides attributes, relations, and scripting features for building complex knowledge bases while storing all data locally.',
    alternative_to: 'OneNote',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  
  // Calendar & Scheduling - Alternative to Calendly
  {
    name: 'Cal.com',
    website: 'https://cal.com',
    github: 'https://github.com/calcom/cal.com',
    short_description: 'Open-source scheduling infrastructure',
    long_description: 'Cal.com is an open-source scheduling platform that provides the infrastructure for Calendly-like functionality. It offers booking pages, round-robin scheduling, and team availability with full self-hosting and customization capabilities.',
    alternative_to: 'Calendly',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Radicale',
    website: 'https://radicale.org',
    github: 'https://github.com/Kozea/Radicale',
    short_description: 'Simple CalDAV calendar server',
    long_description: 'Radicale is a simple, open-source CalDAV calendar and contacts server. It provides calendar sharing, sync with mobile devices, and access control with minimal resource requirements and straightforward self-hosting deployment.',
    alternative_to: 'Calendly',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // ============ ADDITIONAL ALTERNATIVES FROM MARKDOWN ============
  
  // Monitoring and Observability - Alternative to Datadog
  {
    name: 'Prometheus',
    website: 'https://prometheus.io',
    github: 'https://github.com/prometheus/prometheus',
    short_description: 'Open-source monitoring and alerting toolkit',
    long_description: 'Prometheus is an open-source systems monitoring and alerting toolkit. It features a multi-dimensional data model, flexible query language (PromQL), and integrated alerting while being designed for reliability and self-hosted deployments.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Grafana',
    website: 'https://grafana.com',
    github: 'https://github.com/grafana/grafana',
    short_description: 'Open-source analytics and monitoring platform',
    long_description: 'Grafana is an open-source analytics and interactive visualization web application. It provides charts, graphs, and alerts for the web when connected to supported data sources, with extensive plugin ecosystem and self-hosting support.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Zabbix',
    website: 'https://www.zabbix.com',
    github: 'https://github.com/zabbix/zabbix',
    short_description: 'Enterprise-class monitoring solution',
    long_description: 'Zabbix is an enterprise-class open source distributed monitoring solution designed to monitor and track the status of various network services, servers, and other network hardware with full self-hosting capabilities.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Netdata',
    website: 'https://www.netdata.cloud',
    github: 'https://github.com/netdata/netdata',
    short_description: 'Real-time performance monitoring',
    long_description: 'Netdata is a distributed, real-time performance and health monitoring solution for systems and applications. It collects thousands of metrics with zero configuration and provides beautiful real-time visualizations.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Uptime Kuma',
    website: 'https://uptime.kuma.pet',
    github: 'https://github.com/louislam/uptime-kuma',
    short_description: 'Self-hosted monitoring tool like Uptime Robot',
    long_description: 'Uptime Kuma is a fancy self-hosted monitoring tool. It provides HTTP(s), TCP, Ping monitoring with a beautiful UI, notifications via various services, and multi-language support while being easy to deploy.',
    alternative_to: 'Uptime Robot',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Jaeger',
    website: 'https://www.jaegertracing.io',
    github: 'https://github.com/jaegertracing/jaeger',
    short_description: 'Open-source distributed tracing',
    long_description: 'Jaeger is an open-source, end-to-end distributed tracing system used for monitoring and troubleshooting microservices-based distributed systems. It helps with transaction monitoring, root cause analysis, and service dependency analysis.',
    alternative_to: 'Datadog APM',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'SigNoz',
    website: 'https://signoz.io',
    github: 'https://github.com/SigNoz/signoz',
    short_description: 'Open-source APM and observability platform',
    long_description: 'SigNoz is an open-source application performance monitoring (APM) tool that helps developers monitor applications and troubleshoot problems. It provides traces, metrics, and logs in a single pane of glass.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // API Management - Alternative to Postman
  {
    name: 'Hoppscotch',
    website: 'https://hoppscotch.io',
    github: 'https://github.com/hoppscotch/hoppscotch',
    short_description: 'Open-source API development ecosystem',
    long_description: 'Hoppscotch is a lightweight, web-based API development suite. It helps you create requests faster, saving precious time on development with features for REST, GraphQL, WebSocket, and more.',
    alternative_to: 'Postman',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Insomnia',
    website: 'https://insomnia.rest',
    github: 'https://github.com/Kong/insomnia',
    short_description: 'Open-source API client for REST and GraphQL',
    long_description: 'Insomnia is a powerful HTTP and GraphQL client for REST, SOAP, GraphQL, and gRPC. It provides a beautiful interface for debugging APIs with support for authentication, code generation, and environment variables.',
    alternative_to: 'Postman',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Bruno',
    website: 'https://www.usebruno.com',
    github: 'https://github.com/usebruno/bruno',
    short_description: 'Fast and Git-friendly open-source API client',
    long_description: 'Bruno is a fast, Git-friendly open-source API client that stores collections directly in a folder on your filesystem. It uses a plain text markup language, Bru, to save information about API requests.',
    alternative_to: 'Postman',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Thunder Client',
    website: 'https://www.thunderclient.com',
    github: 'https://github.com/rangav/thunder-client-support',
    short_description: 'Lightweight REST API client for VS Code',
    long_description: 'Thunder Client is a lightweight Rest API client extension for Visual Studio Code. It provides a clean and simple interface to test REST APIs without leaving your IDE.',
    alternative_to: 'Postman',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Code Search - Alternative to Sourcegraph
  {
    name: 'Zoekt',
    website: 'https://github.com/sourcegraph/zoekt',
    github: 'https://github.com/sourcegraph/zoekt',
    short_description: 'Fast text search engine for source code',
    long_description: 'Zoekt is a fast text search engine, intended for use with source code. It supports regular expressions and can index repositories, providing sub-second search across large codebases.',
    alternative_to: 'Sourcegraph',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Livegrep',
    website: 'https://livegrep.com',
    github: 'https://github.com/livegrep/livegrep',
    short_description: 'Tool for interactive code searching',
    long_description: 'Livegrep is a tool, partially inspired by Google Code Search, for interactive code searching. It provides fast regex search across large codebases with a web interface.',
    alternative_to: 'Sourcegraph',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // E-commerce - Alternative to Shopify
  {
    name: 'Medusa',
    website: 'https://medusajs.com',
    github: 'https://github.com/medusajs/medusa',
    short_description: 'Open-source headless commerce platform',
    long_description: 'Medusa is an open-source headless commerce platform that enables developers to create amazing digital commerce experiences. It provides a modular architecture for building customizable e-commerce solutions.',
    alternative_to: 'Shopify',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Saleor',
    website: 'https://saleor.io',
    github: 'https://github.com/saleor/saleor',
    short_description: 'GraphQL-first headless e-commerce platform',
    long_description: 'Saleor is a high-performance, composable, headless commerce API built with Python and Django. It provides a GraphQL API for building online stores and marketplaces.',
    alternative_to: 'Shopify',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Spree Commerce',
    website: 'https://spreecommerce.org',
    github: 'https://github.com/spree/spree',
    short_description: 'Open-source e-commerce platform for Ruby on Rails',
    long_description: 'Spree Commerce is a complete, modular, API-driven open source e-commerce solution built with Ruby on Rails. It provides flexibility for customization while offering a robust set of features.',
    alternative_to: 'Shopify',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Bagisto',
    website: 'https://bagisto.com',
    github: 'https://github.com/bagisto/bagisto',
    short_description: 'Laravel-based open-source e-commerce',
    long_description: 'Bagisto is a free and open-source Laravel eCommerce framework built for all to build and scale your business. It offers multi-inventory sources, multi-currency, localization, and more.',
    alternative_to: 'Shopify',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'PrestaShop',
    website: 'https://www.prestashop.com',
    github: 'https://github.com/PrestaShop/PrestaShop',
    short_description: 'Open-source e-commerce solution',
    long_description: 'PrestaShop is a freemium, open source e-commerce solution. It offers a comprehensive set of features for creating and managing an online store with extensive theme and module marketplace.',
    alternative_to: 'Shopify',
    is_self_hosted: true,
    license: 'OSL-3.0 License'
  },
  {
    name: 'WooCommerce',
    website: 'https://woocommerce.com',
    github: 'https://github.com/woocommerce/woocommerce',
    short_description: 'WordPress e-commerce plugin',
    long_description: 'WooCommerce is a customizable, open-source eCommerce platform built on WordPress. It provides the ability to sell physical and digital goods of all shapes and sizes with extensive plugin ecosystem.',
    alternative_to: 'Shopify',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Learning Management - Alternative to Teachable
  {
    name: 'Open edX',
    website: 'https://openedx.org',
    github: 'https://github.com/openedx/edx-platform',
    short_description: 'Open-source platform for online courses',
    long_description: 'Open edX is the open-source platform behind edX, offering a comprehensive system for creating and delivering online courses. It supports various content types, assessments, and analytics.',
    alternative_to: 'Teachable',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Moodle',
    website: 'https://moodle.org',
    github: 'https://github.com/moodle/moodle',
    short_description: 'Open-source learning management system',
    long_description: 'Moodle is a free and open-source learning management system used for blended learning, distance education, flipped classroom and other online learning projects. It has a large community and extensive plugin ecosystem.',
    alternative_to: 'Teachable',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Canvas LMS',
    website: 'https://www.instructure.com/canvas',
    github: 'https://github.com/instructure/canvas-lms',
    short_description: 'Modern learning management system',
    long_description: 'Canvas is a modern, open-source learning management system (LMS) that makes teaching and learning easier for everyone. It provides a clean interface, mobile apps, and extensive integration capabilities.',
    alternative_to: 'Teachable',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Chamilo',
    website: 'https://chamilo.org',
    github: 'https://github.com/chamilo/chamilo-lms',
    short_description: 'E-learning and collaboration platform',
    long_description: 'Chamilo is a free software e-learning and content management system, aimed at improving access to education and knowledge globally. It offers course management, user tracking, and assessment tools.',
    alternative_to: 'Teachable',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Customer Support - Alternative to Zendesk
  {
    name: 'Chatwoot',
    website: 'https://www.chatwoot.com',
    github: 'https://github.com/chatwoot/chatwoot',
    short_description: 'Open-source customer engagement platform',
    long_description: 'Chatwoot is an open-source customer engagement platform that helps companies engage their customers across multiple channels. It provides live chat, email support, and social media integration.',
    alternative_to: 'Zendesk',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Zammad',
    website: 'https://zammad.org',
    github: 'https://github.com/zammad/zammad',
    short_description: 'Open-source helpdesk and ticketing system',
    long_description: 'Zammad is a web-based, open source helpdesk and customer support system. It offers ticket management, knowledge base, and chat support with integrations to various communication channels.',
    alternative_to: 'Zendesk',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'osTicket',
    website: 'https://osticket.com',
    github: 'https://github.com/osTicket/osTicket',
    short_description: 'Open-source support ticket system',
    long_description: 'osTicket is a widely-used open source support ticket system. It seamlessly integrates inquiries created via email, phone and web-based forms into a simple easy-to-use multi-user web interface.',
    alternative_to: 'Zendesk',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'FreeScout',
    website: 'https://freescout.net',
    github: 'https://github.com/freescout-helpdesk/freescout',
    short_description: 'Free self-hosted help desk and shared inbox',
    long_description: 'FreeScout is the super lightweight and powerful free open source help desk and shared inbox written in PHP. It is a self-hosted clone of HelpScout with a clean interface.',
    alternative_to: 'Help Scout',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Peppermint',
    website: 'https://peppermint.sh',
    github: 'https://github.com/Peppermint-Lab/peppermint',
    short_description: 'Open-source ticket management system',
    long_description: 'Peppermint is an open source ticket management system. It focuses on providing a simple yet powerful interface for managing support tickets with time tracking and client management features.',
    alternative_to: 'Zendesk',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Live Chat - Alternative to Intercom
  {
    name: 'Papercups',
    website: 'https://papercups.io',
    github: 'https://github.com/papercups-io/papercups',
    short_description: 'Open-source live customer chat',
    long_description: 'Papercups is an open-source live customer chat tool. It provides real-time messaging, Slack integration, and analytics while being privacy-focused and self-hostable.',
    alternative_to: 'Intercom',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Tawk.to',
    website: 'https://www.tawk.to',
    github: 'https://github.com/nickytonline/tawk-to',
    short_description: 'Free live chat application',
    long_description: 'Tawk.to is a free messaging app to monitor and chat with visitors on your website or from a free customizable page. It offers ticketing, knowledge base, and CRM features.',
    alternative_to: 'Intercom',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },

  // Search Engine - Alternative to Algolia
  {
    name: 'Meilisearch',
    website: 'https://www.meilisearch.com',
    github: 'https://github.com/meilisearch/meilisearch',
    short_description: 'Lightning-fast open-source search engine',
    long_description: 'Meilisearch is a powerful, fast, open-source, easy to use and deploy search engine. Its great out of the box features make it perfect for instant search experiences.',
    alternative_to: 'Algolia',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Typesense',
    website: 'https://typesense.org',
    github: 'https://github.com/typesense/typesense',
    short_description: 'Open-source instant search engine',
    long_description: 'Typesense is a fast, typo-tolerant search engine for building delightful search experiences. It is an open source alternative to Algolia and an easier-to-use alternative to ElasticSearch.',
    alternative_to: 'Algolia',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'OpenSearch',
    website: 'https://opensearch.org',
    github: 'https://github.com/opensearch-project/OpenSearch',
    short_description: 'Community-driven fork of Elasticsearch',
    long_description: 'OpenSearch is a community-driven, Apache 2.0-licensed open source search and analytics suite. It is a fork of Elasticsearch and Kibana, providing search, visualization, and analytics capabilities.',
    alternative_to: 'Elasticsearch',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Manticore Search',
    website: 'https://manticoresearch.com',
    github: 'https://github.com/manticoresoftware/manticoresearch',
    short_description: 'Open-source database for search',
    long_description: 'Manticore Search is an easy to use open source fast database for search. It provides full-text search, analytics, and real-time indexing with SQL-like query syntax.',
    alternative_to: 'Elasticsearch',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },

  // Backend as a Service - Alternative to Firebase
  {
    name: 'Supabase',
    website: 'https://supabase.com',
    github: 'https://github.com/supabase/supabase',
    short_description: 'Open-source Firebase alternative',
    long_description: 'Supabase is an open source Firebase alternative. It provides a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.',
    alternative_to: 'Firebase',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Appwrite',
    website: 'https://appwrite.io',
    github: 'https://github.com/appwrite/appwrite',
    short_description: 'Open-source backend server for web and mobile',
    long_description: 'Appwrite is a secure end-to-end backend server for web, mobile, and flutter developers. It provides authentication, databases, storage, functions, and messaging APIs.',
    alternative_to: 'Firebase',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'PocketBase',
    website: 'https://pocketbase.io',
    github: 'https://github.com/pocketbase/pocketbase',
    short_description: 'Open-source backend in a single file',
    long_description: 'PocketBase is an open source backend in a single file. It provides real-time database, authentication, file storage, and admin dashboard in a portable executable.',
    alternative_to: 'Firebase',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Parse',
    website: 'https://parseplatform.org',
    github: 'https://github.com/parse-community/parse-server',
    short_description: 'Open-source application framework',
    long_description: 'Parse Server is an open source backend that can be deployed to any infrastructure that can run Node.js. It provides push notifications, social authentication, and database abstraction.',
    alternative_to: 'Firebase',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Nhost',
    website: 'https://nhost.io',
    github: 'https://github.com/nhost/nhost',
    short_description: 'Open-source Firebase alternative with GraphQL',
    long_description: 'Nhost is an open-source Firebase alternative with GraphQL. It provides a database, GraphQL API, authentication, storage, and serverless functions.',
    alternative_to: 'Firebase',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Headless CMS - Additional
  {
    name: 'Payload',
    website: 'https://payloadcms.com',
    github: 'https://github.com/payloadcms/payload',
    short_description: 'Headless CMS and application framework',
    long_description: 'Payload is a headless CMS and application framework built with TypeScript, Node.js, Express, and React. It provides a powerful admin panel, customizable fields, and access control.',
    alternative_to: 'Contentful',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Keystone',
    website: 'https://keystonejs.com',
    github: 'https://github.com/keystonejs/keystone',
    short_description: 'Open-source headless CMS for Node.js',
    long_description: 'Keystone is a powerful headless CMS for developing database-driven applications. It provides a GraphQL API, customizable admin UI, and flexible access control.',
    alternative_to: 'Contentful',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Sanity',
    website: 'https://www.sanity.io',
    github: 'https://github.com/sanity-io/sanity',
    short_description: 'Platform for structured content',
    long_description: 'Sanity is the platform for structured content that powers remarkable digital experiences. It provides real-time collaboration, customizable editing, and flexible content modeling.',
    alternative_to: 'Contentful',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Logging - Alternative to Splunk
  {
    name: 'Graylog',
    website: 'https://www.graylog.org',
    github: 'https://github.com/Graylog2/graylog2-server',
    short_description: 'Open-source log management platform',
    long_description: 'Graylog is a leading centralized log management solution for capturing, storing, and enabling real-time analysis of terabytes of machine data. It provides powerful search and dashboards.',
    alternative_to: 'Splunk',
    is_self_hosted: true,
    license: 'SSPL'
  },
  {
    name: 'Loki',
    website: 'https://grafana.com/oss/loki',
    github: 'https://github.com/grafana/loki',
    short_description: 'Horizontally-scalable log aggregation',
    long_description: 'Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus. It is designed to be very cost effective and easy to operate.',
    alternative_to: 'Splunk',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Social Media Management - Alternative to Buffer
  {
    name: 'Mixpost',
    website: 'https://mixpost.app',
    github: 'https://github.com/inovector/mixpost',
    short_description: 'Self-hosted social media management',
    long_description: 'Mixpost is a self-hosted social media management software. It allows you to create, schedule, publish, and manage social media content in one place.',
    alternative_to: 'Buffer',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Media Server - Alternative to Plex
  {
    name: 'Jellyfin',
    website: 'https://jellyfin.org',
    github: 'https://github.com/jellyfin/jellyfin',
    short_description: 'Free software media system',
    long_description: 'Jellyfin is a free software media system that puts you in control of managing and streaming your media. It is an alternative to proprietary systems like Emby and Plex.',
    alternative_to: 'Plex',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Emby',
    website: 'https://emby.media',
    github: 'https://github.com/MediaBrowser/Emby',
    short_description: 'Personal media server',
    long_description: 'Emby brings together your personal videos, music, photos, and live television into one easy-to-use interface. It streams your media to any device.',
    alternative_to: 'Plex',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },

  // URL Shortener - Alternative to Bitly
  {
    name: 'Dub',
    website: 'https://dub.co',
    github: 'https://github.com/dubinc/dub',
    short_description: 'Open-source link management platform',
    long_description: 'Dub is an open-source link management platform for modern marketing teams to create, share, and track short links. It provides analytics, custom domains, and team collaboration.',
    alternative_to: 'Bitly',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Shlink',
    website: 'https://shlink.io',
    github: 'https://github.com/shlinkio/shlink',
    short_description: 'Self-hosted URL shortener',
    long_description: 'Shlink is a self-hosted URL shortener with a CLI and REST interface. It provides detailed visit statistics, QR codes, and custom slugs with multiple domain support.',
    alternative_to: 'Bitly',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'YOURLS',
    website: 'https://yourls.org',
    github: 'https://github.com/YOURLS/YOURLS',
    short_description: 'Your Own URL Shortener',
    long_description: 'YOURLS is a small set of PHP scripts that will allow you to run your own URL shortening service. You control your data, your links, and your statistics.',
    alternative_to: 'Bitly',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Feature Flags - Alternative to LaunchDarkly
  {
    name: 'Unleash',
    website: 'https://www.getunleash.io',
    github: 'https://github.com/Unleash/unleash',
    short_description: 'Open-source feature management',
    long_description: 'Unleash is an open-source feature management solution. It provides feature toggles, gradual rollouts, A/B testing, and user targeting with SDKs for multiple languages.',
    alternative_to: 'LaunchDarkly',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Flagsmith',
    website: 'https://www.flagsmith.com',
    github: 'https://github.com/Flagsmith/flagsmith',
    short_description: 'Open-source feature flag platform',
    long_description: 'Flagsmith is an open source feature flag and remote config service. It allows you to manage feature flags across web, mobile, and server side applications.',
    alternative_to: 'LaunchDarkly',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'GrowthBook',
    website: 'https://www.growthbook.io',
    github: 'https://github.com/growthbook/growthbook',
    short_description: 'Open-source feature flagging and A/B testing',
    long_description: 'GrowthBook is an open-source platform for feature flags and A/B tests built for data teams. It provides Bayesian statistics, warehouse native analytics, and visual experiment editor.',
    alternative_to: 'LaunchDarkly',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Notification Infrastructure - Alternative to OneSignal
  {
    name: 'Novu',
    website: 'https://novu.co',
    github: 'https://github.com/novuhq/novu',
    short_description: 'Open-source notification infrastructure',
    long_description: 'Novu is the open-source notification infrastructure for developers. It provides a unified API for push, email, SMS, in-app, and chat notifications with workflow management.',
    alternative_to: 'OneSignal',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Ntfy',
    website: 'https://ntfy.sh',
    github: 'https://github.com/binwiederhier/ntfy',
    short_description: 'Simple HTTP-based pub-sub notification service',
    long_description: 'Ntfy is a simple HTTP-based pub-sub notification service. It allows you to send notifications to your phone or desktop via scripts from any computer.',
    alternative_to: 'Pushover',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Gotify',
    website: 'https://gotify.net',
    github: 'https://github.com/gotify/server',
    short_description: 'Self-hosted push notification server',
    long_description: 'Gotify is a simple server for sending and receiving messages. It provides a REST API for sending messages and WebSocket support for receiving them in real-time.',
    alternative_to: 'Pushover',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Status Page - Alternative to Statuspage.io
  {
    name: 'Cachet',
    website: 'https://cachethq.io',
    github: 'https://github.com/CachetHQ/Cachet',
    short_description: 'Open-source status page system',
    long_description: 'Cachet is a beautiful and powerful open source status page system. It allows you to communicate downtime and system outages to your customers.',
    alternative_to: 'Statuspage.io',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Gatus',
    website: 'https://gatus.io',
    github: 'https://github.com/TwiN/gatus',
    short_description: 'Automated service health dashboard',
    long_description: 'Gatus is a developer-oriented health dashboard that gives you the ability to monitor your services using HTTP, ICMP, TCP, and DNS queries.',
    alternative_to: 'Statuspage.io',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Upptime',
    website: 'https://upptime.js.org',
    github: 'https://github.com/upptime/upptime',
    short_description: 'GitHub-powered open-source uptime monitor',
    long_description: 'Upptime is the open-source uptime monitor and status page, powered entirely by GitHub Actions, Issues, and Pages. It requires no server, just a GitHub repository.',
    alternative_to: 'Statuspage.io',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Self-hosted Runners - Alternative to GitHub Actions Hosted
  {
    name: 'Buildkite',
    website: 'https://buildkite.com',
    github: 'https://github.com/buildkite/agent',
    short_description: 'Platform for running fast and scalable CI/CD',
    long_description: 'Buildkite is a platform for running fast, secure, and scalable CI/CD pipelines on your own infrastructure. It provides hybrid cloud architecture with full control over agents.',
    alternative_to: 'GitHub Actions',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Secrets Management - Alternative to HashiCorp Vault
  {
    name: 'Infisical',
    website: 'https://infisical.com',
    github: 'https://github.com/Infisical/infisical',
    short_description: 'Open-source secret management platform',
    long_description: 'Infisical is an open-source, end-to-end encrypted platform for managing secrets and configs across your team and infrastructure. It provides SDKs, CLI, and native integrations.',
    alternative_to: 'HashiCorp Vault',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Doppler',
    website: 'https://www.doppler.com',
    github: 'https://github.com/DopplerHQ/cli',
    short_description: 'Developer-first secrets platform',
    long_description: 'Doppler is a SecretOps platform that empowers developers to securely manage secrets across any environment. It provides automatic secret syncing and rotation.',
    alternative_to: 'HashiCorp Vault',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },

  // Document Signing - Alternative to DocuSign
  {
    name: 'Documenso',
    website: 'https://documenso.com',
    github: 'https://github.com/documenso/documenso',
    short_description: 'Open-source DocuSign alternative',
    long_description: 'Documenso is an open source document signing tool that aims to be a more open, transparent alternative to DocuSign. It provides digital signatures with audit trails.',
    alternative_to: 'DocuSign',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Invoice/Billing - Alternative to Stripe Billing
  {
    name: 'Invoice Ninja',
    website: 'https://www.invoiceninja.com',
    github: 'https://github.com/invoiceninja/invoiceninja',
    short_description: 'Open-source invoicing and billing',
    long_description: 'Invoice Ninja is a free, open-source invoicing, expenses, and time-tracking application. It provides professional invoices, recurring billing, and payment processing integration.',
    alternative_to: 'FreshBooks',
    is_self_hosted: true,
    license: 'Elastic License 2.0'
  },
  {
    name: 'Crater',
    website: 'https://crater.financial',
    github: 'https://github.com/crater-invoice/crater',
    short_description: 'Open-source invoicing for freelancers',
    long_description: 'Crater is a free and open-source invoicing application designed for freelancers and small businesses. It offers estimates, invoices, expenses, and payment tracking.',
    alternative_to: 'FreshBooks',
    is_self_hosted: true,
    license: 'AAL'
  },
  {
    name: 'Lago',
    website: 'https://www.getlago.com',
    github: 'https://github.com/getlago/lago',
    short_description: 'Open-source metering and usage-based billing',
    long_description: 'Lago is an open-source metering and usage-based billing API. It provides real-time event ingestion, flexible pricing models, and integrations with payment providers.',
    alternative_to: 'Stripe Billing',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Kill Bill',
    website: 'https://killbill.io',
    github: 'https://github.com/killbill/killbill',
    short_description: 'Open-source billing and payments platform',
    long_description: 'Kill Bill is an open-source subscription billing and payments platform. It provides a billing engine, payment processing, and comprehensive analytics.',
    alternative_to: 'Stripe Billing',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Screenshot/Screen Recording - Alternative to Loom
  {
    name: 'OBS Studio',
    website: 'https://obsproject.com',
    github: 'https://github.com/obsproject/obs-studio',
    short_description: 'Free and open-source software for video recording',
    long_description: 'OBS Studio is free and open-source software for video recording and live streaming. It provides real-time source and device capture, scene composition, and high-performance encoding.',
    alternative_to: 'Loom',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },
  {
    name: 'ScreenRec',
    website: 'https://screenrec.com',
    github: 'https://github.com/nickytonline/screenrec',
    short_description: 'Free screen recorder with cloud sharing',
    long_description: 'ScreenRec is a free lightweight screen recorder that lets you capture your screen, webcam, and audio. It provides instant cloud sharing with analytics.',
    alternative_to: 'Loom',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },

  // Bookmark Manager - Alternative to Raindrop.io
  {
    name: 'Linkwarden',
    website: 'https://linkwarden.app',
    github: 'https://github.com/linkwarden/linkwarden',
    short_description: 'Self-hosted bookmark manager',
    long_description: 'Linkwarden is a self-hosted, open-source collaborative bookmark manager. It allows you to collect, organize and archive webpages with full-text search.',
    alternative_to: 'Raindrop.io',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Shiori',
    website: 'https://github.com/go-shiori/shiori',
    github: 'https://github.com/go-shiori/shiori',
    short_description: 'Simple bookmark manager for the command line',
    long_description: 'Shiori is a simple bookmark manager built with Go. It is intended as a simple clone of Pocket with archiving capability and a simple web interface.',
    alternative_to: 'Pocket',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Wallabag',
    website: 'https://wallabag.org',
    github: 'https://github.com/wallabag/wallabag',
    short_description: 'Self-hosted read-it-later application',
    long_description: 'Wallabag is a self-hosted application for saving web pages. It extracts the readable part of articles and saves them for later reading across devices.',
    alternative_to: 'Pocket',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Hoarder',
    website: 'https://hoarder.app',
    github: 'https://github.com/hoarder-app/hoarder',
    short_description: 'Self-hosted bookmark and note manager',
    long_description: 'Hoarder is a self-hosted bookmark-everything app with AI-powered tagging. It allows you to save bookmarks, notes, and images with automatic organization.',
    alternative_to: 'Raindrop.io',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Diagram/Whiteboard - Alternative to Miro
  {
    name: 'Excalidraw',
    website: 'https://excalidraw.com',
    github: 'https://github.com/excalidraw/excalidraw',
    short_description: 'Virtual whiteboard for sketching',
    long_description: 'Excalidraw is a virtual collaborative whiteboard tool that lets you easily sketch diagrams that have a hand-drawn feel to them. It supports real-time collaboration.',
    alternative_to: 'Miro',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Draw.io',
    website: 'https://www.drawio.com',
    github: 'https://github.com/jgraph/drawio',
    short_description: 'Free online diagram software',
    long_description: 'Draw.io is free online diagram software for making flowcharts, process diagrams, org charts, UML, ER and network diagrams. It can be self-hosted or used online.',
    alternative_to: 'Lucidchart',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'tldraw',
    website: 'https://www.tldraw.com',
    github: 'https://github.com/tldraw/tldraw',
    short_description: 'Infinite canvas for creating diagrams',
    long_description: 'tldraw is a collaborative digital whiteboard available at tldraw.com. It provides a freeform canvas for drawing, diagramming, and visual collaboration.',
    alternative_to: 'Miro',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Personal Finance - Alternative to Mint
  {
    name: 'Actual Budget',
    website: 'https://actualbudget.com',
    github: 'https://github.com/actualbudget/actual',
    short_description: 'Local-first personal finance tool',
    long_description: 'Actual Budget is a local-first personal finance tool. It provides a beautiful, fast budgeting experience that stores your data locally and syncs across devices.',
    alternative_to: 'YNAB',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Firefly III',
    website: 'https://www.firefly-iii.org',
    github: 'https://github.com/firefly-iii/firefly-iii',
    short_description: 'Self-hosted personal finance manager',
    long_description: 'Firefly III is a free and open source personal finance manager. It helps you keep track of expenses, income, budgets and everything in between.',
    alternative_to: 'Mint',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Maybe',
    website: 'https://maybe.co',
    github: 'https://github.com/maybe-finance/maybe',
    short_description: 'Open-source personal finance app',
    long_description: 'Maybe is the OS for your personal finances built by a small team. It provides net worth tracking, investment analysis, and financial planning tools.',
    alternative_to: 'Mint',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // RSS Reader - Alternative to Feedly
  {
    name: 'FreshRSS',
    website: 'https://freshrss.org',
    github: 'https://github.com/FreshRSS/FreshRSS',
    short_description: 'Self-hosted RSS feed aggregator',
    long_description: 'FreshRSS is a free, self-hostable RSS feed aggregator. It is lightweight, easy to work with, powerful, and customizable with a clean interface.',
    alternative_to: 'Feedly',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Miniflux',
    website: 'https://miniflux.app',
    github: 'https://github.com/miniflux/v2',
    short_description: 'Minimalist feed reader',
    long_description: 'Miniflux is a minimalist and opinionated feed reader. It is simple, fast, lightweight and efficient while focusing on readability and content.',
    alternative_to: 'Feedly',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Tiny Tiny RSS',
    website: 'https://tt-rss.org',
    github: 'https://git.tt-rss.org/fox/tt-rss',
    short_description: 'Web-based news feed reader',
    long_description: 'Tiny Tiny RSS is a free and open source web-based news feed (RSS/Atom) reader and aggregator. It provides keyboard shortcuts, mobile app support, and plugins.',
    alternative_to: 'Feedly',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Home Automation - Alternative to SmartThings
  {
    name: 'Home Assistant',
    website: 'https://www.home-assistant.io',
    github: 'https://github.com/home-assistant/core',
    short_description: 'Open-source home automation platform',
    long_description: 'Home Assistant is an open-source home automation platform focused on privacy and local control. It supports thousands of devices and services with powerful automation capabilities.',
    alternative_to: 'SmartThings',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'OpenHAB',
    website: 'https://www.openhab.org',
    github: 'https://github.com/openhab/openhab-core',
    short_description: 'Vendor-neutral home automation',
    long_description: 'openHAB is a vendor and technology agnostic open source automation software for your home. It integrates different building automation systems, devices, and technologies.',
    alternative_to: 'SmartThings',
    is_self_hosted: true,
    license: 'EPL-2.0 License'
  },

  // Photo Management - Alternative to Google Photos
  {
    name: 'Immich',
    website: 'https://immich.app',
    github: 'https://github.com/immich-app/immich',
    short_description: 'Self-hosted photo and video backup',
    long_description: 'Immich is a self-hosted photo and video backup solution directly from your mobile phone. It provides a modern web interface, mobile apps, and machine learning features.',
    alternative_to: 'Google Photos',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'PhotoPrism',
    website: 'https://photoprism.app',
    github: 'https://github.com/photoprism/photoprism',
    short_description: 'AI-powered photo management',
    long_description: 'PhotoPrism is an AI-powered photos app for the decentralized web. It uses the latest technologies to tag and find pictures automatically without getting in your way.',
    alternative_to: 'Google Photos',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Lychee',
    website: 'https://lychee.electerious.com',
    github: 'https://github.com/LycheeOrg/Lychee',
    short_description: 'Self-hosted photo management',
    long_description: 'Lychee is a free photo-management tool that runs on your server or web-space. It provides a beautiful interface for managing, organizing, and sharing photos.',
    alternative_to: 'Google Photos',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Static Site Generators
  {
    name: 'Hugo',
    website: 'https://gohugo.io',
    github: 'https://github.com/gohugoio/hugo',
    short_description: 'Fast static site generator',
    long_description: 'Hugo is one of the most popular open-source static site generators. It is written in Go and is known for its amazing speed and flexibility.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Jekyll',
    website: 'https://jekyllrb.com',
    github: 'https://github.com/jekyll/jekyll',
    short_description: 'Simple static site generator',
    long_description: 'Jekyll is a simple, blog-aware, static site generator for personal, project, or organization sites. It transforms plain text into static websites and blogs.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Eleventy',
    website: 'https://www.11ty.dev',
    github: 'https://github.com/11ty/eleventy',
    short_description: 'Simpler static site generator',
    long_description: 'Eleventy is a simpler static site generator that transforms various template files into HTML. It is zero-config by default and highly customizable.',
    alternative_to: 'WordPress',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Authentication
  {
    name: 'Keycloak',
    website: 'https://www.keycloak.org',
    github: 'https://github.com/keycloak/keycloak',
    short_description: 'Open-source identity and access management',
    long_description: 'Keycloak is an open source identity and access management solution. It provides single sign-on, identity brokering, social login, and user federation.',
    alternative_to: 'Auth0',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Authentik',
    website: 'https://goauthentik.io',
    github: 'https://github.com/goauthentik/authentik',
    short_description: 'Open-source identity provider',
    long_description: 'authentik is an open-source Identity Provider focused on flexibility and versatility. It provides SAML, OAuth2, LDAP, and SCIM support with beautiful customizable login pages.',
    alternative_to: 'Auth0',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Zitadel',
    website: 'https://zitadel.com',
    github: 'https://github.com/zitadel/zitadel',
    short_description: 'Open-source identity infrastructure',
    long_description: 'ZITADEL is a cloud-native Identity and Access Management solution. It provides secure authentication, authorization, and user management with multi-tenancy support.',
    alternative_to: 'Auth0',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'SuperTokens',
    website: 'https://supertokens.com',
    github: 'https://github.com/supertokens/supertokens-core',
    short_description: 'Open-source authentication solution',
    long_description: 'SuperTokens is an open source authentication solution. It provides session management, social login, and passwordless auth with pre-built UI components.',
    alternative_to: 'Auth0',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Logto',
    website: 'https://logto.io',
    github: 'https://github.com/logto-io/logto',
    short_description: 'Open-source Auth0 alternative',
    long_description: 'Logto is an open-source Auth0 alternative for building identity infrastructure. It provides a beautiful sign-in experience with passwordless, social sign-in, and MFA support.',
    alternative_to: 'Auth0',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Ory',
    website: 'https://www.ory.sh',
    github: 'https://github.com/ory/hydra',
    short_description: 'Open-source identity and access control',
    long_description: 'Ory is the infrastructure for secure access. It provides OAuth 2.0 and OpenID Connect server (Hydra), identity management (Kratos), and access control (Keto).',
    alternative_to: 'Auth0',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Podcast Hosting - Alternative to Anchor
  {
    name: 'Castopod',
    website: 'https://castopod.org',
    github: 'https://github.com/ad-aures/castopod',
    short_description: 'Open-source podcast hosting platform',
    long_description: 'Castopod is an open-source hosting solution for podcasters who want full control of their podcasts. It provides RSS feeds, analytics, and fediverse integration.',
    alternative_to: 'Anchor',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Comment System - Alternative to Disqus
  {
    name: 'Giscus',
    website: 'https://giscus.app',
    github: 'https://github.com/giscus/giscus',
    short_description: 'GitHub Discussions-powered comments',
    long_description: 'Giscus is a comments system powered by GitHub Discussions. It allows visitors to leave comments and reactions on your website via GitHub.',
    alternative_to: 'Disqus',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Utterances',
    website: 'https://utteranc.es',
    github: 'https://github.com/utterance/utterances',
    short_description: 'GitHub Issues-based commenting widget',
    long_description: 'Utterances is a lightweight comments widget built on GitHub Issues. It allows visitors to leave comments using their GitHub account.',
    alternative_to: 'Disqus',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Isso',
    website: 'https://posativ.org/isso',
    github: 'https://github.com/posativ/isso',
    short_description: 'Self-hosted commenting server',
    long_description: 'Isso is a commenting server similar to Disqus. It allows anonymous comments, maintains identity via client side cookies and an SQLite database.',
    alternative_to: 'Disqus',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Commento',
    website: 'https://commento.io',
    github: 'https://gitlab.com/commento/commento',
    short_description: 'Privacy-focused commenting platform',
    long_description: 'Commento is a fast, privacy-focused commenting platform. It provides a lightweight alternative to Disqus without ads or tracking.',
    alternative_to: 'Disqus',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // ERP - Alternative to SAP
  {
    name: 'ERPNext',
    website: 'https://erpnext.com',
    github: 'https://github.com/frappe/erpnext',
    short_description: 'Open-source ERP for SMEs',
    long_description: 'ERPNext is a free and open-source enterprise resource planning software. It covers accounting, inventory, manufacturing, CRM, sales, purchase, project management, and HR.',
    alternative_to: 'SAP',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Dolibarr',
    website: 'https://www.dolibarr.org',
    github: 'https://github.com/Dolibarr/dolibarr',
    short_description: 'Open-source ERP and CRM',
    long_description: 'Dolibarr ERP CRM is an easy to use open source ERP and CRM software package for small and medium businesses. It provides modules for various business needs.',
    alternative_to: 'SAP',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Event Scheduling - Alternative to Eventbrite
  {
    name: 'Mobilizon',
    website: 'https://joinmobilizon.org',
    github: 'https://framagit.org/framasoft/mobilizon',
    short_description: 'Federated event and group management',
    long_description: 'Mobilizon is a federated event and group management tool. It allows you to publish events, group them by themes, and find events nearby on the fediverse.',
    alternative_to: 'Eventbrite',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Open Event',
    website: 'https://eventyay.com',
    github: 'https://github.com/fossasia/open-event-server',
    short_description: 'Open-source event management system',
    long_description: 'Open Event is a comprehensive event management system. It provides tools for event creation, ticketing, scheduling, and attendee management.',
    alternative_to: 'Eventbrite',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Meeting Scheduling - Alternative to Doodle
  {
    name: 'Rallly',
    website: 'https://rallly.co',
    github: 'https://github.com/lukevella/rallly',
    short_description: 'Open-source meeting poll scheduler',
    long_description: 'Rallly is a free tool to help you find the best date for an event with a group of people. It is a simple, open-source Doodle alternative.',
    alternative_to: 'Doodle',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Social Network - Alternative to Twitter
  {
    name: 'Mastodon',
    website: 'https://joinmastodon.org',
    github: 'https://github.com/mastodon/mastodon',
    short_description: 'Decentralized social network',
    long_description: 'Mastodon is a free and open-source self-hosted social networking service. It allows anyone to host their own server node in the network and is part of the fediverse.',
    alternative_to: 'Twitter',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Misskey',
    website: 'https://misskey-hub.net',
    github: 'https://github.com/misskey-dev/misskey',
    short_description: 'Decentralized interplanetary microblogging',
    long_description: 'Misskey is an open source, decentralized social media platform with features like custom emojis, reactions, and federated timeline via ActivityPub.',
    alternative_to: 'Twitter',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Pleroma',
    website: 'https://pleroma.social',
    github: 'https://git.pleroma.social/pleroma/pleroma',
    short_description: 'Lightweight fediverse server',
    long_description: 'Pleroma is a free, federated social networking server built on open protocols. It is compatible with Mastodon and other ActivityPub implementations.',
    alternative_to: 'Twitter',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Reddit Alternative
  {
    name: 'Lemmy',
    website: 'https://join-lemmy.org',
    github: 'https://github.com/LemmyNet/lemmy',
    short_description: 'Federated link aggregator',
    long_description: 'Lemmy is a federated link aggregator and forum. It is similar to Reddit, but with the added benefit of being self-hostable and federating with other instances.',
    alternative_to: 'Reddit',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // YouTube Alternative
  {
    name: 'PeerTube',
    website: 'https://joinpeertube.org',
    github: 'https://github.com/Chocobozzz/PeerTube',
    short_description: 'Decentralized video hosting platform',
    long_description: 'PeerTube is a free, decentralized, federated video platform. It uses peer-to-peer technology to reduce load on individual servers when viewing videos.',
    alternative_to: 'YouTube',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Link in Bio - Alternative to Linktree
  {
    name: 'Linkstack',
    website: 'https://linkstack.org',
    github: 'https://github.com/LinkStackOrg/LinkStack',
    short_description: 'Open-source Linktree alternative',
    long_description: 'LinkStack is a unique platform that provides an efficient solution for managing and sharing links online. It is a self-hosted Linktree alternative with themes.',
    alternative_to: 'Linktree',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Littlelink',
    website: 'https://littlelink.io',
    github: 'https://github.com/sethcottle/littlelink',
    short_description: 'Minimal link in bio page',
    long_description: 'LittleLink is a lightweight DIY alternative to services like Linktree and Many.link. It provides a simple way to create a single page with links to your socials.',
    alternative_to: 'Linktree',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // ============ NEXT 100 ALTERNATIVES ============

  // AI/ML Tools - Alternative to OpenAI
  {
    name: 'Ollama',
    website: 'https://ollama.ai',
    github: 'https://github.com/ollama/ollama',
    short_description: 'Run large language models locally',
    long_description: 'Ollama is a tool for running large language models locally. It bundles model weights, configuration, and data into a single package, defined by a Modelfile.',
    alternative_to: 'OpenAI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'LocalAI',
    website: 'https://localai.io',
    github: 'https://github.com/mudler/LocalAI',
    short_description: 'Self-hosted OpenAI-compatible API',
    long_description: 'LocalAI is a free, open source alternative to OpenAI. It acts as a drop-in replacement REST API that is compatible with OpenAI API specifications for local inferencing.',
    alternative_to: 'OpenAI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'LM Studio',
    website: 'https://lmstudio.ai',
    github: 'https://github.com/lmstudio-ai',
    short_description: 'Desktop app for running local LLMs',
    long_description: 'LM Studio is a desktop application for discovering, downloading, and running local LLMs. It provides a simple interface for chatting with AI models on your computer.',
    alternative_to: 'ChatGPT',
    is_self_hosted: true,
    license: 'Proprietary (Free)'
  },
  {
    name: 'Open WebUI',
    website: 'https://openwebui.com',
    github: 'https://github.com/open-webui/open-webui',
    short_description: 'Self-hosted ChatGPT-like interface',
    long_description: 'Open WebUI is an extensible, feature-rich, and user-friendly self-hosted WebUI designed to operate entirely offline. It supports various LLM runners including Ollama and OpenAI-compatible APIs.',
    alternative_to: 'ChatGPT',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Jan',
    website: 'https://jan.ai',
    github: 'https://github.com/janhq/jan',
    short_description: 'Open-source ChatGPT alternative',
    long_description: 'Jan is an open-source ChatGPT alternative that runs 100% offline on your computer. It supports multiple models and provides a clean interface for AI interactions.',
    alternative_to: 'ChatGPT',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'text-generation-webui',
    website: 'https://github.com/oobabooga/text-generation-webui',
    github: 'https://github.com/oobabooga/text-generation-webui',
    short_description: 'Gradio web UI for large language models',
    long_description: 'text-generation-webui is a Gradio web UI for running Large Language Models like LLaMA, llama.cpp, GPT-J, Pythia, OPT, and others. It supports various model formats and extensions.',
    alternative_to: 'ChatGPT',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Langfuse',
    website: 'https://langfuse.com',
    github: 'https://github.com/langfuse/langfuse',
    short_description: 'Open-source LLM engineering platform',
    long_description: 'Langfuse is an open-source LLM engineering platform. It helps teams debug, analyze, and iterate on LLM applications with tracing, analytics, and prompt management.',
    alternative_to: 'LangSmith',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Dify',
    website: 'https://dify.ai',
    github: 'https://github.com/langgenius/dify',
    short_description: 'Open-source LLM app development platform',
    long_description: 'Dify is an open-source LLM app development platform. It combines AI workflow, RAG pipeline, agent capabilities, model management, and observability features.',
    alternative_to: 'LangChain',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Flowise',
    website: 'https://flowiseai.com',
    github: 'https://github.com/FlowiseAI/Flowise',
    short_description: 'Drag & drop UI to build LLM flows',
    long_description: 'Flowise is an open-source UI visual tool to build customized LLM orchestration flows and AI agents. It provides a drag-and-drop interface for creating AI applications.',
    alternative_to: 'LangChain',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'GPT4All',
    website: 'https://gpt4all.io',
    github: 'https://github.com/nomic-ai/gpt4all',
    short_description: 'Open-source large language models',
    long_description: 'GPT4All is an ecosystem of open-source large language models that run locally on consumer-grade CPUs. It provides a desktop application and Python bindings.',
    alternative_to: 'OpenAI',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Vector Database - Alternative to Pinecone
  {
    name: 'Qdrant',
    website: 'https://qdrant.tech',
    github: 'https://github.com/qdrant/qdrant',
    short_description: 'High-performance vector database',
    long_description: 'Qdrant is a vector similarity search engine and database. It provides a production-ready service with a convenient API to store, search, and manage vectors with payload.',
    alternative_to: 'Pinecone',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Weaviate',
    website: 'https://weaviate.io',
    github: 'https://github.com/weaviate/weaviate',
    short_description: 'Open-source vector database',
    long_description: 'Weaviate is an open-source vector database that stores both objects and vectors. It allows for combining vector search with structured filtering.',
    alternative_to: 'Pinecone',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Milvus',
    website: 'https://milvus.io',
    github: 'https://github.com/milvus-io/milvus',
    short_description: 'Cloud-native vector database',
    long_description: 'Milvus is an open-source vector database built for scalable similarity search. It supports trillion-scale vector search with millisecond latency.',
    alternative_to: 'Pinecone',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Chroma',
    website: 'https://www.trychroma.com',
    github: 'https://github.com/chroma-core/chroma',
    short_description: 'AI-native open-source embedding database',
    long_description: 'Chroma is the AI-native open-source embedding database. It is designed to make it easy to build LLM apps by making knowledge, facts, and skills pluggable.',
    alternative_to: 'Pinecone',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Game Development - Alternative to Unity
  {
    name: 'Godot',
    website: 'https://godotengine.org',
    github: 'https://github.com/godotengine/godot',
    short_description: 'Open-source game engine',
    long_description: 'Godot is a feature-packed, cross-platform game engine for creating 2D and 3D games. It provides a comprehensive set of tools to create games with its own scripting language.',
    alternative_to: 'Unity',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Bevy',
    website: 'https://bevyengine.org',
    github: 'https://github.com/bevyengine/bevy',
    short_description: 'Data-driven game engine built in Rust',
    long_description: 'Bevy is a refreshingly simple data-driven game engine built in Rust. It provides an Entity Component System, 2D and 3D renderers, and hot reloading.',
    alternative_to: 'Unity',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Defold',
    website: 'https://defold.com',
    github: 'https://github.com/defold/defold',
    short_description: 'Free game engine for 2D games',
    long_description: 'Defold is a free to use, cross-platform game engine for making 2D games. It is developed by King and known for its tiny runtime and efficient development workflow.',
    alternative_to: 'Unity',
    is_self_hosted: false,
    license: 'Custom License'
  },
  {
    name: 'O3DE',
    website: 'https://o3de.org',
    github: 'https://github.com/o3de/o3de',
    short_description: 'Open 3D Engine for AAA games',
    long_description: 'Open 3D Engine (O3DE) is a modular, open source, cross-platform 3D engine built to power AAA games. It was developed by Amazon and is backed by the Linux Foundation.',
    alternative_to: 'Unreal Engine',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Stride',
    website: 'https://stride3d.net',
    github: 'https://github.com/stride3d/stride',
    short_description: 'Open-source C# game engine',
    long_description: 'Stride is an open-source C# game engine for realistic rendering and VR. It features a game studio IDE, advanced rendering, and supports both 2D and 3D games.',
    alternative_to: 'Unity',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Image Generation - Alternative to Midjourney
  {
    name: 'Stable Diffusion WebUI',
    website: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    github: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    short_description: 'Web UI for Stable Diffusion',
    long_description: 'Stable Diffusion web UI is a browser interface based on Gradio library for Stable Diffusion. It provides txt2img, img2img, inpainting, and many extensions.',
    alternative_to: 'Midjourney',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'ComfyUI',
    website: 'https://github.com/comfyanonymous/ComfyUI',
    github: 'https://github.com/comfyanonymous/ComfyUI',
    short_description: 'Node-based Stable Diffusion UI',
    long_description: 'ComfyUI is a powerful and modular stable diffusion GUI and backend. It uses a nodes/graph/flowchart interface to design and execute advanced stable diffusion pipelines.',
    alternative_to: 'Midjourney',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'InvokeAI',
    website: 'https://invoke.ai',
    github: 'https://github.com/invoke-ai/InvokeAI',
    short_description: 'Stable Diffusion toolkit',
    long_description: 'InvokeAI is a leading creative engine for Stable Diffusion models. It provides a web interface, canvas for inpainting, and a powerful node editor for workflows.',
    alternative_to: 'Midjourney',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Fooocus',
    website: 'https://github.com/lllyasviel/Fooocus',
    github: 'https://github.com/lllyasviel/Fooocus',
    short_description: 'Image generation with minimal prompting',
    long_description: 'Fooocus is an image generating software combining the best of Stable Diffusion and Midjourney. It simplifies the generation process with optimized presets.',
    alternative_to: 'Midjourney',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Terminal/Shell - Alternative to iTerm
  {
    name: 'Warp',
    website: 'https://www.warp.dev',
    github: 'https://github.com/warpdotdev/Warp',
    short_description: 'Modern Rust-based terminal',
    long_description: 'Warp is a blazingly fast, Rust-based terminal reimagined from the ground up. It features AI-powered command search, blocks for output grouping, and modern text editing.',
    alternative_to: 'iTerm2',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },
  {
    name: 'Alacritty',
    website: 'https://alacritty.org',
    github: 'https://github.com/alacritty/alacritty',
    short_description: 'Cross-platform GPU-accelerated terminal',
    long_description: 'Alacritty is a cross-platform, OpenGL terminal emulator. It is focused on simplicity and performance, with sensible defaults and extensive configurability.',
    alternative_to: 'iTerm2',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Kitty',
    website: 'https://sw.kovidgoyal.net/kitty',
    github: 'https://github.com/kovidgoyal/kitty',
    short_description: 'Fast GPU-based terminal emulator',
    long_description: 'kitty is a fast, feature-rich, GPU based terminal emulator. It supports modern terminal features like graphics, unicode, and true color with a tiling layout.',
    alternative_to: 'iTerm2',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'WezTerm',
    website: 'https://wezfurlong.org/wezterm',
    github: 'https://github.com/wez/wezterm',
    short_description: 'GPU-accelerated terminal emulator',
    long_description: 'WezTerm is a GPU-accelerated cross-platform terminal emulator and multiplexer. It is implemented in Rust and supports multiple panes, tabs, and serial ports.',
    alternative_to: 'iTerm2',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Hyper',
    website: 'https://hyper.is',
    github: 'https://github.com/vercel/hyper',
    short_description: 'Electron-based terminal',
    long_description: 'Hyper is a terminal built on web technologies. It is fully extensible with JavaScript, providing a beautiful and extensible command-line interface.',
    alternative_to: 'iTerm2',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Code Editor - Alternative to VS Code
  {
    name: 'Zed',
    website: 'https://zed.dev',
    github: 'https://github.com/zed-industries/zed',
    short_description: 'High-performance code editor',
    long_description: 'Zed is a high-performance, multiplayer code editor from the creators of Atom. It is built in Rust for speed and features real-time collaboration.',
    alternative_to: 'VS Code',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Lapce',
    website: 'https://lapce.dev',
    github: 'https://github.com/lapce/lapce',
    short_description: 'Lightning-fast code editor in Rust',
    long_description: 'Lapce is a lightning-fast and powerful code editor written in pure Rust. It features a native GUI, modal editing, built-in LSP support, and remote development.',
    alternative_to: 'VS Code',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Helix',
    website: 'https://helix-editor.com',
    github: 'https://github.com/helix-editor/helix',
    short_description: 'Post-modern modal text editor',
    long_description: 'Helix is a post-modern modal text editor written in Rust. It has built-in LSP support, syntax highlighting via tree-sitter, and multiple selections.',
    alternative_to: 'Vim',
    is_self_hosted: false,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Neovim',
    website: 'https://neovim.io',
    github: 'https://github.com/neovim/neovim',
    short_description: 'Hyperextensible Vim-based editor',
    long_description: 'Neovim is a Vim fork focused on extensibility and usability. It provides better defaults, a built-in terminal emulator, and Lua-based configuration.',
    alternative_to: 'Vim',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Lite XL',
    website: 'https://lite-xl.com',
    github: 'https://github.com/lite-xl/lite-xl',
    short_description: 'Lightweight extensible text editor',
    long_description: 'Lite XL is a lightweight, simple, fast, feature-filled, and extensible text editor written in C and Lua. It provides a minimal footprint with powerful customization.',
    alternative_to: 'VS Code',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Music Production - Alternative to Ableton
  {
    name: 'Audacity',
    website: 'https://www.audacityteam.org',
    github: 'https://github.com/audacity/audacity',
    short_description: 'Free audio software for recording and editing',
    long_description: 'Audacity is a free, open-source, cross-platform audio software. It is used for recording and editing sounds with multi-track editing and various effects.',
    alternative_to: 'Adobe Audition',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'LMMS',
    website: 'https://lmms.io',
    github: 'https://github.com/LMMS/lmms',
    short_description: 'Cross-platform music production software',
    long_description: 'LMMS is a free cross-platform digital audio workstation. It allows you to produce music with your computer, including creating melodies and beats with synthesizers and samples.',
    alternative_to: 'FL Studio',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Ardour',
    website: 'https://ardour.org',
    github: 'https://github.com/Ardour/ardour',
    short_description: 'Digital audio workstation',
    long_description: 'Ardour is a hard disk recorder and digital audio workstation application. It is designed for professional use with unlimited audio tracks and MIDI support.',
    alternative_to: 'Pro Tools',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },
  {
    name: 'MuseScore',
    website: 'https://musescore.org',
    github: 'https://github.com/musescore/MuseScore',
    short_description: 'Free music notation software',
    long_description: 'MuseScore is a free and open-source music notation software. It allows you to create, play, and print beautiful sheet music with a professional-grade interface.',
    alternative_to: 'Sibelius',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },

  // 3D Modeling - Alternative to Blender competitors
  {
    name: 'Blender',
    website: 'https://www.blender.org',
    github: 'https://github.com/blender/blender',
    short_description: 'Free 3D creation suite',
    long_description: 'Blender is a free and open-source 3D creation suite. It supports the entirety of the 3D pipeline including modeling, rigging, animation, simulation, rendering, and video editing.',
    alternative_to: 'Maya',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'FreeCAD',
    website: 'https://www.freecad.org',
    github: 'https://github.com/FreeCAD/FreeCAD',
    short_description: 'Open-source parametric 3D CAD modeler',
    long_description: 'FreeCAD is an open-source parametric 3D CAD modeler. It is designed for mechanical engineering and product design with parametric modeling capabilities.',
    alternative_to: 'AutoCAD',
    is_self_hosted: false,
    license: 'LGPL-2.0 License'
  },
  {
    name: 'OpenSCAD',
    website: 'https://openscad.org',
    github: 'https://github.com/openscad/openscad',
    short_description: 'Programmers solid 3D CAD modeler',
    long_description: 'OpenSCAD is a software for creating solid 3D CAD objects. It uses a script-based approach where 3D models are created by writing code rather than interactive modeling.',
    alternative_to: 'SolidWorks',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },

  // VPN - Alternative to NordVPN
  {
    name: 'WireGuard',
    website: 'https://www.wireguard.com',
    github: 'https://github.com/WireGuard/wireguard-linux',
    short_description: 'Fast and modern VPN protocol',
    long_description: 'WireGuard is an extremely simple yet fast and modern VPN. It aims to be faster, simpler, and leaner than IPsec while avoiding the massive headache.',
    alternative_to: 'OpenVPN',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Tailscale',
    website: 'https://tailscale.com',
    github: 'https://github.com/tailscale/tailscale',
    short_description: 'Zero config VPN using WireGuard',
    long_description: 'Tailscale is a zero config VPN that creates a secure network between your servers, computers, and cloud instances. It uses WireGuard under the hood.',
    alternative_to: 'Corporate VPN',
    is_self_hosted: false,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Netbird',
    website: 'https://netbird.io',
    github: 'https://github.com/netbirdio/netbird',
    short_description: 'WireGuard-based mesh network',
    long_description: 'NetBird is an open-source platform that combines WireGuard mesh network and access control in a single platform. It creates secure private networks.',
    alternative_to: 'Tailscale',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Headscale',
    website: 'https://github.com/juanfont/headscale',
    github: 'https://github.com/juanfont/headscale',
    short_description: 'Self-hosted Tailscale control server',
    long_description: 'Headscale is an open-source, self-hosted implementation of the Tailscale control server. It allows you to run your own Tailscale-like service.',
    alternative_to: 'Tailscale',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },

  // Backup - Alternative to Backblaze
  {
    name: 'Restic',
    website: 'https://restic.net',
    github: 'https://github.com/restic/restic',
    short_description: 'Fast, secure, efficient backup program',
    long_description: 'Restic is a modern backup program that can back up your files. It supports multiple backends including local, SFTP, and cloud storage with deduplication and encryption.',
    alternative_to: 'Backblaze',
    is_self_hosted: true,
    license: 'BSD-2-Clause License'
  },
  {
    name: 'BorgBackup',
    website: 'https://www.borgbackup.org',
    github: 'https://github.com/borgbackup/borg',
    short_description: 'Deduplicating archiver with compression',
    long_description: 'BorgBackup is a deduplicating backup program. It provides efficient and secure backup with compression and authenticated encryption.',
    alternative_to: 'Backblaze',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Duplicati',
    website: 'https://www.duplicati.com',
    github: 'https://github.com/duplicati/duplicati',
    short_description: 'Free backup software with encryption',
    long_description: 'Duplicati is a free, open source, backup client that securely stores encrypted, incremental, compressed backups on cloud storage services and remote file servers.',
    alternative_to: 'Backblaze',
    is_self_hosted: true,
    license: 'LGPL-2.1 License'
  },
  {
    name: 'Kopia',
    website: 'https://kopia.io',
    github: 'https://github.com/kopia/kopia',
    short_description: 'Fast and secure backup tool',
    long_description: 'Kopia is a simple, cross-platform tool for managing encrypted backups in the cloud. It supports compression, deduplication, and client-side encryption.',
    alternative_to: 'Backblaze',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // DNS - Alternative to Cloudflare DNS
  {
    name: 'Pi-hole',
    website: 'https://pi-hole.net',
    github: 'https://github.com/pi-hole/pi-hole',
    short_description: 'Network-wide ad blocking',
    long_description: 'Pi-hole is a network-wide ad blocker that acts as a DNS sinkhole. It protects your devices from unwanted content without installing any client-side software.',
    alternative_to: 'Cloudflare DNS',
    is_self_hosted: true,
    license: 'EUPL-1.2 License'
  },
  {
    name: 'AdGuard Home',
    website: 'https://adguard.com/adguard-home.html',
    github: 'https://github.com/AdguardTeam/AdGuardHome',
    short_description: 'Network-wide software for blocking ads',
    long_description: 'AdGuard Home is a network-wide software for blocking ads and tracking. It operates as a DNS server that re-routes tracking domains to a black hole.',
    alternative_to: 'Pi-hole',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Blocky',
    website: 'https://0xerr0r.github.io/blocky',
    github: 'https://github.com/0xERR0R/blocky',
    short_description: 'Fast DNS proxy as ad-blocker',
    long_description: 'Blocky is a DNS proxy and ad-blocker for the local network written in Go. It is lightweight and works as a drop-in replacement for Pi-hole.',
    alternative_to: 'Pi-hole',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Reverse Proxy - Alternative to Nginx Plus
  {
    name: 'Traefik',
    website: 'https://traefik.io',
    github: 'https://github.com/traefik/traefik',
    short_description: 'Cloud native application proxy',
    long_description: 'Traefik is a modern HTTP reverse proxy and load balancer that makes deploying microservices easy. It integrates with your existing infrastructure components.',
    alternative_to: 'Nginx Plus',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Caddy',
    website: 'https://caddyserver.com',
    github: 'https://github.com/caddyserver/caddy',
    short_description: 'Fast multi-platform web server',
    long_description: 'Caddy is a powerful, enterprise-ready web server with automatic HTTPS. It is the first and only web server to use HTTPS automatically and by default.',
    alternative_to: 'Nginx',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'HAProxy',
    website: 'https://www.haproxy.org',
    github: 'https://github.com/haproxy/haproxy',
    short_description: 'Reliable high performance TCP/HTTP load balancer',
    long_description: 'HAProxy is a free, very fast and reliable reverse-proxy offering high availability, load balancing, and proxying for TCP and HTTP-based applications.',
    alternative_to: 'Nginx Plus',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Nginx Proxy Manager',
    website: 'https://nginxproxymanager.com',
    github: 'https://github.com/NginxProxyManager/nginx-proxy-manager',
    short_description: 'Docker reverse proxy with web UI',
    long_description: 'Nginx Proxy Manager enables you to easily forward to your websites running at home or otherwise. It provides a simple interface for managing Nginx proxy hosts.',
    alternative_to: 'Nginx Plus',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Email Server - Alternative to Gmail
  {
    name: 'Mailcow',
    website: 'https://mailcow.email',
    github: 'https://github.com/mailcow/mailcow-dockerized',
    short_description: 'Dockerized email server suite',
    long_description: 'mailcow is a fully dockerized email server solution. It includes mailbox management, webmail, antispam, antivirus, and complete email stack in one.',
    alternative_to: 'G Suite',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Mailu',
    website: 'https://mailu.io',
    github: 'https://github.com/Mailu/Mailu',
    short_description: 'Simple yet full-featured mail server',
    long_description: 'Mailu is a simple yet full-featured mail server as a set of Docker images. It includes SMTP, IMAP, antispam, antivirus, and webmail components.',
    alternative_to: 'G Suite',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Mail-in-a-Box',
    website: 'https://mailinabox.email',
    github: 'https://github.com/mail-in-a-box/mailinabox',
    short_description: 'Easy-to-deploy mail server',
    long_description: 'Mail-in-a-Box lets you become your own mail service provider in a few easy steps. It turns a fresh cloud computer into a working mail server.',
    alternative_to: 'G Suite',
    is_self_hosted: true,
    license: 'CC0-1.0 License'
  },

  // Email Client - Alternative to Outlook
  {
    name: 'Thunderbird',
    website: 'https://www.thunderbird.net',
    github: 'https://github.com/nickytonline/Thunderbird',
    short_description: 'Free email application',
    long_description: 'Thunderbird is a free email application that is easy to set up and customize. It provides email, calendar, chat, and newsgroup client capabilities.',
    alternative_to: 'Outlook',
    is_self_hosted: false,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Mailspring',
    website: 'https://getmailspring.com',
    github: 'https://github.com/Foundry376/Mailspring',
    short_description: 'Beautiful fast email client',
    long_description: 'Mailspring is a beautiful, fast, and maintained email client. It features a modern interface, unified inbox, and advanced features like snooze and send later.',
    alternative_to: 'Outlook',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },

  // Dashboard - Alternative to Datadog Dashboard
  {
    name: 'Heimdall',
    website: 'https://heimdall.site',
    github: 'https://github.com/linuxserver/Heimdall',
    short_description: 'Application dashboard and launcher',
    long_description: 'Heimdall is an elegant solution to organise all your web applications. It is a dashboard for all your web applications with enhanced features.',
    alternative_to: 'Browser Bookmarks',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Homarr',
    website: 'https://homarr.dev',
    github: 'https://github.com/ajnart/homarr',
    short_description: 'Customizable dashboard for home server',
    long_description: 'Homarr is a customizable browser home page to interact with your homeserver Docker containers. It integrates with many services for real-time status.',
    alternative_to: 'Browser Bookmarks',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Dashy',
    website: 'https://dashy.to',
    github: 'https://github.com/Lissy93/dashy',
    short_description: 'Self-hostable personal dashboard',
    long_description: 'Dashy is an open source, highly customizable, easy to use, privacy-respecting dashboard app. It helps you organize your self-hosted services and applications.',
    alternative_to: 'Browser Bookmarks',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Homer',
    website: 'https://github.com/bastienwirtz/homer',
    github: 'https://github.com/bastienwirtz/homer',
    short_description: 'Simple static homepage for server',
    long_description: 'Homer is a dead simple static homepage for your server to keep your services on hand. It is a fully static, yaml-configured homepage.',
    alternative_to: 'Browser Bookmarks',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Password Generator - Alternative to 1Password Generator
  {
    name: 'Diceware',
    website: 'https://diceware.dmuth.org',
    github: 'https://github.com/dmuth/diceware',
    short_description: 'Passphrase generator using dice',
    long_description: 'Diceware is a method for creating passphrases, passwords, and other cryptographic variables using ordinary dice as a hardware random number generator.',
    alternative_to: '1Password',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },

  // Screenshot Tool - Alternative to Snagit
  {
    name: 'Flameshot',
    website: 'https://flameshot.org',
    github: 'https://github.com/flameshot-org/flameshot',
    short_description: 'Powerful screenshot software',
    long_description: 'Flameshot is a powerful yet simple to use screenshot software. It features an in-app screenshot editing mode, customizable appearance, and DBus interface.',
    alternative_to: 'Snagit',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'ShareX',
    website: 'https://getsharex.com',
    github: 'https://github.com/ShareX/ShareX',
    short_description: 'Screen capture and file sharing tool',
    long_description: 'ShareX is a free and open source program that lets you capture or record any area of your screen and share it with a single press of a key.',
    alternative_to: 'Snagit',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },

  // Note App - Additional
  {
    name: 'Standard Notes',
    website: 'https://standardnotes.com',
    github: 'https://github.com/standardnotes/app',
    short_description: 'End-to-end encrypted note-taking',
    long_description: 'Standard Notes is a safe place for your notes, thoughts, and life work. It provides end-to-end encryption, cross-platform sync, and 100% privacy.',
    alternative_to: 'Evernote',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Notesnook',
    website: 'https://notesnook.com',
    github: 'https://github.com/streetwriters/notesnook',
    short_description: 'Open-source private note-taking',
    long_description: 'Notesnook is an end-to-end encrypted note taking alternative to Evernote. It offers zero-knowledge encryption and cross-platform synchronization.',
    alternative_to: 'Evernote',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'SiYuan',
    website: 'https://b3log.org/siyuan',
    github: 'https://github.com/siyuan-note/siyuan',
    short_description: 'Privacy-first personal knowledge management',
    long_description: 'SiYuan is a privacy-first personal knowledge management system that supports block-level references and bidirectional links. It stores notes locally with end-to-end encryption.',
    alternative_to: 'Notion',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Obsidian',
    website: 'https://obsidian.md',
    github: 'https://github.com/obsidianmd',
    short_description: 'Knowledge base on local markdown files',
    long_description: 'Obsidian is a powerful knowledge base that works on top of a local folder of plain text Markdown files. It features linking, graph view, and extensive plugins.',
    alternative_to: 'Notion',
    is_self_hosted: true,
    license: 'Proprietary (Free)'
  },
  {
    name: 'Anytype',
    website: 'https://anytype.io',
    github: 'https://github.com/anyproto/anytype-ts',
    short_description: 'Local-first Notion alternative',
    long_description: 'Anytype is a local-first, E2E encrypted knowledge management app. It allows you to create objects that can be databases, documents, or anything you need.',
    alternative_to: 'Notion',
    is_self_hosted: true,
    license: 'Any License'
  },

  // API Gateway - Alternative to AWS API Gateway
  {
    name: 'Kong',
    website: 'https://konghq.com',
    github: 'https://github.com/Kong/kong',
    short_description: 'Cloud-native API gateway',
    long_description: 'Kong is a cloud-native, fast, scalable, and distributed API gateway. It runs in front of any RESTful API and provides logging, authentication, and rate limiting.',
    alternative_to: 'AWS API Gateway',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Tyk',
    website: 'https://tyk.io',
    github: 'https://github.com/TykTechnologies/tyk',
    short_description: 'Open-source API and service management',
    long_description: 'Tyk is an open source API gateway that is fast, scalable, and modern. It provides API management features including rate limiting, authentication, and analytics.',
    alternative_to: 'AWS API Gateway',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'KrakenD',
    website: 'https://www.krakend.io',
    github: 'https://github.com/krakend/krakend-ce',
    short_description: 'Ultra performant API gateway',
    long_description: 'KrakenD is an open-source API gateway that aggregates multiple data sources into a single endpoint. It focuses on performance and efficiency.',
    alternative_to: 'AWS API Gateway',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Queue - Alternative to AWS SQS
  {
    name: 'RabbitMQ',
    website: 'https://www.rabbitmq.com',
    github: 'https://github.com/rabbitmq/rabbitmq-server',
    short_description: 'Open-source message broker',
    long_description: 'RabbitMQ is the most widely deployed open source message broker. It supports multiple messaging protocols and can be deployed in distributed and federated configurations.',
    alternative_to: 'AWS SQS',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Apache Kafka',
    website: 'https://kafka.apache.org',
    github: 'https://github.com/apache/kafka',
    short_description: 'Distributed event streaming platform',
    long_description: 'Apache Kafka is an open-source distributed event streaming platform. It is used for high-performance data pipelines, streaming analytics, and data integration.',
    alternative_to: 'AWS Kinesis',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'NATS',
    website: 'https://nats.io',
    github: 'https://github.com/nats-io/nats-server',
    short_description: 'Cloud and edge messaging system',
    long_description: 'NATS is a connective technology for adaptive edge and distributed systems. It provides simple, secure, and high-performance communications for microservices.',
    alternative_to: 'AWS SQS',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'BullMQ',
    website: 'https://bullmq.io',
    github: 'https://github.com/taskforcesh/bullmq',
    short_description: 'Fast and robust queue for Node.js',
    long_description: 'BullMQ is a Node.js library that implements a fast and robust queue system built on top of Redis. It supports delayed jobs, retries, and priority queues.',
    alternative_to: 'AWS SQS',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Scheduled Jobs - Alternative to AWS CloudWatch Events
  {
    name: 'Ofelia',
    website: 'https://github.com/mcuadros/ofelia',
    github: 'https://github.com/mcuadros/ofelia',
    short_description: 'Docker job scheduler',
    long_description: 'Ofelia is a job scheduler for Docker containers. It allows you to run jobs in Docker containers based on time or events with cron-like scheduling.',
    alternative_to: 'AWS CloudWatch Events',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Airflow',
    website: 'https://airflow.apache.org',
    github: 'https://github.com/apache/airflow',
    short_description: 'Platform to programmatically author workflows',
    long_description: 'Apache Airflow is a platform to programmatically author, schedule, and monitor workflows. It allows you to create complex data pipelines as directed acyclic graphs.',
    alternative_to: 'AWS Step Functions',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Temporal',
    website: 'https://temporal.io',
    github: 'https://github.com/temporalio/temporal',
    short_description: 'Durable execution platform',
    long_description: 'Temporal is a durable execution platform that simplifies coding for resilience. It maintains state and handles failures automatically for complex workflows.',
    alternative_to: 'AWS Step Functions',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Function as a Service - Alternative to AWS Lambda
  {
    name: 'OpenFaaS',
    website: 'https://www.openfaas.com',
    github: 'https://github.com/openfaas/faas',
    short_description: 'Serverless functions made simple',
    long_description: 'OpenFaaS makes it easy to deploy event-driven functions and microservices to Kubernetes without repetitive boilerplate coding. It supports any language.',
    alternative_to: 'AWS Lambda',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Knative',
    website: 'https://knative.dev',
    github: 'https://github.com/knative/serving',
    short_description: 'Kubernetes-based serverless platform',
    long_description: 'Knative is a Kubernetes-based platform to deploy and manage modern serverless workloads. It provides event-driven scale-to-zero capabilities.',
    alternative_to: 'AWS Lambda',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Fission',
    website: 'https://fission.io',
    github: 'https://github.com/fission/fission',
    short_description: 'Fast serverless functions for Kubernetes',
    long_description: 'Fission is a fast serverless framework for Kubernetes with a focus on developer productivity and high performance. It provides instant cold starts.',
    alternative_to: 'AWS Lambda',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Infrastructure as Code - Alternative to Terraform
  {
    name: 'Pulumi',
    website: 'https://www.pulumi.com',
    github: 'https://github.com/pulumi/pulumi',
    short_description: 'Infrastructure as Code in any language',
    long_description: 'Pulumi is an open-source infrastructure as code tool that lets you define and deploy cloud infrastructure using programming languages like Python, TypeScript, and Go.',
    alternative_to: 'Terraform',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'OpenTofu',
    website: 'https://opentofu.org',
    github: 'https://github.com/opentofu/opentofu',
    short_description: 'Open-source Terraform fork',
    long_description: 'OpenTofu is a fork of Terraform that is open-source, community-driven, and managed by the Linux Foundation. It provides feature compatibility with Terraform.',
    alternative_to: 'Terraform',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Crossplane',
    website: 'https://www.crossplane.io',
    github: 'https://github.com/crossplane/crossplane',
    short_description: 'Cloud native control plane',
    long_description: 'Crossplane is an open source Kubernetes extension that transforms your Kubernetes cluster into a universal control plane for managing cloud resources.',
    alternative_to: 'Terraform',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Service Mesh - Alternative to Istio
  {
    name: 'Linkerd',
    website: 'https://linkerd.io',
    github: 'https://github.com/linkerd/linkerd2',
    short_description: 'Ultralight service mesh for Kubernetes',
    long_description: 'Linkerd is an ultralight, security-first service mesh for Kubernetes. It gives you observability, reliability, and security without requiring code changes.',
    alternative_to: 'Istio',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Consul',
    website: 'https://www.consul.io',
    github: 'https://github.com/hashicorp/consul',
    short_description: 'Service mesh and service discovery',
    long_description: 'HashiCorp Consul is a distributed, highly available solution providing service discovery, configuration, and segmentation across multi-cloud environments.',
    alternative_to: 'Istio',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },

  // Content Delivery - Alternative to Cloudflare
  {
    name: 'Varnish',
    website: 'https://varnish-cache.org',
    github: 'https://github.com/varnishcache/varnish-cache',
    short_description: 'High-performance HTTP accelerator',
    long_description: 'Varnish Cache is a web application accelerator also known as a caching HTTP reverse proxy. It is designed specifically for content-heavy dynamic websites.',
    alternative_to: 'Cloudflare',
    is_self_hosted: true,
    license: 'BSD-2-Clause License'
  },

  // Incident Management - Alternative to PagerDuty
  {
    name: 'Grafana OnCall',
    website: 'https://grafana.com/products/oncall',
    github: 'https://github.com/grafana/oncall',
    short_description: 'Open-source incident management',
    long_description: 'Grafana OnCall is an easy-to-use on-call management tool. It provides schedules, escalations, and integrations with popular monitoring tools for incident response.',
    alternative_to: 'PagerDuty',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Keep',
    website: 'https://www.keephq.dev',
    github: 'https://github.com/keephq/keep',
    short_description: 'Open-source alerting tool',
    long_description: 'Keep is an open-source alerting tool. It allows you to write alerting workflows for all your tools in a single place with no code required.',
    alternative_to: 'PagerDuty',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Log Viewer - Alternative to Logtail
  {
    name: 'GoAccess',
    website: 'https://goaccess.io',
    github: 'https://github.com/allinurl/goaccess',
    short_description: 'Real-time web log analyzer',
    long_description: 'GoAccess is an open source real-time web log analyzer and interactive viewer. It analyzes Apache, Nginx, and other web server logs in the terminal or browser.',
    alternative_to: 'Logtail',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Vector',
    website: 'https://vector.dev',
    github: 'https://github.com/vectordotdev/vector',
    short_description: 'High-performance observability pipeline',
    long_description: 'Vector is a high-performance observability data pipeline that collects, transforms, and routes logs and metrics. It is written in Rust for speed and reliability.',
    alternative_to: 'Logstash',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },

  // Business Intelligence - Additional
  {
    name: 'Metabase',
    website: 'https://www.metabase.com',
    github: 'https://github.com/metabase/metabase',
    short_description: 'Business intelligence for everyone',
    long_description: 'Metabase is the easy, open-source way for everyone to ask questions and learn from data. It provides dashboards, SQL queries, and data exploration tools.',
    alternative_to: 'Tableau',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Apache Superset',
    website: 'https://superset.apache.org',
    github: 'https://github.com/apache/superset',
    short_description: 'Modern data exploration and visualization',
    long_description: 'Apache Superset is a modern data exploration and visualization platform. It provides an intuitive interface to slice, dice, and visualize data.',
    alternative_to: 'Tableau',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Redash',
    website: 'https://redash.io',
    github: 'https://github.com/getredash/redash',
    short_description: 'Connect to any data source',
    long_description: 'Redash is designed to enable anyone to leverage the power of data. It lets you connect to any data source, easily visualize and share your data.',
    alternative_to: 'Tableau',
    is_self_hosted: true,
    license: 'BSD-2-Clause License'
  },
  {
    name: 'Lightdash',
    website: 'https://www.lightdash.com',
    github: 'https://github.com/lightdash/lightdash',
    short_description: 'Open-source BI for dbt users',
    long_description: 'Lightdash is an open-source BI tool built for dbt users. It connects directly to your dbt project and provides a clean interface for data exploration.',
    alternative_to: 'Looker',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // ============ NEXT 200 ALTERNATIVES ============

  // Web Scraping - Alternative to ScrapingBee
  {
    name: 'Scrapy',
    website: 'https://scrapy.org',
    github: 'https://github.com/scrapy/scrapy',
    short_description: 'Fast web crawling framework',
    long_description: 'Scrapy is an open source and collaborative framework for extracting data from websites. It provides a fast high-level web crawling and web scraping framework.',
    alternative_to: 'ScrapingBee',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Crawlee',
    website: 'https://crawlee.dev',
    github: 'https://github.com/apify/crawlee',
    short_description: 'Web scraping and browser automation library',
    long_description: 'Crawlee is a web scraping and browser automation library. It helps you build reliable crawlers with automatic scaling, proxy rotation, and session management.',
    alternative_to: 'ScrapingBee',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Playwright',
    website: 'https://playwright.dev',
    github: 'https://github.com/microsoft/playwright',
    short_description: 'Browser automation library',
    long_description: 'Playwright enables reliable end-to-end testing and web scraping for modern web apps. It supports all modern browsers and provides a single API.',
    alternative_to: 'Selenium',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Puppeteer',
    website: 'https://pptr.dev',
    github: 'https://github.com/puppeteer/puppeteer',
    short_description: 'Headless Chrome Node.js API',
    long_description: 'Puppeteer is a Node.js library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. It can be used for web scraping and testing.',
    alternative_to: 'Selenium',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // PDF Generation - Alternative to DocRaptor
  {
    name: 'Gotenberg',
    website: 'https://gotenberg.dev',
    github: 'https://github.com/gotenberg/gotenberg',
    short_description: 'Docker-powered stateless API for PDF files',
    long_description: 'Gotenberg is a Docker-powered stateless API for PDF files. It provides a simple API for converting HTML, Markdown, and Office documents to PDF.',
    alternative_to: 'DocRaptor',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'WeasyPrint',
    website: 'https://weasyprint.org',
    github: 'https://github.com/Kozea/WeasyPrint',
    short_description: 'Visual rendering engine for HTML and CSS',
    long_description: 'WeasyPrint is a visual rendering engine for HTML and CSS that can export to PDF. It aims at supporting web standards for printing.',
    alternative_to: 'DocRaptor',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'wkhtmltopdf',
    website: 'https://wkhtmltopdf.org',
    github: 'https://github.com/wkhtmltopdf/wkhtmltopdf',
    short_description: 'Command line tool to render HTML to PDF',
    long_description: 'wkhtmltopdf and wkhtmltoimage are open source command line tools to render HTML into PDF and various image formats using Qt WebKit.',
    alternative_to: 'DocRaptor',
    is_self_hosted: true,
    license: 'LGPL-3.0 License'
  },

  // Data Pipeline - Alternative to Fivetran
  {
    name: 'Airbyte',
    website: 'https://airbyte.com',
    github: 'https://github.com/airbytehq/airbyte',
    short_description: 'Data integration platform for ELT pipelines',
    long_description: 'Airbyte is an open-source data integration platform that syncs data from applications, APIs, and databases to warehouses, lakes, and other destinations.',
    alternative_to: 'Fivetran',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Meltano',
    website: 'https://meltano.com',
    github: 'https://github.com/meltano/meltano',
    short_description: 'DataOps for the modern data stack',
    long_description: 'Meltano is an open source platform for building, running, and managing ELT pipelines. It provides a CLI-first approach with version control and CI/CD.',
    alternative_to: 'Fivetran',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Singer',
    website: 'https://www.singer.io',
    github: 'https://github.com/singer-io/getting-started',
    short_description: 'Open-source standard for data extraction',
    long_description: 'Singer is an open-source standard for writing scripts that move data. It provides taps and targets for extracting and loading data between systems.',
    alternative_to: 'Fivetran',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'dbt',
    website: 'https://www.getdbt.com',
    github: 'https://github.com/dbt-labs/dbt-core',
    short_description: 'Data transformation tool',
    long_description: 'dbt (data build tool) enables analytics engineers to transform data in their warehouses by simply writing select statements. It handles the T in ELT.',
    alternative_to: 'Informatica',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Data Warehouse - Alternative to Snowflake
  {
    name: 'ClickHouse',
    website: 'https://clickhouse.com',
    github: 'https://github.com/ClickHouse/ClickHouse',
    short_description: 'Fast open-source column-oriented DBMS',
    long_description: 'ClickHouse is an open-source column-oriented database management system that allows generating analytical data reports in real-time using SQL queries.',
    alternative_to: 'Snowflake',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Apache Druid',
    website: 'https://druid.apache.org',
    github: 'https://github.com/apache/druid',
    short_description: 'Real-time analytics database',
    long_description: 'Apache Druid is a high performance real-time analytics database. It is designed for workflows where fast queries and ingest really matter.',
    alternative_to: 'Snowflake',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'StarRocks',
    website: 'https://www.starrocks.io',
    github: 'https://github.com/StarRocks/starrocks',
    short_description: 'High-performance analytical database',
    long_description: 'StarRocks is a next-gen sub-second MPP database for full analytics scenarios, including multi-dimensional analytics, real-time analytics, and ad-hoc query.',
    alternative_to: 'Snowflake',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Apache Doris',
    website: 'https://doris.apache.org',
    github: 'https://github.com/apache/doris',
    short_description: 'Real-time analytical database',
    long_description: 'Apache Doris is a high-performance, real-time analytical database based on MPP architecture, known for its extreme speed and ease of use.',
    alternative_to: 'Snowflake',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Testing Framework - Alternative to Cypress
  {
    name: 'Playwright Test',
    website: 'https://playwright.dev/docs/test-intro',
    github: 'https://github.com/microsoft/playwright',
    short_description: 'Cross-browser end-to-end testing',
    long_description: 'Playwright Test is a test runner built for end-to-end testing. It provides cross-browser testing, auto-wait, and powerful tooling for debugging.',
    alternative_to: 'Cypress',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'TestCafe',
    website: 'https://testcafe.io',
    github: 'https://github.com/DevExpress/testcafe',
    short_description: 'Node.js end-to-end testing framework',
    long_description: 'TestCafe is a Node.js tool to automate end-to-end web testing. It runs on all platforms and supports all browsers without WebDriver.',
    alternative_to: 'Cypress',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Nightwatch.js',
    website: 'https://nightwatchjs.org',
    github: 'https://github.com/nightwatchjs/nightwatch',
    short_description: 'End-to-end testing framework',
    long_description: 'Nightwatch.js is an integrated, easy to use end-to-end testing solution for web applications. It uses the W3C WebDriver API.',
    alternative_to: 'Cypress',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Vitest',
    website: 'https://vitest.dev',
    github: 'https://github.com/vitest-dev/vitest',
    short_description: 'Blazing fast unit test framework',
    long_description: 'Vitest is a Vite-native unit test framework. It provides a Jest-compatible API with instant watch mode, out-of-box TypeScript support, and component testing.',
    alternative_to: 'Jest',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Load Testing - Alternative to LoadRunner
  {
    name: 'k6',
    website: 'https://k6.io',
    github: 'https://github.com/grafana/k6',
    short_description: 'Modern load testing tool',
    long_description: 'k6 is a modern load testing tool, using Go and JavaScript. It provides a developer-centric approach to performance testing with scripting in JavaScript.',
    alternative_to: 'LoadRunner',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Locust',
    website: 'https://locust.io',
    github: 'https://github.com/locustio/locust',
    short_description: 'Scalable load testing tool',
    long_description: 'Locust is an easy to use, scriptable and scalable performance testing tool. You define the behavior of your users in regular Python code.',
    alternative_to: 'LoadRunner',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Gatling',
    website: 'https://gatling.io',
    github: 'https://github.com/gatling/gatling',
    short_description: 'Modern load testing as code',
    long_description: 'Gatling is a powerful load testing solution for applications, APIs, and microservices. It uses Scala DSL for writing tests and provides real-time metrics.',
    alternative_to: 'LoadRunner',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Artillery',
    website: 'https://www.artillery.io',
    github: 'https://github.com/artilleryio/artillery',
    short_description: 'Cloud-scale load testing',
    long_description: 'Artillery is a modern, powerful, and easy-to-use load testing and functional testing toolkit. It supports HTTP, WebSocket, and Socket.io protocols.',
    alternative_to: 'LoadRunner',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },

  // Mocking - Alternative to Mockoon
  {
    name: 'WireMock',
    website: 'https://wiremock.org',
    github: 'https://github.com/wiremock/wiremock',
    short_description: 'API mocking tool',
    long_description: 'WireMock is a flexible API mocking tool for fast, robust and comprehensive testing. It can run as a standalone server or within your test suite.',
    alternative_to: 'Mockoon',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Prism',
    website: 'https://stoplight.io/open-source/prism',
    github: 'https://github.com/stoplightio/prism',
    short_description: 'API mock server from OpenAPI specs',
    long_description: 'Prism is an open-source HTTP mock server that can mimic your API behavior as if you already built it. It generates responses from your OpenAPI document.',
    alternative_to: 'Mockoon',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'MockServer',
    website: 'https://www.mock-server.com',
    github: 'https://github.com/mock-server/mockserver',
    short_description: 'Mock any server or service',
    long_description: 'MockServer enables easy mocking of any system you integrate with via HTTP or HTTPS. It can also proxy requests to record and playback behaviors.',
    alternative_to: 'Mockoon',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Schema Registry - Alternative to Confluent Schema Registry
  {
    name: 'Apicurio Registry',
    website: 'https://www.apicur.io/registry',
    github: 'https://github.com/Apicurio/apicurio-registry',
    short_description: 'API and schema registry',
    long_description: 'Apicurio Registry is an API and schema registry that enables storing, evolving, and retrieving API definitions and event schemas.',
    alternative_to: 'Confluent Schema Registry',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // API Documentation - Alternative to Readme.io
  {
    name: 'Swagger UI',
    website: 'https://swagger.io/tools/swagger-ui',
    github: 'https://github.com/swagger-api/swagger-ui',
    short_description: 'API documentation from OpenAPI specs',
    long_description: 'Swagger UI allows anyone to visualize and interact with API resources without having any implementation logic in place. It is automatically generated from OpenAPI specs.',
    alternative_to: 'Readme.io',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Redoc',
    website: 'https://redocly.com/redoc',
    github: 'https://github.com/Redocly/redoc',
    short_description: 'OpenAPI-generated API documentation',
    long_description: 'Redoc is an open-source tool for generating documentation from OpenAPI definitions. It provides a responsive three-panel documentation layout.',
    alternative_to: 'Readme.io',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Slate',
    website: 'https://slatedocs.github.io/slate',
    github: 'https://github.com/slatedocs/slate',
    short_description: 'Beautiful API documentation',
    long_description: 'Slate helps you create beautiful, intelligent, responsive API documentation. It uses markdown for writing docs with multiple programming language examples.',
    alternative_to: 'Readme.io',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Docusaurus',
    website: 'https://docusaurus.io',
    github: 'https://github.com/facebook/docusaurus',
    short_description: 'Easy to maintain documentation websites',
    long_description: 'Docusaurus is a project for building, deploying, and maintaining open source project websites easily. It supports documentation, blogs, and custom pages.',
    alternative_to: 'GitBook',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'MkDocs',
    website: 'https://www.mkdocs.org',
    github: 'https://github.com/mkdocs/mkdocs',
    short_description: 'Project documentation with Markdown',
    long_description: 'MkDocs is a fast, simple and downright gorgeous static site generator for building project documentation. Documentation source files are written in Markdown.',
    alternative_to: 'GitBook',
    is_self_hosted: true,
    license: 'BSD-2-Clause License'
  },
  {
    name: 'VuePress',
    website: 'https://vuepress.vuejs.org',
    github: 'https://github.com/vuejs/vuepress',
    short_description: 'Vue-powered static site generator',
    long_description: 'VuePress is a minimalistic static site generator with Vue-powered theming system. It is optimized for writing technical documentation.',
    alternative_to: 'GitBook',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Nextra',
    website: 'https://nextra.site',
    github: 'https://github.com/shuding/nextra',
    short_description: 'Next.js static site generator',
    long_description: 'Nextra is a Next.js based static site generator. It provides a clean documentation theme with full-text search and dark mode support.',
    alternative_to: 'GitBook',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Design System - Alternative to Figma Design System
  {
    name: 'Storybook',
    website: 'https://storybook.js.org',
    github: 'https://github.com/storybookjs/storybook',
    short_description: 'UI component development environment',
    long_description: 'Storybook is a development environment for UI components. It allows you to browse a component library, view different states, and interactively develop and test.',
    alternative_to: 'Figma Design System',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Chromatic',
    website: 'https://www.chromatic.com',
    github: 'https://github.com/chromaui/chromatic-cli',
    short_description: 'Visual testing for UI components',
    long_description: 'Chromatic is a visual testing and review tool that catches UI bugs. It integrates with Storybook to provide automated visual regression testing.',
    alternative_to: 'Percy',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Browser Extension Framework
  {
    name: 'Plasmo',
    website: 'https://www.plasmo.com',
    github: 'https://github.com/nickytonline/nickytonline/nickytonline',
    short_description: 'Browser extension framework',
    long_description: 'Plasmo is a browser extension framework that makes it easy to build production-ready browser extensions. It supports React, Vue, and Svelte.',
    alternative_to: 'Extension.js',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'WXT',
    website: 'https://wxt.dev',
    github: 'https://github.com/wxt-dev/wxt',
    short_description: 'Next-gen web extension framework',
    long_description: 'WXT is a next-generation web extension framework. It provides a Vite-based build system, auto-imports, and TypeScript support out of the box.',
    alternative_to: 'Extension.js',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Form Validation - Alternative to Formik
  {
    name: 'React Hook Form',
    website: 'https://react-hook-form.com',
    github: 'https://github.com/react-hook-form/react-hook-form',
    short_description: 'Performant forms with easy validation',
    long_description: 'React Hook Form is a performant, flexible, and extensible forms library with easy-to-use validation. It reduces the amount of code you need to write.',
    alternative_to: 'Formik',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Zod',
    website: 'https://zod.dev',
    github: 'https://github.com/colinhacks/zod',
    short_description: 'TypeScript-first schema validation',
    long_description: 'Zod is a TypeScript-first schema declaration and validation library. It is designed to be as developer-friendly as possible with zero dependencies.',
    alternative_to: 'Yup',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Valibot',
    website: 'https://valibot.dev',
    github: 'https://github.com/fabian-hiller/valibot',
    short_description: 'Modular schema validation library',
    long_description: 'Valibot is the modular and type-safe schema library for validating structural data. It has a bundle size of less than 1KB.',
    alternative_to: 'Yup',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // State Management - Alternative to Redux
  {
    name: 'Zustand',
    website: 'https://zustand-demo.pmnd.rs',
    github: 'https://github.com/pmndrs/zustand',
    short_description: 'Bear necessities for state management',
    long_description: 'Zustand is a small, fast, and scalable bearbones state-management solution. It has a simple API based on hooks with no boilerplate.',
    alternative_to: 'Redux',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Jotai',
    website: 'https://jotai.org',
    github: 'https://github.com/pmndrs/jotai',
    short_description: 'Primitive and flexible state management',
    long_description: 'Jotai takes an atomic approach to global React state management. It is inspired by Recoil and provides a minimalistic API.',
    alternative_to: 'Redux',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Valtio',
    website: 'https://valtio.pmnd.rs',
    github: 'https://github.com/pmndrs/valtio',
    short_description: 'Proxy-state made simple',
    long_description: 'Valtio makes proxy-state simple for React and Vanilla. It provides a minimalistic API for mutable state that automatically tracks changes.',
    alternative_to: 'MobX',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'XState',
    website: 'https://xstate.js.org',
    github: 'https://github.com/statelyai/xstate',
    short_description: 'State machines and statecharts',
    long_description: 'XState is a library for creating, interpreting, and executing finite state machines and statecharts. It provides a visualizer and testing utilities.',
    alternative_to: 'Redux',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Pinia',
    website: 'https://pinia.vuejs.org',
    github: 'https://github.com/vuejs/pinia',
    short_description: 'Intuitive Vue Store',
    long_description: 'Pinia is the officially recommended state management library for Vue. It provides a simpler API than Vuex with Composition API support and TypeScript support.',
    alternative_to: 'Vuex',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // CSS Framework - Alternative to Tailwind
  {
    name: 'UnoCSS',
    website: 'https://unocss.dev',
    github: 'https://github.com/unocss/unocss',
    short_description: 'Instant on-demand atomic CSS engine',
    long_description: 'UnoCSS is an instant on-demand atomic CSS engine. It is inspired by Tailwind CSS but with better performance and more flexibility.',
    alternative_to: 'Tailwind CSS',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Open Props',
    website: 'https://open-props.style',
    github: 'https://github.com/argyleink/open-props',
    short_description: 'CSS custom properties for design',
    long_description: 'Open Props is a collection of CSS custom properties to help accelerate adaptive and consistent design. It provides design tokens as CSS variables.',
    alternative_to: 'Tailwind CSS',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'PicoCSS',
    website: 'https://picocss.com',
    github: 'https://github.com/picocss/pico',
    short_description: 'Minimal CSS framework',
    long_description: 'Pico CSS is a minimal CSS framework for semantic HTML. It provides elegant styles for all native HTML elements without classes.',
    alternative_to: 'Bootstrap',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Bulma',
    website: 'https://bulma.io',
    github: 'https://github.com/jgthms/bulma',
    short_description: 'Modern CSS framework based on Flexbox',
    long_description: 'Bulma is a free, open source CSS framework based on Flexbox. It provides ready-to-use frontend components that you can easily combine.',
    alternative_to: 'Bootstrap',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Component Library - Alternative to Material UI
  {
    name: 'shadcn/ui',
    website: 'https://ui.shadcn.com',
    github: 'https://github.com/shadcn-ui/ui',
    short_description: 'Re-usable components built with Radix UI',
    long_description: 'shadcn/ui is a collection of re-usable components built using Radix UI and Tailwind CSS. It is not a component library but a collection of components you can copy and paste.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Radix UI',
    website: 'https://www.radix-ui.com',
    github: 'https://github.com/radix-ui/primitives',
    short_description: 'Unstyled accessible components',
    long_description: 'Radix UI is a low-level UI component library with a focus on accessibility, customization, and developer experience. Components are unstyled by default.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Headless UI',
    website: 'https://headlessui.com',
    github: 'https://github.com/tailwindlabs/headlessui',
    short_description: 'Unstyled accessible UI components',
    long_description: 'Headless UI is a set of completely unstyled, fully accessible UI components for React and Vue. It is designed to integrate with Tailwind CSS.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Ark UI',
    website: 'https://ark-ui.com',
    github: 'https://github.com/chakra-ui/ark',
    short_description: 'Headless component library',
    long_description: 'Ark UI is a headless component library that works with any styling solution. It provides unstyled, accessible components for React, Solid, and Vue.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Mantine',
    website: 'https://mantine.dev',
    github: 'https://github.com/mantinedev/mantine',
    short_description: 'Full featured React components library',
    long_description: 'Mantine is a fully featured React components library with 100+ hooks and components. It includes a notifications system, rich text editor, and more.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Chakra UI',
    website: 'https://chakra-ui.com',
    github: 'https://github.com/chakra-ui/chakra-ui',
    short_description: 'Simple, modular React component library',
    long_description: 'Chakra UI is a simple, modular and accessible component library that gives you the building blocks you need to build React applications.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'DaisyUI',
    website: 'https://daisyui.com',
    github: 'https://github.com/saadeghi/daisyui',
    short_description: 'Tailwind CSS component library',
    long_description: 'daisyUI is a Tailwind CSS component library that adds component classes to Tailwind CSS. It provides pure CSS components with no JavaScript required.',
    alternative_to: 'Bootstrap',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Park UI',
    website: 'https://park-ui.com',
    github: 'https://github.com/cschroeter/park-ui',
    short_description: 'Beautifully designed components',
    long_description: 'Park UI is a collection of beautifully designed components built on Ark UI. It provides styled components for multiple styling solutions.',
    alternative_to: 'Material UI',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Animation Library - Alternative to Framer Motion
  {
    name: 'GSAP',
    website: 'https://greensock.com/gsap',
    github: 'https://github.com/greensock/GSAP',
    short_description: 'Professional-grade JavaScript animation',
    long_description: 'GSAP is a robust JavaScript toolset for building high-performance animations. It works with CSS, SVG, canvas, React, Vue, and vanilla JavaScript.',
    alternative_to: 'Framer Motion',
    is_self_hosted: true,
    license: 'Standard License'
  },
  {
    name: 'Motion One',
    website: 'https://motion.dev',
    github: 'https://github.com/motiondivision/motionone',
    short_description: 'New animation library built on Web Animations API',
    long_description: 'Motion One is the smallest fully-featured animation library for the web. It uses the Web Animations API for hardware-accelerated animations.',
    alternative_to: 'Framer Motion',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Anime.js',
    website: 'https://animejs.com',
    github: 'https://github.com/juliangarnier/anime',
    short_description: 'Lightweight JavaScript animation library',
    long_description: 'anime.js is a lightweight JavaScript animation library with a simple API. It works with CSS properties, SVG, DOM attributes, and JavaScript objects.',
    alternative_to: 'Framer Motion',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Lottie',
    website: 'https://airbnb.io/lottie',
    github: 'https://github.com/airbnb/lottie-web',
    short_description: 'Render After Effects animations',
    long_description: 'Lottie is a library for Android, iOS, Web, and Windows that parses Adobe After Effects animations and renders them natively on mobile and on the web.',
    alternative_to: 'After Effects',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Auto Animate',
    website: 'https://auto-animate.formkit.com',
    github: 'https://github.com/formkit/auto-animate',
    short_description: 'Zero-config drop-in animation utility',
    long_description: 'AutoAnimate is a zero-config, drop-in animation utility that adds smooth transitions to your web app. It works with React, Vue, Svelte, and vanilla JS.',
    alternative_to: 'Framer Motion',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Chart Library - Alternative to Chart.js
  {
    name: 'Apache ECharts',
    website: 'https://echarts.apache.org',
    github: 'https://github.com/apache/echarts',
    short_description: 'Powerful charting and visualization library',
    long_description: 'Apache ECharts is a powerful, interactive charting and data visualization library for browser. It provides rich features for complex visualizations.',
    alternative_to: 'Highcharts',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Recharts',
    website: 'https://recharts.org',
    github: 'https://github.com/recharts/recharts',
    short_description: 'Composable charting library for React',
    long_description: 'Recharts is a composable charting library built on React components. It provides a declarative approach to building charts with D3 functions.',
    alternative_to: 'Chart.js',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Plotly.js',
    website: 'https://plotly.com/javascript',
    github: 'https://github.com/plotly/plotly.js',
    short_description: 'Open-source JavaScript graphing library',
    long_description: 'Plotly.js is a high-level, declarative charting library built on D3.js and stack.gl. It supports over 40 chart types including 3D charts and statistical graphs.',
    alternative_to: 'Highcharts',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Nivo',
    website: 'https://nivo.rocks',
    github: 'https://github.com/plouc/nivo',
    short_description: 'Rich data visualization components for React',
    long_description: 'Nivo provides supercharged React components to easily build dataviz apps. It is built on top of D3 and provides server-side rendering capability.',
    alternative_to: 'Chart.js',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Visx',
    website: 'https://airbnb.io/visx',
    github: 'https://github.com/airbnb/visx',
    short_description: 'Low-level visualization components',
    long_description: 'visx is a collection of low-level visualization primitives for React. It combines the power of D3 with the benefits of React component patterns.',
    alternative_to: 'D3.js',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Observable Plot',
    website: 'https://observablehq.com/plot',
    github: 'https://github.com/observablehq/plot',
    short_description: 'Exploratory data visualization library',
    long_description: 'Observable Plot is a JavaScript library for exploratory data visualization. It provides a concise API for common charts with a focus on analysis.',
    alternative_to: 'D3.js',
    is_self_hosted: true,
    license: 'ISC License'
  },

  // Table Library - Alternative to AG Grid
  {
    name: 'TanStack Table',
    website: 'https://tanstack.com/table',
    github: 'https://github.com/TanStack/table',
    short_description: 'Headless UI for building tables',
    long_description: 'TanStack Table is a headless UI library for building powerful tables. It is framework agnostic and supports React, Vue, Solid, and Svelte.',
    alternative_to: 'AG Grid',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Tabulator',
    website: 'http://tabulator.info',
    github: 'https://github.com/olifolkerd/tabulator',
    short_description: 'Interactive table generation library',
    long_description: 'Tabulator is an interactive table generation JavaScript library that allows you to create interactive tables in seconds from any HTML table, JavaScript array, or JSON data.',
    alternative_to: 'AG Grid',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Handsontable',
    website: 'https://handsontable.com',
    github: 'https://github.com/handsontable/handsontable',
    short_description: 'JavaScript data grid with spreadsheet UX',
    long_description: 'Handsontable is a JavaScript component that combines data grid features with spreadsheet-like UX. It provides data binding, validation, and more.',
    alternative_to: 'AG Grid',
    is_self_hosted: true,
    license: 'Custom License'
  },

  // Rich Text Editor - Alternative to TinyMCE
  {
    name: 'Tiptap',
    website: 'https://tiptap.dev',
    github: 'https://github.com/ueberdosis/tiptap',
    short_description: 'Headless rich-text editor framework',
    long_description: 'Tiptap is a headless, framework-agnostic rich-text editor that is customizable, extendable, and accessible. It is built on ProseMirror.',
    alternative_to: 'TinyMCE',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Lexical',
    website: 'https://lexical.dev',
    github: 'https://github.com/facebook/lexical',
    short_description: 'Extensible text editor framework',
    long_description: 'Lexical is an extensible JavaScript text editor framework that provides excellent reliability, accessibility, and performance. It was developed by Meta.',
    alternative_to: 'TinyMCE',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Quill',
    website: 'https://quilljs.com',
    github: 'https://github.com/quilljs/quill',
    short_description: 'Modern WYSIWYG editor',
    long_description: 'Quill is a free, open source WYSIWYG editor built for the modern web. It provides consistent behavior across browsers with rich API for customization.',
    alternative_to: 'TinyMCE',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Editor.js',
    website: 'https://editorjs.io',
    github: 'https://github.com/codex-team/editor.js',
    short_description: 'Block-styled editor with clean JSON output',
    long_description: 'Editor.js is a block-styled editor with clean JSON output. It provides a modular structure where each block is a separate plugin.',
    alternative_to: 'Medium Editor',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Slate',
    website: 'https://docs.slatejs.org',
    github: 'https://github.com/ianstormtaylor/slate',
    short_description: 'Completely customizable rich-text editor',
    long_description: 'Slate is a completely customizable framework for building rich text editors. It provides a set of primitives for building complex text editing interfaces.',
    alternative_to: 'TinyMCE',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'ProseMirror',
    website: 'https://prosemirror.net',
    github: 'https://github.com/ProseMirror/prosemirror',
    short_description: 'Toolkit for building rich-text editors',
    long_description: 'ProseMirror is a toolkit for building rich-text editors that are based on contenteditable. It provides a modular architecture and collaborative editing support.',
    alternative_to: 'TinyMCE',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Markdown Editor - Alternative to Typora
  {
    name: 'Mark Text',
    website: 'https://marktext.app',
    github: 'https://github.com/marktext/marktext',
    short_description: 'Simple and elegant markdown editor',
    long_description: 'Mark Text is a simple and elegant open-source markdown editor focused on speed and usability. It provides real-time preview and various editing modes.',
    alternative_to: 'Typora',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Zettlr',
    website: 'https://www.zettlr.com',
    github: 'https://github.com/Zettlr/Zettlr',
    short_description: 'Markdown editor for researchers',
    long_description: 'Zettlr is a markdown editor for the 21st century. It is designed for researchers and academics with features like Zettelkasten and citation support.',
    alternative_to: 'Typora',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },

  // Code Snippet Manager - Alternative to SnippetsLab
  {
    name: 'massCode',
    website: 'https://masscode.io',
    github: 'https://github.com/massCodeIO/massCode',
    short_description: 'Code snippets manager for developers',
    long_description: 'massCode is a free and open-source code snippets manager for developers. It provides syntax highlighting, folders, tags, and search functionality.',
    alternative_to: 'SnippetsLab',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Git GUI - Alternative to GitKraken
  {
    name: 'GitUI',
    website: 'https://github.com/extrawurst/gitui',
    github: 'https://github.com/extrawurst/gitui',
    short_description: 'Blazing fast terminal UI for git',
    long_description: 'GitUI provides you with the user experience and comfort of a git GUI but right in your terminal. It is blazing fast and written in Rust.',
    alternative_to: 'GitKraken',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Lazygit',
    website: 'https://github.com/jesseduffield/lazygit',
    github: 'https://github.com/jesseduffield/lazygit',
    short_description: 'Simple terminal UI for git commands',
    long_description: 'Lazygit is a simple terminal UI for git commands. It provides an intuitive interface for staging, committing, and managing branches.',
    alternative_to: 'GitKraken',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Fork',
    website: 'https://git-fork.com',
    github: 'https://github.com/nickytonline/fork',
    short_description: 'Fast and friendly git client',
    long_description: 'Fork is a fast and friendly git client for Mac and Windows. It provides a clean interface for managing repositories with advanced features.',
    alternative_to: 'GitKraken',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },
  {
    name: 'Sourcetree',
    website: 'https://www.sourcetreeapp.com',
    github: 'https://github.com/nickytonline/sourcetree',
    short_description: 'Free Git GUI from Atlassian',
    long_description: 'Sourcetree is a free Git client for Windows and Mac. It simplifies how you interact with your Git repositories with a beautiful interface.',
    alternative_to: 'GitKraken',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },

  // Database GUI - Alternative to TablePlus
  {
    name: 'DBeaver',
    website: 'https://dbeaver.io',
    github: 'https://github.com/dbeaver/dbeaver',
    short_description: 'Universal database tool',
    long_description: 'DBeaver is a free universal database tool and SQL client. It supports all popular databases including MySQL, PostgreSQL, SQLite, Oracle, and more.',
    alternative_to: 'TablePlus',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Beekeeper Studio',
    website: 'https://www.beekeeperstudio.io',
    github: 'https://github.com/beekeeper-studio/beekeeper-studio',
    short_description: 'Modern SQL editor and database manager',
    long_description: 'Beekeeper Studio is a modern, easy to use SQL editor and database manager. It is available for Linux, Mac, Windows, and has a beautiful dark theme.',
    alternative_to: 'TablePlus',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'DbGate',
    website: 'https://dbgate.org',
    github: 'https://github.com/dbgate/dbgate',
    short_description: 'Database manager for multiple databases',
    long_description: 'DbGate is a free and open-source database manager. It runs on Windows, Linux, Mac, and as a web application with support for MongoDB, PostgreSQL, MySQL, and more.',
    alternative_to: 'TablePlus',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Sqlectron',
    website: 'https://sqlectron.github.io',
    github: 'https://github.com/sqlectron/sqlectron-gui',
    short_description: 'Lightweight SQL client',
    long_description: 'Sqlectron is a simple and lightweight SQL client desktop with cross database and platform support. It provides a clean interface for database queries.',
    alternative_to: 'TablePlus',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Redis GUI - Alternative to RedisInsight
  {
    name: 'Redis Commander',
    website: 'https://joeferner.github.io/redis-commander',
    github: 'https://github.com/joeferner/redis-commander',
    short_description: 'Redis management tool',
    long_description: 'Redis Commander is a Node.js web management tool for Redis. It provides a web interface for viewing, editing, and managing Redis keys.',
    alternative_to: 'RedisInsight',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Another Redis Desktop Manager',
    website: 'https://goanother.com',
    github: 'https://github.com/qishibo/AnotherRedisDesktopManager',
    short_description: 'Faster Redis desktop manager',
    long_description: 'Another Redis Desktop Manager is a faster, better, and more stable Redis desktop manager. It works on Windows, Mac, and Linux.',
    alternative_to: 'RedisInsight',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // MongoDB GUI - Alternative to MongoDB Compass
  {
    name: 'Mongo Express',
    website: 'https://github.com/mongo-express/mongo-express',
    github: 'https://github.com/mongo-express/mongo-express',
    short_description: 'Web-based MongoDB admin interface',
    long_description: 'mongo-express is a web-based MongoDB admin interface written with Node.js and Express. It provides a simple way to manage MongoDB databases.',
    alternative_to: 'MongoDB Compass',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // S3 GUI - Alternative to Cyberduck
  {
    name: 'MinIO Console',
    website: 'https://min.io',
    github: 'https://github.com/minio/console',
    short_description: 'MinIO object browser and admin UI',
    long_description: 'MinIO Console is a rich user interface for MinIO and S3. It provides bucket management, file browser, and administrative features.',
    alternative_to: 'Cyberduck',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'S3 Browser',
    website: 'https://github.com/nickytonline/s3-browser',
    github: 'https://github.com/mickael-kerjean/filestash',
    short_description: 'Web file manager for S3',
    long_description: 'Filestash is a web client for S3, SFTP, FTP, and more. It provides a modern interface for managing files in various storage backends.',
    alternative_to: 'Cyberduck',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Docker GUI - Alternative to Docker Desktop
  {
    name: 'Portainer',
    website: 'https://www.portainer.io',
    github: 'https://github.com/portainer/portainer',
    short_description: 'Container management UI',
    long_description: 'Portainer is a lightweight container management UI for Docker, Swarm, Kubernetes, and ACI. It makes it easy to manage your containerized applications.',
    alternative_to: 'Docker Desktop',
    is_self_hosted: true,
    license: 'Zlib License'
  },
  {
    name: 'Lazydocker',
    website: 'https://github.com/jesseduffield/lazydocker',
    github: 'https://github.com/jesseduffield/lazydocker',
    short_description: 'Terminal UI for Docker',
    long_description: 'Lazydocker is a simple terminal UI for docker and docker-compose. It provides an intuitive interface for managing containers and images.',
    alternative_to: 'Docker Desktop',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Dockge',
    website: 'https://github.com/louislam/dockge',
    github: 'https://github.com/louislam/dockge',
    short_description: 'Self-hosted Docker Compose manager',
    long_description: 'Dockge is a fancy, easy-to-use, reactive self-hosted Docker Compose stack manager. It provides a web UI for managing docker-compose stacks.',
    alternative_to: 'Docker Desktop',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Yacht',
    website: 'https://yacht.sh',
    github: 'https://github.com/SelfhostedPro/Yacht',
    short_description: 'Container management UI',
    long_description: 'Yacht is a web interface for managing Docker containers with an emphasis on templating. It provides easy deployment of applications using templates.',
    alternative_to: 'Portainer',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Kubernetes GUI - Alternative to Lens
  {
    name: 'K9s',
    website: 'https://k9scli.io',
    github: 'https://github.com/derailed/k9s',
    short_description: 'Terminal UI for Kubernetes',
    long_description: 'K9s is a terminal-based UI to interact with Kubernetes clusters. It aims to make it easier to navigate, observe, and manage your applications.',
    alternative_to: 'Lens',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Headlamp',
    website: 'https://headlamp.dev',
    github: 'https://github.com/headlamp-k8s/headlamp',
    short_description: 'Kubernetes web UI',
    long_description: 'Headlamp is an easy-to-use and extensible Kubernetes web UI. It provides a clean interface for managing clusters with plugin support.',
    alternative_to: 'Lens',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Kubescape',
    website: 'https://kubescape.io',
    github: 'https://github.com/kubescape/kubescape',
    short_description: 'Kubernetes security platform',
    long_description: 'Kubescape is an open-source Kubernetes security platform. It provides risk analysis, security compliance, and misconfiguration scanning.',
    alternative_to: 'Snyk',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Security Scanner - Alternative to Snyk
  {
    name: 'Trivy',
    website: 'https://trivy.dev',
    github: 'https://github.com/aquasecurity/trivy',
    short_description: 'Comprehensive security scanner',
    long_description: 'Trivy is a comprehensive and versatile security scanner. It scans container images, file systems, Git repositories, and Kubernetes for vulnerabilities.',
    alternative_to: 'Snyk',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Grype',
    website: 'https://github.com/anchore/grype',
    github: 'https://github.com/anchore/grype',
    short_description: 'Vulnerability scanner for containers',
    long_description: 'Grype is a vulnerability scanner for container images and filesystems. It works with Syft to generate SBOMs and scan for vulnerabilities.',
    alternative_to: 'Snyk',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Semgrep',
    website: 'https://semgrep.dev',
    github: 'https://github.com/semgrep/semgrep',
    short_description: 'Fast static analysis tool',
    long_description: 'Semgrep is a fast, open-source static analysis tool for finding bugs and enforcing code standards. It supports 30+ languages and runs in CI/CD.',
    alternative_to: 'SonarQube',
    is_self_hosted: true,
    license: 'LGPL-2.1 License'
  },
  {
    name: 'SonarQube',
    website: 'https://www.sonarqube.org',
    github: 'https://github.com/SonarSource/sonarqube',
    short_description: 'Continuous code quality inspection',
    long_description: 'SonarQube is an open-source platform for continuous inspection of code quality. It performs static code analysis to detect bugs, code smells, and security vulnerabilities.',
    alternative_to: 'Codacy',
    is_self_hosted: true,
    license: 'LGPL-3.0 License'
  },
  {
    name: 'OWASP ZAP',
    website: 'https://www.zaproxy.org',
    github: 'https://github.com/zaproxy/zaproxy',
    short_description: 'Web app security scanner',
    long_description: 'OWASP ZAP is one of the world most popular free security tools. It automatically finds security vulnerabilities in web applications.',
    alternative_to: 'Burp Suite',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Nuclei',
    website: 'https://nuclei.projectdiscovery.io',
    github: 'https://github.com/projectdiscovery/nuclei',
    short_description: 'Fast vulnerability scanner',
    long_description: 'Nuclei is a fast and customizable vulnerability scanner based on simple YAML-based templates. It provides extensive community-contributed templates.',
    alternative_to: 'Burp Suite',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Dependency Management - Alternative to Renovate
  {
    name: 'Dependabot',
    website: 'https://github.com/features/security',
    github: 'https://github.com/dependabot/dependabot-core',
    short_description: 'Automated dependency updates',
    long_description: 'Dependabot is a tool that checks your dependency files for outdated requirements and opens pull requests to update them. It is integrated with GitHub.',
    alternative_to: 'Renovate',
    is_self_hosted: false,
    license: 'MIT License'
  },

  // Localization - Alternative to Lokalise
  {
    name: 'Tolgee',
    website: 'https://tolgee.io',
    github: 'https://github.com/tolgee/tolgee-platform',
    short_description: 'Open-source localization platform',
    long_description: 'Tolgee is an open-source localization platform that allows you to translate your application into any language. It provides in-context editing and CI/CD integration.',
    alternative_to: 'Lokalise',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Traduora',
    website: 'https://traduora.co',
    github: 'https://github.com/ever-co/ever-traduora',
    short_description: 'Translation management platform',
    long_description: 'Traduora is a translation management platform for teams. It provides a clean interface for managing translations with support for multiple file formats.',
    alternative_to: 'Lokalise',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Weblate',
    website: 'https://weblate.org',
    github: 'https://github.com/WeblateOrg/weblate',
    short_description: 'Web-based translation tool',
    long_description: 'Weblate is a web-based translation tool with tight version control integration. It provides continuous localization with automatic source changes detection.',
    alternative_to: 'Crowdin',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Accent',
    website: 'https://www.accent.reviews',
    github: 'https://github.com/mirego/accent',
    short_description: 'Open-source translation tool',
    long_description: 'Accent is an open-source, self-hosted, developer-oriented translation tool. It provides a simple interface for managing translations with review workflow.',
    alternative_to: 'Lokalise',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },

  // Email Testing - Alternative to Mailtrap
  {
    name: 'MailHog',
    website: 'https://github.com/mailhog/MailHog',
    github: 'https://github.com/mailhog/MailHog',
    short_description: 'Web and API based SMTP testing',
    long_description: 'MailHog is an email testing tool for developers. It captures emails sent to it and displays them in a web interface for testing.',
    alternative_to: 'Mailtrap',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Mailpit',
    website: 'https://mailpit.axllent.org',
    github: 'https://github.com/axllent/mailpit',
    short_description: 'Email testing tool with web UI',
    long_description: 'Mailpit is an email testing tool with a modern web interface. It is a drop-in replacement for MailHog with additional features.',
    alternative_to: 'Mailtrap',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Inbucket',
    website: 'https://www.inbucket.org',
    github: 'https://github.com/inbucket/inbucket',
    short_description: 'Disposable email testing server',
    long_description: 'Inbucket is a disposable email server for development. It accepts all email and stores them for web viewing or API retrieval.',
    alternative_to: 'Mailtrap',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // SMS Gateway - Alternative to Twilio
  {
    name: 'Fonoster',
    website: 'https://fonoster.com',
    github: 'https://github.com/fonoster/fonoster',
    short_description: 'Open-source alternative to Twilio',
    long_description: 'Fonoster is an open-source alternative to Twilio. It allows you to build voice applications using APIs for calling, messaging, and more.',
    alternative_to: 'Twilio',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Payment Gateway - Alternative to Stripe
  {
    name: 'BTCPay Server',
    website: 'https://btcpayserver.org',
    github: 'https://github.com/btcpayserver/btcpayserver',
    short_description: 'Self-hosted Bitcoin payment processor',
    long_description: 'BTCPay Server is a self-hosted, open-source cryptocurrency payment processor. It is secure, private, and censorship-resistant.',
    alternative_to: 'Stripe',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Hyperswitch',
    website: 'https://hyperswitch.io',
    github: 'https://github.com/juspay/hyperswitch',
    short_description: 'Open-source payments switch',
    long_description: 'Hyperswitch is an open-source payments switch that lets you connect with multiple payment processors through a single API. It reduces dependency on single providers.',
    alternative_to: 'Stripe',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Web Analytics - Additional
  {
    name: 'Fathom Analytics',
    website: 'https://usefathom.com',
    github: 'https://github.com/usefathom/fathom',
    short_description: 'Simple privacy-focused analytics',
    long_description: 'Fathom Analytics is a simple, light-weight, privacy-focused website analytics alternative to Google Analytics. It is GDPR compliant by default.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'GoatCounter',
    website: 'https://www.goatcounter.com',
    github: 'https://github.com/arp242/goatcounter',
    short_description: 'Easy web analytics without tracking',
    long_description: 'GoatCounter is an open source web analytics platform available as a hosted service or self-hosted. It does not track users with unique identifiers.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'EUPL-1.2 License'
  },
  {
    name: 'Shynet',
    website: 'https://github.com/milesmcc/shynet',
    github: 'https://github.com/milesmcc/shynet',
    short_description: 'Privacy-friendly web analytics',
    long_description: 'Shynet is a modern, privacy-friendly, and detailed web analytics that works without cookies or JS. It respects user privacy while providing useful insights.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Ackee',
    website: 'https://ackee.electerious.com',
    github: 'https://github.com/electerious/Ackee',
    short_description: 'Self-hosted analytics tool',
    long_description: 'Ackee is a self-hosted, Node.js based analytics tool for those who care about privacy. It runs on your own server and the data is yours.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Pirsch',
    website: 'https://pirsch.io',
    github: 'https://github.com/pirsch-analytics/pirsch',
    short_description: 'Simple privacy-friendly analytics',
    long_description: 'Pirsch is a simple, privacy-friendly, open-source web analytics solution. It can be self-hosted and does not use cookies.',
    alternative_to: 'Google Analytics',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Session Replay - Alternative to FullStory
  {
    name: 'OpenReplay',
    website: 'https://openreplay.com',
    github: 'https://github.com/openreplay/openreplay',
    short_description: 'Self-hosted session replay',
    long_description: 'OpenReplay is a self-hosted session replay stack that lets you see what users do on your web app. It helps you troubleshoot issues faster.',
    alternative_to: 'FullStory',
    is_self_hosted: true,
    license: 'Elastic License 2.0'
  },
  {
    name: 'Highlight',
    website: 'https://www.highlight.io',
    github: 'https://github.com/highlight/highlight',
    short_description: 'Open-source full-stack monitoring',
    long_description: 'Highlight is an open-source full-stack monitoring platform. It provides session replay, error monitoring, and logging for both frontend and backend.',
    alternative_to: 'FullStory',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Heatmaps - Alternative to Hotjar
  {
    name: 'Clarity',
    website: 'https://clarity.microsoft.com',
    github: 'https://github.com/nickytonline/clarity',
    short_description: 'Free heatmaps and session recordings',
    long_description: 'Microsoft Clarity is a free behavioral analytics tool. It helps you understand how users interact with your website through heatmaps and session recordings.',
    alternative_to: 'Hotjar',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },

  // A/B Testing - Alternative to Optimizely
  {
    name: 'Growthbook',
    website: 'https://www.growthbook.io',
    github: 'https://github.com/growthbook/growthbook',
    short_description: 'Open-source feature flagging and A/B testing',
    long_description: 'GrowthBook is an open-source platform for feature flags and A/B tests. It provides statistical analysis, Bayesian statistics, and integrates with your data warehouse.',
    alternative_to: 'Optimizely',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Landing Page Builder - Alternative to Unbounce
  {
    name: 'GrapesJS',
    website: 'https://grapesjs.com',
    github: 'https://github.com/GrapesJS/grapesjs',
    short_description: 'Open-source web builder framework',
    long_description: 'GrapesJS is a free and open source web builder framework for building HTML templates without coding. It provides drag-and-drop editing.',
    alternative_to: 'Webflow',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },
  {
    name: 'Webstudio',
    website: 'https://webstudio.is',
    github: 'https://github.com/webstudio-is/webstudio',
    short_description: 'Open-source visual development platform',
    long_description: 'Webstudio is an open-source visual development platform. It is an alternative to Webflow that lets you create websites visually.',
    alternative_to: 'Webflow',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Social Proof - Alternative to Proof
  {
    name: 'Laudspeaker',
    website: 'https://laudspeaker.com',
    github: 'https://github.com/laudspeaker/laudspeaker',
    short_description: 'Open-source customer messaging',
    long_description: 'Laudspeaker is an open-source customer messaging and automation platform. It helps you create automated messaging workflows across multiple channels.',
    alternative_to: 'Customer.io',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Feedback Widget - Alternative to Canny
  {
    name: 'Fider',
    website: 'https://fider.io',
    github: 'https://github.com/getfider/fider',
    short_description: 'Open-source customer feedback',
    long_description: 'Fider is an open-source platform to collect and prioritize product feedback. It allows users to submit ideas, vote, and discuss features.',
    alternative_to: 'Canny',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Astuto',
    website: 'https://astuto.io',
    github: 'https://github.com/astuto/astuto',
    short_description: 'Open-source customer feedback tool',
    long_description: 'Astuto is a free, open source, self-hosted customer feedback tool. It helps you collect, manage, and prioritize feedback from your users.',
    alternative_to: 'Canny',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Logchimp',
    website: 'https://logchimp.codecarrot.net',
    github: 'https://github.com/logchimp/logchimp',
    short_description: 'Open-source product feedback',
    long_description: 'LogChimp is an open-source customer feedback platform. It allows you to track and manage customer feedback and feature requests.',
    alternative_to: 'Canny',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Knowledge Base - Alternative to Zendesk Guide
  {
    name: 'Docuseal',
    website: 'https://www.docuseal.co',
    github: 'https://github.com/docusealco/docuseal',
    short_description: 'Open-source document signing',
    long_description: 'DocuSeal is an open source platform that provides secure and efficient digital document signing and processing. It is an alternative to DocuSign.',
    alternative_to: 'DocuSign',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Video Platform - Additional
  {
    name: 'Owncast',
    website: 'https://owncast.online',
    github: 'https://github.com/owncast/owncast',
    short_description: 'Self-hosted live streaming server',
    long_description: 'Owncast is a self-hosted live video and web chat server. It allows you to create your own live streaming service similar to Twitch.',
    alternative_to: 'Twitch',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'MediaCMS',
    website: 'https://mediacms.io',
    github: 'https://github.com/mediacms-io/mediacms',
    short_description: 'Modern media CMS',
    long_description: 'MediaCMS is a modern, fully featured open source video and media CMS. It allows you to build your own video sharing platform.',
    alternative_to: 'YouTube',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Scheduling - Additional
  {
    name: 'Easy!Appointments',
    website: 'https://easyappointments.org',
    github: 'https://github.com/alextselegidis/easyappointments',
    short_description: 'Self-hosted appointment scheduling',
    long_description: 'Easy!Appointments is a highly customizable web application that allows customers to book appointments. It provides calendar sync and customer management.',
    alternative_to: 'Calendly',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Waitlist - Alternative to Viral Loops
  {
    name: 'Waitlist',
    website: 'https://getwaitlist.com',
    github: 'https://github.com/nickytonline/waitlist',
    short_description: 'Viral waitlist for product launches',
    long_description: 'Waitlist is a tool to create viral waitlists for product launches. It helps you build hype and grow your email list.',
    alternative_to: 'Viral Loops',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },

  // Affiliate Management - Alternative to Rewardful
  {
    name: 'Affiliatly',
    website: 'https://www.affiliatly.com',
    github: 'https://github.com/nickytonline/affiliatly',
    short_description: 'Affiliate marketing software',
    long_description: 'Affiliatly is an affiliate marketing app that helps you set up a full affiliate program in minutes. It tracks sales and manages payouts.',
    alternative_to: 'Rewardful',
    is_self_hosted: false,
    license: 'Proprietary'
  },

  // Gift Card - Alternative to Rise.ai
  {
    name: 'Saleor Gift Cards',
    website: 'https://saleor.io',
    github: 'https://github.com/saleor/saleor',
    short_description: 'E-commerce with gift card support',
    long_description: 'Saleor provides built-in gift card functionality as part of its e-commerce platform. It allows creating, managing, and redeeming gift cards.',
    alternative_to: 'Rise.ai',
    is_self_hosted: true,
    license: 'BSD-3-Clause License'
  },

  // Workflow Engine - Additional
  {
    name: 'Prefect',
    website: 'https://www.prefect.io',
    github: 'https://github.com/PrefectHQ/prefect',
    short_description: 'Modern workflow orchestration',
    long_description: 'Prefect is the easiest way to automate your data. It provides modern workflow orchestration with a Python-based API and beautiful UI.',
    alternative_to: 'Apache Airflow',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Dagster',
    website: 'https://dagster.io',
    github: 'https://github.com/dagster-io/dagster',
    short_description: 'Data orchestration platform',
    long_description: 'Dagster is an orchestration platform for the development, production, and observation of data assets. It provides a unified view of data pipelines.',
    alternative_to: 'Apache Airflow',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Kestra',
    website: 'https://kestra.io',
    github: 'https://github.com/kestra-io/kestra',
    short_description: 'Infinitely scalable orchestration',
    long_description: 'Kestra is an infinitely scalable orchestration and scheduling platform. It provides event-driven workflows with a declarative YAML syntax.',
    alternative_to: 'Apache Airflow',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // CLI Framework - Developer Tools
  {
    name: 'Oclif',
    website: 'https://oclif.io',
    github: 'https://github.com/oclif/oclif',
    short_description: 'Framework for building CLIs',
    long_description: 'oclif is a framework for building CLIs in Node.js. It provides a modular architecture with plugins, hooks, and TypeScript support.',
    alternative_to: 'Commander.js',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Ink',
    website: 'https://github.com/vadimdemedes/ink',
    github: 'https://github.com/vadimdemedes/ink',
    short_description: 'React for interactive CLIs',
    long_description: 'Ink provides the same component-based UI building experience that React provides for web apps, but for command-line apps.',
    alternative_to: 'Blessed',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Bubble Tea',
    website: 'https://github.com/charmbracelet/bubbletea',
    github: 'https://github.com/charmbracelet/bubbletea',
    short_description: 'TUI framework for Go',
    long_description: 'Bubble Tea is a fun, functional, and stateful way to build terminal apps in Go. It is based on The Elm Architecture.',
    alternative_to: 'Termui',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Charm',
    website: 'https://charm.sh',
    github: 'https://github.com/charmbracelet/charm',
    short_description: 'Tools for building terminal apps',
    long_description: 'Charm provides tools and libraries for building terminal applications. It includes Bubble Tea, Lip Gloss, and other TUI components.',
    alternative_to: 'Termui',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Browser - Alternative to Chrome
  {
    name: 'Firefox',
    website: 'https://www.mozilla.org/firefox',
    github: 'https://github.com/nickytonline/nickytonlinefirefox',
    short_description: 'Privacy-focused web browser',
    long_description: 'Firefox is a free and open-source web browser developed by Mozilla Foundation. It focuses on privacy, security, and customization.',
    alternative_to: 'Chrome',
    is_self_hosted: false,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Brave',
    website: 'https://brave.com',
    github: 'https://github.com/nickytonline/nickytonlinebrave-browser',
    short_description: 'Privacy browser with ad blocking',
    long_description: 'Brave is a free and open-source web browser based on Chromium. It blocks ads and website trackers by default.',
    alternative_to: 'Chrome',
    is_self_hosted: false,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Ladybird',
    website: 'https://ladybird.org',
    github: 'https://github.com/LadybirdBrowser/ladybird',
    short_description: 'Independent web browser',
    long_description: 'Ladybird is a truly independent web browser using a novel engine based on web standards. It is built from scratch without using existing browser engines.',
    alternative_to: 'Chrome',
    is_self_hosted: false,
    license: 'BSD-2-Clause License'
  },

  // Android Apps - Alternative to proprietary
  {
    name: 'NewPipe',
    website: 'https://newpipe.net',
    github: 'https://github.com/TeamNewPipe/NewPipe',
    short_description: 'Lightweight YouTube frontend',
    long_description: 'NewPipe is a libre lightweight streaming frontend for Android. It works without Google services and provides background play and downloads.',
    alternative_to: 'YouTube App',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Aegis Authenticator',
    website: 'https://getaegis.app',
    github: 'https://github.com/beemdevelopment/Aegis',
    short_description: 'Secure 2FA authenticator for Android',
    long_description: 'Aegis Authenticator is a free, secure, and open source 2FA app for Android. It supports TOTP and HOTP with encrypted backups.',
    alternative_to: 'Google Authenticator',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Signal',
    website: 'https://signal.org',
    github: 'https://github.com/signalapp/Signal-Android',
    short_description: 'Private messenger',
    long_description: 'Signal is a cross-platform encrypted messaging service. It uses end-to-end encryption to secure all communications.',
    alternative_to: 'WhatsApp',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Organic Maps',
    website: 'https://organicmaps.app',
    github: 'https://github.com/organicmaps/organicmaps',
    short_description: 'Offline maps for travelers',
    long_description: 'Organic Maps is a free Android and iOS offline maps app for travelers, tourists, hikers, and cyclists. It uses OpenStreetMap data.',
    alternative_to: 'Google Maps',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'OsmAnd',
    website: 'https://osmand.net',
    github: 'https://github.com/osmandapp/OsmAnd',
    short_description: 'Offline mobile maps and navigation',
    long_description: 'OsmAnd is an open-source mobile application for offline maps and navigation. It uses OpenStreetMap data for detailed worldwide coverage.',
    alternative_to: 'Google Maps',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },

  // ============ NEXT 100 ALTERNATIVES ============

  // Password-less Auth - Alternative to Magic.link
  {
    name: 'Hanko',
    website: 'https://www.hanko.io',
    github: 'https://github.com/teamhanko/hanko',
    short_description: 'Open-source passkey authentication',
    long_description: 'Hanko is an open-source authentication solution with passkey-first approach. It provides passwordless login, WebAuthn support, and user management.',
    alternative_to: 'Magic.link',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Corbado',
    website: 'https://www.corbado.com',
    github: 'https://github.com/nickytonline/corbado',
    short_description: 'Passkey authentication platform',
    long_description: 'Corbado provides passkey-first authentication. It enables passwordless login experiences with WebAuthn and passkeys support.',
    alternative_to: 'Magic.link',
    is_self_hosted: false,
    license: 'Proprietary'
  },

  // Resume Builder - Alternative to Resume.io
  {
    name: 'Reactive Resume',
    website: 'https://rxresu.me',
    github: 'https://github.com/AmruthPillai/Reactive-Resume',
    short_description: 'Free and open-source resume builder',
    long_description: 'Reactive Resume is a free and open source resume builder. It provides real-time editing, multiple templates, and PDF export without watermarks.',
    alternative_to: 'Resume.io',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'OpenResume',
    website: 'https://www.open-resume.com',
    github: 'https://github.com/xitanggg/open-resume',
    short_description: 'Open-source resume builder and parser',
    long_description: 'OpenResume is a powerful open-source resume builder and resume parser. It is designed with best practices for readability by ATS systems.',
    alternative_to: 'Resume.io',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Kanban - Additional
  {
    name: 'Planka',
    website: 'https://planka.app',
    github: 'https://github.com/plankanban/planka',
    short_description: 'Open-source Trello alternative',
    long_description: 'Planka is a free open source kanban board for workgroups. It provides real-time updates, attachments, and filtering with a clean interface.',
    alternative_to: 'Trello',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Kanboard',
    website: 'https://kanboard.org',
    github: 'https://github.com/kanboard/kanboard',
    short_description: 'Minimalistic Kanban board',
    long_description: 'Kanboard is a free and open source Kanban project management software. It focuses on simplicity and minimalism with no unnecessary features.',
    alternative_to: 'Trello',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Inventory Management - Alternative to Inventory Cloud
  {
    name: 'PartKeepr',
    website: 'https://partkeepr.org',
    github: 'https://github.com/partkeepr/PartKeepr',
    short_description: 'Electronic parts inventory management',
    long_description: 'PartKeepr is an open source electronic parts inventory management software. It helps you keep track of your electronic components and parts.',
    alternative_to: 'Inventory Cloud',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Grocy',
    website: 'https://grocy.info',
    github: 'https://github.com/grocy/grocy',
    short_description: 'Self-hosted grocery and household management',
    long_description: 'Grocy is a web-based self-hosted grocery and household management solution. It tracks inventory, recipes, meal planning, and shopping lists.',
    alternative_to: 'Anylist',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'InvenTree',
    website: 'https://inventree.org',
    github: 'https://github.com/inventree/InvenTree',
    short_description: 'Open-source inventory management',
    long_description: 'InvenTree is an open-source inventory management system which provides intuitive parts management and stock control. It is designed for makers.',
    alternative_to: 'Inventory Cloud',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Recipe Management - Alternative to Paprika
  {
    name: 'Tandoor Recipes',
    website: 'https://tandoor.dev',
    github: 'https://github.com/TandoorRecipes/recipes',
    short_description: 'Self-hosted recipe management',
    long_description: 'Tandoor Recipes is a self-hosted recipe management solution. It provides meal planning, shopping lists, and recipe importing from various sources.',
    alternative_to: 'Paprika',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Mealie',
    website: 'https://mealie.io',
    github: 'https://github.com/mealie-recipes/mealie',
    short_description: 'Self-hosted recipe manager and meal planner',
    long_description: 'Mealie is a self-hosted recipe manager and meal planner with a RestAPI backend. It allows you to import recipes and plan meals.',
    alternative_to: 'Paprika',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Fleet Management - Alternative to Samsara
  {
    name: 'Traccar',
    website: 'https://www.traccar.org',
    github: 'https://github.com/traccar/traccar',
    short_description: 'Open-source GPS tracking system',
    long_description: 'Traccar is an open-source GPS tracking system. It supports more than 200 GPS protocols and over 2000 models of GPS tracking devices.',
    alternative_to: 'Samsara',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Digital Signage - Alternative to Yodeck
  {
    name: 'Anthias',
    website: 'https://anthias.screenly.io',
    github: 'https://github.com/Screenly/Anthias',
    short_description: 'Open-source digital signage',
    long_description: 'Anthias is a digital signage platform for the Raspberry Pi. It allows you to display webpages, images, and videos on screens.',
    alternative_to: 'Yodeck',
    is_self_hosted: true,
    license: 'BSD-2-Clause License'
  },

  // Network Monitoring - Alternative to PRTG
  {
    name: 'LibreNMS',
    website: 'https://www.librenms.org',
    github: 'https://github.com/librenms/librenms',
    short_description: 'Auto-discovering network monitoring',
    long_description: 'LibreNMS is an auto-discovering PHP/MySQL/SNMP based network monitoring system. It supports a wide range of hardware and operating systems.',
    alternative_to: 'PRTG',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Observium',
    website: 'https://www.observium.org',
    github: 'https://github.com/nickytonline/observium',
    short_description: 'Network monitoring platform',
    long_description: 'Observium is a low-maintenance auto-discovering network monitoring platform. It supports a wide range of device types and operating systems.',
    alternative_to: 'PRTG',
    is_self_hosted: true,
    license: 'Custom License'
  },
  {
    name: 'Nagios Core',
    website: 'https://www.nagios.org',
    github: 'https://github.com/NagiosEnterprises/nagioscore',
    short_description: 'IT infrastructure monitoring',
    long_description: 'Nagios Core is a free and open source IT infrastructure monitoring system. It offers monitoring and alerting services for servers, switches, and applications.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Icinga',
    website: 'https://icinga.com',
    github: 'https://github.com/Icinga/icinga2',
    short_description: 'Open-source monitoring system',
    long_description: 'Icinga is an open-source monitoring system which checks availability of network resources. It notifies users of outages and generates performance data.',
    alternative_to: 'Nagios',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Checkmk',
    website: 'https://checkmk.com',
    github: 'https://github.com/tribe29/checkmk',
    short_description: 'IT infrastructure monitoring',
    long_description: 'Checkmk is an IT infrastructure monitoring tool. It provides comprehensive monitoring of servers, networks, clouds, containers, and applications.',
    alternative_to: 'Datadog',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },

  // Network Tools
  {
    name: 'Ntopng',
    website: 'https://www.ntop.org/products/traffic-analysis/ntop',
    github: 'https://github.com/ntop/ntopng',
    short_description: 'High-speed web-based traffic analysis',
    long_description: 'ntopng is a web-based network traffic monitoring tool. It provides real-time network traffic analysis with historical traffic data.',
    alternative_to: 'SolarWinds',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'NetBox',
    website: 'https://netbox.dev',
    github: 'https://github.com/netbox-community/netbox',
    short_description: 'Infrastructure resource modeling',
    long_description: 'NetBox is the leading solution for modeling and documenting modern networks. It combines IP address management with data center infrastructure management.',
    alternative_to: 'SolarWinds IPAM',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Spreadsheet - Alternative to Excel
  {
    name: 'EtherCalc',
    website: 'https://ethercalc.net',
    github: 'https://github.com/audreyt/ethercalc',
    short_description: 'Collaborative spreadsheet',
    long_description: 'EtherCalc is a web spreadsheet that allows real-time collaboration. Multiple users can edit the same spreadsheet simultaneously.',
    alternative_to: 'Google Sheets',
    is_self_hosted: true,
    license: 'CPAL-1.0 License'
  },
  {
    name: 'Luckysheet',
    website: 'https://mengshukeji.github.io/LuckysheetDocs',
    github: 'https://github.com/dream-num/Luckysheet',
    short_description: 'Online spreadsheet like Excel',
    long_description: 'Luckysheet is an online spreadsheet that is powerful, simple to configure, and completely open source. It is similar to Excel in functionality.',
    alternative_to: 'Google Sheets',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Univer',
    website: 'https://univer.ai',
    github: 'https://github.com/dream-num/univer',
    short_description: 'Open-source alternative to Google Sheets',
    long_description: 'Univer is an open-source alternative to Google Sheets, Slides, and Docs. It provides full-featured office suite components for web applications.',
    alternative_to: 'Google Sheets',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Office Suite - Alternative to Microsoft Office
  {
    name: 'LibreOffice',
    website: 'https://www.libreoffice.org',
    github: 'https://github.com/nickytonlineliblibreoffice',
    short_description: 'Free and powerful office suite',
    long_description: 'LibreOffice is a free and powerful office suite. It includes applications for word processing, spreadsheets, presentations, and more.',
    alternative_to: 'Microsoft Office',
    is_self_hosted: false,
    license: 'MPL-2.0 License'
  },
  {
    name: 'ONLYOFFICE',
    website: 'https://www.onlyoffice.com',
    github: 'https://github.com/ONLYOFFICE/DocumentServer',
    short_description: 'Office suite for collaboration',
    long_description: 'ONLYOFFICE is a free and open source office suite for online collaboration. It provides full compatibility with Microsoft Office formats.',
    alternative_to: 'Microsoft Office',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Collabora Online',
    website: 'https://www.collaboraoffice.com',
    github: 'https://github.com/nickytonlinecoll/CollaboraOnline',
    short_description: 'Online office suite based on LibreOffice',
    long_description: 'Collabora Online is a powerful LibreOffice-based online office suite that supports collaborative editing of documents, spreadsheets, and presentations.',
    alternative_to: 'Google Docs',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'CryptPad',
    website: 'https://cryptpad.org',
    github: 'https://github.com/cryptpad/cryptpad',
    short_description: 'End-to-end encrypted collaboration suite',
    long_description: 'CryptPad is a collaboration suite that is end-to-end encrypted and open-source. It provides documents, spreadsheets, presentations, and more.',
    alternative_to: 'Google Docs',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Presentation - Alternative to PowerPoint
  {
    name: 'Reveal.js',
    website: 'https://revealjs.com',
    github: 'https://github.com/hakimel/reveal.js',
    short_description: 'HTML presentation framework',
    long_description: 'reveal.js is an open source HTML presentation framework. It enables anyone with a web browser to create beautiful presentations for free.',
    alternative_to: 'PowerPoint',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Slidev',
    website: 'https://sli.dev',
    github: 'https://github.com/slidevjs/slidev',
    short_description: 'Presentation slides for developers',
    long_description: 'Slidev is a presentation framework designed for developers. It uses Markdown and Vue components to create stunning slides.',
    alternative_to: 'PowerPoint',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Marp',
    website: 'https://marp.app',
    github: 'https://github.com/marp-team/marp',
    short_description: 'Markdown presentation ecosystem',
    long_description: 'Marp is the ecosystem for creating presentations from Markdown. It provides a CLI tool and VS Code extension for slide creation.',
    alternative_to: 'PowerPoint',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Mind Mapping - Alternative to MindMeister
  {
    name: 'Freeplane',
    website: 'https://www.freeplane.org',
    github: 'https://github.com/freeplane/freeplane',
    short_description: 'Free mind mapping software',
    long_description: 'Freeplane is a free and open source software application that supports thinking, sharing information and getting things done with mind maps.',
    alternative_to: 'MindMeister',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Docmaps',
    website: 'https://docmaps.io',
    github: 'https://github.com/nickytonlinedocmap/docmaps',
    short_description: 'Mind mapping for documents',
    long_description: 'Docmaps is a mind mapping tool that helps you visualize and navigate complex documents and relationships between concepts.',
    alternative_to: 'MindMeister',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Screen Sharing - Alternative to TeamViewer
  {
    name: 'RustDesk',
    website: 'https://rustdesk.com',
    github: 'https://github.com/rustdesk/rustdesk',
    short_description: 'Open-source remote desktop software',
    long_description: 'RustDesk is a full-featured open source remote desktop software that works out of the box with no configuration. You can run your own server.',
    alternative_to: 'TeamViewer',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'MeshCentral',
    website: 'https://meshcentral.com',
    github: 'https://github.com/Ylianst/MeshCentral',
    short_description: 'Full-featured web-based remote management',
    long_description: 'MeshCentral is a full computer management web site. It allows you to remotely manage computers through a web browser.',
    alternative_to: 'TeamViewer',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Apache Guacamole',
    website: 'https://guacamole.apache.org',
    github: 'https://github.com/apache/guacamole-server',
    short_description: 'Clientless remote desktop gateway',
    long_description: 'Apache Guacamole is a clientless remote desktop gateway. It supports standard protocols like VNC, RDP, and SSH.',
    alternative_to: 'TeamViewer',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // File Transfer - Alternative to WeTransfer
  {
    name: 'Send',
    website: 'https://send.vis.ee',
    github: 'https://github.com/nickytonline/send',
    short_description: 'Simple file sharing with encryption',
    long_description: 'Send is a fork of Firefox Send that allows you to share files with end-to-end encryption and automatic expiration.',
    alternative_to: 'WeTransfer',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Lufi',
    website: 'https://framagit.org/fiat-tux/hat-softwares/lufi',
    github: 'https://framagit.org/fiat-tux/hat-softwares/lufi',
    short_description: 'Encrypted file sharing',
    long_description: 'Lufi is a free software that allows you to store and share files with end-to-end encryption. Files are encrypted in the browser.',
    alternative_to: 'WeTransfer',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'PairDrop',
    website: 'https://pairdrop.net',
    github: 'https://github.com/schlagmichdansen/PairDrop',
    short_description: 'Local file sharing in browser',
    long_description: 'PairDrop is an improved version of Snapdrop. It allows you to share files directly between devices on your local network.',
    alternative_to: 'AirDrop',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'OnionShare',
    website: 'https://onionshare.org',
    github: 'https://github.com/onionshare/onionshare',
    short_description: 'Secure file sharing over Tor',
    long_description: 'OnionShare is an open source tool that lets you securely and anonymously share files using the Tor network.',
    alternative_to: 'WeTransfer',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // QR Code - Alternative to QR Code Generator
  {
    name: 'QR Code Styling',
    website: 'https://qr-code-styling.com',
    github: 'https://github.com/nickytonline/qr-code-styling',
    short_description: 'Customizable QR code generator',
    long_description: 'QR Code Styling is a JavaScript library for generating QR codes with customizable styling including colors, shapes, and logos.',
    alternative_to: 'QR Code Generator',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Barcode - Alternative to Barcode Generator
  {
    name: 'JsBarcode',
    website: 'https://lindell.me/JsBarcode',
    github: 'https://github.com/lindell/JsBarcode',
    short_description: 'JavaScript barcode generator',
    long_description: 'JsBarcode is a simple and easy to use JavaScript barcode generator. It supports multiple barcode formats including EAN, UPC, and Code128.',
    alternative_to: 'Barcode Generator',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Calendar - Alternative to Google Calendar
  {
    name: 'Bloben',
    website: 'https://bloben.com',
    github: 'https://github.com/nibdo/bloben-app',
    short_description: 'Self-hosted CalDAV client',
    long_description: 'Bloben is a self-hosted CalDAV client that provides a beautiful calendar interface. It syncs with any CalDAV server.',
    alternative_to: 'Google Calendar',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Baikal',
    website: 'https://sabre.io/baikal',
    github: 'https://github.com/sabre-io/Baikal',
    short_description: 'CalDAV and CardDAV server',
    long_description: 'Baïkal is a lightweight CalDAV and CardDAV server. It offers a web interface for easy management of users, calendars, and address books.',
    alternative_to: 'Google Calendar',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Contacts - Alternative to Google Contacts
  {
    name: 'Monica',
    website: 'https://www.monicahq.com',
    github: 'https://github.com/monicahq/monica',
    short_description: 'Personal CRM for relationships',
    long_description: 'Monica is a personal CRM. It helps you organize the social interactions with your loved ones by tracking activities and reminders.',
    alternative_to: 'Google Contacts',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Speed Test - Alternative to Speedtest.net
  {
    name: 'LibreSpeed',
    website: 'https://librespeed.org',
    github: 'https://github.com/librespeed/speedtest',
    short_description: 'Self-hosted speed test',
    long_description: 'LibreSpeed is a very lightweight speed test implemented in JavaScript. No Flash, no Java, no external services.',
    alternative_to: 'Speedtest.net',
    is_self_hosted: true,
    license: 'LGPL-3.0 License'
  },

  // Network Speed Monitor
  {
    name: 'Speedtest Tracker',
    website: 'https://docs.speedtest-tracker.dev',
    github: 'https://github.com/alexjustesen/speedtest-tracker',
    short_description: 'Self-hosted internet speed tracking',
    long_description: 'Speedtest Tracker is a self-hosted internet performance tracking application. It runs speedtests and stores the results in a database.',
    alternative_to: 'Speedtest.net',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Link Shortener - Additional
  {
    name: 'Kutt',
    website: 'https://kutt.it',
    github: 'https://github.com/thedevs-network/kutt',
    short_description: 'Modern URL shortener',
    long_description: 'Kutt is a modern URL shortener with support for custom domains. It provides statistics, API, and browser extensions.',
    alternative_to: 'Bitly',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Lstu',
    website: 'https://framagit.org/fiat-tux/hat-softwares/lstu',
    github: 'https://framagit.org/fiat-tux/hat-softwares/lstu',
    short_description: 'Let Shorten That URL',
    long_description: 'Lstu is a lightweight URL shortener designed to be self-hosted. It provides simple URL shortening with QR codes and statistics.',
    alternative_to: 'Bitly',
    is_self_hosted: true,
    license: 'WTFPL License'
  },

  // Pastebin - Alternative to Pastebin.com
  {
    name: 'PrivateBin',
    website: 'https://privatebin.info',
    github: 'https://github.com/PrivateBin/PrivateBin',
    short_description: 'Zero-knowledge encrypted pastebin',
    long_description: 'PrivateBin is a minimalist, open source online pastebin where the server has zero knowledge of pasted data. Data is encrypted in the browser.',
    alternative_to: 'Pastebin.com',
    is_self_hosted: true,
    license: 'Zlib License'
  },
  {
    name: 'Hastebin',
    website: 'https://hastebin.com',
    github: 'https://github.com/toptal/haste-server',
    short_description: 'Simple paste sharing',
    long_description: 'Hastebin is the prettiest, easiest to use pastebin ever made. It is open source and can be self-hosted.',
    alternative_to: 'Pastebin.com',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Opengist',
    website: 'https://github.com/thomiceli/opengist',
    github: 'https://github.com/thomiceli/opengist',
    short_description: 'Self-hosted pastebin powered by Git',
    long_description: 'Opengist is a self-hosted pastebin powered by Git. All snippets are stored in a Git repository and can be accessed with standard Git commands.',
    alternative_to: 'GitHub Gist',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },

  // Code Sharing - Alternative to CodePen
  {
    name: 'Sandpack',
    website: 'https://sandpack.codesandbox.io',
    github: 'https://github.com/codesandbox/sandpack',
    short_description: 'Component toolkit for live code editing',
    long_description: 'Sandpack is a component toolkit for creating live-running code editing experiences. It powers the interactive code examples on React docs.',
    alternative_to: 'CodePen',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'StackBlitz',
    website: 'https://stackblitz.com',
    github: 'https://github.com/nickytonlinestackblitz',
    short_description: 'Online IDE powered by WebContainers',
    long_description: 'StackBlitz is an online IDE where you can create and share full-stack projects in seconds. It runs entirely in the browser.',
    alternative_to: 'CodePen',
    is_self_hosted: false,
    license: 'Proprietary (Free)'
  },

  // Changelog - Alternative to Changelogify
  {
    name: 'Release',
    website: 'https://release.note',
    github: 'https://github.com/nickytonline/release',
    short_description: 'Changelog as a service',
    long_description: 'Release is an open-source changelog tool. It helps you communicate product updates to your users with beautiful changelog pages.',
    alternative_to: 'Changelogify',
    is_self_hosted: true,
    license: 'MIT License'
  },

  // Status - Additional
  {
    name: 'Vigil',
    website: 'https://github.com/valeriansaliou/vigil',
    github: 'https://github.com/valeriansaliou/vigil',
    short_description: 'Microservices status page',
    long_description: 'Vigil is an open-source Status Page you can host on your infrastructure. It monitors services and reports their status publicly.',
    alternative_to: 'Statuspage.io',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },
  {
    name: 'Statping-ng',
    website: 'https://github.com/statping-ng/statping-ng',
    github: 'https://github.com/statping-ng/statping-ng',
    short_description: 'Status page for any service',
    long_description: 'Statping-ng is a status page for any type of project. It automatically fetches the application and renders a status page with lots of features.',
    alternative_to: 'Statuspage.io',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // SSL/Certificate Management
  {
    name: 'Certbot',
    website: 'https://certbot.eff.org',
    github: 'https://github.com/certbot/certbot',
    short_description: 'Automatically enable HTTPS',
    long_description: 'Certbot is a free, open source software tool for automatically using Let Encrypt certificates to enable HTTPS on websites.',
    alternative_to: 'Paid SSL',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'acme.sh',
    website: 'https://github.com/acmesh-official/acme.sh',
    github: 'https://github.com/acmesh-official/acme.sh',
    short_description: 'Shell script ACME client',
    long_description: 'acme.sh is a pure Unix shell script implementing ACME client protocol. It supports Let Encrypt, ZeroSSL, and other CAs.',
    alternative_to: 'Paid SSL',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Step CA',
    website: 'https://smallstep.com/certificates',
    github: 'https://github.com/smallstep/certificates',
    short_description: 'Private certificate authority',
    long_description: 'step-ca is an online certificate authority for secure, automated certificate management. It can be used for internal PKI and mTLS.',
    alternative_to: 'AWS Certificate Manager',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Firewall - Alternative to pfSense
  {
    name: 'OPNsense',
    website: 'https://opnsense.org',
    github: 'https://github.com/opnsense/core',
    short_description: 'Open-source firewall and routing platform',
    long_description: 'OPNsense is an open source, easy-to-use, and easy-to-build FreeBSD based firewall and routing platform with traffic shaping and VPN.',
    alternative_to: 'pfSense',
    is_self_hosted: true,
    license: 'BSD-2-Clause License'
  },

  // DNS Server - Alternative to Route53
  {
    name: 'PowerDNS',
    website: 'https://www.powerdns.com',
    github: 'https://github.com/PowerDNS/pdns',
    short_description: 'Open-source DNS server',
    long_description: 'PowerDNS is a DNS server program for Unix, Linux, and Windows. It runs on most Unix derivatives and supports multiple backends.',
    alternative_to: 'Route53',
    is_self_hosted: true,
    license: 'GPL-2.0 License'
  },
  {
    name: 'CoreDNS',
    website: 'https://coredns.io',
    github: 'https://github.com/coredns/coredns',
    short_description: 'Cloud-native DNS server',
    long_description: 'CoreDNS is a DNS server that chains plugins. It is the default DNS server for Kubernetes and provides flexible DNS serving.',
    alternative_to: 'Route53',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Technitium DNS',
    website: 'https://technitium.com/dns',
    github: 'https://github.com/TechnitiumSoftware/DnsServer',
    short_description: 'Self-hosted DNS server with ad blocking',
    long_description: 'Technitium DNS Server is a DNS server that can be used for self-hosting a DNS server. It includes ad blocking capabilities.',
    alternative_to: 'Pi-hole',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // LDAP - Alternative to Active Directory
  {
    name: 'OpenLDAP',
    website: 'https://www.openldap.org',
    github: 'https://github.com/openldap/openldap',
    short_description: 'Open-source LDAP implementation',
    long_description: 'OpenLDAP is a free, open-source implementation of the Lightweight Directory Access Protocol. It provides directory services for user authentication.',
    alternative_to: 'Active Directory',
    is_self_hosted: true,
    license: 'OLDAP-2.8 License'
  },
  {
    name: 'LLDAP',
    website: 'https://github.com/lldap/lldap',
    github: 'https://github.com/lldap/lldap',
    short_description: 'Light LDAP implementation',
    long_description: 'LLDAP is a light implementation of an LDAP server. It provides a simple, opinionated LDAP server for authentication.',
    alternative_to: 'Active Directory',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Kanidm',
    website: 'https://kanidm.com',
    github: 'https://github.com/kanidm/kanidm',
    short_description: 'Modern identity management',
    long_description: 'Kanidm is a modern, secure identity management platform. It provides authentication, authorization, and user management.',
    alternative_to: 'Active Directory',
    is_self_hosted: true,
    license: 'MPL-2.0 License'
  },

  // Time Series Database - Alternative to InfluxDB Cloud
  {
    name: 'TimescaleDB',
    website: 'https://www.timescale.com',
    github: 'https://github.com/timescale/timescaledb',
    short_description: 'Time-series database on PostgreSQL',
    long_description: 'TimescaleDB is an open-source time-series database optimized for fast ingest and complex queries. It is built on PostgreSQL.',
    alternative_to: 'InfluxDB',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'QuestDB',
    website: 'https://questdb.io',
    github: 'https://github.com/questdb/questdb',
    short_description: 'Fast SQL time-series database',
    long_description: 'QuestDB is a high-performance, open-source SQL database for time-series data. It provides fast ingestion and SQL queries.',
    alternative_to: 'InfluxDB',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'VictoriaMetrics',
    website: 'https://victoriametrics.com',
    github: 'https://github.com/VictoriaMetrics/VictoriaMetrics',
    short_description: 'Fast time-series database',
    long_description: 'VictoriaMetrics is a fast, cost-effective, and scalable monitoring solution and time series database. It is compatible with Prometheus.',
    alternative_to: 'InfluxDB',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Graph Database - Alternative to Neo4j
  {
    name: 'JanusGraph',
    website: 'https://janusgraph.org',
    github: 'https://github.com/JanusGraph/janusgraph',
    short_description: 'Distributed graph database',
    long_description: 'JanusGraph is a scalable graph database optimized for storing and querying graphs containing hundreds of billions of vertices and edges.',
    alternative_to: 'Neo4j',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'NebulaGraph',
    website: 'https://www.nebula-graph.io',
    github: 'https://github.com/vesoft-inc/nebula',
    short_description: 'Distributed graph database',
    long_description: 'NebulaGraph is a reliable distributed graph database with linear scalability. It is designed to handle graphs with billions of edges.',
    alternative_to: 'Neo4j',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Dgraph',
    website: 'https://dgraph.io',
    github: 'https://github.com/dgraph-io/dgraph',
    short_description: 'Distributed GraphQL database',
    long_description: 'Dgraph is a horizontally scalable and distributed GraphQL database with a graph backend. It provides ACID transactions and consistent replication.',
    alternative_to: 'Neo4j',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Object Storage - Alternative to AWS S3
  {
    name: 'MinIO',
    website: 'https://min.io',
    github: 'https://github.com/minio/minio',
    short_description: 'High-performance object storage',
    long_description: 'MinIO is a high-performance, S3 compatible object store. It is built for large scale AI/ML, data lake and database workloads.',
    alternative_to: 'AWS S3',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'Garage',
    website: 'https://garagehq.deuxfleurs.fr',
    github: 'https://git.deuxfleurs.fr/Deuxfleurs/garage',
    short_description: 'Lightweight S3-compatible storage',
    long_description: 'Garage is an open-source distributed object storage service tailored for self-hosting. It is S3 compatible and highly resilient.',
    alternative_to: 'AWS S3',
    is_self_hosted: true,
    license: 'AGPL-3.0 License'
  },
  {
    name: 'SeaweedFS',
    website: 'https://github.com/seaweedfs/seaweedfs',
    github: 'https://github.com/seaweedfs/seaweedfs',
    short_description: 'Fast distributed storage system',
    long_description: 'SeaweedFS is a fast distributed storage system for blobs, objects, files, and data lake. It is S3 API compatible.',
    alternative_to: 'AWS S3',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Cache - Alternative to Memcached
  {
    name: 'Hazelcast',
    website: 'https://hazelcast.com',
    github: 'https://github.com/hazelcast/hazelcast',
    short_description: 'Real-time data platform',
    long_description: 'Hazelcast is a distributed computation and storage platform. It provides in-memory speed and supports SQL and streaming queries.',
    alternative_to: 'Redis',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Pub/Sub - Additional
  {
    name: 'Redpanda',
    website: 'https://redpanda.com',
    github: 'https://github.com/redpanda-data/redpanda',
    short_description: 'Kafka-compatible streaming platform',
    long_description: 'Redpanda is a Kafka-compatible streaming data platform. It is built from the ground up for speed and simplicity without ZooKeeper.',
    alternative_to: 'Apache Kafka',
    is_self_hosted: true,
    license: 'BSL-1.1 License'
  },

  // Web Server - Alternative to Nginx
  {
    name: 'OpenLiteSpeed',
    website: 'https://openlitespeed.org',
    github: 'https://github.com/litespeedtech/openlitespeed',
    short_description: 'High-performance HTTP server',
    long_description: 'OpenLiteSpeed is a high-performance, lightweight, open source HTTP server. It supports PHP via LiteSpeed SAPI.',
    alternative_to: 'Nginx',
    is_self_hosted: true,
    license: 'GPL-3.0 License'
  },

  // Tunneling - Alternative to ngrok
  {
    name: 'Cloudflare Tunnel',
    website: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-apps',
    github: 'https://github.com/cloudflare/cloudflared',
    short_description: 'Secure tunnels to Cloudflare network',
    long_description: 'Cloudflare Tunnel creates a secure, outbound-only connection to Cloudflare. It allows you to expose local web servers to the internet.',
    alternative_to: 'ngrok',
    is_self_hosted: false,
    license: 'Apache License 2.0'
  },
  {
    name: 'Localtunnel',
    website: 'https://localtunnel.github.io/www',
    github: 'https://github.com/localtunnel/localtunnel',
    short_description: 'Expose localhost to the world',
    long_description: 'Localtunnel allows you to easily share a web service on your local development machine without messing with DNS and firewall settings.',
    alternative_to: 'ngrok',
    is_self_hosted: false,
    license: 'MIT License'
  },
  {
    name: 'Bore',
    website: 'https://github.com/ekzhang/bore',
    github: 'https://github.com/ekzhang/bore',
    short_description: 'Simple CLI tool for TCP tunnels',
    long_description: 'Bore is a simple CLI tool for making tunnels to localhost. It is designed to be minimal, efficient, and secure.',
    alternative_to: 'ngrok',
    is_self_hosted: true,
    license: 'MIT License'
  },
  {
    name: 'Frp',
    website: 'https://github.com/fatedier/frp',
    github: 'https://github.com/fatedier/frp',
    short_description: 'Fast reverse proxy',
    long_description: 'frp is a fast reverse proxy that exposes local servers behind NAT or firewall to the internet. It supports TCP and UDP.',
    alternative_to: 'ngrok',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },
  {
    name: 'Zrok',
    website: 'https://zrok.io',
    github: 'https://github.com/openziti/zrok',
    short_description: 'Open-source ngrok alternative',
    long_description: 'zrok is an open-source sharing platform built on OpenZiti. It allows you to share resources both publicly and privately.',
    alternative_to: 'ngrok',
    is_self_hosted: true,
    license: 'Apache License 2.0'
  },

  // Torrent Client - Alternative to uTorrent
  {
    name: 'qBittorrent',
    website: 'https://www.qbittorrent.org',
    github: 'https://github.com/qbittorrent/qBittorrent',
    short_description: 'Free and reliable BitTorrent client',
    long_description: 'qBittorrent is a free and open-source BitTorrent client. It aims to provide a feature-rich alternative to uTorrent without ads.',
    alternative_to: 'uTorrent',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },
  {
    name: 'Transmission',
    website: 'https://transmissionbt.com',
    github: 'https://github.com/transmission/transmission',
    short_description: 'Fast and easy BitTorrent client',
    long_description: 'Transmission is a fast, easy, and free BitTorrent client. It provides daemon support for headless operation and a web interface.',
    alternative_to: 'uTorrent',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },
  {
    name: 'Deluge',
    website: 'https://deluge-torrent.org',
    github: 'https://github.com/deluge-torrent/deluge',
    short_description: 'Lightweight BitTorrent client',
    long_description: 'Deluge is a lightweight, free software, cross-platform BitTorrent client. It uses a client-server model for remote operation.',
    alternative_to: 'uTorrent',
    is_self_hosted: false,
    license: 'GPL-3.0 License'
  },

  // Download Manager - Alternative to JDownloader
  {
    name: 'aria2',
    website: 'https://aria2.github.io',
    github: 'https://github.com/aria2/aria2',
    short_description: 'Lightweight multi-protocol download utility',
    long_description: 'aria2 is a lightweight multi-protocol and multi-source download utility. It supports HTTP, FTP, SFTP, BitTorrent, and Metalink.',
    alternative_to: 'JDownloader',
    is_self_hosted: false,
    license: 'GPL-2.0 License'
  },
];

// Function to find best matching categories for an alternative
function findCategoriesForAlternative(alt: typeof alternatives[0], allCategories: any[]): mongoose.Types.ObjectId[] {
  const altText = `${alt.alternative_to} ${alt.short_description} ${alt.long_description}`.toLowerCase();
  
  // Find matching category mapping
  for (const mapping of categoryMappings) {
    for (const keyword of mapping.keywords) {
      if (altText.includes(keyword.toLowerCase())) {
        // Find the actual category documents
        const matchedCategories = mapping.categories
          .map(slug => allCategories.find(c => c.slug === slug))
          .filter(c => c !== undefined)
          .slice(0, 3);
        
        if (matchedCategories.length >= 3) {
          return matchedCategories.map(c => c._id);
        }
      }
    }
  }
  
  // Default categories if no match found
  const defaultSlugs = ['developer-tools', 'productivity', 'business-software'];
  return defaultSlugs
    .map(slug => allCategories.find(c => c.slug === slug))
    .filter(c => c !== undefined)
    .map(c => c._id);
}

async function seedAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all categories first
    console.log('\n📁 Fetching categories...');
    const allCategories = await Category.find().lean();
    console.log(`   Found ${allCategories.length} categories`);

    if (allCategories.length === 0) {
      console.error('❌ No categories found! Please run seed-data.ts first.');
      process.exit(1);
    }

    // Get all proprietary software
    console.log('\n📁 Fetching proprietary software...');
    const allProprietarySoftware = await ProprietarySoftware.find().lean();
    console.log(`   Found ${allProprietarySoftware.length} proprietary software`);

    // Create a mapping from name (lowercase) to ObjectId for proprietary software
    const proprietaryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const prop of allProprietarySoftware) {
      proprietaryMap.set(prop.name.toLowerCase(), prop._id);
      // Also add common variations/aliases
      const slug = prop.slug.replace(/-/g, ' ');
      proprietaryMap.set(slug, prop._id);
      // Add without special characters
      const simplified = prop.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      proprietaryMap.set(simplified, prop._id);
    }

    // Add manual mappings for common alternative_to values that might not match exactly
    const manualMappings: { [key: string]: string } = {
      'adobe photoshop': 'photoshop',
      'adobe premiere pro': 'davinci resolve',
      'adobe illustrator': 'adobe illustrator',
      'google analytics': 'google analytics',
      'microsoft teams': 'microsoft teams',
      'google docs': 'google docs',
      'google sheets': 'google sheets',
      'google calendar': 'google calendar',
      'google contacts': 'google contacts',
      'google maps': 'google maps',
      'google drive': 'google drive',
      'google photos': 'google photos',
      'github actions': 'github actions',
      'github codespaces': 'github codespaces',
      'github gist': 'github gist',
      'aws s3': 'aws s3',
      'aws certificate manager': 'aws certificate manager',
      'vs code': 'vs code',
      'vscode': 'vs code',
      'visual studio code': 'vs code',
    };
    
    // Apply manual mappings
    for (const [altName, propName] of Object.entries(manualMappings)) {
      const propId = proprietaryMap.get(propName.toLowerCase());
      if (propId) {
        proprietaryMap.set(altName.toLowerCase(), propId);
      }
    }

    // Seed Alternatives
    console.log('\n🚀 Seeding alternatives...');
    let alternativeCount = 0;
    let skippedCount = 0;
    
    for (const alt of alternatives) {
      try {
        const slug = createSlug(alt.name);
        
        // Check if already exists
        const existing = await Alternative.findOne({ slug });
        if (existing) {
          skippedCount++;
          continue;
        }
        
        // Find categories for this alternative
        const categoryIds = findCategoriesForAlternative(alt, allCategories);
        
        // Find proprietary software ObjectId for alternative_to
        const alternativeToIds: mongoose.Types.ObjectId[] = [];
        if (alt.alternative_to) {
          const propId = proprietaryMap.get(alt.alternative_to.toLowerCase());
          if (propId) {
            alternativeToIds.push(propId);
          }
        }
        
        // Generate a random health score between 60-95
        const healthScore = Math.floor(Math.random() * 36) + 60;
        
        // Generate random vote score between 0-50
        const voteScore = Math.floor(Math.random() * 51);
        
        await Alternative.create({
          name: alt.name,
          slug,
          description: alt.short_description,
          short_description: alt.short_description,
          long_description: alt.long_description,
          website: alt.website,
          github: alt.github,
          license: alt.license,
          is_self_hosted: alt.is_self_hosted,
          health_score: healthScore,
          vote_score: voteScore,
          featured: Math.random() < 0.1, // 10% chance of being featured
          approved: true,
          status: 'approved',
          categories: categoryIds,
          alternative_to: alternativeToIds,
        });
        
        alternativeCount++;
        process.stdout.write(`\r   Added ${alternativeCount} alternatives (${skippedCount} skipped)`);
      } catch (err: any) {
        if (err.code === 11000) {
          // Duplicate key error - skip
          skippedCount++;
        } else {
          console.error(`\n   ❌ Error adding alternative ${alt.name}:`, err.message);
        }
      }
    }
    
    console.log(`\n✅ Seeded ${alternativeCount} alternatives (${skippedCount} already existed)`);

    // Now update ALL existing alternatives with alternative_to values
    console.log('\n🔄 Updating existing alternatives with alternative_to values...');
    let updatedCount = 0;
    let noMatchCount = 0;
    
    for (const alt of alternatives) {
      try {
        const slug = createSlug(alt.name);
        
        // Find proprietary software ObjectId for alternative_to
        if (alt.alternative_to) {
          const altToLower = alt.alternative_to.toLowerCase();
          let propId = proprietaryMap.get(altToLower);
          
          // Try without special characters if not found
          if (!propId) {
            const simplified = altToLower.replace(/[^a-z0-9]/g, '');
            propId = proprietaryMap.get(simplified);
          }
          
          if (propId) {
            const result = await Alternative.updateOne(
              { slug },
              { $set: { alternative_to: [propId] } }
            );
            if (result.modifiedCount > 0) {
              updatedCount++;
              process.stdout.write(`\r   Updated ${updatedCount} alternatives (${noMatchCount} no match)`);
            }
          } else {
            noMatchCount++;
          }
        }
      } catch (err: any) {
        console.error(`\n   ❌ Error updating alternative ${alt.name}:`, err.message);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} alternatives with alternative_to values`);
    if (noMatchCount > 0) {
      console.log(`   ⚠️  ${noMatchCount} alternatives had no matching proprietary software`);
    }
    console.log('\n🎉 Database seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
