import PagePlaceholder from "../components/common/PagePlaceholder";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
  return (
    <PagePlaceholder
      icon={HelpCircle}
      title="자주 묻는 질문"
      description='"메가진화가 뭐야?", "VP 어떻게 얻어?", "스카우트 우선순위는?" 같은 뉴비 관점 FAQ.'
      step={15}
    />
  );
}
