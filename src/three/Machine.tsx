import * as THREE from 'three';
import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react';
import { createPortal, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { machineById } from '../data/machines';
import { machineSpeech } from './speechAnchor';
import { REPLICAS } from './replicas';

/*
  NASA models are used exactly as delivered: we only scale them to metres, rotate
  them upright, and place them on the ground (Build Spec rule 2). The Lunar Module's
  ascent stage is moved as one group of existing meshes for the "split" moment.
*/

export const NASA_MODELS: Record<string, { url: string; size: number; rot?: [number, number, number] }> = {
  'lunar-module': { url: 'assets/models/lunar-module.glb', size: 9.4 },
  viking: { url: 'assets/models/viking.glb', size: 3.0 },
  perseverance: { url: 'assets/models/perseverance.glb', size: 3.0 },
  ingenuity: { url: 'assets/models/ingenuity.glb', size: 1.2 },
  opportunity: { url: 'assets/models/opportunity.glb', size: 2.3 },
  lro: { url: 'assets/models/lro.glb', size: 4.5 },
  voyager: { url: 'assets/models/voyager.glb', size: 4.0 },
  pioneer10: { url: 'assets/models/pioneer10.glb', size: 3.0 },
  insight: { url: 'assets/models/insight.glb', size: 6.0 },
  curiosity: { url: 'assets/models/curiosity.glb', size: 3.0 },
  astronaut: { url: 'assets/models/astronaut.glb', size: 1.9 },
  ladee: { url: 'assets/models/ladee.glb', size: 2.4 },
  mgs: { url: 'assets/models/mgs.glb', size: 4.0 },
  odyssey: { url: 'assets/models/odyssey.glb', size: 4.0 },
  mro: { url: 'assets/models/mro.glb', size: 6.0 },
  maven: { url: 'assets/models/maven.glb', size: 5.0 },
  ulysses: { url: 'assets/models/ulysses.glb', size: 3.5 },
  near: { url: 'assets/models/near.glb', size: 3.0 },
  ds1: { url: 'assets/models/ds1.glb', size: 3.0 },
  stardust: { url: 'assets/models/stardust.glb', size: 3.0 },
  spitzer: { url: 'assets/models/spitzer.glb', size: 4.0 },
  messenger: { url: 'assets/models/messenger.glb', size: 3.0 },
  'deep-impact': { url: 'assets/models/deep-impact.glb', size: 3.5 },
  dawn: { url: 'assets/models/dawn.glb', size: 6.0 },
  kepler: { url: 'assets/models/kepler.glb', size: 4.5 },
  'new-horizons': { url: 'assets/models/new-horizons.glb', size: 2.7 },
  dart: { url: 'assets/models/dart.glb', size: 9.0 },
  marco: { url: 'assets/models/marco.glb', size: 1.6 },
  // NASA SLS Block 1 3D-print model (print base plate removed, painted in SLS colours); about 98 m tall
  sls: { url: 'assets/models/sls.glb', size: 98 },
  'sample-tube': { url: 'assets/models/sample-tube.glb', size: 0.6, rot: [Math.PI / 2, 0, 0] },
};

const DUST = new THREE.Color('#b0703f');

const DRACO = './draco/';
const ROTOR_AXIS = new THREE.Vector3(1, 0, 0);

export function NasaModel({ id, ascent = 0, rotors = 0, dust = 0, ascentFx, ...props }: Omit<JSX.IntrinsicElements['group'], 'id'> & { id: string; ascent?: number; rotors?: number; dust?: number; ascentFx?: ReactNode }) {
  const cfg = NASA_MODELS[id];
  const { scene } = useGLTF(cfg.url, DRACO);
  const ascentGroup = useRef<THREE.Group | null>(null);
  const splitY = useRef(0);
  const rotorNodes = useRef<THREE.Object3D[]>([]);
  // Dust is a material tint only (own copies of the materials, so other scenes stay clean).
  const dusty = useRef<{ m: THREE.MeshStandardMaterial; c: THREE.Color }[]>([]);
  const lastDust = useRef(-1);
  const root = useMemo(() => {
    const s = scene.clone(true);
    if (cfg.rot) s.rotation.set(...cfg.rot);
    s.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const scale = cfg.size / Math.max(size.x, size.y, size.z);
    const centre = box.getCenter(new THREE.Vector3());
    const wrap = new THREE.Group();
    s.position.set(-centre.x, -box.min.y, -centre.z);
    const inner = new THREE.Group();
    inner.add(s);
    inner.scale.setScalar(scale);
    wrap.add(inner);
    rotorNodes.current = [];
    dusty.current = [];
    lastDust.current = -1;
    s.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = true;
        if (id === 'insight' && o.material && !Array.isArray(o.material) && o.material.color) {
          o.material = o.material.clone();
          dusty.current.push({ m: o.material, c: o.material.color.clone() });
        }
        if (o.material) o.material.envMapIntensity = 1.2;
      }
      if (o.name?.startsWith('rotors')) rotorNodes.current.push(o);
    });
    if (id === 'lunar-module') {
      // Move the existing upper meshes (ascent stage) into one group. No new geometry.
      wrap.updateMatrixWorld(true);
      const split = 0.47 * size.y * scale;
      const asc = new THREE.Group();
      const meshes: THREE.Object3D[] = [];
      wrap.traverse((o: any) => {
        if (!o.isMesh) return;
        const b = new THREE.Box3().setFromObject(o);
        // a part belongs to the ascent stage if its middle is above the split line
        // (parts that straddle it, like the cabin's lower skin, go up with it)
        if ((b.min.y + b.max.y) / 2 > split) meshes.push(o);
      });
      for (const m of meshes) asc.attach(m);
      wrap.add(asc);
      ascentGroup.current = asc;
      splitY.current = split;
    }
    return wrap;
  }, [scene, id]);

  useFrame((_, dt) => {
    if (dusty.current.length && Math.abs(dust - lastDust.current) > 0.005) {
      lastDust.current = dust;
      const k = Math.min(1, Math.max(0, dust));
      for (const d of dusty.current) {
        // Textures multiply by colour, so add a dust glow too: panels go dull orange-brown.
        d.m.color.copy(d.c).lerp(DUST, k * 0.8);
        if ((d.m as any).emissive) (d.m as any).emissive.copy(DUST).multiplyScalar(k * 0.35);
      }
    }
    if (rotors) rotorNodes.current.forEach((r, i) => { r.rotateOnAxis(ROTOR_AXIS, (i ? -1 : 1) * rotors * dt); });
    if (ascentGroup.current) {
      const a = Math.max(0, ascent);
      ascentGroup.current.position.y = a * a * 40;
      ascentGroup.current.visible = a < 0.98;
    }
  });

  return (
    <>
      <primitive object={root} {...props} />
      {/* explanation effects that ride on the Lunar Module's ascent stage (e.g. its engine flame) */}
      {ascentFx && ascentGroup.current && createPortal(<group position={[0, splitY.current, 0]}>{ascentFx}</group>, ascentGroup.current)}
    </>
  );
}

export function Machine({ id, t = 0, ...props }: Omit<JSX.IntrinsicElements['group'], 'id'> & { id: string; t?: number; ascent?: number; rotors?: number; noCamera?: boolean; unfold?: number; dust?: number; mast?: number; ascentFx?: ReactNode }) {
  const m = machineById[id];
  const model = m?.model;
  const { ascent, rotors, dust, noCamera, unfold, mast, ascentFx, ...groupProps } = props as any;
  void noCamera; void unfold; void mast;
  return (
    <SpeechProbe id={id} {...groupProps}>
      {model && NASA_MODELS[model] ? (
        <SafeModel>
          <Suspense fallback={<Placeholder />}>
            <NasaModel id={model} ascent={ascent} rotors={rotors} dust={dust} ascentFx={ascentFx} />
          </Suspense>
        </SafeModel>
      ) : model && REPLICAS[model] ? (
        // NASA has no 3D model of this machine: a labelled Team VOID replica built from NASA photos and sizes
        REPLICAS[model]({ noCamera })
      ) : null}
    </SpeechProbe>
  );
}

/** A model that fails to load is skipped, never taking the whole scene down. */
class SafeModel extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: unknown) { console.warn('A NASA model failed to load', e); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Reports where this machine is on screen while it is the one talking (for its speech bubble). */
function SpeechProbe({ id, children, ...props }: Omit<JSX.IntrinsicElements['group'], 'id'> & { id: string }) {
  const g = useRef<THREE.Group>(null!);
  const box = useMemo(() => new THREE.Box3(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const frame = useRef(0);
  useFrame(({ camera, gl }) => {
    if (machineSpeech.id !== id || !g.current) return;
    if (frame.current++ % 3) return;
    box.setFromObject(g.current);
    if (box.isEmpty()) return;
    const rect = gl.domElement.getBoundingClientRect();
    v.set((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2).project(camera);
    if (v.z > 1 || Math.abs(v.x) > 1.1 || v.y > 1.2 || v.y < -1.1) return;   // behind the camera or off screen
    const top = { x: rect.left + (v.x + 1) / 2 * rect.width, y: rect.top + (1 - v.y) / 2 * rect.height };
    v.set((box.min.x + box.max.x) / 2, box.min.y, (box.min.z + box.max.z) / 2).project(camera);
    const bottomY = rect.top + (1 - v.y) / 2 * rect.height;
    machineSpeech.anchor = { x: top.x, y: top.y, r: Math.abs(bottomY - top.y) / 2, t: performance.now() };
  });
  return <group ref={g} {...props}>{children}</group>;
}

function Placeholder() {
  const r = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = clock.elapsedTime; });
  return (
    <mesh ref={r} position={[0, 1, 0]}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#FFC94D" wireframe />
    </mesh>
  );
}

export function preloadModel(id: string) {
  const cfg = NASA_MODELS[id];
  if (cfg) useGLTF.preload(cfg.url, DRACO);
}
