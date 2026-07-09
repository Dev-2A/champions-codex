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

// 슬러그 배열을 유효/중복/종족클로즈/최대6 기준으로 정제
function sanitize(slugs) {
  const seen = new Set();
  const dexSeen = new Set();
  const next = [];
  for (const s of slugs) {
    if (next.length >= MAX) break;
    if (seen.has(s)) continue;
    const p = getPokemonBySlug(s);
    if (!p) continue;
    if (dexSeen.has(p.dexNum)) continue;
    seen.add(s);
    dexSeen.add(p.dexNum);
    next.push(s);
  }
  return next;
}

export const useTeamStore = create((set, get) => ({
  slugs: load(),

  add: (slug) => {
    const { slugs } = get();
    if (slugs.length >= MAX) return { ok: false, reason: "full" };
    if (slugs.includes(slug)) return { ok: false, reason: "dup" };
    const p = getPokemonBySlug(slug);
    if (!p) return { ok: false, reason: "invalid" };
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

  setTeam: (slugs) => {
    const next = sanitize(slugs);
    save(next);
    set({ slugs: next });
  },

  clear: () => {
    save([]);
    set({ slugs: [] });
  },
}));
