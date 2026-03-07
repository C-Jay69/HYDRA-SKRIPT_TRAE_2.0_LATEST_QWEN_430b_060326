import { Job } from 'bullmq';
import { BaseHydraWorker } from './baseWorker';
import { generateChapterWithStyle } from '@/lib/services/chapterGenerationService';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';
import logger from '@/lib/utils/logger';

export class ChapterGenerationWorker extends BaseHydraWorker {
  constructor() {
    super('chapter_generation');
  }

  protected async processJob(job: Job): Promise<void> {
    const { ownerId, inputParams } = job.data;

    await JobLifecycleManager.updateJobProgress(
      job.id,
      5,
      "Drafting your next chapter with your unique voice..."
    );

    try {
      const result = await generateChapterWithStyle(
        ownerId,
        inputParams.styleId,
        inputParams.context,
        inputParams.targetWordCount,
        (progress: number, message: string) => {
          JobLifecycleManager.updateJobProgress(job.id, progress, message);
        }
      );

      await JobLifecycleManager.completeJob(job.id, result);
      logger.info(`Chapter generation job ${job.id} completed`);
    } catch (error: any) {
      logger.error(`Chapter generation job ${job.id} failed:`, error);
      await JobLifecycleManager.failJob(job.id, error.message);
      throw error;
    }
  }
}
