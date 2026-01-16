import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import { Category, Alternative } from '@/lib/mongodb/models';

export async function GET(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
    },
    tests: {},
  };

  // Test database connection
  try {
    await connectDB();
    debugInfo.tests.connection = {
      success: true,
      message: 'MongoDB connected successfully',
    };
  } catch (err: any) {
    debugInfo.tests.connection = {
      success: false,
      error: err.message,
    };
    return NextResponse.json(debugInfo, { status: 200 });
  }

  // Test categories query
  try {
    const categories = await Category.find().select('name').limit(3).lean();
    
    debugInfo.tests.categoriesQuery = {
      success: true,
      count: categories?.length || 0,
      sample: categories?.slice(0, 2).map((c: any) => ({ id: c._id, name: c.name })) || [],
    };
  } catch (err: any) {
    debugInfo.tests.categoriesQuery = {
      success: false,
      error: err.message,
    };
  }

  // Test alternatives query
  try {
    const alternatives = await Alternative.find().select('name slug').limit(3).lean();
    
    debugInfo.tests.alternativesQuery = {
      success: true,
      count: alternatives?.length || 0,
      sample: alternatives?.slice(0, 2).map((a: any) => ({ id: a._id, name: a.name, slug: a.slug })) || [],
    };
  } catch (err: any) {
    debugInfo.tests.alternativesQuery = {
      success: false,
      error: err.message,
    };
  }

  // Test insert capability
  try {
    const testSlug = `debug-test-${Date.now()}`;
    const testEntry = await Alternative.create({
      name: 'Debug Test',
      slug: testSlug,
      description: 'Test entry - will be deleted',
      website: 'https://test.com',
      github: 'https://github.com/test/test',
      health_score: 50,
      approved: false,
      featured: false,
    });

    // Clean up test entry
    await Alternative.findByIdAndDelete(testEntry._id);
    debugInfo.tests.insertCapability = {
      success: true,
      message: 'Insert and delete successful',
    };
  } catch (err: any) {
    debugInfo.tests.insertCapability = {
      success: false,
      error: err.message,
    };
  }

  return NextResponse.json(debugInfo, { status: 200 });
}
