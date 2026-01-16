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
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  short_description: { type: String, default: null },
  website: { type: String, required: true },
  github: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  license: { type: String, default: 'MIT' },
  is_self_hosted: { type: Boolean, default: true },
  health_score: { type: Number, default: 80 },
  approved: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// Categories to be used
const categoryDefinitions = [
  { name: 'AI & Development', slug: 'ai-development' },
  { name: 'Code Editors', slug: 'code-editors' },
  { name: 'Developer Tools', slug: 'developer-tools' },
  { name: 'AI Assistants', slug: 'ai-assistants' },
  { name: 'Productivity', slug: 'productivity' },
  { name: 'Note Taking', slug: 'note-taking' },
  { name: 'Task Management', slug: 'task-management' },
  { name: 'Knowledge Base', slug: 'knowledge-base' },
  { name: 'Bookmarking', slug: 'bookmarking' },
  { name: 'Communication', slug: 'communication' },
  { name: 'Team Chat', slug: 'team-chat' },
  { name: 'Video Conferencing', slug: 'video-conferencing' },
  { name: 'Customer Engagement', slug: 'customer-engagement' },
  { name: 'Design', slug: 'design' },
  { name: 'Prototyping', slug: 'prototyping' },
  { name: 'Image Editing', slug: 'image-editing' },
  { name: 'Graphic Design', slug: 'graphic-design' },
  { name: 'Whiteboard', slug: 'whiteboard' },
  { name: 'Screen Recording', slug: 'screen-recording' },
  { name: 'Low-Code', slug: 'low-code' },
  { name: 'App Builder', slug: 'app-builder' },
  { name: 'Collaboration', slug: 'collaboration' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Self-Hosted', slug: 'self-hosted' },
];

// First 20 proprietary software alternatives from open_source_alternatives.md
interface AlternativeData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  website: string;
  github: string;
  is_self_hosted: boolean;
  categoryNames: string[];
}

const alternativesData: Record<string, AlternativeData[]> = {
  'cursor': [
    {
      name: 'VS Code',
      slug: 'vs-code',
      short_description: 'The open-source core of the world\'s most popular code editor',
      description: 'Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js and has a rich ecosystem of extensions for other languages and runtimes.',
      website: 'https://code.visualstudio.com/',
      github: 'https://github.com/microsoft/vscode',
      is_self_hosted: true,
      categoryNames: ['Code Editors', 'Developer Tools', 'Open Source']
    },
    {
      name: 'Zed',
      slug: 'zed-editor',
      short_description: 'High-performance, multiplayer code editor from the creators of Atom',
      description: 'A lightning-fast code editor written in Rust, designed for high performance and collaborative editing. Created by the team behind Atom, Zed focuses on speed and real-time collaboration.',
      website: 'https://zed.dev/',
      github: 'https://github.com/zed-industries/zed',
      is_self_hosted: false,
      categoryNames: ['Code Editors', 'Developer Tools', 'Collaboration']
    },
    {
      name: 'VSCodium',
      slug: 'vscodium',
      short_description: 'Free/Libre Open Source Software Binaries of VS Code',
      description: 'VSCodium is a community-driven, freely-licensed binary distribution of Microsoft\'s VS Code editor. It removes telemetry and provides a truly open-source alternative.',
      website: 'https://vscodium.com/',
      github: 'https://github.com/VSCodium/vscodium',
      is_self_hosted: true,
      categoryNames: ['Code Editors', 'Developer Tools', 'Open Source']
    }
  ],
  'claude-code': [
    {
      name: 'OpenHands',
      slug: 'openhands',
      short_description: 'Open-source agentic AI software engineer',
      description: 'OpenHands (formerly OpenDevin) is an open-source platform for software development agents powered by AI. It enables autonomous coding, debugging, and software engineering tasks.',
      website: 'https://all-hands.dev/',
      github: 'https://github.com/All-Hands-AI/OpenHands',
      is_self_hosted: true,
      categoryNames: ['AI & Development', 'AI Assistants', 'Developer Tools']
    },
    {
      name: 'Aider',
      slug: 'aider',
      short_description: 'AI pair programming in your terminal',
      description: 'A command-line tool that lets you pair program with LLMs to edit code in your local repository. Aider works with GPT-4, Claude, and other models to help you write and refactor code.',
      website: 'https://aider.chat/',
      github: 'https://github.com/paul-gauthier/aider',
      is_self_hosted: true,
      categoryNames: ['AI & Development', 'AI Assistants', 'Developer Tools']
    },
    {
      name: 'Continue',
      slug: 'continue-dev',
      short_description: 'Open-source AI code assistant for VS Code and JetBrains',
      description: 'Continue is an open-source autopilot for software development. It connects any models and any context to build custom autocomplete and chat experiences inside your IDE.',
      website: 'https://www.continue.dev/',
      github: 'https://github.com/continuedev/continue',
      is_self_hosted: true,
      categoryNames: ['AI & Development', 'AI Assistants', 'Code Editors']
    }
  ],
  'github-copilot': [
    {
      name: 'Tabby',
      slug: 'tabby',
      short_description: 'Self-hosted AI coding assistant',
      description: 'Tabby is a self-hosted AI coding assistant that offers an open-source and on-premises alternative to GitHub Copilot. It provides code completion and chat capabilities.',
      website: 'https://tabby.tabbyml.com/',
      github: 'https://github.com/TabbyML/tabby',
      is_self_hosted: true,
      categoryNames: ['AI & Development', 'AI Assistants', 'Self-Hosted']
    },
    {
      name: 'Fauxpilot',
      slug: 'fauxpilot',
      short_description: 'Open-source GitHub Copilot replacement',
      description: 'An attempt to build a locally hosted version of GitHub Copilot. It uses the SalesForce CodeGen model for code completion suggestions.',
      website: 'https://github.com/fauxpilot/fauxpilot',
      github: 'https://github.com/fauxpilot/fauxpilot',
      is_self_hosted: true,
      categoryNames: ['AI & Development', 'AI Assistants', 'Self-Hosted']
    },
    {
      name: 'LocalAI',
      slug: 'localai',
      short_description: 'Self-hosted, local-first AI inference',
      description: 'LocalAI is a free, open-source alternative to OpenAI. It acts as a drop-in replacement REST API compatible with OpenAI API specifications for local inferencing.',
      website: 'https://localai.io/',
      github: 'https://github.com/mudler/LocalAI',
      is_self_hosted: true,
      categoryNames: ['AI & Development', 'AI Assistants', 'Self-Hosted']
    }
  ],
  'chatgpt': [
    {
      name: 'LibreChat',
      slug: 'librechat',
      short_description: 'Enhanced ChatGPT clone with multi-model support',
      description: 'LibreChat is an enhanced ChatGPT clone that supports multiple AI models including OpenAI, Azure, Anthropic, and Google. It offers a familiar interface with advanced features.',
      website: 'https://www.librechat.ai/',
      github: 'https://github.com/danny-avila/LibreChat',
      is_self_hosted: true,
      categoryNames: ['AI Assistants', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Chatbot UI',
      slug: 'chatbot-ui',
      short_description: 'Simple, open-source UI for AI models',
      description: 'A clean and easy-to-use interface for interacting with OpenAI and other AI models. Chatbot UI provides a simple way to chat with AI without unnecessary complexity.',
      website: 'https://www.chatbotui.com/',
      github: 'https://github.com/mckaywrigley/chatbot-ui',
      is_self_hosted: true,
      categoryNames: ['AI Assistants', 'Productivity', 'Open Source']
    },
    {
      name: 'HuggingChat',
      slug: 'huggingchat',
      short_description: 'Open-source chat interface by Hugging Face',
      description: 'HuggingChat is an open-source chat interface powered by open models. It provides a free and privacy-respecting alternative to ChatGPT.',
      website: 'https://huggingface.co/chat/',
      github: 'https://github.com/huggingface/chat-ui',
      is_self_hosted: true,
      categoryNames: ['AI Assistants', 'Productivity', 'Open Source']
    }
  ],
  'lovable': [
    {
      name: 'Wasp',
      slug: 'wasp',
      short_description: 'A DSL for building full-stack web apps',
      description: 'Wasp is a domain-specific language for building full-stack web applications with React and Node.js. It simplifies the development process by handling boilerplate code.',
      website: 'https://wasp-lang.dev/',
      github: 'https://github.com/wasp-lang/wasp',
      is_self_hosted: true,
      categoryNames: ['Low-Code', 'App Builder', 'Developer Tools']
    },
    {
      name: 'Lowdefy',
      slug: 'lowdefy',
      short_description: 'An open-source low-code framework',
      description: 'Build internal tools, web apps, and dashboards using YAML configuration files without writing code. Lowdefy makes it easy to create applications quickly.',
      website: 'https://lowdefy.com/',
      github: 'https://github.com/lowdefy/lowdefy',
      is_self_hosted: true,
      categoryNames: ['Low-Code', 'App Builder', 'Open Source']
    },
    {
      name: 'ToolJet',
      slug: 'tooljet',
      short_description: 'Open-source low-code platform for building internal tools',
      description: 'ToolJet is an open-source low-code platform for building and deploying internal tools. It connects to databases, APIs, and SaaS tools to create custom applications.',
      website: 'https://www.tooljet.com/',
      github: 'https://github.com/ToolJet/ToolJet',
      is_self_hosted: true,
      categoryNames: ['Low-Code', 'App Builder', 'Self-Hosted']
    }
  ],
  'notion': [
    {
      name: 'AppFlowy',
      slug: 'appflowy',
      short_description: 'Open-source alternative to Notion',
      description: 'AppFlowy is an open-source alternative to Notion built with Flutter and Rust. It provides a privacy-first workspace for notes, wikis, and project management.',
      website: 'https://www.appflowy.io/',
      github: 'https://github.com/AppFlowy-IO/AppFlowy',
      is_self_hosted: true,
      categoryNames: ['Productivity', 'Note Taking', 'Knowledge Base']
    },
    {
      name: 'AFFiNE',
      slug: 'affine',
      short_description: 'All-in-one workspace for notes and tasks',
      description: 'A privacy-first, open-source workspace that combines note-taking, whiteboarding, and database capabilities into one unified experience.',
      website: 'https://affine.pro/',
      github: 'https://github.com/toeverything/AFFiNE',
      is_self_hosted: true,
      categoryNames: ['Productivity', 'Note Taking', 'Collaboration']
    },
    {
      name: 'Anytype',
      slug: 'anytype',
      short_description: 'Local-first, privacy-focused workspace',
      description: 'Anytype is a local-first, E2E encrypted workspace for creating and organizing your thoughts. It works offline and syncs across devices securely.',
      website: 'https://anytype.io/',
      github: 'https://github.com/anyproto/anytype-ts',
      is_self_hosted: true,
      categoryNames: ['Productivity', 'Note Taking', 'Self-Hosted']
    }
  ],
  'todoist': [
    {
      name: 'Vikunja',
      slug: 'vikunja',
      short_description: 'Open-source to-do list for teams and individuals',
      description: 'Vikunja is a self-hosted, open-source to-do app that helps you organize your tasks. It supports lists, kanban boards, and team collaboration.',
      website: 'https://vikunja.io/',
      github: 'https://github.com/go-vikunja/vikunja',
      is_self_hosted: true,
      categoryNames: ['Task Management', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Super Productivity',
      slug: 'super-productivity',
      short_description: 'To-do list and time tracker for programmers',
      description: 'A productivity tool that integrates with Jira, GitHub, and GitLab. It combines task management with time tracking and Pomodoro features.',
      website: 'https://super-productivity.com/',
      github: 'https://github.com/johannesjo/super-productivity',
      is_self_hosted: true,
      categoryNames: ['Task Management', 'Productivity', 'Developer Tools']
    },
    {
      name: 'Taskade',
      slug: 'taskade',
      short_description: 'AI-powered task and project management',
      description: 'Taskade is a collaborative workspace for tasks, notes, and team chat. It offers AI-powered features for productivity and project management.',
      website: 'https://www.taskade.com/',
      github: 'https://github.com/taskade/taskade',
      is_self_hosted: false,
      categoryNames: ['Task Management', 'Productivity', 'Collaboration']
    }
  ],
  'evernote': [
    {
      name: 'Joplin',
      slug: 'joplin',
      short_description: 'Open-source note-taking and to-do application',
      description: 'Joplin is a free, open-source note-taking and to-do application with synchronization capabilities. It supports Markdown and end-to-end encryption.',
      website: 'https://joplinapp.org/',
      github: 'https://github.com/laurent22/joplin',
      is_self_hosted: true,
      categoryNames: ['Note Taking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Logseq',
      slug: 'logseq',
      short_description: 'Privacy-first, open-source knowledge base',
      description: 'A local-first, non-linear outliner for note-taking and knowledge management that supports Markdown and org-mode formats.',
      website: 'https://logseq.com/',
      github: 'https://github.com/logseq/logseq',
      is_self_hosted: true,
      categoryNames: ['Note Taking', 'Knowledge Base', 'Open Source']
    },
    {
      name: 'Standard Notes',
      slug: 'standard-notes',
      short_description: 'End-to-end encrypted notes app',
      description: 'Standard Notes is a simple and private notes app with end-to-end encryption. It focuses on longevity and cross-platform availability.',
      website: 'https://standardnotes.com/',
      github: 'https://github.com/standardnotes/app',
      is_self_hosted: true,
      categoryNames: ['Note Taking', 'Productivity', 'Self-Hosted']
    }
  ],
  'pocket': [
    {
      name: 'Wallabag',
      slug: 'wallabag',
      short_description: 'Self-hosted read-it-later application',
      description: 'Wallabag is a self-hosted application for saving web pages to read later. It extracts content and allows offline reading.',
      website: 'https://wallabag.org/',
      github: 'https://github.com/wallabag/wallabag',
      is_self_hosted: true,
      categoryNames: ['Bookmarking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Shiori',
      slug: 'shiori',
      short_description: 'Simple bookmark manager written in Go',
      description: 'A lightweight, self-hosted bookmark manager that can save a local copy of bookmarked pages for offline reading.',
      website: 'https://github.com/go-shiori/shiori',
      github: 'https://github.com/go-shiori/shiori',
      is_self_hosted: true,
      categoryNames: ['Bookmarking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Linkwarden',
      slug: 'linkwarden',
      short_description: 'Collaborative bookmark manager',
      description: 'Linkwarden is a collaborative bookmark manager to collect, organize, and preserve webpages. It supports tagging and full-text search.',
      website: 'https://linkwarden.app/',
      github: 'https://github.com/linkwarden/linkwarden',
      is_self_hosted: true,
      categoryNames: ['Bookmarking', 'Collaboration', 'Self-Hosted']
    }
  ],
  'obsidian': [
    {
      name: 'Logseq',
      slug: 'logseq-notes',
      short_description: 'Privacy-first, open-source knowledge base',
      description: 'A local-first, non-linear outliner for note-taking and knowledge management that supports Markdown and org-mode formats with bi-directional linking.',
      website: 'https://logseq.com/',
      github: 'https://github.com/logseq/logseq',
      is_self_hosted: true,
      categoryNames: ['Knowledge Base', 'Note Taking', 'Open Source']
    },
    {
      name: 'Foam',
      slug: 'foam',
      short_description: 'Personal knowledge management in VS Code',
      description: 'A set of tools and patterns for building a personal knowledge base with VS Code, inspired by Roam Research.',
      website: 'https://foambubble.github.io/foam/',
      github: 'https://github.com/foambubble/foam',
      is_self_hosted: true,
      categoryNames: ['Knowledge Base', 'Note Taking', 'Developer Tools']
    },
    {
      name: 'Dendron',
      slug: 'dendron',
      short_description: 'Hierarchical note-taking for developers',
      description: 'Dendron is an open-source, local-first, markdown-based, note-taking tool built on VS Code with hierarchical organization.',
      website: 'https://www.dendron.so/',
      github: 'https://github.com/dendronhq/dendron',
      is_self_hosted: true,
      categoryNames: ['Knowledge Base', 'Note Taking', 'Developer Tools']
    }
  ],
  'slack': [
    {
      name: 'Mattermost',
      slug: 'mattermost',
      short_description: 'Open-source platform for secure collaboration',
      description: 'Mattermost is an open-source, self-hosted Slack alternative that provides secure team messaging with deep integrations and customization options.',
      website: 'https://mattermost.com/',
      github: 'https://github.com/mattermost/mattermost',
      is_self_hosted: true,
      categoryNames: ['Team Chat', 'Communication', 'Self-Hosted']
    },
    {
      name: 'Zulip',
      slug: 'zulip',
      short_description: 'Open-source threaded team chat',
      description: 'A powerful chat application that uses topic-based threading to keep conversations organized. Ideal for teams and communities.',
      website: 'https://zulip.com/',
      github: 'https://github.com/zulip/zulip',
      is_self_hosted: true,
      categoryNames: ['Team Chat', 'Communication', 'Open Source']
    },
    {
      name: 'Rocket.Chat',
      slug: 'rocket-chat',
      short_description: 'Open-source communications platform',
      description: 'Rocket.Chat is a versatile chat platform that supports messaging, video calls, and custom integrations with omnichannel capabilities.',
      website: 'https://rocket.chat/',
      github: 'https://github.com/RocketChat/Rocket.Chat',
      is_self_hosted: true,
      categoryNames: ['Team Chat', 'Communication', 'Self-Hosted']
    }
  ],
  'discord': [
    {
      name: 'Revolt',
      slug: 'revolt',
      short_description: 'Open-source alternative to Discord',
      description: 'Revolt is an open-source, user-first chat platform built with modern technologies. It offers voice channels, bots, and customization.',
      website: 'https://revolt.chat/',
      github: 'https://github.com/revoltchat/revolt',
      is_self_hosted: true,
      categoryNames: ['Communication', 'Team Chat', 'Open Source']
    },
    {
      name: 'Element',
      slug: 'element',
      short_description: 'Secure, decentralized communication',
      description: 'An open-source messenger built on the Matrix protocol, offering end-to-end encryption and decentralized communication.',
      website: 'https://element.io/',
      github: 'https://github.com/vector-im/element-web',
      is_self_hosted: true,
      categoryNames: ['Communication', 'Team Chat', 'Self-Hosted']
    },
    {
      name: 'Spacebar',
      slug: 'spacebar',
      short_description: 'Self-hostable Discord-compatible server',
      description: 'Spacebar is a free, open-source, and self-hostable Discord-compatible chat platform that works with existing Discord clients.',
      website: 'https://spacebar.chat/',
      github: 'https://github.com/spacebarchat/server',
      is_self_hosted: true,
      categoryNames: ['Communication', 'Team Chat', 'Self-Hosted']
    }
  ],
  'zoom': [
    {
      name: 'Jitsi Meet',
      slug: 'jitsi-meet',
      short_description: 'Open-source video conferencing',
      description: 'Jitsi Meet is a free, open-source video conferencing solution that requires no account and can be self-hosted for complete privacy.',
      website: 'https://jitsi.org/jitsi-meet/',
      github: 'https://github.com/jitsi/jitsi-meet',
      is_self_hosted: true,
      categoryNames: ['Video Conferencing', 'Communication', 'Self-Hosted']
    },
    {
      name: 'BigBlueButton',
      slug: 'bigbluebutton',
      short_description: 'Open-source web conferencing for online learning',
      description: 'A professional web conferencing system designed for online learning with features like real-time sharing of audio, video, slides, and screen.',
      website: 'https://bigbluebutton.org/',
      github: 'https://github.com/bigbluebutton/bigbluebutton',
      is_self_hosted: true,
      categoryNames: ['Video Conferencing', 'Communication', 'Open Source']
    },
    {
      name: 'Galène',
      slug: 'galene',
      short_description: 'Lightweight video conferencing server',
      description: 'Galène is a lightweight, easy-to-deploy video conferencing server written in Go with support for groups and moderation.',
      website: 'https://galene.org/',
      github: 'https://github.com/jech/galene',
      is_self_hosted: true,
      categoryNames: ['Video Conferencing', 'Communication', 'Self-Hosted']
    }
  ],
  'microsoft-teams': [
    {
      name: 'Mattermost',
      slug: 'mattermost-teams',
      short_description: 'Open-source platform for secure collaboration',
      description: 'Mattermost is an open-source, self-hosted collaboration platform that provides secure messaging, file sharing, and workflow automation.',
      website: 'https://mattermost.com/',
      github: 'https://github.com/mattermost/mattermost',
      is_self_hosted: true,
      categoryNames: ['Team Chat', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'Rocket.Chat',
      slug: 'rocket-chat-teams',
      short_description: 'Open-source communications platform',
      description: 'A versatile chat platform that supports messaging, video calls, and custom integrations with omnichannel capabilities for teams.',
      website: 'https://rocket.chat/',
      github: 'https://github.com/RocketChat/Rocket.Chat',
      is_self_hosted: true,
      categoryNames: ['Team Chat', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'Jitsi Meet',
      slug: 'jitsi-meet-teams',
      short_description: 'Open-source video conferencing',
      description: 'Free, open-source video conferencing that can be integrated with other tools for a complete team collaboration solution.',
      website: 'https://jitsi.org/jitsi-meet/',
      github: 'https://github.com/jitsi/jitsi-meet',
      is_self_hosted: true,
      categoryNames: ['Video Conferencing', 'Collaboration', 'Self-Hosted']
    }
  ],
  'intercom': [
    {
      name: 'Chatwoot',
      slug: 'chatwoot',
      short_description: 'Open-source customer engagement suite',
      description: 'Chatwoot is an open-source customer engagement platform with live chat, email, and social media integration for customer support.',
      website: 'https://www.chatwoot.com/',
      github: 'https://github.com/chatwoot/chatwoot',
      is_self_hosted: true,
      categoryNames: ['Customer Engagement', 'Communication', 'Self-Hosted']
    },
    {
      name: 'Chaskiq',
      slug: 'chaskiq',
      short_description: 'Open-source conversational marketing platform',
      description: 'A powerful platform for customer support and marketing with features like live chat, bots, and campaign management.',
      website: 'https://chaskiq.io/',
      github: 'https://github.com/chaskiq/chaskiq',
      is_self_hosted: true,
      categoryNames: ['Customer Engagement', 'Communication', 'Open Source']
    },
    {
      name: 'Papercups',
      slug: 'papercups',
      short_description: 'Open-source live chat widget',
      description: 'Papercups is an open-source live chat widget built with Elixir for fast, real-time customer communication.',
      website: 'https://papercups.io/',
      github: 'https://github.com/papercups-io/papercups',
      is_self_hosted: true,
      categoryNames: ['Customer Engagement', 'Communication', 'Self-Hosted']
    }
  ],
  'figma': [
    {
      name: 'Penpot',
      slug: 'penpot',
      short_description: 'Open-source design and prototyping platform',
      description: 'Penpot is an open-source design platform for design and prototyping. It uses open web standards (SVG) and offers real-time collaboration.',
      website: 'https://penpot.app/',
      github: 'https://github.com/penpot/penpot',
      is_self_hosted: true,
      categoryNames: ['Design', 'Prototyping', 'Open Source']
    },
    {
      name: 'Quant-UX',
      slug: 'quant-ux',
      short_description: 'Open-source prototyping and design tool',
      description: 'A tool that focuses on data-driven design and user testing with built-in analytics for understanding user behavior.',
      website: 'https://quant-ux.com/',
      github: 'https://github.com/quant-ux/quant-ux',
      is_self_hosted: true,
      categoryNames: ['Design', 'Prototyping', 'Self-Hosted']
    },
    {
      name: 'Akira',
      slug: 'akira',
      short_description: 'Native Linux design application',
      description: 'Akira is a native Linux design application built with Vala and GTK for creating UI mockups and vector graphics.',
      website: 'https://github.com/akiraux/Akira',
      github: 'https://github.com/akiraux/Akira',
      is_self_hosted: true,
      categoryNames: ['Design', 'Graphic Design', 'Open Source']
    }
  ],
  'photoshop': [
    {
      name: 'GIMP',
      slug: 'gimp',
      short_description: 'GNU Image Manipulation Program',
      description: 'GIMP is a free, open-source image editor with advanced features for photo retouching, image composition, and image authoring.',
      website: 'https://www.gimp.org/',
      github: 'https://github.com/GNOME/gimp',
      is_self_hosted: true,
      categoryNames: ['Image Editing', 'Design', 'Open Source']
    },
    {
      name: 'Krita',
      slug: 'krita',
      short_description: 'Open-source digital painting software',
      description: 'A professional-grade painting tool designed for concept artists, illustrators, and texture artists with extensive brush engines.',
      website: 'https://krita.org/',
      github: 'https://github.com/KDE/krita',
      is_self_hosted: true,
      categoryNames: ['Image Editing', 'Design', 'Open Source']
    },
    {
      name: 'Photopea',
      slug: 'photopea',
      short_description: 'Online photo editor',
      description: 'Photopea is a web-based photo editor that supports PSD, XCF, Sketch, and other formats. It works in the browser without installation.',
      website: 'https://www.photopea.com/',
      github: 'https://github.com/nicholasyang2022/photopea',
      is_self_hosted: false,
      categoryNames: ['Image Editing', 'Design', 'Productivity']
    }
  ],
  'canva': [
    {
      name: 'Penpot',
      slug: 'penpot-canva',
      short_description: 'Open-source design and prototyping platform',
      description: 'Penpot offers an open-source alternative for design work with templates, components, and collaboration features.',
      website: 'https://penpot.app/',
      github: 'https://github.com/penpot/penpot',
      is_self_hosted: true,
      categoryNames: ['Graphic Design', 'Design', 'Open Source']
    },
    {
      name: 'Polotno',
      slug: 'polotno',
      short_description: 'SDK for building Canva-like applications',
      description: 'A set of React components to create a design editor with features like templates, text, images, and export capabilities.',
      website: 'https://polotno.com/',
      github: 'https://github.com/lavrton/polotno',
      is_self_hosted: true,
      categoryNames: ['Graphic Design', 'Design', 'Developer Tools']
    },
    {
      name: 'Scribe',
      slug: 'scribe-design',
      short_description: 'Open-source design tool',
      description: 'An open-source tool for creating graphics and designs with an intuitive interface.',
      website: 'https://github.com/scribe-org/scribe',
      github: 'https://github.com/scribe-org/scribe',
      is_self_hosted: true,
      categoryNames: ['Graphic Design', 'Design', 'Open Source']
    }
  ],
  'miro': [
    {
      name: 'Excalidraw',
      slug: 'excalidraw',
      short_description: 'Virtual whiteboard for sketching hand-drawn diagrams',
      description: 'Excalidraw is a virtual whiteboard tool that lets you easily create hand-drawn like diagrams and sketches collaboratively.',
      website: 'https://excalidraw.com/',
      github: 'https://github.com/excalidraw/excalidraw',
      is_self_hosted: true,
      categoryNames: ['Whiteboard', 'Collaboration', 'Open Source']
    },
    {
      name: 'tldraw',
      slug: 'tldraw',
      short_description: 'A tiny little drawing app',
      description: 'A lightweight and fast whiteboard application that focuses on simplicity and ease of use for quick sketches and diagrams.',
      website: 'https://www.tldraw.com/',
      github: 'https://github.com/tldraw/tldraw',
      is_self_hosted: true,
      categoryNames: ['Whiteboard', 'Design', 'Open Source']
    },
    {
      name: 'OpenBoard',
      slug: 'openboard',
      short_description: 'Interactive whiteboard for education',
      description: 'OpenBoard is an open-source interactive whiteboard application designed for use in schools and universities.',
      website: 'https://openboard.ch/',
      github: 'https://github.com/OpenBoard-org/OpenBoard',
      is_self_hosted: true,
      categoryNames: ['Whiteboard', 'Collaboration', 'Open Source']
    }
  ],
  'screen-studio': [
    {
      name: 'OBS Studio',
      slug: 'obs-studio',
      short_description: 'Open-source software for video recording and live streaming',
      description: 'OBS Studio is free and open-source software for video recording and live streaming with powerful configuration options.',
      website: 'https://obsproject.com/',
      github: 'https://github.com/obsproject/obs-studio',
      is_self_hosted: true,
      categoryNames: ['Screen Recording', 'Productivity', 'Open Source']
    },
    {
      name: 'ShareX',
      slug: 'sharex',
      short_description: 'Screen capture and file sharing tool for Windows',
      description: 'A feature-rich tool for capturing screenshots and recording videos with many customization options and upload destinations.',
      website: 'https://getsharex.com/',
      github: 'https://github.com/ShareX/ShareX',
      is_self_hosted: true,
      categoryNames: ['Screen Recording', 'Productivity', 'Open Source']
    },
    {
      name: 'Kooha',
      slug: 'kooha',
      short_description: 'Simple screen recorder for Linux',
      description: 'Kooha is a simple screen recorder for Linux that focuses on simplicity and ease of use for quick recordings.',
      website: 'https://github.com/SeaDve/Kooha',
      github: 'https://github.com/SeaDve/Kooha',
      is_self_hosted: true,
      categoryNames: ['Screen Recording', 'Productivity', 'Open Source']
    }
  ]
};

async function seedAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // First, ensure all categories exist
    console.log('\n📁 Creating categories...');
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    
    for (const catDef of categoryDefinitions) {
      const category = await Category.findOneAndUpdate(
        { slug: catDef.slug },
        { name: catDef.name, slug: catDef.slug },
        { upsert: true, new: true }
      );
      categoryMap[catDef.name] = category._id;
      console.log(`   ✅ Category: ${catDef.name}`);
    }

    // Get proprietary software
    const proprietaryList = [
      'cursor', 'claude-code', 'github-copilot', 'chatgpt', 'lovable',
      'notion', 'todoist', 'evernote', 'pocket', 'obsidian',
      'slack', 'discord', 'zoom', 'microsoft-teams', 'intercom',
      'figma', 'photoshop', 'canva', 'miro', 'screen-studio'
    ];

    for (const propSlug of proprietaryList) {
      const proprietary = await ProprietarySoftware.findOne({ slug: propSlug });
      
      if (!proprietary) {
        console.log(`\n⚠️  Proprietary software not found: ${propSlug}`);
        continue;
      }

      console.log(`\n🔍 Adding alternatives for ${proprietary.name}...`);
      
      const altsToAdd = alternativesData[propSlug] || [];
      
      for (const altData of altsToAdd) {
        try {
          // Get category IDs for this alternative
          const categoryIds = altData.categoryNames
            .map(name => categoryMap[name])
            .filter(id => id !== undefined);

          const alt = await Alternative.findOneAndUpdate(
            { slug: altData.slug },
            { 
              name: altData.name,
              slug: altData.slug,
              description: altData.description,
              short_description: altData.short_description,
              website: altData.website,
              github: altData.github,
              is_self_hosted: altData.is_self_hosted,
              categories: categoryIds,
              approved: true,
              $addToSet: { alternative_to: proprietary._id },
              updated_at: new Date() 
            },
            { upsert: true, new: true }
          );
          console.log(`   ✅ Added/Updated: ${alt.name} (${altData.categoryNames.join(', ')})`);
        } catch (err: any) {
          console.error(`   ❌ Error adding ${altData.name}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Finished adding alternatives for the first 20 proprietary software!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
