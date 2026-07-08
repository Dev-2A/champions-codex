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

      <SegmentedToggle
        value={view}
        onChange={setView}
        options={[
          { value: "matrix", label: "상성표" },
          { value: "calc", label: "타입 계산기" },
        ]}
      />

      {view === "matrix" ? <MatrixView /> : <TypeCalculator />}
    </div>
  );
}
