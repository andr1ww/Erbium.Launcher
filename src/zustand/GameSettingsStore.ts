import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameSettingsStore {
  redirectDLL: string;
  clientDLL: string;
  gameServerDLL: string;
  email: string;
  password: string;
  gsEmail: string;
  gsPassword: string;
  backend: string;
  setRedirectDLL: (dll: string) => void;
  setClientDLL: (dll: string) => void;
  setGameServerDLL: (dll: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setGsEmail: (email: string) => void;
  setGsPassword: (password: string) => void;
  setBackend: (backend: string) => void;
}

export const useGameSettingsStore = create<GameSettingsStore>()(
  persist(
    (set) => ({
      redirectDLL: "",
      clientDLL: "",
      gameServerDLL: "",
      email: "",
      password: "",
      gsEmail: "",
      gsPassword: "",
      backend: "",
      
      setRedirectDLL: (dll) => set({ redirectDLL: dll }),
      setClientDLL: (dll) => set({ clientDLL: dll }),
      setGameServerDLL: (dll) => set({ gameServerDLL: dll }),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setGsEmail: (email) => set({ gsEmail: email }),
      setGsPassword: (password) => set({ gsPassword: password }),
      setBackend: (backend) => set({ backend }),
    }),
    {
      name: "erbium-game-settings",
    }
  )
);