/*
  "Ask VIMO": answers a kid's question in 2–3 short lines, ONLY from NASA data.
  Runs on a server (Vite dev/preview middleware now; a serverless function when the site is public),
  so the Gemini key is read from .env here and never reaches the browser.

  Grounding: every checked fact in src/seamless/facts.json (each with its NASA page), every machine's
  status from machines.json, and the top results of a live NASA Image and Video Library search for the
  question. Gemini must answer only from those, name which ones it used, and say so when NASA data
  here does not cover the question. Unchecked facts (verified=false) are never sent.
*/
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
// Google retired gemini-2.5-flash for new keys; GEMINI_MODEL in .env can override this
// flash-lite with low thinking answers in about a second; the bigger models are backups when it is busy
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const FALLBACKS = ['gemini-3.8-flash', 'gemini-flash-latest'];

let cache = null;
function knowledge() {
  if (cache) return cache;
  const facts = read('src/seamless/facts.json').facts.filter((f) => f.verified && f.text?.en && f.sourceUrl);
  const machines = read('src/seamless/machines.json').machines;
  const sources = new Map();
  const lines = [];
  for (const f of facts) {
    sources.set(f.id, { title: f.sourceTitle, url: f.sourceUrl });
    lines.push(`[${f.id}] ${f.text.en} (source: ${f.sourceTitle})`);
  }
  for (const m of machines) {
    if (!m.statusLabel) continue;
    const id = `status-${m.id}`;
    const fact = (m.statusFacts ?? []).map((x) => sources.get(x)).find(Boolean);
    const card = m.card?.sourceUrl ? { title: `NASA: ${m.name}`, url: m.card.sourceUrl } : null;
    const src = fact ?? card;
    if (!src) continue;   // no NASA page behind this status: leave it out
    sources.set(id, src);
    lines.push(`[${id}] ${m.name} (${m.year}, ${m.world === 'deep' ? 'deep space' : m.world}${m.site ? `, ${m.site}` : ''}): ${m.statusLabel}.${m.card?.big ? ` ${m.card.big}` : ''}${m.card?.why ? ` ${m.card.why}` : ''}`);
  }
  cache = { text: lines.join('\n'), sources };
  return cache;
}

/** The checked facts that share words with the question (plus the machine on screen), so the prompt stays
    small and fast. If too little matches (for example a Bangla question), all checked facts are sent. */
const STOP = new Set(['the', 'and', 'what', 'how', 'why', 'who', 'did', 'does', 'was', 'were', 'are', 'is', 'can', 'for', 'with', 'this', 'that', 'there', 'about', 'many', 'much', 'when', 'where', 'from', 'into', 'have', 'has', 'its']);
function relevant(kb, q, machine) {
  const words = q.toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => w.length > 2 && !STOP.has(w)) ?? [];
  const m = String(machine ?? '').toLowerCase();
  const lines = kb.text.split('\n');
  const scored = lines.map((l) => {
    const low = l.toLowerCase();
    let s = words.reduce((n, w) => n + (low.includes(w) ? 1 : 0), 0);
    if (m && low.includes(m)) s += 2;
    return { l, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  return scored.length >= 3 ? scored.slice(0, 30).map((x) => x.l).join('\n') : kb.text;
}

/** Live NASA Image and Video Library search: NASA-written titles and descriptions for extra context. */
async function nasaLibrary(q) {
  try {
    const r = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page_size=5`, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.collection?.items ?? []).slice(0, 5).map((it, i) => {
      const d = it.data?.[0] ?? {};
      return { id: `lib-${i + 1}`, title: d.title ?? '', text: String(d.description ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 600), url: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id ?? '')}`, thumb: it.links?.[0]?.href };
    }).filter((x) => x.title);
  } catch { return []; }
}

const SYSTEM = `You are VIMO, a friendly little astronaut guide in a NASA Space Apps app for kids aged 8-15.
Answer ONLY from the NASA DATA given to you. Never add facts, numbers, dates or names that are not in it.
Rules:
- 2 or 3 short, simple sentences (under 60 words in total). Warm, clear, no jargon.
- Put the ids of the data lines you used in "used" (for example "ranger7-images" or "lib-2").
- If the NASA DATA does not answer the question, set "found" to false and say kindly that you don't have a NASA source for that here yet, and suggest a related thing you can answer.
- If the question is not about space, astronomy or NASA, set "found" to false and gently bring the kid back to space.
- Answer in the language given in "lang" (en = English, bn = Bangla). Keep machine names in English.`;

export async function ask({ question, lang = 'en', machine }, key) {
  const q = String(question ?? '').trim().slice(0, 300);
  if (!q) return { status: 400, body: { error: 'empty question' } };
  if (!key) return { status: 503, body: { error: 'The question box is not set up yet (GEMINI_API_KEY missing on the server).' } };
  const kb = knowledge();
  const lib = await nasaLibrary(q);
  const libText = lib.map((l) => `[${l.id}] ${l.title}: ${l.text} (NASA Image and Video Library)`).join('\n');
  const prompt = `lang: ${lang === 'bn' ? 'bn' : 'en'}\n${machine ? `The kid is looking at: ${machine}\n` : ''}Question: ${q}\n\nNASA DATA (checked facts):\n${relevant(kb, q, machine)}\n\nNASA DATA (live NASA library search for this question):\n${libText || '(no results)'}`;
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2, maxOutputTokens: 800, responseMimeType: 'application/json', thinkingConfig: { thinkingLevel: 'low' },
      responseSchema: { type: 'OBJECT', properties: { answer: { type: 'STRING' }, found: { type: 'BOOLEAN' }, used: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['answer', 'found', 'used'] },
    },
  });
  // a busy or slow model falls back to the next one, so a kid is rarely left without an answer
  let j = null;
  for (const model of [...new Set([MODEL, ...FALLBACKS])]) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, signal: AbortSignal.timeout(15000), body,
      });
      if (r.ok) { j = await r.json(); break; }
      console.warn(`[ask] ${model} ${r.status}: ${(await r.text()).slice(0, 200)}`);
      if (r.status !== 503 && r.status !== 429 && r.status !== 404 && r.status !== 500) break;
    } catch (e) { console.warn(`[ask] ${model}: ${e?.name ?? e}`); }
  }
  if (!j) return { status: 503, body: { error: 'VIMO is busy right now. Try again in a moment!' } };
  let out;
  try { out = JSON.parse(j.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'); } catch { out = {}; }
  if (!out.answer) return { status: 502, body: { error: 'No answer' } };
  // sources: only ids that really exist in the data we sent (the model cannot invent a link)
  const seen = new Set();
  const sources = [];
  for (const id of out.used ?? []) {
    const lib1 = lib.find((l) => l.id === id);
    const s = lib1 ? { title: lib1.title, url: lib1.url } : kb.sources.get(id);
    if (s && !seen.has(s.url)) { seen.add(s.url); sources.push(s); }
  }
  const photos = lib.filter((l) => l.thumb).slice(0, 3).map((l) => ({ title: l.title, url: l.url, thumb: l.thumb }));
  return { status: 200, body: { answer: out.answer, found: !!out.found && sources.length > 0, sources: sources.slice(0, 3), photos: out.found ? photos : [] } };
}

/** Connect-style middleware for Vite (dev and preview): POST /api/ask {question, lang, machine}. */
export function askMiddleware(getKey) {
  const hits = new Map();   // tiny per-IP limit: 20 questions a minute
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/ask')) return next();
    if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
    const ip = req.socket.remoteAddress ?? '?', now = Date.now();
    const h = (hits.get(ip) ?? []).filter((t) => now - t < 60000);
    if (h.length >= 20) { res.statusCode = 429; res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ error: 'Too many questions, wait a minute.' })); }
    hits.set(ip, [...h, now]);
    let raw = '';
    for await (const c of req) { raw += c; if (raw.length > 4000) break; }
    let body = {};
    try { body = JSON.parse(raw || '{}'); } catch { /* empty */ }
    let out;
    try { out = await ask(body, getKey()); } catch { out = { status: 502, body: { error: 'AI service did not answer' } }; }
    res.statusCode = out.status;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(out.body));
  };
}
