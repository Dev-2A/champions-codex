import {
  getPokemonBySlug,
  pokemonList,
  getItem,
  items,
  getMegaForms,
} from "../data";
import { loadMoveDb } from "../data/moveDb";

// Pokémon Showdown 팀 텍스트 + 우리 자체 팀 시트를 관대하게 파싱한다.
// 인식한 것만 반영하고, 못 읽은 항목은 warnings로 안내.

// Showdown 성격 → [상승, 하락] 스탯 키 (중립 성격은 없음)
const NATURES = {
  lonely: ["atk", "def"],
  brave: ["atk", "spe"],
  adamant: ["atk", "spa"],
  naughty: ["atk", "spd"],
  bold: ["def", "atk"],
  relaxed: ["def", "spe"],
  impish: ["def", "spa"],
  lax: ["def", "spd"],
  timid: ["spe", "atk"],
  hasty: ["spe", "def"],
  jolly: ["spe", "spa"],
  naive: ["spe", "spd"],
  modest: ["spa", "atk"],
  mild: ["spa", "def"],
  quiet: ["spa", "spe"],
  rash: ["spa", "spd"],
  calm: ["spd", "atk"],
  gentle: ["spd", "def"],
  sassy: ["spd", "spe"],
  careful: ["spd", "spa"],
};
// 우리 시트 약자(H/A/B/C/D/S) → 스탯 키
const SHORT_TO_KEY = {
  h: "hp",
  a: "atk",
  b: "def",
  c: "spa",
  d: "spd",
  s: "spe",
};

const normSlug = (s = "") =>
  s
    .trim()
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[\s_]+/g, "-");

function matchSpecies(name) {
  if (!name) return null;
  const slug = normSlug(name);
  if (getPokemonBySlug(slug)) return slug;
  const ko = pokemonList.find((p) => p.name.ko === name.trim());
  return ko?.slug ?? null;
}

function matchItem(text) {
  if (!text) return null;
  const slug = normSlug(text);
  if (getItem(slug)) return slug;
  const ko = items.find((it) => it.name.ko === text.trim());
  return ko?.slug ?? null;
}

function matchMove(text, moveDb) {
  if (!text) return null;
  const slug = normSlug(text);
  if (moveDb.getMove(slug)) return slug;
  const ko = moveDb.moves.find((m) => m.name.ko === text.trim());
  return ko?.slug ?? null;
}

const isMegaStone = (item = "") =>
  /ite(\s*[xy])?$/i.test(item.trim()) ||
  item.includes("메가스톤") ||
  item.includes("나이트");

function detectMega(slug, itemRaw, letter) {
  const forms = getMegaForms(slug);
  if (!forms.length) return null;
  if (forms.length === 1) return forms[0].formSlug;
  const L = (letter || itemRaw?.match(/\b([xy])\b/i)?.[1] || "").toLowerCase();
  const found = forms.find((f) => f.formSlug.endsWith(`-mega-${L}`));
  return found?.formSlug ?? forms[0].formSlug;
}

function parseEVs(line) {
  const pts = {};
  for (const part of line.split("/")) {
    const m = part.trim().match(/(\d+)\s*(hp|atk|def|spa|spd|spe)/i);
    if (m) pts[m[2].toLowerCase()] = Math.min(32, Math.round(Number(m[1]) / 8));
  }
  return pts;
}

function parseOurPoints(line) {
  const pts = {};
  for (const m of line.matchAll(/([habcds])\s*(\d+)/gi)) {
    const key = SHORT_TO_KEY[m[1].toLowerCase()];
    if (key) pts[key] = Math.min(32, Number(m[2]));
  }
  return pts;
}

function parseNature(line) {
  const named = line.match(/(\w+)\s+nature/i);
  if (named && NATURES[named[1].toLowerCase()]) {
    const [up, down] = NATURES[named[1].toLowerCase()];
    return { up, down };
  }
  const up = line.match(/▲\s*([habcds])/i);
  const down = line.match(/▼\s*([habcds])/i);
  if (up || down) {
    return {
      up: up ? SHORT_TO_KEY[up[1].toLowerCase()] : null,
      down: down ? SHORT_TO_KEY[down[1].toLowerCase()] : null,
    };
  }
  return null;
}

function parseBlock(lines, moveDb) {
  let header = lines[0].replace(/^\d+\.\s*/, ""); // "1. " 접두 제거
  const megaMark = header.match(/✨?\s*메가\s*([xy])?|\(mega(?:\s*([xy]))?\)/i);
  const megaLetter = megaMark ? megaMark[1] || megaMark[2] || null : null;
  if (megaMark) header = header.replace(megaMark[0], " ");

  const at = header.indexOf("@");
  const itemRaw = at >= 0 ? header.slice(at + 1).trim() : null;
  let species = (at >= 0 ? header.slice(0, at) : header).trim();
  const paren = species.match(/\(([^)]+)\)\s*$/); // "Nickname (Species)"
  if (paren) species = paren[1].trim();

  const slug = matchSpecies(species);
  if (!slug) return { warning: `"${species.slice(0, 24)}" — 못 찾은 포켓몬` };

  const item = matchItem(itemRaw);
  const mega =
    megaMark || (itemRaw && isMegaStone(itemRaw))
      ? detectMega(slug, itemRaw, megaLetter)
      : null;

  const moveList = [];
  let pts = {};
  let nature = null;
  for (const line of lines.slice(1)) {
    if (/^[-•]/.test(line)) {
      const mv = matchMove(line.replace(/^[-•]\s*/, ""), moveDb);
      if (mv) moveList.push(mv);
    } else if (/^기술\s*:/i.test(line)) {
      for (const part of line.replace(/^기술\s*:\s*/i, "").split(",")) {
        const mv = matchMove(part.trim(), moveDb);
        if (mv) moveList.push(mv);
      }
    } else if (/^evs?\s*:/i.test(line)) {
      pts = { ...pts, ...parseEVs(line.replace(/^evs?\s*:\s*/i, "")) };
    } else if (/^능력\s*:/i.test(line)) {
      pts = { ...pts, ...parseOurPoints(line) };
      nature = nature || parseNature(line);
    } else if (/nature/i.test(line) || /[▲▼]/.test(line)) {
      nature = nature || parseNature(line);
    }
  }

  let build = null;
  if (Object.values(pts).some((v) => v > 0) || nature) {
    build = {
      pts: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...pts },
      up: nature?.up === "hp" ? null : (nature?.up ?? null),
      down: nature?.down === "hp" ? null : (nature?.down ?? null),
    };
  }

  return {
    slug,
    item: mega ? null : item, // 메가면 도구 슬롯을 스톤이 차지
    moves: [...new Set(moveList)].slice(0, 4),
    mega,
    build,
  };
}

/**
 * 팀 텍스트 → { team, warnings } 또는 null(인식 실패).
 * team은 useTeamStore.setTeam이 그대로 받아 검증한다.
 */
export async function parseTeamText(text) {
  const moveDb = await loadMoveDb();
  const blocks = text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((b) =>
      b
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    )
    .filter((b) => b.length);

  const slugs = [];
  const outItems = {};
  const moves = {};
  const builds = {};
  const warnings = [];
  let mega = null;

  for (const lines of blocks) {
    if (slugs.length >= 6) {
      warnings.push("6마리까지만 가져왔어요.");
      break;
    }
    const p = parseBlock(lines, moveDb);
    if (!p) continue;
    if (p.warning) {
      warnings.push(p.warning);
      continue;
    }
    if (slugs.includes(p.slug)) continue;
    slugs.push(p.slug);
    if (p.item) outItems[p.slug] = p.item;
    if (p.moves.length) moves[p.slug] = p.moves;
    if (p.build) builds[p.slug] = p.build;
    if (p.mega && !mega) mega = { slug: p.slug, form: p.mega };
  }

  if (slugs.length === 0) return null;
  return {
    team: { slugs, items: outItems, moves, mega, builds },
    warnings,
  };
}
