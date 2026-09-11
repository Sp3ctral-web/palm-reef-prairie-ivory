import { useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Homework } from "@/lib/api";
import { addDaysISO, todayISO } from "@/lib/dates";
import { useClassStore } from "@/lib/store";

function dueTomorrowUndone(
  items: Homework[],
  today: string,
  done: Record<string, true>,
) {
  const tomorrow = addDaysISO(today, 1);
  return items.filter((item) => item.dueOn === tomorrow && !done[String(item.id)]);
}

export function useDeadlineNotifications(items: Homework[] | undefined) {
  const notifyEnabled = useClassStore((s) => s.notifyEnabled);
  const done = useClassStore((s) => s.done);

  useEffect(() => {
    if (!notifyEnabled || !items || typeof window === "undefined") return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const today = todayISO();
    const key = `zadano-notified-${today}`;
    if (localStorage.getItem(key)) return;

    const due = dueTomorrowUndone(items, today, done);
    if (due.length === 0) return;

    const body =
      due.length === 1
        ? `Завтра сдать: ${due[0].subject} — ${due[0].task}`
        : `Завтра сдать ${due.length} ${due.length < 5 ? "задания" : "заданий"}`;

    try {
      new Notification("Задано", { body, lang: "ru" });
      localStorage.setItem(key, "1");
    } catch {
      /* blocked in iframe / preview */
    }
  }, [items, notifyEnabled, done]);
}

export function ReminderBanner({ items }: { items: Homework[] }) {
  const done = useClassStore((s) => s.done);
  const notifyEnabled = useClassStore((s) => s.notifyEnabled);
  const setNotifyEnabled = useClassStore((s) => s.setNotifyEnabled);
  const today = todayISO();
  const due = dueTomorrowUndone(items, today, done);

  async function enable() {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifyEnabled(permission === "granted");
  }

  if (due.length === 0 && notifyEnabled) return null;

  if (due.length === 0) {
    if (notifyEnabled || typeof Notification === "undefined") return null;
    return (
      <div className="shadow-card flex items-center justify-between gap-3 rounded-lg bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Можно включить напоминание за день до сдачи.
        </p>
        <Button variant="outline" size="sm" onClick={() => void enable()}>
          <Bell className="size-3.5" />
          Вкл
        </Button>
      </div>
    );
  }

  return (
    <div className="shadow-card flex flex-col gap-2 rounded-lg bg-card px-4 py-3">
      <p className="text-sm font-medium text-tomorrow">Завтра сдать</p>
      <ul className="space-y-1 text-sm text-foreground">
        {due.map((item) => (
          <li key={item.id} className="truncate">
            <span className="font-medium">{item.subject}</span>
            <span className="text-muted-foreground"> — {item.task}</span>
          </li>
        ))}
      </ul>
      {!notifyEnabled && typeof Notification !== "undefined" ? (
        <button
          type="button"
          onClick={() => void enable()}
          className="self-start text-xs font-medium text-primary"
        >
          Присылать такое напоминание
        </button>
      ) : null}
    </div>
  );
}
