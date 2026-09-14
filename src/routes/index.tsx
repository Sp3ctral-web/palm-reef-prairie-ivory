import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ExtraHomework, LessonList } from "@/components/lesson-list";
import { ReminderBanner, useDeadlineNotifications } from "@/components/reminders";
import { WeekSwitch } from "@/components/week-switch";
import { Skeleton } from "@/components/ui/skeleton";
import { addDaysISO, schoolWeekday, todayISO, weekdayName } from "@/lib/dates";
import { fillPeriods, useClassConfig, useHomework, useTimetable, useUpdateSettings } from "@/lib/queries";
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
  const { data: config } = useClassConfig();
  const updateSettings = useUpdateSettings();
  const done = useClassStore((s) => s.done);
  const today = todayISO();
  const tomorrow = addDaysISO(today, 1);
  const todayWeekday = schoolWeekday(today);
  const tomorrowWeekday = schoolWeekday(tomorrow);
  const week = config?.cycleWeek === 2 ? 2 : 1;
  const periodCount = config?.periodCount ?? 8;

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

  const todaySlots = todayWeekday ? fillPeriods(timetable, todayWeekday, week, periodCount) : [];
  const tomorrowSlots = tomorrowWeekday
    ? fillPeriods(timetable, tomorrowWeekday, week, periodCount)
    : [];
  const todaySubjects = new Set(todaySlots.map((s) => s.subject).filter(Boolean));
  const tomorrowSubjects = new Set(tomorrowSlots.map((s) => s.subject).filter(Boolean));

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
      <WeekSwitch
        value={week}
        current={week}
        onChange={(next) => updateSettings.mutate({ cycleWeek: next })}
      />
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
