// Generates SOURCES.md from src/data/machines.ts (run: npm run sources).
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { machines } from '../src/data/machines.ts';

const photos = JSON.parse(readFileSync(fileURLToPath(new URL('../src/data/photos.json', import.meta.url)), 'utf8'));
const W: Record<string, string> = { moon: 'The Moon', mars: 'Mars', deep: 'Deep space' };
let md = `# SOURCES — Astro Legacy\n\nGenerated from \`src/data/machines.ts\` by \`npm run sources\`. Every fact in the app comes from the team's Story Script; each machine card links to the sources below.\n\n`;
md += `- **Machines:** ${machines.length} cards (${machines.filter((m) => m.path === 'main').length} main path, ${machines.filter((m) => m.path === 'side').length} side trips)\n`;
const all = machines.flatMap((m) => m.sources);
md += `- **Source links:** ${all.length} (${all.filter((s) => s.checked).length} opened and matched by name on 8 Nov 2026; the rest come from the team's Hardware Atlas and await the fact-checker)\n`;
md += `- **Photos:** ${Object.keys(photos).length} NASA Image and Video Library items, resolved with the official images-api.nasa.gov asset endpoint\n\n`;
md += `Legend: ✓ = link checked · ☐ = awaiting fact-check\n\n`;
for (const w of ['moon', 'mars', 'deep']) {
  md += `## ${W[w]}\n\n`;
  for (const m of machines.filter((x) => x.world === w)) {
    md += `### ${m.name} (${m.year}) — ${m.path === 'main' ? 'main story' : 'side trip'}\n\n`;
    md += `- **Status:** ${m.status}\n- **What it found:** ${m.found}\n`;
    if (m.note) md += `- **Note:** ${m.note}\n`;
    for (const s of m.sources) md += `- ${s.checked ? '✓' : '☐'} [${s.title}](${s.url})\n`;
    if (m.photo && photos[m.photo]) md += `- 📷 Photo: [${photos[m.photo].title || m.photo} (${m.photo})](${photos[m.photo].page})\n`;
    if (m.model) md += `- 🧊 3D: ${m.nasaModel ? `NASA 3D Resources model (${m.model}.glb, geometry unchanged)` : 'simple model by Team VOID'}\n`;
    md += '\n';
  }
}
writeFileSync(fileURLToPath(new URL('../SOURCES.md', import.meta.url)), md);
console.log('SOURCES.md written');
