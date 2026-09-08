import { create } from "zustand";
import { defaultSave, type GameSave, type LocationId } from "./types";
import { LOCATION_ORDER } from "./types";
import { nextLocation, responseFor } from "./script";

const KEY = "the-fold-holds-v5";

function isLocation(v: unknown): v is LocationId {
  return typeof v === "string" && (LOCATION_ORDER as string[]).includes(v);
}

function load(): GameSave {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSave();
    const p = JSON.parse(raw) as Partial<GameSave>;
    const location = isLocation(p.location) ? p.location : "dawn";
    const phase = p.phase === "field" || p.phase === "ending" || p.phase === "title" ? p.phase : "title";
    return {
      ...defaultSave(),
      ...p,
      phase,
      location,
      flags: { ...defaultSave().flags, ...p.flags },
      traces: Array.isArray(p.traces) ? p.traces : [],
      visited: Array.isArray(p.visited) ? p.visited.filter(isLocation) : [],
      ending: p.ending === "contain" || p.ending === "witness" || p.ending === "release" ? p.ending : null,
      lastEnding:
        p.lastEnding === "contain" || p.lastEnding === "witness" || p.lastEnding === "release"
          ? p.lastEnding
          : p.ending === "contain" || p.ending === "witness" || p.ending === "release"
            ? p.ending
            : null,
      walks: typeof p.walks === "number" ? p.walks : 0,
    };
  } catch {
    return defaultSave();
  }
}

function snapshot(s: GameSave): GameSave {
  return {
    phase: s.phase,
    location: s.location,
    flags: s.flags,
    traces: s.traces,
    visited: s.visited,
    ending: s.ending,
    lastEnding: s.lastEnding,
    walks: s.walks,
  };
}

function persist(s: GameSave) {
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot(s)));
  } catch {
    /* ignore */
  }
}

type State = GameSave & {
  spoken: { speaker: string; lines: string[] } | null;
  registers: { land: string; lattice: string } | null;
  notesOpen: boolean;
  ready: boolean;
  hydrate: () => void;
  enterField: () => void;
  choose: (id: string) => void;
  setNotesOpen: (o: boolean) => void;
  reset: () => void;
  rememberWalk: () => void;
};

export const useGame = create<State>((set, get) => ({
  ...defaultSave(),
  spoken: null,
  registers: null,
  notesOpen: false,
  ready: false,
  hydrate: () => {
    const saved = typeof window === "undefined" ? defaultSave() : load();
    set({ ...saved, ready: true });
  },
  enterField: () => {
    const next = snapshot({
      ...get(),
      phase: "field",
      flags: { ...get().flags, enteredAsWitness: true },
    });
    persist(next);
    set({ ...next, spoken: null });
  },
  choose: (id: string) => {
    if (id.startsWith("witness:")) {
      const text = id.slice(8).trim().slice(0, 280);
      if (!text) return;
      const traces = [...get().traces, { id: `witness-${Date.now()}`, voice: "shared", text }];
      const next = snapshot({ ...get(), traces });
      persist(next);
      set({ traces });
      return;
    }
    const result = responseFor(id);
    const flags = { ...get().flags, ...result.flagPatch };
    const traces = [...get().traces];
    for (const t of result.traces) if (!traces.some((x) => x.id === t.id)) traces.push(t);
    let location: LocationId = get().location;
    let phase = get().phase;
    let ending = get().ending;
    if (result.advance) location = nextLocation(location);
    if (result.ending) {
      ending = result.ending;
      phase = "ending";
    }
    const visited = get().visited.includes(location) ? get().visited : [...get().visited, location];
    const next = snapshot({ phase, location, flags, traces, visited, ending, lastEnding: ending ?? get().lastEnding, walks: get().walks });
    persist(next);
    set({
      ...next,
      spoken: result.spoken ?? null,
      registers: result.registers?.land ? result.registers : get().registers,
    });
  },
  setNotesOpen: (o) => set({ notesOpen: o }),
  reset: () => {
    const fresh = defaultSave();
    persist(fresh);
    set({ ...fresh, spoken: null, registers: null, notesOpen: false, ready: true });
  },
  rememberWalk: () => {
    const existing = get();
    const memory: GameSave["traces"][number] = {
      id: `memory-${existing.walks + 1}`,
      voice: "season",
      text:
        existing.ending === "release"
          ? "I remember the season opening."
          : existing.ending === "contain"
            ? "I remember being asked to stay local."
            : "I remember being watched, and watching back.",
    };
    const traces = existing.traces.some((t) => t.id === memory.id) ? existing.traces : [...existing.traces, memory];
    const next = snapshot({
      phase: "field",
      location: "dawn",
      flags: { ...defaultSave().flags, enteredAsWitness: true, remembered: true },
      traces,
      visited: ["dawn"],
      ending: null,
      lastEnding: existing.ending ?? existing.lastEnding,
      walks: existing.walks + 1,
    });
    persist(next);
    set({ ...next, spoken: null, registers: null, notesOpen: false, ready: true });
  },
}));
