import { useState } from "react";
import { Users, Trash2 } from "lucide-react";
import { getPokemonBySlug } from "../data";
import { useTeamStore } from "../store/useTeamStore";
import TeamSlot from "../components/team/TeamSlot";
import PokemonPicker from "../components/team/PokemonPicker";

export default function TeamBuilderPage() {
  const slugs = useTeamStore((s) => s.slugs);
  const add = useTeamStore((s) => s.add);
  const remove = useTeamStore((s) => s.remove);
  const clear = useTeamStore((s) => s.clear);
  const [picking, setPicking] = useState(false);

  const team = slugs.map(getPokemonBySlug);
  const blockedDex = new Set(team.map((p) => p?.dexNum).filter(Boolean));
  const slots = [...team, ...Array(6 - team.length).fill(null)];

  const handlePick = (slug) => {
    add(slug);
    if (slugs.length + 1 >= 6) setPicking(false);
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
            6마리를 편성하세요. 같은 종족(도감번호)은 중복 편성할 수 없어요.
          </p>
        </div>
        {team.length > 0 && (
          <button
            onClick={clear}
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
            onRemove={remove}
            onAdd={() => setPicking(true)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-ink-400 dark:text-ink-500">
        {team.length}/6 편성됨
      </p>

      {picking ? (
        <PokemonPicker
          blockedDex={blockedDex}
          teamSlugs={slugs}
          onPick={handlePick}
          onClose={() => setPicking(false)}
        />
      ) : (
        team.length < 6 && (
          <button
            onClick={() => setPicking(true)}
            className="w-full rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            포켓몬 추가
          </button>
        )
      )}

      {team.length > 0 && (
        <div className="rounded-2xl border border-dashed border-ink-300 p-4 text-center text-xs text-ink-400 dark:border-ink-700 dark:text-ink-500">
          🚧 타입 커버리지 분석(약점/저항 히트맵)은 Step 11에서 추가돼요.
        </div>
      )}
    </div>
  );
}
