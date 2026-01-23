import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  website: String,
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  short_description: String,
  website: String,
  github_url: String,
  github: String,
  license: String,
  is_self_hosted: { type: Boolean, default: false },
  health_score: { type: Number, default: 50 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  upvotes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// 60 more unique alternatives - Batch 3
const newAlternatives = [
  // Static Site Generators
  { name: 'Zola', description: 'Fast static site generator in Rust', website: 'https://getzola.org', github: 'https://github.com/getzola/zola', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['Hugo', 'Jekyll'] },
  { name: 'Pelican', description: 'Static site generator powered by Python', website: 'https://getpelican.com', github: 'https://github.com/getpelican/pelican', license: 'AGPL-3.0', categories: ['Developer Tools', 'Web Development'], alternative_to: ['WordPress', 'Jekyll'] },
  { name: 'Lektor', description: 'Flexible static content management', website: 'https://getlektor.com', github: 'https://github.com/lektor/lektor', license: 'BSD-3-Clause', categories: ['CMS'], alternative_to: ['WordPress'] },
  { name: 'Publii', description: 'Desktop-based CMS for static websites', website: 'https://getpublii.com', github: 'https://github.com/GetPublii/Publii', license: 'GPL-3.0', categories: ['CMS'], alternative_to: ['WordPress', 'Squarespace'] },

  // Image Optimization
  { name: 'Squoosh', description: 'Image compression web app', website: 'https://squoosh.app', github: 'https://github.com/GoogleChromeLabs/squoosh', license: 'Apache-2.0', categories: ['Photo Editing', 'Developer Tools'], alternative_to: ['TinyPNG', 'ImageOptim'] },
  { name: 'ImageMagick', description: 'Image manipulation toolkit', website: 'https://imagemagick.org', github: 'https://github.com/ImageMagick/ImageMagick', license: 'Apache-2.0', categories: ['Photo Editing', 'Developer Tools'], alternative_to: ['Adobe Photoshop'] },
  { name: 'VIPS', description: 'Fast image processing library', website: 'https://libvips.github.io/libvips', github: 'https://github.com/libvips/libvips', license: 'LGPL-2.1', categories: ['Photo Editing'], alternative_to: ['ImageMagick'] },

  // Font Tools
  { name: 'FontForge', description: 'Font editor for creating fonts', website: 'https://fontforge.org', github: 'https://github.com/fontforge/fontforge', license: 'GPL-3.0', categories: ['Graphic Design'], alternative_to: ['Glyphs', 'FontLab'] },
  { name: 'Birdfont', description: 'Font editor for creating TTF and EOT fonts', website: 'https://birdfont.org', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'GPL-3.0', categories: ['Graphic Design'], alternative_to: ['FontLab'] },

  // Browser Automation & Scraping
  { name: 'Crawlee', description: 'Web scraping and browser automation library', website: 'https://crawlee.dev', github: 'https://github.com/apify/crawlee', license: 'Apache-2.0', categories: ['Developer Tools', 'Automation'], alternative_to: ['ScrapingBee', 'Apify'] },
  { name: 'Scrapy', description: 'Web crawling framework for Python', website: 'https://scrapy.org', github: 'https://github.com/scrapy/scrapy', license: 'BSD-3-Clause', categories: ['Developer Tools'], alternative_to: ['Octoparse'] },
  { name: 'Colly', description: 'Fast and elegant scraping framework for Go', website: 'http://go-colly.org', github: 'https://github.com/gocolly/colly', license: 'Apache-2.0', categories: ['Developer Tools'], alternative_to: ['Scrapy'] },

  // Form Builders
  { name: 'Formio', description: 'Form and data management platform', website: 'https://form.io', github: 'https://github.com/formio/formio', license: 'MIT', categories: ['Developer Tools', 'Productivity'], alternative_to: ['Typeform', 'Google Forms'], is_self_hosted: true },
  { name: 'OhMyForm', description: 'Open source form builder', website: 'https://ohmyform.com', github: 'https://github.com/ohmyform/ohmyform', license: 'AGPL-3.0', categories: ['Productivity'], alternative_to: ['Typeform', 'JotForm'], is_self_hosted: true },
  { name: 'Heyform', description: 'Open source form builder', website: 'https://heyform.net', github: 'https://github.com/heyform/heyform', license: 'AGPL-3.0', categories: ['Productivity'], alternative_to: ['Typeform'], is_self_hosted: true },

  // Link Shorteners
  { name: 'Kutt', description: 'Modern URL shortener with custom domains', website: 'https://kutt.it', github: 'https://github.com/thedevs-network/kutt', license: 'MIT', categories: ['Productivity', 'Developer Tools'], alternative_to: ['Bitly', 'TinyURL'], is_self_hosted: true },
  { name: 'YOURLS', description: 'Your Own URL Shortener', website: 'https://yourls.org', github: 'https://github.com/YOURLS/YOURLS', license: 'MIT', categories: ['Productivity'], alternative_to: ['Bitly'], is_self_hosted: true },
  { name: 'Shlink', description: 'Self-hosted URL shortener', website: 'https://shlink.io', github: 'https://github.com/shlinkio/shlink', license: 'MIT', categories: ['Productivity'], alternative_to: ['Bitly', 'Rebrandly'], is_self_hosted: true },

  // Status Pages
  { name: 'Cachet', description: 'Open source status page system', website: 'https://cachethq.io', github: 'https://github.com/CachetHQ/Cachet', license: 'BSD-3-Clause', categories: ['Monitoring & Observability'], alternative_to: ['Statuspage', 'Atlassian Statuspage'], is_self_hosted: true },
  { name: 'Gatus', description: 'Health dashboard for services', website: 'https://gatus.io', github: 'https://github.com/TwiN/gatus', license: 'Apache-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Pingdom', 'UptimeRobot'], is_self_hosted: true },
  { name: 'Vigil', description: 'Microservices status page', website: 'https://github.com/valeriansaliou/vigil', github: 'https://github.com/valeriansaliou/vigil', license: 'MPL-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Statuspage'], is_self_hosted: true },
  { name: 'Statping-ng', description: 'Status page for monitoring services', website: 'https://github.com/statping-ng/statping-ng', github: 'https://github.com/statping-ng/statping-ng', license: 'GPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['Statuspage'], is_self_hosted: true },

  // Survey Tools
  { name: 'LimeSurvey', description: 'Online survey tool', website: 'https://limesurvey.org', github: 'https://github.com/LimeSurvey/LimeSurvey', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['SurveyMonkey', 'Google Forms'], is_self_hosted: true },
  { name: 'Formbricks', description: 'Open source survey platform', website: 'https://formbricks.com', github: 'https://github.com/formbricks/formbricks', license: 'AGPL-3.0', categories: ['Productivity', 'Analytics'], alternative_to: ['Typeform', 'SurveyMonkey'], is_self_hosted: true },

  // Diagramming & Whiteboard
  { name: 'Excalidraw', description: 'Virtual whiteboard for sketching', website: 'https://excalidraw.com', github: 'https://github.com/excalidraw/excalidraw', license: 'MIT', categories: ['Prototyping & Wireframing', 'Productivity'], alternative_to: ['Miro', 'FigJam'] },
  { name: 'tldraw', description: 'Collaborative whiteboard', website: 'https://tldraw.com', github: 'https://github.com/tldraw/tldraw', license: 'Apache-2.0', categories: ['Prototyping & Wireframing'], alternative_to: ['Miro', 'Excalidraw'] },

  // E-commerce
  { name: 'Medusa', description: 'Open source Shopify alternative', website: 'https://medusajs.com', github: 'https://github.com/medusajs/medusa', license: 'MIT', categories: ['E-Commerce'], alternative_to: ['Shopify', 'BigCommerce'], is_self_hosted: true },
  { name: 'Saleor', description: 'GraphQL-first e-commerce platform', website: 'https://saleor.io', github: 'https://github.com/saleor/saleor', license: 'BSD-3-Clause', categories: ['E-Commerce'], alternative_to: ['Shopify', 'Magento'], is_self_hosted: true },
  { name: 'Reaction Commerce', description: 'Real-time commerce platform', website: 'https://reactioncommerce.com', github: 'https://github.com/reactioncommerce/reaction', license: 'GPL-3.0', categories: ['E-Commerce'], alternative_to: ['Shopify'], is_self_hosted: true },
  { name: 'Bagisto', description: 'Laravel eCommerce framework', website: 'https://bagisto.com', github: 'https://github.com/bagisto/bagisto', license: 'MIT', categories: ['E-Commerce'], alternative_to: ['Magento', 'WooCommerce'], is_self_hosted: true },

  // Translation & Localization
  { name: 'Weblate', description: 'Web-based translation tool', website: 'https://weblate.org', github: 'https://github.com/WeblateOrg/weblate', license: 'GPL-3.0', categories: ['Developer Tools', 'Productivity'], alternative_to: ['Crowdin', 'Lokalise'], is_self_hosted: true },
  { name: 'Traduora', description: 'Translation management platform', website: 'https://traduora.co', github: 'https://github.com/ever-co/ever-traduora', license: 'AGPL-3.0', categories: ['Developer Tools'], alternative_to: ['Crowdin', 'Phrase'], is_self_hosted: true },
  { name: 'Tolgee', description: 'Localization platform for developers', website: 'https://tolgee.io', github: 'https://github.com/tolgee/tolgee-platform', license: 'Apache-2.0', categories: ['Developer Tools'], alternative_to: ['Crowdin', 'Lokalise'], is_self_hosted: true },

  // Web Analytics
  { name: 'Ackee', description: 'Self-hosted analytics tool', website: 'https://ackee.electerious.com', github: 'https://github.com/electerious/Ackee', license: 'MIT', categories: ['Analytics'], alternative_to: ['Google Analytics'], is_self_hosted: true },
  { name: 'Shynet', description: 'Privacy-friendly web analytics', website: 'https://github.com/milesmcc/shynet', github: 'https://github.com/milesmcc/shynet', license: 'Apache-2.0', categories: ['Analytics'], alternative_to: ['Google Analytics'], is_self_hosted: true },
  { name: 'Pirsch', description: 'Privacy-friendly web analytics', website: 'https://pirsch.io', github: 'https://github.com/pirsch-analytics/pirsch', license: 'AGPL-3.0', categories: ['Analytics'], alternative_to: ['Google Analytics'], is_self_hosted: true },

  // Feature Flags
  { name: 'Unleash', description: 'Open source feature flag solution', website: 'https://getunleash.io', github: 'https://github.com/Unleash/unleash', license: 'Apache-2.0', categories: ['Developer Tools', 'DevOps'], alternative_to: ['LaunchDarkly', 'Split'], is_self_hosted: true },
  { name: 'Flagsmith', description: 'Feature flag and remote config', website: 'https://flagsmith.com', github: 'https://github.com/Flagsmith/flagsmith', license: 'BSD-3-Clause', categories: ['Developer Tools'], alternative_to: ['LaunchDarkly'], is_self_hosted: true },
  { name: 'GrowthBook', description: 'Open source feature flags and A/B testing', website: 'https://growthbook.io', github: 'https://github.com/growthbook/growthbook', license: 'MIT', categories: ['Developer Tools', 'Analytics'], alternative_to: ['Optimizely', 'LaunchDarkly'], is_self_hosted: true },

  // Error Tracking
  { name: 'GlitchTip', description: 'Open source error tracking', website: 'https://glitchtip.com', github: 'https://github.com/GlitchTip/glitchtip', license: 'MIT', categories: ['Monitoring & Observability', 'Developer Tools'], alternative_to: ['Sentry', 'Bugsnag'], is_self_hosted: true },
  { name: 'Highlight', description: 'Full-stack monitoring platform', website: 'https://highlight.io', github: 'https://github.com/highlight/highlight', license: 'Apache-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Sentry', 'LogRocket'], is_self_hosted: true },

  // Media Transcoding
  { name: 'Handbrake', description: 'Video transcoder', website: 'https://handbrake.fr', github: 'https://github.com/HandBrake/HandBrake', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['Adobe Media Encoder'] },
  { name: 'Shutter Encoder', description: 'Video and audio converter', website: 'https://shutterencoder.com', github: 'https://github.com/paulpacifico/shutter-encoder', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Adobe Media Encoder'] },

  // Network Tools
  { name: 'Wireshark', description: 'Network protocol analyzer', website: 'https://wireshark.org', github: 'https://github.com/wireshark/wireshark', license: 'GPL-2.0', categories: ['Networking', 'Security & Privacy'], alternative_to: ['Fiddler'] },
  { name: 'mitmproxy', description: 'Interactive HTTPS proxy', website: 'https://mitmproxy.org', github: 'https://github.com/mitmproxy/mitmproxy', license: 'MIT', categories: ['Networking', 'Developer Tools'], alternative_to: ['Charles Proxy', 'Fiddler'] },
  { name: 'Proxyman', description: 'Modern web debugging proxy', website: 'https://proxyman.io', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'Proprietary-Free', categories: ['Networking', 'Developer Tools'], alternative_to: ['Charles Proxy'] },

  // Self-Hosted Clouds
  { name: 'Seafile', description: 'File hosting and collaboration', website: 'https://seafile.com', github: 'https://github.com/haiwen/seafile', license: 'GPL-2.0', categories: ['Productivity', 'Backup & Recovery'], alternative_to: ['Dropbox', 'Google Drive'], is_self_hosted: true },
  { name: 'FileRun', description: 'Self-hosted Google Drive alternative', website: 'https://filerun.com', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'Proprietary', categories: ['Productivity'], alternative_to: ['Google Drive', 'Dropbox'], is_self_hosted: true },

  // Pastebin Alternatives
  { name: 'PrivateBin', description: 'Minimalist zero-knowledge pastebin', website: 'https://privatebin.info', github: 'https://github.com/PrivateBin/PrivateBin', license: 'Zlib', categories: ['Productivity', 'Security & Privacy'], alternative_to: ['Pastebin'], is_self_hosted: true },
  { name: 'Hastebin', description: 'Simple pastebin', website: 'https://hastebin.com', github: 'https://github.com/toptal/haste-server', license: 'MIT', categories: ['Productivity'], alternative_to: ['Pastebin'], is_self_hosted: true },
  { name: 'Dpaste', description: 'Pastebin application', website: 'https://dpaste.org', github: 'https://github.com/DarrenOffworlds/dpaste', license: 'MIT', categories: ['Productivity'], alternative_to: ['Pastebin'], is_self_hosted: true },

  // Desktop Environments
  { name: 'KDE Plasma', description: 'Feature-rich desktop environment', website: 'https://kde.org/plasma-desktop', github: 'https://invent.kde.org/plasma/plasma-desktop', license: 'GPL-2.0', categories: ['Operating Systems'], alternative_to: ['Windows', 'macOS'] },
  { name: 'GNOME', description: 'Desktop environment for Linux', website: 'https://gnome.org', github: 'https://gitlab.gnome.org/GNOME/gnome-shell', license: 'GPL-2.0', categories: ['Operating Systems'], alternative_to: ['Windows', 'macOS'] },
  { name: 'XFCE', description: 'Lightweight desktop environment', website: 'https://xfce.org', github: 'https://gitlab.xfce.org/xfce/xfdesktop', license: 'GPL-2.0', categories: ['Operating Systems'], alternative_to: ['Windows'] },

  // Clipboard Managers
  { name: 'CopyQ', description: 'Clipboard manager with editing', website: 'https://hluk.github.io/CopyQ', github: 'https://github.com/hluk/CopyQ', license: 'GPL-3.0', categories: ['Productivity'], alternative_to: ['Alfred', 'Paste'] },
  { name: 'Diodon', description: 'Simple clipboard manager', website: 'https://launchpad.net/diodon', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Alfred'] },

  // Window Managers
  { name: 'i3', description: 'Tiling window manager', website: 'https://i3wm.org', github: 'https://github.com/i3/i3', license: 'BSD-3-Clause', categories: ['Productivity'], alternative_to: ['Windows', 'macOS'] },
  { name: 'Sway', description: 'i3-compatible Wayland compositor', website: 'https://swaywm.org', github: 'https://github.com/swaywm/sway', license: 'MIT', categories: ['Productivity'], alternative_to: ['Windows'] },
  { name: 'Hyprland', description: 'Dynamic tiling Wayland compositor', website: 'https://hyprland.org', github: 'https://github.com/hyprwm/Hyprland', license: 'BSD-3-Clause', categories: ['Productivity'], alternative_to: ['Windows', 'macOS'] },
];

// Proprietary software that may be missing
const newProprietarySoftware = [
  { name: 'Hugo', website: 'https://gohugo.io', description: 'Static site generator' },
  { name: 'Jekyll', website: 'https://jekyllrb.com', description: 'Static site generator' },
  { name: 'Squarespace', website: 'https://squarespace.com', description: 'Website builder' },
  { name: 'TinyPNG', website: 'https://tinypng.com', description: 'Image compression' },
  { name: 'ImageOptim', website: 'https://imageoptim.com', description: 'Image optimization' },
  { name: 'Glyphs', website: 'https://glyphsapp.com', description: 'Font editor' },
  { name: 'FontLab', website: 'https://fontlab.com', description: 'Font editor' },
  { name: 'ScrapingBee', website: 'https://scrapingbee.com', description: 'Web scraping API' },
  { name: 'Apify', website: 'https://apify.com', description: 'Web scraping platform' },
  { name: 'Octoparse', website: 'https://octoparse.com', description: 'Web scraping tool' },
  { name: 'Typeform', website: 'https://typeform.com', description: 'Form builder' },
  { name: 'JotForm', website: 'https://jotform.com', description: 'Form builder' },
  { name: 'Bitly', website: 'https://bitly.com', description: 'URL shortener' },
  { name: 'TinyURL', website: 'https://tinyurl.com', description: 'URL shortener' },
  { name: 'Rebrandly', website: 'https://rebrandly.com', description: 'Link management' },
  { name: 'Statuspage', website: 'https://statuspage.io', description: 'Status page service' },
  { name: 'Atlassian Statuspage', website: 'https://statuspage.io', description: 'Status pages' },
  { name: 'Pingdom', website: 'https://pingdom.com', description: 'Website monitoring' },
  { name: 'UptimeRobot', website: 'https://uptimerobot.com', description: 'Uptime monitoring' },
  { name: 'SurveyMonkey', website: 'https://surveymonkey.com', description: 'Online surveys' },
  { name: 'Miro', website: 'https://miro.com', description: 'Online whiteboard' },
  { name: 'FigJam', website: 'https://figma.com/figjam', description: 'Online whiteboard' },
  { name: 'BigCommerce', website: 'https://bigcommerce.com', description: 'E-commerce platform' },
  { name: 'Magento', website: 'https://magento.com', description: 'E-commerce platform' },
  { name: 'WooCommerce', website: 'https://woocommerce.com', description: 'E-commerce plugin' },
  { name: 'Crowdin', website: 'https://crowdin.com', description: 'Localization platform' },
  { name: 'Lokalise', website: 'https://lokalise.com', description: 'Translation management' },
  { name: 'Phrase', website: 'https://phrase.com', description: 'Localization platform' },
  { name: 'LaunchDarkly', website: 'https://launchdarkly.com', description: 'Feature management' },
  { name: 'Split', website: 'https://split.io', description: 'Feature flags' },
  { name: 'Optimizely', website: 'https://optimizely.com', description: 'Experimentation platform' },
  { name: 'Bugsnag', website: 'https://bugsnag.com', description: 'Error monitoring' },
  { name: 'LogRocket', website: 'https://logrocket.com', description: 'Session replay' },
  { name: 'Adobe Media Encoder', website: 'https://adobe.com/products/media-encoder', description: 'Media encoding' },
  { name: 'Charles Proxy', website: 'https://charlesproxy.com', description: 'Web debugging proxy' },
  { name: 'Fiddler', website: 'https://telerik.com/fiddler', description: 'Web debugging proxy' },
  { name: 'Pastebin', website: 'https://pastebin.com', description: 'Text sharing' },
  { name: 'Alfred', website: 'https://alfredapp.com', description: 'Productivity app' },
  { name: 'Paste', website: 'https://pasteapp.io', description: 'Clipboard manager' },
];

async function seedNewAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // First, seed any missing proprietary software
    console.log('\n📁 Seeding missing proprietary software...');
    let propAddedCount = 0;
    for (const prop of newProprietarySoftware) {
      const slug = createSlug(prop.name);
      const existing = await ProprietarySoftware.findOne({
        $or: [{ slug }, { name: { $regex: `^${prop.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });
      if (!existing) {
        try {
          await ProprietarySoftware.create({ ...prop, slug });
          propAddedCount++;
        } catch (err: any) {
          if (err.code !== 11000) console.error(`Error adding ${prop.name}:`, err.message);
        }
      }
    }
    console.log(`   Added ${propAddedCount} proprietary software`);

    // Get all categories and proprietary software for mapping
    const categories = await Category.find();
    const categoryMap = new Map(categories.map((c: any) => [c.name, c._id]));
    
    const proprietarySoftware = await ProprietarySoftware.find();
    const proprietaryMap = new Map(proprietarySoftware.map((p: any) => [p.name.toLowerCase(), p._id]));

    console.log('\n🚀 Seeding new alternatives...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const alt of newAlternatives) {
      const slug = createSlug(alt.name);
      
      // Check if already exists
      const existing = await Alternative.findOne({
        $or: [{ slug }, { name: { $regex: `^${alt.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      // Map categories
      const categoryIds = alt.categories
        .map(catName => categoryMap.get(catName))
        .filter(Boolean);

      // Map alternative_to
      const alternativeToIds = alt.alternative_to
        .map(propName => proprietaryMap.get(propName.toLowerCase()))
        .filter(Boolean);

      try {
        await Alternative.create({
          name: alt.name,
          slug,
          description: alt.description,
          short_description: alt.description,
          website: alt.website,
          github_url: alt.github,
          github: alt.github || alt.website,
          license: alt.license,
          is_self_hosted: alt.is_self_hosted || false,
          categories: categoryIds,
          alternative_to: alternativeToIds,
          approved: true,
          health_score: Math.floor(Math.random() * 30) + 50,
          upvotes: Math.floor(Math.random() * 500) + 50,
        });
        addedCount++;
        process.stdout.write(`\r   Added ${addedCount} alternatives (${skippedCount} skipped)`);
      } catch (err: any) {
        if (err.code === 11000) {
          skippedCount++;
        } else {
          console.error(`\n   Error adding ${alt.name}:`, err.message);
        }
      }
    }

    console.log(`\n\n✅ Seeded ${addedCount} new alternatives (${skippedCount} already existed)`);

    // Get final count
    const totalCount = await Alternative.countDocuments();
    console.log(`📊 Total alternatives in database: ${totalCount}`);

    console.log('\n🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedNewAlternatives();
