/**
 * scripts/prefetch-items.mjs
 * 큐레이션한 도구 목록 → PokéAPI에서 한국어명·설명·스프라이트 수집 → 정적 JSON.
 * 실행: node scripts/prefetch-items.mjs
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
const SRC = join(ROOT, "src", "data", "champions", "items.source.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ko = (arr) => arr.find((n) => n.language.name === "ko")?.name ?? null;

async function getJson(url) {
  const key = url.replace(API + "/", "").replace(/\//g, "__") + ".json";
  const cachePath = join(CACHE_DIR, key);
  if (existsSync(cachePath))
    return JSON.parse(await readFile(cachePath, "utf8"));
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await writeFile(cachePath, JSON.stringify(data));
      await sleep(90);
      return data;
    } catch (err) {
      if (attempt === 3) throw new Error(`fetch 실패 (${url}): ${err.message}`);
      await sleep(500 * attempt);
    }
  }
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });
  const src = JSON.parse(await readFile(SRC, "utf8"));

  const out = [];
  const fails = [];
  let i = 0;
  for (const item of src.items) {
    const { slug, cat } = item;
    i++;
    process.stdout.write(`  [${i}/${src.items.length}] ${slug} ... `);
    try {
      const d = await getJson(`${API}/item/${slug}`);
      const koFlavors = d.flavor_text_entries.filter(
        (f) => f.language.name === "ko",
      );
      const desc = koFlavors.length
        ? koFlavors[koFlavors.length - 1].text.replace(/\n/g, " ")
        : null;
      const effect =
        d.effect_entries.find((e) => e.language.name === "en")?.short_effect ??
        null;
      out.push({
        slug: d.name,
        id: d.id,
        name: { ko: ko(d.names) ?? item.ko ?? null, en: d.name },
        cat,
        pokeCategory: d.category?.name ?? null,
        sprite: d.sprites?.default ?? null,
        desc: desc ?? item.desc ?? null,
        effect,
      });
      console.log(`✓ ${ko(d.names) ?? item.ko ?? d.name}`);
    } catch (e) {
      fails.push(slug);
      console.log(`✗ ${e.message}`);
    }
  }

  await writeFile(
    join(OUT_DIR, "items.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        categories: src.categories,
        count: out.length,
        items: out,
      },
      null,
      2,
    ),
  );

  console.log(`\n✅ ${out.length}/${src.items.length}개 생성`);
  if (fails.length) console.log("❌ 실패:", fails.join(", "));
}

main().catch((e) => {
  console.error("실패:", e);
  process.exit(1);
});
