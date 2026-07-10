import TypeBadge from "../common/TypeBadge";
import { damageClassMeta } from "../../lib/moveClass";
import { getNotableRole } from "../../data";

function Stat({ label, value }) {
  return (
    <span className="text-[11px] text-ink-400 dark:text-ink-500">
      {label} <b className="text-ink-600 dark:text-ink-300">{value ?? "—"}</b>
    </span>
  );
}

export default function MoveRow({ move, showDesc = true }) {
  const dc = damageClassMeta[move.damageClass];
  const DcIcon = dc?.icon;
  const role = getNotableRole(move.slug);

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-ink-800 dark:text-ink-100">
          {move.name.ko}
        </span>
        <TypeBadge type={move.type} size="sm" />
        {dc && (
          <span
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${dc.chip}`}
          >
            {DcIcon && <DcIcon size={10} strokeWidth={2.5} />}
            {dc.label}
          </span>
        )}
        {role && (
          <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            {role}
          </span>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-2.5">
          <Stat label="위력" value={move.power} />
          <Stat label="명중" value={move.accuracy} />
          <Stat label="PP" value={move.pp} />
        </span>
      </div>
      {showDesc && move.desc && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
          {move.desc}
        </p>
      )}
    </div>
  );
}
