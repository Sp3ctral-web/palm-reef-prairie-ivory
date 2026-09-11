import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { textbookMap, useClassConfig, useUpdateSettings, useUpsertTextbook } from "@/lib/queries";
import { GRADE_LABELS, GRADES, subjectsForGrade } from "@/lib/subjects";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/books")({ component: BooksPage });

function BooksPage() {
  return (
    <AppShell>
      <BooksBody />
    </AppShell>
  );
}

function BooksBody() {
  const { data: config, isPending } = useClassConfig();
  const updateSettings = useUpdateSettings();
  const upsert = useUpsertTextbook();
  const grade = config?.grade ?? 8;
  const subjects = subjectsForGrade(grade);
  const books = textbookMap(config?.textbooks);
  const catalog = config?.catalog ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-xl font-medium tracking-tight">Оқулықтар</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Справочник класса: предметы по сыныпу и учебник к каждому. Можно выбрать уже
          добавленное название или вписать своё.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Сынып</Label>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {GRADES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => updateSettings.mutate({ grade: value })}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-sm",
                grade === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground shadow-card",
              )}
            >
              {GRADE_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {subjects.map((subject) => (
            <TextbookRow
              key={`${grade}-${subject}`}
              subject={subject}
              title={books[subject] ?? ""}
              catalog={catalog}
              saving={upsert.isPending}
              onSave={(title) => {
                upsert.mutate(
                  { subject, title },
                  {
                    onSuccess: () => {
                      if (title) toast("Учебник сохранён");
                    },
                    onError: () => toast("Не получилось сохранить"),
                  },
                );
              }}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

function TextbookRow({
  subject,
  title,
  catalog,
  saving,
  onSave,
}: {
  subject: string;
  title: string;
  catalog: string[];
  saving: boolean;
  onSave: (title: string) => void;
}) {
  const [value, setValue] = useState(title);
  const listId = `tb-${subject.replace(/\s+/g, "-")}`;

  useEffect(() => {
    setValue(title);
  }, [title]);

  function commit() {
    const next = value.trim();
    if (next === title) return;
    onSave(next);
  }

  return (
    <li className="shadow-card flex flex-col gap-2 rounded-lg bg-card px-3 py-3">
      <p className="text-sm font-medium">{subject}</p>
      <Input
        list={listId}
        value={value}
        maxLength={120}
        disabled={saving}
        placeholder="Название учебника"
        aria-label={`Учебник: ${subject}`}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      <datalist id={listId}>
        {catalog.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
    </li>
  );
}
