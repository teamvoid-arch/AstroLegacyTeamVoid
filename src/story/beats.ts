import type { Beat } from '../data/types.ts';

// Main path, beat by beat, from "Story Script (all lines).md".
// Spoken text is copied from the script; only the order of lines inside a beat
// follows the script's KID ASKS → VIMO answer convention.

export const beats: Beat[] = [
  // ═════════════════════════ PART 1 — EARTH ═════════════════════════
  {
    id: '1.1-b1', part: 1, scene: '1.1', title: 'Hello from Earth', year: 2026, era: 'today', stage: 'rooftop',
    fx: ['crash-land'], face: 'cheeky', gesture: 'crash', screen: 'bottom', size: 'M', music: 'M1', sfx: ['whoosh', 'thump'],
    lines: [{ who: 'vimo', text: "Oops! Soft landing... mostly. Hi! I'm VIMO. I'm an astronaut, and I look after some very special friends. They live far, far away." }],
    choice: {
      ask: 'Do you like space?',
      answers: [
        { label: 'Yes!', reply: 'Best answer ever!', face: 'excited' },
        { label: 'A little', reply: "By the end, you'll LOVE it.", face: 'cheeky' },
        { label: 'Not sure', reply: "That's okay, I'll show you something amazing.", face: 'gentle' },
      ],
    },
  },
  {
    id: '1.1-b2', part: 1, scene: '1.1', title: 'Who lives up there?', year: 2026, era: 'today', stage: 'rooftop',
    fx: ['moon-dots'], face: 'curious', gesture: 'point', screen: 'centre', size: 'L', music: 'M1',
    lines: [
      { who: 'kid', text: 'Wait, VIMO, who lives up there?' },
      { who: 'vimo', text: 'Machines! Cameras, landers, rovers, even a helicopter. NASA sent them to the Moon and Mars to explore. When their work was done, they stayed there.' },
    ],
  },
  {
    id: '1.1-b3', part: 1, scene: '1.1', title: 'Not junk', year: 2026, era: 'today', stage: 'rooftop',
    fx: ['moon-dots'], face: 'gentle', gesture: 'logbook', screen: 'centre', size: 'XL', music: 'M1', sfx: ['page'],
    lines: [{ who: 'vimo', text: "Some people call them space junk. I don't. Each one has a story: where it went, what it did, and what it taught us. Tonight, you and I will visit them. Ready?" }],
    tryIt: 'ready',
  },
  {
    id: '1.2-b4', part: 1, scene: '1.2', title: 'Why is space hard?', year: 2026, era: 'today', stage: 'earth',
    fx: ['rise', 'atmo'], face: 'thinking', gesture: 'point', screen: 'right', size: 'M', music: 'M1', sfx: ['whoosh'],
    lines: [{ who: 'vimo', text: "See that thin blue line? That's our air. Above it is space: no air to breathe, no sound, and it's freezing in the shade and boiling in the sunlight." }],
  },
  {
    id: '1.2-b5', part: 1, scene: '1.2', title: 'Gravity', year: 2026, era: 'today', stage: 'earth',
    fx: ['gravity'], face: 'cheeky', gesture: 'hop', screen: 'right', size: 'M', music: 'M1', sfx: ['boing'],
    lines: [
      { who: 'kid', text: "Why can't we just fly up there?" },
      { who: 'vimo', text: "Earth pulls everything down. That's gravity. To escape it, a rocket must go about 40,000 kilometres per hour. That's 30 times faster than a jet plane!" },
    ],
  },
  {
    id: '1.2-b6', part: 1, scene: '1.2', title: 'How far is the Moon?', year: 2026, era: 'today', stage: 'scale',
    fx: ['tape'], face: 'amazed', gesture: 'hop', screen: 'bottom-left', size: 'S', music: 'M2',
    lines: [{ who: 'vimo', text: "If Earth were a basketball, the Moon would be a tennis ball about seven metres away. In real life that's about 384,000 kilometres. In a car, it would take you more than 5 months, with no stops!" }],
    tryIt: 'travel',
  },
  {
    id: '1.3-b7', part: 1, scene: '1.3', title: 'Lift-off!', year: 2026, era: 'today', stage: 'launch',
    fx: ['liftoff'], face: 'brave', gesture: 'wave', screen: 'left', size: 'M', music: 'M2', sfx: ['countdown', 'rumble'],
    lines: [{ who: 'vimo', text: 'Hold on tight! Three... two... one... lift-off! Our first stop is 1964, when NASA was still learning how to even reach the Moon.' }],
  },
  {
    id: '1.3-b8', part: 1, scene: '1.3', title: 'Back in time', year: 1964, era: '1960s', stage: 'transfer',
    fx: ['arc', 'year-back'], face: 'cheeky', gesture: 'logbook', screen: 'left', size: 'M', music: 'M3',
    lines: [{ who: 'vimo', text: "Fun fact: in space there's no up or down, so I can read upside down. Look, the year counter! We're going back in time to 1964. That's before your grandparents were teenagers, maybe!" }],
    breakAfter: true,
  },

  // ═════════════════════════ PART 2 — THE MOON ═════════════════════════
  {
    id: '2.1-b1', part: 2, scene: '2.1', title: 'The camera that fell', year: 1964, era: '1960s', stage: 'moon',
    prop: 'ranger7', fx: ['fall'], label: 'Sea of Clouds area, the Moon', machine: 'ranger7',
    face: 'nervous', gesture: 'idle', screen: 'right', size: 'M', music: 'M3', sfx: ['whoosh'],
    lines: [
      { who: 'vimo', text: 'Meet Ranger 7! In 1964, nobody had ever seen the Moon up close. So NASA sent a camera... and let it crash.' },
      { who: 'kid', text: 'Crash? On purpose?!' },
    ],
    choice: {
      ask: 'Would you crash a camera on purpose?',
      answers: [
        { label: 'Yes', reply: 'Brave scientist!', face: 'proud' },
        { label: 'No way', reply: 'Me neither... but it worked!', face: 'cheeky' },
      ],
    },
  },
  {
    id: '2.1-b2', part: 2, scene: '2.1', title: '4,000 photos', year: 1964, era: '1960s', stage: 'moon',
    prop: 'ranger7', fx: ['fall', 'photos'], machine: 'ranger7',
    face: 'amazed', gesture: 'cheer', screen: 'left', size: 'M', music: 'M3', sfx: ['radio', 'shutter'],
    lines: [
      { who: 'machine', machine: 'ranger7', era: '60s', text: "Click! Click! Click! I took pictures all the way down. I didn't need to land. I just needed to look!" },
      { who: 'vimo', text: 'In its last 17 minutes, Ranger 7 sent more than 4,000 photos. They were the closest pictures of the Moon anyone had ever seen.' },
    ],
    tryIt: 'ranger-fall',
  },
  {
    id: '2.1-b3', part: 2, scene: '2.1', title: 'The Sea that has become known', year: 1964, era: '1960s', stage: 'moon-orbit',
    fx: ['site-glow'], label: 'Mare Cognitum, "the Sea that has become known"', machine: 'ranger7', stamp: true,
    face: 'proud', gesture: 'salute', screen: 'centre', size: 'L', music: 'M3', sfx: ['stamp'],
    lines: [{ who: 'vimo', text: 'Scientists even gave the place a new name: the Sea that has Become Known. Ranger 7 is still there, in pieces, right where it learned the Moon’s first secrets. Thank you, Ranger 7!' }],
  },
  {
    id: '2.2-b4', part: 2, scene: '2.2', title: 'Would it sink?', year: 1966, era: '1960s', stage: 'moon',
    fx: ['dust-flour'], face: 'curious', gesture: 'idle', screen: 'centre', size: 'M', music: 'M3',
    lines: [{ who: 'vimo', text: 'Some scientists worried the Moon was covered in deep dust. Like soft flour. Would a spacecraft sink? Would an astronaut sink? Someone had to test it.' }],
  },
  {
    id: '2.2-b5', part: 2, scene: '2.2', title: 'The first soft step', year: 1966, era: '1960s', stage: 'moon',
    prop: 'surveyor1', fx: ['land'], label: 'Ocean of Storms, 2 June 1966', machine: 'surveyor1',
    face: 'proud', gesture: 'cover-eyes', screen: 'left', size: 'M', music: 'M3', sfx: ['thruster', 'thump', 'radio'],
    lines: [
      { who: 'machine', machine: 'surveyor1', era: '60s', text: 'Touchdown! And look: my feet are on top of the dust, not under it. The ground is strong!' },
      { who: 'vimo', text: "Surveyor 1 was America's first soft landing on the Moon. It sent more than 11,000 photos. Now NASA knew: people could land here too." },
    ],
  },
  {
    id: '2.2-b6', part: 2, scene: '2.2', title: 'Land it softly', year: 1966, era: '1960s', stage: 'moon',
    prop: 'surveyor1', machine: 'surveyor1', stamp: true, highFive: true,
    face: 'happy', gesture: 'cheer', screen: 'left', size: 'M', music: 'M3', sfx: ['stamp'],
    lines: [{ who: 'vimo', text: 'Thank you, Surveyor 1. You took the Moon’s first safe step, so astronauts could take the next one.' }],
    tryIt: 'soft-land', hub: 'hub-scouts',
  },
  {
    id: '2.3-b7', part: 2, scene: '2.3', title: 'The robot who waited', year: 1967, era: '1970s', stage: 'moon',
    prop: 'surveyor3', fx: ['crater', 'days'], label: 'Ocean of Storms, 1967', machine: 'surveyor3',
    face: 'sad', gesture: 'sit', screen: 'left', size: 'M', music: 'M3', sfx: ['beep'],
    lines: [
      { who: 'vimo', text: 'This is Surveyor 3. It landed in 1967, dug the Moon’s soil with a little scoop, and sent photos home. Then it went quiet. Alone. For two and a half years.' },
      { who: 'machine', machine: 'surveyor3', era: '60s', text: '...beep... is anyone... coming?' },
    ],
  },
  {
    id: '2.3-b8', part: 2, scene: '2.3', title: 'The visit', year: 1969, era: '1970s', stage: 'moon',
    prop: 'surveyor3', fx: ['crater', 'astronauts'], label: 'November 1969', machine: 'surveyor3',
    face: 'surprised', gesture: 'cheer', screen: 'left', size: 'M', music: 'M4', sfx: ['footsteps'],
    lines: [
      { who: 'vimo', text: 'Then, in November 1969, Apollo 12 landed close by. Two astronauts walked over to say hello!' },
      { who: 'machine', machine: 'surveyor3', era: '60s', text: 'Visitors! I knew someone would come back.' },
    ],
  },
  {
    id: '2.3-b9', part: 2, scene: '2.3', title: 'Bringing pieces home', year: 1969, era: '1970s', stage: 'moon',
    prop: 'surveyor3', fx: ['crater', 'no-camera'], machine: 'surveyor3', stamp: true,
    face: 'thinking', gesture: 'point', screen: 'right', size: 'M', music: 'M4', sfx: ['stamp'],
    lines: [
      { who: 'kid', text: 'Why did they take its camera?' },
      { who: 'vimo', text: 'To see what two and a half years on the Moon does to metal, glass and paint. Its parts came home for scientists to study. Surveyor 3 helped us twice!' },
    ],
    tryIt: 'missing-camera',
  },
  {
    id: '2.3-b9b', part: 2, scene: '2.3', title: 'Intrepid, the lander next door', year: 1969, era: '1970s', stage: 'moon',
    prop: 'apollo12-intrepid', fx: ['alsep'], machine: 'apollo12-intrepid', stamp: true,
    face: 'surprised', gesture: 'listen', screen: 'bottom', size: 'S', music: 'M4', sfx: ['bell'],
    lines: [
      { who: 'machine', machine: 'apollo12-intrepid', era: '60s', text: 'I landed so precisely that the astronauts could walk to an old robot parked nearby.' },
      { who: 'vimo', text: "Apollo 12 also left the first full science station. When its top part was crashed into the Moon later, the Moon 'rang' like a bell for about an hour!" },
    ],
    tryIt: 'ring-moon', hub: 'hub-snoopy',
  },
  {
    id: '2.4-b10', part: 2, scene: '2.4', title: "The Eagle's bottom half", year: 1969, era: '1970s', stage: 'moon',
    prop: 'apollo11-eagle', fx: ['earth-sky', 'orbit-cam'], label: 'Sea of Tranquility, 20 July 1969', machine: 'apollo11-eagle',
    face: 'amazed', gesture: 'idle', screen: 'left', size: 'M', music: 'M4',
    lines: [{ who: 'vimo', text: 'This is it. July 1969. The first time people walked on another world. And this is their ship, the Eagle.' }],
    choice: {
      ask: 'Would you climb down that ladder?',
      answers: [
        { label: 'Yes', reply: 'Me too! First step, here we come!', face: 'excited' },
        { label: 'Scary', reply: "It's okay to be scared and do it anyway.", face: 'gentle' },
      ],
    },
  },
  {
    id: '2.4-b11', part: 2, scene: '2.4', title: 'Half of it stayed', year: 1969, era: '1970s', stage: 'moon',
    prop: 'apollo11-eagle', fx: ['earth-sky', 'ascent'], machine: 'apollo11-eagle',
    face: 'surprised', gesture: 'wave', screen: 'right', size: 'M', music: 'M4', sfx: ['thruster'],
    lines: [
      { who: 'kid', text: 'Hey, half of it stayed behind!' },
      { who: 'vimo', text: "That's the plan! The bottom half was the launch pad. The astronauts flew home in the top half. The bottom half is still standing there today." },
    ],
  },
  {
    id: '2.4-b12', part: 2, scene: '2.4', title: 'The plaque', year: 1969, era: '1970s', stage: 'moon',
    prop: 'apollo11-eagle', fx: ['earth-sky', 'plaque', 'footprints'], machine: 'apollo11-eagle', stamp: true,
    face: 'gentle', gesture: 'point', screen: 'left', size: 'L', music: 'M4', sfx: ['stamp'],
    lines: [
      { who: 'machine', machine: 'apollo11-eagle', era: '70s', text: "My plaque says: 'We came in peace for all mankind.' I've been holding that message for more than 55 years." },
      { who: 'vimo', text: "Footprints, tools and the Eagle's bottom half are all still there. There's no wind on the Moon, so footprints can last a very long time." },
    ],
    tryIt: 'find-ladder',
  },
  {
    id: '2.5-b13', part: 2, scene: '2.5', title: 'The mirror that still answers', year: 1969, era: '1970s', stage: 'moon',
    prop: 'apollo11-mirror', fx: ['earth-sky'], machine: 'apollo11-mirror',
    face: 'cheeky', gesture: 'point', screen: 'bottom-right', size: 'M', music: 'M4',
    lines: [{ who: 'vimo', text: 'Most of the machines we visit tonight are finished. But this little box is still working. Right now. Watch!' }],
  },
  {
    id: '2.5-b14', part: 2, scene: '2.5', title: 'Ping!', year: 2026, era: 'today', stage: 'moon',
    prop: 'apollo11-mirror', fx: ['earth-sky', 'laser'], machine: 'apollo11-mirror', stamp: true,
    face: 'excited', gesture: 'point', screen: 'right', size: 'M', music: 'M4', sfx: ['laser', 'stamp'],
    lines: [
      { who: 'machine', machine: 'apollo11-mirror', era: 'today', text: 'Ping! Ping! Every beam you send, I send back. Same way, every time!' },
      { who: 'vimo', text: "Scientists measure how long the light takes. That's how we know the Moon is moving away from Earth, about 3.8 centimetres every year. That's how fast your fingernails grow!" },
    ],
    tryIt: 'laser',
  },
  {
    id: '2.6-b15', part: 2, scene: '2.6', title: 'A car on the Moon', year: 1971, era: '1970s', stage: 'moon',
    prop: 'apollo15-rover', fx: ['mountains', 'unfold'], label: 'Hadley Rille, 1971', machine: 'apollo15-rover',
    face: 'excited', gesture: 'hop', screen: 'bottom', size: 'M', music: 'M5', sfx: ['boing'],
    lines: [{ who: 'vimo', text: 'Boing... boing... On the Moon you weigh about one sixth of your weight on Earth. And in 1971, astronauts brought a car! It came folded up, like a paper toy.' }],
    choice: {
      ask: 'Want to drive the Moon car?',
      answers: [
        { label: 'Yes', reply: 'Hold on tight!', face: 'excited' },
        { label: "I'll ride", reply: "Okay, I'll drive. Don't tell anyone how I drive.", face: 'cheeky' },
      ],
    },
  },
  {
    id: '2.6-b16', part: 2, scene: '2.6', title: 'Mesh wheels', year: 1971, era: '1970s', stage: 'moon',
    prop: 'apollo15-rover', fx: ['mountains', 'drive'], machine: 'apollo15-rover',
    face: 'excited', gesture: 'sit', screen: 'centre', size: 'M', music: 'M5', sfx: ['wheels'],
    lines: [
      { who: 'machine', machine: 'apollo15-rover', era: '70s', text: 'Battery power, wire-mesh wheels and no road at all. I drove the astronauts about 28 kilometres. Not bad for a car that fits in a suitcase... a big suitcase.' },
      { who: 'kid', text: 'Why mesh wheels and not rubber tyres?' },
      { who: 'vimo', text: "Rubber can crack in the Moon's huge cold and heat, and air tyres can pop. Metal mesh wheels can't go flat." },
    ],
  },
  {
    id: '2.6-b17', part: 2, scene: '2.6', title: 'Parking the rover', year: 1971, era: '1970s', stage: 'moon',
    prop: 'apollo15-rover', fx: ['mountains'], machine: 'apollo15-rover', stamp: true,
    face: 'gentle', gesture: 'wave', screen: 'right', size: 'M', music: 'M5', sfx: ['stamp'],
    lines: [{ who: 'vimo', text: "The rover is still parked there, waiting. But Apollo isn't finished yet. More astronauts are coming!" }],
    tryIt: 'moon-jump', hub: 'hub-apollo',
  },
  {
    id: '2.7-b18', part: 2, scene: '2.7', title: 'Duct tape', year: 1972, era: '1970s', stage: 'moon',
    prop: 'apollo17-challenger', fx: ['mountains', 'tape'], machine: 'apollo17-challenger',
    face: 'cheeky', gesture: 'thumbs', screen: 'right', size: 'M', music: 'M5', sfx: ['tape'],
    lines: [
      { who: 'machine', machine: 'apollo17-challenger', era: '70s', text: 'When my fender broke, the astronauts fixed it with duct tape and maps. Good as new!' },
      { who: 'vimo', text: 'Even on the Moon, sometimes the best tool is tape!' },
    ],
  },
  {
    id: '2.7-b19', part: 2, scene: '2.7', title: 'The last footsteps', year: 1972, era: '1970s', stage: 'moon',
    prop: 'apollo17-challenger', fx: ['mountains', 'ascent', 'year-roll'], machine: 'apollo17-challenger', stamp: true,
    face: 'sad', gesture: 'idle', screen: 'bottom', size: 'S', music: 'M6', sfx: ['thruster', 'stamp'],
    lines: [
      { who: 'vimo', text: 'In December 1972, the last astronauts left the Moon. Nobody has walked here since. Not yet.' },
      { who: 'kid', text: 'Not yet? Will people go back?' },
      { who: 'vimo', text: "NASA is planning to! But first, let's see the robots that went back in the meantime." },
    ],
    hub: 'hub-robots',
  },
  {
    id: '2.8-b20', part: 2, scene: '2.8', title: "The Moon's photographer", year: 2009, era: 'today', stage: 'moon-orbit',
    prop: 'lro', fx: ['lro-orbit'], machine: 'lro', stamp: true,
    face: 'amazed', gesture: 'point', screen: 'left', size: 'L', music: 'M6', sfx: ['shutter', 'radio', 'stamp'],
    lines: [
      { who: 'machine', machine: 'lro', era: 'today', text: "I'm the Moon's photographer. From orbit I can still see the Apollo landers, rover tracks and even footpaths." },
      { who: 'vimo', text: "So it's true. They're all still there, right where they finished their work. LRO is still working today." },
    ],
    tryIt: 'find-leftovers',
  },
  {
    id: '2.8-b21', part: 2, scene: '2.8', title: 'Goodbye, Moon', year: 2026, era: 'today', stage: 'moon-orbit',
    fx: ['pins'], face: 'brave', gesture: 'wave', screen: 'right', size: 'M', music: 'M10',
    lines: [{ who: 'vimo', text: "So many friends on the Moon! Now hold on. Our next trip is much, much longer. Let's jump back to 1971... next stop: Mars!" }],
    breakAfter: true,
  },

  // ═════════════════════════ PART 3 — MARS ═════════════════════════
  {
    id: '3.1-b1', part: 3, scene: '3.1', title: 'How far is Mars?', year: 2021, era: 'space', stage: 'solar',
    fx: ['transfer-arc'], face: 'brave', gesture: 'point', screen: 'right', size: 'M', music: 'M7',
    lines: [
      { who: 'vimo', text: "The Moon took three days. Mars takes about seven months! And we can't fly straight at it. Mars keeps moving, so we aim for where it will be." },
      { who: 'kid', text: "Like throwing a ball to a friend who's running?" },
      { who: 'vimo', text: 'Exactly like that!' },
    ],
    choice: {
      ask: 'Seven months to Mars. What would you pack?',
      answers: [
        { label: 'Snacks', reply: 'Space snacks! Good thinking.', face: 'excited' },
        { label: 'Games', reply: "We'll play I-spy with stars.", face: 'cheeky' },
        { label: 'Teddy', reply: 'Me too. Shh.', face: 'gentle' },
      ],
    },
  },
  {
    id: '3.1-b2', part: 3, scene: '3.1', title: 'The message delay', year: 2021, era: 'space', stage: 'solar',
    fx: ['message'], face: 'sleepy', gesture: 'sleepy', screen: 'left', size: 'M', music: 'M7', sfx: ['blip'],
    lines: [{ who: 'vimo', text: 'A radio message to Mars takes up to 20 minutes! So nobody can drive a Mars robot with a joystick. The robots have to be smart and careful on their own.' }],
    tryIt: 'mars-message',
  },
  {
    id: '3.1-b3', part: 3, scene: '3.1', title: 'Hello, Mars', year: 1976, era: '1970s', stage: 'mars-orbit',
    fx: ['approach'], face: 'amazed', gesture: 'idle', screen: 'centre', size: 'XL', music: 'M8',
    lines: [{ who: 'vimo', text: "Mars is red because its dust has rust in it, like an old iron gate. It's colder than any freezer, and its air is so thin you couldn't breathe even for a second." }],
    hub: 'hub-mariner',
  },
  {
    id: '3.2-b4', part: 3, scene: '3.2', title: 'Landing day', year: 1976, era: '1970s', stage: 'mars',
    prop: 'viking1', fx: ['parachute-land'], label: 'Chryse Planitia, 20 July 1976', machine: 'viking1',
    face: 'excited', gesture: 'cheer', screen: 'left', size: 'M', music: 'M8', sfx: ['pop', 'thruster'],
    lines: [{ who: 'vimo', text: "July 20th, 1976: exactly seven years after Apollo 11 landed on the Moon, Viking 1 landed safely on Mars. NASA's first!" }],
  },
  {
    id: '3.2-b5', part: 3, scene: '3.2', title: 'The first picture', year: 1976, era: '1970s', stage: 'mars',
    prop: 'viking1', fx: ['photo-lines'], machine: 'viking1',
    face: 'cheeky', gesture: 'shrug', screen: 'left', size: 'L', music: 'M8', sfx: ['radio', 'scan'],
    lines: [
      { who: 'machine', machine: 'viking1', era: '70s', text: "The first thing I photographed on Mars? My own foot. I wanted to check I'd landed on something solid!" },
      { who: 'vimo', text: 'Viking 1 sent the first pictures ever taken on the surface of Mars. It also tested the soil, looking for tiny signs of life.' },
      { who: 'kid', text: 'Did it find aliens?' },
      { who: 'vimo', text: "No aliens! Scientists still talk about what its soil tests meant. That's okay. In science, 'we're not sure yet' is an honest answer." },
    ],
  },
  {
    id: '3.2-b6', part: 3, scene: '3.2', title: 'Thank you, Viking', year: 1982, era: '1970s', stage: 'mars',
    prop: 'viking1', machine: 'viking1', stamp: true,
    face: 'proud', gesture: 'salute', screen: 'right', size: 'M', music: 'M8', sfx: ['stamp'],
    lines: [{ who: 'vimo', text: 'Viking 1 kept working for more than six years. It went quiet in 1982 and is still sitting on that plain. Thank you, Viking!' }],
    hub: 'hub-viking2',
  },
  {
    id: '3.2b-b6b', part: 3, scene: '3.2b', title: 'Bounce, bounce, bounce', year: 1997, era: '1990s', stage: 'mars',
    prop: 'sojourner', fx: ['airbags'], label: 'Ares Vallis, Mars, 4 July 1997', machine: 'sojourner',
    face: 'excited', gesture: 'hop', screen: 'right', size: 'M', music: 'M8', sfx: ['bounce'],
    lines: [{ who: 'vimo', text: 'After Viking, Mars waited 21 years. Then, on the 4th of July 1997, a new lander arrived. Boing! Boing! Boing! It landed in a ball of airbags!' }],
  },
  {
    id: '3.2b-b6c', part: 3, scene: '3.2b', title: 'The tiny rover', year: 1997, era: '1990s', stage: 'mars',
    prop: 'sojourner', fx: ['rover-roll'], machine: 'sojourner', stamp: true,
    face: 'gentle', gesture: 'sit', screen: 'bottom-left', size: 'S', music: 'M8', sfx: ['servo', 'radio', 'stamp'],
    lines: [
      { who: 'machine', machine: 'sojourner', era: '90s', text: "I'm the first rover on Mars, as small as a microwave oven. I never went more than a few metres from my lander, but I was the first!" },
      { who: 'vimo', text: 'Sojourner was the first wheeled robot on another planet. Every Mars rover after it, even the giant ones, came from this little explorer.' },
    ],
    tryIt: 'drive-sojourner', hub: 'hub-orbiters',
  },
  {
    id: '3.3-b7', part: 3, scene: '3.3', title: 'A hole in one', year: 2004, era: '2000s', stage: 'mars',
    prop: 'opportunity', fx: ['airbags'], label: 'Meridiani Planum, January 2004', machine: 'opportunity',
    face: 'cheeky', gesture: 'dizzy', screen: 'right', size: 'M', music: 'M8', sfx: ['bounce'],
    lines: [{ who: 'vimo', text: 'Opportunity landed in a giant ball of airbags, bounced, and rolled straight into a little crater. A hole in one!' }],
  },
  {
    id: '3.3-b8', part: 3, scene: '3.3', title: '90 days became 14 years', year: 2018, era: '2000s', stage: 'mars',
    prop: 'opportunity', fx: ['calendar', 'drive'], machine: 'opportunity',
    face: 'amazed', gesture: 'count', screen: 'right', size: 'M', music: 'M8', sfx: ['page', 'radio'],
    lines: [
      { who: 'machine', machine: 'opportunity', era: '90s', text: "They told me I'd work for 90 days. I just... kept going. I drove more than a marathon: 45 kilometres!" },
      { who: 'vimo', text: 'Opportunity was planned for 90 days and explored for more than 14 years!' },
    ],
  },
  {
    id: '3.3-b9', part: 3, scene: '3.3', title: 'Blueberries', year: 2004, era: '2000s', stage: 'mars',
    prop: 'opportunity', fx: ['water'], machine: 'opportunity',
    face: 'curious', gesture: 'point', screen: 'bottom-left', size: 'S', music: 'M8',
    lines: [
      { who: 'kid', text: 'Are those real blueberries?!' },
      { who: 'vimo', text: "Ha! They're tiny rocks that scientists nicknamed blueberries. Rocks like these usually form in water. So long ago, Mars had water!" },
    ],
    tryIt: 'blueberries',
  },
  {
    id: '3.3-b10', part: 3, scene: '3.3', title: 'The dust storm', year: 2018, era: '2000s', stage: 'mars',
    prop: 'opportunity', fx: ['storm'], machine: 'opportunity',
    face: 'sad', gesture: 'idle', screen: 'left', size: 'M', music: 'M9', sfx: ['storm'],
    lines: [
      { who: 'vimo', text: "In 2018, a huge dust storm covered the whole planet. The Sun was hidden, and Opportunity's solar panels couldn't make power. Its last message just said: power very low, sky very dark." },
      { who: 'vimo', text: 'NASA called to it more than 1,000 times. It never answered. But it had done its job, and much, much more.' },
    ],
    choice: {
      ask: 'Should we say goodbye to Oppy?',
      answers: [
        { label: 'Yes', reply: 'Goodbye, Oppy. We remember you.', face: 'gentle' },
        { label: 'Hug', reply: 'Group hug, very carefully.', face: 'tears' },
      ],
    },
  },
  {
    id: '3.3-b11', part: 3, scene: '3.3', title: 'Goodbye, Oppy', year: 2019, era: '2000s', stage: 'mars',
    prop: 'opportunity', fx: ['sunrise'], machine: 'opportunity', stamp: true,
    face: 'proud', gesture: 'salute', screen: 'right', size: 'M', music: 'M10', sfx: ['stamp'],
    lines: [{ who: 'vimo', text: 'Goodbye, Oppy. Built for 90 days, you gave us 14 years. You are not forgotten.' }],
    hub: 'hub-spirit',
  },
  {
    id: '3.3b-b11b', part: 3, scene: '3.3b', title: 'The sky crane', year: 2012, era: 'today', stage: 'mars',
    prop: 'curiosity', fx: ['skycrane'], label: 'Gale crater, August 2012', machine: 'curiosity',
    face: 'nervous', gesture: 'cheer', screen: 'left', size: 'M', music: 'M8', sfx: ['thruster'],
    lines: [
      { who: 'vimo', text: 'Curiosity is as big as a car, too heavy for airbags. So NASA lowered it on ropes from a flying rocket crane. And look: every landing leaves parts behind, like breadcrumbs.' },
      { who: 'machine', machine: 'landing-leftovers', era: 'today', text: 'We protected the rovers through a fiery fall, then dropped away. Now we lie in the dust like a trail of breadcrumbs.' },
    ],
  },
  {
    id: '3.3b-b11c', part: 3, scene: '3.3b', title: 'Reading Mars like a book', year: 2026, era: 'today', stage: 'mars',
    prop: 'curiosity', fx: ['layers'], machine: 'curiosity', stamp: true,
    face: 'thinking', gesture: 'point', screen: 'left', size: 'L', music: 'M8', sfx: ['laser', 'stamp'],
    lines: [
      { who: 'machine', machine: 'curiosity', era: 'today', text: "I'm climbing a mountain in an old lake bed, reading Mars's history layer by layer, like pages in a book." },
      { who: 'vimo', text: "Curiosity showed that Gale crater once held a lake where tiny living things, microbes, could have lived. And it's still working today!" },
    ],
    tryIt: 'layers', hub: 'hub-maven',
  },
  {
    id: '3.3c-b11d', part: 3, scene: '3.3c', title: 'Listening to Mars', year: 2018, era: 'today', stage: 'mars',
    prop: 'insight', fx: ['quake'], label: 'Elysium Planitia, 2018', machine: 'insight',
    face: 'amazed', gesture: 'listen', screen: 'bottom', size: 'S', music: 'M8', sfx: ['quake'],
    lines: [
      { who: 'machine', machine: 'insight', era: 'today', text: 'I put my ear to the ground and heard Mars rumble more than a thousand times.' },
      { who: 'vimo', text: "InSight recorded more than 1,300 marsquakes and learned about Mars' core. Like a doctor listening to a heartbeat!" },
    ],
    tryIt: 'marsquake',
  },
  {
    id: '3.3c-b11e', part: 3, scene: '3.3c', title: 'A dusty goodbye', year: 2022, era: 'today', stage: 'mars',
    prop: 'insight', fx: ['dust-cover'], machine: 'insight', stamp: true,
    face: 'gentle', gesture: 'idle', screen: 'right', size: 'M', music: 'M9', sfx: ['storm', 'stamp'],
    lines: [{ who: 'vimo', text: 'Bit by bit, dust covered its solar panels. In December 2022, InSight went quiet. Thank you for listening, InSight.' }],
    hub: 'hub-marco',
  },
  {
    id: '3.4-b12', part: 3, scene: '3.4', title: 'Seven minutes', year: 2021, era: 'today', stage: 'mars',
    fx: ['entry'], label: 'Jezero Crater, 18 February 2021', face: 'nervous', gesture: 'idle', screen: 'top-right', size: 'M', music: 'M10', sfx: ['reentry', 'pop'],
    lines: [{ who: 'vimo', text: "Landing on Mars takes about seven minutes, and the robot must do it all by itself. NASA engineers call it 'seven minutes of terror'!" }],
  },
  {
    id: '3.4-b13', part: 3, scene: '3.4', title: 'The leftovers', year: 2021, era: 'today', stage: 'mars',
    prop: 'landing-leftovers', fx: ['tracks'], machine: 'landing-leftovers',
    face: 'cheeky', gesture: 'point', screen: 'right', size: 'S', music: 'M10', sfx: ['radio'],
    lines: [
      { who: 'machine', machine: 'landing-leftovers', era: 'today', text: "Sure, I'm lying in the sand now. But I protected Perseverance from heat hotter than lava. You're welcome!" },
      { who: 'vimo', text: "These parts were used only once, for seven minutes. But without them, Perseverance couldn't have landed." },
    ],
  },
  {
    id: '3.4-b14', part: 3, scene: '3.4', title: 'The secret code', year: 2021, era: 'today', stage: 'mars',
    prop: 'landing-leftovers', fx: ['code'], machine: 'landing-leftovers', stamp: true,
    face: 'cheeky', gesture: 'whisper', screen: 'left', size: 'L', music: 'M10', sfx: ['stamp'],
    lines: [{ who: 'vimo', text: 'Psst... the parachute has a secret message hidden in its pattern. Engineers wrote it in computer code. Can you crack it?' }],
    tryIt: 'parachute-code',
  },
  {
    id: '3.5-b15', part: 3, scene: '3.5', title: 'The tiny helicopter', year: 2021, era: 'today', stage: 'mars',
    prop: 'ingenuity', fx: ['jezero'], machine: 'ingenuity',
    face: 'curious', gesture: 'sit', screen: 'bottom-right', size: 'M', music: 'M10',
    lines: [
      { who: 'vimo', text: 'This little helicopter is Ingenuity. It weighs about the same as two big bottles of water. Its job: try to fly on another planet. Nobody had ever done that.' },
      { who: 'kid', text: 'But you said Mars has almost no air!' },
      { who: 'vimo', text: "Right! So its blades spin super fast, about 2,400 times a minute. That's much faster than a helicopter on Earth." },
    ],
    choice: {
      ask: 'Would you fly a helicopter on Mars?',
      answers: [
        { label: 'Yes', reply: 'Pilot space buddy, ready!', face: 'excited' },
        { label: 'Maybe', reply: 'Ingenuity was nervous too. It flew 72 times!', face: 'gentle' },
      ],
    },
  },
  {
    id: '3.5-b16', part: 3, scene: '3.5', title: 'First flight', year: 2021, era: 'today', stage: 'mars',
    prop: 'ingenuity', fx: ['jezero', 'heli-fly'], machine: 'ingenuity', highFive: true,
    face: 'excited', gesture: 'loop', screen: 'right', size: 'M', music: 'M10', sfx: ['blades'],
    lines: [
      { who: 'machine', machine: 'ingenuity', era: 'today', text: 'I was supposed to fly 5 times. I flew 72 times! I even scouted the path for my big friend, Perseverance.' },
      { who: 'vimo', text: "The first powered flight on another planet! And here's a secret: Ingenuity carries a tiny piece of cloth from the Wright brothers' first airplane, from 1903." },
    ],
    tryIt: 'fly-ingenuity',
  },
  {
    id: '3.5-b17', part: 3, scene: '3.5', title: 'A little hero, waiting', year: 2024, era: 'today', stage: 'mars',
    prop: 'ingenuity', fx: ['jezero', 'sunset'], machine: 'ingenuity', stamp: true,
    face: 'gentle', gesture: 'sit', screen: 'left', size: 'M', music: 'M10', sfx: ['stamp'],
    lines: [
      { who: 'vimo', text: 'In January 2024, on its 72nd flight, a blade broke, so it can’t fly anymore. But every day it still wakes up, checks itself and takes a photo, saving the data for future explorers who come to visit. A little hero, waiting on a sandy hill.' },
      { who: 'vimo', text: 'And Perseverance is still out there, exploring. Keep going, Percy!' },
    ],
  },
  {
    id: '3.6-b18', part: 3, scene: '3.6', title: 'The sample collector', year: 2026, era: 'today', stage: 'mars',
    prop: 'perseverance', fx: ['jezero', 'delta', 'drill'], machine: 'perseverance', stamp: true,
    face: 'curious', gesture: 'point', screen: 'right', size: 'M', music: 'M10', sfx: ['drill', 'stamp'],
    lines: [
      { who: 'machine', machine: 'perseverance', era: 'today', text: "I'm collecting pieces of Mars in little tubes, so that one day scientists on Earth can study them." },
      { who: 'vimo', text: "Perseverance is searching this old river delta for signs of past life. And it's still working today!" },
    ],
  },
  {
    id: '3.6-b19', part: 3, scene: '3.6', title: 'Ten tubes, waiting', year: 2023, era: 'today', stage: 'mars',
    prop: 'three-forks', fx: ['jezero', 'tubes'], label: 'Three Forks sample depot', machine: 'three-forks', stamp: true,
    face: 'gentle', gesture: 'count', screen: 'bottom-left', size: 'S', music: 'M10', sfx: ['clink', 'stamp'],
    lines: [
      { who: 'machine', machine: 'three-forks', era: 'today', text: 'We are ten little tubes of Mars rock, left on the ground on purpose, waiting for a ride to Earth.' },
      { who: 'vimo', text: "This is the first sample depot on another planet. These tubes aren't abandoned. They're waiting. Just like all our friends." },
    ],
    tryIt: 'count-tubes',
  },
  {
    id: '3.6-b20', part: 3, scene: '3.6', title: 'Goodbye, Mars', year: 2026, era: 'today', stage: 'mars-orbit',
    fx: ['pins'], face: 'proud', gesture: 'wave', screen: 'right', size: 'M', music: 'M10',
    lines: [{ who: 'vimo', text: 'Mars, thank you! But some machines went even farther. Much, much farther. Ready?' }],
    breakAfter: true,
  },

  // ═════════════════════════ PART 4 — STILL TRAVELING, AND HOME ═════════════════════════
  {
    id: '4.1-b1', part: 4, scene: '4.1', title: 'Still traveling', year: 2026, era: 'space', stage: 'deep',
    fx: ['shrink', 'trails'], face: 'amazed', gesture: 'shrug', screen: 'centre', size: 'M', music: 'M11', sfx: ['beep'],
    lines: [{ who: 'vimo', text: "Some machines never landed anywhere. They're still flying away from the Sun! Even my jetpack can't catch them." }],
  },
  {
    id: '4.1-b2', part: 4, scene: '4.1', title: 'Pioneer 10', year: 1972, era: '1970s', stage: 'deep',
    prop: 'pioneer10', fx: ['jupiter'], machine: 'pioneer10', stamp: true,
    face: 'gentle', gesture: 'wave', screen: 'left', size: 'S', music: 'M11', sfx: ['radio', 'stamp'],
    lines: [
      { who: 'machine', machine: 'pioneer10', era: '70s', text: "1972... I was the first to fly past Jupiter... I sent my last message in 2003. I'm still flying, quietly." },
      { who: 'vimo', text: 'Pioneer 10 carries a metal plaque with a drawing that shows where it came from: Earth.' },
    ],
  },
  {
    id: '4.1-b2b', part: 4, scene: '4.1', title: 'Voyager 2, the only visitor', year: 1989, era: '1970s', stage: 'deep',
    prop: 'voyager2', fx: ['planets4'], machine: 'voyager2', stamp: true,
    face: 'amazed', gesture: 'wave', screen: 'right', size: 'S', music: 'M11', sfx: ['radio', 'stamp'],
    lines: [
      { who: 'machine', machine: 'voyager2', era: '70s', text: "I'm the only visitor Uranus and Neptune have ever had, and I carry a golden record of Earth's music." },
      { who: 'vimo', text: "Voyager 2 went into interstellar space in 2018, about 21 billion kilometres away. It's still working, on very low power." },
    ],
    tryIt: 'planet-parade',
  },
  {
    id: '4.1-b3', part: 4, scene: '4.1', title: 'Voyager 1', year: 2026, era: 'today', stage: 'deep',
    prop: 'voyager1', fx: ['heliosphere', 'record'], machine: 'voyager1', stamp: true,
    face: 'brave', gesture: 'whisper', screen: 'left', size: 'L', music: 'M11', sfx: ['radio', 'stamp'],
    lines: [
      { who: 'machine', machine: 'voyager1', era: '70s', text: "Launched in 1977. I'm the farthest thing people have ever made. I carry a golden record with sounds and music from Earth. And yes... I still call home." },
      { who: 'vimo', text: "On 18 November 2026, Voyager 1 becomes the first human-made object one light-day from Earth: its signal will take a whole day to reach us! It's in interstellar space, between the stars." },
    ],
    tryIt: 'golden-record',
    choice: {
      ask: 'What would you put on a golden record?',
      answers: [
        { label: 'Music', reply: 'Great choice. Aliens would love that.', face: 'excited' },
        { label: 'Laughing', reply: 'Great choice. Aliens would love that.', face: 'happy' },
        { label: 'Rain sounds', reply: 'Great choice. Aliens would love that.', face: 'gentle' },
      ],
    },
    hub: 'hub-explorers',
  },
  {
    id: '4.1b-b3b', part: 4, scene: '4.1b', title: "Pluto's heart", year: 2015, era: 'today', stage: 'pluto',
    prop: 'new-horizons', fx: ['heart'], machine: 'new-horizons', stamp: true,
    face: 'amazed', gesture: 'heart', screen: 'left', size: 'L', music: 'M11', sfx: ['chime', 'stamp'],
    lines: [
      { who: 'machine', machine: 'new-horizons', era: 'today', text: 'I showed the world Pluto’s heart-shaped glacier, and I carry the man who discovered Pluto.' },
      { who: 'vimo', text: "New Horizons carries some ashes of Clyde Tombaugh, who discovered Pluto. Then it visited Arrokoth, the farthest world ever explored. It's still working!" },
    ],
    tryIt: 'pluto-heart',
  },
  {
    id: '4.2-b4', part: 4, scene: '4.2', title: "VIMO's logbook", year: 2026, era: 'today', stage: 'logbook',
    face: 'happy', gesture: 'logbook', screen: 'left', size: 'M', music: 'M12', sfx: ['page'],
    lines: [{ who: 'vimo', text: 'Look at all our friends! Some still work. Some went quiet. Some were used once, on purpose. But none of them are just junk. Each one taught us something.' }],
  },
  {
    id: '4.2-b5', part: 4, scene: '4.2', title: 'Sort the machines', year: 2026, era: 'today', stage: 'logbook',
    face: 'thinking', gesture: 'point', screen: 'left', size: 'S', music: 'M12',
    lines: [{ who: 'vimo', text: "See? Old doesn't mean abandoned. They're resting where they finished their work." }],
    tryIt: 'sorting',
  },
  {
    id: '4.3-b6', part: 4, scene: '4.3', title: 'Perfect landing', year: 2026, era: 'today', stage: 'rooftop',
    fx: ['perfect-land'], face: 'proud', gesture: 'bow', screen: 'bottom', size: 'M', music: 'M12', sfx: ['whoosh', 'chime'],
    lines: [{ who: 'vimo', text: "Perfect landing! See, I'm learning too." }],
  },
  {
    id: '4.3-b7', part: 4, scene: '4.3', title: 'Looking up', year: 2026, era: 'today', stage: 'rooftop',
    fx: ['moon-dots', 'laser-home'], face: 'tears', gesture: 'sit', screen: 'right', size: 'L', music: 'M12', sfx: ['laser'],
    lines: [{ who: 'vimo', text: "Next time you look at the Moon, remember: there's a lander's bottom half up there, a car, footprints... and a little mirror that still answers when we call." }],
    choice: {
      ask: 'Will you remember our friends?',
      answers: [
        { label: 'Yes!', reply: "Then they're never forgotten.", face: 'tears' },
        { label: 'Always', reply: "Then they're never forgotten.", face: 'tears' },
      ],
    },
  },
  {
    id: '4.3-b8', part: 4, scene: '4.3', title: 'The last line', year: 2026, era: 'today', stage: 'rooftop',
    fx: ['moon-dots', 'finale'], face: 'happy', gesture: 'salute', screen: 'centre', size: 'XL', music: 'M12', sfx: ['chime'],
    lines: [{ who: 'vimo', text: "These machines were brave enough to go first. Maybe one day you'll build the next one. And when it finishes its work, someone like me will come and say thank you." }],
  },
];

export const beatIndex: Record<string, number> = Object.fromEntries(beats.map((b, i) => [b.id, i]));

export const PARTS = [
  { part: 1, title: 'Earth', color: '#2E8BFF' },
  { part: 2, title: 'The Moon', color: '#C9D3E8' },
  { part: 3, title: 'Mars', color: '#E2683C' },
  { part: 4, title: 'Still traveling', color: '#8E6BFF' },
] as const;
