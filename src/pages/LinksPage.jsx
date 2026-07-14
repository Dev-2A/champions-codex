import { Compass, ExternalLink, Clapperboard } from "lucide-react";
import linksData from "../data/champions/links.json";

export default function LinksPage() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <Compass className="text-brand-500" size={22} strokeWidth={2.3} />
          <h1 className="text-xl font-bold tracking-tight">링크 모음</h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          챔피언스를 즐기는 데 도움이 되는 검증된 사이트들이에요.
        </p>
      </header>

      {linksData.categories.map((cat) => {
        const links = linksData.links.filter((l) => l.category === cat.id);
        if (links.length === 0) return null;
        return (
          <section key={cat.id}>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-500">
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 rounded-2xl border border-ink-200 bg-white p-3.5 transition-colors hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800 dark:hover:bg-ink-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-sm font-bold text-ink-800 group-hover:text-brand-600 dark:text-ink-100 dark:group-hover:text-brand-300">
                      {l.name}
                      <ExternalLink
                        size={12}
                        className="shrink-0 text-ink-300 dark:text-ink-600"
                      />
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                      {l.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      {/* 유튜버·크리에이터: 검증된 추천이 쌓이면 채워질 자리 */}
      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500">
          <Clapperboard size={13} /> 유튜버 · 크리에이터
        </h2>
        <p className="rounded-xl border border-dashed border-ink-300 p-5 text-center text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          아직 준비 중이에요. 뉴비에게 도움이 된 챔피언스 채널이 있다면{" "}
          <a
            href="https://github.com/Dev-2A/champions-codex/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:underline"
          >
            추천해주세요
          </a>
          — 확인 후 추가할게요!
        </p>
      </section>

      <p className="text-[11px] text-ink-400 dark:text-ink-500">
        {linksData.updatedAt} 기준 전 링크 접속 확인. 깨진 링크를 발견하면
        제보해주세요.
      </p>
    </div>
  );
}
