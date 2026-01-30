import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/connection';

// Manual image URLs - these should be uploaded to your hosting/CDN
// For now, using local paths that will be accessible via Next.js public folder
const UPDATES = [
  {
    slug: 'n8n',
    updates: {
      submission_plan: 'sponsor',
      icon_url: '/assets/logos/n8n-logo.png',
      screenshots: ['/assets/screenshots/n8n-workflow.png'],
      sponsor_featured_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sponsor_priority_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sponsor_paid_at: new Date(),
      sponsor_payment_id: 'manual_sponsor_' + Date.now() + '_n8n',
      newsletter_included: true,
      approved: true,
      status: 'approved' as const,
    }
  },
  {
    slug: 'postiz',
    updates: {
      submission_plan: 'sponsor',
      icon_url: '/assets/logos/postiz-logo.png',
      screenshots: ['/assets/screenshots/postiz-calendar.png'],
      sponsor_featured_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sponsor_priority_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sponsor_paid_at: new Date(),
      sponsor_payment_id: 'manual_sponsor_' + Date.now() + '_postiz',
      newsletter_included: true,
      approved: true,
      status: 'approved' as const,
    }
  },
  {
    slug: 'appflowy',
    updates: {
      submission_plan: 'sponsor',
      icon_url: '/assets/logos/appflowy-logo.png',
      screenshots: ['/assets/screenshots/appflowy-project.png'],
      sponsor_featured_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sponsor_priority_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sponsor_paid_at: new Date(),
      sponsor_payment_id: 'manual_sponsor_' + Date.now() + '_appflowy',
      newsletter_included: true,
      approved: true,
      status: 'approved' as const,
    }
  }
];

async function updateSponsoredAlternatives() {
  try {
    await connectToDatabase();

    console.log('🚀 Starting sponsored alternatives update...\n');

    const collection = mongoose.connection.collection('alternatives');

    for (const { slug, updates } of UPDATES) {
      console.log(`📝 Updating ${slug}...`);

      // Check if alternative exists
      const existing = await collection.findOne({ slug });
      
      if (!existing) {
        console.log(`⚠️  ${slug} not found in database. Skipping...`);
        continue;
      }

      // Update the alternative
      const result = await collection.updateOne(
        { slug },
        { $set: updates }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${slug} updated successfully`);
        console.log(`   - Plan: ${updates.submission_plan}`);
        console.log(`   - Logo: ${updates.icon_url}`);
        console.log(`   - Screenshots: ${updates.screenshots.length} added`);
        console.log(`   - Featured until: ${updates.sponsor_featured_until.toLocaleDateString()}`);
      } else {
        console.log(`⚠️  ${slug} - no changes made (might already be up to date)`);
      }
      console.log('');
    }

    console.log('✅ All sponsored alternatives updated successfully!');
    console.log('\n📌 Next steps:');
    console.log('1. Upload the logo and screenshot images to public/assets/');
    console.log('   - n8n: logo (n8n-logo.png) and screenshot (n8n-workflow.png)');
    console.log('   - postiz: logo (postiz-logo.png) and screenshot (postiz-calendar.png)');
    console.log('   - appflowy: logo (appflowy-logo.png) and screenshot (appflowy-project.png)');
    console.log('2. Make sure the images are accessible at the paths specified above');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating sponsored alternatives:', error);
    process.exit(1);
  }
}

updateSponsoredAlternatives();
