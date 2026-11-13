# Astro Legacy — AI background image prompts

Backgrounds only. The real NASA photos and NASA 3D models sit on top of these backgrounds, so the prompts ask for **no spacecraft, no people and no text**. AI-drawn hardware would be wrong in the details, and keeping the real NASA hardware separate keeps NASA data at the centre (Relevance + NASA data usage points).

## How to use

1. Copy one scene prompt, then add the **Style block** to the end.
2. Add the **Negative prompt** if your tool has a field for it (Midjourney: put it after `--no`).
3. Make each image twice: **16:9** (1920×1080, desktop) and **9:16** (1080×1920, phone). Or make a wide one with the horizon in the middle and crop it.
4. Check each image against a real NASA photo of the same place. Redo it if the AI adds rovers, astronauts, blue sky on the Moon, or water.
5. In the app, label these pictures "Illustration". Only the NASA photos are called photos.
6. Write the tool name and these prompts in the **Use of AI** field of the submission.
7. Hackathon rule: saving prompts now is planning. Make the final images during the hackathon (13–14 Nov), or ask your Local Lead before using images made earlier.

## Style block (add to every prompt)

```
Style: bright, friendly painted digital illustration for a children's science story app (ages 8–15), soft gradients, rich but natural colours, cinematic wide landscape, scientifically accurate geology and lighting. Composition: low horizon, open empty ground in the lower middle where a spacecraft photo will be placed later, a calm uncluttered area on the left third for text. No text, no letters, no logos, no people, no spacecraft, no vehicles, no flags.
```

## Negative prompt

```
text, watermark, signature, logo, letters, numbers, people, astronaut, face, spacecraft, rover, lander, helicopter, rocket, satellite, flag, alien, creature, city, plants, trees, water, ocean, blue sky on the Moon, clouds on the Moon, haze on the Moon, rings around Mars, two suns, giant Earth, cartoon eyes, blurry, low detail
```

Midjourney ending: `--ar 16:9 --style raw --no text, people, spacecraft, rover, astronaut, flag`

---

## Opening

**00 · Solar system (splash screen)**
```
A wide view of our solar system from slightly above: the Sun glowing warm on the far left, the eight planets small and in the right order along faint orbit lines, the small grey Moon beside the blue Earth, red Mars clearly visible, a thin belt of asteroids, deep navy-to-violet starry background with a soft Milky Way band. Calm and full of wonder; the centre is kept dark and open for a title.
```

**01 · Prologue: a blackout night in Dhaka**
```
A flat rooftop in Dhaka, Bangladesh, at night during a power cut: the city below is dark with only a few candle-lit windows, a water tank and potted plants on the roof, and above it the sky is suddenly full of stars and the Milky Way. A bright half Moon and a small reddish dot (Mars) shine in the sky. Warm candle glow at the bottom, cool starlight above. Nobody is on the roof.
```
(Draw Nadia separately and place her on top, so she looks the same in every scene.)

## Chapter 1 · Moon

**02 · Sea of Tranquility (Apollo 11 site)**
```
Mare Tranquillitatis on the Moon: a flat dark-grey basalt plain with fine dusty soil, small craters and scattered rocks, low morning sunlight from one side casting long, sharp black shadows, gentle hills on the far horizon. Pitch-black sky with no stars visible, and the blue-and-white Earth hanging high in the sky, mostly lit. Strong contrast, no air, no haze.
```

**03 · Ocean of Storms crater (Surveyor 3 + Apollo 12 site)**
```
A shallow rounded crater about 200 metres wide in Oceanus Procellarum on the Moon, with gently sloping grey dusty walls and a few rocks on the rim, low-angle morning sunlight, long shadows, a black sky with a small Earth near the top. The crater floor in the middle of the picture is empty and clear.
```

**04 · Hadley–Apennine (Apollo 15 site, first Moon rover)**
```
The Hadley–Apennine region of the Moon: tall, smooth, rounded grey mountains rising behind a wide grey plain, the long winding canyon of Hadley Rille cutting across the middle ground, low sunlight, warm grey tones, a black sky with the small blue Earth high above the mountains.
```

**05 · Moon from orbit (Lunar Reconnaissance Orbiter)**
```
View from about 50 kilometres above the Moon: the cratered grey surface curving away below, the sunlit edge of the Moon against black space, the blue Earth rising over the lunar horizon, a few faint stars. Open empty space in the upper middle.
```

## Chapter 2 · Mars

**06 · Chryse Planitia (Viking 1 site)**
```
Chryse Planitia on Mars: a gently rolling rust-red plain covered with many dark angular rocks of different sizes and small wind-blown sand drifts, a soft butterscotch-pink sky with fine dust haze, afternoon light, a flat horizon.
```

**07 · Ares Vallis (Pathfinder + Sojourner site)**
```
Ares Vallis on Mars, an ancient flood plain: reddish ground scattered with rounded and angular boulders left by a huge ancient flood, two small rounded hills on the far horizon, a pale butterscotch sky, bright midday light.
```

**08 · Meridiani and Endeavour crater (Opportunity)**
```
Meridiani Planum on Mars: flat reddish-tan sand covered with many tiny round grey pebbles, low sand ripples, and the worn rim of a huge crater on the horizon with a shallow valley sloping down its inner side, a dusty tan sky, warm late-afternoon sun.
```

**09 · Gale crater and Mount Sharp (Curiosity)**
```
Inside Gale crater on Mars: layered rock slopes and flat-topped hills in tan, ochre and purple-grey, dark basalt sand dunes, and the huge layered Mount Sharp rising in the background, a hazy butterscotch sky, a clear open sandy foreground.
```

**10 · Elysium Planitia (InSight)**
```
Elysium Planitia on Mars: an extremely flat, smooth reddish plain with very few rocks and fine dust, a wide empty horizon, a pale pinkish-tan sky, quiet and peaceful.
```

**11 · Jezero crater river delta (Perseverance + sample tubes)**
```
Jezero crater on Mars: an ancient dried-up river delta with layered, fan-shaped cliffs of pale rock, scattered boulders, reddish-brown ground, the crater rim on the far horizon, light dust haze, a butterscotch sky.
```

**12 · Blue sunset on Mars (chapter ending)**
```
A sunset seen from the surface of Mars: a small pale Sun near the horizon surrounded by a cool blue glow, the rest of the sky fading from blue-grey to dusky butterscotch, dark silhouettes of low hills, a darkening rust-red plain. (Real Martian sunsets look blue.)
```

## Chapter 3 · Wings over Mars

**13 · Jezero from the air (Ingenuity)**
```
A low aerial view of the Jezero crater floor on Mars from about 10 to 20 metres up: rippled reddish sand, dark rocks, small craters, soft shadows, and a dusty horizon at the top of the picture, giving a gentle feeling of height and flight. Only the ground is shown, with nothing flying in the picture.
```

## Chapter 4 · Still traveling

**14 · Jupiter (Pioneer 10)**
```
Jupiter seen up close from space: a giant striped planet with orange, cream and brown cloud bands and the Great Red Spot, three or four of its moons as tiny dots, black space with stars. Jupiter fills the right half; the left half is dark and open.
```

**15 · Neptune (Voyager 2)**
```
Neptune in deep space: a deep-blue planet with a few bright white high clouds and a dark storm spot, thin faint rings, its moon Triton small and pinkish, very dark space, the Sun just a bright star far away.
```

**16 · Pluto (New Horizons)**
```
Pluto seen from space: a pale beige and reddish-brown world with a large bright heart-shaped plain of ice, thin blue haze layers around its edge, its large moon Charon in the distance, a black sky with stars.
```

**17 · Interstellar space (Voyager 1)**
```
Deep interstellar space looking back toward the Sun: the Sun is just one bright star among thousands, a faint glowing curved boundary in soft purple and blue marks the edge of the Sun's bubble (the heliopause), the Milky Way stretches across the sky, a feeling of huge distance and quiet; the centre is mostly empty.
```

## Chapter 5 · Not forgotten

**18 · Earth from the Moon (ending)**
```
Earth seen from the surface of the Moon: the blue-and-white Earth shining in a black sky above a soft grey horizon, gentle sunlight on the lunar dust, a calm and hopeful mood, open sky for a final message.
```
