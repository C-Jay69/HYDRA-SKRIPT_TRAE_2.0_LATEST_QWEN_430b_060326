import { BaseWorkflow } from '../baseWorkflow';
import { WorkflowState, NodeOutput } from '../config';
import { checkContinuityAndFix } from '@/lib/services/continuityGuardService';
import { prisma } from '@/lib/database/prismaClient';

export class ContinuityCheckWorkflow extends BaseWorkflow {
  async execute(): Promise<any> {
    try {
      const isValid = await this.validateInputs();
      if (!isValid) {
        throw new Error('Invalid inputs for continuity check');
      }

      await this.updateProgress(5, "Beginning deep continuity scan...");

      let currentNode = 'scanContent';
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
    const { universeId, chapterId } = this.state.context;
    return !!(universeId && chapterId);
  }

  protected async processNode(nodeName: string): Promise<NodeOutput> {
    switch (nodeName) {
      case 'scanContent':
        return await this.scanContentNode();

      case 'identifyIssues':
        return await this.identifyIssuesNode();

      case 'autoFixAttempt':
        return await this.autoFixAttemptNode();

      case 'reportResults':
        return await this.reportResultsNode();

      default:
        throw new Error(`Unknown node: ${nodeName}`);
    }
  }

  private async scanContentNode(): Promise<NodeOutput> {
    await this.updateProgress(15, "Scanning for narrative inconsistencies...");

    return {
      nextState: {
        step: 'identifyIssues'
      },
      shouldContinue: true,
      nextNode: 'identifyIssues'
    };
  }

  private async identifyIssuesNode(): Promise<NodeOutput> {
    await this.updateProgress(35, "Identifying potential continuity threads...");

    const { chapterId } = this.state.context;
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId }
    });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    // Issues are identified during the checkAndAutoFix process
    return {
      nextState: {
        step: 'autoFixAttempt'
      },
      shouldContinue: true,
      nextNode: 'autoFixAttempt'
    };
  }

  private async autoFixAttemptNode(): Promise<NodeOutput> {
    await this.updateProgress(55, "Attempting seamless corrections...");

    const { universeId, chapterId } = this.state.context;
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId }
    });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    const fixResult = await checkContinuityAndFix(
      this.state.ownerId,
      universeId,
      chapterId,
      async (progress, message) => {
        await this.updateProgress(55 + (progress * 0.3), message);
      }
    );

    return {
      nextState: {
        step: 'reportResults',
        context: {
          ...this.state.context,
          fixResult
        }
      },
      shouldContinue: true,
      nextNode: 'reportResults'
    };
  }

  private async reportResultsNode(): Promise<NodeOutput> {
    await this.updateProgress(90, "Compiling your continuity report...");

    const { fixResult } = this.state.context;

    return {
      nextState: {
        step: 'completed',
        result: {
          success: fixResult.success,
          content: fixResult.content,
          issuesFixed: fixResult.issuesFixed,
          status: fixResult.success ? 'fixed' : 'requires_review'
        }
      },
      shouldContinue: false
    };
  }
}
