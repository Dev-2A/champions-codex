import { assetUrl } from "./assets";
import { typeColors } from "./typeColors";
import { typeKo } from "../data";

// 도감 목록을 Canvas로 직접 렌더해 PNG로 저장 (외부 라이브러리 없음).
// 스프라이트는 same-origin webp라 캔버스가 오염되지 않아 toBlob 가능.

const COLS = 6;
const CELL_W = 150;
const CELL_H = 176;
const PAD = 28;
const HEADER_H = 84;
const FOOTER_H = 40;
const SPRITE = 96;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // 실패해도 셀은 그림 (스프라이트만 공백)
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * @param {Array} list  필터·정렬된 포켓몬 배열
 * @param {object} opts { title, subtitle }
 * @returns {Promise<Blob>}
 */
export async function renderDexImage(list, { title, subtitle } = {}) {
  const cols = Math.min(COLS, Math.max(1, list.length));
  const rows = Math.ceil(list.length / cols);
  const dpr = 2;
  const W = cols * CELL_W + PAD * 2;
  const H = HEADER_H + rows * CELL_H + FOOTER_H + PAD;

  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.textBaseline = "alphabetic";

  // 배경 (공유용 밝은 테마 고정)
  ctx.fillStyle = "#f5f7fb";
  ctx.fillRect(0, 0, W, H);

  // 헤더
  ctx.fillStyle = "#5b86e5";
  ctx.font = "bold 24px 'Malgun Gothic', system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(title ?? "포켓몬 도감", PAD, 42);
  if (subtitle) {
    ctx.fillStyle = "#6f80a3";
    ctx.font = "14px 'Malgun Gothic', system-ui, sans-serif";
    ctx.fillText(subtitle, PAD, 66);
  }

  const imgs = await Promise.all(
    list.map((p) => loadImage(assetUrl(p.sprite))),
  );

  list.forEach((p, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = PAD + col * CELL_W;
    const y = HEADER_H + row * CELL_H;

    // 카드 배경
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x + 4, y + 4, CELL_W - 8, CELL_H - 8, 14);
    ctx.fill();

    // 도감번호
    ctx.fillStyle = "#a4b2ce";
    ctx.font = "bold 11px 'Malgun Gothic', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`#${String(p.id).padStart(4, "0")}`, x + 14, y + 22);

    // 스프라이트
    if (imgs[i]) {
      ctx.drawImage(imgs[i], x + (CELL_W - SPRITE) / 2, y + 16, SPRITE, SPRITE);
    }

    // 이름
    ctx.fillStyle = "#1c2440";
    ctx.font = "bold 14px 'Malgun Gothic', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.name.ko, x + CELL_W / 2, y + 128, CELL_W - 20);

    // 타입 배지
    const badgeY = y + 140;
    const bw = 44;
    const gap = 5;
    const totalW = p.types.length * bw + (p.types.length - 1) * gap;
    let bx = x + (CELL_W - totalW) / 2;
    for (const t of p.types) {
      const c = typeColors[t] ?? { bg: "#94a3b8", text: "#ffffff" };
      ctx.fillStyle = c.bg;
      roundRect(ctx, bx, badgeY, bw, 18, 9);
      ctx.fill();
      ctx.fillStyle = c.text;
      ctx.font = "bold 10px 'Malgun Gothic', system-ui, sans-serif";
      ctx.fillText(typeKo(t), bx + bw / 2, badgeY + 13);
      bx += bw + gap;
    }
  });

  // 푸터
  ctx.fillStyle = "#a4b2ce";
  ctx.font = "12px 'Malgun Gothic', system-ui, sans-serif";
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

/** Blob을 파일로 다운로드 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
