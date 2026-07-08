import { typeStyle } from "../../lib/typeColors";
import { typeKo } from "../../data";

const SIZES = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export default function TypeBadge({ type, size = "md", className = "" }) {
  return (
    <span
      style={typeStyle(type)}
      className={`inline-flex items-center rounded-full font-bold ${SIZES[size]} ${className}`}
    >
      {typeKo(type)}
    </span>
  );
}
