import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Homework } from "@/lib/api";
import { formatDayMonth, URGENCY_LABEL, urgencyOf, type Urgency } from "@/lib/dates";
import { useDeleteHomework } from "@/lib/queries";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

const badgeVariant: Record<Urgency, "overdue" | "today" | "tomorrow" | "later" | "past"> = {
  overdue: "overdue",
  today: "today",
  tomorrow: "tomorrow",
  later: "later",
  past: "past",
};

export function HomeworkCard({
  item,
  today,
  compact = false,
  hideSubject = false,
}: {
  item: Homework;
  today: string;
  compact?: boolean;
  hideSubject?: boolean;
}) {
  const isDone = useClassStore((s) => s.isDone(item.id));
  const toggleDone = useClassStore((s) => s.toggleDone);
  const remove = useDeleteHomework();
  const [confirm, setConfirm] = useState(false);
  const urgency = urgencyOf(item.dueOn, today);

  return (
    <article
      className={cn(
        "shadow-card flex gap-3 rounded-lg bg-card p-4 transition-opacity duration-150",
        isDone && "opacity-55",
      )}
    >
      <Checkbox
        checked={isDone}
        onCheckedChange={() => toggleDone(item.id)}
        aria-label={isDone ? "Отметить как несделанное" : "Отметить как сделанное"}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          {hideSubject ? (
            <span />
          ) : (
            <h3 className="text-sm font-medium text-foreground">{item.subject}</h3>
          )}
          <Badge variant={badgeVariant[urgency]}>{URGENCY_LABEL[urgency]}</Badge>
        </div>
        <p
          className={cn(
            "mt-1 text-sm leading-snug text-foreground",
            isDone && "line-through",
            compact && "line-clamp-2",
          )}
        >
          {item.task}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          сдать {formatDayMonth(item.dueOn)}
          <span aria-hidden> · </span>
          задали {formatDayMonth(item.assignedOn)}
          <span aria-hidden> · </span>
          {item.addedBy}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="relative -mr-1 flex size-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-destructive"
        aria-label="Удалить задание"
      >
        <Trash2 className="size-4" />
      </button>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить задание?</DialogTitle>
            <DialogDescription>
              Его не станет на доске у всего класса. Это нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Оставить
            </Button>
            <Button
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => {
                remove.mutate(item.id, { onSuccess: () => setConfirm(false) });
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
