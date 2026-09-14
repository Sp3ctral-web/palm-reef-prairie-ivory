import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidClassCode, normalizeClassCode } from "@/lib/class-code";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function NameGate() {
  const joinClass = useClassStore((s) => s.joinClass);
  const recents = useClassStore((s) => s.recents);
  const savedName = useClassStore((s) => s.name);
  const [name, setName] = useState(savedName);
  const [code, setCode] = useState("");

  const normalized = normalizeClassCode(code);
  const canSubmit = name.trim().length > 0 && isValidClassCode(code);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    joinClass(name.trim().slice(0, 24), normalized);
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
        У каждого класса своя доска. Код придумайте вместе — например 8А. У 8Б
        будет другая сетка уроков и другие задания.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Как тебя зовут?</Label>
          <Input
            id="name"
            autoComplete="given-name"
            placeholder="Например, Аня"
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="class">Класс</Label>
          <Input
            id="class"
            autoFocus={!savedName}
            autoCapitalize="characters"
            placeholder="8А"
            maxLength={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-describedby="class-hint"
          />
          <p id="class-hint" className="text-xs text-muted-foreground">
            Без пароля: кто знает код — видит доску. Если уже пользовались старой
            общей доской, введите 8А.
          </p>
        </div>
        {recents.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {recents.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCode(item)}
                className={cn(
                  "h-9 rounded-full px-3 text-sm",
                  normalizeClassCode(code) === item
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground shadow-card",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
        <Button type="submit" size="lg" disabled={!canSubmit}>
          Открыть доску
        </Button>
      </form>
    </main>
  );
}
