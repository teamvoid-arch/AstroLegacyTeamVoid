/*
  Interface sounds of the seamless story (from the Final version), synthesised with Web Audio.
  Soft, short, rounded, never a buzzer. UI sounds only: no engine roars or impacts in space.
  Volume follows the main Settings (effects on/off + volume).
*/
import { useStore } from '../store';

export type SfxName = 'tap' | 'next' | 'card' | 'stamp' | 'chime' | 'try-again' | 'archie' | 'whoosh-soft' | 'tv-on'
  | 'radio-60s' | 'radio-70s' | 'radio-digital' | 'radio-today';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

/** Call from a user tap (browser autoplay rule). */
export function unlockSfx() {
  try {
    ctx ??= new AudioContext();
    if (!master) {
      master = ctx.createGain();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 8; comp.attack.value = 0.003; comp.release.value = 0.2;
      master.connect(comp).connect(ctx.destination);
    }
    void ctx.resume();
  } catch { /* no Web Audio: the story works silently with captions */ }
}

/** Machine voice era (Story Script "Voice direction", Build Spec §6): older machines sound older. */
export type Era = '60s' | '70s' | 'digital' | 'today';
export function eraOf(year?: number): Era {
  if (!year || year >= 2010) return 'today';
  if (year < 1970) return '60s';
  if (year < 1980) return '70s';
  return 'digital';
}

/** Filter chain for a machine's voice: 1960s old radio (300–3,000 Hz, a little grit), 1970s warm tape,
    1990s–2000s light digital, today clean. Returns [first node, last node]. */
function eraChain(c: AudioContext, era: Era): [AudioNode, AudioNode] {
  const hp = c.createBiquadFilter(); hp.type = 'highpass';
  const lp = c.createBiquadFilter(); lp.type = 'lowpass';
  if (era === '60s') {
    hp.frequency.value = 300; lp.frequency.value = 3000;
    const grit = c.createWaveShaper();
    const k = 6, n = 1024, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); }
    grit.curve = curve;
    const trim = c.createGain(); trim.gain.value = 0.7;
    hp.connect(lp).connect(grit).connect(trim);
    return [hp, trim];
  }
  if (era === '70s') {
    hp.frequency.value = 120; lp.frequency.value = 6000;
    const warm = c.createBiquadFilter(); warm.type = 'peaking'; warm.frequency.value = 300; warm.gain.value = 3; warm.Q.value = 0.8;
    hp.connect(warm).connect(lp);
    return [hp, lp];
  }
  if (era === 'digital') { hp.frequency.value = 200; lp.frequency.value = 8000; hp.connect(lp); return [hp, lp]; }
  hp.frequency.value = 120; lp.frequency.value = 16000; hp.connect(lp); return [hp, lp];
}

/** A light metallic "hardware" colour on every machine voice: a very short feedback delay (comb)
    mixed under the dry voice, so it still sounds friendly and clear, just a little like a machine. */
function hardware(c: AudioContext, input: AudioNode): AudioNode {
  const out = c.createGain();
  const dry = c.createGain(); dry.gain.value = 0.85;
  const delay = c.createDelay(0.05); delay.delayTime.value = 0.009;
  const fb = c.createGain(); fb.gain.value = 0.45;
  const wet = c.createGain(); wet.gain.value = 0.35;
  input.connect(dry).connect(out);
  input.connect(delay).connect(wet).connect(out);
  delay.connect(fb).connect(delay);
  return out;
}

/** Loudness 0..1 of a playing voice element (mouth = voice loudness).
    `machine` routes the voice through its era filter; `kid` makes VIMO's kid voice a little higher. */
const sources = new WeakMap<HTMLMediaElement, AnalyserNode>();
export function voiceLevel(el: HTMLMediaElement, opts: { kid?: boolean; machine?: Era } = {}): (() => number) | null {
  if (opts.kid) {
    // higher and a touch faster, like the Story Script's "kid voice" (pitch moves with speed)
    (el as HTMLMediaElement & { preservesPitch: boolean }).preservesPitch = false;
    el.playbackRate = 1.07;
  }
  if (!ctx) return null;
  try {
    let an = sources.get(el);
    if (!an) {
      an = ctx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.6;
      const src = ctx.createMediaElementSource(el);
      if (opts.machine) { const [a, b] = eraChain(ctx, opts.machine); src.connect(a); hardware(ctx, b).connect(an); }
      else src.connect(an);
      an.connect(ctx.destination);
      sources.set(el, an);
    }
    const buf = new Uint8Array(an.fftSize);
    const a = an;
    return () => {
      a.getByteTimeDomainData(buf);
      let sum = 0; for (const v of buf) { const x = (v - 128) / 128; sum += x * x; }
      return Math.min(1, Math.sqrt(sum / buf.length) * 4);
    };
  } catch { return null; }
}

function tone(freq: number, start: number, dur: number, peak: number, type: OscillatorType = 'sine') {
  if (!ctx || !master) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(peak, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(master);
  o.start(start); o.stop(start + dur + 0.05);
}

function noise(start: number, dur: number, peak: number, lowpass: number) {
  if (!ctx || !master) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lowpass;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 120;
  const g = ctx.createGain(); g.gain.value = peak;
  src.connect(f).connect(hp).connect(g).connect(master);
  src.start(start);
}

const C5 = 523.25, E5 = 659.25, G5 = 783.99, A4 = 440, C6 = 1046.5;

export function sfx(name: SfxName) {
  if (!ctx || !master) return;
  const { sfx: on, sfxVol } = useStore.getState().settings;
  if (!on || sfxVol <= 0) return;
  master.gain.value = sfxVol * 0.6;
  const t = ctx.currentTime + 0.01;
  const v = 1 + (Math.floor(Math.random() * 3) - 1) * 0.02;
  switch (name) {
    case 'tap': tone(880 * v, t, 0.08, 0.08, 'triangle'); break;
    case 'next': tone(C5 * v, t, 0.18, 0.07); tone(G5 * v, t + 0.07, 0.25, 0.06); break;
    case 'card': noise(t, 0.35, 0.05, 1800); break;
    case 'stamp': tone(130 * v, t, 0.22, 0.18); noise(t, 0.08, 0.06, 600); break;
    case 'chime': tone(E5 * v, t, 0.5, 0.07); tone(C6 * v, t + 0.12, 0.7, 0.05); break;
    case 'try-again': tone(A4 * 0.75, t, 0.35, 0.07); break;
    case 'archie': tone(G5, t, 0.16, 0.06, 'triangle'); tone(C6, t + 0.14, 0.22, 0.05, 'triangle'); break;
    case 'whoosh-soft': noise(t, 0.6, 0.025, 900); break;
    case 'tv-on': tone(C5 * v, t, 0.12, 0.05, 'triangle'); break;
    // "a small sound before a machine talks": crackle + beep for old machines, a clean chirp for new ones
    case 'radio-60s': noise(t, 0.35, 0.05, 2500); tone(1000, t + 0.08, 0.12, 0.05, 'square'); break;
    case 'radio-70s': noise(t, 0.2, 0.03, 3500); tone(880, t + 0.05, 0.1, 0.05, 'triangle'); tone(1320, t + 0.17, 0.1, 0.04, 'triangle'); break;
    case 'radio-digital': tone(1500, t, 0.06, 0.04, 'square'); tone(1800, t + 0.08, 0.06, 0.035, 'square'); break;
    case 'radio-today': tone(G5 * 2, t, 0.08, 0.04); tone(C6 * 2, t + 0.07, 0.1, 0.035); break;
  }
}
