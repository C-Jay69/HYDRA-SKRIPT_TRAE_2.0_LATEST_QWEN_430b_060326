import { prisma } from '@/lib/database/prismaClient';
import { refundCredits } from '@/lib/services/creditService';
import logger from '@/lib/utils/logger';

export class JobLifecycleManager {
  static async createJob(
    ownerId: string,
    type: string,
    inputParams: any,
    cost: number
  ) {
    return await prisma.job.create({
      data: {
        owner_id: ownerId,
        type,
        status: 'queued',
        input_params: inputParams,
        cost,
        progress_percent: 0,
        progress_context_message: 'Waiting in queue...'
      }
    });
  }

  static async updateJobProgress(
    jobId: string,
    progressPercent: number,
    contextMessage: string
  ) {
    return await prisma.job.update({
      where: { id: jobId },
      data: {
        progress_percent: progressPercent,
        progress_context_message: contextMessage,
        status: 'processing',
        started_at: progressPercent === 0 ? new Date() : undefined
      }
    });
  }

  static async completeJob(jobId: string, outputData: any) {
    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress_percent: 100,
        progress_context_message: 'Job completed successfully!',
        output_data: outputData,
        finished_at: new Date()
      }
    });
  }

  static async failJob(jobId: string, errorMessage: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (job && job.cost && !job.credits_refunded) {
      await refundCredits(job.owner_id, job.cost, jobId);
    }

    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error_message: errorMessage,
        failed_at: new Date(),
        credits_refunded: true
      }
    });
  }

  static async cancelJob(jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (job && job.status !== 'completed' && job.status !== 'failed') {
      if (job.cost && !job.credits_refunded) {
        // Simple full refund for now, pro-rata can be added later
        await refundCredits(job.owner_id, job.cost, jobId);
      }

      return await prisma.job.update({
        where: { id: jobId },
        data: {
          status: 'cancelled',
          cancel_requested: true,
          credits_refunded: true
        }
      });
    }

    return job;
  }
}

export default JobLifecycleManager;
