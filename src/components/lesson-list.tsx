import { Plus } from "lucide-react";
import type { Homework, TimetableSlot } from "@/lib/api";
import { HomeworkCard } from "@/components/homework-card";
import { urgencyOf } from "@/lib/dates";
import { textbookMap, useClassConfig } from "@/lib/queries";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LessonList({
  title,
  empty,
  slots,
  homework,
  today,
  dueOn,
  includeOverdue = false,
}: {
  title: string;
  empty: string;
  slots: TimetableSlot[];
  homework: Homework[];
  today: string;
  dueOn: string;
  includeOverdue?: boolean;
}) {
  const openAdd = useClassStore((s) => s.openAdd);
  const { data: config } = useClassConfig();
  const books = textbookMap(config?.textbooks);

  if (slots.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{empty}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
      <ol className="flex flex-col gap-2">
        {slots.map((slot) => {
          const items = homework.filter((item) => {
            if (item.subject !== slot.subject) return false;
            if (item.dueOn === dueOn) return true;
            if (includeOverdue && urgencyOf(item.dueOn, today) === "overdue") return true;
            return false;
          });
          const book = books[slot.subject];
          return (
            <li key={`${slot.weekday}-${slot.period}`} className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3 px-1">
                <span className="w-5 text-right font-medium tabular-nums text-muted-foreground">
                  {slot.period}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-medium">{slot.subject}</span>
                  {book ? (
                    <span className="ml-2 text-xs text-muted-foreground">{book}</span>
                  ) : null}
                </span>
              </div>
              {items.length > 0 ? (
                items.map((item) => (
                  <HomeworkCard
                    key={item.id}
                    item={item}
                    today={today}
                    compact
                    hideSubject
                  />
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => openAdd({ subject: slot.subject, dueOn })}
                  className={cn(
                    "shadow-card ml-8 flex h-11 items-center justify-between rounded-md bg-card px-3 text-left text-sm text-muted-foreground",
                  )}
                >
                  Ничего не задано
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Plus className="size-3.5" />
                    ДЗ
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ExtraHomework({
  items,
  today,
}: {
  items: Homework[];
  today: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-medium tracking-tight">Ещё к сдаче</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <HomeworkCard key={item.id} item={item} today={today} compact />
        ))}
      </div>
    </section>
  );
}
