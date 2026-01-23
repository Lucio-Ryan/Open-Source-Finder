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

const moreProprietary = [
  // Databases
  { name: 'MySQL', website: 'https://mysql.com', description: 'Open-source relational database' },
  { name: 'SQLite', website: 'https://sqlite.org', description: 'Lightweight embedded database' },
  
  // Code Search
  { name: 'GitHub Code Search', website: 'https://github.com/search', description: 'Code search on GitHub' },
  
  // Social Media Management
  { name: 'Buffer', website: 'https://buffer.com', description: 'Social media management platform' },
  { name: 'Hootsuite', website: 'https://hootsuite.com', description: 'Social media management' },
  
  // Notifications
  { name: 'OneSignal', website: 'https://onesignal.com', description: 'Push notification service' },
  { name: 'Pushover', website: 'https://pushover.net', description: 'Push notification service' },
  { name: 'Pusher', website: 'https://pusher.com', description: 'Real-time messaging' },
  
  // AI Image Generation
  { name: 'Midjourney', website: 'https://midjourney.com', description: 'AI image generation' },
  { name: 'DALL-E', website: 'https://openai.com/dall-e', description: 'AI image generation by OpenAI' },
  
  // Music
  { name: 'Sibelius', website: 'https://avid.com/sibelius', description: 'Music notation software' },
  { name: 'Finale', website: 'https://finalemusic.com', description: 'Music notation software' },
  
  // Email
  { name: 'Outlook', website: 'https://outlook.com', description: 'Email client by Microsoft' },
  
  // AWS Services
  { name: 'AWS API Gateway', website: 'https://aws.amazon.com/api-gateway', description: 'API management service' },
  { name: 'AWS CloudWatch Events', website: 'https://aws.amazon.com/cloudwatch', description: 'AWS event monitoring' },
  { name: 'AWS Step Functions', website: 'https://aws.amazon.com/step-functions', description: 'Workflow orchestration' },
  { name: 'AWS S3 Console', website: 'https://aws.amazon.com/s3', description: 'S3 management console' },
  
  // CDN/Edge
  { name: 'Fastly', website: 'https://fastly.com', description: 'Edge cloud platform' },
  
  // Web Scraping
  { name: 'Selenium', website: 'https://selenium.dev', description: 'Browser automation framework' },
  
  // PDF
  { name: 'DocRaptor', website: 'https://docraptor.com', description: 'PDF generation API' },
  { name: 'PDFShift', website: 'https://pdfshift.io', description: 'HTML to PDF API' },
  
  // Testing
  { name: 'Cypress', website: 'https://cypress.io', description: 'JavaScript end-to-end testing' },
  { name: 'Jest', website: 'https://jestjs.io', description: 'JavaScript testing framework' },
  { name: 'LoadRunner', website: 'https://microfocus.com/loadrunner', description: 'Performance testing tool' },
  { name: 'JMeter', website: 'https://jmeter.apache.org', description: 'Load testing tool' },
  
  // Mocking
  { name: 'Mockoon', website: 'https://mockoon.com', description: 'Mock API server' },
  { name: 'Postman Mock', website: 'https://postman.com', description: 'API mock servers' },
  { name: 'Stoplight', website: 'https://stoplight.io', description: 'API design and documentation' },
  
  // Schema Registry
  { name: 'Confluent Schema Registry', website: 'https://confluent.io', description: 'Schema management for Kafka' },
  
  // Documentation
  { name: 'GitBook', website: 'https://gitbook.com', description: 'Documentation platform' },
  { name: 'ReadMe', website: 'https://readme.com', description: 'API documentation platform' },
  { name: 'Postman Docs', website: 'https://postman.com', description: 'API documentation' },
  
  // UI Tools
  { name: 'Chromatic', website: 'https://chromatic.com', description: 'Visual testing for Storybook' },
  { name: 'Bit', website: 'https://bit.dev', description: 'Component-driven development' },
  
  // Browser Extensions
  { name: 'Chrome Extension API', website: 'https://developer.chrome.com/extensions', description: 'Chrome extension development' },
  
  // Form Libraries
  { name: 'Formik', website: 'https://formik.org', description: 'React forms library' },
  { name: 'Yup', website: 'https://github.com/jquense/yup', description: 'Schema validation' },
  { name: 'Joi', website: 'https://joi.dev', description: 'Schema validation' },
  
  // State Management
  { name: 'Redux', website: 'https://redux.js.org', description: 'State management for JavaScript' },
  { name: 'Recoil', website: 'https://recoiljs.org', description: 'State management for React' },
  { name: 'Vuex', website: 'https://vuex.vuejs.org', description: 'State management for Vue' },
  
  // CSS
  { name: 'Tailwind CSS', website: 'https://tailwindcss.com', description: 'Utility-first CSS framework' },
  { name: 'CSS Variables', website: 'https://developer.mozilla.org/CSS_Variables', description: 'Native CSS custom properties' },
  { name: 'Bootstrap', website: 'https://getbootstrap.com', description: 'CSS framework' },
  
  // UI Libraries
  { name: 'Material UI', website: 'https://mui.com', description: 'React component library' },
  { name: 'Radix UI', website: 'https://radix-ui.com', description: 'Unstyled React components' },
  
  // Animation
  { name: 'Framer Motion', website: 'https://framer.com/motion', description: 'React animation library' },
  { name: 'After Effects', website: 'https://adobe.com/aftereffects', description: 'Motion graphics software' },
  
  // Charts
  { name: 'Highcharts', website: 'https://highcharts.com', description: 'JavaScript charting library' },
  { name: 'Chart.js', website: 'https://chartjs.org', description: 'JavaScript charting library' },
  { name: 'D3.js', website: 'https://d3js.org', description: 'Data visualization library' },
  
  // Tables
  { name: 'AG Grid', website: 'https://ag-grid.com', description: 'JavaScript data grid' },
  
  // Rich Text
  { name: 'TinyMCE', website: 'https://tiny.cloud', description: 'Rich text editor' },
  { name: 'CKEditor', website: 'https://ckeditor.com', description: 'Rich text editor' },
  { name: 'Draft.js', website: 'https://draftjs.org', description: 'React rich text framework' },
  { name: 'Medium Editor', website: 'https://yabwe.github.io/medium-editor', description: 'Medium-style editor' },
  
  // Markdown
  { name: 'Typora', website: 'https://typora.io', description: 'Markdown editor' },
  
  // Git GUIs
  { name: 'GitKraken', website: 'https://gitkraken.com', description: 'Git GUI client' },
  { name: 'SourceTree', website: 'https://sourcetreeapp.com', description: 'Git GUI by Atlassian' },
  
  // Database GUIs
  { name: 'RedisInsight', website: 'https://redis.com/redis-enterprise/redis-insight', description: 'Redis GUI' },
  { name: 'MongoDB Compass', website: 'https://mongodb.com/compass', description: 'MongoDB GUI' },
  
  // Container Management
  { name: 'Lens', website: 'https://k8slens.dev', description: 'Kubernetes IDE' },
  
  // Security
  { name: 'Burp Suite', website: 'https://portswigger.net/burp', description: 'Web security testing' },
  
  // Email Testing
  { name: 'Mailtrap', website: 'https://mailtrap.io', description: 'Email testing service' },
  
  // Marketing
  { name: 'LaunchRock', website: 'https://launchrock.com', description: 'Launch page builder' },
  { name: 'Impact', website: 'https://impact.com', description: 'Partnership management' },
  { name: 'Shopify Gift Cards', website: 'https://shopify.com', description: 'Gift card service' },
  
  // CLI
  { name: 'Commander.js', website: 'https://github.com/tj/commander.js', description: 'Node.js CLI framework' },
  { name: 'Blessed', website: 'https://github.com/chjj/blessed', description: 'Terminal UI library' },
  { name: 'ncurses', website: 'https://invisible-island.net/ncurses', description: 'Terminal UI library' },
  
  // Auth
  { name: 'Google Authenticator', website: 'https://google.com/landing/2step', description: '2FA app by Google' },
  { name: 'Authy', website: 'https://authy.com', description: '2FA application' },
  
  // Additional common ones
  { name: 'Splunk', website: 'https://splunk.com', description: 'Data platform for security and observability' },
  { name: 'Lightroom', website: 'https://adobe.com/lightroom', description: 'Photo editing software' },
  { name: 'Reddit', website: 'https://reddit.com', description: 'Social news aggregation' },
  { name: 'Atom', website: 'https://atom.io', description: 'Text editor by GitHub' },
  { name: 'Pingdom', website: 'https://pingdom.com', description: 'Website monitoring service' },
];

async function seedMore() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🚀 Seeding more proprietary software...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const software of moreProprietary) {
      try {
        const slug = createSlug(software.name);
        
        const existing = await ProprietarySoftware.findOne({ 
          $or: [
            { slug },
            { name: { $regex: `^${software.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
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

seedMore();
