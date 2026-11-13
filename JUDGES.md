# JUDGES.md — Astro Legacy in two minutes

Challenge: **Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars** (NASA Space Apps 2026).

## Global criteria

| Criterion | What we built | Where to see it |
|---|---|---|
| **Influence** | Free, phone-first story in English and Bangla that any school-age kid can open without signing up. No data collected. | Splash page; Settings → Privacy; `/teachers` |
| **Creativity** | NASA's machines tell their own life stories through a friendly guide, and kids step inside them and press their buttons. | Story Mode (machine voices); `/experience` (14 control rooms) |
| **Validity** | Every fact links to its NASA source, every status has a date, and every simulation is labelled. | ⛑️ info card on every machine; `/sources`; `npm test`; `npm run test:e2e` |
| **Relevance** | Covers the Moon, Mars and deep space, from 1964 to today: what each machine did, what it found, and what it is doing now. | Year counter + progress rail; `/logbook` |
| **Presentation** | The product itself is a story, with a clear beginning, middle and end. | Story Mode, 4 parts with break cards |

## Local score sheet

| Criterion | What we built | Where to see it |
|---|---|---|
| Impact (20) | Phone-first, no sign-up, EN UI + BN UI (BN captions pending native review), lite mode, teacher plan | `/`, `/teachers`, Settings |
| Creativity (20) | First-person machines, VIMO's growth arc (crash → wobbly → perfect landing), Experience Mode, sorting game | `/story`, `/experience`, `/logbook` |
| Validity (20) | 58 cards × dated status × one discovery × source links; 26 links verified, others flagged; honesty notes; simulations labelled | ⛑️ cards, `/sources`, SOURCES.md |
| Relevance (20) | 52 NASA photos, 29 NASA 3D models (unchanged geometry; nothing made up), NASA SVS Moon map, LRO “proof from orbit” on first screen | `/`, Story 2.8, `/data` |
| Presentation (20) | Beginning (rooftop), middle (Moon → Mars → deep space), end (logbook, home) | `/story` |
| User experience (5) | One big start button, captions on, 48 px targets, keyboard, reduced motion | everywhere |
| NASA data usage (5) | NASA + labelled partner/third-party sources | `/data`, DATA.md |
| Challenge named · repo open | README first line names the challenge | README.md |

## Numbers

- 58 machine cards (22 main path + 36 side trips; the atlas's 57 machines with the Apollo 11 laser mirror as its own card)
- 66 story beats, 34 side trips in 11 hubs, 23 TRY IT activities, 9 choice questions, 14 Experience Mode rooms
- 354 voice lines (≈24,800 characters) ready for ElevenLabs
- 82 source links, 26 opened and matched on 8 Nov 2026
- Production JS ≈ 390 KB gzipped; NASA models streamed only when a scene needs them

## Child wellbeing (Challenge Brief §7)

No streaks, timers, countdown pressure, loot boxes or notifications. Break cards with equal-size **Continue** / **Stop here**. Choices never punish. Sad moments (Opportunity, InSight, Ingenuity) are told as a job well done, followed by a warm beat. Nothing flashes more than three times a second (the laser, DART impact and sparkles each glow once). Astronauts are faceless or visor-down. The first name is optional, stored only on the device, removable in Settings.

## Known limitations

- **Narration audio:** ElevenLabs files are not generated yet (voice choice pending). Until then the app uses the browser's built-in voice, or captions only.
- **Bangla:** UI strings are translated as a draft (needs native-speaker review); story captions and voice are English-only for now.
- **3D models:** every machine drawn in 3D is an exact NASA model: 30 models from NASA 3D Resources and NASA Science (incl. the SLS rocket) (geometry unchanged; big files Draco-compressed). Curiosity came only as a Blender `.blend` file, and New Horizons, DART and the Mars 2020 sample tube only as 3D-printing STL files; these were exported to GLB in Blender with the shape unchanged (the STL prints get a plain material). No made-up or AI-generated models are used. NASA has no 3D model of Ranger 7, Surveyor 1/3/5-7, the Apollo 11 laser mirror, the Apollo 15 rover, Sojourner, Perseverance's backshell and parachute, Lunar Prospector, GRAIL, Mariner 9, Phoenix or Blue Ghost (checked against the full catalogue of 378 items, 12 Nov 2026), so the main story's seven missing machines (Ranger 7, Surveyor 1, Surveyor 3, the Apollo 11 laser reflector, the Apollo 15 rover, Sojourner, Perseverance's back shell + parachute) are shown as **replicas by Team VOID**, built in code from NASA photos and NASA's published sizes (`src/three/replicas.tsx`). Every replica is labelled 'Replica by Team VOID (not a NASA model)' on its card and in the 3D viewer, and the data check fails if one is not labelled. Side-trip machines without a NASA model stay 2D (card + real NASA photo). Speaking machines get a speech bubble anchored above their model.
- **Explanatory 3D (not NASA models, made in code by Team VOID):** rocket exhaust, smoke and steam, ground dust, the launch pad, parachutes, a simplified entry capsule with its heat glow, a simplified sky crane with ropes, the airbag ball and lander petals, and the Lunar Module ascent flame. They only show *how* something happened; the machines themselves are always NASA models. The lift-off uses NASA's SLS Block 1 3D-print model (print base plate removed, painted in SLS colours, shape unchanged). All in `src/three/explain.tsx`.
- **VIMO** uses the team's "Nova" astronaut look (from the Nova Story Guide prototype): built from shapes in code (`src/vimo/novaModel.ts`), with ~40 joint-angle poses on springs (overshoot and settle). Her visor stays plain black; emotions show through body, head angle and the antenna light. Her speech bubble shows one line at a time (`src/ui/oneLine.ts`), and so do the machines' captions. `src/vimo/Nova.tsx` reads each line (English and Bangla cues) and picks a matching feeling and move (nod, tilt, bounce, jump, head-shake, lean, sink), talks with her hands, looks at the pointer when idle, fidgets, and swoops into a flying pose with a landing squash. Try them all at `#/vimo-lab`. Her lines appear in a typed speech bubble beside her head (Nova style); machine lines stay in the caption card.
- **Post effects:** GPU bloom was removed because it blanked some scenes in testing; vignette and grain are CSS.
- **Music and SFX** are generated in the browser (original), not studio recordings.
- **Fact-check:** links marked “awaiting fact-check” must be opened and signed off by the team's fact-checker.
- **“How much is up there?”** counter (Logbook) shows 796 objects from the NASA History Office catalogue, as given in the Challenge Brief; awaiting the fact-checker against the PDF.
- **Narration voices:** the ElevenLabs key works, but the free plan can't use the chosen library voices; voices will be picked later.
- **Browser tests:** `npm run test:e2e` (Playwright, Build Spec §12): 31 pass on 9 Nov 2026: app loads, all 66 beats reach the centre, all 34 side trips open and return, all 14 experiences finish, every page route renders, every fact has a source URL. The Bangla-caption check is marked pending (native-speaker translation).
- **Not yet done:** phone fps measurement on a real mid-range Android.
