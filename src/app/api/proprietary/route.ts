import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { ProprietarySoftware } from '@/lib/mongodb/models';

export async function GET() {
  try {
    await connectToDatabase();

    const software = await ProprietarySoftware.find({})
      .select('_id name slug')
      .sort({ name: 1 })
      .lean();

    // Transform to match expected format
    const transformedSoftware = software.map(s => ({
      id: s._id,
      name: s.name,
      slug: s.slug
    }));

    return NextResponse.json({ software: transformedSoftware });
  } catch (error) {
    console.error('Error fetching proprietary software:', error);
    return NextResponse.json({ software: [] });
  }
}
