import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProgress } from '@react-three/drei';
import { SpeechBubble } from '../ui/SpeechBubble';
import { machineSpeech } from '../three/speechAnchor';
import { beats, beatIndex, PARTS } from '../story/beats';
import { machineById } from '../data/machines';
import { live, useStore } from '../store';
import { audio } from '../audio/engine';
import { setVimo, vimo, react, say } from '../vimo/controller';
import { VimoLayer } from '../vimo/VimoLayer';
import { WorldCanvas, ERA_FILTER, hasWebGL } from '../scenes/WorldCanvas';
import { Stage, stageKey } from '../scenes/Stage';
import { preloadModel } from '../three/Machine';
import { BeatOverlays } from '../ui/BeatOverlays';
import { TryIt } from '../ui/TryIt';
import { HubCards, SideTripView } from '../ui/Hub';
import { MachineCard } from '../ui/MachineCard';
import { ModelViewer } from '../ui/ModelViewer';
import { SettingsPanel } from '../ui/Settings';
import { Btn, NasaPhoto } from '../ui/common';
import { useT, personalise } from '../data/i18n';
import type { Beat } from '../data/types';
import { Sparkles } from '../ui/Sparkles';

const N = beats.length;
const lineId = (b: Beat, i: number) => `${b.id}-${i}`;

function useYearCounter(beat: Beat, el: React.RefObject<HTMLSpanElement>) {
  const from = useRef(beat.year);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const loop = () => {
      let y: number;
      const fx = beat.fx || [];
      if (fx.includes('year-back')) y = 2026 + (1964 - 2026) * Math.min(1, live.t * 1.3);
      else if (fx.includes('year-roll')) y = 1972 + (2026 - 1972) * Math.min(1, Math.max(0, (live.t - 0.3) * 1.6));
      else if (fx.includes('calendar')) y = 2004 + 14 * Math.min(1, live.t * 1.05);
      else if (fx.includes('days')) y = 1967 + Math.min(2, live.t * 2.6);
      else { const k = Math.min(1, (performance.now() - start) / 1200); y = a + (beat.year - a) * (1 - Math.pow(1 - k, 3)); }
      from.current = Math.round(y);
      if (el.current) el.current.textContent = String(Math.round(y));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [beat]);
}

export default function StoryMode() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const t = useT();
  const lang = useStore((s) => s.lang);
  const name = useStore((s) => s.name);
  const settings = useStore((s) => s.settings);
  const addStamp = useStore((s) => s.addStamp);
  const setProgress = useStore((s) => s.setProgress);
  const stamps = useStore((s) => s.stamps);
  const openCard = useStore((s) => s.openCard);
  const openSettings = useStore((s) => s.openSettings);
  const setSettings = useStore((s) => s.setSettings);
  const webgl = useMemo(hasWebGL, []);

  const initial = useMemo(() => {
    const b = params.get('beat');
    if (b && beatIndex[b] != null) return beatIndex[b];
    const p = useStore.getState().progress;
    if (params.get('continue') && p && beatIndex[p] != null) return beatIndex[p];
    return 0;
  }, []);

  const [index, setIndex] = useState(initial);
  const [shown, setShown] = useState(initial); // beat rendered in 3D (swapped behind the warp)
  const [warp, setWarp] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [narrDone, setNarrDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [trip, setTrip] = useState<string | null>(null);
  const [breakOpen, setBreakOpen] = useState(false);
  const [tryDone, setTryDone] = useState<Record<string, boolean>>({});
  const [hint, setHint] = useState(true);
  const yearEl = useRef<HTMLSpanElement>(null);
  const gradeEl = useRef<HTMLDivElement>(null);
  const playingRef = useRef(false);
  playingRef.current = playing;
  const lastInput = useRef(performance.now());
  const replayN = useRef(0);
  const [replayTick, setReplayTick] = useState(0);

  const beat = beats[index];
  const shownBeat = beats[shown];
  useYearCounter(beat, yearEl);

  // ── scroll engine: each beat owns one screen height ──
  const goTo = useCallback((i: number, smooth = true) => {
    const j = Math.max(0, Math.min(N - 1, i));
    window.scrollTo({ top: j * window.innerHeight, behavior: smooth && !useStore.getState().settings.reducedMotion ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    document.body.classList.add('story-body');
    window.scrollTo({ top: initial * window.innerHeight, behavior: 'auto' });
    live.progress = initial; live.t = 0.5;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = window.scrollY / window.innerHeight;
        const i = Math.max(0, Math.min(N - 1, Math.round(p)));
        live.progress = p;
        live.t = Math.max(0, Math.min(1, p - i + 0.5));
        live.index = i;
        lastInput.current = performance.now();
        setIndex(i);
        if (p > 0.2) setHint(false);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      lastInput.current = performance.now();
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(live.index + 1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(live.index - 1); }
    };
    window.addEventListener('keydown', onKey);
    const onPointer = () => (lastInput.current = performance.now());
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer); document.body.classList.remove('story-body');
      audio.stopVoice();
    };
  }, []);

  // ── swap the 3D stage behind a short warp when the place changes ──
  useEffect(() => {
    if (stageKey(beats[index]) === stageKey(beats[shown])) { setShown(index); return; }
    setWarp(true);
    audio.sfx('whoosh');
    const a = setTimeout(() => setShown(index), 380);
    const b = setTimeout(() => setWarp(false), 900);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [index]);

  // ── when a beat settles at the centre: VIMO, music, sound, narration ──
  useEffect(() => {
    const b = beats[index];
    setLineIdx(0); setNarrDone(false); setReply(null); setBreakOpen(false);
    vimo.highFive = false;
    let alive = true;
    const timer = setTimeout(async () => {
      setProgress(b.id);
      useStore.getState().setBeatIndex(index);
      setVimo({ screen: b.screen, size: b.size, face: b.face, gesture: b.gesture || 'idle' });
      audio.playCue(b.music);
      (b.sfx || []).filter((s) => s !== 'stamp').forEach((s, i) => setTimeout(() => alive && audio.sfx(s), 200 + i * 700));
      audio.preload(b.lines.map((_, i) => lineId(b, i)), lang);
      const next = beats[index + 1];
      if (next) audio.preload(next.lines.map((_, i) => lineId(next, i)), lang);
      // stream the next scenes' NASA models just before they are needed
      for (const nb of beats.slice(index + 1, index + 5)) {
        const mm = nb.prop ? machineById[nb.prop]?.model : undefined;
        if (mm && !mm.startsWith('proc:')) preloadModel(mm);
      }
      for (let i = 0; i < b.lines.length; i++) {
        if (!alive) return;
        setLineIdx(i);
        if (b.lines[i].who === 'kid') setVimo({ face: 'curious' });
        else setVimo({ face: b.face });
        await audio.speak(lineId(b, i), b.lines[i], lang);
        if (!alive) return;
        await new Promise((r) => setTimeout(r, 320));
      }
      if (!alive) return;
      setNarrDone(true);
      if (b.stamp && b.machine) {
        if (addStamp(b.machine)) {
          audio.sfx('stamp');
          react('salute', 'proud', 1.4);
          say('Not abandoned. Not forgotten. Logged!', 2.8);
        }
      }
      if (b.highFive) vimo.highFive = true;
      if (b.id === '4.3-b8') setTimeout(() => alive && react('star' as any, 'happy', 30), 1200);
      if (b.breakAfter) { setTimeout(() => alive && setBreakOpen(true), 900); setPlaying(false); return; }
      if (playingRef.current) setTimeout(() => { if (alive && playingRef.current) goTo(index + 1); }, b.tryIt || b.choice ? 4000 : 1300);
    }, 220);
    return () => { alive = false; clearTimeout(timer); audio.stopVoice(); };
  }, [index, lang, replayTick]);

  // Play: auto-scroll at narration speed (stops at chapter breaks, never autoplays into the next part)
  useEffect(() => { if (playing && narrDone && !beat.breakAfter) goTo(index + 1); }, [playing]);

  // Idle: no input for 20 s → VIMO's idle routine
  useEffect(() => {
    const id = setInterval(() => {
      if (performance.now() - lastInput.current > 20000 && narrDone && !playing && !trip) {
        lastInput.current = performance.now();
        react('logbook', 'cheeky', 2.5);
        setTimeout(() => { react('wave', 'happy', 2); say('Hellooo? Scroll down, space buddy!', 3); }, 2600);
      }
    }, 2000);
    return () => clearInterval(id);
  }, [narrDone, playing, trip]);

  // Era colour grade on the world only (VIMO and UI are never graded)
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (gradeEl.current) {
        const fx = shownBeat.fx || [];
        gradeEl.current.style.filter = fx.includes('year-back') ? `grayscale(${Math.min(1, live.t * 1.3)}) contrast(${1 + 0.1 * live.t})` : ERA_FILTER[shownBeat.era];
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [shownBeat]);

  const line = beat.lines[Math.min(lineIdx, beat.lines.length - 1)];
  // Every line is spoken in a bubble: VIMO's (and her kid-voice questions) beside her head,
  // a machine's on top of that machine in the 3D scene. The card below keeps only the controls.
  const inBubble = true;
  useEffect(() => {
    const key = `${beat.id}-${lineIdx}`;
    const isMachine = line.who === 'machine';
    vimo.line = isMachine ? null : { text: line.text, kid: line.who === 'kid', key };
    machineSpeech.id = isMachine ? line.machine || beat.machine || null : null;
    machineSpeech.line = isMachine ? { key, text: line.text, name: machineById[line.machine || beat.machine || '']?.name || '' } : null;
  }, [beat.id, lineIdx, line.text, line.who]);
  useEffect(() => () => { vimo.line = null; machineSpeech.id = null; machineSpeech.line = null; }, []);
  const speaker = line.who === 'machine' ? machineById[line.machine!]?.name : line.who === 'kid' ? t('kidAsks' as any) || 'Kid question' : 'VIMO';
  const vimoLeft = beat.screen.includes('left');
  const part = PARTS[beat.part - 1];
  const machine = beat.machine ? machineById[beat.machine] : null;
  const { active: loading, progress: loadPct } = useProgress();

  const answer = (k: number) => {
    const a = beat.choice!.answers[k];
    setReply(a.reply);
    setVimo({ face: a.face || 'happy' });
    react(a.face === 'gentle' || a.face === 'tears' ? 'heart' : 'cheer', a.face, 1.6);
    audio.speak(`${beat.id}-c${k}`, { who: 'vimo', text: a.reply }, lang);
  };

  const panel = (
    <>
      {beat.choice && (
        <section className="choice" aria-label="VIMO asks you">
          <p className="choice-q">💬 {beat.choice.ask}</p>
          {reply ? <p className="choice-reply">“{personalise(reply, name)}”</p> : (
            <div className="row wrap">{beat.choice.answers.map((a, k) => <Btn key={a.label} kind="soft" className="choice-btn" onClick={() => answer(k)}>{a.label}</Btn>)}</div>
          )}
        </section>
      )}
      {beat.tryIt && <TryIt key={beat.id} id={beat.tryIt} onDone={() => setTryDone({ ...tryDone, [beat.id]: true })} />}
      {beat.hub && <HubCards hubId={beat.hub} onTrip={(id) => { setPlaying(false); setTrip(id); }} />}
    </>
  );
  const hasPanel = !!(beat.choice || beat.tryIt || beat.hub);

  return (
    <div className="story">
      <div className={`stage-wrap era-${shownBeat.era}`} ref={gradeEl}>
        {webgl && !settings.lite ? (
          <WorldCanvas><Stage key={stageKey(shownBeat)} beat={shownBeat} /></WorldCanvas>
        ) : webgl ? (
          <WorldCanvas><Stage key={stageKey(shownBeat)} beat={shownBeat} /></WorldCanvas>
        ) : (
          <div className="photo-backdrop"><NasaPhoto id={machine?.photo || 'PIA12909'} alt={machine?.photoAlt || 'NASA photo'} /></div>
        )}
        {shownBeat.era === '1960s' && <div className="scanlines" />}
      </div>
      <div className={`warp ${warp ? 'on' : ''}`} aria-hidden />
      <VimoLayer />
      <SpeechBubble
        variant="machine"
        say={() => machineSpeech.line ? { key: machineSpeech.line.key, text: machineSpeech.line.text, label: `📻 ${machineSpeech.line.name}` } : null}
        anchor={() => {
          const a = machineSpeech.anchor;
          // on the machine while it is on screen; otherwise just above the control bar
          if (performance.now() - a.t < 400) return { x: a.x, y: a.y, r: a.r, mode: 'above', ok: true };
          return { x: window.innerWidth / 2, y: window.innerHeight - 90, r: 0, mode: 'above', ok: true };
        }}
      />
      <Sparkles />
      <BeatOverlays beat={shownBeat} />

      <header className="topbar">
        <Link to="/" className="home-btn" aria-label="Home">🏠</Link>
        <div className="year-box" style={{ ['--c' as any]: part.color }} aria-label="Year">
          <span className="part-name">Part {beat.part} · {part.title}</span>
          <span className="year" ref={yearEl}>{beat.year}</span>
        </div>
        <div className="top-actions">
          <Link to="/logbook" className="pill" aria-label={`Logbook, ${stamps.length} stamps`}>📒 {stamps.length}</Link>
          <button className="pill" onClick={() => { audio.unlock(); const on = !(settings.music || settings.voice || settings.sfx); setSettings({ music: on, voice: on, sfx: on }); }} aria-label={settings.music || settings.voice ? t('soundOff') : t('soundOn')}>
            {settings.music || settings.voice || settings.sfx ? '🔊' : '🔇'}
          </button>
          <button className="pill" onClick={() => openSettings(true)} aria-label={t('settings')}>⚙️</button>
        </div>
      </header>

      <nav className="rail" aria-label="Story progress">
        {PARTS.map((p) => {
          const first = beats.findIndex((b) => b.part === p.part);
          const count = beats.filter((b) => b.part === p.part).length;
          const done = Math.max(0, Math.min(1, (index - first + 1) / count));
          return (
            <button key={p.part} className={`rail-part ${beat.part === p.part ? 'on' : ''}`} style={{ ['--c' as any]: p.color, flexGrow: count }}
              onClick={() => goTo(first)} aria-label={`Jump to part ${p.part}: ${p.title}`}>
              <span className="rail-fill" style={{ height: `${done * 100}%` }} />
              <span className="rail-label">{p.title}</span>
            </button>
          );
        })}
      </nav>

      {hasPanel && <aside className={`side-panel ${vimoLeft ? 'right' : 'left'}`} key={beat.id}>{panel}</aside>}

      {settings.captions && (
        <div className={`caption who-${line.who} ${inBubble ? 'compact' : ''}`} aria-live="polite" key={`${beat.id}-${lineIdx}`}>
          <div className="caption-head">
            <span className="who">{line.who === 'kid' ? '❓' : line.who === 'machine' ? '📻' : '👩‍🚀'} {speaker}</span>
            <span className="beat-title">{beat.scene} · {beat.title}</span>
          </div>
          <p className="sr-only">{personalise(line.text, name)}</p>
          {lang === 'bn' && <p className="tiny">{t('captionsBn')}</p>}
          <div className="caption-actions">
            <button className="icon-btn" onClick={() => { audio.unlock(); replayN.current++; setReplayTick(replayN.current); }} aria-label={t('replay')}>↺</button>
            <button className="icon-btn play" onClick={() => { audio.unlock(); setPlaying(!playing); }} aria-label={playing ? t('pause') : t('play')}>{playing ? '⏸' : '▶'}</button>
            {machine && <button className="info-btn" onClick={() => openCard(machine.id)} aria-label={`Info card: ${machine.name}`}>⛑️ {machine.name}</button>}
            <span className="dots" aria-hidden>{beat.lines.map((_, i) => <i key={i} className={i <= lineIdx ? 'on' : ''} />)}</span>
          </div>
        </div>
      )}
      {!settings.captions && machine && <button className="info-btn floating" onClick={() => openCard(machine.id)}>⛑️ {machine.name}</button>}

      {hint && index === 0 && <div className="scroll-hint">⬇️ {t('scrollHint')}</div>}
      {index === N - 1 && narrDone && (
        <div className="finale">
          <h1>Astro Legacy</h1>
          <p>Abandoned, but not forgotten.</p>
          <div className="row wrap center">
            <Btn onClick={() => goTo(0, false)}>↺ Start again</Btn>
            <Link className="btn btn-soft" to="/sources">See all sources</Link>
            <Link className="btn btn-soft" to="/experience">Explore the machines</Link>
            <Link className="btn btn-soft" to="/certificate">🏅 Certificate</Link>
          </div>
        </div>
      )}

      {loading && <div className="loader" role="status"><div className="juggle">⭐<span>✨</span>⭐</div><p>{t('loading')} {Math.round(loadPct)}%</p></div>}

      <div className="scroll-spacer" style={{ height: `${N * 100}vh` }} aria-hidden />

      {breakOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={t('breakTitle')}>
          <div className="modal break-card">
            <h2>☕ {t('breakTitle')}</h2>
            <p>{t('breakText')}</p>
            <p className="tiny">You have {stamps.length} stamps so far.</p>
            <div className="row equal">
              <Btn onClick={() => { setBreakOpen(false); goTo(index + 1); }}>{t('continue')}</Btn>
              <Btn onClick={() => { setBreakOpen(false); nav('/'); }}>{t('stopHere')}</Btn>
            </div>
          </div>
        </div>
      )}
      {trip && <SideTripView id={trip} onClose={() => { setTrip(null); setVimo({ screen: beat.screen, size: beat.size, face: beat.face, gesture: beat.gesture || 'idle' }); }} />}
      <MachineCard />
      <ModelViewer />
      <SettingsPanel />
    </div>
  );
}
