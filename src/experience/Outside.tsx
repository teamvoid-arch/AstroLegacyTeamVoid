import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Experience } from './experiences';
import { Ground, Rocks, Stars, SkyDome, Earth, MoonGlobe, ProcPlanet, Ripples, Dust } from '../three/world';
import { Machine } from '../three/Machine';

/*
  The live 3D world behind the control-room window. `done` = number of steps
  finished, `k` = 0..1 progress of the action currently playing (scrubbed in time).
*/
export interface XState { step: number; k: number; action: string | null; done: number }

const ease = (x: number) => x * x * (3 - 2 * x);
const lerp = THREE.MathUtils.lerp;

function useLook(target: (s: XState) => [number, number, number], s: React.MutableRefObject<XState>, yaw: React.MutableRefObject<number>) {
  const { camera } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const [x, y, z] = target(s.current);
    v.set(x + Math.sin(yaw.current) * 10, y, z);
    const k = 1 - Math.exp(-3 * dt);
    (camera as any).__look ||= new THREE.Vector3(x, y, z);
    (camera as any).__look.lerp(v, k);
    camera.lookAt((camera as any).__look);
  });
}

export function Outside({ exp, s, yaw }: { exp: Experience; s: React.MutableRefObject<XState>; yaw: React.MutableRefObject<number> }) {
  switch (exp.id) {
    case 'eagle': return <EagleOutside s={s} yaw={yaw} />;
    case 'mirror': return <MirrorOutside s={s} yaw={yaw} />;
    case 'rover': case 'opportunity': return <DriveOutside s={s} yaw={yaw} world={exp.id === 'rover' ? 'moon' : 'mars'} />;
    case 'lro': return <LroOutside s={s} yaw={yaw} />;
    case 'voyager': return <VoyagerOutside s={s} yaw={yaw} />;
    case 'newhorizons': return <PlutoOutside s={s} yaw={yaw} />;
    case 'dart': return <DartOutside s={s} yaw={yaw} />;
    default: return <MarsWork exp={exp} s={s} yaw={yaw} />;
  }
}

type P = { s: React.MutableRefObject<XState>; yaw: React.MutableRefObject<number> };

function EagleOutside({ s, yaw }: P) {
  const ground = useRef<THREE.Group>(null!);
  const flame = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    const { done, k, action } = s.current;
    let h = 150;
    if (done >= 1 || action === 'thrust') h = lerp(150, 60, done >= 1 ? 1 : ease(k));
    if (done >= 2 || action === 'steer') h = lerp(60, 10, done >= 2 ? 1 : ease(k));
    if (done >= 3 || action === 'touchdown') h = lerp(10, 2.2, done >= 3 ? 1 : ease(k));
    if (done === 0 && action !== 'thrust') h = 150 - (performance.now() / 1000 % 10);
    ground.current.position.y = -h;
    ground.current.position.x = action === 'steer' ? -ease(k) * 30 : done >= 2 ? -30 : 0;
    flame.current.visible = (action === 'thrust' || action === 'steer' || (action === 'touchdown' && k < 0.6)) || (done >= 1 && done < 3 && !action);
  });
  useLook(() => [0, -30, -26], s, yaw);
  return (
    <>
      <color attach="background" args={['#000']} />
      <Stars />
      <Earth radius={3} position={[30, 25, -120]} />
      <directionalLight position={[30, 40, 20]} intensity={3.2} color="#FFF1D6" />
      <hemisphereLight args={['#c9d6ff', '#58606e', 0.4]} />
      <group ref={ground}><Ground world="moon" seed={11} /><Rocks count={200} color="#77797d" seed={4} spread={40} /></group>
      <mesh ref={flame} position={[0, -2.2, -4]} rotation={[0, 0, 0]}><coneGeometry args={[0.8, 2.6, 16, 1, true]} /><meshBasicMaterial color="#ffd28a" transparent opacity={0.5} toneMapped={false} /></mesh>
    </>
  );
}

function MirrorOutside({ s, yaw }: P) {
  const beam = useRef<THREE.Mesh>(null!);
  const moon = useRef<THREE.Group>(null!);
  useFrame(() => {
    const { done, k, action } = s.current;
    const aimed = done >= 1 || action === 'aim';
    const a = done >= 1 ? 1 : action === 'aim' ? ease(k) : 0;
    moon.current.position.set(lerp(25, 0, a), lerp(28, 18, a), -80);
    beam.current.visible = action === 'beam' || action === 'return';
    beam.current.scale.y = action === 'beam' ? Math.max(0.01, k) : 1;
    (beam.current.material as THREE.MeshBasicMaterial).opacity = action === 'return' ? 0.8 * (1 - k) : 0.8;
    void aimed;
  });
  useLook(() => [0, 10, -60], s, yaw);
  const geo = useMemo(() => { const g = new THREE.CylinderGeometry(0.06, 0.06, 1, 6, 1, true); g.translate(0, 0.5, 0); return g; }, []);
  return (
    <>
      <color attach="background" args={['#050a22']} />
      <Stars tint="#cfd8ff" />
      <group ref={moon}><MoonGlobe radius={6} spin={0} rotation={[0, -Math.PI / 2, 0]} /></group>
      <directionalLight position={[0, 0, 40]} intensity={2.4} />
      <ambientLight intensity={0.1} />
      <mesh ref={beam} geometry={geo} position={[0, -3, -6]} rotation={[-0.45, 0, 0]} scale={[1, 1, 1]}>
        <meshBasicMaterial color="#5dff7a" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </>
  );
}

function DriveOutside({ s, yaw, world }: P & { world: 'moon' | 'mars' }) {
  const ground = useRef<THREE.Group>(null!);
  const dust = useRef<THREE.Group>(null!);
  const devil = useRef<THREE.Group>(null!);
  const z = useRef(0);
  useFrame((st, dt) => {
    const { action, k } = s.current;
    if (action === 'drive' || (world === 'moon' && s.current.done >= 2)) z.current += dt * (world === 'moon' ? 4 : 1.5);
    ground.current.position.z = z.current % 60;
    ground.current.position.y = world === 'moon' && (action === 'drive' || s.current.done >= 2) ? Math.abs(Math.sin(st.clock.elapsedTime * 5)) * 0.12 - 1.2 : -1.2;
    dust.current.visible = action === 'drive' || (world === 'moon' && s.current.done >= 2);
    if (devil.current) { devil.current.visible = action === 'wind'; devil.current.position.x = lerp(-30, 30, k); devil.current.rotation.y = st.clock.elapsedTime * 6; }
  });
  useLook(() => [0, 0, -40], s, yaw);
  return (
    <>
      {world === 'moon' ? <color attach="background" args={['#000']} /> : <SkyDome top="#c99a6b" bottom="#ebc296" />}
      {world === 'moon' && <Stars />}
      {world === 'moon' && <Earth radius={4} position={[-40, 30, -130]} />}
      <directionalLight position={[30, 40, 20]} intensity={3} color="#FFF1D6" />
      <hemisphereLight args={[world === 'moon' ? '#c9d6ff' : '#f0c9a4', world === 'moon' ? '#58606e' : '#a5532d', 0.6]} />
      <group ref={ground}><Ground world={world} seed={world === 'moon' ? 15 : 9} /><Rocks count={160} color={world === 'moon' ? '#77797d' : '#6e3420'} spread={50} /></group>
      <group ref={dust}><Dust count={160} area={8} height={2} color={world === 'moon' ? '#b9bbc0' : '#d9a27a'} speed={1.5} size={0.06} opacity={0.6} /></group>
      {world === 'mars' && (
        <group ref={devil} position={[0, 0, -25]}>
          <mesh position={[0, 6, 0]}><coneGeometry args={[3, 14, 16, 1, true]} /><meshStandardMaterial color="#d9a27a" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
        </group>
      )}
    </>
  );
}

function MarsWork({ exp, s, yaw }: P & { exp: Experience }) {
  const arm = useRef<THREE.Group>(null!);
  const dome = useRef<THREE.Group>(null!);
  const seis = useRef<THREE.Group>(null!);
  const rover = useRef<THREE.Group>(null!);
  const heliCam = useRef(0);
  const spark = useRef<THREE.Mesh>(null!);
  const bit = useRef<THREE.Mesh>(null!);
  const tube = useRef<THREE.Group>(null!);
  const quakeN = useRef(0);
  const ripple = useRef<number>(0);
  const { camera } = useThree();
  useFrame((st, dt) => {
    const { action, k, done } = s.current;
    if (arm.current) { const ext = action === 'scoop' ? Math.sin(k * Math.PI) : action === 'place' ? ease(k) : 0; arm.current.scale.z = 0.3 + ext; }
    if (seis.current) seis.current.position.y = exp.id === 'insight' ? (done >= 1 ? 0 : action === 'place' ? lerp(1.2, 0, ease(k)) : 1.2) : 0;
    if (dome.current) dome.current.position.y = done >= 2 ? 0 : action === 'dome' ? lerp(3, 0, ease(k)) : 3;
    if (exp.id === 'insight' && action === 'quake' && k > 0.2 && ripple.current === 0) { ripple.current = 1; quakeN.current++; }
    if (action !== 'quake') ripple.current = 0;
    if (rover.current && exp.id === 'sojourner') {
      const go = action === 'delayed-drive' ? Math.max(0, (k - 0.45) / 0.55) : done >= 2 ? 1 : 0;
      rover.current.position.set(lerp(-1.5, 2, ease(go)), 0, lerp(-5, -7, ease(go)));
    }
    if (exp.id === 'sojourner') {
      const lv = action === 'lander-view' || done >= 3;
      camera.position.lerp(new THREE.Vector3(lv ? -3 : 0, lv ? 2.2 : 1.1, lv ? -2.5 : 0), 1 - Math.exp(-2 * dt));
    }
    if (exp.id === 'ingenuity') {
      const h = done >= 4 ? 0 : action === 'land' ? lerp(10, 0, ease(k)) : done >= 3 ? 10 : action === 'fly' ? lerp(5, 10, ease(k)) : done >= 2 ? 5 : action === 'lift' ? lerp(0, 5, ease(k)) : 0;
      heliCam.current = h;
      camera.position.y = 1.1 + h;
      camera.position.z = action === 'fly' ? -ease(k) * 30 : done >= 3 ? -30 : 0;
    }
    if (spark.current) { spark.current.visible = action === 'zap' && k > 0.3 && k < 0.6; }
    if (bit.current) { bit.current.visible = exp.id === 'perseverance' && (action === 'drill' || done >= 1); bit.current.rotation.y += dt * 25 * (action === 'drill' ? 1 : 0); bit.current.position.y = action === 'drill' ? lerp(1.2, 0.7, k) : 1.2; }
    if (tube.current) { tube.current.visible = exp.id === 'perseverance' && done >= 1; tube.current.position.set(done >= 3 || action === 'drop' ? lerp(1.5, 3.5, action === 'drop' ? ease(k) : 1) : 1.5, action === 'drop' ? lerp(1, 0.05, ease(k)) : done >= 3 ? 0.05 : 1, -5); }
  });
  const target: Record<string, [number, number, number]> = { curiosity: [6, 0, -14], viking: [0, -1, -6], insight: [0, -1, -5], sojourner: [1, -0.5, -7] };
  useLook((st) => exp.id === 'curiosity' ? (st.done >= 1 || st.action === 'mast' ? [3, 0.5, -10] : [0, 0, -30]) : target[exp.id] || [0, -0.5, -20], s, yaw);
  return (
    <>
      <SkyDome top="#c99a6b" bottom="#ebc296" />
      <fog attach="fog" args={['#ebc296', 40, 260]} />
      <directionalLight position={[30, 40, 20]} intensity={3} color="#FFF1D6" />
      <hemisphereLight args={['#f0c9a4', '#a5532d', 0.65]} />
      <group position={[0, -1.1, 0]}>
        <Ground world="mars" seed={exp.id.length * 7} />
        <Rocks count={160} color="#6e3420" spread={50} seed={exp.id.length} />
        {exp.id === 'viking' && (
          <>
            <group ref={arm} />
          </>
        )}
        {exp.id === 'insight' && (
          <>
            <group ref={seis} />
            <group ref={dome} />
            <QuakeRipples n={quakeN} />
          </>
        )}
        {exp.id === 'sojourner' && (
          <>
            <group ref={rover} position={[-1.5, 0, -5]}><Machine id="sojourner" /></group>
            <mesh position={[2.6, 0.25, -7.2]}><dodecahedronGeometry args={[0.45, 0]} /><meshStandardMaterial color="#7a3b22" flatShading /></mesh>
          </>
        )}
        {exp.id === 'curiosity' && (
          <>
            <mesh position={[3, 0.4, -10]}><dodecahedronGeometry args={[0.8, 1]} /><meshStandardMaterial color="#6e4632" flatShading /></mesh>
            <mesh ref={spark} position={[3, 0.6, -9.25]}><sphereGeometry args={[0.12, 12, 8]} /><meshBasicMaterial color="#ffe9a8" toneMapped={false} /></mesh>
            <group position={[0, 0, 2]} rotation={[0, Math.PI, 0]}><Machine id="curiosity" /></group>
            <mesh position={[0, 0, -120]} scale={[60, 26, 30]}><sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b0653c" roughness={1} /></mesh>
          </>
        )}
        {exp.id === 'perseverance' && (
          <>
            <mesh position={[1.5, 0.35, -5]}><dodecahedronGeometry args={[0.7, 1]} /><meshStandardMaterial color="#8a5a3c" flatShading /></mesh>
            <group position={[6, 0, -8]} rotation={[0, -0.6, 0]}><Machine id="perseverance" /></group>
          </>
        )}
        {exp.id === 'ingenuity' && <group position={[8, 0, -16]} rotation={[0, -0.8, 0]}><Machine id="perseverance" /></group>}
      </group>
      {exp.id === 'ingenuity' && <RotorBlur s={s} />}
      <Dust count={150} area={40} height={4} color="#d9a27a" speed={0.4} size={0.05} opacity={0.35} />
    </>
  );
}

function QuakeRipples({ n }: { n: React.MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null!);
  const last = useRef(0);
  const start = useRef(-10);
  const rings = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    if (n.current !== last.current) { last.current = n.current; start.current = clock.elapsedTime; }
    const e = clock.elapsedTime - start.current;
    rings.current.forEach((r, i) => { const k = (e - i * 0.6) / 3; r.visible = k > 0 && k < 1; r.scale.setScalar(1 + k * 18); (r.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.6; });
  });
  return (
    <group ref={g} position={[0.5, 0.06, -4]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(r) => (rings.current[i] = r!)} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.9, 1, 48]} /><meshBasicMaterial color="#FFC94D" transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RotorBlur({ s }: { s: React.MutableRefObject<XState> }) {
  const m = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  useFrame(() => {
    const on = s.current.done >= 1 || s.current.action === 'spin';
    m.current.visible = on;
    m.current.position.set(camera.position.x, camera.position.y + 0.9, camera.position.z - 0.6);
    (m.current.material as THREE.MeshBasicMaterial).opacity = on ? 0.18 : 0;
  });
  return <mesh ref={m} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.4, 40]} /><meshBasicMaterial color="#cccccc" transparent opacity={0.18} /></mesh>;
}

function LroOutside({ s, yaw }: P) {
  const moon = useRef<THREE.Group>(null!);
  useFrame(() => {
    const { action, k, done } = s.current;
    const z = done >= 1 ? 1 : action === 'zoom' ? ease(k) : 0;
    moon.current.position.z = lerp(-40, -9, z);
  });
  useLook(() => [0, 0, -30], s, yaw);
  return (
    <>
      <color attach="background" args={['#000']} /><Stars />
      <group ref={moon}><MoonGlobe radius={6} spin={0} rotation={[0, -Math.PI / 2 - 0.4, 0]} /></group>
      <directionalLight position={[10, 6, 10]} intensity={3} /><ambientLight intensity={0.05} />
    </>
  );
}

function VoyagerOutside({ s, yaw }: P) {
  const sky = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    const { action, k, done } = s.current;
    const turn = done >= 1 ? 1 : action === 'turn' ? ease(k) : 0;
    sky.current.rotation.y = turn * Math.PI * 0.8;
    ring.current.visible = action === 'signal';
    ring.current.scale.setScalar(0.2 + k * 8);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - k);
  });
  useLook(() => [0, 0, -30], s, yaw);
  return (
    <>
      <color attach="background" args={['#04031a']} />
      <group ref={sky}>
        <Stars count={5000} />
        <group position={[0, 0, 80]}><ProcPlanet kind="sun" radius={0.8} /><mesh position={[1.4, 0.3, 0]}><sphereGeometry args={[0.06, 8, 6]} /><meshBasicMaterial color="#7fb2ff" toneMapped={false} /></mesh></group>
      </group>
      <mesh ref={ring} position={[0, 0, -8]}><ringGeometry args={[0.95, 1, 64]} /><meshBasicMaterial color="#8E6BFF" transparent toneMapped={false} /></mesh>
    </>
  );
}

function PlutoOutside({ s, yaw }: P) {
  const p = useRef<THREE.Group>(null!);
  useFrame(() => {
    const { action, k, done } = s.current;
    const centre = done >= 1 ? 1 : action === 'point' ? ease(k) : 0;
    const near = done >= 2 ? 1 : action === 'approach' ? ease(k) : 0;
    p.current.position.set(lerp(14, 0, centre), lerp(6, 0, centre), lerp(-90, -22, near));
    p.current.rotation.y = done >= 3 ? 0 : action === 'heart' ? lerp(-Math.PI, 0, ease(k)) : -Math.PI;
  });
  useLook(() => [0, 0, -30], s, yaw);
  return (
    <>
      <color attach="background" args={['#03020c']} /><Stars count={4000} />
      <directionalLight position={[10, 4, 14]} intensity={3} /><ambientLight intensity={0.06} />
      <group ref={p}><ProcPlanet kind="pluto" radius={6} spin={0} sun={[0.5, 0.3, 1]} /></group>
    </>
  );
}

function DartOutside({ s, yaw }: P) {
  const moonlet = useRef<THREE.Group>(null!);
  const orbit = useRef<THREE.Mesh>(null!);
  const newOrbit = useRef<THREE.Mesh>(null!);
  const flash = useRef<THREE.Mesh>(null!);
  const rig = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const { action, k, done } = s.current;
    const hit = done >= 3;
    const r = hit ? 5.2 : 6;
    const a = clock.elapsedTime * 0.3;
    moonlet.current.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    newOrbit.current.visible = hit;
    rig.current.position.z = action === 'impact' ? lerp(-40, -16, ease(Math.min(1, k * 1.6))) : -40;
    flash.current.visible = action === 'impact' && k > 0.62 && k < 0.8; // one soft glow, not a flashing strobe
    flash.current.position.copy(moonlet.current.position);
    void orbit;
  });
  useLook(() => [0, 0, -40], s, yaw);
  return (
    <>
      <color attach="background" args={['#04031a']} /><Stars count={4000} />
      <directionalLight position={[10, 6, 14]} intensity={3} /><ambientLight intensity={0.08} />
      <group ref={rig} position={[0, 0, -40]} rotation={[0.5, 0, 0]}>
        <ProcPlanet kind="asteroid" radius={2.6} spin={0.2} sun={[0.5, 0.4, 1]} />
        <group ref={moonlet}><ProcPlanet kind="asteroid" radius={0.6} spin={0.4} /></group>
        <mesh ref={orbit} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[5.95, 6.05, 96]} /><meshBasicMaterial color="#8E6BFF" transparent opacity={0.5} side={THREE.DoubleSide} /></mesh>
        <mesh ref={newOrbit} rotation={[-Math.PI / 2, 0, 0]} visible={false}><ringGeometry args={[5.15, 5.25, 96]} /><meshBasicMaterial color="#FFC94D" transparent opacity={0.8} side={THREE.DoubleSide} toneMapped={false} /></mesh>
        <mesh ref={flash} visible={false}><sphereGeometry args={[1.2, 16, 12]} /><meshBasicMaterial color="#fff1c2" transparent opacity={0.7} toneMapped={false} /></mesh>
      </group>
    </>
  );
}

/** Era-styled interior frame around the window (imagined control room). */
export function Room({ room }: { room: string }) {
  const panel = room === '60s' || room === '70s' || room === 'cabin' ? '#8f8a7a' : room === '90s' ? '#6f7f96' : room === 'observatory' ? '#3a3f55' : '#2a3350';
  const accent = room === 'today' ? '#3fd0ff' : room === '90s' ? '#a6f3c2' : '#FFC94D';
  if (room === 'open-seat') return null;
  return (
    <group>
      {/* frame pieces around a big curved-looking window (about 60% of the view) */}
      <mesh position={[0, 2.35, -1.6]}><boxGeometry args={[6, 1.4, 0.2]} /><meshStandardMaterial color={panel} roughness={0.7} /></mesh>
      <mesh position={[0, -0.55, -1.6]}><boxGeometry args={[6, 1.0, 0.2]} /><meshStandardMaterial color={panel} roughness={0.7} /></mesh>
      {[-1, 1].map((sd) => (
        <group key={sd}>
          <mesh position={[sd * 2.45, 0.9, -1.6]}><boxGeometry args={[1.2, 2.6, 0.2]} /><meshStandardMaterial color={panel} roughness={0.7} /></mesh>
          <mesh position={[sd * 2.6, 0.9, -0.2]} rotation={[0, sd * -1.2, 0]}><boxGeometry args={[3, 4, 0.1]} /><meshStandardMaterial color={panel} roughness={0.8} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.95, -1.62]}><torusGeometry args={[1.95, 0.05, 8, 64]} /><meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.6} /></mesh>
      <mesh position={[0, 0.95, -1.55]}><planeGeometry args={[3.8, 2.3]} /><meshPhysicalMaterial color="#cfe6ff" transparent opacity={0.06} roughness={0} metalness={0} depthWrite={false} /></mesh>
      <pointLight position={[0, 1.5, 0]} intensity={1.2} distance={6} color={accent} />
    </group>
  );
}
