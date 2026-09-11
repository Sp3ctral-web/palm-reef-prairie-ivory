import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { schoolWeekday, todayISO, weekdayName } from "@/lib/dates";
import {
  textbookMap,
  useClassConfig,
  useTimetable,
  useUpdateSettings,
  useUpsertSlot,
} from "@/lib/queries";
import { subjectsForGrade } from "@/lib/subjects";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({ component: SchedulePage });

const DAYS = [1, 2, 3, 4, 5, 6] as const;
const MAX_PERIODS = 12;
const MIN_PERIODS = 1;

function SchedulePage() {
  return (
    <AppShell>
      <ScheduleBody />
    </AppShell>
  );
}

function ScheduleBody() {
  const { data: slots, isPending } = useTimetable();
  const { data: config } = useClassConfig();
  const upsert = useUpsertSlot();
  const updateSettings = useUpdateSettings();
  const openAdd = useClassStore((s) => s.openAdd);
  const todayWeekday = schoolWeekday(todayISO());
  const [day, setDay] = useState<number>(todayWeekday ?? 1);
  const [editing, setEditing] = useState<{ weekday: number; period: number; subject: string } | null>(
    null,
  );
  const [customSubject, setCustomSubject] = useState("");

  const periodCount = config?.periodCount ?? 8;
  const periods = useMemo(
    () => Array.from({ length: periodCount }, (_, i) => i + 1),
    [periodCount],
  );
  const gradeSubjects = subjectsForGrade(config?.grade ?? 8);
  const books = textbookMap(config?.textbooks);

  const grid = useMemo(() => {
    const map = new Map<string, string>();
    for (const slot of slots ?? []) {
      map.set(`${slot.weekday}-${slot.period}`, slot.subject);
    }
    return map;
  }, [slots]);

  function subjectAt(weekday: number, period: number) {
    return grid.get(`${weekday}-${period}`) ?? "";
  }

  function pickSubject(name: string) {
    if (!editing) return;
    upsert.mutate(
      { weekday: editing.weekday, period: editing.period, subject: name },
      { onSuccess: () => setEditing(null) },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-medium tracking-tight">Расписание</h1>
          <p className="text-sm text-muted-foreground">
            {periodCount} уроков ·{" "}
            <Link to="/books" className="text-primary">
              {config?.grade ?? 8} сынып, учебники
            </Link>
          </p>
        </div>
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:hidden">
        {DAYS.map((weekday) => (
          <button
            key={weekday}
            type="button"
            onClick={() => setDay(weekday)}
            className={cn(
              "h-9 min-w-11 shrink-0 rounded-full px-3 text-sm capitalize",
              day === weekday
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground shadow-card",
            )}
          >
            {weekdayName(weekday)}
          </button>
        ))}
      </div>

      {isPending ? (
        <Skeleton className="h-80 rounded-lg" />
      ) : (
        <>
          <ol className="flex flex-col gap-2 md:hidden">
            {periods.map((period) => {
              const subject = subjectAt(day, period);
              return (
                <li key={period}>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSubject("");
                      setEditing({ weekday: day, period, subject });
                    }}
                    className="shadow-card flex min-h-14 w-full items-center gap-3 rounded-lg bg-card px-3 py-2 text-left"
                  >
                    <span className="w-5 text-right text-sm font-medium tabular-nums text-muted-foreground">
                      {period}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-sm font-medium", !subject && "text-muted-foreground")}>
                        {subject || "Пусто"}
                      </span>
                      {subject && books[subject] ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {books[subject]}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="shadow-card hidden overflow-hidden rounded-xl bg-card md:block">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="w-10 py-3 text-center font-medium"> </th>
                  {DAYS.map((weekday) => (
                    <th
                      key={weekday}
                      className={cn(
                        "py-3 text-center font-medium capitalize",
                        weekday === todayWeekday && "text-primary",
                      )}
                    >
                      {weekdayName(weekday)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period} className="border-b border-border last:border-0">
                    <td className="py-1 text-center text-muted-foreground tabular-nums">{period}</td>
                    {DAYS.map((weekday) => {
                      const subject = subjectAt(weekday, period);
                      return (
                        <td key={weekday} className="p-1">
                          <button
                            type="button"
                            onClick={() => {
                              setCustomSubject("");
                              setEditing({ weekday, period, subject });
                            }}
                            className={cn(
                              "flex min-h-12 w-full flex-col items-center justify-center rounded-sm px-1 text-center",
                              subject
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/60",
                              weekday === todayWeekday && subject && "bg-primary/10 text-primary",
                            )}
                          >
                            <span className="text-xs font-medium">{subject || "—"}</span>
                            {subject && books[subject] ? (
                              <span className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
                                {books[subject]}
                              </span>
                            ) : null}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={periodCount <= MIN_PERIODS || updateSettings.isPending}
              onClick={() => updateSettings.mutate({ periodCount: periodCount - 1 })}
            >
              <Minus className="size-4" />
              Убрать урок
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={periodCount >= MAX_PERIODS || updateSettings.isPending}
              onClick={() => updateSettings.mutate({ periodCount: periodCount + 1 })}
            >
              <Plus className="size-4" />
              Ещё урок
            </Button>
          </div>
        </>
      )}

      <Drawer
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {editing
                ? `${editing.period} урок, ${weekdayName(editing.weekday, "long")}`
                : "Урок"}
            </DrawerTitle>
            <DrawerDescription>Выбери предмет или оставь клетку пустой.</DrawerDescription>
          </DrawerHeader>
          {editing ? (
            <div className="flex flex-col gap-3 overflow-y-auto px-5 pb-5">
              <div className="flex flex-wrap gap-1.5">
                {gradeSubjects.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pickSubject(name)}
                    className={cn(
                      "h-9 rounded-full px-3 text-sm",
                      editing.subject === name
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  maxLength={80}
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Другой предмет"
                  className="h-11 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!customSubject.trim()}
                  onClick={() => pickSubject(customSubject.trim())}
                >
                  Ок
                </Button>
              </div>
              {editing.subject && books[editing.subject] ? (
                <p className="text-xs text-muted-foreground">Оқулық: {books[editing.subject]}</p>
              ) : null}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => pickSubject("")}>
                  Очистить
                </Button>
                {editing.subject ? (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      openAdd({ subject: editing.subject });
                      setEditing(null);
                    }}
                  >
                    Задать ДЗ
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
