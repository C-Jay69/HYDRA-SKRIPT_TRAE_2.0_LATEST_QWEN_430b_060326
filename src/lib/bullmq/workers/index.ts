import { StyleTrainingWorker } from './styleTrainingWorker';
import { ChapterGenerationWorker } from './chapterGenerationWorker';
import { ContinuityCheckWorker } from './continuityCheckWorker';
import { AudiobookGenerationWorker } from './audiobookGenerationWorker';
import logger from '@/lib/utils/logger';

async function startWorkers() {
  logger.info('Starting BullMQ Workers...');

  try {
    const styleTrainingWorker = new StyleTrainingWorker();
    const chapterGenerationWorker = new ChapterGenerationWorker();
    const continuityCheckWorker = new ContinuityCheckWorker();
    const audiobookGenerationWorker = new AudiobookGenerationWorker();

    logger.info('✅ Style Training Worker started');
    logger.info('✅ Chapter Generation Worker started');
    logger.info('✅ Continuity Check Worker started');
    logger.info('✅ Audiobook Generation Worker started');

    // Keep the process alive
    process.on('SIGTERM', async () => {
      logger.info('Shutting down workers...');
      // Note: BaseHydraWorker or Worker might have close() method
      // if it inherits from bullmq's Worker.
      process.exit(0);
    });

    logger.info('All workers are up and running.');
  } catch (error) {
    logger.error('Failed to start workers:', error);
    process.exit(1);
  }
}

startWorkers();
