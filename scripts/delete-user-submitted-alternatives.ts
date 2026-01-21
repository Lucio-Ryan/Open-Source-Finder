import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

const AlternativeSchema = new mongoose.Schema({}, { strict: false });
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function deleteUserSubmittedAlternatives() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Alternative.deleteMany({ submitter_name: { $ne: null } });
    console.log(`Deleted ${result.deletedCount} alternatives with a submitter_name.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

deleteUserSubmittedAlternatives();
