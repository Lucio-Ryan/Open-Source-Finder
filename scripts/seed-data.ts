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

const TechStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  category: String,
  website: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const TechStack = mongoose.models.TechStack || mongoose.model('TechStack', TechStackSchema);

// Categories from openalternative.co
const categories = [
  // AI & Machine Learning
  { name: 'AI & Machine Learning', slug: 'ai-machine-learning', description: 'Artificial intelligence and machine learning tools' },
  { name: 'AI Development Platforms', slug: 'ai-development-platforms', description: 'Platforms for building AI applications' },
  { name: 'Machine Learning Infrastructure', slug: 'machine-learning-infrastructure', description: 'Infrastructure for ML workflows' },
  { name: 'AI Security & Privacy', slug: 'ai-security-privacy', description: 'Security and privacy tools for AI' },
  { name: 'AI Interaction & Interfaces', slug: 'ai-interaction-interfaces', description: 'AI chatbots and interaction tools' },
  
  // Business Software
  { name: 'Business Software', slug: 'business-software', description: 'Software for business operations' },
  { name: 'CRM & Sales', slug: 'crm-sales', description: 'Customer relationship management and sales tools' },
  { name: 'ERP & Operations', slug: 'erp-operations', description: 'Enterprise resource planning systems' },
  { name: 'Finance & Accounting', slug: 'finance-accounting', description: 'Financial and accounting software' },
  { name: 'Human Resources (HR)', slug: 'human-resources-hr', description: 'HR management tools' },
  { name: 'Marketing & Customer Engagement', slug: 'marketing-customer-engagement', description: 'Marketing automation and engagement tools' },
  { name: 'Customer Support & Success', slug: 'customer-support-success', description: 'Customer support and success platforms' },
  
  // Communication & Collaboration
  { name: 'Communication & Collaboration', slug: 'communication-collaboration', description: 'Team communication and collaboration tools' },
  { name: 'Team Chat & Messaging', slug: 'team-chat-messaging', description: 'Real-time team messaging platforms' },
  { name: 'Video Conferencing', slug: 'video-conferencing', description: 'Video meeting and conferencing tools' },
  { name: 'Email & Newsletters', slug: 'email-newsletters', description: 'Email clients and newsletter platforms' },
  { name: 'Project Management', slug: 'project-management', description: 'Project and task management tools' },
  { name: 'Document Collaboration', slug: 'document-collaboration', description: 'Collaborative document editing' },
  { name: 'Knowledge Management', slug: 'knowledge-management', description: 'Knowledge bases and wikis' },
  
  // Content & Media
  { name: 'Content & Media', slug: 'content-media', description: 'Content creation and media tools' },
  { name: 'Content Management (CMS)', slug: 'content-management-cms', description: 'Content management systems' },
  { name: 'Blogging Platforms', slug: 'blogging-platforms', description: 'Blog creation and publishing' },
  { name: 'Digital Asset Management', slug: 'digital-asset-management', description: 'Managing digital assets' },
  { name: 'Video & Audio', slug: 'video-audio', description: 'Video and audio editing tools' },
  { name: 'Podcasting', slug: 'podcasting', description: 'Podcast creation and hosting' },
  { name: 'Social Media', slug: 'social-media', description: 'Social media management' },
  
  // Design & Creative
  { name: 'Design & Creative', slug: 'design-creative', description: 'Design and creative tools' },
  { name: 'Graphic Design', slug: 'graphic-design', description: 'Graphic design software' },
  { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and experience design' },
  { name: 'Prototyping & Wireframing', slug: 'prototyping-wireframing', description: 'Prototyping and wireframing tools' },
  { name: 'Photo Editing', slug: 'photo-editing', description: 'Photo editing and manipulation' },
  { name: '3D & Animation', slug: '3d-animation', description: '3D modeling and animation' },
  { name: 'Icon & Illustration', slug: 'icon-illustration', description: 'Icons and illustration tools' },
  
  // Developer Tools
  { name: 'Developer Tools', slug: 'developer-tools', description: 'Tools for software development' },
  { name: 'IDEs & Code Editors', slug: 'ides-code-editors', description: 'Integrated development environments' },
  { name: 'Version Control', slug: 'version-control', description: 'Git and version control tools' },
  { name: 'API Development', slug: 'api-development', description: 'API development and testing' },
  { name: 'CI/CD', slug: 'ci-cd', description: 'Continuous integration and deployment' },
  { name: 'Testing & QA', slug: 'testing-qa', description: 'Testing and quality assurance' },
  { name: 'Code Review', slug: 'code-review', description: 'Code review tools' },
  { name: 'Documentation', slug: 'documentation', description: 'Documentation tools' },
  { name: 'Terminal & CLI', slug: 'terminal-cli', description: 'Terminal and command line tools' },
  
  // Data & Analytics
  { name: 'Data & Analytics', slug: 'data-analytics', description: 'Data analysis and analytics tools' },
  { name: 'Business Intelligence', slug: 'business-intelligence', description: 'BI and reporting tools' },
  { name: 'Data Visualization', slug: 'data-visualization', description: 'Data visualization tools' },
  { name: 'ETL & Data Pipelines', slug: 'etl-data-pipelines', description: 'Data extraction and transformation' },
  { name: 'Analytics Platforms', slug: 'analytics-platforms', description: 'Web and product analytics' },
  { name: 'Data Warehousing', slug: 'data-warehousing', description: 'Data warehousing solutions' },
  
  // Database & Storage
  { name: 'Database & Storage', slug: 'database-storage', description: 'Database and storage solutions' },
  { name: 'Relational Databases', slug: 'relational-databases', description: 'SQL databases' },
  { name: 'NoSQL Databases', slug: 'nosql-databases', description: 'NoSQL and document databases' },
  { name: 'Database Management', slug: 'database-management', description: 'Database administration tools' },
  { name: 'Object Storage', slug: 'object-storage', description: 'Object and file storage' },
  { name: 'Backup & Recovery', slug: 'backup-recovery', description: 'Backup and disaster recovery' },
  
  // DevOps & Infrastructure
  { name: 'DevOps & Infrastructure', slug: 'devops-infrastructure', description: 'DevOps and infrastructure tools' },
  { name: 'Containerization', slug: 'containerization', description: 'Container tools like Docker' },
  { name: 'Orchestration', slug: 'orchestration', description: 'Container orchestration' },
  { name: 'Infrastructure as Code', slug: 'infrastructure-as-code', description: 'IaC tools' },
  { name: 'Monitoring & Observability', slug: 'monitoring-observability', description: 'Monitoring and logging tools' },
  { name: 'Cloud Platforms', slug: 'cloud-platforms', description: 'Cloud infrastructure platforms' },
  { name: 'Serverless', slug: 'serverless', description: 'Serverless computing' },
  
  // Security & Privacy
  { name: 'Security & Privacy', slug: 'security-privacy', description: 'Security and privacy tools' },
  { name: 'Authentication & Identity', slug: 'authentication-identity', description: 'Auth and identity management' },
  { name: 'Password Management', slug: 'password-management', description: 'Password managers' },
  { name: 'VPN & Networking', slug: 'vpn-networking', description: 'VPN and network security' },
  { name: 'Encryption', slug: 'encryption', description: 'Encryption tools' },
  { name: 'Security Scanning', slug: 'security-scanning', description: 'Security scanning and auditing' },
  
  // Productivity
  { name: 'Productivity', slug: 'productivity', description: 'Personal and team productivity tools' },
  { name: 'Note-Taking', slug: 'note-taking', description: 'Note-taking applications' },
  { name: 'Task Management', slug: 'task-management', description: 'To-do and task management' },
  { name: 'Calendar & Scheduling', slug: 'calendar-scheduling', description: 'Calendar and scheduling tools' },
  { name: 'Time Tracking', slug: 'time-tracking', description: 'Time tracking and timesheets' },
  { name: 'Bookmarks & Reading', slug: 'bookmarks-reading', description: 'Bookmark managers and read-later apps' },
  { name: 'Automation', slug: 'automation', description: 'Workflow automation tools' },
  
  // E-commerce
  { name: 'E-commerce', slug: 'e-commerce', description: 'E-commerce platforms and tools' },
  { name: 'Online Stores', slug: 'online-stores', description: 'E-commerce store platforms' },
  { name: 'Payment Processing', slug: 'payment-processing', description: 'Payment gateways and processing' },
  { name: 'Inventory Management', slug: 'inventory-management', description: 'Inventory and stock management' },
  
  // Education & Learning
  { name: 'Education & Learning', slug: 'education-learning', description: 'Educational tools and LMS' },
  { name: 'Learning Management (LMS)', slug: 'learning-management-lms', description: 'Learning management systems' },
  { name: 'Online Courses', slug: 'online-courses', description: 'Course creation platforms' },
  
  // Other Categories
  { name: 'Forms & Surveys', slug: 'forms-surveys', description: 'Form builders and survey tools' },
  { name: 'File Sharing', slug: 'file-sharing', description: 'File sharing and transfer' },
  { name: 'Screen Recording', slug: 'screen-recording', description: 'Screen capture and recording' },
  { name: 'Browser Extensions', slug: 'browser-extensions', description: 'Browser extensions and tools' },
  { name: 'Gaming', slug: 'gaming', description: 'Gaming and game development' },
  { name: 'Home Automation', slug: 'home-automation', description: 'Smart home and IoT' },
  { name: 'Health & Fitness', slug: 'health-fitness', description: 'Health and fitness tracking' },
  { name: 'Finance & Budgeting', slug: 'finance-budgeting', description: 'Personal finance tools' },
];

// Tech Stacks from openalternative.co
const techStacks = [
  // AI
  { name: 'OpenAI', slug: 'openai', category: 'AI', description: 'AI models and APIs by OpenAI' },
  { name: 'Anthropic', slug: 'anthropic', category: 'AI', description: 'Claude AI models by Anthropic' },
  { name: 'Ollama', slug: 'ollama', category: 'AI', description: 'Run LLMs locally' },
  { name: 'Mistral AI', slug: 'mistralai', category: 'AI', description: 'Open-weight AI models' },
  { name: 'Groq', slug: 'groq', category: 'AI', description: 'Fast AI inference' },
  { name: 'Gemini AI', slug: 'geminiai', category: 'AI', description: 'Google AI models' },
  { name: 'Hugging Face', slug: 'huggingface', category: 'AI', description: 'AI model hub and tools' },
  { name: 'Cohere AI', slug: 'cohereai', category: 'AI', description: 'Enterprise AI platform' },
  { name: 'LangChain', slug: 'langchain', category: 'AI', description: 'LLM application framework' },
  { name: 'LlamaIndex', slug: 'llamaindex', category: 'AI', description: 'Data framework for LLMs' },
  
  // Languages
  { name: 'TypeScript', slug: 'typescript', category: 'Language', description: 'Typed JavaScript superset' },
  { name: 'JavaScript', slug: 'javascript', category: 'Language', description: 'Web programming language' },
  { name: 'Python', slug: 'python', category: 'Language', description: 'General-purpose programming language' },
  { name: 'Go', slug: 'go', category: 'Language', description: 'Google\'s systems language' },
  { name: 'Rust', slug: 'rust', category: 'Language', description: 'Systems programming language' },
  { name: 'Java', slug: 'java', category: 'Language', description: 'Enterprise programming language' },
  { name: 'PHP', slug: 'php', category: 'Language', description: 'Web scripting language' },
  { name: 'Ruby', slug: 'ruby', category: 'Language', description: 'Dynamic programming language' },
  { name: 'C#', slug: 'csharp', category: 'Language', description: 'Microsoft\'s programming language' },
  { name: 'Swift', slug: 'swift', category: 'Language', description: 'Apple\'s programming language' },
  { name: 'Kotlin', slug: 'kotlin', category: 'Language', description: 'Modern JVM language' },
  { name: 'Elixir', slug: 'elixir', category: 'Language', description: 'Functional programming language' },
  { name: 'Scala', slug: 'scala', category: 'Language', description: 'Functional JVM language' },
  
  // Frontend Frameworks
  { name: 'React', slug: 'react', category: 'Frontend', description: 'UI component library' },
  { name: 'Vue.js', slug: 'vuejs', category: 'Frontend', description: 'Progressive JavaScript framework' },
  { name: 'Angular', slug: 'angular', category: 'Frontend', description: 'Google\'s web framework' },
  { name: 'Svelte', slug: 'svelte', category: 'Frontend', description: 'Compiler-based framework' },
  { name: 'Next.js', slug: 'nextjs', category: 'Frontend', description: 'React framework for production' },
  { name: 'Nuxt', slug: 'nuxt', category: 'Frontend', description: 'Vue.js framework' },
  { name: 'Remix', slug: 'remix', category: 'Frontend', description: 'Full stack web framework' },
  { name: 'Astro', slug: 'astro', category: 'Frontend', description: 'Content-focused web framework' },
  { name: 'SolidJS', slug: 'solidjs', category: 'Frontend', description: 'Reactive UI library' },
  { name: 'Qwik', slug: 'qwik', category: 'Frontend', description: 'Resumable framework' },
  
  // Backend Frameworks
  { name: 'Node.js', slug: 'nodejs', category: 'Backend', description: 'JavaScript runtime' },
  { name: 'Express', slug: 'express', category: 'Backend', description: 'Node.js web framework' },
  { name: 'Fastify', slug: 'fastify', category: 'Backend', description: 'Fast Node.js framework' },
  { name: 'NestJS', slug: 'nestjs', category: 'Backend', description: 'Progressive Node.js framework' },
  { name: 'Django', slug: 'django', category: 'Backend', description: 'Python web framework' },
  { name: 'Flask', slug: 'flask', category: 'Backend', description: 'Python micro framework' },
  { name: 'FastAPI', slug: 'fastapi', category: 'Backend', description: 'Modern Python API framework' },
  { name: 'Rails', slug: 'rails', category: 'Backend', description: 'Ruby web framework' },
  { name: 'Laravel', slug: 'laravel', category: 'Backend', description: 'PHP web framework' },
  { name: 'Spring Boot', slug: 'spring-boot', category: 'Backend', description: 'Java application framework' },
  { name: 'Gin', slug: 'gin', category: 'Backend', description: 'Go web framework' },
  { name: 'Fiber', slug: 'fiber', category: 'Backend', description: 'Express-inspired Go framework' },
  { name: 'Phoenix', slug: 'phoenix', category: 'Backend', description: 'Elixir web framework' },
  { name: 'Hono', slug: 'hono', category: 'Backend', description: 'Ultrafast web framework' },
  { name: 'Elysia', slug: 'elysia', category: 'Backend', description: 'Bun web framework' },
  
  // Databases
  { name: 'PostgreSQL', slug: 'postgresql', category: 'Database', description: 'Advanced open source database' },
  { name: 'MySQL', slug: 'mysql', category: 'Database', description: 'Popular relational database' },
  { name: 'MongoDB', slug: 'mongodb', category: 'Database', description: 'Document database' },
  { name: 'Redis', slug: 'redis', category: 'Database', description: 'In-memory data store' },
  { name: 'SQLite', slug: 'sqlite', category: 'Database', description: 'Embedded SQL database' },
  { name: 'Supabase', slug: 'supabase', category: 'Database', description: 'Open source Firebase alternative' },
  { name: 'PlanetScale', slug: 'planetscale', category: 'Database', description: 'Serverless MySQL platform' },
  { name: 'Prisma', slug: 'prisma', category: 'Database', description: 'Next-gen ORM' },
  { name: 'Drizzle', slug: 'drizzle', category: 'Database', description: 'TypeScript ORM' },
  { name: 'Turso', slug: 'turso', category: 'Database', description: 'Edge SQLite database' },
  { name: 'Neon', slug: 'neon', category: 'Database', description: 'Serverless Postgres' },
  { name: 'CockroachDB', slug: 'cockroachdb', category: 'Database', description: 'Distributed SQL database' },
  { name: 'Elasticsearch', slug: 'elasticsearch', category: 'Database', description: 'Search and analytics engine' },
  { name: 'ClickHouse', slug: 'clickhouse', category: 'Database', description: 'OLAP database' },
  
  // CSS & Styling
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'CSS', description: 'Utility-first CSS framework' },
  { name: 'shadcn/ui', slug: 'shadcn-ui', category: 'CSS', description: 'Re-usable components' },
  { name: 'Radix UI', slug: 'radix-ui', category: 'CSS', description: 'Unstyled UI primitives' },
  { name: 'Material UI', slug: 'material-ui', category: 'CSS', description: 'React component library' },
  { name: 'Chakra UI', slug: 'chakra-ui', category: 'CSS', description: 'Simple component library' },
  { name: 'Mantine', slug: 'mantine', category: 'CSS', description: 'React components library' },
  { name: 'Ant Design', slug: 'ant-design', category: 'CSS', description: 'Enterprise UI design' },
  { name: 'Bootstrap', slug: 'bootstrap', category: 'CSS', description: 'CSS framework' },
  { name: 'Sass', slug: 'sass', category: 'CSS', description: 'CSS preprocessor' },
  
  // Authentication
  { name: 'Auth.js', slug: 'authjs', category: 'Auth', description: 'Authentication for Next.js' },
  { name: 'NextAuth', slug: 'nextauth', category: 'Auth', description: 'Auth for Next.js (now Auth.js)' },
  { name: 'Clerk', slug: 'clerk', category: 'Auth', description: 'Authentication platform' },
  { name: 'Auth0', slug: 'auth0', category: 'Auth', description: 'Identity platform' },
  { name: 'Lucia', slug: 'lucia', category: 'Auth', description: 'Auth library' },
  { name: 'Keycloak', slug: 'keycloak', category: 'Auth', description: 'Identity and access management' },
  { name: 'Firebase Auth', slug: 'firebase-auth', category: 'Auth', description: 'Google authentication' },
  
  // Cloud & Hosting
  { name: 'Vercel', slug: 'vercel', category: 'Cloud', description: 'Frontend cloud platform' },
  { name: 'Netlify', slug: 'netlify', category: 'Cloud', description: 'Web development platform' },
  { name: 'AWS', slug: 'aws', category: 'Cloud', description: 'Amazon Web Services' },
  { name: 'Google Cloud', slug: 'google-cloud', category: 'Cloud', description: 'Google Cloud Platform' },
  { name: 'Azure', slug: 'azure', category: 'Cloud', description: 'Microsoft cloud platform' },
  { name: 'DigitalOcean', slug: 'digitalocean', category: 'Cloud', description: 'Cloud infrastructure' },
  { name: 'Cloudflare', slug: 'cloudflare', category: 'Cloud', description: 'Edge platform' },
  { name: 'Railway', slug: 'railway', category: 'Cloud', description: 'Infrastructure platform' },
  { name: 'Render', slug: 'render', category: 'Cloud', description: 'Cloud application platform' },
  { name: 'Fly.io', slug: 'flyio', category: 'Cloud', description: 'Global application platform' },
  
  // DevOps
  { name: 'Docker', slug: 'docker', category: 'DevOps', description: 'Containerization platform' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'DevOps', description: 'Container orchestration' },
  { name: 'GitHub Actions', slug: 'github-actions', category: 'DevOps', description: 'CI/CD platform' },
  { name: 'GitLab CI', slug: 'gitlab-ci', category: 'DevOps', description: 'GitLab CI/CD' },
  { name: 'Jenkins', slug: 'jenkins', category: 'DevOps', description: 'Automation server' },
  { name: 'Terraform', slug: 'terraform', category: 'DevOps', description: 'Infrastructure as code' },
  { name: 'Ansible', slug: 'ansible', category: 'DevOps', description: 'Automation tool' },
  
  // Monitoring
  { name: 'Prometheus', slug: 'prometheus', category: 'Monitoring', description: 'Monitoring system' },
  { name: 'Grafana', slug: 'grafana', category: 'Monitoring', description: 'Observability platform' },
  { name: 'Sentry', slug: 'sentry', category: 'Monitoring', description: 'Error tracking' },
  { name: 'Datadog', slug: 'datadog', category: 'Monitoring', description: 'Monitoring and analytics' },
  { name: 'New Relic', slug: 'new-relic', category: 'Monitoring', description: 'Observability platform' },
  
  // Mobile
  { name: 'React Native', slug: 'react-native', category: 'Mobile', description: 'Cross-platform mobile' },
  { name: 'Flutter', slug: 'flutter', category: 'Mobile', description: 'Google\'s UI toolkit' },
  { name: 'Expo', slug: 'expo', category: 'Mobile', description: 'React Native platform' },
  { name: 'Ionic', slug: 'ionic', category: 'Mobile', description: 'Hybrid mobile framework' },
  { name: 'Capacitor', slug: 'capacitor', category: 'Mobile', description: 'Cross-platform native runtime' },
  { name: 'Tauri', slug: 'tauri', category: 'Mobile', description: 'Desktop app framework' },
  { name: 'Electron', slug: 'electron', category: 'Mobile', description: 'Desktop apps with web tech' },
  
  // Payments
  { name: 'Stripe', slug: 'stripe', category: 'Payments', description: 'Payment processing' },
  { name: 'Paddle', slug: 'paddle', category: 'Payments', description: 'SaaS payments' },
  { name: 'LemonSqueezy', slug: 'lemonsqueezy', category: 'Payments', description: 'Digital product payments' },
  { name: 'PayPal', slug: 'paypal', category: 'Payments', description: 'Online payments' },
  
  // Other Tools
  { name: 'Resend', slug: 'resend', category: 'Email', description: 'Email API for developers' },
  { name: 'SendGrid', slug: 'sendgrid', category: 'Email', description: 'Email delivery platform' },
  { name: 'Postmark', slug: 'postmark', category: 'Email', description: 'Transactional email' },
  { name: 'Plausible', slug: 'plausible', category: 'Analytics', description: 'Privacy-focused analytics' },
  { name: 'PostHog', slug: 'posthog', category: 'Analytics', description: 'Product analytics' },
  { name: 'Umami', slug: 'umami', category: 'Analytics', description: 'Simple analytics' },
  { name: 'Bun', slug: 'bun', category: 'Runtime', description: 'Fast JavaScript runtime' },
  { name: 'Deno', slug: 'deno', category: 'Runtime', description: 'Secure JavaScript runtime' },
  { name: 'tRPC', slug: 'trpc', category: 'API', description: 'End-to-end typesafe APIs' },
  { name: 'GraphQL', slug: 'graphql', category: 'API', description: 'Query language for APIs' },
  { name: 'WebSocket', slug: 'websocket', category: 'API', description: 'Real-time communication' },
  { name: 'Socket.io', slug: 'socketio', category: 'API', description: 'Real-time engine' },
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Seed Categories
    console.log('\n📁 Seeding categories...');
    let categoryCount = 0;
    for (const category of categories) {
      try {
        await Category.findOneAndUpdate(
          { slug: category.slug },
          { ...category, updated_at: new Date() },
          { upsert: true, new: true }
        );
        categoryCount++;
        process.stdout.write(`\r   Added ${categoryCount}/${categories.length} categories`);
      } catch (err: any) {
        console.error(`\n   ❌ Error adding category ${category.name}:`, err.message);
      }
    }
    console.log(`\n✅ Seeded ${categoryCount} categories`);

    // Seed Tech Stacks
    console.log('\n🔧 Seeding tech stacks...');
    let stackCount = 0;
    for (const stack of techStacks) {
      try {
        await TechStack.findOneAndUpdate(
          { slug: stack.slug },
          { ...stack, updated_at: new Date() },
          { upsert: true, new: true }
        );
        stackCount++;
        process.stdout.write(`\r   Added ${stackCount}/${techStacks.length} tech stacks`);
      } catch (err: any) {
        console.error(`\n   ❌ Error adding tech stack ${stack.name}:`, err.message);
      }
    }
    console.log(`\n✅ Seeded ${stackCount} tech stacks`);

    console.log('\n🎉 Database seeding complete!');
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Tech Stacks: ${stackCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
