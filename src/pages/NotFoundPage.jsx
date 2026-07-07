import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-ink-200 bg-white px-6 py-14 text-center dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
        <Compass size={26} strokeWidth={2.2} />
      </div>
      <h2 className="text-xl font-bold">길을 잃었어요</h2>
      <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
        존재하지 않는 페이지입니다.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        홈으로
      </Link>
    </section>
  );
}
