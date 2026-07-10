import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Package, ExternalLink } from "lucide-react";
import TypeBadge from "../common/TypeBadge";
import ItemPicker from "./ItemPicker";

export default function MemberEditor({
  pokemon,
  item,
  usedItems,
  onSetItem,
  onClose,
}) {
  const [picking, setPicking] = useState(false);

  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-4 dark:border-brand-900 dark:bg-ink-900">
      <div className="mb-3 flex items-center gap-3">
        <img
          src={pokemon.sprite}
          alt={pokemon.name.ko}
          className="size-12 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink-800 dark:text-ink-100">
            {pokemon.name.ko}
          </p>
          <div className="mt-0.5 flex gap-1">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </div>
        <Link
          to={`/pokedex/${pokemon.slug}`}
          className="grid size-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
          title="상세 보기"
        >
          <ExternalLink size={16} />
        </Link>
        <button
          onClick={onClose}
          className="grid size-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
          aria-label="닫기"
        >
          <X size={18} />
        </button>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
          지닌 도구
        </p>
        {picking ? (
          <ItemPicker
            usedItems={usedItems}
            current={item?.slug}
            onPick={(slug) => {
              onSetItem(slug);
              setPicking(false);
            }}
            onClose={() => setPicking(false)}
          />
        ) : item ? (
          <div className="flex items-center gap-2 rounded-xl border border-ink-200 p-2 dark:border-ink-800">
            <span className="grid size-8 shrink-0 place-items-center rounded bg-ink-100 dark:bg-ink-800">
              {item.sprite ? (
                <img
                  src={item.sprite}
                  alt={item.name.ko}
                  className="size-6 object-contain"
                />
              ) : (
                <Package size={14} className="text-ink-400" />
              )}
            </span>
            <span className="flex-1 text-sm font-semibold text-ink-800 dark:text-ink-100">
              {item.name.ko}
            </span>
            <button
              onClick={() => setPicking(true)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
            >
              변경
            </button>
            <button
              onClick={() => onSetItem(null)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              제거
            </button>
          </div>
        ) : (
          <button
            onClick={() => setPicking(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-ink-700 dark:text-ink-400"
          >
            <Package size={15} /> 도구 선택
          </button>
        )}
      </div>
    </div>
  );
}
