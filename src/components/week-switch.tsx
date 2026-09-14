import { cn } from "@/lib/utils";

export function WeekSwitch({
  value,
  current,
  onChange,
  onSetCurrent,
}: {
  value: number;
  current: number;
  onChange: (week: 1 | 2) => void;
  onSetCurrent?: (week: 1 | 2) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {([1, 2] as const).map((week) => (
        <button
          key={week}
          type="button"
          onClick={() => onChange(week)}
          className={cn(
            "h-9 shrink-0 rounded-full px-3 text-sm",
            value === week
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground shadow-card",
          )}
        >
          {week} апта
          {current === week ? " · сейчас" : ""}
        </button>
      ))}
      {onSetCurrent && value !== current ? (
        <button
          type="button"
          onClick={() => onSetCurrent(value === 2 ? 2 : 1)}
          className="text-xs font-medium text-primary"
        >
          Это текущая неделя
        </button>
      ) : null}
    </div>
  );
}
