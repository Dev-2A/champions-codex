import { getPokemonBySlug, getItem, typeKo } from "../data";

// getMove는 moveDb에서 주입 (미로드 시 기술 줄 생략)
export function buildTeamSheet({ slugs, items, moves, name }, getMove) {
  const lines = [];
  lines.push(`🏆 ${name?.trim() || "내 팀"} — Champions Codex`);
  lines.push("");

  slugs.forEach((slug, i) => {
    const p = getPokemonBySlug(slug);
    if (!p) return;
    const item = getItem(items[slug]);
    const head = `${i + 1}. ${p.name.ko}${item ? ` @ ${item.name.ko}` : ""}`;
    lines.push(head);
    lines.push(`   타입: ${p.types.map(typeKo).join(" / ")}`);
    const mv = getMove
      ? (moves[slug] ?? []).map((m) => getMove(m)?.name.ko).filter(Boolean)
      : [];
    if (mv.length) lines.push(`   기술: ${mv.join(", ")}`);
    lines.push("");
  });

  lines.push("made with cola and 🔴  ·  Regulation M-B");
  return lines.join("\n").trim();
}
