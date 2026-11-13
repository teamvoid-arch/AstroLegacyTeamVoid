/*
  The lobby (team script §5): inside a satellite, styled like a NASA visitor-centre observation deck:
  dark brushed-metal wall panels with seams and rivets, cyan light strips, and three big windows in
  aluminium bezels. Through them, against deep-blue space: the Moon, Mars, and real deep-space hardware
  (NASA's own 3D models of Voyager, Pioneer 10 and New Horizons). Each window carries its name plate and
  the stamps of that world's machines. Tap a window to pick that world; the Story / Experience buttons start it.
  Phone (portrait): windows stacked; wider screens: side by side. The layout is fitted to the screen.
*/
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';
import { MoonGlobe, ProcPlanet, Stars } from '../three/world';
import { NasaModel } from '../three/Machine';
import { useStory, type WorldId } from './state';
import { appMachineId, worldMachines } from './bridge';
import { worldName } from './ui';
import { sfx } from './sfx';

const WORLDS: WorldId[] = ['moon', 'mars', 'deep'];
const TAN = Math.tan(THREE.MathUtils.degToRad(22.5));   // camera fov 45°

/** Fit three windows into the free band between VIMO's line (top) and the Story/Experience bar (bottom). */
function layout(aspect: number) {
  const portrait = aspect < 0.9;
  const z = portrait ? 9 : 7;
  const halfH = TAN * z, halfW = halfH * aspect;
  if (portrait) {
    // free band: below VIMO's line (top ~17% of the screen) and above the console (bottom ~25%)
    const top = halfH * 0.64, bottom = -halfH * 0.5;
    const gap = (top - bottom) * 0.045;
    const h = Math.min((top - bottom - gap * 2) / 3, halfW * 0.95), w = Math.min(halfW * 1.68, h * 2.2);
    const cy = (top + bottom) / 2;
    return { z, w, h, portrait, centers: [[0, cy + h + gap], [0, cy], [0, cy - h - gap]] as [number, number][] };
  }
  const gap = halfW * 0.06;
  // 1.78: leaves room for the metal frames at the screen edges
  const w = Math.min((halfW * 1.78 - gap * 2) / 3, halfH * 1.25);
  const h = Math.min(w * 0.82, halfH * 1.08);
  const cy = halfH * 0.04;
  return { z, w, h, portrait, centers: [[-(w + gap), cy], [0, cy], [w + gap, cy]] as [number, number][] };
}

function roundedRect(s: THREE.Path, x: number, y: number, w: number, h: number, r: number) {
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
}

// ── textures drawn once in code ──
let wallTex: THREE.CanvasTexture | null = null;
/** Dark brushed-metal wall panels with seams and rivets. */
function wallTexture() {
  if (wallTex) return wallTex;
  const n = 1024, c = document.createElement('canvas'); c.width = c.height = n;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, n);
  grad.addColorStop(0, '#1d2638'); grad.addColorStop(1, '#141b2a');
  g.fillStyle = grad; g.fillRect(0, 0, n, n);
  // brushed grain
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * n, x = Math.random() * n, l = 40 + Math.random() * 220;
    g.strokeStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},${0.02 + Math.random() * 0.03})`;
    g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke();
  }
  // panel seams (dark groove + light edge) and rivets
  const P = 256;
  for (let k = 0; k <= n; k += P) {
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(k - 2, 0, 3, n); g.fillRect(0, k - 2, n, 3);
    g.fillStyle = 'rgba(160,190,230,.12)'; g.fillRect(k + 1, 0, 1, n); g.fillRect(0, k + 1, n, 1);
  }
  for (let x = 0; x < n; x += P) for (let y = 0; y < n; y += P) {
    for (const [dx, dy] of [[14, 14], [P - 14, 14], [14, P - 14], [P - 14, P - 14]]) {
      g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(x + dx + 1, y + dy + 1, 3.5, 0, 7); g.fill();
      g.fillStyle = 'rgba(190,205,230,.35)'; g.beginPath(); g.arc(x + dx, y + dy, 3, 0, 7); g.fill();
    }
  }
  wallTex = new THREE.CanvasTexture(c);
  wallTex.colorSpace = THREE.SRGBColorSpace;
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.anisotropy = 4;
  return wallTex;
}

let spaceTex: THREE.CanvasTexture | null = null;
/** Deep-blue space with soft nebula glow and stars, seen through the windows. */
function spaceTexture() {
  if (spaceTex) return spaceTex;
  const W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#071433'); base.addColorStop(0.5, '#0b2a6e'); base.addColorStop(1, '#06102b');
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  const glow = (x: number, y: number, r: number, col: string) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  glow(W * 0.2, H * 0.45, 520, 'rgba(40,110,255,.45)');
  glow(W * 0.52, H * 0.55, 600, 'rgba(30,90,220,.38)');
  glow(W * 0.82, H * 0.4, 560, 'rgba(90,70,220,.35)');
  glow(W * 0.65, H * 0.2, 300, 'rgba(70,180,255,.22)');
  for (let i = 0; i < 2200; i++) {
    const s = Math.random() < 0.97 ? Math.random() * 1.2 + 0.3 : Math.random() * 2 + 1.4;
    g.fillStyle = `rgba(${200 + Math.random() * 55},${215 + Math.random() * 40},255,${0.35 + Math.random() * 0.65})`;
    g.beginPath(); g.arc(Math.random() * W, Math.random() * H, s, 0, 7); g.fill();
  }
  spaceTex = new THREE.CanvasTexture(c);
  spaceTex.colorSpace = THREE.SRGBColorSpace;
  return spaceTex;
}

/** Real deep-space hardware (NASA 3D models) slowly turning in the third window. */
function DeepHardware({ r }: { r: number }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { g.current?.children.forEach((c, i) => { c.rotation.y += dt * (0.18 + i * 0.05); }); });
  // NasaModel scales each model so its largest side is `size` metres and stands it on y = 0
  const item = (id: string, size: number, k: number, pos: [number, number, number], tilt = 0) => (
    <group position={pos} rotation={[tilt, 0, 0]}>
      <group scale={k / size} position={[0, -k * 0.35, 0]}>
        <Suspense fallback={null}><NasaModel id={id} /></Suspense>
      </group>
    </group>
  );
  return (
    <group ref={g}>
      {/* Voyager's long magnetometer boom sets its size, so it is drawn larger to show the dish and body */}
      {item('voyager', 4.0, r * 1.9, [-r * 0.5, r * 0.3, 0], 0.2)}
      {/* Pioneer 10's magnetometer boom also sets its size */}
      {item('pioneer10', 3.0, r * 1.3, [r * 0.62, r * 0.08, 0.3], 0.35)}
      {item('new-horizons', 2.7, r * 0.6, [-r * 0.1, -r * 0.62, 0.6], -0.15)}
    </group>
  );
}

export function LobbyScene() {
  const { size, camera } = useThree();
  const L = layout(size.width / size.height);
  const key = `${L.w.toFixed(2)}:${L.h.toFixed(2)}:${L.centers[0].join()}`;
  // pixels per world unit at the wall, so the name plates and stamps fit their windows on any screen
  const ppu = size.height / (2 * L.z * TAN);
  const pick = useStory((s) => s.pick);
  const setPick = useStory((s) => s.setPick);
  const stamps = useStore((s) => s.stamps);
  const lang = useStore((s) => s.lang);
  const t0 = useRef<number | null>(null);

  // the wall: one panel with three rounded window holes, given depth
  const { wall, bezel, glowLine } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-30, -20); s.lineTo(30, -20); s.lineTo(30, 20); s.lineTo(-30, 20); s.lineTo(-30, -20);
    const rad = Math.min(L.w, L.h) * 0.12;
    for (const [cx, cy] of L.centers) { const hole = new THREE.Path(); roundedRect(hole, cx - L.w / 2, cy - L.h / 2, L.w, L.h, rad); s.holes.push(hole); }
    const wall = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false, curveSegments: 10 });
    // UVs in world units so the panel texture keeps its size (one panel ≈ 1.4 units)
    const uv = wall.attributes.uv, pos = wall.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 5.6, pos.getY(i) / 5.6);
    // window bezel: a rounded ring in brushed aluminium
    const b = new THREE.Shape(); const t = Math.min(L.w, L.h) * 0.07;
    roundedRect(b, -L.w / 2 - t, -L.h / 2 - t, L.w + t * 2, L.h + t * 2, rad + t);
    const hole = new THREE.Path(); roundedRect(hole, -L.w / 2, -L.h / 2, L.w, L.h, rad); b.holes.push(hole);
    const bezel = new THREE.ExtrudeGeometry(b, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, curveSegments: 12 });
    // glow line just inside each bezel (rebuilt with the layout, so a resize never leaves an old outline)
    const p = new THREE.Path(); roundedRect(p, -L.w / 2 + 0.02, -L.h / 2 + 0.02, L.w - 0.04, L.h - 0.04, rad);
    const glowLine = new THREE.BufferGeometry().setFromPoints(p.getPoints(12).map((v) => new THREE.Vector3(v.x, v.y, 0.12)));
    return { wall, bezel, glowLine };
  }, [key]);
  useEffect(() => () => { wall.dispose(); bezel.dispose(); glowLine.dispose(); }, [wall, bezel, glowLine]);
  const tex = wallTexture();

  // gentle drift into the room, then still
  useFrame((st) => {
    if (t0.current === null) t0.current = st.clock.elapsedTime;
    const k = Math.min(1, (st.clock.elapsedTime - t0.current) / 2.2);
    const e = 1 - Math.pow(1 - k, 3);
    camera.position.set(Math.sin(st.clock.elapsedTime * 0.15) * 0.06, 0.05, L.z + (1 - e) * 3);
    camera.lookAt(0, 0.05, 0);
  });

  // objects behind the wall sit at depth d; scale their position so each one fills its window from the camera
  const behind = (cx: number, cy: number, d: number): [number, number, number] => [cx * (L.z + d) / L.z, cy * (L.z + d) / L.z, -d];
  const r = Math.min(L.w, L.h) * 0.4 * (L.z + 3) / L.z;
  const SPACE_D = 22, spaceScale = (L.z + SPACE_D) / L.z;
  const halfH = TAN * L.z, halfW = halfH * (size.width / size.height);

  return (
    <>
      <color attach="background" args={['#081a45']} />
      {/* outside: deep-blue space behind the worlds, so they read as floating in 3D space */}
      <mesh position={[0, 0, -SPACE_D]}>
        <planeGeometry args={[halfW * 2 * spaceScale * 1.15, halfH * 2 * spaceScale * 1.15]} />
        <meshBasicMaterial map={spaceTexture()} toneMapped={false} />
      </mesh>
      <Stars count={900} radius={60} />

      <ambientLight intensity={0.35} />
      {/* sunlight on the worlds outside */}
      <directionalLight position={[-6, 3, 4]} intensity={2.2} color="#fff3e2" />
      {/* soft ceiling light on the wall inside */}
      <directionalLight position={[0, 8, 10]} intensity={0.9} color="#cfe0ff" />
      <pointLight position={[0, halfH * 1.1, 2]} intensity={6} distance={18} color="#9fd4ff" />

      {/* the worlds */}
      <MoonGlobe radius={r} position={behind(L.centers[0][0], L.centers[0][1], 3)} spin={0.05} />
      <ProcPlanet kind="mars" radius={r} position={behind(L.centers[1][0], L.centers[1][1], 3)} spin={0.06} sun={[-0.6, 0.3, 0.8]} />
      <group position={behind(L.centers[2][0], L.centers[2][1], 3)}>
        <DeepHardware r={r} />
      </group>

      {/* inside: dark brushed-metal wall */}
      <mesh geometry={wall} position={[0, 0, -0.5]}>
        <meshStandardMaterial map={tex} color="#ffffff" metalness={0.55} roughness={0.42} />
      </mesh>
      {/* cyan light strips along the wall, above and below the windows */}
      {[1, -1].map((s) => {
        const ys = L.centers.map(([, y]) => y);
        const y = s > 0 ? Math.max(...ys) + L.h / 2 + L.h * 0.22 : Math.min(...ys) - L.h / 2 - L.h * 0.22;
        return (
          <mesh key={s} position={[0, y, 0.02]}>
            <planeGeometry args={[halfW * 2.4, 0.035]} />
            <meshBasicMaterial color="#5fd0ff" toneMapped={false} transparent opacity={0.85} />
          </mesh>
        );
      })}

      {WORLDS.map((w, i) => {
        const [cx, cy] = L.centers[i];
        const on = pick === w;
        const ms = worldMachines(w);
        return (
          <group key={w} position={[cx, cy, 0]}>
            {/* aluminium bezel */}
            <mesh geometry={bezel} position={[0, 0, -0.04]}>
              <meshStandardMaterial color={on ? '#d8b25a' : '#9aa6b8'} metalness={0.9} roughness={0.28} />
            </mesh>
            {/* glow line inside the bezel: cyan, gold when picked */}
            <lineLoop geometry={glowLine}>
              <lineBasicMaterial color={on ? '#FFC94D' : '#7fd6ff'} toneMapped={false} />
            </lineLoop>
            {/* the glass: tap target with a faint reflection */}
            <mesh position={[0, 0, 0.02]} onClick={(e) => { e.stopPropagation(); setPick(w); sfx('tap'); }}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
              <planeGeometry args={[L.w, L.h]} />
              <meshPhysicalMaterial color="#bfe6ff" transparent opacity={on ? 0.03 : 0.07} roughness={0.05} metalness={0} />
            </mesh>
            <Html position={[0, 0, 0.15]} center zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
              <div className={`sl-window ${on ? 'on' : ''}`} style={{ width: `${Math.round(L.w * ppu)}px`, height: `${Math.round(L.h * ppu)}px` }}>
                <div className="sl-window-name">{worldName(w, lang)}</div>
                {/* phones: a short count, so the stamps don't cover the world */}
                {L.portrait ? (
                  <div className="sl-window-count">★ {ms.filter((m) => stamps.includes(appMachineId(m.id))).length} / {ms.length} {lang === 'bn' ? 'স্ট্যাম্প' : 'stamps'}</div>
                ) : <div className="sl-window-stamps">
                  {ms.map((m) => {
                    const got = stamps.includes(appMachineId(m.id));
                    return <span key={m.id} className={`sl-mini-stamp ${got ? 'got' : ''}`} title={`${m.name} (${m.year})`}>{got ? '★ ' : ''}{m.name.replace(/^Apollo (\d+) /, 'A$1 ').replace(/ \+ .*$/, '')}</span>;
                  })}
                </div>}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}
