import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import PokeballIcon from "../common/PokeballIcon";
import Toasts from "../common/Toasts";
import { usePageTracking } from "../../hooks/usePageTracking";

// 컨테이너 폭은 전 페이지 동일(max-w-6xl) — 페이지 이동 시 프레임이 흔들리지 않게.
// 좁은 콘텐츠 페이지는 내부에서 lg 그리드로 폭을 활용한다.
export default function AppShell({ children }) {
  usePageTracking(); // GoatCounter 페이지뷰
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      <TopBar />

      <main className="mx-auto w-full max-w-6xl px-4 pt-6">{children}</main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 text-center text-xs text-ink-400 md:pb-10 dark:text-ink-500">
        <p className="flex items-center justify-center gap-1">
          made with cola and <PokeballIcon size={14} />
        </p>
        <p className="mt-1">
          데이터: PokéAPI · 챔피언스 레귤레이션 큐레이션 · v{__APP_VERSION__}
        </p>
        <p className="mt-1">
          <a
            href="https://forms.gle/iywwkmMQVjdYqzZ88"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:underline"
          >
            피드백 · 버그 제보
          </a>
        </p>
      </footer>

      <BottomNav />
      <Toasts />
    </div>
  );
}
