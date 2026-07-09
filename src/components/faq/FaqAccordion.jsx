import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-bold text-ink-800 dark:text-ink-100">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-ink-100 px-4 py-3 text-sm leading-relaxed text-ink-600 dark:border-ink-800 dark:text-ink-300">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqAccordion({ faqs }) {
  return (
    <div className="space-y-2">
      {faqs.map((f) => (
        <FaqItem key={f.q} {...f} />
      ))}
    </div>
  );
}
