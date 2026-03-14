import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';

export async function POST(
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
    const { styleId, context, targetWordCount } = await request.json();

    // Verify chapter ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== user.id) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    // Create job for regeneration
    const job = await JobLifecycleManager.createJob(
      user.id,
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
    return NextResponse.json({ message: 'Failed to start chapter regeneration' }, { status: 500 });
  }
}
