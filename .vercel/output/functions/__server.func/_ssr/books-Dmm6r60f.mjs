import { o as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as useClassConfig, D as textbookMap, E as subjectsForGrade, F as useUpdateSettings, L as useUpsertTextbook, S as cn, _ as Skeleton, g as Label, h as Input, m as GRADE_LABELS, p as GRADES, t as AppShell } from "./app-shell-BQw0ptMW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/books-Dmm6r60f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BooksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BooksBody, {}) });
}
function BooksBody() {
	const { data: config, isPending } = useClassConfig();
	const updateSettings = useUpdateSettings();
	const upsert = useUpsertTextbook();
	const grade = config?.grade ?? 8;
	const subjects = subjectsForGrade(grade);
	const books = textbookMap(config?.textbooks);
	const catalog = config?.catalog ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl font-medium tracking-tight",
				children: "Оқулықтар"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Справочник класса: предметы по сыныпу и учебник к каждому. Можно выбрать уже добавленное название или вписать своё."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Сынып" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1",
					children: GRADES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => updateSettings.mutate({ grade: value }),
						className: cn("h-9 shrink-0 rounded-full px-3 text-sm", grade === value ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-card"),
						children: GRADE_LABELS[value]
					}, value))
				})]
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-lg" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-lg" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-lg" })
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-2",
				children: subjects.map((subject) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextbookRow, {
					subject,
					title: books[subject] ?? "",
					catalog,
					saving: upsert.isPending,
					onSave: (title) => {
						upsert.mutate({
							subject,
							title
						}, {
							onSuccess: () => {
								if (title) toast("Учебник сохранён");
							},
							onError: () => toast("Не получилось сохранить")
						});
					}
				}, `${grade}-${subject}`))
			})
		]
	});
}
function TextbookRow({ subject, title, catalog, saving, onSave }) {
	const [value, setValue] = (0, import_react.useState)(title);
	const listId = `tb-${subject.replace(/\s+/g, "-")}`;
	(0, import_react.useEffect)(() => {
		setValue(title);
	}, [title]);
	function commit() {
		const next = value.trim();
		if (next === title) return;
		onSave(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "shadow-card flex flex-col gap-2 rounded-lg bg-card px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: subject
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				list: listId,
				value,
				maxLength: 120,
				disabled: saving,
				placeholder: "Название учебника",
				onChange: (e) => setValue(e.target.value),
				onBlur: commit,
				onKeyDown: (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						e.target.blur();
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
				id: listId,
				children: catalog.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: item }, item))
			})
		]
	});
}
//#endregion
export { BooksPage as component };
