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

const realisticAlternatives: Record<string, any[]> = {
  'cursor': [
    { name: 'VS Code', slug: 'vs-code', description: 'Powerful open-source code editor', website: 'https://code.visualstudio.com', github: 'https://github.com/microsoft/vscode' },
    { name: 'VSCodium', slug: 'vscodium', description: 'Free/Libre Open Source Software Binaries of VS Code', website: 'https://vscodium.com', github: 'https://github.com/VSCodium/vscodium' },
    { name: 'Zed', slug: 'zed-editor', description: 'High-performance, multiplayer code editor', website: 'https://zed.dev', github: 'https://github.com/zed-industries/zed' }
  ],
  'claude-code': [
    { name: 'Aider', slug: 'aider', description: 'AI pair programming in your terminal', website: 'https://aider.chat', github: 'https://github.com/paul-gauthier/aider' },
    { name: 'OpenDevin', slug: 'opendevin', description: 'An autonomous AI software engineer', website: 'https://github.com/OpenDevin/OpenDevin', github: 'https://github.com/OpenDevin/OpenDevin' },
    { name: 'Plandex', slug: 'plandex', description: 'AI coding agent for complex tasks', website: 'https://plandex.ai', github: 'https://github.com/plandex-ai/plandex' }
  ],
  'github-copilot': [
    { name: 'Continue', slug: 'continue', description: 'Open-source autopilot for VS Code and JetBrains', website: 'https://continue.dev', github: 'https://github.com/continuedev/continue' },
    { name: 'Tabby', slug: 'tabby', description: 'Self-hosted AI coding assistant', website: 'https://tabby.alphal.ai', github: 'https://github.com/TabbyML/tabby' },
    { name: 'Fauxpilot', slug: 'fauxpilot', description: 'Open-source GitHub Copilot alternative', website: 'https://github.com/fauxpilot/fauxpilot', github: 'https://github.com/fauxpilot/fauxpilot' }
  ],
  'chatgpt': [
    { name: 'LibreChat', slug: 'librechat', description: 'Enhanced ChatGPT Clone with multiple AI models', website: 'https://librechat.ai', github: 'https://github.com/danny-avila/LibreChat' },
    { name: 'Chatbot UI', slug: 'chatbot-ui', description: 'An open source ChatGPT UI', website: 'https://chatbotui.com', github: 'https://github.com/mckaywrigley/chatbot-ui' },
    { name: 'Ollama', slug: 'ollama', description: 'Run large language models locally', website: 'https://ollama.ai', github: 'https://github.com/ollama/ollama' }
  ],
  'notion': [
    { name: 'AppFlowy', slug: 'appflowy', description: 'The open-source alternative to Notion', website: 'https://appflowy.io', github: 'https://github.com/AppFlowy-IO/AppFlowy' },
    { name: 'Outline', slug: 'outline', description: 'Fast, collaborative knowledge base for teams', website: 'https://getoutline.com', github: 'https://github.com/outline/outline' },
    { name: 'Focalboard', slug: 'focalboard', description: 'Open source alternative to Trello, Notion, and Asana', website: 'https://focalboard.com', github: 'https://github.com/mattermost/focalboard' }
  ],
  'slack': [
    { name: 'Mattermost', slug: 'mattermost', description: 'Open source platform for secure team collaboration', website: 'https://mattermost.com', github: 'https://github.com/mattermost/mattermost-server' },
    { name: 'Zulip', slug: 'zulip', description: 'Powerful open source team chat', website: 'https://zulip.com', github: 'https://github.com/zulip/zulip' },
    { name: 'Rocket.Chat', slug: 'rocket-chat', description: 'The ultimate communication hub', website: 'https://rocket.chat', github: 'https://github.com/RocketChat/Rocket.Chat' }
  ],
  'figma': [
    { name: 'Penpot', slug: 'penpot', description: 'Open source design and prototyping platform', website: 'https://penpot.app', github: 'https://github.com/penpot/penpot' },
    { name: 'Akira', slug: 'akira', description: 'Native Linux Design application built in Vala and GTK', website: 'https://github.com/Akar-Studio/Akira', github: 'https://github.com/Akar-Studio/Akira' },
    { name: 'Quant-UX', slug: 'quant-ux', description: 'Integrated design, prototyping and user testing tool', website: 'https://quant-ux.com', github: 'https://github.com/quant-ux/quant-ux' }
  ],
  'firebase': [
    { name: 'Supabase', slug: 'supabase', description: 'The open source Firebase alternative', website: 'https://supabase.com', github: 'https://github.com/supabase/supabase' },
    { name: 'Appwrite', slug: 'appwrite', description: 'Secure open-source backend for web & mobile developers', website: 'https://appwrite.io', github: 'https://github.com/appwrite/appwrite' },
    { name: 'PocketBase', slug: 'pocketbase', description: 'Open source realtime backend in 1 file', website: 'https://pocketbase.io', github: 'https://github.com/pocketbase/pocketbase' }
  ],
  'google-analytics': [
    { name: 'Plausible', slug: 'plausible', description: 'Simple, privacy-friendly Google Analytics alternative', website: 'https://plausible.io', github: 'https://github.com/plausible/analytics' },
    { name: 'Umami', slug: 'umami', description: 'Simple, easy to use, self-hosted web analytics', website: 'https://umami.is', github: 'https://github.com/umami-software/umami' },
    { name: 'Matomo', slug: 'matomo', description: 'The leading open-source web analytics platform', website: 'https://matomo.org', github: 'https://github.com/matomo-org/matomo' }
  ],
  '1password': [
    { name: 'Bitwarden', slug: 'bitwarden', description: 'Open source password management solutions', website: 'https://bitwarden.com', github: 'https://github.com/bitwarden/server' },
    { name: 'Vaultwarden', slug: 'vaultwarden', description: 'Unbalanced Bitwarden server implementation in Rust', website: 'https://github.com/dani-garcia/vaultwarden', github: 'https://github.com/dani-garcia/vaultwarden' },
    { name: 'KeePassXC', slug: 'keepassxc', description: 'Offline password manager for everyone', website: 'https://keepassxc.org', github: 'https://github.com/keepassxreboot/keepassxc' }
  ],
  'zapier': [
    { name: 'n8n', slug: 'n8n', description: 'Extensible workflow automation tool', website: 'https://n8n.io', github: 'https://github.com/n8n-io/n8n' },
    { name: 'Activepieces', slug: 'activepieces', description: 'Open source no-code business automation', website: 'https://activepieces.com', github: 'https://github.com/activepieces/activepieces' },
    { name: 'Huginn', slug: 'huginn', description: 'Create agents that monitor and act on your behalf', website: 'https://github.com/huginn/huginn', github: 'https://github.com/huginn/huginn' }
  ],
  'jira': [
    { name: 'OpenProject', slug: 'openproject', description: 'The leading open source project management software', website: 'https://openproject.org', github: 'https://github.com/opf/openproject' },
    { name: 'Taiga', slug: 'taiga', description: 'Open source project management platform', website: 'https://taiga.io', github: 'https://github.com/taigaio/taiga-back' },
    { name: 'Leantime', slug: 'leantime', description: 'Strategic project management for non-project managers', website: 'https://leantime.io', github: 'https://github.com/leantime/leantime' }
  ]
};

async function seedAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const softs = await ProprietarySoftware.find({});
    console.log(`\n🏢 Found ${softs.length} proprietary software entries`);

    for (const soft of softs) {
      console.log(`\n🔍 Adding alternatives for ${soft.name}...`);
      
      let altsToAdd = realisticAlternatives[soft.slug] || [];
      
      // If no realistic alternatives, create generic ones
      if (altsToAdd.length < 3) {
        const currentCount = altsToAdd.length;
        for (let i = currentCount + 1; i <= 3; i++) {
          altsToAdd.push({
            name: `${soft.name} Alternative ${i}`,
            slug: `${soft.slug}-alt-${i}`,
            description: `An open-source alternative to ${soft.name}, offering similar features and better privacy.`,
            website: `https://example.com/${soft.slug}-alt-${i}`,
            github: `https://github.com/example/${soft.slug}-alt-${i}`
          });
        }
      }

      for (const altData of altsToAdd) {
        try {
          const alt = await Alternative.findOneAndUpdate(
            { slug: altData.slug },
            { 
              ...altData, 
              categories: soft.categories,
              $addToSet: { alternative_to: soft._id },
              updated_at: new Date() 
            },
            { upsert: true, new: true }
          );
          console.log(`   ✅ Added/Updated alternative: ${alt.name}`);
        } catch (err: any) {
          console.error(`   ❌ Error adding ${altData.name}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Finished adding alternatives!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
