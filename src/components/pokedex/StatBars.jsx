const STAT_META = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "공격" },
  { key: "def", label: "방어" },
  { key: "spa", label: "특공" },
  { key: "spd", label: "특방" },
  { key: "spe", label: "스피드" },
];

const MAX = 200; // 막대 시각화 기준 (초과 시 100%)

function barColor(v) {
  if (v >= 130) return "bg-emerald-500";
  if (v >= 100) return "bg-lime-500";
  if (v >= 70) return "bg-amber-500";
  if (v >= 50) return "bg-orange-500";
  return "bg-red-500";
}

export default function StatBars({ stats, total }) {
  return (
    <div className="space-y-1.5">
      {STAT_META.map(({ key, label }) => {
        const v = stats[key] ?? 0;
        const pct = Math.min(100, (v / MAX) * 100);
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-xs font-medium text-ink-500 dark:text-ink-400">
              {label}
            </span>
            <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-ink-700 dark:text-ink-200">
              {v}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className={`h-full rounded-full ${barColor(v)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-2 border-t border-ink-200 pt-1.5 dark:border-ink-800">
        <span className="w-10 shrink-0 text-xs font-bold text-ink-600 dark:text-ink-300">
          총합
        </span>
        <span className="w-8 shrink-0 text-right text-xs font-extrabold tabular-nums text-brand-600 dark:text-brand-300">
          {total}
        </span>
        <div className="flex-1" />
      </div>
    </div>
  );
}
