import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CVkeB4Yp.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_classboard_default = "-- Shared class homework board + weekly timetable (unowned rows, no accounts).\ncreate table if not exists homework (\n  id          serial primary key,\n  subject     text not null,\n  task        text not null,\n  assigned_on date not null,\n  due_on      date not null,\n  added_by    text not null,\n  created_at  timestamptz not null default now()\n);\n\ncreate index if not exists homework_due_on_idx on homework (due_on);\ncreate index if not exists homework_subject_idx on homework (subject);\n\ncreate table if not exists timetable (\n  id       serial primary key,\n  weekday  smallint not null check (weekday between 1 and 6),\n  period   smallint not null check (period between 1 and 8),\n  subject  text not null,\n  unique (weekday, period)\n);\n\n-- Demo class: typical 8th-grade week. Dates are relative so the preview\n-- always has today / tomorrow / overdue items.\ninsert into timetable (weekday, period, subject)\nselect * from (values\n  (1, 1, 'Русский язык'),\n  (1, 2, 'Алгебра'),\n  (1, 3, 'История'),\n  (1, 4, 'Физика'),\n  (1, 5, 'Английский'),\n  (1, 6, 'Физкультура'),\n  (2, 1, 'Литература'),\n  (2, 2, 'Геометрия'),\n  (2, 3, 'Химия'),\n  (2, 4, 'Биология'),\n  (2, 5, 'Обществознание'),\n  (2, 6, 'Информатика'),\n  (3, 1, 'Алгебра'),\n  (3, 2, 'Русский язык'),\n  (3, 3, 'География'),\n  (3, 4, 'Физика'),\n  (3, 5, 'Английский'),\n  (3, 6, 'История'),\n  (4, 1, 'Геометрия'),\n  (4, 2, 'Литература'),\n  (4, 3, 'Химия'),\n  (4, 4, 'ОБЖ'),\n  (4, 5, 'Биология'),\n  (4, 6, 'Физкультура'),\n  (5, 1, 'Русский язык'),\n  (5, 2, 'Алгебра'),\n  (5, 3, 'Информатика'),\n  (5, 4, 'Обществознание'),\n  (5, 5, 'Английский'),\n  (5, 6, 'География'),\n  (6, 1, 'История'),\n  (6, 2, 'Геометрия'),\n  (6, 3, 'Физкультура'),\n  (6, 4, 'Технология')\n) as seed(weekday, period, subject)\nwhere not exists (select 1 from timetable);\n\ninsert into homework (subject, task, assigned_on, due_on, added_by)\nselect * from (values\n  ('Алгебра', '№ 124–128, учебник стр. 46. В тетради с проверкой.', current_date - 1, current_date, 'Аня'),\n  ('История', 'Параграф 12, таблица «Реформы» — устно.', current_date - 2, current_date, 'Максим'),\n  ('Русский язык', 'Сочинение «Осень в городе», 1 страница.', current_date - 1, current_date + 1, 'Лера'),\n  ('Английский', 'Workbook p. 34, ex. 2–5. Выучить слова Unit 3.', current_date - 3, current_date + 1, 'Аня'),\n  ('Физика', 'Задачи 18, 19 из карточки. Формулы в тетрадь.', current_date - 5, current_date - 1, 'Максим'),\n  ('Геометрия', '№ 231, 232 (подобие треугольников). Чертёж обязателен.', current_date, current_date + 3, 'Лера'),\n  ('Химия', 'Уравнения реакций 1–8, стр. 51.', current_date - 1, current_date + 4, 'Аня'),\n  ('Биология', 'Конспект §9 «Клетка». Рисунок подписать.', current_date - 4, current_date + 2, 'Максим'),\n  ('История', 'Параграф 8, конспект в тетрадь.', current_date - 22, current_date - 20, 'Лера'),\n  ('Физика', 'Лабораторная «Сила трения» — отчёт.', current_date - 14, current_date - 11, 'Аня'),\n  ('Литература', 'Выучить отрывок из «Капитанской дочки», стр. 88–89.', current_date - 8, current_date - 6, 'Максим'),\n  ('Информатика', 'Практическая: таблица в Google Sheets, 15 строк.', current_date - 2, current_date + 6, 'Лера')\n) as seed(subject, task, assigned_on, due_on, added_by)\nwhere not exists (select 1 from homework);\n";
var _0003_grade_textbooks_default = "-- Two-week due dates stay in the client. Schema: 12 periods max,\n-- class grade, shared textbook catalog (unowned rows).\n\nalter table timetable drop constraint if exists timetable_period_check;\nalter table timetable add constraint timetable_period_check check (period between 1 and 12);\n\ncreate table if not exists class_settings (\n  id           smallint primary key default 1 check (id = 1),\n  grade        smallint not null default 8 check (grade between 7 and 11),\n  period_count smallint not null default 8 check (period_count between 1 and 12)\n);\n\ninsert into class_settings (id, grade, period_count)\nvalues (1, 8, 8)\non conflict (id) do nothing;\n\ncreate table if not exists textbooks (\n  subject text primary key,\n  title   text not null\n);\n\ncreate table if not exists textbook_catalog (\n  title text primary key\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_classboard.sql": _0002_classboard_default,
			"/migrations/0003_grade_textbooks.sql": _0003_grade_textbooks_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var dateStr = string().regex(/^\d{4}-\d{2}-\d{2}$/);
var subjectName = string().trim().min(1).max(80);
var listHomework_createServerFn_handler = createServerRpc({
	id: "3339ce3c63a2321b64e1b7ea55e2e901acb06f8a13135ad54f542a8c4b4cce48",
	name: "listHomework",
	filename: "src/lib/api.ts"
}, (opts) => listHomework.__executeServer(opts));
var listHomework = createServerFn({ method: "GET" }).handler(listHomework_createServerFn_handler, async () => {
	return (await getSql())`
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
var addHomework_createServerFn_handler = createServerRpc({
	id: "6e3bb1206bb16e0550d73d56f5dde12b2efc7936bfc7c4f3bcc753a9a33e8abd",
	name: "addHomework",
	filename: "src/lib/api.ts"
}, (opts) => addHomework.__executeServer(opts));
var addHomework = createServerFn({ method: "POST" }).validator(object({
	subject: subjectName,
	task: string().trim().min(1).max(500),
	assignedOn: dateStr,
	dueOn: dateStr,
	addedBy: string().trim().min(1).max(24)
})).handler(addHomework_createServerFn_handler, async ({ data }) => {
	const created = (await (await getSql())`
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
    `)[0];
	if (!created) throw new Error("Не удалось сохранить задание");
	return created;
});
var deleteHomework_createServerFn_handler = createServerRpc({
	id: "ff6fe2a401b09e8ad44c4955be6e5cfee45ed61b5113459c660a7d08b46e2ab2",
	name: "deleteHomework",
	filename: "src/lib/api.ts"
}, (opts) => deleteHomework.__executeServer(opts));
var deleteHomework = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(deleteHomework_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from homework where id = ${data.id}`;
	return { ok: true };
});
var listTimetable_createServerFn_handler = createServerRpc({
	id: "262d49883ecae5bedeee58c762c386553267c92db217ad9ce65bc15bfbfc2177",
	name: "listTimetable",
	filename: "src/lib/api.ts"
}, (opts) => listTimetable.__executeServer(opts));
var listTimetable = createServerFn({ method: "GET" }).handler(listTimetable_createServerFn_handler, async () => {
	return (await getSql())`
    select id, weekday, period, subject
    from timetable
    order by weekday asc, period asc
  `;
});
var upsertTimetableSlot_createServerFn_handler = createServerRpc({
	id: "475c757d98234d2f71e306968b205f1c560002485ec17f2b8864e8d0f3ab3d99",
	name: "upsertTimetableSlot",
	filename: "src/lib/api.ts"
}, (opts) => upsertTimetableSlot.__executeServer(opts));
var upsertTimetableSlot = createServerFn({ method: "POST" }).validator(object({
	weekday: number().int().min(1).max(6),
	period: number().int().min(1).max(12),
	subject: string().trim().max(80)
})).handler(upsertTimetableSlot_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!data.subject) {
		await sql`
        delete from timetable
        where weekday = ${data.weekday} and period = ${data.period}
      `;
		return { ok: true };
	}
	await sql`
      insert into timetable (weekday, period, subject)
      values (${data.weekday}, ${data.period}, ${data.subject})
      on conflict (weekday, period)
      do update set subject = excluded.subject
    `;
	return { ok: true };
});
var getClassConfig_createServerFn_handler = createServerRpc({
	id: "9b886c05f70f71e4919895004711148f37358e18d092a428476c717cd830ba77",
	name: "getClassConfig",
	filename: "src/lib/api.ts"
}, (opts) => getClassConfig.__executeServer(opts));
var getClassConfig = createServerFn({ method: "GET" }).handler(getClassConfig_createServerFn_handler, async () => {
	const sql = await getSql();
	const settings = await sql`
    select grade, period_count as "periodCount"
    from class_settings
    where id = 1
  `;
	const textbooks = await sql`
    select subject, title from textbooks order by subject
  `;
	const catalogRows = await sql`
    select title from textbook_catalog order by title
  `;
	return {
		grade: Number(settings[0]?.grade ?? 8),
		periodCount: Number(settings[0]?.periodCount ?? 8),
		textbooks,
		catalog: catalogRows.map((row) => row.title)
	};
});
var updateClassSettings_createServerFn_handler = createServerRpc({
	id: "529c451c798a95e079c2d88a584c1b0159a72ff57faa1fb1ca9ba98a70d648e6",
	name: "updateClassSettings",
	filename: "src/lib/api.ts"
}, (opts) => updateClassSettings.__executeServer(opts));
var updateClassSettings = createServerFn({ method: "POST" }).validator(object({
	grade: number().int().min(7).max(11).optional(),
	periodCount: number().int().min(1).max(12).optional()
})).handler(updateClassSettings_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const current = await sql`
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
	if (data.periodCount != null) await sql`delete from timetable where period > ${periodCount}`;
	return {
		grade,
		periodCount
	};
});
var upsertTextbook_createServerFn_handler = createServerRpc({
	id: "e2cabcfe508ab07dc09f2dca42e89678a16ccb5a890c289fa3461ff184bb9e97",
	name: "upsertTextbook",
	filename: "src/lib/api.ts"
}, (opts) => upsertTextbook.__executeServer(opts));
var upsertTextbook = createServerFn({ method: "POST" }).validator(object({
	subject: subjectName,
	title: string().trim().max(120)
})).handler(upsertTextbook_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!data.title) {
		await sql`delete from textbooks where subject = ${data.subject}`;
		return { ok: true };
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
	return { ok: true };
});
//#endregion
export { addHomework_createServerFn_handler, deleteHomework_createServerFn_handler, getClassConfig_createServerFn_handler, listHomework_createServerFn_handler, listTimetable_createServerFn_handler, updateClassSettings_createServerFn_handler, upsertTextbook_createServerFn_handler, upsertTimetableSlot_createServerFn_handler };
