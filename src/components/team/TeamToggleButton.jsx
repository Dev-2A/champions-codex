import { Check, Plus, Ban } from "lucide-react";
import { getPokemonBySlug } from "../../data";
import { useTeamStore } from "../../store/useTeamStore";

export default function TeamToggleButton({ slug }) {
  const slugs = useTeamStore((s) => s.slugs);
  const add = useTeamStore((s) => s.add);
  const remove = useTeamStore((s) => s.remove);

  const inTeam = slugs.includes(slug);
  const p = getPokemonBySlug(slug);
  const team = slugs.map(getPokemonBySlug);
  const speciesConflict = !inTeam && team.some((t) => t?.dexNum === p?.dexNum);
  const full = !inTeam && slugs.length >= 6;
  const disabled = speciesConflict || full;

  const label = inTeam
    ? "팀에서 제거"
    : full
      ? "팀이 가득 참"
      : speciesConflict
        ? "종족 중복"
        : "팀에 추가";

  return (
    <button
      type="button"
      onClick={() => (inTeam ? remove(slug) : add(slug))}
      disabled={disabled}
      className={[
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors",
        inTeam
          ? "bg-ink-200 text-ink-700 hover:bg-ink-300 dark:bg-ink-700 dark:text-ink-100"
          : disabled
            ? "cursor-not-allowed bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500"
            : "bg-brand-500 text-white hover:bg-brand-600",
      ].join(" ")}
    >
      {inTeam ? (
        <Check size={15} />
      ) : disabled ? (
        <Ban size={15} />
      ) : (
        <Plus size={15} />
      )}
      {label}
    </button>
  );
}
