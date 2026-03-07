import { BaseWorkflow } from '../baseWorkflow';
import { WorkflowState, NodeOutput } from '../config';
import { applyContinuityFix } from '@/lib/services/continuityGuardService';
import { prisma } from '@/lib/database/prismaClient';

export class TargetedRewriteWorkflow extends BaseWorkflow {
  async execute(): Promise<any> {
    try {
      const isValid = await this.validateInputs();
      if (!isValid) {
        throw new Error('Invalid inputs for targeted rewrite');
      }

      await this.updateProgress(5, "Preparing focused revision...");

      let currentNode = 'analyzeIssue';
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
    const { continuityIssueId, selectedFix } = this.state.context;
    return !!(continuityIssueId && selectedFix);
  }

  protected async processNode(nodeName: string): Promise<NodeOutput> {
    switch (nodeName) {
      case 'analyzeIssue':
        return await this.analyzeIssueNode();

      case 'generateFix':
        return await this.generateFixNode();

      case 'applyChanges':
        return await this.applyChangesNode();

      case 'verifyFix':
        return await this.verifyFixNode();

      default:
        throw new Error(`Unknown node: ${nodeName}`);
    }
  }

  private async analyzeIssueNode(): Promise<NodeOutput> {
    await this.updateProgress(15, "Understanding the narrative challenge...");

    const { continuityIssueId } = this.state.context;
    const issue = await prisma.continuityIssue.findUnique({
      where: { id: continuityIssueId },
      include: { chapter: true }
    });

    if (!issue) {
      throw new Error('Continuity issue not found');
    }

    return {
      nextState: {
        step: 'generateFix',
        context: {
          ...this.state.context,
          issueDetails: {
            description: issue.description,
            chapterContent: issue.chapter?.content
          }
        }
      },
      shouldContinue: true,
      nextNode: 'generateFix'
    };
  }

  private async generateFixNode(): Promise<NodeOutput> {
    await this.updateProgress(35, "Crafting the perfect solution...");

    // Fix generation happens in the applyContinuityFix function
    return {
      nextState: {
        step: 'applyChanges'
      },
      shouldContinue: true,
      nextNode: 'applyChanges'
    };
  }

  private async applyChangesNode(): Promise<NodeOutput> {
    await this.updateProgress(60, "Implementing your chosen correction...");

    const { continuityIssueId, selectedFix } = this.state.context;

    const applyResult = await applyContinuityFix(
      this.state.ownerId,
      continuityIssueId,
      selectedFix
    );

    return {
      nextState: {
        step: 'verifyFix',
        context: {
          ...this.state.context,
          applyResult
        }
      },
      shouldContinue: true,
      nextNode: 'verifyFix'
    };
  }

  private async verifyFixNode(): Promise<NodeOutput> {
    await this.updateProgress(95, "Confirming the improvement...");

    const { applyResult } = this.state.context;

    return {
      nextState: {
        step: 'completed',
        result: {
          success: applyResult.success,
          content: applyResult.content,
          status: 'fix_applied'
        }
      },
      shouldContinue: false
    };
  }
}
