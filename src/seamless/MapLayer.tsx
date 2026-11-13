/*
  Quick tours on the team's own map ("Where We Left Them", public/map/index.html, built for this spot):
  NASA's Moon and Mars globes with every hardware pinned and named at its real site, the mission card,
  the year slider and the deep-space chart, exactly as the team made it.
  The story drives it: the right world, then each machine in year order (the globe turns and flies to its
  pin, its card opens, the year moves on), while VIMO flies alongside and points.
*/
import { useEffect, useRef, useState } from 'react';
import { setVimo } from '../vimo/controller';
import { useStory } from './state';
import { BEATS, mapPinName, worldMachines } from './bridge';
import { quickChip } from './engine';

const TAB = { moon: 'moon', mars: 'mars', deep: 'space' } as const;

export function MapLayer() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const beat = BEATS[useStory((s) => s.beatIndex)];
  useStory((s) => s.lineTime); // re-check the machine on screen as the story clock moves
  const world = beat?.quick ?? null;
  const chip = world ? quickChip() : -1;
  const machine = world && chip >= 0 ? worldMachines(world)[chip] : null;
  const first = useRef(TAB[world ?? 'moon']);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.data?.type === 'al-map-ready') setReady(true); };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // tell the map which world, which machine and which year
  useEffect(() => {
    if (!ready || !world) return;
    const ms = worldMachines(world);
    const msg = machine
      ? { type: 'al-map', tab: TAB[world], year: machine.year, name: mapPinName(machine.id) }
      // while VIMO introduces the world: its first machine, so card and year agree from the start
      : { type: 'al-map', tab: TAB[world], year: ms[0]?.year ?? 1964, name: ms[0] ? mapPinName(ms[0].id) : undefined };
    frame.current?.contentWindow?.postMessage(msg, '*');
    // the story's own year counter (top bar) says the same year as the map
    useStory.getState().setYearOverride(msg.year);
  }, [ready, world, machine?.id]);
  useEffect(() => () => useStory.getState().setYearOverride(null), []);

  // VIMO flies alongside, switching sides for each machine and pointing at it
  useEffect(() => {
    if (chip < 0) return;
    setVimo({ screen: chip % 2 ? 'top-left' : 'top-right', size: 'S', gesture: 'point', face: 'excited' });
  }, [chip, world]);

  return (
    <iframe ref={frame} className="sl-map" title="Where We Left Them: map of NASA hardware"
      src={`${import.meta.env.BASE_URL}map/index.html?embed=1#${first.current}`} />
  );
}
