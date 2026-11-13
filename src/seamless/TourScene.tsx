/*
  Quick tours (team script §3–4): a fast, cinematic flight over NASA's own global maps.
  - Moon: NASA SVS CGI Moon Kit colour map (LRO). Mars: NASA 3D Resources global Mars map. Earth: this app's Earth.
    (Both maps come from the team's "Where We Left Them" map artifact.)
  - Pins sit at the real landing / impact coordinates from that map (NASA mission records, NSSDCA). The main story's
    machines glow in their status colour; every other machine on that world is a faint pin, so the whole map shows.
  - The camera swoops from one site to the next (motion blur follows its speed) while VIMO flies alongside and points.
  - Deep space: the four escaping probes leave the Sun in their real directions (ecliptic longitude/latitude);
    trail lengths are not to scale (labelled in the UI).
*/
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';
import { getTex } from '../three/world';
import { setVimo } from '../vimo/controller';
import { useStory } from './state';
import { ALL_SITES, BEATS, MACHINES, spotOf, worldMachines } from './bridge';
import { quickChip } from './engine';

export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars({ count, seed }: { count: number; seed: number }) {
  const geo = useMemo(() => {
    const rnd = mulberry(seed);
    const g = new THREE.BufferGeometry();
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = 200 + rnd() * 120, s = Math.sqrt(1 - u * u);
      a.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return g;
  }, [count, seed]);
  return <points geometry={geo}><pointsMaterial size={0.7} color="#F4F6FF" sizeAttenuation /></points>;
}

export const TOUR_FIRST_YEAR = 1964;
export const TOUR_LAST_YEAR = 2026;

const BODIES = {
  earth: { pos: new THREE.Vector3(0, 0, 0), r: 1.2 },
  moon: { pos: new THREE.Vector3(6, 0.6, -2), r: 1.6 },
  mars: { pos: new THREE.Vector3(24, -0.5, -14), r: 2.0 },
};
/** The Sun of the deep-space shot, far from the globes. */
const DEEP = new THREE.Vector3(70, 0, -70);

/** Lat/lon (degrees, east positive) → unit direction matching three.js sphere UVs on an equirectangular map
    (u = (lon + 180) / 360: lon 0 faces +X, lon 90°E faces −Z). */
function dirOf(lat: number, lon: number) {
  const p = THREE.MathUtils.degToRad(lat), l = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(Math.cos(p) * Math.cos(l), Math.sin(p), -Math.cos(p) * Math.sin(l));
}
/** Ecliptic longitude/latitude → direction (ecliptic = the XZ plane). */
function eclDir(lam: number, beta: number) {
  const b = THREE.MathUtils.degToRad(beta), l = THREE.MathUtils.degToRad(lam);
  return new THREE.Vector3(Math.cos(b) * Math.cos(l), Math.sin(b), -Math.cos(b) * Math.sin(l));
}
const probeLen = (au: number) => 12 + Math.log10(au) * 7;

const PIN_COLOUR: Record<string, string> = { working: '#9BE36A', quiet: '#C9D3E8', 'used-once': '#FFC94D', crashed: '#FFC94D', lost: '#f2b0b0' };

/** The machine on screen now in a quick tour (null while VIMO is still talking). */
function activeMachine() {
  const beat = BEATS[useStory.getState().beatIndex];
  if (!beat?.quick) return null;
  const i = quickChip();
  return i >= 0 ? worldMachines(beat.quick)[i] ?? null : null;
}

function Globe({ body }: { body: 'moon' | 'mars' | 'earth' }) {
  const map = getTex(body === 'moon' ? 'assets/textures/moon-nasa-map.jpg' : body === 'mars' ? 'assets/textures/mars-nasa-map.jpg' : 'assets/textures/earth.jpg');
  const b = BODIES[body];
  const year = useStory((s) => s.yearOverride) ?? TOUR_LAST_YEAR;
  const main = useMemo(() => (body === 'earth' ? [] : worldMachines(body).map((m) => ({ m, s: spotOf(m.id) })).filter((x) => x.s && x.s.body === body)), [body]);
  const faint = useMemo(() => (body === 'earth' ? [] : ALL_SITES[body]), [body]);
  const ring = useRef<THREE.Mesh>(null);
  const ringAt = useRef<string | null>(null);
  useFrame(({ clock }) => {
    const a = activeMachine();
    const s = a ? spotOf(a.id) : null;
    if (!ring.current) return;
    const here = !!s && s.body === body;
    ring.current.visible = here;
    if (here && s && 'lat' in s) {
      const key = a!.id;
      if (ringAt.current !== key) {
        ringAt.current = key;
        const d = dirOf(s.lat, s.lon);
        ring.current.position.copy(d.clone().multiplyScalar(b.r * 1.004));
        ring.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d);
      }
      const k = 1 + 0.25 * Math.sin(clock.elapsedTime * 5);
      ring.current.scale.setScalar(k);
    }
  });
  return (
    <group position={b.pos}>
      <mesh>
        <sphereGeometry args={[b.r, 96, 64]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
      </mesh>
      {/* every machine on this world: faint pins */}
      {faint.map((site) => {
        const d = dirOf(site.lat, site.lon);
        const first = Math.min(...site.pins.map((p) => p.year));
        return first <= year ? (
          <mesh key={site.label} position={d.clone().multiplyScalar(b.r * 1.01)}>
            <sphereGeometry args={[b.r * 0.012, 8, 6]} /><meshBasicMaterial color="#e9edf8" transparent opacity={0.55} />
          </mesh>
        ) : null;
      })}
      {/* the story's machines: bright pins on little stalks, in their status colour */}
      {main.map(({ m, s }) => {
        if (!s || !('lat' in s) || m.year > year) return null;
        const d = dirOf(s.lat, s.lon);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
        return (
          <group key={m.id} position={d.clone().multiplyScalar(b.r)} quaternion={q}>
            <mesh position={[0, b.r * 0.045, 0]}><cylinderGeometry args={[b.r * 0.004, b.r * 0.004, b.r * 0.09, 6]} /><meshBasicMaterial color="#FFF7E8" /></mesh>
            <mesh position={[0, b.r * 0.1, 0]}><sphereGeometry args={[b.r * 0.028, 14, 10]} /><meshBasicMaterial color={PIN_COLOUR[m.status ?? ''] ?? '#FFC94D'} toneMapped={false} /></mesh>
          </group>
        );
      })}
      {/* the machine on screen: a pulsing ring around its site */}
      <mesh ref={ring} visible={false}>
        <ringGeometry args={[b.r * 0.06, b.r * 0.075, 40]} />
        <meshBasicMaterial color="#FFC94D" transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
      </mesh>
      {/* LRO: a little orbiter on a ring around the Moon (illustration) */}
      {body === 'moon' && <LroOrbit r={b.r * 1.35} />}
    </group>
  );
}

function LroOrbit({ r }: { r: number }) {
  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.5;
    dot.current?.position.set(Math.cos(t) * r, Math.sin(t) * r * 0.25, Math.sin(t) * r);
  });
  return (
    <group>
      <mesh rotation={[Math.PI / 2 - 0.25, 0, 0]}><torusGeometry args={[r, 0.006, 6, 120]} /><meshBasicMaterial color="#9BE36A" transparent opacity={0.5} /></mesh>
      <mesh ref={dot}><sphereGeometry args={[0.05, 10, 8]} /><meshBasicMaterial color="#9BE36A" toneMapped={false} /></mesh>
    </group>
  );
}

/** Deep space: the Sun, faint planet orbits, and the four escaping probes in their real directions. */
function DeepSpace() {
  const year = useStory((s) => s.yearOverride) ?? TOUR_LAST_YEAR;
  const probes = useMemo(() => worldMachines('deep').map((m) => {
    const s = spotOf(m.id);
    if (!s || s.body !== 'deep') return null;
    const d = eclDir(s.lam, s.beta);
    const tip = DEEP.clone().addScaledVector(d, probeLen(s.au));
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([DEEP.clone(), tip]), new THREE.LineBasicMaterial({ color: '#B39BFF', transparent: true, opacity: 0.75 }));
    return { m, tip, line };
  }).filter(Boolean) as { m: (typeof MACHINES)[string]; tip: THREE.Vector3; line: THREE.Line }[], []);
  return (
    <group>
      <mesh position={DEEP}><sphereGeometry args={[0.9, 32, 24]} /><meshBasicMaterial color="#FFD27A" toneMapped={false} /></mesh>
      <pointLight position={DEEP} intensity={300} distance={80} decay={2} color="#fff0d0" />
      {[3, 5, 8, 11].map((r) => (
        <mesh key={r} position={DEEP} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.02, 6, 160]} /><meshBasicMaterial color="#5f6a8c" transparent opacity={0.45} /></mesh>
      ))}
      {probes.map((p) => p.m.year <= year ? (
        <group key={p.m.id}>
          <primitive object={p.line} />
          <mesh position={p.tip}><sphereGeometry args={[0.45, 16, 12]} /><meshBasicMaterial color={PIN_COLOUR[p.m.status ?? ''] ?? '#F4F6FF'} toneMapped={false} /></mesh>
          <mesh position={p.tip}><sphereGeometry args={[0.9, 16, 12]} /><meshBasicMaterial color={PIN_COLOUR[p.m.status ?? ''] ?? '#F4F6FF'} transparent opacity={0.18} depthWrite={false} toneMapped={false} /></mesh>
        </group>
      ) : null)}
    </group>
  );
}

/** Quick-tour shot for the machine on screen: the camera faces its site (or its probe), from a new angle each time. */
function quickShot(world: 'moon' | 'mars' | 'deep', machineId: string | null, i: number, far: number): [THREE.Vector3, THREE.Vector3] {
  if (world === 'deep') {
    const s = machineId ? spotOf(machineId) : null;
    if (!s || s.body !== 'deep') return [DEEP.clone().add(new THREE.Vector3(-8, 16 * far, 26 * far)), DEEP.clone()];
    const d = eclDir(s.lam, s.beta);
    const tip = DEEP.clone().addScaledVector(d, probeLen(s.au));
    // from beside the Sun, looking out along the probe's path to where it is now
    // close behind the probe, a little to the side: its trail leads back toward the Sun
    const side = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 1, 0)).normalize();
    return [tip.clone().addScaledVector(d, -9 * far).addScaledVector(side, (i % 2 ? -4 : 4) * far).add(new THREE.Vector3(0, 2.5, 0)), tip];
  }
  const b = BODIES[world];
  const s = machineId ? spotOf(machineId) : null;
  if (!s || !('lat' in s)) {
    // arrival shot, or LRO (orbit): a wide view of the whole globe
    const a = i < 0 ? 0.9 : 2.2;
    return [b.pos.clone().add(new THREE.Vector3(Math.cos(a), 0.35, -Math.sin(a)).normalize().multiplyScalar(b.r * 4.2 * far)), b.pos.clone()];
  }
  const d = dirOf(s.lat, s.lon);
  // a little above the site, offset sideways (alternating) so each swoop has a curve
  const side = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(i % 2 ? -0.35 : 0.35);
  const camDir = d.clone().add(side).add(new THREE.Vector3(0, 0.18, 0)).normalize();
  return [b.pos.clone().addScaledVector(camDir, b.r * 2.5 * far), b.pos.clone().addScaledVector(d, b.r * 0.35)];
}

/** Camera: flies smoothly (never a cut), writes the motion blur, runs the year counter and moves VIMO alongside. */
function TourCamera() {
  const pos = useRef(new THREE.Vector3(14, 26, 22));
  const look = useRef(new THREE.Vector3(14, 0, -8));
  const blur = useRef(0);
  const lastChip = useRef<string>('');
  useEffect(() => () => { document.documentElement.style.setProperty('--sl-blur', '0px'); }, []);
  useFrame(({ camera }, dt) => {
    const st = useStory.getState();
    const beat = BEATS[st.beatIndex];
    const portrait = window.innerHeight > window.innerWidth;
    const far = portrait ? 1.9 : 1;
    const reduced = useStore.getState().settings.reducedMotion;
    const world = beat?.quick ?? (beat?.tour === 'mars' ? 'mars' : beat?.tour === 'deep' ? 'deep' : 'moon');
    const i = quickChip();
    const m = activeMachine();
    const [p, l] = quickShot(world, m?.id ?? null, i, far);
    const k = reduced ? 1 : 1 - Math.exp(-dt * 3.0); // fast, eased: a swoop, never a cut
    const before = pos.current.clone();
    pos.current.lerp(p, k); look.current.lerp(l, k);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
    // motion blur follows the camera's speed relative to how far it is from what it looks at
    const speed = before.distanceTo(pos.current) / Math.max(dt, 1 / 120) / Math.max(1, pos.current.distanceTo(look.current));
    blur.current = THREE.MathUtils.damp(blur.current, reduced ? 0 : Math.min(6, speed * 2.4), 10, dt);
    document.documentElement.style.setProperty('--sl-blur', `${blur.current.toFixed(2)}px`);
    // year counter follows the machine on screen (1960s → today)
    const year = m?.year ?? beat?.year ?? TOUR_LAST_YEAR;
    if (st.yearOverride !== year) st.setYearOverride(year);
    // VIMO flies alongside, switching sides for each machine and pointing at it
    const key = `${st.beatIndex}:${i}`;
    if (i >= 0 && key !== lastChip.current) {
      lastChip.current = key;
      setVimo({ screen: i % 2 ? 'left' : 'right', size: 'S', gesture: 'point', face: 'excited' });
    }
  });
  return null;
}

export function TourScene() {
  const lite = useStore((s) => s.settings.lite);
  useEffect(() => () => useStory.getState().setYearOverride(null), []);
  return (
    <>
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-20, 10, 15]} intensity={2.4} color="#FFF1D6" />
      <directionalLight position={[10, -4, -20]} intensity={0.6} color="#7FB2FF" />
      <Stars count={lite ? 900 : 2200} seed={3} />
      <Globe body="earth" />
      <Globe body="moon" />
      <Globe body="mars" />
      <DeepSpace />
      <TourCamera />
    </>
  );
}
