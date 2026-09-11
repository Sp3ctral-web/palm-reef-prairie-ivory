import { o as __toESM } from "../_runtime.mjs";
import { l as Slot, m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
import { a as Plus, d as BookMarked, l as CalendarDays, s as LayoutList, t as X, u as BookOpen } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-BQw0ptMW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:ring-2 focus-visible:ring-ring/30 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-muted text-foreground hover:bg-muted/80",
			outline: "border border-border bg-card text-foreground hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3",
			lg: "h-12 rounded-lg px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Drawer$1({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		shouldScaleBackground: false,
		...props
	});
}
function DrawerPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Portal, { ...props });
}
function DrawerOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, {
		className: cn("fixed inset-0 z-50 bg-foreground/30", className),
		...props
	});
}
function DrawerContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
		className: cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[92dvh] flex-col rounded-t-xl bg-card pb-safe text-card-foreground shadow-card outline-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" }), children]
	})] });
}
function DrawerHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-1 px-5 pt-4 pb-2", className),
		...props
	});
}
function DrawerTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DrawerDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Description, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		"data-slot": "label",
		className: cn("text-sm font-medium text-foreground peer-disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("min-h-24 w-full rounded-md border border-border bg-card px-3 py-2.5 text-base text-foreground outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-50", className),
		...props
	});
}
function parseISODate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function toISODate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function todayISO() {
	return toISODate(/* @__PURE__ */ new Date());
}
function addDaysISO(iso, days) {
	const date = parseISODate(iso);
	date.setDate(date.getDate() + days);
	return toISODate(date);
}
/** JS getDay(): 0 Sun … 6 Sat. School week is 1 Mon … 6 Sat. */
function schoolWeekday(iso) {
	const day = parseISODate(iso).getDay();
	return day === 0 ? null : day;
}
function weekdayName(weekday, width = "short") {
	return (width === "long" ? [
		"",
		"понедельник",
		"вторник",
		"среда",
		"четверг",
		"пятница",
		"суббота"
	] : [
		"",
		"пн",
		"вт",
		"ср",
		"чт",
		"пт",
		"сб"
	])[weekday] ?? "";
}
var WEEKDAY_HEADERS = [
	"пн",
	"вт",
	"ср",
	"чт",
	"пт",
	"сб",
	"вс"
];
function mondayOfWeek(iso) {
	const date = parseISODate(iso);
	const day = date.getDay();
	const offset = day === 0 ? -6 : 1 - day;
	date.setDate(date.getDate() + offset);
	return toISODate(date);
}
/** Current week (Mon–Sun) plus the next week — 14 days. */
function twoWeekDates(today) {
	const start = mondayOfWeek(today);
	return Array.from({ length: 14 }, (_, i) => addDaysISO(start, i));
}
function formatLongDate(iso) {
	return parseISODate(iso).toLocaleDateString("ru-RU", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
function formatDayMonth(iso) {
	const date = parseISODate(iso);
	const opts = {
		day: "numeric",
		month: "short"
	};
	if (date.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear()) opts.year = "numeric";
	return date.toLocaleDateString("ru-RU", opts);
}
function urgencyOf(dueOn, today) {
	if (dueOn === today) return "today";
	if (dueOn === addDaysISO(today, 1)) return "tomorrow";
	if (dueOn < today) return (parseISODate(today).getTime() - parseISODate(dueOn).getTime()) / 864e5 > 7 ? "past" : "overdue";
	return "later";
}
var URGENCY_ORDER = {
	overdue: 0,
	today: 1,
	tomorrow: 2,
	later: 3,
	past: 4
};
var URGENCY_LABEL = {
	overdue: "просрочено",
	today: "сегодня",
	tomorrow: "завтра",
	later: "позже",
	past: "было"
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var dateStr = string().regex(/^\d{4}-\d{2}-\d{2}$/);
var subjectName = string().trim().min(1).max(80);
var listHomework = createServerFn({ method: "GET" }).handler(createSsrRpc("3339ce3c63a2321b64e1b7ea55e2e901acb06f8a13135ad54f542a8c4b4cce48"));
var addHomework = createServerFn({ method: "POST" }).validator(object({
	subject: subjectName,
	task: string().trim().min(1).max(500),
	assignedOn: dateStr,
	dueOn: dateStr,
	addedBy: string().trim().min(1).max(24)
})).handler(createSsrRpc("6e3bb1206bb16e0550d73d56f5dde12b2efc7936bfc7c4f3bcc753a9a33e8abd"));
var deleteHomework = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(createSsrRpc("ff6fe2a401b09e8ad44c4955be6e5cfee45ed61b5113459c660a7d08b46e2ab2"));
var listTimetable = createServerFn({ method: "GET" }).handler(createSsrRpc("262d49883ecae5bedeee58c762c386553267c92db217ad9ce65bc15bfbfc2177"));
var upsertTimetableSlot = createServerFn({ method: "POST" }).validator(object({
	weekday: number().int().min(1).max(6),
	period: number().int().min(1).max(12),
	subject: string().trim().max(80)
})).handler(createSsrRpc("475c757d98234d2f71e306968b205f1c560002485ec17f2b8864e8d0f3ab3d99"));
var getClassConfig = createServerFn({ method: "GET" }).handler(createSsrRpc("9b886c05f70f71e4919895004711148f37358e18d092a428476c717cd830ba77"));
var updateClassSettings = createServerFn({ method: "POST" }).validator(object({
	grade: number().int().min(7).max(11).optional(),
	periodCount: number().int().min(1).max(12).optional()
})).handler(createSsrRpc("529c451c798a95e079c2d88a584c1b0159a72ff57faa1fb1ca9ba98a70d648e6"));
var upsertTextbook = createServerFn({ method: "POST" }).validator(object({
	subject: subjectName,
	title: string().trim().max(120)
})).handler(createSsrRpc("e2cabcfe508ab07dc09f2dca42e89678a16ccb5a890c289fa3461ff184bb9e97"));
var homeworkKey = ["homework"];
var timetableKey = ["timetable"];
var configKey = ["class-config"];
function useHomework() {
	return useQuery({
		queryKey: homeworkKey,
		queryFn: () => listHomework()
	});
}
function useTimetable() {
	return useQuery({
		queryKey: timetableKey,
		queryFn: () => listTimetable()
	});
}
function useClassConfig() {
	return useQuery({
		queryKey: configKey,
		queryFn: () => getClassConfig()
	});
}
function useAddHomework() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (input) => addHomework({ data: input }),
		onSuccess: (created) => {
			client.setQueryData(homeworkKey, (prev) => {
				const list = prev ?? [];
				if (list.some((item) => item.id === created.id)) return list;
				return [...list, created];
			});
			client.invalidateQueries({ queryKey: homeworkKey });
		}
	});
}
function useDeleteHomework() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (id) => deleteHomework({ data: { id } }),
		onSuccess: (_res, id) => {
			client.setQueryData(homeworkKey, (prev) => (prev ?? []).filter((item) => item.id !== id));
			client.invalidateQueries({ queryKey: homeworkKey });
		}
	});
}
function useUpsertSlot() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (input) => upsertTimetableSlot({ data: input }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: timetableKey });
		}
	});
}
function useUpdateSettings() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (input) => updateClassSettings({ data: input }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: configKey });
			client.invalidateQueries({ queryKey: timetableKey });
		}
	});
}
function useUpsertTextbook() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (input) => upsertTextbook({ data: input }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: configKey });
		}
	});
}
function slotsByDay(slots, weekday) {
	return (slots ?? []).filter((slot) => slot.weekday === weekday).sort((a, b) => a.period - b.period);
}
function classSubjects(slots, homework) {
	const names = [...(slots ?? []).map((s) => s.subject), ...(homework ?? []).map((h) => h.subject)];
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const name of names) {
		if (seen.has(name)) continue;
		seen.add(name);
		out.push(name);
	}
	return out;
}
function textbookMap(books) {
	const map = {};
	for (const book of books ?? []) map[book.subject] = book.title;
	return map;
}
var GRADES = [
	7,
	8,
	9,
	10,
	11
];
var GRADE_7 = [
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
	"Технология"
];
var GRADE_8 = [...GRADE_7, "Химия"];
var GRADE_9 = [
	...GRADE_8,
	"Құқық негіздері",
	"Алғашқы әскери және технологиялық дайындық (НВП)"
];
var GRADE_10_11 = [
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
	"Өзін-өзі тану"
];
function subjectsForGrade(grade) {
	if (grade === 7) return [...GRADE_7];
	if (grade === 8) return [...GRADE_8];
	if (grade === 9) return [...GRADE_9];
	return [...GRADE_10_11];
}
var GRADE_LABELS = {
	7: "7 сынып",
	8: "8 сынып",
	9: "9 сынып",
	10: "10 сынып",
	11: "11 сынып"
};
function uniqueSubjects(fromClass, gradeSubjects) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const name of [...gradeSubjects, ...fromClass]) {
		const trimmed = name.trim();
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		out.push(trimmed);
	}
	return out;
}
var STORAGE_KEY = "zadano-v1";
function writePersisted(state) {
	const payload = {
		name: state.name,
		done: state.done,
		notify: state.notifyEnabled
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
var useClassStore = create((set, get) => ({
	hydrated: false,
	name: "",
	done: {},
	notifyEnabled: false,
	addOpen: false,
	prefill: null,
	hydrate: () => {
		if (typeof window === "undefined") {
			set({ hydrated: true });
			return;
		}
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				set({
					name: parsed.name ?? "",
					done: parsed.done ?? {},
					notifyEnabled: Boolean(parsed.notify),
					hydrated: true
				});
				return;
			}
		} catch {}
		set({ hydrated: true });
	},
	setName: (name) => {
		set({ name });
		writePersisted(get());
	},
	isDone: (id) => Boolean(get().done[String(id)]),
	toggleDone: (id) => {
		const key = String(id);
		const next = { ...get().done };
		if (next[key]) delete next[key];
		else next[key] = true;
		set({ done: next });
		writePersisted(get());
	},
	setNotifyEnabled: (value) => {
		set({ notifyEnabled: value });
		writePersisted(get());
	},
	openAdd: (prefill) => set({
		addOpen: true,
		prefill: prefill ?? null
	}),
	closeAdd: () => set({
		addOpen: false,
		prefill: null
	})
}));
function AddHomeworkDrawer() {
	const open = useClassStore((s) => s.addOpen);
	const prefill = useClassStore((s) => s.prefill);
	const closeAdd = useClassStore((s) => s.closeAdd);
	const name = useClassStore((s) => s.name);
	const { data: slots } = useTimetable();
	const { data: homework } = useHomework();
	const { data: config } = useClassConfig();
	const add = useAddHomework();
	const today = todayISO();
	const dueDays = (0, import_react.useMemo)(() => twoWeekDates(today), [today]);
	const books = textbookMap(config?.textbooks);
	const subjects = (0, import_react.useMemo)(() => uniqueSubjects(classSubjects(slots, homework), subjectsForGrade(config?.grade ?? 8)), [
		slots,
		homework,
		config?.grade
	]);
	const [subject, setSubject] = (0, import_react.useState)("");
	const [task, setTask] = (0, import_react.useState)("");
	const [dueOn, setDueOn] = (0, import_react.useState)(addDaysISO(today, 1));
	const [customSubject, setCustomSubject] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTask("");
		setCustomSubject(false);
		setSubject(prefill?.subject ?? "");
		setDueOn(prefill?.dueOn ?? addDaysISO(todayISO(), 1));
	}, [open, prefill]);
	const canSubmit = subject.trim().length > 0 && task.trim().length > 0 && !add.isPending;
	const textbook = books[subject];
	function onSubmit(event) {
		event.preventDefault();
		if (!canSubmit) return;
		add.mutate({
			subject: subject.trim(),
			task: task.trim(),
			assignedOn: today,
			dueOn,
			addedBy: name || "класс"
		}, {
			onSuccess: () => {
				toast("Задание на доске");
				closeAdd();
			},
			onError: () => toast("Не получилось сохранить")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange: (next) => next ? null : closeAdd(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "Новое задание" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, { children: "Предмет, текст и день сдачи — этого хватит." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-4 overflow-y-auto px-5 pb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Предмет" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [subjects.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setSubject(item);
									setCustomSubject(false);
								},
								className: cn("h-9 rounded-full px-3 text-sm transition-colors duration-150", subject === item && !customSubject ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
								children: item
							}, item)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setCustomSubject(true);
									setSubject("");
								},
								className: cn("h-9 rounded-full px-3 text-sm transition-colors duration-150", customSubject ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
								children: "Другой"
							})]
						}),
						customSubject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							maxLength: 80,
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Название предмета",
							className: "h-11 w-full rounded-md border border-border bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
						}) : null,
						textbook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Оқулық: ", textbook]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "task",
						children: "Что задали"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "task",
						required: true,
						maxLength: 500,
						placeholder: "Номера, параграф, что принести",
						value: task,
						onChange: (e) => setTask(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Сдать — две недели" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-7 gap-1",
						children: [WEEKDAY_HEADERS.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
							children: label
						}, label)), dueDays.map((iso) => {
							const past = iso < today;
							const selected = dueOn === iso;
							const isToday = iso === today;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: past,
								onClick: () => setDueOn(iso),
								"aria-label": iso,
								className: cn("flex h-11 items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-150", selected && "bg-primary text-primary-foreground", !selected && isToday && "bg-muted font-medium text-primary", !selected && !isToday && !past && "bg-card text-foreground hover:bg-muted", past && "cursor-not-allowed text-muted-foreground/50"),
								children: parseISODate(iso).getDate()
							}, iso);
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					disabled: !canSubmit,
					children: add.isPending ? "Сохраняю…" : "Добавить на доску"
				})
			]
		})] })
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("h-11 w-full rounded-md border border-border bg-card px-3 text-base text-foreground outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-50", className),
		...props
	});
}
function NameGate() {
	const setName = useClassStore((s) => s.setName);
	const [value, setValue] = (0, import_react.useState)("");
	function onSubmit(event) {
		event.preventDefault();
		const name = value.trim();
		if (!name) return;
		setName(name.slice(0, 24));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium tracking-wide text-primary uppercase",
				children: "Доска класса"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl font-medium tracking-tight text-foreground",
				children: "Задано"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-muted-foreground",
				children: "Общая тетрадь домашних заданий. Без пароля — все видят одно и то же. Имя нужно, чтобы одноклассники знали, кто записал задание."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Как тебя зовут?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						autoFocus: true,
						autoComplete: "given-name",
						placeholder: "Например, Аня",
						maxLength: 24,
						value,
						onChange: (e) => setValue(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: !value.trim(),
						children: "Открыть доску"
					})
				]
			})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-foreground/30", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-5 text-card-foreground shadow-card outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 flex size-9 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Закрыть"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
var NAV = [
	{
		to: "/",
		label: "Сегодня",
		icon: BookOpen
	},
	{
		to: "/board",
		label: "Доска",
		icon: LayoutList
	},
	{
		to: "/schedule",
		label: "Уроки",
		icon: CalendarDays
	},
	{
		to: "/books",
		label: "Оқулықтар",
		icon: BookMarked
	}
];
function AppShell({ children }) {
	const hydrated = useClassStore((s) => s.hydrated);
	const name = useClassStore((s) => s.name);
	const hydrate = useClassStore((s) => s.hydrate);
	const setName = useClassStore((s) => s.setName);
	const openAdd = useClassStore((s) => s.openAdd);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [renameOpen, setRenameOpen] = (0, import_react.useState)(false);
	const [renameValue, setRenameValue] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl font-medium tracking-tight",
				children: "Задано"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-lg" })
		]
	});
	if (!name) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameGate, {});
	function submitRename(event) {
		event.preventDefault();
		const next = renameValue.trim();
		if (!next) return;
		setName(next.slice(0, 24));
		setRenameOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border/70 bg-background/95 pt-safe",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-medium tracking-tight leading-none",
								children: "Задано"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs capitalize text-muted-foreground",
								children: formatLongDate(todayISO())
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: [NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname === item.to;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("inline-flex h-9 items-center rounded-full px-3 text-sm font-medium", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"),
									children: item.label
								}, item.to);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "ml-2 rounded-full",
								onClick: () => openAdd(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "ДЗ"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setRenameValue(name);
								setRenameOpen(true);
							},
							className: "flex size-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground",
							"aria-label": "Сменить имя",
							title: name,
							children: name.slice(0, 1).toUpperCase()
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-3xl px-4 pt-4 pb-28",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "lg",
				onClick: () => openAdd(),
				className: "fixed right-4 bottom-24 z-30 h-12 rounded-full px-5 shadow-card md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "ДЗ"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-safe md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-lg grid-cols-4",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium", active ? "text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.8
							}), item.label]
						}) }, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: renameOpen,
				onOpenChange: setRenameOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Твоё имя на доске" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Так одноклассники видят, кто записал задание." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitRename,
					className: "mt-4 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: renameValue,
						maxLength: 24,
						onChange: (e) => setRenameValue(e.target.value),
						autoFocus: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: !renameValue.trim(),
						children: "Сохранить"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddHomeworkDrawer, {})
		]
	});
}
//#endregion
export { useClassConfig as A, formatDayMonth as C, textbookMap as D, subjectsForGrade as E, useUpdateSettings as F, useUpsertSlot as I, useUpsertTextbook as L, useDeleteHomework as M, useHomework as N, todayISO as O, useTimetable as P, weekdayName as R, cn as S, slotsByDay as T, Skeleton as _, DialogDescription as a, addDaysISO as b, Drawer$1 as c, DrawerHeader as d, DrawerTitle as f, Label as g, Input as h, DialogContent as i, useClassStore as j, urgencyOf as k, DrawerContent as l, GRADE_LABELS as m, Button as n, DialogHeader as o, GRADES as p, Dialog as r, DialogTitle as s, AppShell as t, DrawerDescription as u, URGENCY_LABEL as v, schoolWeekday as w, classSubjects as x, URGENCY_ORDER as y };
