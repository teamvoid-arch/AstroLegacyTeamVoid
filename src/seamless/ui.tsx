/*
  On-screen parts of the seamless story (Final version UI), wired to this app's store and activities.
  Class names start with "sl-" so they never clash with the scroll story's styles.
*/
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { audio } from '../audio/engine';
import { react } from '../vimo/controller';
import { TryIt as Activity } from '../ui/TryIt';
import { useStory } from './state';
import { BEATS, MACHINES, TRY_IT_WAIT as TRY_WAIT, engine, quickChip, speakingMachineName, videoFor } from './engine';
import { worldMachines } from './bridge';
import { estimateWords } from './clock';
import { pick, type World } from './types';
import { REVIEW_FACTS, TRY_MAP, appMachineId } from './bridge';
import { machineById } from '../data/machines';
import { NasaPhoto, photoUrl } from '../ui/common';
import { sfx } from './sfx';
import { useST } from './i18n';

// ---------------------------------------------------------------- journey bar

const STOPS: { id: World; key: string }[] = [
  { id: 'moon', key: 'bar.moon' },
  { id: 'mars', key: 'bar.mars' },
  { id: 'deep', key: 'bar.deep' },
];
const ORDER: World[] = ['earth', 'moon', 'mars', 'deep', 'home'];

/** Journey bar: Moon → Mars → Deep space, year, stamps, language, settings. */
export function TopBar() {
  const t = useST();
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const yearOverride = useStory((s) => s.yearOverride);
  const stamps = useStore((s) => s.stamps.length);
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const openSettings = useStore((s) => s.openSettings);
  const here = ORDER.indexOf(beat?.world ?? 'earth');
  const year = beat?.tour ? yearOverride ?? beat.year : beat?.year;

  return (
    <header className="sl-topbar" role="banner">
      <Link to="/" className="sl-home" aria-label="Home">⌂</Link>
      <nav className="sl-journey" aria-label="Journey">
        {STOPS.map((s, i) => {
          const idx = ORDER.indexOf(s.id);
          const state = idx < here ? 'done' : idx === here ? 'now' : 'next';
          return (
            <span key={s.id} className={`stop ${s.id} ${state}`} aria-current={state === 'now' ? 'step' : undefined}>
              {i > 0 && <span className="arrow" aria-hidden>→</span>}
              {s.id === 'deep'
                ? <><span className="long">{t(s.key)}</span><span className="short">{t('bar.deepShort')}</span></>
                : t(s.key)}
            </span>
          );
        })}
      </nav>
      {year && <span className={`sl-year ${beat?.tour === 'map' ? 'rolling' : ''}`} aria-label="Year">{year}</span>}
      <Link to="/logbook" className="sl-stamps" aria-label={`Logbook, ${stamps} stamps`}>★ {stamps}</Link>
      <button className="sl-chip" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} lang={lang === 'en' ? 'bn' : 'en'}>
        {t('ui.lang')}
      </button>
      <button className="sl-chip menu" onClick={() => { engine.setPaused(true); openSettings(true); }} aria-label="Settings">≡</button>
    </header>
  );
}

// ---------------------------------------------------------------- captions

/** Captions on the same clock as the voice; the current word is gently highlighted. */
export function Captions() {
  const captions = useStore((s) => s.settings.captions);
  const lang = useStore((s) => s.lang);
  const phase = useStory((s) => s.phase);
  useStory((s) => s.lineTime);
  const { line, time, duration, prefix } = engine.current;
  // the machine's status is told in its own bubble on the model; lobby and choice have their own panels
  if (!captions || !line || phase === 'tryit' || phase === 'done' || phase === 'hold') return null;

  const text = pick(line.text, lang);
  if (!text && !prefix) return null;
  const words = text ? (text === line.text.en && line.words?.length ? line.words : estimateWords(text, duration)) : [];
  let current = -1;
  for (let i = 0; i < words.length; i++) if (words[i].t <= time) current = i;
  const textLang = text === line.text.en ? 'en' : lang;
  const machine = line.speaker === 'machine' ? speakingMachineName() : null;

  // On screen, lines now appear in speech bubbles (StoryBubble: VIMO beside her head, a machine above its
  // model). This hidden live region keeps them readable by screen readers; review tags stay visible.
  void words; void current;
  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" lang={textLang}>
        {line.speaker === 'kid' ? 'A kid asks: ' : machine ? `${machine}: ` : ''}{prefix ? `${prefix} ` : ''}{text}
      </div>
      {REVIEW_FACTS && line.verified === false && <span className="sl-review sl-review-float" title={line.unverified?.join(', ')}>UNVERIFIED</span>}
    </>
  );
}

// ---------------------------------------------------------------- Next + Pause

/** One main control (Next) in thumb reach, plus a small Pause in the corner. */
export function Controls() {
  const t = useST();
  const paused = useStory((s) => s.paused);
  const phase = useStory((s) => s.phase);
  const beat = BEATS[useStory((s) => s.beatIndex)];
  // the lobby and "what next?" have their own buttons in the same place
  if (phase === 'done' || phase === 'lobby' || phase === 'choice' || beat?.lobby || beat?.after) return null;
  return (
    <>
      <button className="sl-pause" onClick={() => engine.setPaused(!paused)} aria-pressed={paused} aria-label={paused ? t('ui.play') : t('ui.pause')}>
        {paused ? '▶' : '❚❚'}
      </button>
      {/* Previous + Next, side by side and see-through so the scene stays visible */}
      <div className="sl-nav">
        <button className="sl-nav-btn" onClick={() => { audio.unlock(); engine.prev(); }}>
          <span aria-hidden>‹</span> {t('ui.prev')}
        </button>
        <button className="sl-nav-btn primary" onClick={() => { audio.unlock(); engine.next(); }}>
          {t('ui.next')} <span aria-hidden>›</span>
        </button>
      </div>
      {paused && <div className="sl-paused" role="status">{t('ui.paused')}</div>}
    </>
  );
}

// ---------------------------------------------------------------- Try it

/** Try it: never blocks. After 5 s with no touch VIMO does it herself ("Let me show you!").
    Where this app has a hands-on activity for the same idea, the kid gets that activity. */
export function TryItPanel() {
  const t = useST();
  const phase = useStory((s) => s.phase);
  const lang = useStore((s) => s.lang);
  const done = useStory((s) => s.tryItDone);
  const beat = BEATS[useStory((s) => s.beatIndex)];
  useStory((s) => s.lineTime);
  if (!beat?.tryIt) return null;
  const id = beat.tryIt.id;
  const activity = TRY_MAP[id];
  const board = id === 'sort-machines';
  // boards and activities stay up while VIMO says the "So that's why" line, so the kid sees the result
  const keepUp = (board || activity) && done && (phase === 'line' || phase === 'gap');
  if (phase !== 'tryit' && !keepUp) return null;

  return (
    <div className={`sl-tryit ${board ? 'board' : ''} ${activity ? 'activity' : ''}`} role="dialog" aria-label="Try it"
      onPointerDown={() => { audio.unlock(); engine.holdTryIt(); }} onKeyDown={() => engine.holdTryIt()}>
      {!activity && <div className="sl-tryit-prompt">{pick(beat.tryIt.prompt, lang)}</div>}
      {board ? <SortGame /> : activity ? (
        <Activity key={beat.id} id={activity} onDone={() => engine.completeTryIt(true)} />
      ) : (
        <button className="sl-tryit-target" onClick={() => engine.completeTryIt(true)}><span aria-hidden>👆</span> {t('ui.done')}</button>
      )}
      {phase === 'tryit' && (
        <>
          <div className="sl-tryit-timer" aria-hidden><div style={{ transform: `scaleX(${Math.min(1, engine.stepTime / TRY_WAIT)})` }} /></div>
          <div className="sl-tryit-hint">{t('ui.tryItAuto')}</div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- VIMO TV

const FOUR_QUESTIONS: Record<'en' | 'bn', string>[] = [
  { en: 'What is it?', bn: 'এটি আসলে কী?' },
  { en: 'Why was it sent?', bn: 'এটিকে কেন পাঠানো হয়েছিল?' },
  { en: 'What did it find?', bn: 'এটি কী আবিষ্কার করেছে?' },
  { en: 'What does it give us now?', bn: 'এটি এখনও আমাদের কী দিচ্ছে?' },
];

/** The video slot at every stop. A real clip (Google Veo / NASA footage) when it exists,
    else a clearly labelled placeholder with the episode's checked on-screen lines. */
export function VimoTV() {
  const t = useST();
  const phase = useStory((s) => s.phase);
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const holder = useRef<HTMLDivElement>(null);
  useStory((s) => s.lineTime);

  useEffect(() => {
    const el = engine.videoEl;
    if (phase !== 'video' || !el || !holder.current) return;
    el.className = 'vimotv-video';
    holder.current.appendChild(el);
    return () => { el.remove(); };
  }, [phase, beat?.id]);

  if (phase !== 'video' || !beat?.video) return null;
  const v = videoFor(beat)!;
  const m = MACHINES[v.machineId];
  const slides = v.slides?.length ? v.slides : [{ text: m?.name ?? '', facts: [] }];
  const p = Math.min(1, engine.stepTime / Math.max(0.1, engine.stepDuration));
  const slide = slides[Math.min(slides.length - 1, Math.floor(p * slides.length))];
  const real = !!v.src;
  // team script §7: every video answers four questions, in this order
  const lang = useStore.getState().lang;
  const chapter = FOUR_QUESTIONS[Math.min(3, Math.floor(p * 4))][lang];

  return (
    <div className="vimotv" role="region" aria-label={`VIMO TV: ${m?.name}`}>
      <div className="vimotv-frame">
        <div className="vimotv-screen">
          {real ? <div ref={holder} className="vimotv-holder" /> : (
            <>
              <span className="sl-tag">{t('tv.placeholder')}</span>
              <div className="vimotv-slide" key={slide.text}>{slide.text}</div>
            </>
          )}
          {real && <span className="sl-tag">Illustration</span>}
          <span className="vimotv-chapter" key={chapter}>{chapter}</span>
          <div className="vimotv-progress"><div style={{ transform: `scaleX(${p})` }} /></div>
        </div>
        <div className="vimotv-bar">
          <span className="vimotv-logo">VIMO TV</span>
          <span className="vimotv-title">{m?.name}</span>
          {v.kind === 'feature' && <button className="sl-chip" onClick={() => engine.next()}>{t('tv.skip')}</button>}
        </div>
      </div>
      <p className="vimotv-source">{t('tv.sources')}: NASA</p>
    </div>
  );
}

// ---------------------------------------------------------------- machine card

const STATUS_CLASS: Record<string, string> = { working: 'working', quiet: 'quiet', 'used-once': 'used', crashed: 'used', lost: 'lost' };

/** The machine card (doc 06): picture, title chip, big line, why it matters, status sticker, NASA link. */
export function StopCard() {
  const t = useST();
  const phase = useStory((s) => s.phase);
  const beat = BEATS[useStory((s) => s.beatIndex)];
  if (phase !== 'card' || !beat?.card) return null;
  const m = MACHINES[beat.card];
  if (!m?.card) return null;
  const place = m.world === 'moon' ? t('bar.moon') : m.world === 'mars' ? t('bar.mars') : t('bar.deep');
  // the real NASA photo this app already resolved for the machine (NASA Image and Video Library)
  const app = machineById[appMachineId(m.id)];
  const photo = app?.photo && photoUrl(app.photo) ? app.photo : null;

  return (
    <article className={`mcard ${m.world}`} aria-label={m.name}>
      <div className="mcard-pic">
        {photo ? <NasaPhoto id={photo} alt={app?.photoAlt || m.name} className="mcard-photo" /> : (
          <>
            <div className="mcard-pic-placeholder" aria-hidden><span>{m.name}</span></div>
            <span className="sl-tag">{t('card.photoTodo')}</span>
          </>
        )}
        <span className={`sl-sticker ${STATUS_CLASS[m.status ?? ''] ?? ''}`}>{m.statusLabel}</span>
      </div>
      <div className="mcard-body">
        <div className={`chip-title ${m.world}`}>{m.name} · {m.year} · {place}</div>
        <h2 className="mcard-big">{m.card.big}</h2>
        <p className="mcard-why">{m.card.why}</p>
        <div className="mcard-foot">
          <a href={m.card.sourceUrl} target="_blank" rel="noopener noreferrer">{t('card.source')} ↗</a>
          {REVIEW_FACTS && m.card.draft && <span className="sl-review">DRAFT COPY</span>}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------- Archie

/** Archie, "Know more from NASA": appears only where NASA's archive has a checked item.
    Never interrupts; tapping him pauses the story, closing the panel resumes it. */
/**
 * "Ask VIMO": a question box in the free space at the bottom. The server (/api/ask) answers in 2–3 short
 * lines from NASA data only (checked facts + NASA library), with the NASA pages it used. The story pauses
 * while the kid asks and carries on when the answer is closed.
 */
export function AskBox() {
  const lang = useStore((s) => s.lang);
  const phase = useStory((s) => s.phase);
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<null | { q: string; answer?: string; error?: string; found?: boolean; sources?: { title: string; url: string }[] }>(null);
  const wasPaused = useRef<boolean | null>(null);
  if (phase === 'lobby' || phase === 'choice' || phase === 'done' || beat?.lobby || beat?.after) return null;
  const machine = MACHINES[beat?.card ?? beat?.stamp ?? '']?.name;
  const hold = () => { if (wasPaused.current === null) { wasPaused.current = useStory.getState().paused; engine.setPaused(true); } };
  const release = () => { if (wasPaused.current === false) engine.setPaused(false); wasPaused.current = null; };
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = q.trim();
    if (!question || busy) return;
    hold(); setBusy(true); sfx('tap');
    try {
      const r = await fetch(`${import.meta.env.BASE_URL}api/ask`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question, lang, machine }) });
      const j = await r.json().catch(() => ({}));
      setRes(r.ok ? { q: question, ...j } : { q: question, error: j.error || (lang === 'bn' ? 'এখন উত্তর দিতে পারছি না।' : "I can't answer right now.") });
      if (r.ok) setQ('');
    } catch {
      setRes({ q: question, error: lang === 'bn' ? 'এখন উত্তর দিতে পারছি না।' : "I can't answer right now." });
    }
    setBusy(false); sfx('chime');
  };
  const close = () => { setRes(null); release(); };
  return (
    <div className="sl-ask">
      {res && (
        <div className="sl-ask-card" role="status">
          <div className="sl-ask-q">❓ {res.q}<button onClick={close} aria-label={lang === 'bn' ? 'বন্ধ করো' : 'Close'}>✕</button></div>
          {res.answer ? <p className="sl-ask-a">👩‍🚀 {res.answer}</p> : <p className="sl-ask-a err">{res.error}</p>}
          {!!res.sources?.length && (
            <div className="sl-ask-src">{lang === 'bn' ? 'নাসার সূত্র:' : 'NASA source:'} {res.sources.map((s, i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a>)}</div>
          )}
        </div>
      )}
      <form className="sl-ask-bar" onSubmit={send}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={hold} onBlur={() => { if (!q && !res && !busy) release(); }} maxLength={300}
          placeholder={lang === 'bn' ? 'ভিমোকে মহাকাশ নিয়ে প্রশ্ন করো…' : 'Ask VIMO about space and NASA…'} aria-label={lang === 'bn' ? 'প্রশ্ন' : 'Your question'} />
        <button type="submit" disabled={busy || !q.trim()} aria-label={lang === 'bn' ? 'পাঠাও' : 'Ask'}>{busy ? '…' : '➤'}</button>
      </form>
    </div>
  );
}

interface LibPhoto { id: string; title: string; thumb: string; date: string }
const libCache = new Map<string, LibPhoto[]>();

/** Archie's photo wall: NASA Image and Video Library photos of the machine (live search, public NASA API, no key). */
function NasaGallery({ query }: { query: string }) {
  const lang = useStore((s) => s.lang);
  const [photos, setPhotos] = useState<LibPhoto[] | null>(libCache.get(query) ?? null);
  const [big, setBig] = useState<LibPhoto | null>(null);
  useEffect(() => {
    if (libCache.has(query)) { setPhotos(libCache.get(query)!); return; }
    let alive = true;
    setPhotos(null);
    fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=60`)
      .then((r) => r.json())
      .then((j) => {
        const list: LibPhoto[] = (j.collection?.items ?? []).map((it: any) => ({
          id: it.data?.[0]?.nasa_id, title: it.data?.[0]?.title ?? '', date: (it.data?.[0]?.date_created ?? '').slice(0, 4), thumb: it.links?.[0]?.href,
        })).filter((p: LibPhoto) => p.id && p.thumb);
        libCache.set(query, list);
        if (alive) setPhotos(list);
      })
      .catch(() => { if (alive) setPhotos([]); });
    return () => { alive = false; };
  }, [query]);
  return (
    <section className="archie-gallery">
      <h3>📸 {lang === 'bn' ? `নাসার ছবি: ${query}` : `NASA photos: ${query}`}{photos?.length ? <span> · {photos.length}</span> : null}</h3>
      {photos === null && <p className="archie-gallery-note">{lang === 'bn' ? 'নাসার লাইব্রেরি থেকে আনছি…' : 'Loading from the NASA library…'}</p>}
      {photos?.length === 0 && <p className="archie-gallery-note">{lang === 'bn' ? 'এখন ছবি আনা গেল না।' : 'No photos right now.'}</p>}
      {big && (
        <figure className="archie-big">
          <img src={big.thumb.replace('~thumb', '~medium')} alt={big.title} onError={(e) => { (e.target as HTMLImageElement).src = big.thumb; }} />
          <figcaption>{big.title}{big.date ? ` (${big.date})` : ''} · NASA <a href={`https://images.nasa.gov/details/${encodeURIComponent(big.id)}`} target="_blank" rel="noopener noreferrer">↗</a>
            <button onClick={() => setBig(null)} aria-label="Close photo">✕</button></figcaption>
        </figure>
      )}
      <div className="archie-grid">
        {photos?.map((p) => (
          <button key={p.id} className={big?.id === p.id ? 'on' : ''} onClick={() => setBig(p)} title={p.title}>
            <img src={p.thumb} alt={p.title} loading="lazy" />
          </button>
        ))}
      </div>
      <p className="archie-gallery-note">{lang === 'bn' ? 'সব ছবি: নাসা ইমেজ অ্যান্ড ভিডিও লাইব্রেরি' : 'All photos: NASA Image and Video Library'} (images.nasa.gov)</p>
    </section>
  );
}

export function Archie() {
  const t = useST();
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const phase = useStory((s) => s.phase);
  const open = useStory((s) => s.archieOpen);
  const setOpen = useStory((s) => s.setArchieOpen);
  const item = beat?.archie;
  const [shown, setShown] = useState<string | null>(null);
  const [bubble, setBubble] = useState(false);
  const wasPaused = useRef(false);

  useEffect(() => {
    if (!item) { setShown(null); return; }
    if (shown !== beat.id && phase !== 'line') { setShown(beat.id); setBubble(true); sfx('archie'); }
  }, [item, phase, beat?.id, shown]);

  useEffect(() => {
    if (!bubble) return;
    const id = window.setTimeout(() => setBubble(false), 3000);
    return () => window.clearTimeout(id);
  }, [bubble]);

  if (!item || shown !== beat.id) return null;

  const openPanel = () => { wasPaused.current = useStory.getState().paused; engine.setPaused(true); setOpen(true); sfx('tap'); };
  const close = () => { setOpen(false); if (!wasPaused.current) engine.setPaused(false); };

  return (
    <>
      {!open && (
        <button className={`archie ${bubble ? 'talking' : 'glow'}`} onClick={openPanel} aria-label={t('archie.label')}>
          {bubble && <span className="archie-bubble">{item.type === 'film' ? t('archie.film') : t('archie.more')}</span>}
          <ArchieBody />
        </button>
      )}
      {open && (
        <div className="archie-sheet-wrap" onClick={close}>
          <section className="archie-sheet" role="dialog" aria-modal="true" aria-label={t('archie.title')} onClick={(e) => e.stopPropagation()}>
            <div className="grab" aria-hidden />
            <header><ArchieBody small /><h2>{t('archie.title')}</h2>
              <button className="archie-close" onClick={close} aria-label={t('archie.close')}>✕</button></header>
            <div className="archie-item">
              <span className="sl-tag">{item.type === 'film' ? 'NASA film' : item.type === 'photo' ? 'NASA photo' : 'NASA page'}</span>
              <strong>{item.title}</strong>
            </div>
            <p><span className="why-label">{t('archie.why')}</span><br />{item.why}</p>
            <a className="archie-link" href={item.url} target="_blank" rel="noopener noreferrer">{t('archie.open')} ↗</a>
            {(() => { const m = MACHINES[beat.card ?? beat.stamp ?? '']; return m ? <NasaGallery query={m.name.replace(/ \+ .*$/, '')} /> : null; })()}
          </section>
        </div>
      )}
    </>
  );
}

function ArchieBody({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? 'archie-svg small' : 'archie-svg'} viewBox="0 0 88 88" aria-hidden>
      <line x1="40" y1="14" x2="40" y2="4" stroke="#18203A" strokeWidth="3" />
      <circle cx="40" cy="4" r="5" fill="#FFC94D" stroke="#18203A" strokeWidth="2" />
      <rect x="10" y="14" width="64" height="58" rx="18" fill="#E9EDF7" stroke="#18203A" strokeWidth="3" />
      <rect x="20" y="24" width="44" height="32" rx="9" fill="#0E1A4A" />
      <rect className="eye" x="31" y="33" width="7" height="12" rx="3.5" fill="#9BE36A" />
      <rect className="eye" x="46" y="33" width="7" height="12" rx="3.5" fill="#9BE36A" />
      <g transform="rotate(-20 72 18)">
        <ellipse cx="72" cy="18" rx="14" ry="14" fill="#FFFFFF" stroke="#18203A" strokeWidth="3" />
        <circle cx="72" cy="18" r="3" fill="#18203A" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- tour label, ending

/** Honest label during the quick tour: painted globes, not NASA maps, not to scale. */
export function TourTag() {
  const t = useST();
  const beat = BEATS[useStory((s) => s.beatIndex)];
  if (!beat?.tour || beat.quick) return null; // the team's map carries its own map notes
  return <div className="sl-tour-tag">{t('tour.tag')}</div>;
}

/** After the last beat: VIMO has become a tiny new star next to the Moon. One door to the extras. */
export function EndScreen() {
  const t = useST();
  const nav = useNavigate();
  const phase = useStory((s) => s.phase);
  if (phase !== 'done') return null;
  return (
    <div className="sl-end">
      <div className="end-sky" aria-hidden><span className="end-moon" /><span className="end-star" title="VIMO" /></div>
      <h1>{t('end.title')}</h1>
      <p className="tagline">{t('end.tagline')}</p>
      <button className="sl-next static" onClick={() => nav('/explore')}>{t('end.explore')}</button>
      <div className="end-row">
        <Link className="sl-chip big" to="/logbook">{t('end.logbook')}</Link>
      </div>
      <div className="end-links">
        <button className="sl-link" onClick={() => engine.start(0)}>{t('end.again')}</button>
        <Link className="sl-link" to="/sources">{t('end.sources')}</Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- team script: labels, quick tour, lobby, choice

/** Short labels during a hold (launch → Atmosphere → Ozone layer → Space!), one after another. */
export function HoldLabels() {
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const phase = useStory((s) => s.phase);
  const lang = useStore((s) => s.lang);
  useStory((s) => s.lineTime);
  if (!beat?.labels?.length || phase !== 'hold') return null;
  const i = Math.min(beat.labels.length - 1, Math.floor((engine.stepTime / Math.max(0.1, engine.stepDuration)) * beat.labels.length));
  return <div className="sl-hold-label" key={i}>{pick(beat.labels[i], lang)}</div>;
}

const KIND_EN: Record<string, string> = { probe: 'Probe', lander: 'Lander', rover: 'Rover', 'descent stage': 'Descent stage', instrument: 'Instrument', helicopter: 'Helicopter', 'landing leftovers': 'Landing leftovers' };

/** Quick tour (team script §3–4): every main machine flashes by in year order with its name, year,
    main job and status, on a 1960s → today timeline. */
export function QuickTourCard() {
  const beat = BEATS[useStory((s) => s.beatIndex)];
  useStory((s) => s.lineTime);
  if (!beat?.quick) return null;
  const ms = worldMachines(beat.quick);
  const i = quickChip();
  const m = i >= 0 ? ms[i] : null;
  const first = 1960, last = 2026;
  return (
    <div className="sl-quick" aria-live="polite">
      <div className="sl-quick-line" aria-hidden>
        {ms.map((x, k) => (
          <span key={x.id} className={`dot ${k === i ? 'now' : k < i ? 'past' : ''}`} style={{ left: `${((x.year - first) / (last - first)) * 100}%` }} />
        ))}
        <span className="end a">1960</span><span className="end b">2026</span>
      </div>
      {m && (
        <article className={`sl-quick-card ${m.world}`} key={m.id}>
          <div className="sl-quick-head"><strong>{m.name}</strong><span className="yr">{m.year}</span></div>
          <div className="sl-quick-kind">{KIND_EN[m.type ?? ''] ?? m.type} · {m.site}</div>
          {m.card?.big && <p className="sl-quick-job">{m.card.big}</p>}
          <span className={`sl-sticker inline ${STATUS_CLASS[m.status ?? ''] ?? ''}`}>{m.statusLabel}</span>
        </article>
      )}
    </div>
  );
}

const WORLD_NAME: Record<'moon' | 'mars' | 'deep', { en: string; bn: string }> = {
  moon: { en: 'Moon Hardwares', bn: 'চাঁদের হার্ডওয়ার্স' },
  mars: { en: 'Mars Hardwares', bn: 'মঙ্গল গ্রহের হার্ডওয়ার্স' },
  deep: { en: 'Deep Space Hardwares', bn: 'ডিপ স্পেস হার্ডওয়ার্স' },
};
export const worldName = (w: 'moon' | 'mars' | 'deep', lang: 'en' | 'bn') => WORLD_NAME[w][lang];

/** Lobby buttons (team script §6): Story or Experience for the world picked at the windows. */
export function LobbyPanel() {
  const nav = useNavigate();
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const phase = useStory((s) => s.phase);
  const pickW = useStory((s) => s.pick);
  const lang = useStore((s) => s.lang);
  if (!beat?.lobby && phase !== 'lobby') return null;
  return (
    <div className="sl-lobby-bar">
      <div className="sl-lobby-pick">{lang === 'bn' ? 'বেছে নিয়েছ:' : 'You picked:'} <strong>{worldName(pickW, lang)}</strong></div>
      <div className="sl-lobby-buttons">
        <button className="sl-next static" onClick={() => { audio.unlock(); engine.goWorld(pickW); }}>📖 {lang === 'bn' ? 'স্টোরি' : 'Story'}</button>
        <button className="sl-next static alt" onClick={() => { engine.stop(); nav('/experience'); }}>🎮 {lang === 'bn' ? 'এক্সপেরিয়েন্স' : 'Experience'}</button>
      </div>
    </div>
  );
}

/** End of a world (team script §8): try Experience mode, or carry on (next world, then home). */
export function ChoicePanel() {
  const nav = useNavigate();
  const beat = BEATS[useStory((s) => s.beatIndex)];
  const phase = useStory((s) => s.phase);
  const lang = useStore((s) => s.lang);
  useStory((s) => s.visited);
  if (!beat?.after && phase !== 'choice') return null;
  const next = engine.nextWorld();
  const nextLabel = next === 'home'
    ? (lang === 'bn' ? 'পৃথিবীতে ফেরা' : 'Fly home to Earth')
    : `${lang === 'bn' ? 'স্টোরি কন্টিনিউ:' : 'Continue to'} ${next === 'moon' ? (lang === 'bn' ? 'চাঁদ' : 'the Moon') : next === 'mars' ? (lang === 'bn' ? 'মঙ্গল' : 'Mars') : (lang === 'bn' ? 'গভীর মহাকাশ' : 'deep space')}`;
  return (
    <div className="sl-choice" role="dialog" aria-label="What next?">
      <button className="sl-next static" onClick={() => { audio.unlock(); engine.continueStory(); }}>{nextLabel} →</button>
      <button className="sl-next static alt" onClick={() => { engine.stop(); nav('/experience'); }}>🎮 {lang === 'bn' ? 'এক্সপেরিয়েন্স মোড' : 'Try Experience mode'}</button>
      <button className="sl-link" onClick={() => engine.toLobby()}>{lang === 'bn' ? 'লবিতে ফেরো' : 'Back to the lobby'}</button>
    </div>
  );
}

// ---------------------------------------------------------------- sorting game

type Box = 'working' | 'quiet' | 'used';
const PICK = ['laser-mirror', 'opportunity', 'apollo11-eagle', 'voyager1', 'insight', 'ranger7', 'curiosity'];
const boxOf = (status?: string): Box => (status === 'working' ? 'working' : status === 'quiet' ? 'quiet' : 'used');

/** "Sort the machines" (Story Script 4.2, Beat 5): tap a card, then tap a box. Wrong = gentle hint. */
function SortGame() {
  const t = useST();
  const done = useStory((s) => s.tryItDone);
  const cards = useMemo(() => PICK.map((id) => MACHINES[id]).filter(Boolean), []);
  const [placed, setPlaced] = useState<Record<string, Box>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (done === 'vimo') setPlaced(Object.fromEntries(cards.map((m) => [m.id, boxOf(m.status)])));
  }, [done, cards]);

  const drop = (box: Box) => {
    engine.holdTryIt();
    if (!selected) return;
    const m = MACHINES[selected];
    if (boxOf(m.status) === box) {
      const next = { ...placed, [selected]: box };
      setPlaced(next); setSelected(null); setHint(null);
      sfx('chime'); react('hop', 'happy', 1.2);
      if (Object.keys(next).length === cards.length) engine.completeTryIt(true);
    } else {
      sfx('try-again'); setHint(t('sort.hint')); react('shrug', 'gentle', 1.2);
    }
  };

  const boxes: { id: Box; label: string }[] = [
    { id: 'working', label: t('sort.working') },
    { id: 'quiet', label: t('sort.quiet') },
    { id: 'used', label: t('sort.used') },
  ];

  return (
    <div className="sortgame">
      <div className="sort-cards" role="list">
        {cards.filter((m) => !placed[m.id]).map((m) => (
          <button key={m.id} role="listitem" className={`sort-card ${selected === m.id ? 'sel' : ''}`}
            onClick={() => { engine.holdTryIt(); setSelected(m.id); sfx('tap'); }} aria-pressed={selected === m.id}>
            {m.name}
          </button>
        ))}
      </div>
      {hint && <div className="sort-hint" role="status">{hint}</div>}
      <div className="sort-boxes">
        {boxes.map((b) => (
          <button key={b.id} className={`sort-box ${b.id}`} onClick={() => drop(b.id)}>
            <strong>{b.label}</strong>
            <span>{cards.filter((m) => placed[m.id] === b.id).map((m) => m.name).join(' · ')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
