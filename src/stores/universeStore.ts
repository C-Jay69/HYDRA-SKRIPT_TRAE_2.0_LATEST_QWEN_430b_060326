import { create } from 'zustand';

interface Universe {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  tone?: string;
  global_lore?: any;
  global_characters?: any;
}

interface Book {
  id: string;
  universe_id: string;
  title: string;
  status: string;
  target_length?: number;
  genre?: string;
  style_id?: string;
}

interface UniverseStore {
  universes: Universe[];
  selectedUniverse: Universe | null;
  books: Book[];
  setUniverses: (universes: Universe[]) => void;
  selectUniverse: (universe: Universe | null) => void;
  setBooks: (books: Book[]) => void;
  fetchUniverses: () => Promise<void>;
}

export const useUniverseStore = create<UniverseStore>((set) => ({
  universes: [],
  selectedUniverse: null,
  books: [],

  setUniverses: (universes) => set({ universes }),
  selectUniverse: (universe) => set({ selectedUniverse: universe }),
  setBooks: (books) => set({ books }),

  fetchUniverses: async () => {
    try {
      const res = await fetch('/api/universes');
      if (res.ok) {
        const data = await res.json();
        set({ universes: data });
      }
    } catch (error) {
      console.error('Failed to fetch universes:', error);
    }
  },
}));
