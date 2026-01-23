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
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
});

const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function updateAllAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all proprietary software
    console.log('\n📁 Fetching proprietary software...');
    const allProprietarySoftware = await ProprietarySoftware.find().lean();
    console.log(`   Found ${allProprietarySoftware.length} proprietary software`);

    // Create a mapping from name (lowercase) to ObjectId for proprietary software
    const proprietaryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const prop of allProprietarySoftware) {
      proprietaryMap.set(prop.name.toLowerCase(), prop._id);
      const slug = prop.slug.replace(/-/g, ' ');
      proprietaryMap.set(slug, prop._id);
      const simplified = prop.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      proprietaryMap.set(simplified, prop._id);
    }

    // Get all alternatives
    console.log('\n📁 Fetching all alternatives...');
    const allAlternatives = await Alternative.find().lean();
    console.log(`   Found ${allAlternatives.length} alternatives`);

    // Count alternatives with and without alternative_to
    const withAltTo = allAlternatives.filter(a => a.alternative_to && a.alternative_to.length > 0).length;
    const withoutAltTo = allAlternatives.filter(a => !a.alternative_to || a.alternative_to.length === 0).length;
    
    console.log(`\n📊 Statistics:`);
    console.log(`   With alternative_to: ${withAltTo}`);
    console.log(`   Without alternative_to: ${withoutAltTo}`);

    console.log('\n🎉 Done!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updateAllAlternatives();
