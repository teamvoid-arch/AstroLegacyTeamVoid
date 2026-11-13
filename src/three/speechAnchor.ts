/** Which machine is talking, and where it is on screen (page px), so its speech bubble can sit next to it. */
export const machineSpeech = {
  id: null as string | null,
  line: null as null | { key: string; text: string; name: string },
  anchor: { x: -999, y: -999, r: 0, t: 0 },   // top of the machine on screen; t = when last measured (ms)
};
