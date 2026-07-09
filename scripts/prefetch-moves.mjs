/**
 * scripts/prefetch-moves.mjs
 * 생성된 도감을 읽어 224종의 learnable 기술 합집합을 구하고,
 * PokéAPI에서 각 기술의 한국어명·타입·분류·위력·명중·PP·설명을 수집 → 정적 JSON.
 * 선행: npm run prefetch (도감에 moves가 있어야 함)
 * 실행: node scripts/prefetch-moves.mjs [regulationId=m-b]
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const API = "https://pokeapi.co/api/v2";
const CACHE_DIR = join(ROOT, ".cache", "pokeapi");
const OUT_DIR = join(ROOT, "src", "data", "generated");
const REG_ID = process.argv[2] || "m-b";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ko = (arr) => arr.find((n) => n.language.name === "ko")?.name ?? null;

async function getJson(url) {
  const key = url.replace(API + "/" + "").replace(/\//g, "__") + ".json";
  const cachePath = join(CACHE_DIR, key);
  if (existsSync(cachePath))
    return JSON.parse(await readFile(cachePath, "utf8"));
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await writeFile(cachePath, JSON.stringify(data));
      await sleep(80);
      return data;
    } catch (err) {
      if (attempt === 3) throw new Error(`fetch 실패 (${url}): ${err.message}`);
      await sleep(500 * attempt);
    }
  }
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  const dex = JSON.parse(
    await readFile(join(OUT_DIR, `pokedex.${REG_ID}.json`), "utf8"),
  );

  const union = [...new Set(dex.pokemon.flatMap((p) => p.moves ?? []))].sort();
  console.log(`▶ learnable 기술 합집합: ${union.length}개\n`);

  const out = [];
  const fails = [];
  let i = 0;
  for (const slug of union) {
    i++;
    if (i % 60 === 0) process.stdout.write(`  [${i}/${union.length}]\n`);
    try {
      const d = await getJson(`${API}/move/${slug}`);
      const koFlavors = d.flavor_text_entries.filter(
        (f) => f.language.name === "ko",
      );
      const desc = koFlavors.length
        ? koFlavors[koFlavors.length - 1].flavor_text.replace(/\n/g, " ")
        : null;
      const effect =
        d.effect_entries.find((e) => e.language.name === "en")?.short_effect ??
        null;
      out.push({
        slug: d.name,
        id: d.id,
        name: { ko: ko(d.names), en: d.name },
        type: d.type?.name ?? null,
        damageClass: d.damage_class?.name ?? null, // physical | special | status
        power: d.power,
        accuracy: d.accuracy,
        pp: d.pp,
        desc: desc ?? (effect ? effect.replace(/\$effect_chance%/g, "") : null),
      });
    } catch {
      fails.push(slug);
    }
  }

  out.sort((a, b) => a.id - b.id);
  await writeFile(
    join(OUT_DIR, "moves.json"),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), count: out.length, moves: out },
      null,
      2,
    ),
  );

  console.log(
    `\n✅ ${out.length}/${union.length}개 생성 → src/data/generated/moves.json`,
  );
  if (fails.length) console.log("❌ 실패:", fails.join(", "));
}

main().catch((e) => {
  console.error("실패:", e);
  process.exit(1);
});
