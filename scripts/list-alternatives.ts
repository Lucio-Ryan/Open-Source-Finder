import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const AlternativeSchema = new mongoose.Schema({ name: String, slug: String });
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const count = await Alternative.countDocuments();
  const alts = await Alternative.find().select('name').sort({ name: 1 });
  console.log('Total alternatives:', count);
  console.log('\nExisting alternatives:');
  alts.forEach((a: any) => console.log(a.name));
  await mongoose.disconnect();
}
run();
