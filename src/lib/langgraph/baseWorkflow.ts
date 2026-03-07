import { WorkflowState, NodeOutput } from './config';
import JobLifecycleManager from '@/lib/bullmq/jobLifecycleManager';

export abstract class BaseWorkflow {
  protected state: WorkflowState;

  constructor(initialState: WorkflowState) {
    this.state = initialState;
  }

  abstract execute(): Promise<any>;

  protected async updateProgress(progress: number, message: string): Promise<void> {
    this.state.progress = progress;
    this.state.progressMessage = message;

    await JobLifecycleManager.updateJobProgress(
      this.state.jobId,
      progress,
      message
    );
  }

  protected async handleError(error: any): Promise<void> {
    this.state.error = error.message;
    await JobLifecycleManager.failJob(this.state.jobId, error.message);
    throw error;
  }

  protected abstract validateInputs(): Promise<boolean>;
  protected abstract processNode(nodeName: string): Promise<NodeOutput>;
}
