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

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// New proprietary software to add (if not exists)
const newProprietarySoftware = [
  { name: 'Claude', slug: 'claude', description: 'AI assistant by Anthropic for conversations and analysis', website: 'https://claude.ai' },
  { name: 'Perplexity', slug: 'perplexity', description: 'AI-powered search engine with conversational answers', website: 'https://perplexity.ai' },
  { name: 'Otter.ai', slug: 'otter-ai', description: 'AI-powered meeting transcription and notes', website: 'https://otter.ai' },
  { name: 'Weights and Biases', slug: 'weights-and-biases', description: 'ML experiment tracking and model management platform', website: 'https://wandb.ai' },
  { name: 'Rasa', slug: 'rasa', description: 'Conversational AI platform for building chatbots', website: 'https://rasa.com' },
  { name: 'LangChain', slug: 'langchain', description: 'Framework for building LLM-powered applications', website: 'https://langchain.com' },
  { name: 'GitHub Codespaces', slug: 'github-codespaces', description: 'Cloud-based development environments', website: 'https://github.com/features/codespaces' },
  { name: 'Replit', slug: 'replit', description: 'Online IDE and coding platform', website: 'https://replit.com' },
  { name: 'Raycast', slug: 'raycast', description: 'Productivity launcher and command palette for macOS', website: 'https://raycast.com' },
  { name: 'Docker Desktop', slug: 'docker-desktop', description: 'Container development environment for desktop', website: 'https://docker.com/products/docker-desktop' },
  { name: 'Retool', slug: 'retool', description: 'Low-code platform for building internal tools', website: 'https://retool.com' },
  { name: 'Auth0', slug: 'auth0', description: 'Identity platform for authentication and authorization', website: 'https://auth0.com' },
  { name: 'Okta', slug: 'okta', description: 'Enterprise identity and access management', website: 'https://okta.com' },
  { name: 'Cloudflare R2', slug: 'cloudflare-r2', description: 'Object storage with S3 compatibility', website: 'https://cloudflare.com/r2' },
  { name: 'Amazon S3', slug: 'amazon-s3', description: 'Cloud object storage service', website: 'https://aws.amazon.com/s3' },
  { name: 'Terraform', slug: 'terraform', description: 'Infrastructure as code tool', website: 'https://terraform.io' },
  { name: 'Kubernetes', slug: 'kubernetes', description: 'Container orchestration platform', website: 'https://kubernetes.io' },
  { name: '1Password', slug: '1password', description: 'Password manager for teams and individuals', website: 'https://1password.com' },
  { name: 'Authy', slug: 'authy', description: 'Two-factor authentication app', website: 'https://authy.com' },
  { name: 'reCAPTCHA', slug: 'recaptcha', description: 'Bot protection and CAPTCHA service by Google', website: 'https://google.com/recaptcha' },
  { name: 'Doppler', slug: 'doppler', description: 'Secrets management platform for teams', website: 'https://doppler.com' },
  { name: 'Splunk', slug: 'splunk', description: 'Log analytics and monitoring platform', website: 'https://splunk.com' },
  { name: 'New Relic', slug: 'new-relic', description: 'Application performance monitoring', website: 'https://newrelic.com' },
  { name: 'Datadog', slug: 'datadog', description: 'Cloud monitoring and analytics platform', website: 'https://datadoghq.com' },
  { name: 'Segment', slug: 'segment', description: 'Customer data platform for analytics', website: 'https://segment.com' },
  { name: 'Intercom', slug: 'intercom', description: 'Customer messaging platform', website: 'https://intercom.com' },
  { name: 'Twilio', slug: 'twilio', description: 'Communication APIs for voice, SMS, and video', website: 'https://twilio.com' },
  { name: 'Notion', slug: 'notion', description: 'All-in-one workspace for notes and docs', website: 'https://notion.so' },
  { name: 'Obsidian', slug: 'obsidian', description: 'Knowledge base and note-taking app', website: 'https://obsidian.md' },
  { name: 'Todoist', slug: 'todoist', description: 'Task management and to-do list app', website: 'https://todoist.com' },
  { name: 'Things', slug: 'things', description: 'Personal task manager for Apple devices', website: 'https://culturedcode.com/things' },
  { name: 'Salesforce', slug: 'salesforce', description: 'Enterprise CRM platform', website: 'https://salesforce.com' },
  { name: 'HubSpot', slug: 'hubspot', description: 'CRM and marketing automation platform', website: 'https://hubspot.com' },
  { name: 'Mailchimp', slug: 'mailchimp', description: 'Email marketing and automation platform', website: 'https://mailchimp.com' },
  { name: 'SendGrid', slug: 'sendgrid', description: 'Email delivery and API service', website: 'https://sendgrid.com' },
];

// First 100 alternatives from new_open_source_alternatives.md
const newAlternatives = [
  // AI & Machine Learning - Alternatives to Claude
  {
    name: 'OpenChat',
    slug: 'openchat',
    short_description: 'Community-driven language model fine-tuned for conversation',
    description: 'OpenChat is an open-source conversational AI built on fine-tuned language models specifically optimized for dialogue. It provides chat capabilities similar to Claude while allowing self-hosting for complete data privacy and customization of model behavior based on specific use cases.',
    website: 'https://openchat.team',
    github: 'https://github.com/openchat-oo/openchat',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['claude'],
    categoryKeywords: ['ai', 'chatbot', 'conversational ai', 'language model']
  },
  {
    name: 'KoboldAI',
    slug: 'koboldai',
    short_description: 'User-friendly interface for running local AI language models',
    description: 'KoboldAI is a user-friendly artificial intelligence application that allows running large language models locally on consumer hardware. It provides an interface similar to ChatGPT and Claude with extensive customization options for model parameters, memory, and prompting strategies.',
    website: 'https://github.com/KoboldAI/KoboldAI-Client',
    github: 'https://github.com/KoboldAI/KoboldAI-Client',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['claude'],
    categoryKeywords: ['ai', 'local ai', 'language model', 'chatbot']
  },
  {
    name: 'LocalAI',
    slug: 'localai',
    short_description: 'Drop-in replacement API for OpenAI-compatible local models',
    description: 'LocalAI is an open-source API that provides a drop-in replacement for OpenAI\'s API, allowing you to run local models with full API compatibility. It supports various model architectures and provides inference capabilities without requiring GPU acceleration, making AI accessible on standard hardware.',
    website: 'https://localai.io',
    github: 'https://github.com/mudler/LocalAI',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['claude'],
    categoryKeywords: ['ai', 'api', 'local ai', 'language model']
  },
  // AI & Machine Learning - Alternatives to Perplexity
  {
    name: 'SearXNG',
    slug: 'searxng',
    short_description: 'Meta search engine with privacy protection and AI enhancements',
    description: 'SearXNG is a privacy-respecting metasearch engine that aggregates results from multiple search engines without tracking users. It can be enhanced with AI capabilities to provide conversational answers similar to Perplexity while maintaining complete user privacy and self-hosting flexibility.',
    website: 'https://searxng.org',
    github: 'https://github.com/searxng/searxng',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['perplexity'],
    categoryKeywords: ['search', 'privacy', 'metasearch', 'ai search']
  },
  // AI & Machine Learning - Alternatives to Otter.ai
  {
    name: 'Whisper',
    slug: 'openai-whisper',
    short_description: 'Robust speech recognition with multilingual support',
    description: 'OpenAI Whisper is an open-source speech recognition system that provides robust transcription capabilities across multiple languages. It offers accurate speech-to-text conversion with speaker diarization capabilities, running entirely locally for privacy-sensitive applications without sending data to cloud services.',
    website: 'https://github.com/openai/whisper',
    github: 'https://github.com/openai/whisper',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['otter-ai'],
    categoryKeywords: ['transcription', 'speech recognition', 'ai', 'audio']
  },
  {
    name: 'Faster-Whisper',
    slug: 'faster-whisper',
    short_description: 'Optimized Whisper implementation for faster inference',
    description: 'Faster-Whisper is an optimized implementation of OpenAI\'s Whisper model that significantly improves inference speed using CTranslate2. It provides the same accuracy as the original Whisper while requiring less computational resources, making it suitable for real-time transcription applications.',
    website: 'https://github.com/guillaumekln/faster-whisper',
    github: 'https://github.com/guillaumekln/faster-whisper',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['otter-ai'],
    categoryKeywords: ['transcription', 'speech recognition', 'ai', 'optimization']
  },
  {
    name: 'Vosk',
    slug: 'vosk',
    short_description: 'Offline speech recognition toolkit with mobile support',
    description: 'Vosk is an open-source speech recognition toolkit designed for offline and real-time transcription. It provides lightweight models that work on various devices including mobile phones, offering speaker recognition and multi-language support without requiring constant internet connectivity.',
    website: 'https://alphacephei.com/vosk',
    github: 'https://github.com/alphacephei/vosk-api',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['otter-ai'],
    categoryKeywords: ['transcription', 'speech recognition', 'offline', 'mobile']
  },
  // AI & Machine Learning - Alternatives to Weights and Biases
  {
    name: 'MLflow',
    slug: 'mlflow',
    short_description: 'Open platform for managing ML lifecycle including experiments',
    description: 'MLflow is an open-source platform for managing the complete machine learning lifecycle including experimentation, reproducibility, and deployment. It provides tracking servers, model registries, and project packaging with both cloud and self-hosted deployment options for enterprise machine learning operations.',
    website: 'https://mlflow.org',
    github: 'https://github.com/mlflow/mlflow',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['weights-and-biases'],
    categoryKeywords: ['ml ops', 'experiment tracking', 'machine learning', 'data science']
  },
  {
    name: 'DVC',
    slug: 'dvc',
    short_description: 'Version control for machine learning projects and datasets',
    description: 'DVC is an open-source version control system designed specifically for machine learning projects. It provides experiment tracking, pipeline automation, and dataset management while integrating with Git for code versioning and supporting various remote storage backends for large files.',
    website: 'https://dvc.org',
    github: 'https://github.com/iterative/dvc',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['weights-and-biases'],
    categoryKeywords: ['ml ops', 'version control', 'machine learning', 'data versioning']
  },
  {
    name: 'Guild AI',
    slug: 'guild-ai',
    short_description: 'Lightweight experiment tracking and hyperparameter optimization',
    description: 'Guild AI is a lightweight, open-source experiment tracking tool designed for machine learning workflows. It provides automated experiment comparison, hyperparameter optimization, and pipeline management with minimal configuration overhead and full support for self-hosted deployments.',
    website: 'https://guildai.org',
    github: 'https://github.com/guildai/guildai',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['weights-and-biases'],
    categoryKeywords: ['ml ops', 'experiment tracking', 'machine learning', 'hyperparameter']
  },
  // AI & Machine Learning - Alternatives to Rasa
  {
    name: 'Botpress',
    slug: 'botpress',
    short_description: 'Enterprise conversational AI platform with visual builder',
    description: 'Botpress is an enterprise-grade open-source conversational AI platform providing visual flow builders and natural language understanding. It offers advanced features including multilingual support, enterprise security, and extensive integration capabilities while supporting full self-hosting for data-sensitive applications.',
    website: 'https://botpress.com',
    github: 'https://github.com/botpress/botpress',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['rasa'],
    categoryKeywords: ['chatbot', 'conversational ai', 'nlu', 'bot builder']
  },
  {
    name: 'ChatterBot',
    slug: 'chatterbot',
    short_description: 'Machine learning based conversation bot library',
    description: 'ChatterBot is an open-source machine learning conversational dialog engine built in Python. It uses various machine learning algorithms to generate different responses based on input patterns, making it suitable for building chatbots that improve their responses over time through training data.',
    website: 'https://chatterbot.readthedocs.io',
    github: 'https://github.com/gunthercox/ChatterBot',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['rasa'],
    categoryKeywords: ['chatbot', 'conversational ai', 'machine learning', 'python']
  },
  // AI & Machine Learning - Alternatives to LangChain
  {
    name: 'LlamaIndex',
    slug: 'llamaindex',
    short_description: 'Data framework for building LLM applications with context',
    description: 'LlamaIndex is an open-source data framework designed for building large language model applications that require contextual information retrieval. It provides tools for connecting private data sources to LLMs, creating sophisticated retrieval-augmented generation systems without vendor lock-in.',
    website: 'https://gpt-index.readthedocs.io',
    github: 'https://github.com/jerryjliu/llama_index',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['langchain'],
    categoryKeywords: ['llm', 'rag', 'ai framework', 'data']
  },
  {
    name: 'Semantic Kernel',
    slug: 'semantic-kernel',
    short_description: 'Microsoft framework for building AI-first apps with orchestrations',
    description: 'Semantic Kernel is Microsoft\'s open-source orchestrator that enables building AI-first applications with prompt templating, function calling, and memory management. It provides abstractions over various LLM providers and supports semantic function chaining for complex AI workflows.',
    website: 'https://github.com/microsoft/semantic-kernel',
    github: 'https://github.com/microsoft/semantic-kernel',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['langchain'],
    categoryKeywords: ['llm', 'ai framework', 'orchestration', 'microsoft']
  },
  {
    name: 'AutoGen',
    slug: 'autogen',
    short_description: 'Framework for building multi-agent AI applications',
    description: 'AutoGen is an open-source framework for developing AI applications with multiple conversational agents that can collaborate on tasks. It provides a unified interface for building complex multi-agent systems with customizable communication patterns and role-based interactions.',
    website: 'https://microsoft.github.io/autogen',
    github: 'https://github.com/microsoft/autogen',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['langchain'],
    categoryKeywords: ['llm', 'multi-agent', 'ai framework', 'automation']
  },
  // Development Tools - Alternatives to GitHub Codespaces
  {
    name: 'Gitpod',
    slug: 'gitpod',
    short_description: 'Automated dev environment with prebuilt workspaces',
    description: 'Gitpod is an open-source automated development environment that provides prebuilt, containerized workspaces for coding projects. It integrates with Git repositories to spin up ready-to-code environments with configurable dev containers, offering similar functionality to GitHub Codespaces with self-hosting options.',
    website: 'https://www.gitpod.io',
    github: 'https://github.com/gitpod-io/gitpod',
    license: 'EPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['github-codespaces'],
    categoryKeywords: ['cloud ide', 'development environment', 'devcontainer', 'workspace']
  },
  {
    name: 'Devcontainers',
    slug: 'devcontainers',
    short_description: 'Standard for containerized development environments',
    description: 'The devcontainers specification provides a standard approach to container-based development environments that work with VS Code and other editors. It enables consistent, containerized development setups that can run locally or be deployed to any cloud infrastructure.',
    website: 'https://containers.dev',
    github: 'https://github.com/devcontainers/spec',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['github-codespaces'],
    categoryKeywords: ['containers', 'development environment', 'docker', 'vscode']
  },
  // Development Tools - Alternatives to Replit
  {
    name: 'Eclipse Che',
    slug: 'eclipse-che',
    short_description: 'Kubernetes-native cloud IDE with plugin support',
    description: 'Eclipse Che is an open-source cloud development environment that runs on Kubernetes clusters. It provides browser-based development with language support through plugins, enabling team collaboration on code with configurable workspaces that mirror production environments.',
    website: 'https://www.eclipse.org/che',
    github: 'https://github.com/eclipse/che',
    license: 'EPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['replit'],
    categoryKeywords: ['cloud ide', 'kubernetes', 'development environment', 'eclipse']
  },
  {
    name: 'code-server',
    slug: 'code-server',
    short_description: 'Run VS Code in any browser on your server',
    description: 'Code-server allows running VS Code in a browser, connected to a remote server. It provides a full VS Code experience accessible from any device with a browser, supporting extensions and themes while keeping development environments on user-controlled infrastructure.',
    website: 'https://coder.com/docs/code-server',
    github: 'https://github.com/coder/code-server',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['replit'],
    categoryKeywords: ['cloud ide', 'vscode', 'remote development', 'browser']
  },
  // Development Tools - Alternatives to Raycast
  {
    name: 'Ulauncher',
    slug: 'ulauncher',
    short_description: 'Modern application launcher for Linux with extensions',
    description: 'Ulauncher is a modern, open-source application launcher designed for Linux desktops. It provides instant search for applications, files, and bookmarks with support for custom extensions, calculator functionality, and themes while maintaining a lightweight footprint.',
    website: 'https://ulauncher.org',
    github: 'https://github.com/Ulauncher/Ulauncher',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['raycast'],
    categoryKeywords: ['launcher', 'productivity', 'linux', 'desktop']
  },
  {
    name: 'Rofi',
    slug: 'rofi',
    short_description: 'Window switcher and application launcher with scripts',
    description: 'Rofi is an open-source window switcher and application launcher that provides a highly customizable interface for navigating applications and windows. It supports custom scripts for extending functionality, making it suitable for keyboard-driven workflows similar to Raycast.',
    website: 'https://github.com/davatorium/rofi',
    github: 'https://github.com/davatorium/rofi',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['raycast'],
    categoryKeywords: ['launcher', 'window manager', 'linux', 'productivity']
  },
  {
    name: 'Albert',
    slug: 'albert-launcher',
    short_description: 'Cross-platform launcher with plugin ecosystem',
    description: 'Albert is an open-source, cross-platform launcher that provides instant access to applications, files, calculations, and web searches. It features a plugin architecture for extending functionality and supports Python plugins for custom integrations while maintaining a clean, minimal interface.',
    website: 'https://albertlauncher.github.io',
    github: 'https://github.com/albertlauncher/albert',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['raycast'],
    categoryKeywords: ['launcher', 'productivity', 'cross-platform', 'plugins']
  },
  // Development Tools - Alternatives to Docker Desktop
  {
    name: 'Podman',
    slug: 'podman',
    short_description: 'Daemonless container engine for rootless containers',
    description: 'Podman is an open-source container engine that provides a Docker-compatible command-line interface without requiring a daemon process. It supports rootless containers for enhanced security, integrates with systemd, and runs containers with the same commands as Docker while offering enhanced isolation.',
    website: 'https://podman.io',
    github: 'https://github.com/containers/podman',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['docker-desktop'],
    categoryKeywords: ['containers', 'docker', 'devops', 'rootless']
  },
  {
    name: 'Colima',
    slug: 'colima',
    short_description: 'Lima-based container runtime for macOS and Linux',
    description: 'Colima provides container runtimes on macOS and Linux using Lima (Linux virtual machine). It offers a simple command-line experience similar to Docker Desktop with support for Docker and Containerd runtimes, requiring minimal resources while providing full container functionality.',
    website: 'https://github.com/abiosoft/colima',
    github: 'https://github.com/abiosoft/colima',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['docker-desktop'],
    categoryKeywords: ['containers', 'docker', 'macos', 'linux']
  },
  {
    name: 'Minikube',
    slug: 'minikube',
    short_description: 'Local Kubernetes cluster for development and testing',
    description: 'Minikube is an open-source tool that runs a single-node Kubernetes cluster locally for development and testing purposes. It supports various container runtimes and Kubernetes features, enabling developers to test Kubernetes deployments without requiring cloud infrastructure.',
    website: 'https://minikube.sigs.k8s.io',
    github: 'https://github.com/kubernetes/minikube',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['docker-desktop'],
    categoryKeywords: ['kubernetes', 'containers', 'local development', 'devops']
  },
  // Development Tools - Alternatives to Retool
  {
    name: 'Appsmith',
    slug: 'appsmith',
    short_description: 'Open-source low-code platform for building internal tools',
    description: 'Appsmith is an open-source low-code platform for building custom internal tools, dashboards, and admin panels. It provides drag-and-drop widgets, data source integrations, and JavaScript customization with full self-hosting support and an active community contributing widgets and templates.',
    website: 'https://www.appsmith.com',
    github: 'https://github.com/appsmithorg/appsmith',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['retool'],
    categoryKeywords: ['low-code', 'internal tools', 'admin panel', 'dashboard']
  },
  {
    name: 'Budibase',
    slug: 'budibase',
    short_description: 'Low-code platform with built-in database and auth',
    description: 'Budibase is an open-source low-code platform that combines form building, data management, and automation in a single solution. It includes a built-in database, authentication system, and automation workflows with extensive template library for rapid internal tool development.',
    website: 'https://budibase.com',
    github: 'https://github.com/Budibase/budibase',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['retool'],
    categoryKeywords: ['low-code', 'internal tools', 'database', 'automation']
  },
  {
    name: 'ToolJet',
    slug: 'tooljet',
    short_description: 'Open-source low-code app builder with data connectors',
    description: 'ToolJet is an open-source low-code application builder that enables creating custom business applications without extensive coding. It provides drag-and-drop UI builder, pre-built connectors for data sources, and JavaScript code execution for custom logic with self-hosting capabilities.',
    website: 'https://tooljet.com',
    github: 'https://github.com/ToolJet/ToolJet',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['retool'],
    categoryKeywords: ['low-code', 'internal tools', 'app builder', 'connectors']
  },
  {
    name: 'Refine',
    slug: 'refine',
    short_description: 'React-based framework for building internal tools rapidly',
    description: 'Refine is an open-source React framework specifically designed for building admin panels, dashboards, and internal tools. It provides ready-made integrations for popular UI libraries and backends with extensive customization capabilities through hooks and providers.',
    website: 'https://refine.dev',
    github: 'https://github.com/refinedev/refine',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['retool'],
    categoryKeywords: ['react', 'admin panel', 'internal tools', 'framework']
  },
  // Cloud & Infrastructure - Alternatives to Auth0
  {
    name: 'Keycloak',
    slug: 'keycloak',
    short_description: 'Enterprise identity and access management platform',
    description: 'Keycloak is an open-source identity and access management solution providing single sign-on, user federation, and social login capabilities. It supports OAuth 2.0, OpenID Connect, and SAML protocols with full self-hosting and enterprise features including clustering and high availability.',
    website: 'https://www.keycloak.org',
    github: 'https://github.com/keycloak/keycloak',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['auth0'],
    categoryKeywords: ['authentication', 'identity', 'sso', 'oauth']
  },
  {
    name: 'Casdoor',
    slug: 'casdoor',
    short_description: 'UI-driven identity provider with multi-tenant support',
    description: 'Casdoor is an open-source identity and access management platform with a modern web UI for managing users, organizations, and applications. It provides OAuth 2.0, SAML, and CAS authentication with multi-tenant capabilities and easy integration with existing applications.',
    website: 'https://casdoor.org',
    github: 'https://github.com/casdoor/casdoor',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['auth0'],
    categoryKeywords: ['authentication', 'identity', 'multi-tenant', 'sso']
  },
  {
    name: 'Authentik',
    slug: 'authentik',
    short_description: 'Flexible identity provider with modern UX',
    description: 'Authentik is an open-source identity provider that combines user authentication, authorization, and directory services. It offers a modern user interface, OAuth 2.0/OpenID Connect support, and flexible policy engine for implementing complex authentication workflows with full self-hosting.',
    website: 'https://goauthentik.io',
    github: 'https://github.com/goauthentik/authentik',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['auth0'],
    categoryKeywords: ['authentication', 'identity', 'oauth', 'directory']
  },
  {
    name: 'Ory',
    slug: 'ory',
    short_description: 'Modular identity and permission stack',
    description: 'Ory provides a modular, cloud-native identity stack with components for authentication, authorization, and user management. It offers Ory Kratos for identity, Ory Hydra for OAuth 2.0/OpenID Connect, and Ory Keto for access control with enterprise-grade scalability and security features.',
    website: 'https://www.ory.sh',
    github: 'https://github.com/ory',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['auth0'],
    categoryKeywords: ['authentication', 'identity', 'oauth', 'permissions']
  },
  // Cloud & Infrastructure - Alternatives to Okta
  {
    name: 'Gluu',
    slug: 'gluu',
    short_description: 'Enterprise identity management with compliance features',
    description: 'Gluu is an open-source identity and access management platform providing comprehensive IAM capabilities including single sign-on, multi-factor authentication, and user management. It offers strong compliance features for regulated industries and supports various deployment configurations.',
    website: 'https://gluu.org',
    github: 'https://github.com/GluuFederation/oxAuth',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['okta'],
    categoryKeywords: ['identity', 'enterprise', 'compliance', 'sso']
  },
  {
    name: 'FreeIPA',
    slug: 'freeipa',
    short_description: 'Linux/UNIX identity management system',
    description: 'FreeIPA is an open-source identity management system for Linux/UNIX environments that provides centralized authentication, authorization, and account information. It integrates with existing directory services and offers web UI for administration with strong security features.',
    website: 'https://www.freeipa.org',
    github: 'https://github.com/freeipa/freeipa',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['okta'],
    categoryKeywords: ['identity', 'linux', 'directory', 'enterprise']
  },
  {
    name: 'LemonLDAP::NG',
    slug: 'lemonldap-ng',
    short_description: 'Web SSO and access management reverse proxy',
    description: 'LemonLDAP::NG is an open-source web SSO solution that functions as a reverse proxy for access control. It provides identity federation, session management, and fine-grained access policies with high performance and scalability for enterprise deployments.',
    website: 'https://lemonldap-ng.org',
    github: 'https://github.com/LemonLDAPNG/lemonldap-ng',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['okta'],
    categoryKeywords: ['sso', 'reverse proxy', 'access management', 'enterprise']
  },
  // Cloud & Infrastructure - Alternatives to Cloudflare R2/S3
  {
    name: 'MinIO',
    slug: 'minio',
    short_description: 'High-performance, S3-compatible object storage',
    description: 'MinIO is a high-performance, open-source object storage system that is Amazon S3-compatible. It provides distributed storage with erasure coding, encryption, and identity management while offering the same API as cloud object storage services for easy migration and integration.',
    website: 'https://min.io',
    github: 'https://github.com/minio/minio',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['cloudflare-r2', 'amazon-s3'],
    categoryKeywords: ['object storage', 's3', 'cloud storage', 'distributed']
  },
  {
    name: 'Ceph',
    slug: 'ceph',
    short_description: 'Unified distributed storage platform with object/block/file storage',
    description: 'Ceph is an open-source unified distributed storage platform providing object, block, and file storage in a single system. It offers massive scalability, self-healing capabilities, and S3-compatible object storage interfaces suitable for building private cloud storage infrastructure.',
    website: 'https://ceph.io',
    github: 'https://github.com/ceph/ceph',
    license: 'LGPL-2.1 License',
    is_self_hosted: true,
    alternative_to: ['cloudflare-r2', 'amazon-s3'],
    categoryKeywords: ['object storage', 'distributed', 'block storage', 'file storage']
  },
  {
    name: 'SeaweedFS',
    slug: 'seaweedfs',
    short_description: 'Simple and highly scalable distributed file system',
    description: 'SeaweedFS is an open-source distributed file system designed for storing billions of files with fast access. It provides a simple architecture with optional S3-compatible API, automatic tiering, and efficient memory usage for building large-scale object storage solutions.',
    website: 'https://github.com/chrislusf/seaweedfs',
    github: 'https://github.com/chrislusf/seaweedfs',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['cloudflare-r2', 'amazon-s3'],
    categoryKeywords: ['object storage', 'distributed', 'file system', 's3']
  },
  // Cloud & Infrastructure - Alternatives to Terraform
  {
    name: 'Pulumi',
    slug: 'pulumi',
    short_description: 'Infrastructure as code with general-purpose programming languages',
    description: 'Pulumi is an open-source infrastructure as code platform that allows using familiar programming languages like Python, TypeScript, and Go for defining cloud infrastructure. It provides the same capabilities as Terraform while enabling better code reuse and testing patterns.',
    website: 'https://www.pulumi.com',
    github: 'https://github.com/pulumi/pulumi',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['terraform'],
    categoryKeywords: ['infrastructure as code', 'iac', 'cloud', 'devops']
  },
  {
    name: 'Crossplane',
    slug: 'crossplane',
    short_description: 'Kubernetes-based control plane for infrastructure',
    description: 'Crossplane is an open-source control plane that extends Kubernetes to provision and manage infrastructure across multiple providers. It treats infrastructure as managed resources, enabling GitOps workflows and unified configuration for cloud resources through Kubernetes-style manifests.',
    website: 'https://crossplane.io',
    github: 'https://github.com/crossplane/crossplane',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['terraform'],
    categoryKeywords: ['infrastructure as code', 'kubernetes', 'cloud', 'gitops']
  },
  {
    name: 'OpenTofu',
    slug: 'opentofu',
    short_description: 'Community-driven fork of Terraform with governance',
    description: 'OpenTofu is an open-source, community-driven fork of Terraform that ensures the long-term availability of open infrastructure as code. It maintains full compatibility with Terraform while providing transparent governance and community-led development.',
    website: 'https://opentofu.org',
    github: 'https://github.com/opentofu/opentofu',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['terraform'],
    categoryKeywords: ['infrastructure as code', 'iac', 'terraform', 'devops']
  },
  // Cloud & Infrastructure - Alternatives to Kubernetes
  {
    name: 'Nomad',
    slug: 'nomad',
    short_description: 'Flexible, enterprise-grade workload orchestrator',
    description: 'Nomad is an open-source, flexible workload orchestrator that deploys and manages containers, applications, and services across distributed infrastructure. It provides simpler architecture than Kubernetes while supporting diverse workloads including containers, VMs, and standalone applications.',
    website: 'https://www.nomadproject.io',
    github: 'https://github.com/hashicorp/nomad',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['kubernetes'],
    categoryKeywords: ['orchestration', 'containers', 'workload', 'hashicorp']
  },
  {
    name: 'K3s',
    slug: 'k3s',
    short_description: 'Lightweight Kubernetes for edge and resource-constrained environments',
    description: 'K3s is a lightweight, certified Kubernetes distribution designed for resource-constrained environments and edge computing. It packaged Kubernetes in a single binary with minimal dependencies, making it suitable for IoT devices, CI/CD pipelines, and development environments.',
    website: 'https://k3s.io',
    github: 'https://github.com/k3s-io/k3s',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['kubernetes'],
    categoryKeywords: ['kubernetes', 'lightweight', 'edge', 'iot']
  },
  {
    name: 'Rancher',
    slug: 'rancher',
    short_description: 'Kubernetes management platform with multi-cluster support',
    description: 'Rancher is an open-source platform for managing multiple Kubernetes clusters across different infrastructure providers. It provides centralized authentication, policy management, and monitoring while simplifying Kubernetes operations for organizations running clusters at scale.',
    website: 'https://www.rancher.com',
    github: 'https://github.com/rancher/rancher',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['kubernetes'],
    categoryKeywords: ['kubernetes', 'multi-cluster', 'management', 'devops']
  },
  // Security & Privacy - Alternatives to Password Managers
  {
    name: 'Pass',
    slug: 'pass',
    short_description: 'Unix-style password manager using GPG and Git',
    description: 'Pass is a simple, open-source command-line password manager that stores passwords in encrypted files using GPG. It integrates with Git for version control and synchronization, providing a straightforward and transparent approach to password management without proprietary dependencies.',
    website: 'https://www.passwordstore.org',
    github: 'https://github.com/passwordstore/password-store',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['1password'],
    categoryKeywords: ['password manager', 'gpg', 'cli', 'encryption']
  },
  {
    name: 'Vaultwarden',
    slug: 'vaultwarden',
    short_description: 'Rust implementation of Bitwarden server',
    description: 'Vaultwarden is an open-source, lightweight implementation of the Bitwarden server API written in Rust. It provides full compatibility with Bitwarden clients while using significantly less resources than the official server, making it ideal for self-hosted password management.',
    website: 'https://github.com/dani-garcia/vaultwarden',
    github: 'https://github.com/dani-garcia/vaultwarden',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['1password'],
    categoryKeywords: ['password manager', 'bitwarden', 'self-hosted', 'rust']
  },
  {
    name: 'KeePassXC',
    slug: 'keepassxc',
    short_description: 'Modern, feature-rich KeePass fork with browser integration',
    description: 'KeePassXC is an open-source, cross-platform password manager that extends KeePassX with additional features and modern UX. It provides browser integration, secure password sharing, SSH agent integration, and strong encryption while keeping all data under user control.',
    website: 'https://keepassxc.org',
    github: 'https://github.com/keepassxreboot/keepassxc',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['1password'],
    categoryKeywords: ['password manager', 'keepass', 'cross-platform', 'encryption']
  },
  // Security & Privacy - Alternatives to Authy
  {
    name: 'ente Auth',
    slug: 'ente-auth',
    short_description: 'Open-source TOTP authenticator with end-to-end encryption',
    description: 'ente Auth is an open-source two-factor authentication app that stores TOTP codes with end-to-end encryption. It provides secure sync across devices while keeping encryption keys only with the user, offering a privacy-focused alternative to proprietary authenticator apps.',
    website: 'https://ente.io/auth',
    github: 'https://github.com/ente-io/auth',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['authy'],
    categoryKeywords: ['2fa', 'totp', 'authenticator', 'encryption']
  },
  {
    name: 'OTPClient',
    slug: 'otpclient',
    short_description: 'GTK-based TOTP/HOTP authenticator',
    description: 'OTPClient is an open-source, GTK-based authenticator application for managing TOTP and HOTP codes. It provides a clean interface for generating one-time passwords without requiring cloud sync, keeping all secrets stored locally on the device.',
    website: 'https://github.com/paolostivanin/OTPClient',
    github: 'https://github.com/paolostivanin/OTPClient',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['authy'],
    categoryKeywords: ['2fa', 'totp', 'authenticator', 'gtk']
  },
  // Security & Privacy - Alternatives to reCAPTCHA
  {
    name: 'Friendly Captcha',
    slug: 'friendly-captcha',
    short_description: 'Privacy-preserving proof-of-work CAPTCHA',
    description: 'Friendly Captcha is a privacy-preserving CAPTCHA solution that uses proof-of-work instead of tracking users. It provides seamless integration without showing traditional CAPTCHA challenges while protecting websites from bots with minimal user friction.',
    website: 'https://friendlycaptcha.com',
    github: 'https://github.com/FriendlyCaptcha/friendly-captcha-sdk',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['recaptcha'],
    categoryKeywords: ['captcha', 'bot protection', 'privacy', 'security']
  },
  {
    name: 'Securimage',
    slug: 'securimage',
    short_description: 'PHP-based CAPTCHA library for self-hosted deployments',
    description: 'Securimage is an open-source PHP CAPTCHA library that generates audio and visual challenges for form protection. It provides a self-hosted alternative to cloud CAPTCHA services with customizable appearance and multiple security options for preventing automated submissions.',
    website: 'https://www.phpcaptcha.org',
    github: 'https://github.com/dapphp/securimage',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['recaptcha'],
    categoryKeywords: ['captcha', 'bot protection', 'php', 'self-hosted']
  },
  // Security & Privacy - Alternatives to Doppler
  {
    name: 'HashiCorp Vault',
    slug: 'hashicorp-vault',
    short_description: 'Secret management and encryption as a service',
    description: 'HashiCorp Vault is an open-source tool for securely storing, accessing, and distributing secrets like API keys, passwords, and certificates. It provides encryption as a service, dynamic secrets, and fine-grained access policies with both self-hosted and cloud-hosted options.',
    website: 'https://www.vaultproject.io',
    github: 'https://github.com/hashicorp/vault',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['doppler'],
    categoryKeywords: ['secrets', 'encryption', 'vault', 'security']
  },
  {
    name: 'Infisical',
    slug: 'infisical',
    short_description: 'Open-source secret management with UI and sync',
    description: 'Infisical is an open-source secret management platform providing centralized secret storage with a web UI and CLI. It offers end-to-end encryption, secret rotation, and team collaboration features while supporting integration with various deployment platforms and CI/CD systems.',
    website: 'https://infisical.com',
    github: 'https://github.com/Infisical/infisical',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['doppler'],
    categoryKeywords: ['secrets', 'encryption', 'devops', 'ci/cd']
  },
  {
    name: 'SOPS',
    slug: 'sops',
    short_description: 'YAML-based encrypted secrets for configuration files',
    description: 'SOPS is an open-source tool for encrypting configuration files, particularly YAML, JSON, and ENV formats. It integrates with various key management services including AWS KMS, GCP KMS, and HashiCorp Vault while keeping config files human-readable and Git-compatible.',
    website: 'https://github.com/mozilla/sops',
    github: 'https://github.com/mozilla/sops',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['doppler'],
    categoryKeywords: ['secrets', 'encryption', 'config', 'gitops']
  },
  // Analytics & Monitoring - Alternatives to Splunk
  {
    name: 'Elastic Stack',
    slug: 'elastic-stack',
    short_description: 'Full-text search and analytics engine with visualization',
    description: 'The Elastic Stack (Elasticsearch, Logstash, Kibana) is an open-source platform for search, logging, and analytics. It provides powerful full-text search capabilities, log aggregation, and visualization tools with both cloud-hosted and self-managed deployment options for enterprise log management.',
    website: 'https://www.elastic.co',
    github: 'https://github.com/elastic/elasticsearch',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['splunk'],
    categoryKeywords: ['logging', 'search', 'analytics', 'elk']
  },
  {
    name: 'Grafana Loki',
    slug: 'grafana-loki',
    short_description: 'Horizontally-scalable, highly-available log aggregation',
    description: 'Grafana Loki is an open-source log aggregation system designed to be cost-effective and easy to operate. It indexes only log metadata (labels) rather than full text, making it significantly more efficient than traditional log management systems while integrating seamlessly with Grafana for visualization.',
    website: 'https://grafana.com/oss/loki',
    github: 'https://github.com/grafana/loki',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['splunk'],
    categoryKeywords: ['logging', 'grafana', 'observability', 'monitoring']
  },
  {
    name: 'Vector',
    slug: 'vector',
    short_description: 'High-performance log, metric, and trace collection',
    description: 'Vector is an open-source, high-performance data collection pipeline for logs, metrics, and traces. It provides efficient data collection with minimal resource usage, supporting multiple sources and destinations while enabling real-time processing and transformation of observability data.',
    website: 'https://vector.dev',
    github: 'https://github.com/vectordotdev/vector',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['splunk'],
    categoryKeywords: ['logging', 'metrics', 'observability', 'pipeline']
  },
  {
    name: 'OpenSearch',
    slug: 'opensearch',
    short_description: 'Community-driven fork of Elasticsearch with security enhancements',
    description: 'OpenSearch is an open-source search and analytics suite that forked from Elasticsearch 7.10.2. It provides powerful search capabilities, logging, and visualization with enhanced security features and a vibrant community driving development forward.',
    website: 'https://opensearch.org',
    github: 'https://github.com/opensearch-project/opensearch',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['splunk'],
    categoryKeywords: ['search', 'logging', 'analytics', 'elasticsearch']
  },
  // Analytics & Monitoring - Alternatives to New Relic
  {
    name: 'SigNoz',
    slug: 'signoz',
    short_description: 'Open-source APM with distributed tracing and metrics',
    description: 'SigNoz is an open-source application performance monitoring platform providing distributed tracing, metrics, and logs in a single interface. It offers features comparable to New Relic including custom dashboards, alerts, and service maps with full self-hosting capabilities.',
    website: 'https://signoz.io',
    github: 'https://github.com/signoz/signoz',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['new-relic'],
    categoryKeywords: ['apm', 'monitoring', 'tracing', 'observability']
  },
  {
    name: 'Jaeger',
    slug: 'jaeger',
    short_description: 'Open-source distributed tracing for microservices',
    description: 'Jaeger is an open-source distributed tracing system developed by Uber Technologies. It provides monitoring and troubleshooting for microservices-based distributed applications with support for distributed transaction monitoring, performance optimization, and root cause analysis.',
    website: 'https://www.jaegertracing.io',
    github: 'https://github.com/jaegertracing/jaeger',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['new-relic'],
    categoryKeywords: ['tracing', 'microservices', 'monitoring', 'observability']
  },
  {
    name: 'Pyroscope',
    slug: 'pyroscope',
    short_description: 'Continuous profiling platform for application performance',
    description: 'Pyroscope is an open-source continuous profiling platform that helps identify performance bottlenecks in application code. It provides CPU, memory, and I/O profiling with minimal overhead, enabling developers to optimize application performance based on real-world usage patterns.',
    website: 'https://pyroscope.io',
    github: 'https://github.com/pyroscope-io/pyroscope',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['new-relic'],
    categoryKeywords: ['profiling', 'performance', 'monitoring', 'debugging']
  },
  // Analytics & Monitoring - Alternatives to Datadog
  {
    name: 'Prometheus',
    slug: 'prometheus',
    short_description: 'Open-source monitoring and alerting toolkit',
    description: 'Prometheus is an open-source monitoring system and time series database developed by SoundCloud. It provides a powerful query language, dimensional data model, and alerting capabilities with a vibrant ecosystem of exporters for monitoring various systems and applications.',
    website: 'https://prometheus.io',
    github: 'https://github.com/prometheus/prometheus',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['datadog'],
    categoryKeywords: ['monitoring', 'metrics', 'alerting', 'time series']
  },
  {
    name: 'Zabbix',
    slug: 'zabbix',
    short_description: 'Enterprise-grade network monitoring solution',
    description: 'Zabbix is an open-source, enterprise-grade monitoring solution for networks, servers, applications, and services. It provides comprehensive monitoring capabilities including metrics collection, visualization, alerting, and discovery with both agent-based and agentless monitoring approaches.',
    website: 'https://www.zabbix.com',
    github: 'https://github.com/zabbix/zabbix',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['datadog'],
    categoryKeywords: ['monitoring', 'network', 'enterprise', 'alerting']
  },
  {
    name: 'Icinga',
    slug: 'icinga',
    short_description: 'Enterprise monitoring system with modern web interface',
    description: 'Icinga is an open-source monitoring system that evolved from Nagios with modern architecture and web interface. It provides network monitoring, alerting, and reporting with scalable distributed monitoring capabilities and a flexible configuration system.',
    website: 'https://icinga.com',
    github: 'https://github.com/Icinga/icinga2',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['datadog'],
    categoryKeywords: ['monitoring', 'network', 'enterprise', 'nagios']
  },
  {
    name: 'Checkmk',
    slug: 'checkmk',
    short_description: 'IT infrastructure monitoring with powerful auto-discovery',
    description: 'Checkmk is an open-source IT infrastructure monitoring solution that provides powerful auto-discovery of services and hosts. It offers real-time monitoring with high performance, customizable dashboards, and intuitive configuration suitable for complex enterprise environments.',
    website: 'https://checkmk.com',
    github: 'https://github.com/tribe29/checkmk',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['datadog'],
    categoryKeywords: ['monitoring', 'infrastructure', 'enterprise', 'auto-discovery']
  },
  // Analytics & Monitoring - Alternatives to Segment
  {
    name: 'RudderStack',
    slug: 'rudderstack',
    short_description: 'Open-source customer data platform with warehouse-first approach',
    description: 'RudderStack is an open-source customer data platform (CDP) that provides data collection, routing, and transformation capabilities. It supports over 200 integrations and offers a warehouse-first approach where all customer data is stored in your data warehouse with full control and privacy.',
    website: 'https://rudderstack.com',
    github: 'https://github.com/rudderlabs/rudder-server',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['segment'],
    categoryKeywords: ['cdp', 'analytics', 'data', 'customer data']
  },
  {
    name: 'Snowplow',
    slug: 'snowplow',
    short_description: 'Event analytics platform for granular data collection',
    description: 'Snowplow is an open-source event analytics platform that provides granular, high-quality event data collection and processing. It offers full control over data schema and processing pipelines, enabling sophisticated analytics and machine learning applications with your data warehouse.',
    website: 'https://snowplow.io',
    github: 'https://github.com/snowplow/snowplow',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['segment'],
    categoryKeywords: ['analytics', 'events', 'data', 'pipeline']
  },
  {
    name: 'Countly',
    slug: 'countly',
    short_description: 'Mobile and web analytics with product intelligence',
    description: 'Countly is an open-source analytics platform designed for mobile applications and websites. It provides product analytics, user engagement metrics, and crash reporting with both self-hosted and cloud deployment options while maintaining full data ownership.',
    website: 'https://countly.com',
    github: 'https://github.com/Countly/countly-server',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['segment'],
    categoryKeywords: ['analytics', 'mobile', 'web', 'product']
  },
  // Communication & Chat - Alternatives to Intercom
  {
    name: 'Chatwoot',
    slug: 'chatwoot',
    short_description: 'Open-source customer engagement platform with live chat',
    description: 'Chatwoot is an open-source customer engagement platform providing live chat, email integration, and team collaboration features. It offers a modern interface similar to Intercom with customizable widgets, chatbots, and full self-hosting capabilities for complete data control.',
    website: 'https://www.chatwoot.com',
    github: 'https://github.com/chatwoot/chatwoot',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['intercom'],
    categoryKeywords: ['live chat', 'customer support', 'helpdesk', 'messaging']
  },
  // Communication & Chat - Alternatives to Twilio
  {
    name: 'Asterisk',
    slug: 'asterisk',
    short_description: 'Open-source PBX and telephony toolkit',
    description: 'Asterisk is the world\'s leading open-source PBX (Private Branch Exchange) and telephony toolkit. It provides a complete telephony system including IVR, conference calling, and voicemail with extensive protocol support for building custom communication solutions.',
    website: 'https://www.asterisk.org',
    github: 'https://github.com/asterisk/asterisk',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['twilio'],
    categoryKeywords: ['telephony', 'pbx', 'voip', 'communication']
  },
  {
    name: 'FreeSWITCH',
    slug: 'freeswitch',
    short_description: 'Scalable softswitch and communications platform',
    description: 'FreeSWITCH is an open-source softswitch (software-defined telecommunications switch) that provides a scalable platform for building communication applications. It supports voice, video, and messaging with high performance suitable for carrier-grade deployments.',
    website: 'https://freeswitch.org',
    github: 'https://github.com/signalwire/freeswitch',
    license: 'MPL-1.1 License',
    is_self_hosted: true,
    alternative_to: ['twilio'],
    categoryKeywords: ['telephony', 'softswitch', 'voip', 'communication']
  },
  // Productivity & Notes - Alternatives to Notion/Obsidian
  {
    name: 'Anytype',
    slug: 'anytype',
    short_description: 'Local-first personal knowledge base with E2E encryption',
    description: 'Anytype is an open-source, local-first personal knowledge base that prioritizes privacy and user ownership. It provides rich object types, relations, and graphs for organizing information with end-to-end encryption ensuring only the user can access their data.',
    website: 'https://anytype.io',
    github: 'https://github.com/anytype-io',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['notion'],
    categoryKeywords: ['notes', 'knowledge base', 'pkm', 'local-first']
  },
  {
    name: 'Foam',
    slug: 'foam',
    short_description: 'Personal knowledge management system based on VS Code',
    description: 'Foam is an open-source personal knowledge management system designed to work within VS Code. It provides networked thought capabilities with bidirectional linking, daily notes, and graph visualization while storing everything in plain Markdown files on disk.',
    website: 'https://foam.groov.io',
    github: 'https://github.com/foambubble/foam',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['obsidian'],
    categoryKeywords: ['notes', 'pkm', 'vscode', 'markdown']
  },
  {
    name: 'TiddlyWiki',
    slug: 'tiddlywiki',
    short_description: 'Single-file personal wiki with extensive plugins',
    description: 'TiddlyWiki is a unique open-source personal wiki that runs entirely in a single HTML file. It provides powerful organization through tagged tiddlers, rich text editing, and a plugin ecosystem while being completely portable and self-contained.',
    website: 'https://tiddlywiki.com',
    github: 'https://github.com/Jermolene/TiddlyWiki5',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['notion'],
    categoryKeywords: ['wiki', 'notes', 'personal', 'single-file']
  },
  // Productivity & Notes - Alternatives to Todoist/Things
  {
    name: 'Taskwarrior',
    slug: 'taskwarrior',
    short_description: 'Command-line task manager with advanced features',
    description: 'Taskwarrior is an open-source, command-line task management tool that provides sophisticated features including recurring tasks, dependencies, tags, and reports. It is designed for power users who prefer keyboard-driven workflows and integrates with various GUIs.',
    website: 'https://taskwarrior.org',
    github: 'https://github.com/GothenburgBitFactory/taskwarrior',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['todoist'],
    categoryKeywords: ['tasks', 'cli', 'productivity', 'todo']
  },
  {
    name: 'Super Productivity',
    slug: 'super-productivity',
    short_description: 'Cross-platform task app with Pomodoro and time tracking',
    description: 'Super Productivity is an open-source, cross-platform task management application built with web technologies. It provides task organization, Pomodoro timers, time tracking, and Jira integration with both local storage and optional sync capabilities.',
    website: 'https://super-productivity.com',
    github: 'https://github.com/johannesjo/super-productivity',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['todoist'],
    categoryKeywords: ['tasks', 'pomodoro', 'time tracking', 'productivity']
  },
  {
    name: 'Planka',
    slug: 'planka',
    short_description: 'Real-time Kanban board with collaboration features',
    description: 'Planka is an open-source Kanban board application that provides real-time collaboration similar to Trello. It offers multiple board views, task management features, and live updates for team collaboration with full self-hosting support.',
    website: 'https://planka.app',
    github: 'https://github.com/plankanban/planka',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['todoist', 'things'],
    categoryKeywords: ['kanban', 'tasks', 'collaboration', 'project management']
  },
  // CRM & Sales - Alternatives to Salesforce/HubSpot
  {
    name: 'OroCRM',
    slug: 'orocrm',
    short_description: 'Open-source CRM designed for commerce and B2B',
    description: 'OroCRM is an open-source CRM built specifically for e-commerce and B2B businesses. It provides customer management, sales pipeline tracking, and marketing automation with deep integration capabilities for popular e-commerce platforms and ERP systems.',
    website: 'https://oroinc.com/orocrm',
    github: 'https://github.com/orocrm/crm',
    license: 'OSL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['salesforce'],
    categoryKeywords: ['crm', 'sales', 'b2b', 'ecommerce']
  },
  {
    name: 'EspoCRM',
    slug: 'espocrm',
    short_description: 'Simple, modern CRM with customizability',
    description: 'EspoCRM is an open-source, lightweight CRM that provides essential customer relationship management features. It offers a clean interface for managing accounts, contacts, opportunities, and cases with extensive customization through its flexible architecture.',
    website: 'https://espocrm.com',
    github: 'https://github.com/espocrm/espocrm',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['salesforce'],
    categoryKeywords: ['crm', 'sales', 'contacts', 'lightweight']
  },
  {
    name: 'CiviCRM',
    slug: 'civicrm',
    short_description: 'CRM for non-profits and advocacy organizations',
    description: 'CiviCRM is an open-source CRM designed specifically for non-profit organizations, associations, and advocacy groups. It provides donor management, event planning, petition campaigns, and constituent engagement tools with tight integration into popular CMS platforms.',
    website: 'https://civicrm.org',
    github: 'https://github.com/civicrm/civicrm-core',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['salesforce'],
    categoryKeywords: ['crm', 'nonprofit', 'donors', 'advocacy']
  },
  {
    name: 'Vtiger',
    slug: 'vtiger',
    short_description: 'All-in-one CRM with sales and support features',
    description: 'Vtiger is an open-source CRM that combines sales force automation with customer support capabilities. It provides lead management, email integration, quote generation, and helpdesk features suitable for small to medium businesses seeking comprehensive CRM functionality.',
    website: 'https://www.vtiger.com',
    github: 'https://github.com/vtiger/vtigercrm',
    license: 'CPL-1.0 License',
    is_self_hosted: true,
    alternative_to: ['salesforce'],
    categoryKeywords: ['crm', 'sales', 'helpdesk', 'smb']
  },
  // Email & Marketing - Alternatives to Mailchimp/SendGrid
  {
    name: 'Postal',
    slug: 'postal',
    short_description: 'Complete mail server for outgoing email',
    description: 'Postal is a complete open-source mail server designed for sending and receiving email from web applications. It provides a web interface for managing queues, viewing logs, and monitoring delivery with full SMTP support and bounce handling.',
    website: 'https://postal.atech.media',
    github: 'https://github.com/postalserver/postal',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['sendgrid', 'mailchimp'],
    categoryKeywords: ['email', 'smtp', 'mail server', 'transactional']
  },
  {
    name: 'Mailcow',
    slug: 'mailcow',
    short_description: 'Dockerized mail server suite with modern UI',
    description: 'Mailcow is an open-source mail server suite that provides a complete email hosting solution with webmail, SMTP, IMAP, and filtering capabilities. It runs as a Docker container stack with a modern web interface for easy administration.',
    website: 'https://mailcow.email',
    github: 'https://github.com/mailcow/mailcow-dockerized',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['sendgrid'],
    categoryKeywords: ['email', 'mail server', 'docker', 'webmail']
  },
  {
    name: 'Mailu',
    slug: 'mailu',
    short_description: 'Simple yet functional mail server',
    description: 'Mailu is an open-source mail server that prioritizes simplicity while providing essential email services. It includes webmail, anti-spam, DKIM signing, and automatic user management with a straightforward Docker-based deployment.',
    website: 'https://mailu.io',
    github: 'https://github.com/Mailu/Mailu',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['sendgrid'],
    categoryKeywords: ['email', 'mail server', 'docker', 'simple']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // AI & Machine Learning
  'ai': ['ai-machine-learning', 'ai-development-platforms'],
  'machine learning': ['ai-machine-learning', 'machine-learning-infrastructure'],
  'chatbot': ['ai-interaction-interfaces', 'customer-support-success'],
  'conversational ai': ['ai-interaction-interfaces', 'ai-machine-learning'],
  'language model': ['ai-machine-learning', 'ai-development-platforms'],
  'llm': ['ai-machine-learning', 'ai-development-platforms'],
  'rag': ['ai-machine-learning', 'developer-tools'],
  'ai framework': ['ai-development-platforms', 'developer-tools'],
  'local ai': ['ai-machine-learning', 'ai-security-privacy'],
  'nlu': ['ai-machine-learning', 'ai-interaction-interfaces'],
  'bot builder': ['ai-interaction-interfaces', 'developer-tools'],
  'multi-agent': ['ai-machine-learning', 'automation'],
  'ml ops': ['machine-learning-infrastructure', 'devops-infrastructure'],
  'experiment tracking': ['machine-learning-infrastructure', 'data-analytics'],
  'data science': ['data-analytics', 'machine-learning-infrastructure'],
  'hyperparameter': ['machine-learning-infrastructure'],
  'data versioning': ['machine-learning-infrastructure', 'version-control'],
  
  // Search & Analytics
  'search': ['developer-tools', 'data-analytics'],
  'metasearch': ['developer-tools', 'security-privacy'],
  'ai search': ['ai-machine-learning', 'developer-tools'],
  'privacy': ['security-privacy', 'ai-security-privacy'],
  'analytics': ['analytics-platforms', 'data-analytics'],
  'events': ['analytics-platforms', 'data-analytics'],
  'cdp': ['analytics-platforms', 'marketing-customer-engagement'],
  'customer data': ['analytics-platforms', 'crm-sales'],
  'product': ['analytics-platforms', 'business-software'],
  
  // Transcription & Audio
  'transcription': ['ai-machine-learning', 'video-audio'],
  'speech recognition': ['ai-machine-learning', 'video-audio'],
  'audio': ['video-audio', 'content-media'],
  'offline': ['developer-tools', 'productivity'],
  'mobile': ['developer-tools', 'business-software'],
  'optimization': ['developer-tools', 'devops-infrastructure'],
  
  // Development Tools
  'cloud ide': ['ides-code-editors', 'developer-tools'],
  'development environment': ['developer-tools', 'ides-code-editors'],
  'devcontainer': ['containerization', 'developer-tools'],
  'workspace': ['developer-tools', 'productivity'],
  'containers': ['containerization', 'devops-infrastructure'],
  'docker': ['containerization', 'devops-infrastructure'],
  'vscode': ['ides-code-editors', 'developer-tools'],
  'remote development': ['developer-tools', 'cloud-platforms'],
  'browser': ['developer-tools', 'browser-extensions'],
  'kubernetes': ['orchestration', 'devops-infrastructure'],
  'eclipse': ['ides-code-editors', 'developer-tools'],
  
  // Launchers & Productivity
  'launcher': ['productivity', 'developer-tools'],
  'window manager': ['productivity', 'developer-tools'],
  'linux': ['developer-tools', 'devops-infrastructure'],
  'desktop': ['productivity', 'developer-tools'],
  'cross-platform': ['developer-tools', 'productivity'],
  'plugins': ['developer-tools', 'automation'],
  
  // Containers & DevOps
  'rootless': ['containerization', 'security-privacy'],
  'macos': ['developer-tools', 'productivity'],
  'local development': ['developer-tools', 'containerization'],
  'devops': ['devops-infrastructure', 'ci-cd'],
  
  // Low-code & Internal Tools
  'low-code': ['developer-tools', 'business-software'],
  'internal tools': ['developer-tools', 'business-software'],
  'admin panel': ['developer-tools', 'business-software'],
  'dashboard': ['business-intelligence', 'developer-tools'],
  'database': ['database-storage', 'developer-tools'],
  'automation': ['automation', 'productivity'],
  'app builder': ['developer-tools', 'business-software'],
  'connectors': ['developer-tools', 'automation'],
  'react': ['developer-tools'],
  'framework': ['developer-tools'],
  
  // Authentication & Identity
  'authentication': ['authentication-identity', 'security-privacy'],
  'identity': ['authentication-identity', 'security-privacy'],
  'sso': ['authentication-identity', 'security-privacy'],
  'oauth': ['authentication-identity', 'developer-tools'],
  'multi-tenant': ['authentication-identity', 'business-software'],
  'directory': ['authentication-identity', 'security-privacy'],
  'permissions': ['authentication-identity', 'security-privacy'],
  'enterprise': ['business-software', 'security-privacy'],
  'compliance': ['security-privacy', 'business-software'],
  'reverse proxy': ['devops-infrastructure', 'security-privacy'],
  'access management': ['authentication-identity', 'security-privacy'],
  
  // Storage
  'object storage': ['object-storage', 'database-storage'],
  's3': ['object-storage', 'cloud-platforms'],
  'cloud storage': ['object-storage', 'file-sharing'],
  'distributed': ['database-storage', 'devops-infrastructure'],
  'block storage': ['database-storage', 'devops-infrastructure'],
  'file storage': ['file-sharing', 'object-storage'],
  'file system': ['database-storage', 'file-sharing'],
  
  // Infrastructure as Code
  'infrastructure as code': ['infrastructure-as-code', 'devops-infrastructure'],
  'iac': ['infrastructure-as-code', 'devops-infrastructure'],
  'cloud': ['cloud-platforms', 'devops-infrastructure'],
  'gitops': ['ci-cd', 'devops-infrastructure'],
  'terraform': ['infrastructure-as-code', 'devops-infrastructure'],
  
  // Orchestration
  'orchestration': ['orchestration', 'devops-infrastructure'],
  'workload': ['orchestration', 'devops-infrastructure'],
  'hashicorp': ['devops-infrastructure', 'security-privacy'],
  'lightweight': ['containerization', 'devops-infrastructure'],
  'edge': ['devops-infrastructure', 'cloud-platforms'],
  'iot': ['home-automation', 'devops-infrastructure'],
  'multi-cluster': ['orchestration', 'devops-infrastructure'],
  'management': ['devops-infrastructure', 'business-software'],
  
  // Password Management & Security
  'password manager': ['password-management', 'security-privacy'],
  'gpg': ['encryption', 'security-privacy'],
  'cli': ['terminal-cli', 'developer-tools'],
  'encryption': ['encryption', 'security-privacy'],
  'bitwarden': ['password-management', 'security-privacy'],
  'self-hosted': ['devops-infrastructure', 'security-privacy'],
  'rust': ['developer-tools'],
  'keepass': ['password-management', 'security-privacy'],
  '2fa': ['authentication-identity', 'security-privacy'],
  'totp': ['authentication-identity', 'security-privacy'],
  'authenticator': ['authentication-identity', 'security-privacy'],
  'gtk': ['developer-tools'],
  
  // CAPTCHA & Bot Protection
  'captcha': ['security-privacy', 'developer-tools'],
  'bot protection': ['security-privacy', 'developer-tools'],
  'php': ['developer-tools'],
  
  // Secrets Management
  'secrets': ['security-privacy', 'devops-infrastructure'],
  'vault': ['security-privacy', 'devops-infrastructure'],
  'security': ['security-privacy'],
  'ci/cd': ['ci-cd', 'devops-infrastructure'],
  'config': ['devops-infrastructure', 'developer-tools'],
  
  // Logging & Monitoring
  'logging': ['monitoring-observability', 'devops-infrastructure'],
  'elk': ['monitoring-observability', 'data-analytics'],
  'grafana': ['monitoring-observability', 'data-visualization'],
  'observability': ['monitoring-observability', 'devops-infrastructure'],
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'pipeline': ['etl-data-pipelines', 'devops-infrastructure'],
  'metrics': ['monitoring-observability', 'data-analytics'],
  'elasticsearch': ['database-storage', 'monitoring-observability'],
  
  // APM & Performance
  'apm': ['monitoring-observability', 'developer-tools'],
  'tracing': ['monitoring-observability', 'developer-tools'],
  'microservices': ['devops-infrastructure', 'developer-tools'],
  'profiling': ['developer-tools', 'monitoring-observability'],
  'performance': ['developer-tools', 'monitoring-observability'],
  'debugging': ['developer-tools', 'testing-qa'],
  'alerting': ['monitoring-observability', 'devops-infrastructure'],
  'time series': ['database-storage', 'monitoring-observability'],
  'network': ['vpn-networking', 'devops-infrastructure'],
  'nagios': ['monitoring-observability'],
  'infrastructure': ['devops-infrastructure', 'cloud-platforms'],
  'auto-discovery': ['monitoring-observability', 'devops-infrastructure'],
  
  // Customer Support & Communication
  'live chat': ['customer-support-success', 'communication-collaboration'],
  'customer support': ['customer-support-success', 'business-software'],
  'helpdesk': ['customer-support-success', 'business-software'],
  'messaging': ['team-chat-messaging', 'communication-collaboration'],
  'telephony': ['communication-collaboration', 'business-software'],
  'pbx': ['communication-collaboration', 'business-software'],
  'voip': ['communication-collaboration', 'business-software'],
  'communication': ['communication-collaboration', 'business-software'],
  'softswitch': ['communication-collaboration', 'devops-infrastructure'],
  
  // Notes & Knowledge Management
  'notes': ['note-taking', 'productivity'],
  'knowledge base': ['knowledge-management', 'documentation'],
  'pkm': ['note-taking', 'knowledge-management'],
  'local-first': ['productivity', 'security-privacy'],
  'markdown': ['note-taking', 'documentation'],
  'wiki': ['knowledge-management', 'documentation'],
  'personal': ['productivity', 'note-taking'],
  'single-file': ['productivity', 'note-taking'],
  
  // Task Management
  'tasks': ['task-management', 'productivity'],
  'todo': ['task-management', 'productivity'],
  'pomodoro': ['time-tracking', 'productivity'],
  'time tracking': ['time-tracking', 'productivity'],
  'kanban': ['project-management', 'task-management'],
  'collaboration': ['document-collaboration', 'communication-collaboration'],
  'project management': ['project-management', 'business-software'],
  
  // CRM
  'crm': ['crm-sales', 'business-software'],
  'sales': ['crm-sales', 'business-software'],
  'b2b': ['crm-sales', 'business-software'],
  'ecommerce': ['e-commerce', 'online-stores'],
  'contacts': ['crm-sales', 'business-software'],
  'nonprofit': ['business-software'],
  'donors': ['business-software', 'crm-sales'],
  'advocacy': ['business-software'],
  'smb': ['business-software', 'crm-sales'],
  
  // Email
  'email': ['email-newsletters', 'communication-collaboration'],
  'smtp': ['email-newsletters', 'devops-infrastructure'],
  'mail server': ['email-newsletters', 'devops-infrastructure'],
  'transactional': ['email-newsletters', 'developer-tools'],
  'webmail': ['email-newsletters', 'communication-collaboration'],
  'simple': ['productivity', 'developer-tools'],
  
  // Microsoft
  'microsoft': ['developer-tools', 'business-software'],
  
  // Data
  'data': ['data-analytics', 'database-storage'],
};

async function seedNewAlternatives() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const allCategories = await Category.find().lean();
    const categoryMap = new Map(allCategories.map((c: any) => [c.slug, c._id]));
    console.log(`📂 Found ${allCategories.length} categories`);

    // First, ensure proprietary software exists
    console.log('\n📦 Adding proprietary software...');
    for (const prop of newProprietarySoftware) {
      const existing = await ProprietarySoftware.findOne({ slug: prop.slug });
      if (!existing) {
        await ProprietarySoftware.create(prop);
        console.log(`  ✅ Added: ${prop.name}`);
      }
    }

    // Get all proprietary software for linking
    const allProprietary = await ProprietarySoftware.find().lean();
    const proprietaryMap = new Map(allProprietary.map((p: any) => [p.slug, p._id]));
    console.log(`📦 Found ${allProprietary.length} proprietary software entries`);

    // Seed alternatives
    console.log('\n🌱 Seeding new alternatives...');
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
      const newAlt = await Alternative.create({
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
        health_score: 50 + Math.floor(Math.random() * 30), // Random health score 50-80
        vote_score: Math.floor(Math.random() * 50), // Random vote score 0-50
      });

      console.log(`  ✅ Added: ${alt.name} (${finalCategoryIds.length} categories, ${alternativeToIds.length} proprietary links)`);
      added++;
    }

    console.log(`\n✨ Done! Added ${added} new alternatives, skipped ${skipped} existing`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedNewAlternatives();
