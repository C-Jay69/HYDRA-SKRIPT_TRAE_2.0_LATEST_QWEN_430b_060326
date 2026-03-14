import { create } from 'zustand';

interface Job {
  id: string;
  type: string;
  status: string;
  progressPercent: number;
  progressContextMessage: string;
  etaSeconds?: number;
  cost?: number;
}

interface JobStore {
  activeJob: Job | null;
  recentJobs: Job[];
  setActiveJob: (job: Job | null) => void;
  updateJobProgress: (jobId: string, progress: number, message: string) => void;
  addRecentJob: (job: Job) => void;
  clearActiveJob: () => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  activeJob: null,
  recentJobs: [],

  setActiveJob: (job) => set({ activeJob: job }),

  updateJobProgress: (jobId, progress, message) => {
    const { activeJob } = get();
    if (activeJob && activeJob.id === jobId) {
      set({
        activeJob: {
          ...activeJob,
          progressPercent: progress,
          progressContextMessage: message,
          status: progress >= 100 ? 'completed' : 'processing',
        }
      });
    }
  },

  addRecentJob: (job) => set((state) => ({
    recentJobs: [job, ...state.recentJobs].slice(0, 20)
  })),

  clearActiveJob: () => set({ activeJob: null }),
}));
