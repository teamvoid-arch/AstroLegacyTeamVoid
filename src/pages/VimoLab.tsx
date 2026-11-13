import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Face, Gesture } from '../data/types';
import { VimoLayer } from '../vimo/VimoLayer';
import { setVimo, vimo, react } from '../vimo/controller';

/** VIMO lab: try every emotion, gesture and a sample line, with VIMO big in the middle. */
const FACES: Face[] = ['happy', 'excited', 'curious', 'amazed', 'proud', 'thinking', 'cheeky', 'surprised', 'nervous', 'sad', 'gentle', 'brave', 'sleepy', 'tears'];
const GESTURES: Gesture[] = ['idle', 'wave', 'point', 'salute', 'cheer', 'thumbs', 'cover-eyes', 'heart', 'logbook', 'stamp', 'whisper', 'shrug', 'count', 'listen', 'shiver', 'sleepy', 'dizzy', 'bow', 'sit', 'hop', 'spin', 'loop', 'crash'];
const LINES = [
  'Oops! Soft landing... mostly. Hi! I\'m VIMO.',
  'Ranger 7 sent back more than 4,000 photos!',
  'Why would anyone crash a camera on purpose?',
  'In December 2022, InSight went quiet. Thank you for listening, InSight.',
  'Not abandoned. Not forgotten. Logged!',
  'আমি ভিমো! চলো, মহাকাশে ঘুরে আসি!',
];

export default function VimoLab() {
  const [face, setFace] = useState<Face>('happy');
  const [gesture, setGesture] = useState<Gesture>('idle');
  const [size, setSize] = useState<'M' | 'L' | 'XL'>('L');
  useEffect(() => { setVimo({ screen: 'centre', size, face, gesture }); }, [face, gesture, size]);
  useEffect(() => () => { vimo.line = null; }, []);
  const sayLine = (text: string) => { vimo.line = { text, key: `lab-${performance.now()}` }; };

  return (
    <div className="vimo-lab">
      <VimoLayer />
      <aside className="lab-panel">
        <Link to="/" className="btn btn-soft">◀ Home</Link>
        <h2>VIMO lab</h2>
        <p className="tiny">Emotion</p>
        <div className="lab-row">{FACES.map((f) => <button key={f} className={f === face ? 'on' : ''} onClick={() => setFace(f)}>{f}</button>)}</div>
        <p className="tiny">Gesture</p>
        <div className="lab-row">{GESTURES.map((g) => <button key={g} className={g === gesture ? 'on' : ''} onClick={() => { setGesture(g); if (['spin', 'loop', 'crash', 'cheer'].includes(g)) react(g, face, 1.6); }}>{g}</button>)}</div>
        <p className="tiny">Say a line (she reads it and reacts)</p>
        <div className="lab-col">{LINES.map((l) => <button key={l} onClick={() => sayLine(l)}>{l}</button>)}</div>
        <p className="tiny">Size</p>
        <div className="lab-row">{(['M', 'L', 'XL'] as const).map((s) => <button key={s} className={s === size ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}</div>
      </aside>
    </div>
  );
}
