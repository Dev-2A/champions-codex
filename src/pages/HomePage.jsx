import { Link } from "react-router-dom";
import { navItems } from "../router/navItems";
import { regulation, pokemonList } from "../data";

export default function HomePage() {
  const cards = navItems.filter((i) => i.to !== "/");

  return (
    <div className="space-y-8">
      {/* 히어로 */}
      <section className="rounded-2xl border border-brand-200 bg-linear-to-br from-brand-50 to-white p-6 dark:border-brand-900 dark:from-ink-900 dark:to-ink-950">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
          {regulation.name}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold leading-snug tracking-tight">
          포켓몬 챔피언스,
          <br />
          처음이어도 30분이면 랭크로.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-500 dark:text-ink-300">
          게임 기초부터 타입 상성, 사용 가능 포켓몬 도감, 팀 빌딩까지 — 뉴비가
          이해하고 팀을 짜는 여정을 한 곳에서.
        </p>

        {/* 데이터 레이어 연동 스탯 */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-brand-100 px-2.5 py-1 font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            현재 {pokemonList.length}종 사용 가능
          </span>
          <span className="rounded-full bg-ink-100 px-2.5 py-1 font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
            {regulation.startDate} ~ {regulation.endDate}
          </span>
          <span className="rounded-full bg-ink-100 px-2.5 py-1 font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
            더블 배틀 · Lv.50
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/guide"
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            뉴비 가이드 시작
          </Link>
          <Link
            to="/team"
            className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
          >
            바로 팀 짜기
          </Link>
        </div>
      </section>

      {/* 섹션 카드 */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink-500 dark:text-ink-400">
          둘러보기
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/50 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800 dark:hover:bg-ink-800"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {label}
                </p>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
