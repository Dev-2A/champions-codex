import PagePlaceholder from "../components/common/PagePlaceholder";
import { GraduationCap } from "lucide-react";

export default function OnboardingPage() {
  return (
    <PagePlaceholder
      icon={GraduationCap}
      title="뉴비 가이드 & 용어집"
      description="챔피언스가 뭔지, 시작하는 법, VP·Omni Ring·마스터볼급 같은 용어를 뉴비 눈높이로 정리합니다."
      step={13}
    />
  );
}
