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
  // IDE & Code Editors
  { name: 'Visual Studio Code', slug: 'visual-studio-code', description: 'Code editor', website: 'https://code.visualstudio.com' },
  { name: 'IntelliJ IDEA', slug: 'intellij-idea', description: 'Java IDE', website: 'https://jetbrains.com/idea' },
  { name: 'PyCharm', slug: 'pycharm', description: 'Python IDE', website: 'https://jetbrains.com/pycharm' },
  { name: 'WebStorm', slug: 'webstorm', description: 'JavaScript IDE', website: 'https://jetbrains.com/webstorm' },
  { name: 'Sublime Text', slug: 'sublime-text', description: 'Text editor', website: 'https://sublimetext.com' },
  
  // Database Management
  { name: 'TablePlus', slug: 'tableplus', description: 'Database GUI', website: 'https://tableplus.com' },
  { name: 'DataGrip', slug: 'datagrip', description: 'Database IDE', website: 'https://jetbrains.com/datagrip' },
  { name: 'Navicat', slug: 'navicat', description: 'Database admin', website: 'https://navicat.com' },
  { name: 'DbVisualizer', slug: 'dbvisualizer', description: 'Database tool', website: 'https://dbvis.com' },
  
  // Version Control GUI
  { name: 'GitKraken', slug: 'gitkraken', description: 'Git client', website: 'https://gitkraken.com' },
  { name: 'Tower', slug: 'tower', description: 'Git client', website: 'https://git-tower.com' },
  { name: 'Sourcetree', slug: 'sourcetree', description: 'Git client', website: 'https://sourcetreeapp.com' },
  
  // Git Hosting
  { name: 'GitHub', slug: 'github', description: 'Code hosting', website: 'https://github.com' },
  { name: 'GitLab SaaS', slug: 'gitlab-saas', description: 'DevOps platform', website: 'https://gitlab.com' },
  { name: 'Bitbucket', slug: 'bitbucket', description: 'Git repository', website: 'https://bitbucket.org' },
  
  // Email Client
  { name: 'Microsoft Outlook', slug: 'microsoft-outlook', description: 'Email client', website: 'https://outlook.com' },
  { name: 'Spark', slug: 'spark', description: 'Email app', website: 'https://sparkmailapp.com' },
  { name: 'Superhuman', slug: 'superhuman', description: 'Email client', website: 'https://superhuman.com' },
  { name: 'Newton Mail', slug: 'newton-mail', description: 'Email client', website: 'https://newtonhq.com' },
  
  // Terminal Emulator
  { name: 'Warp', slug: 'warp', description: 'Modern terminal', website: 'https://warp.dev' },
  { name: 'Termius', slug: 'termius', description: 'SSH client', website: 'https://termius.com' },
  
  // API Documentation
  { name: 'Swagger', slug: 'swagger', description: 'API documentation', website: 'https://swagger.io' },
  { name: 'Stoplight', slug: 'stoplight', description: 'API design', website: 'https://stoplight.io' },
  
  // Code Review
  { name: 'Reviewable', slug: 'reviewable', description: 'Code review', website: 'https://reviewable.io' },
  { name: 'Upsource', slug: 'upsource', description: 'Code review', website: 'https://jetbrains.com/upsource' },
  
  // Database
  { name: 'MongoDB', slug: 'mongodb', description: 'Document database', website: 'https://mongodb.com' },
  { name: 'Redis Enterprise', slug: 'redis-enterprise', description: 'In-memory database', website: 'https://redis.com' },
  { name: 'TimescaleDB Cloud', slug: 'timescaledb-cloud', description: 'Time-series database', website: 'https://timescale.com' },
  { name: 'InfluxDB Cloud', slug: 'influxdb-cloud', description: 'Time-series database', website: 'https://influxdata.com' },
  
  // Search Engine
  { name: 'Elasticsearch Cloud', slug: 'elasticsearch-cloud', description: 'Search engine', website: 'https://elastic.co' },
  
  // Security Scanning
  { name: 'Snyk', slug: 'snyk', description: 'Security scanning', website: 'https://snyk.io' },
  { name: 'SonarQube Cloud', slug: 'sonarqube-cloud', description: 'Code quality', website: 'https://sonarcloud.io' },
  { name: 'Veracode', slug: 'veracode', description: 'Application security', website: 'https://veracode.com' },
  { name: 'Checkmarx', slug: 'checkmarx', description: 'Application security', website: 'https://checkmarx.com' },
  
  // Load Testing
  { name: 'LoadRunner', slug: 'loadrunner', description: 'Load testing', website: 'https://microfocus.com/loadrunner' },
  { name: 'JMeter Enterprise', slug: 'jmeter-enterprise', description: 'Load testing', website: 'https://blazemeter.com' },
  
  // Email Service
  { name: 'Amazon SES', slug: 'amazon-ses', description: 'Email service', website: 'https://aws.amazon.com/ses' },
  
  // Push Notifications
  { name: 'OneSignal', slug: 'onesignal', description: 'Push notifications', website: 'https://onesignal.com' },
  { name: 'Firebase Cloud Messaging', slug: 'firebase-cloud-messaging', description: 'Push messaging', website: 'https://firebase.google.com/docs/cloud-messaging' },
  { name: 'Pusher', slug: 'pusher', description: 'Realtime messaging', website: 'https://pusher.com' },
  
  // Calendar
  { name: 'Google Calendar', slug: 'google-calendar', description: 'Calendar app', website: 'https://calendar.google.com' },
  { name: 'Calendly', slug: 'calendly', description: 'Scheduling', website: 'https://calendly.com' },
  
  // Time Tracking
  { name: 'Toggl', slug: 'toggl', description: 'Time tracking', website: 'https://toggl.com' },
  { name: 'Harvest', slug: 'harvest', description: 'Time tracking', website: 'https://getharvest.com' },
  { name: 'Clockify', slug: 'clockify', description: 'Time tracker', website: 'https://clockify.me' },
  
  // Screenshots
  { name: 'CleanShot X', slug: 'cleanshot-x', description: 'Screenshot tool', website: 'https://cleanshot.com' },
  { name: 'Snagit', slug: 'snagit', description: 'Screen capture', website: 'https://techsmith.com/snagit' },
  { name: 'Greenshot', slug: 'greenshot', description: 'Screenshot tool', website: 'https://getgreenshot.org' },
  
  // Mind Mapping
  { name: 'MindMeister', slug: 'mindmeister', description: 'Mind mapping', website: 'https://mindmeister.com' },
  { name: 'XMind', slug: 'xmind', description: 'Mind mapping', website: 'https://xmind.app' },
  { name: 'Coggle', slug: 'coggle', description: 'Mind maps', website: 'https://coggle.it' },
  
  // Password Manager
  { name: '1Password', slug: '1password', description: 'Password manager', website: 'https://1password.com' },
  { name: 'LastPass', slug: 'lastpass', description: 'Password manager', website: 'https://lastpass.com' },
  { name: 'Dashlane', slug: 'dashlane', description: 'Password manager', website: 'https://dashlane.com' },
  
  // File Transfer
  { name: 'WeTransfer', slug: 'wetransfer', description: 'File transfer', website: 'https://wetransfer.com' },
  { name: 'Hightail', slug: 'hightail', description: 'File sharing', website: 'https://hightail.com' },
  
  // Screen Recording
  { name: 'Loom', slug: 'loom', description: 'Screen recording', website: 'https://loom.com' },
  { name: 'Camtasia', slug: 'camtasia', description: 'Screen recorder', website: 'https://techsmith.com/camtasia' },
  { name: 'ScreenFlow', slug: 'screenflow', description: 'Screen recording', website: 'https://telestream.net/screenflow' },
  
  // Video Editor
  { name: 'Adobe Premiere Pro', slug: 'adobe-premiere-pro', description: 'Video editing', website: 'https://adobe.com/products/premiere' },
  { name: 'Final Cut Pro', slug: 'final-cut-pro', description: 'Video editing', website: 'https://apple.com/final-cut-pro' },
  { name: 'DaVinci Resolve Studio', slug: 'davinci-resolve-studio', description: 'Video editing', website: 'https://blackmagicdesign.com/davinci-resolve' },
  
  // 3D Software
  { name: 'Maya', slug: 'maya', description: '3D animation', website: 'https://autodesk.com/maya' },
  { name: 'Cinema 4D', slug: 'cinema-4d', description: '3D software', website: 'https://maxon.net/cinema-4d' },
  { name: '3ds Max', slug: '3ds-max', description: '3D modeling', website: 'https://autodesk.com/3ds-max' },
  
  // CAD
  { name: 'AutoCAD', slug: 'autocad', description: 'CAD software', website: 'https://autodesk.com/autocad' },
  { name: 'SolidWorks', slug: 'solidworks', description: 'CAD software', website: 'https://solidworks.com' },
  { name: 'Fusion 360', slug: 'fusion-360', description: '3D CAD', website: 'https://autodesk.com/fusion-360' },
  
  // Font Management
  { name: 'Adobe Fonts', slug: 'adobe-fonts', description: 'Font library', website: 'https://fonts.adobe.com' },
  { name: 'FontExplorer X', slug: 'fontexplorer-x', description: 'Font management', website: 'https://fontexplorerx.com' },
  
  // Home Automation
  { name: 'SmartThings', slug: 'smartthings', description: 'Home automation', website: 'https://smartthings.com' },
  { name: 'Amazon Alexa', slug: 'amazon-alexa', description: 'Voice assistant', website: 'https://amazon.com/alexa' },
  { name: 'Google Home', slug: 'google-home', description: 'Smart home', website: 'https://home.google.com' },
  
  // DNS Management
  { name: 'DNSMadeEasy', slug: 'dnsmadeeasy', description: 'DNS management', website: 'https://dnsmadeeasy.com' },
  { name: 'NS1', slug: 'ns1', description: 'DNS service', website: 'https://ns1.com' },
  
  // SSL/TLS
  { name: 'DigiCert', slug: 'digicert', description: 'SSL certificates', website: 'https://digicert.com' },
  { name: 'Comodo SSL', slug: 'comodo-ssl', description: 'SSL certificates', website: 'https://comodo.com' },
  
  // Cryptocurrency
  { name: 'Coinbase', slug: 'coinbase', description: 'Crypto exchange', website: 'https://coinbase.com' },
  { name: 'Binance', slug: 'binance', description: 'Crypto exchange', website: 'https://binance.com' },
  
  // CMS
  { name: 'WordPress.com', slug: 'wordpress-com', description: 'Blog platform', website: 'https://wordpress.com' },
  { name: 'Squarespace', slug: 'squarespace', description: 'Website builder', website: 'https://squarespace.com' },
  { name: 'Wix', slug: 'wix', description: 'Website builder', website: 'https://wix.com' },
  { name: 'Webflow', slug: 'webflow', description: 'Web design', website: 'https://webflow.com' },
  
  // Learning Management
  { name: 'Teachable', slug: 'teachable', description: 'Course platform', website: 'https://teachable.com' },
  { name: 'Thinkific', slug: 'thinkific', description: 'Course creation', website: 'https://thinkific.com' },
  { name: 'Kajabi', slug: 'kajabi', description: 'Knowledge commerce', website: 'https://kajabi.com' },
  
  // Helpdesk
  { name: 'Zendesk', slug: 'zendesk', description: 'Customer service', website: 'https://zendesk.com' },
  { name: 'Freshdesk', slug: 'freshdesk', description: 'Helpdesk', website: 'https://freshdesk.com' },
  { name: 'Intercom', slug: 'intercom', description: 'Customer messaging', website: 'https://intercom.com' },
  { name: 'Help Scout', slug: 'help-scout', description: 'Help desk', website: 'https://helpscout.com' },
  
  // CRM
  { name: 'Salesforce', slug: 'salesforce', description: 'CRM platform', website: 'https://salesforce.com' },
  { name: 'HubSpot CRM', slug: 'hubspot-crm', description: 'CRM software', website: 'https://hubspot.com/crm' },
  { name: 'Pipedrive', slug: 'pipedrive', description: 'Sales CRM', website: 'https://pipedrive.com' },
  { name: 'Close', slug: 'close-crm', description: 'Sales CRM', website: 'https://close.com' },
  
  // Project Management
  { name: 'Asana', slug: 'asana', description: 'Project management', website: 'https://asana.com' },
  { name: 'Monday.com', slug: 'monday-com', description: 'Work OS', website: 'https://monday.com' },
  { name: 'ClickUp', slug: 'clickup', description: 'Productivity', website: 'https://clickup.com' },
  { name: 'Basecamp', slug: 'basecamp', description: 'Project management', website: 'https://basecamp.com' },
];

// More alternatives to add
const newAlternatives = [
  // IDE & Code Editors - Alternatives to VS Code, JetBrains, Sublime
  {
    name: 'VSCodium',
    slug: 'vscodium',
    short_description: 'Free VS Code without telemetry',
    description: 'VSCodium is a community-driven, freely-licensed binary distribution of VS Code. It removes Microsoft telemetry and tracking while keeping all features.',
    website: 'https://vscodium.com',
    github: 'https://github.com/VSCodium/vscodium',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['visual-studio-code'],
    categoryKeywords: ['ide', 'editor', 'code', 'privacy', 'vscode']
  },
  {
    name: 'Neovim',
    slug: 'neovim',
    short_description: 'Vim-fork focused on extensibility',
    description: 'Neovim is a hyperextensible Vim-based text editor. It provides better defaults, built-in LSP, async plugins, and modern features while maintaining Vim compatibility.',
    website: 'https://neovim.io',
    github: 'https://github.com/neovim/neovim',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['visual-studio-code', 'sublime-text'],
    categoryKeywords: ['editor', 'vim', 'terminal', 'extensible', 'lsp']
  },
  {
    name: 'Helix',
    slug: 'helix',
    short_description: 'Post-modern modal editor',
    description: 'Helix is a post-modern text editor with multiple selections, built-in LSP support, tree-sitter integration, and smart editing primitives.',
    website: 'https://helix-editor.com',
    github: 'https://github.com/helix-editor/helix',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['visual-studio-code', 'sublime-text'],
    categoryKeywords: ['editor', 'modal', 'lsp', 'rust', 'terminal']
  },
  {
    name: 'Lapce',
    slug: 'lapce',
    short_description: 'Lightning-fast modern editor',
    description: 'Lapce is a lightning-fast and powerful code editor written in Rust. It provides native GUI, built-in LSP, remote development, and modal editing.',
    website: 'https://lapce.dev',
    github: 'https://github.com/lapce/lapce',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['visual-studio-code', 'sublime-text'],
    categoryKeywords: ['editor', 'rust', 'fast', 'native', 'lsp']
  },
  {
    name: 'Zed',
    slug: 'zed',
    short_description: 'High-performance code editor',
    description: 'Zed is a high-performance, multiplayer code editor from the creators of Atom. It provides blazing-fast performance, AI integration, and real-time collaboration.',
    website: 'https://zed.dev',
    github: 'https://github.com/zed-industries/zed',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['visual-studio-code', 'sublime-text'],
    categoryKeywords: ['editor', 'fast', 'collaboration', 'ai', 'native']
  },
  {
    name: 'Apache NetBeans',
    slug: 'apache-netbeans',
    short_description: 'Free IDE for Java',
    description: 'Apache NetBeans is a free, open-source IDE for Java, PHP, HTML, and other languages. It provides code completion, debugging, and project management.',
    website: 'https://netbeans.apache.org',
    github: 'https://github.com/apache/netbeans',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['intellij-idea'],
    categoryKeywords: ['ide', 'java', 'php', 'apache', 'enterprise']
  },
  {
    name: 'Eclipse IDE',
    slug: 'eclipse-ide',
    short_description: 'Enterprise Java IDE',
    description: 'Eclipse IDE is a widely-used IDE for Java and enterprise development. It provides powerful plugins, refactoring tools, and debugging capabilities.',
    website: 'https://www.eclipse.org/ide',
    github: 'https://github.com/eclipse-platform',
    license: 'EPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['intellij-idea'],
    categoryKeywords: ['ide', 'java', 'enterprise', 'plugins', 'refactoring']
  },

  // Database GUI - Alternatives to TablePlus, DataGrip, Navicat
  {
    name: 'DBeaver',
    slug: 'dbeaver',
    short_description: 'Universal database tool',
    description: 'DBeaver is a free universal database tool for developers and DBAs. It supports all popular databases, provides ERD diagrams, data export, and SQL editor.',
    website: 'https://dbeaver.io',
    github: 'https://github.com/dbeaver/dbeaver',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['tableplus', 'datagrip', 'navicat', 'dbvisualizer'],
    categoryKeywords: ['database', 'gui', 'sql', 'erd', 'universal']
  },
  {
    name: 'Beekeeper Studio',
    slug: 'beekeeper-studio',
    short_description: 'Modern SQL editor and database manager',
    description: 'Beekeeper Studio is a modern, easy-to-use SQL editor and database manager. It supports MySQL, Postgres, SQLite, SQL Server, and more.',
    website: 'https://beekeeperstudio.io',
    github: 'https://github.com/beekeeper-studio/beekeeper-studio',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['tableplus', 'datagrip', 'navicat'],
    categoryKeywords: ['database', 'sql', 'editor', 'modern', 'cross-platform']
  },
  {
    name: 'Adminer',
    slug: 'adminer',
    short_description: 'Database management in single PHP file',
    description: 'Adminer is a full-featured database management tool written in a single PHP file. It supports MySQL, PostgreSQL, SQLite, MS SQL, Oracle, and more.',
    website: 'https://www.adminer.org',
    github: 'https://github.com/vrana/adminer',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['tableplus', 'navicat'],
    categoryKeywords: ['database', 'php', 'web', 'lightweight', 'admin']
  },
  {
    name: 'pgAdmin',
    slug: 'pgadmin',
    short_description: 'PostgreSQL admin tool',
    description: 'pgAdmin is the leading open-source management tool for PostgreSQL. It provides a web-based GUI for database administration, query tool, and visual design.',
    website: 'https://www.pgadmin.org',
    github: 'https://github.com/pgadmin-org/pgadmin4',
    license: 'PostgreSQL License',
    is_self_hosted: true,
    alternative_to: ['tableplus', 'datagrip', 'navicat'],
    categoryKeywords: ['database', 'postgresql', 'admin', 'gui', 'web']
  },

  // Git Client - Alternatives to GitKraken, Tower, Sourcetree
  {
    name: 'Lazygit',
    slug: 'lazygit',
    short_description: 'Simple terminal UI for git',
    description: 'Lazygit is a simple terminal UI for git commands. It provides an intuitive interface for staging, committing, cherry-picking, and rebasing.',
    website: 'https://github.com/jesseduffield/lazygit',
    github: 'https://github.com/jesseduffield/lazygit',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['gitkraken', 'tower', 'sourcetree'],
    categoryKeywords: ['git', 'terminal', 'tui', 'fast', 'simple']
  },
  {
    name: 'GitUI',
    slug: 'gitui',
    short_description: 'Blazing fast terminal git UI',
    description: 'GitUI provides a keyboard-only, terminal-based git interface. It is written in Rust for speed and provides an intuitive staging, diff viewing, and log browsing.',
    website: 'https://github.com/extrawurst/gitui',
    github: 'https://github.com/extrawurst/gitui',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['gitkraken', 'tower', 'sourcetree'],
    categoryKeywords: ['git', 'terminal', 'rust', 'fast', 'keyboard']
  },
  {
    name: 'Fork',
    slug: 'fork-git',
    short_description: 'Fast git client',
    description: 'Fork is a fast and friendly git client with a clean interface. It provides quick actions, interactive rebase, merge conflict resolution, and repository management.',
    website: 'https://git-fork.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Proprietary (free)',
    is_self_hosted: false,
    alternative_to: ['gitkraken', 'tower', 'sourcetree'],
    categoryKeywords: ['git', 'client', 'gui', 'fast', 'merge']
  },

  // Git Hosting - Alternatives to GitHub, GitLab, Bitbucket
  {
    name: 'Gitea',
    slug: 'gitea',
    short_description: 'Painless self-hosted Git',
    description: 'Gitea is a painless self-hosted Git service. It is lightweight, easy to install, and provides issue tracking, code review, wiki, and CI/CD.',
    website: 'https://gitea.io',
    github: 'https://github.com/go-gitea/gitea',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['github', 'gitlab-saas', 'bitbucket'],
    categoryKeywords: ['git', 'hosting', 'lightweight', 'issues', 'ci-cd']
  },
  {
    name: 'GitLab CE',
    slug: 'gitlab-ce',
    short_description: 'Complete DevOps platform',
    description: 'GitLab Community Edition is a complete DevOps platform. It provides git hosting, CI/CD, issue tracking, container registry, and more in a single application.',
    website: 'https://about.gitlab.com',
    github: 'https://github.com/gitlabhq/gitlabhq',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['github', 'gitlab-saas', 'bitbucket'],
    categoryKeywords: ['git', 'devops', 'ci-cd', 'complete', 'enterprise']
  },
  {
    name: 'Forgejo',
    slug: 'forgejo',
    short_description: 'Self-hosted Git forge',
    description: 'Forgejo is a self-hosted lightweight software forge. It is a community-led fork of Gitea focused on free software and community governance.',
    website: 'https://forgejo.org',
    github: 'https://codeberg.org/forgejo/forgejo',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['github', 'gitlab-saas', 'bitbucket'],
    categoryKeywords: ['git', 'forge', 'community', 'self-hosted', 'free']
  },
  {
    name: 'Gogs',
    slug: 'gogs',
    short_description: 'Painless self-hosted Git service',
    description: 'Gogs is a painless self-hosted Git service. It is extremely lightweight and can run on minimal hardware including Raspberry Pi.',
    website: 'https://gogs.io',
    github: 'https://github.com/gogs/gogs',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['github', 'gitlab-saas', 'bitbucket'],
    categoryKeywords: ['git', 'lightweight', 'minimal', 'raspberry-pi', 'fast']
  },

  // Email Client - Alternatives to Outlook, Spark, Superhuman
  {
    name: 'Thunderbird',
    slug: 'thunderbird',
    short_description: 'Free email application',
    description: 'Mozilla Thunderbird is a free, open-source email application. It provides email, calendar, contacts, and tasks with powerful add-ons support.',
    website: 'https://www.thunderbird.net',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['microsoft-outlook', 'spark', 'superhuman', 'newton-mail'],
    categoryKeywords: ['email', 'client', 'calendar', 'contacts', 'mozilla']
  },
  {
    name: 'Mailspring',
    slug: 'mailspring',
    short_description: 'Beautiful, fast email client',
    description: 'Mailspring is a beautiful, fast email client. It provides read receipts, link tracking, rich contact profiles, and a unified inbox.',
    website: 'https://getmailspring.com',
    github: 'https://github.com/Foundry376/Mailspring',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['microsoft-outlook', 'spark', 'newton-mail'],
    categoryKeywords: ['email', 'client', 'beautiful', 'tracking', 'unified']
  },
  {
    name: 'Betterbird',
    slug: 'betterbird',
    short_description: 'Thunderbird with extra features',
    description: 'Betterbird is a fine-tuned version of Mozilla Thunderbird. It provides bug fixes and features that were not accepted upstream.',
    website: 'https://www.betterbird.eu',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['microsoft-outlook', 'spark'],
    categoryKeywords: ['email', 'client', 'thunderbird', 'features', 'enhanced']
  },

  // Terminal - Alternatives to iTerm2, Warp, Termius
  {
    name: 'Alacritty',
    slug: 'alacritty',
    short_description: 'Fast, cross-platform terminal',
    description: 'Alacritty is a modern terminal emulator focused on simplicity and performance. It uses GPU acceleration and provides minimal configuration.',
    website: 'https://alacritty.org',
    github: 'https://github.com/alacritty/alacritty',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['iterm2', 'warp'],
    categoryKeywords: ['terminal', 'gpu', 'fast', 'rust', 'minimal']
  },
  {
    name: 'Kitty',
    slug: 'kitty',
    short_description: 'GPU-based terminal emulator',
    description: 'Kitty is a fast, feature-rich, GPU-based terminal emulator. It supports graphics, tiling, ligatures, and is extensible with kittens.',
    website: 'https://sw.kovidgoyal.net/kitty',
    github: 'https://github.com/kovidgoyal/kitty',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['iterm2', 'warp'],
    categoryKeywords: ['terminal', 'gpu', 'graphics', 'tiling', 'extensible']
  },
  {
    name: 'WezTerm',
    slug: 'wezterm',
    short_description: 'Powerful cross-platform terminal',
    description: 'WezTerm is a powerful cross-platform terminal emulator and multiplexer. It is GPU-accelerated with Lua configuration and image support.',
    website: 'https://wezfurlong.org/wezterm',
    github: 'https://github.com/wez/wezterm',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['iterm2', 'warp', 'termius'],
    categoryKeywords: ['terminal', 'multiplexer', 'lua', 'gpu', 'images']
  },
  {
    name: 'Hyper',
    slug: 'hyper-terminal',
    short_description: 'Electron-based terminal',
    description: 'Hyper is a terminal built on web technologies. It is beautiful, extensible, and provides a rich plugin ecosystem for customization.',
    website: 'https://hyper.is',
    github: 'https://github.com/vercel/hyper',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['iterm2', 'warp'],
    categoryKeywords: ['terminal', 'electron', 'themes', 'plugins', 'web']
  },

  // Search Engine - Alternatives to Elasticsearch, Algolia
  {
    name: 'Meilisearch',
    slug: 'meilisearch',
    short_description: 'Lightning-fast search engine',
    description: 'Meilisearch is a lightning-fast, typo-tolerant search engine. It provides instant search, filtering, faceting, and is easy to deploy and use.',
    website: 'https://www.meilisearch.com',
    github: 'https://github.com/meilisearch/meilisearch',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['elasticsearch-cloud', 'algolia'],
    categoryKeywords: ['search', 'fast', 'typo-tolerant', 'instant', 'rust']
  },
  {
    name: 'Typesense',
    slug: 'typesense',
    short_description: 'Open-source search engine',
    description: 'Typesense is a modern, open-source search engine. It is designed for instant searches with typo tolerance, faceting, and geo search.',
    website: 'https://typesense.org',
    github: 'https://github.com/typesense/typesense',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['elasticsearch-cloud', 'algolia'],
    categoryKeywords: ['search', 'instant', 'typo-tolerant', 'geo', 'fast']
  },
  {
    name: 'OpenSearch',
    slug: 'opensearch',
    short_description: 'Community-driven search suite',
    description: 'OpenSearch is a community-driven fork of Elasticsearch. It provides search, analytics, and observability with Apache 2.0 licensing.',
    website: 'https://opensearch.org',
    github: 'https://github.com/opensearch-project/OpenSearch',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['elasticsearch-cloud'],
    categoryKeywords: ['search', 'analytics', 'observability', 'fork', 'community']
  },
  {
    name: 'Zinc',
    slug: 'zinc-search',
    short_description: 'Lightweight search engine',
    description: 'Zinc is a lightweight alternative to Elasticsearch. It provides full-text search with minimal resources and Elasticsearch-compatible API.',
    website: 'https://zincsearch.com',
    github: 'https://github.com/zincsearch/zincsearch',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['elasticsearch-cloud'],
    categoryKeywords: ['search', 'lightweight', 'elasticsearch', 'minimal', 'api']
  },

  // Security Scanning - Alternatives to Snyk, SonarQube, Veracode
  {
    name: 'Trivy',
    slug: 'trivy',
    short_description: 'Vulnerability scanner',
    description: 'Trivy is a comprehensive security scanner. It finds vulnerabilities in containers, filesystems, git repositories, and Kubernetes clusters.',
    website: 'https://trivy.dev',
    github: 'https://github.com/aquasecurity/trivy',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['snyk', 'veracode', 'checkmarx'],
    categoryKeywords: ['security', 'scanner', 'vulnerabilities', 'containers', 'kubernetes']
  },
  {
    name: 'Grype',
    slug: 'grype',
    short_description: 'Vulnerability scanner for containers',
    description: 'Grype is a vulnerability scanner for container images and filesystems. It works with Syft for SBOM generation and provides fast scanning.',
    website: 'https://github.com/anchore/grype',
    github: 'https://github.com/anchore/grype',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['snyk', 'veracode'],
    categoryKeywords: ['security', 'scanner', 'containers', 'sbom', 'vulnerabilities']
  },
  {
    name: 'SonarQube',
    slug: 'sonarqube',
    short_description: 'Code quality and security',
    description: 'SonarQube is an open-source platform for code quality and security analysis. It detects bugs, code smells, and security vulnerabilities in 30+ languages.',
    website: 'https://www.sonarqube.org',
    github: 'https://github.com/SonarSource/sonarqube',
    license: 'LGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['sonarqube-cloud', 'veracode', 'checkmarx'],
    categoryKeywords: ['code-quality', 'security', 'analysis', 'bugs', 'smells']
  },
  {
    name: 'Semgrep',
    slug: 'semgrep',
    short_description: 'Static analysis tool',
    description: 'Semgrep is a fast, open-source static analysis tool. It finds bugs and enforces code standards with rules that look like the code you\'re targeting.',
    website: 'https://semgrep.dev',
    github: 'https://github.com/returntocorp/semgrep',
    license: 'LGPL-2.1 License',
    is_self_hosted: true,
    alternative_to: ['snyk', 'sonarqube-cloud'],
    categoryKeywords: ['security', 'static-analysis', 'rules', 'bugs', 'code']
  },

  // Load Testing - Alternatives to LoadRunner, JMeter Enterprise
  {
    name: 'k6',
    slug: 'k6',
    short_description: 'Modern load testing tool',
    description: 'k6 is a modern load testing tool using JavaScript. It provides developer-friendly scripting, powerful metrics, and CI/CD integration.',
    website: 'https://k6.io',
    github: 'https://github.com/grafana/k6',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['loadrunner', 'jmeter-enterprise'],
    categoryKeywords: ['load-testing', 'performance', 'javascript', 'ci-cd', 'metrics']
  },
  {
    name: 'Locust',
    slug: 'locust',
    short_description: 'Scalable load testing',
    description: 'Locust is an open-source load testing tool. It allows defining user behavior in Python code with distributed load generation and web UI.',
    website: 'https://locust.io',
    github: 'https://github.com/locustio/locust',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['loadrunner', 'jmeter-enterprise'],
    categoryKeywords: ['load-testing', 'python', 'distributed', 'scalable', 'web-ui']
  },
  {
    name: 'Apache JMeter',
    slug: 'apache-jmeter',
    short_description: 'Load testing application',
    description: 'Apache JMeter is a Java application for load testing. It tests performance on static and dynamic resources including web applications.',
    website: 'https://jmeter.apache.org',
    github: 'https://github.com/apache/jmeter',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['loadrunner', 'jmeter-enterprise'],
    categoryKeywords: ['load-testing', 'java', 'performance', 'web', 'functional']
  },
  {
    name: 'Gatling',
    slug: 'gatling',
    short_description: 'Load testing for developers',
    description: 'Gatling is a load testing framework based on Scala. It provides high performance, real-time reports, and is designed for DevOps and CI/CD.',
    website: 'https://gatling.io',
    github: 'https://github.com/gatling/gatling',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['loadrunner', 'jmeter-enterprise'],
    categoryKeywords: ['load-testing', 'scala', 'ci-cd', 'reports', 'devops']
  },

  // Push Notifications - Alternatives to OneSignal, FCM, Pusher
  {
    name: 'Ntfy',
    slug: 'ntfy',
    short_description: 'Push notifications via HTTP',
    description: 'Ntfy is a simple HTTP-based pub-sub notification service. It allows sending push notifications to your phone or desktop via PUT/POST requests.',
    website: 'https://ntfy.sh',
    github: 'https://github.com/binwiederhier/ntfy',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['onesignal', 'firebase-cloud-messaging', 'pusher'],
    categoryKeywords: ['notifications', 'push', 'http', 'pubsub', 'simple']
  },
  {
    name: 'Gotify',
    slug: 'gotify',
    short_description: 'Self-hosted push notifications',
    description: 'Gotify is a simple self-hosted push notification server. It provides a REST API for sending notifications and Android app for receiving.',
    website: 'https://gotify.net',
    github: 'https://github.com/gotify/server',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['onesignal', 'firebase-cloud-messaging'],
    categoryKeywords: ['notifications', 'push', 'rest', 'android', 'self-hosted']
  },
  {
    name: 'Apprise',
    slug: 'apprise',
    short_description: 'Universal notification service',
    description: 'Apprise allows sending notifications to many services. It supports 100+ notification services including Telegram, Discord, Slack, and email.',
    website: 'https://github.com/caronc/apprise',
    github: 'https://github.com/caronc/apprise',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['onesignal', 'pusher'],
    categoryKeywords: ['notifications', 'universal', 'services', 'api', 'python']
  },

  // Calendar - Alternatives to Google Calendar, Calendly
  {
    name: 'Cal.com',
    slug: 'cal-com',
    short_description: 'Open scheduling infrastructure',
    description: 'Cal.com is the open-source Calendly alternative. It provides scheduling for meetings, events, and team calendars with full customization.',
    website: 'https://cal.com',
    github: 'https://github.com/calcom/cal.com',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['calendly', 'google-calendar'],
    categoryKeywords: ['scheduling', 'calendar', 'meetings', 'bookings', 'teams']
  },

  // Time Tracking - Alternatives to Toggl, Harvest, Clockify
  {
    name: 'Kimai',
    slug: 'kimai',
    short_description: 'Open-source time tracking',
    description: 'Kimai is a free, open-source time tracking application. It provides project tracking, invoicing, and reporting for freelancers and teams.',
    website: 'https://www.kimai.org',
    github: 'https://github.com/kimai/kimai',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['toggl', 'harvest', 'clockify'],
    categoryKeywords: ['time-tracking', 'projects', 'invoicing', 'reports', 'teams']
  },
  {
    name: 'Traggo',
    slug: 'traggo',
    short_description: 'Tag-based time tracking',
    description: 'Traggo is a tag-based time tracking tool. It uses tags instead of tasks for flexible tracking and provides dashboards and statistics.',
    website: 'https://traggo.net',
    github: 'https://github.com/traggo/server',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['toggl', 'clockify'],
    categoryKeywords: ['time-tracking', 'tags', 'dashboards', 'flexible', 'self-hosted']
  },
  {
    name: 'ActivityWatch',
    slug: 'activitywatch',
    short_description: 'Automatic time tracker',
    description: 'ActivityWatch is an automatic time tracker. It tracks time spent on applications and websites with privacy-focused local-first storage.',
    website: 'https://activitywatch.net',
    github: 'https://github.com/ActivityWatch/activitywatch',
    license: 'MPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['toggl', 'clockify'],
    categoryKeywords: ['time-tracking', 'automatic', 'privacy', 'local', 'apps']
  },

  // Mind Mapping - Alternatives to MindMeister, XMind, Coggle
  {
    name: 'Freeplane',
    slug: 'freeplane',
    short_description: 'Free mind mapping software',
    description: 'Freeplane is a free and open-source mind mapping software. It provides note-taking, presentations, and project planning with scripting support.',
    website: 'https://freeplane.org',
    github: 'https://github.com/freeplane/freeplane',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['mindmeister', 'xmind', 'coggle'],
    categoryKeywords: ['mind-mapping', 'notes', 'planning', 'presentations', 'free']
  },
  {
    name: 'Minder',
    slug: 'minder',
    short_description: 'Mind map organizer',
    description: 'Minder is a mind-mapping application for organizing ideas visually. It provides themes, auto-layout, and export to various formats.',
    website: 'https://github.com/phase1geo/Minder',
    github: 'https://github.com/phase1geo/Minder',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['mindmeister', 'xmind'],
    categoryKeywords: ['mind-mapping', 'organization', 'visual', 'themes', 'linux']
  },

  // Password Manager - Alternatives to 1Password, LastPass, Dashlane
  {
    name: 'Bitwarden',
    slug: 'bitwarden',
    short_description: 'Open-source password manager',
    description: 'Bitwarden is a free and open-source password manager. It provides secure password storage, sharing, and sync across all devices.',
    website: 'https://bitwarden.com',
    github: 'https://github.com/bitwarden/clients',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['1password', 'lastpass', 'dashlane'],
    categoryKeywords: ['password', 'security', 'sync', 'sharing', 'encryption']
  },
  {
    name: 'KeePassXC',
    slug: 'keepassxc',
    short_description: 'Cross-platform password manager',
    description: 'KeePassXC is a cross-platform password manager. It stores passwords locally in an encrypted database with browser integration and TOTP.',
    website: 'https://keepassxc.org',
    github: 'https://github.com/keepassxreboot/keepassxc',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['1password', 'lastpass', 'dashlane'],
    categoryKeywords: ['password', 'local', 'encrypted', 'browser', 'totp']
  },
  {
    name: 'Passbolt',
    slug: 'passbolt',
    short_description: 'Team password manager',
    description: 'Passbolt is an open-source password manager for teams. It provides end-to-end encryption, LDAP/SAML, and is designed for collaboration.',
    website: 'https://www.passbolt.com',
    github: 'https://github.com/passbolt/passbolt_api',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['1password', 'lastpass'],
    categoryKeywords: ['password', 'teams', 'encryption', 'ldap', 'collaboration']
  },
  {
    name: 'Vaultwarden',
    slug: 'vaultwarden',
    short_description: 'Unofficial Bitwarden server',
    description: 'Vaultwarden is an unofficial Bitwarden server implementation. It is resource-efficient and compatible with official Bitwarden clients.',
    website: 'https://github.com/dani-garcia/vaultwarden',
    github: 'https://github.com/dani-garcia/vaultwarden',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['1password', 'lastpass', 'dashlane'],
    categoryKeywords: ['password', 'bitwarden', 'lightweight', 'rust', 'self-hosted']
  },

  // File Transfer - Alternatives to WeTransfer, Hightail
  {
    name: 'Send',
    slug: 'send',
    short_description: 'Encrypted file sharing',
    description: 'Send is a simple, private file sharing tool. Originally Firefox Send, it provides end-to-end encryption and auto-expiring links.',
    website: 'https://github.com/timvisee/send',
    github: 'https://github.com/timvisee/send',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['wetransfer', 'hightail'],
    categoryKeywords: ['file-sharing', 'encrypted', 'private', 'expiring', 'simple']
  },
  {
    name: 'FilePizza',
    slug: 'filepizza',
    short_description: 'Peer-to-peer file transfers',
    description: 'FilePizza is a peer-to-peer file transfer service. Files are transferred directly between browsers using WebRTC without storing on servers.',
    website: 'https://file.pizza',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['wetransfer'],
    categoryKeywords: ['file-sharing', 'p2p', 'webrtc', 'direct', 'serverless']
  },
  {
    name: 'Wormhole',
    slug: 'wormhole',
    short_description: 'Simple secure file sharing',
    description: 'Magic Wormhole provides simple, secure file transfer. Files are transferred with short codes for one-time secure delivery.',
    website: 'https://magic-wormhole.readthedocs.io',
    github: 'https://github.com/magic-wormhole/magic-wormhole',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['wetransfer', 'hightail'],
    categoryKeywords: ['file-sharing', 'secure', 'simple', 'cli', 'encryption']
  },

  // Screen Recording - Alternatives to Loom, Camtasia, ScreenFlow
  {
    name: 'OBS Studio',
    slug: 'obs-studio',
    short_description: 'Free streaming and recording',
    description: 'OBS Studio is free, open-source software for video recording and live streaming. It provides powerful configuration for professional productions.',
    website: 'https://obsproject.com',
    github: 'https://github.com/obsproject/obs-studio',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['loom', 'camtasia', 'screenflow'],
    categoryKeywords: ['recording', 'streaming', 'video', 'obs', 'live']
  },
  {
    name: 'SimpleScreenRecorder',
    slug: 'simplescreenrecorder',
    short_description: 'Simple Linux screen recorder',
    description: 'SimpleScreenRecorder is a Linux program for screen recording. It is feature-rich yet simple, supporting various codecs and formats.',
    website: 'https://www.maartenbaert.be/simplescreenrecorder',
    github: 'https://github.com/MaartenBaert/ssr',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['loom', 'camtasia'],
    categoryKeywords: ['recording', 'screen', 'linux', 'simple', 'codecs']
  },
  {
    name: 'Kooha',
    slug: 'kooha',
    short_description: 'Screen recorder for GNOME',
    description: 'Kooha is a minimalist screen recorder for GNOME. It provides a clean interface with WebM, MP4, GIF, and Matroska support.',
    website: 'https://github.com/SeaDve/Kooha',
    github: 'https://github.com/SeaDve/Kooha',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['loom', 'camtasia'],
    categoryKeywords: ['recording', 'screen', 'gnome', 'minimal', 'gif']
  },

  // Video Editor - Alternatives to Premiere Pro, Final Cut Pro
  {
    name: 'DaVinci Resolve',
    slug: 'davinci-resolve',
    short_description: 'Professional video editing',
    description: 'DaVinci Resolve combines editing, color correction, visual effects, and audio post-production. The free version provides professional-grade tools.',
    website: 'https://www.blackmagicdesign.com/davinci-resolve',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Proprietary (free version)',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro', 'davinci-resolve-studio'],
    categoryKeywords: ['video', 'editing', 'color', 'vfx', 'professional']
  },
  {
    name: 'Kdenlive',
    slug: 'kdenlive',
    short_description: 'Free video editor',
    description: 'Kdenlive is a free and open-source video editing software based on Qt and FFmpeg. It provides multi-track editing, effects, and titling.',
    website: 'https://kdenlive.org',
    github: 'https://github.com/KDE/kdenlive',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro'],
    categoryKeywords: ['video', 'editing', 'multitrack', 'effects', 'kde']
  },
  {
    name: 'Shotcut',
    slug: 'shotcut',
    short_description: 'Free cross-platform video editor',
    description: 'Shotcut is a free, open-source, cross-platform video editor. It supports many audio and video formats with native timeline editing.',
    website: 'https://www.shotcut.org',
    github: 'https://github.com/mltframework/shotcut',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro'],
    categoryKeywords: ['video', 'editing', 'cross-platform', 'formats', 'timeline']
  },
  {
    name: 'OpenShot',
    slug: 'openshot',
    short_description: 'Easy-to-use video editor',
    description: 'OpenShot is an easy-to-use, quick to learn video editor. It provides a simple interface with powerful features for creating videos.',
    website: 'https://www.openshot.org',
    github: 'https://github.com/OpenShot/openshot-qt',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro'],
    categoryKeywords: ['video', 'editing', 'easy', 'beginner', 'quick']
  },

  // 3D Software - Alternatives to Maya, Cinema 4D, 3ds Max
  {
    name: 'Blender',
    slug: 'blender',
    short_description: 'Free 3D creation suite',
    description: 'Blender is the free and open-source 3D creation suite. It supports modeling, rigging, animation, rendering, compositing, and game creation.',
    website: 'https://www.blender.org',
    github: 'https://github.com/blender/blender',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['maya', 'cinema-4d', '3ds-max'],
    categoryKeywords: ['3d', 'modeling', 'animation', 'rendering', 'vfx']
  },

  // CAD - Alternatives to AutoCAD, SolidWorks, Fusion 360
  {
    name: 'FreeCAD',
    slug: 'freecad',
    short_description: 'Open-source parametric 3D CAD',
    description: 'FreeCAD is a parametric 3D CAD modeler. It is designed for mechanical engineering, product design, and architecture with Python scripting.',
    website: 'https://www.freecad.org',
    github: 'https://github.com/FreeCAD/FreeCAD',
    license: 'LGPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['autocad', 'solidworks', 'fusion-360'],
    categoryKeywords: ['cad', '3d', 'parametric', 'engineering', 'design']
  },
  {
    name: 'OpenSCAD',
    slug: 'openscad',
    short_description: 'Programmer\'s solid 3D CAD',
    description: 'OpenSCAD is a script-based solid 3D CAD modeler. It creates 3D models from a programming script, making it ideal for parametric designs.',
    website: 'https://openscad.org',
    github: 'https://github.com/openscad/openscad',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['autocad', 'fusion-360'],
    categoryKeywords: ['cad', '3d', 'scripting', 'parametric', 'programmatic']
  },
  {
    name: 'LibreCAD',
    slug: 'librecad',
    short_description: 'Free 2D CAD application',
    description: 'LibreCAD is a free 2D CAD application for Windows, macOS, and Linux. It provides technical drawings, floor plans, and schematics.',
    website: 'https://librecad.org',
    github: 'https://github.com/LibreCAD/LibreCAD',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['autocad'],
    categoryKeywords: ['cad', '2d', 'technical', 'drawings', 'drafting']
  },

  // Home Automation - Alternatives to SmartThings, Alexa, Google Home
  {
    name: 'Home Assistant',
    slug: 'home-assistant',
    short_description: 'Open-source home automation',
    description: 'Home Assistant is an open-source home automation platform. It integrates with 1000+ devices and services for local control of your smart home.',
    website: 'https://www.home-assistant.io',
    github: 'https://github.com/home-assistant/core',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['smartthings', 'amazon-alexa', 'google-home'],
    categoryKeywords: ['home-automation', 'iot', 'smart-home', 'local', 'integrations']
  },
  {
    name: 'OpenHAB',
    slug: 'openhab',
    short_description: 'Vendor-neutral home automation',
    description: 'OpenHAB is a vendor-neutral, open-source home automation platform. It provides bindings for many smart home devices and rule-based automation.',
    website: 'https://www.openhab.org',
    github: 'https://github.com/openhab/openhab-core',
    license: 'EPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['smartthings', 'google-home'],
    categoryKeywords: ['home-automation', 'iot', 'vendor-neutral', 'rules', 'bindings']
  },
  {
    name: 'Domoticz',
    slug: 'domoticz',
    short_description: 'Home automation system',
    description: 'Domoticz is a home automation system for monitoring and configuring various devices. It is lightweight with support for many protocols.',
    website: 'https://www.domoticz.com',
    github: 'https://github.com/domoticz/domoticz',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['smartthings'],
    categoryKeywords: ['home-automation', 'monitoring', 'lightweight', 'protocols', 'iot']
  },

  // CMS - Alternatives to WordPress.com, Squarespace, Wix, Webflow
  {
    name: 'WordPress',
    slug: 'wordpress',
    short_description: 'Open-source publishing platform',
    description: 'WordPress is the world\'s most popular open-source CMS. It powers over 40% of websites with themes, plugins, and full customization.',
    website: 'https://wordpress.org',
    github: 'https://github.com/WordPress/WordPress',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['wordpress-com', 'squarespace', 'wix', 'webflow'],
    categoryKeywords: ['cms', 'blog', 'website', 'plugins', 'themes']
  },
  {
    name: 'Ghost',
    slug: 'ghost',
    short_description: 'Modern publishing platform',
    description: 'Ghost is a modern, open-source publishing platform. It provides a clean writing experience, memberships, subscriptions, and newsletters.',
    website: 'https://ghost.org',
    github: 'https://github.com/TryGhost/Ghost',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['wordpress-com', 'squarespace'],
    categoryKeywords: ['cms', 'publishing', 'newsletters', 'memberships', 'modern']
  },
  {
    name: 'Hugo',
    slug: 'hugo',
    short_description: 'Fast static site generator',
    description: 'Hugo is one of the most popular static site generators. It builds sites in seconds with Markdown content, themes, and multilingual support.',
    website: 'https://gohugo.io',
    github: 'https://github.com/gohugoio/hugo',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['wordpress-com', 'squarespace', 'wix'],
    categoryKeywords: ['ssg', 'static', 'fast', 'markdown', 'themes']
  },
  {
    name: 'Astro',
    slug: 'astro',
    short_description: 'Content-focused web framework',
    description: 'Astro is a web framework for building content-driven websites. It ships zero JavaScript by default with island architecture for interactivity.',
    website: 'https://astro.build',
    github: 'https://github.com/withastro/astro',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['wordpress-com', 'squarespace', 'webflow'],
    categoryKeywords: ['ssg', 'web', 'content', 'islands', 'performance']
  },
  {
    name: 'Eleventy',
    slug: 'eleventy',
    short_description: 'Simple static site generator',
    description: 'Eleventy (11ty) is a simpler static site generator. It is zero-config by default with flexible templating and data source support.',
    website: 'https://www.11ty.dev',
    github: 'https://github.com/11ty/eleventy',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['wordpress-com', 'squarespace'],
    categoryKeywords: ['ssg', 'static', 'simple', 'templates', 'flexible']
  },

  // Learning Management - Alternatives to Teachable, Thinkific, Kajabi
  {
    name: 'Moodle',
    slug: 'moodle',
    short_description: 'Open-source learning platform',
    description: 'Moodle is the world\'s most widely used learning platform. It provides course management, quizzes, gradebooks, and collaborative tools.',
    website: 'https://moodle.org',
    github: 'https://github.com/moodle/moodle',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['teachable', 'thinkific', 'kajabi'],
    categoryKeywords: ['lms', 'learning', 'courses', 'education', 'quizzes']
  },
  {
    name: 'Canvas LMS',
    slug: 'canvas-lms',
    short_description: 'Modern learning management',
    description: 'Canvas is a modern, open-source LMS designed for teaching and learning. It provides a clean interface, integrations, and mobile apps.',
    website: 'https://www.instructure.com/canvas',
    github: 'https://github.com/instructure/canvas-lms',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['teachable', 'thinkific'],
    categoryKeywords: ['lms', 'learning', 'modern', 'mobile', 'education']
  },
  {
    name: 'Open edX',
    slug: 'open-edx',
    short_description: 'Scalable online learning',
    description: 'Open edX is the open-source platform behind edX. It provides course creation, assessments, certifications, and analytics for massive online courses.',
    website: 'https://openedx.org',
    github: 'https://github.com/openedx/edx-platform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['teachable', 'thinkific', 'kajabi'],
    categoryKeywords: ['lms', 'mooc', 'scalable', 'certifications', 'analytics']
  },

  // Helpdesk - Alternatives to Zendesk, Freshdesk, Intercom, Help Scout
  {
    name: 'Zammad',
    slug: 'zammad',
    short_description: 'Open-source helpdesk',
    description: 'Zammad is a web-based open-source helpdesk. It provides ticketing, knowledge base, live chat, and integrations with email and social media.',
    website: 'https://zammad.org',
    github: 'https://github.com/zammad/zammad',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['zendesk', 'freshdesk', 'help-scout'],
    categoryKeywords: ['helpdesk', 'ticketing', 'support', 'kb', 'chat']
  },
  {
    name: 'osTicket',
    slug: 'osticket',
    short_description: 'Support ticket system',
    description: 'osTicket is a widely-used open-source support ticket system. It routes inquiries via email, web, and API into a simple web interface.',
    website: 'https://osticket.com',
    github: 'https://github.com/osTicket/osTicket',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['zendesk', 'freshdesk', 'help-scout'],
    categoryKeywords: ['helpdesk', 'ticketing', 'support', 'email', 'web']
  },
  {
    name: 'FreeScout',
    slug: 'freescout',
    short_description: 'Free Help Scout alternative',
    description: 'FreeScout is a free self-hosted help desk and shared mailbox. It is a self-hosted clone of Help Scout with similar functionality.',
    website: 'https://freescout.net',
    github: 'https://github.com/freescout-helpdesk/freescout',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['help-scout', 'zendesk', 'freshdesk'],
    categoryKeywords: ['helpdesk', 'mailbox', 'support', 'shared', 'tickets']
  },
  {
    name: 'OTOBO',
    slug: 'otobo',
    short_description: 'Enterprise service management',
    description: 'OTOBO is an open-source ticketing and service management system. It is a fork of OTRS Community Edition with active development.',
    website: 'https://otobo.de',
    github: 'https://github.com/RotherOSS/otobo',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['zendesk', 'freshdesk'],
    categoryKeywords: ['itsm', 'ticketing', 'service', 'enterprise', 'itil']
  },

  // CRM - Alternatives to Salesforce, HubSpot, Pipedrive, Close
  {
    name: 'SuiteCRM',
    slug: 'suitecrm',
    short_description: 'Enterprise CRM',
    description: 'SuiteCRM is the world\'s leading open-source CRM. It provides sales, marketing, and service automation with full Salesforce compatibility.',
    website: 'https://suitecrm.com',
    github: 'https://github.com/salesagility/SuiteCRM',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['salesforce', 'hubspot-crm', 'pipedrive', 'close-crm'],
    categoryKeywords: ['crm', 'sales', 'marketing', 'enterprise', 'automation']
  },
  {
    name: 'Monica',
    slug: 'monica',
    short_description: 'Personal relationship manager',
    description: 'Monica is an open-source personal relationship management system. It helps you organize interactions with friends and family.',
    website: 'https://www.monicahq.com',
    github: 'https://github.com/monicahq/monica',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['hubspot-crm'],
    categoryKeywords: ['crm', 'personal', 'relationships', 'contacts', 'notes']
  },

  // Project Management - Alternatives to Asana, Monday.com, ClickUp, Basecamp
  {
    name: 'OpenProject',
    slug: 'openproject',
    short_description: 'Open-source project management',
    description: 'OpenProject is a powerful open-source project management software. It provides task management, Gantt charts, agile boards, and time tracking.',
    website: 'https://www.openproject.org',
    github: 'https://github.com/opf/openproject',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['asana', 'monday-com', 'clickup', 'basecamp'],
    categoryKeywords: ['project', 'management', 'gantt', 'agile', 'time-tracking']
  },
  {
    name: 'Taiga',
    slug: 'taiga',
    short_description: 'Agile project management',
    description: 'Taiga is an open-source agile project management platform. It supports Scrum and Kanban with beautiful design and user experience.',
    website: 'https://www.taiga.io',
    github: 'https://github.com/taigaio/taiga-back',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['asana', 'monday-com', 'clickup'],
    categoryKeywords: ['project', 'agile', 'scrum', 'kanban', 'beautiful']
  },
  {
    name: 'Plane',
    slug: 'plane',
    short_description: 'Project management tool',
    description: 'Plane is an open-source project planning tool. It provides issue tracking, cycles, modules, and roadmaps with a modern interface.',
    website: 'https://plane.so',
    github: 'https://github.com/makeplane/plane',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['asana', 'monday-com', 'clickup', 'basecamp'],
    categoryKeywords: ['project', 'issues', 'planning', 'modern', 'roadmaps']
  },
  {
    name: 'Focalboard',
    slug: 'focalboard',
    short_description: 'Project and task management',
    description: 'Focalboard is an open-source, self-hosted project management tool. It is a Notion/Trello alternative with kanban boards, tables, and calendars.',
    website: 'https://www.focalboard.com',
    github: 'https://github.com/mattermost/focalboard',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['asana', 'monday-com', 'clickup', 'basecamp'],
    categoryKeywords: ['project', 'kanban', 'tables', 'calendar', 'notion']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  'ide': ['developer-tools', 'ide'],
  'editor': ['developer-tools', 'ide'],
  'code': ['developer-tools', 'programming'],
  'privacy': ['security-privacy', 'privacy'],
  'vscode': ['developer-tools', 'ide'],
  'vim': ['developer-tools', 'ide'],
  'terminal': ['developer-tools', 'terminal'],
  'extensible': ['developer-tools', 'customization'],
  'lsp': ['developer-tools', 'programming'],
  'modal': ['developer-tools', 'ide'],
  'rust': ['developer-tools', 'backend-development'],
  'fast': ['performance', 'developer-tools'],
  'native': ['developer-tools', 'desktop'],
  'collaboration': ['communication-collaboration', 'productivity'],
  'ai': ['ai-ml', 'developer-tools'],
  'java': ['developer-tools', 'programming'],
  'php': ['developer-tools', 'backend-development'],
  'apache': ['devops-infrastructure', 'developer-tools'],
  'enterprise': ['business-software', 'devops-infrastructure'],
  'plugins': ['developer-tools', 'customization'],
  'refactoring': ['developer-tools', 'programming'],
  'database': ['database', 'developer-tools'],
  'gui': ['developer-tools', 'productivity'],
  'sql': ['database', 'developer-tools'],
  'erd': ['database', 'documentation'],
  'universal': ['developer-tools', 'productivity'],
  'modern': ['developer-tools', 'productivity'],
  'cross-platform': ['developer-tools', 'productivity'],
  'web': ['frontend-development', 'developer-tools'],
  'lightweight': ['performance', 'developer-tools'],
  'admin': ['devops-infrastructure', 'developer-tools'],
  'postgresql': ['database', 'developer-tools'],
  'git': ['version-control', 'developer-tools'],
  'tui': ['developer-tools', 'terminal'],
  'simple': ['productivity', 'developer-tools'],
  'keyboard': ['developer-tools', 'productivity'],
  'client': ['developer-tools', 'productivity'],
  'merge': ['version-control', 'developer-tools'],
  'hosting': ['web-hosting', 'devops-infrastructure'],
  'issues': ['project-management', 'developer-tools'],
  'ci-cd': ['ci-cd', 'devops-infrastructure'],
  'devops': ['devops-infrastructure', 'developer-tools'],
  'complete': ['business-software', 'developer-tools'],
  'forge': ['developer-tools', 'version-control'],
  'community': ['communication-collaboration', 'developer-tools'],
  'self-hosted': ['self-hosting', 'devops-infrastructure'],
  'free': ['productivity', 'developer-tools'],
  'minimal': ['productivity', 'developer-tools'],
  'raspberry-pi': ['iot', 'self-hosting'],
  'email': ['communication-collaboration', 'productivity'],
  'calendar': ['productivity', 'communication-collaboration'],
  'contacts': ['productivity', 'communication-collaboration'],
  'mozilla': ['developer-tools', 'privacy'],
  'beautiful': ['design', 'productivity'],
  'tracking': ['analytics', 'productivity'],
  'unified': ['productivity', 'communication-collaboration'],
  'thunderbird': ['communication-collaboration', 'productivity'],
  'features': ['developer-tools', 'productivity'],
  'enhanced': ['developer-tools', 'productivity'],
  'gpu': ['performance', 'developer-tools'],
  'graphics': ['graphic-design', 'developer-tools'],
  'tiling': ['productivity', 'developer-tools'],
  'multiplexer': ['developer-tools', 'terminal'],
  'lua': ['developer-tools', 'scripting'],
  'images': ['content-media', 'developer-tools'],
  'electron': ['developer-tools', 'frontend-development'],
  'themes': ['design', 'customization'],
  'search': ['search', 'developer-tools'],
  'typo-tolerant': ['search', 'developer-tools'],
  'instant': ['search', 'performance'],
  'geo': ['location', 'search'],
  'analytics': ['analytics', 'business-intelligence'],
  'observability': ['monitoring-observability', 'devops-infrastructure'],
  'fork': ['developer-tools', 'version-control'],
  'elasticsearch': ['search', 'database'],
  'api': ['api-development', 'developer-tools'],
  'security': ['security-privacy', 'devops-infrastructure'],
  'scanner': ['security-privacy', 'devops-infrastructure'],
  'vulnerabilities': ['security-privacy', 'devops-infrastructure'],
  'containers': ['containers-orchestration', 'devops-infrastructure'],
  'kubernetes': ['containers-orchestration', 'devops-infrastructure'],
  'sbom': ['security-privacy', 'devops-infrastructure'],
  'code-quality': ['developer-tools', 'testing-qa'],
  'analysis': ['analytics', 'developer-tools'],
  'bugs': ['developer-tools', 'testing-qa'],
  'smells': ['developer-tools', 'testing-qa'],
  'static-analysis': ['developer-tools', 'security-privacy'],
  'rules': ['developer-tools', 'devops-infrastructure'],
  'load-testing': ['testing-qa', 'performance'],
  'performance': ['performance', 'developer-tools'],
  'javascript': ['frontend-development', 'developer-tools'],
  'metrics': ['monitoring-observability', 'analytics'],
  'python': ['developer-tools', 'backend-development'],
  'distributed': ['devops-infrastructure', 'database'],
  'scalable': ['devops-infrastructure', 'performance'],
  'web-ui': ['frontend-development', 'developer-tools'],
  'functional': ['testing-qa', 'developer-tools'],
  'scala': ['developer-tools', 'backend-development'],
  'reports': ['analytics', 'business-intelligence'],
  'notifications': ['communication-collaboration', 'devops-infrastructure'],
  'push': ['communication-collaboration', 'mobile'],
  'http': ['developer-tools', 'api-development'],
  'pubsub': ['devops-infrastructure', 'backend-development'],
  'rest': ['api-development', 'developer-tools'],
  'android': ['mobile', 'developer-tools'],
  'services': ['devops-infrastructure', 'integration'],
  'scheduling': ['productivity', 'communication-collaboration'],
  'meetings': ['communication-collaboration', 'productivity'],
  'bookings': ['productivity', 'business-software'],
  'teams': ['communication-collaboration', 'project-management'],
  'time-tracking': ['productivity', 'project-management'],
  'projects': ['project-management', 'productivity'],
  'invoicing': ['accounting', 'business-software'],
  'tags': ['productivity', 'developer-tools'],
  'dashboards': ['analytics', 'monitoring-observability'],
  'flexible': ['developer-tools', 'productivity'],
  'automatic': ['automation', 'productivity'],
  'local': ['privacy', 'self-hosting'],
  'apps': ['mobile', 'productivity'],
  'mind-mapping': ['productivity', 'knowledge-management'],
  'notes': ['note-taking', 'productivity'],
  'planning': ['project-management', 'productivity'],
  'presentations': ['productivity', 'office-suite'],
  'organization': ['productivity', 'knowledge-management'],
  'visual': ['design', 'productivity'],
  'linux': ['developer-tools', 'devops-infrastructure'],
  'password': ['security-privacy', 'productivity'],
  'sync': ['file-sharing', 'productivity'],
  'sharing': ['file-sharing', 'communication-collaboration'],
  'encryption': ['encryption', 'security-privacy'],
  'browser': ['developer-tools', 'productivity'],
  'totp': ['security-privacy', 'authentication-identity'],
  'ldap': ['authentication-identity', 'devops-infrastructure'],
  'bitwarden': ['security-privacy', 'productivity'],
  'file-sharing': ['file-sharing', 'productivity'],
  'encrypted': ['encryption', 'security-privacy'],
  'private': ['privacy', 'security-privacy'],
  'expiring': ['productivity', 'file-sharing'],
  'p2p': ['security-privacy', 'networking'],
  'webrtc': ['communication-collaboration', 'developer-tools'],
  'direct': ['file-sharing', 'networking'],
  'serverless': ['serverless', 'cloud-platforms'],
  'secure': ['security-privacy', 'encryption'],
  'cli': ['developer-tools', 'terminal'],
  'recording': ['video-audio', 'content-media'],
  'streaming': ['streaming', 'video-audio'],
  'video': ['video-audio', 'content-media'],
  'obs': ['video-audio', 'streaming'],
  'live': ['streaming', 'video-audio'],
  'screen': ['video-audio', 'content-media'],
  'codecs': ['video-audio', 'developer-tools'],
  'gnome': ['developer-tools', 'linux'],
  'gif': ['content-media', 'video-audio'],
  'editing': ['video-audio', 'content-media'],
  'color': ['video-audio', 'graphic-design'],
  'vfx': ['video-audio', 'graphic-design'],
  'professional': ['business-software', 'video-audio'],
  'multitrack': ['video-audio', 'content-media'],
  'effects': ['video-audio', 'graphic-design'],
  'kde': ['developer-tools', 'linux'],
  'formats': ['video-audio', 'developer-tools'],
  'timeline': ['video-audio', 'project-management'],
  'easy': ['productivity', 'developer-tools'],
  'beginner': ['education', 'developer-tools'],
  'quick': ['productivity', 'performance'],
  '3d': ['graphic-design', '3d-animation'],
  'modeling': ['graphic-design', '3d-animation'],
  'animation': ['video-audio', '3d-animation'],
  'rendering': ['graphic-design', '3d-animation'],
  'cad': ['graphic-design', 'engineering'],
  'parametric': ['graphic-design', 'engineering'],
  'engineering': ['engineering', 'developer-tools'],
  'design': ['design', 'ui-ux'],
  'scripting': ['developer-tools', 'automation'],
  'programmatic': ['developer-tools', 'automation'],
  '2d': ['graphic-design', 'design'],
  'technical': ['engineering', 'documentation'],
  'drawings': ['graphic-design', 'documentation'],
  'drafting': ['graphic-design', 'engineering'],
  'home-automation': ['iot', 'self-hosting'],
  'iot': ['iot', 'devops-infrastructure'],
  'smart-home': ['iot', 'self-hosting'],
  'integrations': ['integration', 'developer-tools'],
  'vendor-neutral': ['iot', 'devops-infrastructure'],
  'bindings': ['iot', 'developer-tools'],
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'protocols': ['networking', 'developer-tools'],
  'cms': ['cms', 'content-media'],
  'blog': ['cms', 'content-media'],
  'website': ['frontend-development', 'cms'],
  'publishing': ['cms', 'content-media'],
  'newsletters': ['marketing-automation', 'communication-collaboration'],
  'memberships': ['e-commerce', 'business-software'],
  'ssg': ['static-site-generators', 'developer-tools'],
  'static': ['static-site-generators', 'developer-tools'],
  'markdown': ['documentation', 'developer-tools'],
  'content': ['cms', 'content-media'],
  'islands': ['frontend-development', 'developer-tools'],
  'templates': ['design', 'frontend-development'],
  'lms': ['education', 'business-software'],
  'learning': ['education', 'business-software'],
  'courses': ['education', 'business-software'],
  'education': ['education', 'business-software'],
  'quizzes': ['education', 'testing-qa'],
  'mobile': ['mobile', 'developer-tools'],
  'mooc': ['education', 'business-software'],
  'certifications': ['education', 'business-software'],
  'helpdesk': ['customer-service', 'business-software'],
  'ticketing': ['customer-service', 'business-software'],
  'support': ['customer-service', 'business-software'],
  'kb': ['knowledge-management', 'documentation'],
  'chat': ['communication-collaboration', 'team-chat'],
  'mailbox': ['communication-collaboration', 'productivity'],
  'shared': ['communication-collaboration', 'file-sharing'],
  'tickets': ['customer-service', 'business-software'],
  'itsm': ['customer-service', 'devops-infrastructure'],
  'service': ['customer-service', 'business-software'],
  'itil': ['devops-infrastructure', 'business-software'],
  'crm': ['crm', 'business-software'],
  'sales': ['crm', 'business-software'],
  'marketing': ['marketing-automation', 'business-software'],
  'automation': ['automation', 'workflow-automation'],
  'personal': ['productivity', 'self-hosting'],
  'relationships': ['crm', 'productivity'],
  'project': ['project-management', 'productivity'],
  'management': ['project-management', 'business-software'],
  'gantt': ['project-management', 'productivity'],
  'agile': ['project-management', 'developer-tools'],
  'scrum': ['project-management', 'agile'],
  'kanban': ['project-management', 'task-management'],
  'roadmaps': ['project-management', 'product-management'],
  'tables': ['productivity', 'database'],
  'notion': ['productivity', 'note-taking'],
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
