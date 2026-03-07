import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get latest metrics from AuthorMetrics table
    const metrics = await prisma.authorMetrics.findUnique({
      where: { profile_id: session.user.id }
    });

    if (!metrics) {
      return NextResponse.json({
        error: 'Metrics not available'
      }, { status: 404 });
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
