import type { Hub, SideTrip } from '../data/types.ts';

// Hubs and side trips, from the Story Script. Every trip is one beat:
// VIMO line + machine line + status card + source, and earns a small stamp.

export const hubs: Hub[] = [
  { id: 'hub-scouts', title: 'The 1960s Moon scouts', trips: ['st-ranger89', 'st-orbiters', 'st-surveyor567'],
    line: 'Psst! Before the astronauts came, lots of robot scouts helped. Want a quick side trip, or shall we keep going?' },
  { id: 'hub-snoopy', title: 'The dress rehearsal', trips: ['st-snoopy'],
    line: 'Did Apollo 11 go first? Not quite! Want to meet Snoopy?' },
  { id: 'hub-apollo', title: 'More Apollo leftovers', trips: ['st-apollo13', 'st-apollo14', 'st-apollo16'],
    line: 'Apollo left lots more stories behind. A rocket that hit the Moon, a golf ball, a family photo... Which one?' },
  { id: 'hub-robots', title: 'Robots go back to the Moon', trips: ['st-prospector', 'st-lcross', 'st-grail', 'st-ladee', 'st-clps'],
    line: 'After Apollo, robots kept visiting. Some found water. Some crashed on purpose. Some even fell over! Pick a side trip.' },
  { id: 'hub-mariner', title: 'The first visitor to orbit', trips: ['st-mariner9'],
    line: 'Before anyone landed, one spacecraft circled Mars and waited for a storm to end. Side trip?' },
  { id: 'hub-viking2', title: "Viking 1's twin", trips: ['st-viking2'],
    line: 'Viking 1 had a twin on the far side of Mars. Want to visit?' },
  { id: 'hub-orbiters', title: 'Watching Mars from above', trips: ['st-mgs', 'st-mpl', 'st-odyssey'],
    line: 'Some machines never landed. They watched Mars from above, and one got lost. Want to meet them?' },
  { id: 'hub-spirit', title: "Opportunity's twin and the watchers", trips: ['st-spirit', 'st-mro', 'st-phoenix'],
    line: 'Opportunity had a twin sister on the other side of Mars! And new machines arrived to watch and dig. Side trip?' },
  { id: 'hub-maven', title: "Where did Mars' air go?", trips: ['st-maven'],
    line: 'One orbiter tried to answer a big question: why is Mars’ air so thin? Side trip?' },
  { id: 'hub-marco', title: 'The tiny twins', trips: ['st-marco'],
    line: 'Two briefcase-sized helpers flew behind InSight. Want to meet them?' },
  { id: 'hub-explorers', title: 'The solar system explorers', trips: ['st-pioneer11', 'st-apollo12-sivb', 'st-ulysses', 'st-near', 'st-ds1', 'st-stardust', 'st-spitzer', 'st-messenger', 'st-deepimpact', 'st-dawn', 'st-kepler', 'st-dart'],
    line: "NASA's machines are all over the solar system! Some crashed on purpose, some caught comet dust, and one even pushed an asteroid. Pick your side trips!" },
];

export const sidetrips: SideTrip[] = [
  { id: 'st-ranger89', hub: 'hub-scouts', machine: 'ranger8-9', title: 'Ranger 8 & 9', year: 1965, face: 'excited', gesture: 'hop', lines: [
    { who: 'vimo', text: 'In 1965, Ranger 8 and Ranger 9 crashed on purpose too. They photographed places where astronauts might land later.' },
    { who: 'machine', machine: 'ranger8-9', era: '60s', text: 'Millions of people watched on TV as I raced toward the Moon, sending pictures until the very last second!' }] },
  { id: 'st-orbiters', hub: 'hub-scouts', machine: 'lunar-orbiters', title: 'Lunar Orbiters 1–5', year: 1966, face: 'amazed', gesture: 'loop', lines: [
    { who: 'vimo', text: 'Five Lunar Orbiters mapped almost the whole Moon, so astronauts could choose safe places to land. One of them took the first picture of Earth seen from near the Moon!' },
    { who: 'machine', machine: 'lunar-orbiters', era: '60s', text: "We finished our map, then crashed on purpose so we wouldn't get in the astronauts' way." }] },
  { id: 'st-surveyor567', hub: 'hub-scouts', machine: 'surveyor5-7', title: 'Surveyor 5, 6 & 7', year: 1967, face: 'cheeky', gesture: 'hop', tryIt: 'hop', lines: [
    { who: 'vimo', text: 'These three tested what Moon soil is made of. And Surveyor 6 did something nobody had done before. Watch!' },
    { who: 'machine', machine: 'surveyor5-7', era: '60s', text: 'I fired my engines, lifted off and landed a few steps away. The first rocket hop ever made on the Moon!' }] },
  { id: 'st-snoopy', hub: 'hub-snoopy', machine: 'apollo10-snoopy', title: 'Snoopy, the dress rehearsal', year: 1969, face: 'curious', gesture: 'wave', lines: [
    { who: 'kid', text: 'Did Apollo 11 go first?' },
    { who: 'vimo', text: "Not quite! Two months earlier, Apollo 10 flew a lunar module called Snoopy close to the Moon, like a dress rehearsal. It didn't land. Its top part drifted off around the Sun, and astronomers think they may have spotted it again in 2019!" }] },
  { id: 'st-apollo13', hub: 'hub-apollo', machine: 'apollo13-sivb', title: "Apollo 13's rocket stage", year: 1970, face: 'surprised', gesture: 'cover-eyes', lines: [
    { who: 'vimo', text: "Apollo 13's crew never landed. They had a problem and came home safely. But their rocket stage was aimed at the Moon on purpose." },
    { who: 'machine', machine: 'apollo13-sivb', era: '70s', text: "My crew never reached the Moon, but I did. I hit it so a seismometer could listen to the Moon's insides. It felt me for over three hours!" }] },
  { id: 'st-apollo14', hub: 'hub-apollo', machine: 'apollo14-antares', title: 'Apollo 14, the golf ball', year: 1971, face: 'cheeky', gesture: 'spin', lines: [
    { who: 'vimo', text: 'Astronaut Alan Shepard hit two golf balls here! With weak gravity and no air, a golf ball flies a long way.' },
    { who: 'machine', machine: 'apollo14-antares', era: '70s', text: "I'm the only golf ball on the Moon. Hole in one? Not quite." }] },
  { id: 'st-apollo16', hub: 'hub-apollo', machine: 'apollo16-orion', title: 'Apollo 16, the family photo', year: 1972, face: 'gentle', gesture: 'sit', lines: [
    { who: 'vimo', text: 'Apollo 16 set up the first telescope used on the Moon. And astronaut Charlie Duke left a photo of his family here.' },
    { who: 'machine', machine: 'apollo16-orion', era: '70s', text: 'I looked at the stars from the Moon. The photo beside me has faded in more than 50 years of sunlight.' }] },
  { id: 'st-prospector', hub: 'hub-robots', machine: 'lunar-prospector', title: 'Lunar Prospector', year: 1998, face: 'gentle', gesture: 'bow', lines: [
    { who: 'vimo', text: 'Lunar Prospector found signs of hydrogen at the poles, a clue that there might be ice. And it carried something special: the ashes of Eugene Shoemaker, a scientist who loved the Moon.' },
    { who: 'machine', machine: 'lunar-prospector', era: '90s', text: 'He dreamed of the Moon all his life. Now he rests here with me.' }] },
  { id: 'st-lcross', hub: 'hub-robots', machine: 'lcross', title: 'LCROSS', year: 2009, face: 'excited', gesture: 'count', lines: [
    { who: 'machine', machine: 'lcross', era: 'today', text: 'We crashed into the darkest crater on the Moon, kicked up a cloud, and found water inside it!' },
    { who: 'vimo', text: 'Water on the Moon! Future astronauts could use it to drink, or even to make rocket fuel.' }] },
  { id: 'st-grail', hub: 'hub-robots', machine: 'grail', title: 'GRAIL, Ebb and Flow', year: 2012, face: 'proud', gesture: 'loop', lines: [
    { who: 'machine', machine: 'grail', era: 'today', text: "Two of us flew in a line, measuring the Moon's pull, and ended our mission together on a mountain named for Sally Ride." },
    { who: 'vimo', text: 'Sally Ride was the first American woman in space.' }] },
  { id: 'st-ladee', hub: 'hub-robots', machine: 'ladee', title: 'LADEE', year: 2014, face: 'curious', gesture: 'idle', lines: [
    { who: 'machine', machine: 'ladee', era: 'today', text: "I sniffed the Moon's very thin air and floating dust, flying lower and lower until I touched the far side." }] },
  { id: 'st-clps', hub: 'hub-robots', machine: 'odysseus', also: ['blue-ghost', 'athena'], title: 'Odysseus, Blue Ghost and Athena', year: 2025, face: 'cheeky', gesture: 'shrug', lines: [
    { who: 'machine', machine: 'odysseus', era: 'today', text: 'I landed on my side, but I still sent data home. The first American lander on the Moon in 52 years!' },
    { who: 'machine', machine: 'blue-ghost', era: 'today', text: 'I watched Earth cover the Sun from the Moon, then filmed a sunset before going to sleep.' },
    { who: 'machine', machine: 'athena', era: 'today', text: 'I came to drill for ice but fell into a crater. The Moon is still a hard place to land.' },
    { who: 'vimo', text: 'See? Landing on the Moon is still tricky, even today. Every try teaches us something.' }] },
  { id: 'st-mariner9', hub: 'hub-mariner', machine: 'mariner9', title: 'Mariner 9', year: 1971, face: 'amazed', gesture: 'idle', lines: [
    { who: 'machine', machine: 'mariner9', era: '70s', text: 'I arrived during a planet-wide dust storm. I waited... and then I saw the biggest volcano in the solar system appear.' },
    { who: 'vimo', text: 'Mariner 9 was the first spacecraft ever to orbit another planet. It mapped Mars and found dry riverbeds.' }] },
  { id: 'st-viking2', hub: 'hub-viking2', machine: 'viking2', title: 'Viking 2, frost on Mars', year: 1976, face: 'amazed', gesture: 'shiver', lines: [
    { who: 'machine', machine: 'viking2', era: '70s', text: "I'm Viking 1's twin. I saw frost on Mars: white ice on red rocks, far from home." }] },
  { id: 'st-mgs', hub: 'hub-orbiters', machine: 'mgs', title: 'Mars Global Surveyor', year: 1997, face: 'thinking', gesture: 'point', lines: [
    { who: 'machine', machine: 'mgs', era: '90s', text: 'For nine years I mapped every hill and valley of Mars, and found gullies that look like water made them.' }] },
  { id: 'st-mpl', hub: 'hub-orbiters', machine: 'mpl', title: 'Mars Polar Lander', year: 1999, face: 'thinking', gesture: 'shrug', lines: [
    { who: 'vimo', text: 'Not every landing works. In 1999, NASA lost contact with this lander. Engineers think its engines shut off too early. Nobody has clearly found it.' },
    { who: 'machine', machine: 'mpl', era: '90s', text: 'Nobody knows exactly where I am. My story taught engineers to test every tiny part twice.' }] },
  { id: 'st-odyssey', hub: 'hub-orbiters', machine: 'odyssey', title: '2001 Mars Odyssey', year: 2001, face: 'proud', gesture: 'thumbs', lines: [
    { who: 'machine', machine: 'odyssey', era: '90s', text: "I've been at Mars longer than any other spacecraft, passing messages from rovers back to Earth." },
    { who: 'vimo', text: "Odyssey also found ice under the surface. It's still working, but nearly out of fuel." }] },
  { id: 'st-spirit', hub: 'hub-spirit', machine: 'spirit', title: 'Spirit', year: 2004, face: 'surprised', gesture: 'cheer', lines: [
    { who: 'machine', machine: 'spirit', era: '90s', text: 'I got stuck in sand, and my broken wheel dug up a clue that Mars once had hot springs.' },
    { who: 'vimo', text: 'Spirit was also planned for 90 days and lasted six years. Even a broken wheel made a discovery!' }] },
  { id: 'st-mro', hub: 'hub-spirit', machine: 'mro', title: 'Mars Reconnaissance Orbiter', year: 2006, face: 'amazed', gesture: 'point', lines: [
    { who: 'machine', machine: 'mro', era: 'today', text: 'My camera is so sharp I can spot old landers and their parachutes lying on the ground. I can see things the size of a kitchen table!' }] },
  { id: 'st-phoenix', hub: 'hub-spirit', machine: 'phoenix', title: 'Phoenix', year: 2008, face: 'excited', gesture: 'shiver', lines: [
    { who: 'machine', machine: 'phoenix', era: 'today', text: 'I scraped the dirt and found real ice. I also carry a little DVD library for future Mars explorers to read.' },
    { who: 'vimo', text: "Maybe one day, someone on Mars will read Phoenix's library!" }] },
  { id: 'st-maven', hub: 'hub-maven', machine: 'maven', title: "MAVEN, where did Mars' air go?", year: 2014, face: 'curious', gesture: 'idle', lines: [
    { who: 'kid', text: "Why is Mars' air so thin?" },
    { who: 'machine', machine: 'maven', era: 'today', text: "I found out where Mars's air went. The Sun blew it away into space." },
    { who: 'vimo', text: 'NASA lost contact with MAVEN in December 2025, and the mission ended in June 2026.' }] },
  { id: 'st-marco', hub: 'hub-marco', machine: 'marco', title: 'MarCO-A and MarCO-B', year: 2018, face: 'cheeky', gesture: 'thumbs', lines: [
    { who: 'machine', machine: 'marco', era: 'today', text: "We're as small as a briefcase, but we flew to Mars and told Earth that InSight had landed safely." },
    { who: 'vimo', text: 'They were the first tiny CubeSats in deep space.' }] },
  { id: 'st-pioneer11', hub: 'hub-explorers', machine: 'pioneer11', title: 'Pioneer 11', year: 1979, face: 'excited', gesture: 'loop', lines: [
    { who: 'machine', machine: 'pioneer11', era: '70s', text: "I'm Pioneer 10's twin. I was the first visitor to Saturn's rings, and now I drift toward the stars with a message from Earth." }] },
  { id: 'st-apollo12-sivb', hub: 'hub-explorers', machine: 'apollo12-sivb', title: 'The "new asteroid"', year: 2002, face: 'surprised', gesture: 'shrug', lines: [
    { who: 'machine', machine: 'apollo12-sivb', era: '70s', text: 'In 2002 someone discovered a new asteroid near Earth. Surprise: it was me, a leftover Apollo rocket stage!' }] },
  { id: 'st-ulysses', hub: 'hub-explorers', machine: 'ulysses', title: 'Ulysses', year: 1994, face: 'excited', gesture: 'spin', lines: [
    { who: 'machine', machine: 'ulysses', era: '90s', text: "Every other spacecraft looks at the Sun's middle. I flew over its top and its bottom." }] },
  { id: 'st-near', hub: 'hub-explorers', machine: 'near', title: 'NEAR Shoemaker on Eros', year: 2001, face: 'happy', gesture: 'sit', lines: [
    { who: 'machine', machine: 'near', era: '90s', text: "I wasn't built to land, but I touched down gently on an asteroid anyway, and I'm still sitting on it." }] },
  { id: 'st-ds1', hub: 'hub-explorers', machine: 'ds1', title: 'Deep Space 1, the blue engine', year: 1998, face: 'thinking', gesture: 'idle', lines: [
    { who: 'machine', machine: 'ds1', era: '90s', text: 'My engine pushes as softly as a sheet of paper on your hand, but it never stops pushing.' }] },
  { id: 'st-stardust', hub: 'hub-explorers', machine: 'stardust', title: 'Stardust, catching comet dust', year: 2006, face: 'excited', gesture: 'cheer', lines: [
    { who: 'machine', machine: 'stardust', era: '90s', text: 'I caught comet dust in a foam lighter than air and sent it home in a capsule. Then I stayed behind.' }] },
  { id: 'st-spitzer', hub: 'hub-explorers', machine: 'spitzer', title: 'Spitzer, seeing in heat', year: 2017, face: 'amazed', gesture: 'idle', lines: [
    { who: 'machine', machine: 'spitzer', era: 'today', text: 'I saw the universe in heat instead of light, and helped find seven Earth-sized planets around one star.' }] },
  { id: 'st-messenger', hub: 'hub-explorers', machine: 'messenger', title: 'MESSENGER, ice on Mercury', year: 2015, face: 'surprised', gesture: 'point', lines: [
    { who: 'machine', machine: 'messenger', era: 'today', text: 'I found ice on Mercury, the planet closest to the Sun, hiding in craters where sunlight never reaches.' }] },
  { id: 'st-deepimpact', hub: 'hub-explorers', machine: 'deep-impact', title: 'Deep Impact, the comet egg', year: 2005, face: 'cheeky', gesture: 'thumbs', lines: [
    { who: 'machine', machine: 'deep-impact', era: 'today', text: 'I threw a copper ball at a comet to see what was inside, like cracking open a cosmic egg.' }] },
  { id: 'st-dawn', hub: 'hub-explorers', machine: 'dawn', title: 'Dawn, two worlds', year: 2018, face: 'gentle', gesture: 'loop', lines: [
    { who: 'machine', machine: 'dawn', era: 'today', text: 'I visited two worlds in the asteroid belt, and now I circle Ceres quietly, so I never touch it.' },
    { who: 'vimo', text: 'Those bright spots are salt!' }] },
  { id: 'st-kepler', hub: 'hub-explorers', machine: 'kepler', title: 'Kepler, the planet hunter', year: 2018, face: 'amazed', gesture: 'idle', lines: [
    { who: 'machine', machine: 'kepler', era: 'today', text: 'I stared at stars and waited for them to blink, and found thousands of new worlds.' }] },
  { id: 'st-dart', hub: 'hub-explorers', machine: 'dart', title: 'DART, pushing an asteroid', year: 2022, face: 'brave', gesture: 'thumbs', lines: [
    { who: 'machine', machine: 'dart', era: 'today', text: 'I crashed into an asteroid on purpose to prove humans can push one away if it ever heads for Earth.' }] },
];

export const hubById: Record<string, Hub> = Object.fromEntries(hubs.map((h) => [h.id, h]));
export const tripById: Record<string, SideTrip> = Object.fromEntries(sidetrips.map((t) => [t.id, t]));
