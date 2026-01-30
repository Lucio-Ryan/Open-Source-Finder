import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/connection';

const TARGET_EMAIL = 'lucioryan400@gmail.com';
const ALTERNATIVE_SLUGS = ['n8n', 'postiz', 'appflowy'];

async function updateAlternativeOwnership() {
  try {
    await connectToDatabase();

    console.log(`🔍 Looking for user with email: ${TARGET_EMAIL}\n`);

    // Find the user
    const usersCollection = mongoose.connection.collection('users');
    const user = await usersCollection.findOne({ email: TARGET_EMAIL });

    if (!user) {
      console.error(`❌ User with email ${TARGET_EMAIL} not found!`);
      console.log('\n💡 Please make sure the user account exists in the database.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name || 'No name'} (ID: ${user._id})`);
    console.log(`\n🔄 Updating ownership for alternatives: ${ALTERNATIVE_SLUGS.join(', ')}\n`);

    const alternativesCollection = mongoose.connection.collection('alternatives');

    for (const slug of ALTERNATIVE_SLUGS) {
      console.log(`📝 Processing ${slug}...`);

      // Check if alternative exists
      const alternative = await alternativesCollection.findOne({ slug });

      if (!alternative) {
        console.log(`⚠️  ${slug} not found in database. Skipping...\n`);
        continue;
      }

      // Update the ownership
      const result = await alternativesCollection.updateOne(
        { slug },
        {
          $set: {
            user_id: user._id,
            submitter_email: TARGET_EMAIL,
            submitter_name: user.name || TARGET_EMAIL.split('@')[0],
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${slug} ownership updated successfully`);
        console.log(`   - User ID: ${user._id}`);
        console.log(`   - Email: ${TARGET_EMAIL}`);
        console.log(`   - Name: ${user.name || TARGET_EMAIL.split('@')[0]}`);
      } else {
        console.log(`ℹ️  ${slug} - no changes made (might already be assigned to this user)`);
      }
      console.log('');
    }

    console.log('✅ Ownership update complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Alternatives processed: ${ALTERNATIVE_SLUGS.length}`);
    console.log(`   - Owner: ${TARGET_EMAIL}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating alternative ownership:', error);
    process.exit(1);
  }
}

updateAlternativeOwnership();
