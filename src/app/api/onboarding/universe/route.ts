import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const { title, description, genre, tone } = await request.json();

    // Create universe
    const universe = await prisma.universe.create({
      data: {
        owner_id: user.id,
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
    return NextResponse.json({ message: 'Failed to create universe' }, { status: 500 });
  }
}
