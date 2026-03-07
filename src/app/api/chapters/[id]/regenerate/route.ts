import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chapterId = params.id;
    const { styleId, context, targetWordCount } = await request.json();

    // Verify chapter ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Create job for regeneration
    const job = await JobLifecycleManager.createJob(
      session.user.id,
      'chapter_generation',
      {
        chapterId,
        styleId,
        generationType: 'regenerate',
        context,
        targetWordCount: targetWordCount || chapter.word_count
      },
      10 + Math.ceil((targetWordCount || chapter.word_count) / 500)
    );

    return NextResponse.json({
      jobId: job.id,
      queuePosition: 1,
      estimatedWaitTime: 180
    });
  } catch (error) {
    console.error('Chapter regeneration job creation error:', error);
    return NextResponse.json({ error: 'Failed to start chapter regeneration' }, { status: 500 });
  }
}
