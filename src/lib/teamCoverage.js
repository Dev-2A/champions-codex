import { getDefensiveProfile } from "./typeEffectiveness";
import { TYPES } from "../data";

export function analyzeCoverage(team) {
  const profiles = team.map((p) => ({
    pokemon: p,
    profile: getDefensiveProfile(p.types),
  }));

  const byType = TYPES.map((atk) => {
    let weak = 0;
    let resist = 0;
    let immune = 0;
    for (const { profile } of profiles) {
      const m = profile[atk];
      if (m === 0) immune++;
      else if (m > 1) weak++;
      else if (m < 1) resist++;
    }
    return { type: atk, weak, resist, immune, coverd: resist + immune };
  });

  // 2마리 이상 공통 약점 (약점 수 내림차순)
  const sharedWeak = byType
    .filter((t) => t.weak >= 2)
    .sort((a, b) => b.weak - a.weak);
  // 저항/무효가 하나도 없는 타입 (구멍)
  const uncovered = byType.filter((t) => t.coverd === 0);

  return { profiles, byType, sharedWeak, uncovered };
}
