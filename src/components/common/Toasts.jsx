import { Info, CircleAlert, CircleCheck } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

const TONES = {
  info: {
    icon: Info,
    cls: "border-ink-200 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100",
    iconCls: "text-brand-500",
  },
  success: {
    icon: CircleCheck,
    cls: "border-emerald-200 bg-white text-ink-700 dark:border-emerald-900 dark:bg-ink-800 dark:text-ink-100",
    iconCls: "text-emerald-500",
  },
  error: {
    icon: CircleAlert,
    cls: "border-red-200 bg-white text-ink-700 dark:border-red-900 dark:bg-ink-800 dark:text-ink-100",
    iconCls: "text-red-500",
  },
};

export default function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-16 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6"
    >
      {toasts.map(({ id, message, tone }) => {
        const t = TONES[tone] ?? TONES.info;
        const Icon = t.icon;
        return (
          <div
            key={id}
            className={`flex max-w-sm items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-lg ${t.cls}`}
          >
            <Icon size={16} className={`shrink-0 ${t.iconCls}`} />
            {message}
          </div>
        );
      })}
    </div>
  );
}
