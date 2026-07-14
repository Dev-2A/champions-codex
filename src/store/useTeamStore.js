import { create } from "zustand";
import { getPokemonBySlug, getMegaForms } from "../data";
import { loadMoveDb } from "../data/moveDb";
import {
  emptyBuild,
  isEmptyBuild,
  sanitizeBuild,
  usedPoints,
  MAX_PER_STAT,
  MAX_TOTAL,
  STAT_KEYS,
} from "../lib/statCalc";

const KEY = "cc-team";
const MAX = 6;
const MAX_MOVES = 4;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed))
        return { slugs: parsed, items: {}, moves: {}, mega: null, builds: {} }; // 구버전
      return {
        slugs: parsed.slugs ?? [],
        items: parsed.items ?? {},
        moves: parsed.moves ?? {},
        mega: parsed.mega ?? null, // { slug, form } | null
        builds: parsed.builds ?? {}, // { [slug]: { pts, up, down } }
      };
    }
  } catch {
    /* noop */
  }
  return { slugs: [], items: {}, moves: {}, mega: null, builds: {} };
}
function save(slugs, items, moves, mega, builds) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ slugs, items, moves, mega, builds }),
    );
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
  mega: initial.mega, // { slug, form: formSlug } | null — 팀당 1마리
  builds: initial.builds, // { [slug]: { pts, up, down } } — 능력 포인트·성격

  add: (slug) => {
    const { slugs, items, moves, mega, builds } = get();
    if (slugs.length >= MAX) return { ok: false, reason: "full" };
    if (slugs.includes(slug)) return { ok: false, reason: "dup" };
    const p = getPokemonBySlug(slug);
    if (!p) return { ok: false, reason: "invalid" };
    if (slugs.some((s) => getPokemonBySlug(s)?.dexNum === p.dexNum)) {
      return { ok: false, reason: "species" };
    }
    const next = [...slugs, slug];
    save(next, items, moves, mega, builds);
    set({ slugs: next });
    return { ok: true };
  },

  remove: (slug) => {
    const items = { ...get().items };
    const moves = { ...get().moves };
    const builds = { ...get().builds };
    delete items[slug];
    delete moves[slug];
    delete builds[slug];
    const mega = get().mega?.slug === slug ? null : get().mega;
    const next = get().slugs.filter((s) => s !== slug);
    save(next, items, moves, mega, builds);
    set({ slugs: next, items, moves, mega, builds });
  },

  setItem: (slug, itemSlug) => {
    const { slugs, items, moves, mega, builds } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    if (itemSlug && mega?.slug === slug)
      return { ok: false, reason: "mega-stone" }; // 메가스톤이 도구 슬롯 차지
    if (
      itemSlug &&
      Object.entries(items).some(([s, it]) => s !== slug && it === itemSlug)
    ) {
      return { ok: false, reason: "dup-item" };
    }
    const next = { ...items };
    if (itemSlug) next[slug] = itemSlug;
    else delete next[slug];
    save(slugs, next, moves, mega, builds);
    set({ items: next });
    return { ok: true };
  },

  // 기술 토글 (learnable 검증은 UI에서, 여기선 최대 4 강제)
  toggleMove: (slug, moveSlug) => {
    const { slugs, items, moves, mega, builds } = get();
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
    save(slugs, items, next, mega, builds);
    set({ moves: next });
    return { ok: true };
  },

  /** 메가 지정 (팀당 1마리 — 기존 지정은 교체됨). 메가스톤이 도구 슬롯을 차지한다. */
  setMega: (slug, formSlug) => {
    const { slugs, items, moves, builds } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    const form = getMegaForms(slug).find((f) => f.formSlug === formSlug);
    if (!form) return { ok: false, reason: "invalid-form" };
    const nextItems = { ...items };
    const removedItem = !!nextItems[slug];
    delete nextItems[slug];
    const mega = { slug, form: formSlug };
    save(slugs, nextItems, moves, mega, builds);
    set({ items: nextItems, mega });
    return { ok: true, removedItem };
  },

  clearMega: () => {
    const { slugs, items, moves, builds } = get();
    save(slugs, items, moves, null, builds);
    set({ mega: null });
  },

  /** 능력 포인트 설정 (0~32, 팀원별 합계 66 예산 내로 자동 클램프) */
  setStatPoint: (slug, statKey, value) => {
    const { slugs, items, moves, mega, builds } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    if (!STAT_KEYS.includes(statKey))
      return { ok: false, reason: "invalid-stat" };
    const cur = builds[slug] ?? emptyBuild();
    const others = usedPoints(cur) - (cur.pts[statKey] ?? 0);
    const clamped = Math.max(
      0,
      Math.min(MAX_PER_STAT, Math.round(value) || 0, MAX_TOTAL - others),
    );
    const nextBuild = {
      ...cur,
      pts: { ...cur.pts, [statKey]: clamped },
    };
    const next = { ...builds };
    if (isEmptyBuild(nextBuild)) delete next[slug];
    else next[slug] = nextBuild;
    save(slugs, items, moves, mega, next);
    set({ builds: next });
    return { ok: true, value: clamped };
  },

  /** 성격 보정 설정 (up/down: 스탯 키 또는 null) */
  setNature: (slug, up, down) => {
    const { slugs, items, moves, mega, builds } = get();
    if (!slugs.includes(slug)) return { ok: false, reason: "not-in-team" };
    const cur = builds[slug] ?? emptyBuild();
    const natureKeys = STAT_KEYS.filter((k) => k !== "hp");
    const nextBuild = {
      ...cur,
      up: natureKeys.includes(up) ? up : null,
      down: natureKeys.includes(down) ? down : null,
    };
    const next = { ...builds };
    if (isEmptyBuild(nextBuild)) delete next[slug];
    else next[slug] = nextBuild;
    save(slugs, items, moves, mega, next);
    set({ builds: next });
    return { ok: true };
  },

  setTeam: async ({
    slugs = [],
    items = {},
    moves = {},
    mega = null,
    builds = {},
  } = {}) => {
    const clean = sanitize(slugs);

    // 메가: 팀에 있는 멤버 + 유효한 폼만
    let nextMega = null;
    if (mega?.slug && clean.includes(mega.slug)) {
      const form = getMegaForms(mega.slug).find(
        (f) => f.formSlug === mega.form,
      );
      if (form) nextMega = { slug: mega.slug, form: mega.form };
    }

    // 도구: 팀에 있는 멤버만 + 도구 클로즈 + 메가 멤버는 스톤이 슬롯 차지
    const nextItems = {};
    const usedItems = new Set();
    for (const s of clean) {
      if (nextMega?.slug === s) continue;
      const it = items[s];
      if (it && !usedItems.has(it)) {
        nextItems[s] = it;
        usedItems.add(it);
      }
    }

    // 기술: 팀에 있는 멤버만 + 그 포켓몬이 배울 수 있는 기술만 + 최대 4
    const db = await loadMoveDb();
    const nextMoves = {};
    for (const s of clean) {
      const learnable = new Set(db.getLearnset(s));
      const picked = [...new Set(moves[s] ?? [])]
        .filter((m) => learnable.has(m))
        .slice(0, MAX_MOVES);
      if (picked.length) nextMoves[s] = picked;
    }

    // 능력치 빌드: 팀에 있는 멤버만 + 클램프·예산 검증
    const nextBuilds = {};
    for (const s of clean) {
      const b = sanitizeBuild(builds[s]);
      if (b) nextBuilds[s] = b;
    }

    save(clean, nextItems, nextMoves, nextMega, nextBuilds);
    set({
      slugs: clean,
      items: nextItems,
      moves: nextMoves,
      mega: nextMega,
      builds: nextBuilds,
    });
  },

  clear: () => {
    save([], {}, {}, null, {});
    set({ slugs: [], items: {}, moves: {}, mega: null, builds: {} });
  },
}));
