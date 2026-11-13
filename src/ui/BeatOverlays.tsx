import { useEffect, useState } from 'react';
import type { Beat } from '../data/types';
import { live } from '../store';
import { photoUrl } from './common';

/** 2D picture-in-picture moments that sit over the 3D scene (real NASA photos). */
export function BeatOverlays({ beat }: { beat: Beat }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => { setT(Math.round(live.t * 50) / 50); raf = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  const fx = beat.fx || [];
  return (
    <>
      {beat.label && <div className="site-label" key={beat.id}>📍 {beat.label}</div>}
      {fx.includes('photos') && (
        <div className="pip pip-right">
          <img src={photoUrl(t < 0.5 ? 'PIA02974' : 'PIA02975')} alt="Real Ranger 7 photos of the Moon" style={{ filter: 'grayscale(1)' }} />
          <div className="pip-cap">Ranger 7 photo #{Math.min(4308, Math.round(1 + t * 4307)).toLocaleString()} · NASA/JPL</div>
        </div>
      )}
      {fx.includes('pip') && (
        <div className="pip pip-right">
          <img src={photoUrl('PIA12909')} alt="LRO photo of the Apollo 11 landing site from orbit" />
          <div className="pip-cap">LRO camera: Apollo 11 site, seen from orbit · NASA/GSFC/ASU</div>
        </div>
      )}
      {fx.includes('photo-lines') && (
        <div className="pip pip-right">
          <img src={photoUrl('PIA00381')} alt="The first photograph taken on the surface of Mars: Viking 1's footpad" style={{ clipPath: `inset(0 0 ${Math.max(0, 100 - t * 160)}% 0)` }} />
          <div className="pip-cap">First photo on Mars, 20 July 1976 · NASA/JPL</div>
        </div>
      )}
      {fx.includes('storm') && t > 0.4 && (
        <div className="pip pip-right">
          <img src={photoUrl('PIA22329')} alt="NASA map showing the 2018 dust storm covering Opportunity's site" />
          <div className="pip-cap">The 2018 dust storm · NASA/JPL-Caltech/MSSS</div>
        </div>
      )}
      {fx.includes('calendar') && (
        <div className="calendar" aria-label="Calendar">
          <div className="cal-top">PLANNED: <s>90 DAYS</s></div>
          <div className="cal-year">{Math.round(2004 + t * 14)}</div>
          <div className="cal-sub">{t < 0.15 ? 'Day 90… still going!' : t < 0.95 ? 'still exploring…' : 'more than 14 years!'}</div>
        </div>
      )}
      {fx.includes('plaque') && (
        <div className="plaque" role="img" aria-label="The Apollo 11 plaque text">
          <div className="plaque-in">HERE MEN FROM THE PLANET EARTH<br />FIRST SET FOOT UPON THE MOON<br />JULY 1969, A.D.<br /><b>WE CAME IN PEACE FOR ALL MANKIND</b></div>
          <small>Apollo 11 plaque text (our drawing)</small>
        </div>
      )}
      {(fx.includes('water') && t > 0.4) && <div className="artist-label">💧 Mars, billions of years ago: artist’s idea</div>}
      {fx.includes('delta') && <div className="artist-label">💧 Faint blue lines: a river long ago (artist’s idea)</div>}
      {fx.includes('layers') && <div className="artist-label">📖 Mount Sharp’s layers (simplified)</div>}
      {fx.includes('code') && <div className="artist-label">🪂 Parachute pattern (simplified)</div>}
      {fx.includes('ascent') && beat.scene === '2.4' && t > 0.3 && <div className="artist-label">⬆️ The top half flies home; the bottom half stays as the launch pad</div>}
      {fx.includes('no-camera') && <div className="artist-label">🔎 The glowing ring marks where the camera was</div>}
    </>
  );
}
