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

    const chapterId = params.id;

    // Verify chapter ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== user.id) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    const revisions = await prisma.chapterRevision.findMany({
      where: { chapter_id: chapterId },
      orderBy: { version_number: 'asc' }
    });

    return NextResponse.json(revisions);
  } catch (error) {
    console.error('Get chapter revisions error:', error);
    return NextResponse.json({ message: 'Failed to fetch chapter revisions' }, { status: 500 });
  }
}
