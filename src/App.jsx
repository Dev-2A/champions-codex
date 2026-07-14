import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";

// 라우트 단위 코드 스플리팅 — 각 페이지(와 그 페이지만 쓰는 데이터)는
// 방문할 때 로드된다.
const HomePage = lazy(() => import("./pages/HomePage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const TypeChartPage = lazy(() => import("./pages/TypeChartPage"));
const PokedexPage = lazy(() => import("./pages/PokedexPage"));
const PokemonDetailPage = lazy(() => import("./pages/PokemonDetailPage"));
const TeamBuilderPage = lazy(() => import("./pages/TeamBuilderPage"));
const SeasonPage = lazy(() => import("./pages/SeasonPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ItemDexPage = lazy(() => import("./pages/ItemDexPage"));
const LinksPage = lazy(() => import("./pages/LinksPage"));

function PageFallback() {
  return (
    <p className="py-16 text-center text-sm text-ink-400 dark:text-ink-500">
      불러오는 중…
    </p>
  );
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guide" element={<OnboardingPage />} />
          <Route path="/types" element={<TypeChartPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/pokedex/:slug" element={<PokemonDetailPage />} />
          <Route path="/items" element={<ItemDexPage />} />
          <Route path="/team" element={<TeamBuilderPage />} />
          <Route path="/season" element={<SeasonPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
