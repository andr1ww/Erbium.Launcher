import { create } from "zustand";

interface OnBoardingStore {
  OBstep: string;

  setOBstep: (OBstep: string) => void;
}

export const useOnBoardingStore = create<OnBoardingStore>((set) => ({
  OBstep: "Login",

  setOBstep: (OBstep) => set({ OBstep }),
}));