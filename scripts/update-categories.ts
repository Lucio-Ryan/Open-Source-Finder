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

// Updated categories with 60-80 character descriptions and unique icons
// Matches actual slugs in the database
const categoryUpdates = [
  // AI & Machine Learning
  { slug: 'ai-machine-learning', description: 'Artificial intelligence tools for automation, analysis, and smart applications', icon: 'Brain' },
  { slug: 'ai-development-platforms', description: 'Platforms and frameworks for building and deploying AI-powered applications', icon: 'Cpu' },
  { slug: 'machine-learning-infrastructure', description: 'Infrastructure and pipelines for training, deploying, and scaling ML models', icon: 'Network' },
  { slug: 'ai-security-privacy', description: 'Tools ensuring AI systems are secure, private, and compliant with standards', icon: 'ShieldCheck' },
  { slug: 'ai-interaction-interfaces', description: 'Chatbots, voice assistants, and conversational AI interfaces for users', icon: 'Bot' },
  { slug: 'ai-development', description: 'AI development frameworks, machine learning tools, and model training apps', icon: 'Sparkles' },
  { slug: 'ai-assistants', description: 'AI-powered assistants for productivity, coding, writing, and task automation', icon: 'MessageSquareMore' },
  { slug: 'ai', description: 'General artificial intelligence tools, services, and AI-powered applications', icon: 'Wand2' },
  
  // Business Software
  { slug: 'business-software', description: 'Enterprise software solutions for managing and optimizing business operations', icon: 'Briefcase' },
  { slug: 'crm-sales', description: 'Customer relationship management and sales pipeline tracking applications', icon: 'Users' },
  { slug: 'crm', description: 'Customer relationship management systems for tracking leads and customers', icon: 'UserCircle' },
  { slug: 'sales', description: 'Sales management, pipeline tracking, and deal closing software applications', icon: 'TrendingUp' },
  { slug: 'erp-operations', description: 'Enterprise resource planning systems for unified business management tasks', icon: 'Building' },
  { slug: 'finance-accounting', description: 'Financial management, bookkeeping, invoicing, and accounting software tools', icon: 'DollarSign' },
  { slug: 'accounting', description: 'Accounting software for bookkeeping, invoicing, and financial management', icon: 'Calculator' },
  { slug: 'finance', description: 'Finance management tools for budgeting, tracking, and financial planning', icon: 'Banknote' },
  { slug: 'billing', description: 'Billing, subscription management, and payment collection software solutions', icon: 'Receipt' },
  { slug: 'human-resources-hr', description: 'HR management for recruiting, payroll, performance, and employee records', icon: 'UserPlus' },
  { slug: 'marketing-customer-engagement', description: 'Marketing automation, campaigns, and customer engagement platform tools', icon: 'Megaphone' },
  { slug: 'marketing', description: 'Marketing tools for campaigns, automation, and promotional content creation', icon: 'Target' },
  { slug: 'customer-support-success', description: 'Help desk, ticketing, and customer success management platform software', icon: 'Headphones' },
  { slug: 'customer-support', description: 'Customer support platforms with ticketing, chat, and help desk features', icon: 'LifeBuoy' },
  { slug: 'help-desk', description: 'Help desk software for managing support tickets and customer inquiries', icon: 'CircleHelp' },
  { slug: 'customer-engagement', description: 'Customer engagement tools for communication and relationship building', icon: 'HandHeart' },
  
  // Communication & Collaboration
  { slug: 'communication-collaboration', description: 'Team communication, collaboration, and workplace productivity software', icon: 'MessagesSquare' },
  { slug: 'communication', description: 'Communication platforms for messaging, calls, and team coordination tools', icon: 'MessageCircle' },
  { slug: 'team-chat-messaging', description: 'Real-time team messaging, chat rooms, and instant communication platforms', icon: 'MessageSquare' },
  { slug: 'team-chat', description: 'Team chat applications for real-time messaging and group conversations', icon: 'MessagesSquare' },
  { slug: 'video-conferencing', description: 'Video meetings, webinars, and virtual conference call software solutions', icon: 'Video' },
  { slug: 'email-newsletters', description: 'Email clients, newsletter platforms, and email marketing campaign tools', icon: 'Mail' },
  { slug: 'email-marketing', description: 'Email marketing platforms for campaigns, automation, and subscriber lists', icon: 'MailPlus' },
  { slug: 'email-delivery', description: 'Transactional email delivery services and email API infrastructure tools', icon: 'Send' },
  { slug: 'project-management', description: 'Project planning, task tracking, and team workflow management software', icon: 'ClipboardList' },
  { slug: 'document-collaboration', description: 'Real-time collaborative document editing and team writing applications', icon: 'FileEdit' },
  { slug: 'knowledge-management', description: 'Knowledge bases, wikis, and internal documentation management systems', icon: 'BookOpen' },
  { slug: 'knowledge-base', description: 'Knowledge base platforms for documentation and information management', icon: 'Library' },
  { slug: 'collaboration', description: 'Collaboration tools for teams to work together on projects and documents', icon: 'Users2' },
  
  // Content & Media
  { slug: 'content-media', description: 'Content creation, media management, and digital publishing platform tools', icon: 'Film' },
  { slug: 'content-management-cms', description: 'Website content management systems for blogs, sites, and publishing', icon: 'LayoutDashboard' },
  { slug: 'cms', description: 'Content management systems for creating and managing website content easily', icon: 'Globe' },
  { slug: 'blogging-platforms', description: 'Blog creation, publishing platforms, and personal website building tools', icon: 'PenTool' },
  { slug: 'digital-asset-management', description: 'Organize, store, and manage digital media assets and brand resources', icon: 'FolderOpen' },
  { slug: 'video-audio', description: 'Video editing, audio production, and multimedia content creation software', icon: 'Clapperboard' },
  { slug: 'video-streaming', description: 'Video streaming platforms for live broadcasts and on-demand video content', icon: 'PlayCircle' },
  { slug: 'video-hosting', description: 'Video hosting services for uploading, storing, and sharing video content', icon: 'Youtube' },
  { slug: 'video-recording', description: 'Video recording software for capturing screen, webcam, and presentations', icon: 'VideoOff' },
  { slug: 'podcasting', description: 'Podcast recording, editing, hosting, and distribution platform solutions', icon: 'Mic' },
  { slug: 'social-media', description: 'Social media management, scheduling, and analytics platform applications', icon: 'Share2' },
  { slug: 'media', description: 'Media creation, editing, and management tools for digital content production', icon: 'ImagePlay' },
  { slug: 'music', description: 'Music creation, production, and audio editing software for musicians', icon: 'Music' },
  
  // Design & Creative
  { slug: 'design-creative', description: 'Design software for graphics, UI/UX, and creative visual content work', icon: 'Palette' },
  { slug: 'design', description: 'Design tools for creating visual content, graphics, and digital artwork', icon: 'Brush' },
  { slug: 'graphic-design', description: 'Graphic design software for creating visual content and brand materials', icon: 'PenSquare' },
  { slug: 'ui-ux-design', description: 'User interface and user experience design tools for digital products work', icon: 'Figma' },
  { slug: 'prototyping-wireframing', description: 'Interactive prototyping and wireframing tools for design mockups work', icon: 'Layout' },
  { slug: 'prototyping', description: 'Prototyping tools for creating interactive mockups and design previews', icon: 'Layers' },
  { slug: 'photo-editing', description: 'Photo editing, retouching, and image manipulation software applications', icon: 'Image' },
  { slug: 'image-editing', description: 'Image editing software for photo manipulation and graphic enhancements', icon: 'ImagePlus' },
  { slug: '3d-animation', description: '3D modeling, rendering, animation, and motion graphics creation tools', icon: 'Box' },
  { slug: 'icon-illustration', description: 'Icon design, vector illustration, and digital artwork creation tools', icon: 'Shapes' },
  { slug: 'whiteboard', description: 'Digital whiteboard tools for brainstorming, collaboration, and visual ideas', icon: 'Presentation' },
  { slug: 'photography', description: 'Photography tools for editing, organizing, and managing photo collections', icon: 'Camera' },
  
  // Developer Tools
  { slug: 'developer-tools', description: 'Software development tools for coding, debugging, and building applications', icon: 'Code2' },
  { slug: 'ides-code-editors', description: 'Integrated development environments and code editors for programming work', icon: 'FileCode' },
  { slug: 'code-editors', description: 'Code editors and text editors for software development and programming', icon: 'FileCode2' },
  { slug: 'version-control', description: 'Git hosting, version control, and source code repository management tools', icon: 'GitBranch' },
  { slug: 'code-repository', description: 'Code repository hosting and version control platforms for developers', icon: 'GitFork' },
  { slug: 'api-development', description: 'API design, testing, documentation, and development platform solutions', icon: 'Plug' },
  { slug: 'ci-cd', description: 'Continuous integration and deployment automation for software delivery apps', icon: 'RefreshCw' },
  { slug: 'testing-qa', description: 'Software testing, quality assurance, and automated test framework tools', icon: 'TestTube' },
  { slug: 'code-review', description: 'Code review, pull request management, and collaborative coding tools work', icon: 'GitPullRequest' },
  { slug: 'documentation', description: 'Documentation generators, API docs, and technical writing platform tools', icon: 'FileText' },
  { slug: 'terminal-cli', description: 'Terminal emulators, command line interfaces, and shell tool utilities apps', icon: 'Terminal' },
  { slug: 'issue-tracking', description: 'Issue tracking, bug reporting, and project task management software tools', icon: 'Bug' },
  { slug: 'low-code', description: 'Low-code development platforms for building apps with minimal programming', icon: 'Puzzle' },
  { slug: 'no-code', description: 'No-code platforms for creating applications without writing any code at all', icon: 'MousePointerClick' },
  { slug: 'app-builder', description: 'Application builders for creating web and mobile apps without much coding', icon: 'AppWindow' },
  { slug: 'website-builder', description: 'Website builders for creating sites with drag-and-drop visual editors', icon: 'PanelsTopLeft' },
  { slug: 'backend-as-a-service', description: 'Backend-as-a-service platforms with databases, auth, and serverless APIs', icon: 'Server' },
  
  // Data & Analytics
  { slug: 'data-analytics', description: 'Data analysis, business intelligence, and analytics platform software tools', icon: 'BarChart3' },
  { slug: 'business-intelligence', description: 'Business intelligence dashboards, reporting tools, and data insights', icon: 'BarChart2' },
  { slug: 'data-visualization', description: 'Data visualization, charting libraries, and interactive dashboard builders', icon: 'LineChart' },
  { slug: 'etl-data-pipelines', description: 'Data extraction, transformation, loading, and pipeline orchestration tools', icon: 'GitMerge' },
  { slug: 'analytics-platforms', description: 'Web analytics and product analytics platforms for tracking user behavior', icon: 'Activity' },
  { slug: 'analytics', description: 'Analytics platforms for web traffic, user behavior, and business metrics', icon: 'TrendingUp' },
  { slug: 'product-analytics', description: 'Product analytics for user behavior, feature adoption, and usage metrics', icon: 'PieChart' },
  { slug: 'user-behavior', description: 'User behavior analytics, session recording, and heatmap analysis tools', icon: 'MousePointer' },
  { slug: 'data-warehousing', description: 'Data warehousing, storage solutions, and large-scale data management apps', icon: 'Warehouse' },
  
  // Database & Storage
  { slug: 'database-storage', description: 'Database systems, data storage, and persistence layer solutions and tools', icon: 'Database' },
  { slug: 'database', description: 'Database management systems for storing and querying structured data sets', icon: 'Cylinder' },
  { slug: 'relational-databases', description: 'SQL databases, relational database systems, and structured data storage', icon: 'Table2' },
  { slug: 'nosql-databases', description: 'NoSQL, document, key-value, and graph database management systems tools', icon: 'Layers3' },
  { slug: 'database-management', description: 'Database administration, management GUIs, and maintenance tool suites', icon: 'Settings2' },
  { slug: 'object-storage', description: 'Object storage, file storage, and cloud-based data storage solutions apps', icon: 'HardDrive' },
  { slug: 'file-storage', description: 'File storage solutions for managing and organizing files and documents', icon: 'FolderArchive' },
  { slug: 'cloud-storage', description: 'Cloud file storage, synchronization, and online backup service platforms', icon: 'CloudUpload' },
  { slug: 'file-sync', description: 'File synchronization tools for keeping files updated across all devices', icon: 'FolderSync' },
  { slug: 'backup-recovery', description: 'Data backup, disaster recovery, and business continuity software tools', icon: 'ArchiveRestore' },
  
  // DevOps & Infrastructure
  { slug: 'devops-infrastructure', description: 'DevOps tools for infrastructure management and deployment automation', icon: 'Container' },
  { slug: 'devops', description: 'DevOps tools for automation, deployment, and infrastructure management', icon: 'Workflow' },
  { slug: 'containerization', description: 'Container technologies like Docker for application packaging and deploy', icon: 'Package' },
  { slug: 'orchestration', description: 'Container orchestration, Kubernetes tools, and cluster management apps', icon: 'Boxes' },
  { slug: 'infrastructure-as-code', description: 'Infrastructure as code tools for automated cloud resource provisioning', icon: 'FileCode' },
  { slug: 'monitoring-observability', description: 'System monitoring, metrics collection, logging, and observability', icon: 'Eye' },
  { slug: 'monitoring', description: 'System monitoring tools for tracking performance, uptime, and metrics', icon: 'Activity' },
  { slug: 'observability', description: 'Observability platforms for logs, traces, and application performance', icon: 'Gauge' },
  { slug: 'cloud-platforms', description: 'Cloud infrastructure platforms and services for hosting applications', icon: 'Cloud' },
  { slug: 'cloud-platform', description: 'Cloud platform services for deploying and managing applications online', icon: 'CloudCog' },
  { slug: 'cloud', description: 'Cloud computing services, infrastructure, and platform solutions for apps', icon: 'Cloudy' },
  { slug: 'serverless', description: 'Serverless computing platforms and function-as-a-service solutions apps', icon: 'Zap' },
  { slug: 'deployment', description: 'Deployment tools for releasing and managing application versions easily', icon: 'Rocket' },
  { slug: 'hosting', description: 'Web hosting services for deploying websites and applications online', icon: 'Globe2' },
  
  // Security & Privacy
  { slug: 'security-privacy', description: 'Security tools for protecting data, systems, and ensuring user privacy', icon: 'Shield' },
  { slug: 'security', description: 'Security solutions for protecting applications, data, and infrastructure', icon: 'ShieldAlert' },
  { slug: 'authentication-identity', description: 'Authentication, identity management, and access control system tools', icon: 'KeyRound' },
  { slug: 'password-management', description: 'Password managers, credential vaults, and secure password storage apps', icon: 'Lock' },
  { slug: 'password-manager', description: 'Password manager applications for securely storing login credentials', icon: 'LockKeyhole' },
  { slug: 'vpn-networking', description: 'VPN services, network security, and secure communication tunnel software', icon: 'Network' },
  { slug: 'vpn', description: 'VPN services for secure and private internet connections and browsing', icon: 'ShieldOff' },
  { slug: 'encryption', description: 'Encryption tools, data protection, and cryptographic security solutions', icon: 'KeySquare' },
  { slug: 'security-scanning', description: 'Security scanning, vulnerability assessment, and penetration test tools', icon: 'ScanSearch' },
  { slug: 'privacy', description: 'Privacy tools for protecting personal data and online anonymity features', icon: 'EyeOff' },
  
  // Productivity & Utilities
  { slug: 'productivity', description: 'Personal and team productivity tools for efficient work and time savings', icon: 'Zap' },
  { slug: 'note-taking', description: 'Note-taking applications, digital notebooks, and knowledge capture tools', icon: 'StickyNote' },
  { slug: 'task-management', description: 'To-do lists, task tracking, and personal task management applications', icon: 'CheckSquare' },
  { slug: 'calendar-scheduling', description: 'Calendar apps, scheduling tools, and appointment booking software apps', icon: 'Calendar' },
  { slug: 'calendar', description: 'Calendar applications for scheduling events, meetings, and appointments', icon: 'CalendarDays' },
  { slug: 'scheduling', description: 'Scheduling tools for booking appointments and managing availability', icon: 'CalendarClock' },
  { slug: 'time-tracking', description: 'Time tracking, timesheets, work hour logging, and productivity analytics', icon: 'Timer' },
  { slug: 'bookmarks-reading', description: 'Bookmark managers, read-later apps, and content curation tool software', icon: 'Bookmark' },
  { slug: 'bookmarking', description: 'Bookmark management tools for saving and organizing web links easily', icon: 'BookMarked' },
  { slug: 'automation', description: 'Workflow automation, task automation, and integration platform services', icon: 'Cog' },
  { slug: 'workflow', description: 'Workflow management tools for automating and streamlining business tasks', icon: 'Route' },
  { slug: 'file-sharing', description: 'File sharing, transfer services, and collaborative storage platform tools', icon: 'Share' },
  { slug: 'screen-recording', description: 'Screen recording, screencasting, and video capture software applications', icon: 'MonitorPlay' },
  { slug: 'browser-extensions', description: 'Browser extensions, add-ons, and web browser enhancement utility tools', icon: 'Puzzle' },
  { slug: 'browser', description: 'Web browsers and browser-based tools for internet access and browsing', icon: 'Globe' },
  { slug: 'office-suite', description: 'Office suite applications for documents, spreadsheets, and presentations', icon: 'FileStack' },
  { slug: 'documents', description: 'Document creation and editing tools for word processing and text files', icon: 'FileText' },
  { slug: 'spreadsheets', description: 'Spreadsheet applications for data organization and calculations work', icon: 'Table' },
  { slug: 'wiki', description: 'Wiki software for collaborative documentation and knowledge sharing pages', icon: 'BookOpenText' },
  { slug: 'forms', description: 'Form builders for creating surveys, questionnaires, and data collection', icon: 'FormInput' },
  { slug: 'survey', description: 'Survey tools for creating questionnaires and collecting feedback data', icon: 'ClipboardCheck' },
  { slug: 'forms-surveys', description: 'Form builders, survey creators, and data collection platform tool apps', icon: 'ListChecks' },
  
  // E-commerce
  { slug: 'e-commerce', description: 'E-commerce platforms, online store builders, and digital commerce tools', icon: 'ShoppingCart' },
  { slug: 'online-stores', description: 'Online store platforms, shopping cart software, and retail web solutions', icon: 'Store' },
  { slug: 'payment-processing', description: 'Payment gateways, transaction processing, and checkout system solutions', icon: 'CreditCard' },
  { slug: 'inventory-management', description: 'Inventory tracking, stock management, and warehouse control software', icon: 'PackageSearch' },
  
  // Education & Learning
  { slug: 'education-learning', description: 'Educational technology, e-learning platforms, and training system tools', icon: 'GraduationCap' },
  { slug: 'learning-management-lms', description: 'Learning management systems for courses, training, and online education', icon: 'School' },
  { slug: 'online-courses', description: 'Online course platforms, video learning, and educational content hosting', icon: 'PlayCircle' },
  
  // Other Categories
  { slug: 'gaming', description: 'Game development tools, game engines, and gaming platform software apps', icon: 'Gamepad2' },
  { slug: 'home-automation', description: 'Smart home automation, IoT devices, and home control system software', icon: 'Home' },
  { slug: 'health-fitness', description: 'Health tracking, fitness apps, and wellness management platform tools', icon: 'Heart' },
  { slug: 'finance-budgeting', description: 'Personal finance, budgeting apps, and money management software tools', icon: 'Wallet' },
  { slug: 'voice', description: 'Voice technology, speech recognition, and audio communication tools apps', icon: 'AudioLines' },
  { slug: 'open-source', description: 'Open source software, projects, and community-driven development tools', icon: 'Code' },
  { slug: 'self-hosted', description: 'Self-hosted applications that run on your own servers for full control', icon: 'ServerCog' },
];

async function updateCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    let notFound = 0;

    for (const update of categoryUpdates) {
      const result = await Category.updateOne(
        { slug: update.slug },
        { $set: { description: update.description, icon: update.icon } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ Updated: ${update.slug} (${update.description.length} chars)`);
        updated++;
      } else {
        console.log(`- Not found: ${update.slug}`);
        notFound++;
      }
    }

    console.log(`\n✅ Category updates complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Not found: ${notFound}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateCategories();
