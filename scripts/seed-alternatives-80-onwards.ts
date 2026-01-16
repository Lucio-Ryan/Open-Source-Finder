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
  { name: 'Calendar', slug: 'calendar' },
  { name: 'Scheduling', slug: 'scheduling' },
  { name: 'Time Tracking', slug: 'time-tracking' },
  { name: 'Productivity', slug: 'productivity' },
  { name: 'Developer Tools', slug: 'developer-tools' },
  { name: 'Code Repository', slug: 'code-repository' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Version Control', slug: 'version-control' },
  { name: 'Database', slug: 'database' },
  { name: 'Cloud', slug: 'cloud' },
  { name: 'AI', slug: 'ai' },
  { name: 'Voice', slug: 'voice' },
  { name: 'Browser', slug: 'browser' },
  { name: 'VPN', slug: 'vpn' },
  { name: 'Privacy', slug: 'privacy' },
  { name: 'Security', slug: 'security' },
  { name: 'Photography', slug: 'photography' },
  { name: 'Image Editing', slug: 'image-editing' },
  { name: 'Music', slug: 'music' },
  { name: 'Media', slug: 'media' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Self-Hosted', slug: 'self-hosted' },
];

// Proprietary software alternatives 80+ from seed-proprietary.ts
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
  'calendly': [
    {
      name: 'Cal.com',
      slug: 'calcom',
      short_description: 'Open-source scheduling platform',
      description: 'Cal.com is an open-source Calendly alternative for scheduling meetings and appointments with customizable workflows.',
      website: 'https://cal.com/',
      github: 'https://github.com/calcom/cal.com',
      is_self_hosted: true,
      categoryNames: ['Calendar', 'Scheduling', 'Self-Hosted']
    },
    {
      name: 'Easy!Appointments',
      slug: 'easy-appointments',
      short_description: 'Open-source appointment scheduler',
      description: 'A highly customizable web application for managing appointments and schedules with a clean interface.',
      website: 'https://easyappointments.org/',
      github: 'https://github.com/alextselegidis/easyappointments',
      is_self_hosted: true,
      categoryNames: ['Calendar', 'Scheduling', 'Self-Hosted']
    },
    {
      name: 'Rallly',
      slug: 'rallly',
      short_description: 'Open-source scheduling and polling',
      description: 'A simple and easy-to-use tool for scheduling meetings and creating polls for finding the best time.',
      website: 'https://rallly.co/',
      github: 'https://github.com/lukevella/rallly',
      is_self_hosted: true,
      categoryNames: ['Scheduling', 'Productivity', 'Self-Hosted']
    }
  ],
  'google-calendar': [
    {
      name: 'Nextcloud Calendar',
      slug: 'nextcloud-calendar',
      short_description: 'Self-hosted calendar and contacts',
      description: 'A fully-featured calendar application integrated with Nextcloud for managing events and tasks.',
      website: 'https://apps.nextcloud.com/apps/calendar',
      github: 'https://github.com/nextcloud/calendar',
      is_self_hosted: true,
      categoryNames: ['Calendar', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Radicale',
      slug: 'radicale',
      short_description: 'Simple calendar and contact server',
      description: 'A small but powerful CalDAV and CardDAV server for managing your calendars and contacts.',
      website: 'https://radicale.org/',
      github: 'https://github.com/Kozea/Radicale',
      is_self_hosted: true,
      categoryNames: ['Calendar', 'Self-Hosted', 'Open Source']
    },
    {
      name: 'Baikal',
      slug: 'baikal',
      short_description: 'Lightweight CalDAV and CardDAV server',
      description: 'A simple and lightweight server for syncing calendars and contacts across devices.',
      website: 'https://sabre.io/baikal/',
      github: 'https://github.com/sabre-io/Baikal',
      is_self_hosted: true,
      categoryNames: ['Calendar', 'Self-Hosted', 'Open Source']
    }
  ],
  'toggl': [
    {
      name: 'Traggo',
      slug: 'traggo',
      short_description: 'Tag-based time tracking',
      description: 'A simple and powerful tag-based time tracking tool with a modern web interface.',
      website: 'https://traggo.net/',
      github: 'https://github.com/traggo/server',
      is_self_hosted: true,
      categoryNames: ['Time Tracking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Kimai',
      slug: 'kimai',
      short_description: 'Open-source time tracking software',
      description: 'A professional time tracking application with invoicing, reporting, and team management features.',
      website: 'https://www.kimai.org/',
      github: 'https://github.com/kimai/kimai',
      is_self_hosted: true,
      categoryNames: ['Time Tracking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Timekeeper',
      slug: 'timekeeper',
      short_description: 'Simple time tracking tool',
      description: 'A minimalist time tracking application for tracking work hours and generating reports.',
      website: 'https://github.com/AlexanderPruss/timekeeper',
      github: 'https://github.com/AlexanderPruss/timekeeper',
      is_self_hosted: true,
      categoryNames: ['Time Tracking', 'Productivity', 'Open Source']
    }
  ],
  'clockify': [
    {
      name: 'Kimai',
      slug: 'kimai-clockify',
      short_description: 'Open-source time tracking software',
      description: 'A comprehensive time tracking solution with reporting, invoicing, and team collaboration features.',
      website: 'https://www.kimai.org/',
      github: 'https://github.com/kimai/kimai',
      is_self_hosted: true,
      categoryNames: ['Time Tracking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'Traggo',
      slug: 'traggo-clockify',
      short_description: 'Tag-based time tracking',
      description: 'A flexible time tracking tool that uses tags instead of projects for better organization.',
      website: 'https://traggo.net/',
      github: 'https://github.com/traggo/server',
      is_self_hosted: true,
      categoryNames: ['Time Tracking', 'Productivity', 'Self-Hosted']
    },
    {
      name: 'TimeTagger',
      slug: 'timetagger',
      short_description: 'Open-source time tracking',
      description: 'A simple and privacy-focused time tracking tool with tags and analytics.',
      website: 'https://timetagger.app/',
      github: 'https://github.com/almarklein/timetagger',
      is_self_hosted: true,
      categoryNames: ['Time Tracking', 'Productivity', 'Self-Hosted']
    }
  ],
  'github': [
    {
      name: 'Gitea',
      slug: 'gitea',
      short_description: 'Lightweight self-hosted Git service',
      description: 'Gitea is a painless self-hosted Git service written in Go, offering a clean interface and powerful features.',
      website: 'https://gitea.io/',
      github: 'https://github.com/go-gitea/gitea',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'Developer Tools', 'Self-Hosted']
    },
    {
      name: 'Forgejo',
      slug: 'forgejo',
      short_description: 'Self-hosted Git forge',
      description: 'A community-driven fork of Gitea focused on self-hosting and collaboration.',
      website: 'https://forgejo.org/',
      github: 'https://codeberg.org/forgejo/forgejo',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'Developer Tools', 'Self-Hosted']
    },
    {
      name: 'Gogs',
      slug: 'gogs',
      short_description: 'Painless self-hosted Git service',
      description: 'A simple and easy-to-use Git service with a minimal footprint written in Go.',
      website: 'https://gogs.io/',
      github: 'https://github.com/gogs/gogs',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'Developer Tools', 'Self-Hosted']
    }
  ],
  'gitlab': [
    {
      name: 'Gitea',
      slug: 'gitea-gitlab',
      short_description: 'Lightweight self-hosted Git service',
      description: 'A simple, fast, and reliable self-hosted Git service with CI/CD, issue tracking, and more.',
      website: 'https://gitea.io/',
      github: 'https://github.com/go-gitea/gitea',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'DevOps', 'Self-Hosted']
    },
    {
      name: 'Forgejo',
      slug: 'forgejo-gitlab',
      short_description: 'Self-hosted Git forge',
      description: 'A powerful alternative for code hosting with built-in CI/CD and collaboration features.',
      website: 'https://forgejo.org/',
      github: 'https://codeberg.org/forgejo/forgejo',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'DevOps', 'Self-Hosted']
    },
    {
      name: 'OneDev',
      slug: 'onedev',
      short_description: 'Self-hosted Git server with CI/CD',
      description: 'An all-in-one DevOps platform with Git hosting, issue tracking, and CI/CD pipelines.',
      website: 'https://onedev.io/',
      github: 'https://github.com/theonedev/onedev',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'DevOps', 'Self-Hosted']
    }
  ],
  'bitbucket': [
    {
      name: 'Gitea',
      slug: 'gitea-bitbucket',
      short_description: 'Lightweight self-hosted Git service',
      description: 'A modern and feature-rich Git service that\'s easy to deploy and maintain.',
      website: 'https://gitea.io/',
      github: 'https://github.com/go-gitea/gitea',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'Version Control', 'Self-Hosted']
    },
    {
      name: 'Gogs',
      slug: 'gogs-bitbucket',
      short_description: 'Painless self-hosted Git service',
      description: 'A minimalist Git service with a focus on simplicity and ease of use.',
      website: 'https://gogs.io/',
      github: 'https://github.com/gogs/gogs',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'Version Control', 'Self-Hosted']
    },
    {
      name: 'Kallithea',
      slug: 'kallithea',
      short_description: 'Source code management system',
      description: 'A fast and powerful management system for Mercurial and Git with a unified experience.',
      website: 'https://kallithea-scm.org/',
      github: 'https://github.com/kallithea-scm/kallithea',
      is_self_hosted: true,
      categoryNames: ['Code Repository', 'Version Control', 'Self-Hosted']
    }
  ],
  'mongodb-atlas': [
    {
      name: 'Percona Server for MongoDB',
      slug: 'percona-mongodb',
      short_description: 'Enhanced MongoDB distribution',
      description: 'A free, enhanced, fully compatible MongoDB replacement with enterprise-grade features.',
      website: 'https://www.percona.com/mongodb',
      github: 'https://github.com/percona/percona-server-mongodb',
      is_self_hosted: true,
      categoryNames: ['Database', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'FerretDB',
      slug: 'ferretdb',
      short_description: 'MongoDB alternative on PostgreSQL',
      description: 'A MongoDB-compatible database built on PostgreSQL and SQLite, offering a truly open-source alternative.',
      website: 'https://www.ferretdb.io/',
      github: 'https://github.com/FerretDB/FerretDB',
      is_self_hosted: true,
      categoryNames: ['Database', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'ArangoDB',
      slug: 'arangodb',
      short_description: 'Multi-model database',
      description: 'A native multi-model database supporting documents, graphs, and key-value pairs.',
      website: 'https://www.arangodb.com/',
      github: 'https://github.com/arangodb/arangodb',
      is_self_hosted: true,
      categoryNames: ['Database', 'Open Source', 'Self-Hosted']
    }
  ],
  'amazon-rds': [
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      short_description: 'Advanced open-source relational database',
      description: 'A powerful, open-source object-relational database system with a strong reputation for reliability and data integrity.',
      website: 'https://www.postgresql.org/',
      github: 'https://github.com/postgres/postgres',
      is_self_hosted: true,
      categoryNames: ['Database', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'MariaDB',
      slug: 'mariadb',
      short_description: 'Open-source MySQL fork',
      description: 'A community-developed fork of MySQL with better performance, stability, and new features.',
      website: 'https://mariadb.org/',
      github: 'https://github.com/MariaDB/server',
      is_self_hosted: true,
      categoryNames: ['Database', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'CockroachDB',
      slug: 'cockroachdb',
      short_description: 'Distributed SQL database',
      description: 'A cloud-native distributed SQL database built for resilience and scale.',
      website: 'https://www.cockroachlabs.com/',
      github: 'https://github.com/cockroachdb/cockroach',
      is_self_hosted: true,
      categoryNames: ['Database', 'Cloud', 'Self-Hosted']
    }
  ],
  'wisprflow': [
    {
      name: 'Whisper',
      slug: 'openai-whisper',
      short_description: 'Open-source speech recognition',
      description: 'OpenAI\'s Whisper is a robust automatic speech recognition system trained on 680,000 hours of multilingual data.',
      website: 'https://github.com/openai/whisper',
      github: 'https://github.com/openai/whisper',
      is_self_hosted: true,
      categoryNames: ['AI', 'Voice', 'Open Source']
    },
    {
      name: 'Vosk',
      slug: 'vosk',
      short_description: 'Offline speech recognition',
      description: 'A speech recognition toolkit that works offline and supports multiple languages.',
      website: 'https://alphacephei.com/vosk/',
      github: 'https://github.com/alphacep/vosk-api',
      is_self_hosted: true,
      categoryNames: ['AI', 'Voice', 'Open Source']
    },
    {
      name: 'Coqui TTS',
      slug: 'coqui-tts',
      short_description: 'Open-source text-to-speech',
      description: 'A deep learning toolkit for text-to-speech synthesis with support for multiple languages.',
      website: 'https://coqui.ai/',
      github: 'https://github.com/coqui-ai/TTS',
      is_self_hosted: true,
      categoryNames: ['AI', 'Voice', 'Open Source']
    }
  ],
  'comet': [
    {
      name: 'Brave',
      slug: 'brave',
      short_description: 'Privacy-focused browser',
      description: 'A fast, secure, and privacy-focused browser that blocks ads and trackers by default.',
      website: 'https://brave.com/',
      github: 'https://github.com/brave/brave-browser',
      is_self_hosted: false,
      categoryNames: ['Browser', 'Privacy', 'Open Source']
    },
    {
      name: 'Vivaldi',
      slug: 'vivaldi',
      short_description: 'Feature-rich browser',
      description: 'A highly customizable browser with built-in tools for power users and privacy features.',
      website: 'https://vivaldi.com/',
      github: 'https://github.com/vivaldi',
      is_self_hosted: false,
      categoryNames: ['Browser', 'Privacy', 'Open Source']
    },
    {
      name: 'LibreWolf',
      slug: 'librewolf',
      short_description: 'Privacy-hardened Firefox fork',
      description: 'A custom version of Firefox focused on privacy, security, and freedom.',
      website: 'https://librewolf.net/',
      github: 'https://gitlab.com/librewolf-community/browser',
      is_self_hosted: false,
      categoryNames: ['Browser', 'Privacy', 'Open Source']
    }
  ],
  'arc': [
    {
      name: 'Zen Browser',
      slug: 'zen-browser',
      short_description: 'Beautifully designed Firefox-based browser',
      description: 'A modern, privacy-focused browser built on Firefox with a beautiful and minimalist design.',
      website: 'https://zen-browser.app/',
      github: 'https://github.com/zen-browser/desktop',
      is_self_hosted: false,
      categoryNames: ['Browser', 'Privacy', 'Open Source']
    },
    {
      name: 'Brave',
      slug: 'brave-arc',
      short_description: 'Privacy-focused browser',
      description: 'A fast and privacy-focused browser with built-in ad blocking and crypto wallet.',
      website: 'https://brave.com/',
      github: 'https://github.com/brave/brave-browser',
      is_self_hosted: false,
      categoryNames: ['Browser', 'Privacy', 'Open Source']
    },
    {
      name: 'Vivaldi',
      slug: 'vivaldi-arc',
      short_description: 'Feature-rich browser',
      description: 'A highly customizable browser with powerful features for productivity and privacy.',
      website: 'https://vivaldi.com/',
      github: 'https://github.com/vivaldi',
      is_self_hosted: false,
      categoryNames: ['Browser', 'Open Source', 'Productivity']
    }
  ],
  'nordvpn': [
    {
      name: 'WireGuard',
      slug: 'wireguard',
      short_description: 'Fast and modern VPN protocol',
      description: 'WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography.',
      website: 'https://www.wireguard.com/',
      github: 'https://github.com/WireGuard',
      is_self_hosted: true,
      categoryNames: ['VPN', 'Security', 'Self-Hosted']
    },
    {
      name: 'OpenVPN',
      slug: 'openvpn',
      short_description: 'Open-source VPN solution',
      description: 'A full-featured SSL VPN solution that implements OSI layer 2 or 3 secure network extension.',
      website: 'https://openvpn.net/',
      github: 'https://github.com/OpenVPN/openvpn',
      is_self_hosted: true,
      categoryNames: ['VPN', 'Security', 'Self-Hosted']
    },
    {
      name: 'SoftEther VPN',
      slug: 'softether',
      short_description: 'Multi-protocol VPN software',
      description: 'A powerful and easy-to-use multi-protocol VPN software with advanced features.',
      website: 'https://www.softether.org/',
      github: 'https://github.com/SoftEtherVPN/SoftEtherVPN',
      is_self_hosted: true,
      categoryNames: ['VPN', 'Security', 'Self-Hosted']
    }
  ],
  'expressvpn': [
    {
      name: 'WireGuard',
      slug: 'wireguard-express',
      short_description: 'Fast and modern VPN protocol',
      description: 'A next-generation VPN protocol that\'s simpler, faster, and more secure than traditional VPNs.',
      website: 'https://www.wireguard.com/',
      github: 'https://github.com/WireGuard',
      is_self_hosted: true,
      categoryNames: ['VPN', 'Security', 'Self-Hosted']
    },
    {
      name: 'OpenVPN',
      slug: 'openvpn-express',
      short_description: 'Open-source VPN solution',
      description: 'A robust and highly configurable VPN solution with strong encryption and security features.',
      website: 'https://openvpn.net/',
      github: 'https://github.com/OpenVPN/openvpn',
      is_self_hosted: true,
      categoryNames: ['VPN', 'Security', 'Self-Hosted']
    },
    {
      name: 'Tailscale',
      slug: 'tailscale',
      short_description: 'Zero-config VPN built on WireGuard',
      description: 'A modern VPN built on WireGuard that makes it easy to connect your devices securely.',
      website: 'https://tailscale.com/',
      github: 'https://github.com/tailscale/tailscale',
      is_self_hosted: false,
      categoryNames: ['VPN', 'Security', 'Open Source']
    }
  ],
  'unsplash': [
    {
      name: 'Pexels',
      slug: 'pexels',
      short_description: 'Free stock photos and videos',
      description: 'A platform offering free stock photos and videos contributed by a community of creators.',
      website: 'https://www.pexels.com/',
      github: 'https://github.com/pexels',
      is_self_hosted: false,
      categoryNames: ['Photography', 'Media', 'Open Source']
    },
    {
      name: 'Pixabay',
      slug: 'pixabay',
      short_description: 'Free images and videos',
      description: 'A vibrant community sharing free images, videos, and music with a vast collection.',
      website: 'https://pixabay.com/',
      github: 'https://github.com/pixabay',
      is_self_hosted: false,
      categoryNames: ['Photography', 'Media', 'Open Source']
    },
    {
      name: 'LibreStock',
      slug: 'librestock',
      short_description: 'Free stock photo search',
      description: 'A search engine that searches multiple free stock photo websites at once.',
      website: 'https://librestock.com/',
      github: 'https://github.com/librestock/photos',
      is_self_hosted: false,
      categoryNames: ['Photography', 'Media', 'Open Source']
    }
  ],
  'lightroom': [
    {
      name: 'darktable',
      slug: 'darktable',
      short_description: 'Open-source photography workflow',
      description: 'A photography workflow application and raw developer with powerful editing capabilities.',
      website: 'https://www.darktable.org/',
      github: 'https://github.com/darktable-org/darktable',
      is_self_hosted: true,
      categoryNames: ['Photography', 'Image Editing', 'Open Source']
    },
    {
      name: 'RawTherapee',
      slug: 'rawtherapee',
      short_description: 'Cross-platform raw image processing',
      description: 'A powerful and free raw photo processing program with a comprehensive set of tools.',
      website: 'https://www.rawtherapee.com/',
      github: 'https://github.com/Beep6581/RawTherapee',
      is_self_hosted: true,
      categoryNames: ['Photography', 'Image Editing', 'Open Source']
    },
    {
      name: 'digiKam',
      slug: 'digikam',
      short_description: 'Professional photo management',
      description: 'A professional photo management program with powerful image editing and organization tools.',
      website: 'https://www.digikam.org/',
      github: 'https://github.com/KDE/digikam',
      is_self_hosted: true,
      categoryNames: ['Photography', 'Image Editing', 'Open Source']
    }
  ],
  'spotify': [
    {
      name: 'Funkwhale',
      slug: 'funkwhale',
      short_description: 'Self-hosted music streaming',
      description: 'A community-driven project that lets you listen and share music and audio within a decentralized, open network.',
      website: 'https://funkwhale.audio/',
      github: 'https://dev.funkwhale.audio/funkwhale/funkwhale',
      is_self_hosted: true,
      categoryNames: ['Music', 'Media', 'Self-Hosted']
    },
    {
      name: 'Navidrome',
      slug: 'navidrome',
      short_description: 'Modern music server',
      description: 'A fast, simple music server and streamer compatible with Subsonic/Airsonic clients.',
      website: 'https://www.navidrome.org/',
      github: 'https://github.com/navidrome/navidrome',
      is_self_hosted: true,
      categoryNames: ['Music', 'Media', 'Self-Hosted']
    },
    {
      name: 'Airsonic',
      slug: 'airsonic',
      short_description: 'Free web-based media streamer',
      description: 'A free and open-source media streamer providing ubiquitous access to your music.',
      website: 'https://airsonic.github.io/',
      github: 'https://github.com/airsonic/airsonic',
      is_self_hosted: true,
      categoryNames: ['Music', 'Media', 'Self-Hosted']
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

    // Get proprietary software (80+)
    const proprietaryList = [
      'calendly', 'google-calendar', 'toggl', 'clockify', 'github',
      'gitlab', 'bitbucket', 'mongodb-atlas', 'amazon-rds', 'wisprflow',
      'comet', 'arc', 'nordvpn', 'expressvpn', 'unsplash',
      'lightroom', 'spotify'
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

    console.log('\n🎉 Finished adding alternatives for proprietary software 80+!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
