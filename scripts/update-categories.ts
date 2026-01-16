import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

// Category schema matching your models.ts
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Code' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Updated categories with ~50 character descriptions and unique icons
const categoryUpdates = [
  // AI & Machine Learning
  { slug: 'ai-machine-learning', description: 'AI and ML tools for intelligent apps', icon: 'Brain' },
  { slug: 'ai-development-platforms', description: 'Platforms for building AI applications', icon: 'Cpu' },
  { slug: 'machine-learning-infrastructure', description: 'Infrastructure for ML model training', icon: 'Server' },
  { slug: 'ai-security-privacy', description: 'Security tools for AI systems', icon: 'ShieldCheck' },
  { slug: 'ai-interaction-interfaces', description: 'Tools for AI interaction and chat', icon: 'Bot' },
  
  // Business Software
  { slug: 'business-software', description: 'Software for business operations', icon: 'Briefcase' },
  { slug: 'crm-sales', description: 'Customer management and sales tools', icon: 'Users' },
  { slug: 'crm-systems', description: 'Full-featured CRM platforms', icon: 'UserCircle' },
  { slug: 'erp-operations', description: 'Enterprise resource planning tools', icon: 'Building' },
  { slug: 'finance-accounting', description: 'Financial and accounting software', icon: 'DollarSign' },
  { slug: 'human-resources-hr', description: 'HR management and recruitment tools', icon: 'UserPlus' },
  { slug: 'marketing-customer-engagement', description: 'Marketing automation platforms', icon: 'Megaphone' },
  { slug: 'customer-support-success', description: 'Customer support management tools', icon: 'Headphones' },
  { slug: 'e-commerce-platforms', description: 'Online store and e-commerce solutions', icon: 'ShoppingCart' },
  { slug: 'project-work-management', description: 'Project management and collaboration', icon: 'ClipboardList' },
  { slug: 'project-management-suites', description: 'Comprehensive project management', icon: 'LayoutDashboard' },
  { slug: 'scheduling-event-management', description: 'Scheduling and event management', icon: 'Calendar' },
  { slug: 'collaboration-communication', description: 'Team communication and collab tools', icon: 'MessageCircle' },
  { slug: 'social-media-management', description: 'Social media management platforms', icon: 'Share2' },
  
  // Content & Publishing
  { slug: 'content-publishing', description: 'Content creation and publishing tools', icon: 'FileText' },
  { slug: 'content-management-systems-cms', description: 'Website content management systems', icon: 'Globe' },
  { slug: 'headless-cms', description: 'API-first content management', icon: 'Code2' },
  { slug: 'documentation-knowledge-base', description: 'Documentation and wiki platforms', icon: 'BookOpen' },
  { slug: 'learning-management-systems-lms', description: 'E-learning and course platforms', icon: 'GraduationCap' },
  { slug: 'publishing-tools', description: 'Digital publishing and blogging tools', icon: 'Edit3' },
  { slug: 'translation-management', description: 'Localization and translation tools', icon: 'Languages' },
  
  // Data & Analytics
  { slug: 'data-analytics', description: 'Data analysis and visualization tools', icon: 'BarChart3' },
  { slug: 'analytics', description: 'Web and product analytics platforms', icon: 'TrendingUp' },
  { slug: 'web-analytics', description: 'Website traffic analytics tools', icon: 'Activity' },
  { slug: 'product-analytics', description: 'User behavior analytics platforms', icon: 'PieChart' },
  { slug: 'business-intelligence-reporting', description: 'BI dashboards and reporting tools', icon: 'BarChart2' },
  { slug: 'data-visualization', description: 'Charts and data visualization tools', icon: 'LineChart' },
  { slug: 'data-pipelines-etl', description: 'Data pipeline and ETL solutions', icon: 'GitMerge' },
  
  // Developer Tools
  { slug: 'developer-tools', description: 'Tools for software development', icon: 'Code' },
  { slug: 'ides-code-editors', description: 'IDEs and code editor applications', icon: 'Terminal' },
  { slug: 'api-development-testing', description: 'API design and testing tools', icon: 'Plug' },
  { slug: 'api-infrastructure', description: 'API gateways and management', icon: 'Webhook' },
  { slug: 'version-control', description: 'Source code version control tools', icon: 'GitBranch' },
  { slug: 'cicd-devops', description: 'CI/CD and DevOps automation tools', icon: 'RefreshCw' },
  { slug: 'frameworks-platforms', description: 'Development frameworks and tools', icon: 'Layers' },
  { slug: 'backend-as-a-service-baas', description: 'Backend infrastructure services', icon: 'Database' },
  { slug: 'low-code-no-code-platforms', description: 'Visual and no-code dev tools', icon: 'Layout' },
  { slug: 'website-builders', description: 'Drag-and-drop website builders', icon: 'PanelsTopLeft' },
  { slug: 'build-deployment', description: 'Build tools and deployment', icon: 'Package' },
  { slug: 'paas-deployment-tools', description: 'PaaS and deployment platforms', icon: 'CloudUpload' },
  
  // Infrastructure & Operations
  { slug: 'infrastructure-operations', description: 'Infrastructure and DevOps tools', icon: 'Server' },
  { slug: 'monitoring-observability', description: 'System monitoring and observability', icon: 'Activity' },
  { slug: 'log-management', description: 'Log aggregation and analysis tools', icon: 'ScrollText' },
  { slug: 'error-tracking', description: 'Application error tracking tools', icon: 'AlertTriangle' },
  { slug: 'databases', description: 'Database management systems', icon: 'Database' },
  { slug: 'cloud-infrastructure-management', description: 'Cloud resource management tools', icon: 'Cloud' },
  { slug: 'infrastructure-as-code-iac', description: 'Infrastructure provisioning tools', icon: 'FileCode' },
  { slug: 'container-orchestration', description: 'Container management platforms', icon: 'Container' },
  { slug: 'server-vm-management', description: 'Server and VM management tools', icon: 'HardDrive' },
  { slug: 'control-panels', description: 'Server and hosting control panels', icon: 'Settings' },
  { slug: 'storage-solutions', description: 'Data storage and file management', icon: 'HardDrive' },
  { slug: 'cloud-storage', description: 'Cloud file storage and sync tools', icon: 'CloudUpload' },
  
  // Security & Privacy
  { slug: 'security-privacy', description: 'Security and privacy solutions', icon: 'Shield' },
  { slug: 'identity-access-management-iam', description: 'User auth and access management', icon: 'Key' },
  { slug: 'authentication-sso-providers', description: 'SSO and authentication services', icon: 'Lock' },
  { slug: 'secrets-management', description: 'Secure credential storage tools', icon: 'KeyRound' },
  { slug: 'application-security', description: 'Security testing and scanning', icon: 'ShieldCheck' },
  { slug: 'feature-flags', description: 'Feature flag management tools', icon: 'Flag' },
  { slug: 'vpn-network-security', description: 'VPN and network security tools', icon: 'Network' },
  { slug: 'password-management', description: 'Password managers and vaults', icon: 'LockKeyhole' },
  
  // Productivity & Utilities
  { slug: 'productivity-utilities', description: 'Personal productivity tools', icon: 'Zap' },
  { slug: 'note-taking-knowledge-management', description: 'Notes and knowledge management', icon: 'StickyNote' },
  { slug: 'time-task-management', description: 'Time and task management apps', icon: 'Clock' },
  { slug: 'time-tracking', description: 'Time logging and timesheet tools', icon: 'Timer' },
  { slug: 'automation-tools', description: 'Workflow automation platforms', icon: 'Cog' },
  { slug: 'workflow-automation-platforms', description: 'No-code automation tools', icon: 'Workflow' },
  { slug: 'email-communication', description: 'Email clients and comm tools', icon: 'Mail' },
  { slug: 'file-management-sync', description: 'File organization and sync tools', icon: 'Folder' },
  { slug: 'cloud-file-sync-share', description: 'Cloud file sharing services', icon: 'Upload' },
  { slug: 'screen-capture-recording', description: 'Screenshot and recording tools', icon: 'Monitor' },
  { slug: 'screen-recording-tools', description: 'Screen recording and capture', icon: 'Video' },
  { slug: 'personal-finance-management', description: 'Budgeting and finance apps', icon: 'Wallet' },
  
  // Community & Social
  { slug: 'community-social', description: 'Community building platforms', icon: 'Users' },
  { slug: 'community-building-platforms', description: 'Forums and social platforms', icon: 'UsersRound' },
  { slug: 'forum-software', description: 'Discussion forum software', icon: 'MessageSquare' },
  
  // Specialized Industries
  { slug: 'specialized-industries', description: 'Industry-specific software', icon: 'Building2' },
  { slug: 'design-prototyping', description: 'UI/UX design and prototyping', icon: 'Palette' },
  { slug: 'finance-fintech', description: 'Financial technology solutions', icon: 'Landmark' },
  { slug: 'healthcare', description: 'Healthcare and medical software', icon: 'Heart' },
  { slug: 'media-entertainment', description: 'Media production tools', icon: 'Film' },
  { slug: 'video-editing', description: 'Video editing software', icon: 'Clapperboard' },
  { slug: 'audio-music', description: 'Audio production and music tools', icon: 'Music' },
  { slug: 'gaming', description: 'Game development platforms', icon: 'Gamepad2' },
  
  // Additional AI categories
  { slug: 'ai-development', description: 'Tools for AI development', icon: 'Sparkles' },
];

async function updateCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const update of categoryUpdates) {
      const result = await Category.updateOne(
        { slug: update.slug },
        { $set: { description: update.description, icon: update.icon } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ Updated: ${update.slug}`);
      } else {
        console.log(`- Not found: ${update.slug}`);
      }
    }

    console.log('\nCategory updates complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateCategories();
