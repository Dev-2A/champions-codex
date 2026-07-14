import { create } from "zustand";
import { TYPES } from "../data";
import { SORT_KEYS } from "../lib/pokedexFilter";

export const usePokedexStore = create((set) => ({
  query: "",
  types: [], // OR 필터
  megaOnly: false,
  sort: "dex", // 'dex' | 'name' | 'total' | 'speed'
  setQuery: (query) => set({ query }),
  toggleType: (t) =>
    set((s) => ({
      types: s.types.includes(t)
        ? s.types.filter((x) => x !== t)
        : [...s.types, t],
    })),
  setMegaOnly: (megaOnly) => set({ megaOnly }),
  setSort: (sort) => set({ sort }),
  /** URL 쿼리 파라미터 → 필터 상태 복원 (잘못된 값은 방어) */
  hydrate: ({ query, types, megaOnly, sort }) =>
    set({
      query: typeof query === "string" ? query : "",
      types: Array.isArray(types) ? types.filter((t) => TYPES.includes(t)) : [],
      megaOnly: megaOnly === true,
      sort: SORT_KEYS.includes(sort) ? sort : "dex",
    }),
  reset: () => set({ query: "", types: [], megaOnly: false, sort: "dex" }),
}));
