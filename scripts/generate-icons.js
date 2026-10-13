#!/usr/bin/env node
/**
 * Regenerates every raster brand asset from the SVG logos in src/assets/brand:
 *   src/static/favicon.svg, favicon.ico, apple-touch-icon.png
 *   src/assets/icons/icon-192.png, icon-512.png, icon-maskable-512.png
 *   src/assets/og/samuhia-og.png  (1200×630 social share image)
 * Requires the dev dependency `sharp`  →  npm install
 * Run after changing a logo:  npm run icons
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = path.join(ROOT, 'src', 'assets', 'brand');
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Missing dependency "sharp". Run:  npm install');
  process.exit(1);
}

const read = (f) => fs.readFileSync(path.join(BRAND, f), 'utf8');
const out = (...p) => {
  const f = path.join(ROOT, ...p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
};
const png = async (svg, size, file) => sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toFile(out(...file));
const dataUri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');

const icon = read('samuhia-icon.svg');
fs.writeFileSync(out('src', 'static', 'favicon.svg'), icon);

await png(icon, 180, ['src', 'static', 'apple-touch-icon.png']);
await png(icon, 192, ['src', 'assets', 'icons', 'icon-192.png']);
await png(icon, 512, ['src', 'assets', 'icons', 'icon-512.png']);

// Maskable: full-bleed dark square with the symbol inside the safe zone (~60%).
const symbolInner = icon.match(/<g transform[\s\S]*<\/g>/)[0];
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0B1210"/><g transform="translate(100 100) scale(0.78) translate(-100 -100)">${symbolInner}</g></svg>`;
await png(maskable, 512, ['src', 'assets', 'icons', 'icon-maskable-512.png']);

// favicon.ico (PNG-in-ICO: 16, 32, 48)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(icon), { density: 384 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
fs.writeFileSync(out('src', 'static', 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

// Open Graph image 1200×630: reversed master lockup + the five product icons.
const keys = ['plot-yangu', 'myregister', 'mychama', 'desk', 'payments'];
const lock = dataUri(read('samuhia-lockup-reversed.svg'));
const tile = 112, gap = 28, rowW = keys.length * tile + (keys.length - 1) * gap, x0 = (1200 - rowW) / 2;
const og = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="g" cx="78%" cy="40%" r="60%"><stop offset="0" stop-color="#2BA383" stop-opacity=".22"/><stop offset="1" stop-color="#2BA383" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0H0V72" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern></defs>
<rect width="1200" height="630" fill="#0B1210"/><rect width="1200" height="630" fill="url(#grid)"/><rect width="1200" height="630" fill="url(#g)"/>
<image x="${(1200 - 860) / 2}" y="120" width="860" height="${Math.round((860 / 619) * 176)}" xlink:href="${lock}"/>
<rect x="${(1200 - 120) / 2}" y="330" width="120" height="3" rx="1.5" fill="#D9993A"/>
${keys.map((k, i) => `<image x="${x0 + i * (tile + gap)}" y="400" width="${tile}" height="${tile}" xlink:href="${dataUri(read(k + '-icon.svg'))}"/>`).join('\n')}
</svg>`;
fs.writeFileSync(out('src', 'assets', 'og', 'samuhia-og.svg'), og);
await sharp(Buffer.from(og), { density: 144 }).resize(1200, 630).png({ compressionLevel: 9 }).toFile(out('src', 'assets', 'og', 'samuhia-og.png'));

console.log('✔ Icons, favicon.ico and Open Graph image regenerated.');
