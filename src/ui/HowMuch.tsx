import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { ExtLink } from './common';

// "How much is up there?" counter.
// Number from the team's Challenge Brief, which cites the NASA History Office
// "Catalogue of Manmade Material on the Moon" (796 objects). Awaiting fact-check
// against the PDF itself (it uses an embedded font, so it could not be machine-read).
export const MOON_OBJECTS = 796;
export const MOON_CATALOGUE_URL = 'https://www.nasa.gov/wp-content/uploads/2024/02/final-catalogue-of-manmade-material-on-the-moon.pdf';

export function HowMuch() {
  const reduced = useStore((s) => s.settings.reducedMotion);
  const [n, setN] = useState(reduced ? MOON_OBJECTS : 0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) { setN(MOON_OBJECTS); return; }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1800);
        setN(Math.round(MOON_OBJECTS * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); run(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section ref={ref} className="howmuch" aria-label="How much is up there?">
      <h2>🌕 How much is up there?</h2>
      <div className="howmuch-num" aria-hidden="true">{n.toLocaleString('en')}</div>
      <p className="sr-only">{MOON_OBJECTS} objects</p>
      <p>
        NASA's History Office keeps a list of things people have left on the Moon: landers, rovers, tools, experiments and more.
        It lists <b>{MOON_OBJECTS}</b> objects. Not junk: each one is a clue about how we got there.
      </p>
      <p className="tiny">
        Source: <ExtLink href={MOON_CATALOGUE_URL}>NASA History Office: Catalogue of Manmade Material on the Moon (PDF)</ExtLink> · awaiting fact-check
      </p>
    </section>
  );
}
