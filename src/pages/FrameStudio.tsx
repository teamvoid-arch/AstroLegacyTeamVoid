/*
  Frame studio (development tool): renders the START FRAMES for the Veo 3 "[F]" shots in
  docs/veo3-prompts.md. Each frame shows the machine with its exact shape (NASA 3D model, or the
  team's labelled replica) in a simple scene, so Veo animates the real hardware instead of inventing it.
  No VIMO here: Veo adds her from her own reference picture.

  Open #/frames?f=surveyor3/2 to see one frame; `npm run frames` saves them all as video-frames/<video>/<shot>.png.
*/
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Machine } from '../three/Machine';
import { Bridles, EntryCapsule, Parachute, SkyCrane } from '../three/explain';
import { Earth, Ground, MoonGlobe, ProcPlanet, Rocks, SkyDome, Stars } from '../three/world';

type V3 = [number, number, number];
type Set = 'moon' | 'moon-crater' | 'mars' | 'mars-dusty' | 'space';
interface Frame { set: Set; cam: V3; look: V3; fov?: number; body: ReactNode }

const M = (id: string, p: V3 = [0, 0, 0], r = 0, extra: Record<string, unknown> = {}) => <Machine id={id} position={p} rotation={[0, r, 0]} {...extra} />;
const rock = (p: V3, s: number, c = '#7a3b22') => <mesh position={p} scale={[s, s * 0.7, s * 0.9]} rotation={[0.3, p[0], 0.2]} castShadow><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color={c} roughness={0.95} flatShading /></mesh>;
const asteroids = (seed: number, n: number, spread: number, near = 0) => Array.from({ length: n }, (_, i) => {
  const a = Math.sin(i * 12.9898 + seed) * 43758.5453, f = a - Math.floor(a);
  const b = Math.sin(i * 78.233 + seed) * 12543.123, g = b - Math.floor(b);
  return <group key={i}>{rock([(f - 0.5) * spread, (g - 0.5) * spread * 0.4, -near - g * spread * 0.6], 0.3 + f * 1.4, '#6d6560')}</group>;
});
// Jezero crater rim in the distance
const hills = (
  <group>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return (
    <mesh key={i} position={[Math.cos(a) * 120, 0, Math.sin(a) * 120]} scale={[40, 14 + (i % 3) * 6, 28]}>
      <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#a65a35" roughness={1} />
    </mesh>); })}</group>
);
const earthSky =<Earth radius={6} position={[-45, 38, -95]} spin={0} sunDir={[1, 0.4, 0.8]} />;

export const FRAMES: Record<string, Frame> = {
  // ── Moon ──
  'surveyor3/2': { set: 'moon-crater', cam: [6.5, 0.6, 7.5], look: [0, -0.4, 0], body: M('surveyor3', [0, -1.5, 0], 0.4) },
  'surveyor3/3': { set: 'moon', cam: [-3.2, 1.0, 3.6], look: [-1.2, 0.35, 1.2], body: M('surveyor3', [0, 0, 0], 0) },
  'surveyor3/5': { set: 'moon', cam: [4.2, 0.9, 5.2], look: [0, 1.7, 0], body: <>{M('surveyor3', [0, 0, 0], 0.5)}{earthSky}</> },
  'apollo11-eagle/4': { set: 'moon', cam: [13, 3.5, 15], look: [0, 3, 0], body: <>{M('apollo11-eagle', [0, 0, 0], 0)}{earthSky}</> },
  'apollo11-eagle/5': { set: 'moon', cam: [1.4, 1.5, 6.4], look: [0, 1.3, 3.0], body: M('apollo11-eagle', [0, 0, 0], 0) },
  'apollo15-rover/3': { set: 'moon', cam: [13, 3, 13], look: [2.5, 2, 0], body: <>{M('apollo11-eagle', [-2, 0, -2], 0.3)}{M('apollo15-rover', [5, 0, 2], 0.9)}</> },
  'apollo15-rover/4': { set: 'moon', cam: [3.4, 0.9, 3.4], look: [0.6, 0.45, 0.8], body: M('apollo15-rover', [0, 0, 0], 0) },
  'lro/3': { set: 'space', cam: [6, 2.2, 8], look: [0, 0.6, 0], body: <>{M('lro', [0, -0.6, 0], 0.6)}<MoonGlobe radius={60} position={[0, -66, -10]} spin={0} /></> },
  // ── Mars ──
  'viking1/2': { set: 'mars', cam: [10, 12, 17], look: [0, 17.5, 0], body: <group position={[0, 10, 0]}>{M('viking1', [0, 0, 0], 0.3)}<Parachute position={[0, 2.6, 0]} radius={4.2} height={12} colors={['#f4f1ea', '#e7e2d6']} /></group> },
  'viking1/4': { set: 'mars', cam: [3.8, 1.6, 4.4], look: [0.5, 0.8, 0.4], body: M('viking1', [0, 0, 0], 0.3) },
  'pathfinder-sojourner/4': { set: 'mars', cam: [1.8, 0.9, 2.3], look: [0.3, 0.2, 0.4], body: <><Petals />{M('sojourner', [0.6, 0.02, 0.9], 0.6)}</> },
  'pathfinder-sojourner/5': { set: 'mars', cam: [1.5, 0.45, 1.7], look: [0, 0.18, 0], body: <>{M('sojourner', [0, 0, 0], 0.4)}{rock([-0.6, 0.15, -0.4], 0.32)}{rock([0.7, 0.12, -0.6], 0.26)}{rock([0.1, 0.2, -1.1], 0.4)}</> },
  'opportunity/2': { set: 'mars-dusty', cam: [3.4, 1.4, 4.2], look: [0, 0.8, 0], body: M('opportunity', [0, 0, 0], 0.4) },
  'opportunity/3': { set: 'mars-dusty', cam: [2.0, 0.9, 2.7], look: [0.2, 0.5, 0.8], body: <>{M('opportunity', [0, 0, 0], 0)}{rock([0.4, 0.15, 1.7], 0.3, '#8a8580')}</> },
  'curiosity/2': { set: 'mars', cam: [8, 4.5, 12.5], look: [0, 6, 0], body: <><SkyCrane position={[0, 9.5, 0]} /><group position={[0, 9.5, 0]} scale={[1, 6.1, 1]}><Bridles spread={1.1} /></group>{M('curiosity', [0, 2.2, 0], 0)}</> },
  'curiosity/4': { set: 'mars', cam: [3.4, 2.4, 4.4], look: [0.2, 1.4, 0.2], body: M('curiosity', [0, 0, 0], 0.3) },
  'insight/3': { set: 'mars', cam: [6.5, 3.2, 7.5], look: [0, 1, 0], body: M('insight', [0, 0, 0], 0.3) },
  'insight/5': { set: 'mars-dusty', cam: [3.8, 2.4, 2.4], look: [1.6, 0.9, 0], body: M('insight', [0, 0, 0], 0.3, { dust: 0.7 }) },
  'ingenuity/2': { set: 'mars', cam: [3.0, 0.4, 3.6], look: [0.1, 0.4, 0.3], body: <>{M('perseverance', [0, 0, 0], 0.2)}{M('ingenuity', [0.5, 0.02, 1.45], 0.4)}</> },
  'ingenuity/3': { set: 'mars', cam: [1.3, 1.15, 1.6], look: [0, 0.75, 0], body: M('ingenuity', [0, 0, 0], 0, { rotors: 0 }) },
  'ingenuity/4': { set: 'mars', cam: [2.2, 2.2, 2.9], look: [0, 2.5, 0], body: M('ingenuity', [0, 2.2, 0], 0.3) },
  'perseverance-depot/2': { set: 'mars', cam: [18, 22, 30], look: [0, 27, 0], body: <group position={[0, 16, 0]}><EntryCapsule size={1.6} heat={0} /><Parachute position={[0, 1.6, 0]} radius={6} height={12} colors={['#f4f1ea', '#c8402a']} /></group> },
  'perseverance-depot/3': { set: 'mars', cam: [5.2, 2.0, 6.2], look: [0, 1.0, 0], body: <>{M('perseverance', [0, 0, 0], -0.5)}{hills}</> },
  'perseverance-depot/4': { set: 'mars', cam: [1.9, 0.9, 3.6], look: [0.4, 0.5, 1.7], body: <>{M('perseverance', [0, 0, 0], 0)}{rock([0.4, 0.15, 2.4], 0.3, '#8f5a3c')}</> },
  'perseverance-depot/5': { set: 'mars', cam: [5.5, 2.6, 6], look: [-1, 0.2, 0], body: <>{M('perseverance', [-3, 0, -2.5], 0.7)}{[0, 1, 2, 3, 4].map((i) => <group key={i} position={[-1.5 + i * 0.8, 0, (i % 2) * 0.6]} rotation={[0, 0.4 + i * 0.3, 0]}>{M('three-forks')}</group>)}</> },
  // ── Deep space ──
  'pioneer10/2': { set: 'space', cam: [2.6, 1.5, 3.8], look: [0, 1.2, 0], body: <>{M('pioneer10', [0, -0.8, 0], 0.5)}{asteroids(2, 18, 40, 6)}</> },
  'pioneer10/3': { set: 'space', cam: [2.4, 1.4, 3.6], look: [0, 1.2, 0], body: <>{M('pioneer10', [0, -0.8, 0], 0.9)}{asteroids(5, 26, 22, 1)}</> },
  'pioneer10/4': { set: 'space', cam: [2.8, 1.4, 4], look: [0, 1.2, 0], body: <>{M('pioneer10', [0, -0.8, 0], 0.3)}<ProcPlanet kind="jupiter" radius={40} position={[22, -6, -90]} spin={0} sun={[-0.6, 0.2, 0.8]} /></> },
  'pioneer10/5': { set: 'space', cam: [1.7, 1.35, 2.4], look: [0, 1.2, 0], body: M('pioneer10', [0, -0.8, 0], 0.2) },
  'voyager2/2': { set: 'space', cam: [3, 1, 4], look: [0.2, 0.1, 0], body: <>{M('voyager1', [0, -0.6, 0], 0.5)}<Earth radius={3} position={[-14, -3, -30]} spin={0} sunDir={[1, 0.3, 0.6]} /></> },
  'voyager2/4': { set: 'space', cam: [3, 1, 4], look: [0.2, 0.1, 0], body: <>{M('voyager1', [0, -0.6, 0], 0.9)}<ProcPlanet kind="neptune" radius={30} position={[-40, -6, -110]} spin={0} sun={[0.6, 0.2, 0.8]} /><ProcPlanet kind="uranus" radius={14} position={[70, 30, -200]} spin={0} sun={[0.6, 0.2, 0.8]} /></> },
  'voyager1/2': { set: 'space', cam: [1.8, 0.8, 2.4], look: [0.3, 0.0, 0], body: M('voyager1', [0, -0.6, 0], 0.2) },
  'new-horizons/2': { set: 'space', cam: [5, 1.6, 6.5], look: [-0.3, 0.9, 0], body: <>{M('new-horizons', [0, 0, 0], 0.6)}<Earth radius={7} position={[-24, -7, -40]} spin={0} sunDir={[1, 0.3, 0.6]} /></> },
  'new-horizons/6': { set: 'space', cam: [5.2, 1.6, 6.8], look: [1.2, 0.8, -3], body: <>{M('new-horizons', [0, 0, 0], -0.4)}<Arrokoth position={[5, 1, -12]} /></> },
};

/** Simplified lander base with three open petals (as in the story's Pathfinder scene). */
function Petals() {
  const tri = new THREE.Shape(); tri.moveTo(-0.9, 0); tri.lineTo(0.9, 0); tri.lineTo(0, 1.5); tri.closePath();
  return (
    <group position={[0, 0.06, 0]} scale={0.6}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, (i / 3) * Math.PI * 2]} position={[0, 0.01 * i, 0]}><shapeGeometry args={[tri]} /><meshStandardMaterial color="#b9b5ac" metalness={0.4} roughness={0.55} side={THREE.DoubleSide} /></mesh>
      ))}
    </group>
  );
}

/** Arrokoth: two flattened reddish lobes touching (a "snowman"), as NASA's New Horizons pictures show. */
function Arrokoth(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props} rotation={[0.3, 0.5, 0.9]}>
      <mesh position={[-1.1, 0, 0]} scale={[1.4, 1.2, 0.8]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color="#9a5a3e" roughness={1} /></mesh>
      <mesh position={[1.0, 0, 0]} scale={[1.0, 0.95, 0.75]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color="#a2623f" roughness={1} /></mesh>
    </group>
  );
}

function SetPiece({ set }: { set: Set }) {
  if (set === 'space') return (
    <>
      <color attach="background" args={['#02030a']} />
      <Stars count={4000} />
      <directionalLight position={[-8, 5, 6]} intensity={3.2} color="#fff4e0" />
      <ambientLight intensity={0.25} />
    </>
  );
  if (set === 'mars' || set === 'mars-dusty') {
    const dusty = set === 'mars-dusty';
    return (
      <>
        <SkyDome top={dusty ? '#b48a64' : '#c99a6b'} bottom={dusty ? '#d9b08a' : '#ebc296'} sunDir={[0.5, 0.6, -0.4]} sunColor="#fff2d6" sun={dusty ? 0.25 : 0.5} />
        <fog attach="fog" args={[dusty ? '#d9b08a' : '#ebc296', dusty ? 20 : 40, dusty ? 140 : 260]} />
        <directionalLight position={[30, 40, 20]} intensity={dusty ? 2.2 : 3} color="#FFF1D6" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.0005} />
        <directionalLight position={[-20, 10, -30]} intensity={0.8} color="#7FB2FF" />
        <hemisphereLight args={['#f0c9a4', '#a5532d', 0.65]} />
        <Ground world="mars" seed={7} />
        <Rocks count={160} seed={7} color="#6e3420" />
      </>
    );
  }
  return (
    <>
      <color attach="background" args={['#000000']} />
      <Stars count={3000} />
      <directionalLight position={[30, 42, 24]} intensity={3.4} color="#FFF1D6" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0005} />
      <directionalLight position={[-20, 12, -30]} intensity={1.2} color="#7FB2FF" />
      <hemisphereLight args={['#c9d6ff', '#58606e', 0.45]} />
      <Ground world="moon" seed={4} crater={set === 'moon-crater'} />
      <Rocks count={140} color="#77797d" seed={11} />
    </>
  );
}

/** Tells the save script when every model has loaded and a few frames have been drawn. */
function Ready({ id }: { id: string }) {
  const { active, progress } = useProgress();
  const n = useRef(0);
  useFrame(() => {
    // replicas load no files (progress stays 0), so "nothing loading" is enough
    if (active || (progress > 0 && progress < 100)) { n.current = 0; return; }
    if (++n.current === 45) (window as any).__frameReady = id;
  });
  return null;
}

function Cam({ cam, look }: { cam: V3; look: V3 }) {
  useFrame(({ camera }) => { camera.position.set(...cam); camera.lookAt(...look); });
  return null;
}

export default function FrameStudio() {
  const [params] = useSearchParams();
  const id = params.get('f') || 'surveyor3/2';
  const f = FRAMES[id];
  useEffect(() => { (window as any).__frameReady = null; (window as any).__frameIds = Object.keys(FRAMES); }, [id]);
  if (!f) return <p style={{ color: '#fff', padding: 20 }}>Unknown frame "{id}". Frames: {Object.keys(FRAMES).join(', ')}</p>;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <Canvas key={id} shadows dpr={[1, 2]} camera={{ fov: f.fov ?? 40, near: 0.05, far: 2000, position: f.cam }}
        gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
        <Suspense fallback={null}>
          <SetPiece set={f.set} />
          {f.body}
        </Suspense>
        <Cam cam={f.cam} look={f.look} />
        <Ready id={id} />
      </Canvas>
    </div>
  );
}
