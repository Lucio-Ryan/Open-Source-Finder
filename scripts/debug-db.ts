import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const AlternativeSchema = new mongoose.Schema({
  name: String,
  slug: String,
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);

async function debug() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get a few alternatives with their alternative_to populated
    console.log('\n📊 Checking alternatives with alternative_to...');
    
    const alternatives = await Alternative.find({ approved: true })
      .populate('alternative_to')
      .limit(10)
      .lean();

    console.log(`Found ${alternatives.length} alternatives`);

    for (const alt of alternatives) {
      console.log(`\n${(alt as any).name}:`);
      console.log(`  alternative_to count: ${((alt as any).alternative_to || []).length}`);
      
      if ((alt as any).alternative_to && (alt as any).alternative_to.length > 0) {
        for (const p of (alt as any).alternative_to) {
          if (p === null) {
            console.log('  ❌ NULL reference found!');
          } else if (typeof p === 'object' && p._id) {
            console.log(`  ✅ ${p.name} (${p._id})`);
          } else {
            console.log(`  ⚠️ Unpopulated ObjectId: ${p}`);
          }
        }
      }
    }

    // Check for any alternatives with broken references
    console.log('\n\n🔍 Checking for broken references...');
    const allAlts = await Alternative.find().lean();
    const allPropIds = (await ProprietarySoftware.find().select('_id').lean()).map((p: any) => p._id.toString());
    
    let brokenCount = 0;
    const brokenAlts: string[] = [];
    
    for (const alt of allAlts) {
      const altTo = (alt as any).alternative_to || [];
      for (const ref of altTo) {
        if (ref && !allPropIds.includes(ref.toString())) {
          brokenCount++;
          brokenAlts.push(`${(alt as any).name}: ${ref}`);
        }
      }
    }

    if (brokenCount > 0) {
      console.log(`❌ Found ${brokenCount} broken references:`);
      brokenAlts.slice(0, 20).forEach(b => console.log(`  - ${b}`));
      if (brokenAlts.length > 20) {
        console.log(`  ... and ${brokenAlts.length - 20} more`);
      }
    } else {
      console.log('✅ No broken references found');
    }

    // Check total counts
    const totalAlts = await Alternative.countDocuments();
    const approvedAlts = await Alternative.countDocuments({ approved: true });
    const featuredAlts = await Alternative.countDocuments({ approved: true, featured: true });
    const totalProp = await ProprietarySoftware.countDocuments();

    console.log('\n📊 Database stats:');
    console.log(`  Total alternatives: ${totalAlts}`);
    console.log(`  Approved alternatives: ${approvedAlts}`);
    console.log(`  Featured alternatives: ${featuredAlts}`);
    console.log(`  Total proprietary software: ${totalProp}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debug();
