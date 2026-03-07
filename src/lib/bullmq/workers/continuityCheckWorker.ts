import { Job } from 'bullmq';
import { BaseHydraWorker } from './baseWorker';
import { checkContinuityAndFix } from '@/lib/services/continuityGuardService';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';
import logger from '@/lib/utils/logger';

export class ContinuityCheckWorker extends BaseHydraWorker {
  constructor() {
    super('continuity_check');
  }

  protected async processJob(job: Job): Promise<void> {
    const { ownerId, inputParams } = job.data;

    await JobLifecycleManager.updateJobProgress(
      job.id,
      5,
      "Scanning your universe for continuity threads..."
    );

    try {
      const result = await checkContinuityAndFix(
        ownerId,
        inputParams.universeId,
        inputParams.chapterId,
        (progress: number, message: string) => {
          JobLifecycleManager.updateJobProgress(job.id, progress, message);
        }
      );

      await JobLifecycleManager.completeJob(job.id, result);
      logger.info(`Continuity check job ${job.id} completed`);
    } catch (error: any) {
      logger.error(`Continuity check job ${job.id} failed:`, error);
      await JobLifecycleManager.failJob(job.id, error.message);
      throw error;
    }
  }
}
