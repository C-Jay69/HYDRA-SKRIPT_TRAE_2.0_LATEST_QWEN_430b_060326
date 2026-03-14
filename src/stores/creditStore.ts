import { create } from 'zustand';

interface CreditTransaction {
  id: string;
  amount: number;
  source_type: string;
  balance_after: number;
  created_at: string;
}

interface EarningActivity {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  icon_emoji: string;
  credit_reward: number;
  requirement_description: string;
}

interface CreditStore {
  balance: number;
  recentTransactions: CreditTransaction[];
  earningActivities: EarningActivity[];
  setBalance: (balance: number) => void;
  setTransactions: (txns: CreditTransaction[]) => void;
  setActivities: (activities: EarningActivity[]) => void;
  fetchCredits: () => Promise<void>;
}

export const useCreditStore = create<CreditStore>((set) => ({
  balance: 0,
  recentTransactions: [],
  earningActivities: [],

  setBalance: (balance) => set({ balance }),
  setTransactions: (txns) => set({ recentTransactions: txns }),
  setActivities: (activities) => set({ earningActivities: activities }),

  fetchCredits: async () => {
    try {
      const res = await fetch('/api/me/credits');
      if (res.ok) {
        const data = await res.json();
        set({
          balance: data.balance,
          recentTransactions: data.recentTransactions || [],
          earningActivities: data.availableEarningActivities || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  },
}));
