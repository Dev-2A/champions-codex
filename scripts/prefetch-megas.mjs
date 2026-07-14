/**
 * scripts/prefetch-megas.mjs
 * megaCapable 목록의 메가 폼 데이터 수집 → generated/megas.<reg>.json
 * - PokéAPI에 있는 폼({slug}-mega, -mega-x/-mega-y)은 자동 수집
 * - 챔피언스 신규 메가(API에 없음)는 src/data/champions/megas.custom.json에서 병합
 * 선행: npm run prefetch (도감·기존 캐시)
 * 실행: node scripts/prefetch-megas.mjs [regulationId=m-b]
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
const CUSTOM_PATH = join(ROOT, "src", "data", "champions", "megas.custom.json");

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

/** 캐시 우선 fetch. optional=true면 404 시 null (재시도 없음) */
async function getJson(url, { optional = false } = {}) {
  const key = url.replace(API + "/", "").replace(/\//g, "__") + ".json";
  const cachePath = join(CACHE_DIR, key);
  if (existsSync(cachePath))
    return JSON.parse(await readFile(cachePath, "utf8"));
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404 && optional) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await writeFile(cachePath, JSON.stringify(data));
      await sleep(120);
      return data;
    } catch (err) {
      if (attempt === 3) throw new Error(`fetch 실패 (${url}): ${err.message}`);
      await sleep(600 * attempt);
    }
  }
}

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

/** PokéAPI pokemon 응답 → 폼 객체 */
async function buildForm(p, baseNameKo, label) {
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
  return {
    formSlug: p.name,
    label,
    name: {
      ko: `메가 ${baseNameKo}${label === "메가" ? "" : ` ${label.replace("메가 ", "")}`}`,
      en: p.name,
    },
    id: p.id,
    types: p.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    stats,
    total,
    abilities,
    sprite: `sprites/pokemon/${p.id}.webp`,
    source: "pokeapi",
  };
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const reg = JSON.parse(await readFile(REG_PATH, "utf8"));
  const dex = JSON.parse(
    await readFile(join(OUT_DIR, `pokedex.${REG_ID}.json`), "utf8"),
  );
  const nameKoBySlug = new Map(dex.pokemon.map((p) => [p.slug, p.name.ko]));
  const custom = existsSync(CUSTOM_PATH)
    ? JSON.parse(await readFile(CUSTOM_PATH, "utf8"))
    : {};

  const megas = {};
  const missing = [];
  let i = 0;

  for (const slug of reg.megaCapable ?? []) {
    i++;
    // -meowstic-male 같은 폼 슬러그는 기본종 슬러그로 축약해서 시도
    const baseSlug = slug.replace(/-(male|female)$/, "");
    const baseNameKo = nameKoBySlug.get(slug) ?? slug;
    process.stdout.write(`  [${i}/${reg.megaCapable.length}] ${slug} ... `);

    const forms = [];
    // meowstic-male 같은 폼 슬러그는 원형/축약형 둘 다 시도
    const candidates = [...new Set([slug, baseSlug])];
    let single = null;
    for (const c of candidates) {
      single = await getJson(`${API}/pokemon/${c}-mega`, { optional: true });
      if (single) break;
    }
    if (single) {
      forms.push(await buildForm(single, baseNameKo, "메가"));
    } else {
      let x = null;
      let y = null;
      for (const c of candidates) {
        x = x ?? (await getJson(`${API}/pokemon/${c}-mega-x`, { optional: true }));
        y = y ?? (await getJson(`${API}/pokemon/${c}-mega-y`, { optional: true }));
      }
      if (x) forms.push(await buildForm(x, baseNameKo, "메가 X"));
      if (y) forms.push(await buildForm(y, baseNameKo, "메가 Y"));
    }

    if (forms.length) {
      megas[slug] = forms;
      console.log(`✓ ${forms.map((f) => f.label).join("·")}`);
    } else if (custom[slug]?.length) {
      megas[slug] = custom[slug].map((f) => ({ source: "custom", ...f }));
      console.log(`✓ 커스텀 ${custom[slug].length}폼`);
    } else {
      missing.push(slug);
      console.log("– 신규 메가 (커스텀 데이터 없음)");
    }
  }

  await writeFile(
    join(OUT_DIR, `megas.${REG_ID}.json`),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        regulation: REG_ID,
        count: Object.keys(megas).length,
        pending: missing,
        megas,
      },
      null,
      2,
    ),
  );

  console.log(
    `\n✅ ${Object.keys(megas).length}/${reg.megaCapable.length}종 수집`,
  );
  if (missing.length) {
    console.log(
      `📝 커스텀 큐레이션 대기 (${missing.length}종): ${missing.join(", ")}`,
    );
    console.log(`   → src/data/champions/megas.custom.json 에 채워지면 재실행`);
  }
  console.log(
    `💡 스프라이트: npm run prefetch:sprites 재실행 (메가 폼 이미지 다운로드)`,
  );
}

main().catch((err) => {
  console.error("\n❌ 메가 프리페치 실패:", err);
  process.exit(1);
});
