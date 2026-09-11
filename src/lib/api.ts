import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
  weekday: number;
  period: number;
  subject: string;
};

export type Textbook = {
  subject: string;
  title: string;
};

export type ClassConfig = {
  grade: number;
  periodCount: number;
  textbooks: Textbook[];
  catalog: string[];
};

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const subjectName = z.string().trim().min(1).max(80);

export const listHomework = createServerFn({ method: "GET" }).handler(async () => {
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
    order by due_on asc, id asc
  `;
});

export const addHomework = createServerFn({ method: "POST" })
  .validator(
    z.object({
      subject: subjectName,
      task: z.string().trim().min(1).max(500),
      assignedOn: dateStr,
      dueOn: dateStr,
      addedBy: z.string().trim().min(1).max(24),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<Homework>`
      insert into homework (subject, task, assigned_on, due_on, added_by)
      values (
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
    const created = rows[0];
    if (!created) throw new Error("Не удалось сохранить задание");
    return created;
  });

export const deleteHomework = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from homework where id = ${data.id}`;
    return { ok: true as const };
  });

export const listTimetable = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<TimetableSlot>`
    select id, weekday, period, subject
    from timetable
    order by weekday asc, period asc
  `;
});

export const upsertTimetableSlot = createServerFn({ method: "POST" })
  .validator(
    z.object({
      weekday: z.number().int().min(1).max(6),
      period: z.number().int().min(1).max(12),
      subject: z.string().trim().max(80),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!data.subject) {
      await sql`
        delete from timetable
        where weekday = ${data.weekday} and period = ${data.period}
      `;
      return { ok: true as const };
    }
    await sql`
      insert into timetable (weekday, period, subject)
      values (${data.weekday}, ${data.period}, ${data.subject})
      on conflict (weekday, period)
      do update set subject = excluded.subject
    `;
    return { ok: true as const };
  });

export const getClassConfig = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const settings = await sql<{ grade: number; periodCount: number }>`
    select grade, period_count as "periodCount"
    from class_settings
    where id = 1
  `;
  const textbooks = await sql<Textbook>`
    select subject, title from textbooks order by subject
  `;
  const catalogRows = await sql<{ title: string }>`
    select title from textbook_catalog order by title
  `;
  return {
    grade: Number(settings[0]?.grade ?? 8),
    periodCount: Number(settings[0]?.periodCount ?? 8),
    textbooks,
    catalog: catalogRows.map((row) => row.title),
  } satisfies ClassConfig;
});

export const updateClassSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      grade: z.number().int().min(7).max(11).optional(),
      periodCount: z.number().int().min(1).max(12).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const current = await sql<{ grade: number; periodCount: number }>`
      select grade, period_count as "periodCount"
      from class_settings
      where id = 1
    `;
    const grade = data.grade ?? Number(current[0]?.grade ?? 8);
    const periodCount = data.periodCount ?? Number(current[0]?.periodCount ?? 8);

    await sql`
      insert into class_settings (id, grade, period_count)
      values (1, ${grade}, ${periodCount})
      on conflict (id) do update
        set grade = excluded.grade,
            period_count = excluded.period_count
    `;

    if (data.periodCount != null) {
      await sql`delete from timetable where period > ${periodCount}`;
    }

    return { grade, periodCount };
  });

export const upsertTextbook = createServerFn({ method: "POST" })
  .validator(
    z.object({
      subject: subjectName,
      title: z.string().trim().max(120),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!data.title) {
      await sql`delete from textbooks where subject = ${data.subject}`;
      return { ok: true as const };
    }
    await sql`
      insert into textbooks (subject, title)
      values (${data.subject}, ${data.title})
      on conflict (subject) do update set title = excluded.title
    `;
    await sql`
      insert into textbook_catalog (title)
      values (${data.title})
      on conflict (title) do nothing
    `;
    return { ok: true as const };
  });
