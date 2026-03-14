import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    // Get latest metrics from AuthorMetrics table
    const metrics = await prisma.authorMetrics.findUnique({
      where: { profile_id: user.id }
    });

    if (!metrics) {
      return NextResponse.json({
        error: 'Metrics not available'
      }, { status: 404 });
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json({ message: 'Failed to fetch metrics' }, { status: 500 });
  }
}
