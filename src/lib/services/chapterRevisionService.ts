import { prisma } from '@/lib/database/prismaClient';

interface ChapterRevisionInput {
  chapterId: string;
  content: string;
  revisionType: 'manual_edit' | 'ai_regeneration' | 'continuity_fix' | 'author_revision';
  createdBy: 'author' | 'ai_system';
  wordCount?: number;
}

export async function createChapterRevision(
  input: ChapterRevisionInput
): Promise<any> {
  // Get current highest version number
  const latestRevision = await prisma.chapterRevision.findFirst({
    where: { chapter_id: input.chapterId },
    orderBy: { version_number: 'desc' }
  });

  const nextVersion = latestRevision ? latestRevision.version_number + 1 : 1;

  return await prisma.chapterRevision.create({
    data: {
      chapter_id: input.chapterId,
      version_number: nextVersion,
      content: input.content,
      word_count: input.wordCount || input.content.split(/\s+/).filter(Boolean).length,
      revision_type: input.revisionType,
      created_by: input.createdBy
    }
  });
}

export async function getChapterRevisions(chapterId: string): Promise<any[]> {
  return await prisma.chapterRevision.findMany({
    where: { chapter_id: chapterId },
    orderBy: { version_number: 'asc' }
  });
}

export async function getChapterRevision(
  chapterId: string,
  versionNumber: number
): Promise<any | null> {
  return await prisma.chapterRevision.findUnique({
    where: {
      chapter_id_version_number: {
        chapter_id: chapterId,
        version_number: versionNumber
      }
    }
  });
}
