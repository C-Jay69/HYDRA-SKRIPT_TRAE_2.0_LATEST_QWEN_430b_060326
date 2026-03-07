import { BaseWorkflow } from '../baseWorkflow';
import { WorkflowState, NodeOutput } from '../config';
import { generateChapterWithStyle } from '@/lib/services/chapterGenerationService';
import { checkContinuityAndFix } from '@/lib/services/continuityGuardService';
import { prisma } from '@/lib/database/prismaClient';

export class ChapterGenerationWorkflow extends BaseWorkflow {
  async execute(): Promise<any> {
    try {
      const isValid = await this.validateInputs();
      if (!isValid) {
        throw new Error('Invalid inputs for chapter generation');
      }

      await this.updateProgress(5, "Preparing your story canvas...");

      let currentNode = 'prepareContext';
      let continueProcessing = true;

      while (continueProcessing && currentNode) {
        const nodeOutput = await this.processNode(currentNode);

        if (nodeOutput.nextState) {
          this.state = { ...this.state, ...nodeOutput.nextState };
        }

        if (nodeOutput.shouldContinue === false) {
          continueProcessing = false;
        }

        currentNode = nodeOutput.nextNode || '';
      }

      return this.state.result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  protected async validateInputs(): Promise<boolean> {
    const { bookId, styleId, context, targetWordCount } = this.state.context;

    if (!bookId || !styleId || !context || !targetWordCount) {
      return false;
    }

    // Validate book and style exist
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    return !!(book && style && style.training_status === 'ready');
  }

  protected async processNode(nodeName: string): Promise<NodeOutput> {
    switch (nodeName) {
      case 'prepareContext':
        return await this.prepareContextNode();

      case 'retrieveStyle':
        return await this.retrieveStyleNode();

      case 'fetchUniverseContext':
        return await this.fetchUniverseContextNode();

      case 'generateContent':
        return await this.generateContentNode();

      case 'checkContinuity':
        return await this.checkContinuityNode();

      case 'saveChapter':
        return await this.saveChapterNode();

      default:
        throw new Error(`Unknown node: ${nodeName}`);
    }
  }

  private async prepareContextNode(): Promise<NodeOutput> {
    await this.updateProgress(10, "Setting up your creative environment...");

    return {
      nextState: {
        step: 'retrieveStyle'
      },
      shouldContinue: true,
      nextNode: 'retrieveStyle'
    };
  }

  private async retrieveStyleNode(): Promise<NodeOutput> {
    await this.updateProgress(15, "Loading your unique writing style...");

    const { styleId } = this.state.context;
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!style) {
      throw new Error('Style not found');
    }

    return {
      nextState: {
        step: 'fetchUniverseContext',
        context: {
          ...this.state.context,
          style
        }
      },
      shouldContinue: true,
      nextNode: 'fetchUniverseContext'
    };
  }

  private async fetchUniverseContextNode(): Promise<NodeOutput> {
    await this.updateProgress(25, "Gathering your story's rich context...");

    // Universe context is fetched within the generation service
    return {
      nextState: {
        step: 'generateContent'
      },
      shouldContinue: true,
      nextNode: 'generateContent'
    };
  }

  private async generateContentNode(): Promise<NodeOutput> {
    await this.updateProgress(35, "Weaving your next chapter with care...");

    const { bookId, styleId, context, targetWordCount } = this.state.context;

    const result = await generateChapterWithStyle(
      this.state.ownerId,
      styleId,
      {
        bookId,
        outline: context.outline,
        direction: context.direction,
        tone: context.tone,
        targetWordCount,
        previousChapterId: context.previousChapterId
      },
      targetWordCount,
      async (progress, message) => {
        await this.updateProgress(35 + (progress * 0.3), message);
      }
    );

    return {
      nextState: {
        step: 'checkContinuity',
        context: {
          ...this.state.context,
          generatedChapter: result
        }
      },
      shouldContinue: true,
      nextNode: 'checkContinuity'
    };
  }

  private async checkContinuityNode(): Promise<NodeOutput> {
    await this.updateProgress(70, "Ensuring perfect narrative flow...");

    const { generatedChapter } = this.state.context;
    const chapter = await prisma.chapter.findUnique({
      where: { id: generatedChapter.chapterId },
      include: { book: { include: { universe: true } } }
    });

    if (!chapter || !chapter.book?.universe) {
      throw new Error('Chapter or universe not found');
    }

    const continuityResult = await checkContinuityAndFix(
      this.state.ownerId,
      chapter.book.universe.id,
      generatedChapter.chapterId,
      async (progress, message) => {
        await this.updateProgress(70 + (progress * 0.2), message);
      }
    );

    return {
      nextState: {
        step: 'saveChapter',
        context: {
          ...this.state.context,
          continuityResult
        }
      },
      shouldContinue: true,
      nextNode: 'saveChapter'
    };
  }

  private async saveChapterNode(): Promise<NodeOutput> {
    await this.updateProgress(95, "Preserving your masterpiece...");

    const { generatedChapter } = this.state.context;

    return {
      nextState: {
        step: 'completed',
        result: {
          chapterId: generatedChapter.chapterId,
          revisionId: generatedChapter.revisionId,
          wordCount: generatedChapter.wordCount,
          status: 'success'
        }
      },
      shouldContinue: false
    };
  }
}
