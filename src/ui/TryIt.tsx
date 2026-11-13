import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TryItId } from '../data/types';
import { useStore } from '../store';
import { audio } from '../audio/engine';
import { react, say } from '../vimo/controller';
import { machineById, machines, PLANET_PHOTOS, KIND_LABEL } from '../data/machines';
import { NasaPhoto, Btn, photoUrl, ExtLink } from './common';
import { personalise } from '../data/i18n';

const cheer = (text = 'Oh-ho-ho! Look at THAT!') => { react('cheer', 'excited', 1.4); say(text, 2.2); audio.sfx('success'); };
const gentleNo = (text = 'Oops-a-meteor! Try again, you’ve got this.') => { react('shrug', 'gentle', 1.2); say(text, 2.4); audio.sfx('tryagain'); };

function Panel({ title, children, done, label = 'TRY IT' }: { title: string; children: React.ReactNode; done?: boolean; label?: string }) {
  return (
    <section className={`tryit ${done ? 'done' : ''}`} aria-label={`${label}: ${title}`}>
      <div className="tryit-tag">{done ? '✅ Done!' : `👆 ${label}`}</div>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

// 1.1 — I'm ready!
function Ready({ onDone }: { onDone: () => void }) {
  const [d, setD] = useState(false);
  return (
    <Panel title="Ready to visit our friends?" done={d}>
      <button className="big-chunky" onClick={() => { setD(true); cheer('Best space buddy ever!'); audio.sfx('stamp'); onDone(); }} disabled={d}>
        {d ? '⭐ First stamp space is glowing!' : "I'm ready!"}
      </button>
    </Panel>
  );
}

// 1.2 — How would you travel?
function Travel() {
  const [v, setV] = useState(0);
  const set = useStore((s) => s.setTravelMode);
  const opts = [
    { k: 'Car (100 km/h)', d: 'about 160 days', note: 'our own calculation' },
    { k: 'Jet plane (900 km/h)', d: 'about 18 days', note: 'our own calculation' },
    { k: 'Apollo spacecraft', d: 'about 3 days', note: 'NASA Moon facts' },
  ];
  return (
    <Panel title="How would you travel to the Moon?">
      <input type="range" min={0} max={2} step={1} value={v} onChange={(e) => { const n = Number(e.target.value); setV(n); set(n); audio.sfx('blip'); }} aria-label="Choose how to travel" className="slider" />
      <div className="row between tiny"><span>🚗 Car</span><span>✈️ Jet</span><span>🚀 Apollo</span></div>
      <p className="answer"><b>{opts[v].k}:</b> {opts[v].d} <small>({opts[v].note})</small></p>
      <p className="tiny">Distance: about 384,400 km (NASA). Scroll to watch the tape measure fill.</p>
    </Panel>
  );
}

// 2.1 — Fall with Ranger 7
function RangerFall({ onDone }: { onDone: () => void }) {
  const [k, setK] = useState(0);
  const start = useRef<number | null>(null);
  const done = useRef(false);
  const blur = Math.round((1 - k) * 10);
  const photos = ['PIA02975', 'PIA02974'];
  return (
    <Panel title="Fall with Ranger 7: drag down!" done={k >= 1}>
      <div className="drag-pad" onPointerDown={(e) => { start.current = e.clientY; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (start.current == null) return; const n = Math.min(1, Math.max(0, (e.clientY - start.current) / 160)); setK(n); if (n >= 1 && !done.current) { done.current = true; audio.sfx('shutter'); cheer('The closest Moon photos ever!'); onDone(); } }}
        onPointerUp={() => (start.current = null)} role="slider" aria-label="Drag down to fall towards the Moon" aria-valuenow={Math.round(k * 100)} tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowDown') { const n = Math.min(1, k + 0.2); setK(n); if (n >= 1 && !done.current) { done.current = true; onDone(); } } }}>
        <img src={photoUrl(photos[k > 0.6 ? 1 : 0])} alt="A real Ranger 7 photo of the Moon getting sharper" style={{ filter: `blur(${blur}px)`, transform: `scale(${1 + k * 0.5})` }} />
        <span className="drag-label">{k < 1 ? `⬇️ ${Math.round(k * 4000)} photos…` : 'More than 4,000 photos!'}</span>
      </div>
      <p className="tiny">Real Ranger 7 photos · NASA/JPL</p>
    </Panel>
  );
}

// 2.2 — Land it softly (hold to fire)
function SoftLand({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<'ready' | 'flying' | 'bounce' | 'landed'>('ready');
  const [h, setH] = useState(100);
  const [v, setV] = useState(0);
  const firing = useRef(false);
  useEffect(() => {
    if (state !== 'flying') return;
    let hh = 100, vv = 0, raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      vv += (1.62 * 6 - (firing.current ? 22 : 0)) * dt; // simplified Moon gravity (sped up)
      vv = Math.max(-6, vv);
      hh -= vv * dt * 3;
      if (hh > 120) { hh = 120; vv = 0; }
      if (hh <= 0) {
        if (vv < 7) { setState('landed'); audio.sfx('thump'); cheer('Touchdown! Feet on top of the dust!'); onDone(); }
        else { setState('bounce'); gentleNo('Too fast! Real engineers try again too.'); }
        setH(0); setV(vv); return;
      }
      setH(hh); setV(vv); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);
  return (
    <Panel title="Land it softly: hold the button to fire the rocket" done={state === 'landed'}>
      <div className="lander-game" aria-live="polite">
        <div className="lander-track"><div className="lander" style={{ bottom: `${h * 0.8}%` }}>🛰️{firing.current && state === 'flying' ? '🔥' : ''}</div><div className="lander-ground" /></div>
        <div className="readouts"><span>Height {Math.round(h)}</span><span>Speed {Math.max(0, v).toFixed(1)}</span><span className={v < 7 ? 'ok' : 'warn'}>{v < 7 ? 'gentle' : 'too fast'}</span></div>
      </div>
      {state === 'ready' || state === 'bounce' ? (
        <Btn onClick={() => setState('flying')}>{state === 'bounce' ? 'Try again' : 'Start descent'}</Btn>
      ) : state === 'flying' ? (
        <button className="big-chunky hold" onPointerDown={() => { firing.current = true; audio.sfx('thruster'); }} onPointerUp={() => (firing.current = false)} onPointerLeave={() => (firing.current = false)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') firing.current = true; }} onKeyUp={() => (firing.current = false)}>🔥 Hold to fire</button>
      ) : <p className="answer">Landed safely, just like Surveyor 1 in 1966!</p>}
      <p className="tiny">Simplified simulation, for fun.</p>
    </Panel>
  );
}

function MissingCamera() {
  const openCard = useStore((s) => s.openCard);
  return (
    <Panel title="Psst! Surveyor 3’s camera is missing. Where is it now?">
      <Btn onClick={() => { audio.sfx('chime'); openCard('surveyor3'); }}>🔎 Tap to find out</Btn>
      <p className="tiny">The Apollo 12 astronauts brought it home to Earth for scientists to study.</p>
    </Panel>
  );
}

function Seismo({ active }: { active: number }) {
  const path = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = i * 2.5;
      const e = active ? Math.exp(-Math.max(0, i - 20) / 40) * (i > 20 ? 1 : 0) : 0;
      const y = 30 + Math.sin(i * 1.3) * 2 + Math.sin(i * 2.7 + active) * 14 * e;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [active]);
  return <svg viewBox="0 0 300 60" className="seismo" aria-label="Seismograph line"><polyline points={path} fill="none" stroke="#FFC94D" strokeWidth="2" /></svg>;
}

function RingMoon({ onDone }: { onDone: () => void }) {
  const fire = useStore((s) => s.fire);
  const [n, setN] = useState(0);
  return (
    <Panel title="Ring the Moon" done={n > 0}>
      <Btn onClick={() => { fire('ring-moon'); setN(n + 1); audio.sfx('bell'); if (!n) { onDone(); say('The Moon rang like a bell!'); } }}>🔔 Drop the ascent stage</Btn>
      <Seismo active={n} />
      <p className="tiny">Our own sound, made for the story. The real Moon shook for about an hour.</p>
    </Panel>
  );
}

function FindModel({ machine, title }: { machine: string; title: string }) {
  const openModel = useStore((s) => s.openModel);
  return (
    <Panel title={title}>
      <Btn onClick={() => openModel({ machine })}>🔄 Spin the {machineById[machine].name} (NASA 3D model)</Btn>
    </Panel>
  );
}

function Laser({ onDone }: { onDone: () => void }) {
  const fire = useStore((s) => s.fire);
  const [state, setState] = useState<'idle' | 'flying' | 'back'>('idle');
  const [ms, setMs] = useState(0);
  const go = () => {
    fire('laser'); setState('flying'); audio.sfx('laser');
    const t0 = performance.now();
    const tick = () => {
      const e = performance.now() - t0; setMs(e);
      if (e < 2560) requestAnimationFrame(tick); else { setState('back'); setMs(2560); audio.sfx('chime'); onDone(); say('Ping! The mirror answered!'); }
    };
    requestAnimationFrame(tick);
  };
  return (
    <Panel title="Fire the laser at the Moon" done={state === 'back'}>
      <Btn onClick={go} disabled={state === 'flying'}>🌍 Tap Earth to fire</Btn>
      <div className="timer" aria-live="polite">⏱️ {(ms / 1000).toFixed(2)} s {state === 'back' ? '— round trip!' : ''}</div>
      <p className="tiny">Light round trip ≈ 2.5 s: our calculation from the Moon’s distance. Shown in real time.</p>
    </Panel>
  );
}

function MoonJump({ onDone }: { onDone: () => void }) {
  const [cm, setCm] = useState(30);
  const openModel = useStore((s) => s.openModel);
  return (
    <Panel title="Moon jump!">
      <label className="tiny">Your jump on Earth: <b>{cm} cm</b></label>
      <input type="range" min={10} max={80} value={cm} onChange={(e) => { setCm(Number(e.target.value)); onDone(); }} className="slider" aria-label="Your jump height on Earth in centimetres" />
      <div className="jump-bars"><div style={{ height: `${cm / 5}px` }}>🌍 {cm} cm</div><div style={{ height: `${(cm * 6) / 5}px` }}>🌕 {cm * 6} cm</div></div>
      <p className="tiny">On the Moon you weigh about one sixth, so you jump about 6 times higher (simplified).</p>
      <Btn kind="soft" onClick={() => openModel({ machine: 'apollo15-rover' })}>🔄 Spin the rover: find the antenna</Btn>
    </Panel>
  );
}

function MarsMessage({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState('Hello');
  const [mins, setMins] = useState(12);
  const [k, setK] = useState(-1);
  const send = () => {
    audio.sfx('blip'); const t0 = performance.now(); const total = mins * 400; // 1 real minute = 0.4 s here
    const tick = () => { const e = (performance.now() - t0) / total; setK(Math.min(1, e)); if (e < 1) requestAnimationFrame(tick); else { audio.sfx('chime'); onDone(); react('cheer', 'surprised', 1); say('It arrived! Finally!'); } };
    requestAnimationFrame(tick);
  };
  return (
    <Panel title="Send a message to Mars" done={k >= 1}>
      <form className="row" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input className="text-input" value={text} onChange={(e) => setText(e.target.value.slice(0, 20))} aria-label="Your message" />
        <Btn type="submit">📡 Send</Btn>
      </form>
      <label className="tiny">Mars distance today: one-way delay <b>{mins} minutes</b></label>
      <input type="range" min={3} max={22} value={mins} onChange={(e) => setMins(Number(e.target.value))} className="slider" aria-label="One-way delay in minutes" />
      <div className="msg-track"><span>🌍</span><div className="msg" style={{ left: `${Math.max(0, k) * 88}%`, opacity: k < 0 ? 0 : 1 }}>💬 {text}</div><span>🔴</span></div>
      <p className="tiny">{k >= 0 ? `${Math.round(Math.max(0, k) * mins)} of ${mins} minutes (sped up: 1 minute = 0.4 s)` : 'NASA: 3 to 22 minutes one way.'}</p>
    </Panel>
  );
}

function DriveSojourner({ onDone }: { onDone: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 2 });
  const [queue, setQueue] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const rock = { x: 4, y: 0 };
  const moves: Record<string, [number, number]> = { '⬆️': [0, -1], '⬇️': [0, 1], '⬅️': [-1, 0], '➡️': [1, 0] };
  const send = () => {
    if (!queue.length) return;
    setBusy(true); audio.sfx('radio');
    let p = { ...pos };
    setTimeout(() => {
      queue.forEach((m, i) => setTimeout(() => {
        p = { x: Math.max(0, Math.min(4, p.x + moves[m][0])), y: Math.max(0, Math.min(3, p.y + moves[m][1])) };
        setPos({ ...p }); audio.sfx('servo');
        if (i === queue.length - 1) {
          setBusy(false); setQueue([]);
          if (p.x === rock.x && p.y === rock.y) { cheer('You reached the rock!'); onDone(); }
          else say('Not there yet. Plan more moves!');
        }
      }, i * 600));
    }, 2200); // message delay (sped up)
  };
  return (
    <Panel title="Drive Sojourner to the rock (with a message delay)">
      <div className="grid-map" aria-label="Map of Sojourner and the rock">
        {Array.from({ length: 20 }, (_, i) => { const x = i % 5, y = Math.floor(i / 5); return (
          <div key={i} className="cell">{x === pos.x && y === pos.y ? '🚙' : x === rock.x && y === rock.y ? '🪨' : x === 0 && y === 3 ? '🛖' : ''}</div>); })}
      </div>
      <div className="row wrap">{Object.keys(moves).map((m) => <button key={m} className="arrow-btn" disabled={busy || queue.length >= 6} onClick={() => { setQueue([...queue, m]); audio.sfx('blip'); }} aria-label={`Add move ${m}`}>{m}</button>)}</div>
      <p className="tiny">Plan: {queue.join(' ') || '—'}</p>
      <Btn onClick={send} disabled={busy || !queue.length}>{busy ? '📡 Waiting for Mars…' : '📡 Send plan'}</Btn>
    </Panel>
  );
}

function Blueberries({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [zoom, setZoom] = useState(1);
  return (
    <Panel title="Find the blueberries: zoom in and tap each one you spot" done={n >= 5}>
      <div className="zoom-photo" style={{ ['--z' as any]: zoom }}>
        <img src={photoUrl('PIA05273')} alt="Real Opportunity photo of tiny round 'blueberry' stones on the ground" onClick={() => { if (n < 5) { const k = n + 1; setN(k); audio.sfx('pop'); if (k === 5) { cheer('Five blueberries! Rocks like these form in water.'); onDone(); } } }} />
      </div>
      <div className="row"><Btn kind="soft" onClick={() => setZoom(Math.min(3, zoom + 0.5))}>➕ Zoom</Btn><Btn kind="soft" onClick={() => setZoom(Math.max(1, zoom - 0.5))}>➖</Btn><span className="count">🫐 {n}/5</span></div>
      <p className="tiny">Real NASA/JPL photo (PIA05273). Mars, billions of years ago, had water: the blue water in the 3D scene is an artist’s idea.</p>
    </Panel>
  );
}

function Layers({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const openModel = useStore((s) => s.openModel);
  return (
    <Panel title="Read the layers of Mount Sharp" done={n >= 4}>
      <div className="layers">{[0, 1, 2, 3].map((i) => (
        <button key={i} className={`layer ${i < n ? 'on' : ''}`} onClick={() => { if (i === n) { setN(n + 1); audio.sfx('page'); if (n + 1 === 4) { onDone(); say('Like pages in a book!'); } } }}>
          {i < n ? `Page ${4 - i}: older than the one above` : 'Tap the next layer'}
        </button>))}</div>
      <p className="tiny">Lower layers formed first, so they are older. Curiosity found that Gale crater once held a lake.</p>
      <Btn kind="soft" onClick={() => openModel({ machine: 'curiosity' })}>🔄 Spin Curiosity</Btn>
    </Panel>
  );
}

function Marsquake({ onDone }: { onDone: () => void }) {
  const fire = useStore((s) => s.fire);
  const [n, setN] = useState(0);
  return (
    <Panel title="Listen to a marsquake" done={n > 0}>
      <Btn onClick={() => { fire('marsquake'); setN(n + 1); audio.sfx('quake'); if (!n) onDone(); }}>👂 Listen</Btn>
      <Seismo active={n} />
      <p className="tiny">Our own sound, made for the story (not NASA’s recording).</p>
    </Panel>
  );
}

const CODE_WORDS = ['DARE', 'MIGHTY', 'THINGS'];
function ParachuteCode({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<Set<string>>(new Set());
  const total = CODE_WORDS.join('').length;
  const reveal = (key: string) => {
    const s = new Set(shown); s.add(key); setShown(s); audio.sfx('blip');
    if (s.size === total) { cheer('DARE MIGHTY THINGS!'); onDone(); }
  };
  return (
    <Panel title="Crack the parachute code" done={shown.size === total}>
      <p className="tiny">Each letter is a number in binary (A = 1, B = 2 …). Red = 1, white = 0. Tap a code to decode it.</p>
      {CODE_WORDS.map((w, wi) => (
        <div key={w} className="code-ring">{w.split('').map((ch, i) => {
          const key = `${wi}-${i}`; const n = ch.charCodeAt(0) - 64;
          const bits = n.toString(2).padStart(5, '0');
          return (
            <button key={key} className={`code-cell ${shown.has(key) ? 'open' : ''}`} onClick={() => reveal(key)} aria-label={`Code ${bits}`}>
              <span className="bits">{bits.split('').map((b, j) => <i key={j} className={b === '1' ? 'r' : 'w'} />)}</span>
              <b>{shown.has(key) ? ch : '?'}</b>
            </button>);
        })}</div>
      ))}
      <Btn kind="soft" onClick={() => { const all = new Set<string>(); CODE_WORDS.forEach((w, wi) => w.split('').forEach((_, i) => all.add(`${wi}-${i}`))); setShown(all); onDone(); }}>Show the answer</Btn>
      <p className="tiny">A simplified version of the real code. NASA JPL: the real parachute pattern spells “Dare Mighty Things” and JPL’s coordinates in binary.</p>
    </Panel>
  );
}

function FlyIngenuity({ onDone }: { onDone: () => void }) {
  const [h, setH] = useState(0);
  const [time, setTime] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const holding = useRef(false);
  const flying = useRef(false);
  useEffect(() => {
    let raf = 0, last = performance.now(), hh = 0, tt = 0, peak = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (holding.current) { hh = Math.min(10, hh + dt * 2.5); flying.current = true; }
      else hh = Math.max(0, hh - dt * 2);
      if (flying.current) tt += dt;
      peak = Math.max(peak, hh);
      if (flying.current && hh === 0 && !holding.current) {
        flying.current = false;
        if (tt > 1) { setLog((l) => [`Flight ${l.length + 1}: ${peak.toFixed(1)} m high, ${tt.toFixed(1)} s`, ...l].slice(0, 3)); audio.sfx('thump'); if (peak > 3) { cheer('Perfect flight!'); onDone(); } }
        tt = 0; peak = 0;
      }
      setH(hh); setTime(tt); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <Panel title="Fly Ingenuity: hold to lift, let go to land">
      <div className="heli-track"><div className="heli" style={{ bottom: `${h * 8}%` }}>🚁</div></div>
      <div className="readouts"><span>Height {h.toFixed(1)} m</span><span>Time {time.toFixed(1)} s</span></div>
      <button className="big-chunky hold" onPointerDown={() => { holding.current = true; audio.sfx('blades'); }} onPointerUp={() => (holding.current = false)} onPointerLeave={() => (holding.current = false)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') holding.current = true; }} onKeyUp={() => (holding.current = false)}>⬆️ Hold to fly</button>
      {log.length > 0 && <ul className="flight-log">{log.map((l) => <li key={l}>📒 {l}</li>)}</ul>}
      <p className="tiny">Simplified flight log, for fun. The real Ingenuity flew 72 times.</p>
    </Panel>
  );
}

function CountTubes({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  return (
    <Panel title="Count the tubes at Three Forks" done={n >= 10}>
      <div className="tubes">{Array.from({ length: 10 }, (_, i) => (
        <button key={i} className={`tube ${i < n ? 'on' : ''}`} disabled={i !== n} onClick={() => { const k = n + 1; setN(k); audio.sfx('clink'); if (k === 10) { cheer('Ten tubes, waiting for a ride!'); onDone(); } }} aria-label={`Tube ${i + 1}`}>{i < n ? i + 1 : '🧪'}</button>
      ))}</div>
      <NasaPhoto id="PIA25681" alt="Perseverance selfie at the Three Forks sample depot" className="small-photo" />
    </Panel>
  );
}

function PlanetParade({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  return (
    <Panel title="Planet parade: tap each giant Voyager 2 visited" done={seen.size >= PLANET_PHOTOS.length}>
      <div className="row wrap">{[{ planet: 'Jupiter', photo: '' }, ...PLANET_PHOTOS].map((p) => (
        <Btn key={p.planet} kind={open === p.planet ? 'primary' : 'soft'} onClick={() => { setOpen(p.planet); const s = new Set(seen); if (p.photo) s.add(p.planet); setSeen(s); if (s.size === PLANET_PHOTOS.length) onDone(); }}>{p.planet}</Btn>
      ))}</div>
      {open && open !== 'Jupiter' && <NasaPhoto id={PLANET_PHOTOS.find((p) => p.planet === open)!.photo} alt={`${open}, photographed by Voyager 2`} className="small-photo" />}
      {open === 'Jupiter' && <p className="tiny">Voyager 2 flew past Jupiter too. See NASA’s photos: <ExtLink href="https://images.nasa.gov/search?q=Voyager%202%20Jupiter&media=image">NASA Image Library</ExtLink></p>}
    </Panel>
  );
}

function GoldenRecord() {
  const openModel = useStore((s) => s.openModel);
  return (
    <Panel title="What is on the golden record?">
      <ul className="record-list"><li>🌧️ Rain</li><li>🐦 Birds</li><li>👶 A baby’s laugh</li><li>👋 Greetings</li><li>🎵 Music from Earth</li></ul>
      <p className="tiny">We only use NASA-released clips, so listen on NASA’s page: <ExtLink href="https://science.nasa.gov/mission/voyager/golden-record-contents/">Voyager golden record (NASA)</ExtLink></p>
      <Btn kind="soft" onClick={() => openModel({ machine: 'voyager1' })}>🔄 Spin Voyager 1: find the golden record</Btn>
    </Panel>
  );
}

function PlutoHeart({ onDone }: { onDone: () => void }) {
  const fire = useStore((s) => s.fire);
  return (
    <Panel title="Find Pluto’s heart">
      <Btn onClick={() => { fire('pluto-heart'); audio.sfx('chime'); react('heart', 'tears', 1.6); onDone(); }}>🔄 Spin Pluto</Btn>
      <NasaPhoto id="PIA19718" alt="The heart of Pluto, photographed by New Horizons" className="small-photo" />
    </Panel>
  );
}

function FindLeftovers({ onDone }: { onDone: () => void }) {
  const [zoom, setZoom] = useState(1);
  const openModel = useStore((s) => s.openModel);
  return (
    <Panel title="Find the leftovers: a real LRO photo of the Apollo 11 site">
      <div className="zoom-photo" style={{ ['--z' as any]: zoom }}>
        <img src={photoUrl('PIA12909')} alt="LRO photo of the Apollo 11 landing site, labelled by NASA, showing the lander and paths" />
      </div>
      <div className="row"><Btn kind="soft" onClick={() => { setZoom(Math.min(3, zoom + 0.5)); onDone(); }}>➕ Zoom in</Btn><Btn kind="soft" onClick={() => setZoom(Math.max(1, zoom - 0.5))}>➖</Btn></div>
      <p className="tiny">NASA’s labels show the lander’s bottom half, instruments and the astronauts’ paths. NASA/GSFC/Arizona State University.</p>
      <Btn kind="soft" onClick={() => openModel({ machine: 'lro' })}>🔄 Spin LRO (NASA 3D model)</Btn>
    </Panel>
  );
}

// 4.2 — Sort the machines
const SORT_IDS = ['ranger7', 'surveyor1', 'apollo11-eagle', 'apollo11-mirror', 'apollo15-rover', 'lro', 'viking1', 'opportunity', 'curiosity', 'insight', 'ingenuity', 'perseverance', 'landing-leftovers', 'pioneer10', 'voyager1', 'new-horizons'];
export function Sorting({ onDone }: { onDone?: () => void }) {
  const [left, setLeft] = useState(SORT_IDS);
  const [sel, setSel] = useState<string | null>(SORT_IDS[0]);
  const [boxes, setBoxes] = useState<Record<string, string[]>>({ working: [], quiet: [], once: [] });
  const [msg, setMsg] = useState('Pick a box for each machine.');
  const drop = (kind: string, id = sel) => {
    if (!id) return;
    const m = machineById[id];
    if (m.kind === kind) {
      const nl = left.filter((x) => x !== id);
      setLeft(nl); setBoxes({ ...boxes, [kind]: [...boxes[kind], id] }); setSel(nl[0] || null);
      setMsg(`${m.name}: “Thanks for remembering me!”`); audio.sfx('stamp'); react('thumbs', 'happy', 1);
      if (!nl.length) { cheer("See? Old doesn't mean abandoned."); onDone?.(); }
    } else {
      setMsg(`Hmm, remember: ${m.status}`); gentleNo('Hmm, look at its status again!');
    }
  };
  return (
    <section className="sorting" aria-label="Sort the machines game">
      <h3>Sort the machines</h3>
      <p className="tiny">Tap a machine, then tap its box. (You can drag on a computer too.)</p>
      <div className="sort-cards">{left.map((id) => (
        <button key={id} draggable onDragStart={(e) => e.dataTransfer.setData('text', id)} className={`sort-card ${sel === id ? 'sel' : ''}`} onClick={() => { setSel(id); audio.sfx('card'); }}>
          <img src={photoUrl(machineById[id].photo, 'thumb')} alt="" /> {machineById[id].name}
        </button>))}</div>
      <div className="sort-boxes">{(['working', 'quiet', 'once'] as const).map((k) => (
        <button key={k} className={`sort-box box-${k}`} onClick={() => drop(k)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(k, e.dataTransfer.getData('text'))}>
          <b>{KIND_LABEL[k]}</b><span>{boxes[k].length} ✓</span>
        </button>))}</div>
      <p className="answer" aria-live="polite">{msg}</p>
    </section>
  );
}

// Quiz
const QUIZ = [
  { q: 'Which machine still answers lasers from Earth?', a: ['The Apollo 11 laser mirror', 'Ranger 7', 'Viking 1'], ok: 0 },
  { q: 'Opportunity was planned for 90 days. How long did it explore?', a: ['90 days', 'More than 14 years', 'One week'], ok: 1 },
  { q: 'What was the first thing Viking 1 photographed on Mars?', a: ['A Martian', 'The Sun', 'Its own foot'], ok: 2 },
  { q: 'How many times did Ingenuity fly on Mars?', a: ['72 times', '5 times', 'Once'], ok: 0 },
  { q: "What secret is hidden in Perseverance's parachute?", a: ['Hello Mars', 'Dare Mighty Things', 'Go Team'], ok: 1 },
];
export function Quiz({ onDone }: { onDone?: () => void }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const name = useStore((s) => s.name);
  if (i >= QUIZ.length) return (
    <section className="quiz"><h3>🏅 {personalise('Great job, space buddy!', name)} {score}/{QUIZ.length}</h3>
      <Link className="btn btn-primary" to="/certificate">Get your certificate</Link></section>
  );
  const Q = QUIZ[i];
  return (
    <section className="quiz" aria-label="Quiz">
      <p className="tiny">Question {i + 1} of {QUIZ.length}</p>
      <h3>{Q.q}</h3>
      <div className="col">{Q.a.map((a, k) => (
        <button key={a} className={`quiz-a ${wrong === k ? 'wrong' : ''}`} onClick={() => {
          if (k === Q.ok) { if (wrong === null) setScore(score + 1); setWrong(null); react('spin', 'happy', 1); audio.sfx('success'); const n = i + 1; setI(n); if (n === QUIZ.length) onDone?.(); }
          else { setWrong(k); gentleNo(); }
        }}>{a}</button>))}</div>
    </section>
  );
}

function SortingStep({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'sort' | 'quiz'>('sort');
  return (
    <section className="tryit wide">
      {phase === 'sort' ? <Sorting onDone={() => { onDone(); setTimeout(() => setPhase('quiz'), 1500); }} /> : <Quiz />}
      {phase === 'sort' && <button className="link-btn" onClick={() => setPhase('quiz')}>Skip to the quiz →</button>}
    </section>
  );
}

export function TryIt({ id, onDone }: { id: TryItId; onDone: () => void }) {
  switch (id) {
    case 'ready': return <Ready onDone={onDone} />;
    case 'travel': return <Travel />;
    case 'ranger-fall': return <RangerFall onDone={onDone} />;
    case 'soft-land': return <SoftLand onDone={onDone} />;
    case 'missing-camera': return <MissingCamera />;
    case 'ring-moon': return <RingMoon onDone={onDone} />;
    case 'find-ladder': return <FindModel machine="apollo11-eagle" title="Spin the Eagle: can you find the ladder?" />;
    case 'laser': return <Laser onDone={onDone} />;
    case 'moon-jump': return <MoonJump onDone={onDone} />;
    case 'mars-message': return <MarsMessage onDone={onDone} />;
    case 'drive-sojourner': return <DriveSojourner onDone={onDone} />;
    case 'blueberries': return <Blueberries onDone={onDone} />;
    case 'layers': return <Layers onDone={onDone} />;
    case 'marsquake': return <Marsquake onDone={onDone} />;
    case 'parachute-code': return <ParachuteCode onDone={onDone} />;
    case 'fly-ingenuity': return <FlyIngenuity onDone={onDone} />;
    case 'count-tubes': return <CountTubes onDone={onDone} />;
    case 'planet-parade': return <PlanetParade onDone={onDone} />;
    case 'golden-record': return <GoldenRecord />;
    case 'pluto-heart': return <PlutoHeart onDone={onDone} />;
    case 'find-leftovers': return <FindLeftovers onDone={onDone} />;
    case 'sorting': return <SortingStep onDone={onDone} />;
    case 'quiz': return <Quiz onDone={onDone} />;
    default: return null;
  }
}

export const ALL_MAIN_MACHINES = machines.filter((m) => m.path === 'main').map((m) => m.id);
