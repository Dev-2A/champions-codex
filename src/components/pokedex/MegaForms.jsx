import { Sparkles } from "lucide-react";
import { getMegaForms, megaPending, getPokemonBySlug } from "../../data";
import { assetUrl } from "../../lib/assets";
import TypeBadge from "../common/TypeBadge";
import StatBars from "./StatBars";

/** 기본 폼 대비 스탯 변화량 배지 (+30 공격 등) */
function StatDelta({ base, mega }) {
  const KEYS = [
    ["hp", "체"],
    ["atk", "공"],
    ["def", "방"],
    ["spa", "특공"],
    ["spd", "특방"],
    ["spe", "스"],
  ];
  const deltas = KEYS.filter(([k]) => mega.stats[k] !== base.stats[k]);
  if (deltas.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {deltas.map(([k, label]) => {
        const d = mega.stats[k] - base.stats[k];
        return (
          <span
            key={k}
            className={[
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              d > 0
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300",
            ].join(" ")}
          >
            {label} {d > 0 ? `+${d}` : d}
          </span>
        );
      })}
    </div>
  );
}

export default function MegaForms({ slug }) {
  const base = getPokemonBySlug(slug);
  const forms = getMegaForms(slug);

  if (!base) return null;

  if (forms.length === 0) {
    return (
      <p className="rounded-xl border border-ink-200 bg-ink-50 p-3 text-xs text-ink-500 dark:border-ink-800 dark:bg-ink-900/50 dark:text-ink-400">
        {megaPending.has(slug)
          ? "🆕 챔피언스 신규 메가진화예요. 폼 상세 정보(스탯·타입)는 수집되는 대로 업데이트할게요."
          : "메가 폼 정보를 준비 중이에요."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {forms.map((f) => (
        <div
          key={f.formSlug}
          className="rounded-2xl border border-brand-200 bg-white p-4 dark:border-brand-900 dark:bg-ink-900"
        >
          <div className="flex items-center gap-3">
            <img
              src={assetUrl(f.sprite ?? base.sprite)}
              alt={f.name.ko}
              loading="lazy"
              className="size-16 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-bold text-ink-800 dark:text-ink-100">
                <Sparkles size={14} className="shrink-0 text-brand-500" />
                {f.name.ko}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {f.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
                {f.abilities.map((a) => (
                  <span
                    key={a.slug}
                    className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                  >
                    {a.ko ?? a.slug}
                  </span>
                ))}
              </div>
            </div>
            <span className="ml-auto shrink-0 text-xs font-bold text-ink-400 dark:text-ink-500">
              합 {f.total}
            </span>
          </div>
          <div className="mt-3">
            <StatBars stats={f.stats} total={f.total} />
          </div>
          <div className="mt-2">
            <StatDelta base={base} mega={f} />
          </div>
        </div>
      ))}
      <p className="text-[11px] text-ink-400 dark:text-ink-500">
        오멘 링으로 배틀 중 1회, 1마리만 메가진화할 수 있어요.
      </p>
    </div>
  );
}
