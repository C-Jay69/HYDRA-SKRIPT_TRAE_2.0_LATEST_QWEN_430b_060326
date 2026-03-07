import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chapterId = params.id;

    // Verify chapter ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const revisions = await prisma.chapterRevision.findMany({
      where: { chapter_id: chapterId },
      orderBy: { version_number: 'asc' }
    });

    return NextResponse.json(revisions);
  } catch (error) {
    console.error('Get chapter revisions error:', error);
    return NextResponse.json({ error: 'Failed to fetch chapter revisions' }, { status: 500 });
  }
}
