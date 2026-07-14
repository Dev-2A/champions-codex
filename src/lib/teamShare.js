import { getPokemonBySlug } from "../data";

/**
 * 팀 공유 코드: 팀 상태(멤버·도구·기술)를 URL-safe base64로 인코딩.
 * URL 형식: #/team?share=<code>
 */

// t: [ [pokemonSlug, itemSlug|null, [moveSlug...]], ... ], m: [slug, formSlug] — v1
export function encodeTeam({ slugs = [], items = {}, moves = {}, mega = null }) {
  const payload = {
    v: 1,
    t: slugs.map((s) => [s, items[s] ?? null, moves[s] ?? []]),
    ...(mega?.slug ? { m: [mega.slug, mega.form] } : {}),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** 공유 코드 → 팀 상태. 형식이 깨졌으면 null. (내용 검증은 setTeam이 수행) */
export function decodeTeam(code) {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    if (payload.v !== 1 || !Array.isArray(payload.t)) return null;

    const slugs = [];
    const items = {};
    const moves = {};
    for (const entry of payload.t) {
      if (!Array.isArray(entry)) return null;
      const [slug, item, mv] = entry;
      if (typeof slug !== "string" || !getPokemonBySlug(slug)) continue;
      slugs.push(slug);
      if (typeof item === "string") items[slug] = item;
      if (Array.isArray(mv))
        moves[slug] = mv.filter((m) => typeof m === "string");
    }
    if (slugs.length === 0) return null;

    let mega = null;
    if (
      Array.isArray(payload.m) &&
      typeof payload.m[0] === "string" &&
      typeof payload.m[1] === "string"
    ) {
      mega = { slug: payload.m[0], form: payload.m[1] }; // 상세 검증은 setTeam이 수행
    }
    return { slugs, items, moves, mega };
  } catch {
    return null;
  }
}

/** 현재 배포 위치 기준 공유 URL (HashRouter 대응) */
export function buildShareUrl(team) {
  const base = `${location.origin}${location.pathname}${location.search}`;
  return `${base}#/team?share=${encodeTeam(team)}`;
}
