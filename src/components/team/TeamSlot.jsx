import { Link } from "react-router-dom";
import { X, Plus } from "lucide-react";
import TypeBadge from "../common/TypeBadge";

export default function TeamSlot({ pokemon, onRemove, onAdd }) {
  if (!pokemon) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink-300 text-ink-400 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-ink-700 dark:text-ink-500"
      >
        <Plus size={22} />
        <span className="text-[11px] font-medium">추가</span>
      </button>
    );
  }
  const { slug, name, types, sprite } = pokemon;
  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-ink-200 bg-white p-2 dark:border-ink-800 dark:bg-ink-900">
      <button
        type="button"
        onClick={() => onRemove(slug)}
        className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-ink-100 text-ink-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:bg-ink-800"
        aria-label="제거"
      >
        <X size={12} />
      </button>
      <Link to={`/pokedex/${slug}`}>
        <img
          src={sprite}
          alt={name.ko}
          loading="lazy"
          className="size-16 object-contain"
        />
      </Link>
      <p className="mt-0.5 max-w-full truncate text-xs font-bold text-ink-800 dark:text-ink-100">
        {name.ko}
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
        {types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>
    </div>
  );
}
