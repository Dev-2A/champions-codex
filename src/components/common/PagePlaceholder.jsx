export default function PagePlaceholder({
  icon: Icon,
  title,
  description,
  step,
}) {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-ink-200 bg-white px-6 py-14 text-center dark:border-ink-800 dark:bg-ink-900">
      {Icon && (
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
          <Icon size={26} strokeWidth={2.2} />
        </div>
      )}
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-500 dark:text-ink-400">
        {description}
      </p>
      {step && (
        <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          🚧 Step {step}에서 구현 예정
        </span>
      )}
    </section>
  );
}
