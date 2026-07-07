import {
  Home,
  GraduationCap,
  Grid3x3,
  BookOpen,
  Users,
  CalendarClock,
  HelpCircle,
} from "lucide-react";

// 앱 전역 내비게이션 소스 (홈 카드 + 헤더 내비가 공유)
export const navItems = [
  {
    to: "/",
    label: "홈",
    short: "홈",
    icon: Home,
    end: true,
    desc: "허브 시작점",
  },
  {
    to: "/guide",
    label: "뉴비 가이드",
    short: "가이드",
    icon: GraduationCap,
    end: false,
    desc: "챔피언스가 뭔지 30분 온보딩",
  },
  {
    to: "/types",
    label: "타입 상성",
    short: "타입",
    icon: Grid3x3,
    end: false,
    desc: "18×18 상성 매트릭스 + 이중타입 계산",
  },
  {
    to: "/pokedex",
    label: "도감",
    short: "도감",
    icon: BookOpen,
    end: false,
    desc: "현재 레귤레이션 사용 가능 포켓몬",
  },
  {
    to: "/team",
    label: "팀 빌더",
    short: "팀",
    icon: Users,
    end: false,
    desc: "6마리 편성 + 타입 커버리지 분석",
  },
  {
    to: "/season",
    label: "시즌 정보",
    short: "시즌",
    icon: CalendarClock,
    end: false,
    desc: "현재 레귤레이션 · 종료 카운트다운",
  },
  {
    to: "/faq",
    label: "FAQ",
    short: "FAQ",
    icon: HelpCircle,
    end: false,
    desc: "뉴비가 자주 묻는 질문",
  },
];
