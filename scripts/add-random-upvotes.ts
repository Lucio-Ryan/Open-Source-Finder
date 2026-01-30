import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/connection';

// Generate random number between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate diverse vote counts ensuring no more than 3 alternatives have the same count
function generateDiverseVoteCounts(count: number): number[] {
  const voteCounts: number[] = [];
  const countMap = new Map<number, number>(); // Track how many times each count is used

  for (let i = 0; i < count; i++) {
    let voteCount: number;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      voteCount = randomInt(0, 565);
      attempts++;

      // If we've tried too many times, just use any number (safety fallback)
      if (attempts >= maxAttempts) {
        break;
      }

      // Check if this count has been used 3 times already
      const usageCount = countMap.get(voteCount) || 0;
      if (usageCount < 3) {
        break;
      }
    } while (true);

    // Track usage
    const currentUsage = countMap.get(voteCount) || 0;
    countMap.set(voteCount, currentUsage + 1);

    voteCounts.push(voteCount);
  }

  return voteCounts;
}

async function addRandomUpvotes() {
  try {
    await connectToDatabase();

    console.log('🎲 Generating random upvote counts for alternatives...\n');

    const alternativesCollection = mongoose.connection.collection('alternatives');

    // Get all alternatives
    const alternatives = await alternativesCollection.find({}).toArray();

    if (alternatives.length === 0) {
      console.log('⚠️  No alternatives found in the database.');
      process.exit(0);
    }

    console.log(`📊 Found ${alternatives.length} alternatives\n`);

    // Generate diverse vote counts
    const voteCounts = generateDiverseVoteCounts(alternatives.length);

    // Create a map to track vote count distribution
    const distribution = new Map<number, number>();

    console.log('🔄 Updating alternatives with random upvote counts...\n');

    // Update each alternative
    for (let i = 0; i < alternatives.length; i++) {
      const alternative = alternatives[i];
      const voteCount = voteCounts[i];

      await alternativesCollection.updateOne(
        { _id: alternative._id },
        { $set: { vote_score: voteCount } }
      );

      // Track distribution
      const currentCount = distribution.get(voteCount) || 0;
      distribution.set(voteCount, currentCount + 1);

      console.log(`✅ ${alternative.slug.padEnd(30)} → ${voteCount.toString().padStart(3)} upvotes`);
    }

    console.log('\n✅ All alternatives updated with random upvote counts!\n');

    // Show distribution statistics
    console.log('📊 Distribution Statistics:');
    console.log(`   - Total alternatives: ${alternatives.length}`);
    console.log(`   - Unique vote counts: ${distribution.size}`);
    console.log(`   - Min votes: ${Math.min(...voteCounts)}`);
    console.log(`   - Max votes: ${Math.max(...voteCounts)}`);
    console.log(`   - Average votes: ${Math.round(voteCounts.reduce((a, b) => a + b, 0) / voteCounts.length)}`);

    // Show duplicates
    const duplicates = Array.from(distribution.entries())
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a);

    if (duplicates.length > 0) {
      console.log(`\n📌 Duplicate vote counts (used more than once):`);
      duplicates.slice(0, 10).forEach(([voteCount, usage]) => {
        console.log(`   - ${voteCount} votes: used ${usage} times`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding random upvotes:', error);
    process.exit(1);
  }
}

addRandomUpvotes();
