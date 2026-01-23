import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
});

const AlternativeSchema = new mongoose.Schema({
  name: String,
  slug: String,
  approved: Boolean,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

async function diagnose() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Check categories
    console.log('\n📁 CATEGORIES:');
    const categories = await Category.find().lean();
    console.log(`  Total: ${categories.length}`);
    
    // Check for 3d-animation specifically
    const animationCat = await Category.findOne({ slug: '3d-animation' }).lean();
    console.log(`  3d-animation category exists: ${animationCat ? 'YES' : 'NO'}`);
    if (animationCat) {
      console.log(`    Name: ${(animationCat as any).name}`);
      console.log(`    ID: ${(animationCat as any)._id}`);
    }

    // Show first 10 category slugs
    console.log('\n  First 20 category slugs:');
    categories.slice(0, 20).forEach((c: any) => console.log(`    - ${c.slug}: ${c.name}`));

    // Check alternatives
    console.log('\n📁 ALTERNATIVES:');
    const totalAlts = await Alternative.countDocuments();
    const approvedAlts = await Alternative.countDocuments({ approved: true });
    console.log(`  Total: ${totalAlts}`);
    console.log(`  Approved: ${approvedAlts}`);

    // Check alternatives with categories
    const altsWithCats = await Alternative.countDocuments({ 
      categories: { $exists: true, $ne: [] } 
    });
    const altsWithoutCats = await Alternative.countDocuments({ 
      $or: [
        { categories: { $exists: false } },
        { categories: { $size: 0 } },
        { categories: null }
      ]
    });
    console.log(`  With categories: ${altsWithCats}`);
    console.log(`  Without categories: ${altsWithoutCats}`);

    // Check for broken category references
    console.log('\n🔍 Checking for broken category references...');
    const allCatIds = categories.map((c: any) => c._id.toString());
    const altsWithBrokenCats: string[] = [];
    
    const allAlts = await Alternative.find().lean();
    for (const alt of allAlts) {
      const cats = (alt as any).categories || [];
      for (const catRef of cats) {
        if (catRef && !allCatIds.includes(catRef.toString())) {
          altsWithBrokenCats.push(`${(alt as any).name}: ${catRef}`);
        }
      }
    }
    
    if (altsWithBrokenCats.length > 0) {
      console.log(`  ❌ Found ${altsWithBrokenCats.length} broken category references`);
      altsWithBrokenCats.slice(0, 10).forEach(b => console.log(`    - ${b}`));
    } else {
      console.log('  ✅ No broken category references');
    }

    // Check proprietary software
    console.log('\n📁 PROPRIETARY SOFTWARE:');
    const totalProp = await ProprietarySoftware.countDocuments();
    console.log(`  Total: ${totalProp}`);

    // Check if category has any alternatives
    if (animationCat) {
      const altsIn3dAnimation = await Alternative.countDocuments({
        categories: (animationCat as any)._id,
        approved: true
      });
      console.log(`\n📊 Alternatives in 3d-animation: ${altsIn3dAnimation}`);
    }

    // Check an alternative's category population
    console.log('\n🔍 Testing category population...');
    const sampleAlt = await Alternative.findOne({ approved: true, categories: { $exists: true, $ne: [] } })
      .populate('categories')
      .lean();
    
    if (sampleAlt) {
      console.log(`  Sample: ${(sampleAlt as any).name}`);
      console.log(`  Categories populated: ${JSON.stringify((sampleAlt as any).categories?.slice(0, 3), null, 2)}`);
    }

    // List all collection names in the database
    console.log('\n📁 ALL COLLECTIONS IN DATABASE:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(c => console.log(`  - ${c.name}`));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

diagnose();
