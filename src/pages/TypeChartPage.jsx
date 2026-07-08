import { useState } from "react";
import { Grid3x3, ArrowDown, ArrowRight } from "lucide-react";
import SegmentedToggle from "../components/common/SegmentedToggle";
import TypeMatrix from "../components/typechart/TypeMatrix";

const LEGEND = [
  { label: "4배", cls: "bg-red-600" },
  { label: "2배", cls: "bg-red-400" },
  { label: "½배", cls: "bg-blue-400" },
  { label: "¼배", cls: "bg-blue-600" },
  { label: "0 (무효)", cls: "bg-ink-400 dark:bg-ink-600" },
];

// 기술/포켓몬 강조 태그 (공격=기술=빨강, 방어=포켓몬=파랑 톤)
function KindTag({ kind }) {
  const isMove = kind === "move";
  return (
    <span
      className={[
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold",
        isMove
          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      ].join(" ")}
    >
      {isMove ? "기술" : "포켓몬"}
    </span>
  );
}

// 관점에 따라 세로/가로가 각각 기술 타입인지 포켓몬 타입인지 안내
function AxisGuide({ mode }) {
  const rowKind = mode === "attack" ? "move" : "pokemon";
  const colKind = mode === "attack" ? "pokemon" : "move";

  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50 p-3 dark:border-ink-800 dark:bg-ink-900/50">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <ArrowDown size={15} className="shrink-0 text-ink-400" />
        <span className="text-ink-500 dark:text-ink-400">세로줄 =</span>
        <KindTag kind={rowKind} />
        <span className="text-ink-500 dark:text-ink-400">
          의 타입 ({mode === "attack" ? "공격" : "방어"})
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <ArrowRight size={15} className="shrink-0 text-ink-400" />
        <span className="text-ink-500 dark:text-ink-400">가로줄 =</span>
        <KindTag kind={colKind} />
        <span className="text-ink-500 dark:text-ink-400">
          의 타입 ({mode === "attack" ? "방어" : "공격"})
        </span>
      </div>
      <p className="mt-2 text-xs text-ink-400 dark:text-ink-500">
        {mode === "attack"
          ? "💡 공격 상성은 포켓몬이 아니라 사용하는 기술의 타입으로 계산돼요."
          : "💡 방어 상성은 그 포켓몬이 가진 타입으로 계산돼요."}
      </p>
    </div>
  );
}

export default function TypeChartPage() {
  const [mode, setMode] = useState("attack");

  const rowAxisLabel =
    mode === "attack" ? "공격하는 기술의 타입" : "방어하는 포켓몬의 타입";
  const colAxisLabel =
    mode === "attack" ? "공격받는 포켓몬의 타입" : "공격하는 기술의 타입";

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

      <SegmentedToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: "attack", label: "공격 관점" },
          { value: "defense", label: "방어 관점" },
        ]}
      />

      <AxisGuide mode={mode} />

      {/* 축 라벨 + 매트릭스 */}
      <div className="flex items-stretch gap-1.5">
        {/* 세로 축 라벨 (스크롤 밖 고정) */}
        <div className="flex items-center">
          <span className="whitespace-nowrap text-[11px] font-semibold text-ink-400 [writing-mode:vertical-rl] dark:text-ink-500">
            {rowAxisLabel}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {/* 가로 축 라벨 */}
          <p className="mb-1 text-center text-[11px] font-semibold text-ink-400 dark:text-ink-500">
            ↓ {colAxisLabel} →
          </p>
          <TypeMatrix mode={mode} />
        </div>
      </div>

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
