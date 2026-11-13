// Voice for the seamless story (Final version lines) with ElevenLabs "speech with timestamps".
// Writes public/audio/vo2/<lang>/<lineId>.mp3 and puts file + word timings into src/seamless/media.json,
// so VIMO's mouth, the captions and the auto-advance all follow the real audio.
//
//   npm run voice                         dry run: what would be voiced + character count (no API call, no cost)
//   npm run voice -- --go --limit 3       voice the first 3 missing lines (listen before doing the rest)
//   npm run voice -- --go                 voice every missing line (spends ElevenLabs credit)
//   npm run voice -- --go --only 2.4-b10.01,2.4-b11.02
//   npm run voice -- --lang bn --go       Bangla (only lines whose Bangla is approved, i.e. not TODO(bn))
//
// .env (git-ignored, never printed): ELEVENLABS_API_KEY, ELEVENLABS_VIMO_VOICE_ID,
// ELEVENLABS_KID_VOICE_ID (optional), ELEVENLABS_MACHINE_VOICE_ID (optional), ELEVENLABS_MODEL_ID.
// Lines already voiced are skipped, so a stopped run can simply be started again.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const go = flag('go');
const lang = opt('lang') || 'en';
const limit = opt('limit') ? Number(opt('limit')) : Infinity;
const only = opt('only') ? new Set(opt('only').split(',')) : null;

const env = {};
const envPath = new URL('.env', root);
if (existsSync(envPath)) for (const l of readFileSync(envPath, 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const KEY = env.ELEVENLABS_API_KEY;
/*
  The cast, as the team chose it (Story Script "Voice direction" + doc 07 §2, 12 Nov):
  - VIMO: one locked voice for the whole project. Warm young woman (20–25), a friendly older sister,
    soft smile, gentle South Asian warmth, talks to one friend, not a crowd.
  - Kid questions: an American curious-kid voice (ELEVENLABS_KID_VOICE_ID). Without one, VIMO does a
    "kid voice" and the app lifts the pitch a little on playback.
  - Machines: an older, confident voice (ELEVENLABS_MACHINE_VOICE_ID); the app adds a radio beep, a light
    metallic "hardware" colour and an era filter (1960s old radio, 1970s warm tape, later digital, today clean).
  All voices American English (team decision, 13 Nov 2026: no South Asian accent).
*/
const VOICES = {
  vimo: env.ELEVENLABS_VIMO_VOICE_ID || env.ELEVENLABS_VOICE_ID,
  kid: env.ELEVENLABS_KID_VOICE_ID || env.ELEVENLABS_VIMO_VOICE_ID || env.ELEVENLABS_VOICE_ID,
  machine: env.ELEVENLABS_MACHINE_VOICE_ID || env.ELEVENLABS_VIMO_VOICE_ID || env.ELEVENLABS_VOICE_ID,
};
// doc 07: Eleven v3 (audio tags; Bengali is confirmed only for v3)
const MODEL = lang === 'bn' ? (env.ELEVENLABS_BN_MODEL_ID || 'eleven_v3') : (env.ELEVENLABS_MODEL_ID || 'eleven_v3');
const TAGS_OK = /^eleven_v[34]/.test(MODEL); // older models would read "[curious]" out loud

// doc 07 §3 pacing, as TTS speed around the locked 0.95 (normal story 135–145 wpm)
const SPEED = {
  curious: 0.95, wonder: 0.9, excited: 1.04, explaining: 0.93, tense: 0.92, playful: 1.0,
  proud: 0.95, 'gentle-sad': 0.88, reassuring: 0.93, hopeful: 0.95,
};
// a curious kid talks a bit quicker; machines are older and unhurried
const speedFor = (l) => Math.min(1.2, Math.max(0.7, (SPEED[l.emotion] ?? 0.95) + (l.speaker === 'kid' ? 0.06 : l.speaker === 'machine' ? -0.03 : 0)));

// Audio tags per line from the Final version's sheet (doc 07 §4: at most one, never on a fact line)
const csv = readFileSync(new URL('docs/final/lines.csv', root), 'utf8');
const TAG = {};
for (const row of csv.split(/\r?\n/).slice(1)) {
  const m = row.match(/^"([^"]+)","(?:[^"]|"")*","[^"]*","([^"]*)"/);
  if (m && m[2]) TAG[m[1]] = m[2];
}

// --- numbers as words for the voice (captions keep the digits), from the Final version's doc 07 rule
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const under1000 = (n) => { const h = Math.floor(n / 100), r = n % 100; const rest = r < 20 ? (r ? ONES[r] : '') : TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ''); return [h ? `${ONES[h]} hundred` : '', rest].filter(Boolean).join(' ') || 'zero'; };
const words = (n) => { if (n === 0) return 'zero'; const p = []; for (const [v, name] of [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']]) if (n >= v) { p.push(`${under1000(Math.floor(n / v))} ${name}`); n %= v; } if (n) p.push(under1000(n)); return p.join(' '); };
const year = (y) => { if (y >= 2000 && y < 2010) return `two thousand${y % 10 ? ` ${ONES[y % 10]}` : ''}`; const a = Math.floor(y / 100), b = y % 100; return `${words(a)} ${b === 0 ? 'hundred' : b < 10 ? `oh ${ONES[b]}` : words(b)}`; };
const ORD = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };
const ordinal = (n) => { const w = words(n).split(/([ -])/); const last = w.pop(); return w.join('') + (ORD[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`)); };
const MONTHS = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Sept: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
const toSpoken = (t) => t
  // "(NASA, Sept 2026)" on a status sticker → said out loud as "as NASA said in September 2026"
  .replace(/\s*\(NASA, ([^)]+)\)/g, ', as NASA said in $1')
  .replace(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)\b\.?(?=\s+\d)/g, (m, a) => MONTHS[a])
  .replace(/\b(\d+)(?:st|nd|rd|th)\b/g, (_, n) => ordinal(Number(n)))
  .replace(/(\d+(?:,\d{3})+|\d+)\.(\d+)/g, (_, a, b) => `${words(Number(a.replace(/,/g, '')))} point ${b.split('').map((d) => ONES[d]).join(' ')}`)
  .replace(/\b(1[89]\d\d|20\d\d)\b/g, (y) => year(Number(y)))
  .replace(/\b\d{1,3}(?:,\d{3})+\b|\b\d+\b/g, (m) => words(Number(m.replace(/,/g, ''))));

// --- the lines the app shows (unverified lines are never voiced)
// Story order (src/seamless/bridge.ts): the team's intro + quick tours + lobby (script.json), the Final version's
// worlds (beats.json, minus its own opening 1.1–1.3 and globe tour), "what next?" after each world, and each
// machine's status line (machines.json statusLabel, same wording as statusLine() in bridge.ts).
const beats = JSON.parse(readFileSync(new URL('src/seamless/beats.json', root), 'utf8')).beats
  .filter((b) => !/^(1\.[123]-|tour-)/.test(b.id));
const script = JSON.parse(readFileSync(new URL('src/seamless/script.json', root), 'utf8'));
const machines = JSON.parse(readFileSync(new URL('src/seamless/machines.json', root), 'utf8')).machines;
const all = [];
for (const b of script.intro) for (const l of b.lines) all.push(l);
for (const b of beats) {
  for (const l of b.lines) all.push(l);
  if (b.tryIt?.learn) all.push(b.tryIt.learn);
}
for (const w of ['moon', 'mars', 'deep']) for (const l of script.after.lines) all.push(JSON.parse(JSON.stringify(l).replace(/\{world\}/g, w)));
for (const m of machines.filter((x) => x.path === 'main' && x.card && x.statusLabel)) {
  const label = /[.!?]$/.test(m.statusLabel) ? m.statusLabel : `${m.statusLabel}.`;
  all.push({ id: `status.${m.id}`, speaker: 'machine', emotion: 'proud', text: { en: `I'm ${m.name.replace(/ \+ .*$/, '')}. ${label}` }, sourceIds: m.statusFacts, year: m.year });
}
const shown = all.filter((l) => l.verified !== false && l.text?.en);
const mediaPath = new URL('src/seamless/media.json', root);
const media = JSON.parse(readFileSync(mediaPath, 'utf8'));
media.voice[lang] ??= {};

const todo = [];
for (const l of shown) {
  if (only && !only.has(l.id)) continue;
  if (media.voice[lang][l.id] && existsSync(new URL(`public/${media.voice[lang][l.id].file}`, root))) continue;
  const text = lang === 'en' ? l.text.en : l.text.bn;
  if (!text || text.startsWith('TODO(bn)')) continue;
  const tag = TAGS_OK && TAG[l.id] && !(l.sourceIds?.length) ? `${TAG[l.id]} ` : '';
  todo.push({ id: l.id, speaker: l.speaker, emotion: l.emotion, caption: text, tag, spoken: tag + (lang === 'en' ? toSpoken(text) : text) });
}
const batch = todo.slice(0, limit);
const chars = batch.reduce((n, l) => n + l.spoken.length, 0);
console.log(`${lang}: ${shown.length} shown lines, ${todo.length} still to voice; this run: ${batch.length} lines, ${chars} characters, model ${MODEL}.`);
if (!go) {
  const who = (s) => (s === 'machine' && env.ELEVENLABS_MACHINE_VOICE_ID ? 'machine voice' : s === 'kid' ? (env.ELEVENLABS_KID_VOICE_ID ? 'kid voice' : 'VIMO kid voice') : 'VIMO');
  console.log(`  cast: VIMO = locked VIMO voice${VOICES.vimo ? '' : ' (MISSING)'}; kid = ${env.ELEVENLABS_KID_VOICE_ID ? 'kid voice' : 'VIMO, faster + higher'}; machines = ${env.ELEVENLABS_MACHINE_VOICE_ID ? 'team machine voice' : 'VIMO voice'} + era filter. Audio tags: ${TAGS_OK ? 'on' : 'off (model has none)'}.`);
  batch.slice(0, 10).forEach((l) => console.log(`  ${l.id} [${who(l.speaker)}, ${l.emotion}, speed ${speedFor(l).toFixed(2)}]: ${l.spoken}`));
  if (batch.length > 10) console.log(`  … and ${batch.length - 10} more`);
  console.log('Dry run: nothing sent. Add --go to generate (spends ElevenLabs credit).');
  process.exit(0);
}
if (!KEY || !VOICES.vimo) { console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VIMO_VOICE_ID in .env'); process.exit(1); }

/** Word start times from ElevenLabs character alignment, mapped onto the caption's words. */
function wordTimes(alignment, spoken, caption) {
  const chars = alignment?.characters ?? [];
  const starts = alignment?.character_start_times_seconds ?? [];
  const spokenStarts = [];
  let inWord = false, inTag = false;
  for (let i = 0; i < chars.length; i++) {
    // audio tags like "[curious]" are not spoken words: never give them a caption word
    if (chars[i] === '[') inTag = true;
    if (inTag) { if (chars[i] === ']') inTag = false; inWord = false; continue; }
    const space = /\s/.test(chars[i]);
    if (!space && !inWord) spokenStarts.push(starts[i] ?? 0);
    inWord = !space;
  }
  const capWords = caption.trim().split(/\s+/).filter(Boolean);
  if (!spokenStarts.length) return null;
  // numbers become several spoken words: spread caption words over the spoken word times by position
  return capWords.map((w, i) => {
    const k = capWords.length === spokenStarts.length ? i : Math.round((i / Math.max(1, capWords.length - 1)) * (spokenStarts.length - 1));
    return { w, t: +(spokenStarts[k] ?? 0).toFixed(3) };
  });
}

const outDir = new URL(`public/audio/vo2/${lang}/`, root);
mkdirSync(outDir, { recursive: true });
for (const [i, l] of batch.entries()) {
  const voice = VOICES[l.speaker] || VOICES.vimo;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'content-type': 'application/json' },
    // one locked voice per speaker; stability mid, style low, a touch slower for kids (doc 07 §2)
    body: JSON.stringify({ text: l.spoken, model_id: MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.1, speed: speedFor(l) } }),
  });
  if (!res.ok) {
    console.error(`${l.id}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    writeFileSync(mediaPath, JSON.stringify(media, null, 1));
    process.exit(1);
  }
  const d = await res.json();
  writeFileSync(new URL(`${l.id}.mp3`, outDir), Buffer.from(d.audio_base64, 'base64'));
  media.voice[lang][l.id] = {
    file: `audio/vo2/${lang}/${l.id}.mp3`,
    words: wordTimes(d.alignment ?? d.normalized_alignment, l.spoken, l.caption) ?? undefined,
    // a kid line read by VIMO's own voice (no separate kid voice): the app lifts the pitch a little
    ...(l.speaker === 'kid' && !env.ELEVENLABS_KID_VOICE_ID ? { pitchUp: true } : {}),
  };
  // save after every line so a stopped run keeps what it made
  writeFileSync(mediaPath, JSON.stringify(media, null, 1));
  console.log(`[${i + 1}/${batch.length}] ${l.id} ✓`);
}
console.log('Done. Restart `npm run dev` (it does not watch public/audio), then reload: the voice, VIMO\'s mouth and the captions follow the audio.');
