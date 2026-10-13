// Loads every JSON file in src/content once and exposes typed-ish accessors.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..', '..');
export const SRC = path.join(ROOT, 'src');
const CONTENT = path.join(SRC, 'content');

const readJson = (...p) => JSON.parse(fs.readFileSync(path.join(...p), 'utf8'));

export const site = readJson(CONTENT, 'site.json');
export const home = readJson(CONTENT, 'home.json');
export const about = readJson(CONTENT, 'about.json');
export const founder = readJson(CONTENT, 'founder.json');
export const security = readJson(CONTENT, 'security.json');
export const pages = readJson(CONTENT, 'pages.json');
export const careers = readJson(CONTENT, 'careers.json');
export const solutions = readJson(CONTENT, 'solutions.json');
export const brand = readJson(SRC, 'assets', 'brand', 'brand.json');

export const products = fs
  .readdirSync(path.join(CONTENT, 'products'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => readJson(CONTENT, 'products', f))
  .sort((a, b) => a.order - b.order);

export const productBySlug = (slug) => {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown product slug: ${slug}`);
  return p;
};

/** Runtime build options (set by scripts/build.js from CLI flags). */
export const build = {
  noindex: false,
  date: new Date(),
  assets: { css: '/assets/css/main.css', js: '/assets/js/main.js' }, // replaced with hashed names by the build
};

/** Absolute URL for a site path. */
export const abs = (p = '/') => site.url.replace(/\/$/, '') + p;
