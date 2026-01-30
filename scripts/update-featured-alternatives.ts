import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/connection';

const TARGET_EMAIL = 'lucioryan400@gmail.com';

async function updateSponsoredAlternatives() {
  try {
    await connectToDatabase();

    console.log('🔄 Updating sponsored alternatives...\n');

    // Find the user
    const usersCollection = mongoose.connection.collection('users');
    const user = await usersCollection.findOne({ email: TARGET_EMAIL });

    if (!user) {
      console.error(`❌ User with email ${TARGET_EMAIL} not found!`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name || 'No name'} (ID: ${user._id})\n`);

    const alternativesCollection = mongoose.connection.collection('alternatives');
    const now = new Date();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 1. Remove n8n from sponsored plan
    console.log('📝 Removing n8n from sponsored plan...');
    await alternativesCollection.updateOne(
      { slug: 'n8n' },
      {
        $set: {
          submission_plan: 'free',
          sponsor_featured_until: null,
          sponsor_priority_until: null,
          sponsor_payment_id: null,
          sponsor_paid_at: null,
          newsletter_included: false,
        }
      }
    );
    console.log('✅ n8n removed from sponsored plan\n');

    // 2. Add flowise to sponsored plan and set ownership
    console.log('📝 Adding flowise to sponsored plan...');
    const flowiseUpdate = await alternativesCollection.updateOne(
      { slug: 'flowise' },
      {
        $set: {
          submission_plan: 'sponsor',
          icon_url: '/assets/logos/flowise-logo.png',
          screenshots: ['/assets/screenshots/flowise-workflow.png'],
          sponsor_featured_until: sevenDaysFromNow,
          sponsor_priority_until: sevenDaysFromNow,
          sponsor_paid_at: now,
          sponsor_payment_id: 'manual_sponsor_' + Date.now() + '_flowise',
          newsletter_included: true,
          approved: true,
          status: 'approved',
          user_id: user._id,
          submitter_email: TARGET_EMAIL,
          submitter_name: user.name || TARGET_EMAIL.split('@')[0],
        }
      }
    );
    
    if (flowiseUpdate.modifiedCount > 0) {
      console.log('✅ flowise added to sponsored plan');
      console.log(`   - Owner: ${TARGET_EMAIL}`);
      console.log(`   - Featured until: ${sevenDaysFromNow.toLocaleDateString()}\n`);
    } else {
      console.log('⚠️  flowise might not exist or already updated\n');
    }

    console.log('✅ Sponsored alternatives update complete!\n');
    console.log('📊 Summary:');
    console.log('   - Featured alternatives: appflowy, postiz, flowise');
    console.log('   - Removed from sponsored: n8n');
    console.log('   - Added to sponsored: flowise');
    console.log('\n📌 Note: Make sure to add flowise logo and screenshot to:');
    console.log('   - public/assets/logos/flowise-logo.png');
    console.log('   - public/assets/screenshots/flowise-workflow.png');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating sponsored alternatives:', error);
    process.exit(1);
  }
}

updateSponsoredAlternatives();
