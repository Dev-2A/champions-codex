import { useMemo } from "react";
import { BookOpen } from "lucide-react";
import { pokemonList } from "../data";
import { usePokedexStore } from "../store/usePokedexStore";
import PokedexFilters from "../components/pokedex/PokedexFilters";
import PokemonCard from "../components/pokedex/PokemonCard";

export default function PokedexPage() {
  const { query, types, megaOnly, sort } = usePokedexStore();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = pokemonList.filter((p) => {
      if (megaOnly && !p.canMega) return false;
      if (types.length && !types.some((t) => p.types.includes(t))) return false;
      if (q) {
        const hit =
          p.name.ko?.toLowerCase().includes(q) ||
          p.slug.includes(q) ||
          String(p.id).includes(q);
        if (!hit) return false;
      }
      return true;
    });
    const sorters = {
      dex: (a, b) => a.id - b.id,
      name: (a, b) => (a.name.ko || "").localeCompare(b.name.ko || "", "ko"),
      total: (a, b) => b.total - a.total,
    };
    return [...list].sort(sorters[sort]);
  }, [query, types, megaOnly, sort]);

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center gap-2">
          <BookOpen className="text-brand-500" size={22} strokeWidth={2.3} />
          <h1 className="text-xl font-bold tracking-tight">포켓몬 도감</h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          현재 레귤레이션(M-B) 사용 가능 포켓몬 224종. 이름·타입으로 찾아보세요.
        </p>
      </header>

      <PokedexFilters total={pokemonList.length} shown={filtered.length} />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-8 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          조건에 맞는 포켓몬이 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p) => (
            <PokemonCard key={p.slug} pokemon={p} />
          ))}
        </div>
      )}
    </div>
  );
}
