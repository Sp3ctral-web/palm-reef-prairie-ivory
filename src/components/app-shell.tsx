import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, BookMarked, CalendarDays, LayoutList, Plus } from "lucide-react";
import { AddHomeworkDrawer } from "@/components/add-homework";
import { NameGate } from "@/components/name-gate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLongDate, todayISO } from "@/lib/dates";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Сегодня", icon: BookOpen },
  { to: "/board", label: "Доска", icon: LayoutList },
  { to: "/schedule", label: "Уроки", icon: CalendarDays },
  { to: "/books", label: "Оқулықтар", icon: BookMarked },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useClassStore((s) => s.hydrated);
  const name = useClassStore((s) => s.name);
  const hydrate = useClassStore((s) => s.hydrate);
  const setName = useClassStore((s) => s.setName);
  const openAdd = useClassStore((s) => s.openAdd);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 px-5 py-8">
        <p className="font-display text-2xl font-medium tracking-tight">Задано</p>
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (!name) return <NameGate />;

  function submitRename(event: FormEvent) {
    event.preventDefault();
    const next = renameValue.trim();
    if (!next) return;
    setName(next.slice(0, 24));
    setRenameOpen(false);
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 pt-safe">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="font-display text-2xl font-medium tracking-tight leading-none">
              Задано
            </p>
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {formatLongDate(todayISO())}
            </p>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-3 text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button size="sm" className="ml-2 rounded-full" onClick={() => openAdd()}>
              <Plus className="size-3.5" />
              ДЗ
            </Button>
          </nav>
          <button
            type="button"
            onClick={() => {
              setRenameValue(name);
              setRenameOpen(true);
            }}
            className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
            aria-label="Сменить имя"
            title={name}
          >
            {name.slice(0, 1).toUpperCase()}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pt-4 pb-28">{children}</main>

      <Button
        size="lg"
        onClick={() => openAdd()}
        className="fixed right-4 bottom-24 z-30 h-12 rounded-full px-5 shadow-card md:hidden"
      >
        <Plus className="size-4" />
        ДЗ
      </Button>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-safe md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Твоё имя на доске</DialogTitle>
            <DialogDescription>
              Так одноклассники видят, кто записал задание.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRename} className="mt-4 flex flex-col gap-3">
            <Input
              value={renameValue}
              maxLength={24}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!renameValue.trim()}>
              Сохранить
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AddHomeworkDrawer />
    </div>
  );
}
