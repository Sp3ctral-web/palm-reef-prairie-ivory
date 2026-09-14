import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isValidClassCode, normalizeClassCode } from "@/lib/class-code";
import { getSql } from "@/lib/db";

export type Homework = {
  id: number;
  subject: string;
  task: string;
  assignedOn: string;
  dueOn: string;
  addedBy: string;
};

export type TimetableSlot = {
  id: number;
  week: number;
  weekday: number;
  period: number;
  subject: string;
};

export type Textbook = {
  subject: string;
  title: string;
};

export type ClassConfig = {
  code: string;
  grade: number;
  periodCount: number;
  cycleWeek: number;
  textbooks: Textbook[];
  catalog: string[];
};

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const subjectName = z.string().trim().min(1).max(80);
const classCodeField = z
  .string()
  .transform((value) => normalizeClassCode(value))
  .refine((value) => isValidClassCode(value), "\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043a\u043e\u0434 \u043a\u043b\u0430\u0441\u0441\u0430");

async function ensureClass(sql: Awaited<ReturnType<typeof getSql>>, code: string) {
  await sql`
    insert into classes (code, grade, period_count, cycle_week)
    values (${code}, 8, 8, 1)
    on conflict (code) do nothing
  `;
}

export const listHomework = createServerFn({ method: "GET" })
  .validator(z.object({ classCode: classCodeField }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    return sql<Homework>`
      select
        id,
        subject,
        task,
        assigned_on::text as "assignedOn",
        due_on::text as "dueOn",
        added_by as "addedBy"
      from homework
      where class_code = ${data.classCode}
      order by due_on asc, id asc
    `;
  });

export const addHomework = createServerFn({ method: "POST" })
  .validator(
    z.object({
      classCode: classCodeField,
      subject: subjectName,
      task: z.string().trim().min(1).max(500),
      assignedOn: dateStr,
      dueOn: dateStr,
      addedBy: z.string().trim().min(1).max(24),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureClass(sql, data.classCode);
    const rows = await sql<Homework>`
      insert into homework (class_code, subject, task, assigned_on, due_on, added_by)
      values (
        ${data.classCode},
        ${data.subject},
        ${data.task},
        ${data.assignedOn},
        ${data.dueOn},
        ${data.addedBy}
      )
      returning
        id,
        subject,
        task,
        assigned_on::text as "assignedOn",
        due_on::text as "dueOn",
        added_by as "addedBy"
    `;
    return rows[0]!;
  });

export const deleteHomework = createServerFn({ method: "POST" })
  .validator(z.object({ classCode: classCodeField, id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      delete from homework
      where id = ${data.id} and class_code = ${data.classCode}
    `;
    return { ok: true as const };
  });

export const listTimetable = createServerFn({ method: "GET" })
  .validator(z.object({ classCode: classCodeField }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<TimetableSlot>`
      select id, week, weekday, period, subject
      from timetable
      where class_code = ${data.classCode}
      order by week asc, weekday asc, period asc
    `;
    return rows.map((row) => ({ ...row, week: Number(row.week) || 1 }));
  });

export const upsertTimetableSlot = createServerFn({ method: "POST" })
  .validator(
    z.object({
      classCode: classCodeField,
      week: z.number().int().min(1).max(2).default(1),
      weekday: z.number().int().min(1).max(6),
      period: z.number().int().min(1).max(12),
      subject: z.string().trim().max(80),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const week = data.week ?? 1;
    await ensureClass(sql, data.classCode);
    if (!data.subject) {
      await sql`
        delete from timetable
        where class_code = ${data.classCode}
          and week = ${week}
          and weekday = ${data.weekday}
          and period = ${data.period}
      `;
      return { ok: true as const };
    }
    await sql`
      insert into timetable (class_code, week, weekday, period, subject)
      values (${data.classCode}, ${week}, ${data.weekday}, ${data.period}, ${data.subject})
      on conflict (class_code, week, weekday, period)
      do update set subject = excluded.subject
    `;
    return { ok: true as const };
  });

export const getClassConfig = createServerFn({ method: "GET" })
  .validator(z.object({ classCode: classCodeField }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureClass(sql, data.classCode);
    const settings = await sql<{ grade: number; periodCount: number; cycleWeek: number }>`
      select
        grade,
        period_count as "periodCount",
        cycle_week as "cycleWeek"
      from classes
      where code = ${data.classCode}
    `;
    const textbooks = await sql<Textbook>`
      select subject, title from textbooks
      where class_code = ${data.classCode}
      order by subject
    `;
    const catalogRows = await sql<{ title: string }>`
      select title from textbook_catalog order by title
    `;
    return {
      code: data.classCode,
      grade: Number(settings[0]?.grade ?? 8),
      periodCount: Number(settings[0]?.periodCount ?? 8),
      cycleWeek: Number(settings[0]?.cycleWeek ?? 1) === 2 ? 2 : 1,
      textbooks,
      catalog: catalogRows.map((row) => row.title),
    } satisfies ClassConfig;
  });

export const updateClassSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      classCode: classCodeField,
      grade: z.number().int().min(7).max(11).optional(),
      periodCount: z.number().int().min(1).max(12).optional(),
      cycleWeek: z.number().int().min(1).max(2).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureClass(sql, data.classCode);
    const current = await sql<{ grade: number; periodCount: number; cycleWeek: number }>`
      select
        grade,
        period_count as "periodCount",
        cycle_week as "cycleWeek"
      from classes
      where code = ${data.classCode}
    `;
    const grade = data.grade ?? Number(current[0]?.grade ?? 8);
    const periodCount = data.periodCount ?? Number(current[0]?.periodCount ?? 8);
    const cycleWeek = data.cycleWeek ?? (Number(current[0]?.cycleWeek ?? 1) === 2 ? 2 : 1);

    await sql`
      update classes
      set grade = ${grade},
          period_count = ${periodCount},
          cycle_week = ${cycleWeek}
      where code = ${data.classCode}
    `;

    if (data.periodCount != null) {
      await sql`
        delete from timetable
        where class_code = ${data.classCode} and period > ${periodCount}
      `;
    }

    return { grade, periodCount, cycleWeek };
  });

export const upsertTextbook = createServerFn({ method: "POST" })
  .validator(
    z.object({
      classCode: classCodeField,
      subject: subjectName,
      title: z.string().trim().max(120),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureClass(sql, data.classCode);
    if (!data.title) {
      await sql`
        delete from textbooks
        where class_code = ${data.classCode} and subject = ${data.subject}
      `;
      return { ok: true as const };
    }
    await sql`
      insert into textbooks (class_code, subject, title)
      values (${data.classCode}, ${data.subject}, ${data.title})
      on conflict (class_code, subject) do update set title = excluded.title
    `;
    await sql`
      insert into textbook_catalog (title)
      values (${data.title})
      on conflict (title) do nothing
    `;
    return { ok: true as const };
  });
