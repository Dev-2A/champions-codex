import { Link } from "react-router-dom";
import {
  GraduationCap,
  Swords,
  Users,
  Sparkles,
  Rocket,
  BookMarked,
  Zap,
} from "lucide-react";
import Glossary from "../components/onboarding/Glossary";
import BattleMechanics from "../components/onboarding/BattleMechanics";

const SECTIONS = [
  {
    icon: GraduationCap,
    title: "포켓몬 챔피언스가 뭐야?",
    points: [
      "탐험·스토리 없이 배틀에만 집중한 무료(F2P) 경쟁 배틀 게임이에요. 2026년 4월 8일 스위치, 6월 17일 모바일로 출시됐어요.",
      "경쟁전의 기본 포맷은 더블 배틀(2v2)이고, 싱글 랭크도 따로 있어요. 공식 대회·2026 월드챔피언십도 이 게임으로 열려요.",
      '레벨은 50, 개체값은 31로 자동 정규화돼서, "노가다"가 아니라 팀 구성과 실력으로 승부해요.',
    ],
  },
  {
    icon: Rocket,
    title: "30분 시작 가이드",
    points: [
      "① 포켓몬 확보 — 목장(스카우트)에서 매일 무료로 7일 체험하거나, 포켓몬 HOME에서 무료 전송. 마음에 들면 2,500 VP로 영구 영입.",
      "② 팀 짜기 — 6마리를 편성하고 타입 커버리지(공통 약점)를 점검. 도구·기술은 VP로 조정.",
      "③ 랭크 진입 — 몬스터볼 랭크4부터 시작. 승리하면 게이지가 차고, 마스터볼·챔피언을 향해 올라가요.",
    ],
  },
  {
    icon: Swords,
    title: "더블 배틀 기초",
    points: [
      "2마리가 동시에 필드에 나와요. 대부분의 기술은 두 상대 중 누구를 때릴지 골라야 해요(타게팅).",
      "Bring 6, Pick 4 — 6마리 중 4마리를 팀 프리뷰(90초)에서 선출. 상대 팀을 보고 고르는 심리전이 승부처예요.",
      "스프레드 기술(지진·열풍)은 여럿을 동시 타격, 프로텍트는 거의 필수, 트릭룸·순풍 같은 스피드 컨트롤이 핵심이에요.",
    ],
  },
  {
    icon: Sparkles,
    title: "챔피언스만의 규칙",
    points: [
      "메가진화는 오멘 링으로 배틀 중 1회만. 테라스탈·다이맥스·Z기술은 없어요.",
      "종족 클로즈(같은 종족 불가) + 도구 클로즈(같은 도구 불가).",
      "노력치 대신 66 스탯 포인트(한 스탯 최대 32). 페이크아웃은 첫 턴/교체 직후만, 잠듦은 최대 3턴, 마비 행동불가율은 12.5%로 조정됐어요.",
    ],
  },
];

function SectionCard({ icon: Icon, title, points }) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
          <Icon size={17} strokeWidth={2.3} />
        </div>
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
      </div>
      <ul className="space-y-1.5">
        {points.map((p, i) => (
          <li
            key={i}
            className="text-sm leading-relaxed text-ink-600 dark:text-ink-300"
          >
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <GraduationCap
            className="text-brand-500"
            size={22}
            strokeWidth={2.3}
          />
          <h1 className="text-xl font-bold tracking-tight">뉴비 가이드</h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          포켓몬 챔피언스를 처음 접한 사람을 위한 30분 온보딩. 이해하고 팀 짜서
          랭크까지.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {SECTIONS.map((s) => (
          <SectionCard key={s.title} {...s} />
        ))}
      </div>

      {/* 다음 액션 */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          to="/types"
          className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white p-3 transition-colors hover:border-brand-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800"
        >
          <Swords size={18} className="text-brand-500" />
          <span className="text-sm font-semibold">타입 상성 익히기</span>
        </Link>
        <Link
          to="/team"
          className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white p-3 transition-colors hover:border-brand-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800"
        >
          <Users size={18} className="text-brand-500" />
          <span className="text-sm font-semibold">팀 짜보기</span>
        </Link>
      </div>

      {/* 배틀 메커니즘 */}
      <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
        <div className="mb-3 flex items-center gap-2">
          <Zap className="text-brand-500" size={18} strokeWidth={2.3} />
          <h2 className="text-lg font-bold tracking-tight">배틀 메커니즘</h2>
        </div>
        <p className="mb-3 text-sm text-ink-500 dark:text-ink-400">
          상태이상·날씨·필드·설치기 — 배틀 중에 "이게 뭐였지?" 싶을 때
          찾아보세요.
        </p>
        <BattleMechanics />
      </section>

      {/* 용어집 */}
      <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
        <div className="mb-3 flex items-center gap-2">
          <BookMarked className="text-brand-500" size={18} strokeWidth={2.3} />
          <h2 className="text-lg font-bold tracking-tight">용어집</h2>
        </div>
        <Glossary />
      </section>
    </div>
  );
}
