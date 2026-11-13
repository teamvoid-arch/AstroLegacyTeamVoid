import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { useT } from '../data/i18n';

export function PageShell({ title, subtitle, children, paper = false }: { title: string; subtitle?: string; children: ReactNode; paper?: boolean }) {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const t = useT();
  return (
    <div className={`page ${paper ? 'paper' : ''}`}>
      <header className="page-top">
        <Link to="/" className="home-btn" aria-label="Home">🏠</Link>
        <nav className="page-nav">
          <Link to="/story?continue=1">📖 Story</Link>
          <Link to="/experience">🎮 Experience</Link>
          <Link to="/logbook">📒 {t('logbook')}</Link>
          <Link to="/sources">📚 {t('sources')}</Link>
        </nav>
        <button className="pill bn" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}>{lang === 'en' ? 'বাংলা' : 'English'}</button>
      </header>
      <main className="page-main">
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
        {children}
      </main>
      <footer className="page-foot">
        <Link to="/about">About</Link> · <Link to="/data">NASA data</Link> · <Link to="/teachers">For parents & teachers</Link> ·
        <span> Not affiliated with or endorsed by NASA.</span>
      </footer>
    </div>
  );
}
