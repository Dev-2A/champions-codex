import { pokemonList } from "../data";
import { matchKo } from "./search";

export const SORT_KEYS = ["dex", "name", "total", "speed"];

/** 도감 필터+정렬 — 도감 목록과 상세 페이지 이전/다음 내비가 공유 */
export function filterAndSortPokemon({
  query = "",
  types = [],
  megaOnly = false,
  sort = "dex",
} = {}) {
  const raw = query.trim();
  const q = raw.toLowerCase();
  const list = pokemonList.filter((p) => {
    if (megaOnly && !p.canMega) return false;
    if (types.length && !types.some((t) => p.types.includes(t))) return false;
    if (raw) {
      const hit =
        matchKo(p.name.ko, raw) || // 초성 포함 한국어 매칭
        p.slug.includes(q) ||
        String(p.id).includes(q);
      if (!hit) return false;
    }
    return true;
  });
  const sorters = {
    dex: (a, b) => a.id - b.id,
    name: (a, b) => (a.name.ko || "").localeCompare(b.name.ko || "", "ko"),
    total: (a, b) => b.total - a.total,
    speed: (a, b) => b.stats.spe - a.stats.spe,
  };
  return [...list].sort(sorters[sort] ?? sorters.dex);
}
