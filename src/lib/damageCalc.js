// 간이 데미지 계산 (Lv.50 · 9세대 근사식)
// 반영: 위력 · 실수치 · 자속(1.5) · 타입 상성 · 광역 보정(0.75) · 난수(0.85~1.00)
// 미반영: 특성 · 도구 · 날씨/필드 · 급소 · 화상 · 랭크 변화

/** 한 번의 공격 데미지 범위. 무효(상성 0)나 변화기는 null. */
export function calcDamage({
  power,
  attack,
  defense,
  stab = false,
  typeMult = 1,
  spread = false,
  level = 50,
}) {
  if (!power || typeMult === 0) return null;
  const base =
    Math.floor(
      Math.floor((Math.floor((2 * level) / 5 + 2) * power * attack) / defense) /
        50,
    ) + 2;
  const roll = (rand) => {
    let d = base;
    if (spread) d = Math.floor(d * 0.75);
    d = Math.floor((d * rand) / 100);
    if (stab) d = Math.floor(d * 1.5);
    d = Math.floor(d * typeMult);
    return Math.max(1, d);
  };
  return { min: roll(85), max: roll(100) };
}

/** KO 표현: "확정 2방" / "난수 1방 (확정 2방)" */
export function koText(dmg, hp) {
  if (!dmg) return null;
  const guaranteed = Math.ceil(hp / dmg.min);
  const best = Math.ceil(hp / dmg.max);
  if (guaranteed === best)
    return guaranteed === 1 ? "확정 1방" : `확정 ${guaranteed}방`;
  return `난수 ${best}방 (확정 ${guaranteed}방)`;
}

export const pct = (d, hp) => Math.min(100, (d / hp) * 100);
