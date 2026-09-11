import { create } from "zustand";

const STORAGE_KEY = "zadano-v1";

type Prefill = {
  subject?: string;
  dueOn?: string;
};

type Persisted = {
  name: string;
  done: Record<string, true>;
  notify: boolean;
};

type ClassState = {
  hydrated: boolean;
  name: string;
  done: Record<string, true>;
  notifyEnabled: boolean;
  addOpen: boolean;
  prefill: Prefill | null;
  hydrate: () => void;
  setName: (name: string) => void;
  isDone: (id: number) => boolean;
  toggleDone: (id: number) => void;
  setNotifyEnabled: (value: boolean) => void;
  openAdd: (prefill?: Prefill) => void;
  closeAdd: () => void;
};

function writePersisted(state: Pick<ClassState, "name" | "done" | "notifyEnabled">) {
  const payload: Persisted = {
    name: state.name,
    done: state.done,
    notify: state.notifyEnabled,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export const useClassStore = create<ClassState>((set, get) => ({
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
        const parsed = JSON.parse(raw) as Persisted;
        set({
          name: parsed.name ?? "",
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
  openAdd: (prefill) => set({ addOpen: true, prefill: prefill ?? null }),
  closeAdd: () => set({ addOpen: false, prefill: null }),
}));
