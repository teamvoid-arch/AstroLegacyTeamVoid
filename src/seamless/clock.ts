/*
  The story clock. Everything (VIMO cues, captions, auto-advance) reads time from here,
  never from setTimeout (doc 07 §6).

  - With a voice file: time = audio.currentTime.
  - Without one (placeholder beats, muted, or before the sound pass): a "silent track"
    that advances with the frame clock exactly like an audio element would, and stops on pause.
*/
export interface Track {
  /** Seconds since the track started. */
  readonly time: number;
  readonly duration: number;
  readonly ended: boolean;
  play(): void;
  pause(): void;
  stop(): void;
}

export class SilentTrack implements Track {
  private t = 0;
  private last = 0;
  private running = false;
  constructor(public readonly duration: number) {}
  get time() {
    if (this.running) {
      const now = performance.now() / 1000;
      this.t = Math.min(this.duration, this.t + (now - this.last));
      this.last = now;
    }
    return this.t;
  }
  get ended() { return this.time >= this.duration; }
  play() { if (!this.running) { this.running = true; this.last = performance.now() / 1000; } }
  pause() { void this.time; this.running = false; }
  stop() { this.running = false; this.t = 0; }
}

export class AudioTrack implements Track {
  private el: HTMLMediaElement;
  private failed = false;
  private fallback: SilentTrack;
  /** `src` = an audio file, or an existing <video>/<audio> element (VIMO TV clips). */
  constructor(src: string | HTMLMediaElement, estimate: number) {
    this.el = typeof src === 'string' ? new Audio(src) : src;
    this.el.preload = 'auto';
    this.fallback = new SilentTrack(estimate);
    // A missing or blocked file must never stall the story: fall back to the estimate.
    this.el.addEventListener('error', () => { this.failed = true; });
  }
  /** The media element (for the loudness analyser that moves VIMO's mouth). */
  get element() { return this.el; }
  get duration() { return this.failed || !isFinite(this.el.duration) ? this.fallback.duration : this.el.duration; }
  get time() { return this.failed ? this.fallback.time : this.el.currentTime; }
  get ended() { return this.failed ? this.fallback.ended : this.el.ended; }
  play() {
    if (this.failed) return this.fallback.play();
    this.el.play().catch(() => {
      // autoplay with sound refused: try muted (captions carry it), else fall back to the estimate
      this.el.muted = true;
      this.el.play().catch(() => { this.failed = true; this.fallback.play(); });
    });
  }
  pause() { this.failed ? this.fallback.pause() : this.el.pause(); }
  stop() { this.el.pause(); this.fallback.stop(); }
}

/** VIMO TV playlist: several 8 s clips (Google Veo shots) played one after another in one <video>.
    Time runs across all clips; a clip that fails to load is skipped so the story never stalls. */
export class PlaylistTrack implements Track {
  private i = 0;
  private before = 0;
  private done = false;
  private fallback: SilentTrack | null = null;
  constructor(private el: HTMLVideoElement, private srcs: string[], private each = 8) {
    el.preload = 'auto';
    el.src = srcs[0];
    el.addEventListener('ended', () => this.nextClip());
    el.addEventListener('error', () => this.nextClip());
  }
  private nextClip() {
    this.before += isFinite(this.el.duration) ? this.el.duration : this.each;
    if (this.i + 1 >= this.srcs.length) { this.done = true; return; }
    this.i++;
    this.el.src = this.srcs[this.i];
    this.el.play().catch(() => { this.el.muted = true; this.el.play().catch(() => this.nextClip()); });
  }
  get duration() { return this.fallback ? this.fallback.duration : this.srcs.length * this.each; }
  get time() { return this.fallback ? this.fallback.time : Math.min(this.duration, this.before + this.el.currentTime); }
  get ended() { return this.fallback ? this.fallback.ended : this.done; }
  play() {
    if (this.fallback) return this.fallback.play();
    this.el.play().catch(() => {
      this.el.muted = true;
      this.el.play().catch(() => { this.fallback = new SilentTrack(this.duration); this.fallback.play(); });
    });
  }
  pause() { this.fallback ? this.fallback.pause() : this.el.pause(); }
  stop() { this.el.pause(); this.fallback?.stop(); }
}

/** Narration pace for estimates: 140 words a minute (doc 07 §3), at least 1.5 s. */
export function estimateSeconds(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1.5, (words / 140) * 60);
}

/** Even word timings when ElevenLabs timestamps are not there yet. */
export function estimateWords(text: string, duration: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const step = duration / Math.max(1, words.length);
  return words.map((w, i) => ({ w, t: i * step }));
}
