import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { navItems } from "../../router/navItems";
import ThemeToggle from "./ThemeToggle";

const linkPill = ({ isActive }) =>
  [
    "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-[13px] font-medium transition-colors",
    isActive
      ? "bg-brand-500 text-white shadow-sm"
      : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
  ].join(" ");

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const secondary = navItems.filter((i) => !i.primary);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur dark:border-ink-800/70 dark:bg-ink-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3">
        {/* 로고 */}
        <Link to="/" className="mr-auto flex shrink-0 items-center gap-2">
          <span className="text-xl" aria-hidden>
            🏆
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight">
              Champions Codex
            </span>
            <span className="hidden text-[11px] text-ink-500 lg:block dark:text-ink-400">
              포켓몬 챔피언스 뉴비 허브
            </span>
          </span>
        </Link>

        {/* 데스크톱: 전체 내비 */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map(({ to, short, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkPill}>
              <Icon size={15} strokeWidth={2.2} />
              {short}
            </NavLink>
          ))}
        </nav>

        {/* 모바일: 더보기(시즌·FAQ·도구 등) */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="더보기 메뉴"
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
          >
            <MoreHorizontal size={20} strokeWidth={2.2} />
          </button>

          {open && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-ink-200 bg-white p-1 shadow-lg dark:border-ink-700 dark:bg-ink-900">
                {secondary.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-50 text-brand-600 dark:bg-ink-800 dark:text-brand-300"
                          : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
                      ].join(" ")
                    }
                  >
                    <Icon size={16} strokeWidth={2.2} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
