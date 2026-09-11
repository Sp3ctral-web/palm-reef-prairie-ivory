import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HomeworkCard } from "@/components/homework-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { addDaysISO, todayISO, URGENCY_ORDER, urgencyOf, type Urgency } from "@/lib/dates";
import { classSubjects, useHomework, useTimetable } from "@/lib/queries";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/board")({ component: BoardPage });

const SECTIONS: { key: Urgency; title: string }[] = [
  { key: "overdue", title: "Просрочено" },
  { key: "today", title: "Сегодня" },
  { key: "tomorrow", title: "Завтра" },
  { key: "later", title: "Потом" },
  { key: "past", title: "Архив" },
];

function BoardPage() {
  return (
    <AppShell>
      <BoardBody />
    </AppShell>
  );
}

function BoardBody() {
  const { data: homework, isPending } = useHomework();
  const { data: timetable } = useTimetable();
  const done = useClassStore((s) => s.done);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const today = todayISO();
  const horizon = addDaysISO(today, -7);

  const subjects = useMemo(
    () => classSubjects(timetable, homework),
    [timetable, homework],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (homework ?? [])
      .filter((item) => {
        if (subject && item.subject !== subject) return false;
        if (q) {
          const hay = `${item.subject} ${item.task} ${item.addedBy}`.toLowerCase();
          return hay.includes(q);
        }
        if (item.dueOn >= horizon) return true;
        return !done[String(item.id)];
      })
      .sort((a, b) => {
        const ua = URGENCY_ORDER[urgencyOf(a.dueOn, today)];
        const ub = URGENCY_ORDER[urgencyOf(b.dueOn, today)];
        if (ua !== ub) return ua - ub;
        const aDone = Boolean(done[String(a.id)]);
        const bDone = Boolean(done[String(b.id)]);
        if (aDone !== bDone) return aDone ? 1 : -1;
        return a.dueOn.localeCompare(b.dueOn) || a.subject.localeCompare(b.subject, "ru");
      });
  }, [homework, query, subject, today, horizon, done]);

  const grouped = SECTIONS.map((section) => ({
    ...section,
    items: filtered.filter((item) => urgencyOf(item.dueOn, today) === section.key),
  })).filter((section) => {
    if (section.items.length === 0) return false;
    if (!query && section.key === "past") return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти старое ДЗ"
          className="pl-9"
          type="search"
          enterKeyHint="search"
        />
      </div>
      <div className="-mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 pb-1">
        <FilterChip active={subject === null} onClick={() => setSubject(null)}>
          Все
        </FilterChip>
        {subjects.map((name) => (
          <FilterChip
            key={name}
            active={subject === name}
            onClick={() => setSubject(subject === name ? null : name)}
          >
            {name}
          </FilterChip>
        ))}
      </div>

      {isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      ) : grouped.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {query ? "Ничего не нашлось. Попробуй другое слово." : "На доске пока пусто."}
        </p>
      ) : (
        grouped.map((section) => (
          <section key={section.key} className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {section.title}
            </h2>
            {section.items.map((item) => (
              <HomeworkCard key={item.id} item={item} today={today} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-sm transition-colors duration-150",
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-card",
      )}
    >
      {children}
    </button>
  );
}
