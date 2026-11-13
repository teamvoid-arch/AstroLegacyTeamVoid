import * as THREE from 'three';
import { useMemo, type ReactNode } from 'react';

/*
  TEAM VOID REPLICAS (not official NASA models).
  NASA 3D Resources has no model of these seven machines, so the story scenes would be empty.
  These replicas are built in code from NASA photos and NASA's published sizes, in real metres,
  base on the ground (y = 0). They are labelled "Replica by Team VOID" wherever they are named.

  Sizes used (NASA / NSSDCA figures):
  - Ranger 7 (Block III): 3.6 m tall, 1.5 m hexagonal base, solar panels 4.6 m tip to tip, dish antenna.
  - Surveyor 1 & 3: about 3 m tall, tripod with three landing legs (~4.3 m across), solar panel and
    planar antenna on a mast, TV camera with mirror hood, two white thermal boxes. Surveyor 3 adds its scoop.
  - Apollo 11 laser reflector: 46 cm panel of 100 fused-silica corner cubes (3.8 cm), tilted toward Earth.
  - Apollo 15 Lunar Roving Vehicle: 3.1 m long, 1.14 m tall, 2.3 m wheelbase, 1.83 m track,
    wire-mesh wheels 82 cm across with chevron treads, umbrella high-gain antenna, two seats.
  - Sojourner: 65 x 48 x 30 cm, six 13 cm wheels on a rocker-bogie, solar panel on top, whip antenna.
  - Perseverance landing leftovers: 4.5 m back shell (cone) and the 21.5 m red-and-white parachute.
*/

const M = {
  alu: () => <meshStandardMaterial color="#c9ccd1" metalness={0.85} roughness={0.38} />,
  dark: () => <meshStandardMaterial color="#26272c" metalness={0.5} roughness={0.5} />,
  white: () => <meshStandardMaterial color="#ebe8e1" roughness={0.6} />,
  gold: () => <meshStandardMaterial color="#c9a14a" metalness={0.95} roughness={0.32} />,
  cells: () => <meshStandardMaterial color="#1c2b5c" metalness={0.55} roughness={0.22} />,
};

/** A straight tube between two points. */
function Tube({ a, b, r = 0.02, children }: { a: [number, number, number]; b: [number, number, number]; r?: number; children?: ReactNode }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return { pos: va.add(vb).multiplyScalar(0.5), quat: q, len: d.length() };
  }, [a.join(), b.join()]);
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, len, 8]} />
      {children ?? M.alu()}
    </mesh>
  );
}

/** A flat solar panel with a frame. w x h, facing +Y. */
function SolarPanel({ w, h, ...props }: JSX.IntrinsicElements['group'] & { w: number; h: number }) {
  return (
    <group {...props}>
      <mesh castShadow><boxGeometry args={[w, 0.03, h]} />{M.alu()}</mesh>
      <mesh position={[0, 0.017, 0]}><boxGeometry args={[w * 0.94, 0.005, h * 0.92]} />{M.cells()}</mesh>
    </group>
  );
}

// ─────────────────────────────── Ranger 7 ───────────────────────────────
export function Ranger7() {
  return (
    <group>
      {/* high-gain dish antenna, hinged below the base */}
      <group position={[0.55, 0.62, 0]} rotation={[0, 0, 0.9]}>
        <mesh castShadow><sphereGeometry args={[0.62, 32, 12, 0, Math.PI * 2, 0, 0.55]} /><meshStandardMaterial color="#d8d9dc" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
        <Tube a={[0, 0.1, 0]} b={[0, 0.55, 0]} r={0.015} />
      </group>
      {/* hexagonal bus */}
      <mesh position={[0, 1.1, 0]} castShadow><cylinderGeometry args={[0.75, 0.75, 0.4, 6]} />{M.gold()}</mesh>
      <mesh position={[0, 0.88, 0]}><cylinderGeometry args={[0.7, 0.6, 0.06, 6]} />{M.dark()}</mesh>
      {/* camera tower (six TV cameras look out near the top) */}
      <mesh position={[0, 2.1, 0]} castShadow><cylinderGeometry args={[0.3, 0.52, 1.6, 6]} /><meshStandardMaterial color="#d6d8dc" metalness={0.8} roughness={0.3} /></mesh>
      {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return (
        <mesh key={i} position={[Math.cos(a) * 0.36, 2.55, Math.sin(a) * 0.36]} rotation={[0, -a + Math.PI / 2, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />{M.dark()}</mesh>
      ); })}
      <mesh position={[0, 2.95, 0]}><cylinderGeometry args={[0.22, 0.3, 0.1, 6]} />{M.gold()}</mesh>
      {/* omni antenna on top */}
      <Tube a={[0, 3.0, 0]} b={[0, 3.45, 0]} r={0.02} />
      <mesh position={[0, 3.5, 0]}><coneGeometry args={[0.09, 0.2, 16]} />{M.alu()}</mesh>
      {/* two solar panels, 4.6 m tip to tip */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <SolarPanel w={1.54} h={0.74} position={[s * 1.53, 1.1, 0]} rotation={[0, 0, s * 0.08]} />
          <Tube a={[s * 0.7, 1.1, 0]} b={[s * 0.8, 1.1, 0]} r={0.03} />
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────── Surveyor ───────────────────────────────
export function Surveyor({ camera = true, scoop = false }: { camera?: boolean; scoop?: boolean }) {
  const corners = [0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 + Math.PI / 2; return [Math.cos(a), Math.sin(a)] as const; });
  const top: [number, number, number] = [0, 1.35, 0];
  return (
    <group>
      {/* triangular space frame */}
      {corners.map(([x, z], i) => {
        const [x2, z2] = corners[(i + 1) % 3];
        return (
          <group key={i}>
            <Tube a={[x * 0.85, 0.55, z * 0.85]} b={[x2 * 0.85, 0.55, z2 * 0.85]} r={0.025} />
            <Tube a={[x * 0.85, 0.55, z * 0.85]} b={top} r={0.022} />
            {/* landing leg, shock strut and crushable footpad */}
            <Tube a={[x * 0.85, 0.55, z * 0.85]} b={[x * 2.1, 0.12, z * 2.1]} r={0.035} />
            <Tube a={[x * 0.55, 0.95, z * 0.55]} b={[x * 1.6, 0.25, z * 1.6]} r={0.022} />
            <mesh position={[x * 2.12, 0.07, z * 2.12]} castShadow><cylinderGeometry args={[0.15, 0.17, 0.12, 20]} />{M.alu()}</mesh>
            {/* vernier engine */}
            <mesh position={[x * 0.55, 0.42, z * 0.55]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.07, 0.16, 14, 1, true]} /><meshStandardMaterial color="#3a3b40" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} /></mesh>
            {/* propellant tanks */}
            <mesh position={[x * 0.45, 0.7, z * 0.45 + 0.12]}><sphereGeometry args={[0.11, 16, 12]} />{M.alu()}</mesh>
            <mesh position={[x * 0.45 + 0.12, 0.7, z * 0.45]}><sphereGeometry args={[0.11, 16, 12]} />{M.alu()}</mesh>
          </group>
        );
      })}
      {/* white thermal compartments A and B */}
      <mesh position={[0.45, 0.85, -0.3]} rotation={[0, 0.5, 0]} castShadow><boxGeometry args={[0.5, 0.32, 0.36]} />{M.white()}</mesh>
      <mesh position={[-0.45, 0.85, -0.3]} rotation={[0, -0.5, 0]} castShadow><boxGeometry args={[0.46, 0.3, 0.34]} />{M.white()}</mesh>
      {/* mast with solar panel and planar array antenna */}
      <Tube a={[0, 0.55, 0]} b={[0, 3.0, 0]} r={0.03} />
      <SolarPanel w={0.9} h={0.95} position={[0, 2.85, -0.35]} rotation={[0.55, 0, 0]} />
      <mesh position={[0, 2.75, 0.45]} rotation={[-0.75, 0, 0]} castShadow><boxGeometry args={[0.8, 0.04, 0.8]} /><meshStandardMaterial color="#e3e1db" metalness={0.3} roughness={0.45} /></mesh>
      <Tube a={[0, 2.8, 0]} b={[0, 2.75, 0.4]} r={0.02} />
      {/* omni antennas on booms */}
      <Tube a={[0, 2.2, 0]} b={[0.7, 2.6, 0.2]} r={0.012} />
      <Tube a={[0, 2.2, 0]} b={[-0.7, 2.6, 0.2]} r={0.012} />
      {/* TV camera with its mirror hood (Apollo 12 took Surveyor 3's camera home) */}
      {camera && (
        <group position={[0.35, 0.95, 0.55]}>
          <mesh castShadow><cylinderGeometry args={[0.09, 0.1, 0.48, 18]} />{M.white()}</mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0.6, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.14, 18]} />{M.dark()}</mesh>
        </group>
      )}
      {/* Surveyor 3's surface sampler: an arm with a small scoop */}
      {scoop && (
        <group>
          <Tube a={[-0.5, 0.8, 0.5]} b={[-1.1, 0.75, 1.1]} r={0.02} />
          <Tube a={[-1.1, 0.75, 1.1]} b={[-1.4, 0.35, 1.45]} r={0.018} />
          <mesh position={[-1.45, 0.28, 1.5]} castShadow><boxGeometry args={[0.13, 0.08, 0.05]} />{M.alu()}</mesh>
        </group>
      )}
    </group>
  );
}

// ─────────────────────── Apollo 11 laser reflector ───────────────────────
export function LaserReflector() {
  const cubes = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) out.push([(i - 4.5) * 0.042, (j - 4.5) * 0.042]);
    return out;
  }, []);
  return (
    <group>
      {/* base pallet on the ground */}
      <mesh position={[0, 0.05, 0]} castShadow><boxGeometry args={[0.62, 0.1, 0.55]} />{M.alu()}</mesh>
      {/* support leg + panel tilted toward Earth */}
      {/* side brackets hold the panel tilted toward Earth */}
      {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0.22, 0.02]} rotation={[-0.75, 0, 0]}><boxGeometry args={[0.02, 0.05, 0.4]} />{M.alu()}</mesh>)}
      <group position={[0, 0.3, 0.02]} rotation={[-0.75, 0, 0]}>
        <mesh castShadow><boxGeometry args={[0.48, 0.05, 0.48]} />{M.alu()}</mesh>
        {/* 100 corner-cube reflectors */}
        {cubes.map(([x, z], i) => (
          <group key={i} position={[x, 0.027, z]}>
            <mesh><cylinderGeometry args={[0.019, 0.019, 0.006, 16]} /><meshStandardMaterial color="#8a6a2c" metalness={1} roughness={0.25} /></mesh>
            <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[0.016, 0.016, 0.004, 16]} /><meshStandardMaterial color="#1a2a3c" metalness={1} roughness={0.04} /></mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ─────────────────────── Apollo 15 Lunar Roving Vehicle ───────────────────────
// woven wire pattern for the LRV tyres (drawn once in code)
let weave: THREE.Texture | null = null;
function weaveTex() {
  if (weave) return weave;
  const n = 64, c = document.createElement('canvas'); c.width = c.height = n;
  const g = c.getContext('2d')!;
  g.strokeStyle = '#fff'; g.lineWidth = 8;
  for (let i = -n; i < n * 2; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + n, n); g.stroke(); g.beginPath(); g.moveTo(i + n, 0); g.lineTo(i, n); g.stroke(); }
  weave = new THREE.CanvasTexture(c);
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(20, 3);
  // no blurred mip levels: they would average the wires away at a distance
  weave.generateMipmaps = false; weave.minFilter = THREE.LinearFilter;
  return weave;
}

function MeshWheel(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* woven zinc-coated wire tyre: you can see through it, like the real one */}
        <mesh castShadow><cylinderGeometry args={[0.41, 0.41, 0.23, 48, 1, true]} /><meshStandardMaterial color="#a9a8a2" metalness={0.75} roughness={0.45} alphaMap={weaveTex()} alphaTest={0.4} side={THREE.DoubleSide} /></mesh>
        {/* inner bump-stop frame */}
        <mesh><cylinderGeometry args={[0.3, 0.3, 0.16, 32, 1, true]} /><meshStandardMaterial color="#6a6b6e" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
        {[-0.11, 0.11].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.41, 0.012, 6, 48]} />{M.alu()}</mesh>)}
        {/* titanium chevron treads */}
        {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return (
          <mesh key={i} position={[Math.cos(a) * 0.415, 0, Math.sin(a) * 0.415]} rotation={[0, -a, 0]}><boxGeometry args={[0.012, 0.22, 0.05]} /><meshStandardMaterial color="#b9b7b0" metalness={0.8} roughness={0.35} /></mesh>
        ); })}
        {/* hub */}
        <mesh><cylinderGeometry args={[0.12, 0.12, 0.25, 18]} />{M.alu()}</mesh>
      </group>
    </group>
  );
}

export function LunarRover() {
  const wheels: [number, number][] = [[0.915, 1.145], [-0.915, 1.145], [0.915, -1.145], [-0.915, -1.145]];
  return (
    <group>
      {/* three-part aluminium chassis */}
      <mesh position={[0, 0.48, 0]} castShadow><boxGeometry args={[1.12, 0.1, 2.3]} />{M.alu()}</mesh>
      <mesh position={[0, 0.43, 0]}><boxGeometry args={[1.0, 0.08, 2.1]} />{M.dark()}</mesh>
      {/* wheels with fenders */}
      {wheels.map(([x, z], i) => (
        <group key={i}>
          <MeshWheel position={[x, 0.41, z]} />
          <mesh position={[x, 0.56, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.47, 0.47, 0.27, 20, 1, true, 0, Math.PI]} /><meshStandardMaterial color="#8f949b" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} /></mesh>
          <Tube a={[x * 0.55, 0.48, z]} b={[x * 0.9, 0.41, z]} r={0.03} />
        </group>
      ))}
      {/* two seats */}
      {[-0.3, 0.3].map((x) => (
        <group key={x} position={[x, 0.55, -0.15]}>
          <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.48, 0.04, 0.48]} /><meshStandardMaterial color="#6f7a86" roughness={0.8} /></mesh>
          <mesh position={[0, 0.3, -0.23]} rotation={[-0.15, 0, 0]}><boxGeometry args={[0.48, 0.5, 0.04]} /><meshStandardMaterial color="#6f7a86" roughness={0.8} /></mesh>
          <Tube a={[-0.22, 0.06, -0.24]} b={[-0.22, 0.55, -0.3]} r={0.012} />
          <Tube a={[0.22, 0.06, -0.24]} b={[0.22, 0.55, -0.3]} r={0.012} />
        </group>
      ))}
      {/* T-shaped hand controller between the seats */}
      <Tube a={[0, 0.55, 0.15]} b={[0, 0.85, 0.15]} r={0.015} />
      <Tube a={[-0.08, 0.85, 0.15]} b={[0.08, 0.85, 0.15]} r={0.015} />
      {/* control and display console */}
      <Tube a={[0, 0.53, 0.5]} b={[0, 0.95, 0.55]} r={0.025} />
      <mesh position={[0, 1.02, 0.57]} rotation={[-0.4, 0, 0]} castShadow><boxGeometry args={[0.36, 0.2, 0.08]} />{M.dark()}</mesh>
      {/* umbrella high-gain antenna and helical low-gain antenna */}
      <Tube a={[0.3, 0.53, 0.95]} b={[0.3, 1.7, 0.95]} r={0.02} />
      <group position={[0.3, 1.78, 0.95]} rotation={[-0.5, 0, 0.2]}>
        <mesh castShadow><sphereGeometry args={[0.45, 24, 6, 0, Math.PI * 2, 0, 0.6]} /><meshStandardMaterial color="#dadada" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} wireframe /></mesh>
        <mesh><sphereGeometry args={[0.45, 24, 6, 0, Math.PI * 2, 0, 0.6]} /><meshStandardMaterial color="#e8e8e8" side={THREE.DoubleSide} transparent opacity={0.35} /></mesh>
      </group>
      <Tube a={[-0.3, 0.53, 0.95]} b={[-0.3, 1.5, 0.95]} r={0.03}><meshStandardMaterial color="#d9d6cf" roughness={0.5} /></Tube>
      {/* TV camera on the front mast */}
      <Tube a={[-0.05, 0.53, 1.05]} b={[-0.05, 1.25, 1.05]} r={0.02} />
      <mesh position={[-0.05, 1.32, 1.05]} castShadow><boxGeometry args={[0.16, 0.14, 0.26]} />{M.white()}</mesh>
      {/* rear tool and sample pallet */}
      <mesh position={[0, 0.72, -1.05]} castShadow><boxGeometry args={[0.9, 0.42, 0.32]} /><meshStandardMaterial color="#b7b9bd" metalness={0.5} roughness={0.5} /></mesh>
    </group>
  );
}

// ─────────────────────────────── Sojourner ───────────────────────────────
export function Sojourner() {
  const wheels: [number, number][] = [[0.24, 0.24], [-0.24, 0.24], [0.26, 0], [-0.26, 0], [0.24, -0.24], [-0.24, -0.24]];
  return (
    <group>
      {wheels.map(([x, z], i) => (
        <group key={i} position={[x, 0.065, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow><cylinderGeometry args={[0.065, 0.065, 0.07, 18]} />{M.alu()}</mesh>
          {Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * Math.PI * 2; return (
            <mesh key={k} position={[Math.cos(a) * 0.066, 0, Math.sin(a) * 0.066]} rotation={[0, -a, 0]}><boxGeometry args={[0.006, 0.07, 0.012]} />{M.alu()}</mesh>
          ); })}
        </group>
      ))}
      {/* rocker-bogie links */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Tube a={[s * 0.22, 0.2, 0.05]} b={[s * 0.24, 0.07, 0.24]} r={0.008} />
          <Tube a={[s * 0.22, 0.2, 0.05]} b={[s * 0.25, 0.14, -0.12]} r={0.008} />
          <Tube a={[s * 0.25, 0.14, -0.12]} b={[s * 0.26, 0.07, 0]} r={0.008} />
          <Tube a={[s * 0.25, 0.14, -0.12]} b={[s * 0.24, 0.07, -0.24]} r={0.008} />
        </group>
      ))}
      {/* warm electronics box and solar panel */}
      <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.38, 0.1, 0.42]} />{M.gold()}</mesh>
      <SolarPanel w={0.46} h={0.6} position={[0, 0.27, -0.02]} />
      {/* front stereo cameras + laser stripers, rear APXS, whip antenna */}
      <mesh position={[0.06, 0.2, 0.23]}><boxGeometry args={[0.04, 0.03, 0.03]} />{M.dark()}</mesh>
      <mesh position={[-0.06, 0.2, 0.23]}><boxGeometry args={[0.04, 0.03, 0.03]} />{M.dark()}</mesh>
      <Tube a={[0, 0.18, -0.24]} b={[0, 0.1, -0.33]} r={0.01} />
      <mesh position={[0, 0.08, -0.35]}><cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />{M.alu()}</mesh>
      <Tube a={[0.15, 0.29, -0.2]} b={[0.15, 0.6, -0.2]} r={0.004} />
    </group>
  );
}

// ─────────────────────── Perseverance landing leftovers ───────────────────────
function crumple(g: THREE.BufferGeometry, amount: number, seed: number) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = Math.sin(x * 1.7 + seed) * Math.cos(z * 1.3 - seed) + Math.sin((x + z) * 3.1 + seed * 2) * 0.5;
    p.setY(i, y + n * amount);
  }
  g.computeVertexNormals();
  return g;
}

export function LandingLeftovers() {
  const shell = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.95, 2.25, 1.7, 48, 6, false);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {     // dented on one side from the crash
      const x = p.getX(i), y = p.getY(i);
      if (x > 0.8) { p.setX(i, x - (x - 0.8) * 0.35 * (1 - y / 1.7)); p.setY(i, y - 0.15 * Math.sin(x * 4)); }
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const chute = useMemo(() => {
    // the 21.5 m parachute lying flattened and wrinkled; red and white gores
    const g = crumple(new THREE.RingGeometry(0.5, 9.5, 160, 28).rotateX(-Math.PI / 2), 0.12, 2);
    // red/white gores in three rings (a simple pattern; not NASA's actual coded pattern)
    const p = g.attributes.position, col = new Float32Array(p.count * 3);
    const red = new THREE.Color('#c63a26'), white = new THREE.Color('#efebe2');
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z);
      const gore = Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 80);
      const ring = r < 3.2 ? 0 : r < 6.4 ? 1 : 2;
      const c = (gore + ring * 3) % 4 === 0 || (ring === 2 && gore % 7 === 0) ? red : white;
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.deleteAttribute('uv');
    g.computeVertexNormals();
    // squash it a bit so it lies like fabric that fell, not a perfect disc
    g.scale(1, 1, 0.72);
    return g;
  }, []);
  const lines = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI - Math.PI / 2; pts.push(1.2, 0.6, 0, 11 + Math.cos(a) * 6, 0.05, -4 + Math.sin(a) * 4.5); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g;
  }, []);
  return (
    <group>
      {/* back shell, tipped over in the sand */}
      <group position={[0, 1.15, 0]} rotation={[0.2, 0.4, 1.05]}>
        <mesh geometry={shell} castShadow><meshStandardMaterial color="#d8d0c0" roughness={0.75} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.7, 0.95, 0.22, 32]} /><meshStandardMaterial color="#b9b2a4" roughness={0.7} /></mesh>
      </group>
      {/* parachute spread out behind it */}
      <mesh geometry={chute} position={[11, 0.1, -4]} rotation={[0, 0.3, 0]} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={lines}><lineBasicMaterial color="#d8d0c0" transparent opacity={0.6} /></lineSegments>
    </group>
  );
}

/** Replica id → component. Machine.tsx uses this when NASA has no 3D model. */
export const REPLICAS: Record<string, (p: { noCamera?: boolean }) => JSX.Element> = {
  'ranger7-replica': () => <Ranger7 />,
  'surveyor1-replica': (p) => <Surveyor camera={!p.noCamera} />,
  'surveyor3-replica': (p) => <Surveyor camera={!p.noCamera} scoop />,
  'lrrr-replica': () => <LaserReflector />,
  'lrv-replica': () => <LunarRover />,
  'sojourner-replica': () => <Sojourner />,
  'leftovers-replica': () => <LandingLeftovers />,
};
