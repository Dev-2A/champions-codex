import {
  getPokemonBySlug,
  getItem,
  getMegaForms,
  typeKo,
  regulationCode,
} from "../data";
import { loadMoveDb } from "../data/moveDb";
import { typeColors } from "./typeColors";
import { assetUrl } from "./assets";
import { loadImage, roundRect } from "./dexImage";
import { STAT_KEYS, STAT_SHORT, isEmptyBuild } from "./statCalc";

// 팀을 Canvas로 렌더해 PNG로 저장 (도감 이미지와 동일한 방식·헬퍼 재사용).
const PAD = 28;
const HEADER_H = 76;
const FOOTER_H = 40;
const CARD_W = 360;
const CARD_H = 316;
const SPRITE = 84;

const FONT = (w, s) =>
  `${w} ${s}px 'Malgun Gothic', system-ui, sans-serif`;

function buildSummary(build) {
  if (isEmptyBuild(build)) return null;
  const pts = STAT_KEYS.filter((k) => build.pts[k] > 0).map(
    (k) => `${STAT_SHORT[k]}${build.pts[k]}`,
  );
  const nature = [
    build.up ? `▲${STAT_SHORT[build.up]}` : null,
    build.down ? `▼${STAT_SHORT[build.down]}` : null,
  ]
    .filter(Boolean)
    .join("");
  return [pts.join(" "), nature].filter(Boolean).join(" · ");
}

function drawBadges(ctx, types, cx, y) {
  const bw = 46;
  const gap = 5;
  const totalW = types.length * bw + (types.length - 1) * gap;
  let bx = cx - totalW / 2;
  for (const t of types) {
    const c = typeColors[t] ?? { bg: "#94a3b8", text: "#ffffff" };
    ctx.fillStyle = c.bg;
    roundRect(ctx, bx, y, bw, 18, 9);
    ctx.fill();
    ctx.fillStyle = c.text;
    ctx.font = FONT("bold", 10);
    ctx.textAlign = "center";
    ctx.fillText(typeKo(t), bx + bw / 2, y + 13);
    bx += bw + gap;
  }
}

/**
 * @param {object} team { slugs, items, moves, mega, builds }
 * @param {object} opts { name }
 * @returns {Promise<Blob>}
 */
export async function renderTeamImage(
  { slugs, items, moves, mega, builds },
  { name } = {},
) {
  const moveDb = await loadMoveDb();
  const members = slugs.map(getPokemonBySlug).filter(Boolean);
  const cols = Math.min(3, Math.max(1, members.length));
  const rows = Math.ceil(members.length / cols);
  const dpr = 2;
  const W = cols * CARD_W + PAD * 2;
  const H = HEADER_H + rows * CARD_H + FOOTER_H + PAD;

  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#f5f7fb";
  ctx.fillRect(0, 0, W, H);

  // 헤더
  ctx.fillStyle = "#5b86e5";
  ctx.font = FONT("800", 26);
  ctx.textAlign = "left";
  ctx.fillText(`🏆 ${name?.trim() || "내 팀"}`, PAD, 44);
  ctx.fillStyle = "#6f80a3";
  ctx.font = FONT("600", 14);
  ctx.fillText(`${members.length}마리 · Regulation ${regulationCode}`, PAD, 66);

  // 스프라이트 프리로드 (메가면 메가 스프라이트)
  const megaFormOf = (slug) =>
    mega?.slug === slug
      ? (getMegaForms(slug).find((f) => f.formSlug === mega.form) ?? null)
      : null;
  const sprites = await Promise.all(
    members.map((p) => loadImage(assetUrl(megaFormOf(p.slug)?.sprite ?? p.sprite))),
  );

  members.forEach((p, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = PAD + col * CARD_W;
    const y = HEADER_H + row * CARD_H;
    const cx = x + CARD_W / 2;
    const mf = megaFormOf(p.slug);

    // 카드
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x + 6, y + 6, CARD_W - 12, CARD_H - 12, 16);
    ctx.fill();

    // 스프라이트
    if (sprites[i]) {
      ctx.drawImage(sprites[i], cx - SPRITE / 2, y + 18, SPRITE, SPRITE);
    }

    // 이름 (+ 메가 라벨)
    ctx.fillStyle = "#1c2440";
    ctx.font = FONT("bold", 17);
    ctx.textAlign = "center";
    const label = mf ? `${p.name.ko} ✨${mf.label}` : p.name.ko;
    ctx.fillText(label, cx, y + 122, CARD_W - 32);

    // 타입 배지
    drawBadges(ctx, mf?.types ?? p.types, cx, y + 134);

    // 도구
    const item = getItem(items[p.slug]);
    ctx.fillStyle = "#4b5a7a";
    ctx.font = FONT("600", 13);
    ctx.textAlign = "center";
    ctx.fillText(
      mf ? "@ 메가스톤" : item ? `@ ${item.name.ko}` : "@ —",
      cx,
      y + 176,
      CARD_W - 32,
    );

    // 기술 4개 (좌측 정렬)
    ctx.textAlign = "left";
    const mv = (moves[p.slug] ?? [])
      .map((m) => moveDb.getMove(m)?.name.ko)
      .filter(Boolean);
    for (let k = 0; k < 4; k++) {
      const ty = y + 200 + k * 20;
      ctx.fillStyle = mv[k] ? "#5b86e5" : "#cdd6e8";
      ctx.font = FONT("bold", 12);
      ctx.fillText("•", x + 26, ty);
      ctx.fillStyle = mv[k] ? "#283152" : "#a4b2ce";
      ctx.font = FONT("500", 13);
      ctx.fillText(mv[k] ?? "기술 없음", x + 40, ty, CARD_W - 60);
    }

    // 능력 요약
    const summary = buildSummary(builds?.[p.slug]);
    if (summary) {
      ctx.fillStyle = "#6f80a3";
      ctx.font = FONT("bold", 12);
      ctx.textAlign = "center";
      ctx.fillText(summary, cx, y + CARD_H - 20, CARD_W - 32);
    }
  });

  // 푸터
  ctx.fillStyle = "#a4b2ce";
  ctx.font = FONT("400", 12);
  ctx.textAlign = "center";
  ctx.fillText(
    "Champions Codex · dev-2a.github.io/champions-codex",
    W / 2,
    H - PAD / 2,
  );

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/png"),
  );
}
