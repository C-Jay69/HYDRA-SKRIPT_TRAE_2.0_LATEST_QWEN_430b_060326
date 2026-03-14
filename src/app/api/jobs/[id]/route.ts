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

    const jobId = params.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || job.owner_id !== user.id) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Calculate ETA if still in queue
    let etaSeconds = job.eta_seconds;
    if (job.status === 'queued' && !etaSeconds) {
      // Simplified calculation - would be more sophisticated in production
      etaSeconds = (job.position_in_queue || 0) * 30 + 120;
    }

    return NextResponse.json({
      id: job.id,
      type: job.type,
      status: job.status,
      positionInQueue: job.position_in_queue,
      progressPercent: job.progress_percent,
      progressContextMessage: job.progress_context_message,
      etaSeconds: etaSeconds,
      queuedAt: job.queued_at,
      startedAt: job.started_at,
      finishedAt: job.finished_at,
      failedAt: job.failed_at,
      errorMessage: job.error_message,
      cost: job.cost,
      creditsRefunded: job.credits_refunded,
      cancelRequested: job.cancel_requested,
      outputData: job.output_data
    });
  } catch (error) {
    console.error('Get job status error:', error);
    return NextResponse.json({ message: 'Failed to fetch job status' }, { status: 500 });
  }
}
