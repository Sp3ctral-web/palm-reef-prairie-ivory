import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ExtraHomework, LessonList } from "@/components/lesson-list";
import { ReminderBanner, useDeadlineNotifications } from "@/components/reminders";
import { Skeleton } from "@/components/ui/skeleton";
import { addDaysISO, schoolWeekday, todayISO, weekdayName } from "@/lib/dates";
import { slotsByDay, useHomework, useTimetable } from "@/lib/queries";
import { useClassStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <AppShell>
      <HomeBody />
    </AppShell>
  );
}

function HomeBody() {
  const { data: homework, isPending: hwPending } = useHomework();
  const { data: timetable, isPending: ttPending } = useTimetable();
  const done = useClassStore((s) => s.done);
  const today = todayISO();
  const tomorrow = addDaysISO(today, 1);
  const todayWeekday = schoolWeekday(today);
  const tomorrowWeekday = schoolWeekday(tomorrow);

  useDeadlineNotifications(homework);

  if (hwPending || ttPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>
    );
  }

  const todaySlots = todayWeekday ? slotsByDay(timetable, todayWeekday) : [];
  const tomorrowSlots = tomorrowWeekday ? slotsByDay(timetable, tomorrowWeekday) : [];
  const todaySubjects = new Set(todaySlots.map((s) => s.subject));
  const tomorrowSubjects = new Set(tomorrowSlots.map((s) => s.subject));

  const extra = (homework ?? []).filter((item) => {
    if (done[String(item.id)] && item.dueOn < today) return false;
    if (item.dueOn < today) return !todaySubjects.has(item.subject);
    if (item.dueOn === today && !todaySubjects.has(item.subject)) return true;
    return false;
  });

  const todayTitle = todayWeekday
    ? `Сегодня, ${weekdayName(todayWeekday)}`
    : "Сегодня";
  const tomorrowTitle = tomorrowWeekday
    ? `Завтра, ${weekdayName(tomorrowWeekday)}`
    : "Завтра";

  return (
    <div className="flex flex-col gap-8">
      <ReminderBanner items={homework ?? []} />
      <LessonList
        title={todayTitle}
        empty="Сегодня уроков нет — выходной."
        slots={todaySlots}
        homework={homework ?? []}
        today={today}
        dueOn={today}
        includeOverdue
      />
      <LessonList
        title={tomorrowTitle}
        empty="Завтра уроков нет."
        slots={tomorrowSlots}
        homework={homework ?? []}
        today={today}
        dueOn={tomorrow}
      />
      <ExtraHomework items={extra} today={today} />
    </div>
  );
}
