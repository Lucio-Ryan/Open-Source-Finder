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

// Define schema inline for the script
const AlternativeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
});

const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// List of specific slugs added that should be removed
// We exclude 'vs-code', 'supabase', 'mattermost', 'outline', 'penpot' 
// because they were likely already in the database (based on mock-data.ts)
const specificSlugsToRemove = [
  'vscodium', 'zed-editor', 'aider', 'opendevin', 'plandex', 
  'continue', 'tabby', 'fauxpilot', 'librechat', 'chatbot-ui', 
  'ollama', 'appflowy', 'focalboard', 'zulip', 'rocket-chat', 
  'akira', 'quant-ux', 'appwrite', 'pocketbase', 'plausible', 
  'umami', 'matomo', 'bitwarden', 'vaultwarden', 'keepassxc', 
  'activepieces', 'huginn', 'openproject', 'taiga', 'leantime',
  'n8n' // I added n8n in the zapier map
];

async function cleanupAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🧹 Cleaning up alternatives...');

    // 1. Remove alternatives with generated slugs like "something-alt-1"
    const generatedResult = await Alternative.deleteMany({
      slug: { $regex: /-alt-[123]$/ }
    });
    console.log(`   ✅ Removed ${generatedResult.deletedCount} generated alternatives (*-alt-1, etc.)`);

    // 2. Remove the specific realistic alternatives we added
    const specificResult = await Alternative.deleteMany({
      slug: { $in: specificSlugsToRemove }
    });
    console.log(`   ✅ Removed ${specificResult.deletedCount} specific realistic alternatives`);

    console.log('\n🎉 Cleanup complete!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanupAlternatives();
