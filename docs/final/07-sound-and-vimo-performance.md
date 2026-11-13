# Sound and VIMO Performance

Sound and VIMO are one performance. The voice sets the timing, VIMO moves to the voice, and music and SFX sit underneath. Everything here serves one goal: the viewer keeps listening and keeps looking at the **machine**, not at the effects. Levels, world instruments and the five-note theme come from Build Spec §6. This tab is the detailed script and production plan.

## 1. The feeling

- **Three words:** warm, curious, calm. Think of a favourite older cousin telling a story on a rooftop at night.
- **Listener:** 13–17 years old, plus adults. No baby talk, no lecture, no radio-announcer voice.
- **The golden rule:** if a sound or a move pulls the eye away from the subject on screen, cut it or make it smaller.
- **Soothing does not mean slow.** It means smooth: no sudden loud sounds, no jumps in pace and no harsh frequencies. The energy rises and falls like breathing.

## 2. What we make with ElevenLabs

| Layer | ElevenLabs tool | Settings | Output |
| --- | --- | --- | --- |
| VIMO voice (English) | Text to Speech with timestamps. Use Eleven v4 (most emotive) or v3 for audio tags; check the exact model\_id on the Models page. | One locked voice ID. Stability mid (v3: "Natural"). Style low. Speed 0.95. | One MP3 per line, plus a timing JSON |
| VIMO voice (Bangla) | Eleven v3 (Bengali is confirmed only for v3) | Same voice ID and settings | Same |
| Machine voices (Voyager, Opportunity…) | Same model, same VIMO voice | Era filter in post (Build Spec §6) | Same |
| Ambience and SFX | Sound Effects API | Max 30 s per take. Loop on for ambience. Prompt influence about 0.3 for ambience, about 0.6 for specific hits. WAV 48 kHz for non-looping hits. | WAV / MP3 |
| Music M1–M13 | Music API (music\_v2\_5) through our own API key. The connector in this chat can't make music. | No vocals; stems where possible | 60–120 s beds |
| VIMO five-note theme | Not AI-generated. Play it once on a sampled celesta (MIDI) so it is identical everywhere. | — | Short stingers layered into the music beds |

**Real NASA audio first.** Where NASA has a real recording, we use it and say so on screen: Apollo 11 radio ("The Eagle has landed"), Perseverance's Mars wind and Ingenuity's hum, and Voyager's Golden Record greetings. ElevenLabs only fills what NASA has no recording of.

### VIMO voice design prompt

> Warm young woman in her twenties, a soft smile in her voice, clear and friendly English with gentle South Asian warmth. A storyteller, calm and curious, speaking close to the mic with soft natural breaths. Not a narrator or an announcer: she talks to one friend, not a crowd.

Design three candidates, then have the team listen to the same three test lines: one curious, one wonder, one goodbye. Pick one and lock the voice ID for the whole project. Never change it mid-build.

## 3. Pacing: not slow, not rushed

| Moment | Speed | Feels like |
| --- | --- | --- |
| Normal story | 135–145 words/min | Talking to a friend |
| Explaining science | 125–135 | Making sure you follow |
| Wonder or reveal | 115–125 | Leaning in |
| Excitement | 150–160, short bursts only | Can't wait to tell you |
| Goodbye moments | 110–120 | Quiet, honest |

- **One idea per line, 14 words max.** Each line is its own audio file, so we control every gap.
- **Gaps (set in `beats.json`, not in the TTS):**
  - After a sentence: 0.4–0.6 s.
  - After a big number: 0.8 s.
  - Before a reveal: 1.0 s of silence.
  - After a question VIMO asks you: 1.5 s, so the viewer gets to think.
- **Rhythm of three:** short line, short line, longer line. Then something changes: a new shot, a music lift or a question. Something new every 20–30 s keeps the hook without rushing.
- **The "never boring" check:** if two lines in a row have the same length, the same pace and the same pitch, rewrite one.

## 4. Emotion map: feeling → voice → VIMO → sound

Every line in the script gets one emotion tag from this table. The tag decides the delivery, VIMO's move and the sound underneath, so the whole team reads one table.

| Emotion | When | Voice delivery (audio tag) | VIMO body | Eyes and face | Music | SFX |
| --- | --- | --- | --- | --- | --- | --- |
| **Curious** | A hook question | Rising end, slightly slower (`[curious]`) | Leans in about 10°, small head tilt | Wide, looks at the subject | Thins out to a single instrument | None |
| **Wonder** | A big reveal, a first image | Softer, slower, a breath before (`[softly]`) | Floats up slowly, arms open wide | Looks up or out, slow blink | Swell after the line, never under it | Soft shimmer at the peak only |
| **Excited** | Landing, first flight, success | Brighter, quicker, a smile in the voice (`[excited]`) | Small hop with 5% overshoot, then settles | Sparkle, eyes squint with the smile | Rhythm enters | Tiny pop on the hop |
| **Explaining** | How a machine works | Clear, even, warm; no tag | Still, with one small point toward the part | Looks at the part, then back at you | Low and steady, ducked | None |
| **Tense** | Fuel running low, a dust storm | Lower, slower, short lines; no tag | Very still, tiny lean back | Narrow, focused | Pulse or held note | Low rumble, very soft |
| **Playful** | A fun fact, a joke, a game | Light, quick, a small laugh (`[laughs softly]`) | Bob and tilt, quick in, slow out | Wink or squint | Pizzicato or marimba | Small pluck |
| **Proud** | A record, a machine still working | Warm, firm, steady | Straightens up, chest out, a small nod | Bright, steady gaze | Theme plays (five notes) | None |
| **Gentle sad** | A mission ends | Slowest, near a whisper; no tag (let the words work) | Barely moves, slow drift down, head low | Looks down, then at the machine | Solo instrument or silence | Wind only, or nothing |
| **Reassuring** | You got a quiz answer wrong | Warm, kind, no disappointment | Small nod, open hand | Soft smile | Unchanged | Soft, friendly "try again" tone |
| **Hopeful** | Endings, Artemis, "your turn" | Warm and rising, a smile | Turns to the viewer, open arms, rises | Looks right at you | Full theme, strings rise | Soft chime at the end |

**Audio tag rules:**

- At most one tag per line.
- Never tag a line that carries a NASA fact; facts are said plainly and clearly.
- If a tag sounds fake in testing, delete it. Natural beats dramatic.

## 5. Writing lines that sound natural

- **Write for the ear.** Use contractions ("it's", "didn't"), short words and talk to "you".
- **Numbers:** write them as words in the TTS text so they are never misread ("three hundred eighty-four thousand kilometres"). The caption shows the digits.
- **Compare, don't list.** Give one big number per line, then something the viewer knows, such as the Dhaka–Chattogram drive already used in the script. Every comparison must be checked against the NASA number.
- **Pronunciation dictionary:** Jezero, Sojourner, Ingenuity, Perseverance, Surveyor, Voyager, hematite. Match how NASA says them in its own videos, and test every name once before the batch run.
- **Never invent quotes.** Example: "My battery is low and it's getting dark" is not a real Opportunity message, so we never use it.

| Stiff (don't) | Natural (do) |
| --- | --- |
| "Opportunity operated for a total duration of almost fifteen years." | "Opportunity was built for ninety days. It kept going for almost fifteen years." |
| "Voyager 1 is currently the most distant human-made object." | "No machine we've ever built is farther from home than Voyager 1." |
| "Ingenuity achieved the first powered flight on another planet." | "Then Ingenuity did something no machine had ever done. It flew. On Mars." |

## 6. Sync system: the voice drives VIMO

The voice is the clock. VIMO, the music ducking, the SFX and the captions all read their times from the voice's timing data, so they can never drift apart.

**How it works:**

1. Each line goes to the ElevenLabs "speech with timestamps" endpoint. It returns the audio plus a start and end time for every character.
2. A small script groups the characters into words and writes `beats.json`.
3. In the script, the **key word** of each line is marked with `*`, like `It *flew*. On Mars.` VIMO's gesture peaks on that word.
4. The app plays the line and reads `audio.currentTime` every frame. Moves are triggered by the audio's time, never by `setTimeout`, so a slow phone stays in sync.

```json
{
  "id": "mars.ingenuity.03",
  "audio": "vo/en/mars.ingenuity.03.mp3",
  "emotion": "excited",
  "gapBefore": 1.0,
  "words": [{"w": "It", "t": 0.00}, {"w": "flew", "t": 0.21, "key": true}, {"w": "On", "t": 0.86}, {"w": "Mars", "t": 1.02}],
  "cues": [
    {"t": 0.08, "vimo": "small_hop"},
    {"t": 0.21, "sfx": "pop_soft"},
    {"t": 0.00, "music": "duck"},
    {"t": 1.60, "vimo": "settle"}
  ]
}
```

**Sync rules:**

- **Anticipation:** a gesture starts about 120 ms *before* its key word, so the peak lands right on the stressed syllable.
- **Mouth:** driven by the voice's loudness (Web Audio analyser → three mouth shapes, smoothed over 60 ms). It is cheap on phones and always in sync.
- **Blinks:** random every 3–5 s, plus one blink at the end of each sentence; this feels very natural.
- **Breath:** VIMO's body rises slightly in the 0.3 s before a line starts, as if taking a breath.
- **Music ducking:** music goes down about 8 dB under the voice, with a 300 ms fade down and a 600 ms fade back up. It never cuts in or out suddenly.
- **Captions:** built from the same word times, with the current word highlighted gently.
- **The other way (movement → sound):** when VIMO makes a big move such as flying in or between worlds, a very soft whoosh plays and its volume follows her speed. Small moves make no sound.

```python
# make_lines.py: one call per line → mp3 + timing json
import base64, json, requests
URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps"
for line in lines:  # from lines.csv: id, text, emotion, tag
    r = requests.post(URL.format(voice=VOICE_ID), headers={"xi-api-key": KEY},
        json={"text": line["text"], "model_id": MODEL_ID})
    d = r.json()
    open(f"vo/en/{line['id']}.mp3", "wb").write(base64.b64decode(d["audio_base64"]))
    json.dump(d["alignment"], open(f"vo/en/{line['id']}.json", "w"))
```

## 7. VIMO movement: smooth, cinematic, never distracting

### Principles

- **Calm most of the time.** About 70% of the time VIMO is in a slow idle: a gentle float (about 4 s per cycle) and a soft glow pulse. Stillness makes her few big moves feel special.
- **No straight lines, no linear easing.** Moves travel on soft arcs:
  - Ease in-out for travel.
  - Ease out for arrivals.
  - A small overshoot (3–5%) only for happy moments.
- **Anticipation and follow-through:** a tiny dip before a big move, and loose parts of the rig settle 100–200 ms after the body stops.
- **Layered timing (this makes it feel alive, not robotic):**
  - The eyes move first.
  - The head follows about 100 ms later.
  - The body follows about 200 ms after that.
  - This order also guides the viewer's eye to whatever VIMO is looking at.
- **Dynamic keyframing:** vary the spacing so a move is fast in the middle and slow at both ends. Hold strong poses for 0.5–1 s. Never keep a constant motion.
- **One big move per 10 s at most.** Everything else is small.

### Where VIMO stands

| Position | When | Phone | PC |
| --- | --- | --- | --- |
| **Teller** | She is telling the story and nothing else is on screen | Lower third, center-left, medium size | Left third |
| **Guide** | A video, card or photo is on screen | Small, bottom-left corner, turned toward the content | Small, beside the panel, never over it |
| **Away** | The user is reading, playing or watching a long NASA video | Off-screen or just a soft glow at the edge | Same |

She switches positions only *between* lines, in a 0.6–0.8 s ease-in-out glide, and arrives before the content appears.

### Gesture library (map to VIMO's rig in the Claude Code project)

| Gesture | Use for | Length | Keys |
| --- | --- | --- | --- |
| `idle_float` | Default | Loop, 4 s | Up and down about 2% of her height, slow glow pulse |
| `lean_in` | Curious | 0.5 s | Dip → lean 10° → hold |
| `point_to` | Explaining | 0.6 s | Eyes → head → arm or glow toward the part, hold, release |
| `open_wide` | Wonder, hopeful | 0.9 s | Small dip → rise and open slowly → long hold |
| `small_hop` | Excited | 0.5 s | Squash → hop with 5% overshoot → settle |
| `nod` | Agreeing, reassuring | 0.4 s | Two soft nods, the second smaller |
| `tilt_head` | Asking a question | 0.4 s | Tilt 12°, hold through the 1.5 s gap |
| `look_up` | Sky, space, distance | 0.7 s | Eyes up → head up → slow blink |
| `bow_soft` | Goodbye, thank you | 1.2 s | Slow drift down, head lowers, long hold |
| `hush` | Before a reveal | 0.3 s | Freeze, glow dims a little |
| `fly_in` / `fly_out` | Entering or leaving | 1.0 s | Arc path, ease out on arrival, a soft whoosh at speed |
| `settle_corner` | Moving to Guide | 0.7 s | Glide, turn toward the content, shrink 30% |

If VIMO's model has no arms, use her glow and body tilt for `point_to` and `open_wide` instead.

### Don'ts

- No moving while a fact's key number is spoken, except a small `point_to`.
- No spinning, no constant bouncing, and no moving across the subject.
- She is still while a NASA video plays, and she is still while the user reads a card.
- No sound on small moves.
- With "reduce motion" on, she only fades between positions and keeps a minimal idle.

### Camera and transitions

- The camera follows VIMO with a soft lag of about 0.3 s, so it feels filmed, not glued on.
- Cuts happen in the gaps between lines, never mid-word.
- **Between worlds:** VIMO flies with the camera along an arc. The music crossfades over 2 s into the next world's instruments, under a single soft whoosh.

**Build note:**

- Three.js `AnimationMixer` clips with `crossFadeTo` of 0.3–0.5 s.
- A small procedural layer on top handles look-at, idle float and breath.
- One GSAP timeline per scene, scrubbed by the audio clock from `beats.json`.

## 8. Scene-by-scene sound script

Lines come from the Story Script. This section sets how each beat **sounds and moves**.

### Opening: night rooftop (M1)

| Time | Picture | Voice and VIMO | Music | SFX |
| --- | --- | --- | --- | --- |
| 0–4 s | Dark sky, the city far below | Silence. VIMO is a small dim glow. | None | Night ambience (crickets, a faint distant city), very soft |
| 4–6 s | VIMO wakes | Glow brightens, `look_up` | The five-note theme, on celesta, once | None |
| 6–14 s | VIMO turns to you | First line, **curious**, close and soft, as if sharing a secret. `lean_in` toward the camera. | Soft piano and bansuri enter *after* the first line | Ambience drops 3 dB |
| 14–20 s | A star points to the Moon | The hook question, **curious**, then a 1.5 s gap. `tilt_head`. | Holds one chord | None |

### Lift-off and the 3D quick tour (M2 → M3)

- **Lift-off:** a low rumble, filtered and far away (never loud). VIMO `small_hop`s into the flight. The music builds over 6 s, not suddenly.
- **3D flight over the Moon and Mars:** VIMO flies just ahead of the camera on an arc.
  - When a pin glows, she says one short **excited** line and the pin chimes softly.
  - She stays at least 3 s between pins, so nothing feels rushed.

### A Moon stop: template (Apollo 11)

1. **Hook:** a **curious** line in the Teller position, then `hush` and 1.0 s of silence.
2. **Video:** VIMO uses `settle_corner`. The music ducks to near silence and the real NASA radio audio plays. VIMO is still.
3. **After the video:** VIMO is **proud**, says one line, `nod`. The theme plays.
4. **Card:** a soft paper slide sound. VIMO goes Away while you read.
5. **Try it:** a playful pluck on each correct step. If you are wrong, VIMO is **reassuring**.
6. **Answer so far:** a **hopeful** line, then a soft chime.

### Last footsteps: Apollo 17 (M6)

- Slower pace (120 words/min), **gentle sad** turning to **proud**.
- The real Apollo 17 film clip plays with its own sound. Our music is off during the clip.

### Arriving at Mars (M8)

- Marimba and plucked strings come in. Use the real Perseverance wind recording, very soft, with an on-screen label: "Real sound from Mars."
- VIMO `look_up`s at the red sky in **wonder**.

### Find the water clue: hematite (Opportunity)

- **Playful** and **curious**: a small pluck when the user finds the clue.
- Then **wonder**, slowly: "Water was here."

### Opportunity's goodbye (M9): the quietest scene

- The slowest pace in the app (110 words/min). Lines are short. Gaps are long (0.8–1.2 s).
- VIMO barely moves: `bow_soft`, then still.
- **Music:** a solo instrument only, then 2 s of silence after the last line.
- **SFX:** Mars wind only.
- **Facts said plainly:** built for ninety days, it worked for almost fifteen years. No invented quotes.

### Ingenuity (M10, Hope)

- Tension before the first flight: short lines, a held note, VIMO very still.
- On "It *flew*", VIMO does a `small_hop` and the rhythm enters.
- Ingenuity's real hum, from NASA, plays very soft.

### Deep space: Voyager 1 (M11)

- **Honest space sound:** no whooshes in space, no engine sounds. Only music: strings and a soft choir pad.
- VIMO's voice gets a touch of soft reverb (5–10%), and she speaks slower.
- **Pale Blue Dot:** VIMO goes Away. The image holds for 3 s in silence, then one **wonder** line, near a whisper.

### The next chapter (Artemis II) and "Say thank you" (M12 Finale)

- Artemis: **hopeful**, the theme played full by strings; VIMO uses `open_wide` and turns to the viewer.
- Postcard: warm and personal, with a soft pen-on-paper sound while the user writes.
- Certificate: one soft chime, the theme on celesta, and VIMO's `bow_soft`.

### Experience Mode and Archie (M13)

- **Room ambience:** a very soft hum plus the window video's own sound bed.
- Control sprites make a soft click; there are no beeps.
- **Archie:** its two-note blip when it appears, once only, and never during a VIMO line.

## 9. Music prompts (Music API)

Shared prompt ending, added to every prompt: *"instrumental, no vocals, soft dynamics, warm and soothing, no sudden hits, clean mix with space for a voice."*

| Cue | Prompt | BPM | Length |
| --- | --- | --- | --- |
| M1 Night rooftop | Gentle piano and soft bansuri, night calm, curious and cosy | 70 | 60 s |
| M2 Lift-off | Slow building strings and a low pulse, hopeful, rising, never loud | 80 | 40 s |
| M3 Retro wonder | Warm 1960s-inspired orchestra, light brass, celesta, adventurous | 92 | 90 s |
| M4 First steps | Piano and celesta, quiet awe, sparse | 66 | 60 s |
| M5 Moon fun | Playful celesta and pizzicato strings, light and bouncy | 100 | 60 s |
| M6 Last footsteps | Solo piano, reflective, slow, tender | 60 | 60 s |
| M7 Long journey | Soft strings and piano, travelling, steady | 76 | 60 s |
| M8 Red planet | Marimba and plucked strings, warm desert air, curious | 84 | 90 s |
| M9 Quiet goodbye | Solo cello or solo piano, gentle sadness, lots of space | 58 | 60 s |
| M10 Hope | Marimba, strings, light percussion, rising and joyful | 96 | 60 s |
| M11 Deep space | Slow strings and soft wordless choir pad, vast and peaceful | 56 | 120 s |
| M12 Finale | Full warm orchestra, piano, bansuri, hopeful and grateful | 80 | 90 s |
| M13 Experience | Calm ambient pad and soft piano, focused, for exploring | 64 | 120 s, loopable |

After generating, add the five-note theme stinger (MIDI celesta) at the key moments and cut the loop points by hand. Make two takes per cue and pick one. Don't regenerate more.

## 10. SFX prompts (Sound Effects API)

| ID | Prompt | Length | Loop |
| --- | --- | --- | --- |
| `amb_rooftop` | Quiet night on a rooftop, soft crickets, a very distant city, light breeze | 30 s | Yes |
| `amb_room` | Soft warm hum inside a small calm control room, almost silent | 30 s | Yes |
| `vimo_glow` | Tiny soft glassy shimmer, gentle and magical, very short | 1 s | No |
| `vimo_whoosh` | Very soft airy whoosh, smooth and gentle | 1 s | No |
| `pop_soft` | Tiny soft bubble pop, friendly | 0.3 s | No |
| `ui_tap` | Soft wooden tap, muted | 0.2 s | No |
| `ui_next` | Soft rising two-tone chime, warm | 0.5 s | No |
| `card_open` | Thick paper card sliding gently on a desk | 0.6 s | No |
| `pin_chime` | Small celesta note with a soft tail | 1 s | No |
| `try_again` | Gentle low wooden knock, kind, not an error buzz | 0.4 s | No |
| `rumble_far` | Distant rocket launch rumble, heavily muffled, low and soft | 6 s | No |
| `rover_wheels` | Small metal wheels rolling slowly on dry gravel, soft and close | 4 s | No |
| `pen_write` | Pen writing softly on a paper postcard | 3 s | No |

Archie's two-note blip is made the same way as the theme (MIDI), so it is identical every time.

## 11. Mix

- Use the levels table in Build Spec §6. The voice is always the loudest thing.
- **Export:** about −16 LUFS integrated for web and phone, peaks below −1 dBTP.
- **EQ:** cut the music around the voice's range (2–4 kHz, a small dip) so VIMO stays clear without the music getting louder.
- **Test on:** a phone speaker, cheap earbuds and a laptop. If any line is hard to understand on the phone speaker, fix the mix, not the volume.

## 12. Fast workflow

1. **Lock the voice:** design three candidates, test three lines, pick one (half a day).
2. **`lines.csv`:** id, text, emotion, tag and key word, exported from the Story Script.
3. **Batch run:** `make_lines.py` makes every MP3 and timing file in one go.
4. **Auto-build `beats.json`:** emotion → gesture and music, key word → gesture peak.
5. **One listening pass:** flag bad lines and regenerate only those.
6. **Music and SFX:** two takes each, pick, trim, loop.
7. **Phone test:** play three full scenes on a real phone and check sync and levels.

## 13. Listening checklist

- With eyes closed, would a 15-year-old keep listening?
- Is any line over 14 words, or are two lines in a row the same shape?
- Does every reveal have silence before it?
- Does VIMO ever move while someone reads, watches or plays? (She shouldn't.)
- Does any sound play in space that wouldn't be real? (It shouldn't.)
- Is every real NASA sound labelled, and every fact said plainly?
- On a phone speaker, is every word clear?
