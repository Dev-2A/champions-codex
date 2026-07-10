import { create } from "zustand";
import { getPokemonBySlug } from "../data";

const KEY = "cc-team";
const MAX = 6;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { slugs: parsed, items: {} }; // 구버전 호환
      return { slugs: parsed.slugs ?? [], items: parsed.items ?? {} };
    }
  } catch {
    /* noop */
  }
  return { slugs: [], items: {} };
}
function save(slugs, items) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ slugs, items }));
  } catch {
    /* noop */
  }
}

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

const initial = load();

export const useTeamStore = create((set, get) => ({
  slugs: initial.slugs,
  items: initial.items, // { [slug]: itemSlug }

  add: (slug) => {
    const { slugs, items } = get();
    if (slugs.length >= MAX) return { ok: false, reason: "full" };
    if (slugs.includes(slug)) return { ok: false, reason: "dup" };
    const p = getPokemonBySlug(slug);
    if (!p) return { ok: false, reason: "invalid" };
    if (slugs.some((s) => getPokemonBySlug(s)?.dexNum === p.dexNum)) {
      return { ok: false, reason: "species" };
    }
    const next = [...slugs, slug];
    save(next, items);
    set({ slugs: next });
    return { ok: true };
  },

  remove: (slug) => {
    const items = { ...get().items };
    delete items[slug];
    const next = get().slugs.filter((s) => s !== slug);
    save(next, items);
    set({ slugs: next, items });
  },

  setItem: (slug, itemSlug) => {
    const { slugs, items } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    // 도구 클로즈: 다른 멤버가 같은 도구를 들고 있으면 불가
    if (
      itemSlug &&
      Object.entries(items).some(([s, it]) => s !== slug && it === itemSlug)
    ) {
      return { ok: false, reason: "dup-item" };
    }
    const next = { ...items };
    if (itemSlug) next[slug] = itemSlug;
    else delete next[slug];
    save(slugs, next);
    set({ items: next });
    return { ok: true };
  },

  setTeam: (slugs) => {
    const clean = sanitize(slugs);
    save(clean, {}); // 프리셋 도구·기술 로드는 Step 8에서
    set({ slugs: clean, items: {} });
  },

  clear: () => {
    save([], {});
    set({ slugs: [], items: {} });
  },
}));
