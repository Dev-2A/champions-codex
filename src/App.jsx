import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import OnboardingPage from "./pages/OnboardingPage";
import TypeChartPage from "./pages/TypeChartPage";
import PokedexPage from "./pages/PokedexPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import TeamBuilderPage from "./pages/TeamBuilderPage";
import SeasonPage from "./pages/SeasonPage";
import FaqPage from "./pages/FaqPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<OnboardingPage />} />
        <Route path="/types" element={<TypeChartPage />} />
        <Route path="/pokedex" element={<PokedexPage />} />
        <Route path="/pokedex/:slug" element={<PokemonDetailPage />} />
        <Route path="/team" element={<TeamBuilderPage />} />
        <Route path="/season" element={<SeasonPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
