import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, ImageDown } from "lucide-react";
import { pokemonList, pokedexGeneratedAt, regulationCode } from "../data";
import { usePokedexStore } from "../store/usePokedexStore";
import { filterAndSortPokemon } from "../lib/pokedexFilter";
import { renderDexImage, downloadBlob } from "../lib/dexImage";
import { toast } from "../store/useToastStore";
import PokedexFilters from "../components/pokedex/PokedexFilters";
import PokemonCard from "../components/pokedex/PokemonCard";

const SORT_LABEL = {
  dex: "도감번호순",
  name: "이름순",
  total: "종족값순",
  speed: "스피드순",
};

// 필터 상태 → URL 파라미터 문자열 (기본값은 생략해서 URL 깨끗하게)
function toParamString({ query, types, megaOnly, sort }) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (types.length) params.set("types", types.join(","));
  if (megaOnly) params.set("mega", "1");
  if (sort !== "dex") params.set("sort", sort);
  return params.toString();
}

export default function PokedexPage() {
  const { query, types, megaOnly, sort } = usePokedexStore();
  const hydrate = usePokedexStore((s) => s.hydrate);
  const [searchParams, setSearchParams] = useSearchParams();

  const stateStr = toParamString({ query, types, megaOnly, sort });
  const urlStr = searchParams.toString();
  const prevUrl = useRef(urlStr);
  const prevState = useRef(stateStr);

  // URL ↔ 필터 양방향 동기화 — "방금 바뀐 쪽"이 우선이라 핑퐁이 없다.
  // · URL이 바뀜(공유 링크 진입·뒤로가기) → 필터 복원
  // · 필터가 바뀜(사용자 조작) → URL 갱신 (replace라 히스토리 안 쌓임)
  // · 첫 마운트 → URL에 파라미터 있으면 복원, 없으면 스토어 유지(상세 왕복 대응)
  useEffect(() => {
    const urlChanged = urlStr !== prevUrl.current;
    const stateChanged = stateStr !== prevState.current;
    prevUrl.current = urlStr;
    prevState.current = stateStr;
    if (urlStr === stateStr) return;

    const restoreFromUrl = () =>
      hydrate({
        query: searchParams.get("q") ?? "",
        types: (searchParams.get("types") ?? "").split(",").filter(Boolean),
        megaOnly: searchParams.get("mega") === "1",
        sort: searchParams.get("sort") ?? "dex",
      });

    if (urlChanged && urlStr) restoreFromUrl();
    else if (stateChanged || !urlStr)
      setSearchParams(stateStr, { replace: true });
    else restoreFromUrl(); // 첫 마운트 + URL 파라미터 존재
  }, [urlStr, stateStr, searchParams, hydrate, setSearchParams]);

  const [saving, setSaving] = useState(false);
  const filtered = filterAndSortPokemon({ query, types, megaOnly, sort });

  const handleSaveImage = async () => {
    if (saving || filtered.length === 0) return;
    if (filtered.length > 120 && !confirm(`${filtered.length}종을 이미지로 저장할까요? 잠시 걸릴 수 있어요.`))
      return;
    setSaving(true);
    try {
      const blob = await renderDexImage(filtered, {
        title: `포켓몬 챔피언스 도감 (${regulationCode})`,
        subtitle: `${filtered.length}종 · ${SORT_LABEL[sort] ?? ""} · ${pokedexGeneratedAt?.slice(0, 10)} 기준`,
      });
      if (!blob) throw new Error("이미지 생성 실패");
      downloadBlob(blob, `champions-dex-${filtered.length}.png`);
      toast("도감 이미지를 저장했어요!", { tone: "success" });
    } catch {
      toast("이미지 저장에 실패했어요.", { tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="text-brand-500" size={22} strokeWidth={2.3} />
            <h1 className="text-xl font-bold tracking-tight">포켓몬 도감</h1>
          </div>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
            현재 레귤레이션({regulationCode}) 사용 가능 포켓몬{" "}
            {pokemonList.length}종. 이름·타입으로 찾아보세요.
            <span className="ml-1 text-xs text-ink-400 dark:text-ink-500">
              (데이터 기준 {pokedexGeneratedAt?.slice(0, 10)})
            </span>
          </p>
        </div>
        <button
          onClick={handleSaveImage}
          disabled={saving || filtered.length === 0}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-600 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:text-brand-300"
        >
          <ImageDown size={15} /> {saving ? "생성 중…" : "이미지 저장"}
        </button>
      </header>

      <PokedexFilters total={pokemonList.length} shown={filtered.length} />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 p-8 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          조건에 맞는 포켓몬이 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((p) => (
            <PokemonCard key={p.slug} pokemon={p} sort={sort} />
          ))}
        </div>
      )}
    </div>
  );
}
