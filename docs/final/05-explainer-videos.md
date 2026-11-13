# Explainer Videos (VIMO TV)

15 videos, 45–60 seconds each, one for each of the 15 "Must include" machines in the team's [Hardware Atlas](https://claude.ai/artifact/2vSamG9ywe19SW7JDSWnCv): the machines with the biggest impact, a strong NASA record and a story kids should know. Every fact on screen and in the voiceover comes from a NASA page that was opened and checked on 12 November 2026; each video lists its pages.

| Region | Video (Atlas "Must include") | Card story instead of a video (Atlas tier) |
| --- | --- | --- |
| Moon | 03 Surveyor 3 (with the Apollo 12 visit) · 05 Apollo 11 Eagle · 07 Apollo 15 rover · 09 LRO | 01 Ranger 7 (strong pick) · 02 Surveyor 1 (strong pick) · 04 Apollo 12 Intrepid (strong pick; its story is already in 03) · 06 Laser mirror (part of Apollo 11; kids also play it in Experience Mission 2) · 08 Apollo 17 (strong pick) |
| Mars | 10 Viking 1 · 11 Pathfinder + Sojourner · 12 Opportunity · 13 Curiosity · 14 InSight · 16 Ingenuity · 17 Perseverance + Three Forks | 15 Perseverance's parachute (Atlas "extra"; the parachute code can be one beat in 17) |
| Deep space | 18 Pioneer 10 · 19 Voyager 2 · 20 Voyager 1 · 21 New Horizons | — |

The six card stories keep their scripts below: the same six shots become the four-panel card VIMO flips through (about 30 s, no Google Flow clips). Numbers are kept so the storyboard shot references still match.

## How to make the videos

Each video is 6 shots of 8 seconds (about 48 s, up to 60 s with titles), made in Google Flow, voiced by VIMO in ElevenLabs, and played inside the VIMO TV frame in the app.

### The 6-beat template

Every video tells one small story, not a list of facts. A kid should be able to retell it to a friend in one sentence afterwards.

| Beat | Time | Job | Example (Opportunity) |
| --- | --- | --- | --- |
| 1 Hook | 0–8 s | A "what if" or a mystery from a kid's own life | "A toy built to last 90 days... still working when you finish school?" |
| 2 The problem | 8–16 s | Why this was hard or scary; what nobody knew | Mars is far, dusty and freezing; nobody knew how long a rover could survive |
| 3 The clever idea | 16–24 s | How the machine solved it, shown with an everyday comparison | Solar panels like a plant drinking sunlight |
| 4 The big moment | 24–32 s | The wow: a first, a discovery, a twist; music peaks | It finds a rock that only forms in water |
| 5 So what? | 32–40 s | What it means, in one plain sentence; one number turned into a picture | "Mars once had water"; 45 km = longer than a marathon |
| 6 Today + your turn | 40–48 s | Where it is now, a feeling, a question for the kid, VIMO stamps "Logged!" | "Rest well, Oppy." + "What would you explore if you could last 15 years?" |

### Storytelling rules: so it's never boring

- **One hero, one problem.** The machine is the hero. Each video asks one question and answers it. Everything else goes on the fact card beside VIMO TV, not in the video.
- **Two numbers at most.** Every number becomes a picture: 45 km is "longer than a marathon", 58,000 km/h is "Dhaka to Chattogram in about 15 seconds". All other numbers stay on the fact card.
- **Explain with things kids know.** Bubble wrap, a beach scoop, a stethoscope, tapping a watermelon, saving homework twice. Each comparison shows on screen with a small "our comparison" tag, so it is never mistaken for a NASA fact.
- **VIMO asks the kid's question first** ("Wait, how do you land without a runway?") and reacts honestly: surprised, worried, proud, a bit sad. One small funny moment per video.
- **Let the machine speak once (M: line).** One short line, in the era filter, at the emotional moment.
- **Show, don't tell.** If the voice says it, the picture shows it. Cut every 2–4 seconds inside each 8-second clip (zoom, reveal, reaction), never one static view for 8 seconds.
- **Sound tells the story too.** Music builds in beats 2–3, peaks in 4, softens in 6. Every action has a sound (bounce, zap, whirr). Leave a second of silence before the big moment.
- **End with "your turn".** A question the kid can answer out loud, then the stamp.
- **Bangla version:** keep the same story; swap comparisons for local ones where it helps (a cricket field instead of a football field, a rickshaw instead of a bike). The facts never change.
- **Facts stay rigorous.** Only facts from the NASA pages listed under each video. A comparison is labelled; a calculation is labelled "our calculation".

### Google Flow workflow

1. **Ingredients:** add three images to Flow once and reuse them in every video: a VIMO render (front and side, from the team's existing 3D model), the style reference image, and a render of the video's NASA machine.
2. **Hardware shots use Frames to Video.** Start frame = a render of the NASA 3D model (or the team's Blender model) placed in a painted scene. Flow animates from that frame, so the machine's shape stays correct. Shots marked **\[F\]** below.
3. **Other shots use Ingredients to Video** with the VIMO and style images. Shots marked **\[I\]**.
4. **Reject any clip where the hardware changes shape,** gains parts, or shows text. Regenerate; never fix facts in the edit.
5. **Real NASA photos** (marked **\[P\]**) are shown as photos with a slow push-in and a small "NASA photo" label, never regenerated.
6. **Edit:** put the 6 clips in order, add VIMO's voice, music bed, sound effects, EN and BN captions, then an end card: "Sources: NASA" + the page list. Generated scenes carry a small "Illustration" label.
7. **Era look:** pre-1970 videos get a light black-and-white TV grain in the edit, 1970s a warm film grade, 1990s–2000s a slight video look, after 2010 none. VIMO is never graded.

### Style prompt (paste after every shot prompt)

```
Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces.
```

VIMO in prompts: "VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack (use the VIMO ingredient)". Astronauts, when shown, always have gold visors down and no faces. Moon skies are black, no haze; Mars skies are butterscotch.

### Voice (ElevenLabs)

- **VIMO:** warm, smiling young female storyteller voice, slow and clear, about 120–130 words per minute. Bangla version voiced from the native-speaker translation.
- **Machine lines** (marked M:): same TTS voice with an era filter in the edit (1960s old radio, 1970s warm tape, later clean).
- Script word count per video: about 100–120 words.

### Accuracy rules

- Only the facts in each video's table, each from its listed NASA page. Numbers are written as the page gives them.
- Anything worked out by us (for example converting units) is labelled "our calculation" in the caption.
- Status lines ("still working") carry the date of the NASA page they come from.
- Machines without a NASA 3D model (Ranger 7, Surveyor 1 and 3, Apollo 15 rover, Pathfinder and Sojourner, laser mirror, Perseverance's parachute) use the team's Blender model, checked side by side with NASA photos.

## Moon

### 01 · Card story, not a video · Ranger 7: the camera that fell (1964) · 48 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 | \[I\] Black-and-white 1960s TV grain. In deep space, a small spacecraft with flat solar panels tumbles slowly toward a huge grey Moon; VIMO floats beside it, holding her helmet in surprise. | "Click! Click! Click! This camera is falling toward the Moon... on purpose? Meet Ranger 7!" | Old shutter clicks, retro synth · RANGER 7 · 1964 |
| 2 | \[F\] Start frame: Ranger 7 model high above the Moon. Camera follows it straight down toward a grey cratered plain, small Earth behind. | "July 1964. Six Rangers before it had not sent back one close-up picture. Ranger 7 had one job: look closer." | Rising hum · Launched 28 July 1964 |
| 3 | \[F\] Close on Ranger 7's camera end; soft flashes as it takes pictures; little photo frames fly back toward Earth. | "It was built to fly straight down and send pictures until the very last moment." | Clicks speed up |
| 4 | \[P\] Real Ranger 7 photos one after another, each closer and sharper; VIMO's helmet reflects them. | "In its last 17 minutes, it sent home 4,308 pictures!" | 4,308 pictures in 17 minutes |
| 5 | \[P\] Ranger 7's final photo, slow push-in; VIMO's amazed face reflected. | "Its last picture came 2.3 seconds before it hit. Up to a thousand times sharper than views from telescopes on Earth!" | Soft thud, crackle · 1,000× sharper |
| 6 | \[I\] Wide painted Moon, a small spot glows; VIMO stamps her logbook. | "Scientists named the spot Mare Cognitum: the Sea that has become known. Ranger 7's pieces are still there. Not abandoned. Not forgotten. Logged!" | Stamp ka-chunk · Hit the Moon 31 July 1964 |

NASA sources: [60 Years Ago: Ranger 7 Photographs the Moon](https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/) (launch, 4,308 images in 17 min, last image 2.3 s before impact, Rangers 1–6, Mare Cognitum) · [NSSDCA: Ranger](https://nssdc.gsfc.nasa.gov/planetary/lunar/ranger.html) (built to fly straight down and send images until impact; 1,000× better than Earth views; impact 31 July 1964).

### 02 · Card story, not a video · Surveyor 1: the first soft step (1966) · 48 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 | \[I\] Black-and-white grain. VIMO holds a tiny toy lander over grey lunar dust, wondering whether to let go. | "No American spacecraft had ever landed gently on the Moon. Could it be done? Meet Surveyor 1!" | Curious plucks · SURVEYOR 1 · 1966 |
| 2 | \[F\] Start frame: Surveyor 1 model, three legs, above the Ocean of Storms; small rocket flames slow it down. | "It launched from Florida on May 30, 1966, and three days later it fired its rockets over the Ocean of Storms." | Thruster hiss · Launched 30 May 1966 |
| 3 | \[F\] Touchdown: it bounces once, then settles; a small puff of dust. | "Touchdown! It bounced once... and stood. The first American spacecraft to soft-land on the Moon!" | Soft boing, cheer · 2 June 1966 · first US soft landing |
| 4 | \[F\] Its camera turns slowly; painted photo frames stack up in the sky. | "Then it looked around, and around, and around." M: "Picture... picture... picture!" | Old camera whirr |
| 5 | \[I\] Counter rolls up; VIMO jumps with excitement. | "It sent home 11,240 pictures, and showed that a spacecraft can land safely on the Moon and do real science." | 11,240 pictures |
| 6 | \[I\] Lunar night falls over the lander; VIMO salutes and stamps. | "NASA heard from it until January 1967. Surveyor 1 is still there in the Ocean of Storms. Logged!" | Stamp · Last contact Jan 1967 |

NASA source: [55 Years Ago: Surveyor 1 Makes a Soft Landing on the Moon](https://www.nasa.gov/history/55-years-ago-surveyor-1-makes-a-soft-landing-on-the-moon/) (launch 30 May 1966, landing 2 June 1966 in the Ocean of Storms, bounced once, first US soft landing, 11,240 images, contact until 7 Jan 1967, proved safe landing and useful science). "Three days later" is our count from the two dates.

### 03 · Surveyor 3: the robot who got a visit (1967 / 1969) · 54 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Faded film. VIMO leaves a toy bicycle outside; a calendar flips through rain, sun and snow; the bike gets dusty. | "What happens to a machine left outside for two and a half years? On the Moon, someone actually went to check!" | Ticking clock · SURVEYOR 3 · 1967 |
| 2 Problem | \[F\] Start frame: Surveyor 3 model landing alone in a shallow grey crater; astronauts' bootprints appear as dotted "future" outlines. | "April 1967. Astronauts wanted to land on the Moon soon. But would the ground hold their heavy ship, or would they sink?" | Worried cello |
| 3 Clever idea | \[F\] Close on its little scoop digging a trench; split screen: VIMO pressing her boot into beach sand (labelled illustration). | "So Surveyor 3 dug, like you testing sand at the beach: is it firm, or squishy?" | Scrape · Like testing beach sand (our comparison) |
| 4 Big moment | \[I\] Two astronauts, gold visors down, walk over the crater rim toward the old lander. VIMO gasps. | "Then, two and a half years later... knock, knock! Apollo 12 landed less than 200 metres away, and two astronauts walked over." M (faint, then warm): "Visitors! I knew someone would come." | One second of silence, then VIMO's theme swells · 20 Nov 1969 |
| 5 So what? | \[F\] A gloved hand removes the TV camera and scoop; they go into a bag; Earth hangs above. | "They took its camera and scoop home, so engineers could see what the Moon does to a machine after 31 months." | Snip snip · Parts came home |
| 6 Today + your turn | \[P\] NASA photo of Alan Bean beside Surveyor 3; VIMO stamps. | "It helped twice: once for astronauts, once for engineers. Your turn: what would you leave outside to test? Logged!" | Stamp ka-chunk · The only robot astronauts visited |

NASA sources: [Astronauts Pay a Visit to Surveyor 3](https://www.nasa.gov/image-article/astronauts-pay-visit-surveyor-3/) (launch 17 April 1967, scoop tested soil for the lunar module, 6,000+ photos, Conrad and Bean, photo 20 Nov 1969, TV camera and parts returned) · [55 Years Ago: Apollo 12 Makes a Pinpoint Landing](https://www.nasa.gov/history/55-years-ago-apollo-12-makes-a-pinpoint-landing-on-the-moon/) (landed 538 ft from Surveyor 3; camera, scoop and other parts removed; 31 months on the Moon). "Less than 200 metres" is our conversion of NASA's 538–600 ft.

### 04 · Card story, not a video · Apollo 12 Intrepid: the pinpoint landing (1969) · 50 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 | \[F\] Faded film. Start frame: Apollo Lunar Module model descending toward a grey plain; a tiny old lander waits in a crater nearby. | "Can you land a spaceship right next to an old robot on the Moon? Apollo 12 did!" | Thrusters · APOLLO 12 · 1969 |
| 2 | \[I\] Two astronauts, gold visors down, climb out; Earth in the black sky. | "November 1969. Pete Conrad and Alan Bean landed their lunar module, Intrepid. Richard Gordon waited in orbit." | Launched 14 Nov 1969 |
| 3 | \[I\] The astronauts set up a small science station with boxes and cables on the grey ground. | "They set up a science station with a seismometer: a machine that feels the Moon shake." | Soft beeps |
| 4 | \[I\] A TV camera on a tripod turns toward the bright Sun; the picture on a little screen fizzles out; VIMO facepalms. | "Oops! On the first moonwalk, the TV camera got pointed at the Sun, and the live broadcast ended." | Fizz, comic sting |
| 5 | \[F\] Later: the empty top half of Intrepid falls back and hits the Moon far away; ripples spread through the ground to the seismometer. | "After they left, the top half was crashed into the Moon on purpose. The seismometer felt it for nearly an hour!" | Low bell-like rumble · Nearly 1 hour of signals |
| 6 | \[I\] VIMO with her ear to the ground, then stamps. | "Intrepid's bottom half is still there, 538 feet from Surveyor 3. Logged!" | Stamp · 31 h 31 min on the Moon |

NASA source: [55 Years Ago: Apollo 12 Makes a Pinpoint Landing on the Moon](https://www.nasa.gov/history/55-years-ago-apollo-12-makes-a-pinpoint-landing-on-the-moon/) (launch 14 Nov 1969; Intrepid; Conrad, Bean, Gordon; ALSEP with seismometer; TV camera pointed at the Sun; ascent stage crashed on command, seismometer signals for nearly one hour; 538 ft from Surveyor 3; 31 h 31 min on the surface). LRO also sees Intrepid: [LRO Looks at Apollo 12, Surveyor 3 Landing Sites](https://www.nasa.gov/missions/lunar-reconnaissance-orbiter-looks-at-apollo-12-surveyor-3-landing-sites/).

### 05 · Apollo 11 Eagle: the bottom half that stayed (1969) · 54 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Faded film. VIMO stands on grey dust, looking around for a launch pad, scratching her helmet. | "Here's a puzzle: how do you take off from the Moon when there's no launch pad? Simple. You bring one!" | Curious pluck · APOLLO 11 · 1969 |
| 2 Problem | \[I\] A huge rocket rises at dawn (no logos); then the lunar module glides down over the flat Sea of Tranquility, dust blowing. | "July 20, 1969. The lunar module Eagle lands on a flat plain called the Sea of Tranquility." | Rumble, then hush · Landed 20 July 1969 |
| 3 Big moment | \[I\] Two astronauts, gold visors down, step onto the Moon; a ship circles high above. VIMO covers her mouth with both hands. | "Neil Armstrong and Buzz Aldrin step out. For the first time ever, people are walking on another world!" | Theme swells · First humans on another world |
| 4 Clever idea | \[F\] Start frame: NASA Lunar Module model. Eagle splits: the top half fires and leaps up; the gold bottom half stays on its legs. Inset: a jack-in-the-box jumping off its box (labelled illustration). | "Eagle had two halves. The bottom half was the launch pad. The top half blasted off from it, like a jack-in-the-box jumping off its box!" | Clunk, whoosh · Bottom half = launch pad |
| 5 So what? | \[F\] Close on the plaque on one leg; VIMO wipes dust off gently. | M (calm): "We came in peace for all mankind." VIMO: "That's written on a plaque on its leg, left there on purpose." | Quiet strings |
| 6 Today + your turn | \[P\] LRO photo of the Apollo 11 site; a small circle marks the descent stage; VIMO stamps. | "The bottom half is still standing there, and a spacecraft can photograph it from orbit. If you left a message on the Moon, what would it say? Logged!" | Stamp · Still standing |

NASA sources: [Apollo 11 Mission Overview](https://www.nasa.gov/history/apollo-11-mission-overview/) (launch 16 July 1969, crew, Eagle, 21 h 36 min on the surface, only the ascent stage rejoined Columbia, splashdown 24 July) · [NSSDCA: Apollo 11 Lunar Module / EASEP](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C) (landed 20 July 1969, descent stage used as launch platform and left on the Moon, plaque text) · [15 Years Ago: LRO Begins Moon Mapping Mission](https://www.nasa.gov/history/15-years-ago-lunar-reconnaissance-orbiter-begins-moon-mapping-mission/) (descent stages visible in LRO images).

### 06 · Card story, not a video · The laser mirror that still answers (1969 → today) · 48 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 | \[F\] Start frame: the team's model of the Apollo 11 laser mirror, a flat box of round glass prisms on a stand on grey dust. VIMO crouches beside it. | "Most machines on the Moon are finished. But this little box? Still working!" | Cheeky pluck · LASER MIRROR · 1969 |
| 2 | \[F\] Close on its rows of glass prisms catching sunlight. | "It's a mirror made of 100 glass prisms. It needs no power at all." | 100 prisms · no power |
| 3 | \[I\] A green laser beam shoots from an observatory dome on Earth, crosses space, hits the mirror and bounces straight back. | "Scientists on Earth fire a laser at it. The light bounces right back to where it came from." | Laser ping out and back |
| 4 | \[I\] A clock times the beam; a ruler between Earth and Moon lights up to the millimetre. | "By timing the light, they measure the distance to the Moon to within a few millimetres!" | Within a few mm |
| 5 | \[I\] The painted Moon drifts very slowly away from Earth; VIMO compares it with her growing fingernail. | "And they found the Moon is moving away from us, about 3.8 centimetres every year." | 3.8 cm a year |
| 6 | \[I\] Two more mirrors glow at other landing sites (Apollo 14, Apollo 15); VIMO stamps. | "Apollo 14 and 15 left mirrors too. They even showed the Moon has a liquid centre! Logged!" | Stamp · Still returning data |

NASA sources: [The Apollo Experiment That Keeps on Giving](https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/) (100 quartz prisms, still returning data as of 2019, distance to a few millimetres, 3.8 cm per year, Apollo 14 and 15 arrays, fluid core) · [NSSDCA: Apollo 11 Lunar Module / EASEP](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C) (needs no power).

### 07 · Apollo 15 rover: a car on the Moon (1971) · 50 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Warm 1970s film. VIMO tries to run on the Moon in slow, floaty hops, gets nowhere, flops onto her back. | "Running on the Moon in a big puffy spacesuit? Boing... boing... so slow! What if you had a car?" | Bouncy marimba, comic boing · MOON ROVER · 1971 |
| 2 Problem | \[I\] Astronauts look at distant mountains, too far to walk; a dotted line stops short. | "The best rocks and mountains were too far to walk to. And there's no road, no petrol pump, no air." | Wind-less hush |
| 3 Clever idea | \[F\] Start frame: team's model of the Lunar Roving Vehicle folded flat against the lander side; it unfolds. Inset: a camping chair snapping open (labelled illustration). | "So Apollo 15 brought a car that folded flat against the lander, like a camping chair, and unfolded on the Moon!" | Click-clack · Folds like a camping chair (our comparison) |
| 4 Clever idea, part 2 | \[F\] Close on a wheel: woven steel wire with metal treads; inset of a woven basket. | "No air means no air-filled tyres. So its wheels were woven from thin steel wire, like a basket!" | Woven steel wheels |
| 5 Big moment | \[I\] Two astronauts, gold visors down, drive over hills; dust flies in perfect arcs; VIMO rides in the back, cheering. | "Wheee! It drove them 27.8 kilometres on Apollo 15: much farther than they could ever walk." | Fast music, dust hiss · 27.8 km |
| 6 Today + your turn | \[P\] LRO photo showing rover tracks; VIMO stamps. | "The first car driven on another world is still parked there, and its tracks can be seen from space. Where would you drive it? Logged!" | Stamp · Still parked on the Moon |

NASA sources: [NSSDCA: The Apollo Lunar Roving Vehicle](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html) (210 kg, 3.1 m, two 36-volt batteries, woven zinc-coated steel wheels with titanium chevrons, folded in the LM, 27.8 km on Apollo 15, three rovers) · [50 Years Ago, First Apollo Astronauts to Drive on the Moon Took Final Cruise](https://www.nasa.gov/history/50-years-ago-first-apollo-astronauts-to-drive-on-the-moon-took-final-cruise/) (Apollo 15 first to use the rover, 1971) · [15 Years Ago: LRO](https://www.nasa.gov/history/15-years-ago-lunar-reconnaissance-orbiter-begins-moon-mapping-mission/) (rovers of the last three missions visible).

### 08 · Card story, not a video · Apollo 17: the last footsteps (1972) · 48 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 | \[I\] Warm 1970s film. A deep valley between tall grey mountains; a lunar module and a rover on the valley floor. | "December 1972. The Taurus-Littrow valley. This was Apollo's last trip to the Moon." | Cello, piano · APOLLO 17 · 1972 |
| 2 | \[I\] Two astronauts, gold visors down; a third ship circles above. | "Gene Cernan and Harrison Schmitt explored here for about 75 hours, while Ronald Evans circled above." | About 75 hours |
| 3 | \[F\] Close on the rover's right rear wheel without its fender; dust sprays up. | M (rover): "Uh-oh. I need a new fender!" | Crack, dust hiss |
| 4 | \[F\] The astronauts fold four maps into a new fender and tape them with grey duct tape and two clamps; VIMO holds a giant tape roll. | "Their fix? Four maps, grey duct tape and two clamps!" | Tape rip · 4 maps + duct tape |
| 5 | \[I\] The rover drives on, the new fender holding. | "Their rover drove 35.9 kilometres, the most of all three Moon cars." | 35.9 km |
| 6 | \[I\] The top half lifts off; footprints and the rover stay; VIMO stands small and looks up, then stamps. | "They were the last Apollo astronauts to walk on the Moon. Their rover and footprints are still there. Logged!" | Lift-off, soft theme in a minor key · Stamp |

NASA sources: [APOD: Apollo 17, Last on the Moon](https://science.nasa.gov/image-article/apod-2002-december-12-apollo-17-last-on-the-moon/) (December 1972, Taurus-Littrow, Cernan and Schmitt, Evans in orbit, about 75 hours) · [Duct Tape Saves the Day!](https://www.nasa.gov/image-article/duct-tape-saves-day/) (fender made from four maps, duct tape, two clamps) · [NSSDCA: Lunar Roving Vehicle](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html) (35.9 km on Apollo 17).

### 09 · Lunar Reconnaissance Orbiter: the Moon's photographer (2009 → today) · 50 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Crisp modern look. VIMO looks down at the Moon through binoculars, frowning. | "We left landers and cars on the Moon fifty years ago. Are they really still there? Let's ask the Moon's photographer!" | Bright pads · LRO · 2009 |
| 2 Problem | \[I\] From Earth, the Moon is a smooth ball; the machines are far too small to see; VIMO squints. | "From Earth, even big telescopes can't see something as small as a car on the Moon." | Soft hum |
| 3 Clever idea | \[F\] Start frame: NASA LRO model circling low over the grey Moon; its camera glints. | "So in 2009 NASA sent Lunar Reconnaissance Orbiter. It circles only about 50 kilometres above the Moon, with very sharp cameras." | Camera clicks · About 50 km up |
| 4 Big moment | \[P\] Real LRO images of Apollo sites appear one by one: landers, footpaths, rover tracks; VIMO points at each. | "And look! The Apollo landers, the astronauts' footpaths, the Moon cars. They're all still there!" | Ding, ding, ding · All 6 Apollo sites |
| 5 So what? | \[P\] LRO's colourful height map of the whole Moon; inset: a phone map app (no logos). | "It also made a 3D map of nearly the whole Moon. Think of it as the map app future astronauts will use." | Map app (our comparison) |
| 6 Today + your turn | \[I\] The orbiter keeps circling; VIMO waves and stamps. | "Still working, with fuel planned until 2027. If you could photograph one place on the Moon, which would it be? Logged!" | Stamp · Working (NASA, 2024) |

NASA source: [15 Years Ago: Lunar Reconnaissance Orbiter Begins Moon Mapping Mission](https://www.nasa.gov/history/15-years-ago-lunar-reconnaissance-orbiter-begins-moon-mapping-mission/) (launch 18 June 2009, about 50 km orbit, two narrow-angle and one wide-angle camera, all six Apollo sites with descent stages, footprints and the last three rovers, topographic map over 98%, still operating after 15 years, fuel until 2027).

## Mars

### 10 · Viking 1: a photo of its own foot (1976) · 50 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Warm 1970s film. VIMO holds an old camera, thinking hard; ideas pop up as bubbles: mountain, sunset, a foot? | "If you were the first to land on a new planet, what would you photograph first? Viking 1 chose... its own foot!" | Light percussion · VIKING 1 · 1976 |
| 2 Problem | \[F\] Start frame: NASA Viking Lander model under a parachute, then rockets, above a rust-red plain; butterscotch sky. | "July 20, 1976. Nobody had ever seen the ground of Mars up close. Viking 1 was about to land on the Golden Plain." | Thrusters, soft thump · Landed 20 July 1976 |
| 3 Big moment | \[P\] NASA's first photo from the Martian surface draws itself line by line; the footpad appears at the edge. | M: "Click! The first photo ever taken on the surface of Mars. And look, that's my foot!" | Old printer scan, VIMO giggles · First photo from Mars' surface |
| 4 Clever idea | \[F\] Its robot arm scoops red soil and drops it into a small door on the lander; inside, a tiny glowing lab (labelled illustration). | "Then it asked the biggest question of all: is anything alive here? Its arm scooped soil into a tiny lab inside." | Servo whirr, scoop |
| 5 So what? | \[I\] VIMO with a magnifying glass looking for invisible ants in the soil; question marks float up. | "It's like hunting for invisible ants: you can't see them, so you look for clues. The clues were strange, but not a clear yes. In science, 'not sure yet' is an honest answer." | Curious plinks · Invisible ants (our comparison) |
| 6 Today + your turn | \[I\] Seasons pass over the lander; far away, a modern rover keeps searching; VIMO stamps. | "Viking 1 worked for more than six years. Today, Perseverance is still searching for signs of ancient life. What would you test for? Logged!" | Stamp · Last message Nov 1982 |

NASA sources: [NASA Science: Viking Project](https://science.nasa.gov/mission/viking/) (launch 20 Aug 1975, landing 20 July 1976 at Chryse Planitia "Golden Plain", robotic arm and first soil sample, biology results, more than six years, final transmission 11 Nov 1982) · [JPL: First Photograph Taken on Mars Surface](https://www.jpl.nasa.gov/images/pia00381-first-photograph-taken-on-mars-surface/) (taken minutes after landing, shows footpad #2).

### 11 · Pathfinder and Sojourner: the first Mars rover (1997) · 54 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] 1990s video look. VIMO wraps an egg in bubble wrap and drops it; it bounces and survives; she cheers. | "Ever done the egg-drop challenge? NASA did it, with a whole spacecraft, on Mars!" | Bubble-wrap pops · PATHFINDER · 1997 |
| 2 Problem | \[I\] A spacecraft streaks toward a red boulder field; VIMO covers her eyes. | "Mars is covered in rocks, and nobody had ever driven a rover there. How do you land it safely?" | Rising whoosh |
| 3 Clever idea | \[I\] A giant ball of white airbags hits the ground and bounces again and again, then rolls to a stop; VIMO bounces along, dizzy. | "Wrap it in giant airbags! On July 4, 1997, Pathfinder hit Mars and bounced at least 15 times. Boing, boing, boing!" | Rubbery boings · 15+ bounces |
| 4 Big moment | \[F\] Start frame: team's model of the lander opening like a flower; a ramp unrolls; the tiny six-wheeled rover Sojourner rolls down. | M (small, brave): "Hi! I'm Sojourner, the first rover on another planet. I'm about as big as a microwave oven!" | Tiny servo, fanfare · First rover on any planet |
| 5 So what? | \[F\] Sojourner sniffs rocks with floating name tags: Barnacle Bill, Yogi, Scooby Doo. | "It was built to work for one week. It kept going for 83 days, checking rocks the team named after cartoon characters!" | Comic plinks · 1 week → 83 days |
| 6 Today + your turn | \[I\] Sunset over the lander and rover; VIMO stamps. | "Tiny, but it proved a rover can drive on another planet. The big rovers came after it. What would you name a Mars rock? Logged!" | Stamp · Still on Mars |

NASA source: [25 Years Ago: Mars Pathfinder Launches to Deploy Sojourner, the First Planetary Rover](https://www.nasa.gov/history/25-years-ago-mars-pathfinder-launches-to-mars-to-deploy-sojourner-the-first-planetary-rover/) ("microwave oven" size is our comparison; landing 4 July 1997 in Ares Vallis, an ancient flood plain; airbags, 31 mph, at least 15 bounces; rover 23 lb; one-week design, 83 days; never more than 39 ft from the lander; named rocks; last contact 27 Sept 1997).

### 12 · Opportunity: 90 days became almost 15 years (2004–2018) · 60 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] 2000s digital look. VIMO holds a toy with a big "90 days" tag; years fly by on a calendar; the toy keeps working. | "Imagine a toy built to last 90 days... and it's still working when you finish school. Meet Opportunity!" | Guitar harmonics · OPPORTUNITY · 2004 |
| 2 Problem | \[F\] Start frame: NASA Opportunity model on a flat tan plain under a dusty sky; dust settles slowly on its solar panels. | "January 2004. It ran on sunlight, and Mars is dusty. Nobody expected it to survive for long." | Wind, gentle worry |
| 3 Big moment | \[F\] Close on its arm studying grey rock; a soft blue ghost of water fades over the plain (labelled illustration). | "Then it found hematite, a mineral that forms in water. Like a dried-up puddle mark: water was here once!" | Sparkle · Clue: Mars once had water |
| 4 So what? | \[I\] Its route line stretches across Mars past a marathon finish ribbon; VIMO runs beside it, panting. | "It was meant to drive 1 kilometre. It drove more than 45, longer than a marathon, for almost 15 years!" | Upbeat run music · 45 km > a marathon |
| 5 Twist | \[I\] The sky turns orange, then brown; a dust storm hides the Sun; the rover goes dark; VIMO puts her hand on it. | "In 2018 a dust storm covered the whole planet and hid the Sun. Its last message came on June 10." | Storm hiss, piano alone, one beat of silence |
| 6 Today + your turn | \[I\] Gentle dawn light on the rover in its valley; VIMO salutes slowly and stamps a gold star. | "NASA called it more than a thousand times. Rest well, Oppy, in Perseverance Valley. If you could explore for 15 years, where would you go? Logged!" | Warm strings · Gold stamp |

NASA source: [NASA's Opportunity Rover Mission on Mars Comes to End](https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/) (landing 24 Jan 2004 in Meridiani Planum; designed for 90 Martian days and 1,000 m; more than 45 km; almost 15 years; hematite forms in water; June 2018 dust storm; final communication 10 June 2018; more than a thousand commands; rests in Perseverance Valley). Do not use the often-shared line "my battery is low and it's getting dark": it is not on NASA's page.

### 13 · Curiosity: a rover as big as a mountain climb (2012 → today) · 56 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Crisp modern look. VIMO tries to land a toy car with a parachute; it smashes; she winces. | "How do you gently land a rover the size of a car on Mars? Parachutes alone? Too fast. Airbags? Too heavy." | Comic crash · CURIOSITY · 2012 |
| 2 Clever idea | \[F\] Start frame: NASA Curiosity model hanging on cables under a hovering rocket-powered sky crane; it lowers the rover, cuts the cables, flies away. Inset: a drone lowering a toy on strings (labelled illustration). | "NASA's answer: a flying sky crane! It hovered and lowered the rover on cables, like a drone lowering a toy on strings. Touchdown: August 6, 2012." | Thrusters, snap, cheer · Sky crane (our comparison: drone) |
| 3 Big moment | \[I\] Gale Crater; a soft blue lake shimmers over the floor, then fades to dry rock (labelled illustration). | "In Gale Crater it found that ancient Mars had water, and places where tiny life could have lived." | Wonder chime · Ancient Mars: habitable |
| 4 How it looks | \[F\] Close on the rover's mast; a tiny spark flashes on a rock; the light splits into colours like a rainbow fingerprint. | "Its laser zaps a rock and reads the light from the spark, like a fingerprint that says what the rock is made of." | Zap! · Light fingerprint (our comparison) |
| 5 So what? | \[I\] The rover climbs huge layered Mount Sharp; each layer flips like a page of a history book. | "Now it's climbing Mount Sharp, reading the rock layers like pages of a history book. In 2026 it reached 1 kilometre up!" | Page flips · 1 km climbed |
| 6 Today + your turn | \[I\] Sunset on the mountain; VIMO cheers and stamps. | "Still exploring, more than 14 years after landing. If you could read one page of Mars' history, what would you ask? Logged!" | Stamp · Still exploring (NASA, Sept 2026) |

NASA sources: [Curiosity Celebrates 10 Years on Mars](https://www.nasa.gov/history/curiosity-celebrates-10-years-on-mars/) (landed 6 Aug 2012, sky crane on cables, Gale Crater, ancient habitable environment, ChemCam laser, rover 1,982 lb, plutonium power) · [Curiosity Reaches 1-Kilometer Elevation Gain](https://science.nasa.gov/mars/curiosity-reaches-1-kilometer-elevation-gain/) (1 km gained on 26 Aug 2026; Mount Sharp about 5 km tall) · [Curiosity Blog, Sols 4988–4994](https://science.nasa.gov/blog/curiosity-blog-sols-4988-4994-more-new-tricks-for-an-old-dog/) (still operating, Sept 2026). "Almost 900 kg" is our conversion of 1,982 lb.

### 14 · InSight: listening to Mars (2018–2022) · 50 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Crisp modern look. At a fruit stall, VIMO taps a watermelon and listens. | "Can you tell what's inside a watermelon without cutting it? Tap it and listen! InSight did that... with a whole planet." | Tok tok · INSIGHT · 2018 |
| 2 Problem | \[I\] Cut-away of Mars: crust, mantle and core shown as question marks. | "We'd seen the outside of Mars for years. But what's deep inside? Nobody could dig that far." | Low hum |
| 3 Clever idea | \[F\] Start frame: NASA InSight model on a flat plain, round solar panels open; its arm sets a seismometer on the ground and covers it with a dome. Inset: a doctor's stethoscope (labelled illustration). | "November 2018. InSight set a super-sensitive listener on the ground, like a doctor's stethoscope on Mars' chest." | Servo, soft clunk · Stethoscope (our comparison) |
| 4 Big moment | \[I\] Ripples travel from the surface down to the core and bounce back; a wiggle line jumps on a screen; VIMO's eyes go wide. | "Then... rumble! Marsquakes! It felt 1,319 of them, and the shaking showed scientists Mars' crust, mantle and core." | Low rumble (made audible, labelled) · 1,319 marsquakes |
| 5 Twist | \[F\] Red dust slowly piles up on the round solar panels; light dims. | "But dust kept piling onto its solar panels, like sand on a phone screen you can't wipe, and its power slowly ran out." | Wind, piano |
| 6 Today + your turn | \[I\] Soft sunset; VIMO brushes a little dust away, then stamps. | "Its last message came in December 2022. Thank you for listening, InSight. What would you want to hear inside Mars? Logged!" | Stamp · Last message 15 Dec 2022 |

NASA sources: [NSSDCA: InSight Lander](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A) (landing 26 Nov 2018, western Elysium Planitia, SEIS seismometer, last transmission 15 Dec 2022) · [NASA Retires InSight Mars Lander Mission](https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/?site=insight) (1,319 marsquakes; crust, mantle and core; dust on the solar panels).

### 15 · Card story, not a video · Perseverance's parachute: the secret code (2021) · 50 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 | \[I\] Crisp modern look. A capsule glows hot as it plunges into the thin Martian sky; VIMO clings on top. | "Hold on! We're hitting Mars' air at nearly 12,500 miles an hour!" | Roar · PERSEVERANCE · 2021 |
| 2 | \[F\] Start frame: the team's model of the orange-and-white ring-patterned parachute bursting open above the backshell. | "Pop! The biggest parachute ever opened on Mars: 21.5 metres across!" | Big pop · 21.5 m |
| 3 | \[F\] Close on the canopy: its orange and white sections glow ring by ring and turn into 1s and 0s. | "Psst... its pattern hides a secret message in computer code!" | Mystery plinks |
| 4 | \[I\] The code decodes letter by letter into three glowing words floating in the sky. | "Each ring is a word: DARE MIGHTY THINGS. The outer band hides the location of NASA's JPL lab!" | DARE MIGHTY THINGS |
| 5 | \[P\] Ingenuity's real aerial photo of the backshell and parachute lying in the sand. | "On February 18, 2021, Perseverance landed. A year later, Ingenuity flew over and photographed the parachute and backshell." | NASA photo · 19 Apr 2022 |
| 6 | \[I\] VIMO sits on the parachute's edge, then stamps. | "Used just once, for a few minutes. Without it, no landing. Logged!" | Stamp |

NASA sources: [Mars Decoder Ring](https://science.nasa.gov/resource/mars-decoder-ring/) (binary pattern, DARE MIGHTY THINGS, JPL coordinates in the outer band, landing 18 Feb 2021) · [NASA's Mars Helicopter Spots Gear That Helped Perseverance Rover Land](https://www.jpl.nasa.gov/news/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/) (entry at nearly 12,500 mph, parachute 21.5 m, largest ever deployed on Mars, photographed 19 Apr 2022 on Ingenuity's 26th flight).

### 16 · Ingenuity: the first flight on another planet (2021–2024) · 54 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Crisp modern look. VIMO flaps paper wings on a Mars dune and doesn't lift off at all; sand puffs; she sighs. | "Flying on Mars? The air there is super thin. It's like trying to swim in a pool with almost no water!" | Comic flap · INGENUITY · 2021 |
| 2 Problem | \[F\] Start frame: NASA Ingenuity model tucked under the Perseverance model's belly; it drops gently onto the sand. | "So NASA built a tiny helicopter, about 1.8 kilograms, and tucked it under Perseverance's belly for the trip." | Soft clunk · About as heavy as two water bottles (our comparison) |
| 3 Clever idea | \[F\] Close on two rotors spinning in opposite directions, faster and faster, painted motion blur. | "Its trick: huge blades spinning about 40 times every second, much faster than a helicopter on Earth." | Rising whirr · \~2,400 rpm = 40 spins a second (our calculation) |
| 4 Big moment | \[F\] It lifts off, hovers a few metres above the sand and lands; one second of silence, then VIMO screams with joy. | "April 19, 2021. It flies! The first powered, controlled flight on another planet!" | Silence, then fanfare · First flight on another planet |
| 5 So what? | \[I\] A counter flips from 1 to 72 as the helicopter hops across dunes; a short "plan" mark is left far behind. | "The plan was five test flights. It flew 72! It showed that flying robots can explore other worlds." | Tick-tick · 5 planned → 72 flown |
| 6 Today + your turn | \[I\] Dusk; the helicopter rests on a dune with a damaged blade; VIMO salutes, then stamps. | "In 2024 a blade broke, so it can't fly anymore. Best little flyer ever. If you could fly over Mars, what would you look for? Logged!" | Soft piano, stamp · Mission ended Jan 2024 |

NASA sources: [After Three Years on Mars, NASA's Ingenuity Helicopter Mission Ends](https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/) (first flight 19 Apr 2021, up to five test flights planned, 72 flights, more than 14 times farther than planned, rotor damage on 18 Jan 2024 landing, end announced 25 Jan 2024) · [6 Things to Know About NASA's Ingenuity Mars Helicopter](https://www.nasa.gov/solar-system/6-things-to-know-about-nasas-ingenuity-mars-helicopter/) (about 1.8 kg, four carbon-fibre blades, two counter-rotating rotors at about 2,400 rpm, solar charging, rode on the rover's belly). The sugar-bag comparison is ours.

### 17 · Perseverance and the Three Forks sample depot (2021 → today) · 58 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Crisp modern look. VIMO holds up an ordinary-looking pebble; it glows with a question mark. | "Could a rock tell us whether Mars ever had life? Perseverance is collecting exactly those rocks!" | Mystery plinks · PERSEVERANCE · 2021 |
| 2 Fun secret | \[F\] Start frame: team's model of the orange-and-white parachute opening; its rings glow and turn into three words. | "February 18, 2021. Its giant parachute hid a secret code in its pattern: DARE MIGHTY THINGS!" | Pop, sparkle · DARE MIGHTY THINGS |
| 3 Where | \[F\] NASA Perseverance model rolling into Jezero Crater; a ghostly river flows in and drops sand where it meets a lake (labelled illustration). | "It landed in Jezero Crater. Long ago a river flowed in here and dropped mud and sand, a great place to look for signs of ancient life." | Water trickle · Old river delta |
| 4 Clever idea | \[F\] Close on the drill coring a rock; two shiny tubes; inset: homework saved on a laptop and a USB drive (labelled illustration). | "It drills rock cores and seals them in tubes, two of each, like saving your homework in two places." | Drill whine, click · Saved twice (our comparison) |
| 5 Big moment | \[F\] The rover drops tubes one by one in a zigzag on flat ground; a map pin marks each. | "At Three Forks it left 10 tubes on the ground: the first sample depot on another world. A backup, waiting for a ride to Earth." | Ka-chunk ×10 · 10 tubes · Jan 2023 |
| 6 Today + your turn | \[I\] A small cartoon "O₂" bubble pops from the rover (labelled illustration); it climbs the delta; VIMO stamps. | "It even made oxygen from Mars' air for future explorers, and it's still driving! What rock would you pick? Logged!" | Stamp · Still driving (NASA, Oct 2026) |

NASA sources: [NASA's Perseverance Rover Completes Mars Sample Depot](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-completes-mars-sample-depot/) (10 tubes, zigzag, Three Forks near the delta, completed 28 Jan 2023, first sample depot on another world, paired samples with one kept in the rover, backup for Mars Sample Return) · [Mars 2020: Perseverance Rover](https://science.nasa.gov/mission/mars-2020-perseverance/) (landed 18 Feb 2021 in Jezero Crater, goals, MOXIE produces oxygen, active with 45.22 km driven as of 11 Oct 2026). Mars Sample Return is described by NASA as planned; do not say a date for the return. The parachute beat uses video 15's sources (Mars Decoder Ring).

## Deep space

### 18 · Pioneer 10: first through the asteroid belt (1972) · 52 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Retro 1970s look, warm film grain. VIMO stands at the edge of a dark zone full of tumbling rocks, gulping. | "Imagine being the first to cross a road nobody has ever crossed, and you can't see the other side. That was Pioneer 10's job." | Nervous drum · PIONEER 10 · 1972 |
| 2 Problem | \[F\] Start frame: NASA Pioneer 10 model with its big dish, approaching a painted field of space rocks. | "1972. Between Mars and Jupiter is the asteroid belt. Could a spacecraft get through without being smashed? Nobody knew." | Rumble |
| 3 Big moment | \[F\] It weaves between rocks; VIMO ducks and dodges beside it; then open space. | "It made it! The first spacecraft through the asteroid belt!" | Whooshes, then a big release chord · First through the asteroid belt |
| 4 Big moment 2 | \[F\] Jupiter fills the frame, painted bands swirling; the probe zips past. | "Then, in December 1973, the first close look at Jupiter, the biggest planet of all!" | Brass swell · First to Jupiter |
| 5 So what? | \[F\] Our own simple pictogram of the plaque (people drawn clothed, the solar system, a star map) glows line by line; inset: a message in a bottle on a wave (both labelled illustration). Kid-safety: never show the real plaque photo. | "It carries a plaque: two people, our solar system and a map to find the Sun. Like a message in a bottle, thrown into space." | Gentle chimes · Message in a bottle (our comparison) |
| 6 Today + your turn | \[I\] The probe drifts silently toward a far reddish star; VIMO waves and stamps. | "Its last signal came in 2003. Now it's heading toward the red star Aldebaran: about two million years to go. What would you draw on your plaque? Logged!" | Stamp · Silent, still travelling |

NASA sources: [Pioneer 10](https://science.nasa.gov/mission/pioneer-10/) (launch 2 Mar 1972; asteroid belt Jul 1972 to Feb 1973; Jupiter closest approach 4 Dec 1973 at about 130,354 km; plaque with a man and woman, the solar system and 14 pulsars; RTG power; last signal 23 Jan 2003 from about 12.23 billion km; heading toward Aldebaran, about two million years).

### 19 · Voyager 2: the only visitor to Uranus and Neptune (1977 → today) · 56 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Retro 1970s look. Two far-away blue planets hold open guestbooks; each has only one name written in it. | "If Uranus and Neptune had visitor books, there'd be just one name in each. Voyager 2!" | Playful plucks · VOYAGER 2 · 1977 |
| 2 Problem | \[F\] Start frame: NASA Voyager model, white dish and long booms, leaving a painted Earth; the outer planets look tiny and far. | "1977. The outer planets are so far away that even reaching one takes years." | Launch rumble |
| 3 Clever idea | \[I\] Quick hops: Jupiter, then Saturn's rings; each planet's gravity swings the probe onward like a ball off a bat (labelled illustration). | "So it hopped from planet to planet: Jupiter, then Saturn... using each one to swing toward the next." | Whoosh, whoosh · 1979 · 1981 |
| 4 Big moment | \[F\] Pale-blue tilted Uranus, then deep-blue Neptune with white clouds; VIMO presses her helmet to the window. | "Uranus in 1986. Neptune in 1989. Still the only spacecraft ever to visit them!" | Big swell, one beat of silence · Only visitor ever |
| 5 So what? | \[I\] A painted glowing bubble around the Sun; the probe pushes through its edge into darker space. | "Then it kept going, out of the Sun's bubble, into interstellar space, in 2018." | Soft pop · Interstellar space |
| 6 Today + your turn | \[I\] VIMO floats beside the probe with a tiny walkie-talkie; stamp. | "It's still sending data home today, almost 50 years after launch. Which planet would you visit first? Logged!" | Stamp · Still working |

NASA sources: [Voyager 2](https://science.nasa.gov/mission/voyager/voyager-2/) (launch 20 Aug 1977; Jupiter 9 Jul 1979; Saturn Aug 1981; Uranus 24 Jan 1986; Neptune 25 Aug 1989; "the only spacecraft to visit Uranus and Neptune"; interstellar space 2018; active extended mission). NASA's page gives both 25 Nov and 10 Dec 2018 for the interstellar date, so the video says only "2018". The planet-to-planet swing follows the page's "gravity assist maneuvers"; "almost 50 years" is our count from 1977.

### 20 · Voyager 1: farthest from home (1977 → today) · 58 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Retro look. VIMO holds a gold record and an old record player, curious. | "If you could send one song to aliens, what would it be? In 1977, NASA sent a whole golden record!" | Needle drop · VOYAGER 1 · 1977 |
| 2 What's on it | \[F\] Start frame: NASA Voyager model; camera pushes to the gold disc; painted icons float out: a waving hand, music notes, a heartbeat. | "Hello in 55 languages, sounds of Earth and 90 minutes of music, flying away on Voyager 1." | Snippet of strings · Golden Record |
| 3 Big moment | \[P\] Real NASA "Pale Blue Dot" image; slow push-in; a tiny ring circles the dot. One second of silence. | "In 1990, from very far away, it turned around and took a photo of home. That tiny dot? That's us. Everyone you know." | Hush, soft piano · Pale Blue Dot · 1990 |
| 4 Record | \[I\] The probe crosses the glowing bubble's edge first, alone; a "No. 1" ribbon appears. | "In 2012 it became the first spacecraft in interstellar space. It's the farthest thing people have ever made." | Pop · Farthest human-made object |
| 5 So what? | \[I\] Split screen: VIMO eating breakfast on Earth while a beam of light travels; the next morning, breakfast again, and the beam arrives. | "On November 18, 2026, it'll be so far that its message, travelling at the speed of light, takes a whole day to reach us. Sent at breakfast, heard at breakfast the next day!" | Clock tick · One light-day · 18 Nov 2026 |
| 6 Today + your turn | \[I\] VIMO waves at a tiny probe in the dark; stamp. | "And it's still calling home. If you could send one sound from Earth, what would it be? Logged!" | Stamp · Still working |

NASA sources: [Voyager 1](https://science.nasa.gov/mission/voyager/voyager-1/) (launch 5 Sep 1977; Jupiter 5 Mar 1979; Saturn 12 Nov 1980; heliosphere exit 25 Aug 2012; most distant human-made object; Golden Record with greetings in 55 languages, 35 sounds, 90 minutes of music; one light-day on 18 Nov 2026) · [Voyager 1's Pale Blue Dot](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/) (14 Feb 1990; Earth about a pixel in size). NASA's page gives two different instrument counts, so the video does not name a number.

### 21 · New Horizons: Pluto's heart (2006 → today) · 55 s

| # | Visual: Google Flow prompt | VIMO / machine line | Sound · on screen |
| --- | --- | --- | --- |
| 1 Hook | \[I\] Crisp modern look. A blurry, pixelated little ball on an old screen; VIMO squints at it. | "For 85 years, Pluto was just a blurry dot. What does it really look like? Let's go find out!" | Mystery synth · NEW HORIZONS · 2006 |
| 2 Problem | \[F\] Start frame: NASA New Horizons model, a gold-foil triangle with a big dish, rocketing away from Earth; inset: Dhaka to Chattogram on a map, a streak covering it in seconds (labelled illustration). | "Pluto is billions of kilometres away. So in 2006 New Horizons left Earth faster than any spacecraft before: fast enough to go from Dhaka to Chattogram in about 15 seconds!" | Rocket roar · \~58,000 km/h (our comparison) |
| 3 Clever idea | \[I\] Painted Jupiter swings the probe forward like a slingshot. | "It even got a push from Jupiter's gravity, cutting the trip from 14 years to under 10." | Swoosh |
| 4 Big moment | \[P\] Real NASA image of Pluto with its bright heart-shaped region; one beat of silence; VIMO's eyes become hearts. | "July 14, 2015. Pluto at last... and it has a giant heart!" | Gasp, warm chord · Pluto: 14 July 2015 |
| 5 So what? | \[I\] Painted zoom into the heart's left half: smooth glacier of frozen nitrogen, ice mountains around it. | "Half of the heart is a glacier of frozen nitrogen, with mountains of ice. Tiny, cold Pluto is still changing!" | Ice crackle · Nitrogen glacier |
| 6 Today + your turn | \[F\] The probe passes a two-lobed reddish snowman-shaped rock, Arrokoth, then heads into the dark; VIMO stamps. | "In 2019 it flew past Arrokoth, the farthest world ever explored up close, and it's still flying. If you discovered a new world, what would you name it? Logged!" | Stamp · Still working |

NASA sources: [New Horizons](https://science.nasa.gov/mission/new-horizons/) (launch 19 Jan 2006; about 58,536 km/h, the highest launch speed of any human-made object; Pluto 14 Jul 2015; Arrokoth 1 Jan 2019; heart-shaped nitrogen glacier Sputnik Planitia about 1,000 km wide; spacecraft healthy) · [15 Years Ago: New Horizons Launched](https://www.nasa.gov/history/15-years-ago-new-horizons-launched-to-pluto-and-beyond/) (Jupiter assist cut 14 years to under 10; nitrogen ice glaciers and mountains; signs of recent activity; Pluto discovered 1930, so "85 years" is our count). "Dhaka to Chattogram in about 15 seconds" is our calculation: 58,536 km/h is about 16 km per second, and the road distance is roughly 250 km. "Farthest world explored up close" comes from the team's Hardware Atlas and NASA's Arrokoth coverage; the Clyde Tombaugh ashes line from the old script is dropped because these NASA pages don't state it.

## All NASA sources checked

Every number and claim in the scripts above was read on these NASA pages in November 2026. Where two NASA pages disagree, the script uses the safer wording and says so under the video.

- Curiosity: [10 years on Mars](https://www.nasa.gov/history/curiosity-celebrates-10-years-on-mars/) · [1 km elevation gain](https://science.nasa.gov/mars/curiosity-reaches-1-kilometer-elevation-gain/) · [Blog, sols 4988–4994](https://science.nasa.gov/blog/curiosity-blog-sols-4988-4994-more-new-tricks-for-an-old-dog/)
- InSight: [NSSDCA record](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A) · [Mission retired](https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/)
- Perseverance: [Mars 2020 mission](https://science.nasa.gov/mission/mars-2020-perseverance/) · [Sample depot complete](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-completes-mars-sample-depot/) · [Mars Decoder Ring](https://science.nasa.gov/resource/mars-decoder-ring/) · [Ingenuity spots landing gear](https://www.jpl.nasa.gov/news/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/)
- Ingenuity: [Mission ends](https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/) · [6 things to know](https://www.nasa.gov/solar-system/6-things-to-know-about-nasas-ingenuity-mars-helicopter/)
- Pioneer 10: [Mission page](https://science.nasa.gov/mission/pioneer-10/)
- Voyager: [Voyager 1](https://science.nasa.gov/mission/voyager/voyager-1/) · [Voyager 2](https://science.nasa.gov/mission/voyager/voyager-2/) · [Pale Blue Dot](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/)
- New Horizons: [Mission page](https://science.nasa.gov/mission/new-horizons/) · [15 years after launch](https://www.nasa.gov/history/15-years-ago-new-horizons-launched-to-pluto-and-beyond/)
- Moon and early Mars videos (01–12): the pages linked under each video.

Rule for the team: if NASA updates a status (Voyager instruments, Curiosity's climb, Perseverance's odometer), change only the last shot's on-screen line and its source date.
