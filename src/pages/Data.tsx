import { ExtLink } from '../ui/common';
import { PageShell } from './PageShell';

const NASA = [
  ['NASA Image and Video Library (images-api.nasa.gov)', 'https://images.nasa.gov/', '52 real mission photos, resolved with the official API: every info card, the Ranger 7 slideshow, Viking’s first photo, the LRO view of Apollo 11, blueberries, Three Forks, the Pale Blue Dot.'],
  ['NASA 3D Resources', 'https://github.com/nasa/NASA-3D-Resources', '9 NASA 3D models shown with their geometry unchanged: Lunar Module, Viking Lander, Perseverance, Ingenuity, Opportunity, LRO, Voyager, Pioneer 10, InSight.'],
  ['NASA SVS CGI Moon Kit', 'https://svs.gsfc.nasa.gov/4720', 'Moon colour map on every Moon globe (from LRO data).'],
  ['NASA NSSDCA Master Catalog', 'https://nssdc.gsfc.nasa.gov/nmc/', 'Launch, landing and mission facts for the 20 main-path missions (links on each card).'],
  ['NASA Blue Marble / Black Marble', 'https://visibleearth.nasa.gov/collection/1484/blue-marble', 'Earth day map and city lights (via the three.js example textures).'],
  ['NASA History Office', 'https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/', 'Ranger 7 photo count (4,308).'],
  ['NASA JPL news and NASA Science mission status', 'https://science.nasa.gov/?p=338314', 'Dated status badges: Voyager 1 one light-day on 18 Nov 2026; Ingenuity as a stationary testbed.'],
  ['Catalogue of Manmade Material on the Moon (NASA History Office)', 'https://www.nasa.gov/wp-content/uploads/2024/02/final-catalogue-of-manmade-material-on-the-moon.pdf', 'The “How much is up there?” counter in the Logbook: 796 objects (figure from the team’s Challenge Brief; awaiting fact-check against the PDF).'],
];
const PARTNER = [
  ['LROC Featured Sites (Arizona State University, the LRO camera team)', 'https://www.lroc.asu.edu/featured_sites', 'University operator of NASA’s LRO camera; the orbit photos of Apollo hardware.'],
  ['HiRISE (University of Arizona, the MRO camera team)', 'https://www.uahirise.org/', 'University operator of NASA’s MRO HiRISE camera; the Phoenix-from-orbit photo on the MRO card.'],
  ['ESA (European Space Agency): Ulysses', 'https://www.esa.int/', 'Ulysses was a joint NASA + ESA mission; its card says so.'],
];

export default function Data() {
  return (
    <PageShell title="NASA data in Astro Legacy" subtitle="NASA data drives the story: the photos are the proof, the 3D models are the real machines, and every status badge is dated.">
      <h2>NASA sources</h2>
      <table className="data-table"><thead><tr><th>Dataset</th><th>What we used and where</th></tr></thead>
        <tbody>{NASA.map(([n, u, w]) => <tr key={n}><td><ExtLink href={u}>{n}</ExtLink></td><td>{w}</td></tr>)}</tbody></table>
      <h2>Partner and third-party sources (not NASA)</h2>
      <table className="data-table"><thead><tr><th>Source</th><th>What we used and where</th></tr></thead>
        <tbody>{PARTNER.map(([n, u, w]) => <tr key={n}><td><ExtLink href={u}>{n}</ExtLink></td><td>{w}</td></tr>)}</tbody></table>
      <p className="note">Honesty notes: procedural planets (Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) are our own shader art, not NASA maps. Simulations in TRY IT and Experience Mode are simplified and labelled. Space is silent; all sounds are added for the story.</p>
    </PageShell>
  );
}
