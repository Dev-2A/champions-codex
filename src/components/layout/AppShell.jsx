import { NavLink } from "react-router-dom";
import { navItems } from "../../router/navItems";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur dark:border-ink-800/70 dark:bg-ink-950/80">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-3">
          <span className="text-xl" aria-hidden>
            🏆
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight">
              Champions Codex
            </h1>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              포켓몬 챔피언스 뉴비 정보·DB 허브
            </p>
          </div>
        </div>

        {/* 임시 내비게이션 — Step 5에서 반응형 내비로 교체 */}
        <nav className="mx-auto w-full max-w-3xl px-4 pb-2">
          <ul className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map(({ to, short, icon: Icon, end }) => (
              <li key={to} className="shrink-0">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-500 text-white shadow-sm"
                        : "bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700",
                    ].join(" ")
                  }
                >
                  <Icon size={15} strokeWidth={2.2} />
                  {short}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* 본문 */}
      <main className="mx-auto w-full max-w-3xl px-4 py-6">{children}</main>

      {/* 푸터 */}
      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 text-center text-xs text-ink-400 dark:text-ink-500">
        <p>made with cola and heart 🥤</p>
        <p className="mt-1">
          데이터: PokéAPI · 챔피언스 레귤레이션 큐레이션 · v0.1.0
        </p>
      </footer>
    </div>
  );
}
