import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Face } from '../data/types';

/*
  The astronaut from the team's "Nova Story Guide" artifact, ported to TypeScript.
  Built from primitives in code (no model file, no licence questions). Extra poses were added
  for VIMO's gestures in the same joint-angle style.

  Joint angles per pose, in radians. L / R mean screen-left / screen-right while she faces you.
  arm: [x, y, z] at the shoulder, elbow: [bend, sway], leg: [x, y, z] at the hip, knee: bend, head: [pitch, yaw].
*/
export interface Pose {
  armL: number[]; armR: number[]; elbowL: number[]; elbowR: number[];
  legL: number[]; legR: number[]; kneeL: number; kneeR: number;
  head: number[]; waveL: number; waveR: number;
}

const BASE: Pose = {
  armL: [0.15, 0, -0.5], armR: [-0.1, 0, 0.6],
  elbowL: [-0.6, 0], elbowR: [-0.4, 0],
  legL: [-0.3, 0, -0.08], legR: [0.15, 0, 0.1],
  kneeL: 0.5, kneeR: 0.25,
  head: [0, 0], waveL: 0, waveR: 0,
};

const mirror = (p: Pose): Pose => ({
  ...p,
  armL: [p.armR[0], -p.armR[1], -p.armR[2]], armR: [p.armL[0], -p.armL[1], -p.armL[2]],
  elbowL: [p.elbowR[0], -p.elbowR[1]], elbowR: [p.elbowL[0], -p.elbowL[1]],
  legL: [p.legR[0], -p.legR[1], -p.legR[2]], legR: [p.legL[0], -p.legL[1], -p.legL[2]],
  kneeL: p.kneeR, kneeR: p.kneeL,
  head: [p.head[0], -p.head[1]], waveL: p.waveR, waveR: p.waveL,
});

const standLegs = { legL: [-0.05, 0, -0.06], legR: [-0.05, 0, 0.06], kneeL: 0.12, kneeR: 0.12 };
const waveR: Pose = { ...BASE, armR: [0, 0, 2.5], elbowR: [-0.25, 0], armL: [0.1, 0, -0.35], elbowL: [-0.8, 0], head: [0, 0.1], waveR: 1 };
const pointR: Pose = { ...BASE, armR: [-0.3, 0, 1.45], elbowR: [-0.15, 0], armL: [0.2, 0, -0.35], elbowL: [-0.9, 0], head: [0.05, 0.45] };
const saluteR: Pose = { ...BASE, armR: [-0.45, 0, 1.55], elbowR: [-2.15, 0], armL: [0.1, 0, -0.3], elbowL: [-0.5, 0], head: [-0.05, 0], ...standLegs };
const thumbsR: Pose = { ...BASE, armR: [-1.25, 0, 0.3], elbowR: [-0.5, 0], armL: [0.1, 0, -0.35], elbowL: [-0.7, 0], head: [-0.05, 0.1] };
const whisperR: Pose = { ...BASE, armR: [-0.75, 0, 1.1], elbowR: [-2.3, 0], armL: [0.1, 0, -0.3], elbowL: [-0.6, 0], head: [0, -0.3] };
const listenL: Pose = { ...BASE, armL: [-0.4, 0, -1.45], elbowL: [-2.2, 0], armR: [0.1, 0, 0.3], elbowR: [-0.5, 0], head: [0.05, 0.35] };
const countR: Pose = { ...BASE, armR: [-1.0, 0, 0.55], elbowR: [-1.3, 0], armL: [0.1, 0, -0.35], elbowL: [-0.7, 0], head: [-0.05, 0.15], waveR: 0.35 };

export const POSES: Record<string, Pose> = {
  float: BASE,
  waveR, waveL: mirror(waveR),
  pointR, pointL: mirror(pointR),
  cheer: {
    ...BASE,
    armL: [0, 0, -2.6], armR: [0, 0, 2.6], elbowL: [-0.3, 0], elbowR: [-0.3, 0],
    legL: [-0.4, 0, -0.12], legR: [-0.4, 0, 0.12], kneeL: 0.7, kneeR: 0.7, head: [-0.2, 0],
  },
  think: { ...BASE, armR: [-1.3, 0, 0.45], elbowR: [-2.1, 0], armL: [-0.5, 0, -0.25], elbowL: [-1.6, 0], head: [0.15, -0.25] },
  saluteR, saluteL: mirror(saluteR),
  thumbsR, thumbsL: mirror(thumbsR),
  whisperR, whisperL: mirror(whisperR),
  listenL, listenR: mirror(listenL),
  countR, countL: mirror(countR),
  highFiveR: { ...waveR, waveR: 0, armR: [-0.2, 0, 2.7], elbowR: [-0.1, 0] },
  highFiveL: mirror({ ...waveR, waveR: 0, armR: [-0.2, 0, 2.7], elbowR: [-0.1, 0] }),
  coverEyes: { ...BASE, armL: [-1.7, 0, -0.35], armR: [-1.7, 0, 0.35], elbowL: [-1.5, 0], elbowR: [-1.5, 0], head: [0.2, 0] },
  heart: { ...BASE, armL: [-1.25, 0, -0.45], armR: [-1.25, 0, 0.45], elbowL: [-1.7, 0], elbowR: [-1.7, 0], head: [-0.1, 0] },
  logbook: { ...BASE, armL: [-0.95, 0, -0.12], armR: [-0.95, 0, 0.12], elbowL: [-0.9, 0], elbowR: [-0.9, 0], head: [0.4, 0] },
  stamp: { ...BASE, armL: [-0.95, 0, -0.12], elbowL: [-0.9, 0], armR: [-1.6, 0, 0.2], elbowR: [-0.5, 0], head: [0.35, 0], waveR: 0.6 },
  shrug: { ...BASE, armL: [-0.2, 0, -0.85], armR: [-0.2, 0, 0.85], elbowL: [-1.5, 0], elbowR: [-1.5, 0], head: [0.05, 0.25], ...standLegs },
  shiver: { ...BASE, armL: [-1.0, 0, 0.35], armR: [-1.0, 0, -0.35], elbowL: [-2.0, 0], elbowR: [-2.0, 0], head: [0.15, 0] },
  sleepy: { ...BASE, armL: [0.1, 0, -0.2], armR: [0.1, 0, 0.2], elbowL: [-0.3, 0], elbowR: [-0.3, 0], head: [0.4, 0] },
  dizzy: { ...BASE, armL: [0, 0, -1.3], armR: [0, 0, 1.3], elbowL: [-0.3, 0], elbowR: [-0.3, 0], head: [0, 0] },
  bow: { ...BASE, armL: [0.25, 0, -0.15], armR: [0.25, 0, 0.15], elbowL: [-0.2, 0], elbowR: [-0.2, 0], head: [0.55, 0], ...standLegs },
  sit: { ...BASE, legL: [-1.5, 0, -0.12], legR: [-1.5, 0, 0.12], kneeL: 1.45, kneeR: 1.45, armL: [-0.4, 0, -0.25], armR: [-0.4, 0, 0.25], elbowL: [-0.7, 0], elbowR: [-0.7, 0] },
  hop: { ...BASE, legL: [-0.6, 0, -0.1], legR: [-0.6, 0, 0.1], kneeL: 1.0, kneeR: 1.0, armL: [0, 0, -1.1], armR: [0, 0, 1.1], elbowL: [-0.4, 0], elbowR: [-0.4, 0] },
  // flying fast: arms swept back, legs trailing, chin up (superhero glide)
  fly: { ...BASE, armL: [0.9, 0, -0.45], armR: [0.9, 0, 0.45], elbowL: [-0.2, 0], elbowR: [-0.2, 0], legL: [0.55, 0, -0.08], legR: [0.35, 0, 0.1], kneeL: 0.9, kneeR: 0.6, head: [-0.25, 0] },
  // talking hand gestures (cycled while she speaks)
  talkOpen: { ...BASE, armR: [-0.9, 0, 0.75], elbowR: [-1.0, 0.3], armL: [0.1, 0, -0.35], elbowL: [-0.7, 0], head: [0, 0.12] },
  talkBoth: { ...BASE, armL: [-0.8, 0, -0.8], armR: [-0.8, 0, 0.8], elbowL: [-1.1, -0.3], elbowR: [-1.1, 0.3], head: [-0.05, 0] },
  talkChest: { ...BASE, armL: [-1.1, 0, 0.15], elbowL: [-1.9, 0], armR: [0.05, 0, 0.5], elbowR: [-0.5, 0], head: [0.05, -0.1] },
  talkBig: { ...BASE, armL: [-0.3, 0, -1.5], armR: [-0.3, 0, 1.5], elbowL: [-0.25, 0], elbowR: [-0.25, 0], head: [-0.15, 0] },
  talkCount: { ...BASE, armR: [-1.15, 0, 0.5], elbowR: [-1.5, 0], armL: [0.1, 0, -0.35], elbowL: [-0.7, 0], head: [-0.05, 0.15], waveR: 0.25 },
  // idle micro-actions
  lookAround: { ...BASE, head: [-0.1, 0.6], armL: [0.1, 0, -0.4], elbowL: [-0.5, 0] },
  stretch: { ...BASE, armL: [0, 0, -2.8], armR: [0, 0, 2.8], elbowL: [-0.15, 0], elbowR: [-0.15, 0], legL: [0, 0, -0.1], legR: [0, 0, 0.1], kneeL: 0.05, kneeR: 0.05, head: [-0.3, 0] },
  hugLogbook: { ...BASE, armL: [-1.0, 0, 0.25], armR: [-1.0, 0, -0.25], elbowL: [-1.8, 0], elbowR: [-1.8, 0], head: [0.2, 0.15] },
};

/** Short whole-body "accent" moves that punctuate a line (age = seconds since it started). */
export type AccentKind = 'bounce' | 'nod' | 'tilt' | 'shake' | 'lean' | 'spin' | 'jump' | 'sink' | 'land';
export interface Mood { bob: number; bobSpeed: number; slump: number; jitter: number }
export interface UpdateOpts {
  pose?: string; vx?: number; vy?: number; speed?: number; look?: { x: number; y: number }; calm?: boolean; glowHue?: number;
  face?: Face; talk?: number; accent?: { kind: AccentKind; age: number } | null; mood?: Mood; dizzy?: boolean;
}

export interface Nova {
  root: THREE.Group;
  head: THREE.Group;
  handR: THREE.Object3D;
  handL: THREE.Object3D;
  update: (dt: number, t: number, o?: UpdateOpts) => void;
  dispose: () => void;
}

export function createAstronaut(): Nova {
  const mat = {
    suit: new THREE.MeshStandardMaterial({ color: 0xf3f0e8, roughness: 0.55 }),
    trim: new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.45 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2a2f3d, roughness: 0.5, metalness: 0.4 }),
    visor: new THREE.MeshPhysicalMaterial({ color: 0x0a1430, metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04 }),
    glow: new THREE.MeshBasicMaterial({ color: 0x8fe9ff }),
    flame: new THREE.MeshBasicMaterial({ color: 0x6fd8ff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }),
  };
  const geos: THREE.BufferGeometry[] = [];
  const extraMats: THREE.Material[] = [];

  const root = new THREE.Group(); // moved around by the story
  const body = new THREE.Group(); // hover bob and lean
  const rig = new THREE.Group();
  root.add(body);
  body.add(rig);

  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    geos.push(geo);
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const group = (parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };
  const ring = (parent: THREE.Object3D, r: number, tube: number, material: THREE.Material, y: number, sx = 1, sz = 1) => {
    const m = add(parent, new THREE.TorusGeometry(r, tube, 12, 40), material, 0, y, 0);
    m.rotation.x = Math.PI / 2;
    m.scale.set(sx, sz, 1);
    return m;
  };

  // Torso, chest panel, belt
  add(rig, new THREE.CapsuleGeometry(0.5, 0.55, 8, 24), mat.suit).scale.set(1.08, 1, 0.85);
  add(rig, new RoundedBoxGeometry(0.5, 0.32, 0.12, 3, 0.04), mat.dark, 0, 0.12, 0.4);
  ([[-0.13, 0xff5a5a], [0, 0x5ad6ff], [0.13, 0x8aff8f]] as const).forEach(([x, c]) => {
    const m = new THREE.MeshBasicMaterial({ color: c });
    extraMats.push(m);
    add(rig, new THREE.SphereGeometry(0.035, 12, 12), m, x, 0.12, 0.47);
  });
  ring(rig, 0.5, 0.05, mat.trim, -0.4, 1.1, 0.88);

  // Backpack with two jet nozzles
  add(rig, new RoundedBoxGeometry(0.85, 0.95, 0.4, 4, 0.1), mat.suit, 0, 0.1, -0.5);
  add(rig, new RoundedBoxGeometry(0.87, 0.08, 0.42, 2, 0.03), mat.trim, 0, 0.35, -0.5);
  const flames = [-0.22, 0.22].map((x) => {
    add(rig, new THREE.CylinderGeometry(0.08, 0.12, 0.16, 20), mat.dark, x, -0.44, -0.55);
    const pivot = group(rig, x, -0.52, -0.55);
    add(pivot, new THREE.ConeGeometry(0.085, 0.5, 20, 1, true), mat.flame, 0, -0.25, 0).rotation.x = Math.PI;
    return pivot;
  });

  // Neck ring, helmet, visor, ear pieces, antenna
  ring(rig, 0.36, 0.07, mat.dark, 0.66);
  const head = group(rig, 0, 1.08, 0);
  add(head, new THREE.SphereGeometry(0.56, 48, 32), mat.suit);
  add(head, new THREE.SphereGeometry(0.45, 48, 32), mat.visor, 0, 0.02, 0.26).scale.set(1.05, 0.82, 0.75);
  [-1, 1].forEach((s) => {
    add(head, new THREE.CylinderGeometry(0.13, 0.13, 0.12, 24), mat.trim, s * 0.54, 0, 0).rotation.z = Math.PI / 2;
  });
  add(head, new THREE.CylinderGeometry(0.018, 0.018, 0.36, 8), mat.dark, 0.36, 0.55, -0.05).rotation.z = -0.35;
  add(head, new THREE.SphereGeometry(0.05, 16, 16), mat.glow, 0.42, 0.72, -0.05);

  const arm = (s: number) => {
    const shoulder = group(rig, s * 0.6, 0.38, 0);
    add(shoulder, new THREE.SphereGeometry(0.2, 24, 16), mat.suit);
    add(shoulder, new THREE.CapsuleGeometry(0.16, 0.3, 6, 16), mat.suit, 0, -0.28, 0);
    ring(shoulder, 0.165, 0.03, mat.trim, -0.18);
    const elbow = group(shoulder, 0, -0.55, 0);
    add(elbow, new THREE.CapsuleGeometry(0.145, 0.28, 6, 16), mat.suit, 0, -0.2, 0);
    add(elbow, new THREE.CylinderGeometry(0.165, 0.165, 0.08, 20), mat.trim, 0, -0.4, 0);
    const hand = add(elbow, new THREE.SphereGeometry(0.16, 20, 16), mat.suit, 0, -0.52, 0);
    hand.scale.set(1, 1.1, 0.85);
    return { shoulder, elbow, hand };
  };
  const leg = (s: number) => {
    const hip = group(rig, s * 0.26, -0.62, 0);
    add(hip, new THREE.CapsuleGeometry(0.2, 0.3, 6, 16), mat.suit, 0, -0.25, 0);
    const knee = group(hip, 0, -0.55, 0);
    add(knee, new THREE.CapsuleGeometry(0.19, 0.26, 6, 16), mat.suit, 0, -0.2, 0);
    ring(knee, 0.2, 0.035, mat.trim, -0.36);
    add(knee, new RoundedBoxGeometry(0.34, 0.24, 0.46, 3, 0.08), mat.dark, 0, -0.5, 0.05);
    return { hip, knee };
  };
  const L = { arm: arm(-1), leg: leg(-1) };
  const R = { arm: arm(1), leg: leg(1) };

  // Every joint value is a little spring: it overshoots a touch and settles (follow-through),
  // instead of sliding into place. Velocities live in `vel` with the same shape as the pose.
  const cur: Pose = structuredClone(BASE);
  const vel: any = JSON.parse(JSON.stringify(BASE, (_k, v) => (typeof v === 'number' ? 0 : v)));
  const STIFF = 85, DAMP = 12;
  const springStep = (key: keyof Pose, target: Pose, dt: number, stiff: number) => {
    const c = cur[key] as any, tg = target[key] as any, v = vel[key];
    if (Array.isArray(c)) {
      for (let i = 0; i < c.length; i++) { v[i] += ((tg[i] - c[i]) * stiff - v[i] * DAMP) * dt; c[i] += v[i] * dt; }
    } else {
      vel[key] += ((tg - c) * stiff - vel[key] * DAMP) * dt;
      (cur as any)[key] = c + vel[key] * dt;
    }
  };
  const env = (age: number, rise: number, hold: number, fall: number) =>
    age < rise ? age / rise : age < rise + hold ? 1 : Math.max(0, 1 - (age - rise - hold) / fall);

  function update(dt: number, t: number, o: UpdateOpts = {}) {
    const { pose = 'float', vx = 0, vy = 0, speed = 0, look = { x: 0, y: 0 }, calm = false, glowHue = 0.53,
      face = 'happy', talk = 0, accent = null, mood = { bob: 1, bobSpeed: 1, slump: 0, jitter: 0 }, dizzy = false } = o;
    const target = POSES[pose] ?? BASE;
    const stiff = calm ? 40 : STIFF;
    // springs are integrated in small steps so big frames stay stable
    const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    for (let s = 0; s < steps; s++) for (const key in cur) springStep(key as keyof Pose, target, dt / steps, stiff);

    const a = calm ? 0.3 : 1; // idle-motion amplitude
    const sp = mood.bobSpeed;
    const n = (freq: number, phase: number) => Math.sin(t * freq * sp + phase) * a;
    const wave = Math.sin(t * 7) * 0.5;
    const slump = mood.slump;
    // talking: little beats in the head and shoulders with the rhythm of the words
    const tb = talk * Math.sin(t * 9.5);
    const jit = mood.jitter ? Math.sin(t * 47) * 0.03 * mood.jitter : 0;

    L.arm.shoulder.rotation.set(cur.armL[0] + n(1.1, 0) * 0.08 + slump * 0.15, cur.armL[1], cur.armL[2] + n(0.9, 1) * 0.1 + slump * 0.25 + jit);
    R.arm.shoulder.rotation.set(cur.armR[0] + n(1.0, 2) * 0.08 + slump * 0.15 + tb * 0.05, cur.armR[1], cur.armR[2] + n(0.8, 3) * 0.1 - slump * 0.25 - jit);
    L.arm.elbow.rotation.set(cur.elbowL[0] + n(1.3, 4) * 0.1, 0, cur.elbowL[1] + wave * cur.waveL);
    R.arm.elbow.rotation.set(cur.elbowR[0] + n(1.2, 5) * 0.1 + tb * 0.12, 0, cur.elbowR[1] - wave * cur.waveR);
    L.leg.hip.rotation.set(cur.legL[0] + n(0.7, 6) * 0.12, cur.legL[1], cur.legL[2]);
    R.leg.hip.rotation.set(cur.legR[0] + n(0.75, 7) * 0.12, cur.legR[1], cur.legR[2]);
    L.leg.knee.rotation.x = cur.kneeL + n(0.9, 8) * 0.1;
    R.leg.knee.rotation.x = cur.kneeR + n(0.85, 9) * 0.1;
    let hx = cur.head[0] + look.y * 0.18 + n(0.6, 10) * 0.04 + slump * 0.35 + tb * 0.05;
    let hy = cur.head[1] + look.x * 0.5;
    let hz = n(0.5, 11) * 0.04 + jit;

    // Hover: bob and sway, then lean into the direction she is flying.
    let by = n(1.3, 0) * 0.15 * mood.bob - slump * 0.12 + Math.abs(tb) * 0.03;
    let rz = n(0.7, 1) * 0.07 - THREE.MathUtils.clamp(vx, -3, 3) * 0.16;
    let rx = n(0.9, 2) * 0.05 + THREE.MathUtils.clamp(vy, -3, 3) * 0.08 + Math.min(speed, 3) * 0.08 + slump * 0.12;
    let ry = 0;

    // accent moves that punctuate what she just said
    if (accent && !calm) {
      const g = accent.age;
      switch (accent.kind) {
        case 'bounce': { const e = g < 0.55 ? Math.sin((g / 0.55) * Math.PI) : 0; by += e * 0.45; L.leg.knee.rotation.x += e * 0.7; R.leg.knee.rotation.x += e * 0.7; L.arm.shoulder.rotation.z -= e * 0.5; R.arm.shoulder.rotation.z += e * 0.5; break; }
        case 'jump': { const e = g < 0.4 ? Math.sin((g / 0.4) * Math.PI) : 0; by += e * 0.6; L.arm.shoulder.rotation.z -= e * 1.4; R.arm.shoulder.rotation.z += e * 1.4; hx -= e * 0.3; break; }
        case 'nod': if (g < 0.8) hx += Math.sin((g / 0.8) * Math.PI * 3) * 0.22 * (1 - g / 0.8); break;
        case 'shake': if (g < 0.9) hy += Math.sin(g * 20) * 0.32 * (1 - g / 0.9); break;
        case 'tilt': hz += env(g, 0.2, 1.0, 0.5) * 0.32; hy += env(g, 0.2, 1.0, 0.5) * 0.15; break;
        case 'lean': rx += env(g, 0.25, 0.8, 0.5) * 0.3; by -= env(g, 0.25, 0.8, 0.5) * 0.08; break;
        case 'spin': if (g < 0.8) ry = (1 - (1 - g / 0.8) ** 3) * Math.PI * 2; break;
        case 'sink': by -= env(g, 0.4, 1.2, 0.8) * 0.2; hx += env(g, 0.4, 1.2, 0.8) * 0.25; break;
        case 'land': { const e = g < 0.35 ? Math.sin((g / 0.35) * Math.PI) : 0; by -= e * 0.18; L.leg.knee.rotation.x += e * 0.6; R.leg.knee.rotation.x += e * 0.6; hx += e * 0.12; break; }
      }
    }
    if (dizzy) { hz += Math.sin(t * 6) * 0.25; hx += Math.cos(t * 6) * 0.12; }

    head.rotation.set(hx, hy, hz);
    body.position.y = by;
    body.rotation.set(rx, ry, rz);

    const thrust = 0.3 + Math.min(speed, 3) * 0.45 + Math.max(0, by) * 0.8;
    flames.forEach((f, i) => f.scale.set(1, thrust * (0.9 + Math.sin(t * 40 + i * 2) * 0.12), 1));
    mat.glow.color.setHSL(glowHue, 1, 0.6 + Math.sin(t * 3) * 0.15);

  }

  function dispose() {
    geos.forEach((g) => g.dispose());
    Object.values(mat).forEach((m) => m.dispose());
    extraMats.forEach((m) => m.dispose());
  }

  return { root, head, handR: R.arm.hand, handL: L.arm.hand, update, dispose };
}
