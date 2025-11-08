import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryStore {
  GridBuilds: boolean;
  setGridBuilds: (GridBuilds: boolean) => void;
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set) => ({
      GridBuilds: true,
      setGridBuilds: (GridBuilds) => set({ GridBuilds }),
    }),
    {
      name: "GridBuilds",
    }
  )
);