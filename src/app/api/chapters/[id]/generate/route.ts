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
    const { styleId, generationType, context, targetWordCount } = await request.json();

    // Verify ownership
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || chapter.book?.universe?.owner_id !== user.id) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    // Check credits
    const profile = await prisma.profile.findUnique({
      where: { id: user.id }
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
      user.id,
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
    return NextResponse.json({ message: 'Failed to start chapter generation' }, { status: 500 });
  }
}
