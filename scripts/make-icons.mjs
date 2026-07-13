/**
 * public/pokeball.svg → PWA 아이콘 (192/512, 브랜드 배경 + maskable 안전영역)
 * 실행: node scripts/make-icons.mjs
 */
import sharp from "sharp";

for (const size of [192, 512]) {
  const inner = Math.round(size * 0.62); // maskable 안전영역 (중앙 62%)
  const ball = await sharp("public/pokeball.svg", { density: 300 })
    .resize(inner, inner)
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: "#1a2442" },
  })
    .composite([{ input: ball }]) // 기본 중앙 배치
    .png()
    .toFile(`public/icon-${size}.png`);
  console.log(`✓ public/icon-${size}.png`);
}
