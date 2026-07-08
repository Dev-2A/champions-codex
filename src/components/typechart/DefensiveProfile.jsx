import { getDefensiveProfile } from "../../lib/typeEffectiveness";
import TypeBadge from "../common/TypeBadge";

const GROUPS = [
  { key: "weak4", label: "4배 약점", mult: 4, tone: "weak", badge: "×4" },
  { key: "weak2", label: "2배 약점", mult: 2, tone: "weak", badge: "×2" },
  { key: "resist2", label: "½ 저항", mult: 0.5, tone: "resist", badge: "×½" },
  { key: "resist4", label: "¼ 저항", mult: 0.25, tone: "resist", badge: "×¼" },
  { key: "immune", label: "무효", mult: 0, tone: "immune", badge: "×0" },
];

const TONE = {
  weak: "border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/30",
  resist: "border-blue-200 bg-blue-50 dark:border-blue-950 dark:bg-blue-950/30",
  immune: "border-ink-200 bg-ink-100/60 dark:border-ink-800 dark:bg-ink-800/40",
};

export default function DefensiveProfile({ types }) {
  const profile = getDefensiveProfile(types);

  const buckets = {};
  for (const [atk, m] of Object.entries(profile)) {
    if (m === 1) continue;
    (buckets[m] ??= []).push(atk);
  }

  const groups = GROUPS.map((g) => ({
    ...g,
    atkTypes: buckets[g.mult] ?? [],
  })).filter((g) => g.atkTypes.length > 0);

  if (groups.length === 0) {
    return (
      <p className="rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-500 dark:border-ink-800 dark:bg-ink-900/50 dark:text-ink-400">
        모든 타입에 등배(×1)예요. 약점도 저항도 없는 밸런스형이에요.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {groups.map((g) => (
        <div key={g.key} className={`rounded-xl border p-3 ${TONE[g.tone]}`}>
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-sm font-bold text-ink-700 dark:text-ink-200">
              {g.label}
            </span>
            <span className="text-xs text-ink-400 dark:text-ink-500">
              {g.badge} · {g.atkTypes.length}개
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {g.atkTypes.map((t) => (
              <TypeBadge key={t} type={t} size="md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
