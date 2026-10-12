import fs from 'node:fs';
import path from 'node:path';
import { site, abs } from '../../src/lib/data.js';

const attrs = (html, name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, 'g'))].map((m) => m[1]);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

/** Post-build checks: metadata quality, JSON-LD validity, internal links & anchors. */
export const validate = ({ out, pages }) => {
  const errors = [];
  const warnings = [];
  const titles = new Map();
  const descs = new Map();

  const resolve = (href) => {
    const clean = href.split('#')[0].split('?')[0];
    const rel = clean.endsWith('/') ? clean + 'index.html' : clean;
    return path.join(out, rel);
  };

  for (const page of pages) {
    const file = page.file || path.posix.join(page.path, 'index.html');
    const html = fs.readFileSync(path.join(out, file), 'utf8');
    const where = page.path;

    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) errors.push(`${where}: expected exactly 1 <h1>, found ${h1s}`);

    const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || '');
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
    if (!page.isNotFound && !page.noindex) {
      if (title.length > 65) warnings.push(`${where}: title is ${title.length} chars (aim ≤ 60)`);
      if (desc.length > 165) warnings.push(`${where}: description is ${desc.length} chars (aim ≤ 160)`);
      if (desc.length < 70) warnings.push(`${where}: description is short (${desc.length} chars)`);
      if (titles.has(title)) errors.push(`${where}: duplicate <title> with ${titles.get(title)}`);
      if (descs.has(desc)) errors.push(`${where}: duplicate description with ${descs.get(desc)}`);
      titles.set(title, where);
      descs.set(desc, where);
    }

    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(m[1]);
      } catch (e) {
        errors.push(`${where}: invalid JSON-LD (${e.message})`);
      }
    }

    const ids = new Set(attrs(html, 'id'));
    const refs = [...attrs(html, 'href'), ...attrs(html, 'src')].map(decode);
    for (const ref of refs) {
      if (ref.startsWith('#')) {
        if (ref.length > 1 && !ids.has(ref.slice(1))) errors.push(`${where}: broken anchor ${ref}`);
      } else if (ref.startsWith('/') && !ref.startsWith('//')) {
        if (!fs.existsSync(resolve(ref))) errors.push(`${where}: broken link ${ref}`);
      } else if (ref.startsWith(site.url) ) {
        const p = ref.slice(site.url.length) || '/';
        if (!fs.existsSync(resolve(p))) errors.push(`${where}: broken absolute link ${ref}`);
      }
    }
  }

  // sitemap entries must exist
  const sm = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
  for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = m[1].replace(abs('/').slice(0, -1), '') || '/';
    if (!fs.existsSync(resolve(p))) errors.push(`sitemap: ${m[1]} does not exist`);
  }
  return { errors, warnings };
};
