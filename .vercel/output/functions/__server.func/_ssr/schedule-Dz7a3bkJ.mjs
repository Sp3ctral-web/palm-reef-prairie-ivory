import { o as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, o as Minus } from "../_libs/lucide-react.mjs";
import { A as useClassConfig, D as textbookMap, E as subjectsForGrade, F as useUpdateSettings, I as useUpsertSlot, O as todayISO, P as useTimetable, R as weekdayName, S as cn, _ as Skeleton, c as Drawer$1, d as DrawerHeader, f as DrawerTitle, j as useClassStore, l as DrawerContent, n as Button, t as AppShell, u as DrawerDescription, w as schoolWeekday } from "./app-shell-BQw0ptMW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-Dz7a3bkJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAYS = [
	1,
	2,
	3,
	4,
	5,
	6
];
var MAX_PERIODS = 12;
var MIN_PERIODS = 1;
function SchedulePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleBody, {}) });
}
function ScheduleBody() {
	const { data: slots, isPending } = useTimetable();
	const { data: config } = useClassConfig();
	const upsert = useUpsertSlot();
	const updateSettings = useUpdateSettings();
	const openAdd = useClassStore((s) => s.openAdd);
	const todayWeekday = schoolWeekday(todayISO());
	const [day, setDay] = (0, import_react.useState)(todayWeekday ?? 1);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [customSubject, setCustomSubject] = (0, import_react.useState)("");
	const periodCount = config?.periodCount ?? 8;
	const periods = (0, import_react.useMemo)(() => Array.from({ length: periodCount }, (_, i) => i + 1), [periodCount]);
	const gradeSubjects = subjectsForGrade(config?.grade ?? 8);
	const books = textbookMap(config?.textbooks);
	const grid = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const slot of slots ?? []) map.set(`${slot.weekday}-${slot.period}`, slot.subject);
		return map;
	}, [slots]);
	function subjectAt(weekday, period) {
		return grid.get(`${weekday}-${period}`) ?? "";
	}
	function pickSubject(name) {
		if (!editing) return;
		upsert.mutate({
			weekday: editing.weekday,
			period: editing.period,
			subject: name
		}, { onSuccess: () => setEditing(null) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-medium tracking-tight",
					children: "Расписание"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						periodCount,
						" уроков ·",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/books",
							className: "text-primary",
							children: [config?.grade ?? 8, " сынып, учебники"]
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:hidden",
				children: DAYS.map((weekday) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setDay(weekday),
					className: cn("h-9 min-w-11 shrink-0 rounded-full px-3 text-sm capitalize", day === weekday ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-card"),
					children: weekdayName(weekday)
				}, weekday))
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 rounded-lg" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex flex-col gap-2 md:hidden",
					children: periods.map((period) => {
						const subject = subjectAt(day, period);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setCustomSubject("");
								setEditing({
									weekday: day,
									period,
									subject
								});
							},
							className: "shadow-card flex min-h-14 w-full items-center gap-3 rounded-lg bg-card px-3 py-2 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-5 text-right text-sm font-medium tabular-nums text-muted-foreground",
								children: period
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("block text-sm font-medium", !subject && "text-muted-foreground"),
									children: subject || "Пусто"
								}), subject && books[subject] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: books[subject]
								}) : null]
							})]
						}) }, period);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shadow-card hidden overflow-hidden rounded-xl bg-card md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full table-fixed text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "w-10 py-3 text-center font-medium",
								children: " "
							}), DAYS.map((weekday) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: cn("py-3 text-center font-medium capitalize", weekday === todayWeekday && "text-primary"),
								children: weekdayName(weekday)
							}, weekday))]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: periods.map((period) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1 text-center text-muted-foreground tabular-nums",
								children: period
							}), DAYS.map((weekday) => {
								const subject = subjectAt(weekday, period);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setCustomSubject("");
											setEditing({
												weekday,
												period,
												subject
											});
										},
										className: cn("flex min-h-12 w-full flex-col items-center justify-center rounded-sm px-1 text-center", subject ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60", weekday === todayWeekday && subject && "bg-primary/10 text-primary"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-medium",
											children: subject || "—"
										}), subject && books[subject] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 line-clamp-1 text-[10px] text-muted-foreground",
											children: books[subject]
										}) : null]
									})
								}, weekday);
							})]
						}, period)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "flex-1",
						disabled: periodCount <= MIN_PERIODS || updateSettings.isPending,
						onClick: () => updateSettings.mutate({ periodCount: periodCount - 1 }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" }), "Убрать урок"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "flex-1",
						disabled: periodCount >= MAX_PERIODS || updateSettings.isPending,
						onClick: () => updateSettings.mutate({ periodCount: periodCount + 1 }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Ещё урок"]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
				open: Boolean(editing),
				onOpenChange: (open) => {
					if (!open) setEditing(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: editing ? `${editing.period} урок, ${weekdayName(editing.weekday, "long")}` : "Урок" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, { children: "Выбери предмет или оставь клетку пустой." })] }), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 overflow-y-auto px-5 pb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: gradeSubjects.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => pickSubject(name),
								className: cn("h-9 rounded-full px-3 text-sm", editing.subject === name ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
								children: name
							}, name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								maxLength: 80,
								value: customSubject,
								onChange: (e) => setCustomSubject(e.target.value),
								placeholder: "Другой предмет",
								className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								disabled: !customSubject.trim(),
								onClick: () => pickSubject(customSubject.trim()),
								children: "Ок"
							})]
						}),
						editing.subject && books[editing.subject] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Оқулық: ", books[editing.subject]]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "flex-1",
								onClick: () => pickSubject(""),
								children: "Очистить"
							}), editing.subject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: () => {
									openAdd({ subject: editing.subject });
									setEditing(null);
								},
								children: "Задать ДЗ"
							}) : null]
						})
					]
				}) : null] })
			})
		]
	});
}
//#endregion
export { SchedulePage as component };
