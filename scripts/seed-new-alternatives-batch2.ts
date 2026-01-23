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

// New proprietary software to add (if not exists)
const newProprietarySoftware = [
  { name: 'Listmonk', slug: 'listmonk-prop', description: 'Self-hosted newsletter and mailing list manager', website: 'https://listmonk.app' },
  { name: 'Figma', slug: 'figma', description: 'Collaborative design tool for UI/UX', website: 'https://figma.com' },
  { name: 'Adobe Photoshop', slug: 'adobe-photoshop', description: 'Professional image editing software', website: 'https://adobe.com/photoshop' },
  { name: 'Adobe Illustrator', slug: 'adobe-illustrator', description: 'Vector graphics editor', website: 'https://adobe.com/illustrator' },
  { name: 'Canva', slug: 'canva', description: 'Online graphic design platform', website: 'https://canva.com' },
  { name: 'Adobe After Effects', slug: 'adobe-after-effects', description: 'Motion graphics and visual effects software', website: 'https://adobe.com/aftereffects' },
  { name: 'Miro', slug: 'miro', description: 'Online whiteboard and collaboration platform', website: 'https://miro.com' },
  { name: 'Loom', slug: 'loom', description: 'Video messaging and screen recording tool', website: 'https://loom.com' },
  { name: 'Firebase', slug: 'firebase', description: 'Google app development platform', website: 'https://firebase.google.com' },
  { name: 'Supabase', slug: 'supabase-prop', description: 'Open source Firebase alternative', website: 'https://supabase.com' },
  { name: 'MongoDB Atlas', slug: 'mongodb-atlas', description: 'Cloud-hosted MongoDB database service', website: 'https://mongodb.com/atlas' },
  { name: 'Redis Cloud', slug: 'redis-cloud', description: 'Managed Redis database service', website: 'https://redis.com/cloud' },
  { name: 'Airtable', slug: 'airtable', description: 'Cloud collaboration service with spreadsheet-database hybrid', website: 'https://airtable.com' },
  { name: 'CircleCI', slug: 'circleci', description: 'Continuous integration and delivery platform', website: 'https://circleci.com' },
  { name: 'Travis CI', slug: 'travis-ci', description: 'Hosted continuous integration service', website: 'https://travis-ci.com' },
  { name: 'Vercel', slug: 'vercel', description: 'Frontend deployment and hosting platform', website: 'https://vercel.com' },
  { name: 'Netlify', slug: 'netlify', description: 'Web development and hosting platform', website: 'https://netlify.com' },
  { name: 'Postman', slug: 'postman', description: 'API development and testing platform', website: 'https://postman.com' },
  { name: 'Swagger', slug: 'swagger', description: 'API documentation and design tools', website: 'https://swagger.io' },
  { name: 'Typeform', slug: 'typeform', description: 'Online form and survey builder', website: 'https://typeform.com' },
  { name: 'Google Forms', slug: 'google-forms', description: 'Free form builder by Google', website: 'https://forms.google.com' },
  { name: 'Confluence', slug: 'confluence', description: 'Team collaboration and documentation software', website: 'https://atlassian.com/confluence' },
  { name: 'GitBook', slug: 'gitbook', description: 'Documentation platform for teams', website: 'https://gitbook.com' },
  { name: 'ReadMe', slug: 'readme', description: 'API documentation platform', website: 'https://readme.com' },
  { name: 'Zoom', slug: 'zoom', description: 'Video conferencing platform', website: 'https://zoom.us' },
  { name: 'OBS Studio', slug: 'obs-studio', description: 'Free and open source software for video recording', website: 'https://obsproject.com' },
  { name: 'Vimeo', slug: 'vimeo', description: 'Video hosting and sharing platform', website: 'https://vimeo.com' },
  { name: 'Toggl', slug: 'toggl', description: 'Time tracking software', website: 'https://toggl.com' },
  { name: 'Clockify', slug: 'clockify', description: 'Free time tracking app', website: 'https://clockify.me' },
  { name: 'Harvest', slug: 'harvest', description: 'Time tracking and invoicing software', website: 'https://getharvest.com' },
  { name: 'Buffer', slug: 'buffer', description: 'Social media management platform', website: 'https://buffer.com' },
  { name: 'Hootsuite', slug: 'hootsuite', description: 'Social media management tool', website: 'https://hootsuite.com' },
  { name: 'Stripe', slug: 'stripe', description: 'Online payment processing platform', website: 'https://stripe.com' },
  { name: 'PayPal', slug: 'paypal', description: 'Online payments system', website: 'https://paypal.com' },
  { name: 'QuickBooks', slug: 'quickbooks', description: 'Accounting software for small businesses', website: 'https://quickbooks.intuit.com' },
  { name: 'Xero', slug: 'xero', description: 'Cloud-based accounting software', website: 'https://xero.com' },
  { name: 'LastPass', slug: 'lastpass', description: 'Password manager and digital vault', website: 'https://lastpass.com' },
  { name: 'Dashlane', slug: 'dashlane', description: 'Password manager and digital wallet', website: 'https://dashlane.com' },
];

// Next 100 alternatives from new_open_source_alternatives.md (batch 2)
const newAlternatives = [
  // Email continued - WildDuck, Listmonk
  {
    name: 'WildDuck',
    slug: 'wildduck',
    short_description: 'Scalable mail server with modern APIs',
    description: 'WildDuck is an open-source, scalable mail server that provides modern APIs for email management. It uses MongoDB for storage, offering horizontal scalability and programmatic access to emails without traditional mailbox limitations.',
    website: 'https://wildduck.email',
    github: 'https://github.com/nodemailer/wildduck',
    license: 'EUPL-1.2 License',
    is_self_hosted: true,
    alternative_to: ['sendgrid'],
    categoryKeywords: ['email', 'mail server', 'api', 'scalable']
  },
  {
    name: 'Listmonk',
    slug: 'listmonk',
    short_description: 'Self-hosted newsletter and mailing list manager',
    description: 'Listmonk is a high-performance, self-hosted newsletter and mailing list manager with a modern admin dashboard. It handles millions of subscribers with minimal resources and provides campaign analytics, subscriber management, and template support.',
    website: 'https://listmonk.app',
    github: 'https://github.com/knadh/listmonk',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['mailchimp'],
    categoryKeywords: ['email', 'newsletter', 'marketing', 'mailing list']
  },
  // Design & Creative - Alternatives to Figma
  {
    name: 'Penpot',
    slug: 'penpot',
    short_description: 'Open-source design and prototyping platform',
    description: 'Penpot is an open-source design and prototyping platform that works entirely in the browser. It provides design tools similar to Figma with SVG-based graphics, real-time collaboration, and self-hosting capabilities for complete data ownership.',
    website: 'https://penpot.app',
    github: 'https://github.com/penpot/penpot',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['figma'],
    categoryKeywords: ['design', 'prototyping', 'ui/ux', 'collaboration']
  },
  {
    name: 'Quant-UX',
    slug: 'quant-ux',
    short_description: 'Prototyping and usability testing tool',
    description: 'Quant-UX is an open-source prototyping and usability testing platform that enables creating interactive prototypes and gathering user feedback. It provides analytics on user interactions to improve designs based on real user behavior data.',
    website: 'https://quant-ux.com',
    github: 'https://github.com/KlausSchaefers/quant-ux',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['figma'],
    categoryKeywords: ['design', 'prototyping', 'usability', 'testing']
  },
  // Design & Creative - Alternatives to Adobe Photoshop
  {
    name: 'GIMP',
    slug: 'gimp',
    short_description: 'Professional-grade image manipulation program',
    description: 'GIMP (GNU Image Manipulation Program) is a cross-platform open-source image editor providing sophisticated tools for photo retouching, image composition, and graphic design. It offers extensibility through plugins and scripting interfaces.',
    website: 'https://www.gimp.org',
    github: 'https://github.com/GNOME/gimp',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-photoshop'],
    categoryKeywords: ['image editing', 'photo', 'graphics', 'design']
  },
  {
    name: 'Photopea',
    slug: 'photopea',
    short_description: 'Browser-based advanced photo editor',
    description: 'Photopea is a free online photo editor that works directly in the browser without installation. It supports PSD, XCF, Sketch, and other file formats with advanced features comparable to Photoshop including layers, masks, and filters.',
    website: 'https://www.photopea.com',
    github: 'https://github.com/nicoPDeveloper/photopea',
    license: 'Proprietary (Free)',
    is_self_hosted: false,
    alternative_to: ['adobe-photoshop'],
    categoryKeywords: ['image editing', 'photo', 'browser', 'psd']
  },
  {
    name: 'Krita',
    slug: 'krita',
    short_description: 'Digital painting and illustration application',
    description: 'Krita is a professional open-source digital painting program designed for illustrators, concept artists, and texture artists. It provides brush engines, stabilizers, and color management tools suited for creative digital artwork.',
    website: 'https://krita.org',
    github: 'https://github.com/KDE/krita',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-photoshop'],
    categoryKeywords: ['digital painting', 'illustration', 'art', 'graphics']
  },
  // Design & Creative - Alternatives to Adobe Illustrator
  {
    name: 'Inkscape',
    slug: 'inkscape',
    short_description: 'Professional vector graphics editor',
    description: 'Inkscape is an open-source vector graphics editor with capabilities similar to Adobe Illustrator. It uses SVG as its native format and provides tools for creating illustrations, icons, logos, diagrams, and complex artwork.',
    website: 'https://inkscape.org',
    github: 'https://gitlab.com/inkscape/inkscape',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-illustrator'],
    categoryKeywords: ['vector', 'graphics', 'svg', 'illustration']
  },
  {
    name: 'Vectr',
    slug: 'vectr',
    short_description: 'Simple vector graphics editor for beginners',
    description: 'Vectr is a free, simple-to-use vector graphics software that works in browser or desktop. It provides intuitive tools for creating vector graphics without the complexity of professional applications while supporting real-time collaboration.',
    website: 'https://vectr.com',
    github: 'https://github.com/nicePDeveloper/vectr',
    license: 'Proprietary (Free)',
    is_self_hosted: false,
    alternative_to: ['adobe-illustrator'],
    categoryKeywords: ['vector', 'graphics', 'simple', 'beginner']
  },
  // Design & Creative - Alternatives to Canva
  {
    name: 'Polotno Studio',
    slug: 'polotno-studio',
    short_description: 'Free graphic design editor in browser',
    description: 'Polotno Studio is a free browser-based graphic design tool similar to Canva. It provides templates, shapes, text, and image editing capabilities for creating social media graphics, presentations, and marketing materials without account requirements.',
    website: 'https://studio.polotno.com',
    github: 'https://github.com/polotno-project/polotno-studio',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['canva'],
    categoryKeywords: ['graphic design', 'templates', 'social media', 'marketing']
  },
  // Design & Creative - Alternatives to Adobe After Effects
  {
    name: 'Natron',
    slug: 'natron',
    short_description: 'Open-source compositing software for VFX',
    description: 'Natron is an open-source compositing software for visual effects and motion graphics. It provides node-based compositing similar to Nuke with GPU and CPU rendering, keying, rotoscoping, and 2D tracking capabilities.',
    website: 'https://natrongithub.github.io',
    github: 'https://github.com/NatronGitHub/Natron',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-after-effects'],
    categoryKeywords: ['vfx', 'compositing', 'motion graphics', 'video']
  },
  {
    name: 'Blender',
    slug: 'blender',
    short_description: '3D creation suite with video editing capabilities',
    description: 'Blender is a comprehensive open-source 3D creation suite supporting modeling, rigging, animation, simulation, rendering, compositing, and video editing. Its motion tracking and VFX capabilities make it suitable for After Effects workflows.',
    website: 'https://www.blender.org',
    github: 'https://github.com/blender/blender',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['adobe-after-effects'],
    categoryKeywords: ['3d', 'animation', 'video editing', 'vfx']
  },
  // Design & Creative - Alternatives to Miro
  {
    name: 'Excalidraw',
    slug: 'excalidraw',
    short_description: 'Virtual whiteboard for hand-drawn diagrams',
    description: 'Excalidraw is an open-source virtual whiteboard for sketching hand-drawn diagrams and wireframes. It provides a simple interface for creating diagrams with a hand-drawn aesthetic, real-time collaboration, and end-to-end encryption options.',
    website: 'https://excalidraw.com',
    github: 'https://github.com/excalidraw/excalidraw',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['miro'],
    categoryKeywords: ['whiteboard', 'diagrams', 'collaboration', 'sketching']
  },
  {
    name: 'Tldraw',
    slug: 'tldraw',
    short_description: 'Collaborative digital whiteboard',
    description: 'Tldraw is a free, open-source digital whiteboard that provides a clean interface for drawing, diagramming, and visual collaboration. It supports multiplayer editing, infinite canvas, and various shape tools for creating diagrams and wireframes.',
    website: 'https://www.tldraw.com',
    github: 'https://github.com/tldraw/tldraw',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['miro'],
    categoryKeywords: ['whiteboard', 'drawing', 'collaboration', 'diagrams']
  },
  // Design & Creative - Alternatives to Loom
  {
    name: 'Screenity',
    slug: 'screenity',
    short_description: 'Privacy-focused screen recorder extension',
    description: 'Screenity is an open-source Chrome extension for screen recording with annotation tools. It provides unlimited recording without watermarks, drawing tools, webcam overlay, and local storage without sending data to external servers.',
    website: 'https://screenity.io',
    github: 'https://github.com/alyssaxuu/screenity',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['loom'],
    categoryKeywords: ['screen recording', 'video', 'browser extension', 'privacy']
  },
  {
    name: 'Kap',
    slug: 'kap',
    short_description: 'Open-source screen recorder for macOS',
    description: 'Kap is an open-source screen recorder built with web technology for macOS. It provides a simple interface for recording screens with export options including GIF, MP4, and WebM formats with customizable quality settings.',
    website: 'https://getkap.co',
    github: 'https://github.com/wulkano/Kap',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['loom'],
    categoryKeywords: ['screen recording', 'macos', 'gif', 'video']
  },
  // Database & Backend - Alternatives to Firebase
  {
    name: 'Supabase',
    slug: 'supabase',
    short_description: 'Open-source Firebase alternative with PostgreSQL',
    description: 'Supabase is an open-source Firebase alternative built on PostgreSQL. It provides authentication, instant APIs, edge functions, real-time subscriptions, and storage with the reliability of a relational database and self-hosting capabilities.',
    website: 'https://supabase.com',
    github: 'https://github.com/supabase/supabase',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['firebase'],
    categoryKeywords: ['backend', 'database', 'auth', 'realtime']
  },
  {
    name: 'Appwrite',
    slug: 'appwrite',
    short_description: 'Backend-as-a-service with complete features',
    description: 'Appwrite is an open-source backend server providing authentication, database, storage, and functions out of the box. It offers SDKs for multiple platforms and can be self-hosted with Docker for complete infrastructure control.',
    website: 'https://appwrite.io',
    github: 'https://github.com/appwrite/appwrite',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['firebase'],
    categoryKeywords: ['backend', 'baas', 'auth', 'storage']
  },
  {
    name: 'PocketBase',
    slug: 'pocketbase',
    short_description: 'Open-source backend in a single file',
    description: 'PocketBase is an open-source backend consisting of a single executable file. It provides real-time database, authentication, file storage, and admin dashboard built on SQLite, making it perfect for small to medium applications.',
    website: 'https://pocketbase.io',
    github: 'https://github.com/pocketbase/pocketbase',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['firebase'],
    categoryKeywords: ['backend', 'database', 'auth', 'sqlite']
  },
  {
    name: 'Nhost',
    slug: 'nhost',
    short_description: 'GraphQL backend platform with Hasura',
    description: 'Nhost is an open-source backend and development platform providing GraphQL API through Hasura, PostgreSQL database, authentication, and storage. It offers a serverless functions runtime with both cloud and self-hosted deployment options.',
    website: 'https://nhost.io',
    github: 'https://github.com/nhost/nhost',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['firebase'],
    categoryKeywords: ['backend', 'graphql', 'hasura', 'auth']
  },
  // Database & Backend - Alternatives to MongoDB Atlas
  {
    name: 'FerretDB',
    slug: 'ferretdb',
    short_description: 'Open-source MongoDB alternative using PostgreSQL',
    description: 'FerretDB is an open-source proxy that translates MongoDB wire protocol queries to SQL, using PostgreSQL or SQLite as the backend. It provides MongoDB compatibility without vendor lock-in, allowing existing MongoDB tools and drivers to work seamlessly.',
    website: 'https://www.ferretdb.io',
    github: 'https://github.com/FerretDB/FerretDB',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['mongodb-atlas'],
    categoryKeywords: ['database', 'mongodb', 'postgresql', 'nosql']
  },
  // Database & Backend - Alternatives to Redis Cloud
  {
    name: 'Dragonfly',
    slug: 'dragonfly',
    short_description: 'Modern in-memory datastore compatible with Redis',
    description: 'Dragonfly is a modern in-memory datastore that provides Redis and Memcached API compatibility with significantly higher throughput and efficiency. It uses a multi-threaded architecture to achieve better performance on modern hardware.',
    website: 'https://www.dragonflydb.io',
    github: 'https://github.com/dragonflydb/dragonfly',
    license: 'BSL-1.1 License',
    is_self_hosted: true,
    alternative_to: ['redis-cloud'],
    categoryKeywords: ['database', 'redis', 'cache', 'in-memory']
  },
  {
    name: 'KeyDB',
    slug: 'keydb',
    short_description: 'High-performance fork of Redis with multithreading',
    description: 'KeyDB is a high-performance fork of Redis that supports multithreading, active replication, and flash storage. It maintains full Redis compatibility while offering improved performance and additional enterprise features.',
    website: 'https://keydb.dev',
    github: 'https://github.com/Snapchat/KeyDB',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['redis-cloud'],
    categoryKeywords: ['database', 'redis', 'cache', 'multithreading']
  },
  // Database & Backend - Alternatives to Airtable
  {
    name: 'NocoDB',
    slug: 'nocodb',
    short_description: 'Open-source Airtable alternative',
    description: 'NocoDB is an open-source platform that turns any database into a smart spreadsheet interface. It provides views, filters, sorting, and API access similar to Airtable while connecting to existing MySQL, PostgreSQL, or SQLite databases.',
    website: 'https://nocodb.com',
    github: 'https://github.com/nocodb/nocodb',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['airtable'],
    categoryKeywords: ['database', 'spreadsheet', 'no-code', 'api']
  },
  {
    name: 'Baserow',
    slug: 'baserow',
    short_description: 'Open-source no-code database platform',
    description: 'Baserow is an open-source no-code database platform that provides a user-friendly interface for creating and managing databases. It offers real-time collaboration, API access, and plugin architecture while being fully self-hostable.',
    website: 'https://baserow.io',
    github: 'https://github.com/bram2w/baserow',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['airtable'],
    categoryKeywords: ['database', 'no-code', 'spreadsheet', 'collaboration']
  },
  {
    name: 'Grist',
    slug: 'grist',
    short_description: 'Modern relational spreadsheet with formulas',
    description: 'Grist is an open-source spreadsheet-database hybrid that combines the flexibility of spreadsheets with the robustness of databases. It provides Python formulas, custom layouts, and granular access control for team data management.',
    website: 'https://getgrist.com',
    github: 'https://github.com/gristlabs/grist-core',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['airtable'],
    categoryKeywords: ['database', 'spreadsheet', 'formulas', 'python']
  },
  // DevOps & CI/CD - Alternatives to CircleCI/Travis CI
  {
    name: 'Drone',
    slug: 'drone',
    short_description: 'Container-native CI/CD platform',
    description: 'Drone is an open-source container-native continuous integration platform that automates software build and test pipelines. It uses a simple YAML configuration and runs builds in isolated Docker containers for reproducible environments.',
    website: 'https://www.drone.io',
    github: 'https://github.com/harness/drone',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci'],
    categoryKeywords: ['ci/cd', 'containers', 'automation', 'devops']
  },
  {
    name: 'Woodpecker CI',
    slug: 'woodpecker-ci',
    short_description: 'Community fork of Drone CI',
    description: 'Woodpecker CI is an open-source continuous integration engine that forked from Drone. It provides a simple, container-based pipeline system with multi-platform support and an active community driving development.',
    website: 'https://woodpecker-ci.org',
    github: 'https://github.com/woodpecker-ci/woodpecker',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci'],
    categoryKeywords: ['ci/cd', 'containers', 'pipelines', 'devops']
  },
  {
    name: 'Concourse',
    slug: 'concourse',
    short_description: 'Pipeline-based CI/CD system',
    description: 'Concourse is an open-source continuous integration system built on the concept of pipelines and resources. It provides a declarative approach to CI/CD with reproducible builds, scalable architecture, and web-based pipeline visualization.',
    website: 'https://concourse-ci.org',
    github: 'https://github.com/concourse/concourse',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci'],
    categoryKeywords: ['ci/cd', 'pipelines', 'automation', 'devops']
  },
  {
    name: 'Buildkite',
    slug: 'buildkite-agent',
    short_description: 'Hybrid CI/CD with self-hosted agents',
    description: 'Buildkite provides a hybrid CI/CD approach with cloud-hosted coordination and self-hosted build agents. The open-source agent runs builds on your infrastructure while Buildkite manages pipeline orchestration and visualization.',
    website: 'https://buildkite.com',
    github: 'https://github.com/buildkite/agent',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['circleci', 'travis-ci'],
    categoryKeywords: ['ci/cd', 'agents', 'hybrid', 'devops']
  },
  // DevOps & CI/CD - Alternatives to Vercel/Netlify
  {
    name: 'Coolify',
    slug: 'coolify',
    short_description: 'Self-hostable Heroku/Netlify alternative',
    description: 'Coolify is an open-source, self-hostable platform for deploying applications, databases, and services. It provides automatic SSL, Git-based deployments, and a simple UI for managing your infrastructure without vendor lock-in.',
    website: 'https://coolify.io',
    github: 'https://github.com/coollabsio/coolify',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['vercel', 'netlify'],
    categoryKeywords: ['deployment', 'paas', 'self-hosted', 'devops']
  },
  {
    name: 'Dokku',
    slug: 'dokku',
    short_description: 'Docker-powered mini-Heroku',
    description: 'Dokku is a Docker-powered PaaS that helps you build and manage the lifecycle of applications. It provides a simple git push deployment workflow with buildpacks support, making it easy to deploy apps on your own servers.',
    website: 'https://dokku.com',
    github: 'https://github.com/dokku/dokku',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['vercel', 'netlify'],
    categoryKeywords: ['deployment', 'paas', 'docker', 'heroku']
  },
  {
    name: 'CapRover',
    slug: 'caprover',
    short_description: 'Easy app/database deployment platform',
    description: 'CapRover is an extremely easy-to-use platform for deploying applications and databases. It provides one-click apps, automatic HTTPS, Docker support, and cluster management with a beautiful web interface.',
    website: 'https://caprover.com',
    github: 'https://github.com/caprover/caprover',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['vercel', 'netlify'],
    categoryKeywords: ['deployment', 'paas', 'docker', 'one-click']
  },
  // API Management - Alternatives to Postman
  {
    name: 'Hoppscotch',
    slug: 'hoppscotch',
    short_description: 'Open-source API development ecosystem',
    description: 'Hoppscotch is an open-source API development ecosystem providing a lightweight, web-based interface for testing APIs. It supports REST, GraphQL, WebSocket, and other protocols with team collaboration features and self-hosting options.',
    website: 'https://hoppscotch.io',
    github: 'https://github.com/hoppscotch/hoppscotch',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['postman'],
    categoryKeywords: ['api', 'testing', 'rest', 'graphql']
  },
  {
    name: 'Insomnia',
    slug: 'insomnia',
    short_description: 'API client for REST and GraphQL',
    description: 'Insomnia is an open-source API client that makes it easy to design, debug, and test APIs. It provides a clean interface for REST and GraphQL requests with environment variables, authentication helpers, and code generation.',
    website: 'https://insomnia.rest',
    github: 'https://github.com/Kong/insomnia',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['postman'],
    categoryKeywords: ['api', 'testing', 'rest', 'graphql']
  },
  {
    name: 'Bruno',
    slug: 'bruno',
    short_description: 'Git-friendly API client',
    description: 'Bruno is an open-source API client designed for developers who prefer storing API collections in Git. It uses a plain text markup language for defining requests, making collections easy to version control and collaborate on.',
    website: 'https://www.usebruno.com',
    github: 'https://github.com/usebruno/bruno',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['postman'],
    categoryKeywords: ['api', 'testing', 'git', 'developer tools']
  },
  // API Management - Alternatives to Swagger
  {
    name: 'Redoc',
    slug: 'redoc',
    short_description: 'OpenAPI documentation generator',
    description: 'Redoc is an open-source tool for generating beautiful API documentation from OpenAPI specifications. It provides a responsive three-panel design with deep linking, code samples, and search functionality.',
    website: 'https://redocly.com/redoc',
    github: 'https://github.com/Redocly/redoc',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['swagger'],
    categoryKeywords: ['api', 'documentation', 'openapi', 'spec']
  },
  {
    name: 'Stoplight',
    slug: 'stoplight-elements',
    short_description: 'API design and documentation platform',
    description: 'Stoplight Elements is an open-source API documentation component that can be embedded in any website. It renders OpenAPI specifications with an interactive interface including try-it functionality and code samples.',
    website: 'https://stoplight.io',
    github: 'https://github.com/stoplightio/elements',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['swagger'],
    categoryKeywords: ['api', 'documentation', 'openapi', 'design']
  },
  // Forms & Surveys - Alternatives to Typeform/Google Forms
  {
    name: 'Formbricks',
    slug: 'formbricks',
    short_description: 'Open-source survey and experience management',
    description: 'Formbricks is an open-source survey platform for collecting in-product feedback and conducting user research. It provides targeting, templates, and analytics with privacy-focused data handling and self-hosting capabilities.',
    website: 'https://formbricks.com',
    github: 'https://github.com/formbricks/formbricks',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform'],
    categoryKeywords: ['forms', 'surveys', 'feedback', 'research']
  },
  {
    name: 'Heyform',
    slug: 'heyform',
    short_description: 'Open-source form builder with conversational UI',
    description: 'Heyform is an open-source form builder that creates conversational, one-question-at-a-time forms similar to Typeform. It provides analytics, integrations, and customization options while being fully self-hostable.',
    website: 'https://heyform.net',
    github: 'https://github.com/heyform/heyform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform'],
    categoryKeywords: ['forms', 'conversational', 'surveys', 'builder']
  },
  {
    name: 'OhMyForm',
    slug: 'ohmyform',
    short_description: 'Open-source form management platform',
    description: 'OhMyForm is an open-source form management platform for creating surveys and collecting data. It provides form analytics, export capabilities, and customizable themes while being completely free and self-hostable.',
    website: 'https://ohmyform.com',
    github: 'https://github.com/ohmyform/ohmyform',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform', 'google-forms'],
    categoryKeywords: ['forms', 'surveys', 'data collection', 'analytics']
  },
  {
    name: 'LimeSurvey',
    slug: 'limesurvey',
    short_description: 'Professional online survey tool',
    description: 'LimeSurvey is a feature-rich open-source survey application that supports unlimited surveys, questions, and participants. It provides advanced question types, branching logic, and comprehensive statistical analysis for professional research.',
    website: 'https://www.limesurvey.org',
    github: 'https://github.com/LimeSurvey/LimeSurvey',
    license: 'GPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['typeform', 'google-forms'],
    categoryKeywords: ['surveys', 'research', 'analytics', 'professional']
  },
  // Documentation - Alternatives to Confluence
  {
    name: 'BookStack',
    slug: 'bookstack',
    short_description: 'Simple, self-hosted documentation platform',
    description: 'BookStack is an open-source, self-hosted platform for organizing and storing information. It uses a book-like hierarchy with shelves, books, chapters, and pages, providing a simple interface for team documentation and knowledge management.',
    website: 'https://www.bookstackapp.com',
    github: 'https://github.com/BookStackApp/BookStack',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['confluence'],
    categoryKeywords: ['documentation', 'wiki', 'knowledge base', 'team']
  },
  {
    name: 'Wiki.js',
    slug: 'wikijs',
    short_description: 'Modern wiki built on Node.js',
    description: 'Wiki.js is a powerful open-source wiki application built on Node.js. It provides a beautiful editing experience with Markdown support, full-text search, Git-based storage, and extensive customization through modules and themes.',
    website: 'https://js.wiki',
    github: 'https://github.com/requarks/wiki',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['confluence'],
    categoryKeywords: ['wiki', 'documentation', 'markdown', 'nodejs']
  },
  {
    name: 'Outline',
    slug: 'outline',
    short_description: 'Modern team knowledge base',
    description: 'Outline is an open-source knowledge base designed for growing teams. It provides a fast, modern interface with Markdown editing, real-time collaboration, and integrations with Slack and other tools for seamless team workflows.',
    website: 'https://www.getoutline.com',
    github: 'https://github.com/outline/outline',
    license: 'BSL-1.1 License',
    is_self_hosted: true,
    alternative_to: ['confluence'],
    categoryKeywords: ['knowledge base', 'documentation', 'collaboration', 'team']
  },
  // Documentation - Alternatives to GitBook/ReadMe
  {
    name: 'Docusaurus',
    slug: 'docusaurus',
    short_description: 'Documentation site generator by Facebook',
    description: 'Docusaurus is an open-source documentation website generator built by Facebook. It provides easy configuration, versioning, localization, and search functionality with MDX support for interactive documentation.',
    website: 'https://docusaurus.io',
    github: 'https://github.com/facebook/docusaurus',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['gitbook', 'readme'],
    categoryKeywords: ['documentation', 'static site', 'markdown', 'react']
  },
  {
    name: 'MkDocs',
    slug: 'mkdocs',
    short_description: 'Static site generator for documentation',
    description: 'MkDocs is a fast, simple static site generator for project documentation. It uses Markdown source files and a single YAML configuration file, with themes like Material for MkDocs providing beautiful, responsive documentation sites.',
    website: 'https://www.mkdocs.org',
    github: 'https://github.com/mkdocs/mkdocs',
    license: 'BSD-2-Clause License',
    is_self_hosted: true,
    alternative_to: ['gitbook', 'readme'],
    categoryKeywords: ['documentation', 'static site', 'markdown', 'python']
  },
  {
    name: 'VitePress',
    slug: 'vitepress',
    short_description: 'Vite-powered static site generator',
    description: 'VitePress is a static site generator built on Vue and Vite, designed for documentation. It provides fast hot module replacement, Vue components in Markdown, and automatic sidebar generation with a focus on performance.',
    website: 'https://vitepress.dev',
    github: 'https://github.com/vuejs/vitepress',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['gitbook', 'readme'],
    categoryKeywords: ['documentation', 'static site', 'vue', 'vite']
  },
  // Video & Streaming - Alternatives to Zoom
  {
    name: 'Jitsi Meet',
    slug: 'jitsi-meet',
    short_description: 'Open-source video conferencing platform',
    description: 'Jitsi Meet is an open-source video conferencing solution that can be used entirely in the browser without downloads. It provides HD video, screen sharing, recording, and real-time collaboration features with self-hosting capabilities.',
    website: 'https://meet.jit.si',
    github: 'https://github.com/jitsi/jitsi-meet',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['zoom'],
    categoryKeywords: ['video conferencing', 'webrtc', 'meetings', 'collaboration']
  },
  {
    name: 'BigBlueButton',
    slug: 'bigbluebutton',
    short_description: 'Web conferencing for online learning',
    description: 'BigBlueButton is an open-source web conferencing system designed for online learning. It provides real-time sharing of slides, audio, video, chat, and screen with features like breakout rooms and polling for educational environments.',
    website: 'https://bigbluebutton.org',
    github: 'https://github.com/bigbluebutton/bigbluebutton',
    license: 'LGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['zoom'],
    categoryKeywords: ['video conferencing', 'education', 'webrtc', 'learning']
  },
  {
    name: 'Element',
    slug: 'element',
    short_description: 'Matrix-based secure communication platform',
    description: 'Element is an open-source communication platform built on the Matrix protocol. It provides end-to-end encrypted messaging, voice, and video calls with interoperability across different Matrix servers and bridges to other platforms.',
    website: 'https://element.io',
    github: 'https://github.com/vector-im/element-web',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['zoom'],
    categoryKeywords: ['messaging', 'matrix', 'encryption', 'video calls']
  },
  // Video & Streaming - Alternatives to Vimeo
  {
    name: 'PeerTube',
    slug: 'peertube',
    short_description: 'Decentralized video hosting platform',
    description: 'PeerTube is a free, decentralized video hosting platform using P2P technology. It provides ActivityPub federation allowing instances to share content, reducing hosting costs through peer-to-peer streaming while maintaining content creator control.',
    website: 'https://joinpeertube.org',
    github: 'https://github.com/Chocobozzz/PeerTube',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['vimeo'],
    categoryKeywords: ['video hosting', 'p2p', 'federated', 'streaming']
  },
  {
    name: 'MediaCMS',
    slug: 'mediacms',
    short_description: 'Modern, fully-featured video CMS',
    description: 'MediaCMS is a modern, fully-featured open-source video and media CMS. It provides video uploading, transcoding, playback, and management with HLS adaptive streaming and a responsive design for building video platforms.',
    website: 'https://mediacms.io',
    github: 'https://github.com/mediacms-io/mediacms',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['vimeo'],
    categoryKeywords: ['video hosting', 'cms', 'streaming', 'media']
  },
  // Time Tracking - Alternatives to Toggl/Clockify/Harvest
  {
    name: 'Kimai',
    slug: 'kimai',
    short_description: 'Open-source time tracking application',
    description: 'Kimai is a free, open-source time tracking application with a focus on simplicity and extensibility. It provides project management, invoicing, and reporting features with mobile support and plugin architecture for customization.',
    website: 'https://www.kimai.org',
    github: 'https://github.com/kevinpapst/kimai2',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['toggl', 'clockify'],
    categoryKeywords: ['time tracking', 'projects', 'invoicing', 'reporting']
  },
  {
    name: 'Traggo',
    slug: 'traggo',
    short_description: 'Tag-based time tracking',
    description: 'Traggo is a tag-based time tracking tool that makes tracking work flexible and powerful. It provides customizable dashboards, reporting by tags, and a clean interface for organizing time entries across projects and activities.',
    website: 'https://traggo.net',
    github: 'https://github.com/traggo/server',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['toggl', 'clockify'],
    categoryKeywords: ['time tracking', 'tags', 'dashboard', 'reporting']
  },
  {
    name: 'ActivityWatch',
    slug: 'activitywatch',
    short_description: 'Automatic time tracking with privacy',
    description: 'ActivityWatch is an open-source automated time tracker that runs locally on your device. It tracks application and browser usage automatically, providing insights into productivity patterns while keeping all data private and local.',
    website: 'https://activitywatch.net',
    github: 'https://github.com/ActivityWatch/activitywatch',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: ['toggl', 'clockify'],
    categoryKeywords: ['time tracking', 'automatic', 'privacy', 'productivity']
  },
  {
    name: 'Solidtime',
    slug: 'solidtime',
    short_description: 'Modern time tracking for freelancers and teams',
    description: 'Solidtime is an open-source time tracking application built with modern technologies. It provides project-based tracking, team management, and reporting with a clean, responsive interface suitable for freelancers and small teams.',
    website: 'https://solidtime.io',
    github: 'https://github.com/solidtime-io/solidtime',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['toggl', 'harvest'],
    categoryKeywords: ['time tracking', 'freelance', 'teams', 'modern']
  },
  // Social Media - Alternatives to Buffer/Hootsuite
  {
    name: 'Mixpost',
    slug: 'mixpost',
    short_description: 'Self-hosted social media management',
    description: 'Mixpost is an open-source, self-hosted social media management tool. It provides scheduling, publishing, and analytics for multiple social platforms with a clean interface and team collaboration features.',
    website: 'https://mixpost.app',
    github: 'https://github.com/inovector/mixpost',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['buffer', 'hootsuite'],
    categoryKeywords: ['social media', 'scheduling', 'marketing', 'publishing']
  },
  {
    name: 'Postiz',
    slug: 'postiz',
    short_description: 'AI-powered social media management',
    description: 'Postiz is an open-source social media management platform with AI-powered features. It provides content scheduling, analytics, and AI-assisted content creation for managing multiple social media accounts efficiently.',
    website: 'https://postiz.com',
    github: 'https://github.com/gitroomhq/postiz-app',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['buffer', 'hootsuite'],
    categoryKeywords: ['social media', 'ai', 'scheduling', 'content']
  },
  // Payment & Finance - Alternatives to Stripe
  {
    name: 'BTCPay Server',
    slug: 'btcpay-server',
    short_description: 'Self-hosted Bitcoin payment processor',
    description: 'BTCPay Server is an open-source, self-hosted Bitcoin payment processor. It provides direct payments without intermediaries, supporting various cryptocurrencies with no fees, full privacy, and integration plugins for e-commerce platforms.',
    website: 'https://btcpayserver.org',
    github: 'https://github.com/btcpayserver/btcpayserver',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['stripe', 'paypal'],
    categoryKeywords: ['payments', 'bitcoin', 'crypto', 'e-commerce']
  },
  {
    name: 'Kill Bill',
    slug: 'kill-bill',
    short_description: 'Open-source billing and payments platform',
    description: 'Kill Bill is an open-source subscription billing and payments platform. It provides recurring billing, invoicing, payment processing, and revenue recognition with a plugin architecture for extending functionality.',
    website: 'https://killbill.io',
    github: 'https://github.com/killbill/killbill',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['stripe'],
    categoryKeywords: ['billing', 'subscriptions', 'payments', 'invoicing']
  },
  // Payment & Finance - Alternatives to QuickBooks/Xero
  {
    name: 'Akaunting',
    slug: 'akaunting',
    short_description: 'Free accounting software for small businesses',
    description: 'Akaunting is a free, open-source accounting software for small businesses and freelancers. It provides invoicing, expense tracking, financial reports, and multi-currency support with a modern web interface.',
    website: 'https://akaunting.com',
    github: 'https://github.com/akaunting/akaunting',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['quickbooks', 'xero'],
    categoryKeywords: ['accounting', 'invoicing', 'finance', 'small business']
  },
  {
    name: 'Invoice Ninja',
    slug: 'invoice-ninja',
    short_description: 'Invoicing, payments, and accounting',
    description: 'Invoice Ninja is an open-source platform for invoicing, payments, and time tracking. It provides professional invoice templates, recurring invoices, client portal, and payment gateway integrations with self-hosting options.',
    website: 'https://invoiceninja.com',
    github: 'https://github.com/invoiceninja/invoiceninja',
    license: 'AAL License',
    is_self_hosted: true,
    alternative_to: ['quickbooks', 'xero'],
    categoryKeywords: ['invoicing', 'payments', 'time tracking', 'accounting']
  },
  {
    name: 'Crater',
    slug: 'crater',
    short_description: 'Open-source invoicing for freelancers',
    description: 'Crater is an open-source invoicing application built for freelancers and small businesses. It provides estimates, invoices, expenses, and payment tracking with multiple currency support and a mobile app.',
    website: 'https://craterapp.com',
    github: 'https://github.com/crater-invoice/crater',
    license: 'AAL License',
    is_self_hosted: true,
    alternative_to: ['quickbooks', 'xero'],
    categoryKeywords: ['invoicing', 'freelance', 'expenses', 'mobile']
  },
  // Browser & Extensions - Password Managers
  {
    name: 'Bitwarden',
    slug: 'bitwarden',
    short_description: 'Full-featured open-source password manager',
    description: 'Bitwarden is a comprehensive open-source password management solution providing secure password storage, generation, and sharing. It offers browser extensions, mobile apps, and self-hosting capabilities with enterprise features.',
    website: 'https://bitwarden.com',
    github: 'https://github.com/bitwarden/clients',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['lastpass', 'dashlane'],
    categoryKeywords: ['password manager', 'security', 'encryption', 'cross-platform']
  },
  {
    name: 'Padloc',
    slug: 'padloc',
    short_description: 'Modern password manager for teams',
    description: 'Padloc is an open-source password manager focusing on simplicity and usability. It provides secure password storage with end-to-end encryption, team sharing capabilities, and cross-platform apps with a clean interface.',
    website: 'https://padloc.app',
    github: 'https://github.com/padloc/padloc',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['lastpass', 'dashlane'],
    categoryKeywords: ['password manager', 'teams', 'encryption', 'modern']
  },
  // Additional utilities
  {
    name: 'Typesense',
    slug: 'typesense',
    short_description: 'Fast, typo-tolerant search engine',
    description: 'Typesense is an open-source, typo-tolerant search engine optimized for instant search experiences. It provides fast, relevant search results with automatic typo correction, faceting, and easy-to-use APIs.',
    website: 'https://typesense.org',
    github: 'https://github.com/typesense/typesense',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['search', 'full-text', 'api', 'instant']
  },
  {
    name: 'Meilisearch',
    slug: 'meilisearch',
    short_description: 'Lightning fast, typo-tolerant search',
    description: 'Meilisearch is a powerful, fast, open-source search engine built in Rust. It provides typo-tolerance, filtering, sorting, and highlighting out of the box with RESTful APIs and SDKs for multiple programming languages.',
    website: 'https://meilisearch.com',
    github: 'https://github.com/meilisearch/meilisearch',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['search', 'rust', 'api', 'fast']
  },
  {
    name: 'Sonic',
    slug: 'sonic',
    short_description: 'Fast, lightweight search backend',
    description: 'Sonic is a super-fast, lightweight, and schema-less search backend. It provides full-text search capabilities with minimal memory footprint, making it suitable for applications needing fast search without heavy resource requirements.',
    website: 'https://github.com/valeriansaliou/sonic',
    github: 'https://github.com/valeriansaliou/sonic',
    license: 'MPL-2.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['search', 'lightweight', 'fast', 'backend']
  },
  {
    name: 'Directus',
    slug: 'directus',
    short_description: 'Open data platform for headless CMS',
    description: 'Directus is an open-source data platform that wraps any SQL database with a real-time GraphQL and REST API. It provides a no-code admin app for managing content, making it suitable as a headless CMS or backend.',
    website: 'https://directus.io',
    github: 'https://github.com/directus/directus',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['cms', 'headless', 'api', 'database']
  },
  {
    name: 'Strapi',
    slug: 'strapi',
    short_description: 'Leading open-source headless CMS',
    description: 'Strapi is the leading open-source headless CMS that gives developers freedom to use their favorite tools and frameworks. It provides customizable admin panel, API generation, and role-based access control with self-hosting options.',
    website: 'https://strapi.io',
    github: 'https://github.com/strapi/strapi',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['cms', 'headless', 'api', 'content']
  },
  {
    name: 'Ghost',
    slug: 'ghost',
    short_description: 'Professional publishing platform',
    description: 'Ghost is an open-source professional publishing platform built for modern journalism and content creators. It provides a beautiful editor, membership features, newsletters, and SEO tools with both self-hosting and managed options.',
    website: 'https://ghost.org',
    github: 'https://github.com/TryGhost/Ghost',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['cms', 'publishing', 'blog', 'newsletter']
  },
  {
    name: 'n8n',
    slug: 'n8n',
    short_description: 'Workflow automation tool',
    description: 'n8n is a fair-code workflow automation tool that allows connecting various services and creating automated workflows. It provides a visual editor with 200+ integrations, custom JavaScript code execution, and self-hosting capabilities.',
    website: 'https://n8n.io',
    github: 'https://github.com/n8n-io/n8n',
    license: 'Sustainable Use License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['automation', 'workflow', 'integration', 'no-code']
  },
  {
    name: 'Activepieces',
    slug: 'activepieces',
    short_description: 'Open-source automation alternative to Zapier',
    description: 'Activepieces is an open-source automation tool that connects apps and automates workflows. It provides a visual flow builder, pre-built integrations, and custom code pieces with both cloud and self-hosted deployment options.',
    website: 'https://www.activepieces.com',
    github: 'https://github.com/activepieces/activepieces',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['automation', 'workflow', 'zapier', 'integration']
  },
  {
    name: 'Windmill',
    slug: 'windmill',
    short_description: 'Developer platform for scripts and workflows',
    description: 'Windmill is an open-source developer platform for building scripts, flows, and apps. It provides a code-first approach to automation with support for Python, TypeScript, and Go with scheduling and approval workflows.',
    website: 'https://www.windmill.dev',
    github: 'https://github.com/windmill-labs/windmill',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['automation', 'scripts', 'developer', 'workflows']
  },
  {
    name: 'Cal.com',
    slug: 'cal-com',
    short_description: 'Open-source scheduling infrastructure',
    description: 'Cal.com is an open-source scheduling platform that provides calendar booking infrastructure. It offers integrations with popular calendar services, customizable booking pages, and team scheduling features as an alternative to Calendly.',
    website: 'https://cal.com',
    github: 'https://github.com/calcom/cal.com',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['scheduling', 'calendar', 'booking', 'meetings']
  },
  {
    name: 'Rallly',
    slug: 'rallly',
    short_description: 'Open-source meeting poll scheduler',
    description: 'Rallly is an open-source alternative to Doodle for scheduling group meetings. It provides a simple interface for creating polls to find the best time for events without requiring participants to create accounts.',
    website: 'https://rallly.co',
    github: 'https://github.com/lukevella/rallly',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['scheduling', 'polls', 'meetings', 'doodle']
  },
  {
    name: 'Uptime Kuma',
    slug: 'uptime-kuma',
    short_description: 'Self-hosted monitoring tool',
    description: 'Uptime Kuma is a fancy self-hosted monitoring tool that tracks uptime for websites, APIs, and services. It provides beautiful dashboards, multiple notification channels, and status pages with a modern, easy-to-use interface.',
    website: 'https://uptime.kuma.pet',
    github: 'https://github.com/louislam/uptime-kuma',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['monitoring', 'uptime', 'status page', 'alerts']
  },
  {
    name: 'Gatus',
    slug: 'gatus',
    short_description: 'Automated service health dashboard',
    description: 'Gatus is an automated service health dashboard that provides monitoring and alerting for your services. It supports various protocols including HTTP, TCP, and DNS with customizable conditions and notification integrations.',
    website: 'https://gatus.io',
    github: 'https://github.com/TwiN/gatus',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['monitoring', 'health check', 'dashboard', 'alerts']
  },
  {
    name: 'Statping-ng',
    slug: 'statping-ng',
    short_description: 'Status page and monitoring server',
    description: 'Statping-ng is an open-source status page and monitoring server that generates a beautiful status page. It monitors websites, applications, and services with notification support and a modern responsive interface.',
    website: 'https://statping-ng.github.io',
    github: 'https://github.com/statping-ng/statping-ng',
    license: 'GPL-3.0 License',
    is_self_hosted: true,
    alternative_to: [],
    categoryKeywords: ['status page', 'monitoring', 'uptime', 'server']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  // Email
  'email': ['email-newsletters', 'communication-collaboration'],
  'mail server': ['email-newsletters', 'devops-infrastructure'],
  'newsletter': ['email-newsletters', 'marketing-customer-engagement'],
  'mailing list': ['email-newsletters', 'marketing-customer-engagement'],
  'marketing': ['marketing-customer-engagement', 'business-software'],
  'api': ['developer-tools', 'api-development'],
  'scalable': ['devops-infrastructure', 'cloud-platforms'],
  
  // Design & Creative
  'design': ['graphic-design', 'ui-ux-design'],
  'prototyping': ['ui-ux-design', 'developer-tools'],
  'ui/ux': ['ui-ux-design', 'graphic-design'],
  'collaboration': ['document-collaboration', 'communication-collaboration'],
  'usability': ['ui-ux-design', 'testing-qa'],
  'testing': ['testing-qa', 'developer-tools'],
  'image editing': ['graphic-design', 'photo-editing'],
  'photo': ['photo-editing', 'graphic-design'],
  'graphics': ['graphic-design', 'ui-ux-design'],
  'browser': ['browser-extensions', 'developer-tools'],
  'psd': ['graphic-design', 'photo-editing'],
  'digital painting': ['graphic-design', 'photo-editing'],
  'illustration': ['graphic-design', 'ui-ux-design'],
  'art': ['graphic-design', 'photo-editing'],
  'vector': ['graphic-design', 'ui-ux-design'],
  'svg': ['graphic-design', 'developer-tools'],
  'simple': ['productivity', 'developer-tools'],
  'beginner': ['productivity', 'developer-tools'],
  'graphic design': ['graphic-design', 'marketing-customer-engagement'],
  'templates': ['graphic-design', 'marketing-customer-engagement'],
  'social media': ['marketing-customer-engagement', 'social-networks'],
  'vfx': ['video-audio', 'graphic-design'],
  'compositing': ['video-audio', 'graphic-design'],
  'motion graphics': ['video-audio', 'graphic-design'],
  'video': ['video-audio', 'content-media'],
  '3d': ['graphic-design', 'video-audio'],
  'animation': ['video-audio', 'graphic-design'],
  'video editing': ['video-audio', 'content-media'],
  'whiteboard': ['document-collaboration', 'productivity'],
  'diagrams': ['ui-ux-design', 'developer-tools'],
  'sketching': ['ui-ux-design', 'graphic-design'],
  'drawing': ['graphic-design', 'ui-ux-design'],
  'screen recording': ['video-audio', 'productivity'],
  'browser extension': ['browser-extensions', 'developer-tools'],
  'privacy': ['security-privacy', 'encryption'],
  'macos': ['developer-tools', 'productivity'],
  'gif': ['video-audio', 'content-media'],
  
  // Database & Backend
  'backend': ['backend-development', 'developer-tools'],
  'database': ['database-storage', 'backend-development'],
  'auth': ['authentication-identity', 'backend-development'],
  'realtime': ['backend-development', 'developer-tools'],
  'baas': ['backend-development', 'cloud-platforms'],
  'storage': ['file-sharing', 'database-storage'],
  'sqlite': ['database-storage', 'backend-development'],
  'graphql': ['api-development', 'backend-development'],
  'hasura': ['backend-development', 'api-development'],
  'mongodb': ['database-storage', 'backend-development'],
  'postgresql': ['database-storage', 'backend-development'],
  'nosql': ['database-storage', 'backend-development'],
  'redis': ['database-storage', 'caching'],
  'cache': ['caching', 'backend-development'],
  'in-memory': ['caching', 'database-storage'],
  'multithreading': ['developer-tools', 'backend-development'],
  'spreadsheet': ['productivity', 'business-software'],
  'no-code': ['developer-tools', 'business-software'],
  'formulas': ['productivity', 'business-software'],
  'python': ['developer-tools', 'data-analytics'],
  
  // DevOps & CI/CD
  'ci/cd': ['ci-cd', 'devops-infrastructure'],
  'containers': ['containerization', 'devops-infrastructure'],
  'automation': ['automation', 'devops-infrastructure'],
  'devops': ['devops-infrastructure', 'ci-cd'],
  'pipelines': ['ci-cd', 'devops-infrastructure'],
  'agents': ['ci-cd', 'devops-infrastructure'],
  'hybrid': ['cloud-platforms', 'devops-infrastructure'],
  'deployment': ['devops-infrastructure', 'cloud-platforms'],
  'paas': ['cloud-platforms', 'devops-infrastructure'],
  'self-hosted': ['devops-infrastructure', 'security-privacy'],
  'docker': ['containerization', 'devops-infrastructure'],
  'heroku': ['cloud-platforms', 'devops-infrastructure'],
  'one-click': ['devops-infrastructure', 'productivity'],
  
  // API
  'rest': ['api-development', 'developer-tools'],
  'git': ['version-control', 'developer-tools'],
  'developer tools': ['developer-tools', 'api-development'],
  'documentation': ['documentation', 'developer-tools'],
  'openapi': ['api-development', 'documentation'],
  'spec': ['api-development', 'documentation'],
  
  // Forms & Surveys
  'forms': ['forms-surveys', 'developer-tools'],
  'surveys': ['forms-surveys', 'analytics-platforms'],
  'feedback': ['forms-surveys', 'customer-support-success'],
  'research': ['forms-surveys', 'analytics-platforms'],
  'conversational': ['forms-surveys', 'ai-interaction-interfaces'],
  'builder': ['developer-tools', 'productivity'],
  'data collection': ['forms-surveys', 'analytics-platforms'],
  'analytics': ['analytics-platforms', 'data-analytics'],
  'professional': ['business-software', 'developer-tools'],
  
  // Documentation
  'wiki': ['knowledge-management', 'documentation'],
  'knowledge base': ['knowledge-management', 'documentation'],
  'team': ['communication-collaboration', 'business-software'],
  'markdown': ['developer-tools', 'documentation'],
  'nodejs': ['developer-tools', 'backend-development'],
  'static site': ['developer-tools', 'documentation'],
  'react': ['developer-tools', 'frontend-development'],
  'vue': ['developer-tools', 'frontend-development'],
  'vite': ['developer-tools', 'frontend-development'],
  
  // Video & Streaming
  'video conferencing': ['video-conferencing', 'communication-collaboration'],
  'webrtc': ['video-conferencing', 'communication-collaboration'],
  'meetings': ['video-conferencing', 'productivity'],
  'education': ['learning-management', 'education-technology'],
  'learning': ['learning-management', 'education-technology'],
  'messaging': ['team-chat-messaging', 'communication-collaboration'],
  'matrix': ['team-chat-messaging', 'communication-collaboration'],
  'encryption': ['encryption', 'security-privacy'],
  'video calls': ['video-conferencing', 'communication-collaboration'],
  'video hosting': ['video-audio', 'content-media'],
  'p2p': ['vpn-networking', 'video-audio'],
  'federated': ['communication-collaboration', 'social-networks'],
  'streaming': ['video-audio', 'content-media'],
  'cms': ['cms-platforms', 'content-media'],
  'media': ['content-media', 'video-audio'],
  
  // Time Tracking
  'time tracking': ['time-tracking', 'productivity'],
  'projects': ['project-management', 'business-software'],
  'invoicing': ['accounting-invoicing', 'business-software'],
  'reporting': ['business-intelligence', 'analytics-platforms'],
  'tags': ['productivity', 'developer-tools'],
  'dashboard': ['business-intelligence', 'analytics-platforms'],
  'automatic': ['automation', 'productivity'],
  'productivity': ['productivity', 'business-software'],
  'freelance': ['accounting-invoicing', 'business-software'],
  'teams': ['communication-collaboration', 'business-software'],
  'modern': ['developer-tools', 'productivity'],
  
  // Social Media
  'scheduling': ['calendar-scheduling', 'marketing-customer-engagement'],
  'publishing': ['content-media', 'marketing-customer-engagement'],
  'ai': ['ai-machine-learning', 'developer-tools'],
  'content': ['content-media', 'marketing-customer-engagement'],
  
  // Payment & Finance
  'payments': ['payment-processing', 'e-commerce'],
  'bitcoin': ['payment-processing', 'cryptocurrency'],
  'crypto': ['cryptocurrency', 'payment-processing'],
  'e-commerce': ['e-commerce', 'online-stores'],
  'billing': ['accounting-invoicing', 'business-software'],
  'subscriptions': ['payment-processing', 'business-software'],
  'accounting': ['accounting-invoicing', 'business-software'],
  'finance': ['accounting-invoicing', 'business-software'],
  'small business': ['business-software', 'accounting-invoicing'],
  'expenses': ['accounting-invoicing', 'business-software'],
  'mobile': ['developer-tools', 'productivity'],
  
  // Security
  'password manager': ['password-management', 'security-privacy'],
  'security': ['security-privacy', 'authentication-identity'],
  'cross-platform': ['developer-tools', 'productivity'],
  
  // Search
  'search': ['developer-tools', 'data-analytics'],
  'full-text': ['database-storage', 'developer-tools'],
  'instant': ['developer-tools', 'productivity'],
  'rust': ['developer-tools', 'backend-development'],
  'fast': ['developer-tools', 'backend-development'],
  'lightweight': ['developer-tools', 'productivity'],
  
  // CMS
  'headless': ['cms-platforms', 'api-development'],
  'blog': ['cms-platforms', 'content-media'],
  
  // Automation
  'workflow': ['automation', 'productivity'],
  'integration': ['automation', 'developer-tools'],
  'zapier': ['automation', 'productivity'],
  'scripts': ['developer-tools', 'automation'],
  'developer': ['developer-tools'],
  'workflows': ['automation', 'productivity'],
  
  // Scheduling
  'calendar': ['calendar-scheduling', 'productivity'],
  'booking': ['calendar-scheduling', 'business-software'],
  'polls': ['forms-surveys', 'productivity'],
  'doodle': ['calendar-scheduling', 'productivity'],
  
  // Monitoring
  'monitoring': ['monitoring-observability', 'devops-infrastructure'],
  'uptime': ['monitoring-observability', 'devops-infrastructure'],
  'status page': ['monitoring-observability', 'devops-infrastructure'],
  'alerts': ['monitoring-observability', 'devops-infrastructure'],
  'health check': ['monitoring-observability', 'devops-infrastructure'],
  'server': ['devops-infrastructure', 'backend-development'],
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
    console.log('\n🌱 Seeding new alternatives (batch 2)...');
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
