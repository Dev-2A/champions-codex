import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { glossary } from "../../data";

export default function Glossary() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return glossary.terms;
    return glossary.terms.filter(
      (t) =>
        t.term.toLowerCase().includes(query) ||
        t.en?.toLowerCase().includes(query) ||
        t.def.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="용어 검색 (예: VP, 메가, 스카우트)"
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

      {glossary.categories.map((cat) => {
        const terms = filtered.filter((t) => t.category === cat.id);
        if (terms.length === 0) return null;
        return (
          <section key={cat.id}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-500">
              {cat.label}
            </h3>
            <dl className="grid gap-2 lg:grid-cols-2">
              {terms.map((t) => (
                <div
                  key={t.term}
                  className="rounded-xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900"
                >
                  <dt className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-ink-800 dark:text-ink-100">
                      {t.term}
                    </span>
                    {t.en && (
                      <span className="text-xs text-ink-400 dark:text-ink-500">
                        {t.en}
                      </span>
                    )}
                    {t.badge && (
                      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950 dark:text-red-300">
                        {t.badge}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    {t.def}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          "{q}"에 해당하는 용어가 없어요.
        </p>
      )}
    </div>
  );
}
