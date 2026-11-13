/*
  Bridge between the Final version's story (beats.json) and this app's 3D world.

  Both apps were built from the same Story Script, so beat ids match ("2.4-b10" is the same moment
  in both). Every Final beat plays inside this app's 3D stage for the same id. Beats that only exist
  in the Final version (big questions, answers, 4.3-b7b) borrow the stage of the beat just before.
  The Act 2 quick tour has its own 3D scene (TourScene).
*/
import { beats as stageBeats, beatIndex as stageIndex } from '../story/beats';
import type { Beat as StageBeat, TryItId } from '../data/types';
import type { Beat } from './types';
import data from './beats.json';
import script from './script.json';
import sitesData from './sites.json';
import machineData from './machines.json';
import type { Line, Machine } from './types';

/** Team review mode: ?facts=all shows hidden (unverified) lines, tagged. */
export const REVIEW_FACTS = typeof location !== 'undefined' && new URLSearchParams(location.search).get('facts') === 'all';

export const MACHINES: Record<string, Machine> = Object.fromEntries(
  (machineData as unknown as { machines: Machine[] }).machines.map((m) => [m.id, m]),
);

/** Lines that rely on unchecked facts never show (Final version hard rule). Empty beats are skipped. */
function prepare(all: Beat[]): Beat[] {
  const ok = (l: Line | null | undefined) => !!l && (REVIEW_FACTS || l.verified !== false);
  const out: Beat[] = [];
  for (const raw of all) {
    const b = {
      ...raw,
      lines: raw.lines.filter(ok),
      tryIt: raw.tryIt ? { ...raw.tryIt, learn: ok(raw.tryIt.learn) ? raw.tryIt.learn : null } : null,
    };
    if (b.lines.length > 0 || b.tryIt || b.video || b.card) { out.push(b); continue; }
    if (b.stamp && out.length) {
      const prev = out[out.length - 1];
      out[out.length - 1] = { ...prev, stamp: prev.stamp ?? b.stamp };
    }
  }
  return out;
}

/*
  Story order (team script, 13 Nov 2026):
    intro on the rooftop → blast off → through the atmosphere and ozone layer → the solar system →
    quick tours (Moon, Mars, deep space: fast and cinematic) → the lobby (pick a world: Story or Experience) →
    a world's detailed story → "Experience mode or keep going?" → next world … → home (inspiring ending).
  The Final version's own opening (1.1–1.3) and globe tour are replaced by the team's intro and quick tours.
  Each world keeps the Final version's stops, big question and answer.
*/
const ALL = prepare((data as unknown as { beats: Beat[] }).beats);
const SCRIPT = script as unknown as { intro: Beat[]; after: Beat };
const range = (first: string, last: string) => {
  const a = ALL.findIndex((b) => b.id === first), z = ALL.findIndex((b) => b.id === last);
  return a < 0 || z < 0 ? [] : ALL.slice(a, z + 1);
};
const afterBeat = (w: 'moon' | 'mars' | 'deep', stage: string): Beat => {
  const j = JSON.stringify(SCRIPT.after).replace(/\{world\}/g, w);
  return { ...(JSON.parse(j) as Beat), world: w, after: w, year: 2026, stage: { from: stage }, cameraT: 0 };
};

export const WORLD_FIRST = { moon: 'moon-question', mars: 'mars-question', deep: 'deep-question', home: '4.2-b4' } as const;
export const BEATS: Beat[] = [
  ...SCRIPT.intro.map((b) => ({ ...b, cameraT: 0 })),
  ...range('moon-question', '2.8-b21'), afterBeat('moon', '2.8-b21'),
  ...range('mars-question', '3.6-b20'), afterBeat('mars', '3.6-b20'),
  ...range('deep-question', 'deep-answer'), afterBeat('deep', '4.1b-b3b'),
  ...range('4.2-b4', '4.3-b8'),
];

/** The main machines of a world in year order (quick tours, lobby stamps). */
export function worldMachines(w: 'moon' | 'mars' | 'deep'): Machine[] {
  return Object.values(MACHINES).filter((m) => m.path === 'main' && m.world === w).sort((a, b) => a.year - b.year);
}
/** Seconds each machine stays on screen in a quick tour. */
export const QUICK_EACH = 2.6;

/*
  Where each machine is (team's "Where We Left Them" map, checked Nov 2026: landing and impact coordinates
  from NASA mission records, NSSDCA). Moon/Mars: lat/lon in degrees, east positive. Deep space: the probe's
  real direction (ecliptic longitude/latitude) and its distance in AU. LRO has no pin: it orbits the Moon.
*/
export type Spot = { body: 'moon' | 'mars'; lat: number; lon: number } | { body: 'deep'; lam: number; beta: number; au: number } | { body: 'orbit' };
const SITES = sitesData as unknown as {
  moon: { sites: { lat: number; lon: number; label: string; pins: { name: string; year: number }[] }[] };
  mars: { sites: { lat: number; lon: number; label: string; pins: { name: string; year: number }[] }[] };
  space: { kind: string; entry: string; lam?: number; beta?: number; au?: number }[];
};
const SITE_OF: Record<string, [('moon' | 'mars'), string]> = {
  ranger7: ['moon', 'Ranger 7'], surveyor1: ['moon', 'Surveyor 1'], surveyor3: ['moon', 'Surveyor 3'],
  'apollo12-intrepid': ['moon', 'Apollo 12 — Intrepid'], 'apollo11-eagle': ['moon', 'Apollo 11 — Eagle'],
  'laser-mirror': ['moon', 'Apollo 11 — Eagle'], 'apollo15-rover': ['moon', 'Apollo 15 — Falcon + Rover 1'],
  apollo17: ['moon', 'Apollo 17 — Challenger + Rover 3'],
  viking1: ['mars', 'Viking 1 Lander'], 'pathfinder-sojourner': ['mars', 'Pathfinder + Sojourner'],
  opportunity: ['mars', 'Opportunity rover'], curiosity: ['mars', 'Curiosity rover'], insight: ['mars', 'InSight lander'],
  'perseverance-parachute': ['mars', 'Landing leftovers'], ingenuity: ['mars', 'Ingenuity helicopter'], 'perseverance-depot': ['mars', 'Three Forks sample depot'],
};
const PROBE_OF: Record<string, string> = { pioneer10: 'Pioneer 10', voyager2: 'Voyager 2', voyager1: 'Voyager 1', 'new-horizons': 'New Horizons' };
export function spotOf(machineId: string): Spot | null {
  const s = SITE_OF[machineId];
  if (s) {
    const site = SITES[s[0]].sites.find((x) => x.pins.some((p) => p.name === s[1]));
    return site ? { body: s[0], lat: site.lat, lon: site.lon } : null;
  }
  const p = PROBE_OF[machineId];
  if (p) {
    const e = SITES.space.find((x) => x.entry === p && x.kind === 'escape');
    return e ? { body: 'deep', lam: e.lam!, beta: e.beta!, au: e.au! } : null;
  }
  return machineId === 'lro' ? { body: 'orbit' } : null;
}
/** The hardware's name on the team's "Where We Left Them" map (public/map), so the story can select it there. */
export function mapPinName(machineId: string): string | null {
  return SITE_OF[machineId]?.[1] ?? PROBE_OF[machineId] ?? (machineId === 'lro' ? 'Lunar Reconnaissance Orbiter' : null);
}

/** Every site on the map (the main story's machines and all the others), for the faint background pins. */
export const ALL_SITES = { moon: SITES.moon.sites, mars: SITES.mars.sites };

/** What a machine says about itself after its video (its current status, from its checked status line). */
export function statusLine(machineId: string): Line | null {
  const m = MACHINES[machineId];
  if (!m?.statusLabel) return null;
  // "Curiosity + landing leftovers" speaks as Curiosity; the status keeps its NASA date (accuracy rule 4)
  const en = `I'm ${m.name.replace(/ \+ .*$/, '')}. ${/[.!?]$/.test(m.statusLabel) ? m.statusLabel : `${m.statusLabel}.`}`;
  return { id: `status.${machineId}`, speaker: 'machine', emotion: 'proud', text: { en, bn: `TODO(bn): ${en}` }, sourceIds: m.statusFacts };
}

/** Final machine id → this app's machine id (Logbook stamps, info cards, 3D model bubbles). */
const ID_MAP: Record<string, string> = {
  'laser-mirror': 'apollo11-mirror',
  apollo17: 'apollo17-challenger',
  'pathfinder-sojourner': 'sojourner',
  'perseverance-parachute': 'landing-leftovers',
  'perseverance-depot': 'three-forks',
};
export const appMachineId = (finalId: string) => ID_MAP[finalId] ?? finalId;

/** The 3D stage beat for a story beat: its own `stage` (with overrides), else the same id, else the closest earlier one. */
const overrides = new Map<string, StageBeat>();
export function stageBeatFor(i: number): StageBeat {
  const own = BEATS[i]?.stage;
  if (own) {
    const key = BEATS[i].id;
    if (!overrides.has(key)) {
      const base = stageBeats[stageIndex[own.from]] ?? stageBeats[0];
      overrides.set(key, { ...base, ...(own.fx ? { fx: own.fx } : {}), ...(own.era ? { era: own.era as StageBeat['era'] } : {}), ...(own.scene ? { scene: own.scene } : {}) });
    }
    return overrides.get(key)!;
  }
  const own3d = (k: number) => (BEATS[k]?.stage ? stageBeatFor(k) : stageIndex[BEATS[k]?.id] != null ? stageBeats[stageIndex[BEATS[k].id]] : null);
  const direct = own3d(i);
  if (direct) return direct;
  // a big question opens a world: use the world's first stop; an answer or wrap-up: the stop before it
  for (let k = i + 1; k < Math.min(BEATS.length, i + 4) && BEATS[k].world === BEATS[i].world; k++) { const s = own3d(k); if (s) return s; }
  for (let k = i - 1; k >= 0; k--) { const s = own3d(k); if (s) return s; }
  return stageBeats[0];
}

/*
  Final Try it id → this app's hands-on activity. Only where the activity teaches the same idea with
  facts the Final version keeps. Left out on purpose: 'blueberries' (fact cut in the Final review),
  activities with no "done" moment. Those use the simple tap from the Final version.
*/
export const TRY_MAP: Record<string, TryItId> = {
  ready: 'ready',
  'fall-ranger7': 'ranger-fall',
  'land-softly': 'soft-land',
  'ring-moon': 'ring-moon',
  'call-moon': 'laser',
  'find-leftovers': 'find-leftovers',
  'message-mars': 'mars-message',
  'drive-sojourner': 'drive-sojourner',
  marsquake: 'marsquake',
  'crack-code': 'parachute-code',
  'fly-ingenuity': 'fly-ingenuity',
  'count-tubes': 'count-tubes',
  'planet-parade': 'planet-parade',
  'find-heart': 'pluto-heart',
};

/** Hands-on activities that take longer than 5 s: VIMO waits while the kid is busy (every touch restarts the wait). */
export const LONG_TRY = new Set<TryItId>(['drive-sojourner', 'parachute-code', 'fly-ingenuity', 'count-tubes', 'planet-parade', 'mars-message', 'soft-land', 'laser']);
