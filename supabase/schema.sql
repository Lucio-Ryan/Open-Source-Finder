-- OSS Finder - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'Code',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tech Stacks table
CREATE TABLE IF NOT EXISTS tech_stacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) DEFAULT 'Tool',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proprietary Software table
CREATE TABLE IF NOT EXISTS proprietary_software (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    website TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    github_username TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alternatives table
CREATE TABLE IF NOT EXISTS alternatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    long_description TEXT,
    icon_url TEXT,
    website TEXT NOT NULL,
    github TEXT NOT NULL,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    last_commit DATE,
    contributors INTEGER DEFAULT 0,
    license VARCHAR(255),
    is_self_hosted BOOLEAN DEFAULT FALSE,
    health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
    featured BOOLEAN DEFAULT FALSE,
    approved BOOLEAN DEFAULT FALSE,
    submitter_name VARCHAR(255),
    submitter_email VARCHAR(255),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    screenshots TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JUNCTION TABLES
-- ============================================

-- Alternative <-> Category junction
CREATE TABLE IF NOT EXISTS alternative_categories (
    alternative_id UUID REFERENCES alternatives(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (alternative_id, category_id)
);

-- Alternative <-> Tag junction
CREATE TABLE IF NOT EXISTS alternative_tags (
    alternative_id UUID REFERENCES alternatives(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (alternative_id, tag_id)
);

-- Alternative <-> Tech Stack junction
CREATE TABLE IF NOT EXISTS alternative_tech_stacks (
    alternative_id UUID REFERENCES alternatives(id) ON DELETE CASCADE,
    tech_stack_id UUID REFERENCES tech_stacks(id) ON DELETE CASCADE,
    PRIMARY KEY (alternative_id, tech_stack_id)
);

-- Alternative <-> Proprietary Software junction (what it's an alternative to)
CREATE TABLE IF NOT EXISTS alternative_to (
    alternative_id UUID REFERENCES alternatives(id) ON DELETE CASCADE,
    proprietary_id UUID REFERENCES proprietary_software(id) ON DELETE CASCADE,
    PRIMARY KEY (alternative_id, proprietary_id)
);

-- Proprietary Software <-> Category junction
CREATE TABLE IF NOT EXISTS proprietary_categories (
    proprietary_id UUID REFERENCES proprietary_software(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (proprietary_id, category_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_alternatives_slug ON alternatives(slug);
CREATE INDEX IF NOT EXISTS idx_alternatives_approved ON alternatives(approved);
CREATE INDEX IF NOT EXISTS idx_alternatives_featured ON alternatives(featured);
CREATE INDEX IF NOT EXISTS idx_alternatives_health_score ON alternatives(health_score DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_slug ON tech_stacks(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_proprietary_software_slug ON proprietary_software(slug);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp on alternatives
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_alternatives_updated_at ON alternatives;
CREATE TRIGGER update_alternatives_updated_at
    BEFORE UPDATE ON alternatives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup (auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE proprietary_software ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_to ENABLE ROW LEVEL SECURITY;
ALTER TABLE proprietary_categories ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Public read access policies
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tech_stacks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON proprietary_software FOR SELECT USING (true);
CREATE POLICY "Allow public read approved alternatives" ON alternatives FOR SELECT USING (approved = true);
CREATE POLICY "Users can view their own alternatives" ON alternatives FOR SELECT USING (user_id = auth.uid() OR submitter_email = (SELECT email FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow public read access" ON alternative_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON alternative_tags FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON alternative_tech_stacks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON alternative_to FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON proprietary_categories FOR SELECT USING (true);

-- Public insert access for alternatives (submissions)
CREATE POLICY "Allow public insert" ON alternatives FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON alternative_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON alternative_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON alternative_tech_stacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON alternative_to FOR INSERT WITH CHECK (true);

-- Users can update their own alternatives
CREATE POLICY "Users can update their own alternatives" ON alternatives FOR UPDATE USING (user_id = auth.uid() OR submitter_email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Categories (comprehensive list from openalternative.co)
INSERT INTO categories (name, slug, description, icon) VALUES
    -- AI & Machine Learning
    ('AI & Machine Learning', 'ai-machine-learning', 'Artificial intelligence and machine learning tools and platforms', 'Brain'),
    ('AI Development Platforms', 'ai-development-platforms', 'Platforms for developing AI and ML applications', 'Brain'),
    ('Machine Learning Infrastructure', 'machine-learning-infrastructure', 'Infrastructure for training and deploying ML models', 'Server'),
    ('AI Security & Privacy', 'ai-security-privacy', 'Security and privacy tools for AI systems', 'Shield'),
    ('AI Interaction & Interfaces', 'ai-interaction-interfaces', 'Tools for interacting with AI systems', 'MessageCircle'),
    
    -- Business Software
    ('Business Software', 'business-software', 'Software for business operations and management', 'Briefcase'),
    ('CRM & Sales', 'crm-sales', 'Customer relationship management and sales tools', 'Users'),
    ('CRM Systems', 'crm-systems', 'Full-featured CRM platforms', 'Users'),
    ('ERP & Operations', 'erp-operations', 'Enterprise resource planning and operations management', 'Building'),
    ('Finance & Accounting', 'finance-accounting', 'Financial management and accounting software', 'DollarSign'),
    ('Human Resources (HR)', 'human-resources-hr', 'HR management and recruitment tools', 'UserPlus'),
    ('Marketing & Customer Engagement', 'marketing-customer-engagement', 'Marketing automation and customer engagement platforms', 'Megaphone'),
    ('Customer Support & Success', 'customer-support-success', 'Customer support and success management tools', 'HeadphonesIcon'),
    ('E-commerce Platforms', 'e-commerce-platforms', 'Online store and e-commerce solutions', 'ShoppingCart'),
    ('Project & Work Management', 'project-work-management', 'Project management and team collaboration tools', 'ClipboardList'),
    ('Project Management Suites', 'project-management-suites', 'Comprehensive project management platforms', 'ClipboardList'),
    ('Scheduling & Event Management', 'scheduling-event-management', 'Appointment scheduling and event management', 'Calendar'),
    ('Collaboration & Communication', 'collaboration-communication', 'Team communication and collaboration tools', 'MessageCircle'),
    ('Social Media Management', 'social-media-management', 'Tools for managing social media presence', 'Share2'),
    
    -- Content & Publishing
    ('Content & Publishing', 'content-publishing', 'Content creation, management, and publishing tools', 'FileText'),
    ('Content Management Systems (CMS)', 'content-management-systems-cms', 'Website and content management platforms', 'Globe'),
    ('Headless CMS', 'headless-cms', 'API-first content management systems', 'Code'),
    ('Documentation & Knowledge Base', 'documentation-knowledge-base', 'Documentation and wiki platforms', 'BookOpen'),
    ('Learning Management Systems (LMS)', 'learning-management-systems-lms', 'E-learning and course management platforms', 'GraduationCap'),
    ('Publishing Tools', 'publishing-tools', 'Tools for digital publishing and blogging', 'Edit'),
    ('Translation Management', 'translation-management', 'Localization and translation management', 'Languages'),
    
    -- Data & Analytics
    ('Data & Analytics', 'data-analytics', 'Data analysis, visualization, and business intelligence', 'BarChart3'),
    ('Analytics', 'analytics', 'Web and product analytics tools', 'TrendingUp'),
    ('Web Analytics', 'web-analytics', 'Website traffic and user behavior analytics', 'Activity'),
    ('Product Analytics', 'product-analytics', 'User behavior and product usage analytics', 'PieChart'),
    ('Business Intelligence & Reporting', 'business-intelligence-reporting', 'BI dashboards and reporting tools', 'BarChart'),
    ('Data Visualization', 'data-visualization', 'Charts, graphs, and data visualization tools', 'LineChart'),
    ('Data Pipelines & ETL', 'data-pipelines-etl', 'Extract, transform, load and data pipeline tools', 'GitMerge'),
    
    -- Developer Tools
    ('Developer Tools', 'developer-tools', 'Tools and platforms for software development', 'Code'),
    ('IDEs & Code Editors', 'ides-code-editors', 'Integrated development environments and text editors', 'Terminal'),
    ('API Development & Testing', 'api-development-testing', 'API design, testing, and documentation tools', 'Plug'),
    ('API Infrastructure', 'api-infrastructure', 'API gateways and management platforms', 'Server'),
    ('Version Control', 'version-control', 'Source code management and version control', 'GitBranch'),
    ('CI/CD & DevOps', 'cicd-devops', 'Continuous integration and deployment tools', 'RefreshCw'),
    ('Frameworks & Platforms', 'frameworks-platforms', 'Development frameworks and platforms', 'Layers'),
    ('Backend as a Service (BaaS)', 'backend-as-a-service-baas', 'Backend infrastructure and services', 'Database'),
    ('Low-Code & No-Code Platforms', 'low-code-no-code-platforms', 'Visual development and no-code tools', 'Layout'),
    ('Website Builders', 'website-builders', 'Drag-and-drop website creation tools', 'PanelsTopLeft'),
    ('Build & Deployment', 'build-deployment', 'Build tools and deployment platforms', 'Package'),
    ('PaaS & Deployment Tools', 'paas-deployment-tools', 'Platform as a service and deployment solutions', 'CloudUpload'),
    
    -- Infrastructure & Operations
    ('Infrastructure & Operations', 'infrastructure-operations', 'Infrastructure management and DevOps tools', 'Server'),
    ('Monitoring & Observability', 'monitoring-observability', 'System monitoring and application observability', 'Activity'),
    ('Log Management', 'log-management', 'Log aggregation and analysis tools', 'FileText'),
    ('Error Tracking', 'error-tracking', 'Application error and exception tracking', 'AlertTriangle'),
    ('Databases', 'databases', 'Database management systems and tools', 'Database'),
    ('Cloud Infrastructure Management', 'cloud-infrastructure-management', 'Cloud resource management and IaC tools', 'Cloud'),
    ('Infrastructure as Code (IaC)', 'infrastructure-as-code-iac', 'Infrastructure provisioning and management', 'FileCode'),
    ('Container Orchestration', 'container-orchestration', 'Container management and orchestration platforms', 'Box'),
    ('Server & VM Management', 'server-vm-management', 'Server and virtual machine management', 'HardDrive'),
    ('Control Panels', 'control-panels', 'Server and hosting control panels', 'Settings'),
    ('Storage Solutions', 'storage-solutions', 'Data storage and file management', 'HardDrive'),
    ('Cloud Storage', 'cloud-storage', 'Cloud-based file storage and sync', 'Cloud'),
    
    -- Security & Privacy
    ('Security & Privacy', 'security-privacy', 'Security tools and privacy solutions', 'Shield'),
    ('Identity & Access Management (IAM)', 'identity-access-management-iam', 'User authentication and authorization', 'Key'),
    ('Authentication & SSO Providers', 'authentication-sso-providers', 'Single sign-on and authentication services', 'Lock'),
    ('Secrets Management', 'secrets-management', 'Secure storage for credentials and secrets', 'KeyRound'),
    ('Application Security', 'application-security', 'Security testing and vulnerability scanning', 'ShieldCheck'),
    ('Feature Flags', 'feature-flags', 'Feature flag and toggle management', 'Flag'),
    ('VPN & Network Security', 'vpn-network-security', 'VPN and network security tools', 'Network'),
    ('Password Management', 'password-management', 'Password managers and credential vaults', 'Lock'),
    
    -- Productivity & Utilities
    ('Productivity & Utilities', 'productivity-utilities', 'Personal and team productivity tools', 'Zap'),
    ('Note-Taking & Knowledge Management', 'note-taking-knowledge-management', 'Notes, wikis, and personal knowledge bases', 'FileText'),
    ('Time & Task Management', 'time-task-management', 'Time tracking and task management apps', 'Clock'),
    ('Time Tracking', 'time-tracking', 'Time logging and timesheet tools', 'Timer'),
    ('Automation Tools', 'automation-tools', 'Workflow automation and integration platforms', 'Cog'),
    ('Workflow Automation Platforms', 'workflow-automation-platforms', 'No-code automation and workflow tools', 'GitMerge'),
    ('Email & Communication', 'email-communication', 'Email clients and communication tools', 'Mail'),
    ('File Management & Sync', 'file-management-sync', 'File organization and synchronization', 'Folder'),
    ('Cloud File Sync & Share', 'cloud-file-sync-share', 'Cloud file storage and sharing services', 'Upload'),
    ('Screen Capture & Recording', 'screen-capture-recording', 'Screenshot and screen recording tools', 'Monitor'),
    ('Screen Recording Tools', 'screen-recording-tools', 'Screen recording and video capture', 'Video'),
    ('Personal Finance Management', 'personal-finance-management', 'Budgeting and personal finance apps', 'Wallet'),
    
    -- Community & Social
    ('Community & Social', 'community-social', 'Community building and social platforms', 'Users'),
    ('Community Building Platforms', 'community-building-platforms', 'Forums, communities, and social networks', 'Users'),
    ('Forum Software', 'forum-software', 'Discussion forums and bulletin boards', 'MessageSquare'),
    
    -- Specialized Industries
    ('Specialized Industries', 'specialized-industries', 'Industry-specific software solutions', 'Building2'),
    ('Design & Prototyping', 'design-prototyping', 'UI/UX design and prototyping tools', 'Palette'),
    ('Finance & Fintech', 'finance-fintech', 'Financial technology solutions', 'Landmark'),
    ('Healthcare', 'healthcare', 'Healthcare and medical software', 'Heart'),
    ('Media & Entertainment', 'media-entertainment', 'Media production and entertainment tools', 'Film'),
    ('Video Editing', 'video-editing', 'Video editing and production software', 'Video'),
    ('Audio & Music', 'audio-music', 'Audio production and music tools', 'Music'),
    ('Gaming', 'gaming', 'Game development and gaming platforms', 'Gamepad2')
ON CONFLICT (slug) DO NOTHING;

-- Insert Tech Stacks (comprehensive list from openalternative.co with types)
INSERT INTO tech_stacks (name, slug, type) VALUES
    -- AI (type: SaaS/API providers)
    ('OpenAI', 'openai', 'SaaS'),
    ('Anthropic', 'anthropic', 'SaaS'),
    ('Ollama', 'ollama', 'Tool'),
    ('Mistral AI', 'mistralai', 'SaaS'),
    ('Groq', 'groq', 'SaaS'),
    ('Gemini AI', 'geminiai', 'SaaS'),
    ('Hugging Face', 'huggingface', 'SaaS'),
    ('Cohere AI', 'cohereai', 'SaaS'),
    ('Replicate', 'replicate', 'SaaS'),
    ('LangChain', 'langchain', 'Framework'),
    ('LlamaIndex', 'llamaindex', 'Framework'),
    
    -- Languages
    ('JavaScript', 'javascript', 'Language'),
    ('TypeScript', 'typescript', 'Language'),
    ('Python', 'python', 'Language'),
    ('Go', 'go', 'Language'),
    ('Rust', 'rust', 'Language'),
    ('Java', 'java', 'Language'),
    ('PHP', 'php', 'Language'),
    ('Ruby', 'ruby', 'Language'),
    ('Elixir', 'elixir', 'Language'),
    ('Clojure', 'clojure', 'Language'),
    ('C#', 'csharp', 'Language'),
    ('C++', 'cpp', 'Language'),
    ('Swift', 'swift', 'Language'),
    ('Kotlin', 'kotlin', 'Language'),
    ('Scala', 'scala', 'Language'),
    ('Haskell', 'haskell', 'Language'),
    ('Lua', 'lua', 'Language'),
    ('Zig', 'zig', 'Language'),
    
    -- Frontend Frameworks
    ('React', 'react', 'Framework'),
    ('Vue.js', 'vuejs', 'Framework'),
    ('Angular', 'angular', 'Framework'),
    ('Svelte', 'svelte', 'Framework'),
    ('Next.js', 'nextjs', 'Framework'),
    ('Nuxt.js', 'nuxtjs', 'Framework'),
    ('Astro', 'astro', 'Framework'),
    ('Remix', 'remix', 'Framework'),
    ('Solid', 'solid', 'Framework'),
    ('Qwik', 'qwik', 'Framework'),
    ('Alpine.js', 'alpinejs', 'Framework'),
    ('HTMX', 'htmx', 'Framework'),
    ('Ember.js', 'emberjs', 'Framework'),
    
    -- Backend Frameworks
    ('Node.js', 'nodejs', 'Framework'),
    ('Express', 'express', 'Framework'),
    ('Fastify', 'fastify', 'Framework'),
    ('NestJS', 'nestjs', 'Framework'),
    ('Django', 'django', 'Framework'),
    ('Flask', 'flask', 'Framework'),
    ('FastAPI', 'fastapi', 'Framework'),
    ('Rails', 'rails', 'Framework'),
    ('Laravel', 'laravel', 'Framework'),
    ('Spring Boot', 'spring-boot', 'Framework'),
    ('Phoenix', 'phoenix', 'Framework'),
    ('Gin', 'gin', 'Framework'),
    ('Fiber', 'fiber', 'Framework'),
    ('Echo', 'echo', 'Framework'),
    ('Actix', 'actix', 'Framework'),
    ('Axum', 'axum', 'Framework'),
    ('.NET', 'dotnet', 'Framework'),
    ('Hono', 'hono', 'Framework'),
    
    -- Mobile
    ('Flutter', 'flutter', 'Framework'),
    ('React Native', 'react-native', 'Framework'),
    ('Expo', 'expo', 'Framework'),
    ('Capacitor', 'capacitor', 'Framework'),
    ('Ionic', 'ionic', 'Framework'),
    ('Tauri', 'tauri', 'Framework'),
    ('Electron', 'electron', 'Framework'),
    
    -- Databases
    ('PostgreSQL', 'postgresql', 'DB'),
    ('MySQL', 'mysql', 'DB'),
    ('MongoDB', 'mongodb', 'DB'),
    ('Redis', 'redis', 'DB'),
    ('SQLite', 'sqlite', 'DB'),
    ('Cassandra', 'cassandra', 'DB'),
    ('ClickHouse', 'clickhouse', 'DB'),
    ('Elasticsearch', 'elasticsearch', 'DB'),
    ('DynamoDB', 'dynamodb', 'DB'),
    ('CockroachDB', 'cockroachdb', 'DB'),
    ('TimescaleDB', 'timescaledb', 'DB'),
    ('InfluxDB', 'influxdb', 'DB'),
    ('Neo4j', 'neo4j', 'DB'),
    ('Supabase', 'supabase', 'DB'),
    ('PlanetScale', 'planetscale', 'DB'),
    ('Neon', 'neon', 'DB'),
    ('Turso', 'turso', 'DB'),
    ('Drizzle', 'drizzle', 'Tool'),
    ('Prisma', 'prisma', 'Tool'),
    
    -- Cloud & Hosting
    ('AWS', 'aws', 'Cloud'),
    ('Google Cloud', 'google-cloud', 'Cloud'),
    ('Azure', 'azure', 'Cloud'),
    ('Vercel', 'vercel', 'Hosting'),
    ('Netlify', 'netlify', 'Hosting'),
    ('Cloudflare', 'cloudflare', 'Cloud'),
    ('DigitalOcean', 'digitalocean', 'Cloud'),
    ('Hetzner', 'hetzner', 'Cloud'),
    ('Fly.io', 'flyio', 'Hosting'),
    ('Railway', 'railway', 'Hosting'),
    ('Render', 'render', 'Hosting'),
    ('Coolify', 'coolify', 'Hosting'),
    ('Dokku', 'dokku', 'Hosting'),
    
    -- DevOps & CI/CD
    ('Docker', 'docker', 'Tool'),
    ('Kubernetes', 'kubernetes', 'Tool'),
    ('Terraform', 'terraform', 'Tool'),
    ('Ansible', 'ansible', 'Tool'),
    ('GitHub Actions', 'github-actions', 'CI'),
    ('GitLab CI', 'gitlab-ci', 'CI'),
    ('Jenkins', 'jenkins', 'CI'),
    ('CircleCI', 'circleci', 'CI'),
    ('ArgoCD', 'argocd', 'CI'),
    ('Helm', 'helm', 'Tool'),
    ('Pulumi', 'pulumi', 'Tool'),
    
    -- Monitoring & Analytics
    ('Prometheus', 'prometheus', 'Monitoring'),
    ('Grafana', 'grafana', 'Monitoring'),
    ('Datadog', 'datadog', 'Monitoring'),
    ('Sentry', 'sentry', 'Monitoring'),
    ('New Relic', 'new-relic', 'Monitoring'),
    ('Jaeger', 'jaeger', 'Monitoring'),
    ('OpenTelemetry', 'opentelemetry', 'Monitoring'),
    ('Plausible', 'plausible', 'Analytics'),
    ('PostHog', 'posthog', 'Analytics'),
    ('Mixpanel', 'mixpanel', 'Analytics'),
    ('Amplitude', 'amplitude', 'Analytics'),
    ('Segment', 'segment', 'Analytics'),
    
    -- Auth & Security
    ('Auth0', 'auth0', 'SaaS'),
    ('Clerk', 'clerk', 'SaaS'),
    ('NextAuth', 'nextauth', 'Tool'),
    ('Keycloak', 'keycloak', 'Tool'),
    ('Authelia', 'authelia', 'Tool'),
    ('Vault', 'vault', 'Tool'),
    ('OAuth', 'oauth', 'Tool'),
    
    -- Messaging & Queues
    ('RabbitMQ', 'rabbitmq', 'Messaging'),
    ('Kafka', 'kafka', 'Messaging'),
    ('NATS', 'nats', 'Messaging'),
    ('BullMQ', 'bullmq', 'Messaging'),
    ('Celery', 'celery', 'Messaging'),
    
    -- Storage
    ('S3', 's3', 'Storage'),
    ('MinIO', 'minio', 'Storage'),
    ('Cloudflare R2', 'cloudflare-r2', 'Storage'),
    
    -- API & Communication
    ('GraphQL', 'graphql', 'API'),
    ('gRPC', 'grpc', 'API'),
    ('tRPC', 'trpc', 'API'),
    ('REST', 'rest', 'API'),
    ('WebSocket', 'websocket', 'API'),
    ('Stripe', 'stripe', 'SaaS'),
    ('Twilio', 'twilio', 'SaaS'),
    ('SendGrid', 'sendgrid', 'SaaS'),
    ('Resend', 'resend', 'SaaS'),
    
    -- Testing
    ('Jest', 'jest', 'Tool'),
    ('Vitest', 'vitest', 'Tool'),
    ('Playwright', 'playwright', 'Tool'),
    ('Cypress', 'cypress', 'Tool'),
    ('Pytest', 'pytest', 'Tool'),
    
    -- Build Tools
    ('Webpack', 'webpack', 'Tool'),
    ('Vite', 'vite', 'Tool'),
    ('esbuild', 'esbuild', 'Tool'),
    ('Turbo', 'turbo', 'Tool'),
    ('pnpm', 'pnpm', 'Tool'),
    ('Bun', 'bun', 'Tool'),
    ('Deno', 'deno', 'Tool'),
    
    -- CMS & Content
    ('Strapi', 'strapi', 'Framework'),
    ('Directus', 'directus', 'Framework'),
    ('Payload', 'payload', 'Framework'),
    ('Sanity', 'sanity', 'SaaS'),
    ('Contentful', 'contentful', 'SaaS'),
    ('Ghost', 'ghost', 'Framework'),
    ('WordPress', 'wordpress', 'Framework'),
    
    -- Search
    ('Algolia', 'algolia', 'SaaS'),
    ('MeiliSearch', 'meilisearch', 'Tool'),
    ('Typesense', 'typesense', 'Tool'),
    
    -- Other Tools
    ('Nginx', 'nginx', 'Tool'),
    ('Caddy', 'caddy', 'Tool'),
    ('Traefik', 'traefik', 'Tool'),
    ('Git', 'git', 'Tool'),
    ('Linux', 'linux', 'Tool'),
    ('Markdown', 'markdown', 'Tool'),
    ('WebAssembly', 'webassembly', 'Tool'),
    ('TailwindCSS', 'tailwindcss', 'Framework'),
    ('Sass', 'sass', 'Tool'),
    ('Storybook', 'storybook', 'Tool'),
    ('Figma', 'figma', 'App'),
    ('Framer', 'framer', 'App')
ON CONFLICT (slug) DO NOTHING;

-- Insert Tags
INSERT INTO tags (name, slug) VALUES
    ('Self-Hosted', 'self-hosted'),
    ('Privacy-Focused', 'privacy-focused'),
    ('AI-Powered', 'ai-powered'),
    ('Free Forever', 'free-forever'),
    ('Enterprise Ready', 'enterprise-ready'),
    ('No-Code', 'no-code'),
    ('Open API', 'open-api'),
    ('Cross-Platform', 'cross-platform')
ON CONFLICT (slug) DO NOTHING;

-- Insert Proprietary Software
INSERT INTO proprietary_software (name, slug, description, website) VALUES
    ('Notion', 'notion', 'All-in-one workspace for notes, docs, and collaboration', 'https://notion.so'),
    ('Slack', 'slack', 'Business communication platform', 'https://slack.com'),
    ('Trello', 'trello', 'Visual project management tool', 'https://trello.com'),
    ('Figma', 'figma', 'Collaborative design tool', 'https://figma.com'),
    ('Google Analytics', 'google-analytics', 'Web analytics service', 'https://analytics.google.com'),
    ('Dropbox', 'dropbox', 'Cloud storage and file synchronization', 'https://dropbox.com'),
    ('1Password', '1password', 'Password manager', 'https://1password.com'),
    ('Mailchimp', 'mailchimp', 'Email marketing platform', 'https://mailchimp.com')
ON CONFLICT (slug) DO NOTHING;

-- Link proprietary software to categories
INSERT INTO proprietary_categories (proprietary_id, category_id)
SELECT p.id, c.id FROM proprietary_software p, categories c
WHERE (p.slug = 'notion' AND c.slug IN ('note-taking-knowledge-management', 'project-work-management'))
   OR (p.slug = 'slack' AND c.slug = 'collaboration-communication')
   OR (p.slug = 'trello' AND c.slug = 'project-work-management')
   OR (p.slug = 'figma' AND c.slug = 'design-prototyping')
   OR (p.slug = 'google-analytics' AND c.slug IN ('analytics', 'web-analytics'))
   OR (p.slug = 'dropbox' AND c.slug IN ('cloud-storage', 'file-management-sync'))
   OR (p.slug = '1password' AND c.slug = 'password-management')
   OR (p.slug = 'mailchimp' AND c.slug IN ('email-communication', 'marketing-customer-engagement'))
ON CONFLICT DO NOTHING;

-- Insert sample alternatives
INSERT INTO alternatives (name, slug, description, long_description, website, github, stars, forks, last_commit, contributors, license, is_self_hosted, health_score, pricing, featured, approved) VALUES
    ('Appflowy', 'appflowy', 'Open-source alternative to Notion. AI collaborative workspace where you achieve more without losing control of your data.', 'AppFlowy is an open-source alternative to Notion. You are in charge of your data and customizations. Built with Flutter and Rust.', 'https://appflowy.io', 'https://github.com/AppFlowy-IO/AppFlowy', 48000, 3100, '2024-01-15', 280, 'AGPL-3.0', true, 95, 'open-source', true, true),
    ('Mattermost', 'mattermost', 'Open source platform for secure collaboration across the entire software development lifecycle.', 'Mattermost is a secure, open source platform for communication, collaboration, and workflow orchestration across tools and teams.', 'https://mattermost.com', 'https://github.com/mattermost/mattermost', 28000, 6800, '2024-01-14', 850, 'MIT', true, 92, 'freemium', true, true),
    ('Rocket.Chat', 'rocket-chat', 'Communications platform that puts data protection first. Secure team chat, video conferencing, and file sharing.', NULL, 'https://rocket.chat', 'https://github.com/RocketChat/Rocket.Chat', 38000, 9500, '2024-01-15', 950, 'MIT', true, 90, 'freemium', false, true),
    ('Penpot', 'penpot', 'The open-source design and prototyping platform for design and code collaboration.', NULL, 'https://penpot.app', 'https://github.com/penpot/penpot', 26000, 1200, '2024-01-14', 180, 'MPL-2.0', true, 88, 'open-source', true, true),
    ('Plausible', 'plausible', 'Simple, open-source, lightweight and privacy-friendly Google Analytics alternative.', NULL, 'https://plausible.io', 'https://github.com/plausible/analytics', 18000, 980, '2024-01-13', 120, 'AGPL-3.0', true, 94, 'freemium', true, true),
    ('Umami', 'umami', 'Umami is a simple, fast, privacy-focused alternative to Google Analytics.', NULL, 'https://umami.is', 'https://github.com/umami-software/umami', 19000, 3800, '2024-01-15', 200, 'MIT', true, 91, 'open-source', false, true),
    ('Nextcloud', 'nextcloud', 'The self-hosted productivity platform that keeps you in control. Files, communication, collaboration.', NULL, 'https://nextcloud.com', 'https://github.com/nextcloud/server', 25000, 3800, '2024-01-15', 1500, 'AGPL-3.0', true, 96, 'open-source', true, true),
    ('Bitwarden', 'bitwarden', 'Open source password management solutions for individuals, teams, and business organizations.', NULL, 'https://bitwarden.com', 'https://github.com/bitwarden/server', 14000, 1200, '2024-01-14', 250, 'AGPL-3.0', true, 95, 'freemium', true, true),
    ('Plane', 'plane', 'Open source JIRA, Linear and Asana alternative. Plane helps you track your issues, epics, and product roadmaps.', NULL, 'https://plane.so', 'https://github.com/makeplane/plane', 24000, 1300, '2024-01-15', 150, 'AGPL-3.0', true, 89, 'open-source', true, true),
    ('Listmonk', 'listmonk', 'High performance, self-hosted newsletter and mailing list manager with a modern dashboard.', NULL, 'https://listmonk.app', 'https://github.com/knadh/listmonk', 13000, 1200, '2024-01-10', 100, 'AGPL-3.0', true, 86, 'open-source', false, true),
    ('Logseq', 'logseq', 'A privacy-first, open-source platform for knowledge management and collaboration.', NULL, 'https://logseq.com', 'https://github.com/logseq/logseq', 29000, 1700, '2024-01-14', 200, 'AGPL-3.0', true, 91, 'open-source', true, true),
    ('Ollama', 'ollama', 'Get up and running with large language models locally. Run Llama 2, Code Llama, and other models.', NULL, 'https://ollama.ai', 'https://github.com/ollama/ollama', 52000, 3800, '2024-01-15', 300, 'MIT', true, 98, 'open-source', true, true),
    ('n8n', 'n8n', 'Free and source-available fair-code licensed workflow automation tool.', NULL, 'https://n8n.io', 'https://github.com/n8n-io/n8n', 40000, 5200, '2024-01-15', 400, 'Fair-code', true, 93, 'freemium', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Link alternatives to categories
INSERT INTO alternative_categories (alternative_id, category_id)
SELECT a.id, c.id FROM alternatives a, categories c
WHERE (a.slug = 'appflowy' AND c.slug IN ('note-taking-knowledge-management', 'project-work-management'))
   OR (a.slug = 'mattermost' AND c.slug = 'collaboration-communication')
   OR (a.slug = 'rocket-chat' AND c.slug = 'collaboration-communication')
   OR (a.slug = 'penpot' AND c.slug = 'design-prototyping')
   OR (a.slug = 'plausible' AND c.slug IN ('analytics', 'web-analytics'))
   OR (a.slug = 'umami' AND c.slug IN ('analytics', 'web-analytics'))
   OR (a.slug = 'nextcloud' AND c.slug IN ('cloud-storage', 'file-management-sync'))
   OR (a.slug = 'bitwarden' AND c.slug = 'password-management')
   OR (a.slug = 'plane' AND c.slug IN ('project-work-management', 'project-management-suites'))
   OR (a.slug = 'listmonk' AND c.slug IN ('email-communication', 'marketing-customer-engagement'))
   OR (a.slug = 'logseq' AND c.slug = 'note-taking-knowledge-management')
   OR (a.slug = 'ollama' AND c.slug IN ('ai-machine-learning', 'ai-development-platforms'))
   OR (a.slug = 'n8n' AND c.slug IN ('developer-tools', 'workflow-automation-platforms'))
ON CONFLICT DO NOTHING;

-- Link alternatives to tags
INSERT INTO alternative_tags (alternative_id, tag_id)
SELECT a.id, t.id FROM alternatives a, tags t
WHERE (a.slug = 'appflowy' AND t.slug IN ('self-hosted', 'privacy-focused', 'cross-platform'))
   OR (a.slug = 'mattermost' AND t.slug IN ('self-hosted', 'enterprise-ready', 'open-api'))
   OR (a.slug = 'rocket-chat' AND t.slug IN ('self-hosted', 'privacy-focused', 'enterprise-ready'))
   OR (a.slug = 'penpot' AND t.slug IN ('self-hosted', 'free-forever', 'cross-platform'))
   OR (a.slug = 'plausible' AND t.slug IN ('self-hosted', 'privacy-focused', 'free-forever'))
   OR (a.slug = 'umami' AND t.slug IN ('self-hosted', 'privacy-focused'))
   OR (a.slug = 'nextcloud' AND t.slug IN ('self-hosted', 'privacy-focused', 'enterprise-ready'))
   OR (a.slug = 'bitwarden' AND t.slug IN ('self-hosted', 'privacy-focused', 'cross-platform'))
   OR (a.slug = 'plane' AND t.slug IN ('self-hosted', 'free-forever'))
   OR (a.slug = 'listmonk' AND t.slug IN ('self-hosted', 'free-forever'))
   OR (a.slug = 'logseq' AND t.slug IN ('self-hosted', 'privacy-focused', 'free-forever'))
   OR (a.slug = 'ollama' AND t.slug IN ('self-hosted', 'privacy-focused', 'ai-powered'))
   OR (a.slug = 'n8n' AND t.slug IN ('self-hosted', 'no-code', 'open-api'))
ON CONFLICT DO NOTHING;

-- Link alternatives to tech stacks
INSERT INTO alternative_tech_stacks (alternative_id, tech_stack_id)
SELECT a.id, ts.id FROM alternatives a, tech_stacks ts
WHERE (a.slug = 'appflowy' AND ts.slug IN ('rust', 'flutter'))
   OR (a.slug = 'mattermost' AND ts.slug IN ('go', 'react', 'typescript'))
   OR (a.slug = 'rocket-chat' AND ts.slug IN ('nodejs', 'typescript', 'react'))
   OR (a.slug = 'penpot' AND ts.slug IN ('clojure', 'react'))
   OR (a.slug = 'plausible' AND ts.slug IN ('elixir', 'react'))
   OR (a.slug = 'umami' AND ts.slug IN ('nodejs', 'react', 'typescript'))
   OR (a.slug = 'nextcloud' AND ts.slug IN ('php', 'vuejs'))
   OR (a.slug = 'bitwarden' AND ts.slug IN ('csharp', 'typescript'))
   OR (a.slug = 'plane' AND ts.slug IN ('python', 'react', 'typescript'))
   OR (a.slug = 'listmonk' AND ts.slug IN ('go', 'vuejs'))
   OR (a.slug = 'logseq' AND ts.slug IN ('clojure', 'react'))
   OR (a.slug = 'ollama' AND ts.slug = 'go')
   OR (a.slug = 'n8n' AND ts.slug IN ('typescript', 'nodejs', 'vuejs'))
ON CONFLICT DO NOTHING;

-- Link alternatives to what they're alternatives to
INSERT INTO alternative_to (alternative_id, proprietary_id)
SELECT a.id, p.id FROM alternatives a, proprietary_software p
WHERE (a.slug = 'appflowy' AND p.slug = 'notion')
   OR (a.slug = 'mattermost' AND p.slug = 'slack')
   OR (a.slug = 'rocket-chat' AND p.slug = 'slack')
   OR (a.slug = 'penpot' AND p.slug = 'figma')
   OR (a.slug = 'plausible' AND p.slug = 'google-analytics')
   OR (a.slug = 'umami' AND p.slug = 'google-analytics')
   OR (a.slug = 'nextcloud' AND p.slug = 'dropbox')
   OR (a.slug = 'bitwarden' AND p.slug = '1password')
   OR (a.slug IN ('plane', 'logseq') AND p.slug IN ('notion', 'trello'))
   OR (a.slug = 'listmonk' AND p.slug = 'mailchimp')
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- Your database is now set up with:
-- - 70+ categories (hierarchical structure matching openalternative.co)
-- - 150+ tech stacks (with types: Language, Framework, Tool, SaaS, DB, Cloud, etc.)
-- - 8 tags
-- - 8 proprietary software entries
-- - 13 open source alternatives
-- 
-- Remember to set your environment variables:
-- NEXT_PUBLIC_SUPABASE_URL=your-project-url
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
