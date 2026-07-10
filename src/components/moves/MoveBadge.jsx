import { typeStyle } from "../../lib/typeColors";
import { damageClassMeta } from "../../lib/moveClass";

export default function MoveBadge({ move, className = "" }) {
  const dc = damageClassMeta[move.damageClass];
  const Icon = dc?.icon;
  return (
    <span
      style={typeStyle(move.type)}
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${className}`}
    >
      {Icon && <Icon size={10} strokeWidth={2.5} />}
      {move.name.ko}
    </span>
  );
}
