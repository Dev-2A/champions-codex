import { useEffect, useState } from "react";
import { Users, Trash2, Bookmark } from "lucide-react";
import { getPokemonBySlug, getItem } from "../data";
import { useTeamStore } from "../store/useTeamStore";
import { usePresetStore } from "../store/usePresetStore";
import TeamSlot from "../components/team/TeamSlot";
import PokemonPicker from "../components/team/PokemonPicker";
import MemberEditor from "../components/team/MemberEditor";
import CoverageAnalysis from "../components/team/CoverageAnalysis";
import PresetManager from "../components/team/PresetManager";

export default function TeamBuilderPage() {
  const slugs = useTeamStore((s) => s.slugs);
  const items = useTeamStore((s) => s.items);
  const add = useTeamStore((s) => s.add);
  const remove = useTeamStore((s) => s.remove);
  const setItem = useTeamStore((s) => s.setItem);
  const clear = useTeamStore((s) => s.clear);
  const loadPresets = usePresetStore((s) => s.load);

  const [picking, setPicking] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const team = slugs.map(getPokemonBySlug).filter(Boolean);
  const blockedDex = new Set(team.map((p) => p.dexNum));
  const slots = [...team, ...Array(6 - team.length).fill(null)];
  const usedItems = new Set(Object.values(items).filter(Boolean));
  const editingPokemon = editingSlug ? getPokemonBySlug(editingSlug) : null;

  const openEdit = (slug) => {
    setPicking(false);
    setEditingSlug(slug);
  };
  const openPicker = () => {
    setEditingSlug(null);
    setPicking(true);
  };
  const handlePick = (slug) => {
    add(slug);
    if (slugs.length + 1 >= 6) setPicking(false);
  };
  const handleRemove = (slug) => {
    if (editingSlug === slug) setEditingSlug(null);
    remove(slug);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-brand-500" size={22} strokeWidth={2.3} />
            <h1 className="text-xl font-bold tracking-tight">팀 빌더</h1>
          </div>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
            슬롯을 눌러 도구를 장착하세요. 같은 종족·같은 도구는 중복할 수
            없어요.
          </p>
        </div>
        {team.length > 0 && (
          <button
            onClick={() => {
              clear();
              setEditingSlug(null);
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-ink-400 transition-colors hover:text-red-500"
          >
            <Trash2 size={13} /> 비우기
          </button>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((p, i) => (
          <TeamSlot
            key={p?.slug ?? `empty-${i}`}
            pokemon={p}
            item={p ? getItem(items[p.slug]) : null}
            onRemove={handleRemove}
            onAdd={openPicker}
            onEdit={openEdit}
          />
        ))}
      </div>

      <p className="text-center text-xs text-ink-400 dark:text-ink-500">
        {team.length}/6 편성됨
      </p>

      {/* 편집 패널 / 피커 / 추가 버튼 (하나만) */}
      {editingPokemon ? (
        <MemberEditor
          pokemon={editingPokemon}
          item={getItem(items[editingSlug])}
          usedItems={usedItems}
          onSetItem={(itemSlug) => setItem(editingSlug, itemSlug)}
          onClose={() => setEditingSlug(null)}
        />
      ) : picking ? (
        <PokemonPicker
          blockedDex={blockedDex}
          teamSlugs={slugs}
          onPick={handlePick}
          onClose={() => setPicking(false)}
        />
      ) : (
        team.length < 6 && (
          <button
            onClick={openPicker}
            className="w-full rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            포켓몬 추가
          </button>
        )
      )}

      {team.length > 0 && (
        <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
          <h2 className="mb-3 text-lg font-bold tracking-tight">
            타입 커버리지 분석
          </h2>
          <CoverageAnalysis team={team} />
        </section>
      )}

      <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="text-brand-500" size={18} strokeWidth={2.3} />
          <h2 className="text-lg font-bold tracking-tight">저장된 팀</h2>
        </div>
        <PresetManager currentSlugs={slugs} />
      </section>
    </div>
  );
}
