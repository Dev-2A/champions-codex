import {
  STAT_KEYS,
  STAT_LABELS,
  MAX_PER_STAT,
  MAX_TOTAL,
  emptyBuild,
  usedPoints,
  computeStat,
} from "../../lib/statCalc";

const NATURE_KEYS = STAT_KEYS.filter((k) => k !== "hp");

/**
 * 능력 포인트(합 66, 스탯당 32) + 성격 보정 에디터.
 * baseStats는 메가 지정 시 메가 폼 종족값이 넘어온다.
 */
export default function StatEditor({ baseStats, build, onSetPoint, onSetNature }) {
  const b = build ?? emptyBuild();
  const used = usedPoints(b);
  const left = MAX_TOTAL - used;

  return (
    <div className="space-y-2 rounded-xl border border-ink-200 p-2.5 dark:border-ink-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink-500 dark:text-ink-400">
          능력 포인트
        </span>
        <span
          className={
            left === 0
              ? "font-bold text-brand-500"
              : "font-medium text-ink-400 dark:text-ink-500"
          }
        >
          남은 포인트 {left} / {MAX_TOTAL}
        </span>
      </div>

      {STAT_KEYS.map((k) => {
        const pts = b.pts[k] ?? 0;
        const actual = computeStat(k, baseStats[k], b);
        const isUp = b.up === k && b.down !== k;
        const isDown = b.down === k && b.up !== k;
        return (
          <div key={k} className="flex items-center gap-2">
            <span className="w-9 shrink-0 text-[11px] font-bold text-ink-500 dark:text-ink-400">
              {STAT_LABELS[k]}
            </span>
            <span className="w-7 shrink-0 text-right text-[11px] text-ink-400 dark:text-ink-500">
              {baseStats[k]}
            </span>
            <input
              type="range"
              min={0}
              max={MAX_PER_STAT}
              value={pts}
              onChange={(e) => onSetPoint(k, Number(e.target.value))}
              className="min-w-0 flex-1 accent-brand-500"
              aria-label={`${STAT_LABELS[k]} 포인트`}
            />
            <span className="w-6 shrink-0 text-right text-[11px] font-semibold text-ink-600 dark:text-ink-300">
              {pts}
            </span>
            <span
              className={[
                "w-10 shrink-0 text-right text-xs font-bold tabular-nums",
                isUp
                  ? "text-red-500"
                  : isDown
                    ? "text-blue-500"
                    : "text-ink-800 dark:text-ink-100",
              ].join(" ")}
            >
              {actual}
            </span>
          </div>
        );
      })}

      {/* 성격 보정 */}
      <div className="flex flex-wrap items-center gap-2 border-t border-ink-100 pt-2 text-xs dark:border-ink-800">
        <span className="font-semibold text-ink-500 dark:text-ink-400">
          성격
        </span>
        <label className="flex items-center gap-1">
          <span className="text-red-500">▲</span>
          <select
            value={b.up ?? ""}
            onChange={(e) => onSetNature(e.target.value || null, b.down)}
            className="rounded-lg border border-ink-200 bg-white px-1.5 py-1 text-xs dark:border-ink-700 dark:bg-ink-950"
          >
            <option value="">무보정</option>
            {NATURE_KEYS.map((k) => (
              <option key={k} value={k}>
                {STAT_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1">
          <span className="text-blue-500">▼</span>
          <select
            value={b.down ?? ""}
            onChange={(e) => onSetNature(b.up, e.target.value || null)}
            className="rounded-lg border border-ink-200 bg-white px-1.5 py-1 text-xs dark:border-ink-700 dark:bg-ink-950"
          >
            <option value="">무보정</option>
            {NATURE_KEYS.map((k) => (
              <option key={k} value={k}>
                {STAT_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-[10px] leading-relaxed text-ink-400 dark:text-ink-500">
        실수치 = Lv.50 · IV 31 기준. 성격 보정(±10%)은 포인트 반영 전에
        적용했어요 — 실제 게임과 ±1 오차가 있을 수 있어요.
      </p>
    </div>
  );
}
