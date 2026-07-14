import { X, Plus, Package, Sparkles } from "lucide-react";
import TypeBadge from "../common/TypeBadge";
import { assetUrl } from "../../lib/assets";

export default function TeamSlot({
  pokemon,
  item,
  megaForm = null, // 이 멤버가 메가 지정된 경우 폼 객체
  active = false,
  onRemove,
  onAdd,
  onEdit,
}) {
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
  const { slug, name, sprite, canMega } = pokemon;
  const types = megaForm ? megaForm.types : pokemon.types;
  return (
    <div
      className={[
        "relative flex flex-col items-center rounded-2xl border bg-white p-2 transition-shadow dark:bg-ink-900",
        active
          ? "border-brand-400 ring-2 ring-brand-400/40"
          : "border-ink-200 dark:border-ink-800",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onRemove(slug)}
        className="absolute right-1 top-1 z-10 grid size-5 place-items-center rounded-full bg-ink-100 text-ink-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:bg-ink-800"
        aria-label="제거"
      >
        <X size={12} />
      </button>
      {megaForm ? (
        <span
          className="absolute left-1 top-1 z-10 inline-flex items-center gap-0.5 rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold text-white"
          title={megaForm.name.ko}
        >
          <Sparkles size={9} /> 메가
        </span>
      ) : (
        canMega && (
          <span
            className="absolute left-1.5 top-1.5 z-10"
            title="메가진화 가능"
          >
            <Sparkles size={13} className="text-brand-500" />
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => onEdit(slug)}
        className="flex w-full flex-col items-center"
      >
        <img
          src={assetUrl(megaForm?.sprite ?? sprite)}
          alt={megaForm?.name.ko ?? name.ko}
          loading="lazy"
          className="size-16 object-contain"
        />
        <p className="mt-0.5 max-w-full truncate text-xs font-bold text-ink-800 dark:text-ink-100">
          {name.ko}
        </p>
        <div className="mt-1 flex flex-wrap justify-center gap-0.5">
          {types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </button>

      <button
        type="button"
        onClick={() => onEdit(slug)}
        className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg bg-ink-100 px-1.5 py-1 text-[10px] font-medium transition-colors hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700"
        title="도구 편집"
      >
        {megaForm ? (
          <>
            <Sparkles size={11} className="text-brand-500" />
            <span className="truncate text-ink-600 dark:text-ink-300">
              메가스톤
            </span>
          </>
        ) : item ? (
          <>
            {item.sprite ? (
              <img
                src={assetUrl(item.sprite)}
                alt=""
                className="size-4 object-contain"
              />
            ) : (
              <Package size={11} className="text-ink-400" />
            )}
            <span className="truncate text-ink-600 dark:text-ink-300">
              {item.name.ko}
            </span>
          </>
        ) : (
          <span className="text-ink-400 dark:text-ink-500">+ 도구</span>
        )}
      </button>
    </div>
  );
}
