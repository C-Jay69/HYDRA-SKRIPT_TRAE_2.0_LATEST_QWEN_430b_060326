import { StyleTrainingWorkflow } from './workflows/styleTrainingWorkflow';
import { ChapterGenerationWorkflow } from './workflows/chapterGenerationWorkflow';
import { ContinuityCheckWorkflow } from './workflows/continuityCheckWorkflow';
import { TargetedRewriteWorkflow } from './workflows/targetedRewriteWorkflow';
import { WorkflowState } from './config';

export class WorkflowExecutor {
  static async executeWorkflow(
    workflowType: string,
    initialState: WorkflowState
  ): Promise<any> {
    let workflow: any;

    switch (workflowType) {
      case 'style_training':
        workflow = new StyleTrainingWorkflow(initialState);
        break;

      case 'chapter_generation':
        workflow = new ChapterGenerationWorkflow(initialState);
        break;

      case 'continuity_check':
        workflow = new ContinuityCheckWorkflow(initialState);
        break;

      case 'targeted_rewrite':
        workflow = new TargetedRewriteWorkflow(initialState);
        break;

      default:
        throw new Error(`Unknown workflow type: ${workflowType}`);
    }

    return await workflow.execute();
  }
}
