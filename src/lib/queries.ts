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
import { useClassStore } from "@/lib/store";

export const homeworkKey = ["homework"] as const;
export const timetableKey = ["timetable"] as const;
export const configKey = ["class-config"] as const;

function useClassCode() {
  return useClassStore((s) => s.classCode);
}

export function useHomework() {
  const classCode = useClassCode();
  return useQuery({
    queryKey: [...homeworkKey, classCode],
    queryFn: () => listHomework({ data: { classCode } }),
    enabled: Boolean(classCode),
  });
}

export function useTimetable() {
  const classCode = useClassCode();
  return useQuery({
    queryKey: [...timetableKey, classCode],
    queryFn: () => listTimetable({ data: { classCode } }),
    enabled: Boolean(classCode),
  });
}

export function useClassConfig() {
  const classCode = useClassCode();
  return useQuery({
    queryKey: [...configKey, classCode],
    queryFn: () => getClassConfig({ data: { classCode } }),
    enabled: Boolean(classCode),
  });
}

export function useAddHomework() {
  const client = useQueryClient();
  const classCode = useClassCode();
  return useMutation({
    mutationFn: (input: {
      subject: string;
      task: string;
      assignedOn: string;
      dueOn: string;
      addedBy: string;
    }) => addHomework({ data: { ...input, classCode } }),
    onSuccess: (created) => {
      client.setQueryData<Homework[]>([...homeworkKey, classCode], (prev) => {
        const list = prev ?? [];
        if (list.some((item) => item.id === created.id)) return list;
        return [...list, created];
      });
      void client.invalidateQueries({ queryKey: [...homeworkKey, classCode] });
    },
  });
}

export function useDeleteHomework() {
  const client = useQueryClient();
  const classCode = useClassCode();
  return useMutation({
    mutationFn: (id: number) => deleteHomework({ data: { classCode, id } }),
    onSuccess: (_res, id) => {
      client.setQueryData<Homework[]>([...homeworkKey, classCode], (prev) =>
        (prev ?? []).filter((item) => item.id !== id),
      );
      void client.invalidateQueries({ queryKey: [...homeworkKey, classCode] });
    },
  });
}

export function useUpsertSlot() {
  const client = useQueryClient();
  const classCode = useClassCode();
  return useMutation({
    mutationFn: (input: { week: number; weekday: number; period: number; subject: string }) =>
      upsertTimetableSlot({ data: { ...input, classCode } }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: [...timetableKey, classCode] });
    },
  });
}

export function useUpdateSettings() {
  const client = useQueryClient();
  const classCode = useClassCode();
  return useMutation({
    mutationFn: (input: { grade?: number; periodCount?: number; cycleWeek?: number }) =>
      updateClassSettings({ data: { ...input, classCode } }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: [...configKey, classCode] });
      void client.invalidateQueries({ queryKey: [...timetableKey, classCode] });
    },
  });
}

export function useUpsertTextbook() {
  const client = useQueryClient();
  const classCode = useClassCode();
  return useMutation({
    mutationFn: (input: { subject: string; title: string }) =>
      upsertTextbook({ data: { ...input, classCode } }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: [...configKey, classCode] });
    },
  });
}

export function slotsByDay(
  slots: TimetableSlot[] | undefined,
  weekday: number,
  week = 1,
) {
  return (slots ?? [])
    .filter((slot) => slot.weekday === weekday && (slot.week || 1) === week)
    .sort((a, b) => a.period - b.period);
}

/** Always returns periodCount rows so empty 7th/8th lessons still show on Today. */
export function fillPeriods(
  slots: TimetableSlot[] | undefined,
  weekday: number,
  week: number,
  periodCount: number,
): TimetableSlot[] {
  const filled = slotsByDay(slots, weekday, week);
  const byPeriod = new Map(filled.map((slot) => [slot.period, slot]));
  return Array.from({ length: periodCount }, (_, i) => {
    const period = i + 1;
    return (
      byPeriod.get(period) ?? {
        id: -(week * 100 + weekday * 10 + period),
        week,
        weekday,
        period,
        subject: "",
      }
    );
  });
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
