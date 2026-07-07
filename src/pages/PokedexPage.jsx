import PagePlaceholder from "../components/common/PagePlaceholder";
import { BookOpen } from "lucide-react";

export default function PokedexPage() {
  return (
    <PagePlaceholder
      icon={BookOpen}
      title="포켓몬 도감"
      description="현재 레귤레이션(M-B) 사용 가능 포켓몬을 한국어로 검색·필터하고, 종족값·특성·메가 여부를 확인합니다."
      step={8}
    />
  );
}
