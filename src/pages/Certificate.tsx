import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { PageShell } from './PageShell';
import { Btn } from '../ui/common';
import { machines } from '../data/machines';

/** Drawn on a canvas in the browser. Uses only a first name typed on this device. */
export default function Certificate() {
  const storedName = useStore((s) => s.name);
  const setName = useStore((s) => s.setName);
  const stamps = useStore((s) => s.stamps);
  const [name, setLocal] = useState(storedName);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!; const g = c.getContext('2d')!;
    const W = 1200, H = 850; c.width = W; c.height = H;
    const grd = g.createLinearGradient(0, 0, W, H); grd.addColorStop(0, '#0B1033'); grd.addColorStop(1, '#3B2A8C');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 220; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    g.fillStyle = '#FFF7E8'; roundRect(g, 60, 60, W - 120, H - 120, 36); g.fill();
    g.strokeStyle = '#FFC94D'; g.lineWidth = 10; roundRect(g, 80, 80, W - 160, H - 160, 28); g.stroke();
    g.fillStyle = '#0B1033'; g.textAlign = 'center';
    g.font = '800 34px "Baloo 2", Nunito, sans-serif'; g.fillText('ASTRO LEGACY', W / 2, 165);
    g.font = '800 68px "Baloo 2", Nunito, sans-serif'; g.fillStyle = '#FF8A3D'; g.fillText('Official Space Caretaker', W / 2, 260);
    g.fillStyle = '#0B1033'; g.font = '600 30px Nunito, sans-serif'; g.fillText('This certifies that', W / 2, 335);
    g.font = '800 80px "Baloo 2", Nunito, sans-serif'; g.fillText(name || 'Space Buddy', W / 2, 430);
    g.font = '600 28px Nunito, sans-serif';
    g.fillText(`visited ${stamps.length} of ${machines.length} machines NASA left on the Moon, on Mars and in deep space,`, W / 2, 500);
    g.fillText('and remembers them: not abandoned, not forgotten.', W / 2, 542);
    g.font = '600 24px Nunito, sans-serif'; g.fillStyle = '#555';
    g.fillText(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, 610);
    g.fillStyle = '#FF8A3D'; g.font = 'italic 700 44px "Baloo 2", cursive'; g.fillText('VIMO', W / 2 + 300, 700);
    g.strokeStyle = '#FF8A3D'; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2 + 200, 712); g.lineTo(W / 2 + 400, 712); g.stroke();
    g.fillStyle = '#555'; g.font = '600 18px Nunito, sans-serif'; g.fillText('Very Important Machine Observer', W / 2 + 300, 740);
    // stamp
    g.save(); g.translate(260, 690); g.rotate(-0.2);
    g.strokeStyle = '#E2683C'; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 70, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#E2683C'; g.font = '800 26px "Baloo 2", sans-serif'; g.fillText('LOGGED!', 0, 10); g.restore();
    g.fillStyle = '#777'; g.font = '500 16px Nunito, sans-serif'; g.fillText('NASA Space Apps Challenge 2026 · Team VOID · Not affiliated with or endorsed by NASA', W / 2, H - 100);
  }, [name, stamps.length]);

  return (
    <PageShell title="Your certificate" subtitle="Type your first name (optional). It stays on this device.">
      <div className="row wrap">
        <input className="text-input" value={name} maxLength={24} onChange={(e) => setLocal(e.target.value)} aria-label="First name" placeholder="First name" />
        <Btn kind="soft" onClick={() => setName(name)}>Save name</Btn>
        <Btn onClick={() => { const a = document.createElement('a'); a.download = 'astro-legacy-certificate.png'; a.href = ref.current!.toDataURL('image/png'); a.click(); }}>⬇️ Download PNG</Btn>
      </div>
      <canvas ref={ref} className="certificate" aria-label="Your Astro Legacy certificate" />
    </PageShell>
  );
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
