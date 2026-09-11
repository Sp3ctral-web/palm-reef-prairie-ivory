import { o as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as Plus, f as Bell } from "../_libs/lucide-react.mjs";
import { A as useClassConfig, D as textbookMap, N as useHomework, O as todayISO, P as useTimetable, R as weekdayName, S as cn, T as slotsByDay, _ as Skeleton, b as addDaysISO, j as useClassStore, k as urgencyOf, n as Button, t as AppShell, w as schoolWeekday } from "./app-shell-BQw0ptMW.mjs";
import { t as HomeworkCard } from "./homework-card-DmCSGV7g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cb_lmQGZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LessonList({ title, empty, slots, homework, today, dueOn, includeOverdue = false }) {
	const openAdd = useClassStore((s) => s.openAdd);
	const { data: config } = useClassConfig();
	const books = textbookMap(config?.textbooks);
	if (slots.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-medium tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: empty
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-medium tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-2",
			children: slots.map((slot) => {
				const items = homework.filter((item) => {
					if (item.subject !== slot.subject) return false;
					if (item.dueOn === dueOn) return true;
					if (includeOverdue && urgencyOf(item.dueOn, today) === "overdue") return true;
					return false;
				});
				const book = books[slot.subject];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-3 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-5 text-right font-medium tabular-nums text-muted-foreground",
							children: slot.period
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: slot.subject
							}), book ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs text-muted-foreground",
								children: book
							}) : null]
						})]
					}), items.length > 0 ? items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeworkCard, {
						item,
						today,
						compact: true,
						hideSubject: true
					}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openAdd({
							subject: slot.subject,
							dueOn
						}),
						className: cn("shadow-card ml-8 flex h-11 items-center justify-between rounded-md bg-card px-3 text-left text-sm text-muted-foreground"),
						children: ["Ничего не задано", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "ДЗ"]
						})]
					})]
				}, `${slot.weekday}-${slot.period}`);
			})
		})]
	});
}
function ExtraHomework({ items, today }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-medium tracking-tight",
			children: "Ещё к сдаче"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeworkCard, {
				item,
				today,
				compact: true
			}, item.id))
		})]
	});
}
function dueTomorrowUndone(items, today, done) {
	const tomorrow = addDaysISO(today, 1);
	return items.filter((item) => item.dueOn === tomorrow && !done[String(item.id)]);
}
function useDeadlineNotifications(items) {
	const notifyEnabled = useClassStore((s) => s.notifyEnabled);
	const done = useClassStore((s) => s.done);
	(0, import_react.useEffect)(() => {
		if (!notifyEnabled || !items || typeof window === "undefined") return;
		if (!("Notification" in window) || Notification.permission !== "granted") return;
		const today = todayISO();
		const key = `zadano-notified-${today}`;
		if (localStorage.getItem(key)) return;
		const due = dueTomorrowUndone(items, today, done);
		if (due.length === 0) return;
		const body = due.length === 1 ? `Завтра сдать: ${due[0].subject} — ${due[0].task}` : `Завтра сдать ${due.length} ${due.length < 5 ? "задания" : "заданий"}`;
		try {
			new Notification("Задано", {
				body,
				lang: "ru"
			});
			localStorage.setItem(key, "1");
		} catch {}
	}, [
		items,
		notifyEnabled,
		done
	]);
}
function ReminderBanner({ items }) {
	const done = useClassStore((s) => s.done);
	const notifyEnabled = useClassStore((s) => s.notifyEnabled);
	const setNotifyEnabled = useClassStore((s) => s.setNotifyEnabled);
	const due = dueTomorrowUndone(items, todayISO(), done);
	async function enable() {
		if (!("Notification" in window)) return;
		const permission = await Notification.requestPermission();
		setNotifyEnabled(permission === "granted");
	}
	if (due.length === 0 && notifyEnabled) return null;
	if (due.length === 0) {
		if (notifyEnabled || typeof Notification === "undefined") return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shadow-card flex items-center justify-between gap-3 rounded-lg bg-card px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Можно включить напоминание за день до сдачи."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => void enable(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-3.5" }), "Вкл"]
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shadow-card flex flex-col gap-2 rounded-lg bg-card px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-tomorrow",
				children: "Завтра сдать"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm text-foreground",
				children: due.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "truncate",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: item.subject
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [" — ", item.task]
					})]
				}, item.id))
			}),
			!notifyEnabled && typeof Notification !== "undefined" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void enable(),
				className: "self-start text-xs font-medium text-primary",
				children: "Присылать такое напоминание"
			}) : null
		]
	});
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeBody, {}) });
}
function HomeBody() {
	const { data: homework, isPending: hwPending } = useHomework();
	const { data: timetable, isPending: ttPending } = useTimetable();
	const done = useClassStore((s) => s.done);
	const today = todayISO();
	const tomorrow = addDaysISO(today, 1);
	const todayWeekday = schoolWeekday(today);
	const tomorrowWeekday = schoolWeekday(tomorrow);
	useDeadlineNotifications(homework);
	if (hwPending || ttPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-lg" })
		]
	});
	const todaySlots = todayWeekday ? slotsByDay(timetable, todayWeekday) : [];
	const tomorrowSlots = tomorrowWeekday ? slotsByDay(timetable, tomorrowWeekday) : [];
	const todaySubjects = new Set(todaySlots.map((s) => s.subject));
	new Set(tomorrowSlots.map((s) => s.subject));
	const extra = (homework ?? []).filter((item) => {
		if (done[String(item.id)] && item.dueOn < today) return false;
		if (item.dueOn < today) return !todaySubjects.has(item.subject);
		if (item.dueOn === today && !todaySubjects.has(item.subject)) return true;
		return false;
	});
	const todayTitle = todayWeekday ? `Сегодня, ${weekdayName(todayWeekday)}` : "Сегодня";
	const tomorrowTitle = tomorrowWeekday ? `Завтра, ${weekdayName(tomorrowWeekday)}` : "Завтра";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReminderBanner, { items: homework ?? [] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonList, {
				title: todayTitle,
				empty: "Сегодня уроков нет — выходной.",
				slots: todaySlots,
				homework: homework ?? [],
				today,
				dueOn: today,
				includeOverdue: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonList, {
				title: tomorrowTitle,
				empty: "Завтра уроков нет.",
				slots: tomorrowSlots,
				homework: homework ?? [],
				today,
				dueOn: tomorrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtraHomework, {
				items: extra,
				today
			})
		]
	});
}
//#endregion
export { HomePage as component };
