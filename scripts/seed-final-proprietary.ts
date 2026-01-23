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

const finalProprietary = [
  // VPN/Networking
  { name: 'Tailscale', website: 'https://tailscale.com', description: 'Zero-config VPN' },
  { name: 'Cloudflare Tunnel', website: 'https://cloudflare.com', description: 'Secure tunneling service' },
  { name: 'ngrok', website: 'https://ngrok.com', description: 'Secure tunnels to localhost' },
  
  // Data/Workflow Orchestration
  { name: 'Prefect Cloud', website: 'https://prefect.io', description: 'Data workflow orchestration' },
  { name: 'Astronomer', website: 'https://astronomer.io', description: 'Airflow as a service' },
  
  // Validation
  { name: 'Zod', website: 'https://zod.dev', description: 'TypeScript-first schema validation' },
  { name: 'Ajv', website: 'https://ajv.js.org', description: 'JSON schema validator' },
  
  // PDF
  { name: 'wkhtmltopdf', website: 'https://wkhtmltopdf.org', description: 'HTML to PDF converter' },
  { name: 'Prince', website: 'https://princexml.com', description: 'HTML to PDF converter' },
  
  // UI Libraries
  { name: 'Chakra UI', website: 'https://chakra-ui.com', description: 'React component library' },
  { name: 'Ant Design', website: 'https://ant.design', description: 'React UI library' },
  
  // Animation
  { name: 'GSAP', website: 'https://greensock.com/gsap', description: 'Professional-grade animation library' },
  { name: 'Motion One', website: 'https://motion.dev', description: 'Animation library' },
  
  // Container Management
  { name: 'Portainer', website: 'https://portainer.io', description: 'Container management platform' },
  { name: 'Rancher', website: 'https://rancher.com', description: 'Kubernetes management' },
  
  // CLI
  { name: 'Click', website: 'https://click.palletsprojects.com', description: 'Python CLI toolkit' },
  { name: 'Argparse', website: 'https://docs.python.org/3/library/argparse.html', description: 'Python argument parsing' },
  
  // Terminal UI
  { name: 'Rich', website: 'https://github.com/Textualize/rich', description: 'Python rich text library' },
  { name: 'Charm', website: 'https://charm.sh', description: 'Terminal UI tools' },
];

async function seedFinal() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🚀 Seeding final proprietary software...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const software of finalProprietary) {
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

seedFinal();
