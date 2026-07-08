import { create } from "zustand";

export const usePokedexStore = create((set) => ({
  query: "",
  types: [], // OR 필터
  megaOnly: false,
  sort: "dex", // 'dex' | 'name' | 'total'
  setQuery: (query) => set({ query }),
  toggleType: (t) =>
    set((s) => ({
      types: s.types.includes(t)
        ? s.types.filter((x) => x !== t)
        : [...s.types, t],
    })),
  setMegaOnly: (megaOnly) => set({ megaOnly }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ query: "", types: [], megaOnly: false, sort: "dex" }),
}));
