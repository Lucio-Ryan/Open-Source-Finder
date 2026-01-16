import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { TechStack } from '@/lib/mongodb/models';

export async function GET() {
  try {
    await connectToDatabase();
    
    const techStacks = await TechStack.find({})
      .select('_id name slug type')
      .sort({ name: 1 })
      .lean();

    // Transform to match expected format
    const transformedTechStacks = techStacks.map(ts => ({
      id: ts._id,
      name: ts.name,
      slug: ts.slug,
      type: ts.type
    }));

    return NextResponse.json({ techStacks: transformedTechStacks });
  } catch (error) {
    console.error('Error in tech-stacks API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
