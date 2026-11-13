import type { Face, Gesture, Grid, Size } from '../data/types';

// One shared controller drives VIMO in both Story and Experience modes.
export const vimo = {
  screen: 'centre' as Grid,
  size: 'M' as Size,
  face: 'happy' as Face,
  gesture: 'idle' as Gesture,
  gestureStart: 0,
  reaction: null as null | { gesture: Gesture; face?: Face; until: number },
  bubble: null as null | { text: string; until: number },
  highFive: false,
  hidden: false,
  /** Screen-space hit circle, written each frame by the 3D view. */
  hit: { x: -999, y: -999, r: 0, hx: -999, hy: -999 },
  /** Her head on screen (px) and whether she stands on the right half, for the speech bubble. */
  head: { x: -999, y: -999, r: 0, right: false },
  /** The line she is saying now (story narration), shown in her speech bubble. */
  line: null as null | { text: string; kid?: boolean; key: string },
  /** True while her speech bubble is typing (her mouth moves with it when there is no voice). */
  typing: false,
  changed: 0,
  arrivals: 0,
};

const now = () => performance.now() / 1000;

export function setVimo(p: { screen?: Grid; size?: Size; face?: Face; gesture?: Gesture }) {
  const moved = (p.screen && p.screen !== vimo.screen) || (p.size && p.size !== vimo.size);
  Object.assign(vimo, p);
  if (p.gesture) vimo.gestureStart = now();
  if (moved) vimo.changed = now();
}

export function react(gesture: Gesture, face?: Face, seconds = 1.6) {
  vimo.reaction = { gesture, face, until: now() + seconds };
  vimo.gestureStart = now();
}

export function say(text: string, seconds = 2.8) {
  vimo.bubble = { text, until: now() + seconds };
}

const REACTIONS: { g: Gesture; f: Face; s?: string; sfx?: string }[] = [
  { g: 'spin', f: 'happy', sfx: 'giggle' },
  { g: 'spin', f: 'excited', sfx: 'whoosh' },
  { g: 'wave', f: 'happy' },
  { g: 'cheer', f: 'excited', s: 'Up top! Yesss!', sfx: 'clap' },
  { g: 'hop', f: 'cheeky', sfx: 'giggle' },
  { g: 'salute', f: 'proud' },
  { g: 'thumbs', f: 'cheeky' },
  { g: 'heart', f: 'gentle' },
  { g: 'loop', f: 'excited', sfx: 'whoosh' },
  { g: 'hop', f: 'surprised', s: 'Hey, that tickles!', sfx: 'giggle' },
  { g: 'hop', f: 'surprised', s: 'Hic!', sfx: 'boing' },
  { g: 'cover-eyes', f: 'cheeky', s: 'Peek-a-boo!' },
];

let last = -1;
let taps: number[] = [];

/** Tap on VIMO: one of 12 reactions, never the same twice in a row; 5 taps in 3 s = dizzy. */
export function tapVimo(): string | undefined {
  const t = now();
  taps = taps.filter((x) => t - x < 3).concat(t);
  if (taps.length >= 5) {
    taps = [];
    react('dizzy', 'surprised', 2.6);
    say('Whoa... I see stars!');
    return 'boing';
  }
  let i = Math.floor(Math.random() * REACTIONS.length);
  if (i === last) i = (i + 1) % REACTIONS.length;
  last = i;
  const r = REACTIONS[i];
  react(r.g, r.f);
  if (r.s) say(r.s, 1.8);
  return r.sfx;
}
