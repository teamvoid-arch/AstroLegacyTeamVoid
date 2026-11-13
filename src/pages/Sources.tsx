import { machines, WORLD_COLOR, KIND_LABEL } from '../data/machines';
import { ExtLink, photoPage } from '../ui/common';
import { PageShell } from './PageShell';

export default function Sources() {
  const total = machines.reduce((a, m) => a + m.sources.length, 0);
  const checked = machines.reduce((a, m) => a + m.sources.filter((s) => s.checked).length, 0);
  return (
    <PageShell title="Sources" subtitle={`Every machine card, grouped by world, with its NASA source links (${total} links; ${checked} opened and matched by the team on 8 Nov 2026, the rest from the team's Hardware Atlas, awaiting the fact-checker).`}>
      {(['moon', 'mars', 'deep'] as const).map((w) => (
        <section key={w}>
          <h2 style={{ color: WORLD_COLOR[w] }}>{w === 'deep' ? 'Deep space' : w === 'moon' ? 'The Moon' : 'Mars'}</h2>
          {machines.filter((m) => m.world === w).map((m) => (
            <article key={m.id} className="source-item">
              <h3>{m.name} <small>({m.year}, {m.path === 'main' ? 'main story' : 'side trip'})</small></h3>
              <p><b>Status:</b> {m.status} <i>({KIND_LABEL[m.kind]})</i></p>
              <p><b>What it found:</b> {m.found}</p>
              {m.note && <p className="note">{m.note}</p>}
              <ul>
                {m.sources.map((s) => <li key={s.url}><ExtLink href={s.url}>{s.title}</ExtLink> {s.checked ? '✓ link checked' : '· awaiting fact-check'}</li>)}
                {m.photo && <li>Photo: <ExtLink href={photoPage(m.photo)!}>NASA Image and Video Library, {m.photo}</ExtLink></li>}
                {m.model && <li>3D: {m.nasaModel ? 'NASA 3D Resources model (unchanged geometry)' : 'simple model by Team VOID'}</li>}
              </ul>
            </article>
          ))}
        </section>
      ))}
      <section>
        <h2>Credits</h2>
        <ul>
          <li>NASA 3D Resources (github.com/nasa/NASA-3D-Resources): Apollo Lunar Module, Viking Lander, Mars 2020 Perseverance Rover, Ingenuity Mars Helicopter, MER-B Opportunity, LRO (A), Voyager Probe (A), Pioneer 10, InSight Cruise Lander (arm deployed).</li>
          <li>NASA SVS CGI Moon Kit (svs.gsfc.nasa.gov/4720): Moon colour map.</li>
          <li>Earth day and night textures: NASA Blue Marble / Black Marble, as packaged in the three.js examples (MIT).</li>
          <li>Mars, giant planets, Pluto and the star field: original procedural shaders by Team VOID (not NASA maps).</li>
          <li>Photos: NASA Image and Video Library (images.nasa.gov), credited on each card.</li>
          <li>Music and sound effects: original, generated in the browser by our own code (Web Audio). Space is silent: sounds are added for the story.</li>
          <li>Voice: ElevenLabs text-to-speech when generated (see AI_USE.md); otherwise your browser’s built-in voice.</li>
          <li>Fonts: Baloo 2, Baloo Da 2, Nunito (SIL Open Font License) via Google Fonts.</li>
          <li>Code libraries: React, three.js, React Three Fiber, drei, postprocessing, Zustand, React Router (all open source).</li>
        </ul>
      </section>
    </PageShell>
  );
}
