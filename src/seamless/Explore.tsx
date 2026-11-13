import { Link } from 'react-router-dom';
import { PageShell } from '../pages/PageShell';
import { useStore } from '../store';
import { hasFinished } from './state';
import { useST } from './i18n';
import './seamless.css';

/** "Explore more" (Final version): the extras wait for the end of the story, all behind one door. */
export default function Explore() {
  const t = useST();
  const stamps = useStore((s) => s.stamps.length);
  const done = hasFinished();
  const doors = [
    { to: '/map', title: 'Where We Left Them', text: 'The map of every NASA machine on the Moon, on Mars and in deep space, pinned at its real site.' },
    { to: '/experience', title: '🎮 Experience Mode', text: 'Sit in 14 mission rooms and press the buttons while the window shows the machine at work.' },
    { to: '/classic', title: '🛰️ Side trips', text: 'The scroll story with all 34 side trips: more machines on the Moon, Mars and in deep space.' },
    { to: '/logbook', title: `📒 Logbook · ★ ${stamps}`, text: 'Your stamps, the sorting game and the 5-question quiz.' },
    { to: '/certificate', title: '🏅 Certificate', text: 'Make a certificate with your first name. It stays on this device.' },
    { to: '/sources', title: '📚 Sources', text: 'Every fact in the story, with its NASA page.' },
    { to: '/story', title: '↺ Watch the story again', text: 'From the Dhaka rooftop to the stars, start to end.' },
  ];
  return (
    <PageShell title={t('explore.title')} subtitle={done ? t('explore.body') : 'Tip: the story is best first. Everything here is open anyway.'}>
      <div className="sl-explore-grid">
        {doors.map((d) => (
          <Link key={d.to} to={d.to} className="sl-explore-card">
            <strong>{d.title}</strong>
            <span>{d.text}</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
