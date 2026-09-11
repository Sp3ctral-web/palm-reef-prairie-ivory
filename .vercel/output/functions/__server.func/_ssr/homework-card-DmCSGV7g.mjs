import { o as __toESM } from "../_runtime.mjs";
import { m as require_react, n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as Check, r as Trash2 } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as formatDayMonth, M as useDeleteHomework, S as cn, a as DialogDescription, i as DialogContent, j as useClassStore, k as urgencyOf, n as Button, o as DialogHeader, r as Dialog, s as DialogTitle, v as URGENCY_LABEL } from "./app-shell-BQw0ptMW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/homework-card-DmCSGV7g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		overdue: "bg-overdue/10 text-overdue",
		today: "bg-today/10 text-today",
		tomorrow: "bg-tomorrow/10 text-tomorrow",
		later: "bg-muted text-later",
		past: "bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "badge",
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		"data-slot": "checkbox",
		className: cn("relative flex size-6 shrink-0 items-center justify-center rounded-xs border border-border bg-card text-primary-foreground outline-none transition-[background-color,border-color,transform] duration-150 after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
			className: "flex items-center justify-center text-current",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-3.5",
				strokeWidth: 3
			})
		})
	});
}
var badgeVariant = {
	overdue: "overdue",
	today: "today",
	tomorrow: "tomorrow",
	later: "later",
	past: "past"
};
function HomeworkCard({ item, today, compact = false, hideSubject = false }) {
	const isDone = useClassStore((s) => s.isDone(item.id));
	const toggleDone = useClassStore((s) => s.toggleDone);
	const remove = useDeleteHomework();
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const urgency = urgencyOf(item.dueOn, today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("shadow-card flex gap-3 rounded-lg bg-card p-4 transition-opacity duration-150", isDone && "opacity-55"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
				checked: isDone,
				onCheckedChange: () => toggleDone(item.id),
				"aria-label": isDone ? "Отметить как несделанное" : "Отметить как сделанное",
				className: "mt-0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [hideSubject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium text-foreground",
							children: item.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: badgeVariant[urgency],
							children: URGENCY_LABEL[urgency]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 text-sm leading-snug text-foreground", isDone && "line-through", compact && "line-clamp-2"),
						children: item.task
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"сдать ",
							formatDayMonth(item.dueOn),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								children: " · "
							}),
							"задали ",
							formatDayMonth(item.assignedOn),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								children: " · "
							}),
							item.addedBy
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setConfirm(true),
				className: "relative -mr-1 flex size-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-destructive",
				"aria-label": "Удалить задание",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: confirm,
				onOpenChange: setConfirm,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Удалить задание?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Его не станет на доске у всего класса. Это нельзя отменить." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setConfirm(false),
						children: "Оставить"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						disabled: remove.isPending,
						onClick: () => {
							remove.mutate(item.id, { onSuccess: () => setConfirm(false) });
						},
						children: "Удалить"
					})]
				})] })
			})
		]
	});
}
//#endregion
export { HomeworkCard as t };
