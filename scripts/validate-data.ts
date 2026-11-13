// Data checks run by `npm test` (Build Spec §12 quality checks, data part).
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { machines } from '../src/data/machines.ts';
import { beats } from '../src/story/beats.ts';
import { hubs, sidetrips } from '../src/story/sidetrips.ts';
import { EXPERIENCES } from '../src/experience/experiences.ts';
import { allLines } from './lines.ts';

const root = new URL('..', import.meta.url);
const file = (rel: string) => fileURLToPath(new URL(rel, root));
const photos = JSON.parse(readFileSync(file('src/data/photos.json'), 'utf8'));
const ids = new Set(machines.map((m) => m.id));
let fail = 0;
const check = (ok: unknown, msg: string) => { if (!ok) { fail++; console.log('✗', msg); } };

// machines
check(new Set(machines.map((m) => m.id)).size === machines.length, 'machine ids are unique');
for (const m of machines) {
  check(m.sources.length > 0, `${m.id} has at least one source`);
  for (const s of m.sources) check(/^https:\/\//.test(s.url), `${m.id} source is https: ${s.url}`);
  check(m.status && m.found, `${m.id} has a status and a discovery`);
  if (m.photo) check(photos[m.photo], `${m.id} photo ${m.photo} is resolved in photos.json`);
  // replicas are built in code (src/three/replicas.tsx) and must be labelled as not NASA models
  if (m.model?.endsWith('-replica')) check(m.nasaModel === false && /replica by Team VOID/i.test(m.modelNote || ''), `${m.id} replica is labelled`);
  else if (m.model && !m.model.startsWith('proc:')) check(existsSync(file(`public/assets/models/${m.model}.glb`)), `${m.id} model file exists`);
}
// beats
check(new Set(beats.map((b) => b.id)).size === beats.length, 'beat ids are unique');
for (const b of beats) {
  check(b.lines.length > 0, `${b.id} has narration`);
  for (const l of b.lines) {
    check(l.text.trim().length > 0, `${b.id} line has caption text`);
    if (l.who === 'machine') check(l.machine && ids.has(l.machine), `${b.id} machine line names a known machine`);
  }
  if (b.machine) check(ids.has(b.machine), `${b.id} machine ${b.machine} exists`);
  if (b.prop && b.stage !== 'deep' && b.stage !== 'pluto') check(ids.has(b.prop), `${b.id} prop ${b.prop} exists`);
  if (b.hub) check(hubs.some((h) => h.id === b.hub), `${b.id} hub ${b.hub} exists`);
}
// every machine reachable: main path stamp or side trip
const reach = new Set<string>();
beats.forEach((b) => b.stamp && b.machine && reach.add(b.machine));
sidetrips.forEach((t) => { reach.add(t.machine); t.also?.forEach((a) => reach.add(a)); });
for (const m of machines) check(reach.has(m.id), `${m.id} can be stamped (main path or side trip)`);
for (const h of hubs) for (const t of h.trips) check(sidetrips.some((s) => s.id === t), `hub ${h.id} trip ${t} exists`);
// experiences
for (const e of EXPERIENCES) check(ids.has(e.machine) || e.machine === 'dart', `experience ${e.id} machine exists`);
// audio manifest (if generated)
const mf = file('public/audio/vo/manifest.json');
if (existsSync(mf)) {
  const m = JSON.parse(readFileSync(mf, 'utf8'));
  for (const [k, v] of Object.entries<any>(m)) check(existsSync(file(`public/${v.file}`)), `audio file for ${k} exists`);
}
const lines = allLines();
console.log(`${machines.length} machines (${machines.filter((m) => m.path === 'main').length} main, ${machines.filter((m) => m.path === 'side').length} side), ${beats.length} beats, ${sidetrips.length} side trips, ${EXPERIENCES.length} experiences, ${lines.length} voice lines.`);
console.log(`${machines.reduce((a, m) => a + m.sources.length, 0)} source links (${machines.reduce((a, m) => a + m.sources.filter((s) => s.checked).length, 0)} checked).`);
console.log(fail ? `\n${fail} check(s) failed.` : '\nAll data checks passed ✓');
process.exit(fail ? 1 : 0);
