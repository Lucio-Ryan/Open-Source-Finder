import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Category } from '@/lib/mongodb/models';

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find({})
      .select('_id name slug')
      .sort({ name: 1 })
      .lean();

    // Transform to match expected format
    const transformedCategories = categories.map(c => ({
      id: c._id,
      name: c.name,
      slug: c.slug
    }));

    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ categories: [] });
  }
}
