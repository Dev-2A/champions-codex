import { useState } from "react";
import { Grid3x3 } from "lucide-react";
import SegmentedToggle from "../components/common/SegmentedToggle";
import TypeMatrix from "../components/typechart/TypeMatrix";

const LEGEND = [
  { label: "4배", cls: "bg-red-600" },
  { label: "2배", cls: "bg-red-400" },
  { label: "½배", cls: "bg-blue-400" },
  { label: "¼배", cls: "bg-blue-600" },
  { label: "0 (무효)", cls: "bg-ink-400 dark:bg-ink-600" },
];

export default function TypeChartPage() {
  const [mode, setMode] = useState("attack");

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center gap-2">
          <Grid3x3 className="text-brand-500" size={22} strokeWidth={2.3} />
          <h1 className="text-xl font-bold tracking-tight">
            타입 상성 매트릭스
          </h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          18타입 대미지 배율표. 관점을 바꿔 공격·방어를 확인하세요. 셀에
          마우스를 올리면 해당 타입이 강조돼요.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedToggle
          value={mode}
          onChange={setMode}
          options={[
            { value: "attack", label: "공격 관점" },
            { value: "defense", label: "방어 관점" },
          ]}
        />
        <p className="text-xs text-ink-400 dark:text-ink-500">
          {mode === "attack"
            ? "세로 = 공격 타입 · 가로 = 방어 타입"
            : "세로 = 방어 타입 · 가로 = 공격 타입"}
        </p>
      </div>

      <TypeMatrix mode={mode} />

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500 dark:text-ink-400">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={`inline-block size-3.5 rounded ${l.cls}`} />
            {l.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3.5 rounded border border-ink-300 dark:border-ink-700" />
          1배 (등배, 빈칸)
        </span>
      </div>
    </div>
  );
}
