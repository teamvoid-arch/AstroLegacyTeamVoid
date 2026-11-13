import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { VimoCharacter } from './Nova';
import { react, say, tapVimo, vimo } from './controller';
import { audio } from '../audio/engine';
import { SpeechBubble } from '../ui/SpeechBubble';

/** VIMO lives in her own transparent canvas above the world, so the era colour
    grade never touches her (Build Spec §3). Her lines appear in a speech bubble
    beside her head (the Nova Story Guide style). Taps go to an accessible button. */
export function VimoLayer({ interactive = true }: { interactive?: boolean }) {
  const btn = useRef<HTMLButtonElement>(null);
  const five = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const h = vimo.hit;
      if (btn.current) {
        const r = Math.max(28, h.r);
        btn.current.style.transform = `translate(${h.x - r}px, ${h.y - r}px)`;
        btn.current.style.width = btn.current.style.height = `${r * 2}px`;
      }
      if (five.current) {
        five.current.style.display = vimo.highFive ? 'block' : 'none';
        five.current.style.transform = `translate(${h.hx - 30}px, ${h.hy - 30}px)`;
      }

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const onTap = () => {
    audio.unlock();
    const s = tapVimo();
    if (s) audio.sfx(s);
  };
  const highFive = () => {
    vimo.highFive = false;
    react('cheer', 'excited', 1.4);
    say('Up top! Yesss!', 1.8);
    audio.sfx('clap');
    audio.sfx('chime');
    document.dispatchEvent(new CustomEvent('al-sparkle', { detail: { x: vimo.hit.hx, y: vimo.hit.hy } }));
  };

  return (
    <div className="vimo-layer" aria-hidden={false}>
      <Canvas className="vimo-canvas" camera={{ fov: 30, position: [0, 0, 10] }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => { gl.toneMapping = 4; /* ACESFilmic, like the Nova guide */ }}>
        <hemisphereLight args={['#bcd7ff', '#2a1a4a', 0.8]} />
        <directionalLight position={[4, 5, 6]} intensity={2.2} color="#fff1dd" />
        <directionalLight position={[-2, 5, -4]} intensity={2.5} color="#fff0c8" />
        <VimoCharacter />
      </Canvas>
      {interactive && (
        <>
          <button ref={btn} className="vimo-hit" onClick={onTap} aria-label="Tap VIMO, the astronaut guide" />
          <button ref={five} className="vimo-five" onClick={highFive} onPointerMove={(e) => { if (e.buttons && e.movementY < -4) highFive(); }} aria-label="High-five VIMO">✋</button>
        </>
      )}
      <SpeechBubble
        say={() => {
          const pt = performance.now() / 1000;
          if (vimo.bubble && vimo.bubble.until > pt) return { key: `r:${vimo.bubble.text}:${vimo.bubble.until}`, text: vimo.bubble.text };
          if (vimo.line && !vimo.hidden) return { key: vimo.line.key, text: vimo.line.text, kid: !!vimo.line.kid };
          return null;
        }}
        anchor={() => {
          const hd = vimo.head, W = window.innerWidth, H = window.innerHeight;
          return { x: hd.x, y: hd.y, r: hd.r, right: hd.right, mode: 'side', ok: hd.x > -20 && hd.x < W + 20 && hd.y > -20 && hd.y < H + 20 };
        }}
        onTyping={(b) => { vimo.typing = b; }}
      />
    </div>
  );
}
