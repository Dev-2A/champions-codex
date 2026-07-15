import { AlertTriangle, ShieldQuestion, Swords } from "lucide-react";
import { TYPES, typeKo } from "../../data";
import { analyzeCoverage } from "../../lib/teamCoverage";
import {
  classifyMultiplier,
  formatMultiplier,
} from "../../lib/typeEffectiveness";
import { typeStyle } from "../../lib/typeColors";
import { assetUrl } from "../../lib/assets";
import TypeBadge from "../common/TypeBadge";

function cellClass(cls) {
  switch (cls) {
    case "weak4":
      return "bg-red-600 text-white";
    case "weak2":
      return "bg-red-400 text-white";
    case "resist2":
      return "bg-blue-400 text-white";
    case "resist4":
      return "bg-blue-600 text-white";
    case "immune":
      return "bg-ink-400 text-white dark:bg-ink-600";
    default:
      return "text-ink-300 dark:text-ink-700";
  }
}

// onFindCover(type): 이 타입을 받아낼 포켓몬 찾기 (팀 빌더의 픽커 연결, 선택)
export default function CoverageAnalysis({ team, onFindCover }) {
  const { profiles, byType, sharedWeak, uncovered } = analyzeCoverage(team);

  return (
    <div className="space-y-4">
      {/* 공통 약점 */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-2 flex items-center gap-1.5">
          <AlertTriangle size={16} className="text-red-500" strokeWidth={2.3} />
          <h3 className="text-sm font-bold text-ink-700 dark:text-ink-200">
            공통 약점
          </h3>
        </div>
        {sharedWeak.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-ink-400">
            2마리 이상이 함께 약한 타입이 없어요. 방어적으로 균형 잡힌 팀이에요.
            👍
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {sharedWeak.map((t) => (
                <span
                  key={t.type}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 dark:bg-red-950/40"
                >
                  <TypeBadge type={t.type} size="sm" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-300">
                    {t.weak}마리
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-2.5 flex items-start gap-1.5 text-xs text-ink-500 dark:text-ink-400">
              <Swords size={13} className="mt-0.5 shrink-0 text-ink-400" />
              더블 배틀에선 스프레드 기술(지진·열풍·바위류 등)이 내 2마리를
              동시에 때려요. 공통 약점은 한 번에 무너질 수 있으니 특히
              조심하세요.
            </p>
          </>
        )}
      </div>

      {/* 무저항 구멍 */}
      {uncovered.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-950 dark:bg-amber-950/20">
          <div className="mb-2 flex items-center gap-1.5">
            <ShieldQuestion
              size={16}
              className="text-amber-500"
              strokeWidth={2.3}
            />
            <h3 className="text-sm font-bold text-ink-700 dark:text-ink-200">
              저항 없는 타입 (구멍)
            </h3>
          </div>
          <p className="mb-2 text-xs text-ink-500 dark:text-ink-400">
            이 타입 공격을 저항·무효화하는 포켓몬이 팀에 하나도 없어요.
            {onFindCover && " 타입을 누르면 받아낼 포켓몬을 찾아드려요."}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {uncovered.map((t) =>
              onFindCover ? (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => onFindCover(t.type)}
                  className="inline-flex items-center gap-1 rounded-full bg-white p-0.5 pr-2 shadow-sm ring-1 ring-ink-200 transition hover:ring-brand-400 dark:bg-ink-800 dark:ring-ink-700"
                  title={`${typeKo(t.type)} 공격을 받아낼 포켓몬 찾기`}
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
        </div>
      )}

      {/* 히트맵 */}
      <div>
        <h3 className="mb-2 text-sm font-bold text-ink-600 dark:text-ink-300">
          팀 방어 히트맵
        </h3>
        <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
          <table
            aria-label="팀 방어 상성 히트맵 (가로: 공격 타입, 세로: 팀원)"
            className="border-separate border-spacing-0 text-center text-[11px]"
          >
            <thead>
              <tr>
                <th className="sticky left-0 z-20 w-11 bg-ink-50 dark:bg-ink-950" />
                {TYPES.map((t) => (
                  <th
                    key={t}
                    style={typeStyle(t)}
                    title={typeKo(t)}
                    className="h-7 w-6.5 min-w-6.5 font-bold"
                  >
                    {typeKo(t)[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map(({ pokemon, profile }) => (
                <tr key={pokemon.slug}>
                  <th className="sticky left-0 z-10 w-11 bg-ink-50 p-0.5 dark:bg-ink-950">
                    <img
                      src={assetUrl(pokemon.sprite)}
                      alt={pokemon.name.ko}
                      title={pokemon.name.ko}
                      className="mx-auto size-9 object-contain"
                    />
                  </th>
                  {TYPES.map((atk) => {
                    const m = profile[atk];
                    return (
                      <td
                        key={atk}
                        title={`${typeKo(atk)} → ${pokemon.name.ko}: ×${formatMultiplier(m)}`}
                        className={`h-6.5 w-6.5 border-b border-r border-ink-100 dark:border-ink-800/60 ${cellClass(
                          classifyMultiplier(m),
                        )}`}
                      >
                        {m === 1 ? "" : formatMultiplier(m)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* 합계: 약점 팀원 수 */}
              <tr>
                <th className="sticky left-0 z-10 bg-ink-100 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                  약점
                </th>
                {byType.map((t) => (
                  <td
                    key={t.type}
                    title={`${typeKo(t.type)}에 약한 팀원 ${t.weak}마리`}
                    className={`h-6 w-6.5 font-bold ${
                      t.weak >= 2
                        ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300"
                        : "text-ink-400 dark:text-ink-600"
                    }`}
                  >
                    {t.weak || ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-ink-400 dark:text-ink-500">
          가로 = 공격 타입 · 각 셀 = 그 포켓몬이 받는 배율 · 맨 아래 = 약점인
          팀원 수
        </p>
      </div>
    </div>
  );
}
