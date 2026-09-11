import { o as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as Search } from "../_libs/lucide-react.mjs";
import { N as useHomework, O as todayISO, P as useTimetable, S as cn, _ as Skeleton, b as addDaysISO, h as Input, j as useClassStore, k as urgencyOf, t as AppShell, x as classSubjects, y as URGENCY_ORDER } from "./app-shell-BQw0ptMW.mjs";
import { t as HomeworkCard } from "./homework-card-DmCSGV7g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-BP3i0jvc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
	{
		key: "overdue",
		title: "Просрочено"
	},
	{
		key: "today",
		title: "Сегодня"
	},
	{
		key: "tomorrow",
		title: "Завтра"
	},
	{
		key: "later",
		title: "Потом"
	},
	{
		key: "past",
		title: "Архив"
	}
];
function BoardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardBody, {}) });
}
function BoardBody() {
	const { data: homework, isPending } = useHomework();
	const { data: timetable } = useTimetable();
	const done = useClassStore((s) => s.done);
	const [query, setQuery] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)(null);
	const today = todayISO();
	const horizon = addDaysISO(today, -7);
	const subjects = (0, import_react.useMemo)(() => classSubjects(timetable, homework), [timetable, homework]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return (homework ?? []).filter((item) => {
			if (subject && item.subject !== subject) return false;
			if (q) return `${item.subject} ${item.task} ${item.addedBy}`.toLowerCase().includes(q);
			if (item.dueOn >= horizon) return true;
			return !done[String(item.id)];
		}).sort((a, b) => {
			const ua = URGENCY_ORDER[urgencyOf(a.dueOn, today)];
			const ub = URGENCY_ORDER[urgencyOf(b.dueOn, today)];
			if (ua !== ub) return ua - ub;
			const aDone = Boolean(done[String(a.id)]);
			if (aDone !== Boolean(done[String(b.id)])) return aDone ? 1 : -1;
			return a.dueOn.localeCompare(b.dueOn) || a.subject.localeCompare(b.subject, "ru");
		});
	}, [
		homework,
		query,
		subject,
		today,
		horizon,
		done
	]);
	const grouped = SECTIONS.map((section) => ({
		...section,
		items: filtered.filter((item) => urgencyOf(item.dueOn, today) === section.key)
	})).filter((section) => {
		if (section.items.length === 0) return false;
		if (!query && section.key === "past") return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Найти старое ДЗ",
					className: "pl-9",
					type: "search",
					enterKeyHint: "search"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: subject === null,
					onClick: () => setSubject(null),
					children: "Все"
				}), subjects.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: subject === name,
					onClick: () => setSubject(subject === name ? null : name),
					children: name
				}, name))]
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-lg" })]
			}) : grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: query ? "Ничего не нашлось. Попробуй другое слово." : "На доске пока пусто."
			}) : grouped.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: section.title
				}), section.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeworkCard, {
					item,
					today
				}, item.id))]
			}, section.key))
		]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-sm transition-colors duration-150", active ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-card"),
		children
	});
}
//#endregion
export { BoardPage as component };
