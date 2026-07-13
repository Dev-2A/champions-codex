import { Package } from "lucide-react";
import { assetUrl } from "../../lib/assets";

export default function ItemCard({ item }) {
  const { name, desc, sprite } = item;
  return (
    <div className="flex gap-3 rounded-2xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-100 dark:bg-ink-800">
        {sprite ? (
          <img
            src={assetUrl(sprite)}
            alt={name.ko}
            loading="lazy"
            className="size-9 object-contain"
          />
        ) : (
          <Package size={20} className="text-ink-400" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-800 dark:text-ink-100">
          {name.ko}
        </p>
        {desc && (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}
