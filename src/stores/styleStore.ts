import { create } from 'zustand';

interface Style {
  id: string;
  name: string;
  description?: string;
  training_status: string;
  pov_preference?: string;
  tense_preference?: string;
  sentence_length_avg?: number;
  complexity_score?: number;
  dialogue_ratio?: number;
}

interface StyleStore {
  styles: Style[];
  selectedStyle: Style | null;
  setStyles: (styles: Style[]) => void;
  selectStyle: (style: Style | null) => void;
  fetchStyles: () => Promise<void>;
}

export const useStyleStore = create<StyleStore>((set) => ({
  styles: [],
  selectedStyle: null,

  setStyles: (styles) => set({ styles }),
  selectStyle: (style) => set({ selectedStyle: style }),

  fetchStyles: async () => {
    try {
      const res = await fetch('/api/me/styles');
      if (res.ok) {
        const data = await res.json();
        set({ styles: data });
      }
    } catch (error) {
      console.error('Failed to fetch styles:', error);
    }
  },
}));
