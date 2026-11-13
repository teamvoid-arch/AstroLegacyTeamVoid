import { useState } from 'react';
import { Link } from 'react-router-dom';
import { machines, WORLD_COLOR } from '../data/machines';
import { useStore } from '../store';
import { photoUrl, STATUS_ICON } from '../ui/common';
import { MachineCard } from '../ui/MachineCard';
import { ModelViewer } from '../ui/ModelViewer';
import { Sorting, Quiz } from '../ui/TryIt';
import { PageShell } from './PageShell';
import { HowMuch } from '../ui/HowMuch';
import { beats } from '../story/beats';

const STICKERS = [
  { id: 'part1', face: '😄', label: 'Excited VIMO', need: 1 },
  { id: 'part2', face: '🤩', label: 'Amazed VIMO', need: 2 },
  { id: 'part3', face: '😎', label: 'Brave VIMO', need: 3 },
  { id: 'part4', face: '🥹', label: 'Happy-tears VIMO', need: 4 },
];

export default function Logbook() {
  const stamps = useStore((s) => s.stamps);
  const progress = useStore((s) => s.progress);
  const openCard = useStore((s) => s.openCard);
  const [tab, setTab] = useState<'stamps' | 'sort' | 'quiz'>('stamps');
  const reachedPart = progress ? beats.find((b) => b.id === progress)?.part || 0 : 0;
  const worlds = [['moon', '🌕 The Moon'], ['mars', '🔴 Mars'], ['deep', '🌌 Deep space']] as const;
  return (
    <PageShell title="VIMO's Logbook" subtitle={`“Logger” has ${stamps.length} of ${machines.length} stamps. Not abandoned. Not forgotten. Logged!`} paper>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'stamps'} onClick={() => setTab('stamps')}>📒 Stamps</button>
        <button role="tab" aria-selected={tab === 'sort'} onClick={() => setTab('sort')}>🗂️ Sort the machines</button>
        <button role="tab" aria-selected={tab === 'quiz'} onClick={() => setTab('quiz')}>❓ Quiz</button>
        <Link to="/certificate" className="tab-link">🏅 Certificate</Link>
      </div>
      {tab === 'stamps' && (
        <>
          <HowMuch />
          <div className="stickers">{STICKERS.map((s) => (
            <div key={s.id} className={`sticker ${reachedPart >= s.need ? 'on' : ''}`} title={s.label}><span>{reachedPart >= s.need ? s.face : '🔒'}</span><small>{s.label}</small></div>
          ))}</div>
          {worlds.map(([w, label]) => (
            <section key={w}>
              <h2 style={{ color: WORLD_COLOR[w] }}>{label}</h2>
              <div className="stamp-grid">
                {machines.filter((m) => m.world === w).map((m) => {
                  const got = stamps.includes(m.id);
                  return (
                    <button key={m.id} className={`stamp ${got ? 'got' : ''} ${m.path}`} style={{ ['--c' as any]: WORLD_COLOR[w] }} onClick={() => openCard(m.id)} aria-label={`${m.name}${got ? ', stamped' : ', not visited yet'}`}>
                      <span className="stamp-img">{m.photo ? <img src={photoUrl(m.photo, 'thumb')} alt="" loading="lazy" /> : <span>🛰️</span>}</span>
                      <b>{m.name}</b>
                      <small>{m.year} · {STATUS_ICON[m.kind]}</small>
                      {got && <span className="stamp-mark">LOGGED</span>}
                      {m.path === 'side' && <span className="side-tag">side trip</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          <p className="tiny">Tap any machine to open its card, even before you visit it. 🟢 still working · 🌙 went quiet · ⭐ used once or crashed on purpose.</p>
        </>
      )}
      {tab === 'sort' && <Sorting />}
      {tab === 'quiz' && <Quiz />}
      <MachineCard />
      <ModelViewer />
    </PageShell>
  );
}
