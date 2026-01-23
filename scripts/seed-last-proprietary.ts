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

const lastProprietary = [
  { name: 'Astronomer', website: 'https://astronomer.io', description: 'Managed Airflow platform' },
  { name: 'Docker Desktop', website: 'https://docker.com/products/docker-desktop', description: 'Container development environment' },
  { name: 'ngrok', website: 'https://ngrok.com', description: 'Secure tunnels to localhost' },
  { name: 'Rich', website: 'https://github.com/Textualize/rich', description: 'Python rich text terminal library' },
  { name: 'ncurses', website: 'https://invisible-island.net/ncurses', description: 'Terminal UI library' },
  { name: 'Blessed', website: 'https://github.com/chjj/blessed', description: 'High-level terminal interface library' },
  { name: 'Prince', website: 'https://princexml.com', description: 'HTML to PDF converter' },
];

async function seedLast() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    console.log('\n🚀 Seeding last proprietary software...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const software of lastProprietary) {
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

seedLast();
