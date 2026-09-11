export type Urgency = "overdue" | "today" | "tomorrow" | "later" | "past";

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** JS getDay(): 0 Sun … 6 Sat. School week is 1 Mon … 6 Sat. */
export function schoolWeekday(iso: string): number | null {
  const day = parseISODate(iso).getDay();
  return day === 0 ? null : day;
}

export function weekdayName(weekday: number, width: "short" | "long" = "short"): string {
  const short = ["", "пн", "вт", "ср", "чт", "пт", "сб"];
  const long = ["", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  return (width === "long" ? long : short)[weekday] ?? "";
}

export const WEEKDAY_HEADERS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"] as const;

export function mondayOfWeek(iso: string): string {
  const date = parseISODate(iso);
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + offset);
  return toISODate(date);
}

/** Current week (Mon–Sun) plus the next week — 14 days. */
export function twoWeekDates(today: string): string[] {
  const start = mondayOfWeek(today);
  return Array.from({ length: 14 }, (_, i) => addDaysISO(start, i));
}

export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDayMonth(iso: string): string {
  const date = parseISODate(iso);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (date.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return date.toLocaleDateString("ru-RU", opts);
}

export function urgencyOf(dueOn: string, today: string): Urgency {
  if (dueOn === today) return "today";
  if (dueOn === addDaysISO(today, 1)) return "tomorrow";
  if (dueOn < today) {
    const age = (parseISODate(today).getTime() - parseISODate(dueOn).getTime()) / 86400000;
    return age > 7 ? "past" : "overdue";
  }
  return "later";
}

export const URGENCY_ORDER: Record<Urgency, number> = {
  overdue: 0,
  today: 1,
  tomorrow: 2,
  later: 3,
  past: 4,
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  overdue: "просрочено",
  today: "сегодня",
  tomorrow: "завтра",
  later: "позже",
  past: "было",
};

export function nextSchoolDays(today: string, count: number): string[] {
  const days: string[] = [];
  let cursor = today;
  while (days.length < count) {
    days.push(cursor);
    cursor = addDaysISO(cursor, 1);
  }
  return days;
}
