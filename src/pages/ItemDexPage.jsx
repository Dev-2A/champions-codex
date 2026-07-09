import { useMemo, useState } from "react";
import { Package, Search, X } from "lucide-react";
import { items, itemCategories } from "../data";
import ItemCard from "../components/items/ItemCard";

const pill = (active) =>
  [
    "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
    active
      ? "bg-brand-500 text-white"
      : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700",
  ].join(" ");

export default function ItemDexPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((it) => {
      if (cat !== "all" && it.cat !== cat) return false;
      if (query) {
        const hit =
          it.name.ko?.toLowerCase().includes(query) ||
          it.slug.includes(query) ||
          it.desc?.toLowerCase().includes(query);
        if (!hit) return false;
      }
      return true;
    });
  }, [q, cat]);

  const groups =
    cat === "all"
      ? itemCategories
          .map((c) => ({
            ...c,
            list: filtered.filter((it) => it.cat === c.id),
          }))
          .filter((g) => g.list.length)
      : [
          {
            id: cat,
            label: itemCategories.find((c) => c.id === cat)?.label,
            list: filtered,
          },
        ];

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center gap-2">
          <Package className="text-brand-500" size={22} strokeWidth={2.3} />
          <h1 className="text-xl font-bold tracking-tight">도구 도감</h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          경쟁전에서 자주 쓰는 지닌 도구를 카테고리별로 정리했어요. (도구
          클로즈: 같은 도구는 팀에 하나만)
        </p>
      </header>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="도구 이름·효과로 검색"
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

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setCat("all")} className={pill(cat === "all")}>
          전체
        </button>
        {itemCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={pill(cat === c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-8 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          조건에 맞는 도구가 없어요.
        </p>
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g.id}>
              <h2 className="mb-2 text-sm font-bold text-brand-500">
                {g.label} <span className="text-ink-400">{g.list.length}</span>
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {g.list.map((it) => (
                  <ItemCard key={it.slug} item={it} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
