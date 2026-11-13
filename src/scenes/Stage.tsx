import * as THREE from 'three';
import { Suspense, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Beat } from '../data/types';
import { live, useStore } from '../store';
import { Machine, NasaModel } from '../three/Machine';
import { Airbags, Bridles, CameraShake, EntryCapsule, Parachute, Plume, SkyCrane, Smoke } from '../three/explain';

import { Atmosphere, DottedArc, Dust, Earth, Ground, MoonGlobe, Pin, ProcPlanet, Ripples, Rocks, SkyDome, Stars, latLon } from '../three/world';
import { rng } from '../three/materials';

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => x * x * (3 - 2 * x);
const has = (b: Beat, f: string) => !!b.fx?.includes(f);

/** Camera rig: shot(t) → [position, lookAt]; smooth damping, snaps on new stage. */
function useShot(shot: (t: number, time: number) => [THREE.Vector3, THREE.Vector3]) {
  const { camera } = useThree();
  const first = useRef(true);
  const look = useRef(new THREE.Vector3());
  const ref = useRef(shot);
  ref.current = shot;
  useFrame((s, dt) => {
    const [p, l] = ref.current(live.t, s.clock.elapsedTime);
    const reduced = useStore.getState().settings.reducedMotion;
    if (first.current) { camera.position.copy(p); look.current.copy(l); first.current = false; }
    else {
      const k = 1 - Math.exp(-(reduced ? 1.6 : 2.6) * Math.min(dt, 0.05));
      camera.position.lerp(p, k); look.current.lerp(l, k);
    }
    camera.lookAt(look.current);
  });
}

function useQuant(steps: number) {
  const [q, setQ] = useState(0);
  useFrame(() => { const n = Math.round(live.t * steps); if (n !== q) setQ(n); });
  return q / steps;
}

function useTryCount(id: string) {
  const ev = useStore((s) => s.tryEvent);
  return ev.id === id ? ev.n : 0;
}

function Lights({ world, intensity = 1, shadows = true }: { world: 'moon' | 'mars' | 'earth' | 'space'; intensity?: number; shadows?: boolean }) {
  const lite = useStore((s) => s.settings.lite);
  const ground = world === 'moon' ? '#58606e' : world === 'mars' ? '#a5532d' : world === 'earth' ? '#1d3a6e' : '#2a2050';
  return (
    <>
      <directionalLight position={[30, 42, 24]} intensity={3.2 * intensity} color="#FFF1D6" castShadow={shadows && !lite}
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0005} />
      <directionalLight position={[-20, 12, -30]} intensity={1.4 * intensity} color="#7FB2FF" />
      <hemisphereLight args={['#c9d6ff', ground, 0.55 * intensity]} />
      <ambientLight intensity={0.08} />
    </>
  );
}

// ───────────────────────────── Earth stages ─────────────────────────────

const MOON_SITES: [number, number][] = [[0.674, 23.473], [-3.012, -23.422], [26.132, 3.634], [20.191, 30.772], [-2.474, -43.339], [-10.63, -20.68], [8.97, 15.5], [-3.65, -17.47]];

function City() {
  const { lights, boxes } = useMemo(() => {
    const r = rng(21); const boxes: { p: [number, number, number]; s: [number, number, number] }[] = [];
    const pts: number[] = [];
    for (let i = 0; i < 90; i++) {
      const a = r() * Math.PI * 2, d = 16 + r() * 70;
      const x = Math.cos(a) * d, z = Math.sin(a) * d - 10;
      if (z > 6) continue;
      const w = 4 + r() * 6, hgt = 6 + r() * 16, dep = 4 + r() * 6;
      const top = -9 + hgt + (r() - 0.6) * 4;
      boxes.push({ p: [x, top - hgt / 2, z], s: [w, hgt, dep] });
      for (let k = 0; k < 14; k++) if (r() < 0.55) pts.push(x + (r() - 0.5) * w, top - r() * hgt * 0.9, z + dep / 2 + 0.05);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return { lights: g, boxes };
  }, []);
  return (
    <group>
      {boxes.map((b, i) => (
        <mesh key={i} position={b.p}><boxGeometry args={b.s} /><meshStandardMaterial color="#161b2e" roughness={0.9} /></mesh>
      ))}
      <points geometry={lights}><pointsMaterial color="#ffcf7a" size={0.45} toneMapped={false} /></points>
    </group>
  );
}

function Rooftop({ beat }: { beat: Beat }) {
  const id = beat.id;
  const moonPos = V(16, 20, -62);
  useShot((t, time) => {
    if (id === '1.1-b1') return [V(0, 1.7 + (1 - t) * 1.5, 8 - t * 1.5), V(2 + t * 2, 4 + (1 - t) * 3, -20)];
    if (id === '1.1-b2' || id === '4.3-b7') return [V(-1, 1.5, 6), V(moonPos.x * 0.5, moonPos.y * 0.45, -30)];
    if (id === '1.1-b3') return [V(0, 1.8, 5.5), V(0, 2.4, -10)];
    if (id === '4.3-b6') return [V(0, 2.2 + (1 - t) * 6, 9 + (1 - t) * 10), V(0, 1.5, -10)];
    return [V(0, 1.6, 7 + Math.sin(time * 0.1) * 0.2), V(4, 6, -30)];
  });
  const showDots = has(beat, 'moon-dots');
  const laser = has(beat, 'laser-home');
  const beam = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (!beam.current) return;
    const k = clamp01((live.t - 0.3) / 0.5);
    beam.current.visible = laser && k > 0 && k < 1;
    (beam.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * 0.8;
  });
  const beamGeo = useMemo(() => {
    const from = V(3, 1.2, -3), to = moonPos.clone();
    const len = from.distanceTo(to);
    const g = new THREE.CylinderGeometry(0.03, 0.03, len, 6, 1, true);
    g.translate(0, len / 2, 0);
    const m = new THREE.Mesh(g);
    m.position.copy(from); m.lookAt(to); m.rotateX(Math.PI / 2);
    return { g, pos: from, quat: m.quaternion.clone() };
  }, []);
  return (
    <>
      <color attach="background" args={['#070b24']} />
      <fog attach="fog" args={['#0b1033', 30, 140]} />
      <Stars count={2500} tint="#cfd8ff" />
      <group position={moonPos.toArray()}>
        <MoonGlobe radius={6} spin={0} glow={1.1} rotation={[0, -Math.PI / 2 + 0.25, 0]} />
        <Atmosphere radius={6.5} color="#b9c8ff" power={2.5} intensity={0.8} />
        {showDots && MOON_SITES.map(([la, lo], i) => <Pin key={i} position={latLon(la, lo, 6.05).applyEuler(new THREE.Euler(0, -Math.PI / 2 + 0.25, 0))} />)}
        <pointLight position={[0, 0, 20]} intensity={0} />
      </group>
      <directionalLight position={[-16, -20, 62]} target-position={moonPos.toArray()} intensity={0} />
      <directionalLight position={[8, 14, 10]} intensity={1.6} color="#bcd0ff" />
      <hemisphereLight args={['#8796d8', '#3a3040', 1.1]} />
      <pointLight position={[-3, 2.2, -2]} intensity={6} distance={9} color="#ffb766" />
      {/* the rooftop */}
      <mesh position={[0, -0.2, -1]} receiveShadow><boxGeometry args={[14, 0.4, 11]} /><meshStandardMaterial color="#6b6864" roughness={0.95} /></mesh>
      {[[0, 0.45, -6.4, 14, 0.9, 0.3], [-6.9, 0.45, -1, 0.3, 0.9, 11], [6.9, 0.45, -1, 0.3, 0.9, 11]].map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]}><boxGeometry args={[b[3], b[4], b[5]]} /><meshStandardMaterial color="#8a8580" roughness={0.9} /></mesh>
      ))}
      <group position={[-4.2, 0, -4.2]}>
        <mesh position={[0, 0.5, 0]}><boxGeometry args={[1.8, 1, 1.8]} /><meshStandardMaterial color="#77736e" /></mesh>
        <mesh position={[0, 1.85, 0]}><cylinderGeometry args={[0.9, 0.9, 1.7, 24]} /><meshStandardMaterial color="#26324a" roughness={0.6} /></mesh>
      </group>
      {[[3.6, -4.5], [4.6, -3.6], [-1.6, -5.2], [5.5, 0.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.3, 0.22, 0.5, 12]} /><meshStandardMaterial color="#b4643c" /></mesh>
          <mesh position={[0, 0.75, 0]}><sphereGeometry args={[0.45, 12, 10]} /><meshStandardMaterial color="#2f6b3a" roughness={0.8} /></mesh>
        </group>
      ))}
      <City />
      {laser && (
        <mesh ref={beam} geometry={beamGeo.g} position={beamGeo.pos} quaternion={beamGeo.quat}>
          <meshBasicMaterial color="#5dff7a" transparent opacity={0.7} toneMapped={false} />
        </mesh>
      )}
    </>
  );
}

function EarthStage({ beat }: { beat: Beat }) {
  const rise = has(beat, 'rise');
  useShot((t) => rise ? [V(0, 0.4, 5.6 + ease(t) * 9), V(0, 0.2 + t * 0.6, 0)] : [V(-2, 2, 15), V(1, 0.5, 0)]);
  return (
    <>
      <color attach="background" args={['#02030a']} />
      <Stars />
      <Earth radius={5} rot={[0.4, Math.PI, 0]} spin={0} sunDir={[0.6, 0.15, -0.8]} />
      <directionalLight position={[10, 3, -12]} intensity={2} />
      <ambientLight intensity={0.15} />
    </>
  );
}

function ScaleStage() {
  const mode = useStore((s) => s.travelMode);
  const tape = useRef<THREE.Mesh>(null!);
  useFrame(() => { const f = 0.05 + 0.95 * ease(clamp01(live.t * 1.4)); tape.current.scale.x = f; tape.current.position.x = -30 + 30.2 * f; });
  useShot((t) => [V(0, 14 + t * 4, 82 - t * 6), V(0, 0, 0)]);
  return (
    <>
      <color attach="background" args={['#050819']} />
      <Stars />
      <Earth radius={1} position={[-30, 0, 0]} spin={0.2} />
      <MoonGlobe radius={0.27} position={[30.4, 0, 0]} spin={0.1} />
      <mesh ref={tape} position={[0, -1.2, 0]}><boxGeometry args={[60.4, 0.08, 0.5]} /><meshStandardMaterial color="#FFC94D" emissive="#7a5a00" /></mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-30 + i * (60.4 / 7), -1.05, 0.26]}><boxGeometry args={[0.06, 0.3, 0.02]} /><meshBasicMaterial color="#3b2a00" /></mesh>
      ))}
      <directionalLight position={[0, 10, 20]} intensity={2.2} />
      <ambientLight intensity={0.25} />
      <group position={[0, 2.2, 0]} visible={mode > -1} />
    </>
  );
}

// lift-off timeline (live.t 0..1): countdown, main engines, boosters + release, climb
const LAUNCH = { engines: 0.2, boosters: 0.32, climb: 0.34 };
const launchHeight = (t: number) => { const k = clamp01((t - LAUNCH.climb) / (1 - LAUNCH.climb)); return k * k * 900; };
// RS-25 and booster nozzle positions on NASA's SLS model (metres from the rocket's centre line)
const RS25: [number, number][] = [[1.25, 1.25], [-1.25, 1.25], [1.25, -1.25], [-1.25, -1.25]];

function Launch() {
  const rocket = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.PointLight>(null!);
  const [k, setK] = useState({ eng: 0, srb: 0, y: 0, shake: 0 });
  useFrame((s) => {
    const t = live.t;
    const eng = Math.round(clamp01((t - LAUNCH.engines) / 0.05) * 20) / 20;
    const srb = Math.round(clamp01((t - LAUNCH.boosters) / 0.02) * 20) / 20;
    const y = launchHeight(t);
    rocket.current.position.y = y;
    // a tiny sway on the pad once the engines light, like the real "twang"
    rocket.current.rotation.z = eng > 0 && y < 1 ? Math.sin(s.clock.elapsedTime * 3) * 0.003 * (1 - srb) : 0;
    if (glow.current) glow.current.intensity = (eng * 4000 + srb * 9000) * (0.85 + Math.random() * 0.3) / (1 + y * 0.02);
    const shake = Math.round(Math.max(eng * 0.6, srb * 1.6) * Math.max(0, 1 - y / 500) * 10) / 10;
    const yq = Math.round(y / 4) * 4;
    if (eng !== k.eng || srb !== k.srb || yq !== k.y || shake !== k.shake) setK({ eng, srb, y: yq, shake });
  });
  useShot((t, time) => {
    const y = launchHeight(t);
    const push = clamp01(t / LAUNCH.climb);
    return [V(115 - push * 18, 16 + y * 0.12 + Math.sin(time * 0.2) * 0.5, 215 - push * 30 + y * 0.08), V(0, 48 + y * 0.97, 0)];
  });
  const fire = Math.max(k.eng, k.srb);
  return (
    <>
      <SkyDome top="#5a6fd6" bottom="#ffb37a" sunDir={[0.6, 0.05, -1]} sunColor="#ffd9a0" sun={1.4} />
      <fog attach="fog" args={['#f2b48c', 400, 2600]} />
      <Lights world="earth" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6000, 6000]} /><meshStandardMaterial color="#5f6b4c" roughness={1} /></mesh>
      {/* launch pad (explanation): concrete hardstand and a flame trench */}
      <mesh position={[0, 0.5, 0]} receiveShadow><cylinderGeometry args={[55, 62, 1, 48]} /><meshStandardMaterial color="#9a9893" roughness={0.95} /></mesh>
      <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 110]} /><meshStandardMaterial color="#2c2a28" roughness={1} /></mesh>
      {/* the rocket: NASA's SLS Block 1 model (exact shape) */}
      <group ref={rocket} position={[0, 1, 0]}>
        <Suspense fallback={null}><NasaModel id="sls" /></Suspense>
        {/* exhaust (explanation): four RS-25 engines and two solid rocket boosters */}
        {RS25.map(([x, z], i) => <Plume key={i} position={[x, 0.3, z]} length={30} radius={0.95} power={k.eng} color="#ffcf9a" core="#ffffff" />)}
        {[7.3, -7.3].map((x) => <Plume key={x} position={[x, 0.2, 0]} length={70} radius={1.6} power={k.srb * 1.4} color="#ff9a3c" core="#fff6dc" diamonds={false} />)}
        <pointLight ref={glow} position={[0, -6, 0]} color="#ffad5c" distance={600} decay={1.6} intensity={0} />
      </group>
      {/* smoke and steam (explanation): billows out of the trench, then a column follows the rocket up */}
      <Smoke amount={Math.min(1, fire * 1.2)} count={220} spread={170} rise={70} size={30} life={9} color="#ece6dd" glow="#ffae63" glowAmount={fire} position={[0, 2, 0]} />
      <Smoke amount={k.srb} count={90} spread={10} rise={Math.max(40, k.y * 0.9)} size={18} life={6} color="#f1ece4" glow="#ffb36b" glowAmount={0.6} upward={0} position={[0, 2, 0]} />
      <Smoke amount={clamp01(1 - fire) * 0.6} count={30} spread={8} rise={25} size={6} life={5} color="#ffffff" position={[3, 40, 2]} />
      <CameraShake amount={k.shake} />
    </>
  );
}

function Transfer() {
  const pts = useMemo(() => [V(-24, -1, 0), V(-8, 9, -4), V(10, 9, -6), V(24, 3, -5)], []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts), [pts]);
  const ship = useRef<THREE.Group>(null!);
  const q = useQuant(40);
  useFrame(() => { ship.current.position.copy(curve.getPoint(clamp01(live.t))); });
  useShot((t) => { const p = curve.getPoint(clamp01(t)); return [V(p.x * 0.5, 10, 34), V(p.x * 0.6, 3, -3)]; });
  return (
    <>
      <color attach="background" args={['#050819']} />
      <Stars />
      <Earth radius={2.2} position={[-26, -1, 0]} spin={0.1} />
      <MoonGlobe radius={0.9} position={[26, 3, -5]} />
      <DottedArc points={pts} progress={0.15 + q * 0.85} size={0.12} />
      {/* VIMO's position on the path: a glowing marker, not a model */}
      <group ref={ship}>
        <mesh><sphereGeometry args={[0.22, 16, 12]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
        <mesh><sphereGeometry args={[0.5, 16, 12]} /><meshBasicMaterial color="#ffb35c" transparent opacity={0.25} toneMapped={false} depthWrite={false} /></mesh>
      </group>
      <directionalLight position={[0, 10, 20]} intensity={2.4} />
      <ambientLight intensity={0.2} />
    </>
  );
}

// ───────────────────────────── Moon surface ─────────────────────────────

const PROP_FRAME: Record<string, { r: number; h: number; look: number }> = {
  ranger7: { r: 8, h: 2, look: 1.5 },
  surveyor1: { r: 8, h: 3, look: 1.5 }, surveyor3: { r: 8.5, h: 2.6, look: 0.4 },
  'apollo12-intrepid': { r: 19, h: 5, look: 3 }, 'apollo11-eagle': { r: 17, h: 4.5, look: 3 },
  'apollo11-mirror': { r: 2.6, h: 1.1, look: 0.3 }, 'apollo15-rover': { r: 8.5, h: 2.5, look: 1 },
  'apollo17-challenger': { r: 18, h: 4.5, look: 3 },
};

function Footprints({ count = 60, spread = 9, seed = 4 }: { count?: number; spread?: number; seed?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useMemo(() => requestAnimationFrame(() => {
    if (!ref.current) return;
    const r = rng(seed); const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2, d = 3 + r() * spread;
      o.position.set(Math.cos(a) * d, 0.03, Math.sin(a) * d); o.rotation.set(-Math.PI / 2, 0, a);
      o.scale.set(1, 1.8, 1); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }), [count, spread, seed]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.09, 10]} /><meshBasicMaterial color="#56585d" />
    </instancedMesh>
  );
}

function MoonSurface({ beat }: { beat: Beat }) {
  const prop = beat.prop;
  const fr = (prop && PROP_FRAME[prop]) || { r: 7, h: 2, look: 0.5 };
  const crater = has(beat, 'crater');
  const baseY = crater ? -1.5 : 0;
  const lite = useStore((s) => s.settings.lite);
  const ringN = useTryCount('ring-moon');
  const laserN = useTryCount('laser');

  const ranger = useRef<THREE.Group>(null!);
  const surveyor = useRef<THREE.Group>(null!);
  const flames = useRef<THREE.Group>(null!);
  const rover = useRef<THREE.Group>(null!);
  const astro = useRef<THREE.Group>(null!);
  const sun = useRef<THREE.DirectionalLight>(null!);
  const [ascent, setAscent] = useState(0);
  const [unfold, setUnfold] = useState(1);

  useFrame((s) => {
    const t = live.t;
    if (ranger.current) { const y = 1 + 45 * (1 - ease(clamp01(t * 1.05))); ranger.current.position.y = y; ranger.current.visible = t < 0.97; ranger.current.rotation.y = s.clock.elapsedTime * 0.2; }
    if (surveyor.current && has(beat, 'land')) {
      const k = clamp01(t / 0.7); const y = 14 * (1 - ease(k));
      surveyor.current.position.y = y; if (flames.current) flames.current.visible = y > 0.05;
    }
    if (has(beat, 'ascent')) { const a = clamp01((t - 0.3) / 0.6); if (Math.abs(a - ascent) > 0.01) setAscent(a); }
    if (has(beat, 'unfold')) { const u = clamp01(t * 1.6); if (Math.abs(u - unfold) > 0.02) setUnfold(u); }
    if (rover.current && has(beat, 'drive')) { rover.current.position.set(-12 + 24 * t, 0, Math.sin(t * 6) * 2); rover.current.rotation.y = Math.PI / 2 + Math.cos(t * 6) * 0.3; }
    if (astro.current) { const k = ease(clamp01(t * 1.3)); astro.current.position.set(-16 + 12 * k, baseY + 0.2 + (1 - k) * 1.6, -8 + 6 * k); astro.current.children.forEach((c, i) => (c.position.y = Math.abs(Math.sin(s.clock.elapsedTime * 2.4 + i)) * 0.25)); }
    if (sun.current && has(beat, 'days')) { const a = s.clock.elapsedTime * 0.9; sun.current.position.set(Math.cos(a) * 40, 25 + Math.sin(a) * 30, 20); sun.current.intensity = 1.5 + Math.max(0, Math.sin(a)) * 2; }
  });

  useShot((t, time) => {
    if (has(beat, 'fall')) { const y = 1 + 45 * (1 - ease(clamp01(t * 1.05))); return [V(6, y + 3.2, 8), V(0, Math.max(0.5, y + 1.4), 0)]; }
    if (has(beat, 'dust-flour')) return [V(0, 0.7 + t * 0.4, 3.2), V(0, 0, 0)];
    if (has(beat, 'land')) return [V(9, 3.5, 11), V(0, 2 + 4 * (1 - clamp01(t / 0.7)), 0)];
    if (has(beat, 'plaque')) return [V(4.2, 1.6, 5.2 - t * 0.8), V(1.6, 1.4, 1.6)];
    if (has(beat, 'ascent')) { const a = clamp01((t - 0.3) / 0.6); return [V(-fr.r * 0.8, fr.h, fr.r * 0.7), V(0, fr.look + a * a * 22, 0)]; }
    if (has(beat, 'laser')) return [V(4, 1.6, 4.5), V(-8, 6, -20)];
    if (has(beat, 'drive')) { const x = -12 + 24 * t; return [V(x - 4, 3, 10), V(x + 2, 1, 0)]; }
    if (has(beat, 'astronauts')) return [V(9, 3.5, 9), V(-5, 0, -3)];
    const a = 0.6 + t * 0.8 + (has(beat, 'orbit-cam') ? t * 1.5 : 0) + Math.sin(time * 0.05) * 0.05;
    return [V(Math.sin(a) * fr.r, fr.h + baseY, Math.cos(a) * fr.r), V(0, fr.look + baseY, 0)];
  });

  const seed = useMemo(() => beat.scene.split('').reduce((a, c) => a + c.charCodeAt(0), 0), [beat.scene]);
  const mountains = has(beat, 'mountains');
  const showLM = beat.scene === '2.6' || beat.scene === '2.7';

  return (
    <>
      <color attach="background" args={['#000000']} />
      <Stars count={lite ? 1200 : 3000} />
      <Earth radius={5} position={[-70, 52, -170]} spin={0.01} sunDir={[1, 0.5, 0.8]} />
      <group>
        <directionalLight ref={sun} position={[30, 42, 24]} intensity={3.4} color="#FFF1D6" castShadow={!lite}
          shadow-mapSize={[1024, 1024]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0005} />
        <directionalLight position={[-20, 12, -30]} intensity={1.2} color="#7FB2FF" />
        <hemisphereLight args={['#c9d6ff', '#58606e', 0.45]} />
      </group>
      <Ground world="moon" seed={seed} crater={crater} />
      <Rocks count={lite ? 60 : 160} color="#77797d" seed={seed} />
      {mountains && (
        <group>
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + 0.3; const d = 120 + (i % 3) * 20; return (
            <mesh key={i} position={[Math.cos(a) * d, 0, Math.sin(a) * d]} scale={[30 + (i % 4) * 8, 14 + (i % 5) * 6, 26]}>
              <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#8b8d90" roughness={1} />
            </mesh>); })}
          {beat.scene === '2.6' && <mesh rotation={[-Math.PI / 2, 0, 0.4]} position={[20, 0.05, -40]}><planeGeometry args={[14, 200]} /><meshStandardMaterial color="#3d3f43" /></mesh>}
        </group>
      )}
      {(has(beat, 'footprints') || has(beat, 'astronauts') || beat.scene === '2.4' || beat.scene === '2.7') && <Footprints seed={seed} />}

      {/* the machine */}
      {prop === 'ranger7' && <group ref={ranger}><Machine id="ranger7" /></group>}
      {(prop === 'surveyor1' || prop === 'surveyor3') && (
        <group ref={surveyor} position={[0, baseY, 0]}>
          <Machine id={prop} noCamera={has(beat, 'no-camera')} />
          {/* explanation: the three vernier engine flames while it slows down */}
          <group ref={flames} visible={false}>
            {[0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 + Math.PI / 2; return (
              <Plume key={i} position={[Math.cos(a) * 0.55, 0.36, Math.sin(a) * 0.55]} length={1.6} radius={0.06} power={0.9} color="#ffc98a" core="#f4f7ff" diamonds={false} />
            ); })}
          </group>

        </group>
      )}
      {prop === 'surveyor3' && has(beat, 'astronauts') && (
        <group ref={astro}>
          <Suspense fallback={null}>
            <NasaModel id="astronaut" position={[0, 0, 0]} rotation={[0, 0.9, 0]} />
            <NasaModel id="astronaut" position={[1.4, 0, -1]} rotation={[0, 0.8, 0]} />
          </Suspense>
        </group>
      )}
      {(prop === 'apollo11-eagle' || prop === 'apollo12-intrepid' || prop === 'apollo17-challenger' || prop === 'apollo11-mirror') && (
        <group position={prop === 'apollo11-mirror' ? [-9, 0, -7] : [0, 0, 0]}>
          <Machine id={prop === 'apollo11-mirror' ? 'apollo11-eagle' : prop} ascent={ascent}
            ascentFx={has(beat, 'ascent') && ascent > 0 ? (
              // explanation: the ascent engine's faint flame (in vacuum it is almost see-through)
              <Plume length={5} radius={0.45} power={0.75} color="#ffcf8a" core="#fff3dc" diamonds={false} />
            ) : undefined} />
        </group>
      )}
      {/* explanation: at ignition, foil and dust spray off the descent stage (no air on the Moon, so it flies out fast and does not hang) */}
      {has(beat, 'ascent') && <Smoke amount={ascent > 0 && ascent < 0.25 ? 0.8 : 0} count={50} spread={14} rise={0} size={0.7} life={1.1} color="#d8d4cc" glow="#ffd29a" glowAmount={0.7} position={[0, 3.2, 0]} />}
      {prop === 'apollo11-mirror' && <Machine id="apollo11-mirror" rotation={[0, 3.94, 0]} />}
      {prop === 'apollo11-mirror' && <LaserBeam n={laserN} auto={has(beat, 'laser')} />}
      {prop === 'apollo12-intrepid' && (
        <group position={[7, 0, 5]}>
          <Ripples active={ringN} />
        </group>
      )}
      {/* NASA has no 3D model of the Lunar Roving Vehicle: Team VOID replica (labelled) */}
      {prop === 'apollo15-rover' && (
        <group ref={rover} position={[0, 0, 0]} rotation={[0, 0.5, 0]}><Machine id="apollo15-rover" /></group>
      )}
      {showLM && prop === 'apollo15-rover' && <group position={[-12, 0, -9]}><Machine id="apollo11-eagle" /></group>}
      {has(beat, 'dust-flour') && <Dust count={300} area={6} height={1.2} color="#b9bbc0" speed={0.05} size={0.03} opacity={0.7} />}
      {has(beat, 'land') && <Dust count={200} area={10} height={1.5} color="#a6a8ad" speed={0.3} size={0.06} opacity={0.45} />}
    </>
  );
}

function LaserBeam({ n, auto }: { n: number; auto: boolean }) {
  const out = useRef<THREE.Mesh>(null!);
  const start = useRef(-10);
  const lastN = useRef(n);
  const fired = useRef(false);
  const geo = useMemo(() => {
    const from = V(0, 0.5, 0), to = V(-70, 52, -170);
    const len = from.distanceTo(to);
    const g = new THREE.CylinderGeometry(0.025, 0.025, len, 6, 1, true); g.translate(0, len / 2, 0);
    const m = new THREE.Object3D(); m.position.copy(from); m.lookAt(to); m.rotateX(Math.PI / 2);
    return { g, q: m.quaternion.clone() };
  }, []);
  useFrame(({ clock }) => {
    if (n !== lastN.current) { lastN.current = n; start.current = clock.elapsedTime; }
    if (auto && !fired.current && live.t > 0.25) { fired.current = true; start.current = clock.elapsedTime; }
    const e = clock.elapsedTime - start.current;
    // 2.5 s round trip, shown in real time; one gentle glow, no flashing
    out.current.visible = e >= 0 && e < 2.8;
    const k = e / 2.56;
    out.current.scale.y = k < 0.5 ? k * 2 : 1;
    (out.current.material as THREE.MeshBasicMaterial).opacity = k < 0.5 ? 0.8 : Math.max(0, 0.8 - (k - 0.5) * 1.2);
  });
  return (
    <mesh ref={out} geometry={geo.g} position={[0, 0.5, 0]} quaternion={geo.q} visible={false}>
      <meshBasicMaterial color="#5dff7a" transparent opacity={0.8} toneMapped={false} />
    </mesh>
  );
}

// ───────────────────────────── Orbits & globes ─────────────────────────────

function MoonOrbit({ beat }: { beat: Beat }) {
  const lro = useRef<THREE.Group>(null!);
  const rot = -Math.PI / 2;
  const site = latLon(-10.63, -20.68, 5.05).applyEuler(new THREE.Euler(0, rot, 0));
  const lroOrbit = has(beat, 'lro-orbit');
  useFrame((s) => {
    if (!lro.current) return;
    const a = s.clock.elapsedTime * 0.25 + live.t * 2;
    lro.current.position.set(Math.sin(a) * 6.4, Math.cos(a) * 6.4, 1.5);
    lro.current.rotation.set(0, 0, -a);
  });
  useShot((t, time) => {
    if (has(beat, 'site-glow')) return [site.clone().multiplyScalar(1 + 1.8 - t * 0.8), site.clone().multiplyScalar(0.8)];
    if (lroOrbit) { const a = time * 0.25 + t * 2; return [V(Math.sin(a) * 9 + 3, Math.cos(a) * 9, 7), V(0, 0, 0)]; }
    return [V(2, 1, 16 - t * 2), V(0, 0, 0)];
  });
  return (
    <>
      <color attach="background" args={['#000000']} />
      <Stars />
      <MoonGlobe radius={5} spin={0} rotation={[0, rot, 0]} />
      <directionalLight position={[12, 6, 14]} intensity={3} color="#FFF1D6" />
      <directionalLight position={[-12, -4, -6]} intensity={0.5} color="#7FB2FF" />
      <ambientLight intensity={0.05} />
      {has(beat, 'site-glow') && <Pin position={site} />}
      {has(beat, 'pins') && MOON_SITES.map(([la, lo], i) => <Pin key={i} position={latLon(la, lo, 5.05).applyEuler(new THREE.Euler(0, rot, 0))} />)}
      {lroOrbit && <group ref={lro} scale={0.22}><Machine id="lro" /></group>}
      <Earth radius={1.4} position={[-30, 8, -40]} spin={0.05} />
    </>
  );
}

function Solar({ beat }: { beat: Beat }) {
  const earth = useRef<THREE.Group>(null!);
  const mars = useRef<THREE.Group>(null!);
  const ship = useRef<THREE.Mesh>(null!);
  const msg = useRef<THREE.Mesh>(null!);
  const transfer = useMemo(() => {
    const pts: THREE.Vector3[] = []; const a = (10 + 15.2) / 2, c = (15.2 - 10) / 2, b = Math.sqrt(a * a - c * c);
    for (let i = 0; i <= 60; i++) { const th = (i / 60) * Math.PI; pts.push(V(Math.cos(th) * a - c, 0, -Math.sin(th) * b)); }
    return pts;
  }, []);
  useFrame((s) => {
    if (!earth.current || !mars.current || !ship.current) return;
    const k = has(beat, 'transfer-arc') ? clamp01(live.t * 1.2) : 1;
    const ea = k * Math.PI * 1.17; // Earth moves ~210 degrees in 7 months
    const ma = 0.77 + k * (Math.PI - 0.77); // Mars ahead by ~44 degrees at launch, opposite at arrival
    earth.current.position.set(Math.cos(ea) * 10, 0, -Math.sin(ea) * 10);
    mars.current.position.set(Math.cos(ma) * 15.2, 0, -Math.sin(ma) * 15.2);
    const p = transfer[Math.floor(k * 60)];
    ship.current.position.copy(p);
    if (msg.current) {
      const m = ((s.clock.elapsedTime * 0.12) % 1);
      msg.current.position.lerpVectors(earth.current.position, mars.current.position, m);
      msg.current.visible = has(beat, 'message');
    }
  });
  useShot((t) => [V(0, 34 - t * 4, 18), V(0, 0, -2)]);
  const ring = (r: number, c: string) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r - 0.04, r + 0.04, 128]} /><meshBasicMaterial color={c} transparent opacity={0.5} side={THREE.DoubleSide} /></mesh>
  );
  return (
    <>
      <color attach="background" args={['#0b0a24']} />
      <Stars tint="#d9c9ff" />
      <ProcPlanet kind="sun" radius={1.8} />
      <pointLight position={[0, 0, 0]} intensity={600} distance={200} decay={2} color="#fff0d0" />
      <ambientLight intensity={0.25} />
      {ring(10, '#2E8BFF')}{ring(15.2, '#E2683C')}
      <group ref={earth}><Earth radius={0.7} spin={0.3} /></group>
      <group ref={mars}><ProcPlanet kind="mars" radius={0.5} sun={[-1, 0, 0]} /></group>
      <DottedArc points={transfer} size={0.07} />
      <mesh ref={ship}><sphereGeometry args={[0.22, 12, 8]} /><meshBasicMaterial color="#FF8A3D" toneMapped={false} /></mesh>
      <mesh ref={msg}><sphereGeometry args={[0.35, 16, 10]} /><meshBasicMaterial color="#8fe3ff" transparent opacity={0.85} toneMapped={false} /></mesh>
    </>
  );
}

const MARS_SITES: [number, number][] = [[22.27, -47.95], [19.13, -33.22], [-1.95, -5.53], [-4.59, 137.44], [4.5, 135.62], [18.44, 77.45]];

function MarsOrbit({ beat }: { beat: Beat }) {
  useShot((t) => has(beat, 'approach') ? [V(0, 1, 30 - ease(t) * 21), V(0, 0, 0)] : [V(-3, 2, 16), V(0, 0, 0)]);
  return (
    <>
      <color attach="background" args={['#05030c']} />
      <Stars />
      <ProcPlanet kind="mars" radius={5} spin={0.02} sun={[1, 0.3, 0.8]} />
      {has(beat, 'pins') && MARS_SITES.map(([la, lo], i) => <Pin key={i} position={latLon(la, lo, 5.06)} color="#FFC94D" />)}
    </>
  );
}

// ───────────────────────────── Mars surface ─────────────────────────────

const MARS_FRAME: Record<string, { r: number; h: number; look: number }> = {
  viking1: { r: 7, h: 2, look: 1 }, sojourner: { r: 3, h: 1.1, look: 0.2 }, opportunity: { r: 6, h: 2, look: 0.8 },
  curiosity: { r: 8, h: 2.4, look: 1.2 }, insight: { r: 7.5, h: 2.6, look: 0.8 }, 'landing-leftovers': { r: 14, h: 5, look: 0.5 },
  ingenuity: { r: 3.4, h: 1.0, look: 0.4 }, perseverance: { r: 7, h: 2.2, look: 1 }, 'three-forks': { r: 9, h: 3, look: 0 },
};

function MarsSurface({ beat }: { beat: Beat }) {
  const prop = beat.prop;
  const fr = (prop && MARS_FRAME[prop]) || { r: 8, h: 2.5, look: 1 };
  const lite = useStore((s) => s.settings.lite);
  const quakeN = useTryCount('marsquake');
  const storm = has(beat, 'storm');
  const sunset = has(beat, 'sunset');
  const [stormK, setStormK] = useState(0);
  const [dustK, setDustK] = useState(0);
  const [tubes, setTubes] = useState(10);
  const [autoQuake, setAutoQuake] = useState(0);
  const lander = useRef<THREE.Group>(null!);
  const chute = useRef<THREE.Group>(null!);
  const retro = useRef<THREE.Group>(null!);
  const balls = useRef<THREE.Group>(null!);
  const petals = useRef<THREE.Group>(null!);
  const rover = useRef<THREE.Group>(null!);
  const crane = useRef<THREE.Group>(null!);
  const hanging = useRef<THREE.Group>(null!);
  const ropes = useRef<THREE.Group>(null!);
  const heli = useRef<THREE.Group>(null!);
  const capsule = useRef<THREE.Group>(null!);
  const water = useRef<THREE.Mesh>(null!);
  const layers = useRef<THREE.Group>(null!);
  const [open, setOpen] = useState(1);
  const [heat, setHeat] = useState(0);
  const [rotor, setRotor] = useState(0);
  const [touch, setTouch] = useState(0);   // 0..1: rocket exhaust kicking up ground dust

  useFrame((s) => {
    const t = live.t, time = s.clock.elapsedTime;
    let tc = 0;
    if (storm) { const k = Math.round(ease(clamp01(t * 1.2)) * 20) / 20; if (k !== stormK) setStormK(k); }
    if (has(beat, 'dust-cover')) { const k = Math.round(clamp01(t * 1.1) * 20) / 20; if (k !== dustK) setDustK(k); }
    if (has(beat, 'tubes')) { const n = Math.max(1, Math.min(10, Math.ceil(t * 11))); if (n !== tubes) setTubes(n); }
    if (has(beat, 'quake')) { const q = Math.floor(time / 4.5); if (q !== autoQuake) setAutoQuake(q); }
    if (lander.current && has(beat, 'parachute-land')) {
      const k = clamp01(t / 0.75); const y = 30 * (1 - ease(k)); lander.current.position.y = y;
      chute.current.visible = y > 12; retro.current.visible = y > 0.05 && y <= 12;
      if (y > 0.05 && y < 6) tc = 1 - y / 6;
    }
    if (balls.current && has(beat, 'airbags')) {
      const k = clamp01(t / 0.6);
      balls.current.position.set(-26 + 26 * ease(k), 1.6 + Math.abs(Math.sin(k * Math.PI * 4)) * (1 - k) * 9, 0);
      balls.current.rotation.z = -k * 12;
      const shrink = clamp01((t - 0.55) / 0.2);
      balls.current.scale.setScalar(Math.max(0.01, 1 - shrink * 0.99));
      balls.current.visible = shrink < 0.98;
      const o = clamp01((t - 0.7) / 0.25); if (Math.abs(o - open) > 0.02) setOpen(o);
      if (petals.current) petals.current.visible = t > 0.58;
      if (rover.current) rover.current.visible = t > 0.72;
    } else if (open !== 1) setOpen(1);
    if (rover.current && has(beat, 'rover-roll')) rover.current.position.set(0.6 + 2.4 * ease(clamp01(t * 1.3)), 0, 0.4 + 1.2 * ease(clamp01(t * 1.3)));
    if (rover.current && has(beat, 'drive')) rover.current.position.set(-8 + 16 * t, 0, 0);
    if (crane.current && has(beat, 'skycrane')) {
      const k = clamp01(t / 0.6); const y = 9 + 20 * (1 - ease(k));
      const away = clamp01((t - 0.65) / 0.35);
      crane.current.position.set(away * 60, y + away * 25, -away * 20);
      hanging.current.position.y = Math.max(0, y - 7.5);
      if (away > 0) hanging.current.position.y = 0;
      ropes.current.visible = away === 0;
      ropes.current.position.y = y; ropes.current.scale.y = Math.max(0.01, y - hanging.current.position.y - 1.4);
      if (away === 0 && y < 22) tc = clamp01((22 - y) / 10);
    }
    tc = Math.round(tc * 10) / 10;
    if (tc !== touch) setTouch(tc);
    if (heli.current && has(beat, 'heli-fly')) {
      const k = clamp01(t);
      const y = k < 0.15 ? 0 : k < 0.4 ? ease((k - 0.15) / 0.25) * 4 : k < 0.75 ? 4 + Math.sin((k - 0.4) * 9) * 0.3 : 4 * (1 - ease((k - 0.75) / 0.25));
      heli.current.position.set(k > 0.4 && k < 0.75 ? Math.sin((k - 0.4) / 0.35 * Math.PI * 2) * 3 : 0, y, 0);
      const rr = k < 0.08 || k > 0.98 ? 0 : 160; if (rr !== rotor) setRotor(rr);
    }
    if (capsule.current && has(beat, 'entry')) {
      const k = clamp01(t);
      capsule.current.position.set(10 - k * 10, 60 - k * 44, -30 + k * 20);
      const h = Math.round(clamp01(1 - k * 2.4) * 10) / 10; if (h !== heat) setHeat(h);
      (capsule.current.children[1] as THREE.Object3D).visible = k > 0.42;
    }
    if (water.current) { const k = ease(clamp01((t - 0.35) / 0.5)); water.current.position.y = -1.2 + k * 1.5; (water.current.material as THREE.MeshStandardMaterial).opacity = k * 0.55; }
    if (layers.current) layers.current.children.forEach((c, i) => { ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = Math.max(0, 1 - Math.abs(t * 7 - i)) * 0.8; });
  });

  useShot((t, time) => {
    if (has(beat, 'parachute-land')) { const y = 30 * (1 - ease(clamp01(t / 0.75))); const up = y > 12 ? 7 : 1; return [V(10, 2.5 + y * 0.6, 15), V(0, y + up, 0)]; }
    if (has(beat, 'airbags')) { const k = clamp01(t / 0.6); const x = -26 + 26 * ease(k); return [V(x + 4, 3, 13), V(x * 0.7, 1.5, 0)]; }
    if (has(beat, 'skycrane')) { const y = 9 + 20 * (1 - ease(clamp01(t / 0.6))); return [V(10, 3 + y * 0.35, 16), V(0, Math.max(1.5, y - 6), 0)]; }
    if (has(beat, 'entry')) { const k = clamp01(t); const c = V(10 - k * 10, 60 - k * 44, -30 + k * 20); return [V(c.x + 14, Math.max(3, c.y - 5), c.z + 24), c]; }
    if (has(beat, 'rover-roll')) { const k = ease(clamp01(t * 1.3)); const p = V(0.6 + 2.4 * k, 0, 0.4 + 1.2 * k); return [V(p.x + 1.3, 0.8, p.z + 1.9), V(p.x - 0.3, 0.15, p.z - 0.2)]; }
    if (has(beat, 'code')) return [V(12, 22 - t * 4, 4), V(12, 0, -4)];
    if (has(beat, 'heli-fly')) return [V(5, 1.6 + t * 2.4, 6), V(0, 1 + t * 2.5, 0)];
    if (has(beat, 'layers')) return [V(6, 3, 12), V(0, 6 + t * 6, -60)];
    if (has(beat, 'water')) return [V(2.2, 1.1, 3.5), V(0, 0.1, 0)];
    if (has(beat, 'tubes')) return [V(5, 3, 8), V(0, 0, -1)];
    if (has(beat, 'drive')) { const x = -8 + 16 * t; return [V(x - 3, 2.2, 7), V(x + 1, 0.8, 0)]; }
    const a = 0.5 + t * 0.7 + Math.sin(time * 0.05) * 0.05;
    return [V(Math.sin(a) * fr.r, fr.h, Math.cos(a) * fr.r), V(0, fr.look, 0)];
  });

  const top = sunset ? '#29304a' : storm ? new THREE.Color('#c99a6b').lerp(new THREE.Color('#4a2c1a'), stormK).getStyle() : '#c99a6b';
  const bottom = sunset ? '#c4906a' : storm ? new THREE.Color('#e8b98a').lerp(new THREE.Color('#6b3f24'), stormK).getStyle() : '#ebc296';
  const light = storm ? 1 - stormK * 0.7 : sunset ? 0.55 : 1;
  const seed = useMemo(() => beat.scene.split('').reduce((a, c) => a + c.charCodeAt(0), 7), [beat.scene]);

  return (
    <>
      <SkyDome top={top} bottom={bottom} sunDir={sunset ? [0.3, 0.06, -1] : [0.5, 0.6, -0.4]} sunColor={sunset ? '#8fb8ff' : '#fff2d6'} sun={sunset ? 1.6 : 0.5 * light} />
      <fog attach="fog" args={[bottom, 40 - stormK * 25, 260 - stormK * 180]} />
      <directionalLight position={sunset ? [40, 6, -80] : [30, 40, 20]} intensity={3 * light} color={sunset ? '#ffd2a8' : '#FFF1D6'} castShadow={!lite}
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.0005} />
      <directionalLight position={[-20, 10, -30]} intensity={0.8} color="#7FB2FF" />
      <hemisphereLight args={['#f0c9a4', '#a5532d', 0.65 * light]} />
      <Ground world="mars" seed={seed} />
      <Rocks count={lite ? 70 : 180} seed={seed} color="#6e3420" />
      <Dust count={storm ? 900 : 260} area={60} height={storm ? 14 : 6} color="#d9a27a" speed={storm ? 2.2 : 0.5} size={storm ? 0.14 : 0.06} opacity={storm ? 0.4 + stormK * 0.4 : 0.35} />

      {has(beat, 'jezero') && (
        <group>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return (
          <mesh key={i} position={[Math.cos(a) * 150, 0, Math.sin(a) * 150]} scale={[45, 16 + (i % 3) * 6, 30]}>
            <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#a65a35" roughness={1} />
          </mesh>); })}</group>
      )}
      {has(beat, 'delta') && [0, 1, 2].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, -0.3 + i * 0.3]} position={[-4 + i * 4, 0.08, -18]}><planeGeometry args={[0.8, 40]} /><meshBasicMaterial color="#6fb8ff" transparent opacity={0.35} /></mesh>
      ))}

      {prop === 'viking1' && (
        <group ref={lander}>
          <Machine id="viking1" />
          {/* explanation: the parachute, then the three landing rockets */}
          <group ref={chute} position={[0, 2.6, 0]} visible={false}>
            <Parachute radius={4.2} height={12} colors={['#f4f1ea', '#e7e2d6']} />
          </group>
          <group ref={retro} visible={false}>{[0, 1, 2].map((i) => (
            <Plume key={i} position={[Math.cos((i / 3) * 6.28) * 0.75, 0.45, Math.sin((i / 3) * 6.28) * 0.75]} length={2.4} radius={0.12} power={1} color="#ffc98a" core="#f4f7ff" diamonds={false} />))}
          </group>
        </group>
      )}
      {prop === 'viking1' && has(beat, 'parachute-land') && <Smoke amount={touch} count={80} spread={9} rise={2.5} size={2.2} life={2.6} color="#d6a07a" />}
      {(prop === 'sojourner' || prop === 'opportunity') && has(beat, 'airbags') && (
        <>
          {/* explanation: the airbag ball bounces in, deflates, and the lander's petals open */}
          <group ref={balls}><Airbags size={1.7} /></group>
          <group ref={petals} visible={false}><Petals open={open} /></group>
        </>
      )}
      {/* after landing, Pathfinder's opened lander stays where Sojourner drove off */}
      {prop === 'sojourner' && !has(beat, 'airbags') && <group position={[-1.3, 0, -1.1]} scale={0.6}><Petals open={1} /></group>}
      {prop === 'sojourner' && <group ref={rover} position={[0.6, 0, 0.4]}><Machine id="sojourner" /></group>}
      {prop === 'opportunity' && (
        <group ref={rover} position={has(beat, 'airbags') ? [1.8, 0, 1.2] : [0, 0, 0]}>
          <Machine id="opportunity" />
        </group>
      )}
      {has(beat, 'water') && (
        <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}><planeGeometry args={[300, 300]} /><meshStandardMaterial color="#4a8fd6" transparent opacity={0} roughness={0.1} metalness={0.2} /></mesh>
      )}
      {prop === 'curiosity' && has(beat, 'skycrane') && (
        <>
          {/* explanation: a simplified rocket "sky crane" lowers the NASA Curiosity model on ropes */}
          <group ref={crane}><SkyCrane /></group>
          <group ref={ropes}><Bridles spread={1.1} /></group>
          <group ref={hanging}><Machine id="curiosity" /></group>
          <Smoke amount={touch} count={110} spread={16} rise={4} size={3} life={3} color="#d9a27a" />
        </>
      )}
      {prop === 'curiosity' && !has(beat, 'skycrane') && <Machine id="curiosity" />}
      {has(beat, 'layers') && (
        <group ref={layers} position={[0, 0, -70]}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <mesh key={i} position={[0, i * 4 + 2, 0]}>
              <cylinderGeometry args={[46 - i * 6, 52 - i * 6, 4, 40]} />
              <meshStandardMaterial color={['#9a4f2c', '#b5653a', '#a35733', '#c47a4a', '#a86238', '#c98a5a', '#b06a40'][i]} emissive="#FFC94D" emissiveIntensity={0} roughness={1} />
            </mesh>
          ))}
        </group>
      )}
      {prop === 'insight' && (
        <>
          <Machine id="insight" dust={dustK} />
          {has(beat, 'quake') && <Ripples active={quakeN + autoQuake} position={[2.4, 0, 1.8]} color="#FFC94D" />}
        </>
      )}
      {has(beat, 'entry') && (
        <group ref={capsule}>
          {/* explanation: a simplified entry capsule glowing hot, then its parachute opens */}
          <EntryCapsule size={2.2} heat={heat} rotation={[0.35, 0, -0.25]} />
          <group visible={false}><Parachute position={[0, 1.4, 0]} radius={4} height={11} colors={['#f4f1ea', '#c8402a']} /></group>
        </group>
      )}
      {prop === 'landing-leftovers' && (
        <>
          <Machine id="landing-leftovers" />
          {has(beat, 'tracks') && [0, 1].map((i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0.2]} position={[-6 + i * 1.6, 0.04, 10]}><planeGeometry args={[0.45, 30]} /><meshBasicMaterial color="#7c3c22" transparent opacity={0.6} /></mesh>
          ))}
        </>
      )}
      {prop === 'ingenuity' && (
        <group ref={heli}><Machine id="ingenuity" rotors={rotor} /></group>
      )}
      {prop === 'ingenuity' && sunset && <group position={[-30, 0, -40]} rotation={[0, 0.6, 0]}><Machine id="perseverance" /></group>}
      {prop === 'perseverance' && (
        <>
          <Machine id="perseverance" />
          {has(beat, 'drill') && <DrillSpark />}
        </>
      )}
      {prop === 'three-forks' && (
        <>
          {/* one NASA sample-tube model per tube, lying on the ground in a row */}
          {Array.from({ length: tubes }, (_, i) => (
            <group key={i} position={[-2.7 + i * 0.6, 0, (i % 3) * 0.25 - 0.25]} rotation={[0, 0.35 + (i % 2) * 0.2, 0]}>
              <Machine id="three-forks" />
            </group>
          ))}
          <group position={[-9, 0, -12]} rotation={[0, 0.7, 0]}><Machine id="perseverance" /></group>
        </>
      )}
    </>
  );
}

/** Explanation: a simplified airbag lander base whose three side petals fold open (open 0..1). */
function Petals({ open }: { open: number }) {
  const mat = <meshStandardMaterial color="#b9b5ac" metalness={0.4} roughness={0.55} />;
  const tri = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-0.9, 0); s.lineTo(0.9, 0); s.lineTo(0, 1.5); s.closePath(); return new THREE.ShapeGeometry(s); }, []);
  return (
    <group position={[0, 0.06, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={tri} position={[0, 0, 0.5]}>{mat}</mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <group position={[0, 0, 0.5]} rotation={[-(Math.PI / 2) * open + Math.PI / 2 - 0.35 * (1 - open), 0, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, Math.PI]} geometry={tri}><meshStandardMaterial color="#b9b5ac" metalness={0.4} roughness={0.55} side={THREE.DoubleSide} /></mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

function DrillSpark() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 20; ref.current.visible = live.t > 0.2; });
  return (
    <mesh ref={ref} position={[0.4, 0.35, 1.9]}>
      <cylinderGeometry args={[0.03, 0.01, 0.35, 6]} /><meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.2} />
    </mesh>
  );
}

// ───────────────────────────── Deep space ─────────────────────────────

function Trail({ from, color = '#8E6BFF' }: { from: THREE.Vector3; color?: string }) {
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints([from, V(0, 0, 0)]), [from]);
  return <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }))} />;
}

function Deep({ beat }: { beat: Beat }) {
  const craft = useRef<THREE.Group>(null!);
  const p4 = has(beat, 'planets4');
  const planets = useMemo(() => [
    { kind: 'jupiter', r: 7, pos: V(-14, -3, -10) }, { kind: 'saturn', r: 6, pos: V(16, -2, -50), rings: true },
    { kind: 'uranus', r: 4, pos: V(-12, 2, -90) }, { kind: 'neptune', r: 4, pos: V(12, -1, -130) },
  ], []);
  useFrame((s) => {
    if (!craft.current) return;
    const t = live.t;
    if (p4) craft.current.position.set(0, 0, 10 - t * 150);
    else if (has(beat, 'jupiter')) craft.current.position.set(-6 + t * 14, 1, 2);
    else craft.current.position.set(0, 0, 0);
    craft.current.rotation.y = s.clock.elapsedTime * 0.1;
  });
  useShot((t, time) => {
    if (p4) { const z = 10 - t * 150; return [V(5, 2.5, z + 9), V(0, 0, z - 6)]; }
    if (has(beat, 'jupiter')) return [V(-2 + t * 6, 2, 12), V(-6 + t * 6, 0, -8)];
    if (has(beat, 'shrink')) return [V(0, 3, 10 + t * 30), V(0, 0, -40)];
    if (has(beat, 'heliosphere')) return [V(6 - t * 2, 2, 8 - t * 2), V(0, 0.5, 0)];
    return [V(Math.sin(time * 0.1) * 6, 2, 8), V(0, 0, 0)];
  });
  const model = beat.prop ? beat.prop : undefined;
  return (
    <>
      <color attach="background" args={['#06041a']} />
      <Stars count={5000} tint="#e6dcff" />
      <directionalLight position={[0, 4, 40]} intensity={2.6} color="#FFF1D6" />
      <directionalLight position={[-20, 6, -20]} intensity={0.8} color="#8E6BFF" />
      <ambientLight intensity={0.15} />
      {has(beat, 'shrink') && (
        <group>
          <ProcPlanet kind="sun" radius={2} position={[0, 0, -60]} />
          {[['earth', 0.6, -48], ['mars', 0.45, -42]].map(([k, r, z], i) => <mesh key={i} position={[i ? 3 : -2.5, 0.5, z as number]}><sphereGeometry args={[r as number, 16, 12]} /><meshBasicMaterial color={i ? '#E2683C' : '#2E8BFF'} /></mesh>)}
          <group position={[-8, 1, 12]} scale={0.6}><Machine id="pioneer10" /></group>
          <group position={[9, -1, 18]} scale={0.6}><Machine id="voyager1" /></group>
          <Trail from={V(0, 0, -60)} />
        </group>
      )}
      {has(beat, 'jupiter') && <ProcPlanet kind="jupiter" radius={9} position={[-14, -4, -26]} spin={0.05} sun={[0.3, 0.2, 1]} />}
      {p4 && planets.map((p, i) => <ProcPlanet key={i} kind={p.kind} radius={p.r} position={p.pos.toArray()} rings={p.rings} sun={[0.4, 0.2, 1]} />)}
      {has(beat, 'heliosphere') && (
        <group position={[-40, 0, -50]}>
          <Atmosphere radius={46} color="#8E6BFF" power={2.2} intensity={0.9} />
          <ProcPlanet kind="sun" radius={1.2} />
        </group>
      )}
      {model && !has(beat, 'shrink') && (
        <group ref={craft}>
          <Machine id={model} />
          {has(beat, 'record') && <mesh position={[0.3, 1.1, 0.6]}><cylinderGeometry args={[0.16, 0.16, 0.02, 24]} /><meshStandardMaterial color="#e6b84a" metalness={1} roughness={0.25} emissive="#7a5410" emissiveIntensity={0.6} /></mesh>}
        </group>
      )}
    </>
  );
}

function PlutoStage({ beat }: { beat: Beat }) {
  const pluto = useRef<THREE.Group>(null!);
  const nh = useRef<THREE.Group>(null!);
  const spinN = useTryCount('pluto-heart');
  useFrame((_, dt) => {
    const t = live.t;
    pluto.current.rotation.y = THREE.MathUtils.damp(pluto.current.rotation.y, -Math.PI * (1 - ease(clamp01(t * 1.4))) + spinN * Math.PI * 2, 2, dt);
    nh.current.position.set(14 - t * 24, 3, 6);
  });
  useShot((t) => [V(2, 1.5, 22 - t * 4), V(0, 0, 0)]);
  return (
    <>
      <color attach="background" args={['#03020c']} />
      <Stars count={4000} />
      <directionalLight position={[10, 4, 14]} intensity={3} color="#fff4e0" />
      <ambientLight intensity={0.08} />
      <group ref={pluto}><ProcPlanet kind="pluto" radius={6} spin={0} sun={[0.5, 0.3, 1]} /></group>
      <group ref={nh} scale={0.9}><Machine id="new-horizons" /></group>
      <group position={[30, 10, -70]}>
        <mesh><sphereGeometry args={[1.2, 16, 12]} /><meshStandardMaterial color="#9b5a3c" /></mesh>
        <mesh position={[1.7, 0.4, 0]}><sphereGeometry args={[0.9, 16, 12]} /><meshStandardMaterial color="#a8654a" /></mesh>
      </group>
    </>
  );
}

function LogbookStage() {
  useShot((t, time) => [V(Math.sin(time * 0.05) * 3, 0, 20), V(0, 0, 0)]);
  return (
    <>
      <color attach="background" args={['#0B1033']} />
      <Stars count={2500} tint="#ffe9b0" />
      <Dust count={200} area={40} height={20} color="#FFC94D" speed={0.1} size={0.12} opacity={0.5} />
    </>
  );
}

export function SplashStage() {
  const g = useRef<THREE.Group>(null!);
  useFrame((s) => { g.current.rotation.y = s.clock.elapsedTime * 0.03; });
  const wide = useThree((s) => s.size.width / s.size.height > 1);
  useShot((t, time) => [V(Math.sin(time * 0.04) * 4 + (wide ? -9 : 0), 8 + Math.sin(time * 0.07), 28), V(wide ? -9 : 0, wide ? 0 : -3, 0)]);
  return (
    <>
      <color attach="background" args={['#0B1033']} />
      <Stars count={4000} />
      <ProcPlanet kind="sun" radius={1.4} />
      <pointLight intensity={900} distance={200} decay={2} color="#fff0d0" />
      <ambientLight intensity={0.15} />
      <group ref={g}>
        {[[8, '#2E8BFF'], [12, '#E2683C'], [19, '#8E6BFF']].map(([r, c], i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[(r as number) - 0.03, (r as number) + 0.03, 128]} /><meshBasicMaterial color={c as string} transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
        ))}
        <group position={[8, 0, 0]}>
          <Earth radius={0.9} spin={0.2} />
          <MoonGlobe radius={0.3} position={[1.8, 0.3, 0.6]} spin={0.1} />
        </group>
        <ProcPlanet kind="mars" radius={0.6} position={[-6, 0, 10.4]} sun={[1, 0, -1.7]} />
        <ProcPlanet kind="jupiter" radius={1.6} position={[0, 0, -19]} sun={[0, 0, 1]} />
      </group>
    </>
  );
}

export function Stage({ beat }: { beat: Beat }) {
  switch (beat.stage) {
    case 'rooftop': return <Rooftop beat={beat} />;
    case 'earth': return <EarthStage beat={beat} />;
    case 'scale': return <ScaleStage />;
    case 'launch': return <Launch />;
    case 'transfer': return <Transfer />;
    case 'moon': return <MoonSurface beat={beat} />;
    case 'moon-orbit': return <MoonOrbit beat={beat} />;
    case 'solar': return <Solar beat={beat} />;
    case 'mars-orbit': return <MarsOrbit beat={beat} />;
    case 'mars': return <MarsSurface beat={beat} />;
    case 'deep': return <Deep beat={beat} />;
    case 'pluto': return <PlutoStage beat={beat} />;
    case 'logbook': return <LogbookStage />;
  }
}

/** Two beats share one 3D scene (no reload) when their stage+scene match. */
export const stageKey = (b: Beat) => `${b.stage}:${b.stage === 'moon' || b.stage === 'mars' || b.stage === 'deep' ? b.scene : ''}`;
