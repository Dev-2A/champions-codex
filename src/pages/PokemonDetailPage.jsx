import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getPokemonBySlug } from "../data";
import PagePlaceholder from "../components/common/PagePlaceholder";

export default function PokemonDetailPage() {
  const { slug } = useParams();
  const pokemon = getPokemonBySlug(slug);

  return (
    <div className="space-y-4">
      <Link
        to="/pokedex"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft size={15} /> 도감으로
      </Link>
      <PagePlaceholder
        icon={BookOpen}
        title={pokemon ? pokemon.name.ko : "알 수 없는 포켓몬"}
        description="종족값·특성·방어 프로필·타입 특성 상세는 다음 단계에서 구현돼요."
        step={9}
      />
    </div>
  );
}
