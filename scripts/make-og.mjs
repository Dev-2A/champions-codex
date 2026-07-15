/**
 * scripts/make-og.mjs
 * SNS 공유용 OG 이미지(1200×630) 생성 → public/og-image.png
 * 실행: node scripts/make-og.mjs
 */
import sharp from "sharp";

const W = 1200;
const H = 630;

const bg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#283a68"/>
      <stop offset="1" stop-color="#0d1120"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="#5b86e5"/>
  <text x="380" y="288" font-family="'Malgun Gothic','Segoe UI',sans-serif" font-weight="800" font-size="76" fill="#ffffff">Champions Codex</text>
  <text x="382" y="344" font-family="'Malgun Gothic','Segoe UI',sans-serif" font-weight="600" font-size="34" fill="#7aa2f7">포켓몬 챔피언스 뉴비 정보·DB 허브</text>
  <text x="382" y="392" font-family="'Malgun Gothic','Segoe UI',sans-serif" font-weight="400" font-size="26" fill="#a4b2ce">타입 상성 · 도감 · 팀 빌더 · 데미지 계산</text>
</svg>`;

const ball = await sharp("public/pokeball.svg", { density: 400 })
  .resize(240, 240)
  .png()
  .toBuffer();

await sharp(Buffer.from(bg))
  .composite([{ input: ball, left: 110, top: 195 }])
  .png()
  .toFile("public/og-image.png");

console.log("✓ public/og-image.png (1200×630)");
