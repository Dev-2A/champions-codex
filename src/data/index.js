import { ACTIVE_REGULATION } from "../config";
import typechartData from "./generated/typechart.json";

// 프리페치 생성물을 eager 로드 후 활성 레귤레이션만 선택
const pokedexModules = import.meta.glob("./generated/pokedex.*.json", {
  eager: true,
});
const regulationModules = import.meta.glob("./generated/regulation.*.json", {
  eager: true,
});

function pick(modules, kind) {
  const suffix = `${kind}.${ACTIVE_REGULATION}.json`;
  const found = Object.entries(modules).find(([path]) => path.endsWith(suffix));
  if (!found) {
    throw new Error(
      `[data] '${ACTIVE_REGULATION}'의 ${kind} 데이터가 없습니다. ` +
        `먼저 npm run prefetch ${ACTIVE_REGULATION} 를 실행하세요.`,
    );
  }
  return found[1].default;
}

const pokedexFile = pick(pokedexModules, "pokedex");

// ── 정적 데이터 (불변) ──
export const regulation = pick(regulationModules, "regulation");
export const typechart = typechartData;
export const pokemonList = pokedexFile.pokemon;

// ── 인덱스 ──
const bySlug = new Map(pokemonList.map((p) => [p.slug, p]));
const byId = new Map(pokemonList.map((p) => [p.id, p]));
export const getPokemonBySlug = (slug) => bySlug.get(slug) ?? null;
export const getPokemonById = (id) => byId.get(id) ?? null;

// ── 타입 메타 ──
export const TYPES = typechart.types; // ['normal', 'fire', ...] 18개
export const typeMeta = typechart.meta; // { fire: { ko: '불꽃' }, ... }
export const typeKo = (t) => typeMeta[t]?.ko ?? t;
