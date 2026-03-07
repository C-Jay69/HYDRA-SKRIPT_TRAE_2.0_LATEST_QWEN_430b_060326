import { BaseWorkflow } from '../baseWorkflow';
import { WorkflowState, NodeOutput } from '../config';
import { analyzeAuthorStyle } from '@/lib/services/styleTrainingService';
import { generateValidationSample } from '@/lib/services/styleTrainingService';
import { prisma } from '@/lib/database/prismaClient';

export class StyleTrainingWorkflow extends BaseWorkflow {
  async execute(): Promise<any> {
    try {
      // Validate inputs first
      const isValid = await this.validateInputs();
      if (!isValid) {
        throw new Error('Invalid inputs for style training');
      }

      await this.updateProgress(5, "Starting style analysis...");

      // Process each node in sequence
      let currentNode = 'validateInputs';
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
    const { styleId, sampleTextPaths } = this.state.context;

    if (!styleId || !sampleTextPaths || sampleTextPaths.length < 3) {
      return false;
    }

    // Check if style exists
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    return !!style;
  }

  protected async processNode(nodeName: string): Promise<NodeOutput> {
    switch (nodeName) {
      case 'validateInputs':
        return await this.validateInputsNode();

      case 'analyzeSamples':
        return await this.analyzeSamplesNode();

      case 'extractPatterns':
        return await this.extractPatternsNode();

      case 'generateEmbedding':
        return await this.generateEmbeddingNode();

      case 'createValidationSample':
        return await this.createValidationSampleNode();

      case 'waitForApproval':
        return await this.waitForApprovalNode();

      default:
        throw new Error(`Unknown node: ${nodeName}`);
    }
  }

  private async validateInputsNode(): Promise<NodeOutput> {
    await this.updateProgress(10, "Validating training samples...");

    return {
      nextState: {
        step: 'analyzeSamples'
      },
      shouldContinue: true,
      nextNode: 'analyzeSamples'
    };
  }

  private async analyzeSamplesNode(): Promise<NodeOutput> {
    await this.updateProgress(20, "Analyzing your writing patterns...");

    const { styleId, sampleTextPaths } = this.state.context;

    const analysisResult = await analyzeAuthorStyle(
      this.state.ownerId,
      styleId,
      sampleTextPaths,
      async (progress, message) => {
        await this.updateProgress(20 + (progress * 0.3), message);
      }
    );

    return {
      nextState: {
        step: 'extractPatterns',
        context: {
          ...this.state.context,
          analysisResult
        }
      },
      shouldContinue: true,
      nextNode: 'extractPatterns'
    };
  }

  private async extractPatternsNode(): Promise<NodeOutput> {
    await this.updateProgress(50, "Extracting linguistic fingerprints...");

    // Patterns are extracted during analysis, so we just advance
    return {
      nextState: {
        step: 'generateEmbedding'
      },
      shouldContinue: true,
      nextNode: 'generateEmbedding'
    };
  }

  private async generateEmbeddingNode(): Promise<NodeOutput> {
    await this.updateProgress(70, "Creating your unique voice signature...");

    // Embedding is generated during analysis, so we just advance
    return {
      nextState: {
        step: 'createValidationSample'
      },
      shouldContinue: true,
      nextNode: 'createValidationSample'
    };
  }

  private async createValidationSampleNode(): Promise<NodeOutput> {
    await this.updateProgress(85, "Generating sample text for your approval...");

    const { styleId } = this.state.context;
    const sampleContent = await generateValidationSample(styleId, 500);

    return {
      nextState: {
        step: 'waitForApproval',
        result: {
          sampleContent,
          status: 'awaiting_approval'
        }
      },
      shouldContinue: false,
      nextNode: 'waitForApproval'
    };
  }

  private async waitForApprovalNode(): Promise<NodeOutput> {
    await this.updateProgress(95, "Waiting for your approval...");

    // This would be handled by the approval API endpoint
    return {
      nextState: {
        step: 'completed',
        result: {
          status: 'waiting_for_approval'
        }
      },
      shouldContinue: false
    };
  }
}
