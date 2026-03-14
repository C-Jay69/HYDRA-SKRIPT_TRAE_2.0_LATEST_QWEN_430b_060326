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

    const styles = await prisma.style.findMany({
      where: { owner_id: user.id, soft_deleted_at: null },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(styles);
  } catch (error) {
    console.error('Get user styles failed:', error);
    return NextResponse.json({ message: 'Failed to fetch styles' }, { status: 500 });
  }
}
