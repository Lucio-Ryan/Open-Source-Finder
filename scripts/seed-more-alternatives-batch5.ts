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

// More proprietary software to add
const newProprietarySoftware = [
  // Wireframing & Prototyping
  { name: 'Balsamiq', slug: 'balsamiq', description: 'Wireframing tool', website: 'https://balsamiq.com' },
  { name: 'Marvel', slug: 'marvel', description: 'Design platform', website: 'https://marvelapp.com' },
  { name: 'Axure', slug: 'axure', description: 'Prototyping tool', website: 'https://axure.com' },
  { name: 'Proto.io', slug: 'proto-io', description: 'Prototyping', website: 'https://proto.io' },
  
  // Design Systems
  { name: 'InVision DSM', slug: 'invision-dsm', description: 'Design system manager', website: 'https://invisionapp.com' },
  { name: 'Zeroheight', slug: 'zeroheight', description: 'Design system docs', website: 'https://zeroheight.com' },
  
  // User Testing
  { name: 'UserTesting', slug: 'usertesting', description: 'User testing platform', website: 'https://usertesting.com' },
  { name: 'Maze', slug: 'maze', description: 'Rapid testing', website: 'https://maze.co' },
  { name: 'Lookback', slug: 'lookback', description: 'User research', website: 'https://lookback.io' },
  
  // Survey Tools
  { name: 'Typeform', slug: 'typeform', description: 'Form builder', website: 'https://typeform.com' },
  { name: 'SurveyMonkey', slug: 'surveymonkey', description: 'Survey software', website: 'https://surveymonkey.com' },
  { name: 'Google Forms', slug: 'google-forms', description: 'Form builder', website: 'https://docs.google.com/forms' },
  
  // Logging
  { name: 'Splunk', slug: 'splunk', description: 'Log management', website: 'https://splunk.com' },
  { name: 'Datadog', slug: 'datadog', description: 'Monitoring platform', website: 'https://datadoghq.com' },
  { name: 'New Relic', slug: 'new-relic', description: 'APM platform', website: 'https://newrelic.com' },
  { name: 'Sumo Logic', slug: 'sumo-logic', description: 'Log analytics', website: 'https://sumologic.com' },
  
  // APM
  { name: 'AppDynamics', slug: 'appdynamics', description: 'APM solution', website: 'https://appdynamics.com' },
  { name: 'Dynatrace', slug: 'dynatrace', description: 'Software intelligence', website: 'https://dynatrace.com' },
  
  // Status Pages
  { name: 'Statuspage', slug: 'statuspage', description: 'Status page hosting', website: 'https://statuspage.io' },
  { name: 'Better Uptime', slug: 'better-uptime', description: 'Incident management', website: 'https://betteruptime.com' },
  
  // Incident Management
  { name: 'PagerDuty', slug: 'pagerduty', description: 'Incident management', website: 'https://pagerduty.com' },
  { name: 'Opsgenie', slug: 'opsgenie', description: 'Alerting platform', website: 'https://opsgenie.com' },
  { name: 'VictorOps', slug: 'victorops', description: 'Incident response', website: 'https://victorops.com' },
  
  // Documentation
  { name: 'Confluence', slug: 'confluence', description: 'Team wiki', website: 'https://atlassian.com/confluence' },
  { name: 'Notion', slug: 'notion', description: 'Workspace', website: 'https://notion.so' },
  { name: 'Gitbook', slug: 'gitbook', description: 'Documentation', website: 'https://gitbook.com' },
  { name: 'Document360', slug: 'document360', description: 'Knowledge base', website: 'https://document360.com' },
  
  // Whiteboard
  { name: 'Miro', slug: 'miro', description: 'Online whiteboard', website: 'https://miro.com' },
  { name: 'FigJam', slug: 'figjam', description: 'Collaborative whiteboard', website: 'https://figma.com/figjam' },
  { name: 'Mural', slug: 'mural', description: 'Visual collaboration', website: 'https://mural.co' },
  { name: 'Lucidspark', slug: 'lucidspark', description: 'Virtual whiteboard', website: 'https://lucidspark.com' },
  
  // Diagram Tools
  { name: 'Lucidchart', slug: 'lucidchart', description: 'Diagramming', website: 'https://lucidchart.com' },
  { name: 'Draw.io Enterprise', slug: 'drawio-enterprise', description: 'Diagramming', website: 'https://drawio.com' },
  { name: 'Gliffy', slug: 'gliffy', description: 'Diagram software', website: 'https://gliffy.com' },
  
  // Form Builder
  { name: 'Jotform', slug: 'jotform', description: 'Form builder', website: 'https://jotform.com' },
  { name: 'Cognito Forms', slug: 'cognito-forms', description: 'Form builder', website: 'https://cognitoforms.com' },
  
  // No-Code
  { name: 'Bubble', slug: 'bubble', description: 'No-code platform', website: 'https://bubble.io' },
  { name: 'Adalo', slug: 'adalo', description: 'No-code apps', website: 'https://adalo.com' },
  { name: 'Glide', slug: 'glide', description: 'No-code apps', website: 'https://glideapps.com' },
  { name: 'Softr', slug: 'softr', description: 'No-code builder', website: 'https://softr.io' },
  
  // Workflow Automation
  { name: 'Zapier', slug: 'zapier', description: 'Automation platform', website: 'https://zapier.com' },
  { name: 'Make', slug: 'make-automation', description: 'Automation', website: 'https://make.com' },
  { name: 'Workato', slug: 'workato', description: 'Integration platform', website: 'https://workato.com' },
  
  // Internal Tools
  { name: 'Retool', slug: 'retool', description: 'Internal tools', website: 'https://retool.com' },
  { name: 'Appsmith', slug: 'appsmith-cloud', description: 'Internal tools', website: 'https://appsmith.com' },
  { name: 'Tooljet Cloud', slug: 'tooljet-cloud', description: 'Low-code platform', website: 'https://tooljet.com' },
  
  // Data Visualization
  { name: 'Tableau', slug: 'tableau', description: 'Analytics platform', website: 'https://tableau.com' },
  { name: 'Looker', slug: 'looker', description: 'BI platform', website: 'https://looker.com' },
  { name: 'Power BI', slug: 'power-bi', description: 'Business analytics', website: 'https://powerbi.microsoft.com' },
  { name: 'Mode', slug: 'mode', description: 'Analytics', website: 'https://mode.com' },
  
  // Data Pipeline
  { name: 'Fivetran', slug: 'fivetran', description: 'Data integration', website: 'https://fivetran.com' },
  { name: 'Stitch', slug: 'stitch', description: 'ETL service', website: 'https://stitchdata.com' },
  { name: 'Segment', slug: 'segment', description: 'Customer data', website: 'https://segment.com' },
  
  // Data Warehouse
  { name: 'Snowflake', slug: 'snowflake', description: 'Data warehouse', website: 'https://snowflake.com' },
  { name: 'BigQuery', slug: 'bigquery', description: 'Data warehouse', website: 'https://cloud.google.com/bigquery' },
  { name: 'Redshift', slug: 'redshift', description: 'Data warehouse', website: 'https://aws.amazon.com/redshift' },
  
  // PDF Tools
  { name: 'Adobe Acrobat', slug: 'adobe-acrobat', description: 'PDF software', website: 'https://acrobat.adobe.com' },
  { name: 'Foxit PDF', slug: 'foxit-pdf', description: 'PDF editor', website: 'https://foxit.com' },
  { name: 'PDFelement', slug: 'pdfelement', description: 'PDF editor', website: 'https://pdf.wondershare.com' },
  
  // Archive/Compress
  { name: 'WinRAR', slug: 'winrar', description: 'Archive manager', website: 'https://win-rar.com' },
  { name: 'WinZip', slug: 'winzip', description: 'File compression', website: 'https://winzip.com' },
  
  // FTP Clients
  { name: 'Transmit', slug: 'transmit', description: 'FTP client', website: 'https://panic.com/transmit' },
  { name: 'Cyberduck', slug: 'cyberduck-cloud', description: 'Cloud browser', website: 'https://cyberduck.io' },
  
  // SSH Tools
  { name: 'SecureCRT', slug: 'securecrt', description: 'SSH client', website: 'https://vandyke.com/securecrt' },
  { name: 'MobaXterm', slug: 'mobaxterm', description: 'Terminal for Windows', website: 'https://mobaxterm.mobatek.net' },
  
  // Remote Desktop
  { name: 'TeamViewer', slug: 'teamviewer', description: 'Remote desktop', website: 'https://teamviewer.com' },
  { name: 'AnyDesk', slug: 'anydesk', description: 'Remote desktop', website: 'https://anydesk.com' },
  { name: 'Parsec', slug: 'parsec', description: 'Remote access', website: 'https://parsec.app' },
  
  // Network Tools
  { name: 'Cisco Packet Tracer', slug: 'cisco-packet-tracer', description: 'Network simulator', website: 'https://cisco.com' },
  { name: 'SolarWinds', slug: 'solarwinds', description: 'Network management', website: 'https://solarwinds.com' },
  
  // VPN
  { name: 'NordVPN', slug: 'nordvpn', description: 'VPN service', website: 'https://nordvpn.com' },
  { name: 'ExpressVPN', slug: 'expressvpn', description: 'VPN service', website: 'https://expressvpn.com' },
  { name: 'Surfshark', slug: 'surfshark', description: 'VPN service', website: 'https://surfshark.com' },
  
  // Streaming Platform
  { name: 'Twitch', slug: 'twitch', description: 'Live streaming', website: 'https://twitch.tv' },
  { name: 'YouTube Live', slug: 'youtube-live', description: 'Live streaming', website: 'https://youtube.com' },
  
  // Podcast Hosting
  { name: 'Anchor', slug: 'anchor', description: 'Podcast hosting', website: 'https://anchor.fm' },
  { name: 'Buzzsprout', slug: 'buzzsprout', description: 'Podcast hosting', website: 'https://buzzsprout.com' },
  { name: 'Transistor', slug: 'transistor', description: 'Podcast hosting', website: 'https://transistor.fm' },
  
  // Image CDN
  { name: 'Cloudinary', slug: 'cloudinary', description: 'Media management', website: 'https://cloudinary.com' },
  { name: 'Imgix', slug: 'imgix', description: 'Image CDN', website: 'https://imgix.com' },
  
  // Stock Photos
  { name: 'Shutterstock', slug: 'shutterstock', description: 'Stock photos', website: 'https://shutterstock.com' },
  { name: 'Getty Images', slug: 'getty-images', description: 'Stock media', website: 'https://gettyimages.com' },
  { name: 'iStock', slug: 'istock', description: 'Stock photos', website: 'https://istockphoto.com' },
  
  // Icon Libraries
  { name: 'Font Awesome Pro', slug: 'font-awesome-pro', description: 'Icon toolkit', website: 'https://fontawesome.com' },
  { name: 'Noun Project', slug: 'noun-project', description: 'Icons collection', website: 'https://thenounproject.com' },
];

// More alternatives to add
const newAlternatives = [
  // Wireframing & Prototyping - Alternatives to Balsamiq, Marvel, Axure
  {
    name: 'Pencil Project',
    slug: 'pencil-project',
    short_description: 'Free wireframing tool',
    description: 'Pencil Project is an open-source wireframing tool. It provides stencils, mockups, and diagram creation with cross-platform support.',
    website: 'https://pencil.evolus.vn',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['balsamiq', 'axure', 'marvel'],
    categoryKeywords: ['wireframing', 'mockup', 'design', 'prototyping', 'ui-ux']
  },
  {
    name: 'Penpot',
    slug: 'penpot',
    short_description: 'Open-source design platform',
    description: 'Penpot is the first open-source design and prototyping platform for product teams. It is web-based with SVG-native design.',
    website: 'https://penpot.app',
    github: 'https://github.com/penpot/penpot',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['figma', 'balsamiq', 'marvel', 'axure'],
    categoryKeywords: ['design', 'prototyping', 'collaboration', 'svg', 'web']
  },
  {
    name: 'Quant-UX',
    slug: 'quant-ux',
    short_description: 'Prototyping and usability testing',
    description: 'Quant-UX is a free prototyping and usability testing tool. It provides design, prototyping, and user testing in one platform.',
    website: 'https://quant-ux.com',
    github: 'https://github.com/KlausSchaefers/quant-ux',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['marvel', 'proto-io', 'maze'],
    categoryKeywords: ['prototyping', 'usability', 'testing', 'design', 'ux']
  },

  // Survey Tools - Alternatives to Typeform, SurveyMonkey, Google Forms
  {
    name: 'LimeSurvey',
    slug: 'limesurvey',
    short_description: 'Open-source survey tool',
    description: 'LimeSurvey is the world\'s most popular open-source survey software. It provides unlimited surveys, questions, and respondents.',
    website: 'https://www.limesurvey.org',
    github: 'https://github.com/LimeSurvey/LimeSurvey',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform', 'surveymonkey', 'google-forms'],
    categoryKeywords: ['survey', 'forms', 'questionnaire', 'research', 'self-hosted']
  },
  {
    name: 'Formbricks',
    slug: 'formbricks',
    short_description: 'Open-source survey suite',
    description: 'Formbricks is an open-source experience management suite. It provides in-app surveys, feedback widgets, and user research tools.',
    website: 'https://formbricks.com',
    github: 'https://github.com/formbricks/formbricks',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform', 'surveymonkey', 'usertesting'],
    categoryKeywords: ['survey', 'feedback', 'ux', 'research', 'in-app']
  },
  {
    name: 'Heyform',
    slug: 'heyform',
    short_description: 'Form builder alternative',
    description: 'Heyform is an open-source form builder. It provides beautiful forms with conditional logic and integrations.',
    website: 'https://heyform.net',
    github: 'https://github.com/heyform/heyform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform', 'google-forms', 'jotform'],
    categoryKeywords: ['forms', 'survey', 'builder', 'logic', 'beautiful']
  },
  {
    name: 'Formcarry',
    slug: 'formcarry',
    short_description: 'Form backend service',
    description: 'Formcarry is a form backend that handles form submissions. It provides spam protection, file uploads, and integrations.',
    website: 'https://formcarry.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Open API',
    is_self_hosted: false,
    alternative_to: ['typeform', 'jotform'],
    categoryKeywords: ['forms', 'backend', 'api', 'submissions', 'spam']
  },

  // Logging & Monitoring - Alternatives to Splunk, Datadog, New Relic
  {
    name: 'Graylog',
    slug: 'graylog',
    short_description: 'Log management platform',
    description: 'Graylog is a centralized log management solution. It provides real-time search, analysis, and alerting on log data.',
    website: 'https://www.graylog.org',
    github: 'https://github.com/Graylog2/graylog2-server',
    license: 'SSPL',
    is_self_hosted: true,
    alternative_to: ['splunk', 'datadog', 'sumo-logic'],
    categoryKeywords: ['logging', 'monitoring', 'search', 'analysis', 'alerts']
  },
  {
    name: 'Loki',
    slug: 'loki',
    short_description: 'Log aggregation system',
    description: 'Grafana Loki is a horizontally-scalable log aggregation system. It is designed to be cost-effective and integrates with Grafana.',
    website: 'https://grafana.com/loki',
    github: 'https://github.com/grafana/loki',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['splunk', 'datadog', 'sumo-logic'],
    categoryKeywords: ['logging', 'monitoring', 'grafana', 'scalable', 'aggregation']
  },
  {
    name: 'Vector',
    slug: 'vector',
    short_description: 'High-performance observability pipeline',
    description: 'Vector is a high-performance observability data pipeline. It collects, transforms, and routes logs, metrics, and traces.',
    website: 'https://vector.dev',
    github: 'https://github.com/vectordotdev/vector',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['datadog', 'splunk'],
    categoryKeywords: ['observability', 'pipeline', 'logs', 'metrics', 'traces']
  },

  // APM - Alternatives to AppDynamics, Dynatrace, New Relic
  {
    name: 'SigNoz',
    slug: 'signoz',
    short_description: 'Open-source APM',
    description: 'SigNoz is an open-source APM tool. It provides traces, metrics, and logs in a single pane with OpenTelemetry support.',
    website: 'https://signoz.io',
    github: 'https://github.com/SigNoz/signoz',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['datadog', 'new-relic', 'appdynamics', 'dynatrace'],
    categoryKeywords: ['apm', 'monitoring', 'traces', 'metrics', 'opentelemetry']
  },
  {
    name: 'Elastic APM',
    slug: 'elastic-apm',
    short_description: 'Application performance monitoring',
    description: 'Elastic APM is built on the Elastic Stack. It provides real-time performance monitoring of applications with distributed tracing.',
    website: 'https://www.elastic.co/apm',
    github: 'https://github.com/elastic/apm-server',
    license: 'Elastic License',
    is_self_hosted: true,
    alternative_to: ['new-relic', 'appdynamics', 'dynatrace'],
    categoryKeywords: ['apm', 'monitoring', 'elasticsearch', 'traces', 'performance']
  },

  // Status Pages - Alternatives to Statuspage, Better Uptime
  {
    name: 'Cachet',
    slug: 'cachet',
    short_description: 'Open-source status page',
    description: 'Cachet is an open-source status page system. It provides beautiful status pages with incident management and metrics.',
    website: 'https://cachethq.io',
    github: 'https://github.com/CachetHQ/Cachet',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['statuspage', 'better-uptime'],
    categoryKeywords: ['status-page', 'monitoring', 'incidents', 'metrics', 'uptime']
  },
  {
    name: 'Upptime',
    slug: 'upptime',
    short_description: 'GitHub-powered status page',
    description: 'Upptime is a GitHub-powered open-source uptime monitor and status page. It runs entirely on GitHub Actions and Pages.',
    website: 'https://upptime.js.org',
    github: 'https://github.com/upptime/upptime',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['statuspage', 'better-uptime'],
    categoryKeywords: ['status-page', 'github', 'uptime', 'monitoring', 'free']
  },
  {
    name: 'Gatus',
    slug: 'gatus',
    short_description: 'Health dashboard',
    description: 'Gatus is an automated developer-oriented health dashboard. It monitors endpoints and provides alerting with a clean interface.',
    website: 'https://gatus.io',
    github: 'https://github.com/TwiN/gatus',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['statuspage', 'better-uptime'],
    categoryKeywords: ['status-page', 'health', 'monitoring', 'endpoints', 'alerts']
  },
  {
    name: 'Vigil',
    slug: 'vigil',
    short_description: 'Microservices status page',
    description: 'Vigil is a microservices status page. It automatically monitors local and remote services, and generates a status page.',
    website: 'https://github.com/valeriansaliou/vigil',
    github: 'https://github.com/valeriansaliou/vigil',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['statuspage'],
    categoryKeywords: ['status-page', 'microservices', 'monitoring', 'rust', 'automatic']
  },

  // Incident Management - Alternatives to PagerDuty, Opsgenie, VictorOps
  {
    name: 'Oncall',
    slug: 'grafana-oncall',
    short_description: 'On-call management',
    description: 'Grafana OnCall is an open-source on-call management solution. It provides schedules, escalations, and integrations.',
    website: 'https://grafana.com/products/oncall',
    github: 'https://github.com/grafana/oncall',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['pagerduty', 'opsgenie', 'victorops'],
    categoryKeywords: ['oncall', 'incidents', 'alerts', 'schedules', 'grafana']
  },
  {
    name: 'Keep',
    slug: 'keep-alerting',
    short_description: 'Open-source alert management',
    description: 'Keep is an open-source alert management and AIOps platform. It correlates alerts from multiple sources into actionable incidents.',
    website: 'https://www.keephq.dev',
    github: 'https://github.com/keephq/keep',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['pagerduty', 'opsgenie'],
    categoryKeywords: ['alerts', 'incidents', 'aiops', 'correlation', 'management']
  },

  // Documentation - Alternatives to Confluence, Notion, Gitbook
  {
    name: 'BookStack',
    slug: 'bookstack',
    short_description: 'Self-hosted wiki platform',
    description: 'BookStack is a simple, self-hosted wiki platform. It is designed to be intuitive with a hierarchical book-chapter-page structure.',
    website: 'https://www.bookstackapp.com',
    github: 'https://github.com/BookStackApp/BookStack',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['confluence', 'notion', 'gitbook'],
    categoryKeywords: ['wiki', 'documentation', 'knowledge-base', 'self-hosted', 'books']
  },
  {
    name: 'Outline',
    slug: 'outline',
    short_description: 'Knowledge base for teams',
    description: 'Outline is a fast, collaborative knowledge base. It provides a beautiful editor, real-time collaboration, and SSO.',
    website: 'https://www.getoutline.com',
    github: 'https://github.com/outline/outline',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['confluence', 'notion', 'gitbook'],
    categoryKeywords: ['wiki', 'knowledge-base', 'collaboration', 'teams', 'editor']
  },
  {
    name: 'Docusaurus',
    slug: 'docusaurus',
    short_description: 'Documentation website builder',
    description: 'Docusaurus is a static-site generator for building documentation websites. It provides versioning, i18n, and search out of the box.',
    website: 'https://docusaurus.io',
    github: 'https://github.com/facebook/docusaurus',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['gitbook', 'document360'],
    categoryKeywords: ['documentation', 'static-site', 'versioning', 'i18n', 'search']
  },
  {
    name: 'MkDocs',
    slug: 'mkdocs',
    short_description: 'Project documentation with Markdown',
    description: 'MkDocs is a fast, simple static site generator for building project documentation. It is configured with a single YAML file.',
    website: 'https://www.mkdocs.org',
    github: 'https://github.com/mkdocs/mkdocs',
    license: 'BSD-2-Clause License',
    is_self_hosted: false,
    alternative_to: ['gitbook', 'document360'],
    categoryKeywords: ['documentation', 'markdown', 'static-site', 'simple', 'yaml']
  },
  {
    name: 'VitePress',
    slug: 'vitepress',
    short_description: 'Vite & Vue powered docs',
    description: 'VitePress is a static site generator powered by Vite. It is designed for building documentation with Vue components.',
    website: 'https://vitepress.dev',
    github: 'https://github.com/vuejs/vitepress',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['gitbook', 'document360'],
    categoryKeywords: ['documentation', 'vite', 'vue', 'static-site', 'fast']
  },

  // Whiteboard - Alternatives to Miro, FigJam, Mural
  {
    name: 'Excalidraw',
    slug: 'excalidraw',
    short_description: 'Virtual whiteboard',
    description: 'Excalidraw is a virtual whiteboard for sketching hand-drawn diagrams. It is collaborative and provides a natural drawing experience.',
    website: 'https://excalidraw.com',
    github: 'https://github.com/excalidraw/excalidraw',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['miro', 'figjam', 'mural'],
    categoryKeywords: ['whiteboard', 'diagrams', 'collaboration', 'drawing', 'sketching']
  },
  {
    name: 'tldraw',
    slug: 'tldraw',
    short_description: 'Collaborative drawing app',
    description: 'tldraw is a collaborative digital whiteboard. It provides infinite canvas, shapes, and real-time collaboration.',
    website: 'https://www.tldraw.com',
    github: 'https://github.com/tldraw/tldraw',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['miro', 'figjam', 'mural'],
    categoryKeywords: ['whiteboard', 'drawing', 'collaboration', 'canvas', 'shapes']
  },

  // Diagram Tools - Alternatives to Lucidchart, Gliffy
  {
    name: 'Draw.io',
    slug: 'drawio',
    short_description: 'Free diagram software',
    description: 'Draw.io (diagrams.net) is a free, open-source diagramming application. It works in browsers with storage options and integrations.',
    website: 'https://www.diagrams.net',
    github: 'https://github.com/jgraph/drawio',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['lucidchart', 'gliffy', 'drawio-enterprise'],
    categoryKeywords: ['diagrams', 'flowcharts', 'uml', 'free', 'browser']
  },
  {
    name: 'Mermaid',
    slug: 'mermaid',
    short_description: 'Diagrams from text',
    description: 'Mermaid lets you create diagrams using text and code. It supports flowcharts, sequence diagrams, Gantt charts, and more.',
    website: 'https://mermaid.js.org',
    github: 'https://github.com/mermaid-js/mermaid',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['lucidchart', 'gliffy'],
    categoryKeywords: ['diagrams', 'text', 'markdown', 'flowcharts', 'code']
  },
  {
    name: 'PlantUML',
    slug: 'plantuml',
    short_description: 'UML from plain text',
    description: 'PlantUML is a tool to create UML diagrams from plain text. It supports sequence, use case, class, and many other diagram types.',
    website: 'https://plantuml.com',
    github: 'https://github.com/plantuml/plantuml',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['lucidchart', 'gliffy'],
    categoryKeywords: ['uml', 'diagrams', 'text', 'code', 'sequence']
  },

  // Workflow Automation - Alternatives to Zapier, Make, Workato
  {
    name: 'n8n',
    slug: 'n8n',
    short_description: 'Workflow automation tool',
    description: 'n8n is a free and source-available workflow automation tool. It provides node-based automation with 350+ integrations.',
    website: 'https://n8n.io',
    github: 'https://github.com/n8n-io/n8n',
    license: 'Sustainable Use License',
    is_self_hosted: true,
    alternative_to: ['zapier', 'make-automation', 'workato'],
    categoryKeywords: ['automation', 'workflow', 'integrations', 'nodes', 'self-hosted']
  },
  {
    name: 'Activepieces',
    slug: 'activepieces',
    short_description: 'No-code automation tool',
    description: 'Activepieces is an open-source no-code business automation tool. It provides a visual builder for creating automation flows.',
    website: 'https://www.activepieces.com',
    github: 'https://github.com/activepieces/activepieces',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['zapier', 'make-automation'],
    categoryKeywords: ['automation', 'no-code', 'visual', 'flows', 'business']
  },
  {
    name: 'Huginn',
    slug: 'huginn',
    short_description: 'Hackable automation agents',
    description: 'Huginn is a system for building agents that perform automated tasks. It can monitor websites, trigger webhooks, and more.',
    website: 'https://github.com/huginn/huginn',
    github: 'https://github.com/huginn/huginn',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['zapier', 'make-automation'],
    categoryKeywords: ['automation', 'agents', 'monitoring', 'webhooks', 'hackable']
  },

  // Internal Tools - Alternatives to Retool, Appsmith, Tooljet
  {
    name: 'Appsmith',
    slug: 'appsmith',
    short_description: 'Open-source internal tool builder',
    description: 'Appsmith is an open-source platform for building internal tools. It provides drag-and-drop UI builder with database and API connections.',
    website: 'https://www.appsmith.com',
    github: 'https://github.com/appsmithorg/appsmith',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['retool', 'appsmith-cloud'],
    categoryKeywords: ['internal-tools', 'low-code', 'admin', 'dashboards', 'ui-builder']
  },
  {
    name: 'Tooljet',
    slug: 'tooljet',
    short_description: 'Low-code internal tools',
    description: 'Tooljet is an open-source low-code framework for building internal tools. It provides visual builder with 40+ data source integrations.',
    website: 'https://www.tooljet.com',
    github: 'https://github.com/ToolJet/ToolJet',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['retool', 'tooljet-cloud'],
    categoryKeywords: ['internal-tools', 'low-code', 'admin', 'integrations', 'visual']
  },
  {
    name: 'Budibase',
    slug: 'budibase',
    short_description: 'Low-code platform',
    description: 'Budibase is an open-source low-code platform for building internal tools. It provides database, automations, and custom apps.',
    website: 'https://budibase.com',
    github: 'https://github.com/Budibase/budibase',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['retool', 'bubble', 'adalo'],
    categoryKeywords: ['low-code', 'internal-tools', 'database', 'automations', 'apps']
  },
  {
    name: 'NocoBase',
    slug: 'nocobase',
    short_description: 'No-code/low-code platform',
    description: 'NocoBase is a scalability-first, open-source no-code/low-code platform. It provides a plugin-based architecture for business applications.',
    website: 'https://www.nocobase.com',
    github: 'https://github.com/nocobase/nocobase',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['retool', 'bubble'],
    categoryKeywords: ['no-code', 'low-code', 'plugins', 'business', 'scalable']
  },

  // Data Visualization - Alternatives to Tableau, Looker, Power BI
  {
    name: 'Apache Superset',
    slug: 'apache-superset',
    short_description: 'Data exploration platform',
    description: 'Apache Superset is a modern data exploration and visualization platform. It provides SQL IDE, chart builder, and dashboard creation.',
    website: 'https://superset.apache.org',
    github: 'https://github.com/apache/superset',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['tableau', 'looker', 'power-bi', 'mode'],
    categoryKeywords: ['bi', 'visualization', 'dashboards', 'sql', 'charts']
  },
  {
    name: 'Metabase',
    slug: 'metabase',
    short_description: 'Business intelligence tool',
    description: 'Metabase is an easy, open-source way for everyone to ask questions and learn from data. It provides charts, dashboards, and SQL support.',
    website: 'https://www.metabase.com',
    github: 'https://github.com/metabase/metabase',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['tableau', 'looker', 'power-bi'],
    categoryKeywords: ['bi', 'analytics', 'dashboards', 'sql', 'questions']
  },
  {
    name: 'Redash',
    slug: 'redash',
    short_description: 'Query and visualize data',
    description: 'Redash helps you make sense of your data. It connects to any data source, queries, and visualizes results.',
    website: 'https://redash.io',
    github: 'https://github.com/getredash/redash',
    license: 'BSD-2-Clause License',
    is_self_hosted: true,
    alternative_to: ['tableau', 'looker', 'mode'],
    categoryKeywords: ['bi', 'queries', 'visualization', 'dashboards', 'data']
  },
  {
    name: 'Lightdash',
    slug: 'lightdash',
    short_description: 'dbt-powered BI',
    description: 'Lightdash is an open-source BI tool for teams that use dbt. It provides metrics layer, charts, and dashboards with dbt integration.',
    website: 'https://www.lightdash.com',
    github: 'https://github.com/lightdash/lightdash',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['looker', 'tableau'],
    categoryKeywords: ['bi', 'dbt', 'metrics', 'dashboards', 'analytics']
  },

  // Data Pipeline - Alternatives to Fivetran, Stitch, Segment
  {
    name: 'Airbyte',
    slug: 'airbyte',
    short_description: 'Data integration platform',
    description: 'Airbyte is an open-source data integration platform. It provides 300+ connectors for moving data from sources to destinations.',
    website: 'https://airbyte.com',
    github: 'https://github.com/airbytehq/airbyte',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['fivetran', 'stitch', 'segment'],
    categoryKeywords: ['etl', 'data-integration', 'connectors', 'pipelines', 'sync']
  },
  {
    name: 'Meltano',
    slug: 'meltano',
    short_description: 'DataOps platform',
    description: 'Meltano is an open-source DataOps platform. It provides ELT pipelines with Singer connectors and dbt transformations.',
    website: 'https://meltano.com',
    github: 'https://github.com/meltano/meltano',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['fivetran', 'stitch'],
    categoryKeywords: ['elt', 'dataops', 'singer', 'dbt', 'pipelines']
  },
  {
    name: 'Apache Airflow',
    slug: 'apache-airflow',
    short_description: 'Workflow orchestration',
    description: 'Apache Airflow is a platform to programmatically author, schedule, and monitor workflows. It is extensible with Python.',
    website: 'https://airflow.apache.org',
    github: 'https://github.com/apache/airflow',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['fivetran', 'workato'],
    categoryKeywords: ['workflow', 'orchestration', 'scheduling', 'dags', 'python']
  },
  {
    name: 'Dagster',
    slug: 'dagster',
    short_description: 'Data orchestration platform',
    description: 'Dagster is an orchestration platform for data engineering. It provides software-defined assets, lineage, and observability.',
    website: 'https://dagster.io',
    github: 'https://github.com/dagster-io/dagster',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['fivetran', 'workato'],
    categoryKeywords: ['orchestration', 'data-engineering', 'assets', 'lineage', 'python']
  },
  {
    name: 'Prefect',
    slug: 'prefect',
    short_description: 'Workflow orchestration',
    description: 'Prefect is a workflow orchestration tool. It provides Python-native workflows with scheduling, retries, and observability.',
    website: 'https://www.prefect.io',
    github: 'https://github.com/PrefectHQ/prefect',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['fivetran'],
    categoryKeywords: ['workflow', 'orchestration', 'python', 'scheduling', 'tasks']
  },

  // PDF Tools - Alternatives to Adobe Acrobat, Foxit, PDFelement
  {
    name: 'PDF.js',
    slug: 'pdfjs',
    short_description: 'PDF viewer in JavaScript',
    description: 'PDF.js is a PDF viewer built with JavaScript. It is used by Firefox and provides rendering PDFs in web applications.',
    website: 'https://mozilla.github.io/pdf.js',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['adobe-acrobat', 'foxit-pdf'],
    categoryKeywords: ['pdf', 'viewer', 'javascript', 'web', 'mozilla']
  },
  {
    name: 'Stirling PDF',
    slug: 'stirling-pdf',
    short_description: 'Self-hosted PDF tools',
    description: 'Stirling PDF is a self-hosted PDF manipulation tool. It provides merging, splitting, converting, and many other PDF operations.',
    website: 'https://github.com/Stirling-Tools/Stirling-PDF',
    github: 'https://github.com/Stirling-Tools/Stirling-PDF',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['adobe-acrobat', 'foxit-pdf', 'pdfelement'],
    categoryKeywords: ['pdf', 'tools', 'merge', 'split', 'convert']
  },
  {
    name: 'PDFsam',
    slug: 'pdfsam',
    short_description: 'PDF split and merge',
    description: 'PDFsam is a free and open-source desktop application. It provides splitting, merging, rotating, and extracting PDF pages.',
    website: 'https://pdfsam.org',
    github: 'https://github.com/torakiki/pdfsam',
    license: 'AGPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-acrobat', 'foxit-pdf'],
    categoryKeywords: ['pdf', 'split', 'merge', 'desktop', 'java']
  },

  // Archive Tools - Alternatives to WinRAR, WinZip
  {
    name: '7-Zip',
    slug: '7-zip',
    short_description: 'File archiver',
    description: '7-Zip is a free and open-source file archiver. It supports 7z, ZIP, GZIP, TAR, and many other archive formats with high compression.',
    website: 'https://www.7-zip.org',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'LGPL-2.1 License',
    is_self_hosted: false,
    alternative_to: ['winrar', 'winzip'],
    categoryKeywords: ['archive', 'compression', '7z', 'zip', 'free']
  },
  {
    name: 'PeaZip',
    slug: 'peazip',
    short_description: 'Free file archiver',
    description: 'PeaZip is a free file archiver utility. It supports 200+ archive formats with encryption, archive conversion, and splitting.',
    website: 'https://peazip.github.io',
    github: 'https://github.com/peazip/PeaZip',
    license: 'LGPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['winrar', 'winzip'],
    categoryKeywords: ['archive', 'compression', 'encryption', 'formats', 'free']
  },

  // FTP/SFTP - Alternatives to Transmit, Cyberduck
  {
    name: 'FileZilla',
    slug: 'filezilla',
    short_description: 'Free FTP solution',
    description: 'FileZilla is a free, open-source FTP solution. It supports FTP, FTPS, and SFTP with cross-platform client and server.',
    website: 'https://filezilla-project.org',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['transmit', 'cyberduck-cloud'],
    categoryKeywords: ['ftp', 'sftp', 'file-transfer', 'client', 'server']
  },
  {
    name: 'WinSCP',
    slug: 'winscp',
    short_description: 'Windows file transfer',
    description: 'WinSCP is a free SFTP, FTP, and SCP client for Windows. It provides file manager, scripting, and automation capabilities.',
    website: 'https://winscp.net',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['transmit', 'cyberduck-cloud'],
    categoryKeywords: ['sftp', 'ftp', 'scp', 'windows', 'file-transfer']
  },

  // Remote Desktop - Alternatives to TeamViewer, AnyDesk, Parsec
  {
    name: 'RustDesk',
    slug: 'rustdesk',
    short_description: 'Open-source remote desktop',
    description: 'RustDesk is an open-source remote desktop application. It provides self-hosted server option with cross-platform clients.',
    website: 'https://rustdesk.com',
    github: 'https://github.com/rustdesk/rustdesk',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['teamviewer', 'anydesk', 'parsec'],
    categoryKeywords: ['remote-desktop', 'self-hosted', 'rust', 'cross-platform', 'vnc']
  },
  {
    name: 'Apache Guacamole',
    slug: 'apache-guacamole',
    short_description: 'Clientless remote desktop',
    description: 'Apache Guacamole is a clientless remote desktop gateway. It supports VNC, RDP, and SSH with browser-based access.',
    website: 'https://guacamole.apache.org',
    github: 'https://github.com/apache/guacamole-server',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['teamviewer', 'anydesk'],
    categoryKeywords: ['remote-desktop', 'browser', 'vnc', 'rdp', 'ssh']
  },
  {
    name: 'MeshCentral',
    slug: 'meshcentral',
    short_description: 'Remote device management',
    description: 'MeshCentral is an open-source remote monitoring and management web site. It provides remote desktop, terminal, and file transfers.',
    website: 'https://meshcentral.com',
    github: 'https://github.com/Ylianst/MeshCentral',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['teamviewer', 'anydesk'],
    categoryKeywords: ['remote-desktop', 'management', 'monitoring', 'web', 'terminal']
  },

  // VPN - Alternatives to NordVPN, ExpressVPN, Surfshark
  {
    name: 'WireGuard',
    slug: 'wireguard',
    short_description: 'Fast VPN protocol',
    description: 'WireGuard is an extremely simple yet fast VPN protocol. It is designed to be lean, highly performant, and cryptographically sound.',
    website: 'https://www.wireguard.com',
    github: 'https://github.com/WireGuard/wireguard-go',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['nordvpn', 'expressvpn', 'surfshark'],
    categoryKeywords: ['vpn', 'security', 'fast', 'protocol', 'encryption']
  },
  {
    name: 'OpenVPN',
    slug: 'openvpn',
    short_description: 'Open-source VPN',
    description: 'OpenVPN is an open-source VPN protocol. It provides secure point-to-point connections with SSL/TLS for key exchange.',
    website: 'https://openvpn.net',
    github: 'https://github.com/OpenVPN/openvpn',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['nordvpn', 'expressvpn', 'surfshark'],
    categoryKeywords: ['vpn', 'security', 'ssl', 'protocol', 'open-source']
  },
  {
    name: 'Tailscale',
    slug: 'tailscale',
    short_description: 'Zero-config VPN',
    description: 'Tailscale is a zero-config VPN built on WireGuard. The client is open-source and provides seamless mesh networking.',
    website: 'https://tailscale.com',
    github: 'https://github.com/tailscale/tailscale',
    license: 'BSD-3-Clause License',
    is_self_hosted: false,
    alternative_to: ['nordvpn', 'expressvpn'],
    categoryKeywords: ['vpn', 'wireguard', 'mesh', 'zero-config', 'networking']
  },
  {
    name: 'Headscale',
    slug: 'headscale',
    short_description: 'Self-hosted Tailscale control',
    description: 'Headscale is an open-source implementation of the Tailscale control server. It allows self-hosting the coordination server.',
    website: 'https://github.com/juanfont/headscale',
    github: 'https://github.com/juanfont/headscale',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['nordvpn', 'expressvpn'],
    categoryKeywords: ['vpn', 'tailscale', 'self-hosted', 'control', 'mesh']
  },

  // Streaming - Alternatives to Twitch, YouTube Live
  {
    name: 'Owncast',
    slug: 'owncast',
    short_description: 'Self-hosted live streaming',
    description: 'Owncast is a self-hosted live video streaming server. It provides live video, chat, and a complete streaming platform.',
    website: 'https://owncast.online',
    github: 'https://github.com/owncast/owncast',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['twitch', 'youtube-live'],
    categoryKeywords: ['streaming', 'live', 'video', 'chat', 'self-hosted']
  },
  {
    name: 'PeerTube',
    slug: 'peertube',
    short_description: 'Decentralized video platform',
    description: 'PeerTube is a free, decentralized video platform using WebTorrent. It provides federation, live streaming, and no ads.',
    website: 'https://joinpeertube.org',
    github: 'https://github.com/Chocobozzz/PeerTube',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['youtube-live', 'twitch'],
    categoryKeywords: ['video', 'streaming', 'decentralized', 'federation', 'p2p']
  },

  // Podcast Hosting - Alternatives to Anchor, Buzzsprout, Transistor
  {
    name: 'Castopod',
    slug: 'castopod',
    short_description: 'Open-source podcast hosting',
    description: 'Castopod is a free and open-source podcast hosting platform. It provides podcast management, analytics, and ActivityPub federation.',
    website: 'https://castopod.org',
    github: 'https://github.com/ad-aures/castopod',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['anchor', 'buzzsprout', 'transistor'],
    categoryKeywords: ['podcast', 'hosting', 'analytics', 'federation', 'self-hosted']
  },
  {
    name: 'Funkwhale',
    slug: 'funkwhale',
    short_description: 'Audio hosting platform',
    description: 'Funkwhale is a social platform to enjoy and share audio. It supports podcasts, music, and federation with ActivityPub.',
    website: 'https://funkwhale.audio',
    github: 'https://github.com/funkwhale/funkwhale',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['anchor', 'buzzsprout'],
    categoryKeywords: ['audio', 'podcast', 'music', 'federation', 'social']
  },

  // Stock Photos - Alternatives to Shutterstock, Getty, iStock
  {
    name: 'Unsplash',
    slug: 'unsplash',
    short_description: 'Free high-res photos',
    description: 'Unsplash is a platform for freely-usable images. It provides high-resolution photos for free with a generous license.',
    website: 'https://unsplash.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Unsplash License',
    is_self_hosted: false,
    alternative_to: ['shutterstock', 'getty-images', 'istock'],
    categoryKeywords: ['photos', 'stock', 'free', 'high-res', 'images']
  },
  {
    name: 'Pexels',
    slug: 'pexels',
    short_description: 'Free stock photos and videos',
    description: 'Pexels provides free stock photos and videos. All content is free to use with no attribution required.',
    website: 'https://www.pexels.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Pexels License',
    is_self_hosted: false,
    alternative_to: ['shutterstock', 'getty-images', 'istock'],
    categoryKeywords: ['photos', 'videos', 'stock', 'free', 'creative']
  },
  {
    name: 'Pixabay',
    slug: 'pixabay',
    short_description: 'Free images and videos',
    description: 'Pixabay is a community of creatives sharing royalty-free images, videos, and music. All content is safe to use commercially.',
    website: 'https://pixabay.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Pixabay License',
    is_self_hosted: false,
    alternative_to: ['shutterstock', 'getty-images', 'istock'],
    categoryKeywords: ['images', 'videos', 'music', 'stock', 'royalty-free']
  },

  // Icons - Alternatives to Font Awesome Pro, Noun Project
  {
    name: 'Heroicons',
    slug: 'heroicons',
    short_description: 'SVG icons by Tailwind',
    description: 'Heroicons are beautiful hand-crafted SVG icons by the makers of Tailwind CSS. They come in outline and solid styles.',
    website: 'https://heroicons.com',
    github: 'https://github.com/tailwindlabs/heroicons',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['font-awesome-pro', 'noun-project'],
    categoryKeywords: ['icons', 'svg', 'tailwind', 'ui', 'free']
  },
  {
    name: 'Lucide',
    slug: 'lucide',
    short_description: 'Beautiful & consistent icons',
    description: 'Lucide is a fork of Feather Icons with a growing icon library. It provides consistent, beautiful SVG icons.',
    website: 'https://lucide.dev',
    github: 'https://github.com/lucide-icons/lucide',
    license: 'ISC License',
    is_self_hosted: false,
    alternative_to: ['font-awesome-pro', 'noun-project'],
    categoryKeywords: ['icons', 'svg', 'feather', 'consistent', 'open-source']
  },
  {
    name: 'Tabler Icons',
    slug: 'tabler-icons',
    short_description: 'Free SVG icons',
    description: 'Tabler Icons is a set of over 4000 free MIT-licensed SVG icons. They are highly consistent, customizable, and optimized.',
    website: 'https://tabler-icons.io',
    github: 'https://github.com/tabler/tabler-icons',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['font-awesome-pro', 'noun-project'],
    categoryKeywords: ['icons', 'svg', 'free', 'mit', 'customizable']
  },
  {
    name: 'Iconoir',
    slug: 'iconoir',
    short_description: 'Open-source icon library',
    description: 'Iconoir is one of the biggest open-source icon libraries. It provides 1300+ SVG icons with React, Vue, and Flutter support.',
    website: 'https://iconoir.com',
    github: 'https://github.com/iconoir-icons/iconoir',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['font-awesome-pro', 'noun-project'],
    categoryKeywords: ['icons', 'svg', 'react', 'vue', 'flutter']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  'wireframing': ['ui-ux', 'design'],
  'mockup': ['ui-ux', 'design'],
  'design': ['design', 'ui-ux'],
  'prototyping': ['ui-ux', 'design'],
  'ui-ux': ['ui-ux', 'design'],
  'collaboration': ['communication-collaboration', 'productivity'],
  'svg': ['graphic-design', 'frontend-development'],
  'web': ['frontend-development', 'developer-tools'],
  'usability': ['ui-ux', 'testing-qa'],
  'testing': ['testing-qa', 'developer-tools'],
  'ux': ['ui-ux', 'design'],
  'survey': ['marketing-automation', 'communication-collaboration'],
  'forms': ['developer-tools', 'productivity'],
  'questionnaire': ['marketing-automation', 'communication-collaboration'],
  'research': ['analytics', 'business-intelligence'],
  'self-hosted': ['self-hosting', 'devops-infrastructure'],
  'feedback': ['customer-service', 'analytics'],
  'in-app': ['mobile', 'developer-tools'],
  'builder': ['developer-tools', 'no-code'],
  'logic': ['developer-tools', 'automation'],
  'beautiful': ['design', 'ui-ux'],
  'backend': ['backend-development', 'developer-tools'],
  'api': ['api-development', 'developer-tools'],
  'submissions': ['forms', 'backend-development'],
  'spam': ['security-privacy', 'developer-tools'],
  'logging': ['monitoring-observability', 'devops-infrastructure'],
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'search': ['search', 'analytics'],
  'analysis': ['analytics', 'business-intelligence'],
  'alerts': ['monitoring-observability', 'devops-infrastructure'],
  'grafana': ['monitoring-observability', 'developer-tools'],
  'scalable': ['devops-infrastructure', 'performance'],
  'aggregation': ['analytics', 'devops-infrastructure'],
  'observability': ['monitoring-observability', 'devops-infrastructure'],
  'pipeline': ['ci-cd', 'data-engineering'],
  'logs': ['monitoring-observability', 'devops-infrastructure'],
  'metrics': ['monitoring-observability', 'analytics'],
  'traces': ['monitoring-observability', 'devops-infrastructure'],
  'apm': ['monitoring-observability', 'developer-tools'],
  'opentelemetry': ['monitoring-observability', 'devops-infrastructure'],
  'elasticsearch': ['search', 'database'],
  'performance': ['performance', 'monitoring-observability'],
  'status-page': ['monitoring-observability', 'devops-infrastructure'],
  'incidents': ['devops-infrastructure', 'customer-service'],
  'uptime': ['monitoring-observability', 'devops-infrastructure'],
  'github': ['version-control', 'developer-tools'],
  'free': ['productivity', 'developer-tools'],
  'health': ['monitoring-observability', 'devops-infrastructure'],
  'endpoints': ['api-development', 'monitoring-observability'],
  'microservices': ['backend-development', 'devops-infrastructure'],
  'rust': ['developer-tools', 'backend-development'],
  'automatic': ['automation', 'devops-infrastructure'],
  'oncall': ['devops-infrastructure', 'communication-collaboration'],
  'schedules': ['productivity', 'devops-infrastructure'],
  'aiops': ['ai-ml', 'devops-infrastructure'],
  'correlation': ['analytics', 'monitoring-observability'],
  'management': ['project-management', 'business-software'],
  'wiki': ['knowledge-management', 'documentation'],
  'documentation': ['documentation', 'developer-tools'],
  'knowledge-base': ['knowledge-management', 'documentation'],
  'books': ['documentation', 'education'],
  'teams': ['communication-collaboration', 'project-management'],
  'editor': ['developer-tools', 'content-media'],
  'static-site': ['static-site-generators', 'developer-tools'],
  'versioning': ['version-control', 'developer-tools'],
  'i18n': ['developer-tools', 'productivity'],
  'markdown': ['documentation', 'developer-tools'],
  'simple': ['productivity', 'developer-tools'],
  'yaml': ['developer-tools', 'devops-infrastructure'],
  'vite': ['frontend-development', 'developer-tools'],
  'vue': ['frontend-development', 'developer-tools'],
  'fast': ['performance', 'developer-tools'],
  'whiteboard': ['productivity', 'communication-collaboration'],
  'diagrams': ['documentation', 'developer-tools'],
  'drawing': ['graphic-design', 'productivity'],
  'sketching': ['design', 'graphic-design'],
  'canvas': ['graphic-design', 'frontend-development'],
  'shapes': ['graphic-design', 'productivity'],
  'flowcharts': ['documentation', 'developer-tools'],
  'uml': ['documentation', 'developer-tools'],
  'browser': ['developer-tools', 'productivity'],
  'text': ['developer-tools', 'documentation'],
  'code': ['developer-tools', 'programming'],
  'sequence': ['documentation', 'developer-tools'],
  'automation': ['automation', 'workflow-automation'],
  'workflow': ['workflow-automation', 'productivity'],
  'integrations': ['integration', 'developer-tools'],
  'nodes': ['developer-tools', 'automation'],
  'no-code': ['no-code', 'productivity'],
  'visual': ['design', 'productivity'],
  'flows': ['workflow-automation', 'developer-tools'],
  'business': ['business-software', 'productivity'],
  'agents': ['automation', 'ai-ml'],
  'webhooks': ['developer-tools', 'api-development'],
  'hackable': ['developer-tools', 'customization'],
  'internal-tools': ['developer-tools', 'business-software'],
  'low-code': ['no-code', 'developer-tools'],
  'admin': ['devops-infrastructure', 'developer-tools'],
  'dashboards': ['analytics', 'monitoring-observability'],
  'ui-builder': ['frontend-development', 'developer-tools'],
  'database': ['database', 'developer-tools'],
  'automations': ['automation', 'workflow-automation'],
  'apps': ['mobile', 'developer-tools'],
  'plugins': ['developer-tools', 'customization'],
  'bi': ['business-intelligence', 'analytics'],
  'visualization': ['analytics', 'graphic-design'],
  'sql': ['database', 'developer-tools'],
  'charts': ['analytics', 'frontend-development'],
  'analytics': ['analytics', 'business-intelligence'],
  'questions': ['analytics', 'business-intelligence'],
  'queries': ['database', 'developer-tools'],
  'data': ['analytics', 'database'],
  'dbt': ['data-engineering', 'developer-tools'],
  'etl': ['data-engineering', 'developer-tools'],
  'data-integration': ['integration', 'data-engineering'],
  'connectors': ['integration', 'developer-tools'],
  'pipelines': ['ci-cd', 'data-engineering'],
  'sync': ['file-sharing', 'developer-tools'],
  'elt': ['data-engineering', 'developer-tools'],
  'dataops': ['devops-infrastructure', 'data-engineering'],
  'singer': ['data-engineering', 'integration'],
  'orchestration': ['devops-infrastructure', 'workflow-automation'],
  'scheduling': ['productivity', 'automation'],
  'dags': ['data-engineering', 'developer-tools'],
  'python': ['developer-tools', 'backend-development'],
  'data-engineering': ['data-engineering', 'developer-tools'],
  'assets': ['data-engineering', 'developer-tools'],
  'lineage': ['data-engineering', 'analytics'],
  'tasks': ['project-management', 'productivity'],
  'pdf': ['productivity', 'document-management'],
  'viewer': ['productivity', 'developer-tools'],
  'javascript': ['frontend-development', 'developer-tools'],
  'mozilla': ['developer-tools', 'privacy'],
  'tools': ['developer-tools', 'productivity'],
  'merge': ['version-control', 'developer-tools'],
  'split': ['productivity', 'developer-tools'],
  'convert': ['productivity', 'developer-tools'],
  'desktop': ['developer-tools', 'productivity'],
  'java': ['developer-tools', 'programming'],
  'archive': ['productivity', 'developer-tools'],
  'compression': ['productivity', 'developer-tools'],
  '7z': ['productivity', 'developer-tools'],
  'zip': ['productivity', 'developer-tools'],
  'encryption': ['encryption', 'security-privacy'],
  'formats': ['developer-tools', 'productivity'],
  'ftp': ['file-sharing', 'developer-tools'],
  'sftp': ['file-sharing', 'security-privacy'],
  'file-transfer': ['file-sharing', 'developer-tools'],
  'client': ['developer-tools', 'productivity'],
  'server': ['devops-infrastructure', 'developer-tools'],
  'scp': ['file-sharing', 'security-privacy'],
  'windows': ['developer-tools', 'productivity'],
  'remote-desktop': ['remote-access', 'devops-infrastructure'],
  'cross-platform': ['developer-tools', 'productivity'],
  'vnc': ['remote-access', 'devops-infrastructure'],
  'rdp': ['remote-access', 'devops-infrastructure'],
  'ssh': ['developer-tools', 'security-privacy'],
  'terminal': ['developer-tools', 'terminal'],
  'vpn': ['security-privacy', 'networking'],
  'security': ['security-privacy', 'devops-infrastructure'],
  'protocol': ['networking', 'developer-tools'],
  'ssl': ['security-privacy', 'encryption'],
  'open-source': ['developer-tools', 'self-hosting'],
  'wireguard': ['networking', 'security-privacy'],
  'mesh': ['networking', 'devops-infrastructure'],
  'zero-config': ['devops-infrastructure', 'networking'],
  'networking': ['networking', 'devops-infrastructure'],
  'tailscale': ['networking', 'devops-infrastructure'],
  'control': ['devops-infrastructure', 'developer-tools'],
  'streaming': ['streaming', 'video-audio'],
  'live': ['streaming', 'video-audio'],
  'video': ['video-audio', 'content-media'],
  'chat': ['communication-collaboration', 'team-chat'],
  'decentralized': ['blockchain-crypto', 'privacy'],
  'federation': ['communication-collaboration', 'self-hosting'],
  'p2p': ['networking', 'privacy'],
  'podcast': ['content-media', 'streaming'],
  'hosting': ['web-hosting', 'devops-infrastructure'],
  'audio': ['video-audio', 'content-media'],
  'music': ['video-audio', 'content-media'],
  'social': ['social-media', 'communication-collaboration'],
  'photos': ['content-media', 'graphic-design'],
  'stock': ['content-media', 'graphic-design'],
  'high-res': ['content-media', 'graphic-design'],
  'images': ['content-media', 'graphic-design'],
  'videos': ['video-audio', 'content-media'],
  'creative': ['design', 'content-media'],
  'royalty-free': ['content-media', 'design'],
  'icons': ['graphic-design', 'frontend-development'],
  'tailwind': ['frontend-development', 'design'],
  'ui': ['ui-ux', 'frontend-development'],
  'feather': ['graphic-design', 'frontend-development'],
  'consistent': ['design', 'ui-ux'],
  'mit': ['developer-tools', 'open-source'],
  'customizable': ['customization', 'developer-tools'],
  'react': ['frontend-development', 'developer-tools'],
  'flutter': ['mobile', 'developer-tools'],
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
