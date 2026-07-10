import { useMemo, useState } from "react";
import { Search, X, Star } from "lucide-react";
import { resolveMoves, getNotableRole } from "../../data";
import SegmentedToggle from "../common/SegmentedToggle";
import MoveRow from "../moves/MoveRow";

export default function LearnableMoves({ moveSlugs }) {
  const all = useMemo(() => resolveMoves(moveSlugs), [moveSlugs]);
  const [q, setQ] = useState("");
  const [dc, setDc] = useState("all");
  const [notableOnly, setNotableOnly] = useState(false);
  const [sort, setSort] = useState("power");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const arr = all.filter((m) => {
      if (dc !== "all" && m.damageClass !== dc) return false;
      if (notableOnly && !getNotableRole(m.slug)) return false;
      if (
        query &&
        !(m.name.ko?.toLowerCase().includes(query) || m.slug.includes(query))
      )
        return false;
      return true;
    });
    const sorters = {
      power: (a, b) =>
        (b.power ?? -1) - (a.power ?? -1) ||
        a.name.ko.localeCompare(b.name.ko, "ko"),
      name: (a, b) => a.name.ko.localeCompare(b.name.ko, "ko"),
    };
    return [...arr].sort(sorters[sort]);
  }, [all, q, dc, notableOnly, sort]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="기술 검색"
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-900"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            notableOnly
              ? "bg-brand-500 text-white"
              : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400",
          ].join(" ")}
        >
          <Star size={12} /> 주목 기술
        </button>
        <div className="ml-auto flex items-center gap-1 text-xs">
          {[
            { v: "power", l: "위력" },
            { v: "name", l: "이름" },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setSort(s.v)}
              className={[
                "rounded-lg px-2 py-1 font-medium transition",
                sort === s.v
                  ? "bg-ink-200 text-ink-800 dark:bg-ink-700 dark:text-ink-100"
                  : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-200",
              ].join(" ")}
            >
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-400 dark:text-ink-500">
        {list.length}개 기술
      </p>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          조건에 맞는 기술이 없어요.
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((m) => (
            <MoveRow key={m.slug} move={m} />
          ))}
        </div>
      )}
    </div>
  );
}
