import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Face, Gesture } from '../data/types';
import { live, useStore } from '../store';
import { vimo } from './controller';
import { createMotion, publishHit, stepMotion } from './motion';
import { createAstronaut, type AccentKind, type Mood } from './novaModel';

/*
  VIMO in the team's "Nova" astronaut look, with a neon face on her visor.
  This file is her "director": it reads each line she says and picks a matching
  emotion and accent move, makes her talk with her hands, look at you, fidget when idle,
  swoop into a flying pose and land with a little squash.
*/

const HEIGHT = 3.64;            // Nova's model height (boot sole to antenna light)
const FOOT = 1.79;              // distance from the model origin down to the boot soles
const FIT = 1.1 / HEIGHT;       // 1 unit ≈ her height

// head look (x = turn, y = nod; +y looks down), antenna light hue and body mood per emotion
const FACE: Record<Face, { look: [number, number]; hue: number; mood: Mood }> = {
  happy: { look: [0, 0], hue: 0.53, mood: { bob: 1, bobSpeed: 1, slump: 0, jitter: 0 } },
  excited: { look: [0, -0.9], hue: 0.14, mood: { bob: 1.5, bobSpeed: 1.7, slump: 0, jitter: 0 } },
  curious: { look: [0.45, -0.2], hue: 0.45, mood: { bob: 1, bobSpeed: 1, slump: 0, jitter: 0 } },
  amazed: { look: [0, -1.1], hue: 0.14, mood: { bob: 1.2, bobSpeed: 1.2, slump: 0, jitter: 0 } },
  proud: { look: [0, -0.7], hue: 0.08, mood: { bob: 1, bobSpeed: 1, slump: -0.15, jitter: 0 } },
  thinking: { look: [-0.4, -1.2], hue: 0.5, mood: { bob: 0.7, bobSpeed: 0.8, slump: 0, jitter: 0 } },
  cheeky: { look: [0.3, 0.2], hue: 0.92, mood: { bob: 1.2, bobSpeed: 1.4, slump: 0, jitter: 0 } },
  surprised: { look: [0, -1.2], hue: 0.14, mood: { bob: 1.3, bobSpeed: 1.5, slump: 0, jitter: 0 } },
  nervous: { look: [-0.25, 0.7], hue: 0.75, mood: { bob: 0.8, bobSpeed: 1.3, slump: 0.25, jitter: 1 } },
  sad: { look: [0, 2.0], hue: 0.6, mood: { bob: 0.5, bobSpeed: 0.6, slump: 0.8, jitter: 0 } },
  gentle: { look: [0, 0.6], hue: 0.95, mood: { bob: 0.8, bobSpeed: 0.8, slump: 0.15, jitter: 0 } },
  brave: { look: [0, -0.5], hue: 0.03, mood: { bob: 1, bobSpeed: 1.1, slump: -0.2, jitter: 0 } },
  sleepy: { look: [0, 2.2], hue: 0.65, mood: { bob: 0.6, bobSpeed: 0.5, slump: 0.5, jitter: 0 } },
  tears: { look: [0, 0.5], hue: 0.58, mood: { bob: 1, bobSpeed: 1, slump: 0.2, jitter: 0 } },
};

/** VIMO gesture → Nova pose. `right` = she is on the right half of the screen. */
function poseFor(g: Gesture, ge: number, right: boolean): string {
  const toCentre = right ? 'L' : 'R';
  const outer = right ? 'R' : 'L';
  if (vimo.highFive) return `highFive${outer}`;
  switch (g) {
    case 'wave': return `wave${outer}`;
    case 'point': return `point${toCentre}`;
    case 'salute': return `salute${outer}`;
    case 'thumbs': return `thumbs${toCentre}`;
    case 'whisper': return `whisper${toCentre}`;
    case 'listen': return `listen${outer}`;
    case 'count': return `count${toCentre}`;
    case 'cheer': return 'cheer';
    case 'cover-eyes': return 'coverEyes';
    case 'heart': return 'heart';
    case 'logbook': return 'logbook';
    case 'stamp': return 'stamp';
    case 'shrug': return 'shrug';
    case 'shiver': return 'shiver';
    case 'sleepy': return 'sleepy';
    case 'dizzy': return 'dizzy';
    case 'bow': return 'bow';
    case 'sit': return 'sit';
    case 'hop': return 'hop';
    case 'spin': return ge < 0.9 ? 'cheer' : 'float';
    default: return 'float';
  }
}

// ── reading a line: what feeling and move does it call for? (English + Bangla cues) ──
const has = (s: string, words: string[]) => words.some((w) => s.includes(w));
const WOW = ['wow', 'whoa', 'look', 'amazing', 'first', 'biggest', 'billion', 'million', 'record', 'more than', 'still', 'farthest', 'fastest', 'দেখো', 'বাহ', 'প্রথম', 'কোটি', 'লক্ষ'];
const BYE = ['goodbye', 'bye', 'went quiet', 'thank you', 'we remember', 'rest', 'miss', 'বিদায়', 'ধন্যবাদ'];
const SAD = ['lost', 'crash', 'dust covered', 'never', 'alone', 'lonely', 'quiet', 'হারিয়ে', 'একা'];
const FUN = ['oops', 'haha', 'hee', 'joke', 'funny', 'tickle', 'হাহা'];
const LOGGED = ['logged', 'not forgotten', 'proud', 'did it', 'success', 'perfect'];
const SELF = ["i'm", 'i am', 'my ', 'me ', 'আমি', 'আমার'];
const NUM = /\d/;

export interface LineRead { face?: Face; accent: AccentKind; talk: string[] }

export function readLine(text: string, kid = false): LineRead {
  const s = text.toLowerCase();
  if (kid) return { face: 'curious', accent: 'tilt', talk: ['talkOpen'] };
  if (has(s, FUN)) return { face: 'cheeky', accent: 'jump', talk: ['talkBoth', 'talkOpen'] };
  if (has(s, LOGGED)) return { face: 'proud', accent: 'nod', talk: ['talkChest', 'talkOpen'] };
  if (has(s, SAD) && !has(s, ['not lost'])) return { face: 'sad', accent: 'sink', talk: ['talkChest'] };
  if (has(s, BYE)) return { face: 'gentle', accent: 'sink', talk: ['talkChest', 'hugLogbook'] };
  if (s.includes('?')) return { face: 'curious', accent: 'tilt', talk: ['talkOpen', 'talkBoth'] };
  if (has(s, WOW) || NUM.test(s)) return { face: s.includes('!') ? 'amazed' : undefined, accent: s.includes('!') ? 'jump' : 'lean', talk: NUM.test(s) ? ['talkCount', 'talkBig'] : ['talkBig', 'talkBoth'] };
  if (s.startsWith('no') || s.includes("don't") || s.includes('not ')) return { accent: 'shake', talk: ['talkOpen'] };
  if (s.includes('!')) return { face: 'excited', accent: 'bounce', talk: ['talkBoth', 'talkBig', 'talkOpen'] };
  if (has(s, SELF)) return { accent: 'lean', talk: ['talkChest', 'talkOpen'] };
  return { accent: 'nod', talk: ['talkOpen', 'talkBoth', 'talkChest'] };
}

function useRoomEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    (scene as any).environmentIntensity = 0.5;
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
}

const IDLE_ACTS: { pose: string; look?: [number, number]; accent?: AccentKind; secs: number }[] = [
  { pose: 'lookAround', look: [1.2, -0.2], secs: 1.8 },
  { pose: 'lookAround', look: [-1.2, -0.3], secs: 1.8 },
  { pose: 'float', look: [0, -1.4], secs: 1.6 },                // looks up at the stars
  { pose: 'hugLogbook', secs: 2.0 },
  { pose: 'stretch', secs: 1.6 },
  { pose: 'float', accent: 'spin', secs: 1.2 },
  { pose: 'float', accent: 'bounce', secs: 0.8 },
];

export function VimoCharacter() {
  const nova = useMemo(() => createAstronaut(), []);
  useEffect(() => () => nova.dispose(), [nova]);
  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const { camera, size } = useThree();
  useRoomEnvironment();
  const st = useMemo(() => ({
    ...createMotion(),
    look: { x: 0, y: 0 },
    pointer: { x: 0, y: 0, at: -99 },
    lineKey: '', lineRead: null as LineRead | null, lineAt: -99,
    accent: null as null | { kind: AccentKind; at: number },
    talkPose: 'talkOpen', talkNext: 0,
    idle: null as null | { i: number; until: number }, idleNext: 6,
    lastSpeed: 0, turn: 0, talk: 0,
  }), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      st.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      st.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      st.pointer.at = performance.now() / 1000;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [st]);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const reduced = useStore.getState().settings.reducedMotion;
    const { gesture, face: beatFace, ge, halfW, halfH, speed } = stepMotion(st, root.current, body.current, camera, size, dt, t, reduced);
    const right = st.x > 0.15 * halfW;

    // ── a new line: read it, fire an accent move, pick talking gestures ──
    const line = vimo.line;
    if (line && line.key !== st.lineKey) {
      st.lineKey = line.key;
      st.lineRead = readLine(line.text, line.kid);
      st.lineAt = now;
      st.accent = { kind: st.lineRead.accent, at: now };
      st.talkNext = 0;
      st.idle = null;
    } else if (!line) st.lineKey = '';
    // reactions (taps) override everything; otherwise the line's feeling colours the beat's face for a few seconds
    const reacting = !!(vimo.reaction && vimo.reaction.until > now);
    const lineFresh = st.lineRead && now - st.lineAt < 3.2;
    const face: Face = reacting ? beatFace : (lineFresh && st.lineRead!.face && (beatFace === 'happy' || st.lineRead!.face === 'amazed' || st.lineRead!.face === 'sad'))
      ? st.lineRead!.face! : beatFace;

    // ── talking: real voice loudness, or the bubble typing out her words ──
    const typing = vimo.typing ? 0.45 + 0.35 * Math.abs(Math.sin(t * 13)) * Math.abs(Math.sin(t * 5.3)) : 0;
    const talkTarget = Math.max(live.speaking, typing);
    st.talk += (talkTarget - st.talk) * (1 - Math.exp(-dt * 14));
    const talking = st.talk > 0.1;

    // ── choose the pose ──
    let pose = poseFor(gesture, ge, right);
    if (speed > 2.6) pose = 'fly';
    else if (pose === 'float' && talking && !reacting) {
      if (now > st.talkNext) {
        const opts = st.lineRead?.talk || ['talkOpen'];
        const pick = opts[Math.floor(Math.random() * opts.length)];
        st.talkPose = pick === st.talkPose && opts.length > 1 ? opts[(opts.indexOf(pick) + 1) % opts.length] : pick;
        st.talkNext = now + 1.0 + Math.random() * 0.9;
      }
      pose = st.talkPose;
    } else if (pose === 'float' && !talking && !reacting) {
      // idle fidgets every 5–9 s
      if (!st.idle && now > st.idleNext) {
        const i = Math.floor(Math.random() * IDLE_ACTS.length);
        st.idle = { i, until: now + IDLE_ACTS[i].secs };
        if (IDLE_ACTS[i].accent) st.accent = { kind: IDLE_ACTS[i].accent!, at: now };
      }
      if (st.idle) {
        pose = IDLE_ACTS[st.idle.i].pose;
        if (now > st.idle.until) { st.idle = null; st.idleNext = now + 5 + Math.random() * 4; }
      }
    }
    if (talking || reacting) { st.idle = null; st.idleNext = Math.max(st.idleNext, now + 5); }

    // landing: a little squash when a fast flight stops
    if (st.lastSpeed > 2.2 && speed < 0.9) st.accent = { kind: 'land', at: now };
    st.lastSpeed = speed;

    // ── where she looks: you (while talking), the pointer (when idle), or her feeling ──
    const F = FACE[face] || FACE.happy;
    let lx = F.look[0], ly = F.look[1];
    const idleAct = st.idle ? IDLE_ACTS[st.idle.i] : null;
    if (idleAct?.look) { lx = idleAct.look[0]; ly = idleAct.look[1]; }
    else if (!talking && now - st.pointer.at < 4) {
      // follow the pointer, relative to where she is on screen
      const hx = (vimo.head.x / size.width) * 2 - 1, hy = (vimo.head.y / size.height) * 2 - 1;
      lx = THREE.MathUtils.clamp((st.pointer.x - hx) * 0.9, -0.7, 0.7);
      ly = THREE.MathUtils.clamp((st.pointer.y - hy) * 0.9, -0.8, 0.8) + F.look[1] * 0.4;
    } else if (talking) { lx *= 0.4; ly *= 0.6; }
    // tiny eye darts keep her alive
    lx += Math.sin(t * 0.7) * 0.06 + (Math.sin(t * 3.1) > 0.97 ? 0.15 : 0);
    const k = 1 - Math.exp(-dt * 6);
    st.look.x += (lx - st.look.x) * k;
    st.look.y += (ly - st.look.y) * k;

    // she turns a little toward where she's flying, then back to face you
    const turnTarget = THREE.MathUtils.clamp(st.vx * 0.12 / Math.max(st.s, 0.3), -0.8, 0.8);
    st.turn += (turnTarget - st.turn) * (1 - Math.exp(-dt * 5));
    nova.root.rotation.y = st.turn;

    const accentAge = st.accent ? now - st.accent.at : 99;
    if (accentAge > 2.5) st.accent = null;
    nova.update(dt, t, {
      pose,
      vx: st.vx / Math.max(st.s, 0.3), vy: st.vy / Math.max(st.s, 0.3),
      speed: Math.min(3, speed),
      look: st.look,
      calm: reduced,
      glowHue: F.hue,
      face,
      talk: st.talk,
      accent: st.accent ? { kind: st.accent.kind, age: accentAge } : null,
      mood: F.mood,
      dizzy: gesture === 'dizzy',
    });

    publishHit(st, camera, size, halfH);
    nova.head.getWorldPosition(v).project(camera);
    vimo.head.x = (v.x * 0.5 + 0.5) * size.width;
    vimo.head.y = (-v.y * 0.5 + 0.5) * size.height;
    vimo.head.r = (0.56 * FIT * st.s / (2 * halfH)) * size.height;
    vimo.head.right = right;
    if (vimo.highFive) {
      (right ? nova.handR : nova.handL).getWorldPosition(v).project(camera);
      vimo.hit.hx = (v.x * 0.5 + 0.5) * size.width;
      vimo.hit.hy = (-v.y * 0.5 + 0.5) * size.height;
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        <group scale={FIT} position={[0, FOOT * FIT, 0]}>
          <primitive object={nova.root} />
        </group>
      </group>
    </group>
  );
}
