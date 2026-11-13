import { useEffect, useState } from 'react';

/** Gentle sparkle burst (high-five, stamps). No flashing: each sparkle fades once. */
export function Sparkles() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail;
      const id = Math.random();
      setBursts((b) => [...b, { id, x: d.x, y: d.y }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1300);
    };
    document.addEventListener('al-sparkle', on);
    return () => document.removeEventListener('al-sparkle', on);
  }, []);
  return (
    <div className="sparkles" aria-hidden>
      {bursts.map((b) => (
        <div key={b.id} className="burst" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 10 }, (_, i) => <i key={i} style={{ ['--a' as any]: `${i * 36}deg` }}>✦</i>)}
        </div>
      ))}
    </div>
  );
}
