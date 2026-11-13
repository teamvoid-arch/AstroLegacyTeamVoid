// Resolves each machine's NASA Image Library id to exact image URLs using the
// official images-api.nasa.gov "asset" endpoint, and writes src/data/photos.json.
// Run: node scripts/resolve-photos.ts
import { writeFileSync } from 'node:fs';
import { machines, PLANET_PHOTOS } from '../src/data/machines.ts';

const out: Record<string, { medium: string; thumb: string; page: string; title?: string }> = {};
const ids = [...new Set(machines.map((m) => m.photo).filter(Boolean))] as string[];
ids.push(...PLANET_PHOTOS.map((p) => p.photo), 'PIA22329', 'PIA12889', 'PIA00618', 'PIA25286', 'PIA24591', 'PIA00452', 'PIA01492', 'PIA02975', 'PIA02974');

for (const id of [...new Set(ids)]) {
  try {
    const r = await fetch(`https://images-api.nasa.gov/asset/${encodeURIComponent(id)}`);
    if (!r.ok) throw new Error(String(r.status));
    const j: any = await r.json();
    const hrefs: string[] = j.collection.items.map((i: any) => i.href);
    const pick = (s: string) => hrefs.find((h) => h.toLowerCase().includes(s));
    const medium = pick('~medium.jpg') || pick('~large.jpg') || pick('~small.jpg') || pick('~orig.jpg');
    const thumb = pick('~thumb.jpg') || pick('~small.jpg') || medium;
    const meta = await fetch(`https://images-api.nasa.gov/search?nasa_id=${encodeURIComponent(id)}`).then((x) => x.json()).catch(() => null) as any;
    const title = meta?.collection?.items?.[0]?.data?.[0]?.title;
    if (!medium) throw new Error('no jpg');
    out[id] = { medium: medium.replace('http://', 'https://'), thumb: (thumb || medium).replace('http://', 'https://'), page: `https://images.nasa.gov/details/${id}`, title };
    console.log('ok', id, title);
  } catch (e) {
    console.log('FAIL', id, (e as Error).message);
  }
}
writeFileSync(new URL('../src/data/photos.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(`wrote ${Object.keys(out).length} photos`);
