import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import PokeballIcon from "../common/PokeballIcon";
import Toasts from "../common/Toasts";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      <TopBar />

      <main className="mx-auto w-full max-w-3xl px-4 pt-6">{children}</main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-28 pt-8 text-center text-xs text-ink-400 md:pb-10 dark:text-ink-500">
        <p className="flex items-center justify-center gap-1">
          made with cola and <PokeballIcon size={14} />
        </p>
        <p className="mt-1">
          데이터: PokéAPI · 챔피언스 레귤레이션 큐레이션 · v0.1.0
        </p>
      </footer>

      <BottomNav />
      <Toasts />
    </div>
  );
}
