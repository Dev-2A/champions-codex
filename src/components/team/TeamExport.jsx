import { useMemo, useState } from "react";
import { Copy, Check, FileText, Link2 } from "lucide-react";
import { buildTeamSheet } from "../../lib/teamExport";
import { buildShareUrl } from "../../lib/teamShare";
import { toast } from "../../store/useToastStore";
import { useMoveDb } from "../../hooks/useMoveDb";

export default function TeamExport({ team }) {
  const [copied, setCopied] = useState(false);
  const moveDb = useMoveDb();
  const sheet = useMemo(
    () => buildTeamSheet(team, moveDb?.getMove),
    [team, moveDb],
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(team));
      toast("공유 링크를 복사했어요. 붙여넣으면 이 팀이 그대로 열려요.", {
        tone: "success",
      });
    } catch {
      toast("링크 복사에 실패했어요.", { tone: "error" });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sheet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 API 실패 시 폴백: 텍스트 선택 유도
      toast("복사에 실패했어요. 텍스트를 길게 눌러 직접 복사해 주세요.", {
        tone: "error",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-bold text-ink-600 dark:text-ink-300">
          <FileText size={16} className="text-brand-500" strokeWidth={2.3} />팀
          시트
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:text-brand-300"
          >
            <Link2 size={14} /> 링크 복사
          </button>
          <button
            onClick={copy}
            className={[
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              copied
                ? "bg-emerald-500 text-white"
                : "bg-brand-500 text-white hover:bg-brand-600",
            ].join(" ")}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-ink-200 bg-ink-50 p-3 text-xs leading-relaxed text-ink-700 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-300">
        {sheet}
      </pre>
    </div>
  );
}
