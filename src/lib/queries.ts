import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addHomework,
  deleteHomework,
  getClassConfig,
  listHomework,
  listTimetable,
  updateClassSettings,
  upsertTextbook,
  upsertTimetableSlot,
  type Homework,
  type Textbook,
  type TimetableSlot,
} from "@/lib/api";

export const homeworkKey = ["homework"] as const;
export const timetableKey = ["timetable"] as const;
export const configKey = ["class-config"] as const;

export function useHomework() {
  return useQuery({
    queryKey: homeworkKey,
    queryFn: () => listHomework(),
  });
}

export function useTimetable() {
  return useQuery({
    queryKey: timetableKey,
    queryFn: () => listTimetable(),
  });
}

export function useClassConfig() {
  return useQuery({
    queryKey: configKey,
    queryFn: () => getClassConfig(),
  });
}

export function useAddHomework() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      subject: string;
      task: string;
      assignedOn: string;
      dueOn: string;
      addedBy: string;
    }) => addHomework({ data: input }),
    onSuccess: (created) => {
      client.setQueryData<Homework[]>(homeworkKey, (prev) => {
        const list = prev ?? [];
        if (list.some((item) => item.id === created.id)) return list;
        return [...list, created];
      });
      void client.invalidateQueries({ queryKey: homeworkKey });
    },
  });
}

export function useDeleteHomework() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteHomework({ data: { id } }),
    onSuccess: (_res, id) => {
      client.setQueryData<Homework[]>(homeworkKey, (prev) =>
        (prev ?? []).filter((item) => item.id !== id),
      );
      void client.invalidateQueries({ queryKey: homeworkKey });
    },
  });
}

export function useUpsertSlot() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { weekday: number; period: number; subject: string }) =>
      upsertTimetableSlot({ data: input }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: timetableKey });
    },
  });
}

export function useUpdateSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { grade?: number; periodCount?: number }) =>
      updateClassSettings({ data: input }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: configKey });
      void client.invalidateQueries({ queryKey: timetableKey });
    },
  });
}

export function useUpsertTextbook() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { subject: string; title: string }) => upsertTextbook({ data: input }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: configKey });
    },
  });
}

export function slotsByDay(slots: TimetableSlot[] | undefined, weekday: number) {
  return (slots ?? [])
    .filter((slot) => slot.weekday === weekday)
    .sort((a, b) => a.period - b.period);
}

export function classSubjects(slots: TimetableSlot[] | undefined, homework: Homework[] | undefined) {
  const names = [
    ...(slots ?? []).map((s) => s.subject),
    ...(homework ?? []).map((h) => h.subject),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const name of names) {
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}

export function textbookMap(books: Textbook[] | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  for (const book of books ?? []) map[book.subject] = book.title;
  return map;
}
