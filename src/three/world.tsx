import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { noise2, rng } from './materials';

const tex = (url: string) => {
  const t = new THREE.TextureLoader().load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};
const cache: Record<string, THREE.Texture> = {};
export const getTex = (url: string) => (cache[url] ||= tex(url));

/** Procedural star field (lite mode uses fewer stars). */
export function Stars({ count = 3500, radius = 600, tint = '#ffffff' }: { count?: number; radius?: number; tint?: string }) {
  const geo = useMemo(() => {
    const r = rng(7);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rr = radius * (0.8 + r() * 0.2);
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(th) * s * rr, u * rr, Math.sin(th) * s * rr], i * 3);
      c.set(tint).lerp(new THREE.Color(r() < 0.3 ? '#9fc2ff' : r() < 0.5 ? '#ffe2b0' : '#ffffff'), 0.6);
      const b = 0.35 + r() * 0.65;
      col.set([c.r * b, c.g * b, c.b * b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [count, radius, tint]);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.003; });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={1.6} sizeAttenuation={false} vertexColors transparent opacity={0.95} depthWrite={false} toneMapped={false} />
    </points>
  );
}

/** Earth with NASA Blue Marble day map and Black Marble city lights on the night side. */
export function Earth({ radius = 5, rot = [0.2, -1.4, 0], spin = 0.02, sunDir = [1, 0.2, 0.6], ...props }: JSX.IntrinsicElements['group'] & { radius?: number; rot?: [number, number, number]; spin?: number; sunDir?: [number, number, number] }) {
  const mat = useMemo(() => {
    const day = getTex('assets/textures/earth.jpg');
    const night = getTex('assets/textures/earth-night.png');
    return new THREE.ShaderMaterial({
      uniforms: { day: { value: day }, night: { value: night }, sun: { value: new THREE.Vector3(...sunDir).normalize() } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform sampler2D day; uniform sampler2D night; uniform vec3 sun; varying vec2 vUv; varying vec3 vN;
        void main(){ float d=dot(normalize(vN),sun); float k=smoothstep(-0.15,0.25,d);
          vec3 dc=texture2D(day,vUv).rgb*(0.25+0.95*max(d,0.)); vec3 nc=texture2D(night,vUv).rgb*vec3(1.,0.85,0.6)*1.6;
          gl_FragColor=vec4(mix(nc,dc,k),1.);
          #include <colorspace_fragment>
        }`,
    });
  }, []);
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += dt * spin; });
  return (
    <group {...props}>
      <group rotation={rot}><mesh ref={ref} material={mat}><sphereGeometry args={[radius, 64, 48]} /></mesh></group>
      <Atmosphere radius={radius * 1.035} color="#4aa3ff" />
    </group>
  );
}

export function Atmosphere({ radius, color, power = 3, intensity = 1.2 }: { radius: number; color: string; power?: number; intensity?: number }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(color) }, p: { value: power }, i: { value: intensity } },
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 c; uniform float p; uniform float i; varying vec3 vN; varying vec3 vV; void main(){ float f=pow(1.-max(dot(vN,vV),0.),p); gl_FragColor=vec4(c*i,f); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide,
  }), [color, power, intensity]);
  return <mesh material={mat}><sphereGeometry args={[radius, 48, 32]} /></mesh>;
}

/** The Moon with the NASA SVS CGI Moon Kit colour map (LRO; 2048×1024 copy from the team's "Where We Left Them" map). */
export function MoonGlobe({ radius = 5, spin = 0.01, glow = 0, ...props }: JSX.IntrinsicElements['group'] & { radius?: number; spin?: number; glow?: number }) {
  const map = getTex('assets/textures/moon-nasa-map.jpg');
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * spin; });
  return (
    <group {...props}>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 64, 48]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} emissive={glow ? '#ffffff' : '#000000'} emissiveMap={glow ? map : null} emissiveIntensity={glow} />
      </mesh>
    </group>
  );
}

/** Lat/lon (degrees) → point on a three.js sphere with an equirectangular map. */
export function latLon(lat: number, lon: number, r: number) {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const th = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(-Math.cos(phi) * Math.sin(th) * r, Math.cos(th) * r, Math.sin(phi) * Math.sin(th) * r);
}

/** Procedural planets (original shader art, not a NASA map; labelled in DATA.md). */
const PLANET_FRAG = `
uniform int kind; uniform float time; uniform vec3 sun; varying vec3 vP; varying vec3 vN; varying vec2 vUv;
float h(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float n3(vec3 p){ vec3 i=floor(p); vec3 f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*n3(p); p*=2.03; a*=.5;} return s; }
void main(){
  vec3 p=normalize(vP); vec3 col;
  if(kind==0){ // Mars
    float n=fbm(p*3.5); float m=fbm(p*9.+3.);
    col=mix(vec3(.55,.24,.12),vec3(.82,.45,.25),n); col=mix(col,vec3(.35,.17,.1),smoothstep(.55,.7,m)*.6);
    col=mix(col,vec3(.95,.93,.9),smoothstep(.86,.93,abs(p.y)));
  } else if(kind==1){ // Jupiter
    float b=p.y*9.+fbm(p*vec3(2.,6.,2.)+time*.01)*2.2; col=mix(vec3(.85,.72,.55),vec3(.62,.43,.3),.5+.5*sin(b));
    col=mix(col,vec3(.95,.92,.85),smoothstep(.6,.9,sin(b*1.7))*.4);
    float spot=smoothstep(.16,.07,length(vec2((atan(p.z,p.x)-1.)*.5,(p.y+.32)*1.6))); col=mix(col,vec3(.75,.35,.22),spot);
  } else if(kind==2){ // Saturn
    float b=p.y*7.+fbm(p*4.)*.8; col=mix(vec3(.9,.82,.62),vec3(.78,.66,.46),.5+.5*sin(b));
  } else if(kind==3){ col=mix(vec3(.62,.86,.88),vec3(.7,.9,.92),fbm(p*3.)); // Uranus
  } else if(kind==4){ float b=p.y*5.+fbm(p*3.)*1.5; col=mix(vec3(.18,.35,.85),vec3(.28,.48,.95),.5+.5*sin(b)); // Neptune
  } else if(kind==5){ // Pluto, with a pale heart (Tombaugh Regio) facing +z
    float n=fbm(p*4.); col=mix(vec3(.55,.42,.33),vec3(.78,.66,.55),n);
    vec2 q=vec2(p.x*1.25, p.y*1.25+0.08); q.y=-q.y;
    float a=atan(q.x,q.y)/3.14159; float r=length(q); float hr=0.36*(1.0-abs(a))*(0.6+0.4*abs(a)) + 0.1;
    float heart=smoothstep(hr+.03,hr-.02,r)*step(0.,p.z);
    col=mix(col,vec3(.96,.93,.88),heart);
  } else if(kind==6){ col=mix(vec3(.45,.43,.42),vec3(.62,.6,.58),fbm(p*5.)); // asteroid
  } else { col=vec3(1.,.78,.35)+fbm(p*6.+time*.05)*.3; gl_FragColor=vec4(col*1.6,1.); return; } // Sun
  float d=max(dot(normalize(vN),sun),0.); gl_FragColor=vec4(col*(0.08+0.95*d),1.);
  #include <colorspace_fragment>
}`;
const KINDS: Record<string, number> = { mars: 0, jupiter: 1, saturn: 2, uranus: 3, neptune: 4, pluto: 5, asteroid: 6, sun: 7 };

export function ProcPlanet({ kind, radius = 5, spin = 0.02, sun = [1, 0.3, 0.6], rings, ...props }: JSX.IntrinsicElements['group'] & { kind: string; radius?: number; spin?: number; sun?: [number, number, number]; rings?: boolean }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { kind: { value: KINDS[kind] ?? 0 }, time: { value: 0 }, sun: { value: new THREE.Vector3(...sun).normalize() } },
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec2 vUv; void main(){ vP=position; vUv=uv; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: PLANET_FRAG,
  }), [kind]);
  const ref = useRef<THREE.Mesh>(null!);
  // Mars wears NASA's real global map (NASA 3D Resources), lit by the scene; the other planets keep the painted shader
  const marsMap = kind === 'mars' ? getTex('assets/textures/mars-nasa-map.jpg') : null;
  useFrame((s, dt) => { ref.current.rotation.y += dt * spin; mat.uniforms.time.value = s.clock.elapsedTime; });
  return (
    <group {...props}>
      {marsMap ? (
        // a faint self-light from the same map, so the night side never turns pitch black
        <mesh ref={ref}><sphereGeometry args={[radius, 64, 48]} /><meshStandardMaterial map={marsMap} roughness={0.95} metalness={0} emissive="#ffffff" emissiveMap={marsMap} emissiveIntensity={0.28} /></mesh>
      ) : (
        <mesh ref={ref} material={mat}><sphereGeometry args={[radius, 64, 48]} /></mesh>
      )}
      {kind === 'mars' && <Atmosphere radius={radius * 1.03} color="#ff9a6a" power={4} intensity={0.6} />}
      {(kind === 'neptune' || kind === 'uranus') && <Atmosphere radius={radius * 1.03} color="#8fd8ff" power={4} intensity={0.5} />}
      {rings && (
        <mesh rotation={[-Math.PI / 2 + 0.45, 0, 0]}>
          <ringGeometry args={[radius * 1.25, radius * 2.2, 96]} />
          <meshStandardMaterial color="#d8c69a" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/** Procedural ground with craters (Moon) or rocks (Mars). */
export function Ground({ world, size = 220, seed = 3, crater = false }: { world: 'moon' | 'mars'; size?: number; seed?: number; crater?: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, 160, 160);
    g.rotateX(-Math.PI / 2);
    const n = noise2(seed);
    const r = rng(seed);
    const craters = Array.from({ length: world === 'moon' ? 40 : 8 }, () => ({ x: (r() - 0.5) * size, z: (r() - 0.5) * size, rad: 2 + r() * (world === 'moon' ? 14 : 6) }));
    if (crater) craters.push({ x: 0, z: 0, rad: 13 });
    const pos = g.attributes.position as THREE.BufferAttribute;
    const col = new Float32Array(pos.count * 3);
    const base = new THREE.Color(world === 'moon' ? '#8d8f94' : '#b5623a');
    const alt = new THREE.Color(world === 'moon' ? '#b4b6ba' : '#d9875a');
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const dist = Math.hypot(x, z);
      let y = (n(x * 0.04, z * 0.04) - 0.45) * (world === 'moon' ? 2.2 : 3.2) * Math.min(1, dist / 18);
      for (const k of craters) {
        const d = Math.hypot(x - k.x, z - k.z) / k.rad;
        if (d < 1.4) y += d < 1 ? -(1 - d * d) * k.rad * 0.12 : Math.sin((d - 1) / 0.4 * Math.PI) * k.rad * 0.04;
      }
      y += Math.max(0, dist - 70) * 0.04 * (world === 'mars' ? 1.5 : 0.6) * n(x * 0.01 + 4, z * 0.01);
      pos.setY(i, y);
      c.copy(base).lerp(alt, n(x * 0.15 + 9, z * 0.15) * 1.1);
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    return g;
  }, [world, size, seed, crater]);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.97} metalness={0} />
    </mesh>
  );
}

export function Rocks({ count = 120, spread = 60, color = '#7a3b22', seed = 5 }: { count?: number; spread?: number; color?: string; seed?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useMemo(() => {
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const r = rng(seed); const o = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        const a = r() * Math.PI * 2, d = 4 + r() * spread;
        o.position.set(Math.cos(a) * d, -0.05, Math.sin(a) * d);
        const s = 0.08 + Math.pow(r(), 3) * 0.9;
        o.scale.set(s, s * (0.5 + r() * 0.5), s * (0.7 + r() * 0.6));
        o.rotation.set(r() * 3, r() * 3, r() * 3);
        o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    });
  }, [count, spread, seed]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </instancedMesh>
  );
}

/** Gradient sky dome (Mars butterscotch day, sunset, launch-pad sunrise). */
export function SkyDome({ top, bottom, sunDir = [0.4, 0.1, -1], sunColor = '#ffffff', sun = 0 }: { top: string; bottom: string; sunDir?: [number, number, number]; sunColor?: string; sun?: number }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color(top) }, bottom: { value: new THREE.Color(bottom) }, sd: { value: new THREE.Vector3(...sunDir).normalize() }, sc: { value: new THREE.Color(sunColor) }, s: { value: sun } },
    vertexShader: `varying vec3 vD; void main(){ vD=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sd; uniform vec3 sc; uniform float s; varying vec3 vD;
      void main(){ float k=smoothstep(-0.05,0.6,vD.y); vec3 c=mix(bottom,top,k); float g=pow(max(dot(vD,sd),0.),40.)*s+pow(max(dot(vD,sd),0.),4.)*s*.35; gl_FragColor=vec4(c+sc*g,1.);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, depthWrite: false,
  }), []);
  mat.uniforms.top.value.set(top); mat.uniforms.bottom.value.set(bottom); mat.uniforms.s.value = sun;
  mat.uniforms.sc.value.set(sunColor); mat.uniforms.sd.value.set(...sunDir).normalize();
  return <mesh material={mat} renderOrder={-1}><sphereGeometry args={[480, 32, 16]} /></mesh>;
}

/** Floating dust (Moon, Mars storm, jetpack): gentle, never flashing. */
export function Dust({ count = 400, area = 40, height = 8, color = '#d9a27a', speed = 0.4, size = 0.08, opacity = 0.6 }: { count?: number; area?: number; height?: number; color?: string; speed?: number; size?: number; opacity?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const r = rng(11); const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) p.set([(r() - 0.5) * area, r() * height, (r() - 0.5) * area], i * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g;
  }, [count, area, height]);
  useFrame((_, dt) => {
    const a = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < a.count; i++) {
      let x = a.getX(i) + dt * speed * 2.5; if (x > area / 2) x -= area;
      a.setX(i, x); a.setY(i, (a.getY(i) + dt * speed * 0.2) % height);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} depthWrite={false} />
    </points>
  );
}

/** Expanding ground ripples (moonquake, marsquake). */
export function Ripples({ active, color = '#FFC94D', ...props }: JSX.IntrinsicElements['group'] & { active: number; color?: string }) {
  const rings = [useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!)];
  const start = useRef(-10);
  const last = useRef(active);
  useFrame(({ clock }) => {
    if (active !== last.current) { last.current = active; start.current = clock.elapsedTime; }
    const e = clock.elapsedTime - start.current;
    rings.forEach((r, i) => {
      const k = (e - i * 0.7) / 3.2;
      r.current.visible = k > 0 && k < 1;
      r.current.scale.setScalar(1 + k * 25);
      (r.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.55;
    });
  });
  return (
    <group {...props}>
      {rings.map((r, i) => (
        <mesh key={i} ref={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} visible={false}>
          <ringGeometry args={[0.9, 1, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Dotted curved path (Earth→Moon, Earth→Mars). */
export function DottedArc({ points, color = '#FFC94D', progress = 1, size = 0.25 }: { points: THREE.Vector3[]; color?: string; progress?: number; size?: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const dots = useMemo(() => curve.getSpacedPoints(80), [curve]);
  const n = Math.floor(dots.length * progress);
  return (
    <group>
      {dots.slice(0, n).map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[size, 8, 6]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      ))}
    </group>
  );
}

/** A glowing pin (landing sites on a globe). */
export function Pin({ position, color = '#FFC94D', pulse = true }: { position: THREE.Vector3; color?: string; pulse?: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { if (pulse) ref.current.scale.setScalar(1 + 0.25 * Math.sin(clock.elapsedTime * 2 + position.x)); });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 12, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export function useTextureSafe(url: string) { return useLoader(THREE.TextureLoader, url); }
