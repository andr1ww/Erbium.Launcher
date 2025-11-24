import { create } from "zustand";

export interface IBuild {
  splash: string;
  real: string;
  version: string;
  verified: boolean;
  path: string;
  loading: boolean;
  open: boolean;
}

interface BuildStore {
  builds: Map<string, IBuild>;
  fetchedOnce: boolean;
  isLoading: boolean;
  error: string | null;
  add: (path: string, build: IBuild) => void;
  remove: (path: string) => void;
  clear: () => void;
}

const BuildStore = create<BuildStore>((set, get) => ({
  builds:
    typeof window !== "undefined"
      ? new Map(Object.entries(JSON.parse(localStorage.getItem("builds") || "{}")))
      : new Map(),
  availableBuilds: [],
  fetchedOnce: false,
  isLoading: false,
  error: null,

  add: (path, build) => {
    if (typeof window === "undefined") return;
    const builds = get().builds;
    builds.set(path, build);
    localStorage.setItem("builds", JSON.stringify(Object.fromEntries(builds)));
    set({ builds: new Map(builds) });
  },

  remove: path => {
    if (typeof window === "undefined") return;
    const builds = get().builds;
    builds.delete(path);
    localStorage.setItem("builds", JSON.stringify(Object.fromEntries(builds)));
    set({ builds: new Map(builds) });
  },

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("builds");
    set({ builds: new Map() });
  },
}));

export default BuildStore;
