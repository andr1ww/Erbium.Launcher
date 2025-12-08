import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfigState {
  email: string;
  password: string;

  hostEmail: string;
  hostPassword: string;

  backendUrl: string;
  backendPort: string;
  redirectDLL: string;
  consoleDLL: string;
  gameServerDll: string;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setHostEmail: (email: string) => void;
  setHostPassword: (password: string) => void;
  setBackendUrl: (url: string) => void;
  setBackendPort: (port: string) => void;
  setRedirectDLL: (path: string) => void;
  setConsoleDLL: (path: string) => void;
  setGameServerDll: (path: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    set => ({
      email: "player@erbium.dev",
      password: "host1234",
      backendUrl: "127.0.0.1",
      backendPort: "3551",
      redirectDLL: "",
      consoleDLL: "",
      gameServerDll: "",
      hostEmail: "host@erbium.dev",
      hostPassword: "host1234",

      setEmail: email => set({ email }),
      setPassword: password => set({ password }),
      setBackendUrl: url => set({ backendUrl: url }),
      setBackendPort: port => set({ backendPort: port }),
      setRedirectDLL: path => set({ redirectDLL: path }),
      setConsoleDLL: path => set({ consoleDLL: path }),
      setGameServerDll: path => set({ gameServerDll: path }),
      setHostEmail: hostEmail => set({ hostEmail }),
      setHostPassword: hostPassword => set({ hostPassword }),
    }),
    {
      name: "Erbium.ConfigStore",
    }
  )
);
