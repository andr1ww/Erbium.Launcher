import { create } from "zustand";

interface UserStore {
  DisplayName: string;
  setDisplayName: (DisplayName: string) => void;
}

export const useUserStore = create<UserStore>(set => ({
  DisplayName: localStorage.getItem("Erbium.DisplayName") || "",
  setDisplayName: DisplayName => {
    set({ DisplayName });
    localStorage.setItem("Erbium.DisplayName", DisplayName);
  },
}));
