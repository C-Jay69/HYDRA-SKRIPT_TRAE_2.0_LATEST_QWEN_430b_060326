import { Job } from 'bullmq';
import { BaseHydraWorker } from './baseWorker';
import { analyzeAuthorStyle } from '@/lib/services/styleTrainingService';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';
import logger from '@/lib/utils/logger';

export class StyleTrainingWorker extends BaseHydraWorker {
  constructor() {
    super('style_training');
  }

  protected async processJob(job: Job): Promise<void> {
    const { ownerId, inputParams } = job.data;

    await JobLifecycleManager.updateJobProgress(
      job.id,
      5,
      "Starting your style analysis..."
    );

    try {
      const result = await analyzeAuthorStyle(
        ownerId,
        inputParams.styleId,
        inputParams.sampleTextPaths,
        (progress: number, message: string) => {
          JobLifecycleManager.updateJobProgress(job.id, progress, message);
        }
      );

      await JobLifecycleManager.completeJob(job.id, result);
      logger.info(`Style training job ${job.id} completed`);
    } catch (error: any) {
      logger.error(`Style training job ${job.id} failed:`, error);
      await JobLifecycleManager.failJob(job.id, error.message);
      throw error;
    }
  }
}
