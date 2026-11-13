import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Link, useNavigate } from 'react-router-dom';
import { WorldCanvas, hasWebGL } from '../scenes/WorldCanvas';
import { Stars } from '../three/world';
import { Machine } from '../three/Machine';
import { EXPERIENCES, SHARED } from '../experience/experiences';
import { machineById, WORLD_COLOR } from '../data/machines';
import { VimoLayer } from '../vimo/VimoLayer';
import { setVimo, react } from '../vimo/controller';
import { audio } from '../audio/engine';
import { Btn, NasaPhoto } from '../ui/common';
import { useStore } from '../store';

const R = 9;
const SIZE: Record<string, number> = { 'apollo11-eagle': 0.42, 'apollo11-mirror': 1, 'apollo15-rover': 1, viking1: 1.2, sojourner: 1, opportunity: 1.4, curiosity: 1.1, insight: 0.8, perseverance: 1.1, ingenuity: 2.6, lro: 0.8, voyager1: 0.9, 'new-horizons': 1.3, dart: 0.55 };

function Ring({ angle }: { angle: React.MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null!);
  const items = useRef<THREE.Group[]>([]);
  useFrame(({ camera, clock }, dt) => {
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, angle.current, 5, dt);
    items.current.forEach((it, i) => { if (it) it.rotation.y = clock.elapsedTime * 0.3 + i; });
    camera.position.set(0, 3.2, R + 7); camera.lookAt(0, 1.2, R - 2);
  });
  const n = EXPERIENCES.length;
  return (
    <group ref={g}>
      {EXPERIENCES.map((e, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <group key={e.id} position={[Math.sin(a) * R, 0, Math.cos(a) * R]}>
            <group ref={(r) => (items.current[i] = r!)} scale={SIZE[e.machine] || 1}>
              <Machine id={e.machine} />
            </group>
            <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.6, 40]} /><meshBasicMaterial color={WORLD_COLOR[e.world === 'earth' ? 'earth' : e.world]} transparent opacity={0.25} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function ExperienceCarousel() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const angle = useRef(0);
  const drag = useRef<number | null>(null);
  const n = EXPERIENCES.length;
  const e = EXPERIENCES[((i % n) + n) % n];
  const m = machineById[e.machine];
  const stamps = useStore((s) => s.stamps);
  const webgl = hasWebGL();

  useEffect(() => {
    setVimo({ screen: 'left', size: 'M', face: 'excited', gesture: 'point' });
    const t = setTimeout(() => audio.speak('xp-shared-carousel', { who: 'vimo', text: SHARED.carousel }, useStore.getState().lang), 500);
    audio.playCue('M13');
    return () => { clearTimeout(t); audio.stopVoice(); };
  }, []);
  const turn = (d: number) => { const k = i + d; setI(k); angle.current = -(k / n) * Math.PI * 2; audio.sfx('card'); };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'ArrowRight') turn(1); if (ev.key === 'ArrowLeft') turn(-1); if (ev.key === 'Enter') enter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const enter = () => { react('thumbs', 'excited', 1.2); audio.sfx('whoosh'); setTimeout(() => nav(`/experience/${e.id}`), 450); };

  return (
    <div className="carousel-page"
      onPointerDown={(ev) => (drag.current = ev.clientX)}
      onPointerUp={(ev) => { if (drag.current == null) return; const dx = ev.clientX - drag.current; drag.current = null; if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1); }}>
      {webgl ? (
        <WorldCanvas>
          <color attach="background" args={['#0B1033']} />
          <Stars />
          <hemisphereLight args={['#dfe9ff', '#3a3450', 0.9]} />
          <directionalLight position={[6, 10, 14]} intensity={2.6} color="#FFF1D6" />
          <directionalLight position={[-8, 4, -10]} intensity={1.2} color="#7FB2FF" />
          <Ring angle={angle} />
        </WorldCanvas>
      ) : <div className="photo-backdrop"><NasaPhoto id={m.photo} alt={m.photoAlt || m.name} /></div>}
      <VimoLayer />
      <header className="topbar"><Link to="/" className="home-btn" aria-label="Home">🏠</Link><div className="year-box"><span className="part-name">Experience Mode</span><span className="year small">Step inside a machine</span></div><div /></header>
      <div className="carousel-ui">
        <button className="arrow-big" onClick={() => turn(-1)} aria-label="Previous machine">◀</button>
        <div className="carousel-card" style={{ ['--c' as any]: WORLD_COLOR[e.world === 'earth' ? 'earth' : e.world] }}>
          <span className="chip">{m.year}</span>
          <h2>{m.name}</h2>
          <p>{e.title}{stamps.includes(`xp-${e.id}`) ? ' · ⭐ done' : ''}</p>
          <p className="tiny">{e.imagined ? 'Imagined control room' : e.room === 'cabin' ? 'Real kind of cabin (simplified)' : 'Real place (simplified)'} · {e.steps.length} buttons</p>
          <Btn className="big" onClick={enter}>🚪 Enter</Btn>
        </div>
        <button className="arrow-big" onClick={() => turn(1)} aria-label="Next machine">▶</button>
      </div>
      <p className="carousel-hint">Swipe, drag or use ◀ ▶ to turn the ring · {((i % n) + n) % n + 1} / {n}</p>
    </div>
  );
}
