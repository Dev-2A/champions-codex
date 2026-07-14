import { ACTIVE_REGULATION } from "../config";
import typechartData from "./generated/typechart.json";
import typeTraitsData from "./champions/typeTraits.json";
import glossaryData from "./champions/glossary.json";
import battleMechanicsData from "./champions/battleMechanics.json";
import seasonsData from "./champions/seasons.json";
import faqData from "./champions/faq.json";
import itemsData from "./generated/items.json";
import notableMovesData from "./champions/notable-moves.json";
import samplesData from "./champions/samples.json";

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

// 메가 폼 (프리페치 전이면 빈 맵 — 사이트가 깨지지 않게 옵셔널)
const megaModules = import.meta.glob("./generated/megas.*.json", {
  eager: true,
});
const megasFile = Object.entries(megaModules).find(([path]) =>
  path.endsWith(`megas.${ACTIVE_REGULATION}.json`),
)?.[1]?.default;

// ── 정적 데이터 (불변) ──
export const regulation = pick(regulationModules, "regulation");
export const typechart = typechartData;
export const pokemonList = pokedexFile.pokemon;
export const pokedexGeneratedAt = pokedexFile.generatedAt;

// ── 포켓몬 인덱스 ──
const bySlug = new Map(pokemonList.map((p) => [p.slug, p]));
const byId = new Map(pokemonList.map((p) => [p.id, p]));
export const getPokemonBySlug = (slug) => bySlug.get(slug) ?? null;
export const getPokemonById = (id) => byId.get(id) ?? null;

// ── 메가 폼 ──
export const megaForms = megasFile?.megas ?? {};
export const getMegaForms = (slug) => megaForms[slug] ?? [];
export const megaPending = new Set(megasFile?.pending ?? []);

// ── 타입 메타 ──
export const TYPES = typechart.types;
export const typeMeta = typechart.meta;
export const typeKo = (t) => typeMeta[t]?.ko ?? t;

// ── 챔피언스 타입 부가 특성 (큐레이션) ──
export const typeTraits = typeTraitsData;
export const getTypeTraits = (t) => typeTraitsData[t] ?? null;

// ── 용어집 · 배틀 메커니즘 · 시즌 · FAQ (큐레이션) ──
export const glossary = glossaryData;
export const battleMechanics = battleMechanicsData;
export const seasons = seasonsData.seasons;
export const faqs = faqData.faqs;

// ── 도구 (프리페치) ──
export const items = itemsData.items;
export const itemCategories = itemsData.categories;
const itemBySlug = new Map(items.map((it) => [it.slug, it]));
export const getItem = (slug) => itemBySlug.get(slug) ?? null;

// ── 기술 DB·러닝셋: 용량이 커서 별도 모듈에서 동적 로드 ──
// (src/data/moveDb.js 의 loadMoveDb / src/hooks/useMoveDb.js 참고)

// ── 주목 기술 역할 태그 (큐레이션) ──
export const notableMoves = notableMovesData;
export const getNotableRole = (slug) => notableMovesData[slug] ?? null;

// ── 추천 세트 (큐레이션) ──
const samplesBySlug = new Map();
for (const s of samplesData.samples) {
  const list = samplesBySlug.get(s.slug) ?? [];
  list.push(s);
  samplesBySlug.set(s.slug, list);
}
export const getSamples = (slug) => samplesBySlug.get(slug) ?? [];
