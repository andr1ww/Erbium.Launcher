export const STORAGE_CONFIG = {
    user: {
        displayName: { key: "user.displayName", default: "" },
    },
} as const;

export const storage = {
    get: (key: string, defaultValue: string): string => {
        if (typeof window === "undefined") return defaultValue;
        return localStorage.getItem(key) ?? defaultValue;
    },
    set: (key: string, value: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, value);
        }
    },
};