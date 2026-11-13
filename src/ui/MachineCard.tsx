import { useNavigate } from 'react-router-dom';
import { machineById, KIND_LABEL, WORLD_COLOR } from '../data/machines';
import { beatIndex } from '../story/beats';
import { useStore } from '../store';
import { useT } from '../data/i18n';
import { ExtLink, Modal, NasaPhoto, STATUS_ICON, Btn } from './common';
import { EXPERIENCES } from '../experience/experiences';

export function MachineCard() {
  const id = useStore((s) => s.cardMachine);
  const openCard = useStore((s) => s.openCard);
  const openModel = useStore((s) => s.openModel);
  const nav = useNavigate();
  const t = useT();
  if (!id) return null;
  const m = machineById[id];
  if (!m) return null;
  const exp = EXPERIENCES.find((e) => e.machine === id);
  return (
    <Modal onClose={() => openCard(null)} label={`${m.name} info card`} className="card-modal">
      <div className="card-head" style={{ borderColor: WORLD_COLOR[m.world] }}>
        <span className="chip" style={{ background: WORLD_COLOR[m.world] }}>{m.world === 'deep' ? 'Deep space' : m.world[0].toUpperCase() + m.world.slice(1)}</span>
        <h2>{m.name}</h2>
        <p className="muted">{m.year} · {m.site}</p>
      </div>
      <NasaPhoto id={m.photo} alt={m.photoAlt || m.name} className="card-photo" />
      <div className={`status status-${m.kind}`}>
        <span aria-hidden>{STATUS_ICON[m.kind]}</span>
        <div><b>{t('status')}:</b> {m.status}<br /><small>{KIND_LABEL[m.kind]}</small></div>
      </div>
      <p className="found"><b>{t('found')}:</b> {m.found}</p>
      {m.note && <p className="note">ℹ️ {m.note}</p>}
      {m.model && <p className="tiny">{m.nasaModel ? `🛰️ ${t('modelNasa')}` : `🛠️ ${t('modelOwn')}`}{m.modelNote ? ` · ${m.modelNote}` : ''}</p>}
      <div className="sources">
        <b>{t('source')}:</b>
        <ul>{m.sources.map((s) => (
          <li key={s.url}><ExtLink href={s.url}>{s.title}</ExtLink>{!s.checked && <span className="tiny"> (link from the team atlas, awaiting fact-check)</span>}</li>
        ))}</ul>
      </div>
      <p className="tiny">{t('silentNote')}</p>
      <div className="row wrap">
        {m.model && <Btn kind="soft" onClick={() => openModel({ machine: id })}>🔄 {t('spin')}</Btn>}
        {m.beat && beatIndex[m.beat] != null && (
          <Btn kind="soft" onClick={() => { openCard(null); nav(`/story?beat=${m.beat}`); }}>📖 {t('seeStory')}</Btn>
        )}
        {exp && <Btn kind="soft" onClick={() => { openCard(null); nav(`/experience/${exp.id}`); }}>🎮 {t('tryIt')}</Btn>}
      </div>
    </Modal>
  );
}
