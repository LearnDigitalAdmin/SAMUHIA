import { esc, each } from '../lib/html.js';
import { site } from '../lib/data.js';
import { lockup } from './brand.js';

const isActive = (item, path) => {
  const targets = item.match || [item.href];
  if (item.href === '/') return path === '/';
  return targets.some((t) => path === t || path.startsWith(t));
};

export const header = (path) => `
<header>
  <div class="wrap bar">
    <a class="logo" href="/" aria-label="${esc(site.name)} home">${lockup('samuhia', 40, { reversed: true })}</a>
    <button class="menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
    <nav id="nav" aria-label="Primary">
      <ul>${each(site.nav, (n) => `<li><a href="${esc(n.href)}"${isActive(n, path) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`)}</ul>
    </nav>
    <a class="btn pri hdrcta" href="${esc(site.headerCta.href)}" style="min-height:40px">${esc(site.headerCta.label)}</a>
  </div>
</header>`;
