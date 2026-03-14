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

    const activities = await prisma.creditEarningActivity.findMany({
      where: { profile_id: user.id, is_active: true }
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json({ message: 'Failed to fetch activities' }, { status: 500 });
  }
}
