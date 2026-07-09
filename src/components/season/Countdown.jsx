import { useEffect, useState } from "react";

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = target - now;
  return {
    done: ms <= 0,
    days: Math.max(0, Math.floor(ms / 86400000)),
    hours: Math.max(0, Math.floor((ms % 86400000) / 3600000)),
    minutes: Math.max(0, Math.floor((ms % 3600000) / 60000)),
    seconds: Math.max(0, Math.floor((ms % 60000) / 1000)),
  };
}

function Cell({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-extrabold tabular-nums text-brand-600 dark:text-brand-300">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-ink-400 dark:text-ink-500">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ target, label = "종료까지" }) {
  const { done, days, hours, minutes, seconds } = useCountdown(target);

  if (done) {
    return (
      <p className="text-sm font-semibold text-ink-400 dark:text-ink-500">
        종료됨 (정보 갱신 필요)
      </p>
    );
  }

  return (
    <div>
      <p className="mb-1.5 text-xs text-ink-400 dark:text-ink-500">{label}</p>
      <div className="flex items-center gap-2.5">
        <Cell value={days} label="일" />
        <span className="pb-3 text-lg font-bold text-ink-300 dark:text-ink-700">
          :
        </span>
        <Cell value={hours} label="시" />
        <span className="pb-3 text-lg font-bold text-ink-300 dark:text-ink-700">
          :
        </span>
        <Cell value={minutes} label="분" />
        <span className="pb-3 text-lg font-bold text-ink-300 dark:text-ink-700">
          :
        </span>
        <Cell value={seconds} label="초" />
      </div>
    </div>
  );
}
