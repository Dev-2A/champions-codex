/**
 * scripts/prefetch.mjs
 * 빌드 타임 프리페치: 레귤레이션 legal 목록 → PokéAPI base 데이터 → 정적 JSON.
 * 배포 후 런타임 API 의존성 0. PokéAPI 페어유즈에 맞춰 로컬 캐시 + 딜레이 사용.
 *
 * 실행: node scripts/prefetch.mjs [regulationId=m-b]
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
const REG_PATH = join(ROOT, "src", "data", "regulations", `${REG_ID}.json`);

// 표준 18타입 (unknown/shadow/stellar 제외)
const TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const STAT_KEY = {
  hp: "hp",
  attack: "atk",
  defense: "def",
  "special-attack": "spa",
  "special-defense": "spd",
  speed: "spe",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ko = (names) => names.find((n) => n.language.name === "ko")?.name ?? null;

/** 캐시 우선 fetch (PokéAPI 페어유즈: 로컬 캐싱 권장) */
async function getJson(url) {
  const key = url.replace(API + "/", "").replace(/\//g, "__") + ".json";
  const cachePath = join(CACHE_DIR, key);
  if (existsSync(cachePath)) {
    return JSON.parse(await readFile(cachePath, "utf8"));
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await writeFile(cachePath, JSON.stringify(data));
      await sleep(120); // 요청 간 딜레이 (rate limit 예의)
      return data;
    } catch (err) {
      if (attempt === 3) throw new Error(`fetch 실패 (${url}): ${err.message}`);
      await sleep(600 * attempt);
    }
  }
}

/** 특성 한국어명 캐시 (여러 포켓몬이 공유하므로 메모이즈) */
const abilityKoCache = new Map();
async function abilityKo(slug) {
  if (abilityKoCache.has(slug)) return abilityKoCache.get(slug);
  try {
    const data = await getJson(`${API}/ability/${slug}`);
    const name = ko(data.names);
    abilityKoCache.set(slug, name);
    return name;
  } catch {
    abilityKoCache.set(slug, null);
    return null;
  }
}

async function buildPokedex(reg) {
  const out = [];
  let i = 0;
  const megaSet = new Set(reg.megaCapable ?? []);
  for (const slug of reg.legal) {
    i++;
    process.stdout.write(`  [${i}/${reg.legal.length}] ${slug} ... `);
    const p = await getJson(`${API}/pokemon/${slug}`);
    const species = await getJson(p.species.url);

    const stats = {};
    let total = 0;
    for (const s of p.stats) {
      const key = STAT_KEY[s.stat.name];
      if (key) {
        stats[key] = s.base_stat;
        total += s.base_stat;
      }
    }

    const abilities = [];
    for (const a of p.abilities) {
      abilities.push({
        slug: a.ability.name,
        ko: await abilityKo(a.ability.name),
        hidden: a.is_hidden,
      });
    }

    out.push({
      id: p.id,
      dexNum: species.id,
      slug: p.name,
      name: { ko: ko(species.names), en: p.name },
      genus:
        species.genera.find((g) => g.language.name === "ko")?.genus ?? null,
      types: p.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
      stats,
      total,
      abilities,
      sprite:
        p.sprites.other?.["official-artwork"]?.front_default ??
        p.sprites.front_default,
      canMega: megaSet.has(slug),
    });
    console.log(`✓ ${ko(species.names) ?? p.name}`);
  }
  return out.sort((a, b) => a.id - b.id); // 도감번호 순
}

async function buildTypeChart() {
  const meta = {};
  const chart = {};
  for (const t of TYPES) {
    const data = await getJson(`${API}/type/${t}`);
    meta[t] = { ko: ko(data.names) };
    const row = {};
    for (const d of TYPES) row[d] = 1;
    for (const r of data.damage_relations.double_damage_to)
      if (row[r.name] != null) row[r.name] = 2;
    for (const r of data.damage_relations.half_damage_to)
      if (row[r.name] != null) row[r.name] = 0.5;
    for (const r of data.damage_relations.no_damage_to)
      if (row[r.name] != null) row[r.name] = 0;
    chart[t] = row;
    console.log(`  type ${t} ✓ (${meta[t].ko ?? t})`);
  }
  return { types: TYPES, meta, chart };
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const reg = JSON.parse(await readFile(REG_PATH, "utf8"));
  console.log(`\n▶ 레귤레이션: ${reg.name} (legal ${reg.legal.length}종)\n`);

  console.log("▶ 타입 상성표 생성...");
  const typechart = await buildTypeChart();

  console.log("\n▶ 포켓몬 도감 생성...");
  const pokedex = await buildPokedex(reg);

  const generatedAt = new Date().toISOString();

  await writeFile(
    join(OUT_DIR, `pokedex.${reg.id}.json`),
    JSON.stringify(
      {
        generatedAt,
        regulation: reg.id,
        count: pokedex.length,
        pokemon: pokedex,
      },
      null,
      2,
    ),
  );
  await writeFile(
    join(OUT_DIR, "typechart.json"),
    JSON.stringify({ generatedAt, ...typechart }, null, 2),
  );
  await writeFile(
    join(OUT_DIR, `regulation.${reg.id}.json`),
    JSON.stringify(
      {
        id: reg.id,
        name: reg.name,
        nameKo: reg.nameKo,
        game: reg.game,
        startDate: reg.startDate,
        endDate: reg.endDate,
        format: reg.format,
        rules: reg.rules,
        notes: reg.notes,
        newMegas: reg.newMegas ?? [],
        count: pokedex.length,
      },
      null,
      2,
    ),
  );

  console.log(`\n✅ 완료: ${pokedex.length}종 + 타입 ${TYPES.length}개`);
  console.log(`   → src/data/generated/pokedex.${reg.id}.json`);
  console.log(`   → src/data/generated/typechart.json`);
  console.log(`   → src/data/generated/regulation.${reg.id}.json`);
}

main().catch((err) => {
  console.error("\n❌ 프리페치 실패:", err);
  process.exit(1);
});
