import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const chapterGenerationQueue = new Queue('chapter_generation', { connection });
export const styleTrainingQueue = new Queue('style_training', { connection });
export const continuityCheckQueue = new Queue('continuity_check', { connection });
export const audiobookGenerationQueue = new Queue('audiobook_generation', { connection });

export const queues = {
  chapterGeneration: chapterGenerationQueue,
  styleTraining: styleTrainingQueue,
  continuityCheck: continuityCheckQueue,
  audiobookGeneration: audiobookGenerationQueue,
};

export default queues;
