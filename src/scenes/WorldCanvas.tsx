import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Suspense, type ReactNode } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';

/*
  The real-time 3D world. Look: ACES filmic tone mapping in the renderer, with the
  vignette and film grain drawn as a CSS layer above the canvas (cheap on phones).
  We tested a GPU post-processing composer (bloom) but it blanked some scenes in
  testing, so it is not used; see README "Known limitations".
*/

/** Dev-only probe: writes renderer stats to a data attribute for automated checks. */
function Expose() {
  const s = useThree();
  useFrame(() => {
    if (Math.random() < 0.05) {
      document.documentElement.dataset.world = JSON.stringify({
        cam: s.camera.position.toArray().map((v) => +v.toFixed(1)),
        kids: s.scene.children.length, calls: s.gl.info.render.calls, tris: s.gl.info.render.triangles,
      });
    }
  });
  return null;
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

export function WorldCanvas({ children, className = '' }: { children: ReactNode; className?: string }) {
  const lite = useStore((s) => s.settings.lite);
  const setSettings = useStore((s) => s.setSettings);
  return (
    <>
      <Canvas
        className={`world-canvas ${className}`}
        shadows={!lite}
        dpr={[1, lite ? 1 : 1.5]}
        camera={{ fov: 45, near: 0.1, far: 2000, position: [0, 2, 10] }}
        gl={{ antialias: !lite, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <PerformanceMonitor onDecline={() => { if (!useStore.getState().settings.lite) setSettings({ lite: true }); }} flipflops={2}>
          {import.meta.env.DEV && <Expose />}
          <Suspense fallback={null}>{children}</Suspense>
        </PerformanceMonitor>
      </Canvas>
      {!lite && <div className="film" aria-hidden />}
    </>
  );
}

export const ERA_FILTER: Record<string, string> = {
  '1960s': 'grayscale(1) contrast(1.12) brightness(1.06)',
  '1970s': 'sepia(0.38) saturate(0.82) contrast(0.95) brightness(1.06)',
  '1990s': 'saturate(0.8) contrast(0.92) brightness(1.05) hue-rotate(-6deg)',
  '2000s': 'saturate(0.9) contrast(0.96) brightness(1.02)',
  today: 'none',
  space: 'none',
};
