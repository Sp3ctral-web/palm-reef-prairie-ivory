import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClassStore } from "@/lib/store";

export function NameGate() {
  const setName = useClassStore((s) => s.setName);
  const [value, setValue] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const name = value.trim();
    if (!name) return;
    setName(name.slice(0, 24));
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
      <p className="text-sm font-medium tracking-wide text-primary uppercase">
        Доска класса
      </p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight text-foreground">
        Задано
      </h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        Общая тетрадь домашних заданий. Без пароля — все видят одно и то же.
        Имя нужно, чтобы одноклассники знали, кто записал задание.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
        <Label htmlFor="name">Как тебя зовут?</Label>
        <Input
          id="name"
          autoFocus
          autoComplete="given-name"
          placeholder="Например, Аня"
          maxLength={24}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" size="lg" disabled={!value.trim()}>
          Открыть доску
        </Button>
      </form>
    </main>
  );
}
