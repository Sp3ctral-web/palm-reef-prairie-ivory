import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addDaysISO,
  parseISODate,
  todayISO,
  twoWeekDates,
  WEEKDAY_HEADERS,
} from "@/lib/dates";
import {
  classSubjects,
  textbookMap,
  useAddHomework,
  useClassConfig,
  useHomework,
  useTimetable,
} from "@/lib/queries";
import { subjectsForGrade, uniqueSubjects } from "@/lib/subjects";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AddHomeworkDrawer() {
  const open = useClassStore((s) => s.addOpen);
  const prefill = useClassStore((s) => s.prefill);
  const closeAdd = useClassStore((s) => s.closeAdd);
  const name = useClassStore((s) => s.name);
  const { data: slots } = useTimetable();
  const { data: homework } = useHomework();
  const { data: config } = useClassConfig();
  const add = useAddHomework();

  const today = todayISO();
  const dueDays = useMemo(() => twoWeekDates(today), [today]);
  const books = textbookMap(config?.textbooks);
  const fromClass = useMemo(() => classSubjects(slots, homework), [slots, homework]);
  const gradeList = subjectsForGrade(config?.grade ?? 8);
  const quickSubjects = useMemo(
    () => uniqueSubjects(fromClass, []).slice(0, 12),
    [fromClass],
  );
  const allSubjects = useMemo(
    () => uniqueSubjects(fromClass, gradeList),
    [fromClass, gradeList],
  );

  const [subject, setSubject] = useState("");
  const [task, setTask] = useState("");
  const [dueOn, setDueOn] = useState(addDaysISO(today, 1));
  const [customSubject, setCustomSubject] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const subjects = showAll || quickSubjects.length === 0 ? allSubjects : quickSubjects;

  useEffect(() => {
    if (!open) return;
    setTask("");
    setCustomSubject(false);
    setShowAll(false);
    setSubject(prefill?.subject ?? "");
    setDueOn(prefill?.dueOn ?? addDaysISO(todayISO(), 1));
  }, [open, prefill]);

  const canSubmit = subject.trim().length > 0 && task.trim().length > 0 && !add.isPending;
  const textbook = books[subject];

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    add.mutate(
      {
        subject: subject.trim(),
        task: task.trim(),
        assignedOn: today,
        dueOn,
        addedBy: name || "класс",
      },
      {
        onSuccess: () => {
          toast("Задание на доске");
          closeAdd();
        },
        onError: () => toast("Не получилось сохранить"),
      },
    );
  }

  return (
    <Drawer open={open} onOpenChange={(next) => (next ? null : closeAdd())}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Новое задание</DrawerTitle>
          <DrawerDescription>Предмет, текст и день сдачи — этого хватит.</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 overflow-y-auto px-5 pb-5">
          <div className="flex flex-col gap-2">
            <Label>Предмет</Label>
            <div className={cn("flex gap-1.5", showAll ? "flex-wrap" : "-mx-1 overflow-x-auto px-1 pb-1")}>
              {subjects.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSubject(item);
                    setCustomSubject(false);
                  }}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3 text-sm transition-colors duration-150",
                    subject === item && !customSubject
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
              {!showAll && allSubjects.length > quickSubjects.length ? (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="h-9 shrink-0 rounded-full bg-muted px-3 text-sm text-foreground"
                >
                  Все
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setCustomSubject(true);
                  setSubject("");
                }}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3 text-sm transition-colors duration-150",
                  customSubject ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                Другой
              </button>
            </div>
            {customSubject ? (
              <input
                autoFocus
                maxLength={80}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Название предмета"
                className="h-11 w-full rounded-md border border-border bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
              />
            ) : null}
            {textbook ? (
              <p className="text-xs text-muted-foreground">Оқулық: {textbook}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task">Что задали</Label>
            <Textarea
              id="task"
              required
              maxLength={500}
              placeholder="Номера, параграф, что принести"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Сдать — две недели</Label>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAY_HEADERS.map((label) => (
                <div
                  key={label}
                  className="text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {label}
                </div>
              ))}
              {dueDays.map((iso) => {
                const past = iso < today;
                const selected = dueOn === iso;
                const isToday = iso === today;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={past}
                    onClick={() => setDueOn(iso)}
                    aria-label={iso}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-150",
                      selected && "bg-primary text-primary-foreground",
                      !selected && isToday && "bg-muted font-medium text-primary",
                      !selected && !isToday && !past && "bg-card text-foreground hover:bg-muted",
                      past && "cursor-not-allowed text-muted-foreground/50",
                    )}
                  >
                    {parseISODate(iso).getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={!canSubmit}>
            {add.isPending ? "Сохраняю…" : "Добавить на доску"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
