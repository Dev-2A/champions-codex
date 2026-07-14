import { getPokemonBySlug, getItem, getMegaForms, typeKo } from "../data";
import { STAT_KEYS, STAT_SHORT, isEmptyBuild } from "./statCalc";

// getMove는 moveDb에서 주입 (미로드 시 기술 줄 생략)
export function buildTeamSheet(
  { slugs, items, moves, mega, builds, name },
  getMove,
) {
  const lines = [];
  lines.push(`🏆 ${name?.trim() || "내 팀"} — Champions Codex`);
  lines.push("");

  slugs.forEach((slug, i) => {
    const p = getPokemonBySlug(slug);
    if (!p) return;
    const megaForm =
      mega?.slug === slug
        ? getMegaForms(slug).find((f) => f.formSlug === mega.form)
        : null;
    const item = getItem(items[slug]);
    const head = `${i + 1}. ${p.name.ko}${megaForm ? ` ✨${megaForm.label}` : ""}${
      item ? ` @ ${item.name.ko}` : megaForm ? " @ 메가스톤" : ""
    }`;
    lines.push(head);
    const types = megaForm ? megaForm.types : p.types;
    lines.push(`   타입: ${types.map(typeKo).join(" / ")}`);
    const build = builds?.[slug];
    if (build && !isEmptyBuild(build)) {
      const pts = STAT_KEYS.filter((k) => build.pts?.[k] > 0).map(
        (k) => `${STAT_SHORT[k]}${build.pts[k]}`,
      );
      const nature = [
        build.up ? `▲${STAT_SHORT[build.up]}` : null,
        build.down ? `▼${STAT_SHORT[build.down]}` : null,
      ]
        .filter(Boolean)
        .join(" ");
      const parts = [pts.join(" "), nature].filter(Boolean).join(" · ");
      if (parts) lines.push(`   능력: ${parts}`);
    }
    const mv = getMove
      ? (moves[slug] ?? []).map((m) => getMove(m)?.name.ko).filter(Boolean)
      : [];
    if (mv.length) lines.push(`   기술: ${mv.join(", ")}`);
    lines.push("");
  });

  lines.push("made with cola and 🔴  ·  Regulation M-B");
  return lines.join("\n").trim();
}
