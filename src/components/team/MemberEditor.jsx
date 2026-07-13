import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Package, ExternalLink, Plus } from "lucide-react";
import TypeBadge from "../common/TypeBadge";
import MoveBadge from "../moves/MoveBadge";
import ItemPicker from "./ItemPicker";
import MovePicker from "./MovePicker";
import { useMoveDb } from "../../hooks/useMoveDb";
import { assetUrl } from "../../lib/assets";

export default function MemberEditor({
  pokemon,
  item,
  moves,
  usedItems,
  onSetItem,
  onToggleMove,
  onClose,
}) {
  const [pickingItem, setPickingItem] = useState(false);
  const [pickingMove, setPickingMove] = useState(false);
  const moveDb = useMoveDb();
  const selectedMoves = moveDb ? moveDb.resolveMoves(moves) : [];

  return (
    <div className="space-y-4 rounded-2xl border border-brand-200 bg-white p-4 dark:border-brand-900 dark:bg-ink-900">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <img
          src={assetUrl(pokemon.sprite)}
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

      {/* 도구 */}
      <div>
        <p className="mb-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
          지닌 도구
        </p>
        {pickingItem ? (
          <ItemPicker
            usedItems={usedItems}
            current={item?.slug}
            onPick={(slug) => {
              onSetItem(slug);
              setPickingItem(false);
            }}
            onClose={() => setPickingItem(false)}
          />
        ) : item ? (
          <div className="flex items-center gap-2 rounded-xl border border-ink-200 p-2 dark:border-ink-800">
            <span className="grid size-8 shrink-0 place-items-center rounded bg-ink-100 dark:bg-ink-800">
              {item.sprite ? (
                <img
                  src={assetUrl(item.sprite)}
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
              onClick={() => setPickingItem(true)}
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
            onClick={() => setPickingItem(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-ink-700 dark:text-ink-400"
          >
            <Package size={15} /> 도구 선택
          </button>
        )}
      </div>

      {/* 기술 */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">
            기술 <span className="text-ink-400">({moves.length}/4)</span>
          </p>
          <button
            onClick={() => setPickingMove((v) => !v)}
            className="text-xs font-semibold text-brand-500 hover:underline"
          >
            {pickingMove ? "닫기" : "편집"}
          </button>
        </div>

        {/* 선택된 기술 */}
        {selectedMoves.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {selectedMoves.map((m) => (
              <button
                key={m.slug}
                onClick={() => onToggleMove(m.slug)}
                title="제거"
                className="group inline-flex"
              >
                <MoveBadge move={m} className="group-hover:opacity-70" />
              </button>
            ))}
          </div>
        )}

        {pickingMove ? (
          <MovePicker
            pokemonSlug={pokemon.slug}
            selected={moves}
            onToggle={onToggleMove}
          />
        ) : (
          moves.length === 0 && (
            <button
              onClick={() => setPickingMove(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-ink-700 dark:text-ink-400"
            >
              <Plus size={15} /> 기술 선택
            </button>
          )
        )}
      </div>
    </div>
  );
}
