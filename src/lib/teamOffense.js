import { getMultiplier } from "./typeEffectiveness";
import { resolveMoves, TYPES } from "../data";

// 멤버의 공격 타입: 공격기(변화기 제외) 타입들, 없으면 자기 타입(STAB 근사)
export function memberOffense(pokemon, moveSlugs) {
  const damaging = resolveMoves(moveSlugs).filter(
    (m) => m.damageClass !== "status" && m.power != null,
  );
  const types = damaging.length
    ? [...new Set(damaging.map((m) => m.type))]
    : pokemon.types;
  return { pokemon, types, approx: damaging.length === 0 };
}

export function analyzeOffense(team, movesMap) {
  const members = team.map((p) => memberOffense(p, movesMap[p.slug] ?? []));
  const byType = TYPES.map((def) => {
    let covered = 0;
    for (const m of members) {
      const best = Math.max(0, ...m.types.map((t) => getMultiplier(t, [def])));
      if (best >= 2) covered++;
    }
    return { type: def, covered };
  });
  const holes = byType.filter((t) => t.covered === 0);
  const anyApprox = members.some((m) => m.approx);
  return { members, byType, holes, anyApprox };
}
