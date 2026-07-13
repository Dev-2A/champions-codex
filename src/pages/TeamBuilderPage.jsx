import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, Trash2, Bookmark } from "lucide-react";
import { getPokemonBySlug, getItem } from "../data";
import { useTeamStore } from "../store/useTeamStore";
import { usePresetStore } from "../store/usePresetStore";
import { toast } from "../store/useToastStore";
import { decodeTeam } from "../lib/teamShare";
import TeamSlot from "../components/team/TeamSlot";
import PokemonPicker from "../components/team/PokemonPicker";
import MemberEditor from "../components/team/MemberEditor";
import CoverageAnalysis from "../components/team/CoverageAnalysis";
import PresetManager from "../components/team/PresetManager";
import SegmentedToggle from "../components/common/SegmentedToggle";
import OffenseAnalysis from "../components/team/OffenseAnalysis";
import TeamExport from "../components/team/TeamExport";

const ADD_FAIL_MSG = {
  full: "팀이 가득 찼어요 (최대 6마리)",
  dup: "이미 팀에 있는 포켓몬이에요",
  species: "같은 종족은 한 마리만 넣을 수 있어요 (종족 클로즈)",
  invalid: "추가할 수 없는 포켓몬이에요",
};

export default function TeamBuilderPage() {
  const slugs = useTeamStore((s) => s.slugs);
  const items = useTeamStore((s) => s.items);
  const add = useTeamStore((s) => s.add);
  const remove = useTeamStore((s) => s.remove);
  const setItem = useTeamStore((s) => s.setItem);
  const moves = useTeamStore((s) => s.moves);
  const toggleMove = useTeamStore((s) => s.toggleMove);
  const clear = useTeamStore((s) => s.clear);
  const setTeam = useTeamStore((s) => s.setTeam);
  const loadPresets = usePresetStore((s) => s.load);
  const [searchParams, setSearchParams] = useSearchParams();

  const [picking, setPicking] = useState(false);
  const [pickerCover, setPickerCover] = useState(null); // {kind, type} | null
  const [editingSlug, setEditingSlug] = useState(null);
  const [coverageView, setCoverageView] = useState("defense");
  const panelRef = useRef(null);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  // 공유 링크(#/team?share=...) 수신 → 팀 적용
  useEffect(() => {
    const code = searchParams.get("share");
    if (!code) return;
    setSearchParams({}, { replace: true }); // 적용 후 URL 정리 (중복 적용 방지)

    const shared = decodeTeam(code);
    if (!shared) {
      toast("공유 링크가 올바르지 않아요.", { tone: "error" });
      return;
    }
    const cur = useTeamStore.getState().slugs;
    if (
      cur.length > 0 &&
      !confirm(`공유된 팀(${shared.slugs.length}마리)으로 현재 팀을 교체할까요?`)
    )
      return;
    setTeam(shared);
    toast("공유된 팀을 불러왔어요!", { tone: "success" });
  }, [searchParams, setSearchParams, setTeam]);

  const team = slugs.map(getPokemonBySlug).filter(Boolean);
  const blockedDex = new Set(team.map((p) => p.dexNum));
  const slots = [...team, ...Array(6 - team.length).fill(null)];
  const usedItems = new Set(Object.values(items).filter(Boolean));
  const editingPokemon = editingSlug ? getPokemonBySlug(editingSlug) : null;

  const openEdit = (slug) => {
    setPicking(false);
    setEditingSlug(slug);
  };
  const openPicker = (cover = null) => {
    setEditingSlug(null);
    setPickerCover(cover);
    setPicking(true);
  };
  // 커버리지 분석(페이지 하단)에서 보강 클릭 시 픽커로 스크롤
  const openCoverPicker = (kind, type) => {
    if (team.length >= 6) {
      toast(ADD_FAIL_MSG.full, { tone: "error" });
      return;
    }
    openPicker({ kind, type });
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const handlePick = (slug) => {
    const r = add(slug);
    if (!r.ok) {
      toast(ADD_FAIL_MSG[r.reason] ?? "추가할 수 없어요", { tone: "error" });
      return;
    }
    if (slugs.length + 1 >= 6) setPicking(false);
  };
  const handleRemove = (slug) => {
    if (editingSlug === slug) setEditingSlug(null);
    remove(slug);
  };
  const handleSetItem = (itemSlug) => {
    const r = setItem(editingSlug, itemSlug);
    if (!r.ok) {
      toast("이미 다른 멤버가 지닌 도구예요 (도구 클로즈)", { tone: "error" });
    }
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
              toast("팀을 비웠어요");
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
            onAdd={() => openPicker()}
            onEdit={openEdit}
          />
        ))}
      </div>

      <p className="text-center text-xs text-ink-400 dark:text-ink-500">
        {team.length}/6 편성됨
      </p>

      {/* 편집 패널 / 피커 / 추가 버튼 (하나만) */}
      <div ref={panelRef} className="scroll-mt-20">
        {editingPokemon ? (
          <MemberEditor
            pokemon={editingPokemon}
            item={getItem(items[editingSlug])}
            moves={moves[editingSlug] ?? []}
            usedItems={usedItems}
            onSetItem={handleSetItem}
            onToggleMove={(moveSlug) => toggleMove(editingSlug, moveSlug)}
            onClose={() => setEditingSlug(null)}
          />
        ) : picking ? (
          <PokemonPicker
            key={
              pickerCover ? `${pickerCover.kind}-${pickerCover.type}` : "plain"
            }
            blockedDex={blockedDex}
            teamSlugs={slugs}
            coverFilter={pickerCover}
            onPick={handlePick}
            onClose={() => setPicking(false)}
          />
        ) : (
          team.length < 6 && (
            <button
              onClick={() => openPicker()}
              className="w-full rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              포켓몬 추가
            </button>
          )
        )}
      </div>

      {team.length > 0 && (
        <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold tracking-tight">커버리지 분석</h2>
            <SegmentedToggle
              value={coverageView}
              onChange={setCoverageView}
              options={[
                { value: "defense", label: "방어" },
                { value: "offense", label: "공격" },
              ]}
            />
          </div>
          {coverageView === "defense" ? (
            <CoverageAnalysis
              team={team}
              onFindCover={(type) => openCoverPicker("resist", type)}
            />
          ) : (
            <OffenseAnalysis
              team={team}
              movesMap={moves}
              onFindAttacker={(type) => openCoverPicker("hit", type)}
            />
          )}
        </section>
      )}

      {team.length > 0 && (
        <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
          <TeamExport team={{ slugs, items, moves }} />
        </section>
      )}

      <section className="border-t border-ink-200 pt-5 dark:border-ink-800">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="text-brand-500" size={18} strokeWidth={2.3} />
          <h2 className="text-lg font-bold tracking-tight">저장된 팀</h2>
        </div>
        <PresetManager current={{ slugs, items, moves }} />
      </section>
    </div>
  );
}
