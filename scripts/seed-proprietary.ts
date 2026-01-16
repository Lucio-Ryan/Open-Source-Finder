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

// Define schema inline for the script
const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  created_at: { type: Date, default: Date.now },
});

const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

// Proprietary software from openalternative.co
// Each entry has: name, slug, description, website, icon_url
const proprietarySoftware = [
  // AI & Development
  { name: 'Cursor', slug: 'cursor', description: 'AI-powered code editor', website: 'https://cursor.sh', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/cursor/favicon.png' },
  { name: 'Claude Code', slug: 'claude-code', description: 'AI coding assistant by Anthropic', website: 'https://claude.ai', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/claude-code/favicon.png' },
  { name: 'GitHub Copilot', slug: 'github-copilot', description: 'AI pair programmer', website: 'https://github.com/features/copilot', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/github-copilot/favicon.png' },
  { name: 'ChatGPT', slug: 'chatgpt', description: 'AI chatbot by OpenAI', website: 'https://chat.openai.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/chatgpt/favicon.png' },
  { name: 'Lovable', slug: 'lovable', description: 'AI-powered app builder', website: 'https://lovable.dev', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/lovable/favicon.png' },
  
  // Productivity & Notes
  { name: 'Notion', slug: 'notion', description: 'All-in-one workspace for notes, docs, and collaboration', website: 'https://notion.so', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/notion/favicon.png' },
  { name: 'Todoist', slug: 'todoist', description: 'Task management and to-do list app', website: 'https://todoist.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/todoist/favicon.png' },
  { name: 'Evernote', slug: 'evernote', description: 'Note-taking and organization app', website: 'https://evernote.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/evernote/favicon.png' },
  { name: 'Pocket', slug: 'pocket', description: 'Save articles and videos for later', website: 'https://getpocket.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/pocket/favicon.png' },
  { name: 'Obsidian', slug: 'obsidian', description: 'Knowledge base and note-taking app', website: 'https://obsidian.md', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/obsidian/favicon.png' },
  
  // Communication
  { name: 'Slack', slug: 'slack', description: 'Team communication and collaboration platform', website: 'https://slack.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/slack/favicon.png' },
  { name: 'Discord', slug: 'discord', description: 'Voice, video, and text communication platform', website: 'https://discord.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/discord/favicon.png' },
  { name: 'Zoom', slug: 'zoom', description: 'Video conferencing and meetings', website: 'https://zoom.us', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/zoom/favicon.png' },
  { name: 'Microsoft Teams', slug: 'microsoft-teams', description: 'Business communication platform', website: 'https://teams.microsoft.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/microsoft-teams/favicon.png' },
  { name: 'Intercom', slug: 'intercom', description: 'Customer messaging platform', website: 'https://intercom.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/intercom/favicon.png' },
  
  // Design & Creative
  { name: 'Figma', slug: 'figma', description: 'Collaborative interface design tool', website: 'https://figma.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/figma/favicon.png' },
  { name: 'Adobe Photoshop', slug: 'photoshop', description: 'Professional image editing software', website: 'https://adobe.com/photoshop', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/photoshop/favicon.png' },
  { name: 'Canva', slug: 'canva', description: 'Online graphic design platform', website: 'https://canva.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/canva/favicon.png' },
  { name: 'Miro', slug: 'miro', description: 'Online collaborative whiteboard', website: 'https://miro.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/miro/favicon.png' },
  { name: 'Screen Studio', slug: 'screen-studio', description: 'Beautiful screen recordings', website: 'https://screen.studio', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/screen-studio/favicon.png' },
  { name: 'Loom', slug: 'loom', description: 'Video messaging for work', website: 'https://loom.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/loom/favicon.png' },
  
  // Development Tools
  { name: 'Sublime Text', slug: 'sublime-text', description: 'Sophisticated text editor for code', website: 'https://sublimetext.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/sublime-text/favicon.png' },
  { name: 'Postman', slug: 'postman', description: 'API development and testing platform', website: 'https://postman.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/postman/favicon.png' },
  { name: 'Linear', slug: 'linear', description: 'Issue tracking for modern software teams', website: 'https://linear.app', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/linear/favicon.png' },
  { name: 'Jira', slug: 'jira', description: 'Project and issue tracking', website: 'https://atlassian.com/jira', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/jira/favicon.png' },
  
  // Cloud & Infrastructure
  { name: 'Firebase', slug: 'firebase', description: 'Google app development platform', website: 'https://firebase.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/firebase/favicon.png' },
  { name: 'Heroku', slug: 'heroku', description: 'Cloud application platform', website: 'https://heroku.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/heroku/favicon.png' },
  { name: 'Vercel', slug: 'vercel', description: 'Frontend deployment platform', website: 'https://vercel.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/vercel/favicon.png' },
  { name: 'Netlify', slug: 'netlify', description: 'Web development platform', website: 'https://netlify.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/netlify/favicon.png' },
  
  // Analytics & Monitoring
  { name: 'Google Analytics', slug: 'google-analytics', description: 'Web analytics service', website: 'https://analytics.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/google-analytics/favicon.png' },
  { name: 'Mixpanel', slug: 'mixpanel', description: 'Product analytics platform', website: 'https://mixpanel.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/mixpanel/favicon.png' },
  { name: 'Amplitude', slug: 'amplitude', description: 'Digital analytics platform', website: 'https://amplitude.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/amplitude/favicon.png' },
  { name: 'Hotjar', slug: 'hotjar', description: 'Behavior analytics and feedback', website: 'https://hotjar.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/hotjar/favicon.png' },
  { name: 'Datadog', slug: 'datadog', description: 'Monitoring and analytics platform', website: 'https://datadoghq.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/datadog/favicon.png' },
  
  // Storage & File Management
  { name: 'Dropbox', slug: 'dropbox', description: 'Cloud storage and file sharing', website: 'https://dropbox.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/dropbox/favicon.png' },
  { name: 'Google Drive', slug: 'google-drive', description: 'Cloud storage service', website: 'https://drive.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/google-drive/favicon.png' },
  { name: 'OneDrive', slug: 'onedrive', description: 'Microsoft cloud storage', website: 'https://onedrive.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/onedrive/favicon.png' },
  
  // Office & Documents
  { name: 'Microsoft Office', slug: 'microsoft-office', description: 'Office productivity suite', website: 'https://office.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/microsoft-office/favicon.png' },
  { name: 'Google Docs', slug: 'google-docs', description: 'Online document editor', website: 'https://docs.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/google-docs/favicon.png' },
  { name: 'Google Sheets', slug: 'google-sheets', description: 'Online spreadsheet editor', website: 'https://sheets.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/google-sheets/favicon.png' },
  { name: 'Airtable', slug: 'airtable', description: 'Spreadsheet-database hybrid', website: 'https://airtable.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/airtable/favicon.png' },
  
  // CRM & Sales
  { name: 'Salesforce', slug: 'salesforce', description: 'Customer relationship management', website: 'https://salesforce.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/salesforce/favicon.png' },
  { name: 'HubSpot', slug: 'hubspot', description: 'CRM and marketing platform', website: 'https://hubspot.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/hubspot/favicon.png' },
  { name: 'Pipedrive', slug: 'pipedrive', description: 'Sales CRM and pipeline management', website: 'https://pipedrive.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/pipedrive/favicon.png' },
  
  // Email & Marketing
  { name: 'Mailchimp', slug: 'mailchimp', description: 'Email marketing platform', website: 'https://mailchimp.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/mailchimp/favicon.png' },
  { name: 'ConvertKit', slug: 'convertkit', description: 'Email marketing for creators', website: 'https://convertkit.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/convertkit/favicon.png' },
  { name: 'SendGrid', slug: 'sendgrid', description: 'Email delivery service', website: 'https://sendgrid.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/sendgrid/favicon.png' },
  
  // Payment & Finance
  { name: 'Stripe', slug: 'stripe', description: 'Payment processing platform', website: 'https://stripe.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/stripe/favicon.png' },
  { name: 'QuickBooks', slug: 'quickbooks', description: 'Accounting software', website: 'https://quickbooks.intuit.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/quickbooks/favicon.png' },
  { name: 'Xero', slug: 'xero', description: 'Cloud accounting software', website: 'https://xero.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/xero/favicon.png' },
  
  // Security & Password
  { name: '1Password', slug: '1password', description: 'Password manager', website: 'https://1password.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/1password/favicon.png' },
  { name: 'LastPass', slug: 'lastpass', description: 'Password management solution', website: 'https://lastpass.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/lastpass/favicon.png' },
  { name: 'Dashlane', slug: 'dashlane', description: 'Password manager and digital wallet', website: 'https://dashlane.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/dashlane/favicon.png' },
  
  // Automation
  { name: 'n8n', slug: 'n8n', description: 'Workflow automation platform', website: 'https://n8n.io', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/n8n/favicon.png' },
  { name: 'Zapier', slug: 'zapier', description: 'Automation and integration platform', website: 'https://zapier.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/zapier/favicon.png' },
  { name: 'Make', slug: 'make', description: 'Visual automation platform', website: 'https://make.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/make/favicon.png' },
  
  // Project Management
  { name: 'Asana', slug: 'asana', description: 'Work management platform', website: 'https://asana.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/asana/favicon.png' },
  { name: 'Monday.com', slug: 'monday', description: 'Work operating system', website: 'https://monday.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/monday/favicon.png' },
  { name: 'Trello', slug: 'trello', description: 'Kanban-style project management', website: 'https://trello.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/trello/favicon.png' },
  { name: 'ClickUp', slug: 'clickup', description: 'All-in-one productivity platform', website: 'https://clickup.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/clickup/favicon.png' },
  { name: 'Basecamp', slug: 'basecamp', description: 'Project management and team communication', website: 'https://basecamp.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/basecamp/favicon.png' },
  
  // Customer Support
  { name: 'Zendesk', slug: 'zendesk', description: 'Customer service software', website: 'https://zendesk.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/zendesk/favicon.png' },
  { name: 'Freshdesk', slug: 'freshdesk', description: 'Customer support software', website: 'https://freshworks.com/freshdesk', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/freshdesk/favicon.png' },
  { name: 'Help Scout', slug: 'help-scout', description: 'Help desk software', website: 'https://helpscout.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/help-scout/favicon.png' },
  
  // Forms & Surveys
  { name: 'Typeform', slug: 'typeform', description: 'Online form builder', website: 'https://typeform.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/typeform/favicon.png' },
  { name: 'Google Forms', slug: 'google-forms', description: 'Free online survey tool', website: 'https://forms.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/google-forms/favicon.png' },
  { name: 'SurveyMonkey', slug: 'surveymonkey', description: 'Online survey platform', website: 'https://surveymonkey.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/surveymonkey/favicon.png' },
  
  // Website Builders & CMS
  { name: 'WordPress', slug: 'wordpress', description: 'Content management system', website: 'https://wordpress.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/wordpress/favicon.png' },
  { name: 'Webflow', slug: 'webflow', description: 'Visual web design platform', website: 'https://webflow.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/webflow/favicon.png' },
  { name: 'Squarespace', slug: 'squarespace', description: 'Website builder platform', website: 'https://squarespace.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/squarespace/favicon.png' },
  { name: 'Wix', slug: 'wix', description: 'Website builder', website: 'https://wix.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/wix/favicon.png' },
  { name: 'Shopify', slug: 'shopify', description: 'E-commerce platform', website: 'https://shopify.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/shopify/favicon.png' },
  
  // Documentation
  { name: 'Confluence', slug: 'confluence', description: 'Team workspace and wiki', website: 'https://atlassian.com/confluence', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/confluence/favicon.png' },
  { name: 'GitBook', slug: 'gitbook', description: 'Documentation platform', website: 'https://gitbook.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/gitbook/favicon.png' },
  { name: 'Readme', slug: 'readme', description: 'API documentation platform', website: 'https://readme.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/readme/favicon.png' },
  
  // Video & Media
  { name: 'YouTube', slug: 'youtube', description: 'Video sharing platform', website: 'https://youtube.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/youtube/favicon.png' },
  { name: 'Vimeo', slug: 'vimeo', description: 'Video hosting platform', website: 'https://vimeo.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/vimeo/favicon.png' },
  { name: 'Twitch', slug: 'twitch', description: 'Live streaming platform', website: 'https://twitch.tv', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/twitch/favicon.png' },
  
  // Social Media
  { name: 'Buffer', slug: 'buffer', description: 'Social media management', website: 'https://buffer.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/buffer/favicon.png' },
  { name: 'Hootsuite', slug: 'hootsuite', description: 'Social media marketing platform', website: 'https://hootsuite.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/hootsuite/favicon.png' },
  
  // Calendar & Scheduling
  { name: 'Calendly', slug: 'calendly', description: 'Scheduling automation', website: 'https://calendly.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/calendly/favicon.png' },
  { name: 'Google Calendar', slug: 'google-calendar', description: 'Calendar and scheduling', website: 'https://calendar.google.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/google-calendar/favicon.png' },
  
  // Time Tracking
  { name: 'Toggl', slug: 'toggl', description: 'Time tracking software', website: 'https://toggl.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/toggl/favicon.png' },
  { name: 'Clockify', slug: 'clockify', description: 'Free time tracker', website: 'https://clockify.me', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/clockify/favicon.png' },
  
  // Code Repositories
  { name: 'GitHub', slug: 'github', description: 'Code hosting platform', website: 'https://github.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/github/favicon.png' },
  { name: 'GitLab', slug: 'gitlab', description: 'DevOps platform', website: 'https://gitlab.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/gitlab/favicon.png' },
  { name: 'Bitbucket', slug: 'bitbucket', description: 'Git repository management', website: 'https://bitbucket.org', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/bitbucket/favicon.png' },
  
  // Database
  { name: 'MongoDB Atlas', slug: 'mongodb-atlas', description: 'Cloud database service', website: 'https://mongodb.com/atlas', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/mongodb-atlas/favicon.png' },
  { name: 'Amazon RDS', slug: 'amazon-rds', description: 'Managed relational database', website: 'https://aws.amazon.com/rds', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/amazon-rds/favicon.png' },
  
  // AI Voice
  { name: 'Wispr Flow', slug: 'wisprflow', description: 'AI voice assistant', website: 'https://wispr.ai', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/wisprflow/favicon.png' },
  
  // Browser
  { name: 'Comet Browser', slug: 'comet', description: 'Web browser', website: 'https://cometbrowser.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/comet/favicon.png' },
  { name: 'Arc Browser', slug: 'arc', description: 'Modern web browser', website: 'https://arc.net', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/arc/favicon.png' },
  
  // VPN
  { name: 'NordVPN', slug: 'nordvpn', description: 'VPN service', website: 'https://nordvpn.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/nordvpn/favicon.png' },
  { name: 'ExpressVPN', slug: 'expressvpn', description: 'VPN service', website: 'https://expressvpn.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/expressvpn/favicon.png' },
  
  // Photo & Image
  { name: 'Unsplash', slug: 'unsplash', description: 'Stock photo platform', website: 'https://unsplash.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/unsplash/favicon.png' },
  { name: 'Adobe Lightroom', slug: 'lightroom', description: 'Photo editing software', website: 'https://adobe.com/lightroom', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/lightroom/favicon.png' },
  
  // Music
  { name: 'Spotify', slug: 'spotify', description: 'Music streaming service', website: 'https://spotify.com', icon_url: 'https://openalternative.co/cdn-cgi/image/width=64,quality=75,format=avif/https://assets.openalternative.co/tools/spotify/favicon.png' },
];

async function seedProprietarySoftware() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🏢 Seeding proprietary software...');
    let count = 0;
    for (const software of proprietarySoftware) {
      try {
        await ProprietarySoftware.findOneAndUpdate(
          { slug: software.slug },
          { ...software, updated_at: new Date() },
          { upsert: true, new: true }
        );
        count++;
        process.stdout.write(`\r   Added ${count}/${proprietarySoftware.length} software`);
      } catch (err: any) {
        console.error(`\n   ❌ Error adding ${software.name}:`, err.message);
      }
    }
    console.log(`\n✅ Seeded ${count} proprietary software entries`);

    console.log('\n🎉 Database seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedProprietarySoftware();
