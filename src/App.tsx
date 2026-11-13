import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import Splash from './pages/Splash';
import { useStore } from './store';

// The story plays as one seamless film (Final version flow); the older scroll story with its
// side-trip hubs stays reachable from "Explore more" at /classic.
const SeamlessStory = lazy(() => import('./seamless/SeamlessStory'));
const Explore = lazy(() => import('./seamless/Explore'));
const MapPage = lazy(() => import('./seamless/MapPage'));
const StoryMode = lazy(() => import('./pages/StoryMode'));
const ExperienceCarousel = lazy(() => import('./pages/ExperienceCarousel'));
const ExperienceRoom = lazy(() => import('./pages/ExperienceRoom'));
const Logbook = lazy(() => import('./pages/Logbook'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Sources = lazy(() => import('./pages/Sources'));
const About = lazy(() => import('./pages/About'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Data = lazy(() => import('./pages/Data'));
const VimoLab = lazy(() => import('./pages/VimoLab'));
// development tool only: start frames for the Veo 3 clips (not in the built app)
const FrameStudio = import.meta.env.DEV ? lazy(() => import('./pages/FrameStudio')) : null;

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { if (pathname !== '/classic') window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Loading() {
  return <div className="loader" role="status"><div className="juggle">⭐<span>✨</span>⭐</div><p>VIMO is juggling stars while this part loads…</p></div>;
}

export default function App() {
  const lang = useStore((s) => s.lang);
  const reduced = useStore((s) => s.settings.reducedMotion);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { document.documentElement.classList.toggle('reduced', reduced); }, [reduced]);
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/story" element={<SeamlessStory />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/classic" element={<StoryMode />} />
          <Route path="/experience" element={<ExperienceCarousel />} />
          <Route path="/experience/:id" element={<ExperienceRoom />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/about" element={<About />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/data" element={<Data />} />
          <Route path="/vimo-lab" element={<VimoLab />} />
          {FrameStudio && <Route path="/frames" element={<FrameStudio />} />}
          <Route path="*" element={<Splash />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
