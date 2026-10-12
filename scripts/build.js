#!/usr/bin/env node
/**
 * SAMUHIA static site build — zero runtime dependencies (Node 18+).
 *
 *   node scripts/build.js                    production build into ./public
 *   node scripts/build.js --noindex          staging/preview build (noindex + Disallow: /)
 *   node scripts/build.js --site-url=https://example.web.app   override canonical origin
 *   node scripts/build.js --no-minify        readable CSS (debugging)
 *   node scripts/build.js --strict           exit code 1 if validation finds errors
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { site, build, ROOT, SRC, abs } from '../src/lib/data.js';
import { emptyDir, write, copyDir, walk } from './lib/fsx.js';
import { bundleCss } from './lib/css.js';
import { allPages } from '../src/pages/index.js';
import { sitemapXml } from '../src/seo/sitemap.js';
import { robotsTxt } from '../src/seo/robots.js';
import { llmsTxt, llmsFullTxt } from '../src/seo/llms.js';
import { layout } from '../src/layouts/base.js';
import { validate } from './lib/validate.js';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=');

const OUT = path.join(ROOT, 'public');
const started = Date.now();

if (opt('site-url')) site.url = opt('site-url').replace(/\/$/, '');
build.noindex = flag('noindex');

emptyDir(OUT);

/* ---- 1. Assets: hashed CSS + JS for long-term caching ---- */
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const css = bundleCss(path.join(SRC, 'styles'), { minified: !flag('no-minify') });
const js = fs.readFileSync(path.join(SRC, 'scripts', 'main.js'), 'utf8');
build.assets.css = `/assets/css/main.${hash(css)}.css`;
build.assets.js = `/assets/js/main.${hash(js)}.js`;
write(path.join(OUT, build.assets.css), css);
write(path.join(OUT, build.assets.js), js);
copyDir(path.join(SRC, 'assets', 'brand'), path.join(OUT, 'assets', 'brand'));
copyDir(path.join(SRC, 'assets', 'icons'), path.join(OUT, 'assets', 'icons'));
copyDir(path.join(SRC, 'assets', 'og'), path.join(OUT, 'assets', 'og'));
copyDir(path.join(SRC, 'static'), OUT); // favicon.ico, favicon.svg, apple-touch-icon.png, …
fs.rmSync(path.join(OUT, 'assets', 'brand', 'brand.json'), { force: true });

/* ---- 2. Pages ---- */
const pages = allPages();
for (const page of pages) {
  const file = page.file || path.posix.join(page.path, 'index.html');
  write(path.join(OUT, file), layout(page));
  if (page.markdown) write(path.join(OUT, page.path, 'index.md'), page.markdown);
}

/* ---- 3. SEO / LLM / PWA files ---- */
write(path.join(OUT, 'sitemap.xml'), sitemapXml(pages));
write(path.join(OUT, 'robots.txt'), robotsTxt());
write(path.join(OUT, 'llms.txt'), llmsTxt());
write(path.join(OUT, 'llms-full.txt'), llmsFullTxt());
write(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify(
    {
      name: `${site.name} — ${site.tagline}`,
      short_name: site.name,
      description: site.shortDescription,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#F1EDE4',
      theme_color: site.themeColor,
      lang: site.lang,
      icons: [
        { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/assets/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  )
);
const expires = new Date(build.date.getTime() + 365 * 864e5).toISOString();
write(
  path.join(OUT, '.well-known', 'security.txt'),
  `Contact: mailto:${site.email}\nExpires: ${expires}\nPreferred-Languages: en\nCanonical: ${abs('/.well-known/security.txt')}\n`
);

/* ---- 4. Validate ---- */
const report = validate({ out: OUT, pages, walk });
const files = walk(OUT);
console.log(`\n✔ Built ${pages.length} pages, ${files.length} files → ${path.relative(process.cwd(), OUT) || OUT} in ${Date.now() - started} ms`);
console.log(`  Site URL: ${site.url}${build.noindex ? '   (NOINDEX build)' : ''}`);
for (const w of report.warnings) console.log('  ⚠ ' + w);
for (const e of report.errors) console.log('  ✖ ' + e);
if (!report.errors.length && !report.warnings.length) console.log('  All SEO and link checks passed.');
if (flag('strict') && report.errors.length) process.exit(1);
