import { useState, type ReactNode } from 'react';
import photos from '../data/photos.json';
import { useT } from '../data/i18n';
import { audio } from '../audio/engine';

const P = photos as Record<string, { medium: string; thumb: string; page: string; title?: string }>;

export function photoUrl(id?: string, size: 'medium' | 'thumb' = 'medium') {
  if (!id || !P[id]) return undefined;
  return P[id][size];
}
export function photoPage(id?: string) { return id && P[id] ? P[id].page : undefined; }
export function photoTitle(id?: string) { return id && P[id] ? P[id].title : undefined; }

/** A real NASA photo with alt text, credit and a graceful fallback. */
export function NasaPhoto({ id, alt, className = '', size = 'medium', credit = true }: { id?: string; alt: string; className?: string; size?: 'medium' | 'thumb'; credit?: boolean }) {
  const [failed, setFailed] = useState(false);
  const url = photoUrl(id, size);
  const t = useT();
  if (!url || failed) {
    return <div className={`photo-missing ${className}`} role="img" aria-label={alt}><span>🛰️</span></div>;
  }
  const illus = /illustration|artist/i.test(alt + (photoTitle(id) || ''));
  return (
    <figure className={`nasa-photo ${className}`}>
      <img src={url} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      {credit && <figcaption>{illus ? t('illustration') : t('realPhoto')} · NASA · <ExtLink href={photoPage(id)!}>{id}</ExtLink></figcaption>}
    </figure>
  );
}

/** External links show a "You are leaving Astro Legacy" note (Challenge Brief §7). */
export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const t = useT();
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer"
      onClick={(e) => { if (!window.confirm(t('leaving'))) e.preventDefault(); }}>
      {children}
    </a>
  );
}

export function Modal({ onClose, children, label, className = '' }: { onClose: () => void; children: ReactNode; label: string; className?: string }) {
  const t = useT();
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
        <button className="modal-close" onClick={() => { audio.sfx('pop'); onClose(); }} aria-label={t('close')}>✕</button>
        {children}
      </div>
    </div>
  );
}

export function Btn({ children, onClick, kind = 'primary', className = '', ...rest }: { children: ReactNode; onClick?: () => void; kind?: 'primary' | 'ghost' | 'soft'; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`btn btn-${kind} ${className}`} onClick={() => { audio.unlock(); audio.sfx('pop'); onClick?.(); }} {...rest}>
      {children}
    </button>
  );
}

export const STATUS_ICON: Record<string, string> = { working: '🟢', quiet: '🌙', once: '⭐' };
