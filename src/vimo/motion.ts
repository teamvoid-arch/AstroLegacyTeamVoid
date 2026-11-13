import * as THREE from 'three';
import type { Face, Gesture } from '../data/types';
import { vimo } from './controller';

/** Shared screen placement + springy motion for VIMO (rigged GLB or the procedural fallback). */

export const SIZE: Record<string, number> = { XS: 0.05, S: 0.13, M: 0.3, L: 0.46, XL: 0.7 };
const GX: Record<string, number> = { 'top-left': -1, left: -1, 'bottom-left': -1, top: 0, centre: 0, bottom: 0, 'top-right': 1, right: 1, 'bottom-right': 1 };
const GY: Record<string, number> = { 'top-left': 1, top: 1, 'top-right': 1, left: 0, centre: 0, right: 0, 'bottom-left': -1, bottom: -1, 'bottom-right': -1 };

export const damp = (a: number, b: number, l: number, dt: number) => THREE.MathUtils.damp(a, b, l, dt);

export interface MotionState {
  x: number; y: number; s: number; vx: number; vy: number; vs: number;
  ant: number; antV: number; lastChanged: number;
}
export const createMotion = (): MotionState => ({ x: 3, y: 3, s: 0.2, vx: 0, vy: 0, vs: 0, ant: 0, antV: 0, lastChanged: -1 });

export interface Frame { gesture: Gesture; face: Face; ge: number; t: number; h: number; halfW: number; halfH: number; speed: number }

/** Move root/body for this frame. Returns the active gesture and face. */
export function stepMotion(
  st: MotionState, root: THREE.Object3D, body: THREE.Object3D, camera: THREE.Camera,
  size: { width: number; height: number }, dt: number, t: number, reduced: boolean,
): Frame {
  const pt = performance.now() / 1000;
  const cam = camera as THREE.PerspectiveCamera;
  const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
  const aspect = size.width / size.height;
  const halfW = halfH * aspect;
  const portrait = aspect < 0.9;
  let sz = SIZE[vimo.size] * (portrait ? Math.min(1, 0.55 + aspect * 0.5) : 1);
  const h = sz * 2 * halfH;
  const gx = GX[vimo.screen] ?? 0, gy = GY[vimo.screen] ?? 0;
  const capSpace = portrait ? 0.42 : 0.3; // keep clear of the caption card
  const tx = gx * (halfW - h * 0.42) * (portrait ? 0.85 : 0.82);
  const minY = -halfH + capSpace * 2 * halfH * 0.75;
  const maxY = halfH - h - 0.12 * halfH;
  let ty = gy > 0 ? maxY : gy < 0 ? minY : -h / 2;
  ty = THREE.MathUtils.clamp(ty, Math.min(minY, maxY), Math.max(minY, maxY));
  if (vimo.hidden) ty = halfH * 2.2;

  const r = vimo.reaction && vimo.reaction.until > pt ? vimo.reaction : null;
  if (vimo.reaction && !r) vimo.reaction = null;
  const gesture: Gesture = r ? r.gesture : vimo.gesture;
  const face: Face = r?.face || vimo.face;
  const ge = pt - vimo.gestureStart;

  // anticipation: a small dip before a big move
  if (vimo.changed !== st.lastChanged) {
    st.lastChanged = vimo.changed;
    if (!reduced) { st.vy -= 1.2 * Math.max(st.s, 0.4); st.vs -= 0.4 * st.s; }
  }

  let ox = 0, oy = 0, spin = 0, tiltZ = 0, tiltX = 0;
  if (gesture === 'hop') oy = Math.abs(Math.sin(ge * 5)) * h * 0.18;
  if (gesture === 'loop' && ge < 1.6) { const a = (ge / 1.6) * Math.PI * 2; ox = Math.sin(a) * h * 0.5; oy = (1 - Math.cos(a)) * h * 0.4; tiltZ = -Math.sin(a) * 0.4; }
  if (gesture === 'spin' && ge < 0.9) spin = (ge / 0.9) * Math.PI * 2;
  if (gesture === 'crash' && ge < 1.4) { const k = ge / 1.4; if (k < 0.45) { ox = (1 - k / 0.45) * halfW * 1.4; oy = (1 - k / 0.45) * halfH * 1.6; spin = k * 12; } else { oy = Math.abs(Math.sin((k - 0.45) * 9)) * h * 0.35 * (1 - k); tiltZ = Math.sin(k * 20) * 0.3 * (1 - k); } }
  if (gesture === 'dizzy') tiltZ = Math.sin(t * 6) * 0.25;
  if (gesture === 'bow') tiltX = Math.min(1, ge * 2) * 0.55 * (ge < 1.6 ? 1 : 0);
  if (gesture === 'listen') { tiltZ = 1.25; oy = -h * 0.25; }
  if (gesture === 'sit') oy = -h * 0.12;
  if (gesture === 'sleepy') tiltZ = Math.sin(t * 0.8) * 0.08;
  if (gesture === 'shiver') ox = Math.sin(t * 40) * h * 0.012;
  if (gesture === 'cheer' && ge < 1) oy = Math.sin(Math.min(1, ge) * Math.PI) * h * 0.2;
  if ((gesture as string) === 'star') { const k = Math.min(1, ge / 2.2); oy = k * k * halfH * 2.2; sz *= 1 - k * 0.97; }

  // springy motion with overshoot (Build Spec section 5 motion system)
  const k = reduced ? 30 : 46, c = reduced ? 11 : 8.2;
  st.vx += ((tx + ox) - st.x) * k * dt - st.vx * c * dt;
  st.vy += ((ty + oy) - st.y) * k * dt - st.vy * c * dt;
  st.vs += (sz * 2 * halfH - st.s) * k * dt - st.vs * c * dt;
  st.x += st.vx * dt; st.y += st.vy * dt; st.s = Math.max(0.02, st.s + st.vs * dt);
  const speed = Math.hypot(st.vx, st.vy) / Math.max(st.s, 0.1);

  root.position.set(st.x, st.y, 0);
  // squash & stretch on fast moves, banking into turns
  const stretch = THREE.MathUtils.clamp(1 + st.vy * 0.04 / Math.max(st.s, 0.2), 0.85, 1.18);
  root.scale.set(st.s / Math.sqrt(stretch), st.s * stretch, st.s / Math.sqrt(stretch));
  const bank = THREE.MathUtils.clamp(-st.vx * 0.06 / Math.max(st.s, 0.2), -0.5, 0.5);
  body.position.y = Math.sin(t * 1.6) * 0.02;
  body.rotation.z = damp(body.rotation.z, bank + tiltZ, 6, dt);
  body.rotation.x = damp(body.rotation.x, tiltX + THREE.MathUtils.clamp(st.vy * 0.02, -0.25, 0.25), 6, dt);
  body.rotation.y = spin + (-st.x / Math.max(halfW, 1)) * 0.35;

  // antenna follow-through (spring)
  st.antV += (-st.ant * 60 - st.antV * 4 - st.vx * 3 / Math.max(st.s, 0.2)) * dt;
  st.ant += st.antV * dt;

  return { gesture, face, ge, t, h, halfW, halfH, speed };
}

/** Publish the tap target (screen px) for the accessible hit button and the high-five hand. */
export function publishHit(st: MotionState, camera: THREE.Camera, size: { width: number; height: number }, halfH: number) {
  const v = new THREE.Vector3(st.x, st.y + st.s * 0.55, 0).project(camera);
  vimo.hit.x = (v.x * 0.5 + 0.5) * size.width;
  vimo.hit.y = (-v.y * 0.5 + 0.5) * size.height;
  vimo.hit.r = (st.s / (2 * halfH)) * size.height * 0.5;
  const hv = new THREE.Vector3(st.x - st.s * 0.25, st.y + st.s * 1.05, 0).project(camera);
  vimo.hit.hx = (hv.x * 0.5 + 0.5) * size.width;
  vimo.hit.hy = (-hv.y * 0.5 + 0.5) * size.height;
}
