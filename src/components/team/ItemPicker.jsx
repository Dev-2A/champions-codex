import { useMemo, useState } from "react";
import { Search, X, Package } from "lucide-react";
import { items as allItems, itemCategories } from "../../data";

export default function ItemPicker({ usedItems, current, onPick, onClose }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allItems.filter((it) => {
      if (cat !== "all" && it.cat !== cat) return false;
      if (
        query &&
        !(it.name.ko?.toLowerCase().includes(query) || it.slug.includes(query))
      )
        return false;
      return true;
    });
  }, [q, cat]);

  return (
    <div className="rounded-xl border border-ink-200 p-2 dark:border-ink-800">
      <div className="mb-2 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="도구 검색"
            className="w-full rounded-lg border border-ink-200 bg-ink-50 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-950"
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

      <div className="mb-2 flex flex-wrap gap-1">
        <button
          onClick={() => setCat("all")}
          className={catPill(cat === "all")}
        >
          전체
        </button>
        {itemCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={catPill(cat === c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid max-h-64 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
        {results.map((it) => {
          const used = usedItems.has(it.slug) && it.slug !== current;
          return (
            <button
              key={it.slug}
              disabled={used}
              onClick={() => onPick(it.slug)}
              className={[
                "flex items-center gap-2 rounded-lg border p-1.5 text-left transition",
                it.slug === current
                  ? "border-brand-400 bg-brand-50/50 dark:bg-ink-800"
                  : used
                    ? "cursor-not-allowed border-ink-100 opacity-40 dark:border-ink-800"
                    : "border-ink-200 hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:hover:bg-ink-800",
              ].join(" ")}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded bg-ink-100 dark:bg-ink-800">
                {it.sprite ? (
                  <img
                    src={it.sprite}
                    alt={it.name.ko}
                    className="size-6 object-contain"
                  />
                ) : (
                  <Package size={14} className="text-ink-400" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-ink-800 dark:text-ink-100">
                  {it.name.ko}
                </span>
                {used && (
                  <span className="text-[9px] text-ink-400">사용 중</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function catPill(active) {
  return [
    "rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors",
    active
      ? "bg-brand-500 text-white"
      : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400",
  ].join(" ");
}
