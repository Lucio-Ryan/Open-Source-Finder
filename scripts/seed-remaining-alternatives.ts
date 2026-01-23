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
  // CRM & Sales
  { name: 'Attio', slug: 'attio', description: 'CRM platform with workflow automation', website: 'https://attio.com' },
  { name: 'Close', slug: 'close', description: 'Sales CRM for inside sales', website: 'https://close.com' },
  { name: 'Copper', slug: 'copper', description: 'CRM integrated with Google Workspace', website: 'https://copper.com' },
  { name: 'Freshsales', slug: 'freshsales', description: 'CRM software for sales teams', website: 'https://freshworks.com/freshsales-crm' },
  { name: 'Insightly', slug: 'insightly', description: 'CRM and project management', website: 'https://insightly.com' },
  { name: 'Keap', slug: 'keap', description: 'Sales and marketing automation CRM', website: 'https://keap.com' },
  
  // Customer Support
  { name: 'Freshdesk', slug: 'freshdesk', description: 'Cloud-based customer support', website: 'https://freshdesk.com' },
  { name: 'HelpScout', slug: 'helpscout', description: 'Customer service platform', website: 'https://helpscout.com' },
  { name: 'LiveChat', slug: 'livechat', description: 'Real-time chat support', website: 'https://livechat.com' },
  { name: 'Crisp', slug: 'crisp', description: 'Customer messaging platform', website: 'https://crisp.chat' },
  { name: 'Front', slug: 'front', description: 'Shared inbox and team email', website: 'https://front.com' },
  
  // Email Marketing
  { name: 'ConvertKit', slug: 'convertkit', description: 'Email marketing for creators', website: 'https://convertkit.com' },
  { name: 'MailerLite', slug: 'mailerlite', description: 'Email marketing platform', website: 'https://mailerlite.com' },
  { name: 'Moosend', slug: 'moosend', description: 'Email marketing and automation', website: 'https://moosend.com' },
  { name: 'Campaign Monitor', slug: 'campaign-monitor', description: 'Email marketing software', website: 'https://campaignmonitor.com' },
  { name: 'GetResponse', slug: 'getresponse', description: 'Email marketing service', website: 'https://getresponse.com' },
  { name: 'Drip', slug: 'drip', description: 'E-commerce marketing automation', website: 'https://drip.com' },
  { name: 'Buttondown', slug: 'buttondown', description: 'Simple newsletter service', website: 'https://buttondown.email' },
  { name: 'Beehiiv', slug: 'beehiiv', description: 'Newsletter publishing platform', website: 'https://beehiiv.com' },
  
  // Project Management
  { name: 'Monday', slug: 'monday', description: 'Work operating system', website: 'https://monday.com' },
  { name: 'Smartsheet', slug: 'smartsheet', description: 'Work management platform', website: 'https://smartsheet.com' },
  { name: 'Teamwork', slug: 'teamwork', description: 'Project management platform', website: 'https://teamwork.com' },
  { name: 'Height', slug: 'height', description: 'Collaborative workspace', website: 'https://height.com' },
  
  // Task Management
  { name: 'Todoist', slug: 'todoist', description: 'Task management app', website: 'https://todoist.com' },
  { name: 'TickTick', slug: 'ticktick', description: 'Task manager and to-do list', website: 'https://ticktick.com' },
  { name: 'Any.do', slug: 'anydo', description: 'Task list and planner', website: 'https://anydo.com' },
  { name: 'Things 3', slug: 'things-3', description: 'Task manager for Apple', website: 'https://culturedcode.com/things' },
  { name: 'OmniFocus', slug: 'omnifocus', description: 'Task management for Mac', website: 'https://omnigroup.com/omnifocus' },
  { name: 'Remember The Milk', slug: 'remember-the-milk', description: 'Task management', website: 'https://rememberthemilk.com' },
  
  // Time Tracking
  { name: 'RescueTime', slug: 'rescuetime', description: 'Automatic time tracking', website: 'https://rescuetime.com' },
  { name: 'DeskTime', slug: 'desktime', description: 'Time tracking and productivity', website: 'https://desktime.com' },
  { name: 'TimeCamp', slug: 'timecamp', description: 'Time tracking software', website: 'https://timecamp.com' },
  { name: 'WakaTime', slug: 'wakatime', description: 'Developer time tracking', website: 'https://wakatime.com' },
  
  // Website Builders
  { name: 'Weebly', slug: 'weebly', description: 'Website builder platform', website: 'https://weebly.com' },
  { name: 'Carrd', slug: 'carrd', description: 'One-page site builder', website: 'https://carrd.com' },
  { name: 'Jimdo', slug: 'jimdo', description: 'Website builder', website: 'https://jimdo.com' },
  { name: 'Pagecloud', slug: 'pagecloud', description: 'Drag-and-drop website builder', website: 'https://pagecloud.com' },
  
  // No-Code Platforms
  { name: 'Bubble', slug: 'bubble', description: 'No-code web app builder', website: 'https://bubble.io' },
  { name: 'Adalo', slug: 'adalo', description: 'No-code app builder', website: 'https://adalo.com' },
  { name: 'Glide', slug: 'glide', description: 'Apps from Google Sheets', website: 'https://glide.com' },
  { name: 'Softr', slug: 'softr', description: 'No-code platform with Airtable', website: 'https://softr.com' },
  { name: 'Thunkable', slug: 'thunkable', description: 'No-code app builder', website: 'https://thunkable.com' },
  { name: 'Appsheet', slug: 'appsheet', description: 'No-code app development', website: 'https://appsheet.com' },
  
  // Design Tools
  { name: 'Framer', slug: 'framer', description: 'Design and prototyping', website: 'https://framer.com' },
  { name: 'InVision', slug: 'invision', description: 'Collaborative design', website: 'https://invision.com' },
  { name: 'Zeplin', slug: 'zeplin', description: 'Design handoff tool', website: 'https://zeplin.io' },
  { name: 'Abstract', slug: 'abstract', description: 'Design version control', website: 'https://abstract.com' },
  { name: 'Avocode', slug: 'avocode', description: 'Design handoff tool', website: 'https://avocode.com' },
  
  // 3D & Animation
  { name: 'Cinema 4D', slug: 'cinema-4d', description: '3D modeling software', website: 'https://maxon.net/cinema-4d' },
  
  // Screen Recording
  { name: 'Bandicam', slug: 'bandicam', description: 'Screen recording software', website: 'https://bandicam.com' },
  { name: 'CleanShot', slug: 'cleanshot', description: 'Screen capture tool', website: 'https://cleanshot.com' },
  
  // Social Media Management
  { name: 'Iconosquare', slug: 'iconosquare', description: 'Social media analytics', website: 'https://iconosquare.com' },
  { name: 'SocialBee', slug: 'socialbee', description: 'Social media management', website: 'https://socialbee.com' },
  { name: 'SocialPilot', slug: 'socialpilot', description: 'Social media scheduling', website: 'https://socialpilot.com' },
  { name: 'Hypefury', slug: 'hypefury', description: 'Social media automation', website: 'https://hypefury.com' },
  { name: 'Typefully', slug: 'typefully', description: 'Twitter writing tool', website: 'https://typefully.com' },
  
  // Communities & Forums
  { name: 'Circle', slug: 'circle', description: 'Online community platform', website: 'https://circle.com' },
  { name: 'Mighty Networks', slug: 'mighty-networks', description: 'Community websites', website: 'https://mightynetworks.com' },
  { name: 'Skool', slug: 'skool', description: 'Community and courses', website: 'https://skool.com' },
  { name: 'Tribe', slug: 'tribe', description: 'Community platform', website: 'https://tribe.com' },
  { name: 'vBulletin', slug: 'vbulletin', description: 'Forum software', website: 'https://vbulletin.com' },
  
  // Scheduling
  { name: 'Acuity', slug: 'acuity', description: 'Appointment scheduling', website: 'https://acuityscheduling.com' },
  { name: 'Savvycal', slug: 'savvycal', description: 'Scheduling software', website: 'https://savvycal.com' },
  { name: 'Calendesk', slug: 'calendesk', description: 'Calendar management', website: 'https://calendesk.com' },
  
  // Video Conferencing
  { name: 'Google Meet', slug: 'google-meet', description: 'Video conferencing', website: 'https://meet.google.com' },
  
  // E-commerce
  { name: 'BigCommerce', slug: 'bigcommerce', description: 'E-commerce platform', website: 'https://bigcommerce.com' },
  { name: 'Gumroad', slug: 'gumroad', description: 'Selling digital products', website: 'https://gumroad.com' },
  { name: 'Sellfy', slug: 'sellfy', description: 'E-commerce for digital products', website: 'https://sellfy.com' },
  { name: 'FastSpring', slug: 'fastspring', description: 'E-commerce for software', website: 'https://fastspring.com' },
  { name: 'Lemon Squeezy', slug: 'lemon-squeezy', description: 'Digital commerce platform', website: 'https://lemonsqueezy.com' },
  
  // Online Courses
  { name: 'Kajabi', slug: 'kajabi', description: 'Online course platform', website: 'https://kajabi.com' },
  { name: 'Thinkific', slug: 'thinkific', description: 'Online course platform', website: 'https://thinkific.com' },
  { name: 'LearnWorlds', slug: 'learnworlds', description: 'Learning management system', website: 'https://learnworlds.com' },
  
  // Bookmarks & Reading
  { name: 'Raindrop', slug: 'raindrop', description: 'Bookmark manager', website: 'https://raindrop.io' },
  { name: 'Readwise', slug: 'readwise', description: 'Reading highlights manager', website: 'https://readwise.io' },
  { name: 'Pinboard', slug: 'pinboard', description: 'Social bookmarking', website: 'https://pinboard.in' },
  
  // Writing Apps
  { name: 'Ulysses', slug: 'ulysses', description: 'Writing app', website: 'https://ulysses.app' },
  { name: 'Bear', slug: 'bear', description: 'Writing app for Apple', website: 'https://bear.app' },
  { name: 'Scrivener', slug: 'scrivener', description: 'Writing software', website: 'https://literatureandlatte.com/scrivener' },
  
  // Knowledge Management
  { name: 'Nuclino', slug: 'nuclino', description: 'Collaborative wiki', website: 'https://nuclino.com' },
  { name: 'Craft', slug: 'craft', description: 'Document creation', website: 'https://craft.do' },
  { name: 'Coda', slug: 'coda', description: 'All-in-one doc', website: 'https://coda.io' },
  { name: 'Tana', slug: 'tana', description: 'Knowledge management', website: 'https://tana.inc' },
  { name: 'Glean', slug: 'glean', description: 'Knowledge management', website: 'https://glean.com' },
  
  // Password Managers
  { name: 'Keeper', slug: 'keeper', description: 'Password manager', website: 'https://keeper.com' },
  { name: 'Enpass', slug: 'enpass', description: 'Password manager', website: 'https://enpass.io' },
  
  // Document Signing
  { name: 'HelloSign', slug: 'hellosign', description: 'E-signature solution', website: 'https://hellosign.com' },
  { name: 'PandaDoc', slug: 'pandadoc', description: 'Document automation', website: 'https://pandadoc.com' },
  { name: 'DocSend', slug: 'docsend', description: 'Document sharing', website: 'https://docsend.com' },
  
  // Feedback & Surveys
  { name: 'Survicate', slug: 'survicate', description: 'Customer feedback', website: 'https://survicate.com' },
  { name: 'Nolt', slug: 'nolt', description: 'Feature voting', website: 'https://nolt.io' },
  { name: 'Upvoty', slug: 'upvoty', description: 'Feature request tracking', website: 'https://upvoty.com' },
  { name: 'Usersnap', slug: 'usersnap', description: 'Visual feedback', website: 'https://usersnap.com' },
  
  // Form Builders
  { name: 'Tally', slug: 'tally', description: 'Form builder', website: 'https://tally.so' },
  { name: 'Fillout', slug: 'fillout', description: 'Form builder', website: 'https://fillout.com' },
  
  // Analytics
  { name: 'Heap', slug: 'heap', description: 'Digital insights platform', website: 'https://heap.io' },
  { name: 'Kissmetrics', slug: 'kissmetrics', description: 'Behavioral analytics', website: 'https://kissmetrics.io' },
  { name: 'Databox', slug: 'databox', description: 'Business analytics', website: 'https://databox.com' },
  
  // Remote Desktop
  { name: 'Splashtop', slug: 'splashtop', description: 'Remote desktop', website: 'https://splashtop.com' },
  { name: 'Getscreen.me', slug: 'getscreenme', description: 'Remote desktop', website: 'https://getscreen.me' },
  
  // API Platforms
  { name: 'Apigee', slug: 'apigee', description: 'API management', website: 'https://cloud.google.com/apigee' },
  { name: 'Kong', slug: 'kong', description: 'API gateway', website: 'https://konghq.com' },
  { name: 'Hasura', slug: 'hasura', description: 'GraphQL engine', website: 'https://hasura.io' },
  
  // Integration Platforms
  { name: 'Tray.io', slug: 'tray-io', description: 'Automation platform', website: 'https://tray.io' },
  { name: 'Workato', slug: 'workato', description: 'Integration platform', website: 'https://workato.com' },
  { name: 'Pipedream', slug: 'pipedream', description: 'Integration platform', website: 'https://pipedream.com' },
  { name: 'Merge', slug: 'merge', description: 'API integration', website: 'https://merge.dev' },
  
  // AI Writing
  { name: 'Paragraph', slug: 'paragraph', description: 'AI writing assistant', website: 'https://paragraph.xyz' },
  { name: 'TypingMind', slug: 'typingmind', description: 'AI writing assistant', website: 'https://typingmind.com' },
  
  // Transcription
  { name: 'Fireflies', slug: 'fireflies', description: 'AI meeting transcription', website: 'https://fireflies.ai' },
  { name: 'tl;dv', slug: 'tldv', description: 'Meeting recording', website: 'https://tldv.io' },
  { name: 'AudioPen', slug: 'audiopen', description: 'Audio transcription', website: 'https://audiopen.ai' },
  
  // Uptime Monitoring
  { name: 'UptimeRobot', slug: 'uptimerobot', description: 'Website monitoring', website: 'https://uptimerobot.com' },
  { name: 'OhDear!', slug: 'ohdear', description: 'Uptime monitoring', website: 'https://ohdear.app' },
  { name: 'Pulsetic', slug: 'pulsetic', description: 'Uptime monitoring', website: 'https://pulsetic.com' },
  { name: 'BetterStack', slug: 'betterstack', description: 'Monitoring platform', website: 'https://betterstack.com' },
  
  // Incident Management
  { name: 'FireHydrant', slug: 'firehydrant', description: 'Incident management', website: 'https://firehydrant.io' },
  { name: 'Rootly', slug: 'rootly', description: 'Incident response', website: 'https://rootly.com' },
  { name: 'incident.io', slug: 'incidentio', description: 'Incident management', website: 'https://incident.io' },
  
  // Compliance
  { name: 'Vanta', slug: 'vanta', description: 'Security compliance', website: 'https://vanta.com' },
  { name: 'Drata', slug: 'drata', description: 'Security compliance', website: 'https://drata.com' },
  { name: 'Secureframe', slug: 'secureframe', description: 'Compliance automation', website: 'https://secureframe.com' },
  { name: 'Sprinto', slug: 'sprinto', description: 'Compliance management', website: 'https://sprinto.com' },
  
  // User Onboarding
  { name: 'Userflow', slug: 'userflow', description: 'User onboarding', website: 'https://userflow.com' },
  { name: 'Userlist', slug: 'userlist', description: 'Customer messaging', website: 'https://userlist.com' },
  
  // Notifications
  { name: 'Knock', slug: 'knock', description: 'Notifications infrastructure', website: 'https://knock.app' },
  { name: 'MagicBell', slug: 'magicbell', description: 'In-app notifications', website: 'https://magicbell.com' },
  { name: 'Courier', slug: 'courier', description: 'Notification delivery', website: 'https://courier.com' },
  
  // Billing & Payments
  { name: 'Chargebee', slug: 'chargebee', description: 'Subscription billing', website: 'https://chargebee.com' },
  { name: 'Recurly', slug: 'recurly', description: 'Subscription management', website: 'https://recurly.com' },
  { name: 'Paddle', slug: 'paddle', description: 'SaaS billing', website: 'https://paddle.com' },
  { name: 'Zuora', slug: 'zuora', description: 'Revenue management', website: 'https://zuora.com' },
  
  // HR & Payroll
  { name: 'Gusto', slug: 'gusto', description: 'Payroll and HR', website: 'https://gusto.com' },
  { name: 'Deel', slug: 'deel', description: 'Global payroll', website: 'https://deel.com' },
  { name: 'Remote', slug: 'remote', description: 'Global HR platform', website: 'https://remote.com' },
  
  // Log Management
  { name: 'Coralogix', slug: 'coralogix', description: 'Log analytics', website: 'https://coralogix.com' },
  { name: 'Logz.io', slug: 'logz-io', description: 'Observability platform', website: 'https://logz.io' },
  { name: 'Timber', slug: 'timber', description: 'Log management', website: 'https://timber.io' },
  
  // Chatbots
  { name: 'ChatBot', slug: 'chatbot', description: 'AI chatbot platform', website: 'https://chatbot.com' },
  { name: 'Landbot', slug: 'landbot', description: 'No-code chatbot', website: 'https://landbot.io' },
  { name: 'Manychat', slug: 'manychat', description: 'Messenger marketing', website: 'https://manychat.com' },
  
  // Browser Extensions
  { name: 'Momentum Dash', slug: 'momentum-dash', description: 'Productivity dashboard', website: 'https://momentumdash.com' },
  { name: 'Start.me', slug: 'start-me', description: 'Start page', website: 'https://start.me' },
];

// Large batch of alternatives
const newAlternatives = [
  // CRM - Alternatives to Attio, Close, Copper, Freshsales, etc.
  {
    name: 'Twenty',
    slug: 'twenty',
    short_description: 'Modern open-source CRM',
    description: 'Twenty is a modern, open-source CRM that offers a beautiful and intuitive interface. It provides contact management, deal tracking, and team collaboration features with full customization options.',
    website: 'https://twenty.com',
    github: 'https://github.com/twentyhq/twenty',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['attio', 'close', 'copper', 'freshsales', 'insightly', 'keap'],
    categoryKeywords: ['crm', 'sales', 'contacts', 'deals']
  },
  {
    name: 'EspoCRM',
    slug: 'espocrm',
    short_description: 'Web-based CRM application',
    description: 'EspoCRM is a web-based CRM application that allows you to see, enter, and evaluate all your company relationships. It features contact management, leads, opportunities, and calendar integration.',
    website: 'https://www.espocrm.com',
    github: 'https://github.com/espocrm/espocrm',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['attio', 'copper', 'freshsales', 'insightly'],
    categoryKeywords: ['crm', 'business', 'contacts', 'sales']
  },
  {
    name: 'Erxes',
    slug: 'erxes',
    short_description: 'Open-source experience operating system',
    description: 'Erxes is an open-source experience operating system (XOS) that enables businesses to attract and engage more customers. It combines CRM, marketing automation, and customer service features.',
    website: 'https://erxes.io',
    github: 'https://github.com/erxes/erxes',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['attio', 'freshsales', 'keap', 'close'],
    categoryKeywords: ['crm', 'marketing', 'customer service', 'automation']
  },

  // Customer Support - Alternatives to Freshdesk, HelpScout, LiveChat, Crisp
  {
    name: 'Chatwoot',
    slug: 'chatwoot',
    short_description: 'Open-source customer engagement suite',
    description: 'Chatwoot is an open-source customer engagement platform that helps businesses engage with customers across multiple channels. It supports live chat, email, social media, and WhatsApp integration.',
    website: 'https://www.chatwoot.com',
    github: 'https://github.com/chatwoot/chatwoot',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['freshdesk', 'helpscout', 'livechat', 'crisp', 'front'],
    categoryKeywords: ['customer support', 'live chat', 'helpdesk', 'omnichannel']
  },
  {
    name: 'Papercups',
    slug: 'papercups',
    short_description: 'Open-source live chat widget',
    description: 'Papercups is an open-source live chat widget built for developers. It provides real-time customer chat with Slack integration, customizable styling, and a simple API for embedding.',
    website: 'https://papercups.io',
    github: 'https://github.com/papercups-io/papercups',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['livechat', 'crisp'],
    categoryKeywords: ['live chat', 'customer support', 'widget', 'messaging']
  },
  {
    name: 'FreeScout',
    slug: 'freescout',
    short_description: 'Free self-hosted help desk',
    description: 'FreeScout is a free, self-hosted help desk and shared mailbox solution. It provides a modern interface with email integration, collision detection, and conversation management similar to HelpScout.',
    website: 'https://freescout.net',
    github: 'https://github.com/freescout-helpdesk/freescout',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['helpscout', 'freshdesk', 'front'],
    categoryKeywords: ['helpdesk', 'email', 'support', 'shared inbox']
  },
  {
    name: 'Zammad',
    slug: 'zammad',
    short_description: 'Web-based helpdesk solution',
    description: 'Zammad is a web-based, open-source helpdesk and issue tracking system. It supports email, chat, telephone, and social media communication with robust automation and reporting features.',
    website: 'https://zammad.org',
    github: 'https://github.com/zammad/zammad',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['freshdesk', 'helpscout'],
    categoryKeywords: ['helpdesk', 'ticketing', 'support', 'issue tracking']
  },

  // Email Marketing - Alternatives to ConvertKit, MailerLite, etc.
  {
    name: 'Listmonk',
    slug: 'listmonk',
    short_description: 'Self-hosted newsletter manager',
    description: 'Listmonk is a self-hosted, high-performance mailing list and newsletter manager. It features a modern admin dashboard, templating, analytics, and handles millions of subscribers efficiently.',
    website: 'https://listmonk.app',
    github: 'https://github.com/knadh/listmonk',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['convertkit', 'mailerlite', 'moosend', 'campaign-monitor', 'getresponse', 'drip', 'buttondown', 'beehiiv'],
    categoryKeywords: ['email marketing', 'newsletter', 'mailing list', 'campaigns']
  },
  {
    name: 'Mailtrain',
    slug: 'mailtrain',
    short_description: 'Self-hosted newsletter app',
    description: 'Mailtrain is a self-hosted newsletter application built on Node.js and MySQL. It supports custom fields, list segmentation, automation, and integrates with any SMTP server.',
    website: 'https://mailtrain.org',
    github: 'https://github.com/Mailtrain-org/mailtrain',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['convertkit', 'mailerlite', 'buttondown'],
    categoryKeywords: ['email marketing', 'newsletter', 'automation', 'smtp']
  },
  {
    name: 'Keila',
    slug: 'keila',
    short_description: 'Open-source email newsletter tool',
    description: 'Keila is an open-source alternative to Mailchimp built with Elixir. It provides a simple, reliable newsletter solution with contact management, template editor, and campaign analytics.',
    website: 'https://keila.io',
    github: 'https://github.com/pentacent/keila',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['convertkit', 'mailerlite', 'buttondown', 'beehiiv'],
    categoryKeywords: ['email marketing', 'newsletter', 'campaigns', 'elixir']
  },

  // Project Management - Alternatives to Monday, Smartsheet, etc.
  {
    name: 'Focalboard',
    slug: 'focalboard',
    short_description: 'Open-source project management',
    description: 'Focalboard is an open-source, self-hosted alternative to Trello, Notion, and Asana. It helps define, organize, track, and manage work across individuals and teams with kanban boards and tables.',
    website: 'https://www.focalboard.com',
    github: 'https://github.com/mattermost/focalboard',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['monday', 'smartsheet', 'teamwork', 'height'],
    categoryKeywords: ['project management', 'kanban', 'tasks', 'collaboration']
  },
  {
    name: 'Leantime',
    slug: 'leantime',
    short_description: 'Strategic project management',
    description: 'Leantime is an open-source project management system designed for non-project managers. It combines strategy, planning, and execution with Kanban boards, Gantt charts, and roadmaps.',
    website: 'https://leantime.io',
    github: 'https://github.com/Leantime/leantime',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['monday', 'smartsheet', 'teamwork'],
    categoryKeywords: ['project management', 'strategy', 'gantt', 'roadmap']
  },
  {
    name: 'Kanboard',
    slug: 'kanboard',
    short_description: 'Kanban project management software',
    description: 'Kanboard is a free and open-source Kanban project management software. It focuses on simplicity with a minimalist interface, task management, analytics, and multiple language support.',
    website: 'https://kanboard.org',
    github: 'https://github.com/kanboard/kanboard',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['monday', 'teamwork'],
    categoryKeywords: ['kanban', 'project management', 'tasks', 'minimalist']
  },

  // Task Management - Alternatives to Todoist, TickTick, etc.
  {
    name: 'Super Productivity',
    slug: 'super-productivity',
    short_description: 'To-do list and time tracker',
    description: 'Super Productivity is an open-source to-do list app with integrated time tracking. It features Jira/GitHub integration, pomodoro timer, break reminders, and works offline.',
    website: 'https://super-productivity.com',
    github: 'https://github.com/johannesjo/super-productivity',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['todoist', 'ticktick', 'anydo', 'things-3', 'omnifocus', 'remember-the-milk'],
    categoryKeywords: ['tasks', 'time tracking', 'pomodoro', 'productivity']
  },
  {
    name: 'Tasks.org',
    slug: 'tasks-org',
    short_description: 'Open-source task manager for Android',
    description: 'Tasks.org is an open-source to-do list and task manager for Android. It supports subtasks, recurring tasks, locations, and synchronizes with CalDAV, Google Tasks, and EteSync.',
    website: 'https://tasks.org',
    github: 'https://github.com/tasks/tasks',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['todoist', 'ticktick', 'anydo', 'remember-the-milk'],
    categoryKeywords: ['tasks', 'android', 'todo', 'caldav']
  },
  {
    name: 'Vikunja',
    slug: 'vikunja',
    short_description: 'Open-source to-do app',
    description: 'Vikunja is an open-source, self-hostable to-do app. It provides list and Kanban views, reminders, due dates, priorities, labels, and supports sharing lists with teams.',
    website: 'https://vikunja.io',
    github: 'https://github.com/go-vikunja/vikunja',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['todoist', 'ticktick', 'anydo', 'things-3'],
    categoryKeywords: ['tasks', 'kanban', 'lists', 'self-hosted']
  },
  {
    name: 'Planka',
    slug: 'planka',
    short_description: 'Kanban board for workgroups',
    description: 'Planka is a realtime kanban board for workgroups built with React and Redux. It provides boards, lists, cards, labels, tasks, attachments, and user management.',
    website: 'https://planka.app',
    github: 'https://github.com/plankanban/planka',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['monday', 'teamwork'],
    categoryKeywords: ['kanban', 'boards', 'tasks', 'collaboration']
  },

  // Time Tracking - Alternatives to RescueTime, DeskTime, etc.
  {
    name: 'ActivityWatch',
    slug: 'activitywatch',
    short_description: 'Automatic time tracker',
    description: 'ActivityWatch is an app that automatically tracks how you spend time on your devices. It is open source, privacy-focused, and works across Windows, macOS, Linux, and Android.',
    website: 'https://activitywatch.net',
    github: 'https://github.com/ActivityWatch/activitywatch',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['rescuetime', 'desktime', 'timecamp', 'wakatime'],
    categoryKeywords: ['time tracking', 'productivity', 'privacy', 'automatic']
  },
  {
    name: 'Traggo',
    slug: 'traggo',
    short_description: 'Tag-based time tracking',
    description: 'Traggo is a tag-based time tracking tool. It provides a unique approach where you add tags to time entries instead of projects, allowing flexible categorization and reporting.',
    website: 'https://traggo.net',
    github: 'https://github.com/traggo/server',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['rescuetime', 'timecamp'],
    categoryKeywords: ['time tracking', 'tags', 'reports', 'self-hosted']
  },
  {
    name: 'Kimai',
    slug: 'kimai',
    short_description: 'Open-source time tracker',
    description: 'Kimai is a free and open-source time-tracking application. It features project management, customer tracking, invoicing, and exports with a modern web interface.',
    website: 'https://www.kimai.org',
    github: 'https://github.com/kimai/kimai',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['desktime', 'timecamp'],
    categoryKeywords: ['time tracking', 'invoicing', 'projects', 'business']
  },

  // Website Builders - Alternatives to Weebly, Carrd, Jimdo
  {
    name: 'Publii',
    slug: 'publii',
    short_description: 'Static CMS for privacy-focused blogs',
    description: 'Publii is a desktop-based CMS for generating static HTML websites. It provides a privacy-focused blogging platform with SEO tools, multiple themes, and one-click deployment.',
    website: 'https://getpublii.com',
    github: 'https://github.com/GetPublii/Publii',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['weebly', 'carrd', 'jimdo', 'pagecloud'],
    categoryKeywords: ['static site', 'cms', 'blog', 'privacy']
  },
  {
    name: 'Eleventy',
    slug: 'eleventy',
    short_description: 'Simpler static site generator',
    description: 'Eleventy (11ty) is a simpler static site generator. It is zero-config by default, supports multiple template languages, and is highly flexible for building fast, modern websites.',
    website: 'https://www.11ty.dev',
    github: 'https://github.com/11ty/eleventy',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['weebly', 'carrd'],
    categoryKeywords: ['static site', 'generator', 'templates', 'javascript']
  },

  // No-Code Platforms - Alternatives to Bubble, Adalo, Glide, etc.
  {
    name: 'Budibase',
    slug: 'budibase',
    short_description: 'Low-code platform for internal tools',
    description: 'Budibase is an open-source low-code platform for creating internal tools, admin panels, and workflows. It connects to various data sources and provides drag-and-drop building.',
    website: 'https://budibase.com',
    github: 'https://github.com/Budibase/budibase',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['bubble', 'adalo', 'glide', 'softr', 'appsheet'],
    categoryKeywords: ['low-code', 'internal tools', 'no-code', 'automation']
  },
  {
    name: 'AppFlowy',
    slug: 'appflowy',
    short_description: 'Open-source Notion alternative',
    description: 'AppFlowy is an open-source alternative to Notion. It provides notes, wikis, projects, and databases with complete data control, offline support, and cross-platform availability.',
    website: 'https://appflowy.io',
    github: 'https://github.com/AppFlowy-IO/AppFlowy',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['coda', 'nuclino', 'craft'],
    categoryKeywords: ['notes', 'wiki', 'database', 'productivity']
  },
  {
    name: 'Baserow',
    slug: 'baserow',
    short_description: 'Open-source Airtable alternative',
    description: 'Baserow is an open-source no-code database tool and Airtable alternative. It provides spreadsheet-like interfaces, forms, APIs, and plugins for building applications without code.',
    website: 'https://baserow.io',
    github: 'https://github.com/bram2w/baserow',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['softr', 'glide'],
    categoryKeywords: ['database', 'no-code', 'spreadsheet', 'airtable']
  },
  {
    name: 'NocoDB',
    slug: 'nocodb',
    short_description: 'Open-source Airtable alternative',
    description: 'NocoDB turns any database into a smart spreadsheet. It provides views, forms, API access, and automation while connecting to MySQL, PostgreSQL, SQL Server, SQLite, or MariaDB.',
    website: 'https://nocodb.com',
    github: 'https://github.com/nocodb/nocodb',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['softr', 'glide', 'coda'],
    categoryKeywords: ['database', 'no-code', 'spreadsheet', 'automation']
  },

  // Design Tools - Alternatives to Framer, InVision, Zeplin, etc.
  {
    name: 'Penpot',
    slug: 'penpot',
    short_description: 'Open-source design platform',
    description: 'Penpot is the first open-source design and prototyping platform for design and code collaboration. It is web-based, works with open standards, and is free forever.',
    website: 'https://penpot.app',
    github: 'https://github.com/penpot/penpot',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['framer', 'invision', 'zeplin', 'abstract', 'avocode'],
    categoryKeywords: ['design', 'prototyping', 'collaboration', 'ui/ux']
  },

  // 3D & Animation - Alternatives to Cinema 4D
  {
    name: 'Blender',
    slug: 'blender',
    short_description: 'Free 3D creation suite',
    description: 'Blender is the free and open-source 3D creation suite supporting modeling, rigging, animation, simulation, rendering, compositing, motion tracking, and video editing.',
    website: 'https://www.blender.org',
    github: 'https://github.com/blender/blender',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['cinema-4d'],
    categoryKeywords: ['3d', 'animation', 'modeling', 'rendering']
  },

  // Screen Recording - Alternatives to Bandicam, CleanShot
  {
    name: 'OBS Studio',
    slug: 'obs-studio',
    short_description: 'Free streaming and recording',
    description: 'OBS Studio is free and open-source software for video recording and live streaming. It provides high-performance real-time capture, scene composition, encoding, and streaming.',
    website: 'https://obsproject.com',
    github: 'https://github.com/obsproject/obs-studio',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['bandicam', 'cleanshot'],
    categoryKeywords: ['screen recording', 'streaming', 'video', 'broadcasting']
  },
  {
    name: 'ShareX',
    slug: 'sharex',
    short_description: 'Screen capture and sharing tool',
    description: 'ShareX is a free and open-source screen capture, file sharing, and productivity tool. It supports screen capture, screen recording, file sharing, and over 80 destinations.',
    website: 'https://getsharex.com',
    github: 'https://github.com/ShareX/ShareX',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['bandicam', 'cleanshot'],
    categoryKeywords: ['screenshot', 'screen recording', 'sharing', 'productivity']
  },
  {
    name: 'Flameshot',
    slug: 'flameshot',
    short_description: 'Powerful screenshot software',
    description: 'Flameshot is a powerful yet simple to use screenshot software. It provides a fully customizable appearance, in-app screenshot editing, and various export options.',
    website: 'https://flameshot.org',
    github: 'https://github.com/flameshot-org/flameshot',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['cleanshot'],
    categoryKeywords: ['screenshot', 'annotation', 'editing', 'linux']
  },

  // Social Media Management - Alternatives to Iconosquare, SocialBee, etc.
  {
    name: 'Mixpost',
    slug: 'mixpost',
    short_description: 'Self-hosted social media management',
    description: 'Mixpost is a self-hosted social media management tool. It allows scheduling posts, analyzing performance, and managing multiple social media accounts from one dashboard.',
    website: 'https://mixpost.app',
    github: 'https://github.com/inovector/mixpost',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['iconosquare', 'socialbee', 'socialpilot', 'hypefury', 'typefully'],
    categoryKeywords: ['social media', 'scheduling', 'analytics', 'management']
  },

  // Communities & Forums - Alternatives to Circle, Mighty Networks, etc.
  {
    name: 'Discourse',
    slug: 'discourse',
    short_description: 'Civilized discussion platform',
    description: 'Discourse is an open-source discussion platform built for the next decade of the Internet. It provides real-time chat, mailing list mode, moderation tools, and extensive customization.',
    website: 'https://www.discourse.org',
    github: 'https://github.com/discourse/discourse',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['circle', 'mighty-networks', 'skool', 'tribe', 'vbulletin'],
    categoryKeywords: ['forum', 'community', 'discussion', 'moderation']
  },
  {
    name: 'Forem',
    slug: 'forem',
    short_description: 'Open-source community platform',
    description: 'Forem is open-source software for building inclusive communities. It powers DEV.to and provides articles, discussions, listings, and customizable community features.',
    website: 'https://forem.com',
    github: 'https://github.com/forem/forem',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['circle', 'mighty-networks', 'tribe'],
    categoryKeywords: ['community', 'social', 'blogging', 'developers']
  },
  {
    name: 'NodeBB',
    slug: 'nodebb',
    short_description: 'Modern forum software',
    description: 'NodeBB is a next-generation forum software built with Node.js. It provides real-time streaming discussions, social features, and native mobile responsiveness.',
    website: 'https://nodebb.org',
    github: 'https://github.com/NodeBB/NodeBB',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['circle', 'vbulletin', 'tribe'],
    categoryKeywords: ['forum', 'community', 'nodejs', 'real-time']
  },

  // Scheduling - Alternatives to Acuity, Savvycal, etc.
  {
    name: 'Cal.com',
    slug: 'cal-com',
    short_description: 'Open-source scheduling infrastructure',
    description: 'Cal.com is the open-source Calendly alternative. It provides scheduling infrastructure that is incredibly easy to use, highly customizable, and can be self-hosted.',
    website: 'https://cal.com',
    github: 'https://github.com/calcom/cal.com',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['acuity', 'savvycal', 'calendesk'],
    categoryKeywords: ['scheduling', 'calendar', 'booking', 'meetings']
  },

  // Video Conferencing - Alternatives to Google Meet
  {
    name: 'Jitsi Meet',
    slug: 'jitsi-meet',
    short_description: 'Secure video conferencing',
    description: 'Jitsi Meet is an open-source video conferencing solution that you can use all day, every day, for free. It requires no account and works right in your browser.',
    website: 'https://meet.jit.si',
    github: 'https://github.com/jitsi/jitsi-meet',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['google-meet'],
    categoryKeywords: ['video conferencing', 'meetings', 'webrtc', 'collaboration']
  },
  {
    name: 'BigBlueButton',
    slug: 'bigbluebutton',
    short_description: 'Web conferencing for online learning',
    description: 'BigBlueButton is an open-source web conferencing system designed for online learning. It provides real-time sharing of slides, audio, video, chat, and whiteboard.',
    website: 'https://bigbluebutton.org',
    github: 'https://github.com/bigbluebutton/bigbluebutton',
    license: 'LGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-meet'],
    categoryKeywords: ['video conferencing', 'education', 'webinar', 'learning']
  },

  // E-commerce - Alternatives to BigCommerce, Gumroad, etc.
  {
    name: 'Medusa',
    slug: 'medusa',
    short_description: 'Open-source headless commerce',
    description: 'Medusa is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences. It provides customizable modules for any e-commerce use case.',
    website: 'https://medusajs.com',
    github: 'https://github.com/medusajs/medusa',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['bigcommerce', 'gumroad', 'fastspring', 'lemon-squeezy'],
    categoryKeywords: ['e-commerce', 'headless', 'commerce', 'storefront']
  },
  {
    name: 'Saleor',
    slug: 'saleor',
    short_description: 'High-performance e-commerce',
    description: 'Saleor is a high-performance, composable, headless commerce API. It enables rapid digital commerce experiences with GraphQL API and modern technology stack.',
    website: 'https://saleor.io',
    github: 'https://github.com/saleor/saleor',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['bigcommerce', 'fastspring'],
    categoryKeywords: ['e-commerce', 'graphql', 'headless', 'commerce']
  },

  // Online Courses - Alternatives to Kajabi, Thinkific, etc.
  {
    name: 'Open edX',
    slug: 'open-edx',
    short_description: 'Open-source learning platform',
    description: 'Open edX is the open-source platform behind edX.org. It provides a scalable learning management system with courses, certificates, and learner engagement tools.',
    website: 'https://openedx.org',
    github: 'https://github.com/openedx/edx-platform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['kajabi', 'thinkific', 'learnworlds'],
    categoryKeywords: ['lms', 'education', 'courses', 'mooc']
  },
  {
    name: 'Canvas LMS',
    slug: 'canvas-lms',
    short_description: 'Modern learning management system',
    description: 'Canvas LMS is a modern, open-source learning management system. It provides course management, assessments, gradebook, and communication tools for educators.',
    website: 'https://www.instructure.com/canvas',
    github: 'https://github.com/instructure/canvas-lms',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['kajabi', 'thinkific', 'learnworlds'],
    categoryKeywords: ['lms', 'education', 'courses', 'assessments']
  },

  // Bookmarks & Reading - Alternatives to Raindrop, Readwise, etc.
  {
    name: 'Linkwarden',
    slug: 'linkwarden',
    short_description: 'Self-hosted bookmark manager',
    description: 'Linkwarden is a self-hosted, open-source collaborative bookmark manager to collect, organize, and preserve webpages. It includes tags, collections, and full-text search.',
    website: 'https://linkwarden.app',
    github: 'https://github.com/linkwarden/linkwarden',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['raindrop', 'pinboard'],
    categoryKeywords: ['bookmarks', 'links', 'archive', 'organization']
  },
  {
    name: 'Shiori',
    slug: 'shiori',
    short_description: 'Simple bookmark manager',
    description: 'Shiori is a simple bookmark manager built with Go. It provides a clean web UI, CLI interface, full-text search, and can import bookmarks from various sources.',
    website: 'https://github.com/go-shiori/shiori',
    github: 'https://github.com/go-shiori/shiori',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['raindrop', 'pinboard'],
    categoryKeywords: ['bookmarks', 'go', 'simple', 'self-hosted']
  },
  {
    name: 'Wallabag',
    slug: 'wallabag',
    short_description: 'Self-hosted read-it-later app',
    description: 'Wallabag is a self-hostable application for saving web pages. It provides a clean reading experience, tagging, full-text search, and export to various formats.',
    website: 'https://wallabag.org',
    github: 'https://github.com/wallabag/wallabag',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['readwise', 'pinboard'],
    categoryKeywords: ['read later', 'bookmarks', 'articles', 'archive']
  },

  // Writing Apps - Alternatives to Ulysses, Bear, Scrivener
  {
    name: 'Zettlr',
    slug: 'zettlr',
    short_description: 'Markdown editor for researchers',
    description: 'Zettlr is a supercharged markdown editor for researchers and academics. It provides Zettelkasten system support, citations, and exports to various academic formats.',
    website: 'https://www.zettlr.com',
    github: 'https://github.com/Zettlr/Zettlr',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['ulysses', 'bear', 'scrivener'],
    categoryKeywords: ['writing', 'markdown', 'research', 'zettelkasten']
  },
  {
    name: 'Ghostwriter',
    slug: 'ghostwriter',
    short_description: 'Distraction-free Markdown editor',
    description: 'Ghostwriter is a distraction-free Markdown editor for Linux and Windows. It provides focus mode, live HTML preview, and a clean interface for writing.',
    website: 'https://ghostwriter.kde.org',
    github: 'https://github.com/KDE/ghostwriter',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['ulysses', 'bear'],
    categoryKeywords: ['writing', 'markdown', 'distraction-free', 'editor']
  },
  {
    name: 'Manuskript',
    slug: 'manuskript',
    short_description: 'Open-source tool for writers',
    description: 'Manuskript is an open-source tool for writers providing a snowflake method outliner, distraction-free editor, and project management for novels and stories.',
    website: 'https://www.theologeek.ch/manuskript',
    github: 'https://github.com/olivierkes/manuskript',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['scrivener'],
    categoryKeywords: ['writing', 'novel', 'outliner', 'creative']
  },

  // Password Managers - Alternatives to Keeper, Enpass
  {
    name: 'Bitwarden',
    slug: 'bitwarden',
    short_description: 'Open-source password manager',
    description: 'Bitwarden is an open-source password management solution for individuals, teams, and business organizations. It provides secure password storage, sharing, and multi-platform access.',
    website: 'https://bitwarden.com',
    github: 'https://github.com/bitwarden/server',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['keeper', 'enpass'],
    categoryKeywords: ['password manager', 'security', 'encryption', 'vault']
  },
  {
    name: 'Vaultwarden',
    slug: 'vaultwarden',
    short_description: 'Lightweight Bitwarden server',
    description: 'Vaultwarden is an unofficial Bitwarden-compatible server written in Rust. It is lightweight, can run on resource-limited hardware, and is fully compatible with Bitwarden clients.',
    website: 'https://github.com/dani-garcia/vaultwarden',
    github: 'https://github.com/dani-garcia/vaultwarden',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['keeper', 'enpass'],
    categoryKeywords: ['password manager', 'rust', 'lightweight', 'self-hosted']
  },
  {
    name: 'KeePassXC',
    slug: 'keepassxc',
    short_description: 'Cross-platform password manager',
    description: 'KeePassXC is a cross-platform community fork of KeePassX. It provides offline password management with strong encryption, browser integration, and YubiKey support.',
    website: 'https://keepassxc.org',
    github: 'https://github.com/keepassxreboot/keepassxc',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['keeper', 'enpass'],
    categoryKeywords: ['password manager', 'offline', 'encryption', 'yubikey']
  },

  // Document Signing - Alternatives to HelloSign, PandaDoc, DocSend
  {
    name: 'Docuseal',
    slug: 'docuseal',
    short_description: 'Open-source document signing',
    description: 'Docuseal is an open-source document filling and signing solution. It provides form creation, e-signatures, templates, and API access for document automation.',
    website: 'https://www.docuseal.co',
    github: 'https://github.com/docusealco/docuseal',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['hellosign', 'pandadoc', 'docsend'],
    categoryKeywords: ['document signing', 'e-signature', 'forms', 'pdf']
  },

  // Feedback & Surveys - Alternatives to Survicate, Nolt, etc.
  {
    name: 'Formbricks',
    slug: 'formbricks',
    short_description: 'Open-source survey platform',
    description: 'Formbricks is an open-source survey platform that helps collect user feedback at every stage. It provides in-app surveys, link surveys, and website surveys with privacy compliance.',
    website: 'https://formbricks.com',
    github: 'https://github.com/formbricks/formbricks',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['survicate', 'nolt', 'upvoty', 'usersnap'],
    categoryKeywords: ['surveys', 'feedback', 'forms', 'analytics']
  },
  {
    name: 'Fider',
    slug: 'fider',
    short_description: 'Open-source feedback tool',
    description: 'Fider is an open-source feedback portal that helps teams collect and prioritize customer feedback. It provides voting, comments, and roadmap features.',
    website: 'https://fider.io',
    github: 'https://github.com/getfider/fider',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['nolt', 'upvoty'],
    categoryKeywords: ['feedback', 'voting', 'roadmap', 'community']
  },

  // Form Builders - Alternatives to Tally, Fillout
  {
    name: 'Heyform',
    slug: 'heyform',
    short_description: 'Open-source form builder',
    description: 'HeyForm is an open-source form builder that allows anyone to create engaging conversational forms. It provides various question types, logic, and integrations.',
    website: 'https://heyform.net',
    github: 'https://github.com/heyform/heyform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['tally', 'fillout'],
    categoryKeywords: ['forms', 'surveys', 'conversational', 'no-code']
  },
  {
    name: 'Ohmyform',
    slug: 'ohmyform',
    short_description: 'Open-source form creation',
    description: 'OhMyForm is a free, open-source, self-hosted form creation platform. It provides drag-and-drop form building, analytics, and can be easily deployed with Docker.',
    website: 'https://ohmyform.com',
    github: 'https://github.com/ohmyform/ohmyform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['tally', 'fillout'],
    categoryKeywords: ['forms', 'surveys', 'self-hosted', 'drag-and-drop']
  },

  // Analytics - Alternatives to Heap, Kissmetrics, etc.
  {
    name: 'PostHog',
    slug: 'posthog',
    short_description: 'Open-source product analytics',
    description: 'PostHog is the open-source product analytics platform. It provides event tracking, funnels, user paths, feature flags, session recording, and A/B testing in one platform.',
    website: 'https://posthog.com',
    github: 'https://github.com/PostHog/posthog',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['heap', 'kissmetrics', 'databox'],
    categoryKeywords: ['analytics', 'product', 'tracking', 'feature flags']
  },
  {
    name: 'Umami',
    slug: 'umami',
    short_description: 'Simple, privacy-focused analytics',
    description: 'Umami is a simple, fast, privacy-focused alternative to Google Analytics. It provides website analytics without collecting personal data and can be self-hosted.',
    website: 'https://umami.is',
    github: 'https://github.com/umami-software/umami',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['heap'],
    categoryKeywords: ['analytics', 'privacy', 'website', 'simple']
  },

  // Remote Desktop - Alternatives to Splashtop, Getscreen.me
  {
    name: 'RustDesk',
    slug: 'rustdesk',
    short_description: 'Open-source remote desktop',
    description: 'RustDesk is an open-source remote desktop software written in Rust. It provides out-of-the-box cross-platform support with no configuration required and self-hosting option.',
    website: 'https://rustdesk.com',
    github: 'https://github.com/rustdesk/rustdesk',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['splashtop', 'getscreenme'],
    categoryKeywords: ['remote desktop', 'rust', 'self-hosted', 'cross-platform']
  },
  {
    name: 'Apache Guacamole',
    slug: 'apache-guacamole',
    short_description: 'Clientless remote desktop gateway',
    description: 'Apache Guacamole is a clientless remote desktop gateway supporting VNC, RDP, and SSH. It works in web browsers without plugins and provides centralized access management.',
    website: 'https://guacamole.apache.org',
    github: 'https://github.com/apache/guacamole-server',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['splashtop', 'getscreenme'],
    categoryKeywords: ['remote desktop', 'gateway', 'web', 'vnc']
  },

  // API Platforms - Alternatives to Apigee, Kong, Hasura
  {
    name: 'Tyk',
    slug: 'tyk',
    short_description: 'Open-source API gateway',
    description: 'Tyk is an open-source API gateway that is fast, scalable, and modern. It provides API management, developer portal, and analytics with support for REST and GraphQL.',
    website: 'https://tyk.io',
    github: 'https://github.com/TykTechnologies/tyk',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['apigee', 'kong'],
    categoryKeywords: ['api gateway', 'management', 'graphql', 'rest']
  },
  {
    name: 'KrakenD',
    slug: 'krakend',
    short_description: 'High-performance API gateway',
    description: 'KrakenD is an ultra-high performance API gateway that aggregates multiple endpoints. It provides transformations, validations, and rate limiting with stateless design.',
    website: 'https://www.krakend.io',
    github: 'https://github.com/krakendio/krakend-ce',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['apigee', 'kong'],
    categoryKeywords: ['api gateway', 'performance', 'aggregation', 'microservices']
  },
  {
    name: 'Postgraphile',
    slug: 'postgraphile',
    short_description: 'Instant GraphQL for PostgreSQL',
    description: 'PostGraphile automatically generates a powerful GraphQL API from PostgreSQL database schema. It provides real-time subscriptions and highly performant queries.',
    website: 'https://www.graphile.org/postgraphile',
    github: 'https://github.com/graphile/crystal',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['hasura'],
    categoryKeywords: ['graphql', 'postgresql', 'api', 'real-time']
  },

  // Integration Platforms - Alternatives to Tray.io, Workato, etc.
  {
    name: 'n8n',
    slug: 'n8n',
    short_description: 'Workflow automation tool',
    description: 'n8n is a free and open-source workflow automation tool. It allows connecting different services with a fair-code model, providing self-hosting and extensibility.',
    website: 'https://n8n.io',
    github: 'https://github.com/n8n-io/n8n',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['tray-io', 'workato', 'pipedream', 'merge'],
    categoryKeywords: ['automation', 'workflow', 'integration', 'no-code']
  },
  {
    name: 'Windmill',
    slug: 'windmill',
    short_description: 'Developer platform for scripts',
    description: 'Windmill is an open-source developer platform to turn scripts into workflows and UIs. It provides low-code builder, jobs orchestration, and self-hosting.',
    website: 'https://www.windmill.dev',
    github: 'https://github.com/windmill-labs/windmill',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['tray-io', 'workato', 'pipedream'],
    categoryKeywords: ['automation', 'scripts', 'workflows', 'developer']
  },

  // AI Writing - Alternatives to Paragraph, TypingMind
  {
    name: 'LibreChat',
    slug: 'librechat',
    short_description: 'Open-source AI chat interface',
    description: 'LibreChat is an open-source chat UI for AI models. It supports multiple AI providers, presets, conversation branching, and can be self-hosted for privacy.',
    website: 'https://librechat.ai',
    github: 'https://github.com/danny-avila/LibreChat',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['paragraph', 'typingmind'],
    categoryKeywords: ['ai', 'chat', 'llm', 'interface']
  },
  {
    name: 'Open WebUI',
    slug: 'open-webui',
    short_description: 'User-friendly LLM interface',
    description: 'Open WebUI is an extensible, feature-rich, and user-friendly self-hosted WebUI designed to operate entirely offline. It supports various LLM runners including Ollama.',
    website: 'https://openwebui.com',
    github: 'https://github.com/open-webui/open-webui',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['paragraph', 'typingmind'],
    categoryKeywords: ['ai', 'chat', 'llm', 'offline']
  },

  // Transcription - Alternatives to Fireflies, tl;dv, AudioPen
  {
    name: 'Whisper',
    slug: 'whisper',
    short_description: 'General-purpose speech recognition',
    description: 'Whisper is OpenAI\'s general-purpose speech recognition model. It provides accurate transcription in multiple languages and can be run locally for privacy.',
    website: 'https://openai.com/research/whisper',
    github: 'https://github.com/openai/whisper',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['fireflies', 'tldv', 'audiopen'],
    categoryKeywords: ['transcription', 'speech', 'ai', 'multilingual']
  },
  {
    name: 'Whisper.cpp',
    slug: 'whisper-cpp',
    short_description: 'Efficient Whisper implementation',
    description: 'Whisper.cpp is a port of OpenAI\'s Whisper model in C/C++. It provides efficient inference on CPUs without GPU requirements, ideal for local transcription.',
    website: 'https://github.com/ggerganov/whisper.cpp',
    github: 'https://github.com/ggerganov/whisper.cpp',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['fireflies', 'tldv', 'audiopen'],
    categoryKeywords: ['transcription', 'speech', 'efficient', 'local']
  },

  // Uptime Monitoring - Alternatives to UptimeRobot, OhDear!, etc.
  {
    name: 'Uptime Kuma',
    slug: 'uptime-kuma',
    short_description: 'Self-hosted monitoring tool',
    description: 'Uptime Kuma is an easy-to-use self-hosted monitoring tool. It provides a beautiful dashboard, notification alerts, and supports HTTP, TCP, DNS, and more protocols.',
    website: 'https://uptime.kuma.pet',
    github: 'https://github.com/louislam/uptime-kuma',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['uptimerobot', 'ohdear', 'pulsetic', 'betterstack'],
    categoryKeywords: ['monitoring', 'uptime', 'alerts', 'self-hosted']
  },
  {
    name: 'Gatus',
    slug: 'gatus',
    short_description: 'Automated service health dashboard',
    description: 'Gatus is an automated service health dashboard. It evaluates health of services using configurable conditions and provides alerting through various providers.',
    website: 'https://gatus.io',
    github: 'https://github.com/TwiN/gatus',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['uptimerobot', 'betterstack'],
    categoryKeywords: ['monitoring', 'health', 'dashboard', 'alerts']
  },

  // Incident Management - Alternatives to FireHydrant, Rootly, incident.io
  {
    name: 'Grafana OnCall',
    slug: 'grafana-oncall',
    short_description: 'Open-source incident response',
    description: 'Grafana OnCall is an open-source incident response tool. It provides on-call scheduling, escalation policies, and integrations with monitoring tools.',
    website: 'https://grafana.com/products/oncall',
    github: 'https://github.com/grafana/oncall',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['firehydrant', 'rootly', 'incidentio'],
    categoryKeywords: ['incident management', 'on-call', 'alerting', 'response']
  },

  // Compliance - Alternatives to Vanta, Drata, Secureframe
  {
    name: 'Eramba',
    slug: 'eramba',
    short_description: 'Open-source GRC platform',
    description: 'Eramba is an open-source governance, risk, and compliance (GRC) platform. It helps organizations manage compliance, risks, and security policies.',
    website: 'https://eramba.org',
    github: 'https://github.com/eramba/eramba',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['vanta', 'drata', 'secureframe', 'sprinto'],
    categoryKeywords: ['compliance', 'grc', 'risk', 'security']
  },

  // User Onboarding - Alternatives to Userflow, Userlist
  {
    name: 'Introjs',
    slug: 'introjs',
    short_description: 'User onboarding library',
    description: 'Intro.js is a lightweight library for creating step-by-step product tours. It provides highlighted elements, customizable tooltips, and keyboard navigation.',
    website: 'https://introjs.com',
    github: 'https://github.com/usablica/intro.js',
    license: 'AGPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['userflow', 'userlist'],
    categoryKeywords: ['onboarding', 'tour', 'tooltips', 'ux']
  },

  // Notifications - Alternatives to Knock, MagicBell, Courier
  {
    name: 'Novu',
    slug: 'novu',
    short_description: 'Open-source notification infrastructure',
    description: 'Novu is the open-source notification infrastructure. It provides unified API for push, email, SMS, in-app, and chat notifications with workflow management.',
    website: 'https://novu.co',
    github: 'https://github.com/novuhq/novu',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['knock', 'magicbell', 'courier'],
    categoryKeywords: ['notifications', 'push', 'email', 'infrastructure']
  },

  // Billing & Payments - Alternatives to Chargebee, Recurly, etc.
  {
    name: 'Kill Bill',
    slug: 'kill-bill',
    short_description: 'Open-source billing platform',
    description: 'Kill Bill is an open-source subscription billing and payments platform. It provides subscription management, invoicing, and payment gateway integrations.',
    website: 'https://killbill.io',
    github: 'https://github.com/killbill/killbill',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['chargebee', 'recurly', 'paddle', 'zuora'],
    categoryKeywords: ['billing', 'subscriptions', 'payments', 'invoicing']
  },
  {
    name: 'Lago',
    slug: 'lago',
    short_description: 'Open-source metering and billing',
    description: 'Lago is an open-source metering and usage-based billing platform. It provides usage tracking, pricing plans, invoicing, and integrates with payment providers.',
    website: 'https://www.getlago.com',
    github: 'https://github.com/getlago/lago',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['chargebee', 'recurly', 'zuora'],
    categoryKeywords: ['billing', 'metering', 'usage-based', 'invoicing']
  },

  // HR & Payroll - Alternatives to Gusto, Deel, Remote
  {
    name: 'OrangeHRM',
    slug: 'orangehrm',
    short_description: 'Open-source HRM solution',
    description: 'OrangeHRM is an open-source human resource management system. It provides employee management, leave tracking, time and attendance, and recruitment modules.',
    website: 'https://www.orangehrm.com',
    github: 'https://github.com/orangehrm/orangehrm',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['gusto', 'deel', 'remote'],
    categoryKeywords: ['hr', 'hrm', 'employee', 'management']
  },

  // Log Management - Alternatives to Coralogix, Logz.io, Timber
  {
    name: 'Graylog',
    slug: 'graylog',
    short_description: 'Open-source log management',
    description: 'Graylog is an open-source log management platform. It provides centralized log collection, processing, and analysis with powerful search and dashboards.',
    website: 'https://graylog.org',
    github: 'https://github.com/Graylog2/graylog2-server',
    license: 'SSPL',
    is_self_hosted: true,
    alternative_to: ['coralogix', 'logz-io', 'timber'],
    categoryKeywords: ['logs', 'monitoring', 'analysis', 'centralized']
  },
  {
    name: 'Loki',
    slug: 'loki',
    short_description: 'Log aggregation system',
    description: 'Grafana Loki is a horizontally-scalable, highly-available log aggregation system. It is cost-effective and easy to operate, designed for cloud-native environments.',
    website: 'https://grafana.com/oss/loki',
    github: 'https://github.com/grafana/loki',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['coralogix', 'logz-io', 'timber'],
    categoryKeywords: ['logs', 'aggregation', 'cloud-native', 'grafana']
  },

  // Chatbots - Alternatives to ChatBot, Landbot, Manychat
  {
    name: 'Botpress',
    slug: 'botpress',
    short_description: 'Open-source conversational AI platform',
    description: 'Botpress is an open-source platform for building chatbots. It provides visual flow builder, NLU, and can be deployed on-premise or in the cloud.',
    website: 'https://botpress.com',
    github: 'https://github.com/botpress/botpress',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['chatbot', 'landbot', 'manychat'],
    categoryKeywords: ['chatbot', 'conversational', 'nlu', 'ai']
  },
  {
    name: 'Typebot',
    slug: 'typebot',
    short_description: 'Open-source chatbot builder',
    description: 'Typebot is an open-source chatbot builder that allows creating conversational apps. It provides a visual builder, integrations, and can be embedded anywhere.',
    website: 'https://typebot.io',
    github: 'https://github.com/baptisteArno/typebot.io',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['chatbot', 'landbot'],
    categoryKeywords: ['chatbot', 'conversational', 'builder', 'forms']
  },

  // Browser Extensions - Alternatives to Momentum Dash, Start.me
  {
    name: 'Tabliss',
    slug: 'tabliss',
    short_description: 'Beautiful new tab page',
    description: 'Tabliss is a free, privacy-focused, open-source new tab page extension. It provides customizable backgrounds, widgets, and a clean interface without tracking.',
    website: 'https://tabliss.io',
    github: 'https://github.com/joelshepherd/tabliss',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['momentum-dash', 'start-me'],
    categoryKeywords: ['new tab', 'browser', 'productivity', 'privacy']
  },
  {
    name: 'Bonjourr',
    slug: 'bonjourr',
    short_description: 'Minimalist start page',
    description: 'Bonjourr is a minimalist and lightweight start page for your browser. It provides beautiful backgrounds, clock, weather, and bookmarks with privacy in mind.',
    website: 'https://bonjourr.fr',
    github: 'https://github.com/victrme/Bonjourr',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['momentum-dash', 'start-me'],
    categoryKeywords: ['start page', 'browser', 'minimalist', 'privacy']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // CRM & Sales
  'crm': ['crm', 'business-software'],
  'sales': ['crm', 'business-software'],
  'contacts': ['crm', 'productivity'],
  'deals': ['crm', 'business-software'],
  'business': ['business-software', 'productivity'],
  
  // Customer Support
  'customer support': ['customer-service', 'communication-collaboration'],
  'live chat': ['customer-service', 'communication-collaboration'],
  'helpdesk': ['customer-service', 'ticketing'],
  'omnichannel': ['customer-service', 'communication-collaboration'],
  'widget': ['developer-tools', 'frontend-development'],
  'messaging': ['communication-collaboration', 'customer-service'],
  'ticketing': ['customer-service', 'project-management'],
  'shared inbox': ['communication-collaboration', 'customer-service'],
  'issue tracking': ['project-management', 'developer-tools'],
  
  // Email Marketing
  'email marketing': ['email-marketing', 'marketing-automation'],
  'newsletter': ['email-marketing', 'content-media'],
  'mailing list': ['email-marketing', 'communication-collaboration'],
  'campaigns': ['email-marketing', 'marketing-automation'],
  'automation': ['marketing-automation', 'workflow-automation'],
  'smtp': ['email-marketing', 'developer-tools'],
  'elixir': ['developer-tools', 'backend-development'],
  
  // Project Management
  'project management': ['project-management', 'productivity'],
  'kanban': ['project-management', 'productivity'],
  'tasks': ['project-management', 'productivity'],
  'collaboration': ['communication-collaboration', 'document-collaboration'],
  'strategy': ['project-management', 'business-software'],
  'gantt': ['project-management', 'productivity'],
  'roadmap': ['project-management', 'product-management'],
  'minimalist': ['productivity', 'developer-tools'],
  'boards': ['project-management', 'productivity'],
  'lists': ['productivity', 'project-management'],
  
  // Time Tracking
  'time tracking': ['time-tracking', 'productivity'],
  'pomodoro': ['productivity', 'time-tracking'],
  'productivity': ['productivity', 'developer-tools'],
  'automatic': ['productivity', 'automation'],
  'privacy': ['security-privacy', 'privacy-tools'],
  'tags': ['productivity', 'project-management'],
  'reports': ['analytics', 'business-software'],
  'invoicing': ['invoicing', 'business-software'],
  'projects': ['project-management', 'developer-tools'],
  'android': ['developer-tools', 'productivity'],
  'caldav': ['productivity', 'self-hosting'],
  
  // Website Building
  'static site': ['static-site-generators', 'developer-tools'],
  'cms': ['cms', 'content-media'],
  'blog': ['blogging', 'content-media'],
  'generator': ['static-site-generators', 'developer-tools'],
  'templates': ['developer-tools', 'frontend-development'],
  'javascript': ['developer-tools', 'frontend-development'],
  
  // No-Code
  'low-code': ['low-code-no-code', 'developer-tools'],
  'internal tools': ['developer-tools', 'business-software'],
  'no-code': ['low-code-no-code', 'productivity'],
  'notes': ['note-taking', 'productivity'],
  'wiki': ['documentation', 'knowledge-management'],
  'database': ['database', 'developer-tools'],
  'spreadsheet': ['productivity', 'business-software'],
  'airtable': ['database', 'low-code-no-code'],
  
  // Design
  'design': ['graphic-design', 'ui-ux'],
  'prototyping': ['ui-ux', 'graphic-design'],
  'ui/ux': ['ui-ux', 'graphic-design'],
  
  // 3D
  '3d': ['3d-modeling', 'graphic-design'],
  'animation': ['video-audio', '3d-modeling'],
  'modeling': ['3d-modeling', 'graphic-design'],
  'rendering': ['3d-modeling', 'video-audio'],
  
  // Screen Recording
  'screen recording': ['screen-recording', 'video-audio'],
  'streaming': ['video-audio', 'streaming'],
  'video': ['video-audio', 'content-media'],
  'broadcasting': ['video-audio', 'streaming'],
  'screenshot': ['screen-recording', 'productivity'],
  'sharing': ['file-sharing', 'communication-collaboration'],
  'annotation': ['productivity', 'screen-recording'],
  'editing': ['video-audio', 'graphic-design'],
  'linux': ['developer-tools', 'operating-systems'],
  
  // Social Media
  'social media': ['social-media', 'marketing-automation'],
  'scheduling': ['scheduling', 'productivity'],
  'analytics': ['analytics', 'business-intelligence'],
  'management': ['project-management', 'business-software'],
  
  // Communities
  'forum': ['forum', 'communication-collaboration'],
  'community': ['forum', 'social-networks'],
  'discussion': ['forum', 'communication-collaboration'],
  'moderation': ['forum', 'communication-collaboration'],
  'social': ['social-networks', 'communication-collaboration'],
  'blogging': ['blogging', 'content-media'],
  'developers': ['developer-tools', 'communication-collaboration'],
  'nodejs': ['developer-tools', 'backend-development'],
  'real-time': ['developer-tools', 'communication-collaboration'],
  
  // Scheduling
  'calendar': ['scheduling', 'productivity'],
  'booking': ['scheduling', 'business-software'],
  'meetings': ['communication-collaboration', 'scheduling'],
  
  // Video Conferencing
  'video conferencing': ['video-conferencing', 'communication-collaboration'],
  'webrtc': ['video-conferencing', 'developer-tools'],
  'education': ['education', 'learning-platforms'],
  'webinar': ['video-conferencing', 'marketing-automation'],
  'learning': ['education', 'learning-platforms'],
  
  // E-commerce
  'e-commerce': ['e-commerce', 'business-software'],
  'headless': ['e-commerce', 'developer-tools'],
  'commerce': ['e-commerce', 'business-software'],
  'storefront': ['e-commerce', 'frontend-development'],
  'graphql': ['developer-tools', 'api-development'],
  
  // Online Courses
  'lms': ['learning-platforms', 'education'],
  'courses': ['education', 'learning-platforms'],
  'mooc': ['education', 'learning-platforms'],
  'assessments': ['education', 'learning-platforms'],
  
  // Bookmarks
  'bookmarks': ['bookmarks', 'productivity'],
  'links': ['bookmarks', 'productivity'],
  'archive': ['bookmarks', 'file-sharing'],
  'organization': ['productivity', 'project-management'],
  'go': ['developer-tools', 'backend-development'],
  'simple': ['productivity', 'developer-tools'],
  'self-hosted': ['self-hosting', 'devops-infrastructure'],
  'read later': ['bookmarks', 'productivity'],
  'articles': ['content-media', 'bookmarks'],
  
  // Writing
  'writing': ['note-taking', 'productivity'],
  'markdown': ['developer-tools', 'documentation'],
  'research': ['productivity', 'education'],
  'zettelkasten': ['note-taking', 'knowledge-management'],
  'distraction-free': ['productivity', 'note-taking'],
  'editor': ['developer-tools', 'productivity'],
  'novel': ['content-media', 'note-taking'],
  'outliner': ['note-taking', 'productivity'],
  'creative': ['content-media', 'graphic-design'],
  
  // Password Managers
  'password manager': ['password-managers', 'security-privacy'],
  'security': ['security-privacy', 'authentication-identity'],
  'encryption': ['encryption', 'security-privacy'],
  'vault': ['password-managers', 'security-privacy'],
  'rust': ['developer-tools', 'backend-development'],
  'lightweight': ['developer-tools', 'productivity'],
  'offline': ['productivity', 'security-privacy'],
  'yubikey': ['security-privacy', 'authentication-identity'],
  
  // Document Signing
  'document signing': ['document-collaboration', 'business-software'],
  'e-signature': ['document-collaboration', 'business-software'],
  'forms': ['forms', 'productivity'],
  'pdf': ['document-collaboration', 'productivity'],
  
  // Feedback
  'surveys': ['forms', 'analytics'],
  'feedback': ['product-management', 'analytics'],
  'voting': ['product-management', 'communication-collaboration'],
  'conversational': ['customer-service', 'forms'],
  'drag-and-drop': ['low-code-no-code', 'developer-tools'],
  
  // Analytics
  'product': ['product-management', 'analytics'],
  'tracking': ['analytics', 'marketing-automation'],
  'feature flags': ['developer-tools', 'devops-infrastructure'],
  'website': ['analytics', 'developer-tools'],
  
  // Remote Desktop
  'remote desktop': ['remote-desktop', 'devops-infrastructure'],
  'cross-platform': ['developer-tools', 'productivity'],
  'gateway': ['devops-infrastructure', 'security-privacy'],
  'web': ['frontend-development', 'developer-tools'],
  'vnc': ['remote-desktop', 'devops-infrastructure'],
  
  // API
  'api gateway': ['api-development', 'devops-infrastructure'],
  'rest': ['api-development', 'developer-tools'],
  'performance': ['monitoring-observability', 'developer-tools'],
  'aggregation': ['api-development', 'developer-tools'],
  'microservices': ['devops-infrastructure', 'backend-development'],
  'postgresql': ['database', 'developer-tools'],
  'api': ['api-development', 'developer-tools'],
  
  // Integration
  'workflow': ['workflow-automation', 'productivity'],
  'integration': ['integration', 'developer-tools'],
  'scripts': ['developer-tools', 'automation'],
  'developer': ['developer-tools', 'productivity'],
  
  // AI
  'ai': ['ai-machine-learning', 'developer-tools'],
  'chat': ['communication-collaboration', 'ai-machine-learning'],
  'llm': ['ai-machine-learning', 'developer-tools'],
  'interface': ['ui-ux', 'developer-tools'],
  
  // Transcription
  'transcription': ['video-audio', 'ai-machine-learning'],
  'speech': ['video-audio', 'ai-machine-learning'],
  'multilingual': ['developer-tools', 'ai-machine-learning'],
  'efficient': ['developer-tools', 'backend-development'],
  'local': ['self-hosting', 'security-privacy'],
  
  // Monitoring
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'uptime': ['monitoring-observability', 'devops-infrastructure'],
  'alerts': ['monitoring-observability', 'communication-collaboration'],
  'health': ['monitoring-observability', 'devops-infrastructure'],
  'dashboard': ['analytics', 'business-intelligence'],
  
  // Incident Management
  'incident management': ['monitoring-observability', 'devops-infrastructure'],
  'on-call': ['devops-infrastructure', 'communication-collaboration'],
  'alerting': ['monitoring-observability', 'communication-collaboration'],
  'response': ['devops-infrastructure', 'security-privacy'],
  
  // Compliance
  'compliance': ['security-privacy', 'business-software'],
  'grc': ['security-privacy', 'business-software'],
  'risk': ['security-privacy', 'business-software'],
  
  // Onboarding
  'onboarding': ['product-management', 'ui-ux'],
  'tour': ['ui-ux', 'product-management'],
  'tooltips': ['ui-ux', 'frontend-development'],
  'ux': ['ui-ux', 'graphic-design'],
  
  // Notifications
  'notifications': ['communication-collaboration', 'developer-tools'],
  'push': ['developer-tools', 'communication-collaboration'],
  'email': ['email-marketing', 'communication-collaboration'],
  'infrastructure': ['devops-infrastructure', 'developer-tools'],
  
  // Billing
  'billing': ['invoicing', 'business-software'],
  'subscriptions': ['invoicing', 'business-software'],
  'payments': ['payment-processing', 'business-software'],
  'metering': ['invoicing', 'analytics'],
  'usage-based': ['invoicing', 'business-software'],
  
  // HR
  'hr': ['hr-software', 'business-software'],
  'hrm': ['hr-software', 'business-software'],
  'employee': ['hr-software', 'business-software'],
  
  // Logs
  'logs': ['monitoring-observability', 'devops-infrastructure'],
  'analysis': ['analytics', 'business-intelligence'],
  'centralized': ['devops-infrastructure', 'monitoring-observability'],
  'cloud-native': ['devops-infrastructure', 'cloud-platforms'],
  'grafana': ['monitoring-observability', 'analytics'],
  
  // Chatbots
  'chatbot': ['customer-service', 'ai-machine-learning'],
  'nlu': ['ai-machine-learning', 'developer-tools'],
  'builder': ['low-code-no-code', 'developer-tools'],
  
  // Browser
  'new tab': ['productivity', 'browser-extensions'],
  'browser': ['developer-tools', 'productivity'],
  'start page': ['productivity', 'browser-extensions'],
};

async function seedRemainingAlternatives() {
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
    console.log('\n🌱 Seeding remaining alternatives...');
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

seedRemainingAlternatives();
