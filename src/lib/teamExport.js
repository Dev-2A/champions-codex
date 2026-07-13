import { getPokemonBySlug, getItem, getMove } from "../data";

export function buildTeamSheet({ slugs, items, moves, name }) {
  const lines = [];
  lines.push(`🏆 ${name?.trim() || "내 팀"} — Champions Codex`);
  lines.push("");

  slugs.forEach((slug, i) => {
    const p = getPokemonBySlug(slug);
    if (!p) return;
    const item = getItem(items[slug]);
    const head = `${i + 1}. ${p.name.ko}${item ? ` @ ${item.name.ko}` : ""}`;
    lines.push(head);
    lines.push(`   타입: ${p.types.map((t) => typeKoLite(t)).join(" / ")}`);
    const mv = (moves[slug] ?? [])
      .map((m) => getMove(m)?.name.ko)
      .filter(Boolean);
    if (mv.length) lines.push(`   기술: ${mv.join(", ")}`);
    lines.push("");
  });

  lines.push("made with cola and 🔴  ·  Regulation M-B");
  return lines.join("\n").trim();
}

// 타입 한국어 (data의 typeKo 재사용 대신 순환 방지용 경량 매핑 불필요 — data에서 import)
import { typeKo } from "../data";
function typeKoLite(t) {
  return typeKo(t);
}
