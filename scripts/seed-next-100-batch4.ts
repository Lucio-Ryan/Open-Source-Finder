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

// Final batch of unique alternatives - Batch 4
const newAlternatives = [
  // Bookmark Managers
  { name: 'Shiori', description: 'Simple bookmark manager in Go', website: 'https://github.com/go-shiori/shiori', github: 'https://github.com/go-shiori/shiori', license: 'MIT', categories: ['Bookmarks & Reading'], alternative_to: ['Pocket', 'Instapaper'], is_self_hosted: true },
  { name: 'Linkding', description: 'Self-hosted bookmark service', website: 'https://github.com/sissbruecker/linkding', github: 'https://github.com/sissbruecker/linkding', license: 'MIT', categories: ['Bookmarks & Reading'], alternative_to: ['Pocket', 'Raindrop.io'], is_self_hosted: true },
  { name: 'Hoarder', description: 'Bookmark everything app', website: 'https://hoarder.app', github: 'https://github.com/hoarder-app/hoarder', license: 'AGPL-3.0', categories: ['Bookmarks & Reading'], alternative_to: ['Pocket', 'Instapaper'], is_self_hosted: true },
  { name: 'xBrowserSync', description: 'Browser syncing tool', website: 'https://xbrowsersync.org', github: 'https://github.com/xbrowsersync/app', license: 'GPL-3.0', categories: ['Bookmarks & Reading', 'Browser Extensions'], alternative_to: ['Chrome Sync'] },

  // Recipe Managers
  { name: 'Tandoor', description: 'Recipe management app', website: 'https://tandoor.dev', github: 'https://github.com/TandoorRecipes/recipes', license: 'AGPL-3.0', categories: ['Productivity'], alternative_to: ['Paprika', 'AnyList'], is_self_hosted: true },
  { name: 'Mealie', description: 'Self-hosted recipe manager', website: 'https://mealie.io', github: 'https://github.com/mealie-recipes/mealie', license: 'AGPL-3.0', categories: ['Productivity'], alternative_to: ['Paprika'], is_self_hosted: true },
  { name: 'Grocy', description: 'Groceries and household management', website: 'https://grocy.info', github: 'https://github.com/grocy/grocy', license: 'MIT', categories: ['Productivity'], alternative_to: ['AnyList', 'OurGroceries'], is_self_hosted: true },

  // Inventory Management
  { name: 'Snipe-IT', description: 'IT asset management system', website: 'https://snipeitapp.com', github: 'https://github.com/snipe/snipe-it', license: 'AGPL-3.0', categories: ['Productivity', 'Business Intelligence'], alternative_to: ['Asset Panda', 'ServiceNow'], is_self_hosted: true },
  { name: 'InvenTree', description: 'Inventory management system', website: 'https://inventree.org', github: 'https://github.com/inventree/InvenTree', license: 'MIT', categories: ['Productivity'], alternative_to: ['Fishbowl', 'inFlow'], is_self_hosted: true },
  { name: 'Part-DB', description: 'Electronic parts database', website: 'https://github.com/Part-DB/Part-DB-server', github: 'https://github.com/Part-DB/Part-DB-server', license: 'AGPL-3.0', categories: ['Productivity'], alternative_to: ['Digi-Key'], is_self_hosted: true },

  // Documentation Generators
  { name: 'Docusaurus', description: 'Documentation site generator', website: 'https://docusaurus.io', github: 'https://github.com/facebook/docusaurus', license: 'MIT', categories: ['Documentation', 'Developer Tools'], alternative_to: ['GitBook', 'ReadMe'] },
  { name: 'VuePress', description: 'Vue-powered static site generator', website: 'https://vuepress.vuejs.org', github: 'https://github.com/vuejs/vuepress', license: 'MIT', categories: ['Documentation', 'Developer Tools'], alternative_to: ['GitBook'] },
  { name: 'MkDocs', description: 'Static site generator for documentation', website: 'https://mkdocs.org', github: 'https://github.com/mkdocs/mkdocs', license: 'BSD-2-Clause', categories: ['Documentation'], alternative_to: ['GitBook', 'Confluence'] },
  { name: 'Docsify', description: 'Documentation site generator', website: 'https://docsify.js.org', github: 'https://github.com/docsifyjs/docsify', license: 'MIT', categories: ['Documentation'], alternative_to: ['GitBook'] },
  { name: 'Slate', description: 'Beautiful API documentation', website: 'https://slatedocs.github.io/slate', github: 'https://github.com/slatedocs/slate', license: 'Apache-2.0', categories: ['Documentation', 'API Development'], alternative_to: ['ReadMe', 'Stoplight'] },

  // Time Tracking
  { name: 'Kimai', description: 'Time tracking application', website: 'https://kimai.org', github: 'https://github.com/kimai/kimai', license: 'MIT', categories: ['Productivity', 'Time Tracking'], alternative_to: ['Toggl', 'Harvest'], is_self_hosted: true },
  { name: 'Traggo', description: 'Tag-based time tracking', website: 'https://traggo.net', github: 'https://github.com/traggo/server', license: 'GPL-3.0', categories: ['Time Tracking'], alternative_to: ['Toggl'], is_self_hosted: true },
  { name: 'Timetagger', description: 'Open source time tracker', website: 'https://timetagger.app', github: 'https://github.com/almarklein/timetagger', license: 'GPL-3.0', categories: ['Time Tracking'], alternative_to: ['Toggl', 'Clockify'], is_self_hosted: true },
  { name: 'ActivityWatch', description: 'Automated time tracker', website: 'https://activitywatch.net', github: 'https://github.com/ActivityWatch/activitywatch', license: 'MPL-2.0', categories: ['Time Tracking', 'Productivity'], alternative_to: ['RescueTime'] },

  // Invoice & Billing
  { name: 'Crater', description: 'Open source invoicing application', website: 'https://craterapp.com', github: 'https://github.com/crater-invoice/crater', license: 'AAL', categories: ['Finance & Accounting'], alternative_to: ['FreshBooks', 'QuickBooks'], is_self_hosted: true },
  { name: 'SolidInvoice', description: 'Simple invoicing software', website: 'https://solidinvoice.co', github: 'https://github.com/SolidInvoice/SolidInvoice', license: 'MIT', categories: ['Finance & Accounting'], alternative_to: ['FreshBooks'], is_self_hosted: true },
  { name: 'Invoice Ninja', description: 'Invoicing, quotes and payments', website: 'https://invoiceninja.com', github: 'https://github.com/invoiceninja/invoiceninja', license: 'AAL', categories: ['Finance & Accounting'], alternative_to: ['FreshBooks', 'Wave'], is_self_hosted: true },

  // Media Download
  { name: 'yt-dlp', description: 'YouTube video downloader', website: 'https://github.com/yt-dlp/yt-dlp', github: 'https://github.com/yt-dlp/yt-dlp', license: 'Unlicense', categories: ['Video & Audio', 'Terminal & CLI'], alternative_to: ['4K Video Downloader', 'ClipGrab'] },
  { name: 'Tube Archivist', description: 'YouTube archive manager', website: 'https://tubearchivist.com', github: 'https://github.com/tubearchivist/tubearchivist', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['YouTube Premium'], is_self_hosted: true },
  { name: 'Stremio', description: 'Video streaming aggregator', website: 'https://stremio.com', github: 'https://github.com/Stremio/stremio-web', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Netflix', 'Amazon Prime'] },

  // Code Quality & Linting
  { name: 'SonarQube', description: 'Code quality and security', website: 'https://sonarqube.org', github: 'https://github.com/SonarSource/sonarqube', license: 'LGPL-3.0', categories: ['Developer Tools', 'Security & Privacy'], alternative_to: ['Codacy', 'CodeClimate'], is_self_hosted: true },
  { name: 'Semgrep', description: 'Static analysis tool', website: 'https://semgrep.dev', github: 'https://github.com/semgrep/semgrep', license: 'LGPL-2.1', categories: ['Developer Tools', 'Security & Privacy'], alternative_to: ['Snyk Code', 'Checkmarx'] },
  { name: 'Trivy', description: 'Security scanner for containers', website: 'https://trivy.dev', github: 'https://github.com/aquasecurity/trivy', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps'], alternative_to: ['Snyk', 'Aqua Security'] },

  // Design Tools
  { name: 'Penpot', description: 'Design and prototyping platform', website: 'https://penpot.app', github: 'https://github.com/penpot/penpot', license: 'MPL-2.0', categories: ['Prototyping & Wireframing', 'Graphic Design'], alternative_to: ['Figma', 'Sketch'], is_self_hosted: true },
  { name: 'Pencil', description: 'GUI prototyping tool', website: 'https://pencil.evolus.vn', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'GPL-2.0', categories: ['Prototyping & Wireframing'], alternative_to: ['Balsamiq'] },
  { name: 'Akira', description: 'Native Linux design application', website: 'https://github.com/akiraux/Akira', github: 'https://github.com/akiraux/Akira', license: 'GPL-3.0', categories: ['Graphic Design'], alternative_to: ['Figma', 'Sketch'] },

  // Container Registry
  { name: 'Harbor', description: 'Cloud native registry', website: 'https://goharbor.io', github: 'https://github.com/goharbor/harbor', license: 'Apache-2.0', categories: ['Containers & Orchestration', 'DevOps'], alternative_to: ['Docker Hub', 'AWS ECR'], is_self_hosted: true },
  { name: 'Quay', description: 'Container image registry', website: 'https://quay.io', github: 'https://github.com/quay/quay', license: 'Apache-2.0', categories: ['Containers & Orchestration'], alternative_to: ['Docker Hub', 'Azure ACR'], is_self_hosted: true },
  { name: 'Zot', description: 'Production-ready container registry', website: 'https://zotregistry.dev', github: 'https://github.com/project-zot/zot', license: 'Apache-2.0', categories: ['Containers & Orchestration'], alternative_to: ['Docker Hub'], is_self_hosted: true },

  // Comment Systems
  { name: 'Remark42', description: 'Self-hosted comment engine', website: 'https://remark42.com', github: 'https://github.com/umputun/remark42', license: 'MIT', categories: ['Communication & Collaboration'], alternative_to: ['Disqus', 'Facebook Comments'], is_self_hosted: true },
  { name: 'Cusdis', description: 'Lightweight comment system', website: 'https://cusdis.com', github: 'https://github.com/djyde/cusdis', license: 'GPL-3.0', categories: ['Communication & Collaboration'], alternative_to: ['Disqus'], is_self_hosted: true },
  { name: 'Commento', description: 'Privacy-focused comments', website: 'https://commento.io', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'MIT', categories: ['Communication & Collaboration'], alternative_to: ['Disqus'], is_self_hosted: true },

  // Podcast Hosting
  { name: 'Castopod', description: 'Self-hosted podcast server', website: 'https://castopod.org', github: 'https://github.com/ad-aures/castopod', license: 'AGPL-3.0', categories: ['Video & Audio'], alternative_to: ['Anchor', 'Buzzsprout'], is_self_hosted: true },
  { name: 'AzuraCast', description: 'Web radio management suite', website: 'https://azuracast.com', github: 'https://github.com/AzuraCast/AzuraCast', license: 'AGPL-3.0', categories: ['Video & Audio'], alternative_to: ['Shoutcast', 'Icecast'], is_self_hosted: true },

  // Service Discovery
  { name: 'Nacos', description: 'Service discovery and configuration', website: 'https://nacos.io', github: 'https://github.com/alibaba/nacos', license: 'Apache-2.0', categories: ['DevOps', 'Networking'], alternative_to: ['Consul', 'Eureka'] },
  { name: 'Eureka', description: 'Service registry for microservices', website: 'https://github.com/Netflix/eureka', github: 'https://github.com/Netflix/eureka', license: 'Apache-2.0', categories: ['DevOps'], alternative_to: ['Consul'] },

  // Git Hosting
  { name: 'OneDev', description: 'Self-hosted Git server with CI/CD', website: 'https://onedev.io', github: 'https://github.com/theonedev/onedev', license: 'MIT', categories: ['Developer Tools', 'Version Control'], alternative_to: ['GitHub', 'GitLab'], is_self_hosted: true },
  { name: 'Soft Serve', description: 'Self-hosted Git server', website: 'https://github.com/charmbracelet/soft-serve', github: 'https://github.com/charmbracelet/soft-serve', license: 'MIT', categories: ['Developer Tools', 'Version Control'], alternative_to: ['GitHub'], is_self_hosted: true },

  // Event Streaming
  { name: 'Redpanda', description: 'Kafka-compatible streaming platform', website: 'https://redpanda.com', github: 'https://github.com/redpanda-data/redpanda', license: 'BSL-1.1', categories: ['Databases', 'DevOps'], alternative_to: ['Kafka', 'AWS Kinesis'] },
  { name: 'NATS', description: 'Cloud native messaging system', website: 'https://nats.io', github: 'https://github.com/nats-io/nats-server', license: 'Apache-2.0', categories: ['DevOps'], alternative_to: ['RabbitMQ', 'AWS SQS'] },

  // Dashboard Builders
  { name: 'Appsmith', description: 'Low-code platform for internal tools', website: 'https://appsmith.com', github: 'https://github.com/appsmithorg/appsmith', license: 'Apache-2.0', categories: ['Developer Tools', 'Productivity'], alternative_to: ['Retool', 'Budibase'], is_self_hosted: true },
  { name: 'ToolJet', description: 'Low-code platform for business apps', website: 'https://tooljet.com', github: 'https://github.com/ToolJet/ToolJet', license: 'AGPL-3.0', categories: ['Developer Tools'], alternative_to: ['Retool', 'Appian'], is_self_hosted: true },
  { name: 'Budibase', description: 'Low-code platform for apps', website: 'https://budibase.com', github: 'https://github.com/Budibase/budibase', license: 'GPL-3.0', categories: ['Developer Tools'], alternative_to: ['Retool', 'OutSystems'], is_self_hosted: true },
  { name: 'NocoDB', description: 'Open source Airtable alternative', website: 'https://nocodb.com', github: 'https://github.com/nocodb/nocodb', license: 'AGPL-3.0', categories: ['Databases', 'Productivity'], alternative_to: ['Airtable', 'Smartsheet'], is_self_hosted: true },

  // CRM Systems
  { name: 'SuiteCRM', description: 'Open source CRM application', website: 'https://suitecrm.com', github: 'https://github.com/salesagility/SuiteCRM', license: 'AGPL-3.0', categories: ['CRM'], alternative_to: ['Salesforce', 'HubSpot CRM'], is_self_hosted: true },
  { name: 'EspoCRM', description: 'Open source CRM platform', website: 'https://espocrm.com', github: 'https://github.com/espocrm/espocrm', license: 'GPL-3.0', categories: ['CRM'], alternative_to: ['Salesforce', 'Zoho CRM'], is_self_hosted: true },
  { name: 'Krayin CRM', description: 'Laravel-based open source CRM', website: 'https://krayincrm.com', github: 'https://github.com/krayin/laravel-crm', license: 'MIT', categories: ['CRM'], alternative_to: ['Pipedrive', 'HubSpot CRM'], is_self_hosted: true },

  // Self-Hosted Dashboards
  { name: 'Heimdall', description: 'Application dashboard and launcher', website: 'https://heimdall.site', github: 'https://github.com/linuxserver/Heimdall', license: 'MIT', categories: ['Productivity'], alternative_to: ['Start.me'], is_self_hosted: true },
  { name: 'Homer', description: 'Simple static HOMepage for your servER', website: 'https://homer-demo.netlify.app', github: 'https://github.com/bastienwirtz/homer', license: 'Apache-2.0', categories: ['Productivity'], alternative_to: ['Start.me'], is_self_hosted: true },
  { name: 'Dashy', description: 'Self-hosted dashboard for your homelab', website: 'https://dashy.to', github: 'https://github.com/Lissy93/dashy', license: 'MIT', categories: ['Productivity'], alternative_to: ['Start.me'], is_self_hosted: true },
  { name: 'Homarr', description: 'Customizable homepage for your server', website: 'https://homarr.dev', github: 'https://github.com/ajnart/homarr', license: 'MIT', categories: ['Productivity'], alternative_to: ['Start.me'], is_self_hosted: true },
];

// Proprietary software that may be missing
const newProprietarySoftware = [
  { name: 'Pocket', website: 'https://getpocket.com', description: 'Save content for later' },
  { name: 'Instapaper', website: 'https://instapaper.com', description: 'Read later service' },
  { name: 'Raindrop.io', website: 'https://raindrop.io', description: 'Bookmark manager' },
  { name: 'Chrome Sync', website: 'https://google.com/chrome', description: 'Browser sync' },
  { name: 'Paprika', website: 'https://paprikaapp.com', description: 'Recipe manager' },
  { name: 'AnyList', website: 'https://anylist.com', description: 'Shopping and recipe app' },
  { name: 'OurGroceries', website: 'https://ourgroceries.com', description: 'Shopping list app' },
  { name: 'Asset Panda', website: 'https://assetpanda.com', description: 'Asset tracking' },
  { name: 'ServiceNow', website: 'https://servicenow.com', description: 'IT service management' },
  { name: 'Fishbowl', website: 'https://fishbowlinventory.com', description: 'Inventory management' },
  { name: 'inFlow', website: 'https://inflowinventory.com', description: 'Inventory software' },
  { name: 'GitBook', website: 'https://gitbook.com', description: 'Documentation platform' },
  { name: 'ReadMe', website: 'https://readme.com', description: 'API documentation' },
  { name: 'Stoplight', website: 'https://stoplight.io', description: 'API design platform' },
  { name: 'Toggl', website: 'https://toggl.com', description: 'Time tracking' },
  { name: 'Harvest', website: 'https://getharvest.com', description: 'Time tracking' },
  { name: 'Clockify', website: 'https://clockify.me', description: 'Time tracking' },
  { name: 'RescueTime', website: 'https://rescuetime.com', description: 'Productivity tracking' },
  { name: 'FreshBooks', website: 'https://freshbooks.com', description: 'Invoicing software' },
  { name: 'Wave', website: 'https://waveapps.com', description: 'Financial software' },
  { name: '4K Video Downloader', website: 'https://4kdownload.com', description: 'Video downloader' },
  { name: 'ClipGrab', website: 'https://clipgrab.org', description: 'Video downloader' },
  { name: 'YouTube Premium', website: 'https://youtube.com/premium', description: 'YouTube subscription' },
  { name: 'Netflix', website: 'https://netflix.com', description: 'Streaming service' },
  { name: 'Amazon Prime', website: 'https://primevideo.com', description: 'Streaming service' },
  { name: 'Codacy', website: 'https://codacy.com', description: 'Code quality' },
  { name: 'CodeClimate', website: 'https://codeclimate.com', description: 'Code quality' },
  { name: 'Snyk Code', website: 'https://snyk.io', description: 'Security scanning' },
  { name: 'Checkmarx', website: 'https://checkmarx.com', description: 'Application security' },
  { name: 'Snyk', website: 'https://snyk.io', description: 'Security platform' },
  { name: 'Aqua Security', website: 'https://aquasec.com', description: 'Container security' },
  { name: 'Sketch', website: 'https://sketch.com', description: 'Design tool' },
  { name: 'Balsamiq', website: 'https://balsamiq.com', description: 'Wireframing tool' },
  { name: 'Docker Hub', website: 'https://hub.docker.com', description: 'Container registry' },
  { name: 'AWS ECR', website: 'https://aws.amazon.com/ecr', description: 'Container registry' },
  { name: 'Azure ACR', website: 'https://azure.microsoft.com/services/container-registry', description: 'Container registry' },
  { name: 'Disqus', website: 'https://disqus.com', description: 'Comment system' },
  { name: 'Facebook Comments', website: 'https://developers.facebook.com/docs/plugins/comments', description: 'Comment plugin' },
  { name: 'Anchor', website: 'https://anchor.fm', description: 'Podcast hosting' },
  { name: 'Buzzsprout', website: 'https://buzzsprout.com', description: 'Podcast hosting' },
  { name: 'Shoutcast', website: 'https://shoutcast.com', description: 'Internet radio' },
  { name: 'Icecast', website: 'https://icecast.org', description: 'Streaming server' },
  { name: 'Kafka', website: 'https://kafka.apache.org', description: 'Event streaming' },
  { name: 'AWS Kinesis', website: 'https://aws.amazon.com/kinesis', description: 'Data streaming' },
  { name: 'RabbitMQ', website: 'https://rabbitmq.com', description: 'Message broker' },
  { name: 'AWS SQS', website: 'https://aws.amazon.com/sqs', description: 'Message queue' },
  { name: 'Retool', website: 'https://retool.com', description: 'Internal tools builder' },
  { name: 'Appian', website: 'https://appian.com', description: 'Low-code platform' },
  { name: 'OutSystems', website: 'https://outsystems.com', description: 'Low-code platform' },
  { name: 'Airtable', website: 'https://airtable.com', description: 'Spreadsheet-database' },
  { name: 'Smartsheet', website: 'https://smartsheet.com', description: 'Work management' },
  { name: 'Salesforce', website: 'https://salesforce.com', description: 'CRM platform' },
  { name: 'HubSpot CRM', website: 'https://hubspot.com/products/crm', description: 'CRM software' },
  { name: 'Zoho CRM', website: 'https://zoho.com/crm', description: 'CRM software' },
  { name: 'Pipedrive', website: 'https://pipedrive.com', description: 'Sales CRM' },
  { name: 'Start.me', website: 'https://start.me', description: 'Start page' },
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
