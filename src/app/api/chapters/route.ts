import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { book_id: bookId, owner_id: session.user.id },
      orderBy: { index: 'asc' }
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Get chapters error:', error);
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, title, content } = await request.json();

    const lastChapter = await prisma.chapter.findFirst({
      where: { book_id: bookId },
      orderBy: { index: 'desc' }
    });

    const nextIndex = (lastChapter?.index || 0) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        book_id: bookId,
        owner_id: session.user.id,
        index: nextIndex,
        title,
        content,
        generation_source: 'manual',
        word_count: content?.split(/\s+/).filter(Boolean).length || 0
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Create chapter error:', error);
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 });
  }
}
