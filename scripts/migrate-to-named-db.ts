import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function migrateData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const sourceDb = mongoose.connection.db;
    const sourceDbName = sourceDb.databaseName;
    console.log(`\n📁 Source database: ${sourceDbName}`);

    // Target database name
    const targetDbName = 'osfinder';
    console.log(`📁 Target database: ${targetDbName}`);

    // Get the target database
    const targetDb = mongoose.connection.useDb(targetDbName).db;

    // Get all collections from source
    const collections = await sourceDb.listCollections().toArray();
    console.log(`\n📋 Found ${collections.length} collections to migrate`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`\n🔄 Migrating "${colName}"...`);

      // Get source collection
      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      // Count documents
      const count = await sourceCol.countDocuments();
      console.log(`   Documents to migrate: ${count}`);

      if (count === 0) {
        console.log(`   ⏭️  Skipping (empty)`);
        continue;
      }

      // Check if target already has data
      const targetCount = await targetCol.countDocuments();
      if (targetCount > 0) {
        console.log(`   ⚠️  Target already has ${targetCount} documents`);
        
        // Ask to overwrite by dropping first
        console.log(`   🗑️  Dropping target collection...`);
        await targetCol.drop().catch(() => {}); // Ignore if doesn't exist
      }

      // Copy documents in batches
      const batchSize = 1000;
      let copied = 0;
      
      const cursor = sourceCol.find({});
      let batch: any[] = [];

      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        batch.push(doc);

        if (batch.length >= batchSize) {
          await targetCol.insertMany(batch);
          copied += batch.length;
          process.stdout.write(`\r   Copied: ${copied}/${count}`);
          batch = [];
        }
      }

      // Insert remaining
      if (batch.length > 0) {
        await targetCol.insertMany(batch);
        copied += batch.length;
      }

      console.log(`\r   ✅ Copied: ${copied}/${count}    `);
    }

    // Verify migration
    console.log('\n\n📊 Verification:');
    const targetCollections = await targetDb.listCollections().toArray();
    for (const col of targetCollections) {
      const count = await targetDb.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
    }

    console.log('\n\n✅ Migration complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update your .env.local MONGODB_URI to include the database name:');
    console.log(`      MONGODB_URI=mongodb+srv://...@zenith.whhwcnk.mongodb.net/${targetDbName}?appName=Zenith`);
    console.log('   2. Update the same in your Vercel environment variables');
    console.log('   3. Redeploy your Vercel app');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

migrateData();
