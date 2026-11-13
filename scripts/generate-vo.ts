/*
  Generate narration with the official ElevenLabs Text-to-Speech API.

  - Runs at BUILD time on your computer. The API key stays in .env (git-ignored)
    and is never shipped to the browser.
  - Caches every line by a hash of (text + voice + model + settings) in .vo-cache/,
    so identical lines are never paid for twice. Re-running is free for unchanged lines.
  - Writes public/audio/vo/<lang>/<line-id>.mp3 and public/audio/vo/manifest.json.
    The app picks the files up automatically; lines without a file fall back to the
    browser voice, then to captions only.

  Usage:
    node scripts/generate-vo.ts --dry-run          # count lines and characters (no API calls)
    node scripts/generate-vo.ts --limit 10         # try the first 10 lines
    node scripts/generate-vo.ts                    # generate everything (English)
*/
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { allLines, type VoLine } from './lines.ts';

const root = new URL('..', import.meta.url);
const p = (rel: string) => fileURLToPath(new URL(rel, root)) + (rel.endsWith('/') ? '' : '');

function loadEnv() {
  const f = p('.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const LIMIT = Number(args[args.indexOf('--limit') + 1]) || Infinity;
const LANG = 'en';
const KEY = process.env.ELEVENLABS_API_KEY;
const MODEL = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const VOICES = {
  vimo: process.env.ELEVENLABS_VIMO_VOICE_ID,
  kid: process.env.ELEVENLABS_KID_VOICE_ID || process.env.ELEVENLABS_VIMO_VOICE_ID,
  machine: process.env.ELEVENLABS_MACHINE_VOICE_ID,
};
// Warm, smiling storyteller; kid questions a little livelier; machines steadier.
const SETTINGS = {
  vimo: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 0.95 },
  kid: { stability: 0.3, similarity_boost: 0.75, style: 0.6, use_speaker_boost: true, speed: 1.05 },
  machine: { stability: 0.75, similarity_boost: 0.7, style: 0.1, use_speaker_boost: true, speed: 0.95 },
};

const lines = allLines().slice(0, LIMIT);
const chars = lines.reduce((a, l) => a + l.text.length, 0);
console.log(`${lines.length} lines, ${chars.toLocaleString()} characters (model ${MODEL}).`);
if (DRY) process.exit(0);
if (!KEY || !VOICES.vimo || !VOICES.machine) {
  console.error('Missing ELEVENLABS_API_KEY, ELEVENLABS_VIMO_VOICE_ID or ELEVENLABS_MACHINE_VOICE_ID in .env (see .env.example).');
  process.exit(1);
}

const cacheDir = p('.vo-cache/');
const outDir = p(`public/audio/vo/${LANG}/`);
mkdirSync(cacheDir, { recursive: true });
mkdirSync(outDir, { recursive: true });
const manifestFile = p('public/audio/vo/manifest.json');
const manifest: Record<string, { file: string; chars: number }> = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : {};

// ElevenLabs needs the words, not our caption punctuation for pauses.
const speakable = (t: string) => t.replace(/\.\.\./g, '…');

async function tts(l: VoLine): Promise<Buffer> {
  const voice = VOICES[l.who]!;
  const body = JSON.stringify({ text: speakable(l.text), model_id: MODEL, voice_settings: SETTINGS[l.who] });
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: 'POST', headers: { 'xi-api-key': KEY!, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body,
    });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    // 409 = library voice still being added to the account by a parallel request
    if (r.status === 409 || r.status === 429 || r.status >= 500) { await new Promise((res) => setTimeout(res, 2000 * (attempt + 1))); continue; }
    throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
  }
  throw new Error('ElevenLabs: too many retries');
}

let made = 0, cached = 0;
const queue = [...lines];
async function worker() {
  while (queue.length) {
    const l = queue.shift()!;
    const voice = VOICES[l.who];
    const hash = createHash('sha256').update(JSON.stringify([l.text, voice, MODEL, SETTINGS[l.who]])).digest('hex').slice(0, 24);
    const cacheFile = `${cacheDir}${hash}.mp3`;
    if (!existsSync(cacheFile)) { writeFileSync(cacheFile, await tts(l)); made++; process.stdout.write('+'); }
    else { cached++; process.stdout.write('.'); }
    copyFileSync(cacheFile, `${outDir}${l.id}.mp3`);
    manifest[`${LANG}/${l.id}`] = { file: `audio/vo/${LANG}/${l.id}.mp3`, chars: l.text.length };
  }
}
await Promise.all([worker(), worker()]);
writeFileSync(manifestFile, JSON.stringify(manifest, null, 1));
console.log(`\nDone: ${made} new, ${cached} from cache. Manifest: ${Object.keys(manifest).length} entries.`);
