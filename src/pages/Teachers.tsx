import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';

export default function Teachers() {
  return (
    <PageShell title="For parents and teachers" subtitle="What Astro Legacy is, how long it takes, and how to use it with a class.">
      <h2>What it is</h2>
      <p>A free story-driven web app for ages 8–15 about the hardware NASA left on the Moon, on Mars and in deep space: what each machine did, what it found, and what it is doing now. It runs in a phone or laptop browser. No install, no sign-up.</p>
      <h2>How long</h2>
      <p>The main story is four chapters of about 3–5 minutes each, with a calm “good place for a break” card after each chapter. Side trips add 30–45 seconds each and are always optional. Experience Mode rooms take 2–4 minutes.</p>
      <h2>It collects no data</h2>
      <p>No login, ads, tracking, analytics, chat, camera, microphone or location. An optional first name is saved only on the device and can be deleted in Settings.</p>
      <h2>Learning goals</h2>
      <ol>
        <li>Name three machines and one thing each one found.</li>
        <li>Explain the difference between “still working”, “went quiet” and “used once / crashed on purpose”.</li>
        <li>Explain why Mars robots must work on their own (radio messages take 3 to 22 minutes one way).</li>
        <li>Understand that “old does not mean abandoned”: hardware rests where it finished its work.</li>
      </ol>
      <h2>A 10-minute classroom plan</h2>
      <ol>
        <li><b>2 min:</b> Project the <Link to="/">splash page</Link>. Ask: “Is a machine on the Moon junk?”</li>
        <li><b>4 min:</b> Play Part 2 (the Moon) with the ▶ Play button. Pause on the laser mirror: it still works today.</li>
        <li><b>2 min:</b> Open the <Link to="/logbook">Logbook → Sort the machines</Link> and sort together.</li>
        <li><b>2 min:</b> Each pupil names one machine, what it found, and its status today.</li>
      </ol>
      <h2>Accessibility</h2>
      <p>Captions are on by default. Music, voice and effects have separate switches; everything works muted. Reduced motion follows the device setting. Keyboard: ↓/↑ move between beats; Enter opens cards. Nothing flashes more than three times a second.</p>
    </PageShell>
  );
}
