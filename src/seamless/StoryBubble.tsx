/*
  Story speech bubbles (13 Nov 2026), in the landing page's Nova bubble style:
  - VIMO's lines (and her kid-voice questions) sit beside her head; on a phone above it, or below
    her when there is no room above.
  - A machine's lines sit above that machine's 3D model, with its name on a small label.
  - ONE line at a time: the line is split into pieces that fit on one line. Each piece fades in whole
    (easy to read, no letter-by-letter typing) and its words light up as they are spoken, on the
    story clock (real ElevenLabs word timings when the voice exists, an even estimate before that).
  - Content aware: the bubble never covers the talking machine, the top bar or the Next button;
    it tries beside → the other side → above → below and keeps the first spot that fits.
*/
import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { personalise } from '../data/i18n';
import { vimo } from '../vimo/controller';
import { machineSpeech } from '../three/speechAnchor';
import { splitIntoLines } from '../ui/oneLine';
import { useStory } from './state';
import { engine, speakingMachineName } from './engine';
import { estimateWords } from './clock';
import { pick } from './types';

const FONT = "600 17px 'Baloo Da 2', 'Hind Siliguri', 'Baloo 2', system-ui, sans-serif";
const TOP = 64;        // top bar
const BOTTOM = 96;     // Next / Pause
const GAP = 10;

type Rect = { x: number; y: number; w: number; h: number };
const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function StoryBubble() {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0, last = performance.now();
    let lineKey = '', pieceKey = '', lit = -1;
    let pieces: { words: { w: string; t: number }[] }[] = [];
    const pos = { x: 0, y: 0, ready: false };

    const hide = () => { root.current?.classList.remove('show'); lineKey = ''; pieceKey = ''; pos.ready = false; };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(loop);
      const el = root.current, b = body.current, tx = text.current;
      if (!el || !b || !tx) return;

      const app = useStore.getState();
      const phase = useStory.getState().phase;
      const { line, time, duration, prefix } = engine.current;
      // VIMO's own short reactions ("Up top!") use her landing-page bubble; story lines wait for them
      const reacting = !!vimo.bubble && vimo.bubble.until > now / 1000;
      const active = app.settings.captions && line && !reacting && (phase === 'line' || phase === 'status') && !vimo.hidden;
      if (!active) { if (lineKey) hide(); return; }

      const machine = line.speaker === 'machine';
      const words0 = pick(line.text, app.lang);
      if (!words0) { if (lineKey) hide(); return; }
      const content = personalise(words0, app.name);
      const key = `${line.id}:${app.lang}`;
      if (key !== lineKey) {
        lineKey = key; pieceKey = ''; lit = -1;
        // word timings: ElevenLabs (English audio) or an even spread over the line's time
        const timed = content === line.text.en && line.words?.length ? line.words : estimateWords(content, duration);
        const maxPx = Math.min(420, window.innerWidth * 0.82) - 36;
        const lines = splitIntoLines(content, maxPx, FONT);
        pieces = []; let k = 0;
        for (const l of lines) { const n = l.split(/\s+/).length; pieces.push({ words: timed.slice(k, k + n) }); k += n; }
        el.dataset.kid = line.speaker === 'kid' ? '1' : '';
        el.classList.toggle('machine', machine);
        if (label.current) {
          const name = machine ? speakingMachineName() : null;
          const lab = name ?? (prefix || '');
          label.current.textContent = lab; label.current.style.display = lab ? '' : 'none';
        }
      }

      // which piece and which word are being spoken now
      let wi = -1, pi = 0, seen = 0;
      for (let p = 0; p < pieces.length; p++) {
        for (let w = 0; w < pieces[p].words.length; w++) if (pieces[p].words[w].t <= time) { wi = seen + w; pi = p; }
        seen += pieces[p].words.length;
      }
      const pk = `${lineKey}#${pi}`;
      if (pk !== pieceKey) {
        pieceKey = pk; lit = -1;
        tx.innerHTML = '';
        for (const w of pieces[pi]?.words ?? []) { const s = document.createElement('span'); s.className = 'w'; s.textContent = `${w.w} `; tx.appendChild(s); }
        b.classList.remove('in'); void b.offsetWidth; b.classList.add('in');
      }
      const first = pieces.slice(0, pi).reduce((n, p) => n + p.words.length, 0);
      const local = wi - first;
      if (local !== lit) {
        lit = local;
        Array.from(tx.children).forEach((s, i) => { s.className = i < local ? 'w said' : i === local ? 'w now' : 'w'; });
      }

      // ---- placement (content aware)
      const W = window.innerWidth, H = window.innerHeight;
      const w = el.offsetWidth, h = el.offsetHeight;
      const ma = machineSpeech.anchor;
      const machineSeen = now - ma.t < 400;
      const machineBox: Rect | null = machineSeen ? { x: ma.x - ma.r * 1.3, y: ma.y, w: ma.r * 2.6, h: ma.r * 2 } : null;
      const vimoBox: Rect = { x: vimo.hit.x - vimo.hit.r, y: vimo.head.y - vimo.head.r, w: vimo.hit.r * 2, h: vimo.hit.y + vimo.hit.r - (vimo.head.y - vimo.head.r) };
      const fits = (r: Rect) => r.x >= 8 && r.x + r.w <= W - 8 && r.y >= TOP && r.y + r.h <= H - BOTTOM;
      let spots: { r: Rect; tail: string }[] = [];
      if (machine) {
        const ax = machineSeen ? ma.x : W / 2, ay = machineSeen ? ma.y : H * 0.32;
        spots = [
          { r: { x: ax - w / 2, y: ay - h - 16, w, h }, tail: 'center' },
          { r: { x: ax - w / 2, y: (machineBox ? machineBox.y + machineBox.h : ay) + 16, w, h }, tail: 'top' },
        ];
      } else {
        const hd = vimo.head, r = Math.max(12, hd.r);
        const beside = (right: boolean) => ({ r: { x: right ? hd.x - w - r * 0.9 : hd.x + r * 0.9, y: hd.y - h - r * 0.4, w, h }, tail: right ? 'right' : 'left' });
        spots = [
          ...(W >= 760 ? [beside(hd.right), beside(!hd.right)] : []),
          { r: { x: hd.x - w / 2, y: hd.y - r - h - GAP, w, h }, tail: 'center' },
          { r: { x: hd.x - w / 2, y: vimoBox.y + vimoBox.h + GAP, w, h }, tail: 'top' },
        ];
      }
      const clamp = (s: { r: Rect; tail: string }) => ({ ...s, r: { ...s.r, x: Math.min(Math.max(s.r.x, 8), W - w - 8), y: Math.min(Math.max(s.r.y, TOP), H - BOTTOM - h) } });
      const good = spots.find((s) => fits(s.r) && !(machineBox && !machine && overlaps(s.r, machineBox)) && !(machine && overlaps(s.r, vimoBox)))
        ?? spots.map(clamp).find((s) => !(machineBox && !machine && overlaps(s.r, machineBox)))
        ?? clamp(spots[0]);
      const k = pos.ready ? 1 - Math.exp(-dt * 8) : 1;
      pos.x += (good.r.x - pos.x) * k; pos.y += (good.r.y - pos.y) * k; pos.ready = true;
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      el.dataset.tail = good.tail;
      el.classList.add('show');
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={root} className="sl-bubble" aria-hidden="true">
      <div ref={body} className="sl-bubble-body">
        <span ref={label} className="sl-bubble-label" style={{ display: 'none' }} />
        <div ref={text} className="sl-bubble-text" />
      </div>
    </div>
  );
}
