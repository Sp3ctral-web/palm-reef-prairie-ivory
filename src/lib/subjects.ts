export const GRADES = [7, 8, 9, 10, 11] as const;
export type Grade = (typeof GRADES)[number];

const GRADE_7 = [
  "Қазақ тілі",
  "Қазақ әдебиеті",
  "Орыс тілі",
  "Ағылшын тілі",
  "Қазақстан тарихы",
  "Дүниежүзі тарихы",
  "Алгебра",
  "Геометрия",
  "Информатика",
  "Физика",
  "Биология",
  "География",
  "Дене шынықтыру",
  "Өзін-өзі тану",
  "Технология",
] as const;

const GRADE_8 = [...GRADE_7, "Химия"] as const;

const GRADE_9 = [
  ...GRADE_8,
  "Құқық негіздері",
  "Алғашқы әскери және технологиялық дайындық (НВП)",
] as const;

const GRADE_10_11 = [
  "Алгебра және анализ бастамалары",
  "Геометрия",
  "Физика",
  "Химия",
  "Биология",
  "География",
  "Қазақстан тарихы",
  "Дүниежүзі тарихы",
  "Құқық негіздері",
  "Информатика",
  "Қазақ тілі",
  "Қазақ әдебиеті",
  "Орыс тілі",
  "Ағылшын тілі",
  "Дене шынықтыру",
  "АӘТД",
  "Өзін-өзі тану",
] as const;

export function subjectsForGrade(grade: number): string[] {
  if (grade === 7) return [...GRADE_7];
  if (grade === 8) return [...GRADE_8];
  if (grade === 9) return [...GRADE_9];
  return [...GRADE_10_11];
}

export const GRADE_LABELS: Record<Grade, string> = {
  7: "7 сынып",
  8: "8 сынып",
  9: "9 сынып",
  10: "10 сынып",
  11: "11 сынып",
};

export function gradeLabel(grade: number): string {
  return GRADE_LABELS[grade as Grade] ?? `${grade} сынып`;
}

export function uniqueSubjects(fromClass: string[], gradeSubjects: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const name of [...gradeSubjects, ...fromClass]) {
    const trimmed = name.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}
