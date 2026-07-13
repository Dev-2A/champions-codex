import { Crosshair, Info } from "lucide-react";
import { TYPES, typeKo } from "../../data";
import { analyzeOffense } from "../../lib/teamOffense";
import { getMultiplier, formatMultiplier } from "../../lib/typeEffectiveness";
import { typeStyle } from "../../lib/typeColors";
import { useMoveDb } from "../../hooks/useMoveDb";
import { assetUrl } from "../../lib/assets";
import TypeBadge from "../common/TypeBadge";

function cellClass(m) {
  if (m >= 2) return "bg-emerald-500 text-white";
  if (m === 0) return "bg-ink-300 text-white dark:bg-ink-700";
  return "text-ink-300 dark:text-ink-700"; // 0.5(저항)·1(등배)
}

// onFindAttacker(type): 이 타입을 찌를 포켓몬 찾기 (팀 빌더의 픽커 연결, 선택)
export default function OffenseAnalysis({ team, movesMap, onFindAttacker }) {
  const moveDb = useMoveDb();
  const { members, byType, holes, anyApprox } = analyzeOffense(
    team,
    movesMap,
    moveDb?.resolveMoves,
  );

  return (
    <div className="space-y-4">
      {/* 공격 구멍 */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-2 flex items-center gap-1.5">
          <Crosshair size={16} className="text-brand-500" strokeWidth={2.3} />
          <h3 className="text-sm font-bold text-ink-700 dark:text-ink-200">
            공격 구멍
          </h3>
        </div>
        {holes.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-ink-400">
            모든 타입을 약점으로 찌를 수단이 있어요. 공격 범위가 넓은 팀이에요.
            👍
          </p>
        ) : (
          <>
            <p className="mb-2 text-xs text-ink-500 dark:text-ink-400">
              이 타입의 포켓몬을 약점으로 찌를 기술이 팀에 없어요. 상대하기
              까다로울 수 있어요.
              {onFindAttacker && " 타입을 누르면 찌를 포켓몬을 찾아드려요."}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {holes.map((t) =>
                onFindAttacker ? (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => onFindAttacker(t.type)}
                    className="inline-flex items-center gap-1 rounded-full bg-white p-0.5 pr-2 shadow-sm ring-1 ring-ink-200 transition hover:ring-brand-400 dark:bg-ink-800 dark:ring-ink-700"
                    title={`${typeKo(t.type)}을(를) 찌를 포켓몬 찾기`}
                  >
                    <TypeBadge type={t.type} size="md" />
                    <span className="text-[11px] font-semibold text-brand-500">
                      보강 +
                    </span>
                  </button>
                ) : (
                  <TypeBadge key={t.type} type={t.type} size="md" />
                ),
              )}
            </div>
          </>
        )}
      </div>

      {anyApprox && (
        <p className="flex items-start gap-1.5 rounded-xl border border-ink-200 bg-ink-50 p-2.5 text-xs text-ink-500 dark:border-ink-800 dark:bg-ink-900/50 dark:text-ink-400">
          <Info size={13} className="mt-0.5 shrink-0 text-ink-400" />
          공격기를 아직 안 고른 포켓몬은 자기 타입(STAB) 기준으로 근사했어요.
          기술을 지정하면 더 정확해져요.
        </p>
      )}

      {/* 히트맵 */}
      <div>
        <h3 className="mb-2 text-sm font-bold text-ink-600 dark:text-ink-300">
          팀 공격 히트맵
        </h3>
        <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
          <table className="border-separate border-spacing-0 text-center text-[11px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 w-11 bg-ink-50 dark:bg-ink-950" />
                {TYPES.map((t) => (
                  <th
                    key={t}
                    style={typeStyle(t)}
                    title={typeKo(t)}
                    className="h-7 w-[26px] min-w-[26px] font-bold"
                  >
                    {typeKo(t)[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(({ pokemon, types, approx }) => (
                <tr key={pokemon.slug}>
                  <th className="sticky left-0 z-10 w-11 bg-ink-50 p-0.5 dark:bg-ink-950">
                    <span className="relative block">
                      <img
                        src={assetUrl(pokemon.sprite)}
                        alt={pokemon.name.ko}
                        title={pokemon.name.ko + (approx ? " (STAB 근사)" : "")}
                        className="mx-auto size-9 object-contain"
                      />
                      {approx && (
                        <span className="absolute right-0 top-0 text-[8px] font-bold text-ink-400">
                          ~
                        </span>
                      )}
                    </span>
                  </th>
                  {TYPES.map((def) => {
                    const best = Math.max(
                      0,
                      ...types.map((t) => getMultiplier(t, [def])),
                    );
                    return (
                      <td
                        key={def}
                        className={`h-[26px] w-[26px] border-b border-r border-ink-100 dark:border-ink-800/60 ${cellClass(best)}`}
                      >
                        {best >= 2 ? formatMultiplier(best) : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* 합계: SE로 때리는 멤버 수 */}
              <tr>
                <th className="sticky left-0 z-10 bg-ink-100 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                  타격
                </th>
                {byType.map((t) => (
                  <td
                    key={t.type}
                    className={`h-6 w-[26px] font-bold ${
                      t.covered === 0
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
                        : "text-emerald-500"
                    }`}
                  >
                    {t.covered || "0"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-ink-400 dark:text-ink-500">
          가로 = 방어 타입 · 셀 = 그 타입을 약점으로 찌르는 최대 배율 · 맨 아래
          = SE로 때리는 팀원 수(0은 구멍) · ~ 는 STAB 근사
        </p>
      </div>
    </div>
  );
}
