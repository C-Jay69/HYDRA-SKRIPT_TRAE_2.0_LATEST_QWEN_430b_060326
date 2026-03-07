import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, genre, tone } = await request.json();

    // Create universe
    const universe = await prisma.universe.create({
      data: {
        owner_id: session.user.id,
        title,
        description,
        genre,
        tone,
        global_lore: {},
        global_characters: {}
      }
    });

    return NextResponse.json(universe);
  } catch (error) {
    console.error('Create universe error:', error);
    return NextResponse.json({ error: 'Failed to create universe' }, { status: 500 });
  }
}
