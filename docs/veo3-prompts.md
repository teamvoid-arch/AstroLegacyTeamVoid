# Veo 3 prompts: every VIMO TV clip

Made by `npm run video -- --prompts` from docs/final/05-explainer-videos.md. 15 videos, 90 shots: 48 prompt-only, 34 start-frame, 8 real NASA photo (never generated).

## Settings for every clip

- Model: Veo 3 (Google Flow or Gemini). Aspect ratio **16:9**, length **8 seconds**.
- **Turn the clip's own audio off** (or mute it): the app adds VIMO's voice, music and sound effects itself.
- Negative prompt (if there is a field): `text, letters, captions, logos, watermark, real human faces, extra spacecraft parts, speech, narration, music`
- **[F] shots:** use *Frames to Video* and upload the start frame named under the shot (a picture of the NASA 3D model or the team's labelled replica). Without it Veo invents the spacecraft, and the shape would be wrong.
- **[I] shots:** *Text/Ingredients to Video*. If you use Ingredients, add one VIMO picture (front view) so she looks the same in every clip.
- **[P] shots:** nothing to make. The app shows the real NASA photo there.
- Reject a clip if the spacecraft changes shape, gains parts, or any text/letters appear. Make it again.

## Where to put the clips

Save each clip as `public/assets/video/<video id>/shot-<n>.mp4` (the exact path is under each shot), then run `npm run video -- --register` and restart `npm run dev`. VIMO TV plays a video's clips in order; missing shots are skipped.

## 03 · Surveyor 3: the robot who got a visit (1967 / 1969)

Video id: `surveyor3`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "What happens to a machine left outside for two and a half years? On the Moon, someone actually went to check!"

```
Faded film. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack leaves a toy bicycle outside; a calendar flips through rain, sun and snow; the bike gets dusty. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/surveyor3/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "April 1967. Astronauts wanted to land on the Moon soon. But would the ground hold their heavy ship, or would they sink?"

Start frame: `video-frames/surveyor3/2.png` (Surveyor 3 model landing alone in a shallow grey crater; astronauts' bootprints appear as dotted "future" outlines)

```
Begin exactly on the uploaded start frame: Surveyor 3 model landing alone in a shallow grey crater; astronauts' bootprints appear as dotted "future" outlines. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/surveyor3/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "So Surveyor 3 dug, like you testing sand at the beach: is it firm, or squishy?"

Start frame: `video-frames/surveyor3/3.png` (a render of the machine)

```
Close on its little scoop digging a trench; split screen: VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack pressing her boot into beach sand (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/surveyor3/shot-3.mp4`

### Shot 4 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Then, two and a half years later... knock, knock! Apollo 12 landed less than 200 metres away, and two astronauts walked over." M (faint, then warm): "Visitors! I knew someone would come."

```
Two astronauts, gold visors down, walk over the crater rim toward the old lander. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack gasps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/surveyor3/shot-4.mp4`

### Shot 5 · [F] start frame

Line in this shot (for timing, not in the prompt): "They took its camera and scoop home, so engineers could see what the Moon does to a machine after 31 months."

Start frame: `video-frames/surveyor3/5.png` (a render of the machine)

```
A gloved hand removes the TV camera and scoop; they go into a bag; Earth hangs above. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/surveyor3/shot-5.mp4`

### Shot 6 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "It helped twice: once for astronauts, once for engineers. Your turn: what would you leave outside to test? Logged!"

Nothing to make: NASA photo of Alan Bean beside Surveyor 3; VIMO stamps.

## 05 · Apollo 11 Eagle: the bottom half that stayed (1969)

Video id: `apollo11-eagle`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Here's a puzzle: how do you take off from the Moon when there's no launch pad? Simple. You bring one!"

```
Faded film. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack stands on grey dust, looking around for a launch pad, scratching her helmet. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo11-eagle/shot-1.mp4`

### Shot 2 · [I] prompt only

Line in this shot (for timing, not in the prompt): "July 20, 1969. The lunar module Eagle lands on a flat plain called the Sea of Tranquility."

```
A huge rocket rises at dawn (no logos); then the lunar module glides down over the flat Sea of Tranquility, dust blowing. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo11-eagle/shot-2.mp4`

### Shot 3 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Neil Armstrong and Buzz Aldrin step out. For the first time ever, people are walking on another world!"

```
Two astronauts, gold visors down, step onto the Moon; a ship circles high above. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack covers her mouth with both hands. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo11-eagle/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "Eagle had two halves. The bottom half was the launch pad. The top half blasted off from it, like a jack-in-the-box jumping off its box!"

Start frame: `video-frames/apollo11-eagle/4.png` (NASA Lunar Module model)

```
Begin exactly on the uploaded start frame: NASA Lunar Module model. Eagle splits: the top half fires and leaps up; the gold bottom half stays on its legs. Inset: a jack-in-the-box jumping off its box (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo11-eagle/shot-4.mp4`

### Shot 5 · [F] start frame

Line in this shot (for timing, not in the prompt): M (calm): "We came in peace for all mankind." VIMO: "That's written on a plaque on its leg, left there on purpose."

Start frame: `video-frames/apollo11-eagle/5.png` (a render of the machine)

```
Close on the plaque on one leg; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack wipes dust off gently. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo11-eagle/shot-5.mp4`

### Shot 6 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "The bottom half is still standing there, and a spacecraft can photograph it from orbit. If you left a message on the Moon, what would it say? Logged!"

Nothing to make: LRO photo of the Apollo 11 site; a small circle marks the descent stage; VIMO stamps.

## 07 · Apollo 15 rover: a car on the Moon (1971)

Video id: `apollo15-rover`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Running on the Moon in a big puffy spacesuit? Boing... boing... so slow! What if you had a car?"

```
Warm 1970s film. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack tries to run on the Moon in slow, floaty hops, gets nowhere, flops onto her back. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo15-rover/shot-1.mp4`

### Shot 2 · [I] prompt only

Line in this shot (for timing, not in the prompt): "The best rocks and mountains were too far to walk to. And there's no road, no petrol pump, no air."

```
Astronauts look at distant mountains, too far to walk; a dotted line stops short. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo15-rover/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "So Apollo 15 brought a car that folded flat against the lander, like a camping chair, and unfolded on the Moon!"

Start frame: `video-frames/apollo15-rover/3.png` (team's model of the Lunar Roving Vehicle folded flat against the lander side; it unfolds)

```
Begin exactly on the uploaded start frame: team's model of the Lunar Roving Vehicle folded flat against the lander side; it unfolds. Inset: a camping chair snapping open (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo15-rover/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "No air means no air-filled tyres. So its wheels were woven from thin steel wire, like a basket!"

Start frame: `video-frames/apollo15-rover/4.png` (a render of the machine)

```
Close on a wheel: woven steel wire with metal treads; inset of a woven basket. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo15-rover/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Wheee! It drove them 27.8 kilometres on Apollo 15: much farther than they could ever walk."

```
Two astronauts, gold visors down, drive over hills; dust flies in perfect arcs; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack rides in the back, cheering. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/apollo15-rover/shot-5.mp4`

### Shot 6 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "The first car driven on another world is still parked there, and its tracks can be seen from space. Where would you drive it? Logged!"

Nothing to make: LRO photo showing rover tracks; VIMO stamps.

## 09 · Lunar Reconnaissance Orbiter: the Moon's photographer (2009 → today)

Video id: `lro`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "We left landers and cars on the Moon fifty years ago. Are they really still there? Let's ask the Moon's photographer!"

```
Crisp modern look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack looks down at the Moon through binoculars, frowning. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/lro/shot-1.mp4`

### Shot 2 · [I] prompt only

Line in this shot (for timing, not in the prompt): "From Earth, even big telescopes can't see something as small as a car on the Moon."

```
From Earth, the Moon is a smooth ball; the machines are far too small to see; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack squints. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/lro/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "So in 2009 NASA sent Lunar Reconnaissance Orbiter. It circles only about 50 kilometres above the Moon, with very sharp cameras."

Start frame: `video-frames/lro/3.png` (NASA LRO model circling low over the grey Moon; its camera glints)

```
Begin exactly on the uploaded start frame: NASA LRO model circling low over the grey Moon; its camera glints. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/lro/shot-3.mp4`

### Shot 4 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "And look! The Apollo landers, the astronauts' footpaths, the Moon cars. They're all still there!"

Nothing to make: Real LRO images of Apollo sites appear one by one: landers, footpaths, rover tracks; VIMO points at each.

### Shot 5 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "It also made a 3D map of nearly the whole Moon. Think of it as the map app future astronauts will use."

Nothing to make: LRO's colourful height map of the whole Moon; inset: a phone map app (no logos).

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Still working, with fuel planned until 2027. If you could photograph one place on the Moon, which would it be? Logged!"

```
The orbiter keeps circling; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack waves and stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/lro/shot-6.mp4`

## 10 · Viking 1: a photo of its own foot (1976)

Video id: `viking1`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "If you were the first to land on a new planet, what would you photograph first? Viking 1 chose... its own foot!"

```
Warm 1970s film. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack holds an old camera, thinking hard; ideas pop up as bubbles: mountain, sunset, a foot? Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/viking1/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "July 20, 1976. Nobody had ever seen the ground of Mars up close. Viking 1 was about to land on the Golden Plain."

Start frame: `video-frames/viking1/2.png` (NASA Viking Lander model under a parachute, then rockets, above a rust-red plain; butterscotch sky)

```
Begin exactly on the uploaded start frame: NASA Viking Lander model under a parachute, then rockets, above a rust-red plain; butterscotch sky. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/viking1/shot-2.mp4`

### Shot 3 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): M: "Click! The first photo ever taken on the surface of Mars. And look, that's my foot!"

Nothing to make: NASA's first photo from the Martian surface draws itself line by line; the footpad appears at the edge.

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "Then it asked the biggest question of all: is anything alive here? Its arm scooped soil into a tiny lab inside."

Start frame: `video-frames/viking1/4.png` (a render of the machine)

```
Its robot arm scoops red soil and drops it into a small door on the lander; inside, a tiny glowing lab (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/viking1/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "It's like hunting for invisible ants: you can't see them, so you look for clues. The clues were strange, but not a clear yes. In science, 'not sure yet' is an honest answer."

```
VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack with a magnifying glass looking for invisible ants in the soil; question marks float up. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/viking1/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Viking 1 worked for more than six years. Today, Perseverance is still searching for signs of ancient life. What would you test for? Logged!"

```
Seasons pass over the lander; far away, a modern rover keeps searching; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/viking1/shot-6.mp4`

## 11 · Pathfinder and Sojourner: the first Mars rover (1997)

Video id: `pathfinder-sojourner`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Ever done the egg-drop challenge? NASA did it, with a whole spacecraft, on Mars!"

```
1990s video look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack wraps an egg in bubble wrap and drops it; it bounces and survives; she cheers. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pathfinder-sojourner/shot-1.mp4`

### Shot 2 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Mars is covered in rocks, and nobody had ever driven a rover there. How do you land it safely?"

```
A spacecraft streaks toward a red boulder field; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack covers her eyes. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pathfinder-sojourner/shot-2.mp4`

### Shot 3 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Wrap it in giant airbags! On July 4, 1997, Pathfinder hit Mars and bounced at least 15 times. Boing, boing, boing!"

```
A giant ball of white airbags hits the ground and bounces again and again, then rolls to a stop; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack bounces along, dizzy. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pathfinder-sojourner/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): M (small, brave): "Hi! I'm Sojourner, the first rover on another planet. I'm about as big as a microwave oven!"

Start frame: `video-frames/pathfinder-sojourner/4.png` (team's model of the lander opening like a flower; a ramp unrolls; the tiny six-wheeled rover Sojourner rolls down)

```
Begin exactly on the uploaded start frame: team's model of the lander opening like a flower; a ramp unrolls; the tiny six-wheeled rover Sojourner rolls down. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pathfinder-sojourner/shot-4.mp4`

### Shot 5 · [F] start frame

Line in this shot (for timing, not in the prompt): "It was built to work for one week. It kept going for 83 days, checking rocks the team named after cartoon characters!"

Start frame: `video-frames/pathfinder-sojourner/5.png` (a render of the machine)

```
Sojourner sniffs rocks with floating name tags: Barnacle Bill, Yogi, Scooby Doo. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pathfinder-sojourner/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Tiny, but it proved a rover can drive on another planet. The big rovers came after it. What would you name a Mars rock? Logged!"

```
Sunset over the lander and rover; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pathfinder-sojourner/shot-6.mp4`

## 12 · Opportunity: 90 days became almost 15 years (2004–2018)

Video id: `opportunity`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Imagine a toy built to last 90 days... and it's still working when you finish school. Meet Opportunity!"

```
2000s digital look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack holds a toy with a big "90 days" tag; years fly by on a calendar; the toy keeps working. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/opportunity/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "January 2004. It ran on sunlight, and Mars is dusty. Nobody expected it to survive for long."

Start frame: `video-frames/opportunity/2.png` (NASA Opportunity model on a flat tan plain under a dusty sky; dust settles slowly on its solar panels)

```
Begin exactly on the uploaded start frame: NASA Opportunity model on a flat tan plain under a dusty sky; dust settles slowly on its solar panels. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/opportunity/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "Then it found hematite, a mineral that forms in water. Like a dried-up puddle mark: water was here once!"

Start frame: `video-frames/opportunity/3.png` (a render of the machine)

```
Close on its arm studying grey rock; a soft blue ghost of water fades over the plain (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/opportunity/shot-3.mp4`

### Shot 4 · [I] prompt only

Line in this shot (for timing, not in the prompt): "It was meant to drive 1 kilometre. It drove more than 45, longer than a marathon, for almost 15 years!"

```
Its route line stretches across Mars past a marathon finish ribbon; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack runs beside it, panting. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/opportunity/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "In 2018 a dust storm covered the whole planet and hid the Sun. Its last message came on June 10."

```
The sky turns orange, then brown; a dust storm hides the Sun; the rover goes dark; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack puts her hand on it. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/opportunity/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "NASA called it more than a thousand times. Rest well, Oppy, in Perseverance Valley. If you could explore for 15 years, where would you go? Logged!"

```
Gentle dawn light on the rover in its valley; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack salutes slowly and stamps a gold star. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/opportunity/shot-6.mp4`

## 13 · Curiosity: a rover as big as a mountain climb (2012 → today)

Video id: `curiosity`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "How do you gently land a rover the size of a car on Mars? Parachutes alone? Too fast. Airbags? Too heavy."

```
Crisp modern look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack tries to land a toy car with a parachute; it smashes; she winces. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/curiosity/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "NASA's answer: a flying sky crane! It hovered and lowered the rover on cables, like a drone lowering a toy on strings. Touchdown: August 6, 2012."

Start frame: `video-frames/curiosity/2.png` (NASA Curiosity model hanging on cables under a hovering rocket-powered sky crane; it lowers the rover, cuts the cables, flies away)

```
Begin exactly on the uploaded start frame: NASA Curiosity model hanging on cables under a hovering rocket-powered sky crane; it lowers the rover, cuts the cables, flies away. Inset: a drone lowering a toy on strings (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/curiosity/shot-2.mp4`

### Shot 3 · [I] prompt only

Line in this shot (for timing, not in the prompt): "In Gale Crater it found that ancient Mars had water, and places where tiny life could have lived."

```
Gale Crater; a soft blue lake shimmers over the floor, then fades to dry rock (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/curiosity/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "Its laser zaps a rock and reads the light from the spark, like a fingerprint that says what the rock is made of."

Start frame: `video-frames/curiosity/4.png` (a render of the machine)

```
Close on the rover's mast; a tiny spark flashes on a rock; the light splits into colours like a rainbow fingerprint. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/curiosity/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Now it's climbing Mount Sharp, reading the rock layers like pages of a history book. In 2026 it reached 1 kilometre up!"

```
The rover climbs huge layered Mount Sharp; each layer flips like a page of a history book. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/curiosity/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Still exploring, more than 14 years after landing. If you could read one page of Mars' history, what would you ask? Logged!"

```
Sunset on the mountain; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack cheers and stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/curiosity/shot-6.mp4`

## 14 · InSight: listening to Mars (2018–2022)

Video id: `insight`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Can you tell what's inside a watermelon without cutting it? Tap it and listen! InSight did that... with a whole planet."

```
Crisp modern look. At a fruit stall, VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack taps a watermelon and listens. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/insight/shot-1.mp4`

### Shot 2 · [I] prompt only

Line in this shot (for timing, not in the prompt): "We'd seen the outside of Mars for years. But what's deep inside? Nobody could dig that far."

```
Cut-away of Mars: crust, mantle and core shown as question marks. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/insight/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "November 2018. InSight set a super-sensitive listener on the ground, like a doctor's stethoscope on Mars' chest."

Start frame: `video-frames/insight/3.png` (NASA InSight model on a flat plain, round solar panels open; its arm sets a seismometer on the ground and covers it with a dome)

```
Begin exactly on the uploaded start frame: NASA InSight model on a flat plain, round solar panels open; its arm sets a seismometer on the ground and covers it with a dome. Inset: a doctor's stethoscope (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/insight/shot-3.mp4`

### Shot 4 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Then... rumble! Marsquakes! It felt 1,319 of them, and the shaking showed scientists Mars' crust, mantle and core."

```
Ripples travel from the surface down to the core and bounce back; a wiggle line jumps on a screen; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack's eyes go wide. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/insight/shot-4.mp4`

### Shot 5 · [F] start frame

Line in this shot (for timing, not in the prompt): "But dust kept piling onto its solar panels, like sand on a phone screen you can't wipe, and its power slowly ran out."

Start frame: `video-frames/insight/5.png` (a render of the machine)

```
Red dust slowly piles up on the round solar panels; light dims. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/insight/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Its last message came in December 2022. Thank you for listening, InSight. What would you want to hear inside Mars? Logged!"

```
Soft sunset; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack brushes a little dust away, then stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/insight/shot-6.mp4`

## 16 · Ingenuity: the first flight on another planet (2021–2024)

Video id: `ingenuity`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Flying on Mars? The air there is super thin. It's like trying to swim in a pool with almost no water!"

```
Crisp modern look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack flaps paper wings on a Mars dune and doesn't lift off at all; sand puffs; she sighs. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/ingenuity/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "So NASA built a tiny helicopter, about 1.8 kilograms, and tucked it under Perseverance's belly for the trip."

Start frame: `video-frames/ingenuity/2.png` (NASA Ingenuity model tucked under the Perseverance model's belly; it drops gently onto the sand)

```
Begin exactly on the uploaded start frame: NASA Ingenuity model tucked under the Perseverance model's belly; it drops gently onto the sand. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/ingenuity/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "Its trick: huge blades spinning about 40 times every second, much faster than a helicopter on Earth."

Start frame: `video-frames/ingenuity/3.png` (a render of the machine)

```
Close on two rotors spinning in opposite directions, faster and faster, painted motion blur. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/ingenuity/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "April 19, 2021. It flies! The first powered, controlled flight on another planet!"

Start frame: `video-frames/ingenuity/4.png` (a render of the machine)

```
It lifts off, hovers a few metres above the sand and lands; one second of silence, then VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack screams with joy. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/ingenuity/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "The plan was five test flights. It flew 72! It showed that flying robots can explore other worlds."

```
A counter flips from 1 to 72 as the helicopter hops across dunes; a short "plan" mark is left far behind. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/ingenuity/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "In 2024 a blade broke, so it can't fly anymore. Best little flyer ever. If you could fly over Mars, what would you look for? Logged!"

```
Dusk; the helicopter rests on a dune with a damaged blade; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack salutes, then stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/ingenuity/shot-6.mp4`

## 17 · Perseverance and the Three Forks sample depot (2021 → today)

Video id: `perseverance-depot`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Could a rock tell us whether Mars ever had life? Perseverance is collecting exactly those rocks!"

```
Crisp modern look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack holds up an ordinary-looking pebble; it glows with a question mark. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/perseverance-depot/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "February 18, 2021. Its giant parachute hid a secret code in its pattern: DARE MIGHTY THINGS!"

Start frame: `video-frames/perseverance-depot/2.png` (team's model of the orange-and-white parachute opening; its rings glow and turn into three words)

```
Begin exactly on the uploaded start frame: team's model of the orange-and-white parachute opening; its rings glow and turn into three words. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/perseverance-depot/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "It landed in Jezero Crater. Long ago a river flowed in here and dropped mud and sand, a great place to look for signs of ancient life."

Start frame: `video-frames/perseverance-depot/3.png` (a render of the machine)

```
NASA Perseverance model rolling into Jezero Crater; a ghostly river flows in and drops sand where it meets a lake (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/perseverance-depot/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "It drills rock cores and seals them in tubes, two of each, like saving your homework in two places."

Start frame: `video-frames/perseverance-depot/4.png` (a render of the machine)

```
Close on the drill coring a rock; two shiny tubes; inset: homework saved on a laptop and a USB drive (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/perseverance-depot/shot-4.mp4`

### Shot 5 · [F] start frame

Line in this shot (for timing, not in the prompt): "At Three Forks it left 10 tubes on the ground: the first sample depot on another world. A backup, waiting for a ride to Earth."

Start frame: `video-frames/perseverance-depot/5.png` (a render of the machine)

```
The rover drops tubes one by one in a zigzag on flat ground; a map pin marks each. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/perseverance-depot/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "It even made oxygen from Mars' air for future explorers, and it's still driving! What rock would you pick? Logged!"

```
A small cartoon "O₂" bubble pops from the rover (labelled illustration); it climbs the delta; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/perseverance-depot/shot-6.mp4`

## 18 · Pioneer 10: first through the asteroid belt (1972)

Video id: `pioneer10`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Imagine being the first to cross a road nobody has ever crossed, and you can't see the other side. That was Pioneer 10's job."

```
Retro 1970s look, warm film grain. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack stands at the edge of a dark zone full of tumbling rocks, gulping. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pioneer10/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "1972. Between Mars and Jupiter is the asteroid belt. Could a spacecraft get through without being smashed? Nobody knew."

Start frame: `video-frames/pioneer10/2.png` (NASA Pioneer 10 model with its big dish, approaching a painted field of space rocks)

```
Begin exactly on the uploaded start frame: NASA Pioneer 10 model with its big dish, approaching a painted field of space rocks. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pioneer10/shot-2.mp4`

### Shot 3 · [F] start frame

Line in this shot (for timing, not in the prompt): "It made it! The first spacecraft through the asteroid belt!"

Start frame: `video-frames/pioneer10/3.png` (a render of the machine)

```
It weaves between rocks; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack ducks and dodges beside it; then open space. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pioneer10/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "Then, in December 1973, the first close look at Jupiter, the biggest planet of all!"

Start frame: `video-frames/pioneer10/4.png` (a render of the machine)

```
Jupiter fills the frame, painted bands swirling; the probe zips past. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pioneer10/shot-4.mp4`

### Shot 5 · [F] start frame

Line in this shot (for timing, not in the prompt): "It carries a plaque: two people, our solar system and a map to find the Sun. Like a message in a bottle, thrown into space."

Start frame: `video-frames/pioneer10/5.png` (a render of the machine)

```
Our own simple pictogram of the plaque (people drawn clothed, the solar system, a star map) glows line by line; inset: a message in a bottle on a wave (both labelled illustration). Kid-safety: never show the real plaque photo. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pioneer10/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Its last signal came in 2003. Now it's heading toward the red star Aldebaran: about two million years to go. What would you draw on your plaque? Logged!"

```
The probe drifts silently toward a far reddish star; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack waves and stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/pioneer10/shot-6.mp4`

## 19 · Voyager 2: the only visitor to Uranus and Neptune (1977 → today)

Video id: `voyager2`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "If Uranus and Neptune had visitor books, there'd be just one name in each. Voyager 2!"

```
Retro 1970s look. Two far-away blue planets hold open guestbooks; each has only one name written in it. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager2/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "1977. The outer planets are so far away that even reaching one takes years."

Start frame: `video-frames/voyager2/2.png` (NASA Voyager model, white dish and long booms, leaving a painted Earth; the outer planets look tiny and far)

```
Begin exactly on the uploaded start frame: NASA Voyager model, white dish and long booms, leaving a painted Earth; the outer planets look tiny and far. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager2/shot-2.mp4`

### Shot 3 · [I] prompt only

Line in this shot (for timing, not in the prompt): "So it hopped from planet to planet: Jupiter, then Saturn... using each one to swing toward the next."

```
Quick hops: Jupiter, then Saturn's rings; each planet's gravity swings the probe onward like a ball off a bat (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager2/shot-3.mp4`

### Shot 4 · [F] start frame

Line in this shot (for timing, not in the prompt): "Uranus in 1986. Neptune in 1989. Still the only spacecraft ever to visit them!"

Start frame: `video-frames/voyager2/4.png` (a render of the machine)

```
Pale-blue tilted Uranus, then deep-blue Neptune with white clouds; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack presses her helmet to the window. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager2/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Then it kept going, out of the Sun's bubble, into interstellar space, in 2018."

```
A painted glowing bubble around the Sun; the probe pushes through its edge into darker space. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager2/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "It's still sending data home today, almost 50 years after launch. Which planet would you visit first? Logged!"

```
VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack floats beside the probe with a tiny walkie-talkie; stamp. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager2/shot-6.mp4`

## 20 · Voyager 1: farthest from home (1977 → today)

Video id: `voyager1`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "If you could send one song to aliens, what would it be? In 1977, NASA sent a whole golden record!"

```
Retro look. VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack holds a gold record and an old record player, curious. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager1/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "Hello in 55 languages, sounds of Earth and 90 minutes of music, flying away on Voyager 1."

Start frame: `video-frames/voyager1/2.png` (NASA Voyager model; camera pushes to the gold disc; painted icons float out: a waving hand, music notes, a heartbeat)

```
Begin exactly on the uploaded start frame: NASA Voyager model; camera pushes to the gold disc; painted icons float out: a waving hand, music notes, a heartbeat. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager1/shot-2.mp4`

### Shot 3 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "In 1990, from very far away, it turned around and took a photo of home. That tiny dot? That's us. Everyone you know."

Nothing to make: Real NASA "Pale Blue Dot" image; slow push-in; a tiny ring circles the dot. One second of silence.

### Shot 4 · [I] prompt only

Line in this shot (for timing, not in the prompt): "In 2012 it became the first spacecraft in interstellar space. It's the farthest thing people have ever made."

```
The probe crosses the glowing bubble's edge first, alone; a "No. 1" ribbon appears. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager1/shot-4.mp4`

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "On November 18, 2026, it'll be so far that its message, travelling at the speed of light, takes a whole day to reach us. Sent at breakfast, heard at breakfast the next day!"

```
Split screen: VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack eating breakfast on Earth while a beam of light travels; the next morning, breakfast again, and the beam arrives. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager1/shot-5.mp4`

### Shot 6 · [I] prompt only

Line in this shot (for timing, not in the prompt): "And it's still calling home. If you could send one sound from Earth, what would it be? Logged!"

```
VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack waves at a tiny probe in the dark; stamp. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/voyager1/shot-6.mp4`

## 21 · New Horizons: Pluto's heart (2006 → today)

Video id: `new-horizons`

### Shot 1 · [I] prompt only

Line in this shot (for timing, not in the prompt): "For 85 years, Pluto was just a blurry dot. What does it really look like? Let's go find out!"

```
Crisp modern look. A blurry, pixelated little ball on an old screen; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack squints at it. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/new-horizons/shot-1.mp4`

### Shot 2 · [F] start frame

Line in this shot (for timing, not in the prompt): "Pluto is billions of kilometres away. So in 2006 New Horizons left Earth faster than any spacecraft before: fast enough to go from Dhaka to Chattogram in about 15 seconds!"

Start frame: `video-frames/new-horizons/2.png` (NASA New Horizons model, a gold-foil triangle with a big dish, rocketing away from Earth; inset: Dhaka to Chattogram on a map, a streak covering it in seconds (labelled illustration))

```
Begin exactly on the uploaded start frame: NASA New Horizons model, a gold-foil triangle with a big dish, rocketing away from Earth; inset: Dhaka to Chattogram on a map, a streak covering it in seconds (labelled illustration). Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/new-horizons/shot-2.mp4`

### Shot 3 · [I] prompt only

Line in this shot (for timing, not in the prompt): "It even got a push from Jupiter's gravity, cutting the trip from 14 years to under 10."

```
Painted Jupiter swings the probe forward like a slingshot. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/new-horizons/shot-3.mp4`

### Shot 4 · [P] real NASA photo

Line in this shot (for timing, not in the prompt): "July 14, 2015. Pluto at last... and it has a giant heart!"

Nothing to make: Real NASA image of Pluto with its bright heart-shaped region; one beat of silence; VIMO's eyes become hearts.

### Shot 5 · [I] prompt only

Line in this shot (for timing, not in the prompt): "Half of the heart is a glacier of frozen nitrogen, with mountains of ice. Tiny, cold Pluto is still changing!"

```
Painted zoom into the heart's left half: smooth glacier of frozen nitrogen, ice mountains around it. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/new-horizons/shot-5.mp4`

### Shot 6 · [F] start frame

Line in this shot (for timing, not in the prompt): "In 2019 it flew past Arrokoth, the farthest world ever explored up close, and it's still flying. If you discovered a new world, what would you name it? Logged!"

Start frame: `video-frames/new-horizons/6.png` (a render of the machine)

```
The probe passes a two-lobed reddish snowman-shaped rock, Arrokoth, then heads into the dark; VIMO, a small round friendly astronaut mascot with a big clear glass helmet, white suit with one orange stripe and a small jetpack stamps. Style: hand-painted stylized 3D animation, painterly brush-stroke textures, soft cinematic light, rich night palette of deep blue and violet with glowing accents, gentle bloom, high-quality children's animated film, 16:9, smooth slow camera. Keep any spacecraft exactly as in the start frame: same shape, parts and proportions. No text, no letters, no logos, no real people's faces. Moon skies are black with no haze; Mars skies are butterscotch. Astronauts have gold visors down and no faces. No speech, no narration, no music.
```

Save as: `public/assets/video/new-horizons/shot-6.mp4`
