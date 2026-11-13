# Final Review

A full pass over the script, videos, cards, Experience Mode, art direction and build spec on 12 Nov 2026. Read this tab first: it says what the app is now, what changed, how it meets every checklist item, and the fastest way to build it.

## One seamless story (decided 12 Nov 2026)

The story plays from start to end like a film you can touch. A user who never taps anything still sees the whole story and learns the main ideas. Choices come after the ending, not during it.

- **One main control.** A big **Next** button (or swipe up / scroll). A small **Pause** in the corner. Nothing else asks for a decision.
- **It keeps going by itself.** Each beat moves on 2 seconds after VIMO finishes speaking. Tapping Next just goes faster.
- **Fixed order:** Moon → Mars → Deep space → home. No hub, no "pick a world" in the middle.
- **Every stop, same rhythm, no buttons to choose:** VIMO arrives → the video plays inside VIMO TV (a 45–60 s feature episode for the 15 gold-star machines, a 10–15 s quick look for the others; feature episodes show a small Skip) → the card shows its two lines while VIMO reads them → the Try it moment → stamp → fly to the next stop.
- **Try it never blocks.** VIMO invites the user to try. If there is no tap within 5 seconds, she does it herself ("Let me show you!") and the result plays, so the idea is learned either way.
- **Archie never interrupts.** He flies in and glows; the story keeps going. Tapping him pauses the story; closing the panel resumes it.
- **The extras wait for the end.** Side trips (36 machines), Experience Mode missions and the full map open after the ending, from one screen: **Explore more**. Each world's last beat says so in one line ("Want to fly Eagle yourself? It's waiting for you at the end!").
- **No loading screens between stops.** The camera flies from stop to stop in 3D; the next stop loads during the current one.
- **Sound on from the first tap.** The "Begin the story" tap turns sound on, so videos can play with sound on phones.

**The quick tour is 3D.** Act 2 is a real-time 3D flight (about 90 s): from Earth to the Moon globe, where pins drop at the real landing sites while the year counter runs from 1964; on to the Mars globe and its pins; then out past the giant planets to the probes still travelling. Globes use NASA's CGI Moon Kit and Mars map textures; on low-end phones, the same flight with lighter globes and fewer stars.

## The app in one paragraph

Astro Legacy is a phone-first, hand-painted story app (ages 8–15, enjoyable for adults). VIMO flies a kid from a Dhaka rooftop to the machines NASA left on the Moon, on Mars and in deep space since the 1960s. The story plays as one seamless flow: at every stop VIMO arrives, a video plays (a feature episode for the 15 gold-star machines, a quick look for the rest), a short card appears, and a Try it moment follows, with no choices needed. **Archie** flies in only when NASA's archive has real film or photos worth seeing. Every fact links to a NASA page; anything unverified is cut.

## What changed in this review

| Change | Why | Where |
| --- | --- | --- |
| 15 explainer videos (was 21), story-first scripts | Only the Atlas "Must include" machines; complex ideas made simple with everyday comparisons | Explainer Videos tab |
| 42 cards with picture + 2 lines + Do → See → Learn game | No empty cards, no fact dumps | Cards and Mini-games tab |
| Experience Mode rebuilt around real mission problems; window = pre-rendered video | Real exploration feel, works for adults, faster on phones | Build Spec §8 |
| Archie appears only where NASA has more | Keeps him special and meaningful | Build Spec §12 |
| Colours by real place; clean, calm frames | Learning first, no distraction | Art direction board, Build Spec §3 |
| Ending now goes past → today → future (Artemis II, April 2026) + thank-you postcard | Checklist: "inspiration at the end"; gives a keepsake | Story Script, Scene 4.3 |
| Facts cut for accuracy | Blueberries, wind-cleaning, Apollo 11 alarms/fuel, Wright brothers fabric, Tombaugh ashes, New Horizons autopilot: not on the NASA pages used | All tabs |

## Every surface finished: textures and decoration

No wall, floor, sky or panel is left empty, and nothing is decoration for its own sake.

- **Generate in style, then embed in 3D.** Textures, wall art, frames and props are generated with the image tool using the master style prompt (Story Script, "Background prompts") and the place colours, then placed in the 3D scene as textured planes or materials.
- **Every decoration teaches or tells.** Examples: a framed painted timeline (1964 → today) on the lobby wall; blueprint-style posters of each machine drawn from its NASA model render; a star chart on the rooftop water tank showing the Moon's phase that night; control-room panels with era-correct switches. Each one can be tapped and says one line.
- **Same style, same family.** One style prompt, one palette per place, the same brush scale and light direction for every asset, so everything looks painted by one hand.
- **Honest labels.** Generated pictures of real machines or events carry a small "Illustration" tag. No fake text, no NASA logos, no mission patches.
- **Light on phones.** Decor textures 1k on phones (2k on PC), baked into atlases; static decor never re-renders.

## Checklist: every must-have item

From the team's Astro Legacy checklist (challenge brief + Bangladesh judging sheet).

| Item | How it's met now |
| --- | --- |
| Clear beginning, middle and end | Rooftop → time tour → Moon → Mars → deep space → home rooftop |
| Complex facts as a simple story | Story-first videos with everyday comparisons; Do → See → Learn games |
| Show the problem early | VIMO worries the old machines are forgotten; the hook asks if anyone remembers them |
| Machines feel alive | VIMO + one voice line per machine (era filter) |
| Emotional bond | Opportunity, InSight and Ingenuity endings; "Not forgotten. Logged!" |
| Inspiration at the end | Artemis II (April 2026) and planned 2028 south-pole landings; "maybe you'll build the next one" |
| One idea per screen, few words | Card rules (10 + 20 words), videos (2 numbers max) |
| Starts in the 1960s | Ranger 7 (1964) opens the tour; year counter on screen |
| Moon and Mars in the main story | Acts 3 and 4 |
| All five hardware types | Probe (Voyager), rover (Curiosity), lander (Viking), descent stage (Eagle), instrument (laser mirror) |
| Working and finished machines | Status sticker on every card and stamp |
| Map of real locations | Real-coordinate globes from "Where We Left Them" (see below) |
| What, why, discovered, still giving | Card "big line" + "why it matters"; video beat 6 "today" |
| Part → discovery link | Curiosity's laser, InSight's seismometer, Perseverance's drill, Opportunity's hematite |
| Interactive "how missions worked" | 14 Experience Mode missions |
| NASA source for every fact | One link per card, per video, per experience; Archie links |
| Real NASA images and models at the centre | Photos/footage on cards; NASA 3D models in every scene |
| AI images labelled "Illustration" | Tag on every generated depiction |
| Age range stated (8–15) | Start screen and submission |
| Works on phones | Phone-first layout and performance budget (Build Spec §12) |
| Works muted, captions on | Captions default on; EN/BN |
| Submission rules | See "Before you submit" below |

## Good ideas brought back from earlier work

| Idea | From | How it fits now |
| --- | --- | --- |
| Real-coordinate Moon and Mars globes with a year slider | "Where We Left Them" map | Becomes the Act 2 map and the lobby map: pins at real landing sites, slider from 1964 to today |
| Video-loop backgrounds | "Nova Story Guide" | Act 1, lobby and Act 6 use painted video loops plus one parallax layer, instead of full 3D: lighter on phones, faster to make |
| Space Passport + certificate | Final Script | Logbook stamps → passport → certificate with the kid's first name |
| Thank-you postcard | Checklist (optional) | Story Script Beat 9 |
| Myth vs fact | Checklist (optional) | One card in the Opportunity stop: the famous "my battery is low" line is a person's poetic summary, not words the rover sent |
| "What we don't know yet" | Checklist (optional) | Viking's life test (unexpected chemistry, no clear evidence of life) |
| Then vs now | Checklist (optional) | Apollo 12 / Surveyor 3: landing photo → LRO view today (Archie item) |
| Signal delay | Checklist (optional) | Sojourner mission (3–22 min) and Voyager 1 (one light-day) |
| Offline-friendly | Checklist (optional) | Install as a web app; after the first visit the current part plays without internet |

Left out on purpose (time vs value): AR rover, other agencies' data, teacher worksheet (stretch goal only).

## The fastest way to build it

1. **One data file drives everything.** `machines.json`: name, year, place, status, facts, NASA source URL, date checked, media (photo, video, Archie item), card lines, game id. Cards, videos' captions, Archie, logbook and sources page all read from it. A fact with `verified: false` never shows.
2. **Build one stop end to end first.** Apollo 11 Eagle: scene, card, video, Experience mission, Archie. Test on a phone. Then copy the pattern to the other stops.
3. **Batch the art.** Lock the style prompt and palettes, then generate all textures and decor for one place in one session (same seed and settings). Review them side by side once.
4. **Batch the video.** Render every NASA-model start frame from one Blender scene template (swap the model, keep camera and light). The same frames feed Google Flow for explainer videos and Experience windows.
5. **Batch the voice.** All VIMO and machine lines in one sheet → ElevenLabs in one run per language.
6. **One fact check pass per part,** by one person, against `machines.json`, before any video is generated. Fixing a fact after the video is made costs a new clip.
7. **Phone test every day** on the mid-range Android.

**Suggested order:** data file + Eagle slice → Moon stops → Mars stops → deep space → Experience missions → polish, sound, captions → submission video.

## Before you submit

- Public GitHub repo with an open-source licence.
- Demo video with English subtitles, team and member names; no faces, voices or names of anyone under 18; say the NASA data sets used out loud.
- "Use of AI" section: every AI tool, what it made and why (Google Flow, ElevenLabs, image generator, Claude).
- References: every outside source (the Sources page of the app can be exported).
- "Not affiliated with or endorsed by NASA" on the About page; no NASA logo anywhere.
