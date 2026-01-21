import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

// Alternative schema matching your models.ts
const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  short_description: { type: String, default: null },
  long_description: { type: String, default: null },
  icon_url: { type: String, default: null },
  website: { type: String, required: true },
  github: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  last_commit: { type: Date, default: null },
  contributors: { type: Number, default: 0 },
  license: { type: String, default: null },
  is_self_hosted: { type: Boolean, default: false },
  health_score: { type: Number, default: 0 },
  vote_score: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  rejection_reason: { type: String, default: null },
  rejected_at: { type: Date, default: null },
  submitter_name: { type: String, default: null },
  submitter_email: { type: String, default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  screenshots: [{ type: String }],
  submission_plan: { type: String, enum: ['free', 'sponsor'], default: 'free' },
  backlink_verified: { type: Boolean, default: false },
  backlink_url: { type: String, default: null },
  sponsor_featured_until: { type: Date, default: null },
  sponsor_priority_until: { type: Date, default: null },
  sponsor_payment_id: { type: String, default: null },
  sponsor_paid_at: { type: Date, default: null },
  newsletter_included: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  tech_stacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TechStack' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// Function to generate random upvotes between 0-100
function getRandomUpvotes(): number {
  return Math.floor(Math.random() * 101); // 0-100 inclusive
}

async function assignRandomUpvotes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all alternatives
    const alternatives = await Alternative.find({});
    console.log(`Found ${alternatives.length} alternatives to update`);

    let updated = 0;
    let errors = 0;

    for (const alternative of alternatives) {
      try {
        const randomVotes = getRandomUpvotes();
        await Alternative.updateOne(
          { _id: alternative._id },
          { $set: { vote_score: randomVotes } }
        );
        console.log(`✓ ${alternative.name}: ${randomVotes} upvotes`);
        updated++;
      } catch (error) {
        console.error(`✗ Error updating ${alternative.name}:`, error);
        errors++;
      }
    }

    console.log(`\n✅ Upvote assignment complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

assignRandomUpvotes();
