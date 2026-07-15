import { useState } from "react";
import { TYPES, typeKo, typechart } from "../../data";
import {
  classifyMultiplier,
  formatMultiplier,
} from "../../lib/typeEffectiveness";
import { typeStyle } from "../../lib/typeColors";

const chart = typechart.chart;

function cellClass(cls) {
  switch (cls) {
    case "weak4":
      return "bg-red-600 text-white font-bold";
    case "weak2":
      return "bg-red-400 text-white";
    case "resist2":
      return "bg-blue-400 text-white";
    case "resist4":
      return "bg-blue-600 text-white font-bold";
    case "immune":
      return "bg-ink-400 text-white dark:bg-ink-600";
    default:
      return "text-ink-300 dark:text-ink-700"; // 1배(등배)
  }
}

export default function TypeMatrix({ mode }) {
  const [hover, setHover] = useState(null); // { r, c }

  // attack: 행=공격, 열=방어 → chart[행][열]
  // defense: 행=방어, 열=공격 → chart[열][행]
  const getValue = (rowType, colType) =>
    mode === "attack" ? chart[rowType][colType] : chart[colType][rowType];

  const ring = "ring-2 ring-inset ring-white/70 brightness-110";

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
      <table
        aria-label={`18타입 상성표 (${mode === "attack" ? "공격" : "방어"} 관점)`}
        className="border-separate border-spacing-0 text-center text-xs"
      >
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 w-17 bg-ink-50 dark:bg-ink-950" />
            {TYPES.map((ct, c) => (
              <th
                key={ct}
                title={typeKo(ct)}
                style={typeStyle(ct)}
                className={[
                  "sticky top-0 z-20 h-8 w-8.5 min-w-8.5 font-bold transition",
                  hover?.c === c ? ring : "",
                ].join(" ")}
              >
                {typeKo(ct)[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TYPES.map((rt, r) => (
            <tr key={rt}>
              <th
                style={typeStyle(rt)}
                className={[
                  "sticky left-0 z-10 h-8.5 w-17 px-1.5 text-right text-[11px] font-bold transition",
                  hover?.r === r ? ring : "",
                ].join(" ")}
              >
                {typeKo(rt)}
              </th>
              {TYPES.map((ct, c) => {
                const m = getValue(rt, ct);
                const atkType = mode === "attack" ? rt : ct;
                const defType = mode === "attack" ? ct : rt;
                return (
                  <td
                    key={ct}
                    title={`${typeKo(atkType)} → ${typeKo(defType)}: ×${formatMultiplier(m)}`}
                    onMouseEnter={() => setHover({ r, c })}
                    onMouseLeave={() => setHover(null)}
                    className={[
                      "h-8.5 w-8.5 border-b border-r border-ink-100 dark:border-ink-800/60",
                      cellClass(classifyMultiplier(m)),
                    ].join(" ")}
                  >
                    {m === 1 ? "" : formatMultiplier(m)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
