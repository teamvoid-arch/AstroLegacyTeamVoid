import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Bounds } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Machine } from '../three/Machine';
import { machineById } from '../data/machines';
import { Modal } from './common';
import { useStore } from '../store';
import { audio } from '../audio/engine';
import { useT } from '../data/i18n';

/** Hidden details from the Story Script's 3D table. Positions are approximate (metres). */
export const FINDS: Record<string, { label: string; ask: string; pos: [number, number, number]; info: string }> = {
  'apollo11-eagle': { label: 'the ladder', ask: 'Spin it! Can you find the ladder Neil Armstrong climbed down?', pos: [0, 1.4, 3.1], info: 'The ladder is on the front leg. The first Moon walkers climbed down it in July 1969.' },
  'apollo17-challenger': { label: 'the plaque', ask: 'Spin the lunar module and tap the plaque on its leg.', pos: [0, 1.6, 2.6], info: 'Each Apollo lander that landed carried a plaque on a leg of its bottom half.' },
  viking1: { label: 'the scooping arm', ask: 'Find the robot arm it used to scoop the soil!', pos: [0.9, 0.7, 0.8], info: 'Viking’s arm scooped soil and dropped it into the lander’s little lab.' },
  perseverance: { label: 'the drill', ask: 'Find the drill on its arm!', pos: [0, 0.9, 1.6], info: 'The drill at the end of the arm cuts out rock cores that are sealed in tubes.' },
  ingenuity: { label: 'the solar panel', ask: 'Find the solar panel on top. That’s how it charged up!', pos: [0, 1.0, 0], info: 'The solar panel on top charged Ingenuity’s batteries every day.' },
  opportunity: { label: 'the solar panels', ask: 'Find the solar panels. Dust on them was its biggest problem!', pos: [0, 1.25, 0], info: 'Opportunity made its power from sunlight. Wind sometimes blew the dust off its panels.' },
  voyager1: { label: 'the golden record', ask: 'Find the golden record!', pos: [0.2, 0.3, 0.4], info: 'The golden record carries sounds and pictures from Earth.' },
  lro: { label: 'the camera', ask: 'Find the camera that photographs the Apollo sites.', pos: [0, 1.6, 1.4], info: 'LRO’s camera can see the Apollo landers and the astronauts’ footpaths from orbit.' },
  pioneer10: { label: 'the big dish', ask: 'Find the big dish that talked to Earth.', pos: [0, 1.5, 0], info: 'The dish antenna sent Pioneer 10’s messages home until 2003.' },
};

function Hotspot({ pos, onFind }: { pos: [number, number, number]; onFind: () => void }) {
  return (
    <mesh position={pos} onClick={(e) => { e.stopPropagation(); onFind(); }}>
      <sphereGeometry args={[0.22, 16, 12]} />
      <meshBasicMaterial color="#FFC94D" transparent opacity={0.75} toneMapped={false} />
    </mesh>
  );
}

function Fit() {
  const { camera } = useThree();
  camera.position.set(5, 3, 6);
  return null;
}

export function ModelViewer() {
  const mv = useStore((s) => s.modelViewer);
  const openModel = useStore((s) => s.openModel);
  const [found, setFound] = useState(false);
  const [touched, setTouched] = useState(false);
  const t = useT();
  if (!mv) return null;
  const m = machineById[mv.machine];
  const find = mv.find ? FINDS[mv.find] : FINDS[mv.machine];
  const close = () => { setFound(false); setTouched(false); openModel(null); };
  return (
    <Modal onClose={close} label={`${m.name} in 3D`} className="modal-wide">
      <h2>{m.name}</h2>
      <p className="muted">{m.nasaModel ? t('modelNasa') : t('modelOwn')} · {m.modelNote}</p>
      <div className="viewer" onPointerDown={() => setTouched(true)}>
        <Canvas camera={{ fov: 40, position: [5, 3, 6] }} dpr={[1, 1.5]}>
          <color attach="background" args={['#0B1033']} />
          <hemisphereLight args={['#dfe9ff', '#3a3450', 1]} />
          <directionalLight position={[5, 8, 6]} intensity={2.6} color="#FFF1D6" />
          <directionalLight position={[-6, 3, -6]} intensity={1.4} color="#7FB2FF" />
          <Fit />
          <Suspense fallback={<Html center><div className="loader-small">Loading model…</div></Html>}>
            <Bounds fit clip observe margin={1.25}>
              <group>
                <Machine id={mv.machine} />
                {find && !found && <Hotspot pos={find.pos} onFind={() => { setFound(true); audio.sfx('success'); }} />}
              </group>
            </Bounds>
          </Suspense>
          <OrbitControls makeDefault autoRotate={!touched} autoRotateSpeed={3} enablePan={false} minDistance={0.5} maxDistance={60} />
        </Canvas>
        {!touched && <div className="hand-hint" aria-hidden>👆 drag to spin</div>}
      </div>
      {find && <p className="find">{found ? <>✅ <b>You found {find.label}!</b> {find.info}</> : <>🔎 {find.ask}</>}</p>}
      <p className="tiny">{t('basedOn')}. Drag to spin, pinch or scroll to zoom.</p>
    </Modal>
  );
}
