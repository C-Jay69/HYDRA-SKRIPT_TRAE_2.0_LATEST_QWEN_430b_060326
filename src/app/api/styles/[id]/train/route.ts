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

    const styleId = params.id;
    const { sampleTextPaths } = await request.json();

    // Verify ownership
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!style || style.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Style not found' }, { status: 404 });
    }

    // Create job
    const job = await JobLifecycleManager.createJob(
      session.user.id,
      'style_training',
      {
        styleId,
        sampleTextPaths
      },
      15 // Cost for style training
    );

    return NextResponse.json({
      jobId: job.id,
      queuePosition: 1,
      estimatedWaitTime: 120
    });
  } catch (error) {
    console.error('Style training job creation error:', error);
    return NextResponse.json({ error: 'Failed to start style training' }, { status: 500 });
  }
}
