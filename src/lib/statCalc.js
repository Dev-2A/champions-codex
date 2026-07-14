// 챔피언스 능력치 계산 — Lv.50 고정, IV 31 고정,
// 노력치 대신 "능력 포인트" (합계 66, 스탯당 최대 32, 실수치 +1씩)
export const STAT_KEYS = ["hp", "atk", "def", "spa", "spd", "spe"];
export const STAT_LABELS = {
  hp: "체력",
  atk: "공격",
  def: "방어",
  spa: "특공",
  spd: "특방",
  spe: "스피드",
};
// 커뮤니티 표기 (H/A/B/C/D/S)
export const STAT_SHORT = {
  hp: "H",
  atk: "A",
  def: "B",
  spa: "C",
  spd: "D",
  spe: "S",
};
export const MAX_PER_STAT = 32;
export const MAX_TOTAL = 66;

export const emptyBuild = () => ({
  pts: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  up: null, // 성격 상승 스탯 키 (hp 제외)
  down: null, // 성격 하락 스탯 키 (hp 제외)
});

export const usedPoints = (build) =>
  STAT_KEYS.reduce((n, k) => n + (build?.pts?.[k] ?? 0), 0);

export const isEmptyBuild = (build) =>
  !build || (usedPoints(build) === 0 && !build.up && !build.down);

/**
 * 실수치 (Lv.50 · IV 31):
 * - HP     = floor((2×종족값+31)×50/100) + 60 + 포인트
 * - 그 외  = floor((floor((2×종족값+31)×50/100) + 5) × 성격보정) + 포인트
 * 성격 보정은 포인트 반영 전 기준 — 실제 게임과 ±1 오차가 있을 수 있어요.
 */
export function computeStat(key, base, build) {
  const pts = build?.pts?.[key] ?? 0;
  const core = Math.floor(((2 * base + 31) * 50) / 100);
  if (key === "hp") return core + 60 + pts;
  let stat = core + 5;
  if (build?.up === key && build?.down !== key) stat = Math.floor(stat * 1.1);
  else if (build?.down === key && build?.up !== key)
    stat = Math.floor(stat * 0.9);
  return stat + pts;
}

export function computeStats(baseStats, build) {
  const out = {};
  for (const k of STAT_KEYS) out[k] = computeStat(k, baseStats[k], build);
  return out;
}

/** 빌드 정리: 값 클램프 + 예산 초과·잘못된 성격 키 방어 (프리셋/공유 수신용) */
export function sanitizeBuild(build) {
  if (!build || typeof build !== "object") return null;
  const clean = emptyBuild();
  let budget = MAX_TOTAL;
  for (const k of STAT_KEYS) {
    const v = Math.max(
      0,
      Math.min(MAX_PER_STAT, Math.round(Number(build.pts?.[k]) || 0)),
    );
    const take = Math.min(v, budget);
    clean.pts[k] = take;
    budget -= take;
  }
  const natureKeys = STAT_KEYS.filter((k) => k !== "hp");
  if (natureKeys.includes(build.up)) clean.up = build.up;
  if (natureKeys.includes(build.down)) clean.down = build.down;
  return isEmptyBuild(clean) ? null : clean;
}
