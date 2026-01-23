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

// New proprietary software
const newProprietarySoftware = [
  { name: 'Notion AI', slug: 'notion-ai', description: 'AI writing assistant by Notion', website: 'https://notion.so' },
  { name: 'Jasper', slug: 'jasper', description: 'AI writing and content generation tool', website: 'https://jasper.ai' },
  { name: 'Copy.ai', slug: 'copy-ai', description: 'AI copywriting assistant', website: 'https://copy.ai' },
  { name: 'Grammarly', slug: 'grammarly', description: 'AI-powered writing assistant', website: 'https://grammarly.com' },
  { name: 'Google Drive', slug: 'google-drive', description: 'Cloud storage and file sharing', website: 'https://drive.google.com' },
  { name: 'Dropbox', slug: 'dropbox', description: 'Cloud storage service', website: 'https://dropbox.com' },
  { name: 'OneDrive', slug: 'onedrive', description: 'Microsoft cloud storage', website: 'https://onedrive.com' },
  { name: 'Google Photos', slug: 'google-photos', description: 'Photo storage and sharing', website: 'https://photos.google.com' },
  { name: 'iCloud Photos', slug: 'icloud-photos', description: 'Apple photo storage service', website: 'https://icloud.com' },
  { name: 'Adobe Premiere Pro', slug: 'adobe-premiere-pro', description: 'Professional video editing software', website: 'https://adobe.com/premiere' },
  { name: 'Final Cut Pro', slug: 'final-cut-pro', description: 'Professional video editing for Mac', website: 'https://apple.com/final-cut-pro' },
  { name: 'DaVinci Resolve', slug: 'davinci-resolve-prop', description: 'Professional video editing and color grading', website: 'https://blackmagicdesign.com/davinciresolve' },
  { name: 'Spotify', slug: 'spotify', description: 'Music streaming service', website: 'https://spotify.com' },
  { name: 'Apple Music', slug: 'apple-music', description: 'Apple music streaming service', website: 'https://apple.com/music' },
  { name: 'Pocket Casts', slug: 'pocket-casts', description: 'Podcast player app', website: 'https://pocketcasts.com' },
  { name: 'Overcast', slug: 'overcast', description: 'Podcast player for iOS', website: 'https://overcast.fm' },
  { name: 'Express VPN', slug: 'express-vpn', description: 'VPN service', website: 'https://expressvpn.com' },
  { name: 'NordVPN', slug: 'nordvpn', description: 'VPN and security service', website: 'https://nordvpn.com' },
  { name: 'Google Keep', slug: 'google-keep', description: 'Note-taking service', website: 'https://keep.google.com' },
  { name: 'Apple Notes', slug: 'apple-notes', description: 'Apple note-taking app', website: 'https://apple.com' },
];

// Final batch of alternatives (batch 4 - ensuring we reach 100)
const newAlternatives = [
  // AI Writing Tools
  {
    name: 'Llama.cpp',
    slug: 'llama-cpp',
    short_description: 'Run LLMs locally on your machine',
    description: 'llama.cpp enables running large language models locally with minimal setup. It provides optimized inference for various model architectures on consumer hardware, making AI accessible without cloud dependencies.',
    website: 'https://github.com/ggerganov/llama.cpp',
    github: 'https://github.com/ggerganov/llama.cpp',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['notion-ai', 'jasper'],
    categoryKeywords: ['ai', 'llm', 'local', 'inference']
  },
  {
    name: 'Text Generation WebUI',
    slug: 'text-generation-webui',
    short_description: 'Web interface for running LLMs',
    description: 'Text Generation WebUI provides a Gradio web interface for running large language models locally. It supports multiple model formats and offers chat, instruct, and notebook modes for various AI text generation tasks.',
    website: 'https://github.com/oobabooga/text-generation-webui',
    github: 'https://github.com/oobabooga/text-generation-webui',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['notion-ai', 'jasper', 'copy-ai'],
    categoryKeywords: ['ai', 'llm', 'webui', 'text generation']
  },
  {
    name: 'LanguageTool',
    slug: 'languagetool',
    short_description: 'Open-source grammar and style checker',
    description: 'LanguageTool is an open-source proofreading software for English, Spanish, German, and 30+ other languages. It detects grammar and style errors with explanations and suggestions for improvement.',
    website: 'https://languagetool.org',
    github: 'https://github.com/languagetool-org/languagetool',
    license: 'LGPL-2.1 License',
    is_self_hosted: true,
    alternative_to: ['grammarly'],
    categoryKeywords: ['writing', 'grammar', 'proofreading', 'multilingual']
  },
  {
    name: 'Vale',
    slug: 'vale',
    short_description: 'Syntax-aware prose linter',
    description: 'Vale is a syntax-aware linter for prose built with speed and extensibility in mind. It helps maintain consistent voice and style in documentation with customizable rules for technical writing.',
    website: 'https://vale.sh',
    github: 'https://github.com/errata-ai/vale',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['grammarly'],
    categoryKeywords: ['writing', 'linter', 'documentation', 'style']
  },
  // File Storage - Alternatives to Google Drive/Dropbox
  {
    name: 'Nextcloud',
    slug: 'nextcloud',
    short_description: 'Self-hosted productivity platform',
    description: 'Nextcloud is an open-source self-hosted productivity platform providing file sync and share, calendars, contacts, and collaborative document editing. It offers complete data sovereignty with extensive app ecosystem.',
    website: 'https://nextcloud.com',
    github: 'https://github.com/nextcloud/server',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-drive', 'dropbox', 'onedrive'],
    categoryKeywords: ['file storage', 'cloud', 'collaboration', 'self-hosted']
  },
  {
    name: 'Seafile',
    slug: 'seafile',
    short_description: 'High-performance file sync and share',
    description: 'Seafile is an open-source file hosting software with high performance and reliability. It provides file synchronization, encryption, and team collaboration features optimized for large file handling.',
    website: 'https://www.seafile.com',
    github: 'https://github.com/haiwen/seafile',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-drive', 'dropbox'],
    categoryKeywords: ['file storage', 'sync', 'encryption', 'performance']
  },
  {
    name: 'Syncthing',
    slug: 'syncthing',
    short_description: 'Continuous file synchronization',
    description: 'Syncthing is an open-source continuous file synchronization program that synchronizes files between two or more computers in real time. It is secure, decentralized, and does not require a central server.',
    website: 'https://syncthing.net',
    github: 'https://github.com/syncthing/syncthing',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['google-drive', 'dropbox'],
    categoryKeywords: ['file sync', 'p2p', 'decentralized', 'privacy']
  },
  {
    name: 'Filebrowser',
    slug: 'filebrowser',
    short_description: 'Web file browser and manager',
    description: 'Filebrowser provides a web interface for managing files within a specified directory. It allows uploading, deleting, previewing, and sharing files with customizable permissions and user management.',
    website: 'https://filebrowser.org',
    github: 'https://github.com/filebrowser/filebrowser',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['google-drive'],
    categoryKeywords: ['file manager', 'web', 'sharing', 'self-hosted']
  },
  // Photo Management - Alternatives to Google Photos
  {
    name: 'Immich',
    slug: 'immich',
    short_description: 'Self-hosted photo and video backup',
    description: 'Immich is a high-performance self-hosted photo and video backup solution. It provides mobile apps with automatic backup, face recognition, and a beautiful web interface similar to Google Photos.',
    website: 'https://immich.app',
    github: 'https://github.com/immich-app/immich',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-photos', 'icloud-photos'],
    categoryKeywords: ['photos', 'backup', 'mobile', 'face recognition']
  },
  {
    name: 'PhotoPrism',
    slug: 'photoprism',
    short_description: 'AI-powered photo management',
    description: 'PhotoPrism is an AI-powered photos app for the decentralized web. It uses the latest technologies to automatically tag and find photos without getting in your way with excellent self-hosting support.',
    website: 'https://photoprism.app',
    github: 'https://github.com/photoprism/photoprism',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-photos', 'icloud-photos'],
    categoryKeywords: ['photos', 'ai', 'tagging', 'decentralized']
  },
  {
    name: 'Lychee',
    slug: 'lychee',
    short_description: 'Self-hosted photo management',
    description: 'Lychee is a free, self-hosted photo management tool that provides a beautiful web interface for managing, sharing, and exploring photos. It includes albums, tags, and built-in image editing.',
    website: 'https://lychee.electerious.com',
    github: 'https://github.com/LycheeOrg/Lychee',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['google-photos'],
    categoryKeywords: ['photos', 'gallery', 'albums', 'self-hosted']
  },
  // Video Editing - Alternatives to Adobe Premiere/Final Cut
  {
    name: 'Kdenlive',
    slug: 'kdenlive',
    short_description: 'Professional video editor',
    description: 'Kdenlive is an open-source video editor with multi-track editing, effects, transitions, and support for various video formats. It provides professional features for video production on Linux, Windows, and macOS.',
    website: 'https://kdenlive.org',
    github: 'https://github.com/KDE/kdenlive',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro'],
    categoryKeywords: ['video editing', 'multi-track', 'effects', 'professional']
  },
  {
    name: 'Shotcut',
    slug: 'shotcut',
    short_description: 'Free, cross-platform video editor',
    description: 'Shotcut is a free, open-source, cross-platform video editor. It supports a wide range of formats and features 4K resolution support, network stream playback, and webcam capture with a native timeline.',
    website: 'https://shotcut.org',
    github: 'https://github.com/mltframework/shotcut',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro'],
    categoryKeywords: ['video editing', '4k', 'cross-platform', 'free']
  },
  {
    name: 'OpenShot',
    slug: 'openshot',
    short_description: 'Easy-to-use video editor',
    description: 'OpenShot is a free and open-source video editor designed for quick and easy video editing. It offers a simple interface with powerful features including unlimited tracks, video effects, and 3D animations.',
    website: 'https://openshot.org',
    github: 'https://github.com/OpenShot/openshot-qt',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro'],
    categoryKeywords: ['video editing', 'easy', 'beginner', '3d']
  },
  {
    name: 'DaVinci Resolve',
    slug: 'davinci-resolve',
    short_description: 'Professional video editing and color grading',
    description: 'DaVinci Resolve is a professional video editing software combining editing, color correction, visual effects, and audio post-production. The free version provides professional-grade features for filmmakers.',
    website: 'https://www.blackmagicdesign.com/products/davinciresolve',
    github: 'https://github.com/blackmagicdesign',
    license: 'Proprietary (Free)',
    is_self_hosted: false,
    alternative_to: ['adobe-premiere-pro', 'final-cut-pro'],
    categoryKeywords: ['video editing', 'color grading', 'vfx', 'professional']
  },
  // Music & Podcasts
  {
    name: 'Navidrome',
    slug: 'navidrome',
    short_description: 'Modern music server and streamer',
    description: 'Navidrome is an open-source web-based music collection server and streamer. It provides a modern UI, Subsonic API compatibility, and supports various audio formats for streaming your music library.',
    website: 'https://www.navidrome.org',
    github: 'https://github.com/navidrome/navidrome',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['spotify'],
    categoryKeywords: ['music', 'streaming', 'server', 'subsonic']
  },
  {
    name: 'Funkwhale',
    slug: 'funkwhale',
    short_description: 'Federated audio sharing platform',
    description: 'Funkwhale is a community-driven project that lets you listen and share music and audio within a decentralized, open network. It supports ActivityPub for federation with other Fediverse platforms.',
    website: 'https://funkwhale.audio',
    github: 'https://dev.funkwhale.audio/funkwhale/funkwhale',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['spotify'],
    categoryKeywords: ['music', 'federated', 'social', 'audio']
  },
  {
    name: 'AntennaPod',
    slug: 'antennapod',
    short_description: 'Open-source podcast player',
    description: 'AntennaPod is an open-source podcast manager and player for Android. It provides streaming, downloading, and playback features with variable playback speed, chapter support, and sleep timer.',
    website: 'https://antennapod.org',
    github: 'https://github.com/AntennaPod/AntennaPod',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['pocket-casts', 'overcast'],
    categoryKeywords: ['podcast', 'android', 'player', 'audio']
  },
  {
    name: 'gPodder',
    slug: 'gpodder',
    short_description: 'Media aggregator and podcast client',
    description: 'gPodder is a simple, open-source podcast client and media aggregator. It syncs with gpodder.net for managing subscriptions across devices and supports various media types beyond podcasts.',
    website: 'https://gpodder.github.io',
    github: 'https://github.com/gpodder/gpodder',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['pocket-casts'],
    categoryKeywords: ['podcast', 'media', 'sync', 'client']
  },
  // VPN
  {
    name: 'WireGuard',
    slug: 'wireguard',
    short_description: 'Fast, modern VPN protocol',
    description: 'WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster and simpler than IPsec and more performant than OpenVPN.',
    website: 'https://www.wireguard.com',
    github: 'https://github.com/WireGuard',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['express-vpn', 'nordvpn'],
    categoryKeywords: ['vpn', 'security', 'protocol', 'fast']
  },
  {
    name: 'Tailscale',
    slug: 'tailscale-headscale',
    short_description: 'WireGuard-based mesh VPN',
    description: 'Headscale is an open-source, self-hosted implementation of the Tailscale control server. It enables creating secure mesh VPNs with WireGuard without relying on proprietary coordination servers.',
    website: 'https://github.com/juanfont/headscale',
    github: 'https://github.com/juanfont/headscale',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['express-vpn', 'nordvpn'],
    categoryKeywords: ['vpn', 'mesh', 'wireguard', 'self-hosted']
  },
  {
    name: 'Nebula',
    slug: 'nebula-vpn',
    short_description: 'Scalable overlay networking tool',
    description: 'Nebula is a scalable overlay networking tool with a focus on performance, simplicity, and security. It creates mesh networks and enables direct connections between hosts through NAT traversal.',
    website: 'https://github.com/slackhq/nebula',
    github: 'https://github.com/slackhq/nebula',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['express-vpn', 'nordvpn'],
    categoryKeywords: ['vpn', 'overlay', 'mesh', 'networking']
  },
  // Note-taking
  {
    name: 'Joplin',
    slug: 'joplin',
    short_description: 'Open-source note-taking application',
    description: 'Joplin is an open-source note-taking and to-do application with synchronization capabilities. It supports Markdown, end-to-end encryption, and various cloud services for syncing notes across devices.',
    website: 'https://joplinapp.org',
    github: 'https://github.com/laurent22/joplin',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-keep', 'apple-notes'],
    categoryKeywords: ['notes', 'markdown', 'sync', 'encryption']
  },
  {
    name: 'Standard Notes',
    slug: 'standard-notes',
    short_description: 'End-to-end encrypted notes',
    description: 'Standard Notes is a simple, end-to-end encrypted notes app that provides privacy and longevity. It uses a simple data format that ensures your notes remain accessible and decryptable for decades.',
    website: 'https://standardnotes.com',
    github: 'https://github.com/standardnotes/app',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-keep', 'apple-notes'],
    categoryKeywords: ['notes', 'encryption', 'privacy', 'longevity']
  },
  {
    name: 'Logseq',
    slug: 'logseq',
    short_description: 'Privacy-first knowledge management',
    description: 'Logseq is a privacy-first, open-source knowledge base that works on top of local Markdown and Org-mode files. It provides outliner-based note-taking with bidirectional linking and graph visualization.',
    website: 'https://logseq.com',
    github: 'https://github.com/logseq/logseq',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['google-keep', 'apple-notes'],
    categoryKeywords: ['notes', 'knowledge', 'graph', 'outliner']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // AI
  'ai': ['ai-machine-learning', 'developer-tools'],
  'llm': ['ai-machine-learning', 'ai-development-platforms'],
  'local': ['developer-tools', 'productivity'],
  'inference': ['ai-machine-learning', 'developer-tools'],
  'webui': ['developer-tools', 'ai-machine-learning'],
  'text generation': ['ai-machine-learning', 'content-media'],
  
  // Writing
  'writing': ['productivity', 'content-media'],
  'grammar': ['productivity', 'developer-tools'],
  'proofreading': ['productivity', 'content-media'],
  'multilingual': ['developer-tools', 'business-software'],
  'linter': ['developer-tools', 'testing-qa'],
  'documentation': ['documentation', 'developer-tools'],
  'style': ['developer-tools', 'content-media'],
  
  // File Storage
  'file storage': ['file-sharing', 'object-storage'],
  'cloud': ['cloud-platforms', 'file-sharing'],
  'collaboration': ['document-collaboration', 'communication-collaboration'],
  'self-hosted': ['devops-infrastructure', 'security-privacy'],
  'sync': ['file-sharing', 'productivity'],
  'encryption': ['encryption', 'security-privacy'],
  'performance': ['developer-tools', 'monitoring-observability'],
  'file sync': ['file-sharing', 'productivity'],
  'p2p': ['vpn-networking', 'file-sharing'],
  'decentralized': ['security-privacy', 'vpn-networking'],
  'privacy': ['security-privacy', 'encryption'],
  'file manager': ['file-sharing', 'productivity'],
  'web': ['developer-tools', 'frontend-development'],
  'sharing': ['file-sharing', 'communication-collaboration'],
  
  // Photos
  'photos': ['photo-editing', 'file-sharing'],
  'backup': ['file-sharing', 'devops-infrastructure'],
  'mobile': ['developer-tools', 'productivity'],
  'face recognition': ['ai-machine-learning', 'photo-editing'],
  'tagging': ['productivity', 'ai-machine-learning'],
  'gallery': ['photo-editing', 'content-media'],
  'albums': ['photo-editing', 'file-sharing'],
  
  // Video
  'video editing': ['video-audio', 'content-media'],
  'multi-track': ['video-audio', 'content-media'],
  'effects': ['video-audio', 'graphic-design'],
  'professional': ['business-software', 'developer-tools'],
  '4k': ['video-audio', 'content-media'],
  'cross-platform': ['developer-tools', 'productivity'],
  'free': ['developer-tools', 'productivity'],
  'easy': ['productivity', 'developer-tools'],
  'beginner': ['productivity', 'developer-tools'],
  '3d': ['graphic-design', 'video-audio'],
  'color grading': ['video-audio', 'graphic-design'],
  'vfx': ['video-audio', 'graphic-design'],
  
  // Music & Podcasts
  'music': ['video-audio', 'content-media'],
  'streaming': ['video-audio', 'content-media'],
  'server': ['devops-infrastructure', 'backend-development'],
  'subsonic': ['video-audio', 'content-media'],
  'federated': ['communication-collaboration', 'social-networks'],
  'social': ['social-networks', 'communication-collaboration'],
  'audio': ['video-audio', 'content-media'],
  'podcast': ['video-audio', 'content-media'],
  'android': ['developer-tools', 'productivity'],
  'player': ['video-audio', 'productivity'],
  'media': ['content-media', 'video-audio'],
  'client': ['developer-tools', 'api-development'],
  
  // VPN
  'vpn': ['vpn-networking', 'security-privacy'],
  'security': ['security-privacy', 'authentication-identity'],
  'protocol': ['developer-tools', 'vpn-networking'],
  'fast': ['developer-tools', 'backend-development'],
  'mesh': ['vpn-networking', 'devops-infrastructure'],
  'wireguard': ['vpn-networking', 'security-privacy'],
  'overlay': ['vpn-networking', 'devops-infrastructure'],
  'networking': ['vpn-networking', 'devops-infrastructure'],
  
  // Notes
  'notes': ['note-taking', 'productivity'],
  'markdown': ['developer-tools', 'documentation'],
  'longevity': ['productivity', 'security-privacy'],
  'knowledge': ['knowledge-management', 'note-taking'],
  'graph': ['note-taking', 'knowledge-management'],
  'outliner': ['note-taking', 'productivity'],
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
    console.log('\n🌱 Seeding new alternatives (batch 4 - final)...');
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

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedNewAlternatives();
