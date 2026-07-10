import { create } from "zustand";
import { getPokemonBySlug } from "../data";

const KEY = "cc-team";
const MAX = 6;
const MAX_MOVES = 4;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { slugs: parsed, items: {}, moves: {} }; // 구버전
      return {
        slugs: parsed.slugs ?? [],
        items: parsed.items ?? {},
        moves: parsed.moves ?? {},
      };
    }
  } catch {
    /* noop */
  }
  return { slugs: [], items: {}, moves: {} };
}
function save(slugs, items, moves) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ slugs, items, moves }));
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
  moves: initial.moves, // { [slug]: [moveSlug, ...] } 최대 4

  add: (slug) => {
    const { slugs, items, moves } = get();
    if (slugs.length >= MAX) return { ok: false, reason: "full" };
    if (slugs.includes(slug)) return { ok: false, reason: "dup" };
    const p = getPokemonBySlug(slug);
    if (!p) return { ok: false, reason: "invalid" };
    if (slugs.some((s) => getPokemonBySlug(s)?.dexNum === p.dexNum)) {
      return { ok: false, reason: "species" };
    }
    const next = [...slugs, slug];
    save(next, items, moves);
    set({ slugs: next });
    return { ok: true };
  },

  remove: (slug) => {
    const items = { ...get().items };
    const moves = { ...get().moves };
    delete items[slug];
    delete moves[slug];
    const next = get().slugs.filter((s) => s !== slug);
    save(next, items, moves);
    set({ slugs: next, items, moves });
  },

  setItem: (slug, itemSlug) => {
    const { slugs, items, moves } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    if (
      itemSlug &&
      Object.entries(items).some(([s, it]) => s !== slug && it === itemSlug)
    ) {
      return { ok: false, reason: "dup-item" };
    }
    const next = { ...items };
    if (itemSlug) next[slug] = itemSlug;
    else delete next[slug];
    save(slugs, next, moves);
    set({ items: next });
    return { ok: true };
  },

  // 기술 토글 (learnable 검증은 UI에서, 여기선 최대 4 강제)
  toggleMove: (slug, moveSlug) => {
    const { slugs, items, moves } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    const cur = moves[slug] ?? [];
    let nextMoves;
    if (cur.includes(moveSlug)) {
      nextMoves = cur.filter((m) => m !== moveSlug);
    } else {
      if (cur.length >= MAX_MOVES) return { ok: false, reason: "max" };
      nextMoves = [...cur, moveSlug];
    }
    const next = { ...moves };
    if (nextMoves.length) next[slug] = nextMoves;
    else delete next[slug];
    save(slugs, items, next);
    set({ moves: next });
    return { ok: true };
  },

  setTeam: (slugs) => {
    const clean = sanitize(slugs);
    save(clean, {}, {}); // 프리셋 도구·기술 로드는 Step 8에서
    set({ slugs: clean, items: {}, moves: {} });
  },

  clear: () => {
    save([], {}, {});
    set({ slugs: [], items: {}, moves: {} });
  },
}));
