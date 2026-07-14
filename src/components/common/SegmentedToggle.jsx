export default function SegmentedToggle({ options, value, onChange }) {
  return (
    // flex w-fit: 블록 레벨(항상 제 줄 차지, space-y 간격 정상 적용) + 내용 폭.
    // 세로 스택에 직접 놓여도 옆 요소와 붙지 않는다 (inline-flex의 함정 방지)
    <div className="flex w-fit rounded-lg bg-ink-100 p-0.5 dark:bg-ink-800">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
              active
                ? "bg-white text-brand-600 shadow-sm dark:bg-ink-950 dark:text-brand-300"
                : "text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
