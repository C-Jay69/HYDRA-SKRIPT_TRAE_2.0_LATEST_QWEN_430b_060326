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
    const { styleId, generationType, context, targetWordCount } = await request.json();

    // Verify ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Check credits
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id }
    });

    const creditCost = 10 + Math.ceil(targetWordCount / 500);
    if (!profile || profile.credit_balance < creditCost) {
      return NextResponse.json({
        error: 'INSUFFICIENT_CREDITS',
        creditCost,
        currentBalance: profile?.credit_balance || 0
      }, { status: 402 });
    }

    // Create job
    const job = await JobLifecycleManager.createJob(
      session.user.id,
      'chapter_generation',
      {
        chapterId,
        styleId,
        generationType,
        context,
        targetWordCount
      },
      creditCost
    );

    return NextResponse.json({
      jobId: job.id,
      queuePosition: 1, // Would be dynamic
      estimatedWaitTime: 180 // Would be calculated
    });
  } catch (error) {
    console.error('Chapter generation job creation error:', error);
    return NextResponse.json({ error: 'Failed to start chapter generation' }, { status: 500 });
  }
}
