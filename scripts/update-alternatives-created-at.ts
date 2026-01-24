import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/connection';

async function updateAlternativesCreatedAt() {
  try {
    await connectToDatabase();

    const now = new Date();
    console.log(`Updating all alternatives with created_at = ${now.toISOString()}`);

    // Use the raw MongoDB collection to bypass Mongoose timestamps middleware
    const collection = mongoose.connection.collection('alternatives');
    const result = await collection.updateMany(
      {}, // Match all documents
      { $set: { created_at: now } }
    );

    console.log(`✅ Updated ${result.modifiedCount} alternatives`);
    console.log(`Matched: ${result.matchedCount} alternatives`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating alternatives:', error);
    process.exit(1);
  }
}

updateAlternativesCreatedAt();
