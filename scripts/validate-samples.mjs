/**
 * scripts/validate-samples.mjs
 * 추천 세트(samples.json) 정합성 검증 — 빌드에 자동 편입됨 (package.json build).
 * 레귤레이션 로테이션 후 세트가 낡으면 빌드가 실패해서 방치를 막는다.
 * 검증: 도감 등재 · 기술이 러닝셋에 존재 · 도구 실존 · 메가 폼 실존 · 포인트 예산
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const j = async (p) => JSON.parse(await readFile(join(ROOT, p), "utf8"));

const data = await j("src/data/champions/samples.json");
const REG = data.regulation ?? "m-b";
const { learnsets } = await j(`src/data/generated/learnsets.${REG}.json`);
const items = new Set(
  (await j("src/data/generated/items.json")).items.map((i) => i.slug),
);
const megas = (await j(`src/data/generated/megas.${REG}.json`)).megas;
const dex = new Set(
  (await j(`src/data/generated/pokedex.${REG}.json`)).pokemon.map(
    (p) => p.slug,
  ),
);

let fails = 0;
for (const s of data.samples) {
  const errs = [];
  if (!dex.has(s.slug)) errs.push("도감에 없음");
  const ls = new Set(learnsets[s.slug] ?? []);
  for (const m of s.moves ?? []) if (!ls.has(m)) errs.push(`기술 없음: ${m}`);
  if (s.item && !items.has(s.item)) errs.push(`도구 없음: ${s.item}`);
  if (s.mega && !(megas[s.slug] ?? []).some((f) => f.formSlug === s.mega))
    errs.push(`메가 폼 없음: ${s.mega}`);
  const sum = Object.values(s.build?.pts ?? {}).reduce((a, b) => a + b, 0);
  if (sum > 66) errs.push(`포인트 초과: ${sum}`);
  if (errs.length) {
    console.error(`✗ ${s.slug} (${s.title}): ${errs.join(", ")}`);
    fails++;
  }
}

if (fails) {
  console.error(
    `\n❌ 추천 세트 ${fails}건 정합성 실패 — samples.json을 수정하거나 세트를 제거하세요.`,
  );
  process.exit(1);
}
console.log(`✅ 추천 세트 ${data.samples.length}종 정합성 통과 (${REG})`);
