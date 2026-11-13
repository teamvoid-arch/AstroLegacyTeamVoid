import { useEffect, useRef, useState } from 'react';
import { hubById, tripById } from '../story/sidetrips';
import { machineById, WORLD_COLOR } from '../data/machines';
import { useStore } from '../store';
import { audio } from '../audio/engine';
import { setVimo, react, say } from '../vimo/controller';
import { ExtLink, Modal, NasaPhoto, STATUS_ICON, Btn } from './common';
import { useT, personalise } from '../data/i18n';
import type { Line } from '../data/types';
import { OneLineText } from './OneLineText';

export function HubCards({ hubId, onTrip }: { hubId: string; onTrip: (id: string) => void }) {
  const hub = hubById[hubId];
  const stamps = useStore((s) => s.stamps);
  const t = useT();
  if (!hub) return null;
  return (
    <section className="hub" aria-label={`${t('sideTrips')}: ${hub.title}`}>
      <div className="hub-title">🧭 {t('sideTrips')} · {hub.title}</div>
      <div className="hub-cards">
        {hub.trips.map((id, i) => {
          const trip = tripById[id];
          const m = machineById[trip.machine];
          const done = stamps.includes(m.id);
          return (
            <button key={id} className={`hub-card ${done ? 'done' : ''}`} style={{ ['--c' as any]: WORLD_COLOR[m.world], animationDelay: `${i * 0.4}s` }}
              onClick={() => { audio.unlock(); audio.sfx('card'); onTrip(id); }}>
              <span className="hub-year">{trip.year}</span>
              <b>{trip.title}</b>
              <span className="tiny">{STATUS_ICON[m.kind]} {m.status}</span>
              {done && <span className="hub-stamp">✓ Logged</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function SideTripView({ id, onClose }: { id: string; onClose: () => void }) {
  const trip = tripById[id];
  const m = machineById[trip.machine];
  const addStamp = useStore((s) => s.addStamp);
  const lang = useStore((s) => s.lang);
  const name = useStore((s) => s.name);
  const openModel = useStore((s) => s.openModel);
  const [lineIdx, setLineIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hop, setHop] = useState(0);
  const t = useT();
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    setVimo({ screen: 'left', size: 'M', face: trip.face, gesture: trip.gesture || 'idle' });
    audio.sfx('whoosh');
    (async () => {
      for (let i = 0; i < trip.lines.length; i++) {
        if (!alive.current) return;
        setLineIdx(i);
        await audio.speak(`${trip.id}-${i}`, trip.lines[i], lang);
        await new Promise((r) => setTimeout(r, 350));
      }
      if (!alive.current) return;
      setFinished(true);
      const stamped = [trip.machine, ...(trip.also || [])].map((x) => addStamp(x)).some(Boolean);
      if (stamped) { audio.sfx('stamp'); react('stamp' as any, 'proud', 1.2); say('Not abandoned. Not forgotten. Logged!', 2.6); }
    })();
    return () => { alive.current = false; audio.stopVoice(); };
  }, [id]);

  const line: Line = trip.lines[lineIdx];
  const speaker = line.who === 'machine' ? machineById[line.machine || trip.machine]?.name : line.who === 'kid' ? 'Kid question' : 'VIMO';
  const all = [trip.machine, ...(trip.also || [])].map((x) => machineById[x]);
  return (
    <Modal onClose={onClose} label={`Side trip: ${trip.title}`} className="trip-modal">
      <div className="trip-head" style={{ borderColor: WORLD_COLOR[m.world] }}>
        <span className="chip" style={{ background: WORLD_COLOR[m.world] }}>Side trip · {trip.year}</span>
        <h2>{trip.title}</h2>
      </div>
      <NasaPhoto id={m.photo} alt={m.photoAlt || m.name} className="card-photo" />
      <div className={`caption-inline who-${line.who}`} aria-live="polite">
        <span className="who">{line.who === 'kid' ? '❓ ' : line.who === 'machine' ? '📻 ' : '👩‍🚀 '}{speaker}</span>
        <OneLineText text={personalise(line.text, name)} />
      </div>
      {trip.tryIt === 'hop' && (
        <div className="hop-game">
          <div className="hop-track"><span style={{ left: `${10 + hop * 30}%` }}>🛰️</span><i>2.5 m</i></div>
          <Btn kind="soft" onClick={() => { setHop(hop ? 0 : 1); audio.sfx('thruster'); }}>🔥 Fire! Hop like Surveyor 6</Btn>
        </div>
      )}
      {all.map((x) => (
        <div key={x.id} className={`status status-${x.kind}`}>
          <span aria-hidden>{STATUS_ICON[x.kind]}</span>
          <div><b>{x.name}</b> · {x.status}<br /><small>{t('found')}: {x.found}</small>{x.note && <><br /><small>ℹ️ {x.note}</small></>}</div>
        </div>
      ))}
      <div className="sources"><b>{t('source')}:</b><ul>{all.flatMap((x) => x.sources).map((s) => <li key={s.url}><ExtLink href={s.url}>{s.title}</ExtLink></li>)}</ul></div>
      <div className="row wrap">
        {m.model && <Btn kind="soft" onClick={() => openModel({ machine: m.id })}>🔄 {t('spin')}</Btn>}
        <Btn onClick={onClose}>{finished ? '✓ Fly back to the story' : 'Fly back'}</Btn>
      </div>
    </Modal>
  );
}
