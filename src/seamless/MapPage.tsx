import { useNavigate } from 'react-router-dom';
import { useT } from '../data/i18n';

/** The team's "Where We Left Them" map, full page: every NASA machine pinned and named at its real site. */
export default function MapPage() {
  const nav = useNavigate();
  const t = useT();
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#060914' }}>
      <iframe title="Where We Left Them: map of NASA hardware" src={`${import.meta.env.BASE_URL}map/index.html`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      <button className="pill" style={{ position: 'fixed', top: 12, right: 12, zIndex: 2 }}
        onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))}>{t('back')}</button>
    </div>
  );
}
