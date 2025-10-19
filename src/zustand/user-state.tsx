import { create } from "zustand";
import { storage, STORAGE_CONFIG } from "./config";

interface UserState {
  DisplayName: string;
  setDisplayName: (DisplayName: string) => void;
}

export const useUserState = create<UserState>((set) => ({
  DisplayName: storage.get(
    STORAGE_CONFIG.user.displayName.key,
    STORAGE_CONFIG.user.displayName.default
  ),

  setDisplayName: (DisplayName: string) => {
    storage.set(STORAGE_CONFIG.user.displayName.key, DisplayName);
    set({ DisplayName });
  },
}));
