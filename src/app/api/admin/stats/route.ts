import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/mongodb/auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, Alternative, Category, TechStack } from '@/lib/mongodb/models';

// Verify admin role
async function verifyAdmin() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  await connectToDatabase();
  
  const profile = await User.findById(user.id).select('role').lean();

  if (!profile || profile.role !== 'admin') {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, userId: user.id };
}

export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    await connectToDatabase();

    // Get stats in parallel
    const [totalAlternatives, pendingSubmissions, totalCategories, totalTechStacks, totalUsers] = await Promise.all([
      Alternative.countDocuments(),
      Alternative.countDocuments({ approved: false }),
      Category.countDocuments(),
      TechStack.countDocuments(),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      totalAlternatives,
      pendingSubmissions,
      totalCategories,
      totalTechStacks,
      totalUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
