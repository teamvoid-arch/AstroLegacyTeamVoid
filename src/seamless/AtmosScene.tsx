/*
  After lift-off (team script §2): we pass through Earth's atmosphere and the ozone layer, and space opens up.
  Day side of Earth (this app's Earth texture), the camera pulls back as the story clock runs (live.t):
  first the thin blue air, then a faint second shell for the ozone layer, then all of space.
  The shells are an illustration (not to scale), drawn with this app's Atmosphere glow.
*/
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { live } from '../store';
import { Atmosphere, Earth, Stars } from '../three/world';

export function AtmosScene() {
  const ozone = useRef<THREE.Mesh>(null!);
  useFrame(({ camera }) => {
    const t = live.t;
    const e = t * t * (3 - 2 * t);
    // start skimming the glowing edge of the sky, end far out with the whole planet in view
    camera.position.set(-1.2 + e * 1.2, 5.6 - e * 2.4, 3.2 + e * 16);
    camera.lookAt(0, 3.6 - e * 3.6, 0);
    // the ozone shell glows most while its label is up (the middle third)
    const m = ozone.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.05 + 0.18 * Math.max(0, 1 - Math.abs(t - 0.5) * 3);
  });
  return (
    <>
      <color attach="background" args={['#02030a']} />
      <Stars />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 10]} intensity={2.4} color="#fff6e8" />
      <Earth radius={5} rot={[0.35, 0.6, 0]} spin={0.01} sunDir={[0.35, 0.55, 1]} />
      <Atmosphere radius={5.18} color="#6fb6ff" power={3} intensity={1.4} />
      <mesh ref={ozone}>
        <sphereGeometry args={[5.42, 64, 48]} />
        <meshBasicMaterial color="#9fe6ff" transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  );
}
