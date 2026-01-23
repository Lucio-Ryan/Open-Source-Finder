import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from '../src/lib/mongodb/connection';
import { ProprietarySoftware, Alternative } from '../src/lib/mongodb/models';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function removeEmptyProprietarySoftware() {
  try {
    await connectToDatabase();
    console.log('🔍 Finding proprietary software with no alternatives...');

    // Get all proprietary software
    const allSoftware = await ProprietarySoftware.find().lean();
    console.log(`📊 Total proprietary software: ${allSoftware.length}`);

    let removedCount = 0;
    const toRemove: Array<{ name: string; slug: string }> = [];

    // Check each software for alternatives
    for (const software of allSoftware) {
      const count = await Alternative.countDocuments({
        alternative_to: software._id,
        approved: true,
      });

      if (count === 0) {
        toRemove.push({
          name: software.name,
          slug: software.slug,
        });
      }
    }

    console.log(`\n🗑️  Found ${toRemove.length} proprietary software with no alternatives:\n`);
    
    if (toRemove.length === 0) {
      console.log('✨ No empty proprietary software found!');
      process.exit(0);
    }

    // Display list
    toRemove.forEach((sw, index) => {
      console.log(`${index + 1}. ${sw.name} (${sw.slug})`);
    });

    console.log('\n⚠️  Deleting these entries...');

    // Delete them
    for (const sw of toRemove) {
      await ProprietarySoftware.deleteOne({ slug: sw.slug });
      removedCount++;
      console.log(`✓ Removed: ${sw.name}`);
    }

    console.log(`\n✅ Successfully removed ${removedCount} proprietary software entries with no alternatives`);
    console.log(`📊 Remaining proprietary software: ${allSoftware.length - removedCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

removeEmptyProprietarySoftware();
