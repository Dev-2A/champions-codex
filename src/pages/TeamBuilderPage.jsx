import PagePlaceholder from "../components/common/PagePlaceholder";
import { Users } from "lucide-react";

export default function TeamBuilderPage() {
  return (
    <PagePlaceholder
      icon={Users}
      title="팀 빌더"
      description="6마리 팀을 편성하고 타입 커버리지(약점/저항 히트맵)를 자동 분석합니다. 팀은 브라우저에 저장돼요."
      step={10}
    />
  );
}
