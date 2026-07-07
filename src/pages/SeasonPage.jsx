import PagePlaceholder from "../components/common/PagePlaceholder";
import { CalendarClock } from "lucide-react";

export default function SeasonPage() {
  return (
    <PagePlaceholder
      icon={CalendarClock}
      title="시즌 · 레귤레이션 정보"
      description="현재 레귤레이션(M-B)과 진행 중인 랭크 시즌, 종료일 카운트다운을 보여줍니다."
      step={14}
    />
  );
}
