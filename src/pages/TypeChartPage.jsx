import { useState } from "react";
import { Grid3x3 } from "lucide-react";
import SegmentedToggle from "../components/common/SegmentedToggle";
import MatrixView from "../components/typechart/MatrixView";
import TypeCalculator from "../components/typechart/TypeCalculator";

export default function TypeChartPage() {
  const [view, setView] = useState("matrix");

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center gap-2">
          <Grid3x3 className="text-brand-500" size={22} strokeWidth={2.3} />
          <h1 className="text-xl font-bold tracking-tight">타입 상성</h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          18타입 배율표와 이중 타입 계산기로 약점·저항을 확인하세요.
        </p>
      </header>

      {/* xl 미만: 토글로 전환 · xl부터: 상성표|계산기 나란히 상시 표시 */}
      <div className="xl:hidden">
        <SegmentedToggle
          value={view}
          onChange={setView}
          options={[
            { value: "matrix", label: "상성표" },
            { value: "calc", label: "타입 계산기" },
          ]}
        />
      </div>

      <div className="xl:grid xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start xl:gap-8">
        <div className={view === "matrix" ? "" : "hidden xl:block"}>
          <h2 className="mb-3 hidden text-lg font-bold tracking-tight xl:block">
            상성표
          </h2>
          {/* xl 미만에서는 가운데 정렬 (고정 폭 콘텐츠의 한쪽 쏠림 방지) */}
          <div className="mx-auto w-fit max-w-full xl:mx-0">
            <MatrixView />
          </div>
        </div>
        <div className={view === "calc" ? "" : "hidden xl:block"}>
          <h2 className="mb-3 hidden text-lg font-bold tracking-tight xl:block">
            타입 계산기
          </h2>
          <TypeCalculator />
        </div>
      </div>
    </div>
  );
}
