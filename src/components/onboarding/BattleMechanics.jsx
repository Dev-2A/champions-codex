import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { battleMechanics } from "../../data";
import TypeBadge from "../common/TypeBadge";

export default function BattleMechanics() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return battleMechanics.entries;
    return battleMechanics.entries.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.en?.toLowerCase().includes(query) ||
        e.effect.toLowerCase().includes(query) ||
        e.detail?.toLowerCase().includes(query) ||
        e.tags?.some((t) => t.toLowerCase().includes(query)),
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
          placeholder="메커니즘 검색 (예: 화상, 트릭룸, 순풍)"
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

      {battleMechanics.categories.map((cat) => {
        const entries = filtered.filter((e) => e.category === cat.id);
        if (entries.length === 0) return null;
        return (
          <section key={cat.id}>
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-500">
              {cat.label}
            </h3>
            {cat.note && (
              <p className="mb-2 text-xs leading-relaxed text-ink-400 dark:text-ink-500">
                {cat.note}
              </p>
            )}
            <dl className="grid gap-2 lg:grid-cols-2">
              {entries.map((e) => (
                <div
                  key={e.name}
                  className="rounded-xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900"
                >
                  <dt className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-ink-800 dark:text-ink-100">
                      {e.name}
                    </span>
                    {e.en && (
                      <span className="text-xs text-ink-400 dark:text-ink-500">
                        {e.en}
                      </span>
                    )}
                    {e.champions && (
                      <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                        챔피언스 조정
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    {e.effect}
                    {e.detail && (
                      <span className="mt-0.5 block text-xs text-ink-500 dark:text-ink-400">
                        {e.detail}
                      </span>
                    )}
                    {e.champions && (
                      <span className="mt-0.5 block text-xs font-medium text-brand-600 dark:text-brand-300">
                        ⚙ {e.champions}
                      </span>
                    )}
                  </dd>
                  {e.immuneTypes?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-semibold text-ink-400 dark:text-ink-500">
                        면역:
                      </span>
                      {e.immuneTypes.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))}
                    </div>
                  )}
                  {e.tags?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          "{q}"에 해당하는 항목이 없어요.
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-ink-400 dark:text-ink-500">
        수치는 본가 9세대 기준이에요. 챔피언스에서 조정이 확인된 항목은
        [챔피언스 조정] 배지로 표시했어요. 다른 정보를 발견하면 피드백으로
        알려주세요!
      </p>
    </div>
  );
}
