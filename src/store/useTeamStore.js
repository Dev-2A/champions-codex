import { create } from "zustand";
import { getPokemonBySlug } from "../data";

const KEY = "cc-team";
const MAX = 6;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return [];
}
function save(slugs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    /* noop */
  }
}

export const useTeamStore = create((set, get) => ({
  slugs: load(), // 팀 슬러그 배열 (최대 6)

  add: (slug) => {
    const { slugs } = get();
    if (slugs.length >= MAX) return { ok: false, reason: "full" };
    if (slugs.includes(slug)) return { ok: false, reason: "dup" };
    const p = getPokemonBySlug(slug);
    if (!p) return { ok: false, reason: "invalid" };
    // 종족 클로즈: 같은 도감번호 불가 (M-B 룰)
    if (slugs.some((s) => getPokemonBySlug(s)?.dexNum === p.dexNum)) {
      return { ok: false, reason: "species" };
    }
    const next = [...slugs, slug];
    save(next);
    set({ slugs: next });
    return { ok: true };
  },

  remove: (slug) => {
    const next = get().slugs.filter((s) => s !== slug);
    save(next);
    set({ slugs: next });
  },

  clear: () => {
    save([]);
    set({ slugs: [] });
  },
}));
