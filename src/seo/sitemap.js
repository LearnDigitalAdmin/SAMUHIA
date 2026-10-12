import { build, abs } from '../lib/data.js';

const priority = (path) => (path === '/' ? '1.0' : path.split('/').filter(Boolean).length === 1 ? '0.8' : '0.7');

/** pages: [{ path, noindex }] */
export const sitemapXml = (pages) => {
  const lastmod = build.date.toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noindex && !p.isNotFound)
    .map((p) => `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority(p.path)}</priority>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};
