import { create } from "zustand";
import { normalizeClassCode } from "@/lib/class-code";

const STORAGE_KEY = "zadano-v2";
const LEGACY_KEY = "zadano-v1";

type Prefill = {
  subject?: string;
  dueOn?: string;
};

type Persisted = {
  name: string;
  classCode: string;
  done: Record<string, true>;
  notify: boolean;
  recents: string[];
};

type ClassState = {
  hydrated: boolean;
  name: string;
  classCode: string;
  recents: string[];
  done: Record<string, true>;
  notifyEnabled: boolean;
  addOpen: boolean;
  prefill: Prefill | null;
  hydrate: () => void;
  joinClass: (name: string, classCode: string) => void;
  setName: (name: string) => void;
  setClassCode: (classCode: string) => void;
  isDone: (id: number) => boolean;
  toggleDone: (id: number) => void;
  setNotifyEnabled: (value: boolean) => void;
  openAdd: (prefill?: Prefill) => void;
  closeAdd: () => void;
};

function writePersisted(
  state: Pick<ClassState, "name" | "classCode" | "done" | "notifyEnabled" | "recents">,
) {
  const recents = uniqueRecents(state.classCode, state.recents);
  const payload: Persisted = {
    name: state.name,
    classCode: state.classCode,
    done: state.done,
    notify: state.notifyEnabled,
    recents,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function uniqueRecents(current: string, list: string[]): string[] {
  const out: string[] = [];
  for (const item of [current, ...list]) {
    const code = normalizeClassCode(item);
    if (!code || out.includes(code)) continue;
    out.push(code);
    if (out.length >= 6) break;
  }
  return out;
}

export const useClassStore = create<ClassState>((set, get) => ({
  hydrated: false,
  name: "",
  classCode: "",
  recents: [],
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
      const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted> & { name?: string };
        const classCode = normalizeClassCode(parsed.classCode ?? "");
        set({
          name: parsed.name ?? "",
          classCode,
          recents: Array.isArray(parsed.recents) ? parsed.recents : classCode ? [classCode] : [],
          done: parsed.done ?? {},
          notifyEnabled: Boolean(parsed.notify),
          hydrated: true,
        });
        return;
      }
    } catch {
      /* ignore broken storage */
    }
    set({ hydrated: true });
  },
  joinClass: (name, classCode) => {
    const code = normalizeClassCode(classCode);
    set({ name, classCode: code });
    writePersisted(get());
  },
  setName: (name) => {
    set({ name });
    writePersisted(get());
  },
  setClassCode: (classCode) => {
    const code = normalizeClassCode(classCode);
    set({ classCode: code });
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
  openAdd: (prefill) => set({ addOpen: true, prefill: prefill ?? null }),
  closeAdd: () => set({ addOpen: false, prefill: null }),
}));
