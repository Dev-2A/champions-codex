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

  setTeam: ({ slugs = [], items = {}, moves = {} } = {}) => {
    const clean = sanitize(slugs);
    const inTeam = new Set(clean);

    // 도구: 팀에 있는 멤버만 + 도구 클로즈(중복 제거, 먼저 온 멤버 우선)
    const nextItems = {};
    const usedItems = new Set();
    for (const s of clean) {
      const it = items[s];
      if (it && !usedItems.has(it)) {
        nextItems[s] = it;
        usedItems.add(it);
      }
    }

    // 기술: 팀에 있는 멤버만 + 그 포켓몬이 배울 수 있는 기술만 + 최대 4
    const nextMoves = {};
    for (const s of clean) {
      const learnable = new Set(getPokemonBySlug(s)?.moves ?? []);
      const picked = (moves[s] ?? [])
        .filter((m) => learnable.has(m))
        .slice(0, 4);
      if (picked.length) nextMoves[s] = picked;
    }

    save(clean, nextItems, nextMoves);
    set({ slugs: clean, items: nextItems, moves: nextMoves });
    void inTeam;
  },

  clear: () => {
    save([], {}, {});
    set({ slugs: [], items: {}, moves: {} });
  },
}));
