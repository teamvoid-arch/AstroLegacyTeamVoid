import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';
import { beats } from '../story/beats';
import { machines } from '../data/machines';

export default function About() {
  const chapters = [
    ['Part 1 · Earth', 'VIMO crash-lands on a Dhaka rooftop at night, explains why space is hard (air, gravity, distance), and launches to the Moon. The year counter rolls back to 1964.'],
    ['Part 2 · The Moon (1964–2025)', 'Ranger 7 crashes on purpose to take photos; Surveyor 1 proves the ground is solid; Surveyor 3 waits alone until Apollo 12 visits; the Eagle leaves its bottom half behind; the laser mirror still answers; a car drives on the Moon; Apollo 17 leaves the last footprints; LRO proves everything is still there.'],
    ['Part 3 · Mars (1971–2026)', 'Messages take minutes, so robots must be smart. Viking 1 photographs its own foot; tiny Sojourner rolls out; Opportunity turns 90 days into 14 years; Curiosity reads Mount Sharp like a book; InSight listens to marsquakes; Perseverance’s parachute hides a code; Ingenuity flies 72 times; ten tubes wait at Three Forks.'],
    ['Part 4 · Still traveling, and home', 'Pioneer 10, Voyager 2 and Voyager 1 fly on between the stars; New Horizons shows Pluto’s heart; kids sort the machines into “still working”, “went quiet” and “used once”; VIMO flies home and lands perfectly.'],
  ];
  return (
    <PageShell title="About Astro Legacy" subtitle="NASA Space Apps Challenge 2026 · Abandoned but not Forgotten: Storytelling about NASA’s Discarded Equipment on the Moon and Mars">
      <p><b>Astro Legacy</b> is a free, phone-first 3D story in English (Bangla in progress) for school-age space fans. VIMO, an original astronaut mascot, visits {machines.length} machine cards (the team atlas’s 57 machines, with the Apollo 11 laser mirror as its own card) across {beats.length} story beats and 36 side trips. The big idea: <b>old does not mean abandoned</b>. Each machine finished its work where it rests, and many still talk to us.</p>
      <h2>The story, in text</h2>
      {chapters.map(([h, p]) => <section key={h}><h3>{h}</h3><p>{p}</p></section>)}
      <h2>Team</h2>
      <p>Team VOID, Bangladesh. Story and design: @NH asib. Built with the help of an AI coding assistant (see AI_USE.md in the repository).</p>
      <h2>Honesty</h2>
      <ul>
        <li><b>Not affiliated with or endorsed by NASA.</b> NASA images, models and data are used with credit (“Courtesy of NASA”).</li>
        <li>Space is silent: music and sound effects are added for the story.</li>
        <li>Simulations are simplified and labelled. Robot “control rooms” are imagined.</li>
        <li>No real people’s faces are drawn; astronauts are faceless or visor-down.</li>
      </ul>
      <h2>Privacy</h2>
      <p>No login, no ads, no tracking, no analytics, no chat. Your optional first name, stamps and progress are stored only on your device (localStorage). Settings → Reset progress deletes them.</p>
      <h2>Licence</h2>
      <p>Code: Apache 2.0. See LICENSE and NOTICE in the repository. <Link to="/sources">All sources</Link> · <Link to="/data">NASA data</Link></p>
    </PageShell>
  );
}
