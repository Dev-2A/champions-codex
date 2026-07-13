/**
 * scripts/fetch-sprites.mjs
 * 스프라이트 로컬화: 원격(PokéAPI GitHub) 스프라이트를 받아 public/sprites/ 에 저장.
 * 배포 후 이미지까지 완전 자립 (런타임 외부 의존성 0).
 *
 * - 포켓몬: official-artwork(475px PNG) → 192px WebP로 축소 (sharp)
 * - 도구: 30px PNG 원본 그대로
 * - 이미 있는 파일은 건너뜀 (증분 실행 가능)
 *
 * 선행: npm run prefetch, npm run prefetch:items
 * 실행: node scripts/fetch-sprites.mjs [regulationId=m-b]
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GEN_DIR = join(ROOT, "src", "data", "generated");
const OUT_POKEMON = join(ROOT, "public", "sprites", "pokemon");
const OUT_ITEMS = join(ROOT, "public", "sprites", "items");
const SPRITES_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites";

const REG_ID = process.argv[2] || "m-b";
const SIZE = 192; // 카드/상세에서 쓰는 최대 표시 크기(size-28=112px)의 레티나 대응

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchBuffer(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt === 3) throw new Error(`fetch 실패 (${url}): ${err.message}`);
      await sleep(500 * attempt);
    }
  }
}

/** 소량 병렬 실행 (rate limit 예의) */
async function runPool(tasks, size = 6) {
  const queue = [...tasks];
  const fails = [];
  let done = 0;
  const total = tasks.length;
  await Promise.all(
    Array.from({ length: Math.min(size, queue.length) }, async () => {
      while (queue.length) {
        const task = queue.shift();
        try {
          await task.run();
        } catch (err) {
          fails.push(`${task.label}: ${err.message}`);
        }
        done++;
        if (done % 25 === 0 || done === total)
          console.log(`  [${done}/${total}]`);
      }
    }),
  );
  return fails;
}

async function main() {
  await mkdir(OUT_POKEMON, { recursive: true });
  await mkdir(OUT_ITEMS, { recursive: true });

  const dex = JSON.parse(
    await readFile(join(GEN_DIR, `pokedex.${REG_ID}.json`), "utf8"),
  );
  const itemsFile = JSON.parse(
    await readFile(join(GEN_DIR, "items.json"), "utf8"),
  );

  // ── 포켓몬 (official artwork → webp) ──
  const pokemonTasks = dex.pokemon
    .filter((p) => !existsSync(join(OUT_POKEMON, `${p.id}.webp`)))
    .map((p) => ({
      label: p.slug,
      run: async () => {
        let buf;
        try {
          buf = await fetchBuffer(
            `${SPRITES_BASE}/pokemon/other/official-artwork/${p.id}.png`,
          );
        } catch {
          // official artwork가 없는 폼은 기본 스프라이트로 폴백
          buf = await fetchBuffer(`${SPRITES_BASE}/pokemon/${p.id}.png`);
        }
        const webp = await sharp(buf)
          .resize(SIZE, SIZE, { fit: "inside" })
          .webp({ quality: 82 })
          .toBuffer();
        await writeFile(join(OUT_POKEMON, `${p.id}.webp`), webp);
      },
    }));

  console.log(
    `▶ 포켓몬 스프라이트: ${pokemonTasks.length}개 다운로드 (${dex.pokemon.length - pokemonTasks.length}개 스킵)`,
  );
  const pokemonFails = await runPool(pokemonTasks);

  // ── 도구 (30px png 원본 그대로) ──
  const itemTasks = itemsFile.items
    .filter(
      (it) => it.sprite && !existsSync(join(OUT_ITEMS, `${it.slug}.png`)),
    )
    .map((it) => ({
      label: it.slug,
      run: async () => {
        const buf = await fetchBuffer(`${SPRITES_BASE}/items/${it.slug}.png`);
        await writeFile(join(OUT_ITEMS, `${it.slug}.png`), buf);
      },
    }));

  console.log(`\n▶ 도구 스프라이트: ${itemTasks.length}개 다운로드`);
  const itemFails = await runPool(itemTasks);

  console.log(`\n✅ 완료 → public/sprites/`);
  const fails = [...pokemonFails, ...itemFails];
  if (fails.length) {
    console.log(`❌ 실패 ${fails.length}건:`);
    for (const f of fails) console.log("   " + f);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n❌ 스프라이트 프리페치 실패:", err);
  process.exit(1);
});
