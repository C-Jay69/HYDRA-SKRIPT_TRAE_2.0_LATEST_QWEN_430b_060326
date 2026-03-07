import { prisma } from '@/lib/database/prismaClient';
import { generateTextWithOllama } from '@/lib/ai/ollamaClient';
import { findRelevantContext } from '@/lib/services/continuityGuardService';
import { createChapterRevision } from '@/lib/services/chapterRevisionService';
import logger from '@/lib/utils/logger';

interface ChapterGenerationContext {
  bookId: string;
  styleId: string;
  outline: string;
  direction: string;
  tone: string;
  targetWordCount: number;
  previousChapterId?: string;
}

interface GeneratedChapterResult {
  chapterId: string;
  content: string;
  wordCount: number;
  revisionId: string;
}

export class StyleAwareChapterGenerator {
  static async generateChapter(
    ownerId: string,
    context: ChapterGenerationContext,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<GeneratedChapterResult> {
    progressCallback?.(5, "Loading your writing style profile...");

    // Retrieve style profile
    const style = await prisma.style.findUnique({
      where: { id: context.styleId }
    });

    if (!style || style.training_status !== 'ready') {
      throw new Error('Style profile not ready or not found');
    }

    progressCallback?.(15, "Gathering story context and continuity data...");

    // Get universe context through RAG
    const universeContext = await this.getUniverseContext(context.bookId);

    progressCallback?.(25, "Analyzing previous chapters for flow...");

    // Get previous chapter content for continuity
    let previousContent = "";
    if (context.previousChapterId) {
      const prevChapter = await prisma.chapter.findUnique({
        where: { id: context.previousChapterId }
      });
      previousContent = prevChapter?.content || "";
    }

    progressCallback?.(35, "Crafting your next chapter with your unique voice...");

    // Generate chapter using Ollama with style parameters
    const generatedContent = await this.generateStyledContent(
      style,
      universeContext,
      previousContent,
      context,
      progressCallback
    );

    progressCallback?.(85, "Saving your new chapter...");

    // Save chapter to database
    const chapterIndex = await this.getNextChapterIndex(context.bookId);

    const chapter = await prisma.chapter.create({
      data: {
        book_id: context.bookId,
        owner_id: ownerId,
        index: chapterIndex,
        title: this.generateChapterTitle(context.direction),
        content: generatedContent,
        generation_source: 'ai_generated',
        word_count: generatedContent.split(/\s+/).length,
        ai_contribution_percent: 100,
        timeline: {}, // Will be populated by continuity engine
        content_embedding: Buffer.from([]), // Will be populated later
        draft_version: 1,
        author_notes: "AI-generated draft - requires author review"
      }
    });

    // Create revision entry
    const revision = await createChapterRevision({
      chapterId: chapter.id,
      content: generatedContent,
      revisionType: 'ai_regeneration',
      createdBy: 'ai_system'
    });

    progressCallback?.(100, "Chapter generation complete! Review your new creation.");

    return {
      chapterId: chapter.id,
      content: generatedContent,
      wordCount: chapter.word_count,
      revisionId: revision.id
    };
  }

  private static async getUniverseContext(bookId: string): Promise<string> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { universe: true }
    });

    if (!book || !book.universe) return "";

    // Use pgvector RAG to get relevant context
    const relevantLore = await findRelevantContext(
      book.universe.id,
      book.universe.global_lore ? JSON.stringify(book.universe.global_lore) : ""
    );

    // Get previous chapters for continuity
    const previousChapters = await prisma.chapter.findMany({
      where: { book_id: bookId },
      orderBy: { index: 'asc' },
      take: 3 // Last 3 chapters for context
    });

    const chapterSummaries = previousChapters.map(ch =>
      `Chapter ${ch.index}: ${ch.title}\n${ch.content?.substring(0, 200)}...`
    ).join('\n\n');

    return `
      Universe: ${book.universe.title}
      Description: ${book.universe.description || ''}

      World Lore: ${relevantLore}

      Recent Storyline:
      ${chapterSummaries}
    `;
  }

  private static async generateStyledContent(
    style: any,
    universeContext: string,
    previousContent: string,
    context: ChapterGenerationContext,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<string> {
    progressCallback?.(45, "Weaving together your story elements...");

    // Create detailed prompt incorporating style parameters
    const prompt = this.createStyledPrompt(
      style,
      universeContext,
      previousContent,
      context
    );

    progressCallback?.(60, "Generating content with your voice...");

    // Generate with Ollama using appropriate model
    const response = await generateTextWithOllama(prompt, {
      model: 'mixtral:8x7b', // Powerful open model for generation
      temperature: 0.7,
      max_tokens: context.targetWordCount * 4 // Approximate token count
    });

    return response;
  }

  private static createStyledPrompt(
    style: any,
    universeContext: string,
    previousContent: string,
    context: ChapterGenerationContext
  ): string {
    return `
      You are an AI writing assistant helping an author continue their story.
      Write in EXACTLY the same style as the author, using their unique voice.

      AUTHOR'S STYLE PROFILE:
      - Preferred POV: ${style.pov_preference}
      - Tense: ${style.tense_preference}
      - Average sentence length: ${style.sentence_length_avg}
      - Dialogue ratio: ${Math.round(style.dialogue_ratio * 100)}%
      - Complexity level: ${style.complexity_score}
      - Favorite phrases: ${style.favorite_phrases?.slice(0, 5).join(', ') || 'None specified'}

      STORY CONTEXT:
      ${universeContext}

      PREVIOUS CONTENT:
      ${previousContent.substring(0, 500)}

      CHAPTER DIRECTION:
      ${context.direction}

      OUTLINE TO FOLLOW:
      ${context.outline}

      TARGET LENGTH: Approximately ${context.targetWordCount} words

      TONE: ${context.tone}

      IMPORTANT INSTRUCTIONS:
      1. Maintain the author's exact writing style
      2. Keep consistent with established universe lore
      3. Continue seamlessly from previous content
      4. Follow the provided outline and direction
      5. Match the requested tone
      6. Include natural dialogue if style calls for it
      7. End with a hook for the next chapter
      8. NEVER mention you're an AI or that this is generated content

      Begin writing now:
    `;
  }

  private static async getNextChapterIndex(bookId: string): Promise<number> {
    const lastChapter = await prisma.chapter.findFirst({
      where: { book_id: bookId },
      orderBy: { index: 'desc' }
    });

    return lastChapter ? lastChapter.index + 1 : 1;
  }

  private static generateChapterTitle(direction: string): string {
    // Simple title generation based on direction
    const keywords = direction.split(' ').filter(word =>
      ['adventure', 'mystery', 'battle', 'journey', 'discovery', 'conflict'].includes(word.toLowerCase())
    );

    if (keywords.length > 0) {
      return `The ${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)}`;
    }

    return "New Chapter";
  }
}

export async function generateChapterWithStyle(
  ownerId: string,
  styleId: string,
  generationContext: any,
  targetWordCount: number,
  progressCallback?: (progress: number, message: string) => void
): Promise<GeneratedChapterResult> {
  return StyleAwareChapterGenerator.generateChapter(ownerId, {
    bookId: generationContext.bookId,
    styleId: styleId,
    outline: generationContext.outline,
    direction: generationContext.direction,
    tone: generationContext.tone,
    targetWordCount: targetWordCount,
    previousChapterId: generationContext.previousChapterId
  }, progressCallback);
}
