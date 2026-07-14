import { useState } from "react";
import {
  Save,
  FolderOpen,
  Copy,
  Trash2,
  Pencil,
  Check,
  X,
  Package,
  Swords,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getPokemonBySlug } from "../../data";
import { assetUrl } from "../../lib/assets";
import { usePresetStore } from "../../store/usePresetStore";
import { useTeamStore } from "../../store/useTeamStore";
import { toast } from "../../store/useToastStore";

export default function PresetManager({ current }) {
  const presets = usePresetStore((s) => s.presets);
  const loaded = usePresetStore((s) => s.loaded);
  const save = usePresetStore((s) => s.save);
  const update = usePresetStore((s) => s.update);
  const duplicate = usePresetStore((s) => s.duplicate);
  const remove = usePresetStore((s) => s.remove);
  const setTeam = useTeamStore((s) => s.setTeam);

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const canSave = current.slugs.length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    const preset = await save(name, current);
    setName("");
    toast(`"${preset.name}" 저장됨`, { tone: "success" });
  };

  const handleLoad = (preset) => {
    if (
      current.slugs.length > 0 &&
      !confirm(`현재 팀을 "${preset.name}"(으)로 교체할까요?`)
    )
      return;
    setTeam({
      slugs: preset.slugs,
      items: preset.items,
      moves: preset.moves,
      mega: preset.mega ?? null,
      builds: preset.builds ?? {},
    });
    toast(`"${preset.name}" 불러옴`, { tone: "success" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const commitRename = async (id) => {
    await update(id, { name: editName.trim() || "이름 없는 팀" });
    setEditingId(null);
  };

  const countItems = (p) => Object.keys(p.items ?? {}).length;
  const countMoves = (p) =>
    Object.values(p.moves ?? {}).reduce((n, arr) => n + arr.length, 0);

  return (
    <div className="space-y-4">
      {/* 저장 */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder={
            canSave ? "팀 이름 (예: 순풍 어택)" : "먼저 포켓몬을 편성하세요"
          }
          disabled={!canSave}
          className="flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900"
        />
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={15} /> 저장
        </button>
      </div>

      {/* 목록 */}
      {loaded && presets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          저장된 팀이 없어요. 팀을 편성하고 이름을 붙여 저장해보세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {presets.map((preset) => {
            const mons = preset.slugs.map(getPokemonBySlug).filter(Boolean);
            const nItems = countItems(preset);
            const nMoves = countMoves(preset);
            return (
              <li
                key={preset.id}
                className="rounded-2xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900"
              >
                {editingId === preset.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && commitRename(preset.id)
                      }
                      className="flex-1 rounded-lg border border-brand-400 bg-white px-2 py-1 text-sm outline-none dark:bg-ink-950"
                    />
                    <button
                      onClick={() => commitRename(preset.id)}
                      className="text-brand-500"
                      aria-label="확인"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-ink-400"
                      aria-label="취소"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-800 dark:text-ink-100">
                      {preset.name}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-2 text-[11px] text-ink-400 dark:text-ink-500">
                      <span>{mons.length}마리</span>
                      {preset.mega && (
                        <span className="font-semibold text-brand-500">
                          ✨ 메가
                        </span>
                      )}
                      {nItems > 0 && (
                        <span className="inline-flex items-center gap-0.5">
                          <Package size={10} /> {nItems}
                        </span>
                      )}
                      {nMoves > 0 && (
                        <span className="inline-flex items-center gap-0.5">
                          <Swords size={10} /> {nMoves}
                        </span>
                      )}
                      <span>
                        ·{" "}
                        {formatDistanceToNow(new Date(preset.updatedAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </p>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {mons.map((p) => (
                    <img
                      key={p.slug}
                      src={assetUrl(p.sprite)}
                      alt={p.name.ko}
                      title={p.name.ko}
                      className="size-9 object-contain"
                    />
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5 border-t border-ink-100 pt-2 dark:border-ink-800">
                  <button
                    onClick={() => handleLoad(preset)}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-100 dark:bg-ink-800 dark:text-brand-300 dark:hover:bg-ink-700"
                  >
                    <FolderOpen size={13} /> 불러오기
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(preset.id);
                      setEditName(preset.name);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
                  >
                    <Pencil size={13} /> 이름
                  </button>
                  <button
                    onClick={() => duplicate(preset.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
                  >
                    <Copy size={13} /> 복제
                  </button>
                  <button
                    onClick={() =>
                      confirm(`"${preset.name}"을(를) 삭제할까요?`) &&
                      remove(preset.id)
                    }
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-ink-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={13} /> 삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
