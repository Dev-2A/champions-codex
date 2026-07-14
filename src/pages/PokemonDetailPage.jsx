import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getPokemonBySlug, pokemonList, getSamples } from "../data";
import TypeBadge from "../components/common/TypeBadge";
import StatBars from "../components/pokedex/StatBars";
import DefensiveProfile from "../components/typechart/DefensiveProfile";
import TypeTraitsPanel from "../components/typechart/TypeTraitsPanel";
import TeamToggleButton from "../components/team/TeamToggleButton";
import SegmentedToggle from "../components/common/SegmentedToggle";
import LearnableMoves from "../components/pokedex/LearnableMoves";
import MegaForms from "../components/pokedex/MegaForms";
import SampleSets from "../components/pokedex/SampleSets";
import { useMoveDb } from "../hooks/useMoveDb";
import { assetUrl } from "../lib/assets";

function Section({ title, children }) {
  return (
    <section>
      {title && (
        <h2 className="mb-2 text-sm font-bold text-ink-600 dark:text-ink-300">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export default function PokemonDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pokemon = getPokemonBySlug(slug);
  const [tab, setTab] = useState("info");
  const moveDb = useMoveDb();

  if (!pokemon) {
    return (
      <div className="space-y-4">
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
        >
          <ArrowLeft size={15} /> 도감으로
        </Link>
        <p className="rounded-xl border border-dashed border-ink-300 p-8 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          알 수 없는 포켓몬이에요.
        </p>
      </div>
    );
  }

  const { id, name, genus, types, stats, total, abilities, sprite, canMega } =
    pokemon;
  const learnset = moveDb ? moveDb.getLearnset(slug) : null;
  const idx = pokemonList.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? pokemonList[idx - 1] : null;
  const next = idx < pokemonList.length - 1 ? pokemonList[idx + 1] : null;

  return (
    <div className="space-y-5">
      {/* 상단 내비 */}
      <div className="flex items-center justify-between">
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
        >
          <ArrowLeft size={15} /> 도감으로
        </Link>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && navigate(`/pokedex/${prev.slug}`)}
            className="grid size-8 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 disabled:opacity-30 dark:text-ink-400 dark:hover:bg-ink-800"
            aria-label="이전 포켓몬"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && navigate(`/pokedex/${next.slug}`)}
            className="grid size-8 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 disabled:opacity-30 dark:text-ink-400 dark:hover:bg-ink-800"
            aria-label="다음 포켓몬"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 헤더 카드 */}
      <section className="flex items-center gap-4 rounded-2xl border border-brand-200 bg-linear-to-br from-brand-50 to-white p-5 dark:border-brand-900 dark:from-ink-900 dark:to-ink-950">
        <img
          src={assetUrl(sprite)}
          alt={name.ko}
          loading="lazy"
          className="size-28 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink-400 dark:text-ink-500">
            #{String(id).padStart(4, "0")}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">{name.ko}</h1>
          <p className="text-sm capitalize text-ink-400 dark:text-ink-500">
            {name.en}
          </p>
          {genus && (
            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
              {genus}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {types.map((t) => (
              <TypeBadge key={t} type={t} size="lg" />
            ))}
            {canMega && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white">
                <Sparkles size={12} /> 메가진화 가능
              </span>
            )}
          </div>
        </div>
      </section>

      <TeamToggleButton slug={slug} />

      {/* 탭 */}
      <SegmentedToggle
        value={tab}
        onChange={setTab}
        options={[
          { value: "info", label: "정보" },
          { value: "moves", label: `기술 ${learnset ? learnset.length : "…"}` },
        ]}
      />

      {tab === "info" ? (
        // 데스크톱(lg~): 왼쪽 = 기본 정보, 오른쪽 = 추천 세트·메가 (모바일은 세로)
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
          <div className="space-y-5">
            <Section title="종족값">
              <div className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
                <StatBars stats={stats} total={total} />
              </div>
            </Section>

            <Section title="특성">
              <div className="flex flex-wrap gap-2">
                {abilities.map((a) => (
                  <span
                    key={a.slug}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-sm dark:border-ink-800 dark:bg-ink-900"
                  >
                    <span className="font-semibold text-ink-700 dark:text-ink-200">
                      {a.ko ?? a.slug}
                    </span>
                    {a.hidden && (
                      <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                        숨겨진 특성
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="받는 대미지 (방어 상성)">
              <DefensiveProfile types={types} />
            </Section>

            <Section title="타입 부가 특성">
              <TypeTraitsPanel types={types} />
            </Section>
          </div>

          <div className="mt-5 space-y-5 lg:mt-0">
            {getSamples(slug).length > 0 && (
              <Section title="추천 세트">
                <SampleSets slug={slug} />
              </Section>
            )}

            {canMega && (
              <Section title="메가진화">
                <MegaForms slug={slug} />
              </Section>
            )}

            <p className="text-xs text-ink-400 dark:text-ink-500">
              실전 사용률·채용 통계가 궁금하다면{" "}
              <a
                href={`https://pokemoem.com/pokedex/${encodeURIComponent(
                  name.en.charAt(0).toUpperCase() + name.en.slice(1),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:underline"
              >
                포케모음에서 보기 ↗
              </a>
            </p>
          </div>
        </div>
      ) : (
        <LearnableMoves pokemonSlug={slug} />
      )}
    </div>
  );
}
