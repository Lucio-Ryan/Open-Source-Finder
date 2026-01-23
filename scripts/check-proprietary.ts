import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ProprietarySoftwareSchema = new mongoose.Schema({ name: String, slug: String });
const ProprietarySoftware = mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const searchTerms = ['slack', 'trello', 'notion', 'zoom', 'asana', 'jira', 'google', 'adobe', 'microsoft', 'dropbox', 'github', 'bitbucket', 'jenkins', 'mailchimp', 'lastpass', '1password', 'docker', 'firebase', 'datadog', 'stripe', 'salesforce', 'hubspot', 'typeform', 'zapier', 'airtable', 'shopify', 'zendesk', 'intercom', 'confluence', 'postman', 'algolia', 'auth0', 'twilio', 'sendgrid', 'calendly', 'toggl', 'miro', 'figma', 'photoshop', 'illustrator', 'premiere', 'davinci', 'plex', 'spotify', 'youtube', 'twitter', 'facebook', 'instagram', 'whatsapp', 'telegram'];
  
  for (const term of searchTerms) {
    const found = await ProprietarySoftware.find({ name: { $regex: term, $options: 'i' } }).select('name').lean();
    console.log(`${term}: ${found.map(f => f.name).join(', ') || 'NOT FOUND'}`);
  }
  
  await mongoose.disconnect();
}

check();
