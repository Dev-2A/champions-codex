import { useState } from "react";
import { X } from "lucide-react";
import { TYPES, typeKo } from "../../data";
import { typeStyle } from "../../lib/typeColors";
import DefensiveProfile from "./DefensiveProfile";
import TypeTraitsPanel from "./TypeTraitsPanel";
import TypeBadge from "../common/TypeBadge";

export default function TypeCalculator() {
  const [selected, setSelected] = useState([]);

  const toggle = (t) => {
    setSelected((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 2) return [prev[1], t]; // 2개 초과 시 오래된 것 밀어냄
      return [...prev, t];
    });
  };

  return (
    <div className="space-y-4">
      {/* 선택기 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-600 dark:text-ink-300">
            방어 타입 선택{" "}
            <span className="font-normal text-ink-400">(1~2개)</span>
          </p>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="flex items-center gap-1 text-xs text-ink-400 transition-colors hover:text-ink-600 dark:hover:text-ink-200"
            >
              <X size={13} /> 초기화
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => {
            const active = selected.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                style={active ? typeStyle(t) : undefined}
                className={[
                  "rounded-full px-2.5 py-1 text-xs font-bold transition",
                  active
                    ? "ring-2 ring-brand-400 ring-offset-1 ring-offset-ink-50 dark:ring-offset-ink-950"
                    : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700",
                ].join(" ")}
              >
                {typeKo(t)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 결과 */}
      {selected.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          위에서 타입을 골라 방어 상성을 확인하세요.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-500 dark:text-ink-400">
              선택 조합:
            </span>
            {selected.map((t) => (
              <TypeBadge key={t} type={t} size="lg" />
            ))}
          </div>
          <DefensiveProfile types={selected} />
          <TypeTraitsPanel types={selected} />
        </div>
      )}
    </div>
  );
}
