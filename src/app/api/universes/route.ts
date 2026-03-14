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

    const universes = await prisma.universe.findMany({
      where: { owner_id: user.id },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(universes);
  } catch (error) {
    console.error('Get universes error:', error);
    return NextResponse.json({ message: 'Failed to fetch universes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const { title, description, genre, tone } = await request.json();

    const universe = await prisma.universe.create({
      data: {
        owner_id: user.id,
        title,
        description,
        genre,
        tone
      }
    });

    return NextResponse.json(universe);
  } catch (error) {
    console.error('Create universe error:', error);
    return NextResponse.json({ message: 'Failed to create universe' }, { status: 500 });
  }
}
