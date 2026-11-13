// VIMO TV explainer clips with Google Veo (Gemini API), from the shot prompts in docs/final/05-explainer-videos.md.
// Each video = up to 6 shots of 8 s. The clips are saved as public/assets/video/<machineId>/shot-<n>.mp4 and
// listed in src/seamless/media.json; VIMO TV plays them one after another (no video editor needed).
//
//   npm run video                                  dry run: every video and shot, what would be made (no API call, no cost)
//   npm run video -- --only apollo11-eagle         dry run for one video
//   npm run video -- --only apollo11-eagle --go    make that video's missing shots (spends Veo credit)
//   npm run video -- --only apollo11-eagle --go --shots 1,2
//
// Rules from docs/05 (Google Flow workflow), kept here:
//   [I] shots: made from the prompt + the style prompt.
//   [F] hardware shots MUST start from a picture of the NASA 3D model, so the machine keeps its real shape.
//       Put that start frame at video-frames/<machineId>/<shot>.png (or .jpg). No frame = the shot is skipped.
//   [P] shots are real NASA photos, never generated: skipped here (the card shows the NASA photo).
// Reject any clip where the hardware changes shape, gains parts or shows text: delete it and run again.
//
// .env (git-ignored, never printed): GEMINI_API_KEY (or GOOGLE_API_KEY), VEO_MODEL (optional).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const go = flag('go');
const only = opt('only');
const shotsWanted = opt('shots') ? new Set(opt('shots').split(',').map(Number)) : null;

const env = {};
const envPath = new URL('.env', root);
if (existsSync(envPath)) for (const l of readFileSync(envPath, 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const KEY = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
const MODEL = env.VEO_MODEL || 'veo-3.0-fast-generate-001';
const API = 'https://generativelanguage.googleapis.com/v1beta';

// --- docs/05: videos in order, numbered 01..21
const ORDER = ['ranger7', 'surveyor1', 'surveyor3', 'apollo12-intrepid', 'apollo11-eagle', 'laser-mirror', 'apollo15-rover', 'apollo17', 'lro',
  'viking1', 'pathfinder-sojourner', 'opportunity', 'curiosity', 'insight', 'perseverance-parachute', 'ingenuity', 'perseverance-depot',
  'pioneer10', 'voyager2', 'voyager1', 'new-horizons'];
const doc = readFileSync(new URL('docs/final/05-explainer-videos.md', root), 'utf8');
const STYLE = (doc.match(/### Style prompt[^\n]*\n+```\n([\s\S]*?)\n```/) ?? [])[1]?.trim() ?? '';
const VIMO_DESC = 'VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack';

const videos = [];
for (const sec of doc.split(/\n(?=### \d\d · )/).slice(1)) {
  const head = sec.match(/^### (\d\d) · (.*)$/m);
  if (!head) continue;
  const n = Number(head[1]);
  const notVideo = /Card story, not a video/.test(head[2]);
  const shots = [];
  for (const row of sec.split('\n').filter((l) => /^\| \d /.test(l))) {
    const cells = row.split(/(?<!\\)\|/).map((c) => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
    const num = Number(cells[0].match(/^\d+/)[0]);
    const visual = cells[1].replace(/\\\[/g, '[').replace(/\\\]/g, ']');
    const kind = (visual.match(/^\[(I|F|P)\]/) ?? [])[1] ?? 'I';
    shots.push({ num, kind, visual: visual.replace(/^\[(I|F|P)\]\s*/, ''), line: cells[2] });
  }
  videos.push({ n, machineId: ORDER[n - 1], title: head[2].replace(/ · \d+ s$/, ''), notVideo, shots });
}

const mediaPath = new URL('src/seamless/media.json', root);
const media = JSON.parse(readFileSync(mediaPath, 'utf8'));
media.video ??= {};

function framePath(machineId, num) {
  for (const ext of ['png', 'jpg', 'jpeg']) {
    const u = new URL(`video-frames/${machineId}/${num}.${ext}`, root);
    if (existsSync(u)) return { url: u, mime: ext === 'png' ? 'image/png' : 'image/jpeg' };
  }
  return null;
}
function promptFor(shot) {
  // "Start frame: ..." describes the frame we pass as an image; it stays in the prompt so Veo knows the scene to animate into
  const visual = shot.visual.replace(/Start frame:\s*/i, 'Begin exactly on the given start frame: ').replace(/\bVIMO\b/, VIMO_DESC);
  return `${visual} ${STYLE} Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.`;
}

const NEGATIVE = 'text, letters, captions, logos, watermark, real human faces, extra spacecraft parts, speech, narration, music';

// --prompts: write every shot's ready-to-paste prompt to docs/veo3-prompts.md (for making the clips by hand in Veo 3 / Google Flow)
if (flag('prompts')) {
  const out = [];
  const vids = videos.filter((v) => !v.notVideo);
  const count = (k) => vids.reduce((n, v) => n + v.shots.filter((s) => s.kind === k).length, 0);
  out.push('# Veo 3 prompts: every VIMO TV clip', '',
    `Made by \`npm run video -- --prompts\` from docs/final/05-explainer-videos.md. ${vids.length} videos, ${vids.reduce((n, v) => n + v.shots.length, 0)} shots: ${count('I')} prompt-only, ${count('F')} start-frame, ${count('P')} real NASA photo (never generated).`, '',
    '## Settings for every clip', '',
    '- Model: Veo 3 (Google Flow or Gemini). Aspect ratio **16:9**, length **8 seconds**.',
    '- **Turn the clip\'s own audio off** (or mute it): the app adds VIMO\'s voice, music and sound effects itself.',
    `- Negative prompt (if there is a field): \`${NEGATIVE}\``,
    '- **[F] shots:** use *Frames to Video* and upload the start frame named under the shot (a picture of the NASA 3D model or the team\'s labelled replica). Without it Veo invents the spacecraft, and the shape would be wrong.',
    '- **[I] shots:** *Text/Ingredients to Video*. If you use Ingredients, add one VIMO picture (front view) so she looks the same in every clip.',
    '- **[P] shots:** nothing to make. The app shows the real NASA photo there.',
    '- Reject a clip if the spacecraft changes shape, gains parts, or any text/letters appear. Make it again.', '',
    '## Where to put the clips', '',
    'Save each clip as `public/assets/video/<video id>/shot-<n>.mp4` (the exact path is under each shot), then run `npm run video -- --register` and restart `npm run dev`. VIMO TV plays a video\'s clips in order; missing shots are skipped.', '');
  for (const v of vids) {
    out.push(`## ${String(v.n).padStart(2, '0')} · ${v.title}`, '', `Video id: \`${v.machineId}\``, '');
    for (const s of v.shots) {
      const save = `public/assets/video/${v.machineId}/shot-${s.num}.mp4`;
      out.push(`### Shot ${s.num} · [${s.kind}] ${s.kind === 'F' ? 'start frame' : s.kind === 'P' ? 'real NASA photo' : 'prompt only'}`, '');
      if (s.line) out.push(`Line in this shot (for timing, not in the prompt): ${s.line.replace(/\s+/g, ' ')}`, '');
      if (s.kind === 'P') { out.push(`Nothing to make: ${s.visual}`, ''); continue; }
      if (s.kind === 'F') out.push(`Start frame: \`video-frames/${v.machineId}/${s.num}.png\` (${(s.visual.match(/Start frame:([^.]*)\./i) ?? [])[1]?.trim() || 'a render of the machine'})`, '');
      // by hand the scene description stays in the prompt: Veo animates the uploaded frame into it
      const scene = s.visual.replace(/Start frame:\s*/i, 'Begin exactly on the uploaded start frame: ').replace(/\bVIMO\b/, VIMO_DESC);
      out.push('```', `${scene} ${STYLE} Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.`, '```', '', `Save as: \`${save}\``, '');
    }
  }
  writeFileSync(new URL('docs/veo3-prompts.md', root), out.join('\n'));
  console.log(`Wrote docs/veo3-prompts.md (${vids.length} videos).`);
  process.exit(0);
}

// --register: add clips you made by hand (public/assets/video/<id>/shot-<n>.mp4) to media.json
if (flag('register')) {
  let n = 0;
  for (const v of videos.filter((x) => !x.notVideo)) {
    const clips = [];
    for (const s of v.shots) if (existsSync(new URL(`public/assets/video/${v.machineId}/shot-${s.num}.mp4`, root))) clips.push({ shot: s.num, src: `assets/video/${v.machineId}/shot-${s.num}.mp4`, seconds: 8 });
    if (clips.length) { media.video[v.machineId] = { clips, seconds: clips.length * 8, model: 'veo-3 (made by hand)' }; n += clips.length; console.log(`${v.machineId}: ${clips.map((c) => c.shot).join(', ')}`); }
  }
  writeFileSync(mediaPath, JSON.stringify(media, null, 1));
  console.log(`${n} clip(s) registered in src/seamless/media.json. Restart \`npm run dev\` to see them.`);
  process.exit(0);
}

const list = videos.filter((v) => !v.notVideo && (!only || v.machineId === only));
if (only && !list.length) { console.error(`No video for "${only}". Videos: ${videos.filter((v) => !v.notVideo).map((v) => v.machineId).join(', ')}`); process.exit(1); }

let plan = 0;
for (const v of list) {
  const done = new Set((media.video[v.machineId]?.clips ?? []).map((c) => c.shot));
  console.log(`\n${String(v.n).padStart(2, '0')} ${v.machineId}: ${v.title}`);
  for (const s of v.shots) {
    if (shotsWanted && !shotsWanted.has(s.num)) continue;
    let state;
    if (done.has(s.num) && existsSync(new URL(`public/assets/video/${v.machineId}/shot-${s.num}.mp4`, root))) state = 'made';
    else if (s.kind === 'P') state = 'skip: real NASA photo, never generated';
    else if (s.kind === 'F' && !framePath(v.machineId, s.num)) state = `skip: needs start frame video-frames/${v.machineId}/${s.num}.png (NASA model render)`;
    else { state = 'to make'; plan++; s.todo = true; }
    console.log(`  [${s.kind}] shot ${s.num}: ${state}`);
  }
}
console.log(`\n${plan} shot(s) to make with ${MODEL} (8 s each).`);
if (!go) { console.log('Dry run: nothing sent. Add --only <machineId> --go to make one video (spends Veo credit).'); process.exit(0); }
if (!only) { console.error('For safety, --go needs --only <machineId> (one video at a time, then check the clips).'); process.exit(1); }
if (!KEY) { console.error('Missing GEMINI_API_KEY in .env'); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const v of list) {
  const outDir = new URL(`public/assets/video/${v.machineId}/`, root);
  mkdirSync(outDir, { recursive: true });
  for (const s of v.shots.filter((x) => x.todo)) {
    const instance = { prompt: promptFor(s) };
    const frame = s.kind === 'F' ? framePath(v.machineId, s.num) : null;
    if (frame) instance.image = { bytesBase64Encoded: readFileSync(frame.url).toString('base64'), mimeType: frame.mime };
    const res = await fetch(`${API}/models/${MODEL}:predictLongRunning`, {
      method: 'POST',
      headers: { 'x-goog-api-key': KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ instances: [instance], parameters: { aspectRatio: '16:9', negativePrompt: 'text, letters, captions, logos, watermark, real human faces, extra spacecraft parts' } }),
    });
    if (!res.ok) { console.error(`shot ${s.num}: HTTP ${res.status} ${(await res.text()).slice(0, 400)}`); process.exit(1); }
    let op = await res.json();
    process.stdout.write(`shot ${s.num}: generating`);
    while (!op.done) {
      await sleep(10000);
      process.stdout.write('.');
      const r = await fetch(`${API}/${op.name}`, { headers: { 'x-goog-api-key': KEY } });
      if (!r.ok) { console.error(`\npoll: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`); process.exit(1); }
      op = await r.json();
    }
    if (op.error) { console.error(`\nshot ${s.num}: ${op.error.message}`); process.exit(1); }
    const uri = op.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
    if (!uri) { console.error(`\nshot ${s.num}: no video in the answer (it may have been filtered). ${JSON.stringify(op.response ?? {}).slice(0, 300)}`); process.exit(1); }
    const file = await fetch(uri, { headers: { 'x-goog-api-key': KEY } });
    if (!file.ok) { console.error(`\nshot ${s.num}: download HTTP ${file.status}`); process.exit(1); }
    writeFileSync(new URL(`shot-${s.num}.mp4`, outDir), Buffer.from(await file.arrayBuffer()));
    const clips = (media.video[v.machineId]?.clips ?? []).filter((c) => c.shot !== s.num);
    clips.push({ shot: s.num, src: `assets/video/${v.machineId}/shot-${s.num}.mp4`, seconds: 8 });
    clips.sort((a, b) => a.shot - b.shot);
    media.video[v.machineId] = { clips, seconds: clips.length * 8, model: MODEL };
    writeFileSync(mediaPath, JSON.stringify(media, null, 1));
    console.log(' ✓');
  }
}
console.log('Done. Restart `npm run dev` (it does not watch public/assets), then watch every clip: delete any where the machine changes shape or shows text, then run again.');
