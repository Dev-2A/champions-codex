import { ACTIVE_REGULATION } from "../config";

// 기술 DB(learnable 기술 전체)와 러닝셋(포켓몬별 배울 수 있는 기술)은
// 합쳐서 600KB가 넘는 큰 JSON이라 초기 번들에서 제외하고,
// 필요한 화면(포켓몬 상세·팀 빌더)에서만 동적 import로 로드한다.
const learnsetModules = import.meta.glob("./generated/learnsets.*.json");

let db = null;
let promise = null;

function buildDb(movesJson, learnsetsJson) {
  const moves = movesJson.moves;
  const bySlug = new Map(moves.map((m) => [m.slug, m]));
  const learnsets = learnsetsJson.learnsets;
  return {
    moves,
    getMove: (slug) => bySlug.get(slug) ?? null,
    /** 슬러그 배열 → 기술 객체 배열 (없는 건 제외) */
    resolveMoves: (slugs = []) =>
      slugs.map((s) => bySlug.get(s)).filter(Boolean),
    /** 포켓몬 슬러그 → 배울 수 있는 기술 슬러그 배열 */
    getLearnset: (pokemonSlug) => learnsets[pokemonSlug] ?? [],
  };
}

/** 이미 로드됐으면 동기 반환, 아니면 null (useMoveDb 초기값용) */
export function getMoveDb() {
  return db;
}

/** 기술 DB 로드 (싱글턴 — 여러 번 불러도 1회만 로드) */
export function loadMoveDb() {
  if (!promise) {
    const path = `./generated/learnsets.${ACTIVE_REGULATION}.json`;
    const loadLearnsets = learnsetModules[path];
    if (!loadLearnsets) {
      throw new Error(
        `[data] '${ACTIVE_REGULATION}'의 learnsets 데이터가 없습니다. ` +
          `먼저 npm run prefetch ${ACTIVE_REGULATION} 를 실행하세요.`,
      );
    }
    promise = Promise.all([
      import("./generated/moves.json"),
      loadLearnsets(),
    ]).then(([movesJson, learnsetsJson]) => {
      db = buildDb(movesJson.default ?? movesJson, learnsetsJson.default ?? learnsetsJson);
      return db;
    });
  }
  return promise;
}
