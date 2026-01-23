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
  // ERP
  { name: 'SAP', slug: 'sap', description: 'Enterprise software', website: 'https://sap.com' },
  { name: 'Oracle ERP', slug: 'oracle-erp', description: 'Enterprise resource planning', website: 'https://oracle.com/erp' },
  { name: 'Microsoft Dynamics 365', slug: 'microsoft-dynamics-365', description: 'Business applications', website: 'https://dynamics.microsoft.com' },
  { name: 'NetSuite', slug: 'netsuite', description: 'Cloud ERP', website: 'https://netsuite.com' },
  
  // E-commerce
  { name: 'Shopify', slug: 'shopify', description: 'E-commerce platform', website: 'https://shopify.com' },
  { name: 'BigCommerce', slug: 'bigcommerce', description: 'E-commerce platform', website: 'https://bigcommerce.com' },
  { name: 'Magento Commerce', slug: 'magento-commerce', description: 'Adobe commerce', website: 'https://business.adobe.com/products/magento' },
  { name: 'Squarespace Commerce', slug: 'squarespace-commerce', description: 'E-commerce', website: 'https://squarespace.com' },
  
  // Note-taking & Knowledge
  { name: 'Notion', slug: 'notion', description: 'All-in-one workspace', website: 'https://notion.so' },
  { name: 'Evernote', slug: 'evernote', description: 'Note-taking app', website: 'https://evernote.com' },
  { name: 'Roam Research', slug: 'roam-research', description: 'Note-taking tool', website: 'https://roamresearch.com' },
  { name: 'Coda', slug: 'coda', description: 'Document platform', website: 'https://coda.io' },
  
  // Privacy & VPN
  { name: 'NordVPN', slug: 'nordvpn', description: 'VPN service', website: 'https://nordvpn.com' },
  { name: 'ExpressVPN', slug: 'expressvpn', description: 'VPN service', website: 'https://expressvpn.com' },
  { name: 'Surfshark', slug: 'surfshark', description: 'VPN service', website: 'https://surfshark.com' },
  
  // Inventory & Warehouse
  { name: 'Fishbowl', slug: 'fishbowl', description: 'Inventory management', website: 'https://fishbowlinventory.com' },
  { name: 'TradeGecko', slug: 'tradegecko', description: 'Inventory software', website: 'https://tradegecko.com' },
  { name: 'Cin7', slug: 'cin7', description: 'Inventory management', website: 'https://cin7.com' },
  
  // Machine Learning
  { name: 'AWS SageMaker', slug: 'aws-sagemaker', description: 'ML platform', website: 'https://aws.amazon.com/sagemaker' },
  { name: 'Google Vertex AI', slug: 'google-vertex-ai', description: 'ML platform', website: 'https://cloud.google.com/vertex-ai' },
  { name: 'Azure Machine Learning', slug: 'azure-machine-learning', description: 'ML service', website: 'https://azure.microsoft.com/services/machine-learning' },
  { name: 'Databricks', slug: 'databricks', description: 'Data and AI platform', website: 'https://databricks.com' },
  
  // Logging
  { name: 'Splunk', slug: 'splunk', description: 'Data platform', website: 'https://splunk.com' },
  { name: 'Loggly', slug: 'loggly', description: 'Log management', website: 'https://loggly.com' },
  { name: 'Papertrail', slug: 'papertrail', description: 'Log management', website: 'https://papertrail.com' },
  { name: 'LogDNA', slug: 'logdna', description: 'Log analysis', website: 'https://logdna.com' },
  
  // Media Servers
  { name: 'Plex', slug: 'plex', description: 'Media server', website: 'https://plex.tv' },
  
  // Photos
  { name: 'Google Photos', slug: 'google-photos', description: 'Photo sharing', website: 'https://photos.google.com' },
  { name: 'iCloud Photos', slug: 'icloud-photos', description: 'Apple photo storage', website: 'https://apple.com/icloud/photos' },
  { name: 'Amazon Photos', slug: 'amazon-photos', description: 'Photo storage', website: 'https://amazon.com/photos' },
  
  // File Sync
  { name: 'Dropbox', slug: 'dropbox', description: 'File sync', website: 'https://dropbox.com' },
  { name: 'Google Drive', slug: 'google-drive', description: 'Cloud storage', website: 'https://drive.google.com' },
  { name: 'OneDrive', slug: 'onedrive', description: 'Microsoft cloud storage', website: 'https://onedrive.live.com' },
  { name: 'Box', slug: 'box', description: 'Cloud content', website: 'https://box.com' },
  
  // Kanban & Agile
  { name: 'Trello', slug: 'trello', description: 'Kanban boards', website: 'https://trello.com' },
  
  // Container Registry
  { name: 'Docker Hub', slug: 'docker-hub', description: 'Container registry', website: 'https://hub.docker.com' },
  { name: 'AWS ECR', slug: 'aws-ecr', description: 'Container registry', website: 'https://aws.amazon.com/ecr' },
  { name: 'Google Container Registry', slug: 'google-container-registry', description: 'Container registry', website: 'https://cloud.google.com/container-registry' },
  { name: 'Azure Container Registry', slug: 'azure-container-registry', description: 'Container registry', website: 'https://azure.microsoft.com/services/container-registry' },
  
  // Wiki
  { name: 'Confluence', slug: 'confluence', description: 'Team wiki', website: 'https://atlassian.com/software/confluence' },
  
  // Backend as a Service
  { name: 'Firebase', slug: 'firebase', description: 'App platform', website: 'https://firebase.google.com' },
  { name: 'AWS Amplify', slug: 'aws-amplify', description: 'App backend', website: 'https://aws.amazon.com/amplify' },
  { name: 'Heroku', slug: 'heroku', description: 'Cloud platform', website: 'https://heroku.com' },
  
  // API Gateway
  { name: 'Kong Enterprise', slug: 'kong-enterprise', description: 'API gateway', website: 'https://konghq.com' },
  { name: 'Apigee', slug: 'apigee', description: 'API management', website: 'https://cloud.google.com/apigee' },
  { name: 'AWS API Gateway', slug: 'aws-api-gateway', description: 'API gateway', website: 'https://aws.amazon.com/api-gateway' },
  
  // Test Management
  { name: 'TestRail', slug: 'testrail', description: 'Test management', website: 'https://testrail.com' },
  { name: 'qTest', slug: 'qtest', description: 'Test management', website: 'https://tricentis.com/qtest' },
  { name: 'Zephyr', slug: 'zephyr', description: 'Test management', website: 'https://smartbear.com/test-management/zephyr' },
  
  // Error Tracking
  { name: 'Sentry', slug: 'sentry', description: 'Error tracking', website: 'https://sentry.io' },
  { name: 'Bugsnag', slug: 'bugsnag', description: 'Error monitoring', website: 'https://bugsnag.com' },
  { name: 'Raygun', slug: 'raygun', description: 'Error monitoring', website: 'https://raygun.com' },
  { name: 'Rollbar', slug: 'rollbar', description: 'Error tracking', website: 'https://rollbar.com' },
  
  // Invoice & Billing
  { name: 'QuickBooks', slug: 'quickbooks', description: 'Accounting software', website: 'https://quickbooks.intuit.com' },
  { name: 'FreshBooks', slug: 'freshbooks', description: 'Invoice software', website: 'https://freshbooks.com' },
  { name: 'Xero', slug: 'xero', description: 'Accounting software', website: 'https://xero.com' },
  { name: 'Wave', slug: 'wave-accounting', description: 'Free accounting', website: 'https://waveapps.com' },
  
  // Backup
  { name: 'Veeam', slug: 'veeam', description: 'Backup software', website: 'https://veeam.com' },
  { name: 'Acronis', slug: 'acronis', description: 'Backup and security', website: 'https://acronis.com' },
  { name: 'Carbonite', slug: 'carbonite', description: 'Cloud backup', website: 'https://carbonite.com' },
  
  // Network Management
  { name: 'SolarWinds', slug: 'solarwinds', description: 'IT management', website: 'https://solarwinds.com' },
  { name: 'ManageEngine', slug: 'manageengine', description: 'IT management', website: 'https://manageengine.com' },
  
  // Cloud PBX
  { name: 'RingCentral', slug: 'ringcentral', description: 'Cloud communications', website: 'https://ringcentral.com' },
  { name: '8x8', slug: '8x8', description: 'Communication platform', website: 'https://8x8.com' },
  { name: 'Vonage', slug: 'vonage', description: 'Communications API', website: 'https://vonage.com' },
  
  // Data Warehouse
  { name: 'Snowflake', slug: 'snowflake', description: 'Data warehouse', website: 'https://snowflake.com' },
  { name: 'Amazon Redshift', slug: 'amazon-redshift', description: 'Data warehouse', website: 'https://aws.amazon.com/redshift' },
  { name: 'Google BigQuery', slug: 'google-bigquery', description: 'Data warehouse', website: 'https://cloud.google.com/bigquery' },
  
  // Queue
  { name: 'Amazon SQS', slug: 'amazon-sqs', description: 'Message queue', website: 'https://aws.amazon.com/sqs' },
  { name: 'Azure Service Bus', slug: 'azure-service-bus', description: 'Message broker', website: 'https://azure.microsoft.com/services/service-bus' },
  { name: 'Google Pub/Sub', slug: 'google-pubsub', description: 'Messaging service', website: 'https://cloud.google.com/pubsub' },
  
  // Landing Page Builders
  { name: 'Unbounce', slug: 'unbounce', description: 'Landing pages', website: 'https://unbounce.com' },
  { name: 'Leadpages', slug: 'leadpages', description: 'Landing pages', website: 'https://leadpages.com' },
  { name: 'Instapage', slug: 'instapage', description: 'Landing pages', website: 'https://instapage.com' },
  
  // Website Monitoring
  { name: 'Pingdom', slug: 'pingdom', description: 'Website monitoring', website: 'https://pingdom.com' },
  { name: 'StatusPage', slug: 'statuspage', description: 'Status pages', website: 'https://atlassian.com/software/statuspage' },
  { name: 'Site24x7', slug: 'site24x7', description: 'Website monitoring', website: 'https://site24x7.com' },
  
  // Graphic Design
  { name: 'Canva', slug: 'canva', description: 'Design platform', website: 'https://canva.com' },
  { name: 'Adobe Photoshop', slug: 'adobe-photoshop', description: 'Image editing', website: 'https://adobe.com/products/photoshop' },
  { name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Vector graphics', website: 'https://adobe.com/products/illustrator' },
  
  // Audio & Music
  { name: 'Spotify', slug: 'spotify', description: 'Music streaming', website: 'https://spotify.com' },
  { name: 'Adobe Audition', slug: 'adobe-audition', description: 'Audio editing', website: 'https://adobe.com/products/audition' },
  { name: 'Pro Tools', slug: 'pro-tools', description: 'Audio production', website: 'https://avid.com/pro-tools' },
  
  // Browser
  { name: 'Google Chrome', slug: 'google-chrome', description: 'Web browser', website: 'https://google.com/chrome' },
  { name: 'Microsoft Edge', slug: 'microsoft-edge', description: 'Web browser', website: 'https://microsoft.com/edge' },
  
  // Office Suite
  { name: 'Microsoft Office', slug: 'microsoft-office', description: 'Office suite', website: 'https://office.com' },
  { name: 'Google Docs', slug: 'google-docs', description: 'Online documents', website: 'https://docs.google.com' },
  
  // Terminal
  { name: 'iTerm2', slug: 'iterm2', description: 'macOS terminal', website: 'https://iterm2.com' },
  
  // Web Analytics
  { name: 'Google Analytics', slug: 'google-analytics', description: 'Web analytics', website: 'https://analytics.google.com' },
  { name: 'Adobe Analytics', slug: 'adobe-analytics', description: 'Marketing analytics', website: 'https://adobe.com/analytics' },
];

// More alternatives
const newAlternatives = [
  // ERP - Alternatives to SAP, Oracle ERP, Dynamics 365, NetSuite
  {
    name: 'ERPNext',
    slug: 'erpnext',
    short_description: 'Open-source ERP system',
    description: 'ERPNext is a free and open-source enterprise resource planning software. It covers accounting, inventory, manufacturing, CRM, HR, and much more in one integrated platform.',
    website: 'https://erpnext.com',
    github: 'https://github.com/frappe/erpnext',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['sap', 'oracle-erp', 'microsoft-dynamics-365', 'netsuite'],
    categoryKeywords: ['erp', 'accounting', 'inventory', 'manufacturing', 'business']
  },
  {
    name: 'Odoo',
    slug: 'odoo',
    short_description: 'Open-source business apps',
    description: 'Odoo is a suite of open-source business apps. It includes CRM, e-commerce, accounting, inventory, project management, and more in a modular architecture.',
    website: 'https://www.odoo.com',
    github: 'https://github.com/odoo/odoo',
    license: 'LGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['sap', 'oracle-erp', 'microsoft-dynamics-365', 'netsuite'],
    categoryKeywords: ['erp', 'crm', 'ecommerce', 'business', 'modular']
  },
  {
    name: 'Dolibarr',
    slug: 'dolibarr',
    short_description: 'ERP and CRM for SMB',
    description: 'Dolibarr ERP CRM is an open-source software for small and medium businesses. It provides modules for CRM, sales, HR, accounting, inventory, and manufacturing.',
    website: 'https://www.dolibarr.org',
    github: 'https://github.com/Dolibarr/dolibarr',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['sap', 'oracle-erp', 'netsuite'],
    categoryKeywords: ['erp', 'crm', 'smb', 'accounting', 'inventory']
  },

  // E-commerce - Alternatives to Shopify, BigCommerce, Magento
  {
    name: 'Medusa',
    slug: 'medusa',
    short_description: 'Open-source Shopify alternative',
    description: 'Medusa is an open-source composable commerce engine. It provides a modular headless commerce platform with built-in commerce features and plugin system.',
    website: 'https://medusajs.com',
    github: 'https://github.com/medusajs/medusa',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['shopify', 'bigcommerce', 'magento-commerce'],
    categoryKeywords: ['ecommerce', 'headless', 'commerce', 'nodejs', 'modular']
  },
  {
    name: 'Saleor',
    slug: 'saleor',
    short_description: 'High-performance e-commerce',
    description: 'Saleor is an open-source, GraphQL-first e-commerce platform. It provides a modular architecture with PWA storefront, dashboard, and headless commerce capabilities.',
    website: 'https://saleor.io',
    github: 'https://github.com/saleor/saleor',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['shopify', 'bigcommerce', 'magento-commerce'],
    categoryKeywords: ['ecommerce', 'graphql', 'headless', 'pwa', 'python']
  },
  {
    name: 'Sylius',
    slug: 'sylius',
    short_description: 'Open-source e-commerce framework',
    description: 'Sylius is an open-source e-commerce framework built on Symfony. It provides flexibility for building custom e-commerce experiences with modern PHP.',
    website: 'https://sylius.com',
    github: 'https://github.com/Sylius/Sylius',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['shopify', 'magento-commerce'],
    categoryKeywords: ['ecommerce', 'symfony', 'php', 'framework', 'custom']
  },
  {
    name: 'Bagisto',
    slug: 'bagisto',
    short_description: 'Laravel e-commerce platform',
    description: 'Bagisto is an open-source e-commerce platform built on Laravel. It provides multi-vendor marketplace, multi-warehouse inventory, and PWA support.',
    website: 'https://bagisto.com',
    github: 'https://github.com/bagisto/bagisto',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['shopify', 'bigcommerce'],
    categoryKeywords: ['ecommerce', 'laravel', 'php', 'marketplace', 'pwa']
  },

  // Note-taking - Alternatives to Notion, Evernote, Roam Research, Coda
  {
    name: 'Obsidian',
    slug: 'obsidian',
    short_description: 'Knowledge base on local Markdown',
    description: 'Obsidian is a powerful knowledge base that works on local Markdown files. It provides bidirectional linking, graph view, and extensive plugin ecosystem.',
    website: 'https://obsidian.md',
    github: 'https://github.com/obsidianmd',
    license: 'Proprietary (free for personal)',
    is_self_hosted: false,
    alternative_to: ['notion', 'evernote', 'roam-research'],
    categoryKeywords: ['notes', 'knowledge', 'markdown', 'linking', 'local']
  },
  {
    name: 'Logseq',
    slug: 'logseq',
    short_description: 'Open-source knowledge management',
    description: 'Logseq is an open-source knowledge management and collaboration platform. It provides outliner-based note-taking with backlinks, graphs, and local-first storage.',
    website: 'https://logseq.com',
    github: 'https://github.com/logseq/logseq',
    license: 'AGPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['notion', 'roam-research', 'coda'],
    categoryKeywords: ['notes', 'knowledge', 'outliner', 'backlinks', 'local']
  },
  {
    name: 'Joplin',
    slug: 'joplin',
    short_description: 'Open-source note-taking app',
    description: 'Joplin is a free, open-source note-taking and to-do application. It supports Markdown, end-to-end encryption, and synchronization with various cloud services.',
    website: 'https://joplinapp.org',
    github: 'https://github.com/laurent22/joplin',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['evernote', 'notion'],
    categoryKeywords: ['notes', 'markdown', 'encryption', 'sync', 'todo']
  },
  {
    name: 'Standard Notes',
    slug: 'standard-notes',
    short_description: 'Encrypted note-taking app',
    description: 'Standard Notes is a free, open-source, and end-to-end encrypted note-taking app. It provides cross-platform sync with focus on longevity and privacy.',
    website: 'https://standardnotes.com',
    github: 'https://github.com/standardnotes/app',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['evernote', 'notion'],
    categoryKeywords: ['notes', 'encryption', 'privacy', 'sync', 'secure']
  },
  {
    name: 'AppFlowy',
    slug: 'appflowy',
    short_description: 'Open-source Notion alternative',
    description: 'AppFlowy is an open-source alternative to Notion. It provides a privacy-first approach with local data storage, AI capabilities, and collaborative features.',
    website: 'https://appflowy.io',
    github: 'https://github.com/AppFlowy-IO/AppFlowy',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['notion', 'coda'],
    categoryKeywords: ['notes', 'workspace', 'privacy', 'collaboration', 'ai']
  },
  {
    name: 'Anytype',
    slug: 'anytype',
    short_description: 'Local-first knowledge tool',
    description: 'Anytype is a local-first, peer-to-peer knowledge management app. It provides object-based organization, E2E encryption, and works offline by default.',
    website: 'https://anytype.io',
    github: 'https://github.com/anyproto/anytype-ts',
    license: 'Custom Open Source',
    is_self_hosted: false,
    alternative_to: ['notion', 'roam-research'],
    categoryKeywords: ['notes', 'knowledge', 'p2p', 'encryption', 'offline']
  },

  // VPN - Alternatives to NordVPN, ExpressVPN, Surfshark
  {
    name: 'WireGuard',
    slug: 'wireguard',
    short_description: 'Modern VPN protocol',
    description: 'WireGuard is an extremely simple yet fast and modern VPN. It uses state-of-the-art cryptography and aims to be faster and simpler than IPsec and OpenVPN.',
    website: 'https://www.wireguard.com',
    github: 'https://github.com/WireGuard/wireguard-linux',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['nordvpn', 'expressvpn', 'surfshark'],
    categoryKeywords: ['vpn', 'security', 'networking', 'privacy', 'fast']
  },
  {
    name: 'OpenVPN',
    slug: 'openvpn',
    short_description: 'Open-source VPN solution',
    description: 'OpenVPN is an open-source VPN protocol that creates secure point-to-point connections. It provides robust encryption and is highly configurable for various scenarios.',
    website: 'https://openvpn.net',
    github: 'https://github.com/OpenVPN/openvpn',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['nordvpn', 'expressvpn', 'surfshark'],
    categoryKeywords: ['vpn', 'security', 'encryption', 'networking', 'protocol']
  },
  {
    name: 'Tailscale',
    slug: 'tailscale',
    short_description: 'Zero-config VPN',
    description: 'Tailscale is a zero-config VPN for building secure networks. It uses WireGuard and provides easy setup with MagicDNS, ACLs, and SSO integration.',
    website: 'https://tailscale.com',
    github: 'https://github.com/tailscale/tailscale',
    license: 'BSD-3-Clause License',
    is_self_hosted: false,
    alternative_to: ['nordvpn', 'expressvpn'],
    categoryKeywords: ['vpn', 'wireguard', 'mesh', 'networking', 'zero-config']
  },
  {
    name: 'Headscale',
    slug: 'headscale',
    short_description: 'Self-hosted Tailscale control server',
    description: 'Headscale is an open-source self-hosted implementation of the Tailscale control server. It allows running your own Tailscale infrastructure.',
    website: 'https://github.com/juanfont/headscale',
    github: 'https://github.com/juanfont/headscale',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['nordvpn', 'expressvpn'],
    categoryKeywords: ['vpn', 'tailscale', 'self-hosted', 'networking', 'mesh']
  },

  // Machine Learning - Alternatives to AWS SageMaker, Vertex AI, Azure ML
  {
    name: 'MLflow',
    slug: 'mlflow',
    short_description: 'Open-source ML platform',
    description: 'MLflow is an open-source platform for the complete machine learning lifecycle. It provides experiment tracking, model registry, project packaging, and model serving.',
    website: 'https://mlflow.org',
    github: 'https://github.com/mlflow/mlflow',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['aws-sagemaker', 'google-vertex-ai', 'azure-machine-learning', 'databricks'],
    categoryKeywords: ['ml', 'mlops', 'tracking', 'deployment', 'lifecycle']
  },
  {
    name: 'Kubeflow',
    slug: 'kubeflow',
    short_description: 'ML toolkit for Kubernetes',
    description: 'Kubeflow is a machine learning toolkit for Kubernetes. It provides a complete ML stack including notebooks, pipelines, training, and serving.',
    website: 'https://www.kubeflow.org',
    github: 'https://github.com/kubeflow/kubeflow',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['aws-sagemaker', 'google-vertex-ai', 'azure-machine-learning'],
    categoryKeywords: ['ml', 'kubernetes', 'pipelines', 'mlops', 'training']
  },
  {
    name: 'Label Studio',
    slug: 'label-studio',
    short_description: 'Data labeling platform',
    description: 'Label Studio is an open-source data labeling tool. It supports multiple data types including images, audio, text, and video with customizable interfaces.',
    website: 'https://labelstud.io',
    github: 'https://github.com/HumanSignal/label-studio',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['aws-sagemaker'],
    categoryKeywords: ['ml', 'labeling', 'annotation', 'data', 'training']
  },

  // Logging - Alternatives to Splunk, Loggly, Papertrail
  {
    name: 'Loki',
    slug: 'loki',
    short_description: 'Log aggregation system',
    description: 'Loki is a horizontally-scalable log aggregation system by Grafana Labs. It is designed to be cost-effective and easy to operate with label-based indexing.',
    website: 'https://grafana.com/loki',
    github: 'https://github.com/grafana/loki',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['splunk', 'loggly', 'papertrail', 'logdna'],
    categoryKeywords: ['logging', 'observability', 'grafana', 'scalable', 'labels']
  },
  {
    name: 'Graylog',
    slug: 'graylog',
    short_description: 'Log management platform',
    description: 'Graylog is a leading centralized log management platform. It provides real-time search and analysis of log data with alerting and dashboards.',
    website: 'https://graylog.org',
    github: 'https://github.com/Graylog2/graylog2-server',
    license: 'SSPL License',
    is_self_hosted: true,
    alternative_to: ['splunk', 'loggly', 'papertrail'],
    categoryKeywords: ['logging', 'search', 'analysis', 'alerting', 'centralized']
  },
  {
    name: 'Vector',
    slug: 'vector',
    short_description: 'High-performance observability pipeline',
    description: 'Vector is a high-performance observability data pipeline. It collects, transforms, and routes logs, metrics, and traces to any destination.',
    website: 'https://vector.dev',
    github: 'https://github.com/vectordotdev/vector',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['splunk', 'loggly'],
    categoryKeywords: ['logging', 'pipeline', 'observability', 'rust', 'transforms']
  },

  // Media Server - Alternatives to Plex
  {
    name: 'Jellyfin',
    slug: 'jellyfin',
    short_description: 'Free software media system',
    description: 'Jellyfin is a free software media system. It provides media management with streaming to any device, live TV, DVR, and extensive plugin support.',
    website: 'https://jellyfin.org',
    github: 'https://github.com/jellyfin/jellyfin',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['plex'],
    categoryKeywords: ['media', 'streaming', 'server', 'tv', 'movies']
  },
  {
    name: 'Emby',
    slug: 'emby',
    short_description: 'Personal media server',
    description: 'Emby is a personal media server. It organizes and streams your media to any device with DVR, live TV, and parental controls.',
    website: 'https://emby.media',
    github: 'https://github.com/MediaBrowser/Emby',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['plex'],
    categoryKeywords: ['media', 'streaming', 'server', 'personal', 'dvr']
  },

  // Photos - Alternatives to Google Photos, iCloud Photos
  {
    name: 'Immich',
    slug: 'immich',
    short_description: 'Self-hosted photo backup',
    description: 'Immich is a self-hosted photo and video backup solution. It provides mobile apps, automatic backup, facial recognition, and timeline view.',
    website: 'https://immich.app',
    github: 'https://github.com/immich-app/immich',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-photos', 'icloud-photos', 'amazon-photos'],
    categoryKeywords: ['photos', 'backup', 'self-hosted', 'mobile', 'ai']
  },
  {
    name: 'PhotoPrism',
    slug: 'photoprism',
    short_description: 'AI-powered photo app',
    description: 'PhotoPrism is an AI-powered photo app for the decentralized web. It provides automatic tagging, face recognition, location maps, and powerful search.',
    website: 'https://photoprism.app',
    github: 'https://github.com/photoprism/photoprism',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-photos', 'icloud-photos', 'amazon-photos'],
    categoryKeywords: ['photos', 'ai', 'tagging', 'self-hosted', 'search']
  },
  {
    name: 'LibrePhotos',
    slug: 'librephotos',
    short_description: 'Self-hosted photo management',
    description: 'LibrePhotos is a self-hosted photo management service. It provides AI-powered face detection, object recognition, and geo-tagging with timeline view.',
    website: 'https://github.com/LibrePhotos/librephotos',
    github: 'https://github.com/LibrePhotos/librephotos',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['google-photos', 'icloud-photos'],
    categoryKeywords: ['photos', 'ai', 'face-detection', 'self-hosted', 'geo']
  },

  // File Sync - Alternatives to Dropbox, Google Drive, OneDrive
  {
    name: 'Nextcloud',
    slug: 'nextcloud',
    short_description: 'Self-hosted productivity platform',
    description: 'Nextcloud is a self-hosted productivity platform. It provides file sync, collaboration, office suite, calendar, contacts, and extensive app ecosystem.',
    website: 'https://nextcloud.com',
    github: 'https://github.com/nextcloud/server',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['dropbox', 'google-drive', 'onedrive', 'box'],
    categoryKeywords: ['files', 'sync', 'collaboration', 'office', 'self-hosted']
  },
  {
    name: 'ownCloud',
    slug: 'owncloud',
    short_description: 'Open-source file sharing',
    description: 'ownCloud is an open-source file synchronization and sharing solution. It provides enterprise-grade features with focus on data privacy and security.',
    website: 'https://owncloud.com',
    github: 'https://github.com/owncloud/core',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['dropbox', 'google-drive', 'onedrive', 'box'],
    categoryKeywords: ['files', 'sync', 'sharing', 'enterprise', 'privacy']
  },
  {
    name: 'Seafile',
    slug: 'seafile',
    short_description: 'File sync and share',
    description: 'Seafile is a high-performance file syncing and sharing solution. It provides reliable file sync, encryption, and enterprise team collaboration.',
    website: 'https://www.seafile.com',
    github: 'https://github.com/haiwen/seafile',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['dropbox', 'google-drive', 'box'],
    categoryKeywords: ['files', 'sync', 'encryption', 'performance', 'team']
  },
  {
    name: 'Syncthing',
    slug: 'syncthing',
    short_description: 'Continuous file synchronization',
    description: 'Syncthing is a continuous file synchronization program. It synchronizes files between multiple devices directly without a central server.',
    website: 'https://syncthing.net',
    github: 'https://github.com/syncthing/syncthing',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['dropbox', 'google-drive', 'onedrive'],
    categoryKeywords: ['files', 'sync', 'p2p', 'decentralized', 'privacy']
  },

  // Kanban - Alternatives to Trello
  {
    name: 'Kanboard',
    slug: 'kanboard',
    short_description: 'Free Kanban project management',
    description: 'Kanboard is a free and open-source Kanban project management software. It focuses on simplicity with swimlanes, subtasks, time tracking, and plugins.',
    website: 'https://kanboard.org',
    github: 'https://github.com/kanboard/kanboard',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['trello'],
    categoryKeywords: ['kanban', 'project', 'tasks', 'boards', 'simple']
  },
  {
    name: 'WeKan',
    slug: 'wekan',
    short_description: 'Open-source Kanban board',
    description: 'WeKan is an open-source, self-hosted Kanban board. It provides cards, boards, swimlanes, checklists, and integrations with various platforms.',
    website: 'https://wekan.github.io',
    github: 'https://github.com/wekan/wekan',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['trello'],
    categoryKeywords: ['kanban', 'boards', 'cards', 'self-hosted', 'teams']
  },
  {
    name: 'Planka',
    slug: 'planka',
    short_description: 'Free Trello alternative',
    description: 'Planka is a free open-source Kanban board for workgroups. It provides real-time updates, filters, labels, due dates, and user management.',
    website: 'https://planka.app',
    github: 'https://github.com/plankanban/planka',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['trello'],
    categoryKeywords: ['kanban', 'realtime', 'workgroups', 'boards', 'labels']
  },

  // Container Registry - Alternatives to Docker Hub, ECR, GCR, ACR
  {
    name: 'Harbor',
    slug: 'harbor',
    short_description: 'Cloud native registry',
    description: 'Harbor is an open-source cloud native registry that stores, signs, and scans content. It provides security, identity integration, and replication.',
    website: 'https://goharbor.io',
    github: 'https://github.com/goharbor/harbor',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['docker-hub', 'aws-ecr', 'google-container-registry', 'azure-container-registry'],
    categoryKeywords: ['containers', 'registry', 'security', 'cloud-native', 'scanning']
  },
  {
    name: 'Zot',
    slug: 'zot',
    short_description: 'OCI-native container registry',
    description: 'Zot is a production-ready, vendor-neutral OCI-native container image registry. It provides signing, scanning, deduplication, and single binary deployment.',
    website: 'https://zotregistry.io',
    github: 'https://github.com/project-zot/zot',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['docker-hub', 'aws-ecr'],
    categoryKeywords: ['containers', 'registry', 'oci', 'lightweight', 'scanning']
  },

  // Wiki - Alternatives to Confluence
  {
    name: 'Wiki.js',
    slug: 'wiki-js',
    short_description: 'Modern wiki software',
    description: 'Wiki.js is a powerful open-source wiki software. It provides a beautiful interface, Git storage, multiple editors, authentication, and search.',
    website: 'https://js.wiki',
    github: 'https://github.com/requarks/wiki',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['confluence'],
    categoryKeywords: ['wiki', 'documentation', 'git', 'modern', 'search']
  },
  {
    name: 'BookStack',
    slug: 'bookstack',
    short_description: 'Simple wiki platform',
    description: 'BookStack is a simple, self-hosted wiki platform. It provides a book-like structure with shelves, books, chapters, and pages for organizing content.',
    website: 'https://www.bookstackapp.com',
    github: 'https://github.com/BookStackApp/BookStack',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['confluence'],
    categoryKeywords: ['wiki', 'documentation', 'simple', 'organized', 'books']
  },
  {
    name: 'XWiki',
    slug: 'xwiki',
    short_description: 'Open-source wiki software',
    description: 'XWiki is an open-source enterprise wiki software. It provides structured data, collaboration tools, extensions, and advanced customization.',
    website: 'https://www.xwiki.org',
    github: 'https://github.com/xwiki/xwiki-platform',
    license: 'LGPL-2.1 License',
    is_self_hosted: true,
    alternative_to: ['confluence'],
    categoryKeywords: ['wiki', 'enterprise', 'structured', 'extensions', 'collaboration']
  },

  // Backend as a Service - Alternatives to Firebase, Amplify, Heroku
  {
    name: 'Supabase',
    slug: 'supabase',
    short_description: 'Open-source Firebase alternative',
    description: 'Supabase is an open-source Firebase alternative. It provides a Postgres database, authentication, instant APIs, edge functions, and realtime subscriptions.',
    website: 'https://supabase.com',
    github: 'https://github.com/supabase/supabase',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['firebase', 'aws-amplify'],
    categoryKeywords: ['baas', 'database', 'auth', 'realtime', 'postgres']
  },
  {
    name: 'Appwrite',
    slug: 'appwrite',
    short_description: 'Open-source backend platform',
    description: 'Appwrite is an open-source backend-as-a-service platform. It provides authentication, databases, storage, functions, and messaging in a self-hosted package.',
    website: 'https://appwrite.io',
    github: 'https://github.com/appwrite/appwrite',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['firebase', 'aws-amplify'],
    categoryKeywords: ['baas', 'backend', 'auth', 'database', 'functions']
  },
  {
    name: 'PocketBase',
    slug: 'pocketbase',
    short_description: 'Open-source backend in 1 file',
    description: 'PocketBase is an open-source backend consisting of a single file. It provides realtime database, file storage, authentication, and admin dashboard.',
    website: 'https://pocketbase.io',
    github: 'https://github.com/pocketbase/pocketbase',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['firebase', 'aws-amplify'],
    categoryKeywords: ['baas', 'database', 'single-file', 'realtime', 'go']
  },
  {
    name: 'Coolify',
    slug: 'coolify',
    short_description: 'Self-hosted Heroku alternative',
    description: 'Coolify is an open-source, self-hostable Heroku/Netlify alternative. It provides Git push deployments, automatic SSL, and database management.',
    website: 'https://coolify.io',
    github: 'https://github.com/coollabsio/coolify',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['heroku'],
    categoryKeywords: ['paas', 'deployment', 'self-hosted', 'git', 'docker']
  },
  {
    name: 'Dokku',
    slug: 'dokku',
    short_description: 'Docker-powered PaaS',
    description: 'Dokku is a Docker-powered PaaS implementation. It provides Heroku-like deployment with git push, buildpacks, and zero-downtime deploys.',
    website: 'https://dokku.com',
    github: 'https://github.com/dokku/dokku',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['heroku'],
    categoryKeywords: ['paas', 'docker', 'deployment', 'git', 'buildpacks']
  },

  // API Gateway - Alternatives to Kong Enterprise, Apigee, AWS API Gateway
  {
    name: 'Kong',
    slug: 'kong',
    short_description: 'Cloud-native API gateway',
    description: 'Kong is a cloud-native API gateway. It provides request routing, load balancing, authentication, rate limiting, and extensive plugin ecosystem.',
    website: 'https://konghq.com/kong',
    github: 'https://github.com/Kong/kong',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['kong-enterprise', 'apigee', 'aws-api-gateway'],
    categoryKeywords: ['api', 'gateway', 'microservices', 'routing', 'plugins']
  },
  {
    name: 'Traefik',
    slug: 'traefik',
    short_description: 'Cloud-native edge router',
    description: 'Traefik is a modern HTTP reverse proxy and load balancer. It provides automatic service discovery, Let\'s Encrypt, and native Docker/Kubernetes integration.',
    website: 'https://traefik.io',
    github: 'https://github.com/traefik/traefik',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['kong-enterprise', 'apigee'],
    categoryKeywords: ['proxy', 'router', 'load-balancer', 'kubernetes', 'docker']
  },
  {
    name: 'APISIX',
    slug: 'apisix',
    short_description: 'Dynamic API gateway',
    description: 'Apache APISIX is a dynamic, real-time, high-performance API gateway. It provides fine-grained routing, rate limiting, and multi-cloud support.',
    website: 'https://apisix.apache.org',
    github: 'https://github.com/apache/apisix',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['kong-enterprise', 'apigee', 'aws-api-gateway'],
    categoryKeywords: ['api', 'gateway', 'dynamic', 'high-performance', 'routing']
  },
  {
    name: 'Tyk',
    slug: 'tyk',
    short_description: 'Open-source API gateway',
    description: 'Tyk is an open-source API and service management platform. It provides rate limiting, authentication, versioning, and developer portal.',
    website: 'https://tyk.io',
    github: 'https://github.com/TykTechnologies/tyk',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['kong-enterprise', 'apigee'],
    categoryKeywords: ['api', 'gateway', 'management', 'portal', 'versioning']
  },

  // Error Tracking - Alternatives to Sentry, Bugsnag, Raygun, Rollbar  
  {
    name: 'GlitchTip',
    slug: 'glitchtip',
    short_description: 'Simple error tracking',
    description: 'GlitchTip is an open-source error tracking tool. It is Sentry-compatible with a simpler feature set, uptime monitoring, and lower resource usage.',
    website: 'https://glitchtip.com',
    github: 'https://github.com/glitchtip/glitchtip-backend',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['sentry', 'bugsnag', 'raygun', 'rollbar'],
    categoryKeywords: ['errors', 'tracking', 'monitoring', 'sentry', 'simple']
  },

  // Invoice & Billing - Alternatives to QuickBooks, FreshBooks, Xero, Wave
  {
    name: 'Invoice Ninja',
    slug: 'invoice-ninja',
    short_description: 'Open-source invoicing',
    description: 'Invoice Ninja is an open-source invoicing, quotes, and payments platform. It provides time tracking, expenses, projects, and client portals.',
    website: 'https://invoiceninja.com',
    github: 'https://github.com/invoiceninja/invoiceninja',
    license: 'AAL License',
    is_self_hosted: true,
    alternative_to: ['quickbooks', 'freshbooks', 'xero', 'wave-accounting'],
    categoryKeywords: ['invoicing', 'billing', 'accounting', 'quotes', 'payments']
  },
  {
    name: 'Akaunting',
    slug: 'akaunting',
    short_description: 'Free accounting software',
    description: 'Akaunting is free, open-source, and online accounting software. It provides invoicing, expenses, banking, reports, and app store for extensions.',
    website: 'https://akaunting.com',
    github: 'https://github.com/akaunting/akaunting',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['quickbooks', 'xero', 'wave-accounting'],
    categoryKeywords: ['accounting', 'invoicing', 'expenses', 'reports', 'banking']
  },
  {
    name: 'Crater',
    slug: 'crater',
    short_description: 'Free invoicing app',
    description: 'Crater is a free and open-source invoicing application. It provides invoices, estimates, expenses, payments tracking, and customizable templates.',
    website: 'https://crater.finance',
    github: 'https://github.com/crater-invoice/crater',
    license: 'AAL License',
    is_self_hosted: true,
    alternative_to: ['freshbooks', 'wave-accounting'],
    categoryKeywords: ['invoicing', 'estimates', 'expenses', 'payments', 'templates']
  },

  // Backup - Alternatives to Veeam, Acronis, Carbonite
  {
    name: 'Restic',
    slug: 'restic',
    short_description: 'Fast backup program',
    description: 'Restic is a fast, efficient, and secure backup program. It provides deduplication, encryption, and supports multiple cloud storage backends.',
    website: 'https://restic.net',
    github: 'https://github.com/restic/restic',
    license: 'BSD-2-Clause License',
    is_self_hosted: true,
    alternative_to: ['veeam', 'acronis', 'carbonite'],
    categoryKeywords: ['backup', 'encryption', 'deduplication', 'cloud', 'fast']
  },
  {
    name: 'BorgBackup',
    slug: 'borgbackup',
    short_description: 'Deduplicating archiver',
    description: 'BorgBackup is a deduplicating archiver with compression and encryption. It provides space-efficient storage and supports remote repositories.',
    website: 'https://www.borgbackup.org',
    github: 'https://github.com/borgbackup/borg',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['veeam', 'acronis', 'carbonite'],
    categoryKeywords: ['backup', 'deduplication', 'compression', 'encryption', 'archive']
  },
  {
    name: 'Duplicati',
    slug: 'duplicati',
    short_description: 'Free backup client',
    description: 'Duplicati is a free backup client that stores encrypted, incremental backups. It supports many cloud storage providers and local destinations.',
    website: 'https://www.duplicati.com',
    github: 'https://github.com/duplicati/duplicati',
    license: 'LGPL-2.1 License',
    is_self_hosted: false,
    alternative_to: ['acronis', 'carbonite'],
    categoryKeywords: ['backup', 'encryption', 'incremental', 'cloud', 'gui']
  },
  {
    name: 'Kopia',
    slug: 'kopia',
    short_description: 'Fast and secure backups',
    description: 'Kopia is a fast and secure backup tool. It provides end-to-end encryption, compression, deduplication, and supports various cloud storage.',
    website: 'https://kopia.io',
    github: 'https://github.com/kopia/kopia',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['veeam', 'acronis', 'carbonite'],
    categoryKeywords: ['backup', 'encryption', 'compression', 'deduplication', 'secure']
  },

  // Queue - Alternatives to Amazon SQS, Azure Service Bus, Google Pub/Sub
  {
    name: 'RabbitMQ',
    slug: 'rabbitmq',
    short_description: 'Message broker',
    description: 'RabbitMQ is an open-source message broker. It supports multiple messaging protocols, clustering, and high availability with a management UI.',
    website: 'https://www.rabbitmq.com',
    github: 'https://github.com/rabbitmq/rabbitmq-server',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['amazon-sqs', 'azure-service-bus', 'google-pubsub'],
    categoryKeywords: ['messaging', 'queue', 'broker', 'amqp', 'clustering']
  },
  {
    name: 'Apache Kafka',
    slug: 'apache-kafka',
    short_description: 'Distributed event streaming',
    description: 'Apache Kafka is a distributed event streaming platform. It provides high-throughput, low-latency messaging for real-time data pipelines.',
    website: 'https://kafka.apache.org',
    github: 'https://github.com/apache/kafka',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['amazon-sqs', 'google-pubsub'],
    categoryKeywords: ['streaming', 'events', 'messaging', 'distributed', 'pipelines']
  },
  {
    name: 'NATS',
    slug: 'nats',
    short_description: 'Cloud-native messaging',
    description: 'NATS is a simple, secure, and performant messaging system. It provides publish-subscribe, request-reply, and queue groups with JetStream persistence.',
    website: 'https://nats.io',
    github: 'https://github.com/nats-io/nats-server',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['amazon-sqs', 'google-pubsub'],
    categoryKeywords: ['messaging', 'pubsub', 'cloud-native', 'lightweight', 'fast']
  },

  // Landing Page - Alternatives to Unbounce, Leadpages, Instapage
  {
    name: 'Landy',
    slug: 'landy',
    short_description: 'Open-source landing page builder',
    description: 'Landy is an open-source React landing page template. It provides reusable components, animations, and form handling for creating marketing pages.',
    website: 'https://github.com/Adrinlol/landy-react-template',
    github: 'https://github.com/Adrinlol/landy-react-template',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['unbounce', 'leadpages', 'instapage'],
    categoryKeywords: ['landing', 'react', 'template', 'marketing', 'pages']
  },

  // Website Monitoring - Alternatives to Pingdom, StatusPage, Site24x7
  {
    name: 'Uptime Kuma',
    slug: 'uptime-kuma',
    short_description: 'Self-hosted monitoring tool',
    description: 'Uptime Kuma is a fancy self-hosted monitoring tool. It provides HTTP, TCP, DNS monitoring with notifications via Discord, Telegram, Slack, and more.',
    website: 'https://uptime.kuma.pet',
    github: 'https://github.com/louislam/uptime-kuma',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['pingdom', 'statuspage', 'site24x7'],
    categoryKeywords: ['monitoring', 'uptime', 'status', 'notifications', 'self-hosted']
  },
  {
    name: 'Gatus',
    slug: 'gatus',
    short_description: 'Automated service health dashboard',
    description: 'Gatus is a developer-oriented health dashboard. It provides HTTP, TCP, DNS, ICMP monitoring with configurable conditions and alerting.',
    website: 'https://gatus.io',
    github: 'https://github.com/TwiN/gatus',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['pingdom', 'site24x7'],
    categoryKeywords: ['monitoring', 'health', 'dashboard', 'alerting', 'developer']
  },
  {
    name: 'Cachet',
    slug: 'cachet',
    short_description: 'Open-source status page',
    description: 'Cachet is an open-source status page system. It provides incident management, component tracking, metrics, and subscriber notifications.',
    website: 'https://cachethq.io',
    github: 'https://github.com/CachetHQ/Cachet',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['statuspage'],
    categoryKeywords: ['status', 'incidents', 'monitoring', 'subscribers', 'components']
  },

  // Graphic Design - Alternatives to Canva, Photoshop, Illustrator
  {
    name: 'GIMP',
    slug: 'gimp',
    short_description: 'Free image editor',
    description: 'GIMP is a free and open-source image editor. It provides photo retouching, image composition, and image authoring with extensible plugins.',
    website: 'https://www.gimp.org',
    github: 'https://github.com/GNOME/gimp',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-photoshop', 'canva'],
    categoryKeywords: ['image', 'editing', 'graphics', 'photo', 'retouching']
  },
  {
    name: 'Inkscape',
    slug: 'inkscape',
    short_description: 'Vector graphics editor',
    description: 'Inkscape is a free and open-source vector graphics editor. It provides powerful tools for illustration, design, and editing SVG files.',
    website: 'https://inkscape.org',
    github: 'https://github.com/inkscape/inkscape',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-illustrator'],
    categoryKeywords: ['vector', 'graphics', 'svg', 'illustration', 'design']
  },
  {
    name: 'Krita',
    slug: 'krita',
    short_description: 'Free digital painting',
    description: 'Krita is a free and open-source painting program. It is designed for concept artists, illustrators, and the VFX industry with powerful brush engines.',
    website: 'https://krita.org',
    github: 'https://github.com/KDE/krita',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-photoshop'],
    categoryKeywords: ['painting', 'digital-art', 'illustration', 'brushes', 'graphics']
  },
  {
    name: 'Penpot',
    slug: 'penpot',
    short_description: 'Open-source design platform',
    description: 'Penpot is the first open-source design and prototyping platform for design and development teams. It is web-based with real-time collaboration.',
    website: 'https://penpot.app',
    github: 'https://github.com/penpot/penpot',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['canva', 'adobe-illustrator'],
    categoryKeywords: ['design', 'prototyping', 'collaboration', 'web', 'svg']
  },

  // Audio - Alternatives to Adobe Audition, Pro Tools
  {
    name: 'Audacity',
    slug: 'audacity',
    short_description: 'Free audio editor',
    description: 'Audacity is a free, open-source, cross-platform audio software. It provides multi-track recording and editing, effects, and plugin support.',
    website: 'https://www.audacityteam.org',
    github: 'https://github.com/audacity/audacity',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-audition', 'pro-tools'],
    categoryKeywords: ['audio', 'editing', 'recording', 'podcast', 'effects']
  },
  {
    name: 'Ardour',
    slug: 'ardour',
    short_description: 'Digital audio workstation',
    description: 'Ardour is a digital audio workstation for recording, editing, and mixing. It supports multi-track recording, MIDI, plugins, and video timeline.',
    website: 'https://ardour.org',
    github: 'https://github.com/Ardour/ardour',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['pro-tools', 'adobe-audition'],
    categoryKeywords: ['daw', 'audio', 'recording', 'mixing', 'midi']
  },

  // Browser - Alternatives to Chrome, Edge
  {
    name: 'Firefox',
    slug: 'firefox',
    short_description: 'Privacy-focused browser',
    description: 'Firefox is a free and open-source web browser by Mozilla. It focuses on privacy, customization, and standards compliance with extensive add-on support.',
    website: 'https://www.mozilla.org/firefox',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['google-chrome', 'microsoft-edge'],
    categoryKeywords: ['browser', 'privacy', 'web', 'mozilla', 'add-ons']
  },
  {
    name: 'Brave',
    slug: 'brave',
    short_description: 'Privacy browser with rewards',
    description: 'Brave is a free and open-source web browser. It blocks ads and trackers by default, provides privacy features, and offers BAT crypto rewards.',
    website: 'https://brave.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['google-chrome', 'microsoft-edge'],
    categoryKeywords: ['browser', 'privacy', 'ad-blocking', 'crypto', 'fast']
  },

  // Office - Alternatives to Microsoft Office, Google Docs
  {
    name: 'LibreOffice',
    slug: 'libreoffice',
    short_description: 'Free office suite',
    description: 'LibreOffice is a free and open-source office suite. It includes Writer, Calc, Impress, Draw, Base, and Math with excellent file format compatibility.',
    website: 'https://www.libreoffice.org',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['microsoft-office', 'google-docs'],
    categoryKeywords: ['office', 'documents', 'spreadsheet', 'presentation', 'free']
  },
  {
    name: 'ONLYOFFICE',
    slug: 'onlyoffice',
    short_description: 'Secure office suite',
    description: 'ONLYOFFICE is a free office suite for collaboration. It provides document editors with high Microsoft Office compatibility and self-hosting option.',
    website: 'https://www.onlyoffice.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['microsoft-office', 'google-docs'],
    categoryKeywords: ['office', 'collaboration', 'documents', 'self-hosted', 'editing']
  },
  {
    name: 'CryptPad',
    slug: 'cryptpad',
    short_description: 'Encrypted collaboration suite',
    description: 'CryptPad is an end-to-end encrypted collaboration suite. It provides documents, spreadsheets, presentations, polls, and kanban with zero-knowledge encryption.',
    website: 'https://cryptpad.org',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-docs'],
    categoryKeywords: ['office', 'encryption', 'collaboration', 'privacy', 'secure']
  },

  // Web Analytics - Alternatives to Google Analytics, Adobe Analytics
  {
    name: 'Plausible',
    slug: 'plausible',
    short_description: 'Privacy-friendly analytics',
    description: 'Plausible is a lightweight, open-source web analytics tool. It is privacy-friendly, cookie-free, and GDPR compliant with simple dashboard.',
    website: 'https://plausible.io',
    github: 'https://github.com/plausible/analytics',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-analytics', 'adobe-analytics'],
    categoryKeywords: ['analytics', 'privacy', 'gdpr', 'lightweight', 'web']
  },
  {
    name: 'Umami',
    slug: 'umami',
    short_description: 'Simple web analytics',
    description: 'Umami is a simple, fast, privacy-focused alternative to Google Analytics. It provides a clean interface, no cookies, and full GDPR compliance.',
    website: 'https://umami.is',
    github: 'https://github.com/umami-software/umami',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['google-analytics'],
    categoryKeywords: ['analytics', 'privacy', 'simple', 'fast', 'gdpr']
  },
  {
    name: 'Matomo',
    slug: 'matomo',
    short_description: 'Open-source web analytics',
    description: 'Matomo is the leading open-source web analytics platform. It provides complete website analytics with full data ownership and GDPR compliance.',
    website: 'https://matomo.org',
    github: 'https://github.com/matomo-org/matomo',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-analytics', 'adobe-analytics'],
    categoryKeywords: ['analytics', 'web', 'privacy', 'complete', 'gdpr']
  },
  {
    name: 'PostHog',
    slug: 'posthog',
    short_description: 'Open-source product analytics',
    description: 'PostHog is an open-source product analytics platform. It provides event tracking, session recordings, feature flags, A/B testing, and user surveys.',
    website: 'https://posthog.com',
    github: 'https://github.com/PostHog/posthog',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['google-analytics', 'adobe-analytics'],
    categoryKeywords: ['analytics', 'product', 'events', 'ab-testing', 'surveys']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // ERP
  'erp': ['business-software', 'erp'],
  'accounting': ['accounting', 'business-software'],
  'inventory': ['inventory-management', 'business-software'],
  'manufacturing': ['manufacturing', 'business-software'],
  'business': ['business-software', 'productivity'],
  'modular': ['developer-tools', 'business-software'],
  'smb': ['business-software', 'small-business'],
  
  // E-commerce
  'ecommerce': ['e-commerce', 'business-software'],
  'commerce': ['e-commerce', 'business-software'],
  'nodejs': ['developer-tools', 'backend-development'],
  'graphql': ['api-development', 'developer-tools'],
  'pwa': ['frontend-development', 'mobile'],
  'symfony': ['developer-tools', 'backend-development'],
  'php': ['developer-tools', 'backend-development'],
  'framework': ['developer-tools', 'backend-development'],
  'custom': ['developer-tools', 'customization'],
  'laravel': ['developer-tools', 'backend-development'],
  'marketplace': ['e-commerce', 'business-software'],
  
  // Notes
  'notes': ['note-taking', 'productivity'],
  'knowledge': ['knowledge-management', 'productivity'],
  'markdown': ['documentation', 'developer-tools'],
  'linking': ['knowledge-management', 'note-taking'],
  'local': ['privacy', 'self-hosting'],
  'outliner': ['note-taking', 'productivity'],
  'backlinks': ['knowledge-management', 'note-taking'],
  'encryption': ['encryption', 'security-privacy'],
  'sync': ['file-sharing', 'productivity'],
  'todo': ['task-management', 'productivity'],
  'privacy': ['security-privacy', 'privacy'],
  'secure': ['security-privacy', 'encryption'],
  'workspace': ['productivity', 'communication-collaboration'],
  'collaboration': ['communication-collaboration', 'productivity'],
  'ai': ['ai-ml', 'developer-tools'],
  'p2p': ['security-privacy', 'networking'],
  'offline': ['productivity', 'mobile'],
  
  // VPN
  'vpn': ['security-privacy', 'networking'],
  'security': ['security-privacy', 'devops-infrastructure'],
  'networking': ['networking', 'devops-infrastructure'],
  'fast': ['performance', 'developer-tools'],
  'protocol': ['networking', 'developer-tools'],
  'wireguard': ['security-privacy', 'networking'],
  'mesh': ['networking', 'devops-infrastructure'],
  'zero-config': ['devops-infrastructure', 'developer-tools'],
  'tailscale': ['security-privacy', 'networking'],
  'self-hosted': ['self-hosting', 'devops-infrastructure'],
  
  // ML
  'ml': ['ai-ml', 'data-science'],
  'mlops': ['ai-ml', 'devops-infrastructure'],
  'tracking': ['analytics', 'ai-ml'],
  'deployment': ['devops-infrastructure', 'ci-cd'],
  'lifecycle': ['devops-infrastructure', 'ai-ml'],
  'kubernetes': ['containers-orchestration', 'devops-infrastructure'],
  'pipelines': ['ci-cd', 'data-engineering'],
  'training': ['ai-ml', 'education'],
  'labeling': ['ai-ml', 'data-science'],
  'annotation': ['ai-ml', 'data-science'],
  'data': ['data-science', 'analytics'],
  
  // Logging
  'logging': ['monitoring-observability', 'devops-infrastructure'],
  'observability': ['monitoring-observability', 'devops-infrastructure'],
  'grafana': ['monitoring-observability', 'analytics'],
  'scalable': ['devops-infrastructure', 'performance'],
  'labels': ['devops-infrastructure', 'monitoring-observability'],
  'search': ['search', 'developer-tools'],
  'analysis': ['analytics', 'data-science'],
  'alerting': ['monitoring-observability', 'devops-infrastructure'],
  'centralized': ['devops-infrastructure', 'monitoring-observability'],
  'pipeline': ['ci-cd', 'data-engineering'],
  'rust': ['developer-tools', 'backend-development'],
  'transforms': ['data-engineering', 'developer-tools'],
  
  // Media
  'media': ['video-audio', 'content-media'],
  'streaming': ['streaming', 'video-audio'],
  'server': ['devops-infrastructure', 'backend-development'],
  'tv': ['video-audio', 'streaming'],
  'movies': ['video-audio', 'content-media'],
  'personal': ['productivity', 'self-hosting'],
  'dvr': ['video-audio', 'streaming'],
  
  // Photos
  'photos': ['photo-management', 'content-media'],
  'backup': ['backup', 'devops-infrastructure'],
  'mobile': ['mobile', 'apps'],
  'tagging': ['productivity', 'content-media'],
  'geo': ['location', 'content-media'],
  'face-detection': ['ai-ml', 'photo-management'],
  
  // Files
  'files': ['file-sharing', 'productivity'],
  'office': ['office-suite', 'productivity'],
  'sharing': ['file-sharing', 'communication-collaboration'],
  'enterprise': ['business-software', 'devops-infrastructure'],
  'performance': ['performance', 'devops-infrastructure'],
  'team': ['communication-collaboration', 'project-management'],
  'decentralized': ['security-privacy', 'networking'],
  
  // Kanban
  'kanban': ['project-management', 'task-management'],
  'project': ['project-management', 'productivity'],
  'tasks': ['task-management', 'productivity'],
  'boards': ['project-management', 'task-management'],
  'simple': ['productivity', 'developer-tools'],
  'cards': ['project-management', 'task-management'],
  'teams': ['communication-collaboration', 'project-management'],
  'realtime': ['developer-tools', 'communication-collaboration'],
  'workgroups': ['communication-collaboration', 'project-management'],
  
  // Containers
  'containers': ['containers-orchestration', 'devops-infrastructure'],
  'registry': ['containers-orchestration', 'devops-infrastructure'],
  'cloud-native': ['cloud-platforms', 'devops-infrastructure'],
  'scanning': ['security-privacy', 'devops-infrastructure'],
  'oci': ['containers-orchestration', 'devops-infrastructure'],
  'lightweight': ['performance', 'developer-tools'],
  
  // Wiki
  'wiki': ['documentation', 'knowledge-management'],
  'documentation': ['documentation', 'developer-tools'],
  'git': ['version-control', 'developer-tools'],
  'modern': ['developer-tools', 'productivity'],
  'organized': ['productivity', 'knowledge-management'],
  'books': ['knowledge-management', 'documentation'],
  'structured': ['knowledge-management', 'documentation'],
  'extensions': ['developer-tools', 'customization'],
  
  // BaaS
  'baas': ['backend-development', 'cloud-platforms'],
  'database': ['database', 'developer-tools'],
  'auth': ['authentication-identity', 'security-privacy'],
  'postgres': ['database', 'developer-tools'],
  'backend': ['backend-development', 'developer-tools'],
  'functions': ['serverless', 'backend-development'],
  'single-file': ['developer-tools', 'backend-development'],
  'go': ['developer-tools', 'backend-development'],
  'paas': ['cloud-platforms', 'devops-infrastructure'],
  'docker': ['containers-orchestration', 'devops-infrastructure'],
  'buildpacks': ['devops-infrastructure', 'ci-cd'],
  
  // API Gateway
  'api': ['api-development', 'developer-tools'],
  'gateway': ['api-development', 'devops-infrastructure'],
  'microservices': ['devops-infrastructure', 'backend-development'],
  'routing': ['networking', 'devops-infrastructure'],
  'plugins': ['developer-tools', 'customization'],
  'proxy': ['networking', 'devops-infrastructure'],
  'router': ['networking', 'devops-infrastructure'],
  'load-balancer': ['devops-infrastructure', 'networking'],
  'dynamic': ['developer-tools', 'devops-infrastructure'],
  'high-performance': ['performance', 'devops-infrastructure'],
  'management': ['devops-infrastructure', 'api-development'],
  'portal': ['api-development', 'documentation'],
  'versioning': ['api-development', 'developer-tools'],
  
  // Errors
  'errors': ['monitoring-observability', 'developer-tools'],
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'sentry': ['monitoring-observability', 'developer-tools'],
  
  // Invoicing
  'invoicing': ['accounting', 'business-software'],
  'billing': ['billing-payments', 'business-software'],
  'quotes': ['business-software', 'accounting'],
  'payments': ['billing-payments', 'e-commerce'],
  'expenses': ['accounting', 'business-software'],
  'reports': ['analytics', 'business-software'],
  'banking': ['accounting', 'business-software'],
  'estimates': ['business-software', 'accounting'],
  'templates': ['design', 'productivity'],
  
  // Backup
  'deduplication': ['backup', 'storage'],
  'cloud': ['cloud-platforms', 'storage'],
  'compression': ['backup', 'storage'],
  'archive': ['backup', 'storage'],
  'incremental': ['backup', 'storage'],
  'gui': ['developer-tools', 'productivity'],
  
  // Queue
  'messaging': ['communication-collaboration', 'devops-infrastructure'],
  'queue': ['devops-infrastructure', 'backend-development'],
  'broker': ['devops-infrastructure', 'backend-development'],
  'amqp': ['devops-infrastructure', 'backend-development'],
  'clustering': ['devops-infrastructure', 'database'],
  'events': ['analytics', 'developer-tools'],
  'distributed': ['devops-infrastructure', 'database'],
  'pubsub': ['devops-infrastructure', 'backend-development'],
  
  // Landing
  'landing': ['marketing-automation', 'frontend-development'],
  'react': ['frontend-development', 'developer-tools'],
  'template': ['design', 'frontend-development'],
  'marketing': ['marketing-automation', 'business-software'],
  'pages': ['frontend-development', 'marketing-automation'],
  
  // Monitoring
  'uptime': ['monitoring-observability', 'devops-infrastructure'],
  'status': ['monitoring-observability', 'devops-infrastructure'],
  'notifications': ['communication-collaboration', 'devops-infrastructure'],
  'health': ['monitoring-observability', 'devops-infrastructure'],
  'dashboard': ['analytics', 'monitoring-observability'],
  'developer': ['developer-tools', 'api-development'],
  'incidents': ['monitoring-observability', 'devops-infrastructure'],
  'subscribers': ['marketing-automation', 'communication-collaboration'],
  'components': ['frontend-development', 'developer-tools'],
  
  // Graphics
  'image': ['graphic-design', 'content-media'],
  'editing': ['video-audio', 'graphic-design'],
  'graphics': ['graphic-design', 'design'],
  'photo': ['photo-management', 'graphic-design'],
  'retouching': ['graphic-design', 'photo-management'],
  'vector': ['graphic-design', 'design'],
  'svg': ['graphic-design', 'design'],
  'illustration': ['graphic-design', 'design'],
  'design': ['design', 'ui-ux'],
  'painting': ['graphic-design', 'design'],
  'digital-art': ['graphic-design', 'design'],
  'brushes': ['graphic-design', 'design'],
  'prototyping': ['ui-ux', 'design'],
  'web': ['frontend-development', 'developer-tools'],
  
  // Audio
  'audio': ['video-audio', 'content-media'],
  'recording': ['video-audio', 'content-media'],
  'podcast': ['video-audio', 'content-media'],
  'effects': ['video-audio', 'content-media'],
  'daw': ['video-audio', 'content-media'],
  'mixing': ['video-audio', 'content-media'],
  'midi': ['video-audio', 'content-media'],
  
  // Browser
  'browser': ['developer-tools', 'productivity'],
  'mozilla': ['developer-tools', 'productivity'],
  'add-ons': ['developer-tools', 'customization'],
  'ad-blocking': ['security-privacy', 'productivity'],
  'crypto': ['blockchain', 'finance'],
  
  // Office
  'documents': ['document-collaboration', 'productivity'],
  'spreadsheet': ['office-suite', 'productivity'],
  'presentation': ['office-suite', 'productivity'],
  'free': ['productivity', 'developer-tools'],
  
  // Analytics
  'analytics': ['analytics', 'business-intelligence'],
  'gdpr': ['security-privacy', 'compliance'],
  'complete': ['business-software', 'analytics'],
  'product': ['product-management', 'analytics'],
  'ab-testing': ['analytics', 'product-management'],
  'surveys': ['analytics', 'feedback'],
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
