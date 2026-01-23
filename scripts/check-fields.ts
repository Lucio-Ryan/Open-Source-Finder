import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkAlternativeFields() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('alternatives');

    // Check for missing required fields
    console.log('\n🔍 Checking for alternatives with missing fields...');
    
    // Check github field
    const noGithub = await collection.countDocuments({ 
      $or: [
        { github: { $exists: false } },
        { github: null },
        { github: '' }
      ]
    });
    console.log(`  Missing github: ${noGithub}`);

    // Check website field
    const noWebsite = await collection.countDocuments({ 
      $or: [
        { website: { $exists: false } },
        { website: null },
        { website: '' }
      ]
    });
    console.log(`  Missing website: ${noWebsite}`);

    // Check description field
    const noDescription = await collection.countDocuments({ 
      $or: [
        { description: { $exists: false } },
        { description: null },
        { description: '' }
      ]
    });
    console.log(`  Missing description: ${noDescription}`);

    // Check approved field
    const noApproved = await collection.countDocuments({ 
      $or: [
        { approved: { $exists: false } },
        { approved: null }
      ]
    });
    console.log(`  Missing approved: ${noApproved}`);

    // Sample one with missing github
    if (noGithub > 0) {
      const sample = await collection.findOne({ 
        $or: [{ github: { $exists: false } }, { github: null }, { github: '' }]
      });
      console.log('\n  Sample with missing github:', sample?.name);
    }

    // Check total counts by approved status
    console.log('\n📊 Counts by approved status:');
    const approvedTrue = await collection.countDocuments({ approved: true });
    const approvedFalse = await collection.countDocuments({ approved: false });
    const approvedNull = await collection.countDocuments({ approved: null });
    const approvedMissing = await collection.countDocuments({ approved: { $exists: false } });
    
    console.log(`  approved=true: ${approvedTrue}`);
    console.log(`  approved=false: ${approvedFalse}`);
    console.log(`  approved=null: ${approvedNull}`);
    console.log(`  approved missing: ${approvedMissing}`);

    // Test the actual query the app uses
    console.log('\n🔍 Testing actual app query...');
    const testResult = await collection.find({ approved: true }).limit(5).toArray();
    console.log(`  Query returned: ${testResult.length} results`);
    testResult.forEach(r => console.log(`    - ${r.name}`));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkAlternativeFields();
