/**
 * Database Index Creation Script
 * Run this script to ensure all necessary indexes are created for optimal query performance
 * 
 * Usage: npx tsx scripts/create-indexes.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createIndexes() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      // TLS/SSL options for MongoDB Atlas compatibility
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db!;

    // Alternative indexes
    console.log('\n📊 Creating indexes for alternatives collection...');
    const alternativesCollection = db.collection('alternatives');
    
    await alternativesCollection.createIndex({ slug: 1 }, { unique: true });
    await alternativesCollection.createIndex({ approved: 1 });
    await alternativesCollection.createIndex({ featured: 1 });
    await alternativesCollection.createIndex({ health_score: -1 });
    await alternativesCollection.createIndex({ vote_score: -1 });
    await alternativesCollection.createIndex({ is_self_hosted: 1 });
    await alternativesCollection.createIndex({ created_at: -1 });
    await alternativesCollection.createIndex({ user_id: 1 });
    await alternativesCollection.createIndex({ categories: 1 });
    await alternativesCollection.createIndex({ tags: 1 });
    await alternativesCollection.createIndex({ tech_stacks: 1 });
    await alternativesCollection.createIndex({ alternative_to: 1 });
    await alternativesCollection.createIndex({ submission_plan: 1 });
    
    // Compound indexes for common queries
    await alternativesCollection.createIndex({ approved: 1, health_score: -1 });
    await alternativesCollection.createIndex({ approved: 1, vote_score: -1 });
    await alternativesCollection.createIndex({ approved: 1, created_at: -1 });
    await alternativesCollection.createIndex({ approved: 1, featured: 1 });
    await alternativesCollection.createIndex({ approved: 1, is_self_hosted: 1 });
    await alternativesCollection.createIndex({ approved: 1, categories: 1, health_score: -1 });
    
    // Text index for search
    await alternativesCollection.createIndex(
      { name: 'text', description: 'text', short_description: 'text' },
      { weights: { name: 10, short_description: 5, description: 1 } }
    );
    
    console.log('✅ Alternatives indexes created');

    // Category indexes
    console.log('\n📊 Creating indexes for categories collection...');
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true });
    await categoriesCollection.createIndex({ name: 1 });
    console.log('✅ Categories indexes created');

    // Tech stack indexes
    console.log('\n📊 Creating indexes for techstacks collection...');
    const techStacksCollection = db.collection('techstacks');
    await techStacksCollection.createIndex({ slug: 1 }, { unique: true });
    await techStacksCollection.createIndex({ name: 1 });
    await techStacksCollection.createIndex({ type: 1 });
    console.log('✅ Tech stacks indexes created');

    // Tag indexes
    console.log('\n📊 Creating indexes for tags collection...');
    const tagsCollection = db.collection('tags');
    await tagsCollection.createIndex({ slug: 1 }, { unique: true });
    await tagsCollection.createIndex({ name: 1 });
    console.log('✅ Tags indexes created');

    // Proprietary software indexes
    console.log('\n📊 Creating indexes for proprietarysoftwares collection...');
    const proprietaryCollection = db.collection('proprietarysoftwares');
    await proprietaryCollection.createIndex({ slug: 1 }, { unique: true });
    await proprietaryCollection.createIndex({ name: 1 });
    console.log('✅ Proprietary software indexes created');

    // Vote indexes
    console.log('\n📊 Creating indexes for votes collection...');
    const votesCollection = db.collection('votes');
    await votesCollection.createIndex({ user_id: 1, alternative_id: 1 }, { unique: true });
    await votesCollection.createIndex({ alternative_id: 1 });
    console.log('✅ Votes indexes created');

    // User indexes
    console.log('\n📊 Creating indexes for users collection...');
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    console.log('✅ Users indexes created');

    // Discussion indexes
    console.log('\n📊 Creating indexes for discussions collection...');
    const discussionsCollection = db.collection('discussions');
    await discussionsCollection.createIndex({ alternative_id: 1 });
    await discussionsCollection.createIndex({ user_id: 1 });
    await discussionsCollection.createIndex({ parent_id: 1 });
    await discussionsCollection.createIndex({ alternative_id: 1, created_at: -1 });
    console.log('✅ Discussions indexes created');

    // Advertisement indexes
    console.log('\n📊 Creating indexes for advertisements collection...');
    const advertisementsCollection = db.collection('advertisements');
    await advertisementsCollection.createIndex({ ad_type: 1, status: 1, is_active: 1 });
    await advertisementsCollection.createIndex({ priority: -1 });
    await advertisementsCollection.createIndex({ user_id: 1, status: 1 });
    await advertisementsCollection.createIndex({ expires_at: 1 });
    console.log('✅ Advertisements indexes created');

    // Session indexes with TTL
    console.log('\n📊 Creating indexes for sessions collection...');
    const sessionsCollection = db.collection('sessions');
    await sessionsCollection.createIndex({ token: 1 }, { unique: true });
    await sessionsCollection.createIndex({ user_id: 1 });
    await sessionsCollection.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
    console.log('✅ Sessions indexes created');

    // Print index statistics
    console.log('\n📈 Index Statistics:');
    const collections = ['alternatives', 'categories', 'techstacks', 'tags', 'proprietarysoftwares', 'votes', 'users', 'discussions', 'advertisements', 'sessions'];
    
    for (const collName of collections) {
      try {
        const coll = db.collection(collName);
        const indexes = await coll.indexes();
        console.log(`  ${collName}: ${indexes.length} indexes`);
      } catch (e) {
        console.log(`  ${collName}: collection may not exist yet`);
      }
    }

    console.log('\n✅ All indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

createIndexes();
