# Judge Review

An honest pass as a Space Apps judge and as a space-loving viewer, 12 Nov 2026. Scores use the five global criteria plus the Bangladesh sheet. Fixes marked **Done** are already in the doc.

## Verdict in one line

The story, the learning design and the NASA accuracy are strong enough to compete for Best Use of Storytelling. The biggest risk is not the idea: it is **scope**. Judges score what works on the day, so the build must be cut to what a team can finish and polish during the hackathon (see "Hackathon cut").

## Challenge, word by word

| Challenge words | Covered by | OK? |
| --- | --- | --- |
| "Since the 1960s" | Tour starts with Ranger 7 (1964); year counter | Yes |
| "NASA has left hardware across the solar system" | 57 machines, real-coordinate globes | Yes |
| "on the Moon, on Mars, and in deep space" | Three worlds, three acts | Yes |
| "rovers and instruments that completed their science missions" | Opportunity, InSight, Viking, Sojourner; laser mirror | Yes |
| "probes still traveling away from Earth" | Pioneer 10, Voyager 1 and 2, New Horizons | Yes |
| "varies widely in its purpose" | Five hardware types; each card says what it was for | Yes |
| "and current level of functionality" | Status sticker on every card and stamp; sorting game | Yes |
| "tell the story of some or all of this equipment" | All 57 reachable; 21 on the main path | Yes |
| "introduces school-age space enthusiasts" | Ages 8–15 stated; plain words; EN/BN | Yes |
| "to the hardware" | NASA 3D models, NASA photos, Experience Mode | Yes |
| "and the science it made possible" | Big question per world; every card's "why it matters"; video beat "what it found" | **Done:** made explicit with the big questions |
| Title: "Abandoned but not Forgotten" / "discarded equipment" | Descent stages, rocket stages, landing leftovers, parachute; "Not forgotten. Logged!" | Yes |

## Questions a judge and a viewer will ask

| Question | Honest answer | Action |
| --- | --- | --- |
| Is it really learning, or a tour of facts? | It was drifting toward a fact tour (57 machines). | **Done:** one big science question per world, clues, and an "answer so far" card |
| Will a kid remember anything? | Yes, if each world ends with a recap and the game checks the idea. | Recap card per world + final sorting game and 5-question quiz |
| Is the same machine repeated too often? | Apollo 11 appeared in story, video, card, Experience and Archie. | **Done:** "each layer, a different angle" rule |
| Is it too long? | 21 stops + 15 videos is about 25 minutes. | Videos are optional (tap to watch); the story path itself must fit in about 10 minutes |
| Will adults be bored? | Less now: real decisions in Experience Mode, "Why?" button, Archie's real footage. | Keep |
| Is every fact true? | Video, Experience and Archie facts were checked on NASA pages this week. Side-trip cards use the Atlas. | Check the 36 side-trip cards against NASA pages during the hackathon, before any art is made |
| Is it safe for children? | One risk found: the Pioneer plaque shows unclothed figures. | **Done:** video 18 uses our own clothed pictogram |
| Does it show impact, not just say it? | Not yet. | Run a 10-minute test with 3–5 people at the event; show the before/after answers in the video (adults only on camera) |
| Is NASA data at the centre? | Yes: NASA 3D models, photos, LRO images, terrain, mission pages, footage. | Name the datasets on camera |
| Is it original? | Yes: a caretaker mascot, machines that speak, an archive guide, real mission decisions, painted look. | Keep |

## Scores now and after the fixes

| Criterion | Now | After fixes | What moves it |
| --- | --- | --- | --- |
| Impact / Influence | 14 | 17 | User test evidence; Bangla; works on cheap phones and offline |
| Creativity | 18 | 19 | Big questions + Experience decisions |
| Validity | 13 | 18 | A working, polished build of the hackathon cut; every fact linked |
| Relevance | 18 | 19 | NASA data named and visible in the first 10 seconds |
| Presentation | 16 | 19 | The 240 s and 30 s scripts in the next tab |
| UX (BD sheet, /5) | 3 | 5 | Phone-first, one main button, captions |
| NASA data usage (BD sheet, /5) | 4 | 5 | Show NASA plus partner agencies clearly (CSA on Artemis II, ESA in Mars Sample Return) |

## Hackathon cut (what to build first)

The Space Apps rules say the project is built during the hackathon (Bangladesh: 13–14 Nov). Everything in this doc is the plan; build and generate the art during the event. Build in this order and stop adding when time runs out; each tier is complete on its own.

| Tier | What ships | Why |
| --- | --- | --- |
| 1 · Must | Story path with all 21 main stops (cards for all), 3 big questions + recaps, globe map, status stickers, logbook, sorting game, quiz, certificate, sources page, EN captions | Covers every challenge word and every must-have |
| 2 · Should | 6 explainer videos (Apollo 11, Surveyor 3, Opportunity, Ingenuity, Voyager 1, New Horizons), 3 Experience missions (Eagle landing, Sojourner delay, Ingenuity flight plan), Archie on 6 moments | The "wow" for the demo video |
| 3 · Could | Remaining 9 videos and 11 missions, 36 side-trip cards with games, Bangla voice, postcard, offline mode | Depth for the global round |

## What to add, cut or change

- **Add:** a 3-question "Do you know?" at the start and the same 3 at the end (kept on the device only) to show learning in the demo. **Add:** a "Myth or fact" moment at Opportunity. **Add:** partner agencies where NASA's own pages name them (CSA on Artemis II, ESA in Mars Sample Return).
- **Cut for the hackathon:** full explorable 3D terrain on Mars and in deep space (use painted loops + the 3D machine; keep explorable 3D for the Moon only), AR, extra languages beyond EN/BN.
- **Changed (Done):** Pioneer plaque shown only as our clothed pictogram; Pale Blue Dot wording (Voyager was about 6 billion km from the Sun, so we no longer say "from Earth"); Opportunity "almost 15 years" everywhere; unverified fun facts removed earlier (blueberries, wind cleaning, Wright fabric, Tombaugh ashes).

## Accuracy rules for the last mile

1. No fact enters `machines.json` without a NASA URL and the date it was checked.
2. If two NASA pages disagree, use the wording both support, or leave the number out.
3. Our own comparisons and sums are labelled "our comparison" or "our calculation".
4. Status lines say the date of their NASA page ("Still working, NASA, Oct 2026").
5. One person reads every line on screen against its source before recording.
