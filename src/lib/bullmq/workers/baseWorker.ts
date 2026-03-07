import { Worker, Job } from 'bullmq';
import { prisma } from '@/lib/database/prismaClient';
import { deductCredits } from '@/lib/services/creditService';
import logger from '@/lib/utils/logger';

export abstract class BaseHydraWorker {
  protected worker: Worker;

  constructor(queueName: string) {
    this.worker = new Worker(queueName, async (job: Job) => {
      try {
        await this.processJob(job);

        // Deduct credits upon successful completion
        if (job.data.cost && !job.data.creditsDeducted) {
          await deductCredits(job.data.ownerId, job.data.cost, job.id);
          await job.update({ ...job.data, creditsDeducted: true });
        }

        logger.info(`Job ${job.id} completed successfully`);
      } catch (error: any) {
        logger.error(`Job ${job.id} failed:`, error);
        
        // Auto-refund credits on failure (handled in creditService)
        // This is a placeholder for the actual refund logic
        
        throw error; // Re-throw to mark job as failed
      }
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      }
    });
  }

  protected abstract processJob(job: Job): Promise<void>;
}
