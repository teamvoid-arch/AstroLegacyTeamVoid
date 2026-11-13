import { useEffect, useRef, useState } from 'react';
import { pieceMs, splitIntoLines } from './oneLine';

/** Shows a caption one line at a time (pieces that fit the box width), with the full text for screen readers. */
export function OneLineText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [pieces, setPieces] = useState<string[]>([text]);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    setPieces(splitIntoLines(text, Math.max(120, el.clientWidth - 4), font));
    setI(0);
  }, [text]);

  useEffect(() => {
    if (i >= pieces.length - 1) return;
    const id = window.setTimeout(() => setI((n) => n + 1), pieceMs(pieces[i]));
    return () => clearTimeout(id);
  }, [i, pieces]);

  return (
    <>
      <p ref={ref} className={`one-line ${className}`} aria-hidden="true" key={i}>{pieces[i] ?? text}</p>
      <span className="sr-only">{text}</span>
    </>
  );
}
