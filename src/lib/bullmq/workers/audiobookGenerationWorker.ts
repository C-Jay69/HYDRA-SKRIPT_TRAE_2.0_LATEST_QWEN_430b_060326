import { Job } from 'bullmq';
import { BaseHydraWorker } from './baseWorker';
import { generateAudiobook } from '@/lib/services/audiobookService';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';
import logger from '@/lib/utils/logger';

export class AudiobookGenerationWorker extends BaseHydraWorker {
  constructor() {
    super('audiobook_generation');
  }

  protected async processJob(job: Job): Promise<void> {
    const { ownerId, inputParams } = job.data;

    await JobLifecycleManager.updateJobProgress(
      job.id,
      5,
      "Preparing your manuscript for voice..."
    );

    try {
      const result = await generateAudiobook(
        ownerId,
        inputParams.bookId,
        inputParams.voiceProfile,
        (progress: number, message: string) => {
          JobLifecycleManager.updateJobProgress(job.id, progress, message);
        }
      );

      await JobLifecycleManager.completeJob(job.id, {
        audiobookUrl: result.audiobookUrl,
        duration: result.duration,
        fileSize: result.fileSize
      });

      logger.info(`Audiobook generation job ${job.id} completed`);
    } catch (error: any) {
      logger.error(`Audiobook generation job ${job.id} failed:`, error);
      await JobLifecycleManager.failJob(job.id, error.message);
      throw error;
    }
  }
}
