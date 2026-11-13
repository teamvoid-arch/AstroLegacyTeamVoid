import { create } from 'zustand';

/*
  Story-only state for the seamless story (Final version flow).
  Language, settings, name and stamps stay in the main store (src/store.ts), so the Logbook,
  Certificate and Settings panel keep working unchanged.
*/
export type Phase = 'idle' | 'line' | 'gap' | 'video' | 'card' | 'tryit' | 'hold' | 'status' | 'lobby' | 'choice' | 'done';
export type WorldId = 'moon' | 'mars' | 'deep';

interface StoryState {
  beatIndex: number;
  lineIndex: number;
  phase: Phase;
  paused: boolean;
  /** Seconds into the current step (mirrors the clock, for UI only). */
  lineTime: number;
  /** Who finished the current beat's Try it. */
  tryItDone: null | 'user' | 'vimo';
  /** Archie's panel is open (the story is paused while it is). */
  archieOpen: boolean;
  /** Year shown while the quick tour runs it (null = the beat's own year). */
  yearOverride: number | null;
  setPaused(p: boolean): void;
  setPosition(p: { beatIndex?: number; lineIndex?: number; phase?: Phase }): void;
  setLineTime(t: number): void;
  setTryItDone(v: null | 'user' | 'vimo'): void;
  setArchieOpen(v: boolean): void;
  setYearOverride(y: number | null): void;
  /** World picked in the lobby (window highlighted). */
  pick: WorldId;
  setPick(w: WorldId): void;
  /** Worlds whose detailed story the kid has finished (device only). */
  visited: WorldId[];
  addVisited(w: WorldId): void;
}

function loadVisited(): WorldId[] { try { return JSON.parse(localStorage.getItem('al.visited') || '[]'); } catch { return []; } }

export const useStory = create<StoryState>((set) => ({
  beatIndex: 0,
  lineIndex: 0,
  phase: 'idle',
  paused: false,
  lineTime: 0,
  tryItDone: null,
  archieOpen: false,
  yearOverride: null,
  setPaused: (paused) => set({ paused }),
  setPosition: (p) => set(p),
  setLineTime: (lineTime) => set({ lineTime }),
  setTryItDone: (tryItDone) => set({ tryItDone }),
  setArchieOpen: (archieOpen) => set({ archieOpen }),
  setYearOverride: (yearOverride) => set({ yearOverride }),
  pick: 'moon',
  setPick: (pick) => set({ pick }),
  visited: loadVisited(),
  addVisited: (w) => set((s) => {
    if (s.visited.includes(w)) return s;
    const visited = [...s.visited, w];
    try { localStorage.setItem('al.visited', JSON.stringify(visited)); } catch { /* blocked */ }
    return { visited };
  }),
}));

/** Ending reached once: unlocks "Explore more". Device only. */
export function markFinished() { try { localStorage.setItem('al.finished', 'true'); } catch { /* blocked */ } }
export function hasFinished() { try { return localStorage.getItem('al.finished') === 'true'; } catch { return false; } }
