import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  created_at: { type: Date, default: Date.now }
});

const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Missing proprietary software that our alternatives reference
const missingProprietarySoftware = [
  // Communication & Collaboration
  { name: 'Slack', website: 'https://slack.com', description: 'Business communication platform with channels, direct messaging, and integrations' },
  { name: 'Microsoft Teams', website: 'https://www.microsoft.com/en-us/microsoft-teams', description: 'Team collaboration and communication platform with video meetings' },
  { name: 'Discord', website: 'https://discord.com', description: 'Voice, video, and text communication platform for communities' },
  { name: 'Zoom', website: 'https://zoom.us', description: 'Video conferencing and online meeting platform' },
  
  // Project Management
  { name: 'Trello', website: 'https://trello.com', description: 'Visual project management with boards, lists, and cards' },
  { name: 'Asana', website: 'https://asana.com', description: 'Work management platform for teams' },
  { name: 'Monday.com', website: 'https://monday.com', description: 'Work operating system for project management' },
  { name: 'Linear', website: 'https://linear.app', description: 'Issue tracking tool for software teams' },
  { name: 'Jira', website: 'https://www.atlassian.com/software/jira', description: 'Issue and project tracking for software teams' },
  { name: 'ClickUp', website: 'https://clickup.com', description: 'Productivity platform with tasks, docs, goals, and chat' },
  { name: 'Basecamp', website: 'https://basecamp.com', description: 'Project management and team communication platform' },
  
  // Note-taking & Documentation
  { name: 'Notion', website: 'https://notion.so', description: 'All-in-one workspace for notes, docs, and project management' },
  { name: 'Evernote', website: 'https://evernote.com', description: 'Note-taking and organization application' },
  { name: 'Confluence', website: 'https://www.atlassian.com/software/confluence', description: 'Team workspace for knowledge sharing and collaboration' },
  { name: 'Coda', website: 'https://coda.io', description: 'All-in-one doc combining docs, spreadsheets, and apps' },
  { name: 'Roam Research', website: 'https://roamresearch.com', description: 'Note-taking tool for networked thought' },
  
  // Analytics
  { name: 'Google Analytics', website: 'https://analytics.google.com', description: 'Web analytics service for tracking website traffic' },
  { name: 'Mixpanel', website: 'https://mixpanel.com', description: 'Product analytics for understanding user behavior' },
  { name: 'Amplitude', website: 'https://amplitude.com', description: 'Digital analytics platform for product intelligence' },
  { name: 'Heap', website: 'https://heap.io', description: 'Digital insights platform for automatic event tracking' },
  { name: 'FullStory', website: 'https://fullstory.com', description: 'Digital experience analytics with session replay' },
  { name: 'Hotjar', website: 'https://hotjar.com', description: 'Behavior analytics with heatmaps and recordings' },
  
  // Design & Creative
  { name: 'Adobe Photoshop', website: 'https://www.adobe.com/products/photoshop', description: 'Professional image editing and design software' },
  { name: 'Adobe Illustrator', website: 'https://www.adobe.com/products/illustrator', description: 'Vector graphics editor for logos and illustrations' },
  { name: 'Figma', website: 'https://www.figma.com', description: 'Collaborative interface design tool' },
  { name: 'Sketch', website: 'https://www.sketch.com', description: 'Digital design toolkit for UI/UX design' },
  { name: 'Canva', website: 'https://www.canva.com', description: 'Online graphic design platform' },
  { name: 'InVision', website: 'https://www.invisionapp.com', description: 'Digital product design platform' },
  
  // Video & Media
  { name: 'YouTube', website: 'https://youtube.com', description: 'Video sharing and streaming platform' },
  { name: 'Vimeo', website: 'https://vimeo.com', description: 'Video hosting and sharing platform' },
  { name: 'Loom', website: 'https://www.loom.com', description: 'Video messaging for work' },
  { name: 'Spotify', website: 'https://spotify.com', description: 'Music streaming service' },
  { name: 'Netflix', website: 'https://netflix.com', description: 'Streaming service for movies and TV shows' },
  { name: 'Twitch', website: 'https://twitch.tv', description: 'Live streaming platform for gamers' },
  
  // Cloud Storage & File Sharing
  { name: 'Dropbox', website: 'https://www.dropbox.com', description: 'Cloud storage and file synchronization service' },
  { name: 'Google Drive', website: 'https://drive.google.com', description: 'Cloud storage and file backup service' },
  { name: 'Box', website: 'https://www.box.com', description: 'Cloud content management and file sharing' },
  { name: 'WeTransfer', website: 'https://wetransfer.com', description: 'File transfer service for large files' },
  { name: 'AirDrop', website: 'https://support.apple.com/airdrop', description: 'Apple file sharing service between devices' },
  
  // Email & Marketing
  { name: 'Mailchimp', website: 'https://mailchimp.com', description: 'Email marketing automation platform' },
  { name: 'SendGrid', website: 'https://sendgrid.com', description: 'Cloud-based email delivery platform' },
  { name: 'ConvertKit', website: 'https://convertkit.com', description: 'Email marketing for creators' },
  { name: 'Mailgun', website: 'https://www.mailgun.com', description: 'Email API service for developers' },
  { name: 'Substack', website: 'https://substack.com', description: 'Newsletter publishing platform' },
  { name: 'Beehiiv', website: 'https://beehiiv.com', description: 'Newsletter platform for creators' },
  { name: 'Buttondown', website: 'https://buttondown.email', description: 'Simple newsletter service' },
  
  // CRM & Sales
  { name: 'Salesforce', website: 'https://salesforce.com', description: 'Customer relationship management platform' },
  { name: 'HubSpot', website: 'https://hubspot.com', description: 'CRM, marketing, and sales platform' },
  { name: 'Pipedrive', website: 'https://pipedrive.com', description: 'Sales CRM for small teams' },
  { name: 'Freshsales', website: 'https://freshworks.com/freshsales-crm', description: 'CRM software for sales teams' },
  
  // Customer Support
  { name: 'Zendesk', website: 'https://zendesk.com', description: 'Customer service and engagement platform' },
  { name: 'Intercom', website: 'https://intercom.com', description: 'Customer messaging platform' },
  { name: 'Freshdesk', website: 'https://freshdesk.com', description: 'Cloud-based customer support software' },
  { name: 'Help Scout', website: 'https://helpscout.com', description: 'Help desk software for customer support' },
  { name: 'Crisp', website: 'https://crisp.chat', description: 'Customer messaging platform for startups' },
  
  // Forms & Surveys
  { name: 'Typeform', website: 'https://typeform.com', description: 'Online form and survey builder' },
  { name: 'Google Forms', website: 'https://docs.google.com/forms', description: 'Free online form creator' },
  { name: 'JotForm', website: 'https://jotform.com', description: 'Online form builder' },
  { name: 'SurveyMonkey', website: 'https://surveymonkey.com', description: 'Online survey development' },
  { name: 'Tally', website: 'https://tally.so', description: 'Simple form builder' },
  
  // Scheduling & Calendar
  { name: 'Calendly', website: 'https://calendly.com', description: 'Online appointment scheduling software' },
  { name: 'Google Calendar', website: 'https://calendar.google.com', description: 'Time-management and scheduling calendar service' },
  { name: 'Cal.com', website: 'https://cal.com', description: 'Open source scheduling infrastructure' },
  { name: 'Doodle', website: 'https://doodle.com', description: 'Online scheduling tool' },
  
  // Time Tracking
  { name: 'Toggl Track', website: 'https://toggl.com/track', description: 'Time tracking software' },
  { name: 'Harvest', website: 'https://getharvest.com', description: 'Time tracking and invoicing' },
  { name: 'Clockify', website: 'https://clockify.me', description: 'Free time tracking software' },
  
  // Password Management
  { name: '1Password', website: 'https://1password.com', description: 'Password manager for families and businesses' },
  { name: 'LastPass', website: 'https://lastpass.com', description: 'Password manager' },
  { name: 'Dashlane', website: 'https://dashlane.com', description: 'Password manager and digital wallet' },
  
  // Automation & Integration
  { name: 'Zapier', website: 'https://zapier.com', description: 'Automation platform connecting apps' },
  { name: 'Make', website: 'https://make.com', description: 'Visual automation platform (formerly Integromat)' },
  { name: 'IFTTT', website: 'https://ifttt.com', description: 'Automation service connecting apps and devices' },
  
  // No-Code & Low-Code
  { name: 'Airtable', website: 'https://airtable.com', description: 'Low-code platform for building collaborative apps' },
  { name: 'Retool', website: 'https://retool.com', description: 'Low-code platform for internal tools' },
  { name: 'Bubble', website: 'https://bubble.io', description: 'No-code web app builder' },
  { name: 'Webflow', website: 'https://webflow.com', description: 'No-code website builder' },
  
  // E-commerce
  { name: 'Shopify', website: 'https://shopify.com', description: 'E-commerce platform for online stores' },
  { name: 'WooCommerce', website: 'https://woocommerce.com', description: 'E-commerce plugin for WordPress' },
  { name: 'BigCommerce', website: 'https://bigcommerce.com', description: 'E-commerce platform for online business' },
  { name: 'Gumroad', website: 'https://gumroad.com', description: 'Platform for selling digital products' },
  { name: 'Lemon Squeezy', website: 'https://lemonsqueezy.com', description: 'Payments and billing for SaaS' },
  { name: 'Paddle', website: 'https://paddle.com', description: 'Payment infrastructure for SaaS' },
  
  // Learning & Education
  { name: 'Teachable', website: 'https://teachable.com', description: 'Platform for creating online courses' },
  { name: 'Thinkific', website: 'https://thinkific.com', description: 'Online course creation platform' },
  { name: 'Udemy', website: 'https://udemy.com', description: 'Online learning marketplace' },
  
  // Status & Monitoring
  { name: 'Statuspage.io', website: 'https://statuspage.io', description: 'Hosted status pages' },
  { name: 'Datadog', website: 'https://datadoghq.com', description: 'Monitoring and security platform' },
  { name: 'New Relic', website: 'https://newrelic.com', description: 'Observability platform' },
  { name: 'PagerDuty', website: 'https://pagerduty.com', description: 'Incident management platform' },
  { name: 'Opsgenie', website: 'https://opsgenie.com', description: 'Alert and on-call management' },
  
  // Developer Tools
  { name: 'Postman', website: 'https://postman.com', description: 'API platform for building and testing APIs' },
  { name: 'Insomnia', website: 'https://insomnia.rest', description: 'API client for REST and GraphQL' },
  { name: 'Bitbucket', website: 'https://bitbucket.org', description: 'Git code management and CI/CD' },
  { name: 'GitLab.com', website: 'https://gitlab.com', description: 'DevOps platform with Git repository management' },
  
  // Search
  { name: 'Elasticsearch', website: 'https://elastic.co/elasticsearch', description: 'Distributed search and analytics engine' },
  { name: 'Algolia', website: 'https://algolia.com', description: 'Search and discovery platform' },
  
  // Backend & Infrastructure
  { name: 'Firebase', website: 'https://firebase.google.com', description: 'App development platform by Google' },
  { name: 'Supabase', website: 'https://supabase.com', description: 'Open source Firebase alternative' },
  { name: 'AWS S3', website: 'https://aws.amazon.com/s3', description: 'Amazon cloud object storage' },
  { name: 'Heroku', website: 'https://heroku.com', description: 'Cloud platform for app deployment' },
  { name: 'Vercel', website: 'https://vercel.com', description: 'Platform for frontend frameworks' },
  { name: 'Netlify', website: 'https://netlify.com', description: 'Web development platform' },
  
  // Feature Flags
  { name: 'LaunchDarkly', website: 'https://launchdarkly.com', description: 'Feature management platform' },
  
  // Auth & Identity
  { name: 'Okta', website: 'https://okta.com', description: 'Identity and access management' },
  { name: 'Magic.link', website: 'https://magic.link', description: 'Passwordless authentication' },
  
  // Payment
  { name: 'Stripe', website: 'https://stripe.com', description: 'Payment processing platform' },
  { name: 'PayPal', website: 'https://paypal.com', description: 'Online payment system' },
  
  // Link & URL
  { name: 'Bitly', website: 'https://bitly.com', description: 'URL shortening service' },
  { name: 'Linktree', website: 'https://linktr.ee', description: 'Link in bio tool' },
  { name: 'Dub.co', website: 'https://dub.co', description: 'Open-source link management' },
  
  // Bookmark & Reading
  { name: 'Pocket', website: 'https://getpocket.com', description: 'Save articles and videos for later' },
  { name: 'Raindrop.io', website: 'https://raindrop.io', description: 'Bookmark manager' },
  { name: 'Instapaper', website: 'https://instapaper.com', description: 'Save web pages to read later' },
  
  // Whiteboard & Diagrams
  { name: 'Miro', website: 'https://miro.com', description: 'Online collaborative whiteboard' },
  { name: 'Lucidchart', website: 'https://lucidchart.com', description: 'Web-based diagramming application' },
  { name: 'Excalidraw', website: 'https://excalidraw.com', description: 'Virtual whiteboard for sketching' },
  
  // Finance & Budgeting
  { name: 'QuickBooks', website: 'https://quickbooks.intuit.com', description: 'Accounting software' },
  { name: 'FreshBooks', website: 'https://freshbooks.com', description: 'Cloud accounting software' },
  { name: 'YNAB', website: 'https://ynab.com', description: 'Personal budgeting software' },
  { name: 'Mint', website: 'https://mint.intuit.com', description: 'Personal finance management' },
  
  // Home Automation
  { name: 'SmartThings', website: 'https://smartthings.com', description: 'Smart home platform' },
  { name: 'Google Home', website: 'https://home.google.com', description: 'Smart home ecosystem' },
  { name: 'Amazon Alexa', website: 'https://alexa.amazon.com', description: 'Voice-controlled assistant' },
  
  // RSS & Feed
  { name: 'Feedly', website: 'https://feedly.com', description: 'News aggregator and RSS reader' },
  
  // Document Signing
  { name: 'DocuSign', website: 'https://docusign.com', description: 'Electronic signature platform' },
  { name: 'HelloSign', website: 'https://hellosign.com', description: 'E-signature solution' },
  
  // Media Server
  { name: 'Plex', website: 'https://plex.tv', description: 'Media server for streaming your content' },
  { name: 'Emby', website: 'https://emby.media', description: 'Personal media server' },
  
  // Social Media
  { name: 'WhatsApp', website: 'https://whatsapp.com', description: 'Messaging and voice calling app' },
  { name: 'Signal', website: 'https://signal.org', description: 'Encrypted messaging service' },
  
  // Content Management
  { name: 'WordPress', website: 'https://wordpress.org', description: 'Content management system' },
  { name: 'Ghost', website: 'https://ghost.org', description: 'Publishing platform for newsletters' },
  { name: 'Medium', website: 'https://medium.com', description: 'Online publishing platform' },
  { name: 'Hashnode', website: 'https://hashnode.com', description: 'Blogging platform for developers' },
  
  // Podcast
  { name: 'Anchor', website: 'https://anchor.fm', description: 'Free podcast hosting platform' },
  { name: 'Transistor', website: 'https://transistor.fm', description: 'Podcast hosting platform' },
  
  // Comments
  { name: 'Disqus', website: 'https://disqus.com', description: 'Blog comment hosting service' },
  
  // Game Development
  { name: 'Unity', website: 'https://unity.com', description: 'Game engine for 2D and 3D games' },
  { name: 'Unreal Engine', website: 'https://unrealengine.com', description: 'Game development platform' },
  
  // Video Editing
  { name: 'Final Cut Pro', website: 'https://apple.com/final-cut-pro', description: 'Professional video editing software' },
  { name: 'iMovie', website: 'https://apple.com/imovie', description: 'Video editing software by Apple' },
  
  // Audio Production
  { name: 'Ableton Live', website: 'https://ableton.com', description: 'Digital audio workstation' },
  { name: 'FL Studio', website: 'https://image-line.com', description: 'Digital audio workstation' },
  { name: 'Logic Pro', website: 'https://apple.com/logic-pro', description: 'Professional music production' },
  { name: 'Audacity', website: 'https://audacityteam.org', description: 'Free audio editor' },
  
  // Terminal & CLI
  { name: 'iTerm2', website: 'https://iterm2.com', description: 'Terminal emulator for macOS' },
  { name: 'Hyper', website: 'https://hyper.is', description: 'Electron-based terminal' },
  
  // Code Editor
  { name: 'VS Code', website: 'https://code.visualstudio.com', description: 'Source code editor by Microsoft' },
  { name: 'Sublime Text', website: 'https://sublimetext.com', description: 'Sophisticated text editor' },
  { name: 'JetBrains', website: 'https://jetbrains.com', description: 'IDE suite for developers' },
  
  // VPN & Security
  { name: 'NordVPN', website: 'https://nordvpn.com', description: 'VPN service' },
  { name: 'ExpressVPN', website: 'https://expressvpn.com', description: 'VPN service' },
  
  // Backup
  { name: 'Backblaze', website: 'https://backblaze.com', description: 'Cloud backup service' },
  { name: 'Carbonite', website: 'https://carbonite.com', description: 'Cloud backup solutions' },
  
  // Remote Desktop
  { name: 'TeamViewer', website: 'https://teamviewer.com', description: 'Remote access and support' },
  { name: 'AnyDesk', website: 'https://anydesk.com', description: 'Remote desktop software' },
  
  // Resume Builder
  { name: 'Resume.io', website: 'https://resume.io', description: 'Online resume builder' },
  
  // Inventory
  { name: 'Inventory Cloud', website: 'https://inventorycloud.co', description: 'Cloud inventory management' },
  { name: 'Anylist', website: 'https://anylist.com', description: 'Shopping list and recipe app' },
  
  // Recipe Management
  { name: 'Paprika', website: 'https://paprikaapp.com', description: 'Recipe manager app' },
  
  // Fleet Management
  { name: 'Samsara', website: 'https://samsara.com', description: 'Fleet management platform' },
  
  // Digital Signage
  { name: 'Yodeck', website: 'https://yodeck.com', description: 'Digital signage platform' },
  
  // Network Monitoring
  { name: 'PRTG', website: 'https://paessler.com/prtg', description: 'Network monitoring software' },
  { name: 'SolarWinds', website: 'https://solarwinds.com', description: 'IT management software' },
  { name: 'Nagios', website: 'https://nagios.org', description: 'IT infrastructure monitoring' },
  
  // Office Suite
  { name: 'Microsoft Office', website: 'https://office.com', description: 'Productivity suite by Microsoft' },
  { name: 'Google Docs', website: 'https://docs.google.com', description: 'Online document editor' },
  { name: 'Google Sheets', website: 'https://sheets.google.com', description: 'Online spreadsheet editor' },
  
  // Presentation
  { name: 'PowerPoint', website: 'https://office.com/powerpoint', description: 'Presentation software by Microsoft' },
  { name: 'Keynote', website: 'https://apple.com/keynote', description: 'Presentation software by Apple' },
  { name: 'Prezi', website: 'https://prezi.com', description: 'Presentation software' },
  
  // Mind Mapping
  { name: 'MindMeister', website: 'https://mindmeister.com', description: 'Online mind mapping tool' },
  { name: 'XMind', website: 'https://xmind.app', description: 'Mind mapping and brainstorming' },
  
  // Contacts
  { name: 'Google Contacts', website: 'https://contacts.google.com', description: 'Contact management by Google' },
  
  // Speed Test
  { name: 'Speedtest.net', website: 'https://speedtest.net', description: 'Internet speed test by Ookla' },
  
  // Pastebin
  { name: 'Pastebin.com', website: 'https://pastebin.com', description: 'Text storage site' },
  { name: 'GitHub Gist', website: 'https://gist.github.com', description: 'Code snippet sharing by GitHub' },
  
  // Code Sharing
  { name: 'CodePen', website: 'https://codepen.io', description: 'Social development environment' },
  { name: 'CodeSandbox', website: 'https://codesandbox.io', description: 'Online code editor and IDE' },
  
  // Changelog
  { name: 'Changelogify', website: 'https://changelogify.com', description: 'Changelog management' },
  
  // SSL
  { name: 'Paid SSL', website: 'https://ssl.com', description: 'SSL certificate providers' },
  { name: 'AWS Certificate Manager', website: 'https://aws.amazon.com/certificate-manager', description: 'SSL/TLS certificate management' },
  
  // Firewall
  { name: 'pfSense', website: 'https://pfsense.org', description: 'Open source firewall/router' },
  
  // DNS
  { name: 'Route53', website: 'https://aws.amazon.com/route53', description: 'AWS DNS service' },
  { name: 'Cloudflare DNS', website: 'https://cloudflare.com/dns', description: 'DNS service by Cloudflare' },
  { name: 'Pi-hole', website: 'https://pi-hole.net', description: 'Network-wide ad blocking' },
  
  // Identity
  { name: 'Active Directory', website: 'https://azure.microsoft.com/products/active-directory', description: 'Identity and access management by Microsoft' },
  
  // Database
  { name: 'MongoDB Atlas', website: 'https://mongodb.com/atlas', description: 'Managed MongoDB service' },
  { name: 'InfluxDB', website: 'https://influxdata.com', description: 'Time series database' },
  { name: 'Neo4j', website: 'https://neo4j.com', description: 'Graph database platform' },
  { name: 'Redis', website: 'https://redis.io', description: 'In-memory data structure store' },
  
  // Streaming
  { name: 'Apache Kafka', website: 'https://kafka.apache.org', description: 'Distributed event streaming platform' },
  
  // Web Server
  { name: 'Nginx', website: 'https://nginx.org', description: 'Web server and reverse proxy' },
  
  // Tunneling
  { name: 'ngrok', website: 'https://ngrok.com', description: 'Secure introspectable tunnels' },
  
  // Torrent
  { name: 'uTorrent', website: 'https://utorrent.com', description: 'BitTorrent client' },
  
  // Download Manager
  { name: 'JDownloader', website: 'https://jdownloader.org', description: 'Download management tool' },
  
  // Maps
  { name: 'Google Maps', website: 'https://maps.google.com', description: 'Mapping service by Google' },
  { name: 'Apple Maps', website: 'https://apple.com/maps', description: 'Mapping service by Apple' },
  
  // QR Code
  { name: 'QR Code Generator', website: 'https://qr-code-generator.com', description: 'QR code generation service' },
  { name: 'Barcode Generator', website: 'https://barcode.tec-it.com', description: 'Barcode generation service' },
  
  // Feedback
  { name: 'Canny', website: 'https://canny.io', description: 'Feature request management' },
  { name: 'UserVoice', website: 'https://uservoice.com', description: 'Product feedback platform' },
  
  // Additional tools
  { name: 'Grammarly', website: 'https://grammarly.com', description: 'Writing assistant' },
  { name: 'LanguageTool', website: 'https://languagetool.org', description: 'Grammar and spell checker' },
  { name: 'Snagit', website: 'https://techsmith.com/snagit', description: 'Screen capture software' },
  
  // Browser
  { name: 'Google Chrome', website: 'https://google.com/chrome', description: 'Web browser by Google' },
  { name: 'Firefox', website: 'https://firefox.com', description: 'Web browser by Mozilla' },
  { name: 'Safari', website: 'https://apple.com/safari', description: 'Web browser by Apple' },
  { name: 'Microsoft Edge', website: 'https://microsoft.com/edge', description: 'Web browser by Microsoft' },
];

async function seedMissingProprietarySoftware() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🚀 Seeding missing proprietary software...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const software of missingProprietarySoftware) {
      try {
        const slug = createSlug(software.name);
        
        // Check if already exists
        const existing = await ProprietarySoftware.findOne({ 
          $or: [
            { slug },
            { name: { $regex: `^${software.name}$`, $options: 'i' } }
          ]
        });
        
        if (existing) {
          skippedCount++;
          continue;
        }
        
        await ProprietarySoftware.create({
          name: software.name,
          slug,
          description: software.description,
          website: software.website,
        });
        
        addedCount++;
        process.stdout.write(`\r   Added ${addedCount} proprietary software (${skippedCount} skipped)`);
      } catch (err: any) {
        if (err.code === 11000) {
          skippedCount++;
        } else {
          console.error(`\n   ❌ Error adding ${software.name}:`, err.message);
        }
      }
    }

    console.log(`\n✅ Seeded ${addedCount} proprietary software (${skippedCount} already existed)`);
    console.log('\n🎉 Done!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedMissingProprietarySoftware();
