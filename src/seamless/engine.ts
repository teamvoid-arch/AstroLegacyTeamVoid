/*
  Auto-advance story engine from the Final version ("One seamless story", 12 Nov 2026), wired to
  this app's VIMO, music, Logbook and 3D stages.

  Each beat is a queue of steps, played in a fixed order:
    line → 2 s gap → … → [VIMO TV] → [card] → [Try it (5 s, then VIMO does it)] → [learn line → 2 s gap]
    → stamp → next beat.
  Next = skip ahead now. Pause = freeze the clock. Archie never pauses anything unless tapped.
  Timing comes only from the current Track (audio.currentTime or a silent stand-in), read every frame.

  The 3D stages of this app animate on `live.t` (0..1 through the beat). Here `live.t` follows the
  beat's planned running time, so a lift-off or a landing plays out while VIMO talks.
*/
import { setVimo as place, react, vimo } from '../vimo/controller';
import { useStore as useApp, live } from '../store';
import { audio } from '../audio/engine';
import { machineSpeech } from '../three/speechAnchor';
import { machineById } from '../data/machines';
import { useStory, markFinished, type Phase } from './state';
import { AudioTrack, PlaylistTrack, SilentTrack, estimateSeconds, type Track } from './clock';
import { pick, type Beat, type Line } from './types';
import { eraOf, sfx, voiceLevel } from './sfx';
import { BEATS, MACHINES, QUICK_EACH, WORLD_FIRST, appMachineId, stageBeatFor, statusLine, worldMachines } from './bridge';
import type { WorldId } from './state';
import media from './media.json';

export { BEATS, MACHINES };

type VoiceEntry = { file: string; words?: { w: string; t: number }[]; pitchUp?: boolean };
const VOICE = (media as unknown as { voice: Record<string, Record<string, VoiceEntry>> }).voice;
type MadeVideo = { src?: string; clips?: { shot: number; src: string; seconds?: number }[]; poster?: string; captions?: Record<string, string>; seconds?: number };
const VIDEO = (media as unknown as { video: Record<string, MadeVideo> }).video;

export const GAP_AFTER_LINE = 2;
export const TRY_IT_WAIT = 5;
const SHOW_YOU = { en: 'Let me show you!', bn: 'দেখো, আমি করে দেখাই!' } as const;

/** Voice file + word timings for a line in a language (from `npm run voice`). */
export function voiceFor(line: Line, lang: string): VoiceEntry | null {
  return VOICE[lang]?.[line.id] ?? null;
}
/** VIMO TV clip for a machine (from `npm run video`), else the beat's own src, else null (placeholder). */
export function videoFor(beat: Beat) {
  const v = beat.video;
  if (!v) return null;
  const made = VIDEO[v.machineId];
  const clips = made?.clips?.map((c) => c.src) ?? (made?.src ? [made.src] : []);
  if (!made || !clips.length) return { ...v, clips: [] as string[] };
  return { ...v, src: clips[0], clips, poster: made.poster ?? null, captions: made.captions ?? {}, seconds: made.seconds ?? v.seconds };
}

export type Step =
  | { kind: 'line'; line: Line; index: number }
  | { kind: 'gap' }
  | { kind: 'video' }
  | { kind: 'card' }
  | { kind: 'status'; line: Line }
  | { kind: 'hold'; seconds: number }
  | { kind: 'tryit' }
  | { kind: 'learn'; line: Line };

/** How long the scene plays after the lines: launch/atmosphere/solar holds, quick-tour machines. */
export function holdSeconds(beat: Beat) {
  if (beat.quick) return worldMachines(beat.quick).length * QUICK_EACH + 0.4;
  return beat.hold ?? 0;
}

/*
  A stop (team script): VIMO's lines → VIMO TV (what it is, why it was sent, what it found, what it does now)
  → the NASA data card (a few plain lines + one source link) → the machine tells its own status in a bubble
  → Try it → stamp.
*/
function queueOf(beat: Beat): Step[] {
  const q: Step[] = beat.lines.map((line, index) => ({ kind: 'line', line, index }));
  if (holdSeconds(beat) > 0) q.push({ kind: 'hold', seconds: holdSeconds(beat) });
  if (beat.video) q.push({ kind: 'video' });
  if (beat.card && MACHINES[beat.card]?.card) q.push({ kind: 'card' });
  const status = beat.card ? statusLine(beat.card) : null;
  if (status) q.push({ kind: 'status', line: status });
  if (beat.tryIt) q.push({ kind: 'tryit' });
  return q;
}

const cardSeconds = (beat: Beat) => {
  const c = beat.card ? MACHINES[beat.card]?.card : null;
  return estimateSeconds(`${c?.big ?? ''} ${c?.why ?? ''}`) + GAP_AFTER_LINE;
};

/** Planned running time of a beat (for the 3D stage's 0..1 progress). */
function plannedSeconds(beat: Beat, lang: string) {
  let s = 0;
  for (const l of beat.lines) s += estimateSeconds(l.text.en || ' ') + GAP_AFTER_LINE;
  if (beat.video) s += videoFor(beat)?.seconds ?? 12;
  if (beat.card) s += cardSeconds(beat);
  s += holdSeconds(beat);
  if (beat.card && statusLine(beat.card)) s += estimateSeconds(statusLine(beat.card)!.text.en) + GAP_AFTER_LINE;
  if (beat.tryIt) s += TRY_IT_WAIT + (beat.tryIt.learn ? estimateSeconds(beat.tryIt.learn.text.en) + GAP_AFTER_LINE : 2);
  void lang;
  return Math.max(4, s);
}

/** On a phone, while a machine is on screen, VIMO stays at most medium size so she never hides it. */
function phoneSafe(v: NonNullable<Line['vimo']>, beat: Beat | undefined): NonNullable<Line['vimo']> {
  const portrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
  if (!portrait || !beat?.machineId) return v;
  const out = { ...v };
  if (out.size === 'L' || out.size === 'XL') out.size = 'M';
  if (out.screen === 'centre' || out.screen === 'bottom') out.screen = 'bottom-left';
  return out;
}

const GUIDE_VIDEO = { screen: 'bottom-left', size: 'S', gesture: 'idle' } as const;
const GUIDE_CARD = { screen: 'top-left', size: 'S', gesture: 'idle' } as const;

/*
  Story lines show in the clock-synced caption bar (Final version: word highlight, works muted),
  not in VIMO's typed bubble, so a line never appears twice. Her bubble stays for her own short
  reactions (tap jokes, "Up top!").
*/
function speak(_text: string | null, _kid = false) {
  vimo.line = null;
}
/** Which machine is talking (its name shows in the caption; the 3D model can glow). */
let speakingMachine: string | null = null;
export const speakingMachineName = () => speakingMachine;
let bubbleNo = 0;
/** `bubble`: the machine tells its status in a speech bubble on its 3D model (team script), not in the caption bar. */
function machineSay(line: Line | null, beat: Beat | undefined, bubble = false) {
  machineSpeech.line = null;
  const who = beat?.card ?? beat?.machineId;
  if (!line || !who) { speakingMachine = null; machineSpeech.id = null; return; }
  const id = appMachineId(who);
  speakingMachine = machineById[id]?.name ?? MACHINES[who]?.name ?? null;
  machineSpeech.id = id;
  // the bubble itself is drawn by StoryBubble from engine.current; machineSpeech.id makes the model report its screen spot
  void bubble; void bubbleNo;
}

const voiceVolume = () => { const s = useApp.getState().settings; return s.voice ? s.voiceVol : 0; };

class StoryEngine {
  private track: Track | null = null;
  private step: Step | null = null;
  private queue: Step[] = [];
  private qi = 0;
  private raf = 0;
  private running = false;
  private afterLearn = false;
  /** Stage whose sound effects were played last (several Final beats can share one stage). */
  private lastSfxStage = '';
  /** Seconds of this beat already played (finished steps), and its planned total. */
  private beatDone = 0;
  private beatTotal = 1;
  current: { line: Line | null; time: number; duration: number; prefix: string } = { line: null, time: 0, duration: 0, prefix: '' };
  stepTime = 0;
  stepDuration = 0;
  private level: (() => number) | null = null;
  videoEl: HTMLVideoElement | null = null;

  get stepKind() { return this.step?.kind ?? null; }

  start(fromBeat = 0) {
    this.stopLoop();
    useStory.getState().setPaused(false);
    this.running = true;
    vimo.hidden = false;
    this.enterBeat(BEATS[fromBeat] ? fromBeat : 0);
    this.loop();
  }

  stop() {
    this.stopLoop();
    this.track?.stop();
    this.track = null;
    this.step = null;
    live.speaking = 0;
    speak(null); machineSay(null, undefined);
  }

  private stopLoop() { this.running = false; cancelAnimationFrame(this.raf); }

  setPaused(p: boolean) {
    useStory.getState().setPaused(p);
    if (!this.track) return;
    if (p) { this.track.pause(); live.speaking = 0; } else this.track.play();
  }

  /** The big Next button (and the VIMO TV Skip): finish what is happening now and move on. */
  next() {
    if (!this.step) return;
    if (useStory.getState().paused) this.setPaused(false);
    sfx('next');
    if (this.step.kind === 'tryit') return this.completeTryIt(false);
    this.advance();
  }

  /** Previous (button, scroll up, swipe down, ↑/←): replay this beat from its start, or, right at the start
      of a beat (or from the lobby / "what next?"), go back one beat. */
  prev() {
    const s = useStory.getState();
    const atStart = !this.step || (this.qi === 0 && this.step.kind === 'line' && this.stepTime < 1.5);
    const target = atStart ? s.beatIndex - 1 : s.beatIndex;
    sfx('next');
    this.start(Math.max(0, target));
  }

  /** The kid is busy with a longer Try it: restart the 5 s wait. */
  holdTryIt(): void {
    if (this.step?.kind !== 'tryit') return;
    this.track?.stop();
    this.track = new SilentTrack(TRY_IT_WAIT);
    this.stepDuration = TRY_IT_WAIT;
    if (!useStory.getState().paused) this.track.play();
  }

  /** Called by a Try it when the kid does the action (byUser) or by the 5 s timeout. */
  completeTryIt(byUser: boolean): void {
    if (this.step?.kind !== 'tryit') return;
    const beat = BEATS[useStory.getState().beatIndex];
    if (useStory.getState().paused) useStory.getState().setPaused(false);
    useStory.getState().setTryItDone(byUser ? 'user' : 'vimo');
    if (byUser) sfx('chime'); else react('point', 'cheeky', 1.4);
    const learn: Line = beat.tryIt?.learn ?? { id: `${beat.id}.done`, speaker: 'vimo', emotion: 'excited', text: { en: '', bn: '' } };
    this.beatDone += this.stepDuration;
    this.play({ kind: 'learn', line: learn });
    this.current.prefix = byUser ? '' : pick(SHOW_YOU, useApp.getState().lang);
  }

  // ---------------------------------------------------------------- lobby and world choice

  /** Stop the clock and wait for a choice (lobby or "what next?"). VIMO stays on screen. */
  private halt(phase: 'lobby' | 'choice') {
    this.stopLoop();
    this.track?.stop();
    this.track = null;
    this.step = null;
    live.speaking = 0;
    speak(null); machineSay(null, undefined);
    const s = useStory.getState();
    if (phase === 'lobby') s.setPick(this.nextWorld() === 'home' ? 'moon' : (this.nextWorld() as WorldId));
    s.setPosition({ phase });
  }

  /** The next world the kid hasn't finished, in the fixed order; 'home' when all three are done. */
  nextWorld(): WorldId | 'home' {
    const visited = useStory.getState().visited;
    return (['moon', 'mars', 'deep'] as WorldId[]).find((w) => !visited.includes(w)) ?? 'home';
  }

  /** Start a world's detailed story (from the lobby's Story button), or the ending ('home'). */
  goWorld(w: WorldId | 'home') {
    const i = BEATS.findIndex((b) => b.id === WORLD_FIRST[w]);
    if (i >= 0) { sfx('next'); this.start(i); }
  }

  /** "Continue the story": the next unfinished world, then home. */
  continueStory() { this.goWorld(this.nextWorld()); }

  /** Back to the lobby (its line is not repeated). */
  toLobby() {
    const i = BEATS.findIndex((b) => b.lobby);
    useStory.getState().setPosition({ beatIndex: i });
    this.halt('lobby');
  }

  // ---------------------------------------------------------------- internals

  private enterBeat(beatIndex: number) {
    const beat = BEATS[beatIndex];
    const app = useApp.getState();
    useStory.getState().setPosition({ beatIndex, lineIndex: 0 });
    useStory.getState().setTryItDone(null);
    app.setProgress(beat.id);
    // reaching a world's "what next?" counts as finishing it, even if the kid taps a button before VIMO ends
    if (beat.after) useStory.getState().addVisited(beat.after);
    // the 3D stage and the music of this app follow the Final beat
    const stage = stageBeatFor(beatIndex);
    audio.playCue(stage.music);
    // the scene's own sound effects (countdown, rumble, re-entry, thrusters, wheels …), spaced out
    // and only while the kid is still on this beat. The stamp sound plays when the stamp is earned.
    if (stage.id !== this.lastSfxStage) {
      this.lastSfxStage = stage.id;
      (stage.sfx || []).filter((s) => s !== 'stamp').forEach((s, i) => setTimeout(() => {
        if (useStory.getState().beatIndex === beatIndex) audio.sfx(s);
      }, 300 + i * 900));
    }
    live.t = 0; live.index = beatIndex; live.progress = beatIndex;
    this.beatDone = 0;
    this.beatTotal = plannedSeconds(beat, app.lang);
    this.queue = queueOf(beat);
    this.qi = 0;
    this.afterLearn = false;
    if (!this.queue.length) return this.endBeat();
    this.play(this.queue[0]);
  }

  private endBeat(): void {
    const s = useStory.getState();
    const beat = BEATS[s.beatIndex];
    if (beat?.stamp) {
      if (useApp.getState().addStamp(appMachineId(beat.stamp))) { sfx('stamp'); react('salute', 'proud', 1.4); }
    }
    // The lobby and the end of a world wait for the kid's choice (team script §6, §8).
    if (beat?.lobby) return this.halt('lobby');
    if (beat?.after) { s.addVisited(beat.after); return this.halt('choice'); }
    if (s.beatIndex + 1 < BEATS.length) return this.enterBeat(s.beatIndex + 1);
    this.stop();
    vimo.hidden = true; // she flies up and becomes a tiny new star next to the Moon
    markFinished();
    s.setPosition({ phase: 'done' });
  }

  private advance(): void {
    const step = this.step!;
    this.beatDone += this.stepDuration;
    if (step.kind === 'line' || step.kind === 'learn' || step.kind === 'status') return this.play({ kind: 'gap' });
    if (step.kind === 'gap' && this.afterLearn) { this.afterLearn = false; return this.endBeat(); }
    this.qi++;
    if (this.qi < this.queue.length) return this.play(this.queue[this.qi]);
    return this.endBeat();
  }

  private play(step: Step) {
    this.track?.stop();
    if (step.kind !== 'video') this.videoEl = null;
    const prev = this.step;
    this.step = step;
    const s = useStory.getState();
    const lang = useApp.getState().lang;
    const beat = BEATS[s.beatIndex];
    let phase: Phase = 'line';
    if (step.kind === 'line' || step.kind === 'learn' || step.kind === 'status') {
      const line = step.line;
      if (step.kind === 'status') phase = 'status';
      const text = pick(line.text, lang);
      const est = line.text.en ? estimateSeconds(line.text.en) : 1.6;
      // a voice file only matches its own language; English audio never plays under Bangla captions
      const v = text ? voiceFor(line, text === line.text.en ? 'en' : lang) : null;
      // the cast: machines talk through their era's radio (by the machine's own year), the kid voice is VIMO, higher
      const era = line.speaker === 'machine' ? eraOf(MACHINES[beat?.card ?? beat?.machineId ?? '']?.year ?? beat?.year) : undefined;
      if (era) sfx(`radio-${era}`);
      if (v) {
        const at = new AudioTrack(`${import.meta.env.BASE_URL}${v.file}`, est);
        at.element.volume = voiceVolume();
        this.level = voiceLevel(at.element, { kid: line.speaker === 'kid' && !!v.pitchUp, machine: era });
        this.track = at;
        this.current = { line: { ...line, words: v.words }, time: 0, duration: 0, prefix: '' };
      } else {
        this.level = null; this.track = new SilentTrack(est);
        this.current = { line, time: 0, duration: 0, prefix: '' };
      }
      this.current.duration = this.track.duration;
      if (line.vimo) place(phoneSafe(line.vimo, beat));
      if (line.speaker === 'machine') { speak(null); machineSay(line, beat, step.kind === 'status'); }
      else { machineSay(null, beat); speak(text || null, line.speaker === 'kid'); }
      if (step.kind === 'line') s.setPosition({ lineIndex: step.index });
      if (step.kind === 'learn') this.afterLearn = true;
    } else if (step.kind === 'hold') {
      // the scene plays on (rocket climbs, sky turns to space, quick-tour machines flash by)
      this.track = new SilentTrack(step.seconds);
      live.speaking = 0; speak(null); machineSay(null, beat);
      this.current = { line: null, time: 0, duration: 0, prefix: '' };
      phase = 'hold';
    } else if (step.kind === 'gap') {
      this.track = new SilentTrack(GAP_AFTER_LINE);
      live.speaking = 0;
      phase = 'gap';
      if (prev?.kind === 'learn') this.afterLearn = true;
    } else if (step.kind === 'video') {
      const v = videoFor(beat);
      const base = import.meta.env.BASE_URL;
      if (v && (v.clips.length || v.src)) {
        const el = document.createElement('video');
        el.playsInline = true;
        el.volume = voiceVolume();
        if (v.poster) el.poster = `${base}${v.poster}`;
        for (const [l, file] of Object.entries(v.captions ?? {})) {
          const tr = document.createElement('track');
          tr.kind = 'captions'; tr.srclang = l; tr.src = `${base}${file}`;
          tr.default = l === lang; el.appendChild(tr);
        }
        this.videoEl = el;
        if (v.clips.length > 1) this.track = new PlaylistTrack(el, v.clips.map((c) => `${base}${c}`));
        else { el.src = `${base}${v.clips[0] ?? v.src}`; this.track = new AudioTrack(el, v.seconds ?? 50); }
      } else {
        this.videoEl = null;
        this.track = new SilentTrack(v?.seconds ?? 12);
      }
      place(GUIDE_VIDEO); speak(null); machineSay(null, beat); live.speaking = 0;
      this.current = { line: null, time: 0, duration: 0, prefix: '' };
      phase = 'video';
      sfx('tv-on');
    } else if (step.kind === 'card') {
      this.track = new SilentTrack(cardSeconds(beat));
      place(GUIDE_CARD); speak(null); machineSay(null, beat);
      this.current = { line: null, time: 0, duration: 0, prefix: '' };
      phase = 'card';
      sfx('card');
    } else {
      this.track = new SilentTrack(TRY_IT_WAIT);
      live.speaking = 0;
      speak(null); machineSay(null, beat);
      this.current = { line: null, time: 0, duration: 0, prefix: '' };
      phase = 'tryit';
    }
    this.stepDuration = this.track.duration;
    s.setPosition({ phase });
    if (!s.paused) this.track.play();
  }

  private loop = () => {
    if (!this.running) return;
    const t = this.track;
    if (t && this.step) {
      const time = t.time;
      const paused = useStory.getState().paused;
      if (this.step.kind === 'line' || this.step.kind === 'learn' || this.step.kind === 'status') {
        this.current.time = time;
        this.current.duration = t.duration;
        // mouth: real voice loudness, else a soft envelope from the same clock
        live.speaking = paused || !this.current.line?.text.en ? 0 : this.level ? this.level() : 0.45 + 0.35 * Math.abs(Math.sin(time * 9));
      } else if (this.step.kind === 'card') {
        const readFor = this.stepDuration - GAP_AFTER_LINE;
        live.speaking = paused || time > readFor ? 0 : 0.4 + 0.3 * Math.abs(Math.sin(time * 9));
      }
      this.stepTime = time;
      // the 3D stage plays through the beat as the story clock moves
      live.t = Math.min(1, (this.beatDone + Math.min(time, this.stepDuration)) / this.beatTotal);
      useStory.getState().setLineTime(time);
      if (t.ended) {
        if (this.step.kind === 'tryit') this.completeTryIt(false);
        else this.advance();
      }
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}

export const engine = new StoryEngine();

/** Quick tour: which machine is on screen now (index in worldMachines), or -1 while VIMO is still talking. */
export function quickChip(): number {
  const beat = BEATS[useStory.getState().beatIndex];
  if (!beat?.quick || engine.stepKind !== 'hold') return -1;
  return Math.min(worldMachines(beat.quick).length - 1, Math.floor(engine.stepTime / QUICK_EACH));
}

// Dev-only test hook: jump to a beat by id.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __story: unknown }).__story = {
    jump: (id: string) => { const i = BEATS.findIndex((b) => b.id === id); if (i >= 0) engine.start(i); return i; },
    beats: () => BEATS.map((b) => b.id),
    pause: (p: boolean) => engine.setPaused(p),
  };
}
