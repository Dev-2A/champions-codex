import { useState } from "react";
import { ClipboardPaste, Download, X } from "lucide-react";
import { parseTeamText } from "../../lib/teamImport";
import { useTeamStore } from "../../store/useTeamStore";
import { toast } from "../../store/useToastStore";

const PLACEHOLDER = `Showdown 형식이나 팀 시트를 붙여넣으세요. 예:

Garchomp @ Focus Sash
EVs: 252 Atk / 252 Spe
Jolly Nature
- Earthquake
- Scale Shot
- Swords Dance
- Protect`;

export default function TeamImport() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const setTeam = useTeamStore((s) => s.setTeam);

  const handleImport = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const result = await parseTeamText(text);
      if (!result) {
        toast(
          "팀을 인식하지 못했어요. Showdown 형식이나 팀 시트를 붙여넣어 주세요.",
          { tone: "error" },
        );
        return;
      }
      const cur = useTeamStore.getState().slugs;
      if (
        cur.length > 0 &&
        !confirm(
          `현재 팀을 가져온 팀(${result.team.slugs.length}마리)으로 교체할까요?`,
        )
      )
        return;
      await setTeam(result.team);
      toast(`${result.team.slugs.length}마리를 가져왔어요!`, {
        tone: "success",
        duration: 3000,
      });
      result.warnings.slice(0, 3).forEach((w, i) =>
        setTimeout(
          () => toast(w, { tone: "info", duration: 4000 }),
          400 * (i + 1),
        ),
      );
      setText("");
      setOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:text-brand-300"
      >
        <ClipboardPaste size={15} /> 텍스트로 팀 가져오기
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-bold text-ink-600 dark:text-ink-300">
          <ClipboardPaste size={16} className="text-brand-500" /> 팀 가져오기
        </div>
        <button
          onClick={() => setOpen(false)}
          className="grid size-7 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
          aria-label="닫기"
        >
          <X size={15} />
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={8}
        className="w-full resize-y rounded-xl border border-ink-200 bg-ink-50 p-3 font-mono text-xs leading-relaxed outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-950"
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-ink-400 dark:text-ink-500">
          Pokémon Showdown · 우리 팀 시트 형식 지원. EV는 능력 포인트로
          근사돼요.
        </p>
        <button
          onClick={handleImport}
          disabled={!text.trim() || busy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} /> {busy ? "가져오는 중…" : "가져오기"}
        </button>
      </div>
    </div>
  );
}
