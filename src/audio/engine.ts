import type { Line, MusicCue } from '../data/types';
import { live, useStore } from '../store';

/*
  Astro Legacy audio engine (Web Audio API, no external files needed).
  - Music: original generative score. Every cue shares VIMO's 5-note theme
    (scale degrees 1-2-3-5-3), so the whole story feels connected.
  - SFX: synthesised in the browser, matched to each visual action, soft and never scary.
  - Voice: ElevenLabs MP3 files when present (public/audio/vo/manifest.json, made by
    `npm run vo:generate`), otherwise the browser's built-in speech voice, otherwise
    captions only. Music ducks by 10 dB under every voice line.
*/

type Instr = 'pad' | 'strings' | 'bell' | 'pluck' | 'marimba' | 'piano' | 'cello' | 'horn' | 'choir' | 'synth';

interface CueDef {
  bpm: number;
  root: number; // MIDI
  scale: number[];
  chords: number[]; // scale-degree roots per bar
  pad: Instr;
  arp?: Instr;
  arpPattern?: number[]; // scale steps above chord root, -1 = rest (8th notes)
  theme: Instr;
  themeEvery: number; // bars
  bass?: boolean;
  perc?: 'soft' | 'drums' | 'hats';
  ambience?: 'city' | 'wind' | 'space';
  level: number;
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];
const THEME = [0, 1, 2, 4, 2]; // VIMO's theme as scale degrees

const CUES: Record<MusicCue, CueDef> = {
  M1: { bpm: 68, root: 60, scale: MAJOR, chords: [0, 5, 3, 4], pad: 'pad', arp: 'bell', arpPattern: [4, -1, 2, -1, 7, -1, -1, -1], theme: 'piano', themeEvery: 4, ambience: 'city', level: 0.8 },
  M2: { bpm: 100, root: 62, scale: MAJOR, chords: [0, 4, 5, 3], pad: 'strings', arp: 'pluck', arpPattern: [0, 2, 4, 7, 4, 2, 0, 2], theme: 'horn', themeEvery: 2, bass: true, perc: 'drums', level: 0.75 },
  M3: { bpm: 80, root: 57, scale: DORIAN, chords: [0, 3, 0, 4], pad: 'synth', arp: 'bell', arpPattern: [0, -1, 4, -1, 2, -1, 6, -1], theme: 'bell', themeEvery: 4, bass: true, perc: 'soft', level: 0.75 },
  M4: { bpm: 72, root: 65, scale: MAJOR, chords: [0, 3, 5, 4], pad: 'strings', arp: 'piano', arpPattern: [0, -1, 4, -1, 7, -1, 4, -1], theme: 'horn', themeEvery: 2, bass: true, level: 0.8 },
  M5: { bpm: 112, root: 67, scale: MAJOR, chords: [0, 3, 4, 0], pad: 'pad', arp: 'marimba', arpPattern: [0, 4, 2, 4, 7, 4, 2, 4], theme: 'pluck', themeEvery: 2, bass: true, perc: 'soft', level: 0.7 },
  M6: { bpm: 60, root: 62, scale: MINOR, chords: [0, 5, 3, 4], pad: 'strings', arp: 'piano', arpPattern: [0, -1, -1, 4, -1, -1, 2, -1], theme: 'cello', themeEvery: 2, bass: true, level: 0.8 },
  M7: { bpm: 54, root: 64, scale: MAJOR, chords: [0, 3, 0, 4], pad: 'pad', arp: 'bell', arpPattern: [7, -1, -1, -1, 4, -1, -1, -1], theme: 'bell', themeEvery: 4, ambience: 'space', level: 0.75 },
  M8: { bpm: 96, root: 57, scale: MINOR, chords: [0, 5, 6, 4], pad: 'strings', arp: 'pluck', arpPattern: [0, 7, 4, 7, 2, 7, 4, 7], theme: 'horn', themeEvery: 4, bass: true, perc: 'hats', ambience: 'wind', level: 0.7 },
  M9: { bpm: 60, root: 60, scale: MAJOR, chords: [0, 5, 3, 4], pad: 'strings', arp: 'piano', arpPattern: [0, -1, 4, -1, 2, -1, -1, -1], theme: 'piano', themeEvery: 2, level: 0.7 },
  M10: { bpm: 84, root: 62, scale: MAJOR, chords: [0, 4, 5, 3], pad: 'choir', arp: 'bell', arpPattern: [0, 4, 7, 4, 2, 4, 7, 9], theme: 'horn', themeEvery: 2, bass: true, perc: 'soft', level: 0.75 },
  M11: { bpm: 52, root: 58, scale: LYDIAN, chords: [0, 1, 0, 4], pad: 'choir', arp: 'bell', arpPattern: [0, 4, 7, 11, 7, 4, -1, -1], theme: 'bell', themeEvery: 4, ambience: 'space', level: 0.75 },
  M12: { bpm: 76, root: 60, scale: MAJOR, chords: [0, 5, 3, 4], pad: 'strings', arp: 'piano', arpPattern: [0, 4, 7, 4, 9, 7, 4, 2], theme: 'horn', themeEvery: 1, bass: true, perc: 'soft', level: 0.85 },
  M13: { bpm: 96, root: 67, scale: MAJOR, chords: [0, 4, 5, 3], pad: 'pad', arp: 'pluck', arpPattern: [0, 2, 4, 2, 7, 4, 2, 4], theme: 'marimba', themeEvery: 4, bass: true, perc: 'soft', level: 0.65 },
};

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class Engine {
  ctx: AudioContext | null = null;
  master!: GainNode;
  musicBus!: GainNode;
  duck!: GainNode;
  voiceBus!: GainNode;
  sfxBus!: GainNode;
  analyser!: AnalyserNode;
  noise!: AudioBuffer;
  manifest: Record<string, { file: string; dur: number }> = {};
  buffers = new Map<string, Promise<AudioBuffer | null>>();
  cue: { id: MusicCue; gain: GainNode; bar: number; next: number } | null = null;
  fading: GainNode[] = [];
  timer: number | null = null;
  ambience: { id: string; node: AudioBufferSourceNode; gain: GainNode } | null = null;
  voiceSrc: AudioBufferSourceNode | null = null;
  voiceResolve: (() => void) | null = null;
  speechVoice: SpeechSynthesisVoice | null = null;
  speakToken = 0;

  async unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') await this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.duck = ctx.createGain();
    this.musicBus.connect(this.duck).connect(this.master);
    this.voiceBus = ctx.createGain();
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.voiceBus.connect(this.analyser);
    this.voiceBus.connect(this.master);
    this.sfxBus = ctx.createGain();
    this.sfxBus.connect(this.master);
    const n = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = n;
    this.applySettings();
    this.timer = window.setInterval(() => this.schedule(), 60);
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) { this.ctx.suspend(); try { speechSynthesis.pause(); } catch { /* */ } }
      else { this.ctx.resume(); try { speechSynthesis.resume(); } catch { /* */ } }
    });
    try {
      const r = await fetch('audio/vo/manifest.json', { cache: 'no-cache' });
      if (r.ok) this.manifest = await r.json();
    } catch { /* no generated voice yet: fall back */ }
    this.pickSpeechVoice();
    try { speechSynthesis.onvoiceschanged = () => this.pickSpeechVoice(); } catch { /* */ }
    this.meter();
  }

  pickSpeechVoice() {
    try {
      const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
      const pref = ['Jenny', 'Aria', 'Libby', 'Sonia', 'Google UK English Female', 'Samantha', 'Zira', 'Female'];
      this.speechVoice = pref.map((p) => voices.find((v) => v.name.includes(p))).find(Boolean) || voices[0] || null;
    } catch { this.speechVoice = null; }
  }

  hasGeneratedVoice(lang = 'en') {
    return Object.keys(this.manifest).some((k) => k.startsWith(lang + '/'));
  }

  applySettings() {
    if (!this.ctx) return;
    const s = useStore.getState().settings;
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(s.music ? s.musicVol * 0.5 : 0, t, 0.3);
    this.voiceBus.gain.setTargetAtTime(s.voice ? s.voiceVol : 0, t, 0.1);
    this.sfxBus.gain.setTargetAtTime(s.sfx ? s.sfxVol * 0.7 : 0, t, 0.1);
  }

  meter() {
    const buf = new Uint8Array(this.analyser.frequencyBinCount);
    const tick = () => {
      if (this.voiceSrc) {
        this.analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        live.speaking = Math.min(1, Math.sqrt(sum / buf.length) * 5);
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  // ───────────── music ─────────────
  playCue(id: MusicCue) {
    if (!this.ctx || this.cue?.id === id) return;
    const t = this.ctx.currentTime;
    if (this.cue) {
      const g = this.cue.gain;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + 2); // 2 s crossfade, never a hard cut
      this.fading.push(g);
      setTimeout(() => { g.disconnect(); this.fading = this.fading.filter((x) => x !== g); }, 4500);
    }
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(CUES[id].level, t + 2);
    gain.connect(this.musicBus);
    this.cue = { id, gain, bar: 0, next: t + 0.1 };
    this.setAmbience(CUES[id].ambience);
  }

  stopMusic() {
    if (!this.ctx || !this.cue) return;
    const g = this.cue.gain;
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
    setTimeout(() => g.disconnect(), 2000);
    this.cue = null;
    this.setAmbience(undefined);
  }

  setAmbience(kind?: 'city' | 'wind' | 'space') {
    if (!this.ctx) return;
    if (this.ambience?.id === kind) return;
    const t = this.ctx.currentTime;
    if (this.ambience) {
      const a = this.ambience;
      a.gain.gain.linearRampToValueAtTime(0, t + 2);
      setTimeout(() => { try { a.node.stop(); } catch { /* */ } }, 2500);
      this.ambience = null;
    }
    if (!kind) return;
    const node = this.ctx.createBufferSource();
    node.buffer = this.noise; node.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = kind === 'wind' ? 'bandpass' : 'lowpass';
    f.frequency.value = kind === 'city' ? 380 : kind === 'wind' ? 700 : 180;
    f.Q.value = kind === 'wind' ? 0.6 : 0.4;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(kind === 'space' ? 0.05 : 0.035, t + 2);
    if (kind === 'wind') {
      const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.13;
      const lg = this.ctx.createGain(); lg.gain.value = 300;
      lfo.connect(lg).connect(f.frequency); lfo.start();
    }
    node.connect(f).connect(gain).connect(this.musicBus);
    node.start();
    this.ambience = { id: kind, node, gain };
  }

  schedule() {
    if (!this.ctx || !this.cue) return;
    const c = CUES[this.cue.id];
    const beat = 60 / c.bpm;
    const barLen = beat * 4;
    while (this.cue.next < this.ctx.currentTime + 0.25) {
      this.bar(c, this.cue.next, this.cue.bar, beat, barLen, this.cue.gain);
      this.cue.next += barLen;
      this.cue.bar++;
    }
  }

  degree(c: CueDef, deg: number, oct = 0) {
    const n = c.scale.length;
    const o = Math.floor(deg / n);
    const idx = ((deg % n) + n) % n;
    return c.root + c.scale[idx] + 12 * (o + oct);
  }

  bar(c: CueDef, t: number, bar: number, beat: number, barLen: number, out: GainNode) {
    const chordRoot = c.chords[bar % c.chords.length];
    // pad chord (1-3-5)
    for (const step of [0, 2, 4]) this.note(c.pad, mtof(this.degree(c, chordRoot + step, -1)), t, barLen * 1.05, 0.06, out);
    if (c.bass) this.note('cello', mtof(this.degree(c, chordRoot, -2)), t, barLen * 0.9, 0.08, out);
    if (c.arp && c.arpPattern) {
      c.arpPattern.forEach((s, i) => {
        if (s < 0) return;
        this.note(c.arp!, mtof(this.degree(c, chordRoot + s, 1)), t + i * beat * 0.5, beat * 0.9, 0.045, out);
      });
    }
    if (bar % c.themeEvery === 0 && bar % (c.themeEvery * 2) === 0) {
      THEME.forEach((d, i) => this.note(c.theme, mtof(this.degree(c, d, 1)), t + i * beat * 0.75, beat * (i === 4 ? 2 : 0.8), 0.07, out));
    }
    if (c.perc) {
      for (let i = 0; i < 4; i++) {
        if (c.perc === 'drums') this.drum('kick', t + i * beat, out, i === 0 ? 0.25 : 0.14);
        if (c.perc === 'soft' && i % 2 === 0) this.drum('kick', t + i * beat, out, 0.09);
        if (c.perc !== 'soft') this.drum('hat', t + i * beat + beat / 2, out, 0.04);
      }
    }
  }

  note(instr: Instr, f: number, t: number, dur: number, vel: number, out: AudioNode) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.connect(out);
    const osc = (type: OscillatorType, freq: number, detune = 0) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; o.detune.value = detune; return o;
    };
    const env = (a: number, d: number, peak = vel) => {
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    };
    let srcs: OscillatorNode[] = [];
    let end = t + dur + 0.2;
    switch (instr) {
      case 'pad': case 'strings': case 'synth': case 'choir': {
        const lp = ctx.createBiquadFilter();
        lp.type = instr === 'choir' ? 'bandpass' : 'lowpass';
        lp.frequency.value = instr === 'pad' ? 900 : instr === 'synth' ? 1300 : instr === 'choir' ? 800 : 1700;
        lp.Q.value = instr === 'choir' ? 1.4 : 0.5;
        lp.connect(g);
        const type: OscillatorType = instr === 'pad' ? 'triangle' : instr === 'synth' ? 'square' : 'sawtooth';
        srcs = [osc(type, f, -7), osc(type, f, 7)];
        srcs.forEach((s) => s.connect(lp));
        const a = instr === 'synth' ? 0.3 : 1.1;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vel * (instr === 'synth' ? 0.5 : 0.8), t + a);
        g.gain.setValueAtTime(vel * (instr === 'synth' ? 0.5 : 0.8), t + Math.max(a, dur - 0.4));
        g.gain.linearRampToValueAtTime(0, t + dur + 1.2);
        end = t + dur + 1.3;
        break;
      }
      case 'bell': {
        srcs = [osc('sine', f), osc('sine', f * 2.76)];
        const g2 = ctx.createGain(); g2.gain.value = 0.25; srcs[1].connect(g2).connect(g); srcs[0].connect(g);
        env(0.005, 2.4, vel * 0.8); end = t + 2.6; break;
      }
      case 'pluck': srcs = [osc('triangle', f)]; srcs[0].connect(g); env(0.004, 0.45); end = t + 0.5; break;
      case 'marimba': {
        srcs = [osc('sine', f), osc('sine', f * 4)];
        const g2 = ctx.createGain(); g2.gain.value = 0.15; srcs[1].connect(g2).connect(g); srcs[0].connect(g);
        env(0.003, 0.35); end = t + 0.4; break;
      }
      case 'piano': {
        srcs = [osc('triangle', f), osc('sine', f * 2)];
        const g2 = ctx.createGain(); g2.gain.value = 0.2; srcs[1].connect(g2).connect(g); srcs[0].connect(g);
        env(0.006, 1.6); end = t + 1.7; break;
      }
      case 'cello': case 'horn': {
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = instr === 'horn' ? 1400 : 700; lp.connect(g);
        srcs = [osc('sawtooth', f, -4), osc('sawtooth', f, 4)];
        srcs.forEach((s) => s.connect(lp));
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vel, t + 0.12);
        g.gain.setValueAtTime(vel, t + Math.max(0.12, dur - 0.1));
        g.gain.linearRampToValueAtTime(0, t + dur + 0.35);
        end = t + dur + 0.4;
        break;
      }
    }
    srcs.forEach((s) => { s.start(t); s.stop(end); });
    srcs[0].onended = () => g.disconnect();
  }

  drum(kind: 'kick' | 'hat', t: number, out: AudioNode, vel: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain(); g.connect(out);
    if (kind === 'kick') {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
      g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); o.start(t); o.stop(t + 0.32);
    } else {
      const s = ctx.createBufferSource(); s.buffer = this.noise;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000;
      g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      s.connect(hp).connect(g); s.start(t, Math.random()); s.stop(t + 0.06);
    }
  }

  // ───────────── sound effects ─────────────
  sfx(name: string) {
    if (!this.ctx || !useStore.getState().settings.sfx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.01;
    const out = this.sfxBus;
    const noise = (dur: number, type: BiquadFilterType, f0: number, f1: number, vol: number, at = t, q = 1) => {
      const s = ctx.createBufferSource(); s.buffer = this.noise;
      const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
      f.frequency.setValueAtTime(f0, at); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), at + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.08, dur / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      s.connect(f).connect(g).connect(out); s.start(at, Math.random()); s.stop(at + dur + 0.05);
    };
    const tone = (type: OscillatorType, f0: number, f1: number, dur: number, vol: number, at = t) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), at + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g).connect(out); o.start(at); o.stop(at + dur + 0.02);
    };
    switch (name) {
      case 'whoosh': noise(0.7, 'bandpass', 300, 2200, 0.35, t, 1.2); break;
      case 'thump': tone('sine', 120, 40, 0.3, 0.5); noise(0.08, 'lowpass', 800, 200, 0.2); break;
      case 'boing': { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine';
        o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(520, t + 0.18); o.frequency.exponentialRampToValueAtTime(300, t + 0.45);
        g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5); o.connect(g).connect(out); o.start(t); o.stop(t + 0.52); break; }
      case 'bounce': [0, 0.35, 0.62, 0.82].forEach((d, i) => { tone('sine', 200 - i * 20, 70, 0.22, 0.35 - i * 0.07, t + d); }); break;
      case 'shutter': [0, 0.12, 0.24].forEach((d) => { noise(0.03, 'highpass', 3000, 2000, 0.3, t + d); tone('square', 2400, 1800, 0.015, 0.05, t + d); }); break;
      case 'radio': noise(0.35, 'bandpass', 1800, 1200, 0.12, t, 3); tone('sine', 1000, 1000, 0.1, 0.12, t + 0.3); tone('sine', 1300, 1300, 0.08, 0.1, t + 0.42); break;
      case 'beep': tone('sine', 880, 880, 0.14, 0.12); tone('sine', 660, 660, 0.18, 0.1, t + 0.22); break;
      case 'blip': tone('sine', 1200, 1500, 0.08, 0.12); break;
      case 'laser': tone('sine', 1900, 700, 0.28, 0.16); tone('sine', 2400, 900, 0.2, 0.06, t + 0.04); break;
      case 'countdown': [0, 0.9, 1.8].forEach((d) => tone('sine', 660, 660, 0.15, 0.15, t + d)); tone('sine', 990, 990, 0.4, 0.17, t + 2.7); break;
      case 'rumble': case 'quake': noise(name === 'quake' ? 2.4 : 3, 'lowpass', 140, 60, 0.4, t, 0.7); break;
      case 'reentry': noise(2.5, 'lowpass', 900, 200, 0.3); break;
      case 'thruster': noise(1.3, 'lowpass', 1200, 400, 0.22); break;
      case 'stamp': noise(0.04, 'highpass', 2500, 1500, 0.3); tone('sine', 140, 60, 0.18, 0.45, t + 0.05); break;
      case 'page': noise(0.25, 'highpass', 1500, 5000, 0.12); break;
      case 'pop': tone('sine', 500, 1000, 0.09, 0.2); break;
      case 'bell': [110, 220.5, 331].forEach((f, i) => tone('sine', f, f * 0.995, 4.5 - i, 0.22 / (i + 1))); break;
      case 'footsteps': [0, 0.5, 1, 1.5].forEach((d) => noise(0.12, 'lowpass', 500, 150, 0.2, t + d)); break;
      case 'wheels': noise(1.4, 'bandpass', 900, 600, 0.18, t, 2); break;
      case 'tape': noise(0.55, 'highpass', 2000, 4500, 0.2); break;
      case 'storm': noise(3, 'bandpass', 500, 300, 0.12, t, 0.5); break;
      case 'servo': tone('sawtooth', 260, 420, 0.5, 0.05); break;
      case 'scan': for (let i = 0; i < 8; i++) tone('square', 1100 + (i % 2) * 200, 1100, 0.05, 0.03, t + i * 0.1); break;
      case 'blades': { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 170;
        const am = ctx.createGain(); am.gain.value = 0; const lfo = ctx.createOscillator(); lfo.frequency.value = 40; const lg = ctx.createGain(); lg.gain.value = 0.06;
        lfo.connect(lg).connect(am.gain); const lp = ctx.createBiquadFilter(); lp.frequency.value = 1500;
        o.connect(lp).connect(am).connect(out); o.start(t); lfo.start(t); o.stop(t + 1.6); lfo.stop(t + 1.6); break; }
      case 'drill': tone('square', 210, 230, 1.2, 0.04); noise(1.2, 'bandpass', 1600, 1400, 0.12, t, 4); break;
      case 'clink': tone('sine', 2600, 2550, 0.4, 0.1); tone('sine', 3900, 3850, 0.25, 0.05); break;
      case 'chime': [0, 2, 4, 7].forEach((s, i) => tone('sine', mtof(84 + [0, 2, 4, 7][i]), mtof(84 + s), 1.2, 0.08, t + i * 0.12)); break;
      case 'clap': [0, 0.03, 0.07].forEach((d) => noise(0.07, 'bandpass', 1500, 1200, 0.3, t + d, 1)); break;
      case 'success': [0, 4, 7, 12].forEach((s, i) => tone('triangle', mtof(72 + s), mtof(72 + s), 0.35, 0.12, t + i * 0.1)); break;
      case 'tryagain': tone('sine', 520, 520, 0.18, 0.08); tone('sine', 440, 440, 0.25, 0.08, t + 0.2); break;
      case 'giggle': [0, 0.09, 0.18, 0.27].forEach((d, i) => tone('sine', 700 + i * 60, 900 + i * 60, 0.07, 0.07, t + d)); break;
      case 'card': noise(0.15, 'bandpass', 2000, 3500, 0.1, t, 2); break;
      default: break;
    }
  }

  // ───────────── voice ─────────────
  stopVoice() {
    this.speakToken++;
    if (this.voiceSrc) { try { this.voiceSrc.stop(); } catch { /* */ } this.voiceSrc = null; }
    try { speechSynthesis.cancel(); } catch { /* */ }
    this.unduck();
    live.speaking = 0;
    const r = this.voiceResolve; this.voiceResolve = null; r?.();
  }

  private duckOn() { if (this.ctx) this.duck.gain.setTargetAtTime(0.316, this.ctx.currentTime, 0.12); }
  private unduck() { if (this.ctx) this.duck.gain.setTargetAtTime(1, this.ctx.currentTime, 0.4); }

  private load(file: string) {
    if (!this.buffers.has(file)) {
      this.buffers.set(file, fetch(file).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
        .then((b) => this.ctx!.decodeAudioData(b)).catch(() => null));
    }
    return this.buffers.get(file)!;
  }

  /** Preload the next lines so playback starts instantly. */
  preload(ids: string[], lang: string) {
    if (!this.ctx) return;
    for (const id of ids) { const m = this.manifest[`${lang}/${id}`]; if (m) this.load(m.file); }
  }

  readingTime(text: string) { return Math.max(2200, text.split(/\s+/).length * 380 + 600); }

  /** Speak one line. Resolves when finished (or when stopped). */
  async speak(id: string, line: Line, lang: string): Promise<void> {
    this.stopVoice();
    const token = ++this.speakToken;
    const s = useStore.getState().settings;
    if (line.who === 'machine') this.sfx(line.era === 'today' ? 'blip' : 'radio');
    if (line.who === 'machine') await new Promise((r) => setTimeout(r, 380));
    if (token !== this.speakToken) return;
    const wait = (ms: number) => new Promise<void>((resolve) => {
      const to = setTimeout(() => { if (this.voiceResolve === done) this.voiceResolve = null; resolve(); }, ms);
      const done = () => { clearTimeout(to); resolve(); };
      this.voiceResolve = done;
    });
    if (!this.ctx || !s.voice) return wait(this.readingTime(line.text));

    const entry = this.manifest[`${lang}/${id}`] || (lang !== 'en' ? undefined : undefined);
    if (entry) {
      const buf = await this.load(entry.file);
      if (token !== this.speakToken) return;
      if (buf) return this.playBuffer(buf, line);
    }
    if (lang === 'en' && 'speechSynthesis' in window && this.speechVoice) return this.speakWeb(line, token);
    return wait(this.readingTime(line.text));
  }

  private playBuffer(buf: AudioBuffer, line: Line) {
    return new Promise<void>((resolve) => {
      const ctx = this.ctx!;
      const src = ctx.createBufferSource(); src.buffer = buf;
      let node: AudioNode = src;
      // Era filter for machine voices: 1960s = old radio, 1970s = warm tape, 1990s = light digital, today = clean.
      if (line.who === 'machine' && line.era !== 'today') {
        const bp = ctx.createBiquadFilter();
        if (line.era === '60s') { bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 0.7; }
        else if (line.era === '70s') { bp.type = 'lowpass'; bp.frequency.value = 3200; }
        else { bp.type = 'highpass'; bp.frequency.value = 250; }
        node.connect(bp); node = bp;
        if (line.era === '60s') this.sfx('radio');
      }
      node.connect(this.voiceBus);
      this.duckOn();
      this.voiceSrc = src;
      const done = () => { if (this.voiceSrc === src) { this.voiceSrc = null; this.unduck(); live.speaking = 0; } this.voiceResolve = null; resolve(); };
      this.voiceResolve = done;
      src.onended = done;
      src.start();
    });
  }

  private speakWeb(line: Line, token: number) {
    return new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(line.text.replace(/\.\.\./g, ', '));
      u.voice = this.speechVoice;
      u.lang = this.speechVoice?.lang || 'en-GB';
      u.rate = line.who === 'kid' ? 1.05 : line.who === 'machine' ? 0.92 : 0.95;
      u.pitch = line.who === 'kid' ? 1.45 : line.who === 'machine' ? 0.55 : 1.12;
      u.volume = useStore.getState().settings.voiceVol;
      let ended = false;
      let raf = 0;
      const finish = () => {
        if (ended) return; ended = true; cancelAnimationFrame(raf); clearTimeout(safety);
        live.speaking = 0; this.unduck(); if (this.voiceResolve === finish) this.voiceResolve = null; resolve();
      };
      const safety = setTimeout(finish, this.readingTime(line.text) * 1.8 + 3000);
      u.onend = finish; u.onerror = finish;
      u.onstart = () => {
        this.duckOn();
        const tick = () => { if (ended) return; live.speaking = 0.35 + 0.35 * Math.abs(Math.sin(performance.now() / 85)); raf = requestAnimationFrame(tick); };
        tick();
      };
      u.onboundary = () => { live.speaking = 0.9; };
      this.voiceResolve = finish;
      if (token !== this.speakToken) return finish();
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { finish(); }
    });
  }
}

export const audio = new Engine();
useStore.subscribe((s, p) => { if (s.settings !== p.settings) audio.applySettings(); });
