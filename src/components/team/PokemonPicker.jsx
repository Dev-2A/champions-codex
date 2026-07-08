import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { pokemonList } from "../../data";
import TypeBadge from "../common/TypeBadge";

export default function PokemonPicker({
  blockedDex,
  teamSlugs,
  onPick,
  onClose,
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return pokemonList
      .filter(
        (p) =>
          !query ||
          p.name.ko?.toLowerCase().includes(query) ||
          p.slug.includes(query) ||
          String(p.id).includes(query),
      )
      .slice(0, 60);
  }, [q]);

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
            placeholder="포켓몬 검색 (상위 60종 표시)"
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
      <div className="grid max-h-72 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3">
        {results.map((p) => {
          const inTeam = teamSlugs.includes(p.slug);
          const blocked = !inTeam && blockedDex.has(p.dexNum);
          const disabled = inTeam || blocked;
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
                src={p.sprite}
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
