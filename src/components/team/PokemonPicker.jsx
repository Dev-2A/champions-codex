import { useMemo, useState } from "react";
import { Search, X, Shield, Crosshair } from "lucide-react";
import { pokemonList, TYPES, typeKo } from "../../data";
import {
  getDefensiveProfile,
  getMultiplier,
  formatMultiplier,
} from "../../lib/typeEffectiveness";
import { typeStyle } from "../../lib/typeColors";
import { assetUrl } from "../../lib/assets";
import TypeBadge from "../common/TypeBadge";
import { matchKo } from "../../lib/search";

/**
 * coverFilter: 커버리지 분석에서 넘어온 보강 필터 (선택)
 *  - { kind: "resist", type } → type 공격을 저항/무효하는 포켓몬만
 *  - { kind: "hit", type }    → type을 자속으로 약점 찌를 수 있는 포켓몬만
 */
export default function PokemonPicker({
  blockedDex,
  teamSlugs,
  onPick,
  onClose,
  coverFilter = null,
}) {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [cover, setCover] = useState(coverFilter);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = pokemonList.filter((p) => {
      if (typeFilter && !p.types.includes(typeFilter)) return false;
      if (
        query &&
        !(
          matchKo(p.name.ko, query) ||
          p.slug.includes(query) ||
          String(p.id).includes(query)
        )
      )
        return false;
      return true;
    });

    if (cover?.kind === "resist") {
      list = list
        .map((p) => ({ p, m: getDefensiveProfile(p.types)[cover.type] }))
        .filter(({ m }) => m < 1)
        .sort((a, b) => a.m - b.m || a.p.id - b.p.id) // 무효 → ¼ → ½ 순
        .map(({ p }) => p);
    } else if (cover?.kind === "hit") {
      list = list.filter((p) =>
        p.types.some((t) => getMultiplier(t, [cover.type]) >= 2),
      );
    }
    return list;
  }, [q, typeFilter, cover]);

  const coverLabel =
    cover &&
    (cover.kind === "resist"
      ? `${typeKo(cover.type)} 공격을 받아낼 수 있는`
      : `${typeKo(cover.type)}을(를) 자속으로 찌를 수 있는`);

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="포켓몬 검색"
            className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-8 pr-2 text-sm outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-950"
          />
        </div>
        <button
          onClick={onClose}
          className="grid size-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
          aria-label="닫기"
        >
          <X size={16} />
        </button>
      </div>

      {/* 타입 필터 */}
      <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
        {TYPES.map((t) => {
          const active = typeFilter === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(active ? null : t)}
              style={active ? typeStyle(t) : undefined}
              className={[
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold transition",
                active
                  ? "ring-2 ring-brand-400"
                  : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700",
              ].join(" ")}
            >
              {typeKo(t)}
            </button>
          );
        })}
      </div>

      {/* 커버리지 보강 필터 */}
      {cover && (
        <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-600 dark:bg-ink-800 dark:text-brand-300">
          {cover.kind === "resist" ? (
            <Shield size={13} className="shrink-0" />
          ) : (
            <Crosshair size={13} className="shrink-0" />
          )}
          <span className="min-w-0 flex-1 truncate">{coverLabel} 포켓몬</span>
          <button
            type="button"
            onClick={() => setCover(null)}
            className="shrink-0 rounded p-0.5 hover:bg-brand-100 dark:hover:bg-ink-700"
            aria-label="필터 해제"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <p className="mb-1.5 text-[11px] text-ink-400 dark:text-ink-500">
        {results.length}종
      </p>

      <div className="grid max-h-72 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3">
        {results.length === 0 && (
          <p className="col-span-full p-4 text-center text-xs text-ink-400 dark:text-ink-500">
            조건에 맞는 포켓몬이 없어요.
          </p>
        )}
        {results.map((p) => {
          const inTeam = teamSlugs.includes(p.slug);
          const blocked = !inTeam && blockedDex.has(p.dexNum);
          const disabled = inTeam || blocked;
          const resistM =
            cover?.kind === "resist"
              ? getDefensiveProfile(p.types)[cover.type]
              : null;
          return (
            <button
              key={p.slug}
              type="button"
              disabled={disabled}
              onClick={() => onPick(p.slug)}
              className={[
                "flex items-center gap-2 rounded-xl border p-1.5 text-left transition",
                disabled
                  ? "cursor-not-allowed border-ink-100 opacity-40 dark:border-ink-800"
                  : "border-ink-200 hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:hover:border-brand-800 dark:hover:bg-ink-800",
              ].join(" ")}
            >
              <img
                src={assetUrl(p.sprite)}
                alt={p.name.ko}
                loading="lazy"
                className="size-10 shrink-0 object-contain"
              />
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-ink-800 dark:text-ink-100">
                  {p.name.ko}
                </span>
                <span className="mt-0.5 flex flex-wrap gap-0.5">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </span>
                {resistM != null && (
                  <span className="text-[9px] font-bold text-blue-500">
                    받는 배율 ×{formatMultiplier(resistM)}
                  </span>
                )}
                {inTeam && (
                  <span className="text-[9px] text-brand-500">팀에 있음</span>
                )}
                {blocked && (
                  <span className="text-[9px] text-ink-400">종족 중복</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
