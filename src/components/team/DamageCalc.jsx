import { useState } from "react";
import { Search, X, Info } from "lucide-react";
import { pokemonList, getMegaForms, getPokemonBySlug } from "../../data";
import { getMultiplier } from "../../lib/typeEffectiveness";
import { computeStats } from "../../lib/statCalc";
import { calcDamage, koText, pct } from "../../lib/damageCalc";
import { matchKo } from "../../lib/search";
import { assetUrl } from "../../lib/assets";
import { useMoveDb } from "../../hooks/useMoveDb";
import TypeBadge from "../common/TypeBadge";

// 상대 내구 프리셋 (능력 포인트 분배 가정)
const DEF_PRESETS = [
  { id: "none", label: "무보정", build: null },
  {
    id: "phys",
    label: "H·B 32",
    build: { pts: { hp: 32, atk: 0, def: 32, spa: 0, spd: 0, spe: 0 } },
  },
  {
    id: "spec",
    label: "H·D 32",
    build: { pts: { hp: 32, atk: 0, def: 0, spa: 0, spd: 32, spe: 0 } },
  },
];

export default function DamageCalc({ team, movesMap, builds, mega }) {
  const moveDb = useMoveDb();
  const [attackerSlug, setAttackerSlug] = useState(team[0]?.slug ?? null);
  const [defenderSlug, setDefenderSlug] = useState(null);
  const [defPreset, setDefPreset] = useState("none");
  const [spread, setSpread] = useState(false);
  const [q, setQ] = useState("");

  const attacker = getPokemonBySlug(
    team.some((p) => p.slug === attackerSlug) ? attackerSlug : team[0]?.slug,
  );
  const defender = defenderSlug ? getPokemonBySlug(defenderSlug) : null;

  // 공격자: 메가 폼 + 능력치 빌드 반영
  const megaForm =
    attacker && mega?.slug === attacker.slug
      ? (getMegaForms(attacker.slug).find((f) => f.formSlug === mega.form) ??
        null)
      : null;
  const atkTypes = megaForm?.types ?? attacker?.types ?? [];
  const atkStats = attacker
    ? computeStats(megaForm?.stats ?? attacker.stats, builds[attacker.slug])
    : null;

  const damagingMoves =
    moveDb && attacker
      ? moveDb
          .resolveMoves(movesMap[attacker.slug] ?? [])
          .filter((m) => m.damageClass !== "status" && m.power != null)
      : [];

  const query = q.trim().toLowerCase();
  const searchResults = query
    ? pokemonList
        .filter(
          (p) =>
            matchKo(p.name.ko, query) ||
            p.slug.includes(query) ||
            String(p.id).includes(query),
        )
        .slice(0, 8)
    : [];

  const defBuild = DEF_PRESETS.find((p) => p.id === defPreset)?.build ?? null;
  const defStats = defender ? computeStats(defender.stats, defBuild) : null;

  if (team.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* 공격자 선택 */}
      <div>
        <p className="mb-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
          내 공격 멤버
        </p>
        <div className="flex flex-wrap gap-1.5">
          {team.map((p) => {
            const on = p.slug === attacker?.slug;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setAttackerSlug(p.slug)}
                className={[
                  "rounded-xl border p-1 transition",
                  on
                    ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-400 dark:bg-ink-800"
                    : "border-ink-200 hover:border-brand-300 dark:border-ink-800",
                ].join(" ")}
                title={p.name.ko}
              >
                <img
                  src={assetUrl(
                    mega?.slug === p.slug
                      ? (getMegaForms(p.slug).find(
                          (f) => f.formSlug === mega.form,
                        )?.sprite ?? p.sprite)
                      : p.sprite,
                  )}
                  alt={p.name.ko}
                  className="size-10 object-contain"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 상대 선택 */}
      <div>
        <p className="mb-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
          상대 포켓몬
        </p>
        {defender ? (
          <div className="flex items-center gap-2 rounded-xl border border-ink-200 p-2 dark:border-ink-800">
            <img
              src={assetUrl(defender.sprite)}
              alt={defender.name.ko}
              className="size-10 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-800 dark:text-ink-100">
                {defender.name.ko}
              </p>
              <div className="mt-0.5 flex gap-1">
                {defender.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </div>
            {defStats && (
              <span className="shrink-0 text-[11px] text-ink-400 dark:text-ink-500">
                HP {defStats.hp} · B {defStats.def} · D {defStats.spd}
              </span>
            )}
            <button
              type="button"
              onClick={() => setDefenderSlug(null)}
              className="grid size-7 shrink-0 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-label="상대 변경"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="상대 검색 (초성 가능)"
                className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-8 pr-2 text-sm outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-950"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {searchResults.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => {
                      setDefenderSlug(p.slug);
                      setQ("");
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-ink-200 p-1 text-left transition hover:border-brand-300 dark:border-ink-800"
                  >
                    <img
                      src={assetUrl(p.sprite)}
                      alt={p.name.ko}
                      loading="lazy"
                      className="size-8 shrink-0 object-contain"
                    />
                    <span className="truncate text-[11px] font-bold text-ink-800 dark:text-ink-100">
                      {p.name.ko}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 상대 내구 가정 + 광역 보정 */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-ink-400 dark:text-ink-500">상대 내구:</span>
          {DEF_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setDefPreset(p.id)}
              className={[
                "rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors",
                defPreset === p.id
                  ? "bg-brand-500 text-white"
                  : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
          <label className="ml-auto flex cursor-pointer items-center gap-1 text-[11px] text-ink-500 dark:text-ink-400">
            <input
              type="checkbox"
              checked={spread}
              onChange={(e) => setSpread(e.target.checked)}
              className="accent-brand-500"
            />
            광역 보정 ×0.75 (지진·열풍 등)
          </label>
        </div>
      </div>

      {/* 결과 */}
      {!moveDb ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-4 text-center text-xs text-ink-400 dark:border-ink-700 dark:text-ink-500">
          기술 데이터를 불러오는 중…
        </p>
      ) : !defender ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-4 text-center text-xs text-ink-400 dark:border-ink-700 dark:text-ink-500">
          상대 포켓몬을 검색해서 선택하세요.
        </p>
      ) : damagingMoves.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-4 text-center text-xs text-ink-400 dark:border-ink-700 dark:text-ink-500">
          {attacker?.name.ko}에게 선택된 공격 기술이 없어요. 멤버 편집에서
          기술을 먼저 골라주세요.
        </p>
      ) : (
        <div className="space-y-1.5">
          {damagingMoves.map((m) => {
            const physical = m.damageClass === "physical";
            const typeMult = getMultiplier(m.type, defender.types);
            const dmg = calcDamage({
              power: m.power,
              attack: physical ? atkStats.atk : atkStats.spa,
              defense: physical ? defStats.def : defStats.spd,
              stab: atkTypes.includes(m.type),
              typeMult,
              spread,
            });
            const minP = dmg ? pct(dmg.min, defStats.hp) : 0;
            const maxP = dmg ? pct(dmg.max, defStats.hp) : 0;
            return (
              <div
                key={m.slug}
                className="rounded-xl border border-ink-200 bg-white p-2.5 dark:border-ink-800 dark:bg-ink-900"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-ink-800 dark:text-ink-100">
                    {m.name.ko}
                  </span>
                  <TypeBadge type={m.type} size="sm" />
                  <span className="text-[10px] text-ink-400 dark:text-ink-500">
                    위력 {m.power} · {physical ? "물리" : "특수"}
                    {atkTypes.includes(m.type) && " · 자속"}
                    {typeMult !== 1 && ` · ×${typeMult}`}
                  </span>
                  <span
                    className={[
                      "ml-auto text-xs font-bold",
                      !dmg
                        ? "text-ink-400"
                        : maxP >= 100
                          ? "text-red-500"
                          : maxP >= 50
                            ? "text-amber-500"
                            : "text-ink-600 dark:text-ink-300",
                    ].join(" ")}
                  >
                    {dmg ? koText(dmg, defStats.hp) : "무효"}
                  </span>
                </div>
                {dmg && (
                  <>
                    <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
                      {dmg.min}~{dmg.max} 데미지 ({minP.toFixed(1)}%~
                      {maxP.toFixed(1)}%)
                    </p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-brand-400 to-red-400"
                        style={{ width: `${maxP}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-ink-400 dark:text-ink-500">
        <Info size={12} className="mt-0.5 shrink-0" />
        간이 계산이에요 — 내 멤버의 능력 포인트·성격·메가는 반영되지만, 특성
        ·도구·날씨·필드·급소·랭크 변화는 반영되지 않아요. 상대는 위 내구
        가정(무보정/H·B/H·D 32) 기준이에요.
      </p>
    </div>
  );
}
