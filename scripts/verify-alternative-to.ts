import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
});

const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  console.log('Sample alternatives with their proprietary software references:\n');
  
  const alts = await Alternative.find({ alternative_to: { $exists: true, $ne: [] } })
    .populate('alternative_to', 'name')
    .limit(20)
    .lean();
  
  alts.forEach(a => {
    const propNames = (a.alternative_to as any[]).map(p => p?.name || 'Unknown').join(', ');
    console.log(`${a.name} -> ${propNames}`);
  });
  
  await mongoose.disconnect();
}

verify();
