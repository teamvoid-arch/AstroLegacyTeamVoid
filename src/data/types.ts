// Shared types for every data file. Data files only use `import type`, so Node
// scripts (validate, generate-vo, build-sources) can import them directly.

export type World = 'earth' | 'moon' | 'mars' | 'deep';
export type StatusKind = 'working' | 'quiet' | 'once';
export type Path = 'main' | 'side';

export interface Source {
  title: string;
  url: string;
  /** true = the link was opened and the fact matched (by the team or the checker). */
  checked: boolean;
}

export interface Machine {
  id: string;
  name: string;
  year: string;
  world: World;
  site: string;
  /** Status line from the Story Script status card (dated). */
  status: string;
  kind: StatusKind;
  /** One discovery a kid can remember. */
  found: string;
  path: Path;
  /** NASA 3D model file in public/assets/models, or a procedural model id. */
  model?: string;
  /** true when the 3D model is NASA's own (exact or twin). */
  nasaModel?: boolean;
  modelNote?: string;
  /** NASA Image and Video Library id. */
  photo?: string;
  photoAlt?: string;
  sources: Source[];
  /** Extra honesty note shown on the card. */
  note?: string;
  /** Story beat id where this machine appears. */
  beat?: string;
}

export type Face =
  | 'excited' | 'curious' | 'amazed' | 'proud' | 'thinking' | 'cheeky' | 'surprised'
  | 'nervous' | 'sad' | 'gentle' | 'brave' | 'sleepy' | 'tears' | 'happy';

export type Gesture =
  | 'idle' | 'wave' | 'point' | 'salute' | 'cheer' | 'spin' | 'hop' | 'cover-eyes' | 'heart'
  | 'thumbs' | 'dizzy' | 'sleepy' | 'shiver' | 'logbook' | 'stamp' | 'bow' | 'crash' | 'listen'
  | 'shrug' | 'count' | 'loop' | 'whisper' | 'sit';

export type Grid =
  | 'top-left' | 'top' | 'top-right' | 'left' | 'centre' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type Speaker = 'vimo' | 'kid' | 'machine';

export interface Line {
  who: Speaker;
  text: string;
  /** For machine lines: which machine speaks (era voice filter). */
  machine?: string;
  /** Voice era for machine lines. */
  era?: '60s' | '70s' | '90s' | 'today';
}

export type Stage =
  | 'rooftop' | 'earth' | 'scale' | 'launch' | 'transfer' | 'moon' | 'moon-orbit' | 'solar'
  | 'mars-orbit' | 'mars' | 'deep' | 'pluto' | 'logbook';

export type MusicCue =
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8' | 'M9' | 'M10' | 'M11' | 'M12' | 'M13';

export type Era = '1960s' | '1970s' | '1990s' | '2000s' | 'today' | 'space';

export interface Choice {
  ask: string;
  answers: { label: string; reply: string; face?: Face }[];
}

export type TryItId =
  | 'ready' | 'travel' | 'ranger-fall' | 'soft-land' | 'missing-camera' | 'ring-moon' | 'find-ladder'
  | 'laser' | 'moon-jump' | 'mars-message' | 'drive-sojourner' | 'blueberries' | 'layers'
  | 'marsquake' | 'parachute-code' | 'fly-ingenuity' | 'count-tubes' | 'planet-parade'
  | 'golden-record' | 'pluto-heart' | 'find-leftovers' | 'sorting' | 'quiz';

export interface Beat {
  id: string;
  part: 1 | 2 | 3 | 4;
  scene: string;
  title: string;
  year: number;
  era: Era;
  stage: Stage;
  /** What sits at the centre of the 3D stage. */
  prop?: string;
  /** Effects the stage plays (scrubbed by scroll progress). */
  fx?: string[];
  label?: string;
  lines: Line[];
  face: Face;
  gesture?: Gesture;
  screen: Grid;
  size: Size;
  music: MusicCue;
  sfx?: string[];
  tryIt?: TryItId;
  /** Machine whose info card and stamp belong to this beat. */
  machine?: string;
  /** This beat stamps the machine in the logbook. */
  stamp?: boolean;
  choice?: Choice;
  hub?: string;
  /** Chapter end: show the calm break card. */
  breakAfter?: boolean;
  highFive?: boolean;
}

export interface SideTrip {
  id: string;
  hub: string;
  machine: string;
  title: string;
  lines: Line[];
  face: Face;
  gesture?: Gesture;
  tryIt?: string;
  /** Other machines stamped by this trip (e.g. the three 2024–25 landers). */
  also?: string[];
  year: number;
}

export interface Hub {
  id: string;
  title: string;
  line: string;
  trips: string[];
}
