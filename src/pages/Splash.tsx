import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorldCanvas, hasWebGL } from '../scenes/WorldCanvas';
import { SplashStage } from '../scenes/Stage';
import { VimoLayer } from '../vimo/VimoLayer';
import { setVimo, say, react } from '../vimo/controller';
import { useStore } from '../store';
import { useT } from '../data/i18n';
import { audio } from '../audio/engine';
import { Btn, NasaPhoto } from '../ui/common';
import { NameDialog, SettingsPanel } from '../ui/Settings';

/*
  Home (13 Nov 2026): clean, minimal, cinematic. One title, the journey in five words, one big
  "Begin the Story", then Experience Hardwares and Logbook side by side. Language, sound and Menu
  (settings + Sources, NASA data, For parents & teachers, About) sit quietly at the top right.
  No icons on any option.
*/
export default function Splash() {
  const t = useT();
  const nav = useNavigate();
  const progress = useStore((s) => s.progress);
  const visits = useStore((s) => s.visits);
  const name = useStore((s) => s.name);
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const openName = useStore((s) => s.openName);
  const openSettings = useStore((s) => s.openSettings);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const webgl = useMemo(hasWebGL, []);
  // the story saves its place as a beat id; anything past the first welcome line can be continued
  const canContinue = !!progress && progress !== 'intro-1';
  const flow = t('flow').split('|');

  useEffect(() => {
    // VIMO floats beside the solar system and waves.
    // on a phone the title and buttons fill the lower half, so she waves from the top right instead
    const portrait = window.innerHeight > window.innerWidth;
    setVimo(portrait ? { screen: 'right', size: 'S', face: 'cheeky', gesture: 'wave' } : { screen: 'right', size: 'M', face: 'cheeky', gesture: 'wave' });
    const a = setTimeout(() => {
      if (visits > 0 && canContinue) { react('wave', 'happy', 2); say(t('welcomeBack'), 4); }
      else say('VIMO here! Ready, space buddy?', 3.5);
    }, 1400);
    return () => clearTimeout(a);
  }, []);

  const begin = async () => {
    await audio.unlock();
    useStore.getState().setAudioReady();
    audio.playCue('M1');
    if (!name && visits <= 1) openName(true);
    else nav('/story');
  };
  const go = async (to: string) => { await audio.unlock(); nav(to); };
  const soundOn = settings.music || settings.voice;

  return (
    <div className="splash">
      {webgl ? <WorldCanvas><SplashStage /></WorldCanvas> : <div className="photo-backdrop"><NasaPhoto id="PIA12909" alt="Apollo 11 site from orbit" /></div>}
      <VimoLayer />
      <main className="splash-main">
        <h1 className="title">Astro<span>Legacy</span></h1>
        <p className="journey-flow" aria-label={flow.join(', then ')}>
          {flow.map((w, i) => (
            <span key={w} className="jf" style={{ ['--i' as never]: i }}>
              {i > 0 && <span className="jf-arrow" aria-hidden>→</span>}
              <span className="jf-word">{w}</span>
            </span>
          ))}
        </p>
        <div className="splash-actions">
          <Btn className="big cta-main" onClick={begin}>{t('begin')}</Btn>
          {canContinue && <Btn kind="soft" className="big cta-main" onClick={() => go('/story?continue=1')}>{t('continue')}</Btn>}
          <div className="cta-pair">
            <Btn kind="ghost" className="big" onClick={() => go('/experience')}>{t('experience')}</Btn>
            <Btn kind="ghost" className="big" onClick={() => go('/logbook')}>{t('logbook')}</Btn>
          </div>
        </div>
      </main>
      <div className="splash-bar">
        <button className={`pill ${lang === 'en' ? 'on' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`pill bn ${lang === 'bn' ? 'on' : ''}`} onClick={() => setLang('bn')}>বাং</button>
        <button className="pill" onClick={() => { audio.unlock(); setSettings({ music: !soundOn, voice: !soundOn, sfx: !soundOn }); }} aria-pressed={soundOn}>
          {soundOn ? t('soundOn') : t('soundOff')}
        </button>
        <button className="pill" onClick={() => openSettings(true)}>{t('settings')}</button>
      </div>
      <NameDialog onDone={() => nav('/story')} />
      <SettingsPanel />
    </div>
  );
}
