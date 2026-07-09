import { Link } from "react-router-dom";
import { HelpCircle, BookMarked } from "lucide-react";
import { faqs } from "../data";
import FaqAccordion from "../components/faq/FaqAccordion";

export default function FaqPage() {
  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center gap-2">
          <HelpCircle className="text-brand-500" size={22} strokeWidth={2.3} />
          <h1 className="text-xl font-bold tracking-tight">자주 묻는 질문</h1>
        </div>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
          챔피언스를 처음 접한 사람들이 자주 묻는 것들을 모았어요.
        </p>
      </header>

      <FaqAccordion faqs={faqs} />

      <Link
        to="/guide"
        className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white p-3 transition-colors hover:border-brand-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-800"
      >
        <BookMarked size={18} className="text-brand-500" />
        <span className="text-sm font-semibold">
          용어가 헷갈리면? 뉴비 가이드의 용어집 보기
        </span>
      </Link>
    </div>
  );
}
