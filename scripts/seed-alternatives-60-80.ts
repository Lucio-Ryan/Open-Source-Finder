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
  { name: 'Customer Support', slug: 'customer-support' },
  { name: 'Help Desk', slug: 'help-desk' },
  { name: 'Forms', slug: 'forms' },
  { name: 'Survey', slug: 'survey' },
  { name: 'CMS', slug: 'cms' },
  { name: 'Website Builder', slug: 'website-builder' },
  { name: 'E-commerce', slug: 'e-commerce' },
  { name: 'Documentation', slug: 'documentation' },
  { name: 'Wiki', slug: 'wiki' },
  { name: 'Video Hosting', slug: 'video-hosting' },
  { name: 'Video Streaming', slug: 'video-streaming' },
  { name: 'Social Media', slug: 'social-media' },
  { name: 'Marketing', slug: 'marketing' },
  { name: 'Collaboration', slug: 'collaboration' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Self-Hosted', slug: 'self-hosted' },
  { name: 'Privacy', slug: 'privacy' },
];

// Proprietary software alternatives 60-80 from open_source_alternatives.md
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
  'basecamp': [
    {
      name: 'Twake',
      slug: 'twake',
      short_description: 'Open-source digital workplace',
      description: 'Twake is an open-source collaboration platform that combines messaging, file sharing, task management, and video conferencing.',
      website: 'https://twake.app/',
      github: 'https://github.com/linagora/twake',
      is_self_hosted: true,
      categoryNames: ['Collaboration', 'Project Management', 'Self-Hosted']
    },
    {
      name: 'OpenProject',
      slug: 'openproject-basecamp',
      short_description: 'Open-source project management software',
      description: 'A comprehensive tool for project planning, scheduling, and collaboration with support for agile and traditional methodologies.',
      website: 'https://www.openproject.org/',
      github: 'https://github.com/opf/openproject',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'Mattermost',
      slug: 'mattermost-basecamp',
      short_description: 'Open-source platform for secure collaboration',
      description: 'A secure team collaboration platform with messaging, file sharing, and integrations.',
      website: 'https://mattermost.com/',
      github: 'https://github.com/mattermost/mattermost',
      is_self_hosted: true,
      categoryNames: ['Collaboration', 'Team Chat', 'Self-Hosted']
    }
  ],
  'zendesk': [
    {
      name: 'Zammad',
      slug: 'zammad',
      short_description: 'Open-source help desk and customer support',
      description: 'Zammad is a web-based, open-source helpdesk/customer support system with many features to manage customer communication.',
      website: 'https://zammad.org/',
      github: 'https://github.com/zammad/zammad',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    },
    {
      name: 'FreeScout',
      slug: 'freescout',
      short_description: 'Open-source help desk and shared inbox',
      description: 'A lightweight and easy-to-use tool for managing your customer support requests with email integration.',
      website: 'https://freescout.net/',
      github: 'https://github.com/freescout-helpdesk/freescout',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    },
    {
      name: 'osTicket',
      slug: 'osticket',
      short_description: 'Open-source support ticket system',
      description: 'A widely-used open-source support ticket system that routes inquiries created via email, web forms, and phone calls into a simple, easy-to-use web interface.',
      website: 'https://osticket.com/',
      github: 'https://github.com/osTicket/osTicket',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    }
  ],
  'freshdesk': [
    {
      name: 'Zammad',
      slug: 'zammad-freshdesk',
      short_description: 'Open-source help desk and customer support',
      description: 'A modern and easy-to-use tool for managing your customer support requests with multi-channel support.',
      website: 'https://zammad.org/',
      github: 'https://github.com/zammad/zammad',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    },
    {
      name: 'Helpy',
      slug: 'helpy',
      short_description: 'Open-source customer support platform',
      description: 'A modern and easy-to-use tool for managing your customer support requests and knowledge base.',
      website: 'https://helpy.io/',
      github: 'https://github.com/helpyio/helpy',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    },
    {
      name: 'Chatwoot',
      slug: 'chatwoot-freshdesk',
      short_description: 'Open-source customer engagement suite',
      description: 'An open-source alternative for customer support with live chat, email, and social media integration.',
      website: 'https://www.chatwoot.com/',
      github: 'https://github.com/chatwoot/chatwoot',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    }
  ],
  'help-scout': [
    {
      name: 'FreeScout',
      slug: 'freescout-helpscout',
      short_description: 'Open-source help desk and shared inbox',
      description: 'A super lightweight and powerful help desk solution with a familiar email-like interface.',
      website: 'https://freescout.net/',
      github: 'https://github.com/freescout-helpdesk/freescout',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    },
    {
      name: 'Zammad',
      slug: 'zammad-helpscout',
      short_description: 'Open-source help desk and customer support',
      description: 'A powerful and easy-to-use tool for managing your customer support requests across multiple channels.',
      website: 'https://zammad.org/',
      github: 'https://github.com/zammad/zammad',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    },
    {
      name: 'Peppermint',
      slug: 'peppermint',
      short_description: 'Open-source ticket management system',
      description: 'A simple and lightweight ticket management system for small teams and individuals.',
      website: 'https://peppermint.sh/',
      github: 'https://github.com/Peppermint-Lab/peppermint',
      is_self_hosted: true,
      categoryNames: ['Customer Support', 'Help Desk', 'Self-Hosted']
    }
  ],
  'typeform': [
    {
      name: 'Tally',
      slug: 'tally',
      short_description: 'Simple and powerful form builder',
      description: 'Tally is a free form builder that allows you to create beautiful forms without writing code.',
      website: 'https://tally.so/',
      github: 'https://github.com/tally-so/tally',
      is_self_hosted: false,
      categoryNames: ['Forms', 'Survey', 'Open Source']
    },
    {
      name: 'Form.io',
      slug: 'formio',
      short_description: 'Open-source form builder and management',
      description: 'A powerful and flexible tool for building and managing forms with a drag-and-drop builder and API-first approach.',
      website: 'https://form.io/',
      github: 'https://github.com/formio/formio',
      is_self_hosted: true,
      categoryNames: ['Forms', 'Survey', 'Self-Hosted']
    },
    {
      name: 'OhMyForm',
      slug: 'ohmyform',
      short_description: 'Open-source form builder',
      description: 'A free, open-source alternative to TypeForm with a beautiful interface and powerful features.',
      website: 'https://ohmyform.com/',
      github: 'https://github.com/ohmyform/ohmyform',
      is_self_hosted: true,
      categoryNames: ['Forms', 'Survey', 'Self-Hosted']
    }
  ],
  'google-forms': [
    {
      name: 'TellForm',
      slug: 'tellform',
      short_description: 'Open-source form builder',
      description: 'An open-source alternative to Google Forms with a user-friendly interface and real-time analytics.',
      website: 'https://tellform.com/',
      github: 'https://github.com/tellform/tellform',
      is_self_hosted: true,
      categoryNames: ['Forms', 'Survey', 'Self-Hosted']
    },
    {
      name: 'LimeSurvey',
      slug: 'limesurvey',
      short_description: 'Open-source online survey tool',
      description: 'A powerful and feature-rich tool for creating and managing online surveys with advanced logic and branching.',
      website: 'https://www.limesurvey.org/',
      github: 'https://github.com/LimeSurvey/LimeSurvey',
      is_self_hosted: true,
      categoryNames: ['Forms', 'Survey', 'Self-Hosted']
    },
    {
      name: 'Form.io',
      slug: 'formio-gforms',
      short_description: 'Open-source form builder',
      description: 'A flexible form builder that can be self-hosted and integrated into any application.',
      website: 'https://form.io/',
      github: 'https://github.com/formio/formio',
      is_self_hosted: true,
      categoryNames: ['Forms', 'Survey', 'Self-Hosted']
    }
  ],
  'surveymonkey': [
    {
      name: 'LimeSurvey',
      slug: 'limesurvey-surveymonkey',
      short_description: 'Open-source online survey tool',
      description: 'A professional survey platform with advanced features for creating, distributing, and analyzing surveys.',
      website: 'https://www.limesurvey.org/',
      github: 'https://github.com/LimeSurvey/LimeSurvey',
      is_self_hosted: true,
      categoryNames: ['Survey', 'Forms', 'Self-Hosted']
    },
    {
      name: 'FormTools',
      slug: 'formtools',
      short_description: 'Open-source form processor',
      description: 'A powerful and flexible web application for managing your forms and surveys.',
      website: 'https://formtools.org/',
      github: 'https://github.com/formtools/core',
      is_self_hosted: true,
      categoryNames: ['Survey', 'Forms', 'Self-Hosted']
    },
    {
      name: 'SurveyJS',
      slug: 'surveyjs',
      short_description: 'Open-source JavaScript survey library',
      description: 'A JavaScript library for building surveys and forms with extensive customization options.',
      website: 'https://surveyjs.io/',
      github: 'https://github.com/surveyjs/survey-library',
      is_self_hosted: true,
      categoryNames: ['Survey', 'Forms', 'Open Source']
    }
  ],
  'wordpress': [
    {
      name: 'Ghost',
      slug: 'ghost-wordpress',
      short_description: 'Open-source platform for professional publishing',
      description: 'Ghost is a modern, powerful publishing platform with a focus on simplicity and clean design.',
      website: 'https://ghost.org/',
      github: 'https://github.com/TryGhost/Ghost',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Website Builder', 'Self-Hosted']
    },
    {
      name: 'Strapi',
      slug: 'strapi',
      short_description: 'Open-source headless CMS',
      description: 'A powerful and flexible tool for building and managing your content with a customizable API.',
      website: 'https://strapi.io/',
      github: 'https://github.com/strapi/strapi',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'Wagtail',
      slug: 'wagtail',
      short_description: 'Django-based open-source CMS',
      description: 'A powerful and flexible CMS built on Django with a beautiful, intuitive interface.',
      website: 'https://wagtail.org/',
      github: 'https://github.com/wagtail/wagtail',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Open Source', 'Self-Hosted']
    }
  ],
  'webflow': [
    {
      name: 'GrapesJS',
      slug: 'grapesjs',
      short_description: 'Open-source web builder framework',
      description: 'A free and open-source web builder framework that allows you to create web templates with drag-and-drop.',
      website: 'https://grapesjs.com/',
      github: 'https://github.com/artf/grapesjs',
      is_self_hosted: true,
      categoryNames: ['Website Builder', 'CMS', 'Open Source']
    },
    {
      name: 'Silex',
      slug: 'silex',
      short_description: 'Open-source website builder',
      description: 'A simple and easy-to-use tool for building websites with a drag-and-drop interface.',
      website: 'https://www.silex.me/',
      github: 'https://github.com/silexlabs/Silex',
      is_self_hosted: true,
      categoryNames: ['Website Builder', 'CMS', 'Self-Hosted']
    },
    {
      name: 'Publii',
      slug: 'publii',
      short_description: 'Static website CMS',
      description: 'A desktop-based CMS for building static websites with a beautiful interface and multiple themes.',
      website: 'https://getpublii.com/',
      github: 'https://github.com/GetPublii/Publii',
      is_self_hosted: true,
      categoryNames: ['Website Builder', 'CMS', 'Open Source']
    }
  ],
  'squarespace': [
    {
      name: 'Ghost',
      slug: 'ghost-squarespace',
      short_description: 'Open-source platform for professional publishing',
      description: 'A modern publishing platform with beautiful themes and powerful features for creators.',
      website: 'https://ghost.org/',
      github: 'https://github.com/TryGhost/Ghost',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Website Builder', 'Self-Hosted']
    },
    {
      name: 'Hugo',
      slug: 'hugo',
      short_description: 'Open-source static site generator',
      description: 'A powerful and fast tool for building static websites with a focus on performance and speed.',
      website: 'https://gohugo.io/',
      github: 'https://github.com/gohugoio/hugo',
      is_self_hosted: true,
      categoryNames: ['Website Builder', 'CMS', 'Open Source']
    },
    {
      name: 'Grav',
      slug: 'grav',
      short_description: 'Modern flat-file CMS',
      description: 'A fast, simple, and flexible file-based CMS that doesn\'t require a database.',
      website: 'https://getgrav.org/',
      github: 'https://github.com/getgrav/grav',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Website Builder', 'Self-Hosted']
    }
  ],
  'wix': [
    {
      name: 'Silex',
      slug: 'silex-wix',
      short_description: 'Open-source website builder',
      description: 'A free website builder that lets you create responsive websites with a visual editor.',
      website: 'https://www.silex.me/',
      github: 'https://github.com/silexlabs/Silex',
      is_self_hosted: true,
      categoryNames: ['Website Builder', 'CMS', 'Self-Hosted']
    },
    {
      name: 'WordPress',
      slug: 'wordpress-wix',
      short_description: 'Open-source content management system',
      description: 'A powerful and feature-rich tool for building and managing your content with thousands of themes and plugins.',
      website: 'https://wordpress.org/',
      github: 'https://github.com/WordPress/WordPress',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Website Builder', 'Self-Hosted']
    },
    {
      name: 'Joomla',
      slug: 'joomla',
      short_description: 'Open-source CMS',
      description: 'A powerful and flexible content management system for building websites and online applications.',
      website: 'https://www.joomla.org/',
      github: 'https://github.com/joomla/joomla-cms',
      is_self_hosted: true,
      categoryNames: ['CMS', 'Website Builder', 'Self-Hosted']
    }
  ],
  'shopify': [
    {
      name: 'WooCommerce',
      slug: 'woocommerce',
      short_description: 'Open-source e-commerce platform',
      description: 'WooCommerce is a customizable, open-source e-commerce plugin for WordPress.',
      website: 'https://woocommerce.com/',
      github: 'https://github.com/woocommerce/woocommerce',
      is_self_hosted: true,
      categoryNames: ['E-commerce', 'CMS', 'Self-Hosted']
    },
    {
      name: 'Medusa',
      slug: 'medusa',
      short_description: 'Open-source headless e-commerce',
      description: 'A powerful and flexible tool for building and managing your online store with a customizable API.',
      website: 'https://medusajs.com/',
      github: 'https://github.com/medusajs/medusa',
      is_self_hosted: true,
      categoryNames: ['E-commerce', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'PrestaShop',
      slug: 'prestashop',
      short_description: 'Open-source e-commerce solution',
      description: 'A feature-rich e-commerce platform with a large community and extensive customization options.',
      website: 'https://www.prestashop.com/',
      github: 'https://github.com/PrestaShop/PrestaShop',
      is_self_hosted: true,
      categoryNames: ['E-commerce', 'CMS', 'Self-Hosted']
    }
  ],
  'confluence': [
    {
      name: 'BookStack',
      slug: 'bookstack',
      short_description: 'Open-source documentation platform',
      description: 'BookStack is a simple, self-hosted platform for organizing and storing information with a book-like structure.',
      website: 'https://www.bookstackapp.com/',
      github: 'https://github.com/BookStackApp/BookStack',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Wiki', 'Self-Hosted']
    },
    {
      name: 'Wiki.js',
      slug: 'wikijs',
      short_description: 'Open-source wiki software',
      description: 'A powerful and modern tool for building and managing your wiki with many features and a beautiful interface.',
      website: 'https://js.wiki/',
      github: 'https://github.com/requarks/wiki',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Wiki', 'Self-Hosted']
    },
    {
      name: 'Outline',
      slug: 'outline-confluence',
      short_description: 'Open-source knowledge base',
      description: 'A fast, collaborative knowledge base for teams with a beautiful editor and powerful search.',
      website: 'https://www.getoutline.com/',
      github: 'https://github.com/outline/outline',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Wiki', 'Self-Hosted']
    }
  ],
  'gitbook': [
    {
      name: 'Docusaurus',
      slug: 'docusaurus',
      short_description: 'Open-source documentation website builder',
      description: 'Docusaurus makes it easy to build, deploy, and maintain open source project documentation websites.',
      website: 'https://docusaurus.io/',
      github: 'https://github.com/facebook/docusaurus',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'MkDocs',
      slug: 'mkdocs',
      short_description: 'Open-source static site generator for documentation',
      description: 'A simple and easy-to-use tool for building documentation websites with Markdown.',
      website: 'https://www.mkdocs.org/',
      github: 'https://github.com/mkdocs/mkdocs',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'Docsify',
      slug: 'docsify',
      short_description: 'Magical documentation site generator',
      description: 'A lightweight documentation generator that doesn\'t require build steps and works with Markdown files.',
      website: 'https://docsify.js.org/',
      github: 'https://github.com/docsifyjs/docsify',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Open Source', 'Self-Hosted']
    }
  ],
  'readme': [
    {
      name: 'Redoc',
      slug: 'redoc',
      short_description: 'Open-source API documentation tool',
      description: 'Redoc generates beautiful, interactive API documentation from OpenAPI specifications.',
      website: 'https://redocly.com/',
      github: 'https://github.com/Redocly/redoc',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'Swagger UI',
      slug: 'swagger-ui',
      short_description: 'Open-source API documentation tool',
      description: 'A powerful and easy-to-use tool for building API documentation from OpenAPI specifications.',
      website: 'https://swagger.io/tools/swagger-ui/',
      github: 'https://github.com/swagger-api/swagger-ui',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'Stoplight Elements',
      slug: 'stoplight-elements',
      short_description: 'Open-source API documentation components',
      description: 'Beautiful, customizable API documentation components built with web components.',
      website: 'https://stoplight.io/open-source/elements',
      github: 'https://github.com/stoplightio/elements',
      is_self_hosted: true,
      categoryNames: ['Documentation', 'Open Source', 'Self-Hosted']
    }
  ],
  'youtube': [
    {
      name: 'PeerTube',
      slug: 'peertube-youtube',
      short_description: 'Decentralized video hosting platform',
      description: 'A free, decentralized video platform that uses peer-to-peer technology to reduce server load.',
      website: 'https://joinpeertube.org/',
      github: 'https://github.com/Chocobozzz/PeerTube',
      is_self_hosted: true,
      categoryNames: ['Video Hosting', 'Video Streaming', 'Self-Hosted']
    },
    {
      name: 'Odysee',
      slug: 'odysee',
      short_description: 'Decentralized video sharing platform',
      description: 'A platform for sharing and discovering videos that is built on the LBRY protocol with blockchain technology.',
      website: 'https://odysee.com/',
      github: 'https://github.com/lbryio/lbry-desktop',
      is_self_hosted: false,
      categoryNames: ['Video Hosting', 'Video Streaming', 'Open Source']
    },
    {
      name: 'Invidious',
      slug: 'invidious',
      short_description: 'Alternative YouTube frontend',
      description: 'An open-source alternative front-end to YouTube with privacy features and no ads.',
      website: 'https://invidious.io/',
      github: 'https://github.com/iv-org/invidious',
      is_self_hosted: true,
      categoryNames: ['Video Streaming', 'Privacy', 'Self-Hosted']
    }
  ],
  'vimeo': [
    {
      name: 'PeerTube',
      slug: 'peertube-vimeo',
      short_description: 'Decentralized video hosting platform',
      description: 'A federated video platform that allows you to host and share videos without centralized control.',
      website: 'https://joinpeertube.org/',
      github: 'https://github.com/Chocobozzz/PeerTube',
      is_self_hosted: true,
      categoryNames: ['Video Hosting', 'Video Streaming', 'Self-Hosted']
    },
    {
      name: 'MediaGoblin',
      slug: 'mediagoblin',
      short_description: 'Open-source media hosting platform',
      description: 'A powerful and flexible tool for hosting and sharing your media files including videos, images, and audio.',
      website: 'https://mediagoblin.org/',
      github: 'https://github.com/mediagoblin/mediagoblin',
      is_self_hosted: true,
      categoryNames: ['Video Hosting', 'Open Source', 'Self-Hosted']
    },
    {
      name: 'Owncast',
      slug: 'owncast-vimeo',
      short_description: 'Open-source live streaming server',
      description: 'A self-hosted live video streaming and chat server for building your own live streaming service.',
      website: 'https://owncast.online/',
      github: 'https://github.com/owncast/owncast',
      is_self_hosted: true,
      categoryNames: ['Video Streaming', 'Video Hosting', 'Self-Hosted']
    }
  ],
  'twitch': [
    {
      name: 'Owncast',
      slug: 'owncast-twitch',
      short_description: 'Open-source live streaming server',
      description: 'A self-hosted live video streaming server with chat that\'s easy to set up and use.',
      website: 'https://owncast.online/',
      github: 'https://github.com/owncast/owncast',
      is_self_hosted: true,
      categoryNames: ['Video Streaming', 'Video Hosting', 'Self-Hosted']
    },
    {
      name: 'PeerTube',
      slug: 'peertube-twitch',
      short_description: 'Decentralized video hosting platform',
      description: 'A federated video platform that supports both live streaming and video hosting with P2P technology.',
      website: 'https://joinpeertube.org/',
      github: 'https://github.com/Chocobozzz/PeerTube',
      is_self_hosted: true,
      categoryNames: ['Video Streaming', 'Video Hosting', 'Self-Hosted']
    },
    {
      name: 'Restreamer',
      slug: 'restreamer',
      short_description: 'Live video streaming solution',
      description: 'A complete streaming server solution for self-hosting with support for multiple streaming platforms.',
      website: 'https://datarhei.github.io/restreamer/',
      github: 'https://github.com/datarhei/restreamer',
      is_self_hosted: true,
      categoryNames: ['Video Streaming', 'Open Source', 'Self-Hosted']
    }
  ],
  'buffer': [
    {
      name: 'Mixpost',
      slug: 'mixpost',
      short_description: 'Self-hosted social media management',
      description: 'Mixpost is a self-hosted social media management platform for scheduling and publishing content.',
      website: 'https://mixpost.app/',
      github: 'https://github.com/inovector/mixpost',
      is_self_hosted: true,
      categoryNames: ['Social Media', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Postiz',
      slug: 'postiz',
      short_description: 'Open-source social media scheduling',
      description: 'A simple and easy-to-use tool for scheduling your social media posts across multiple platforms.',
      website: 'https://postiz.com/',
      github: 'https://github.com/gitroomhq/postiz',
      is_self_hosted: true,
      categoryNames: ['Social Media', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Fedica',
      slug: 'fedica',
      short_description: 'Open-source social media analytics',
      description: 'An analytics and management tool for social media with scheduling and monitoring features.',
      website: 'https://fedica.com/',
      github: 'https://github.com/fedica/fedica',
      is_self_hosted: false,
      categoryNames: ['Social Media', 'Marketing', 'Open Source']
    }
  ],
  'hootsuite': [
    {
      name: 'Mixpost',
      slug: 'mixpost-hootsuite',
      short_description: 'Self-hosted social media management',
      description: 'A comprehensive social media management platform for teams with scheduling, analytics, and collaboration.',
      website: 'https://mixpost.app/',
      github: 'https://github.com/inovector/mixpost',
      is_self_hosted: true,
      categoryNames: ['Social Media', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Postiz',
      slug: 'postiz-hootsuite',
      short_description: 'Open-source social media scheduling',
      description: 'Schedule and publish your social media content with a clean, easy-to-use interface.',
      website: 'https://postiz.com/',
      github: 'https://github.com/gitroomhq/postiz',
      is_self_hosted: true,
      categoryNames: ['Social Media', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'SocialHub',
      slug: 'socialhub',
      short_description: 'Open-source social media tool',
      description: 'A comprehensive tool for managing multiple social media accounts in one place.',
      website: 'https://socialhub.io/',
      github: 'https://github.com/socialhub-dev/socialhub',
      is_self_hosted: false,
      categoryNames: ['Social Media', 'Marketing', 'Open Source']
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

    // Get proprietary software (60-80)
    const proprietaryList = [
      'basecamp', 'zendesk', 'freshdesk', 'help-scout', 'typeform',
      'google-forms', 'surveymonkey', 'wordpress', 'webflow', 'squarespace',
      'wix', 'shopify', 'confluence', 'gitbook', 'readme',
      'youtube', 'vimeo', 'twitch', 'buffer', 'hootsuite'
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

    console.log('\n🎉 Finished adding alternatives for proprietary software 60-80!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
