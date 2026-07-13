import { Search, X, Sparkles } from "lucide-react";
import { TYPES, typeKo } from "../../data";
import { typeStyle } from "../../lib/typeColors";
import { usePokedexStore } from "../../store/usePokedexStore";

const SORTS = [
  { value: "dex", label: "도감번호" },
  { value: "name", label: "이름순" },
  { value: "total", label: "종족값" },
  { value: "speed", label: "스피드" },
];

export default function PokedexFilters({ total, shown }) {
  const {
    query,
    types,
    megaOnly,
    sort,
    setQuery,
    toggleType,
    setMegaOnly,
    setSort,
    reset,
  } = usePokedexStore();
  const active = query || types.length || megaOnly;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="한국어 이름·번호·초성(ㄹㅈㅁ)으로 검색"
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition-colors focus:border-brand-400 dark:border-ink-700 dark:bg-ink-900 dark:focus:border-brand-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TYPES.map((t) => {
          const on = types.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              style={on ? typeStyle(t) : undefined}
              className={[
                "rounded-full px-2 py-0.5 text-[11px] font-bold transition",
                on
                  ? "ring-2 ring-brand-400 ring-offset-1 ring-offset-ink-50 dark:ring-offset-ink-950"
                  : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400",
              ].join(" ")}
            >
              {typeKo(t)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMegaOnly(!megaOnly)}
          className={[
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition",
            megaOnly
              ? "bg-brand-500 text-white"
              : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400",
          ].join(" ")}
        >
          <Sparkles size={12} /> 메가 가능
        </button>

        <div className="flex items-center gap-1 text-xs">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={[
                "rounded-lg px-2 py-1 font-medium transition",
                sort === s.value
                  ? "bg-ink-200 text-ink-800 dark:bg-ink-700 dark:text-ink-100"
                  : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-200",
              ].join(" ")}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-ink-400 dark:text-ink-500">
          {shown}/{total}종
          {active && (
            <button
              onClick={reset}
              className="ml-2 text-brand-500 hover:underline"
            >
              초기화
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
