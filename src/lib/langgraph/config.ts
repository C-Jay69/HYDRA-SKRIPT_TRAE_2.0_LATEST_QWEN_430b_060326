export interface WorkflowState {
  ownerId: string;
  jobId: string;
  step: string;
  context: any;
  result: any;
  error?: string;
  progress: number;
  progressMessage: string;
}

export interface NodeOutput {
  nextState: Partial<WorkflowState>;
  shouldContinue: boolean;
  nextNode?: string;
}

export const WORKFLOW_CONFIG = {
  styleTraining: {
    nodes: [
      'validateInputs',
      'analyzeSamples',
      'extractPatterns',
      'generateEmbedding',
      'createValidationSample',
      'waitForApproval'
    ],
    edges: {
      validateInputs: 'analyzeSamples',
      analyzeSamples: 'extractPatterns',
      extractPatterns: 'generateEmbedding',
      generateEmbedding: 'createValidationSample',
      createValidationSample: 'waitForApproval'
    }
  },
  chapterGeneration: {
    nodes: [
      'prepareContext',
      'retrieveStyle',
      'fetchUniverseContext',
      'generateContent',
      'checkContinuity',
      'saveChapter'
    ],
    edges: {
      prepareContext: 'retrieveStyle',
      retrieveStyle: 'fetchUniverseContext',
      fetchUniverseContext: 'generateContent',
      generateContent: 'checkContinuity',
      checkContinuity: 'saveChapter'
    }
  },
  continuityCheck: {
    nodes: [
      'scanContent',
      'identifyIssues',
      'autoFixAttempt',
      'reportResults'
    ],
    edges: {
      scanContent: 'identifyIssues',
      identifyIssues: 'autoFixAttempt',
      autoFixAttempt: 'reportResults'
    }
  },
  targetedRewrite: {
    nodes: [
      'analyzeIssue',
      'generateFix',
      'applyChanges',
      'verifyFix'
    ],
    edges: {
      analyzeIssue: 'generateFix',
      generateFix: 'applyChanges',
      applyChanges: 'verifyFix'
    }
  }
};
