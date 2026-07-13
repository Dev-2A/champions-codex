import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import TypeBadge from "../common/TypeBadge";
import { assetUrl } from "../../lib/assets";

export default function PokemonCard({ pokemon, sort }) {
  const { slug, id, name, types, canMega, sprite, total, stats } = pokemon;
  const metric =
    sort === "total"
      ? { label: "종족값", value: total }
      : sort === "speed"
        ? { label: "S", value: stats.spe }
        : null;

  return (
    <Link
      to={`/pokedex/${slug}`}
      className="group flex flex-col items-center rounded-2xl border border-ink-200 bg-white p-3 text-center transition-colors hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800 dark:hover:bg-ink-800"
    >
      <div className="relative w-full">
        <span className="absolute left-0 top-0 text-[10px] font-semibold text-ink-300 dark:text-ink-600">
          #{String(id).padStart(4, "0")}
        </span>
        {canMega && (
          <span className="absolute right-0 top-0 inline-flex items-center gap-0.5 rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Sparkles size={9} /> 메가
          </span>
        )}
        <img
          src={assetUrl(sprite)}
          alt={name.ko}
          loading="lazy"
          className="mx-auto size-24 object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <p className="mt-1 text-sm font-bold text-ink-800 dark:text-ink-100">
        {name.ko}
      </p>
      {metric && (
        <span className="mt-0.5 rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          {metric.label} {metric.value}
        </span>
      )}
      <div className="mt-1.5 flex flex-wrap justify-center gap-1">
        {types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>
    </Link>
  );
}
