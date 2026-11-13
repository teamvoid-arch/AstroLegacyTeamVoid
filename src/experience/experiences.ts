// Experience Mode: VIMO's lines for every button, from the Story Script
// ("Experience Mode lines"). Readouts are simple values based on NASA facts
// quoted in the script; the simulation itself is simplified and labelled.

export type Room = '60s' | '70s' | '90s' | 'today' | 'cabin' | 'observatory' | 'open-seat';
export type Control = 'lever' | 'joystick' | 'button' | 'dial' | 'switch' | 'arrows';

export interface Step {
  control: string;
  label: string;
  icon: string;
  type: Control;
  ask: string;
  explain: string;
  /** Outside-window action id understood by the window scene. */
  action: string;
  readouts?: Record<string, string>;
  sfx?: string;
  duration?: number;
}

export interface Experience {
  id: string;
  machine: string;
  title: string;
  world: 'moon' | 'mars' | 'deep' | 'earth';
  room: Room;
  imagined: boolean;
  enter: string;
  steps: Step[];
  win: string;
  fact: string;
  readouts: Record<string, string>;
}

export const SHARED = {
  carousel: "Pick a machine. We're going inside!",
  door: 'After you! Mind your helmet.',
  inside: "This is an imagined control room, like being inside the machine's brain!",
  wrong: 'Hmm, not that one. Try the glowing button!',
  again: 'Oops! Real engineers try again too.',
  exit: 'Want to see this machine in the story?',
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'eagle', machine: 'apollo11-eagle', title: 'Land the Eagle', world: 'moon', room: 'cabin', imagined: false,
    enter: 'This is a real kind of cabin. Two astronauts stood right here in 1969! Below us: the Sea of Tranquility.',
    readouts: { Height: '150 m', Speed: 'falling fast', Engine: 'off' },
    steps: [
      { control: 'slow', label: 'SLOW DOWN', icon: '⬇️', type: 'lever', action: 'thrust', sfx: 'thruster', ask: "We're falling too fast. Pull the lever to fire the engine!", explain: "Look! You fired the engine, so we're slowing down.", readouts: { Height: '60 m', Speed: 'slowing', Engine: 'firing' } },
      { control: 'steer', label: 'STEER', icon: '🕹️', type: 'joystick', action: 'steer', sfx: 'thruster', ask: 'Big rocks ahead! Push the joystick to find a flat spot.', explain: 'See? You flew us past the rocks, just like Neil Armstrong did.', readouts: { Height: '10 m', Speed: 'gentle', Engine: 'firing' } },
      { control: 'stop', label: 'ENGINE STOP', icon: '⏹️', type: 'button', action: 'touchdown', sfx: 'thump', ask: 'Contact light! Press STOP!', explain: "You switched off the engine. We're on the Moon!", readouts: { Height: '0 m', Speed: 'landed', Engine: 'off' } },
    ],
    win: 'The Eagle has landed!',
    fact: 'Neil Armstrong flew past a field of boulders to find a safe spot, landing on 20 July 1969 with little fuel to spare.',
  },
  {
    id: 'mirror', machine: 'apollo11-mirror', title: 'Call the Moon', world: 'earth', room: 'observatory', imagined: false,
    enter: "We're in an observatory on Earth. Up there, on the Moon, is a little mirror the astronauts left.",
    readouts: { Target: 'none', Laser: 'ready', 'Round trip': '—' },
    steps: [
      { control: 'aim', label: 'AIM', icon: '🎯', type: 'dial', action: 'aim', sfx: 'servo', ask: 'Turn the dial to aim at the landing site.', explain: 'Look! You pointed the telescope right at Apollo 11.', readouts: { Target: 'Apollo 11 site', Laser: 'ready', 'Round trip': '—' } },
      { control: 'fire', label: 'FIRE', icon: '🔆', type: 'button', action: 'beam', sfx: 'laser', ask: 'Fire the laser!', explain: 'Your laser is flying to the Moon at the speed of light!', readouts: { Target: 'Apollo 11 site', Laser: 'on its way', 'Round trip': 'counting…' } },
      { control: 'catch', label: 'CATCH', icon: '🧲', type: 'button', action: 'return', sfx: 'chime', ask: 'Here it comes back... press CATCH!', explain: 'The mirror sent your light back. You just measured the distance to the Moon!', readouts: { Target: 'Apollo 11 site', Laser: 'caught!', 'Round trip': '≈ 2.5 s' } },
    ],
    win: 'You called the Moon, and it answered!',
    fact: "Scientists still bounce lasers off Apollo mirrors; that's how we know the Moon moves away about 3.8 cm a year.",
  },
  {
    id: 'rover', machine: 'apollo15-rover', title: 'Drive on the Moon', world: 'moon', room: 'open-seat', imagined: false,
    enter: 'Hop in! There’s no roof. Your helmet visor is your window.',
    readouts: { Power: 'off', Speed: '0', Camera: 'off' },
    steps: [
      { control: 'power', label: 'POWER', icon: '🔋', type: 'switch', action: 'power', sfx: 'servo', ask: 'Flip the power on.', explain: 'You woke up the batteries. This car runs on electricity!', readouts: { Power: 'on', Speed: '0', Camera: 'off' } },
      { control: 'drive', label: 'T-HANDLE', icon: '⬆️', type: 'lever', action: 'drive', sfx: 'wheels', ask: 'Push the T-handle forward to drive. Gently!', explain: 'See the dust? No air on the Moon, so it flies in perfect curves.', readouts: { Power: 'on', Speed: 'driving', Camera: 'off' } },
      { control: 'tv', label: 'TV CAMERA', icon: '📺', type: 'switch', action: 'tv', sfx: 'radio', ask: 'Turn on the TV camera so people on Earth can watch!', explain: 'Now everyone on Earth can see us driving!', readouts: { Power: 'on', Speed: 'driving', Camera: 'on air' } },
    ],
    win: 'Great driving! The real rover carried the astronauts about 28 kilometres.',
    fact: 'The Apollo 15 rover was the first car driven on another world. It is still parked on the Moon.',
  },
  {
    id: 'viking', machine: 'viking1', title: 'First photo from Mars', world: 'mars', room: '70s', imagined: true,
    enter: "It's 1976 and we just landed on Mars. Let's work!",
    readouts: { Camera: 'ready', Arm: 'stowed', Lab: 'empty' },
    steps: [
      { control: 'camera', label: 'CAMERA', icon: '📷', type: 'button', action: 'photo', sfx: 'scan', ask: "Take our first picture. Let's check our own foot!", explain: 'Look! You took the first photo ever from the surface of Mars.', readouts: { Camera: 'photo 1 sent', Arm: 'stowed', Lab: 'empty' }, duration: 5 },
      { control: 'arm', label: 'ARM', icon: '🦾', type: 'lever', action: 'scoop', sfx: 'servo', ask: 'Press ARM to reach out and scoop some soil.', explain: 'You scooped Mars dirt!', readouts: { Camera: 'photo 1 sent', Arm: 'full of soil', Lab: 'empty' } },
      { control: 'lab', label: 'LAB', icon: '🧪', type: 'button', action: 'pour', sfx: 'clink', ask: 'Now put it in our lab to look for tiny signs of life.', explain: 'Your soil is in the lab. Scientists still talk about what Viking found!', readouts: { Camera: 'photo 1 sent', Arm: 'stowed', Lab: 'testing soil' } },
    ],
    win: 'Mission accomplished, 1976 style!',
    fact: 'Viking 1’s first photo showed its own footpad.',
  },
  {
    id: 'sojourner', machine: 'sojourner', title: 'Drive with a delay', world: 'mars', room: '90s', imagined: true,
    enter: "We're inside the very first Mars rover. It's as small as a microwave oven!",
    readouts: { Plan: 'empty', 'Message delay': '~10 min (sped up)', Position: 'by the lander' },
    steps: [
      { control: 'plan', label: 'PLAN', icon: '➡️', type: 'arrows', action: 'plan', sfx: 'blip', ask: 'Mars hears us late, so make a plan first. Tap three arrows.', explain: 'Good plan!', readouts: { Plan: '3 moves', 'Message delay': '~10 min (sped up)', Position: 'by the lander' } },
      { control: 'send', label: 'SEND', icon: '📡', type: 'button', action: 'delayed-drive', sfx: 'radio', ask: 'Send it!', explain: 'See? Your message took time to reach Mars, then the rover moved.', readouts: { Plan: 'done', 'Message delay': 'arrived', Position: 'next to a rock' }, duration: 7 },
      { control: 'cam', label: 'LANDER CAMERA', icon: '🎥', type: 'button', action: 'lander-view', sfx: 'shutter', ask: "Let's see ourselves from the lander!", explain: "That's us! Next to a rock.", readouts: { Plan: 'done', 'Message delay': '—', Position: 'next to a rock' } },
    ],
    win: 'You drove the first Mars rover!',
    fact: 'Sojourner landed in 1997 and never went more than a few metres from its lander.',
  },
  {
    id: 'opportunity', machine: 'opportunity', title: 'Keep going for years', world: 'mars', room: '90s', imagined: true,
    enter: 'Opportunity was built for 90 days. Can we keep it going longer?',
    readouts: { Power: '100%', Distance: '0 m', Panels: 'clean' },
    steps: [
      { control: 'drive', label: 'DRIVE', icon: '🚙', type: 'lever', action: 'drive', sfx: 'wheels', ask: 'Drive to that patch of small stones.', explain: "You're exploring Meridiani Planum!", readouts: { Power: '90%', Distance: 'driving', Panels: 'clean' } },
      { control: 'micro', label: 'MICROSCOPE', icon: '🔬', type: 'button', action: 'microscope', sfx: 'servo', ask: 'Use the microscope on the arm!', explain: 'Look! Blueberry rocks. They form in water, so Mars once had water.', readouts: { Power: '80%', Distance: 'stopped', Panels: 'dusty' } },
      { control: 'power', label: 'POWER CHECK', icon: '🔋', type: 'button', action: 'dusty', sfx: 'beep', ask: 'Check our power.', explain: 'Uh-oh, dust is blocking the sunlight.', readouts: { Power: '40% (low)', Distance: 'stopped', Panels: 'very dusty' } },
      { control: 'wind', label: 'WAIT FOR WIND', icon: '🌬️', type: 'button', action: 'wind', sfx: 'storm', ask: "Let's wait for a breeze...", explain: 'The wind cleaned our panels! That really happened to Opportunity.', readouts: { Power: '95%', Distance: 'ready', Panels: 'clean again' }, duration: 6 },
    ],
    win: 'You kept going! The real Opportunity worked for almost 15 years.',
    fact: 'Opportunity was planned for 90 days and explored for more than 14 years.',
  },
  {
    id: 'curiosity', machine: 'curiosity', title: 'Zap a rock', world: 'mars', room: 'today', imagined: true,
    enter: "We're inside Curiosity, a rover as big as a car, climbing Mount Sharp.",
    readouts: { Mast: 'forward', Laser: 'ready', Rock: 'unknown' },
    steps: [
      { control: 'mast', label: 'MAST CAMERA', icon: '📸', type: 'dial', action: 'mast', sfx: 'servo', ask: 'Turn the mast camera and pick a rock.', explain: 'Nice rock choice!', readouts: { Mast: 'on target', Laser: 'ready', Rock: 'unknown' } },
      { control: 'laser', label: 'LASER', icon: '⚡', type: 'button', action: 'zap', sfx: 'laser', ask: 'Zap it with the laser!', explain: 'You zapped it! The spark makes a little glow of light.', readouts: { Mast: 'on target', Laser: 'spark!', Rock: 'glowing' } },
      { control: 'analyse', label: 'ANALYSE', icon: '🌈', type: 'button', action: 'spectrum', sfx: 'chime', ask: 'Now read the light.', explain: "The light tells us what the rock is made of. You're a rock detective!", readouts: { Mast: 'on target', Laser: 'ready', Rock: 'read!' } },
    ],
    win: 'Rock detective badge earned!',
    fact: 'Curiosity showed that Gale crater once held a lake where microbes could have lived.',
  },
  {
    id: 'insight', machine: 'insight', title: 'Listen to Mars', world: 'mars', room: 'today', imagined: true,
    enter: "Shh... InSight is a listener. Let's hear what's inside Mars.",
    readouts: { Seismometer: 'on deck', Dome: 'up', Signal: 'quiet' },
    steps: [
      { control: 'arm', label: 'ARM', icon: '🦾', type: 'lever', action: 'place', sfx: 'servo', ask: 'Use the arm to set the seismometer on the ground.', explain: 'Perfect placement!', readouts: { Seismometer: 'on the ground', Dome: 'up', Signal: 'quiet' } },
      { control: 'dome', label: 'DOME', icon: '🛡️', type: 'button', action: 'dome', sfx: 'thump', ask: 'Cover it with its dome, to keep out the wind.', explain: 'Now it can hear tiny shakes.', readouts: { Seismometer: 'on the ground', Dome: 'covering', Signal: 'quiet' } },
      { control: 'listen', label: 'LISTEN', icon: '👂', type: 'button', action: 'quake', sfx: 'quake', ask: 'Press LISTEN and wait...', explain: 'A marsquake! You heard Mars rumble!', readouts: { Seismometer: 'listening', Dome: 'covering', Signal: 'marsquake!' }, duration: 6 },
    ],
    win: 'InSight caught more than 1,300 marsquakes.',
    fact: 'InSight recorded more than 1,300 marsquakes and learned about Mars’ core.',
  },
  {
    id: 'perseverance', machine: 'perseverance', title: 'Save a piece of Mars', world: 'mars', room: 'today', imagined: true,
    enter: "We're in Jezero crater, an old river delta. Let's collect a piece of Mars!",
    readouts: { Drill: 'ready', Tube: 'empty', Depot: '9 tubes' },
    steps: [
      { control: 'drill', label: 'DRILL', icon: '🛠️', type: 'button', action: 'drill', sfx: 'drill', ask: 'Press DRILL!', explain: "You're drilling out a rock core!", readouts: { Drill: 'drilling', Tube: 'filling', Depot: '9 tubes' } },
      { control: 'seal', label: 'SEAL', icon: '🔒', type: 'button', action: 'seal', sfx: 'clink', ask: 'Seal the tube to keep it clean.', explain: 'Sealed and safe!', readouts: { Drill: 'ready', Tube: 'sealed', Depot: '9 tubes' } },
      { control: 'drop', label: 'DROP TUBE', icon: '📍', type: 'button', action: 'drop', sfx: 'clink', ask: 'Leave it at the depot with the others.', explain: 'Look! Your tube is waiting at Three Forks for a ride to Earth.', readouts: { Drill: 'ready', Tube: 'placed', Depot: '10 tubes' } },
    ],
    win: 'Your piece of Mars is waiting for a ride home!',
    fact: 'Perseverance left 10 sealed tubes at Three Forks, the first sample depot on another planet.',
  },
  {
    id: 'ingenuity', machine: 'ingenuity', title: 'Fly on Mars', world: 'mars', room: 'today', imagined: true,
    enter: "We're inside the little helicopter. Mars air is super thin!",
    readouts: { Rotors: '0 rpm', Height: '0 m', Flight: 'parked' },
    steps: [
      { control: 'spin', label: 'SPIN UP', icon: '🌀', type: 'dial', action: 'spin', sfx: 'blades', ask: 'Spin the blades up!', explain: 'They spin about 2,400 times a minute. Super fast!', readouts: { Rotors: '≈ 2,400 rpm', Height: '0 m', Flight: 'ready' } },
      { control: 'lift', label: 'LIFT', icon: '⬆️', type: 'lever', action: 'lift', sfx: 'blades', ask: 'Now lift off!', explain: "We're flying on Mars!", readouts: { Rotors: '≈ 2,400 rpm', Height: '5 m', Flight: 'hovering' } },
      { control: 'fly', label: 'FLY', icon: '➡️', type: 'joystick', action: 'fly', sfx: 'blades', ask: 'Fly to the landing spot.', explain: 'Look at the view!', readouts: { Rotors: '≈ 2,400 rpm', Height: '10 m', Flight: 'cruising' } },
      { control: 'land', label: 'LAND', icon: '⬇️', type: 'lever', action: 'land', sfx: 'thump', ask: 'Gently... land!', explain: 'Perfect flight! Ingenuity flew 72 times.', readouts: { Rotors: 'slowing', Height: '0 m', Flight: 'landed' } },
    ],
    win: 'Pilot space buddy, you flew on Mars!',
    fact: 'Ingenuity made the first powered flight on another planet on 19 April 2021, and flew 72 times.',
  },
  {
    id: 'lro', machine: 'lro', title: 'Find the leftovers', world: 'moon', room: 'today', imagined: true,
    enter: "We're the Moon's photographer, high above the surface.",
    readouts: { Zoom: '1×', Camera: 'ready', Marks: '0' },
    steps: [
      { control: 'zoom', label: 'ZOOM', icon: '🔍', type: 'dial', action: 'zoom', sfx: 'servo', ask: 'Turn the zoom to the Sea of Tranquility.', explain: 'Getting closer...', readouts: { Zoom: 'max', Camera: 'ready', Marks: '0' } },
      { control: 'snap', label: 'CAMERA', icon: '📸', type: 'button', action: 'snap', sfx: 'shutter', ask: 'Snap a picture!', explain: "That shadow is the Eagle's bottom half!", readouts: { Zoom: 'max', Camera: 'photo taken', Marks: '0' } },
      { control: 'mark', label: 'MARK', icon: '✏️', type: 'button', action: 'mark', sfx: 'chime', ask: 'Mark the paths the astronauts walked.', explain: 'You found them! Still there after all these years.', readouts: { Zoom: 'max', Camera: 'photo taken', Marks: 'footpaths' } },
    ],
    win: 'Proof from orbit: they are all still there!',
    fact: 'LRO still photographs the Apollo landers, rover tracks and footpaths from orbit.',
  },
  {
    id: 'voyager', machine: 'voyager1', title: 'Look back at home', world: 'deep', room: '70s', imagined: true,
    enter: "We're Voyager 1, farther away than anything people have ever made.",
    readouts: { Camera: 'forward', Photo: '—', 'Signal time': '—' },
    steps: [
      { control: 'turn', label: 'TURN CAMERA', icon: '↩️', type: 'dial', action: 'turn', sfx: 'servo', ask: 'Turn the camera back towards the Sun. Carefully!', explain: "We're looking back home.", readouts: { Camera: 'towards the Sun', Photo: '—', 'Signal time': '—' } },
      { control: 'photo', label: 'TAKE PHOTO', icon: '📷', type: 'button', action: 'dot', sfx: 'shutter', ask: 'See that tiny dot in the light? Take the picture!', explain: "That's Earth. Everyone you know lives on that tiny dot.", readouts: { Camera: 'towards the Sun', Photo: 'Pale Blue Dot', 'Signal time': '—' } },
      { control: 'hello', label: 'SEND HELLO', icon: '👋', type: 'button', action: 'signal', sfx: 'radio', ask: 'Send a hello home.', explain: 'Your hello takes almost a whole day to reach Earth!', readouts: { Camera: 'towards the Sun', Photo: 'Pale Blue Dot', 'Signal time': '≈ 1 day' } },
    ],
    win: 'Hello from the edge of the solar system!',
    fact: 'Voyager 1 took the Pale Blue Dot photo in 1990. In November 2026 it becomes one light-day from Earth.',
  },
  {
    id: 'newhorizons', machine: 'new-horizons', title: 'One chance at Pluto', world: 'deep', room: 'today', imagined: true,
    enter: "We're flying past Pluto very fast. We only get one chance!",
    readouts: { Target: 'searching', Countdown: '—', Photo: '—' },
    steps: [
      { control: 'point', label: 'POINT', icon: '🎯', type: 'joystick', action: 'point', sfx: 'servo', ask: 'Point the camera at Pluto.', explain: 'Got it in the middle!', readouts: { Target: 'Pluto', Countdown: '—', Photo: '—' } },
      { control: 'count', label: 'COUNTDOWN', icon: '⏳', type: 'button', action: 'approach', sfx: 'beep', ask: 'Start the countdown.', explain: 'Wait... wait...', readouts: { Target: 'Pluto', Countdown: 'running', Photo: '—' }, duration: 5 },
      { control: 'snap', label: 'SNAP', icon: '📸', type: 'button', action: 'heart', sfx: 'chime', ask: 'Now!', explain: 'You got it! Pluto has a heart!', readouts: { Target: 'Pluto', Countdown: 'done', Photo: 'the heart!' } },
    ],
    win: 'Pluto’s heart, captured!',
    fact: 'New Horizons flew past Pluto in 2015 and showed its heart-shaped glacier.',
  },
  {
    id: 'dart', machine: 'dart', title: 'Protect Earth', world: 'deep', room: 'today', imagined: true,
    enter: 'Mission: give a little asteroid moon a push.',
    readouts: { Target: 'searching', Lock: 'no', Orbit: 'normal' },
    steps: [
      { control: 'find', label: 'FIND TARGET', icon: '🔭', type: 'dial', action: 'find', sfx: 'blip', ask: 'Find the small moon next to the big asteroid.', explain: 'There it is!', readouts: { Target: 'Dimorphos', Lock: 'no', Orbit: 'normal' } },
      { control: 'aim', label: 'AIM', icon: '🎯', type: 'joystick', action: 'lock', sfx: 'beep', ask: 'Aim right at its middle.', explain: 'Locked on!', readouts: { Target: 'Dimorphos', Lock: 'yes', Orbit: 'normal' } },
      { control: 'go', label: 'ENGINE GO', icon: '🚀', type: 'button', action: 'impact', sfx: 'thump', ask: 'Engines go!', explain: 'Bullseye! Its orbit got 32 minutes shorter.', readouts: { Target: 'Dimorphos', Lock: 'hit!', Orbit: '32 min shorter' }, duration: 6 },
    ],
    win: 'Planet protector!',
    fact: 'DART hit Dimorphos on 26 September 2022, the first test of pushing an asteroid.',
  },
];

export const expById: Record<string, Experience> = Object.fromEntries(EXPERIENCES.map((e) => [e.id, e]));
