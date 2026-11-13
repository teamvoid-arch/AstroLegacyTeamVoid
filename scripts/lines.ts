// Every spoken line in the app, with a stable id. Shared by the voice generator
// and the data validator. Ids match what the app asks the audio engine to play.
import { beats } from '../src/story/beats.ts';
import { sidetrips } from '../src/story/sidetrips.ts';
import { EXPERIENCES, SHARED } from '../src/experience/experiences.ts';

export interface VoLine { id: string; text: string; who: 'vimo' | 'kid' | 'machine'; era?: string }

export function allLines(): VoLine[] {
  const out: VoLine[] = [];
  for (const b of beats) {
    b.lines.forEach((l, i) => out.push({ id: `${b.id}-${i}`, text: l.text, who: l.who, era: l.era }));
    b.choice?.answers.forEach((a, k) => out.push({ id: `${b.id}-c${k}`, text: a.reply, who: 'vimo' }));
  }
  for (const t of sidetrips) t.lines.forEach((l, i) => out.push({ id: `${t.id}-${i}`, text: l.text, who: l.who, era: l.era }));
  out.push({ id: 'xp-shared-carousel', text: SHARED.carousel, who: 'vimo' });
  for (const e of EXPERIENCES) {
    const x = (k: string, text: string) => out.push({ id: `xp-${e.id}-${k}`, text, who: 'vimo' });
    x('door', SHARED.door); x('enter', e.enter); if (e.imagined) x('inside', SHARED.inside);
    e.steps.forEach((s, i) => { x(`s${i}-ask`, s.ask); x(`s${i}-explain`, s.explain); });
    x('wrong', SHARED.wrong); x('again', SHARED.again); x('win', e.win);
  }
  return out;
}
