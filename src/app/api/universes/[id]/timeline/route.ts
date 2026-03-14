import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const universeId = params.id;
    const { searchParams } = new URL(request.url);
    const characterFilter = searchParams.get('character');

    // Verify universe ownership
    const universe = await prisma.universe.findUnique({
      where: { id: universeId }
    });

    if (!universe || universe.owner_id !== user.id) {
      return NextResponse.json({ message: 'Universe not found' }, { status: 404 });
    }

    // Get continuity events
    const whereClause: any = { universe_id: universeId };
    if (characterFilter) {
      whereClause.character_name = characterFilter;
    }

    const events = await prisma.continuityEvent.findMany({
      where: whereClause,
      orderBy: [
        { chapter_index: 'asc' },
        { created_at: 'asc' }
      ],
      include: {
        chapter: true
      }
    });

    // Group by character if no filter
    const groupedEvents: any = {};

    if (!characterFilter) {
      events.forEach(event => {
        const character = event.character_name || 'Unknown';
        if (!groupedEvents[character]) {
          groupedEvents[character] = [];
        }
        groupedEvents[character].push(event);
      });
    }

    // Get unresolved continuity issues for these events
    const eventIds = events.map(e => e.id);
    const issues = eventIds.length > 0
      ? await prisma.continuityIssue.findMany({
          where: {
            continuity_event_id: { in: eventIds },
            resolved: false
          }
        })
      : [];

    return NextResponse.json({
      events: characterFilter ? events : groupedEvents,
      unresolvedIssues: issues
    });
  } catch (error) {
    console.error('Get timeline error:', error);
    return NextResponse.json({ message: 'Failed to fetch timeline' }, { status: 500 });
  }
}
