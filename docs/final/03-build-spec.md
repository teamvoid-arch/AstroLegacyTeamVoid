# Astro Legacy — Build Spec

Oct 15, 2026 · @NH asib

## 1. What we are building

Astro Legacy is a scroll-driven, real-time 3D web app for kids aged 8–15. An agile astronaut mascot, **VIMO**, flies through a fully 3D solar system and introduces 57 real NASA machines left on the Moon, on Mars and in deep space since 1964. It has two modes.

| Mode | What the kid does | Length |
| --- | --- | --- |
| **Story Mode** | Scrolls. The camera flies, VIMO acts and talks, machines reply, music and sound follow the emotion. Optional side trips at hub moments. | \~20 min main path; +30–45 s per side trip |
| **Experience Mode** | Picks a machine from a 3D carousel. The kid and VIMO step into its 3D control room; VIMO asks the kid to press its buttons, and through a big front window the kid watches the machine do its job (land, drive, drill, fly, photograph) in real 3D space. | 2–4 min per machine |

This tab is the build spec. The **Story Script** tab holds every spoken line, beat by beat; this tab says how to build, light, animate and sound it.

### Rules every AI agent must follow

1. **Real 3D first.** 3D where it teaches: the NASA machines and the explorable Moon, Mars and space scenes are real-time 3D (three.js). Act 1, the lobby and Act 6 use painted video loops plus one parallax layer; Experience Mode windows are pre-rendered video. No empty or unfinished surfaces anywhere.
2. **Never redesign NASA models.** Keep NASA geometry as delivered. Only add materials, lighting, scale and placement.
3. **Facts come from the Script tab.** Do not invent numbers, dates or statuses. Every fact keeps its SOURCE link in the info card.
4. **Kid-safe always.** No real faces, no scary visuals or sounds, no images with nudity (Pioneer plaque uses our own drawing).
5. **Honest sound.** Space is silent; the info card says music and sound effects are added for the story.
6. **Mobile first.** Must run smoothly on a mid-range Android phone (see section 9).
7. **Captions always available**, in English and Bangla; every audio line has a caption.
8. **Original VIMO.** VIMO is our own character; no copyrighted characters, logos or music.
9. **List every AI tool used** (code, voice, music, images) for the submission's Use of AI field.

## 2. Tech stack and project structure

Use a React + three.js stack so one scene graph serves both modes.

| Need | Use |
| --- | --- |
| App | Vite + React + TypeScript |
| 3D | three.js via @react-three/fiber and @react-three/drei |
| Post effects | @react-three/postprocessing (bloom, tone mapping, vignette, film grain, SMAA) |
| Scroll → animation | GSAP ScrollTrigger + Lenis smooth scroll; camera paths as CatmullRom curves |
| Character animation | three.js AnimationMixer (GLB clips) + small spring/physics helpers for secondary motion |
| Particles | three.js Points / instanced meshes (dust, jetpack trail, stars, comet dust) |
| Audio | Howler.js (music stems, SFX sprites, VO); WebAudio filters for machine voices |
| State | Zustand (mode, scene, stamps, language, sound settings) |
| Lip sync | Rhubarb Lip Sync → viseme JSON per VO line |
| Model prep | Blender → glTF 2.0 (.glb), meshopt compression, KTX2 textures (gltf-transform) |
| Hosting | Static build on GitHub Pages or Netlify |

```
src/
  app/            routes: / (splash), /story, /experience, /experience/:machine
  scenes/         one file per scene: Earth, Moon sites, Mars sites, DeepSpace
  machines/       one folder per machine: model.glb, materials.ts, card.json, experience.tsx
  VIMO/           VIMO.glb, rig controller, expressions, motion paths
  story/          beats.json (generated from the Story Script tab), side trips, hubs
  audio/          music stems, sfx sprite, vo/en, vo/bn, visemes/
  ui/             captions, info card, logbook, carousel, HUD components
  data/           facts.json (fact + source URL per machine), i18n/en.json, i18n/bn.json
public/assets/    hdr/star map, planet textures (KTX2), models (.glb)
```

**beats.json** drives Story Mode. One entry per beat:

```json
{
  "id": "2.4-b11",
  "scene": "moon-tranquility",
  "camera": { "path": "eagle-orbit", "from": 0.2, "to": 0.6 },
  "VIMO": { "clip": "point", "face": "surprised", "screen": "right", "size": "M", "depth": "near" },
  "vo": { "en": "vo/en/2.4-b11.mp3", "bn": "vo/bn/2.4-b11.mp3" },
  "machineVo": null,
  "music": { "cue": "M4-wonder", "layer": "strings" },
  "sfx": ["lm-split", "thruster-puff"],
  "tryIt": null,
  "sourceIds": ["apollo11-descent-stage"]
}
```

## 3. Look and feel

The target look is a premium animated film for kids: real 3D, soft cinematic light, rich but friendly colour, never dark or scary. Think "museum-quality NASA hardware lit like a movie set".

> **Colour rule (12 Nov 2026):** the style reference gives the painting technique only. World colours come from the real place as NASA photos show it. Earth at night: #14234F, #5B4A9E, #3F7D4E, #FFB547. Moon: #07080D, #2B2E36, #8D909B, #D9DADF. Mars: #5A2A1E, #B5532B, #D98B57, #E3B27A. Deep space: #050816, #2A2F6B, #F4F6FF. UI colours (orange #FF8A3D action, green #9BE36A success, blue #3E7BFF info) are kept out of the worlds. Keep every frame clean: one subject in focus, softer background, no busy texture behind text, glow only on what matters, slow motion only.

> **Finished surfaces (12 Nov 2026):** no empty wall, sky or panel. Textures, wall art, frames and props are generated with the image tool (master style prompt + place palette), then placed in 3D as textured planes or materials. Every decoration teaches or tells (painted timeline in the lobby, blueprint posters of each machine from its NASA model, era-correct control panels) and says one line when tapped. Generated depictions of real machines carry an "Illustration" tag; no fake text or NASA logos. Act 1, the lobby and Act 6 use painted video loops plus one parallax layer instead of full 3D (lighter on phones). Details and the build order: Final Review tab.

### Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| space-deep | #0B1033 | Space background, night sky base |
| space-glow | #3B2A8C | Nebula haze, deep-space tint |
| earth-blue | #2E8BFF | Earth scenes, Story Mode accent |
| moon-silver | #C9D3E8 | Moon scenes, Moon chapter colour |
| mars-rust | #E2683C | Mars scenes, Mars chapter colour |
| deep-violet | #8E6BFF | Deep-space chapter colour |
| sun-gold | #FFC94D | Key light, stamps, highlights |
| VIMO-orange | #FF8A3D | VIMO's stripe, main buttons |
| ui-cream | #FFF7E8 | Caption cards, logbook paper |

### Lighting rig (every 3D scene)

- **Sun key:** one directional light, warm (#FFF1D6), casting soft shadows (PCF, 2k map on desktop, 1k on mobile).
- **Rim light:** cool blue (#7FB2FF) from behind the subject, to separate machines and VIMO from black space.
- **Planet bounce:** a hemisphere light tinted by the ground: grey-blue on the Moon, orange on Mars, blue near Earth.
- **Environment:** the star-map HDR as the scene background and a dim environment map for reflections.
- **Hero spot:** when VIMO points at a part, a soft spotlight and a 1.2× emissive pulse highlight that part for 1.5 s.

### Material library (apply to NASA models without changing geometry)

| Material | three.js setup | Used on |
| --- | --- | --- |
| Gold foil (MLI) | MeshPhysicalMaterial, gold base, metalness 1, roughness 0.35, crinkle normal map, slight anisotropy | Lander bodies (Eagle, Viking), Voyager bus parts |
| Bare aluminium | metalness 1, roughness 0.3, faint brushed normal | Frames, legs, antennas, rover chassis |
| White paint | metalness 0, roughness 0.55, light dust overlay | Rocket stages, Surveyor, Ingenuity body |
| Solar cell | dark blue (#18234F), metalness 0.6, roughness 0.2, grid normal, clearcoat 0.5 | Solar panels |
| Dish antenna | off-white, roughness 0.4, subtle fresnel | Voyager, Pioneer, LRO |
| Dust layer | world-space top-down mask, Moon grey or Mars orange | Old landers; amount grows with years on the surface |
| Glass / lens | MeshPhysicalMaterial, transmission 0.9, IOR 1.5 | Camera lenses, VIMO's helmet |

### Post effects

ACES filmic tone mapping, gentle bloom on lights and glowing parts (threshold 0.85), soft vignette, very light film grain. Depth of field only on close-up hero shots.

### Era looks (colour grade per year, blended as the year counter rolls)

| Era | Grade |
| --- | --- |
| 1960s | Black-and-white, soft TV scan lines, light grain |
| 1969–1979 | Faded warm colour film, slight yellow, soft edges |
| 1990s | Slightly washed video colours |
| 2000s | Clean digital, a bit flat |
| 2010s–today | Full colour, crisp |

VIMO and the UI are **never** graded: she always looks like today, which makes her feel like a time traveller.

## 4. 3D assets

All worlds and machines use NASA data. 41 of the 57 machines have a NASA model (exact, twin or landing-site print); the **Story Script** tab's 3D table lists each link.

### Worlds and backgrounds

| Asset | Source | How it's used |
| --- | --- | --- |
| Star background | NASA SVS Deep Star Maps 2020 | Equirectangular HDR sky in every space scene; slow parallax |
| Moon globe + terrain | NASA SVS CGI Moon Kit (colour + displacement) | Moon from orbit; displaced close terrain at landing sites |
| Apollo landing sites | NASA 3D Resources landing-site prints (Apollo 11, 12, 14, 15, 16, 17) | Ground shape for those scenes, re-meshed, dust material added |
| Earth | NASA Blue Marble (day), Black Marble (night lights), cloud layer | Opening and ending; city lights over Bangladesh |
| Mars globe + terrain | NASA Mars Trek global mosaics and elevation; HiRISE terrain for Jezero and Gale where available | Mars approach and landing-site ground |
| Giant planets, Pluto, Ceres, Eros, comets | NASA/JPL mission images as textures on spheres or simple shapes | Deep-space flybys and side trips |
| Real mission photos | NASA Image and Video Library | Logbook photos, "find it" activities, picture-in-picture |

### Preparing a NASA model (do not change its shape)

1. Download from NASA 3D Resources; open in Blender.
2. Fix only technical issues: scale to metres, face normals, origin at the base, remove duplicate faces.
3. Split into material groups (foil, metal, panels, paint, glass) by selecting existing faces; assign the section 3 materials.
4. Bake ambient occlusion (and a dust mask for old landers) into a texture.
5. For moving parts (Ingenuity blades, rover wheels, robot arms, LM split), separate existing parts into named nodes with pivots. No new geometry.
6. Export .glb; compress with gltf-transform (meshopt + KTX2). Target: under 3 MB and under 150k triangles per hero model; side-trip models under 1 MB.
7. If no NASA model exists, build a simple low-poly model from NASA photos and label it "model by Team VOID" in the info card.

### Scale rule

Machines keep real relative size within a scene. VIMO is 1.4 m tall, so kids can compare: she is taller than Sojourner, shorter than Curiosity, and much smaller than the Eagle.

## 5. VIMO the mascot

VIMO is the heart of the app: a fully 3D, rigged, very agile character who is always moving with purpose. Her look and personality are in the Story Script tab ("Meet VIMO").

### Model and rig

- Stylised 3D character, about 25k triangles, soft PBR materials (matte white suit, orange stripe, glass helmet with a faint sky reflection).
- Face inside the helmet: blend shapes for eyes, brows and mouth, plus 9 mouth visemes for lip sync.
- Skeleton: full body + fingers (pointing, salutes), plus spring bones for the helmet antenna, backpack straps and logbook.
- Jetpack: two nozzles that emit particles and a soft glow; thrust strength follows her acceleration.

### Expressions (blend-shape presets)

Excited, curious, amazed, proud, thinking, cheeky, surprised, nervous, sad, gentle, brave, sleepy, happy tears. Each beat in beats.json names one; blend between them over 0.25 s.

### Animation clips

| Group | Clips |
| --- | --- |
| Flight | fly-in-swoosh, fly-loop, barrel-roll, dive, brake-overshoot, hover-idle, orbit-object, chase |
| Ground | moon-hop, mars-walk, kneel, sit, lie-listen, push, dig |
| Gestures | wave, point, salute, high-five, thumbs-up, shrug, count-fingers, heart-hands, cover-eyes, facepalm |
| Logbook | open-logbook, stamp, flip-pages, write |
| Emotion bodies | jump-surprise, spin-happy, slow-float-sad, shiver, yawn, bow |
| Funny | crash-land-bounce, helmet-bump-camera, upside-down-read, dizzy-stars |

### Motion system (what makes her agile)

1. **Every move uses the animation principles** that matter most here: anticipation (a small dip before take-off), arcs (never straight lines), overshoot and settle, squash and stretch on landings and fast turns, follow-through on straps and antenna.
2. **Flight paths** are curves (CatmullRom) generated between her current spot and the beat's target, with a random gentle S-bend so no two flights look the same.
3. **Speed and timing:** big moves 0.6–1.2 s with ease-in-out-back; small moves 0.2–0.4 s. One big move per beat; during narration only small gestures, blinks (every 2–5 s) and breathing.
4. **Screen grid → 3D:** the beat gives a screen position (3×3 grid), a size (XS–XL) and depth (far/near). The controller ray-casts from the camera through that grid point and places VIMO at the distance that gives the requested on-screen height: XS 4%, S 12%, M 28%, L 45%, XL 70% of screen height. "Far" puts her behind the hero object (it can hide her); "near" puts her in front.
5. **Look-at:** her head and eyes follow the object she talks about; at questions to the reader she looks into the camera.
6. **Physics touch:** low gravity on the Moon (slow high hops), floating drift in space, dust puffs where she lands.
7. **Lip sync:** Rhubarb viseme JSON drives mouth shapes in time with her voice line.

### Interaction system (what makes kids love VIMO)

Full lines and rules are in the Story Script tab ("Making kids fans of VIMO"). Build these as one `vimoInteractions` module used by both modes:

- **Tap reactions:** raycast hit on VIMO → play one of 12 short reaction clips (no repeat twice in a row); 5 taps within 3 s → dizzy clip.
- **High-five:** her hand glows at set beats; an upward swipe over it triggers the high-five clip, sparkle particles and a clap SFX.
- **Choice questions:** one per main scene; 2–3 big buttons float beside her; each answer plays its own VIMO line and expression, then the story continues.
- **Idle behaviour:** no scroll or tap for 20 s → idle routine; any input stops it.
- **Name:** optional first name typed once, stored in localStorage, inserted into captions with `{name}`; voice lines use "space buddy".
- **Growth:** her landing clip changes by part (crash → wobbly → perfect), and her fear of the dark fades in Part 4 (expression set shifts from nervous to brave).
- **Memory:** returning visits trigger the welcome-back line and a **Continue** button.

## 6. Sound: music, effects and voice

Sound carries the emotion. Music changes with each chapter, sound effects make every action feel real, and voices keep everyone connected: VIMO talks to the kid, the machines talk back.

### Music cues (original or properly licensed; layered stems that crossfade with scroll)

| Cue | Where | Feeling | Sound |
| --- | --- | --- | --- |
| M1 Night rooftop | 1.1, 4.3 | Curious, warm | Soft piano, light chimes, quiet city night ambience under it |
| M2 Lift-off | 1.3 | Brave, excited | Building drums + strings, big swell at "lift-off" |
| M3 Retro wonder | 2.1–2.3 | Amazed, a bit nervous | Warm vintage synth + celesta, slow pulse |
| M4 First steps | 2.4–2.5 | Awe, proud | Full strings and French horn theme (VIMO's theme, major key) |
| M5 Moon fun | 2.6, Moon side trips | Playful | Plucked strings, bouncy marimba |
| M6 Last footsteps | 2.7 | Bittersweet | Solo cello + piano, theme in minor |
| M7 Long journey | 3.1 | Dreamy, sleepy | Slow ambient pads, soft bells |
| M8 Red planet | 3.2–3.3c | Adventurous | Light percussion, guitar harmonics, rising strings |
| M9 Quiet goodbye | Opportunity storm, InSight dust | Sad but gentle | Piano alone, then warm strings return (never silence) |
| M10 Hope | 3.4–3.6 | Excited, hopeful | VIMO's theme again, brighter, choir "ooh" |
| M11 Deep space | 4.1–4.1b | Vast, wondering | Big slow pads, distant choir, twinkly arpeggios |
| M12 Finale | 4.2–4.3 | Happy tears | Full orchestra version of VIMO's theme, soft ending on piano |
| M13 Experience | Experience Mode | Focused, fun | Light loop per world (Moon/Mars/space) with a "success" sting |

VIMO's theme is a short 5-note melody that returns in every cue, so the whole story feels connected.

### Sound effects library

| Group | Sounds |
| --- | --- |
| VIMO | jetpack whoosh (by speed), thruster puff, landing thump, Moon-hop boing, helmet bump, gasp/laugh/hmm reactions, logbook page flip, stamp "ka-chunk" |
| Machines | radio crackle + beep before each machine line, camera shutter clicks (old and new), servo whirr, rover wheels on gravel, drill grind, helicopter blades (high, fast), solar panel unfold, airbag bounces, parachute pop, sky-crane rope, laser "ping" |
| Big moments | rocket launch rumble, re-entry roar, sky crane thrusters, impact thud (soft, never scary), Moon "ring" (low bell), marsquake rumble |
| World | Mars wind (thin, airy), dust storm hiss, Earth city night, soft space hum (labelled as added) |
| UI | button pop, card swipe, stamp collected, side-trip open, success fanfare, gentle "try again" |

### Voiceover

- **VIMO:** warm female storyteller, 20s, smiling voice, slow and clear, short pauses before big facts. English and native Bangla versions (Bangla recorded or reviewed by a native speaker).
- **Kid-voice questions:** same voice, a little higher and faster.
- **Machine voices:** short, friendly lines with a filter by era: 1960s = old radio (band-pass 300–3,000 Hz, crackle), 1970s = warm tape, 1990s–2000s = light digital, today = clean. Each machine keeps one personality (see Story Script).
- **Format:** one file per line, named by beat id (e.g. vo/en/2.4-b11.mp3), plus its caption text and viseme file.

### Mixing rules

- Music ducks by 10 dB under any voice line; SFX stay audible but under the voice.
- Scroll crossfades music stems over 2 s; never a hard cut except for comic timing.
- Separate toggles for music, voice and effects; all sound starts only after the first tap (browser rule) on **Begin the story**.
- Pause all audio when the tab is hidden; resume where it stopped.

### Sound design: intentional, soft, never distracting (12 Nov 2026, wins over anything above)

Every sound has one job: **guide attention, confirm an action, or carry a feeling**. If a sound does none of these, it is cut. Silence is a tool too.

**The levels (mix on a phone speaker first)**

| Layer | Level | Rule |
| --- | --- | --- |
| VIMO's voice | Loudest: about −16 LUFS | Always clear; everything else makes room for it |
| Music | 10 dB under the voice while she speaks, back up gently after (fade in 0.3 s, out 0.8 s) | Never fights the voice |
| Interface sounds | Very soft: peaks below −18 dBFS, under 0.4 s | Felt more than heard |
| Ambience (wind on Mars, cabin hum) | Barely there: about −36 dB | Only in the worlds, never under cards |
| Safety | Limiter at −1 dBTP; never a sudden loud sound | Respect the phone's mute switch and system volume |

**A sound identity that hooks without shouting**

- **VIMO's five-note theme** plays softly every time she arrives somewhere new. It becomes the sound of "something good is coming".
- **One instrument colour per world:** Earth/home: soft bansuri flute over warm strings (a quiet nod to Bangladesh) · Moon: piano and celesta, sparse and still · Mars: warm marimba and plucked strings over a low pad · Deep space: slow strings and a soft choir pad. The ear always knows where it is.
- **One second of silence before every big reveal** (Eagle's first step, the Pale Blue Dot, Pluto's heart). Then the music returns.
- **Machine voices** keep their era filter (old radio, warm tape, clean), one short line each.
- **Archie** has his own tiny two-note "data blip" when he arrives, so people learn to notice him without looking.

**Interface sounds: soft, rounded, in tune**

| Moment | Sound |
| --- | --- |
| Tap / Next | Soft wooden tick |
| Card appears | Gentle paper flip |
| Stamp | Low, soft thump ("ka-chunk", felt not loud) |
| Correct / done | Two-note chime |
| Wrong try | One warm "hmm" note; never a buzzer |
| Video starts in VIMO TV | App music fades out over 1 s; it returns when the video ends |

All interface sounds are tuned to the key of the music so they blend in. Each frequent sound has three variations with a tiny random pitch change, so it never becomes annoying.

**Honest space sound.** Space has no air, so there is no sound there: in space shots we use music and soft tones, never engine roars or explosions, and the About page says why. On Mars, wind ambience is allowed; if NASA's released Perseverance microphone audio is used, it is labelled "Real sound from Mars, NASA/JPL-Caltech" and its licence is checked first.

**Comfort and access:** sound starts only after the "Begin the story" tap; default volume 70%; separate sliders for voice, music and effects; everything is understood with sound off thanks to captions; cut effects below 120 Hz so they stay clean on phone speakers.

**Making it:** voice and machine lines in ElevenLabs; interface sounds and ambience generated or picked once as one matched set, then reused everywhere; music from the team or a licence-free library, credited on the Sources page.

## 7. Story Mode

> **Seamless flow (12 Nov 2026, wins over anything below):** one main control (Next / swipe / scroll) plus Pause; beats auto-advance 2 s after VIMO's line; fixed order Moon → Mars → Deep space → home with no hub; at each stop the video plays inside VIMO TV automatically (feature episode for the 15 gold-star machines, 10–15 s quick look for the rest, built from a template using NASA photos/footage + VIMO's voice), then the card, then Try it, which VIMO completes herself after 5 s without a tap; Archie never pauses the story unless tapped; side trips, Experience Mode and the full map open after the ending from one "Explore more" screen; the Act 2 quick tour is a real-time 3D flight over the Moon and Mars globes and out to the probes. Full rules: Final Review tab.

Scrolling drives one continuous 3D journey; there are no page loads between scenes. Lines for every beat are in the Story Script tab.

### Scroll engine

1. The page is one tall scroll track; each beat owns a scroll segment (about one screen height).
2. Scroll position scrubs the **camera along its path** and VIMO's flight, so moving back reverses the shot smoothly.
3. When a beat reaches the screen centre, its **voice line, caption and machine reply** play once; scrolling on before they end fades them out gently.
4. An optional **Play** button auto-scrolls at narration speed, for kids who prefer to watch.
5. Between scenes, the camera **flies** (never cuts): up out of a site, along a curved path, and down into the next. The year counter rolls during the flight and the era grade blends.
6. **Hubs** pause the scroll and show side-trip cards in 3D (floating, slowly turning). A side trip opens as a short detour; at its end the camera flies back and the main path continues. Each card and each finished machine adds a stamp.
7. A **progress rail** on the side shows the four parts and the year; tapping jumps to a scene.
8. Every machine has an info button (VIMO's small helmet icon) that opens its card: photo, status, fact, NASA source link.

### Cue sheet (main path)

| Scene | 3D world and camera | VIMO's key moves | Music | Key SFX |
| --- | --- | --- | --- | --- |
| Splash | 3D solar system, slow drift; title and **Begin the story** | Peeks out from behind the Moon, waves | M1 intro | — |
| 1.1 Hello | Earth zoom to a Dhaka-style rooftop at night | Crash-lands, bounces, opens logbook to camera | M1 | whoosh, thump |
| 1.2 Space is hard | Camera rises to Earth's blue edge; basketball-tennis ball scale model | Pulled back by gravity arrow; walks along tape measure | M1 → M2 | wind fade, boing |
| 1.3 Lift-off | Launch pad, cartoon rocket, arc to the Moon | Waves from window, reads upside down | M2 | countdown, rumble |
| 2.1 Ranger 7 | B&W Moon; fall with Ranger 7 | Falls beside it, catches photos | M3 | shutter clicks, crackle |
| 2.2 Surveyor 1 | Dust close-up, three-leg landing | Covers eyes, cheers, high-five | M3 | thruster, soft thump |
| 2.3 Surveyor 3 + Intrepid | Lonely crater, days flashing; faceless astronauts arrive | Sits beside it; jumps up surprised; listens to Moon ring | M3 → M4 | faint beep, footsteps, low bell |
| 2.4 Eagle | Tranquility Base, Earth in sky; LM splits | Orbits LM, wipes plaque | M4 | LM split, thruster |
| 2.5 Mirror | Green laser Earth → Moon → Earth | Follows beam, ducks | M4 | laser ping |
| 2.6 Rover | Hadley Rille, rover unfolds and drives | Moon hops, rides on back seat | M5 | wheels on gravel, boing |
| 2.7 Apollo 17 | Duct-tape fix; LM leaves; years roll alone | Holds tape; stands alone, small | M5 → M6 | tape rip, lift-off |
| 2.8 LRO | LRO orbit + picture-in-picture of Apollo sites | Rides LRO, leans into photo; waves to the Moon | M6 → M10 hint | camera click |
| 3.1 To Mars | Solar system view, curved transfer, message bubble | Sleepy, jumps awake; helmet on camera | M7 | soft bells, message blip |
| 3.2 Viking 1 | Chryse plain, footpad photo prints line by line | Holds parachute strings, laughs | M8 | printer scan, crackle |
| 3.2b Sojourner | Airbag bounces, petals open, tiny rover | Bounces along, kneels beside rover | M8 | airbag bounces, small servo |
| 3.3 Opportunity | Airbags into crater; calendar flips; dust storm | Dizzy, flips pages, hand on rover, slow salute | M8 → M9 | storm hiss, soft piano |
| 3.3b Curiosity | Sky crane on ropes; Mount Sharp layers | Swings on rope; flips layers like pages | M8 | sky-crane thrusters, laser zap |
| 3.3c InSight | Cut-away Mars, quake ripples; dust covers panels | Ear to the ground; brushes dust | M8 → M9 | marsquake rumble |
| 3.4 Parachute | Fiery entry, parachute, backshell in sand | Rides capsule; whispers code secret | M10 | re-entry roar, parachute pop |
| 3.5 Ingenuity | Helicopter unfolds, flies, rests at sunset | Copies its flight, loop; sits beside it | M10 | high blade whirr |
| 3.6 Perseverance | Drill + ten tubes in a zigzag | Counts tubes, sits by the last | M10 | drill grind, tube clink |
| 4.1 Still traveling | Planets shrink; Pioneer, Voyager 2, Voyager 1 with golden record | Chases, waves to planets, whispers | M11 | distant signal beeps |
| 4.1b New Horizons | Pluto turns to show its heart | Heart-hands | M11 | soft chime |
| 4.2 Logbook | Paper logbook with stamps; sorting game | Flips stamps | M12 | page flips, stamps |
| 4.3 Home | Back to rooftop; laser line to the Moon | Perfect landing, bow, becomes a star | M12 → M1 | whoosh, final chime |

### Side-trip template (36 machines)

Camera detours to the machine (5 s flight) → VIMO arrives with one big move → machine reply with its era voice filter → status card → optional small TRY IT → stamp → camera flies back. Target length 30–45 s.

## 8. Experience Mode

Experience Mode puts the player **in the seat of a real mission**. They face the same problem the NASA team faced, make the same kind of decision, and watch the result through the big front window. It works for a 9-year-old and for their parents: kids enjoy the action, adults get the real reasoning.

### Five rules

1. **A real problem, not a button show.** Every experience starts with the question the real team had to answer ("Where do we land?", "Which rock do we drill?"). Every control does something that matters for that answer.
2. **Think, then act.** At least one choice needs thinking (plan, aim, compare, decide). A wrong choice shows what would really happen, explained in one line, then lets you try again. No "game over".
3. **The window is cinema.** The front window plays **pre-rendered video**, not live 3D: each choice triggers its own clip (see Window videos). Real NASA footage is used where it exists.
4. **One extra layer for the curious.** Every step has a small **Why?** button that gives the real engineering reason in one sentence. Kids can skip it; adults will tap it.
5. **100% NASA facts.** Only facts checked on the NASA page listed for that experience. If something is unclear or NASA pages disagree, it is left out. Simplified science says "simplified" on screen.

### Flow

1. **Choose:** the machines float in a slow 3D ring; the front one shows name, year and the mission question.
2. **Brief (10 s):** VIMO gives the problem in one sentence; the side screen shows the goal.
3. **Mission (2–4 min):** 3–4 steps. Each step: VIMO asks → the player acts → the window plays the result clip → one line explains it.
4. **Debrief:** what you did, what the real mission did, one NASA fact card with its source link, gold stamp.
5. **Exit:** Try again · See it in the story · Back to the ring.

### The room

| Part | How it's made | Rule |
| --- | --- | --- |
| Front window | Pre-rendered video clips (1080p, 6–12 s each), played seamlessly by choice | 60% of the screen; faint glass reflection; clips start and end on the same idle frame so they join without a jump |
| Room interior | Generated with an image tool (Google Flow / Higgsfield) in the app's painted style, then split into 3 depth layers for gentle parallax | One room per era (see Room prompts); the label "Imagined control room" on every robot's room |
| Controls | Generated as separate sprites (idle, glowing, pressed) in the same style, placed on the console | 3–5 controls; big, clear icon + one-word label; press animation + click sound |
| Side screens | Real numbers from the experience's NASA page | Each number shows its unit and "NASA data" |
| VIMO | Same 3D model and voice as Story Mode | Short lines; one "Why?" per step |

**Honesty note.** Apollo 11's Eagle is the only machine with a real crew cabin (its windows are enlarged here so the view fits). Every robot's room is imagined: "what it would feel like to sit inside its brain".

### The 14 experiences

| Machine | The real problem | What the player does | What they learn | NASA source |
| --- | --- | --- | --- | --- |
| Apollo 11 Eagle (1969) | Land safely on a surface no one has touched | Fly the last part: steer the lander away from a crater to a flat spot, then touch down | The landing was partly flown by hand: Armstrong steered to avoid a crater | [Apollo 11 Mission Overview](https://www.nasa.gov/history/apollo-11-mission-overview/) |
| Laser mirror (1969 → today) | How far away is the Moon, exactly? | Aim the telescope, fire the laser, time the echo, work out the distance; repeat "years later" | Timing light gives the distance to a few millimetres; the Moon moves away about 3.8 cm a year | [The Apollo Experiment That Keeps on Giving](https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/) |
| Apollo 15 rover (1971) | Explore far, but always find the way back | Drive with the T-shaped hand controller, then get home using only heading and distance on the navigation display | The rover tracked direction and distance back to the lander; Apollo 15 went up to 5.0 km away | [NSSDCA: Lunar Roving Vehicle](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html) |
| Viking 1 (1976) | Is anything alive in Mars' soil? | Scoop soil, run the test, read the strange result, then decide: life, chemistry, or "not sure yet"? | The tests found unexpected chemistry but no clear evidence of life. Good science says what it can't yet prove | [NASA: Viking](https://science.nasa.gov/mission/viking/) |
| Sojourner (1997) | You can't steer live: commands take minutes to arrive | Plan the whole drive to a rock in advance, send it, then watch the result arrive late | Signals between Earth and Mars take 3 to 22 minutes, so rovers are driven by plans, not joysticks | [Speaking Percy's Language](https://science.nasa.gov/missions/mars-2020-perseverance/speaking-percys-language-how-to-talk-so-perseverance-will-listen/) |
| Opportunity (2004) | Did this place once have water? | Look closely at the rocks, test them, find hematite, make the call | Hematite forms in water, so Meridiani Planum was once wet | [Opportunity mission ends](https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/) |
| Curiosity (2012) | What is this rock made of, without touching it? | Point the mast, zap the rock, match the light pattern to the right elements (simplified) | Light from a laser spark reveals what a rock is made of | [Curiosity at 10 years](https://www.nasa.gov/history/curiosity-celebrates-10-years-on-mars/) |
| InSight (2018) | What is inside Mars? | Place the seismometer on the ground, wait for a marsquake, compare how its waves arrive (simplified) | Quake waves passing through Mars revealed its crust, mantle and core | [InSight mission retired](https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/) |
| Perseverance (2021) | Which rock could hold signs of ancient life? | Choose where to drill (old river delta or not), core it, seal two tubes, choose which one stays at the depot | Samples come in pairs: one stays in the rover, one waits at Three Forks as a backup | [Sample depot complete](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-completes-mars-sample-depot/) |
| Ingenuity (2021) | Fly where no one can steer you | Write the flight plan (climb, move, land), upload it, then watch it fly on its own | No joystick: commands are sent well in advance and Ingenuity decides how to fly | [6 Things to Know About Ingenuity](https://www.nasa.gov/solar-system/6-things-to-know-about-nasas-ingenuity-mars-helicopter/) |
| Lunar Reconnaissance Orbiter (2009) | Are the Apollo machines still there? | Zoom into real LRO images and find the lander, the footpaths and the rover tracks | From about 50 km up, LRO photographed all six Apollo sites | [LRO at 15 years](https://www.nasa.gov/history/15-years-ago-lunar-reconnaissance-orbiter-begins-moon-mapping-mission/) |
| Voyager 1 (1990 / 2026) | One last look home | Turn the camera back toward the Sun, find Earth (one pixel), then send a hello and see how long it takes | Earth was "a point of light about a pixel in size"; on 18 Nov 2026 Voyager 1 is one light-day away | [Pale Blue Dot](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/) |
| New Horizons (2015) | One flyby past Pluto: no second chance | Choose what to photograph during the flyby, then see the real Pluto and its heart | Pluto has a nitrogen-ice glacier about 1,000 km wide | [New Horizons](https://science.nasa.gov/mission/new-horizons/) |
| DART (2022) | Can we push an asteroid? | Aim at a 160 m moonlet, hit it, then time its orbit before and after | The orbit went from 11 h 55 min to 11 h 23 min: 32 minutes shorter | [NASA confirms DART changed the orbit](https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space) |

Removed for accuracy: Opportunity's "wind cleaning" and "blueberries" steps, Apollo 11's computer alarms and fuel numbers, and New Horizons' autopilot claim (not stated on the NASA pages used).

### Window videos (pre-rendered)

- **Clips per experience:** one idle loop, one clip per step, one "what would happen" clip for each wrong choice, one ending. About 8–10 clips each.
- **Made with:** Google Flow Frames to Video, starting from a render of the NASA 3D model (or the team's Blender model) in the painted scene, so the machine keeps its real shape. Same style prompt as the Explainer Videos.
- **Real footage first:** where NASA has it, the window plays it with a "NASA footage" tag: Perseverance's landing, DART's final images, LRO's Apollo site images.
- **Joining clips:** every clip starts and ends on the same idle frame; crossfade 0.3 s.

### Room prompts (image tool)

Generate each room once, then reuse it for all machines of that era. Style for all: *hand-painted look with visible brush strokes, soft rim light, deep blue and violet shadows, warm glow from the console, a large empty window area in the centre (left blank for the video), no text, no logos*.

- **1969–1972 (Eagle, Apollo 15):** "inside a small 1960s spacecraft cabin, grey metal panels, rows of chunky toggle switches and round dials"
- **1976–1997 (Viking, Sojourner):** "a retro-futuristic control room, beige panels, small green screens, big round buttons"
- **2004–2012 (Opportunity, Curiosity, LRO):** "a clean 2000s control room, rounded white panels, flat screens with soft blue light"
- **2018–today (InSight, Perseverance, Ingenuity, DART):** "a modern glass cockpit, touch panels, soft LED strips, calm and minimal"
- **Deep space (Voyager 1, New Horizons):** "a quiet observation pod floating in space, starlight through a huge window, golden accents"
- **Earth observatory (Laser mirror):** "an observatory control room at night, a telescope visible through a dome opening, green laser light"

**Controls:** generate each as a separate sprite with a transparent background, in three states (idle, glowing, pressed): lever, joystick, dial, big round button, toggle switch, touch slider.

## 9. Performance, accessibility and kid safety

### Performance budget

| Item | Target |
| --- | --- |
| Frame rate | 60 fps desktop; 30+ fps on a mid-range Android phone |
| First screen | Interactive in under 4 s on 4G; splash loads only the solar system |
| Loading | Stream each part's assets just before it's needed (Moon, Mars, deep space); show VIMO juggling stars while loading |
| Triangles on screen | Under 500k (desktop), under 250k (mobile) |
| Textures | 2k max, KTX2; 1k on mobile |
| Pixel ratio | Clamp to 1.5 |
| Lite mode | Auto-switch if fps stays under 25: no shadows, no depth of field, lighter particles |

### Accessibility

- Captions on by default; English and Bangla switch in the top bar.
- Separate music, voice and effects toggles; everything works muted.
- Reduced-motion setting (and the system setting) replaces fast camera flights with gentle fades.
- Big touch targets (at least 48 px), clear contrast, readable rounded fonts (Baloo 2, Baloo Da 2 for Bangla, Nunito).
- Keyboard: arrow keys scroll beats; Enter opens cards.

### Kid safety

- No login, no ads, no tracking, no chat. Certificate uses only a first name typed on the device.
- No real people's faces (astronauts are faceless or visor-down); no images with nudity.
- No scary sounds or images: impacts are soft, sad moments use warm music.
- Every fact links to a NASA source; simplified simulations are labelled.

## 10. Build order and done checklist

Build in this order so a playable version exists early and every step adds polish. (Per the team playbook, the final submission is built during the hackathon, 13–14 November; before that, use this spec on the practice prototype only.)

| Step | Agent task | Done when |
| --- | --- | --- |
| 1 | Set up the project, routes, Zustand store, scroll engine with empty beats | Scrolling moves a test camera along a path; Play button works |
| 2 | Convert the Story Script tab into beats.json, facts.json and en/bn caption files | Every main-path beat has camera, VIMO, audio and source fields |
| 3 | Build the four worlds (Earth, Moon, Mars, deep space) with the lighting rig and post effects | Flying between worlds is seamless; era grade blends with the year |
| 4 | Prepare and place the main-path NASA models with materials | All 21 main-path machines lit and placed at real scale |
| 5 | Import VIMO, wire the motion system, expressions, lip sync and the interaction system (taps, high-five, choices, idle, name) | VIMO hits every beat's screen spot, size and face, with agile flights |
| 6 | Add voice, music cues and SFX with ducking and crossfades | Full main path plays with sound and captions in English |
| 7 | Main-path TRY IT activities, info cards, logbook, sorting game, certificate | All main-path activities work on a phone |
| 8 | Hubs and the 36 side trips | Each side trip opens from its hub, plays, stamps, and returns |
| 9 | Experience Mode: carousel, enter transition, control-room kit with window and console, 14 experiences | Each experience is finishable in 2–4 minutes |
| 10 | Bangla voice and captions, accessibility, lite mode, performance pass | Meets section 9 targets on a mid-range Android phone |
| 11 | Fact-check pass and deploy | Every fact links to its NASA source; live link works in a private window |

### Done checklist

- [ ] Every scene finished: real-time 3D for machines and worlds, painted loops for Act 1, lobby and Act 6, no empty surfaces
- [ ] NASA models unchanged in shape; materials and lighting added
- [ ] VIMO moves with anticipation, arcs and overshoot; never stiff or still for long
- [ ] Every beat has voice, caption, music cue and sound effects
- [ ] Music never cuts hard; sad moments stay warm
- [ ] All 57 machines reachable (21 main path + 36 side trips)
- [ ] 14 Experience Mode machines playable start to finish
- [ ] Every fact has a NASA source link; simulations labelled
- [ ] English and Bangla captions and voice; Bangla checked by a native speaker
- [ ] 30+ fps on a mid-range Android phone; lite mode works
- [ ] No faces, no nudity, nothing scary; no login or tracking
- [ ] Every AI tool listed for the Use of AI field

## 11. Sources and licences

NASA images, models and data are generally free to use with credit ("Courtesy of NASA"); check each item's page for exceptions, and never imply NASA endorses the app. Music, sounds, voices and fonts must be original, CC0, or licensed for this use; list any AI tool used.

- [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) — spacecraft models and landing-site prints
- [NASA SVS CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) — Moon colour and elevation maps
- [NASA SVS Deep Star Maps 2020](https://svs.gsfc.nasa.gov/4851) — star background
- [NASA Visible Earth: Blue Marble](https://visibleearth.nasa.gov/collection/1484/blue-marble) — Earth textures
- [NASA Mars Trek](https://trek.nasa.gov/mars/) — Mars mosaics and elevation
- [NASA Image and Video Library](https://images.nasa.gov/) — mission photos
- [Astro Legacy Hardware Atlas](https://claude.ai/artifact/2vSamG9ywe19SW7JDSWnCv) — the team's list of all 57 machines, with NASA links
- Story Script tab — every spoken line and its source
- Fonts: Baloo 2, Baloo Da 2, Nunito (SIL Open Font License)
- Tools: three.js, React Three Fiber, GSAP, Howler.js, Rhubarb Lip Sync, Blender, gltf-transform (all open source)

## 12. App screens and everything needed to run it

This is the full list of screens, data and plumbing; an agent that builds all of it has a working app.

### Screens

| Screen | Route | What's on it |
| --- | --- | --- |
| Splash | / | 3D solar system, title, **Begin the story**, **Experience**, language (EN/BN), sound on/off, **Continue** if there is saved progress |
| Name (optional) | overlay | VIMO asks "What should I call you?"; text field, **Skip** |
| Story Mode | /story | Scroll journey, captions, progress rail, Play button, info cards, hubs and side trips, TRY IT activities |
| Logbook | /logbook | All stamps (main + side trips + experiences), VIMO stickers, sorting game, quiz, certificate |
| Certificate | /certificate | Kid's first name, date, stamps count, VIMO's signature; **Download PNG** (drawn on a canvas in the browser) |
| Experience carousel | /experience | 3D ring of 14 machines, **Enter** |
| Experience room | /experience/:machine | Control room, window, console, side screens, VIMO guide |
| Machine card | overlay | Real NASA photo, status, fact, NASA source link, **See it in the story**, **Try it yourself** |
| Sources | /sources | Every fact with its NASA link, grouped by machine; credits for models, textures, music, voices, fonts, AI tools |
| About | /about | Team VOID, the challenge, "not affiliated with or endorsed by NASA", "space is silent" note, licence |
| Settings | overlay | Language, captions, music/voice/effects volume, reduced motion, lite mode, reset progress |
| Loading | overlay | VIMO juggling stars + progress bar while a part streams in |
| Error / unsupported | overlay | Friendly message if WebGL is missing, with a link to the demo video |

### Archie: "Know more from NASA"

The story, cards and videos already use NASA data. **Archie** appears only when NASA's archive holds something more that fits the moment: real film, an animation, a famous photo or a mission page that lets the viewer go deeper. No extra NASA material = no Archie. That keeps him special: when he shows up, there is something worth seeing.

- **Who:** a small archive probe with a big dish for an ear and a glowing screen for a face. Our own design; the app never uses the NASA logo or insignia.
- **Where:** bottom-right corner, big enough to notice (phone 88 px, PC 120 px). He flies in from the edge when the moment starts and leaves when it ends.
- **The bubble:** pops up for 3 s, then shrinks to a small glow: **"Know more from NASA!"**, or **"Real NASA film inside!"** when it's footage.
- **Opening (300 ms):** his screen-face grows into the panel. Phone: bottom sheet to 85% height, swipe down to close. PC: 440 px panel from the right; the scene dims but stays visible.
- **The panel:**
  1. **The archive item first.** Footage or animation plays straight away (muted, captions on, tap for sound); a photo or page shows as a large preview.
  2. **One line on why it matters here** (15 words or fewer).
  3. **"Open on NASA ↗"**, the link to the item's NASA page.
- **Rules:** only items checked on a NASA page; nothing loosely related; closing the panel pauses the video and resumes the story.

**Where Archie appears (checked NASA items)**

| Story moment | NASA archive item | Why it fits |
| --- | --- | --- |
| Ranger 7 | [Live from the Moon – Impact!](https://science.nasa.gov/photojournal/live-from-the-moon-impact) | Ranger 9's real pictures, falling into Alphonsus crater |
| Surveyor 3 / Apollo 12 | [Astronauts Pay a Visit to Surveyor 3](https://www.nasa.gov/image-article/astronauts-pay-visit-surveyor-3/) | The real photo of an astronaut beside the robot |
| Apollo 12 | [LRO Looks at Apollo 12, Surveyor 3 Landing Sites](https://www.nasa.gov/missions/lunar-reconnaissance-orbiter-looks-at-apollo-12-surveyor-3-landing-sites/) | Both machines, seen from orbit today |
| Laser mirror | [The Apollo Experiment That Keeps on Giving](https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/) | How the mirrors are still used |
| Apollo 17 | [Apollo 17 video library](https://nasa.gov/wp-content/uploads/static/history/alsj/a17/video17.html) | Real film: the fender taped, then the lift-off |
| Viking 1 | [First Photograph Taken on Mars Surface](https://www.jpl.nasa.gov/images/pia00381-first-photograph-taken-on-mars-surface/) | The original first picture, full size |
| Perseverance | [Perseverance landing video](https://www.nasa.gov/press-release/nasa-s-mars-perseverance-rover-provides-front-row-seat-to-landing-first-audio%C2%A0) | The real parachute opening and sky crane |
| Perseverance's parachute | [Mars Decoder Ring](https://science.nasa.gov/resource/mars-decoder-ring/) | Crack the parachute code yourself |
| Phoenix (side trip) | [Disappearing Ice](https://science.nasa.gov/photojournal/disappearing-ice/) | Ice chunks vanishing in the trench |
| GRAIL (side trip) | [GRAIL Impacts the Moon](https://svs.gsfc.nasa.gov/4023) | The twins' last orbits |
| Kepler (side trip) | [Exoplanet Transit Animations](https://svs.gsfc.nasa.gov/13022/) | How a passing planet dims its star |
| DART (side trip) | [DART's Final Images Prior to Impact](https://www.nasa.gov/solar-system/darts-final-images-prior-to-impact/) | The last 5½ minutes before the crash |
| Voyager 1 | [Voyager 1's Pale Blue Dot](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/) | Earth as "a point of light about a pixel in size" |

The team can add more moments later, using the same rule: a real NASA item that fits the story, checked on its NASA page.

### Phone first

The app is designed for a phone held upright, then scaled up to PC.

| Screen | Phone (portrait) | PC (landscape) |
| --- | --- | --- |
| Every screen | Slim top bar: journey bar (Moon → Mars → Deep space, with stamps) + menu. Captions sit above the bottom edge. One main action, in thumb reach. Archie bottom-right only when NASA has more | Same parts, wider: journey bar across the top, captions lower-centre, Archie bottom-right when NASA has more |
| Story Mode | Swipe up or tap to move to the next beat; the 3D scene fills the screen | Scroll or arrow keys; the scene fills the screen |
| Cards | Bottom sheet, picture on top, two lines, game button at the bottom | Centred card over the dimmed scene |
| Explainer video (VIMO TV) | Full-width player, captions on, one tap to close | Large centred player |
| Experience Mode | Window on the top 55% (the video), console on the bottom 45% so every control is in thumb reach; side readouts become two small chips over the window | Window in the centre, console below, readouts on both sides |
| Logbook | Stamps in a 3-column grid, grouped Moon / Mars / Deep space | 6-column grid |

**How learning is laid out, visibly:** the journey bar is always there, so anyone can see the order (Moon → Mars → Deep space), where they are, and what they've collected. Each stop has the same two doors: **Story** (VIMO) and **Try it** (game or Experience). Archie flies in only when NASA's archive has more to show.

### Smooth on phones

| Item | Phone target |
| --- | --- |
| Touch response | Under 100 ms; every tap gives a visual and a sound right away |
| Animations | 60 fps; UI animates only transform and opacity |
| 3D scenes | 30+ fps on a mid-range Android; pixel ratio 1.25; render only when something moves |
| When a panel or video is open | Pause the 3D render behind it |
| Videos | 720p on phones (1080p on PC), H.264 + WebM; load the next clip only; poster image shows instantly |
| Downloads | Each part (Moon, Mars, Deep space) under 15 MB on phones; the next part loads in the background |
| Low-end phones | Auto Lite mode: 2D painted backdrops instead of 3D terrain, fewer particles; same story and data |
| Test devices | One mid-range Android (about 4 GB RAM), one iPhone, one laptop; test on slow 4G |

### Data files (all in /src/data and /src/story, generated from the Story Script tab)

| File | One entry per | Key fields |
| --- | --- | --- |
| machines.json | machine (57) | id, name, year, world, site, status, path (main/side/experience), model file, photo URL, scene id |
| facts.json | fact | id, machineId, text (en, bn), sourceTitle, sourceUrl, checked (true/false) |
| beats.json | beat | see section 2 |
| hubs.json | hub | id, afterScene, sideTripIds |
| sidetrips.json | side trip (36) | id, machineId, camera, vimo, vo, machineVo, status, tryIt, sourceIds |
| experiences.json | experience (14) | id, machineId, room style, controls\[\] (id, label, type, icon), steps\[\] (controlId, ask, window action, explain, readout changes), win, factId |
| vimo.json | interaction | tap reactions, idle routine, choice questions per scene, catchphrases |
| i18n/en.json, i18n/bn.json | UI string + caption | key → text (with `{name}` where used) |
| audio-manifest.json | audio file | id, path, type (music/sfx/vo), duration, captionKey, visemeFile |

### Saved on the device (localStorage, wrapped in try/catch)

`al.name`, `al.lang`, `al.progress` (last beat id), `al.stamps` (ids), `al.stickers`, `al.settings` (volumes, captions, reduced motion, lite mode), `al.visits`. Nothing is sent to a server; the app works without it if storage is blocked.

### Quality checks before every deploy

- Automated browser tests (Playwright): app loads; every main-path beat reaches the centre; every side trip opens and returns; every experience can be finished; every audio file in the manifest exists; every beat has a caption in EN and BN; every fact has a source URL.
- Manual: one full run on a mid-range Android phone and one on a laptop; check sound sync, captions, and fps.

### Deploy and submission

- Build with `npm run build`; deploy the static folder to GitHub Pages or Netlify; test the live link in a private window.
- Public GitHub repo with README (what it is, how to run, team, NASA data used), LICENSE (Apache 2.0), NOTICE, and SOURCES.md (from facts.json).
- Demo video with English subtitles; no under-18 faces or voices.
- Use of AI list: every AI tool used for code, voices, music, images, with what it was used for.

## 13. Hand-off prompt for an AI agent

Paste this to any coding agent, together with this doc (both tabs):

```
You are building "Astro Legacy", a scroll-driven real-time 3D storytelling web app for kids (8–15)
for the NASA Space Apps Challenge 2026 ("Abandoned but not Forgotten").

Read the attached doc fully. The "Build Spec" tab says HOW to build it; the "Story Script" tab
holds EVERY line, beat, side trip, experience step and fact with its NASA source.

Read the "Final Review" tab first. Rules: follow Build Spec section 1 (3D where it teaches, never reshape NASA models, facts only from the
Script, kid-safe, captions EN+BN, mobile first). Use the stack and folder structure in section 2.
Work in the order of section 10, one step at a time. After each step: run the app, run the tests
in section 12, and report what works and what is left. Never invent facts, numbers or statuses;
if something is missing, leave a TODO and tell me.

The mascot is VIMO (sections 5 and the Script's "Meet VIMO" and "Making kids fans of VIMO").
She must feel alive: agile flights, expressions, lip sync, tap reactions, choices, idle bits.

Start with step 1 and show me a running page.
```
