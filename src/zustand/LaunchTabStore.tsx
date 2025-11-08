import { create } from "zustand"

type LaunchTabStore = {
  PostIndex: number
  
  setPostIndex: (index: number) => void
  incrementPostIndex: () => void;
}

export const useLaunchTabStore = create<LaunchTabStore>((set) => ({
  PostIndex: 0,

  setPostIndex: (index) => set({ PostIndex: index }),
  incrementPostIndex: () =>
    set((state) => ({
      PostIndex: state.PostIndex >= 1 ? 0 : state.PostIndex + 1,
    })),
}));

// Have to import the store when api is ready and change the 1 to the {posts.length}