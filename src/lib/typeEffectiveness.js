import { typechart, TYPES } from "../data";

const chart = typechart.chart;

/** 공격 타입 1개 → 방어 타입 조합(1~2개)에 주는 최종 배율 */
export function getMultiplier(attackType, defenderTypes) {
  return defenderTypes.reduce(
    (acc, def) => acc * (chart[attackType]?.[def] ?? 1),
    1,
  );
}

/** 방어 관점: 방어 조합이 18개 공격 타입에게 받는 배율 맵 { fire: 2, water: 0.5, ... } */
export function getDefensiveProfile(defenderTypes) {
  const profile = {};
  for (const atk of TYPES) profile[atk] = getMultiplier(atk, defenderTypes);
  return profile;
}

/** 공격 관점: 공격 타입이 18개 방어 타입에게 주는 배율 (매트릭스 한 행) */
export function getOffensiveProfile(attackType) {
  return { ...chart[attackType] };
}

/** 배율 → 분류 (색/라벨용) */
export function classifyMultiplier(m) {
  if (m === 0) return "immune";
  if (m >= 4) return "weak4";
  if (m > 1) return "weak2";
  if (m <= 0.25) return "resist4";
  if (m < 1) return "resist2";
  return "neutral";
}

/** 배율 → 표시 문자열 (×¼, ×½, ×2 ...) */
export function formatMultiplier(m) {
  if (m === 0) return "0";
  if (m === 0.25) return "¼";
  if (m === 0.5) return "½";
  return String(m);
}
