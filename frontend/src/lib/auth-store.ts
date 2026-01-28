import { create } from "zustand";

const TOKEN_KEY = "knitted_toys_token";

type AuthState = {
  token: string | null;
  hydrated: boolean;
  hydrate: () => void;
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(TOKEN_KEY);
    set({ token: t, hydrated: true });
  },
  setToken: (t) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: t });
  },
  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
    set({ token: null });
  },
}));

export const isAdmin = () => !!useAuthStore.getState().token;
