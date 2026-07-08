import { NavLink } from "react-router-dom";
import { navItems } from "../../router/navItems";

export default function BottomNav() {
  const primary = navItems.filter((i) => i.primary);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-200 bg-ink-50/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden dark:border-ink-800 dark:bg-ink-950/95">
      <ul className="mx-auto flex max-w-3xl">
        {primary.map(({ to, short, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-brand-500 dark:text-brand-400"
                    : "text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={21} strokeWidth={isActive ? 2.6 : 2} />
                  <span>{short}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
