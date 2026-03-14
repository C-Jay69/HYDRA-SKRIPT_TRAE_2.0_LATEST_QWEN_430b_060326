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

    const styleId = params.id;
    const { sampleTextPaths } = await request.json();

    // Verify ownership
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!style || style.owner_id !== user.id) {
      return NextResponse.json({ message: 'Style not found' }, { status: 404 });
    }

    // Create job
    const job = await JobLifecycleManager.createJob(
      user.id,
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
    return NextResponse.json({ message: 'Failed to start style training' }, { status: 500 });
  }
}
