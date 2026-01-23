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
  license: String,
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

// 10 more alternatives to reach 100
const moreAlternatives = [
  { name: 'Leptos', description: 'Build fast web applications with Rust', website: 'https://leptos.dev', github: 'https://github.com/leptos-rs/leptos', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['React', 'Next.js'] },
  { name: 'Dioxus', description: 'Portable, performant, ergonomic apps in Rust', website: 'https://dioxuslabs.com', github: 'https://github.com/DioxusLabs/dioxus', license: 'MIT', categories: ['Developer Tools', 'Web Development'], alternative_to: ['React'] },
  { name: 'tRPC', description: 'End-to-end typesafe APIs', website: 'https://trpc.io', github: 'https://github.com/trpc/trpc', license: 'MIT', categories: ['Developer Tools', 'API Development'], alternative_to: ['GraphQL', 'REST'] },
  { name: 'Hatchet', description: 'Distributed task queue', website: 'https://hatchet.run', github: 'https://github.com/hatchet-dev/hatchet', license: 'MIT', categories: ['Developer Tools', 'DevOps & Infrastructure'], alternative_to: ['Celery', 'Temporal'] },
  { name: 'Trigger.dev', description: 'Background jobs framework', website: 'https://trigger.dev', github: 'https://github.com/triggerdotdev/trigger.dev', license: 'Apache-2.0', categories: ['Developer Tools', 'Automation'], alternative_to: ['Temporal', 'AWS Lambda'] },
  { name: 'Inngest', description: 'Durable functions and workflows', website: 'https://inngest.com', github: 'https://github.com/inngest/inngest', license: 'Apache-2.0', categories: ['Developer Tools', 'Automation'], alternative_to: ['AWS Step Functions', 'Temporal'] },
  { name: 'Upstash', description: 'Serverless data platform', website: 'https://upstash.com', github: 'https://github.com/upstash', license: 'MIT', categories: ['Database & Storage'], alternative_to: ['Redis Cloud', 'Amazon ElastiCache'] },
  { name: 'Electric SQL', description: 'Local-first SQL sync engine', website: 'https://electric-sql.com', github: 'https://github.com/electric-sql/electric', license: 'Apache-2.0', categories: ['Database & Storage'], alternative_to: ['Firebase Realtime Database'] },
  { name: 'PowerSync', description: 'Sync engine for local-first apps', website: 'https://powersync.com', github: 'https://github.com/powersync-ja/powersync-js', license: 'Apache-2.0', categories: ['Database & Storage'], alternative_to: ['Firebase', 'Supabase Realtime'] },
  { name: 'Neon', description: 'Serverless PostgreSQL', website: 'https://neon.tech', github: 'https://github.com/neondatabase/neon', license: 'Apache-2.0', categories: ['Database & Storage'], alternative_to: ['Amazon Aurora', 'PlanetScale'] },
];

const moreProprietary = [
  { name: 'GraphQL', website: 'https://graphql.org', description: 'Query language for APIs' },
  { name: 'REST', website: 'https://restfulapi.net', description: 'REST API architecture' },
  { name: 'Celery', website: 'https://celeryq.dev', description: 'Distributed task queue' },
  { name: 'AWS Lambda', website: 'https://aws.amazon.com/lambda', description: 'Serverless compute' },
  { name: 'Redis Cloud', website: 'https://redis.com/redis-enterprise-cloud', description: 'Managed Redis' },
  { name: 'Amazon ElastiCache', website: 'https://aws.amazon.com/elasticache', description: 'Managed caching' },
  { name: 'Firebase Realtime Database', website: 'https://firebase.google.com/products/realtime-database', description: 'Cloud-hosted NoSQL database' },
  { name: 'Supabase Realtime', website: 'https://supabase.com/realtime', description: 'Real-time data sync' },
  { name: 'Amazon Aurora', website: 'https://aws.amazon.com/rds/aurora', description: 'Managed relational database' },
  { name: 'PlanetScale', website: 'https://planetscale.com', description: 'Serverless MySQL platform' },
];

async function seedMore() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Seed proprietary software
    console.log('\n📁 Seeding proprietary software...');
    let propAdded = 0;
    for (const prop of moreProprietary) {
      const slug = createSlug(prop.name);
      const existing = await ProprietarySoftware.findOne({
        $or: [{ slug }, { name: { $regex: `^${prop.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });
      if (!existing) {
        try {
          await ProprietarySoftware.create({ ...prop, slug });
          propAdded++;
        } catch (err) {}
      }
    }
    console.log(`   Added ${propAdded} proprietary software`);

    // Get mappings
    const categories = await Category.find();
    const categoryMap = new Map(categories.map((c: any) => [c.name, c._id]));
    const proprietarySoftware = await ProprietarySoftware.find();
    const proprietaryMap = new Map(proprietarySoftware.map((p: any) => [p.name.toLowerCase(), p._id]));

    // Seed alternatives
    console.log('\n🚀 Seeding alternatives...');
    let added = 0;
    let skipped = 0;

    for (const alt of moreAlternatives) {
      const slug = createSlug(alt.name);
      const existing = await Alternative.findOne({
        $or: [{ slug }, { name: { $regex: `^${alt.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });

      if (existing) {
        skipped++;
        continue;
      }

      const categoryIds = alt.categories.map(c => categoryMap.get(c)).filter(Boolean);
      const alternativeToIds = alt.alternative_to.map(p => proprietaryMap.get(p.toLowerCase())).filter(Boolean);

      try {
        await Alternative.create({
          name: alt.name,
          slug,
          description: alt.description,
          short_description: alt.description,
          website: alt.website,
          github_url: alt.github,
          license: alt.license,
          categories: categoryIds,
          alternative_to: alternativeToIds,
          upvotes: Math.floor(Math.random() * 500) + 50,
        });
        added++;
      } catch (err: any) {
        if (err.code === 11000) skipped++;
      }
    }

    console.log(`   Added ${added} alternatives (${skipped} skipped)`);

    const total = await Alternative.countDocuments();
    console.log(`\n📊 Total alternatives: ${total}`);
    console.log('\n🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedMore();
