import { CalendarClock, ShieldCheck, Layers, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { regulation, seasons, pokemonList } from "../data";
import Countdown from "../components/season/Countdown";

const fmt = (d) => format(new Date(d), "yyyy년 M월 d일", { locale: ko });

function ruleChips(reg) {
  const r = reg.rules || {};
  const chips = [];
  if (r.format === "doubles") chips.push("더블 배틀 (2v2)");
  chips.push(`${reg.count ?? pokemonList.length}종 사용 가능`);
  if (r.teamSize && r.bringSize)
    chips.push(`${r.teamSize}마리 등록·${r.bringSize}선출`);
  if (r.levelCap) chips.push(`Lv.${r.levelCap} 고정`);
  if (r.megaPerBattle) chips.push(`메가 ${r.megaPerBattle}회/배틀`);
  if (r.speciesClause) chips.push("종족 클로즈");
  if (r.itemClause) chips.push("도구 클로즈");
  return chips;
}

export default function SeasonPage() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const current =
    seasons.find(
      (s) => now >= Date.parse(s.startsAt) && now < Date.parse(s.endsAt),
    ) ?? seasons[seasons.length - 1];
  const regEndMs = Date.parse(`${regulation.endDate}T00:00:00Z`);
  const chips = ruleChips(regulation);

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center gap-2">
          <CalendarClock
            className="text-brand-500"
            size={22}
            strokeWidth={2.3}
          />
          <h1 className="text-xl font-bold tracking-tight">
            시즌 · 레귤레이션
          </h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          현재 진행 중인 랭크 시즌과 레귤레이션 정보예요.
        </p>
      </header>

      {/* 현재 시즌 */}
      {current && (
        <section className="rounded-2xl border border-brand-200 bg-linear-to-br from-brand-50 to-white p-5 dark:border-brand-900 dark:from-ink-900 dark:to-ink-950">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                현재 시즌
              </p>
              <h2 className="text-lg font-extrabold tracking-tight">
                {current.name}
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                {fmt(current.startsAt)} ~ {fmt(current.endsAt)}
              </p>
            </div>
            <Layers className="text-brand-300 dark:text-brand-700" size={26} />
          </div>
          <Countdown
            target={Date.parse(current.endsAt)}
            label="시즌 종료까지"
          />
          <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
            시즌이 끝나면 랭크가 초기화돼요(레귤레이션은 유지). 종료 시점에
            도달한 랭크로 보상을 받아요.
          </p>
        </section>
      )}

      {/* 현재 레귤레이션 */}
      <section className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              현재 레귤레이션
            </p>
            <h2 className="text-lg font-extrabold tracking-tight">
              {regulation.name}
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              {fmt(`${regulation.startDate}T00:00:00Z`)} ~{" "}
              {fmt(`${regulation.endDate}T00:00:00Z`)}
            </p>
          </div>
          <ShieldCheck className="text-brand-400" size={26} />
        </div>

        <Countdown target={regEndMs} label="레귤레이션 종료까지" />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              {c}
            </span>
          ))}
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-300">
            테라스탈·다이맥스 미지원
          </span>
        </div>

        {regulation.notes && (
          <p className="mt-3 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
            {regulation.notes}
          </p>
        )}
      </section>

      {/* 시즌 vs 레귤레이션 설명 */}
      <section className="rounded-2xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-900/50">
        <div className="mb-2 flex items-center gap-1.5">
          <Info size={15} className="text-brand-500" />
          <h3 className="text-sm font-bold text-ink-700 dark:text-ink-200">
            시즌 vs 레귤레이션?
          </h3>
        </div>
        <ul className="space-y-1.5 text-sm text-ink-600 dark:text-ink-300">
          <li>
            <b className="text-ink-800 dark:text-ink-100">시즌</b> — 랭크
            주기(보통 몇 주). 끝나면 랭크가 초기화돼요. 한 레귤레이션 안에 여러
            시즌이 들어가요(M-3, M-4 …).
          </li>
          <li>
            <b className="text-ink-800 dark:text-ink-100">레귤레이션</b> — 사용
            가능한 포켓몬·도구·기술을 정하는 규정(보통 2~3개월). 바뀌면 쓸 수
            있는 포켓몬이 달라져요.
          </li>
        </ul>
      </section>
    </div>
  );
}
