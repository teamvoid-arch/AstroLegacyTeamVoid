import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { personalise } from '../data/i18n';
import { pieceMs, splitIntoLines } from './oneLine';

const BUBBLE_FONT = "600 16.8px 'Baloo Da 2', 'Hind Siliguri', 'Baloo 2', system-ui, sans-serif";
const graphemes = typeof Intl !== 'undefined' && 'Segmenter' in Intl
  ? (s: string) => [...new (Intl as any).Segmenter('bn', { granularity: 'grapheme' }).segment(s)].map((g: any) => g.segment as string)
  : (s: string) => Array.from(s);

export interface BubbleSay { key: string; text: string; kid?: boolean; label?: string }
/** Where the speaker is on screen (page px). `side`: bubble beside the head; `above`: bubble above the top point. */
export interface BubbleAnchor { x: number; y: number; r: number; right?: boolean; ok: boolean; mode: 'side' | 'above' }

/**
 * A Nova-style speech bubble that follows a speaker on screen and shows ONE line at a time:
 * the text is split into pieces that fit on one line; each piece types in, stays for its
 * reading time, then the next replaces it. Used by VIMO and by the talking machines.
 */
export function SpeechBubble({ say, anchor, onTyping, variant = '' }: {
  say: () => BubbleSay | null; anchor: () => BubbleAnchor; onTyping?: (typing: boolean) => void; variant?: string;
}) {
  const bubble = useRef<HTMLDivElement>(null);
  const bodyEl = useRef<HTMLDivElement>(null);
  const sizer = useRef<HTMLSpanElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const name = useStore((s) => s.name);
  const nameRef = useRef(name);
  nameRef.current = name;
  const fns = useRef({ say, anchor, onTyping });
  fns.current = { say, anchor, onTyping };

  useEffect(() => {
    let raf = 0, timer = 0, shownKey = '';
    const pos = { x: 0, y: 0, ready: false };
    let last = performance.now();
    const typing = (b: boolean) => fns.current.onTyping?.(b);

    const show = (s: BubbleSay) => {
      const el = bubble.current, body = bodyEl.current;
      if (!el || !body || !sizer.current || !typed.current) return;
      clearTimeout(timer);
      el.dataset.kid = s.kid ? '1' : '';
      if (label.current) { label.current.textContent = s.label || ''; label.current.style.display = s.label ? '' : 'none'; }
      body.classList.remove('pop'); void body.offsetWidth; body.classList.add('pop');
      const text = personalise(s.text, nameRef.current);
      const pieces = splitIntoLines(text, Math.min(440, window.innerWidth * 0.86) - 40, BUBBLE_FONT);
      const reduced = useStore.getState().settings.reducedMotion;
      let i = 0;
      const next = () => {
        if (!typed.current || !sizer.current) return;
        const piece = pieces[i];
        sizer.current.textContent = piece;
        if (reduced) {
          typed.current.textContent = piece; typing(false);
          if (++i < pieces.length) timer = window.setTimeout(next, pieceMs(piece));
          return;
        }
        const chars = graphemes(piece);
        let n = 0;
        typed.current.textContent = '';
        typing(true);
        const tick = () => {
          if (!typed.current) return;
          typed.current.textContent = chars.slice(0, ++n).join('');
          if (n < chars.length) { timer = window.setTimeout(tick, 26); return; }
          typing(false);
          if (++i < pieces.length) timer = window.setTimeout(next, Math.max(500, pieceMs(piece) - chars.length * 26));
        };
        timer = window.setTimeout(tick, 26);
      };
      next();
    };
    const hide = () => { clearTimeout(timer); typing(false); bubble.current?.classList.remove('show'); pos.ready = false; };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const want = useStore.getState().settings.captions ? fns.current.say() : null;
      if ((want?.key || '') !== shownKey) {
        shownKey = want?.key || '';
        if (want) show(want); else hide();
      }
      const el = bubble.current;
      if (el && shownKey) {
        const a = fns.current.anchor();
        const w = el.offsetWidth, hh = el.offsetHeight;
        const W = window.innerWidth, H = window.innerHeight;
        el.classList.toggle('show', a.ok);
        if (!a.ok) pos.ready = false;
        const r = Math.max(12, a.r);
        let x: number, y: number, tail: string;
        if (a.mode === 'above' || W < 760) { x = a.x - w / 2; y = a.y - hh - (a.mode === 'above' ? 18 : r * 1.4); tail = 'center'; }
        else if (a.right) { x = a.x - w - r * 0.9; y = a.y - hh - r * 0.6; tail = 'right'; }
        else { x = a.x + r * 0.9; y = a.y - hh - r * 0.6; tail = 'left'; }
        x = Math.min(Math.max(x, 12), W - w - 12);
        y = Math.min(Math.max(y, 64), H - hh - 12);
        const k = pos.ready ? 1 - Math.exp(-dt * 10) : 1;
        pos.x += (x - pos.x) * k; pos.y += (y - pos.y) * k; pos.ready = true;
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        el.dataset.tail = tail;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); typing(false); };
  }, []);

  return (
    <div ref={bubble} className={`nova-bubble ${variant}`} aria-hidden="true">
      <div ref={bodyEl} className="nova-bubble-body">
        <span ref={label} className="bubble-label" style={{ display: 'none' }} />
        <span ref={sizer} className="sizer" /><span ref={typed} className="text" />
      </div>
    </div>
  );
}
