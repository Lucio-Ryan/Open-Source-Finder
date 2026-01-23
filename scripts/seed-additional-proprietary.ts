import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  created_at: { type: Date, default: Date.now }
});

const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const additionalProprietarySoftware = [
  // AI & ML
  { name: 'ChatGPT', website: 'https://chat.openai.com', description: 'AI chatbot by OpenAI' },
  { name: 'OpenAI', website: 'https://openai.com', description: 'AI research company' },
  { name: 'Pinecone', website: 'https://pinecone.io', description: 'Vector database for AI' },
  
  // Development Tools
  { name: 'GitHub', website: 'https://github.com', description: 'Software development platform' },
  { name: 'Docker', website: 'https://docker.com', description: 'Container platform' },
  { name: 'HashiCorp Vault', website: 'https://hashicorp.com/products/vault', description: 'Secrets management' },
  
  // CI/CD
  { name: 'Travis CI', website: 'https://travis-ci.com', description: 'Continuous integration service' },
  { name: 'TeamCity', website: 'https://jetbrains.com/teamcity', description: 'CI/CD by JetBrains' },
  { name: 'Bamboo', website: 'https://atlassian.com/software/bamboo', description: 'CI/CD by Atlassian' },
  { name: 'Drone', website: 'https://drone.io', description: 'Container-native CI/CD' },
  { name: 'Semaphore', website: 'https://semaphoreci.com', description: 'Fast CI/CD platform' },
  { name: 'Buildkite', website: 'https://buildkite.com', description: 'CI/CD for any scale' },
  { name: 'Codefresh', website: 'https://codefresh.io', description: 'GitOps CI/CD platform' },
  { name: 'Harness', website: 'https://harness.io', description: 'Software delivery platform' },
  { name: 'Spinnaker', website: 'https://spinnaker.io', description: 'Multi-cloud CD platform' },
  { name: 'Argo CD', website: 'https://argoproj.github.io/cd', description: 'Declarative GitOps CD' },
  { name: 'Flux', website: 'https://fluxcd.io', description: 'GitOps for Kubernetes' },
  { name: 'JenkinsX', website: 'https://jenkins-x.io', description: 'CI/CD for Kubernetes' },
  { name: 'Tekton', website: 'https://tekton.dev', description: 'Cloud-native CI/CD' },
  { name: 'GoCD', website: 'https://gocd.org', description: 'Open source CD server' },
  
  // Security
  { name: 'SonarQube', website: 'https://sonarqube.org', description: 'Code quality platform' },
  { name: 'Codacy', website: 'https://codacy.com', description: 'Automated code review' },
  { name: 'CodeClimate', website: 'https://codeclimate.com', description: 'Code quality analysis' },
  { name: 'Snyk', website: 'https://snyk.io', description: 'Developer security platform' },
  { name: 'Dependabot', website: 'https://github.com/dependabot', description: 'Automated dependency updates' },
  { name: 'Renovate', website: 'https://renovatebot.com', description: 'Automated dependency updates' },
  { name: 'WhiteSource', website: 'https://whitesourcesoftware.com', description: 'Open source security' },
  { name: 'BlackDuck', website: 'https://blackducksoftware.com', description: 'Open source security' },
  { name: 'Veracode', website: 'https://veracode.com', description: 'Application security testing' },
  
  // Logging & Monitoring
  { name: 'Prometheus', website: 'https://prometheus.io', description: 'Monitoring system' },
  { name: 'Grafana Cloud', website: 'https://grafana.com/products/cloud', description: 'Observability platform' },
  { name: 'Elastic Stack', website: 'https://elastic.co/elastic-stack', description: 'Search and analytics' },
  { name: 'Sumo Logic', website: 'https://sumologic.com', description: 'Cloud monitoring' },
  { name: 'Logz.io', website: 'https://logz.io', description: 'Observability platform' },
  { name: 'Loggly', website: 'https://loggly.com', description: 'Log management' },
  { name: 'Papertrail', website: 'https://papertrailapp.com', description: 'Log management' },
  { name: 'Timber', website: 'https://timber.io', description: 'Log management' },
  { name: 'Loki', website: 'https://grafana.com/oss/loki', description: 'Log aggregation' },
  { name: 'Vector', website: 'https://vector.dev', description: 'Observability data pipeline' },
  
  // APM & Error Tracking
  { name: 'Sentry', website: 'https://sentry.io', description: 'Error tracking platform' },
  { name: 'Rollbar', website: 'https://rollbar.com', description: 'Error monitoring' },
  { name: 'Bugsnag', website: 'https://bugsnag.com', description: 'Error monitoring' },
  { name: 'Raygun', website: 'https://raygun.com', description: 'Error and performance monitoring' },
  { name: 'Airbrake', website: 'https://airbrake.io', description: 'Error monitoring' },
  { name: 'Honeybadger', website: 'https://honeybadger.io', description: 'Error and uptime monitoring' },
  { name: 'TrackJS', website: 'https://trackjs.com', description: 'JavaScript error tracking' },
  { name: 'AppDynamics', website: 'https://appdynamics.com', description: 'Application performance monitoring' },
  { name: 'Dynatrace', website: 'https://dynatrace.com', description: 'Software intelligence platform' },
  { name: 'Wavefront', website: 'https://tanzu.vmware.com/wavefront', description: 'Observability platform' },
  
  // Testing
  { name: 'BrowserStack', website: 'https://browserstack.com', description: 'Cross-browser testing' },
  { name: 'Sauce Labs', website: 'https://saucelabs.com', description: 'Cross-browser testing' },
  { name: 'LambdaTest', website: 'https://lambdatest.com', description: 'Cross-browser testing' },
  { name: 'CrossBrowserTesting', website: 'https://crossbrowsertesting.com', description: 'Cross-browser testing' },
  { name: 'Ghost Inspector', website: 'https://ghostinspector.com', description: 'Automated browser testing' },
  { name: 'Cypress Dashboard', website: 'https://cypress.io/dashboard', description: 'Test dashboard' },
  { name: 'Storybook', website: 'https://storybook.js.org', description: 'UI component explorer' },
  { name: 'Chromatic', website: 'https://chromatic.com', description: 'Visual testing platform' },
  { name: 'Percy', website: 'https://percy.io', description: 'Visual testing platform' },
  { name: 'Applitools', website: 'https://applitools.com', description: 'Visual AI testing' },
  
  // User Research
  { name: 'UserTesting', website: 'https://usertesting.com', description: 'User research platform' },
  { name: 'Lookback', website: 'https://lookback.io', description: 'User research software' },
  { name: 'Maze', website: 'https://maze.co', description: 'User testing platform' },
  { name: 'Optimal Workshop', website: 'https://optimalworkshop.com', description: 'UX research tools' },
  
  // Design
  { name: 'Zeplin', website: 'https://zeplin.io', description: 'Design handoff tool' },
  { name: 'Avocode', website: 'https://avocode.com', description: 'Design handoff tool' },
  { name: 'Abstract', website: 'https://abstract.com', description: 'Design version control' },
  
  // Databases
  { name: 'CockroachDB', website: 'https://cockroachlabs.com', description: 'Distributed SQL database' },
  { name: 'TiDB', website: 'https://pingcap.com/tidb', description: 'Distributed SQL database' },
  { name: 'YugabyteDB', website: 'https://yugabyte.com', description: 'Distributed SQL database' },
  { name: 'FaunaDB', website: 'https://fauna.com', description: 'Serverless database' },
  { name: 'DynamoDB', website: 'https://aws.amazon.com/dynamodb', description: 'NoSQL database by AWS' },
  { name: 'Cosmos DB', website: 'https://azure.microsoft.com/products/cosmos-db', description: 'NoSQL database by Azure' },
  { name: 'Cassandra', website: 'https://cassandra.apache.org', description: 'Distributed NoSQL database' },
  { name: 'ScyllaDB', website: 'https://scylladb.com', description: 'High-performance NoSQL database' },
  { name: 'ArangoDB', website: 'https://arangodb.com', description: 'Multi-model database' },
  { name: 'ClickHouse', website: 'https://clickhouse.com', description: 'OLAP database' },
  
  // Data Warehousing
  { name: 'Snowflake', website: 'https://snowflake.com', description: 'Cloud data platform' },
  { name: 'BigQuery', website: 'https://cloud.google.com/bigquery', description: 'Data warehouse by Google' },
  { name: 'Redshift', website: 'https://aws.amazon.com/redshift', description: 'Data warehouse by AWS' },
  { name: 'Databricks', website: 'https://databricks.com', description: 'Data and AI platform' },
  { name: 'dbt Cloud', website: 'https://getdbt.com', description: 'Data transformation tool' },
  
  // Data Integration
  { name: 'Fivetran', website: 'https://fivetran.com', description: 'Automated data integration' },
  { name: 'Stitch', website: 'https://stitchdata.com', description: 'Data pipeline service' },
  { name: 'Airbyte Cloud', website: 'https://airbyte.com', description: 'Data integration platform' },
  { name: 'Hevo', website: 'https://hevodata.com', description: 'No-code data pipeline' },
  { name: 'Tray.io', website: 'https://tray.io', description: 'General automation platform' },
  { name: 'Workato', website: 'https://workato.com', description: 'Enterprise automation' },
  { name: 'Celigo', website: 'https://celigo.com', description: 'Integration platform' },
  { name: 'SnapLogic', website: 'https://snaplogic.com', description: 'Integration platform' },
  { name: 'Boomi', website: 'https://boomi.com', description: 'Integration platform' },
  { name: 'Mulesoft', website: 'https://mulesoft.com', description: 'Integration platform' },
  { name: 'Talend', website: 'https://talend.com', description: 'Data integration platform' },
  { name: 'Informatica', website: 'https://informatica.com', description: 'Data management platform' },
  { name: 'Rivery', website: 'https://rivery.io', description: 'Data operations platform' },
  
  // Email & Marketing
  { name: 'Iterable', website: 'https://iterable.com', description: 'Cross-channel marketing' },
  { name: 'Drip', website: 'https://drip.com', description: 'E-commerce marketing automation' },
  { name: 'AWeber', website: 'https://aweber.com', description: 'Email marketing' },
  { name: 'GetResponse', website: 'https://getresponse.com', description: 'Email marketing platform' },
  { name: 'Amazon SES', website: 'https://aws.amazon.com/ses', description: 'Email service by AWS' },
  
  // Communication
  { name: 'Plivo', website: 'https://plivo.com', description: 'Cloud communications platform' },
  { name: 'Vonage', website: 'https://vonage.com', description: 'Communications APIs' },
  { name: 'MessageBird', website: 'https://messagebird.com', description: 'Omnichannel communications' },
  { name: 'Bandwidth', website: 'https://bandwidth.com', description: 'Communications platform' },
  { name: 'RabbitMQ', website: 'https://rabbitmq.com', description: 'Message broker' },
  
  // Note-taking & Writing
  { name: 'Obsidian', website: 'https://obsidian.md', description: 'Knowledge management app' },
  { name: 'Bear', website: 'https://bear.app', description: 'Writing app for Apple devices' },
  { name: 'Ulysses', website: 'https://ulysses.app', description: 'Writing app' },
  { name: 'iA Writer', website: 'https://ia.net/writer', description: 'Distraction-free writing' },
  { name: 'Todoist', website: 'https://todoist.com', description: 'Task management app' },
  { name: 'Things 3', website: 'https://culturedcode.com/things', description: 'Task manager for Apple' },
  { name: 'OmniFocus', website: 'https://omnigroup.com/omnifocus', description: 'Task management' },
  { name: 'Remember The Milk', website: 'https://rememberthemilk.com', description: 'Task management' },
  { name: 'Readwise', website: 'https://readwise.io', description: 'Reading highlights manager' },
  { name: 'Flipboard', website: 'https://flipboard.com', description: 'News aggregator' },
  
  // Website Builders
  { name: 'SquareSpace', website: 'https://squarespace.com', description: 'Website builder' },
  { name: 'Wix', website: 'https://wix.com', description: 'Website builder' },
  { name: 'Google Sites', website: 'https://sites.google.com', description: 'Website builder by Google' },
  { name: 'Adalo', website: 'https://adalo.com', description: 'No-code app builder' },
  { name: 'Glide', website: 'https://glideapps.com', description: 'No-code app builder' },
  { name: 'Thunkable', website: 'https://thunkable.com', description: 'No-code app builder' },
  
  // Startup Tools
  { name: 'Stripe Atlas', website: 'https://stripe.com/atlas', description: 'Startup incorporation' },
  { name: 'Firstbase', website: 'https://firstbase.io', description: 'Company formation' },
  { name: 'Clerky', website: 'https://clerky.com', description: 'Legal documents for startups' },
  { name: 'Gust', website: 'https://gust.com', description: 'Startup funding platform' },
  { name: 'Carta', website: 'https://carta.com', description: 'Equity management' },
  { name: 'Pulley', website: 'https://pulley.com', description: 'Equity management' },
  { name: 'Capshare', website: 'https://capshare.com', description: 'Equity management' },
  { name: 'Eqvista', website: 'https://eqvista.com', description: 'Equity management' },
  { name: 'EquityEffect', website: 'https://equityeffect.com', description: 'Equity management' },
  
  // Other
  { name: 'OBS', website: 'https://obsproject.com', description: 'Open Broadcaster Software' },
  { name: 'Twitter', website: 'https://twitter.com', description: 'Social media platform' },
  { name: 'Metabase', website: 'https://metabase.com', description: 'Business intelligence tool' },
  { name: 'Homer', website: 'https://homer-demo.netlify.app', description: 'Dashboard homepage' },
  { name: 'ProtonMail', website: 'https://proton.me/mail', description: 'Secure email service' },
  { name: 'Maya', website: 'https://autodesk.com/products/maya', description: '3D animation software' },
  { name: 'AutoCAD', website: 'https://autodesk.com/products/autocad', description: 'CAD software' },
  { name: 'Istio', website: 'https://istio.io', description: 'Service mesh' },
  { name: 'Google Ads', website: 'https://ads.google.com', description: 'Advertising platform' },
  { name: 'AWS Lambda', website: 'https://aws.amazon.com/lambda', description: 'Serverless compute by AWS' },
  { name: 'Greenkeeper', website: 'https://greenkeeper.io', description: 'Automated dependency updates' },
  { name: 'Logentries', website: 'https://logentries.com', description: 'Log management' },
];

async function seedAdditional() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🚀 Seeding additional proprietary software...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const software of additionalProprietarySoftware) {
      try {
        const slug = createSlug(software.name);
        
        const existing = await ProprietarySoftware.findOne({ 
          $or: [
            { slug },
            { name: { $regex: `^${software.name}$`, $options: 'i' } }
          ]
        });
        
        if (existing) {
          skippedCount++;
          continue;
        }
        
        await ProprietarySoftware.create({
          name: software.name,
          slug,
          description: software.description,
          website: software.website,
        });
        
        addedCount++;
        process.stdout.write(`\r   Added ${addedCount} proprietary software (${skippedCount} skipped)`);
      } catch (err: any) {
        if (err.code === 11000) {
          skippedCount++;
        } else {
          console.error(`\n   ❌ Error adding ${software.name}:`, err.message);
        }
      }
    }

    console.log(`\n✅ Seeded ${addedCount} proprietary software (${skippedCount} already existed)`);
    console.log('\n🎉 Done!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedAdditional();
