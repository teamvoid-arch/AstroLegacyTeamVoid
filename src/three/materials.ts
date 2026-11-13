import * as THREE from 'three';

// Material library from Build Spec §3, shared by all procedural models.
export const M = {
  gold: new THREE.MeshStandardMaterial({ color: '#d9a441', metalness: 1, roughness: 0.35 }),
  alu: new THREE.MeshStandardMaterial({ color: '#c8ccd2', metalness: 0.9, roughness: 0.32 }),
  white: new THREE.MeshStandardMaterial({ color: '#eef0f2', metalness: 0, roughness: 0.55 }),
  dark: new THREE.MeshStandardMaterial({ color: '#2a2d35', metalness: 0.3, roughness: 0.6 }),
  solar: new THREE.MeshStandardMaterial({ color: '#18234F', metalness: 0.6, roughness: 0.22, emissive: '#0a1030', emissiveIntensity: 0.3 }),
  dish: new THREE.MeshStandardMaterial({ color: '#f2efe6', metalness: 0.1, roughness: 0.4, side: THREE.DoubleSide }),
  orange: new THREE.MeshStandardMaterial({ color: '#FF8A3D', roughness: 0.5 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#bfe0ff', metalness: 0, roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1 }),
  copper: new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 1, roughness: 0.4 }),
  red: new THREE.MeshStandardMaterial({ color: '#d94b3a', roughness: 0.5 }),
  black: new THREE.MeshStandardMaterial({ color: '#111216', roughness: 0.8 }),
  glow: new THREE.MeshBasicMaterial({ color: '#FFC94D', toneMapped: false }),
  visor: new THREE.MeshStandardMaterial({ color: '#d7a63b', metalness: 1, roughness: 0.15 }),
};

/** A small canvas texture: Perseverance-style parachute rings (simplified, labelled as such). */
export function parachuteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  const cx = 256;
  const rings = [60, 120, 180, 250];
  for (let r = rings.length - 1; r >= 0; r--) {
    const gores = 80;
    for (let i = 0; i < gores; i++) {
      const a0 = (i / gores) * Math.PI * 2, a1 = ((i + 1) / gores) * Math.PI * 2;
      const on = (Math.sin(i * 1.7 + r * 3.1) + Math.sin(i * 0.37 * (r + 1))) > 0.3;
      g.fillStyle = on ? '#d8432f' : '#f4f1ea';
      g.beginPath(); g.moveTo(cx, cx); g.arc(cx, cx, rings[r], a0, a1); g.closePath(); g.fill();
    }
  }
  g.fillStyle = '#f4f1ea'; g.beginPath(); g.arc(cx, cx, 20, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Mulberry32 seeded random for repeatable terrain. */
export function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Value noise used for terrain. */
export function noise2(seed = 1) {
  const r = rng(seed);
  const perm = new Float32Array(512).map(() => r());
  const h = (x: number, y: number) => perm[((x * 57 + y * 131) & 511 + 512) % 512];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const n = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x: number, y: number) => n(x, y) * 0.5 + n(x * 2.1, y * 2.1) * 0.25 + n(x * 4.3, y * 4.3) * 0.125;
}
