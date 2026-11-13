/*
  The story, Final version flow (12 Nov 2026 "One seamless story"):
  plays from start to end like a film you can touch. One big Next (or swipe up), a small Pause.
  Fixed order Moon → Mars → Deep space → home. Every stop: VIMO arrives → VIMO TV → card → Try it → stamp.
  The 3D world is this app's (NASA models, Team VOID replicas, launch, landings, era colour grade).
*/
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProgress } from '@react-three/drei';
import { useStore } from '../store';
import { audio } from '../audio/engine';
import { VimoLayer } from '../vimo/VimoLayer';
import { setVimo } from '../vimo/controller';
import { WorldCanvas, ERA_FILTER, hasWebGL } from '../scenes/WorldCanvas';
import { Stage, stageKey } from '../scenes/Stage';
import { BeatOverlays } from '../ui/BeatOverlays';
import { Sparkles } from '../ui/Sparkles';
import { SettingsPanel } from '../ui/Settings';
import { MachineCard as InfoCard } from '../ui/MachineCard';
import { ModelViewer } from '../ui/ModelViewer';
import { NasaPhoto } from '../ui/common';
import { machineById } from '../data/machines';
import { preloadModel } from '../three/Machine';
import { useStory } from './state';
import { BEATS, engine } from './engine';
import { appMachineId, stageBeatFor } from './bridge';
import { TourScene } from './TourScene';
import { unlockSfx, sfx } from './sfx';
import { Archie, AskBox, Captions, ChoicePanel, Controls, EndScreen, HoldLabels, LobbyPanel, StopCard, TopBar, TourTag, TryItPanel, VimoTV } from './ui';
import { LobbyScene } from './LobbyScene';
import { AtmosScene } from './AtmosScene';
import { MapLayer } from './MapLayer';
import { StoryBubble } from './StoryBubble';
import './seamless.css';

/** Era grade by year for the tour (B&W 1964 → colour today); stages use their own era. */
function eraByYear(year: number | null | undefined) {
  if (!year) return 'none';
  if (year < 1969) return ERA_FILTER['1960s'];
  if (year < 1980) return ERA_FILTER['1970s'];
  if (year < 2000) return ERA_FILTER['1990s'];
  if (year < 2010) return ERA_FILTER['2000s'];
  return 'none';
}

/** Next (scroll / swipe / key) only moves the story on when it isn't waiting for a choice in the lobby or after a world. */
function canStep() {
  const s = useStory.getState();
  return s.phase !== 'lobby' && s.phase !== 'choice' && s.phase !== 'done';
}

export default function SeamlessStory() {
  const [params] = useSearchParams();
  const lite = useStore((s) => s.settings.lite);
  const settingsOpen = useStore((s) => s.settingsOpen);
  const beatIndex = useStory((s) => s.beatIndex);
  const phase = useStory((s) => s.phase);
  const yearOverride = useStory((s) => s.yearOverride);
  const webgl = useMemo(hasWebGL, []);
  const beat = BEATS[beatIndex];
  const stageBeat = stageBeatFor(beatIndex);
  const inLobby = !!beat?.lobby || phase === 'lobby';
  // quick tours play on the team's own map (MapLayer); the 3D world behind it just rests
  const scene = inLobby ? 'lobby' : beat?.quick ? 'map' : beat?.id === 'atmosphere' ? 'atmos' : beat?.tour ? 'tour' : stageKey(stageBeat);
  const [shown, setShown] = useState(scene);
  const [warp, setWarp] = useState(false);
  const { active: loading, progress: loadPct } = useProgress();

  // Start: ?beat=<id> (from a machine card), ?continue=1 (saved place), else the beginning.
  useEffect(() => {
    const want = params.get('beat') ?? (params.get('continue') ? useStore.getState().progress : null);
    const from = want ? Math.max(0, BEATS.findIndex((b) => b.id === want)) : 0;
    document.body.classList.add('sl-body');
    unlockSfx();
    engine.start(from);
    const onVis = () => { if (document.hidden) engine.setPaused(true); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      document.body.classList.remove('sl-body');
      engine.stop();
      audio.stopMusic();
      setVimo({ screen: 'centre', size: 'M' });
    };
  }, []);

  // Sound turns on with the first tap (phones block sound until then).
  useEffect(() => {
    const on = () => { void audio.unlock(); unlockSfx(); };
    window.addEventListener('pointerdown', on, { once: true });
    return () => window.removeEventListener('pointerdown', on);
  }, []);

  // Settings sheet pauses the story; closing it resumes.
  useEffect(() => { if (!settingsOpen && useStory.getState().paused && phase !== 'done') engine.setPaused(false); }, [settingsOpen]);

  // Keyboard: ↓ / → / PageDown = Next, ↑ / ← / PageUp = Previous, Space = Pause.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); if (canStep()) engine.next(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); engine.prev(); }
      if (e.key === ' ') { e.preventDefault(); engine.setPaused(!useStory.getState().paused); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll (mouse wheel / trackpad): down = Next, up = Previous, one step per gesture.
  // Swipe on a phone: up = Next, down = Previous. Never while a Try it, Archie or a menu is up.
  useEffect(() => {
    let acc = 0, lock = 0;
    const inside = (t: EventTarget | null) => !!(t as HTMLElement)?.closest?.('.sl-tryit, .archie-sheet-wrap, .modal, .modal-backdrop, .sl-choice, .sl-lobby-bar');
    const onWheel = (e: WheelEvent) => {
      if (inside(e.target) || useStory.getState().archieOpen || useStore.getState().settingsOpen) return;
      const now = performance.now();
      if (now < lock) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 60) return;
      if (acc > 0) { if (canStep()) engine.next(); } else engine.prev();
      acc = 0; lock = now + 750; // one beat step per scroll gesture
    };
    let y0: number | null = null, onPanel = false;
    const down = (e: TouchEvent) => { y0 = e.touches[0].clientY; onPanel = inside(e.target); };
    const up = (e: TouchEvent) => {
      const busy = onPanel || useStory.getState().phase === 'tryit' || useStory.getState().archieOpen;
      if (!busy && y0 !== null) {
        const dy = y0 - e.changedTouches[0].clientY;
        if (dy > 60 && canStep()) engine.next();
        if (dy < -60) engine.prev();
      }
      y0 = null;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchend', up, { passive: true });
    return () => { window.removeEventListener('wheel', onWheel); window.removeEventListener('touchstart', down); window.removeEventListener('touchend', up); };
  }, []);

  // A short warp when the place changes; the 3D stage swaps behind it. No loading screens.
  useEffect(() => {
    if (scene === shown) return;
    setWarp(true);
    sfx('whoosh-soft');
    const a = setTimeout(() => setShown(scene), 380);
    const b = setTimeout(() => setWarp(false), 900);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [scene]);

  // While one stop plays, the next stops' NASA models stream in.
  useEffect(() => {
    for (let i = beatIndex + 1; i < Math.min(BEATS.length, beatIndex + 6); i++) {
      const p = stageBeatFor(i).prop;
      const m = p ? machineById[p]?.model : undefined;
      if (m && !m.startsWith('proc:')) preloadModel(m);
    }
  }, [beatIndex]);

  const shownBeat = shown === 'tour' || shown === 'lobby' || shown === 'atmos' || shown === 'map' ? null : stageBeat;
  const grade = shown === 'lobby' || shown === 'atmos' || shown === 'map' ? 'none' : shown === 'tour' ? eraByYear(yearOverride ?? beat?.year) : ERA_FILTER[stageBeat.era];
  // quick tours add a motion blur that follows the camera's speed (TourScene writes --sl-blur)
  const filter = `${grade === 'none' ? '' : grade} blur(var(--sl-blur, 0px))`.trim();
  const machine = beat?.machineId ? machineById[appMachineId(beat.machineId)] : null;

  return (
    <div className={`sl ${inLobby ? 'in-lobby' : ''} ${beat?.after || phase === 'choice' ? 'in-choice' : ''}`}>
      <div className={`stage-wrap sl-stage era-${stageBeat.era}`} style={{ filter: filter || undefined }}>
        {webgl ? (
          <WorldCanvas>
            {shown === 'map' ? <color attach="background" args={['#060914']} /> : shown === 'lobby' ? <LobbyScene /> : shown === 'atmos' ? <AtmosScene /> : shown === 'tour' ? <TourScene /> : <Stage key={shown} beat={shownBeat!} />}
          </WorldCanvas>
        ) : (
          <div className="photo-backdrop"><NasaPhoto id={machine?.photo || 'PIA12909'} alt={machine?.photoAlt || 'NASA photo'} /></div>
        )}
        {shownBeat && stageBeat.era === '1960s' && <div className="scanlines" />}
      </div>
      {beat?.quick && <MapLayer />}
      <div className={`warp ${warp ? 'on' : ''}`} aria-hidden />
      {!lite && <div className="sl-vignette" aria-hidden />}
      <VimoLayer />
      <Sparkles />
      {shownBeat && phase !== 'video' && phase !== 'card' && <BeatOverlays beat={shownBeat} />}
      {/* every line in a speech bubble: VIMO beside her head, a machine above its 3D model, one line at a time */}
      <StoryBubble />
      <TopBar />
      <Captions />
      <HoldLabels />
      {/* quick tours: the team's map shows each machine's own card, timeline and year slider */}
      <LobbyPanel />
      <AskBox />
      <ChoicePanel />
      <VimoTV />
      <StopCard />
      <TryItPanel />
      <Archie />
      <TourTag />
      <Controls />
      <EndScreen />
      {loading && <div className="sl-loading" role="status"><span className="juggle">⭐</span> {Math.round(loadPct)}%</div>}
      <SettingsPanel />
      <InfoCard />
      <ModelViewer />
    </div>
  );
}
