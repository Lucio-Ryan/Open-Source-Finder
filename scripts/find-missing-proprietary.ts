import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ProprietarySoftwareSchema = new mongoose.Schema({ name: String, slug: String });
const ProprietarySoftware = mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get all unique alternative_to values from our data
const alternativeToValues = [
  'Slack', 'Microsoft Teams', 'Trello', 'Asana', 'Notion', 'Google Analytics',
  'Adobe Photoshop', 'Adobe Illustrator', 'DaVinci Resolve', 'Jira',
  'Zoom', 'WordPress', 'GitHub', 'Bitbucket', 'MongoDB Atlas', 'Redis',
  'Jenkins', 'Mailchimp', '1Password', 'LastPass', 'Confluence', 'Docker',
  'Kubernetes', 'Dropbox', 'Google Drive', 'Calendly', 'Toggl Track', 'Datadog',
  'Postman', 'Salesforce', 'HubSpot', 'Zapier', 'Typeform', 'Retool',
  'Airtable', 'Shopify', 'Teachable', 'Zendesk', 'Intercom', 'Algolia',
  'Elasticsearch', 'Firebase', 'LaunchDarkly', 'Auth0', 'Statuspage.io',
  'HashiCorp Vault', 'DocuSign', 'FreshBooks', 'Plex', 'Bitly', 'Raindrop.io',
  'Pocket', 'Miro', 'Lucidchart', 'Mint', 'YNAB', 'Feedly', 'SmartThings',
  'Google Photos', 'Disqus', 'Linktree', 'Loom', 'Grammarly', 'Vercel',
  'Netlify', 'ChatGPT', 'OpenAI', 'Pinecone', 'Unity', 'Unreal Engine',
  'iTerm2', 'VS Code', 'Ableton Live', 'Maya', 'AutoCAD', 'NordVPN',
  'ExpressVPN', 'Backblaze', 'Pi-hole', 'Nginx', 'ProtonMail', 'Gmail',
  'Homer', 'Snagit', 'Kong', 'RabbitMQ', 'Amazon SQS', 'AWS Lambda',
  'Terraform', 'Istio', 'PagerDuty', 'Tableau', 'Looker', 'Metabase',
  'OBS', 'Twitch', 'YouTube', 'Spotify', 'WhatsApp', 'Signal', 'Telegram',
  'Twitter', 'Facebook', 'Instagram', 'Medium', 'Substack', 'Ghost',
  'Stripe', 'PayPal', 'Google Ads', 'Google Forms', 'SurveyMonkey',
  'Calendly', 'Doodle', 'Harvest', 'Clockify', 'Notion', 'Obsidian',
  'Apple Notes', 'Bear', 'Ulysses', 'iA Writer', 'Scrivener',
  'Evernote', 'OneNote', 'Google Keep', 'Todoist', 'Things 3',
  'TickTick', 'Remember The Milk', 'Any.do', 'OmniFocus',
  'Readwise', 'Instapaper', 'Flipboard', 'Anchor', 'Transistor',
  'SquareSpace', 'Wix', 'Weebly', 'Carrd', 'Google Sites',
  'Webflow', 'Bubble', 'Adalo', 'Glide', 'Thunkable',
  'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Zeplin', 'Avocode',
  'Abstract', 'Maze', 'UserTesting', 'Lookback', 'Optimal Workshop',
  'Hotjar', 'FullStory', 'Mixpanel', 'Amplitude', 'Heap',
  'Segment', 'Customer.io', 'Braze', 'Iterable', 'Klaviyo',
  'ActiveCampaign', 'ConvertKit', 'Drip', 'AWeber', 'GetResponse',
  'Sendinblue', 'SendGrid', 'Mailgun', 'Postmark', 'Amazon SES',
  'Twilio', 'MessageBird', 'Plivo', 'Vonage', 'Bandwidth',
  'Stripe Atlas', 'Firstbase', 'Clerky', 'Gust', 'AngelList',
  'Carta', 'Pulley', 'EquityEffect', 'Eqvista', 'Capshare',
  'CircleCI', 'Travis CI', 'TeamCity', 'Bamboo', 'Drone',
  'Semaphore', 'Buildkite', 'Codefresh', 'Harness', 'Spinnaker',
  'Argo CD', 'Flux', 'JenkinsX', 'Tekton', 'GoCD',
  'SonarQube', 'Codacy', 'CodeClimate', 'Snyk', 'Dependabot',
  'Renovate', 'Greenkeeper', 'WhiteSource', 'BlackDuck', 'Veracode',
  'Splunk', 'Elastic Stack', 'Sumo Logic', 'Logz.io', 'Loggly',
  'Papertrail', 'Logentries', 'Timber', 'Vector', 'Loki',
  'Prometheus', 'Grafana Cloud', 'InfluxDB', 'Wavefront', 'AppDynamics',
  'Dynatrace', 'New Relic', 'Sentry', 'Rollbar', 'Bugsnag',
  'Raygun', 'Airbrake', 'Honeybadger', 'TrackJS', 'LogRocket',
  'Storybook', 'Chromatic', 'Percy', 'Applitools', 'LambdaTest',
  'BrowserStack', 'Sauce Labs', 'CrossBrowserTesting', 'Ghost Inspector', 'Cypress Dashboard',
  'PlanetScale', 'CockroachDB', 'TiDB', 'YugabyteDB', 'FaunaDB',
  'DynamoDB', 'Cosmos DB', 'Cassandra', 'ScyllaDB', 'ArangoDB',
  'ClickHouse', 'Snowflake', 'BigQuery', 'Redshift', 'Databricks',
  'dbt Cloud', 'Fivetran', 'Stitch', 'Airbyte Cloud', 'Hevo',
  'Tray.io', 'Workato', 'Celigo', 'SnapLogic', 'Boomi',
  'Mulesoft', 'Talend', 'Informatica', 'Matillion', 'Rivery',
  'Magic.link', 'Resume.io', 'Inventory Cloud', 'Anylist', 'Paprika',
  'Samsara', 'Yodeck', 'PRTG', 'SolarWinds', 'Nagios',
  'Google Sheets', 'Microsoft Excel', 'Microsoft Office', 'Google Docs',
  'PowerPoint', 'Keynote', 'Prezi', 'MindMeister', 'XMind',
  'TeamViewer', 'AnyDesk', 'WeTransfer', 'AirDrop',
  'QR Code Generator', 'Barcode Generator', 'Google Calendar', 'Google Contacts',
  'Speedtest.net', 'Pastebin.com', 'GitHub Gist', 'CodePen', 'CodeSandbox',
  'Changelogify', 'Paid SSL', 'AWS Certificate Manager',
  'pfSense', 'Route53', 'Cloudflare DNS', 'Active Directory',
  'Neo4j', 'Apache Kafka', 'ngrok', 'uTorrent', 'JDownloader',
  'Google Maps', 'Canny', 'UserVoice'
];

async function findMissing() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const allProp = await ProprietarySoftware.find().select('name slug').lean();
  const propNames = new Set(allProp.map(p => p.name.toLowerCase()));
  const propSlugs = new Set(allProp.map(p => p.slug));
  
  console.log('Missing proprietary software:\n');
  const missing: string[] = [];
  
  for (const name of alternativeToValues) {
    const lowerName = name.toLowerCase();
    const slug = createSlug(name);
    const simplified = lowerName.replace(/[^a-z0-9]/g, '');
    
    if (!propNames.has(lowerName) && !propSlugs.has(slug)) {
      // Also check simplified
      let found = false;
      for (const pName of propNames) {
        if (pName.replace(/[^a-z0-9]/g, '') === simplified) {
          found = true;
          break;
        }
      }
      if (!found) {
        missing.push(name);
      }
    }
  }
  
  const unique = [...new Set(missing)].sort();
  unique.forEach(n => console.log(`  '${n}'`));
  console.log(`\nTotal missing: ${unique.length}`);
  
  await mongoose.disconnect();
}

findMissing();
