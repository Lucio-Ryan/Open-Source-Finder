import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const AlternativeSchema = new mongoose.Schema({
  name: String,
  slug: String,
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
});

const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function approveAll() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Count unapproved
    const unapprovedCount = await Alternative.countDocuments({ approved: { $ne: true } });
    console.log(`\n📊 Found ${unapprovedCount} unapproved alternatives`);

    if (unapprovedCount > 0) {
      // Approve all alternatives
      const result = await Alternative.updateMany(
        { approved: { $ne: true } },
        { $set: { approved: true } }
      );
      console.log(`✅ Approved ${result.modifiedCount} alternatives`);
    }

    // Verify
    const totalApproved = await Alternative.countDocuments({ approved: true });
    const total = await Alternative.countDocuments();
    console.log(`\n📊 Final stats: ${totalApproved}/${total} alternatives are now approved`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

approveAll();
