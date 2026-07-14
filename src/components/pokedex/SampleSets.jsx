import { Sparkles, Package, UserPlus } from "lucide-react";
import { getSamples, getItem } from "../../data";
import { useTeamStore } from "../../store/useTeamStore";
import { toast } from "../../store/useToastStore";
import { useMoveDb } from "../../hooks/useMoveDb";
import { assetUrl } from "../../lib/assets";
import { STAT_KEYS, STAT_SHORT } from "../../lib/statCalc";
import TypeBadge from "../common/TypeBadge";

const FAIL_MSG = {
  full: "팀이 가득 찼어요 (최대 6마리)",
  dup: "이미 팀에 있는 포켓몬이에요",
  species: "같은 종족이 이미 팀에 있어요 (종족 클로즈)",
  invalid: "추가할 수 없는 포켓몬이에요",
};

export default function SampleSets({ slug }) {
  const samples = getSamples(slug);
  const moveDb = useMoveDb();
  const applySample = useTeamStore((s) => s.applySample);

  if (samples.length === 0) return null;

  const handleApply = async (sample) => {
    const r = await applySample(sample);
    if (!r.ok) {
      toast(FAIL_MSG[r.reason] ?? "적용할 수 없어요", { tone: "error" });
      return;
    }
    let msg = "세트를 팀에 추가했어요! 팀 빌더에서 확인하세요.";
    if (r.itemDropped) msg += " (도구 클로즈로 도구는 비워졌어요)";
    if (r.megaSkipped) msg += " (팀에 이미 메가가 있어 메가는 생략)";
    toast(msg, { tone: "success", duration: 3500 });
  };

  return (
    <div className="space-y-3">
      {samples.map((s) => {
        const item = s.item ? getItem(s.item) : null;
        const sampleMoves = moveDb ? moveDb.resolveMoves(s.moves) : [];
        const ptChips = STAT_KEYS.filter((k) => s.build?.pts?.[k] > 0).map(
          (k) => `${STAT_SHORT[k]}${s.build.pts[k]}`,
        );
        return (
          <div
            key={s.title}
            className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-bold text-ink-800 dark:text-ink-100">
                {s.title}
              </span>
              <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                {s.role}
              </span>
              {s.mega && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  <Sparkles size={9} /> 메가
                </span>
              )}
            </div>

            {/* 도구 · 능력 분배 */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-600 dark:text-ink-300">
              {item ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-1.5 py-0.5 dark:bg-ink-800">
                  {item.sprite ? (
                    <img
                      src={assetUrl(item.sprite)}
                      alt=""
                      className="size-4 object-contain"
                    />
                  ) : (
                    <Package size={12} className="text-ink-400" />
                  )}
                  {item.name.ko}
                </span>
              ) : s.mega ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-1.5 py-0.5 dark:bg-ink-800">
                  <Sparkles size={12} className="text-brand-500" /> 메가스톤
                </span>
              ) : null}
              {ptChips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                >
                  {c}
                </span>
              ))}
              {(s.build?.up || s.build?.down) && (
                <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                  {s.build.up ? `▲${STAT_SHORT[s.build.up]}` : ""}
                  {s.build.down ? ` ▼${STAT_SHORT[s.build.down]}` : ""}
                </span>
              )}
            </div>

            {/* 기술 */}
            <div className="mt-2 flex flex-wrap gap-1">
              {sampleMoves.length > 0
                ? sampleMoves.map((m) => (
                    <span
                      key={m.slug}
                      className="inline-flex items-center gap-1 rounded-lg border border-ink-200 px-1.5 py-0.5 text-[11px] font-semibold text-ink-700 dark:border-ink-800 dark:text-ink-200"
                    >
                      <TypeBadge type={m.type} size="sm" />
                      {m.name.ko}
                    </span>
                  ))
                : moveDb === null && (
                    <span className="text-[11px] text-ink-400">
                      기술 불러오는 중…
                    </span>
                  )}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
              {s.note}
            </p>

            <button
              type="button"
              onClick={() => handleApply(s)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <UserPlus size={15} /> 이 세트로 팀에 추가
            </button>
          </div>
        );
      })}
      <p className="text-[11px] leading-relaxed text-ink-400 dark:text-ink-500">
        포케모음 사용률 통계와 커뮤니티 표준형을 참고한 큐레이션이에요. 그대로
        쓰기보다 팀에 맞게 조정해보세요!
      </p>
    </div>
  );
}
