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

async function featureRandomAlternatives() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get 8 random alternatives
    const randomAlternatives = await Alternative.aggregate([
      { $match: {} },
      { $sample: { size: 8 } }
    ]);

    const ids = randomAlternatives.map(a => a._id);
    await Alternative.updateMany({ _id: { $in: ids } }, { $set: { featured: true } });

    console.log('Featured alternatives:');
    randomAlternatives.forEach(a => console.log(`- ${a.name}`));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

featureRandomAlternatives();
