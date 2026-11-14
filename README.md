# Astro Legacy — NASA Space Apps Challenge 2026: *Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars*

**One-line goal:** a school-age kid opens Astro Legacy on a phone, follows VIMO from the Moon to Mars to deep space, and leaves understanding that **old machines are not junk: each one changed what we know, and many still talk to us.**

- **Live link:** https://teamvoid-arch.github.io/AstroLegacyTeamVoid/ (open in Chrome on a phone or laptop; "Ask VIMO" needs the local server, see Deploy)
- **Team:** Team VOID (Bangladesh) · Story & design: @NH asib
- **Licence:** Apache 2.0 ([LICENSE](LICENSE), [NOTICE](NOTICE)) · **Not affiliated with or endorsed by NASA.**
- Judge guide: [JUDGES.md](JUDGES.md) · Data: [DATA.md](DATA.md) · Every fact: [SOURCES.md](SOURCES.md) · AI tools: [AI_USE.md](AI_USE.md)

## What it is

A scroll-driven, real-time 3D story for kids aged 8–15. **VIMO** (“Very Important Machine Observer”), an original astronaut mascot, crash-lands on a Dhaka rooftop, flies to the Moon in 1964, travels to Mars and out to the edge of the solar system, then lands home perfectly.

| Mode | What the kid does |
|---|---|
| **Story Mode** (`/story`) | Scrolls (or presses ▶ Play). The camera flies, VIMO acts and talks, machines reply in era-filtered voices, music follows the emotion. 66 beats in 4 parts, 23 TRY IT activities, 9 choice questions, 11 side-trip hubs with 34 side trips. |
| **Experience Mode** (`/experience`) | Picks one of 14 machines from a 3D carousel, enters its control room and presses its buttons while the big window shows the machine doing its job. |
| **Logbook** (`/logbook`) | Stamps for all 58 machine cards, VIMO stickers, the “Sort the machines” game, a 5-question quiz and a downloadable certificate. |

## How to run

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # data checks: sources, photos, models, reachability, audio files
npm run test:e2e     # browser tests (Playwright, ~4 min): every beat, side trip and experience
npm run build        # production build in dist/
npm run preview      # serve the production build
```

The browser tests use the Google Chrome installed on the computer. For Edge, set `PW_CHANNEL=msedge`; for Playwright's own Chromium, run `npx playwright install chromium` and set `PW_CHANNEL=` (empty).

Optional narration with ElevenLabs (see [Voice](#voice-elevenlabs)):

```bash
cp .env.example .env   # add your key and voice ids
npm run vo:generate -- --dry-run
npm run vo:generate
```

## Judging criteria — with evidence

### Impact
Free, phone-first story in English (Bangla UI, Bangla captions in progress) that any school-age kid can open without signing up. No login, ads, tracking or analytics; progress is stored only on the device. Lite mode switches on automatically if the frame rate drops. A [For parents & teachers](src/pages/Teachers.tsx) page includes a 10-minute classroom plan.

### Creativity
NASA's machines tell their own life stories through a friendly guide, and kids step inside them and press their buttons. Machines speak in first person with era voice filters (1960s radio → clean today). VIMO grows during the story (crash landing → perfect landing). Experience Mode puts kids in 14 control rooms (Eagle's real-style cabin; “imagined” rooms for robots, labelled as such).

### Validity
Every fact links to its NASA source, every status has a date, and every simulation is labelled. `npm test` checks that each of the 58 machines has a source link, a resolved NASA photo id where used, an existing model file, and a reachable stamp. 26 links (NSSDCA, NASA History, JPL, NASA Science) were opened and matched on 8 Nov 2026; the rest come from the team's Hardware Atlas and are marked “awaiting fact-check” in the app and in [SOURCES.md](SOURCES.md). Honesty notes are shown where the script asks (Luna 9 was first; Opportunity's “battery is low” quote is a reporter's version; Viking's life results are debated).

### Relevance
Covers the Moon, Mars and deep space, from 1964 to today: what each machine did, what it found, and what it is doing now. NASA data drives the story: 52 photos from the NASA Image and Video Library (resolved through the official API), 9 NASA 3D models shown unchanged (Lunar Module, Viking, Perseverance, Ingenuity, Opportunity, LRO, Voyager, Pioneer 10, InSight), the NASA SVS Moon map, NSSDCA mission pages, and LRO's orbit photo of the Apollo 11 site as “proof from orbit” on the first screen.

### Presentation
The product itself is a story, with a clear beginning (rooftop, why space is hard), middle (Moon → Mars → deep space) and end (sorting game, the same rooftop, “maybe one day you'll build the next one”). Chapter breaks offer a calm “Good place for a break” card.

### User experience
One big **Begin the story** button; captions on by default; 48 px touch targets; keyboard (↓/↑ beats, Enter); reduced motion respected; separate music/voice/effects toggles; everything works muted.

### NASA data usage
See [DATA.md](DATA.md): NASA sources first, then partner/third-party sources (LROC and HiRISE camera teams at Arizona State University and the University of Arizona; ESA for Ulysses), clearly labelled as not NASA.

## Architecture

```
src/
  pages/        Splash, StoryMode, ExperienceCarousel, ExperienceRoom, Logbook, Certificate, Sources, Data, About, Teachers
  scenes/       Stage.tsx (one 3D stage per scene type, scrubbed by scroll), WorldCanvas.tsx
  three/        world.tsx (stars, Earth, Moon, procedural planets, terrain), Machine.tsx (NASA GLB loader), models.tsx (Team VOID models)
  vimo/         Vimo.tsx (3D character, 14 expressions, gestures, spring motion, lip sync), controller.ts, VimoLayer.tsx
  story/        beats.ts (66 beats from the Story Script), sidetrips.ts (11 hubs, 34 trips)
  experience/   experiences.ts (14 rooms, lines from the script), Outside.tsx (window scenes)
  audio/        engine.ts (generative score, synthesised SFX, voice with ducking)
  data/         machines.ts (58 cards with sources), photos.json (NASA image URLs), i18n.ts (EN/BN UI)
  ui/           captions, cards, TRY IT activities, hubs, model viewer, settings
scripts/        validate-data.ts, generate-vo.ts (ElevenLabs), build-sources.ts, resolve-photos.ts
public/assets/  NASA models (.glb), Moon/Earth textures; public/draco/ (local Draco decoder)
```

Stack: Vite + React 18 + TypeScript, three.js via React Three Fiber + drei, Zustand, React Router (hash routes for static hosting). VIMO is rendered in her own transparent canvas so the era colour grade (1960s black-and-white, 70s film…) never touches her, as the Build Spec requires.

## Voice (ElevenLabs)

`scripts/generate-vo.ts` calls the official ElevenLabs Text-to-Speech API **at build time**. The key lives only in `.env` (git-ignored) and is never shipped to the browser. Each line is cached by a hash of text + voice + model + settings in `.vo-cache/`, so identical lines are never paid for twice. Output: `public/audio/vo/en/<line-id>.mp3` + `manifest.json`. The app uses these files when present, otherwise the browser's built-in voice, otherwise captions only. 354 lines ≈ 24,800 characters.

## VIMO (3D character)

VIMO wears the team's "Nova" astronaut look, built from shapes in code: `src/vimo/novaModel.ts` (model + joint-angle poses), `src/vimo/Nova.tsx` (maps story gestures and emotions to poses, head angle and antenna-light colour), `src/vimo/motion.ts` (screen placement, springy flight, squash and stretch). `src/vimo/VimoLayer.tsx` draws her in her own canvas and shows her lines in the Nova-style speech bubble, typed in grapheme by grapheme so Bangla renders correctly.

## Deploy

Static build, works from any sub-path (hash routing, `base: './'`).

- **Netlify:** drag `dist/` onto app.netlify.com/drop, or connect the repo (build `npm run build`, publish `dist`).
- **GitHub Pages:** push `dist/` to a `gh-pages` branch, or use the Pages action with `npm ci && npm run build`.

Then open the live link in a private window and run through Splash → Story → Experience → Logbook.

## Known limitations

See the bottom of [JUDGES.md](JUDGES.md#known-limitations).
