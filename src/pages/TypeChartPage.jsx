import PagePlaceholder from "../components/common/PagePlaceholder";
import { Grid3x3 } from "lucide-react";

export default function TypeChartPage() {
  return (
    <PagePlaceholder
      icon={Grid3x3}
      title="타입 상성 매트릭스"
      description="18×18 대미지 배율표, 공격/방어 관점 전환, 이중 타입 조합 계산기."
      step={6}
    />
  );
}
