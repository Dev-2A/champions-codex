import { useMemo, useState } from "react";
import { Search, Star, Check } from "lucide-react";
import { getNotableRole } from "../../data";
import { useMoveDb } from "../../hooks/useMoveDb";
import SegmentedToggle from "../common/SegmentedToggle";
import TypeBadge from "../common/TypeBadge";
import { damageClassMeta } from "../../lib/moveClass";

export default function MovePicker({ pokemonSlug, selected, onToggle }) {
  const moveDb = useMoveDb();
  const all = useMemo(
    () => (moveDb ? moveDb.resolveMoves(moveDb.getLearnset(pokemonSlug)) : []),
    [moveDb, pokemonSlug],
  );
  const [q, setQ] = useState("");
  const [dc, setDc] = useState("all");
  const [notableOnly, setNotableOnly] = useState(false);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return all
      .filter((m) => {
        if (dc !== "all" && m.damageClass !== dc) return false;
        if (notableOnly && !getNotableRole(m.slug)) return false;
        if (
          query &&
          !(m.name.ko?.toLowerCase().includes(query) || m.slug.includes(query))
        )
          return false;
        return true;
      })
      .sort(
        (a, b) =>
          (b.power ?? -1) - (a.power ?? -1) ||
          a.name.ko.localeCompare(b.name.ko, "ko"),
      );
  }, [all, q, dc, notableOnly]);

  const full = selected.length >= 4;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">
          기술 <span className="text-ink-400">({selected.length}/4)</span>
        </p>
      </div>

      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="기술 검색"
          className="w-full rounded-lg border border-ink-200 bg-ink-50 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-950"
        />
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <SegmentedToggle
          value={dc}
          onChange={setDc}
          options={[
            { value: "all", label: "전체" },
            { value: "physical", label: "물리" },
            { value: "special", label: "특수" },
            { value: "status", label: "변화" },
          ]}
        />
        <button
          onClick={() => setNotableOnly((v) => !v)}
          className={[
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-colors",
            notableOnly
              ? "bg-brand-500 text-white"
              : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400",
          ].join(" ")}
        >
          <Star size={11} /> 주목
        </button>
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {!moveDb && (
          <p className="p-4 text-center text-xs text-ink-400 dark:text-ink-500">
            기술 데이터를 불러오는 중…
          </p>
        )}
        {list.map((m) => {
          const on = selected.includes(m.slug);
          const disabled = !on && full;
          const dcMeta = damageClassMeta[m.damageClass];
          const role = getNotableRole(m.slug);
          return (
            <button
              key={m.slug}
              disabled={disabled}
              onClick={() => onToggle(m.slug)}
              className={[
                "flex w-full items-center gap-2 rounded-lg border p-1.5 text-left transition",
                on
                  ? "border-brand-400 bg-brand-50/50 dark:bg-ink-800"
                  : disabled
                    ? "cursor-not-allowed border-ink-100 opacity-40 dark:border-ink-800"
                    : "border-ink-200 hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:hover:bg-ink-800",
              ].join(" ")}
            >
              <span className="grid size-5 shrink-0 place-items-center">
                {on && (
                  <Check size={15} className="text-brand-500" strokeWidth={3} />
                )}
              </span>
              <span className="text-xs font-bold text-ink-800 dark:text-ink-100">
                {m.name.ko}
              </span>
              <TypeBadge type={m.type} size="sm" />
              {dcMeta && (
                <span
                  className={`rounded px-1 py-0.5 text-[9px] font-bold ${dcMeta.chip}`}
                >
                  {dcMeta.label}
                </span>
              )}
              {role && (
                <span className="rounded-full bg-brand-100 px-1 py-0.5 text-[9px] font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                  {role}
                </span>
              )}
              <span className="ml-auto shrink-0 text-[10px] text-ink-400 dark:text-ink-500">
                위력 {m.power ?? "—"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
