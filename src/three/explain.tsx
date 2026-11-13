import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';

/*
  EXPLANATORY 3D (not NASA models): effects and simplified props that help explain what
  happened, e.g. rocket exhaust, smoke, a parachute opening, an entry capsule glowing hot,
  the "sky crane" lowering a rover, airbags bouncing. Real machines always use exact NASA
  models (see Machine.tsx); everything in this file is labelled "explanation" in the docs.
*/

// ── soft round puff texture (made once, in code) ──
let puffTex: THREE.Texture | null = null;
function puff() {
  if (puffTex) return puffTex;
  const n = 128, c = document.createElement('canvas');
  c.width = c.height = n;
  const g = c.getContext('2d')!;
  // a few overlapping soft blobs make a cauliflower-like cloud, not a perfect disc
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2, r = i ? n * 0.17 : 0;
    const x = n / 2 + Math.cos(a) * r, y = n / 2 + Math.sin(a) * r, rad = n * (i ? 0.26 : 0.4);
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, n, n);
  }
  puffTex = new THREE.CanvasTexture(c);
  return puffTex;
}

const rand = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/**
 * Billowing smoke/steam/dust: camera-facing puffs that shoot out along the ground, grow and rise.
 * Runs fully on the GPU (one draw call). `amount` 0..1 fades the whole cloud in/out.
 */
export function Smoke({ count = 160, spread = 40, rise = 30, size = 9, life = 7, color = '#e9e4dc', glow = '#ffb066', glowAmount = 0, amount = 1, upward = 0, ...props }:
  JSX.IntrinsicElements['group'] & { count?: number; spread?: number; rise?: number; size?: number; life?: number; color?: string; glow?: string; glowAmount?: number; amount?: number; upward?: number }) {
  const lite = useStore((s) => s.settings.lite);
  const n = lite ? Math.ceil(count * 0.45) : count;
  const geo = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index; g.attributes.position = base.attributes.position; g.attributes.uv = base.attributes.uv;
    const seeds = new Float32Array(n * 4);
    for (let i = 0; i < n * 4; i++) seeds[i] = rand(i + 1);
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
    g.instanceCount = n;
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
    return g;
  }, [n]);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uTime: { value: 0 }, uAmount: { value: amount }, uMap: { value: puff() },
      uColor: { value: new THREE.Color(color) }, uGlow: { value: new THREE.Color(glow) }, uGlowAmt: { value: glowAmount },
      uSpread: { value: spread }, uRise: { value: rise }, uSize: { value: size }, uLife: { value: life }, uUp: { value: upward },
    },
    vertexShader: /* glsl */`
      attribute vec4 aSeed;
      uniform float uTime, uSpread, uRise, uSize, uLife, uUp;
      varying vec2 vUv; varying float vAge; varying float vShade;
      void main() {
        float life = uLife * (0.7 + 0.6 * aSeed.x);
        float age = fract(uTime / life + aSeed.y);
        float ang = aSeed.z * 6.2831853;
        vec3 dir = normalize(vec3(cos(ang), uUp * (0.6 + aSeed.w), sin(ang)));
        float d = uSpread * (1.0 - exp(-age * 3.2)) * (0.35 + 0.65 * aSeed.w);
        vec3 c = dir * d + vec3(0.0, uRise * age * age * (0.5 + aSeed.x) + uSize * 0.25, 0.0);
        float s = uSize * (0.3 + 1.7 * sqrt(age)) * (0.7 + 0.6 * aSeed.w);
        float rot = aSeed.y * 6.2831853 + age * (aSeed.x - 0.5) * 1.5;
        vec2 p = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * position.xy;
        vec4 mv = modelViewMatrix * vec4(c, 1.0);
        mv.xy += p * s;
        gl_Position = projectionMatrix * mv;
        vUv = uv; vAge = age; vShade = 0.72 + 0.4 * position.y + 0.1 * aSeed.x;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform vec3 uColor, uGlow; uniform float uGlowAmt, uAmount;
      varying vec2 vUv; varying float vAge; varying float vShade;
      void main() {
        float a = texture2D(uMap, vUv).a;
        float fade = smoothstep(0.0, 0.06, vAge) * (1.0 - smoothstep(0.5, 1.0, vAge));
        vec3 col = uColor * vShade;
        col = mix(col, uGlow * 1.6, uGlowAmt * (1.0 - smoothstep(0.0, 0.35, vAge)) * (1.0 - vUv.y * 0.5));
        gl_FragColor = vec4(col, a * fade * uAmount);
        #include <colorspace_fragment>
      }`,
  }), []); // uniforms are updated below
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useFrame((_, dt) => {
    const u = mat.uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uAmount.value = amount; u.uGlowAmt.value = glowAmount;
    u.uSpread.value = spread; u.uRise.value = rise; u.uSize.value = size; u.uLife.value = life; u.uUp.value = upward;
    u.uColor.value.set(color); u.uGlow.value.set(glow);
  });
  return <group {...props}><mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={2} /></group>;
}

/**
 * Rocket exhaust: two nested glowing cones (hot white-yellow core, orange outer flame) with
 * flicker and shock diamonds. Points down (-Y) from the nozzle at the group origin.
 */
export function Plume({ length = 6, radius = 0.6, power = 1, color = '#ffb35c', core = '#fff4d6', diamonds = true, ...props }:
  JSX.IntrinsicElements['group'] & { length?: number; radius?: number; power?: number; color?: string; core?: string; diamonds?: boolean }) {
  const mk = (inner: boolean) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
    uniforms: { uTime: { value: 0 }, uPower: { value: power }, uColor: { value: new THREE.Color(inner ? core : color) }, uDiamonds: { value: diamonds && inner ? 1 : 0 }, uInner: { value: inner ? 1 : 0 } },
    vertexShader: /* glsl */`
      varying vec2 vUv; varying float vFacing;
      void main() {
        vUv = uv;
        vec3 n = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vFacing = abs(dot(n, normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uPower, uDiamonds, uInner; uniform vec3 uColor;
      varying vec2 vUv; varying float vFacing;
      void main() {
        float along = 1.0 - vUv.y;                       // 0 at the nozzle, 1 at the tip
        float flick = 0.85 + 0.15 * sin(uTime * 53.0 + along * 21.0) * sin(uTime * 31.0 - along * 13.0);
        float body = pow(vFacing, uInner > 0.5 ? 2.2 : 1.3);
        float fall = pow(1.0 - along, uInner > 0.5 ? 1.6 : 0.9);
        float shock = uDiamonds * pow(0.5 + 0.5 * cos(along * 46.0 - uTime * 2.0), 10.0) * (1.0 - along) * 0.9;
        float a = (body * fall + shock) * flick * uPower;
        vec3 col = mix(uColor, vec3(1.0, 0.45, 0.15), along * (1.0 - uInner) * 0.8);
        gl_FragColor = vec4(col * a * (uInner > 0.5 ? 2.2 : 1.4), a);
      }`,
  });
  const outer = useMemo(() => mk(false), []);
  const inner = useMemo(() => mk(true), []);
  const geoO = useMemo(() => { const g = new THREE.CylinderGeometry(radius * 1.1, radius * 2.4, length, 24, 1, true); g.translate(0, -length / 2, 0); return g; }, [length, radius]);
  const geoI = useMemo(() => { const g = new THREE.CylinderGeometry(radius * 0.75, radius * 0.9, length * 0.62, 20, 1, true); g.translate(0, -length * 0.31, 0); return g; }, [length, radius]);
  useEffect(() => () => { outer.dispose(); inner.dispose(); }, [outer, inner]);
  useEffect(() => () => { geoO.dispose(); geoI.dispose(); }, [geoO, geoI]);
  useFrame(({ clock }) => {
    for (const m of [outer, inner]) { m.uniforms.uTime.value = clock.elapsedTime; m.uniforms.uPower.value = power; }
  });
  return (
    <group {...props} visible={power > 0.01 && props.visible !== false}>
      <mesh geometry={geoO} material={outer} renderOrder={3} />
      <mesh geometry={geoI} material={inner} renderOrder={4} />
    </group>
  );
}

/**
 * A parachute (disc-gap-band shape) with its suspension lines meeting at the group origin.
 * `open` 0..1 inflates it; it breathes a little while open. Stripes alternate two colours.
 */
export function Parachute({ radius = 6, height = 10, open = 1, colors = ['#f4f1ea', '#e0602a'] as [string, string], gores = 16, ...props }:
  JSX.IntrinsicElements['group'] & { radius?: number; height?: number; open?: number; colors?: [string, string]; gores?: number }) {
  const canopy = useRef<THREE.Group>(null!);
  const { disc, band, lines } = useMemo(() => {
    const paint = (g: THREE.BufferGeometry, segs: number) => {
      const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
      const a = new THREE.Color(colors[0]), b = new THREE.Color(colors[1]);
      for (let i = 0; i < pos.count; i++) {
        const ang = Math.atan2(pos.getZ(i), pos.getX(i)) + Math.PI;
        const c = Math.floor((ang / (Math.PI * 2)) * segs) % 2 ? b : a;
        col.set([c.r, c.g, c.b], i * 3);
      }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    };
    // disc: a shallow dome
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) { const k = i / 12; pts.push(new THREE.Vector2(radius * Math.sin(k * Math.PI * 0.42) / Math.sin(Math.PI * 0.42) * 0.82, radius * 0.38 * Math.cos(k * Math.PI * 0.5))); }
    const disc = new THREE.LatheGeometry(pts, gores * 4); paint(disc, gores);
    // band below the gap
    const band = new THREE.CylinderGeometry(radius * 0.9, radius * 0.93, radius * 0.22, gores * 4, 1, true); paint(band, gores);
    // lines from the canopy rim to the riser point (group origin)
    const lp: number[] = [];
    for (let i = 0; i < gores; i++) {
      const a = (i / gores) * Math.PI * 2;
      lp.push(Math.cos(a) * radius * 0.9, height - radius * 0.11 - radius * 0.06, Math.sin(a) * radius * 0.9, 0, 0, 0);
    }
    const lines = new THREE.BufferGeometry(); lines.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    return { disc, band, lines };
  }, [radius, height, gores, colors[0], colors[1]]);
  useEffect(() => () => { disc.dispose(); band.dispose(); lines.dispose(); }, [disc, band, lines]);
  useFrame(({ clock }) => {
    if (!canopy.current) return;
    const o = Math.max(0.02, open);
    const breathe = 1 + Math.sin(clock.elapsedTime * 2.6) * 0.03 * o;
    canopy.current.scale.set(o * breathe, 0.3 + 0.7 * o, o * breathe);
    canopy.current.rotation.y = clock.elapsedTime * 0.15;
  });
  return (
    <group {...props} visible={open > 0.01 && props.visible !== false}>
      <group ref={canopy} position={[0, height, 0]}>
        <mesh geometry={disc} castShadow><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.85} /></mesh>
        <mesh geometry={band} position={[0, -radius * 0.17, 0]}><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.85} /></mesh>
      </group>
      <lineSegments geometry={lines} scale={[Math.max(0.02, open), 1, Math.max(0.02, open)]}><lineBasicMaterial color="#d8d2c4" transparent opacity={0.7} /></lineSegments>
    </group>
  );
}

/** Entry capsule (simplified aeroshell: heat shield + back shell) with a glowing plasma sheath. `heat` 0..1. */
export function EntryCapsule({ size = 2.2, heat = 1, ...props }: JSX.IntrinsicElements['group'] & { size?: number; heat?: number }) {
  const sheath = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const f = 0.9 + Math.sin(clock.elapsedTime * 40) * 0.1;
    if (sheath.current) (sheath.current.material as THREE.MeshBasicMaterial).opacity = heat * 0.85 * f;
  });
  const hot = new THREE.Color('#ffd27a').lerp(new THREE.Color('#ff6a2a'), 1 - heat);
  return (
    <group {...props}>
      {/* heat shield (front, facing the direction of travel = -Y) */}
      <mesh position={[0, -size * 0.12, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[size, size * 0.32, 48]} /><meshStandardMaterial color="#5a3a26" roughness={0.9} emissive={hot} emissiveIntensity={heat * 1.6} />
      </mesh>
      {/* back shell */}
      <mesh position={[0, size * 0.42, 0]} castShadow>
        <cylinderGeometry args={[size * 0.42, size * 0.98, size * 0.72, 48]} /><meshStandardMaterial color="#e8e6df" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, size * 0.86, 0]}><cylinderGeometry args={[size * 0.3, size * 0.42, size * 0.16, 32]} /><meshStandardMaterial color="#cfccc4" roughness={0.6} /></mesh>
      {/* plasma sheath in front + hot trail behind */}
      <mesh ref={sheath} position={[0, -size * 0.25, 0]} scale={[1.25, 0.55, 1.25]}>
        <sphereGeometry args={[size, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshBasicMaterial color={hot} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {/* the glowing wake streams out behind the capsule and widens */}
      <Plume rotation={[Math.PI, 0, 0]} position={[0, size * 0.5, 0]} length={size * 10} radius={size * 0.6} power={heat * 1.1} color="#ff7a2a" core="#ffd9a0" diamonds={false} />
      {heat > 0.05 && <pointLight color={hot} intensity={heat * 400} distance={size * 30} />}
    </group>
  );
}

/** Simplified rocket "sky crane" (explanation): a descent-stage frame with eight down-firing thrusters. */
export function SkyCrane({ power = 1, ...props }: JSX.IntrinsicElements['group'] & { power?: number }) {
  const arms = [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2 + Math.PI / 4);
  return (
    <group {...props}>
      <mesh castShadow><cylinderGeometry args={[1.5, 1.6, 0.7, 8]} /><meshStandardMaterial color="#c9c4b8" roughness={0.55} metalness={0.45} /></mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[1.1, 1.4, 0.4, 8]} /><meshStandardMaterial color="#8d8a84" roughness={0.6} metalness={0.5} /></mesh>
      {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.15, 0]}><sphereGeometry args={[0.45, 20, 14]} /><meshStandardMaterial color="#e2ddd2" metalness={0.6} roughness={0.3} /></mesh>)}
      {arms.map((a, i) => (
        <group key={i} position={[Math.cos(a) * 2.1, -0.1, Math.sin(a) * 2.1]} rotation={[0, -a, 0]}>
          <mesh position={[-0.6, 0, 0]}><boxGeometry args={[1.3, 0.16, 0.22]} /><meshStandardMaterial color="#6f6c66" metalness={0.6} roughness={0.4} /></mesh>
          {[-0.25, 0.25].map((z) => (
            <group key={z} position={[0, -0.15, z]} rotation={[0, 0, 0.25]}>
              <mesh><coneGeometry args={[0.13, 0.35, 12, 1, true]} /><meshStandardMaterial color="#2b2c30" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} /></mesh>
              <Plume position={[0, -0.15, 0]} length={2.6} radius={0.09} power={power} diamonds={false} color="#ff9f5a" core="#e8f0ff" />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Three bridle ropes hanging down from the origin, one unit long (scale Y to stretch). */
export function Bridles({ spread = 0.9 }: { spread?: number }) {
  const g = useMemo(() => {
    const p: number[] = [];
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; p.push(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4, Math.cos(a) * spread, -1, Math.sin(a) * spread); }
    p.push(0, 0, 0, 0, -1, 0);   // the umbilical cable
    const b = new THREE.BufferGeometry(); b.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); return b;
  }, [spread]);
  useEffect(() => () => g.dispose(), [g]);
  return <lineSegments geometry={g}><lineBasicMaterial color="#f2efe6" /></lineSegments>;
}

/** Airbag cluster (explanation): lobed fabric balls around a hidden lander, for a bouncing landing. */
export function Airbags({ size = 1.6 }: { size?: number }) {
  const lobes = useMemo(() => {
    const out: [number, number, number][] = [];
    // four faces of a tetrahedron, six lobes each
    const faces = [[0, 1, 0], [0.94, -0.33, 0], [-0.47, -0.33, 0.82], [-0.47, -0.33, -0.82]];
    for (const f of faces) {
      const n = new THREE.Vector3(...(f as [number, number, number])).normalize();
      const t = new THREE.Vector3(0, 0, 1).cross(n); if (t.lengthSq() < 0.01) t.set(1, 0, 0); t.normalize();
      const b = n.clone().cross(t);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const p = n.clone().multiplyScalar(size * 0.75).add(t.clone().multiplyScalar(Math.cos(a) * size * 0.42)).add(b.clone().multiplyScalar(Math.sin(a) * size * 0.42));
        out.push(p.toArray() as [number, number, number]);
      }
    }
    return out;
  }, [size]);
  return (
    <group>
      {lobes.map((p, i) => (
        <mesh key={i} position={p} castShadow><sphereGeometry args={[size * 0.42, 18, 14]} /><meshStandardMaterial color="#ebe4d2" roughness={0.75} /></mesh>
      ))}
    </group>
  );
}

/** Shakes the camera a little (rotation only, so it never drifts). Put it after the scene's camera shot. */
export function CameraShake({ amount = 0 }: { amount?: number }) {
  useFrame(({ camera, clock }) => {
    if (amount <= 0 || useStore.getState().settings.reducedMotion) return;
    const t = clock.elapsedTime;
    camera.rotateX((Math.sin(t * 37) + Math.sin(t * 23.3)) * 0.0022 * amount);
    camera.rotateY((Math.sin(t * 29.7) + Math.sin(t * 41.1)) * 0.0022 * amount);
  });
  return null;
}
