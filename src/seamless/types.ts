// Story types from the Final version (Nasa space app Final version/src/story/types.ts, 12 Nov 2026).
// Only the VIMO type import changed: astro-legacy keeps its VIMO types in data/types.ts.
import type { Face, Gesture, Grid, Size } from '../data/types';

export type World = 'earth' | 'moon' | 'mars' | 'deep' | 'home';
export type Lang = 'en' | 'bn';

/** Emotion tags from doc 07 §4. They decide VIMO's face/gesture and the music. */
export type Emotion =
  | 'curious' | 'wonder' | 'excited' | 'explaining' | 'tense' | 'playful'
  | 'proud' | 'gentle-sad' | 'reassuring' | 'hopeful';

/** One spoken line. One audio file per line (doc 07 §3). */
export interface Line {
  id: string;
  speaker: 'vimo' | 'kid' | 'machine';
  text: Record<Lang, string>;
  emotion: Emotion;
  gapBefore?: number;
  vimo?: { screen?: Grid; size?: Size; face?: Face; gesture?: Gesture };
  /** Audio file per language (from voice.json after `npm run voice`). */
  audio?: Partial<Record<Lang, string>> | null;
  /** Word timings from ElevenLabs. Missing = estimated from the word count. */
  words?: { w: string; t: number; key?: boolean }[];
  sourceIds?: string[];
  /** false = relies on an unchecked fact: never shown (except in ?facts=all review mode). */
  verified?: boolean;
  unverified?: string[];
  who?: string;
  changed?: { from: string; why: string };
}

export interface TryIt {
  id: string;
  prompt: Record<Lang, string>;
  learn: Line | null;
}

/** Text in the current language; Bangla still marked TODO(bn) falls back to English. */
export function pick(text: Record<Lang, string>, lang: Lang): string {
  const t = text[lang];
  return t && !t.startsWith('TODO(bn)') ? t : text.en;
}

export interface Beat {
  id: string;
  world: World;
  scene: string;
  title: Record<Lang, string>;
  year?: number;
  cameraT: number;
  lines: Line[];
  tryIt?: TryIt | null;
  stamp?: string | null;
  kind?: 'story' | 'question' | 'answer';
  machineId?: string | null;
  video?: {
    machineId: string; kind: 'feature' | 'quick'; seconds: number;
    src: string | null; poster?: string | null; captions?: Partial<Record<Lang, string>>;
    slides?: { text: string; facts: string[] }[];
  } | null;
  card?: string | null;
  tour?: 'map' | 'moon' | 'mars' | 'deep';
  // ---- team script, 13 Nov 2026 ----
  /** This app's 3D stage to play this beat in: a stage beat id plus optional overrides (fx, era…). */
  stage?: { from: string; fx?: string[]; era?: string; scene?: string };
  /** Seconds the scene keeps playing after the lines (launch, atmosphere, solar system). */
  hold?: number;
  /** Short on-screen labels shown one after another during the hold. */
  labels?: Record<Lang, string>[];
  /** Quick tour of one world: every main machine flashes by in year order. */
  quick?: 'moon' | 'mars' | 'deep';
  /** The lobby: satellite interior with three windows; the story waits for the kid's pick. */
  lobby?: boolean;
  /** End of a world's detailed story: Experience mode, or carry on. */
  after?: 'moon' | 'mars' | 'deep';
  archie?: { title: string; why: string; url: string; type: 'page' | 'film' | 'photo' | 'animation' } | null;
}

export interface Machine {
  id: string; name: string; year: number; world: World; site?: string; path: 'main' | 'side';
  type?: string; status?: 'working' | 'quiet' | 'used-once' | 'crashed' | 'lost'; statusLabel?: string;
  statusFacts?: string[]; video?: boolean;
  model?: { kind: string; url?: string; file?: string; credit?: string; note?: string };
  card?: { big: string; why: string; game?: string; sourceUrl: string; facts: string[]; draft?: boolean } | null;
  cardSourceUrl?: string;
}
