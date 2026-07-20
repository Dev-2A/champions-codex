import { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Package,
  ExternalLink,
  Plus,
  Sparkles,
  BarChart3,
} from "lucide-react";
import TypeBadge from "../common/TypeBadge";
import MoveBadge from "../moves/MoveBadge";
import ItemPicker from "./ItemPicker";
import MovePicker from "./MovePicker";
import StatEditor from "./StatEditor";
import { getMegaForms } from "../../data";
import { useMoveDb } from "../../hooks/useMoveDb";
import { assetUrl } from "../../lib/assets";
import {
  STAT_SHORT,
  STAT_KEYS,
  usedPoints,
  isEmptyBuild,
} from "../../lib/statCalc";

export default function MemberEditor({
  pokemon,
  item,
  moves,
  megaForm = null, // 이 멤버가 메가 지정된 경우 폼 객체
  megaOwnerName = null, // 다른 멤버가 메가 담당 중이면 그 이름
  build = null, // 능력 포인트·성격 { pts, up, down }
  usedItems,
  onSetItem,
  onSetMega,
  onClearMega,
  onSetStatPoint,
  onSetNature,
  onToggleMove,
  onClose,
}) {
  const [pickingItem, setPickingItem] = useState(false);
  const [pickingMove, setPickingMove] = useState(false);
  const [editingStats, setEditingStats] = useState(false);
  const moveDb = useMoveDb();
  const selectedMoves = moveDb ? moveDb.resolveMoves(moves) : [];
  const forms = getMegaForms(pokemon.slug);
  const baseStats = megaForm?.stats ?? pokemon.stats;

  return (
    <div className="space-y-4 rounded-2xl border border-brand-200 bg-white p-4 dark:border-brand-900 dark:bg-ink-900">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <img
          src={assetUrl(megaForm?.sprite ?? pokemon.sprite)}
          alt={pokemon.name.ko}
          className="size-12 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink-800 dark:text-ink-100">
            {pokemon.name.ko}
            {megaForm && (
              <span className="ml-1.5 text-xs font-semibold text-brand-500">
                {megaForm.label}
              </span>
            )}
          </p>
          <div className="mt-0.5 flex gap-1">
            {(megaForm?.types ?? pokemon.types).map((t) => (
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

      {/* 메가진화 */}
      {pokemon.canMega && forms.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
            메가진화
          </p>
          <div className="flex flex-wrap gap-1.5">
            {forms.map((f) => {
              const on = megaForm?.formSlug === f.formSlug;
              return (
                <button
                  key={f.formSlug}
                  type="button"
                  onClick={() => (on ? onClearMega() : onSetMega(f.formSlug))}
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                    on
                      ? "bg-brand-500 text-white"
                      : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700",
                  ].join(" ")}
                >
                  <Sparkles size={12} /> {f.label}
                </button>
              );
            })}
          </div>
          {megaForm ? (
            <p className="mt-1.5 text-[11px] text-ink-400 dark:text-ink-500">
              메가스톤이 도구 슬롯을 차지해요. 커버리지 분석도 메가 폼
              기준으로 계산돼요.
            </p>
          ) : (
            megaOwnerName && (
              <p className="mt-1.5 text-[11px] text-ink-400 dark:text-ink-500">
                현재 메가 담당: {megaOwnerName} — 여기서 지정하면 교체돼요.
                (배틀당 1마리)
              </p>
            )
          )}
        </div>
      )}

      {/* 도구 */}
      <div>
        <p className="mb-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
          지닌 도구
        </p>
        {megaForm ? (
          <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50/50 p-2 dark:border-brand-900 dark:bg-ink-800">
            <span className="grid size-8 shrink-0 place-items-center rounded bg-brand-100 dark:bg-ink-700">
              <Sparkles size={14} className="text-brand-500" />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink-800 dark:text-ink-100">
              메가스톤 (도구 슬롯 사용 중)
            </span>
            <button
              onClick={onClearMega}
              className="rounded-lg px-2 py-1 text-xs font-medium text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-700"
            >
              해제
            </button>
          </div>
        ) : pickingItem ? (
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

      {/* 능력치 (포인트·성격) */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">
            능력치{" "}
            <span className="text-ink-400">
              ({usedPoints(build)}/66 포인트)
            </span>
          </p>
          <button
            onClick={() => setEditingStats((v) => !v)}
            className="text-xs font-semibold text-brand-500 hover:underline"
          >
            {editingStats ? "닫기" : "편집"}
          </button>
        </div>
        {editingStats ? (
          <StatEditor
            baseStats={baseStats}
            build={build}
            onSetPoint={onSetStatPoint}
            onSetNature={onSetNature}
          />
        ) : isEmptyBuild(build) ? (
          <button
            onClick={() => setEditingStats(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-ink-700 dark:text-ink-400"
          >
            <BarChart3 size={15} /> 능력치 분배 (66 포인트)
          </button>
        ) : (
          <button
            onClick={() => setEditingStats(true)}
            title="능력치 편집"
            className="flex w-full flex-wrap gap-1 rounded-xl border border-ink-200 p-2 text-left transition-colors hover:border-brand-300 dark:border-ink-800"
          >
            {STAT_KEYS.filter((k) => build.pts[k] > 0).map((k) => (
              <span
                key={k}
                className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-600 dark:bg-ink-800 dark:text-ink-300"
              >
                {STAT_SHORT[k]}
                {build.pts[k]}
              </span>
            ))}
            {(build.up || build.down) && (
              <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                {build.up ? `▲${STAT_SHORT[build.up]}` : ""}
                {build.down ? ` ▼${STAT_SHORT[build.down]}` : ""}
              </span>
            )}
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
