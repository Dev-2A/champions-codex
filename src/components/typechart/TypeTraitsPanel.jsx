import { ShieldCheck } from "lucide-react";
import { getTypeTraits, typeKo } from "../../data";
import TypeBadge from "../common/TypeBadge";

export default function TypeTraitsPanel({ types }) {
  const entries = types
    .map((t) => ({ type: t, traits: getTypeTraits(t) }))
    .filter((e) => e.traits);

  if (entries.length === 0) {
    return (
      <p className="text-xs text-ink-400 dark:text-ink-500">
        이 조합에는 타입 기반 부가 특성이 없어요.
      </p>
    );
  }

  const hasNotes = entries.some((e) => e.traits.notes?.length);

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-3 dark:border-brand-900 dark:bg-ink-900/50">
      <div className="mb-2 flex items-center gap-1.5">
        <ShieldCheck size={16} className="text-brand-500" strokeWidth={2.3} />
        <span className="text-sm font-bold text-ink-700 dark:text-ink-200">
          타입 부가 특성
        </span>
      </div>
      <ul className="space-y-1.5">
        {entries.map(({ type, traits }) => (
          <li
            key={type}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
          >
            <TypeBadge type={type} size="sm" />
            <span className="text-ink-600 dark:text-ink-300">
              {[
                ...(traits.immunities ?? []).map((x) => `${x} 면역`),
                ...(traits.bonuses ?? []),
              ].join(" · ")}
            </span>
          </li>
        ))}
      </ul>
      {hasNotes && (
        <ul className="mt-2 space-y-0.5 border-t border-brand-200/50 pt-2 dark:border-brand-900/50">
          {entries.flatMap(({ type, traits }) =>
            (traits.notes ?? []).map((n, i) => (
              <li
                key={`${type}-${i}`}
                className="text-xs text-ink-400 dark:text-ink-500"
              >
                • {typeKo(type)}: {n}
              </li>
            )),
          )}
        </ul>
      )}
    </div>
  );
}
