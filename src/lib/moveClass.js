import { Swords, Sparkles, CircleDot } from "lucide-react";

export const damageClassMeta = {
  physical: {
    label: "물리",
    icon: Swords,
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  special: {
    label: "특수",
    icon: Sparkles,
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  status: {
    label: "변화",
    icon: CircleDot,
    chip: "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
  },
};
