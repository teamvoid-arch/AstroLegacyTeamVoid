import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { expById, SHARED, type Step } from '../experience/experiences';
import { Outside, Room, type XState } from '../experience/Outside';
import { WorldCanvas, hasWebGL } from '../scenes/WorldCanvas';
import { VimoLayer } from '../vimo/VimoLayer';
import { setVimo, react, say, vimo } from '../vimo/controller';
import { audio } from '../audio/engine';
import { useStore } from '../store';
import { machineById } from '../data/machines';
import { Btn, NasaPhoto, photoUrl } from '../ui/common';
import { MachineCard } from '../ui/MachineCard';
import { useT } from '../data/i18n';
import { Sparkles } from '../ui/Sparkles';

function CameraBase({ yaw }: { yaw: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useEffect(() => { camera.position.set(0, 1.1, 0); (camera as THREE.PerspectiveCamera).fov = 62; camera.updateProjectionMatrix(); }, []);
  return null;
}

function RoomFollow({ room, sway }: { room: string; sway: boolean }) {
  const g = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  // The cabin moves with the viewer's seat: the window always frames the action outside.
  useFrame(({ clock }) => {
    g.current.position.copy(camera.position);
    g.current.quaternion.copy(camera.quaternion);
    if (sway) g.current.rotateZ(Math.sin(clock.elapsedTime * 0.4) * 0.01);
  });
  return <group ref={g}><group position={[0, -0.95, -0.8]}><Room room={room} /></group></group>;
}

type Phase = 'enter' | 'ask' | 'acting' | 'explain' | 'win';

export default function ExperienceRoom() {
  const { id = '' } = useParams();
  const exp = expById[id];
  const nav = useNavigate();
  const t = useT();
  const lang = useStore((s) => s.lang);
  const addStamp = useStore((s) => s.addStamp);
  const openCard = useStore((s) => s.openCard);
  const [phase, setPhase] = useState<Phase>('enter');
  const [step, setStep] = useState(0);
  const [readouts, setReadouts] = useState<Record<string, string>>(exp?.readouts || {});
  const [plan, setPlan] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [k, setK] = useState(0);
  const st = useRef<XState>({ step: 0, k: 0, action: null, done: 0 });
  const yaw = useRef(0);
  const drag = useRef<number | null>(null);
  const alive = useRef(true);
  const webgl = hasWebGL();

  const speak = async (key: string, text: string) => {
    setCaption(text);
    vimo.line = { text, key: `xp-${exp.id}-${key}-${performance.now()}` };   // shown in her speech bubble
    await audio.speak(`xp-${exp.id}-${key}`, { who: 'vimo', text }, lang);
  };
  useEffect(() => () => { vimo.line = null; }, []);

  useEffect(() => {
    if (!exp) return;
    alive.current = true;
    setVimo({ screen: 'right', size: 'S', face: 'excited', gesture: 'wave' });
    audio.playCue('M13');
    (async () => {
      await speak('door', SHARED.door);
      if (!alive.current) return;
      setVimo({ face: 'amazed', gesture: 'idle' });
      say('Wow, nice!', 1.6);
      await speak('enter', exp.enter);
      if (exp.imagined && alive.current) await speak('inside', SHARED.inside);
      if (!alive.current) return;
      ask(0);
    })();
    return () => { alive.current = false; audio.stopVoice(); };
  }, [id]);

  if (!exp) return <div className="page"><main className="page-main"><h1>Machine not found</h1><Link to="/experience">Back to the carousel</Link></main></div>;
  const m = machineById[exp.machine];

  function ask(i: number) {
    setStep(i); st.current.step = i; setPhase('ask');
    setVimo({ face: 'curious', gesture: 'point' });
    speak(`s${i}-ask`, exp.steps[i].ask);
  }

  async function press(s: Step, i: number) {
    audio.unlock();
    if (phase !== 'ask') return;
    if (i !== step) { audio.sfx('tryagain'); setVimo({ face: 'cheeky' }); speak('wrong', SHARED.wrong); return; }
    if (s.type === 'arrows' && plan.length < 3) return;
    audio.sfx('pop');
    if (s.sfx) setTimeout(() => audio.sfx(s.sfx!), 120);
    setPhase('acting'); audio.stopVoice();
    setVimo({ face: 'amazed', gesture: 'idle' });
    st.current.action = s.action; st.current.k = 0;
    const dur = (s.duration || 4.5) * 1000;
    const t0 = performance.now();
    await new Promise<void>((res) => {
      const tick = () => {
        const kk = Math.min(1, (performance.now() - t0) / dur);
        st.current.k = kk; setK(kk);
        if (kk < 1 && alive.current) requestAnimationFrame(tick); else res();
      };
      requestAnimationFrame(tick);
    });
    if (!alive.current) return;
    st.current.done = i + 1; st.current.action = null;
    if (s.readouts) setReadouts(s.readouts);
    setPhase('explain');
    setVimo({ face: 'excited', gesture: 'cheer' });
    await speak(`s${i}-explain`, s.explain);
    if (!alive.current) return;
    if (i + 1 < exp.steps.length) ask(i + 1);
    else win();
  }

  function win() {
    setPhase('win');
    audio.sfx('success');
    react('cheer', 'excited', 2.5);
    addStamp(`xp-${exp.id}`);
    document.dispatchEvent(new CustomEvent('al-sparkle', { detail: { x: window.innerWidth / 2, y: window.innerHeight / 3 } }));
    speak('win', exp.win);
  }

  const restart = () => { st.current = { step: 0, k: 0, action: null, done: 0 }; setReadouts(exp.readouts); setPlan([]); speak('again', SHARED.again); setTimeout(() => ask(0), 1800); };

  const action = st.current.action;
  const sideImg =
    exp.id === 'viking' && (action === 'photo' || st.current.done >= 1) ? { id: 'PIA00381', alt: 'First photo on Mars: Viking 1 footpad', clip: action === 'photo' ? 100 - k * 100 : 0 } :
    exp.id === 'opportunity' && (action === 'microscope' || st.current.done === 2) ? { id: 'PIA05273', alt: 'Blueberry stones seen up close', clip: 0 } :
    exp.id === 'lro' && st.current.done >= 2 ? { id: 'PIA12909', alt: 'LRO photo of the Apollo 11 site', clip: 0 } :
    exp.id === 'voyager' && st.current.done >= 2 ? { id: 'PIA00452', alt: 'The Pale Blue Dot', clip: 0 } :
    exp.id === 'rover' && st.current.done >= 3 ? { id: 'as15-86-11603', alt: 'Real Apollo 15 photo of the rover (Earth’s TV view, simplified)', clip: 0 } :
    exp.id === 'newhorizons' && st.current.done >= 3 ? { id: 'PIA19718', alt: 'Pluto’s heart', clip: 0 } : null;

  return (
    <div className={`xp-room room-${exp.room}`}
      onPointerDown={(e) => (drag.current = e.clientX)}
      onPointerMove={(e) => { if (drag.current == null || e.buttons === 0) return; yaw.current = THREE.MathUtils.clamp(yaw.current - (e.clientX - drag.current) * 0.002, -0.52, 0.52); drag.current = e.clientX; }}
      onPointerUp={() => (drag.current = null)}>
      {webgl ? (
        <WorldCanvas>
          <CameraBase yaw={yaw} />
          <Outside exp={exp} s={st} yaw={yaw} />
          <RoomFollow room={exp.room} sway={exp.world === 'deep'} />
        </WorldCanvas>
      ) : <div className="photo-backdrop"><NasaPhoto id={m.photo} alt={m.photoAlt || m.name} /></div>}
      {exp.room === 'open-seat' && <div className="visor" aria-hidden />}
      <VimoLayer />
      <Sparkles />
      <header className="topbar">
        <Link to="/experience" className="home-btn" aria-label="Back to the carousel">◀</Link>
        <div className="year-box"><span className="part-name">{m.name} · {m.year}</span><span className="year small">{exp.title}</span></div>
        <div className="top-actions"><button className="pill" onClick={() => openCard(m.id)} aria-label={`Info card: ${m.name}`}>⛑️</button></div>
      </header>
      {exp.imagined && <div className="imagined">🧠 {t('imagined')}</div>}

      <aside className="screen screen-left" aria-label="Readouts">
        <h4>READOUTS</h4>
        {Object.entries(readouts).map(([kk, v]) => <div key={kk} className="readout"><span>{kk}</span><b>{v}</b></div>)}
        <small>{t('basedOn')}</small>
      </aside>
      <aside className="screen screen-right" aria-label="Side screen">
        {sideImg ? (
          <img src={photoUrl(sideImg.id)} alt={sideImg.alt} style={{ clipPath: `inset(0 0 ${sideImg.clip}% 0)` }} />
        ) : exp.id === 'curiosity' && st.current.done >= 3 ? (
          <div className="spectrum">{['#3b4cff', '#36c', '#2ad', '#4c4', '#ee3', '#f90', '#e33'].map((c, i) => <i key={i} style={{ background: c, height: `${20 + ((i * 37) % 60)}%` }} />)}<small>Light colours → what the rock is made of (simplified)</small></div>
        ) : exp.id === 'sojourner' && plan.length ? (
          <div className="plan">Plan: {plan.join(' ')}</div>
        ) : (exp.id === 'insight' && action === 'quake') ? (
          <svg viewBox="0 0 200 60" className="seismo"><polyline fill="none" stroke="#FFC94D" strokeWidth="2" points={Array.from({ length: 100 }, (_, i) => `${i * 2},${30 + Math.sin(i * 1.7) * (i > 30 ? 18 * Math.exp(-(i - 30) / 30) * Math.min(1, k * 3) : 2)}`).join(' ')} /></svg>
        ) : exp.id === 'mirror' ? (
          <div className="timer-big">⏱️ {action === 'beam' ? (k * 1.28).toFixed(2) : action === 'return' ? (1.28 + k * 1.28).toFixed(2) : st.current.done >= 3 ? '2.56' : '0.00'} s</div>
        ) : exp.id === 'voyager' && action === 'signal' ? (
          <div className="timer-big">📡 hello travelling… ≈ 1 day</div>
        ) : (
          <div className="screen-idle">{m.name}<br /><small>{m.status}</small></div>
        )}
      </aside>

      <div className="vimo-caption" aria-live="polite">👩‍🚀 {caption}</div>

      {phase !== 'win' ? (
        <div className={`console era-${exp.room}`} role="group" aria-label="Control console">
          {exp.steps.map((s, i) => (
            <div key={s.control} className="control-wrap">
              {s.type === 'arrows' && i === step && phase === 'ask' && (
                <div className="arrows">{['⬆️', '⬅️', '➡️'].map((a) => <button key={a} onClick={() => { if (plan.length < 3) { setPlan([...plan, a]); audio.sfx('blip'); } }} aria-label={`Plan move ${a}`}>{a}</button>)}</div>
              )}
              <button className={`control control-${s.type} ${i < step || (i === step && phase !== 'ask') ? 'used' : ''} ${i === step && phase === 'ask' ? 'next' : ''}`}
                onClick={() => press(s, i)} aria-label={`${s.label}${i === step && phase === 'ask' ? ' (press this one next)' : ''}`}>
                <span className="cap">{s.icon}</span>
                <span className="lbl">{s.label}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="win-card">
          <h2>⭐ {exp.win}</h2>
          <p><b>Real fact:</b> {exp.fact}</p>
          <p className="tiny">Gold stamp added to your logbook. {t('basedOn')}.</p>
          <div className="row wrap center">
            <Btn onClick={() => nav('/experience')}>Back to the carousel</Btn>
            <Btn kind="soft" onClick={restart}>Try again</Btn>
            {m.beat && <Btn kind="soft" onClick={() => nav(`/story?beat=${m.beat}`)}>📖 See it in the story</Btn>}
          </div>
        </div>
      )}
      <MachineCard />
    </div>
  );
}
