import { create } from 'zustand';

// Everything is saved only on this device (localStorage), wrapped in try/catch,
// so the app still works in private windows or when storage is blocked.

export type Lang = 'en' | 'bn';
export interface Settings {
  music: boolean;
  voice: boolean;
  sfx: boolean;
  musicVol: number;
  voiceVol: number;
  sfxVol: number;
  captions: boolean;
  reducedMotion: boolean;
  lite: boolean;
}

const sysReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const defaults: Settings = {
  music: true, voice: true, sfx: true, musicVol: 0.45, voiceVol: 0.9, sfxVol: 0.6,
  captions: true, reducedMotion: !!sysReduced, lite: false,
};

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked: fine */ }
}

interface State {
  lang: Lang;
  name: string;
  progress: string | null;
  stamps: string[];
  stickers: string[];
  settings: Settings;
  visits: number;
  audioReady: boolean;
  /** Overlays */
  cardMachine: string | null;
  settingsOpen: boolean;
  nameOpen: boolean;
  modelViewer: { machine: string; find?: string } | null;
  /** Live story state (changes per beat, not per frame) */
  beatIndex: number;
  travelMode: number;
  tryEvent: { id: string; n: number };
  setLang: (l: Lang) => void;
  setName: (n: string) => void;
  setProgress: (id: string) => void;
  addStamp: (id: string) => boolean;
  addSticker: (id: string) => void;
  setSettings: (p: Partial<Settings>) => void;
  setAudioReady: () => void;
  openCard: (id: string | null) => void;
  openSettings: (o: boolean) => void;
  openName: (o: boolean) => void;
  openModel: (v: { machine: string; find?: string } | null) => void;
  setBeatIndex: (i: number) => void;
  setTravelMode: (n: number) => void;
  fire: (id: string) => void;
  resetProgress: () => void;
}

const visits = read<number>('al.visits', 0);
write('al.visits', visits + 1);

export const useStore = create<State>((set, get) => ({
  lang: read<Lang>('al.lang', 'en'),
  name: read<string>('al.name', ''),
  progress: read<string | null>('al.progress', null),
  stamps: read<string[]>('al.stamps', []),
  stickers: read<string[]>('al.stickers', []),
  settings: { ...defaults, ...read<Partial<Settings>>('al.settings', {}) },
  visits,
  audioReady: false,
  cardMachine: null,
  settingsOpen: false,
  nameOpen: false,
  modelViewer: null,
  beatIndex: 0,
  travelMode: 0,
  tryEvent: { id: '', n: 0 },
  setLang: (lang) => { write('al.lang', lang); set({ lang }); document.documentElement.lang = lang; },
  setName: (name) => { const n = name.trim().slice(0, 24); write('al.name', n); set({ name: n }); },
  setProgress: (id) => { write('al.progress', id); set({ progress: id }); },
  addStamp: (id) => {
    if (get().stamps.includes(id)) return false;
    const stamps = [...get().stamps, id];
    write('al.stamps', stamps); set({ stamps });
    return true;
  },
  addSticker: (id) => {
    if (get().stickers.includes(id)) return;
    const stickers = [...get().stickers, id];
    write('al.stickers', stickers); set({ stickers });
  },
  setSettings: (p) => { const settings = { ...get().settings, ...p }; write('al.settings', settings); set({ settings }); },
  setAudioReady: () => set({ audioReady: true }),
  openCard: (cardMachine) => set({ cardMachine }),
  openSettings: (settingsOpen) => set({ settingsOpen }),
  openName: (nameOpen) => set({ nameOpen }),
  openModel: (modelViewer) => set({ modelViewer }),
  setBeatIndex: (beatIndex) => set({ beatIndex }),
  setTravelMode: (travelMode) => set({ travelMode }),
  fire: (id) => set({ tryEvent: { id, n: get().tryEvent.n + 1 } }),
  resetProgress: () => {
    for (const k of ['al.name', 'al.progress', 'al.stamps', 'al.stickers', 'al.visits']) {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    }
    set({ name: '', progress: null, stamps: [], stickers: [] });
  },
}));

/** Per-frame story progress lives outside React to avoid re-renders. */
export const live = {
  progress: 0, // scroll position in beats (float)
  t: 0, // 0..1 within the current beat
  index: 0,
  speaking: 0, // 0..1 mouth level for lip sync
  fps: 60,
};
