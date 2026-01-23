import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const AlternativeSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String },
  short_description: String,
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId }],
});

const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function check() {
  await mongoose.connect(MONGODB_URI!);
  const alts = await Alternative.find({ 
    $or: [
      { alternative_to: { $exists: false } },
      { alternative_to: { $size: 0 } },
      { alternative_to: null }
    ]
  }).select('name short_description');
  console.log(`Found ${alts.length} alternatives without alternative_to:`);
  alts.forEach((a: any) => console.log(`- ${a.name}: ${a.short_description}`));
  await mongoose.disconnect();
}
check();
