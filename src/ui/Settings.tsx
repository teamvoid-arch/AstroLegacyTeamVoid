import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { useT } from '../data/i18n';
import { Btn, Modal } from './common';
import { audio } from '../audio/engine';

export function SettingsPanel() {
  const open = useStore((s) => s.settingsOpen);
  const openSettings = useStore((s) => s.openSettings);
  const s = useStore((st) => st.settings);
  const set = useStore((st) => st.setSettings);
  const lang = useStore((st) => st.lang);
  const setLang = useStore((st) => st.setLang);
  const reset = useStore((st) => st.resetProgress);
  const [confirm, setConfirm] = useState(false);
  const t = useT();
  if (!open) return null;
  const Toggle = ({ k, label }: { k: 'music' | 'voice' | 'sfx' | 'captions' | 'reducedMotion' | 'lite'; label: string }) => (
    <label className="toggle">
      <input type="checkbox" checked={s[k]} onChange={(e) => set({ [k]: e.target.checked })} />
      <span>{label}</span>
    </label>
  );
  const Vol = ({ k, label }: { k: 'musicVol' | 'voiceVol' | 'sfxVol'; label: string }) => (
    <label className="vol"><span>{label}</span>
      <input type="range" min={0} max={1} step={0.05} value={s[k]} onChange={(e) => set({ [k]: Number(e.target.value) })} aria-label={`${label} volume`} />
    </label>
  );
  return (
    <Modal onClose={() => openSettings(false)} label={t('settings')}>
      <h2>{t('settings')}</h2>
      {/* Menu (13 Nov 2026): the pages that used to sit in the home page footer */}
      <nav className="menu-links" aria-label={t('explore')}>
        <Link to="/sources" onClick={() => openSettings(false)}>{t('sources')}</Link>
        <Link to="/data" onClick={() => openSettings(false)}>{t('data')}</Link>
        <Link to="/teachers" onClick={() => openSettings(false)}>{t('teachers')}</Link>
        <Link to="/about" onClick={() => openSettings(false)}>{t('about')}</Link>
      </nav>
      <div className="settings-grid">
        <fieldset><legend>{t('language')}</legend>
          <div className="row">
            <Btn kind={lang === 'en' ? 'primary' : 'ghost'} onClick={() => setLang('en')}>English</Btn>
            <Btn kind={lang === 'bn' ? 'primary' : 'ghost'} onClick={() => setLang('bn')} className="bn">বাংলা</Btn>
          </div>
        </fieldset>
        <fieldset><legend>Sound</legend>
          <Toggle k="music" label={t('music')} /><Vol k="musicVol" label={t('music')} />
          <Toggle k="voice" label={t('voice')} /><Vol k="voiceVol" label={t('voice')} />
          <Toggle k="sfx" label={t('effects')} /><Vol k="sfxVol" label={t('effects')} />
          <p className="tiny">{audio.hasGeneratedVoice() ? 'Voice: ElevenLabs narration files.' : 'Voice: your browser’s built-in voice (ElevenLabs narration not generated yet).'}</p>
        </fieldset>
        <fieldset><legend>Comfort</legend>
          <Toggle k="captions" label={t('captions')} />
          <Toggle k="reducedMotion" label={t('reducedMotion')} />
          <Toggle k="lite" label={t('lite')} />
        </fieldset>
        <fieldset><legend>Privacy</legend>
          <p className="tiny">Your name, stamps and progress are saved only on this device. Nothing is sent anywhere.</p>
          {!confirm ? <Btn kind="ghost" onClick={() => setConfirm(true)}>{t('reset')}</Btn> : (
            <div className="row"><Btn kind="primary" onClick={() => { reset(); setConfirm(false); }}>Yes, reset</Btn><Btn kind="ghost" onClick={() => setConfirm(false)}>Keep it</Btn></div>
          )}
        </fieldset>
      </div>
    </Modal>
  );
}

export function NameDialog({ onDone }: { onDone: () => void }) {
  const open = useStore((s) => s.nameOpen);
  const openName = useStore((s) => s.openName);
  const setName = useStore((s) => s.setName);
  const [v, setV] = useState('');
  const t = useT();
  if (!open) return null;
  const done = (save: boolean) => { if (save && v.trim()) setName(v); openName(false); onDone(); };
  return (
    <Modal onClose={() => done(false)} label={t('nameAsk')}>
      <h2>👩‍🚀 {t('nameAsk')}</h2>
      <p className="muted">{t('nameHint')}</p>
      <form onSubmit={(e) => { e.preventDefault(); done(true); }}>
        <input className="text-input" value={v} onChange={(e) => setV(e.target.value)} maxLength={24} autoFocus placeholder="Rafi, Nadia…" aria-label="First name" autoComplete="off" />
        <div className="row equal">
          <Btn kind="primary" type="submit">{t('save')}</Btn>
          <Btn kind="primary" type="button" onClick={() => done(false)}>{t('skip')}</Btn>
        </div>
      </form>
    </Modal>
  );
}
