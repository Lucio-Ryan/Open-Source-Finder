import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('MONGODB_URI:', MONGODB_URI ? `${MONGODB_URI.substring(0, 30)}...` : 'NOT SET');

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  icon: String,
  created_at: Date,
});

const AlternativeSchema = new mongoose.Schema({
  name: String,
  slug: String,
  approved: Boolean,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

async function testQuery() {
  try {
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Test getCategoryBySlug for '3d-animation'
    console.log('\n🔍 Testing getCategoryBySlug("3d-animation")...');
    const category = await Category.findOne({ slug: '3d-animation' }).lean();
    
    if (!category) {
      console.log('❌ Category not found!');
    } else {
      console.log('✅ Category found:', JSON.stringify(category, null, 2));
      
      // Count alternatives in this category
      const count = await Alternative.countDocuments({
        categories: (category as any)._id,
        approved: true,
      });
      console.log(`\n📊 Alternatives in this category: ${count}`);
      
      // List them
      const alts = await Alternative.find({
        categories: (category as any)._id,
        approved: true,
      }).select('name slug').lean();
      
      console.log('Alternatives:');
      alts.forEach((a: any) => console.log(`  - ${a.name} (${a.slug})`));
    }

    // Test a simpler query
    console.log('\n🔍 Testing basic Alternative query...');
    const allApproved = await Alternative.countDocuments({ approved: true });
    console.log(`Total approved alternatives: ${allApproved}`);

    // Get featured alternatives (like the home page does)
    console.log('\n🔍 Testing featured alternatives query...');
    const featured = await Alternative.find({
      approved: true,
      featured: true,
    }).limit(5).select('name slug').lean();
    
    console.log(`Featured alternatives (first 5):`);
    featured.forEach((a: any) => console.log(`  - ${a.name}`));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testQuery();
