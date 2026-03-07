import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const universes = await prisma.universe.findMany({
      where: { owner_id: session.user.id },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(universes);
  } catch (error) {
    console.error('Get universes error:', error);
    return NextResponse.json({ error: 'Failed to fetch universes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, genre, tone } = await request.json();

    const universe = await prisma.universe.create({
      data: {
        owner_id: session.user.id,
        title,
        description,
        genre,
        tone
      }
    });

    return NextResponse.json(universe);
  } catch (error) {
    console.error('Create universe error:', error);
    return NextResponse.json({ error: 'Failed to create universe' }, { status: 500 });
  }
}
