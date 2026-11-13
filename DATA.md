# DATA.md — datasets used in Astro Legacy

## NASA

| Dataset | Agency | Link | What we used | Where it appears |
|---|---|---|---|---|
| NASA Image and Video Library | NASA | https://images.nasa.gov/ (API: images-api.nasa.gov) | 52 photos, ids resolved to exact files with the official `asset` endpoint (`scripts/resolve-photos.ts` → `src/data/photos.json`) | Every info card; Ranger 7 slideshow; Viking's first photo; LRO Apollo 11 view (first screen); blueberries; Three Forks; Pale Blue Dot; planet parade |
| NASA 3D Resources | NASA | https://github.com/nasa/NASA-3D-Resources | 30 models, geometry unchanged (incl. SLS Block 1 3D-print model from https://science.nasa.gov/3d-resources/space-launch-system-sls-block-1/: print base plate removed and painted in SLS colours) (list in src/three/Machine.tsx `NASA_MODELS`), incl. MarCO from https://science.nasa.gov/resource/marco-3d-model/. Curiosity (.blend) and the STL prints (New Horizons, DART, sample tube) were exported to GLB in Blender, shape unchanged. InSight dust is a colour tint only. Seven main-story machines with no NASA model are shown as labelled Team VOID replicas (src/three/replicas.tsx), built from NASA photos and published sizes; they are not NASA models. | Story scenes, model viewer (“Spin it”), Experience carousel |
| NASA SVS CGI Moon Kit | NASA GSFC | https://svs.gsfc.nasa.gov/4720 | LRO-based Moon colour map (2048×1024 copy, `moon-nasa-map.jpg`, from the team's "Where We Left Them" map) | Every Moon globe, quick tour |
| NASA 3D Resources: Mars global map | NASA | https://github.com/nasa/NASA-3D-Resources | Global Mars colour map (1440×720, `mars-nasa-map.jpg`, from the team's "Where We Left Them" map) | Every Mars globe, quick tour |
| Landing / impact coordinates | NASA NSSDCA mission records + published lists (via the team's "Where We Left Them" map, checked Nov 2026) | https://nssdc.gsfc.nasa.gov | Lat/lon of each site; Voyager, Pioneer 10, New Horizons directions | Quick-tour pins (`src/seamless/sites.json`) |
| NASA NSSDCA Master Catalog | NASA GSFC | https://nssdc.gsfc.nasa.gov/nmc/ | Mission pages for 20 main-path missions (opened and matched 8 Nov 2026) | Source links on cards |
| NASA History Office | NASA | https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/ | Ranger 7 photo count | Ranger 7 card and beat |
| NASA Science: Voyager mission status | NASA | https://science.nasa.gov/?p=338314 | Voyager 1 one light-day on 18 Nov 2026; instruments still on | Voyager 1 card and beat |
| NASA JPL news | NASA JPL | https://www.jpl.nasa.gov/news/nasas-ingenuity-mars-helicopter-team-says-goodbye-for-now | Ingenuity's status as a stationary testbed | Ingenuity card and beat |
| Catalogue of Manmade Material on the Moon | NASA History Office | https://www.nasa.gov/wp-content/uploads/2024/02/final-catalogue-of-manmade-material-on-the-moon.pdf | Total of 796 objects (figure as given in the team's Challenge Brief; the PDF's embedded font could not be machine-read, so it awaits a fact-check by the team) | “How much is up there?” counter in the Logbook |
| NASA Blue Marble / Black Marble | NASA | https://visibleearth.nasa.gov/collection/1484/blue-marble | Earth day map and city lights (the copies packaged in the three.js examples) | Earth in every scene |
| Voyager Golden Record contents | NASA Science | https://science.nasa.gov/mission/voyager/golden-record-contents/ | Linked so kids can listen to NASA-released clips | Golden record TRY IT |

## Partner and third-party sources (not NASA)

| Source | Organisation | Link | What we used | Where |
|---|---|---|---|---|
| LROC Featured Sites | Arizona State University (LRO camera team) | https://www.lroc.asu.edu/featured_sites | Orbit views of Apollo hardware (credit line on the LRO photo) | LRO card, 2.8 TRY IT |
| HiRISE | University of Arizona (MRO camera team) | https://www.uahirise.org/ | Phoenix seen from orbit (MRO card) | MRO side trip |
| Ulysses | ESA + NASA | https://www.esa.int/ | Ulysses described as a joint NASA–ESA mission | Ulysses side trip |
| three.js example textures | three.js authors (MIT) | https://github.com/mrdoob/three.js | Packaging of NASA Earth textures | Earth |

## Our own (not data)

Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, the asteroid and the star field are original procedural shaders, not NASA maps. Landing-site coordinates for the glowing pins are approximate. Music, sound effects and VIMO are original.
