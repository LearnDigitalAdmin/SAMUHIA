import { esc, each } from '../lib/html.js';
import { home } from '../lib/data.js';

const C = [50, 50];
const path = (a, b) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
const spark = (a, b, dur, color) => `<circle r="1.1" fill="${color}"><animateMotion dur="${dur}s" repeatCount="indefinite" path="${path(a, b)}"/></circle>`;

/**
 * Hero ecosystem diagram, rendered at build time.
 * Nodes are real <a href> links, so it works and is crawlable without JavaScript;
 * main.js upgrades clicks to show a details panel.
 */
export const ecosystem = (products) => {
  const pos = (p) => [p.presentation.ecoX, p.presentation.ecoY];
  const rings = [18, 31, 45].map((r) => `<circle cx="50" cy="50" r="${r}" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width=".25"/>`).join('');
  const core = products.map((p, i) => `<path d="${path(C, pos(p))}" stroke="#7FD1B9" stroke-opacity=".35" stroke-width=".3" fill="none"/>${spark(C, pos(p), 5 + i * 0.8, p.presentation.ecoColor)}`).join('');
  // Hub products (presentation.hub) connect to every other product. A pair is drawn once.
  const hubs = products.filter((p) => p.presentation.hub);
  const inter = hubs
    .flatMap((hub, h) =>
      products
        .filter((p) => p !== hub && !hubs.slice(0, h).includes(p))
        .map((p, i) => ({ hub, p, i, h }))
    )
    .map(({ hub, p, i, h }) => `<path class=\"flow hub-${esc(hub.slug)}\" d=\"${path(pos(hub), pos(p))}\" stroke=\"${esc(hub.presentation.ecoColor)}\" stroke-opacity=\".55\" stroke-width=\".3\" fill=\"none\"/>${spark(pos(hub), pos(p), 6 + i + h * 1.3, hub.presentation.ecoColor)}`)
    .join('');
  const key = `<ul class=\"eco-key\">${each(hubs, (hub) => `<li><i style=\"background:${esc(hub.presentation.ecoColor)}\"></i>${esc(hub.name)} connects every product</li>`)}</ul>`;
  const nodes = each(products, (p) => `<a class="node${p.presentation.hub ? ' hub' : ''}" href="/products/${esc(p.slug)}/" data-slug="${esc(p.slug)}" data-name="${esc(p.name)}" data-cat="${esc(p.category)}" data-desc="${esc(p.description)}" data-aud="${esc(p.audience)}" data-app="${esc(p.appUrl)}" style="left:${p.presentation.ecoX}%;top:${p.presentation.ecoY}%"><i style="background:${esc(p.presentation.ecoColor)}"></i>${esc(p.name)}</a>`);
  return `<div class="eco" id="eco"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${rings}${core}${inter}</svg><span class="node core" style="left:50%;top:50%">SAMUHIA</span>${nodes}</div>
${key}
<div class="tip" id="tip" aria-live="polite"><strong>${esc(home.hero.ecosystemTitle)}</strong><p class="muted">${esc(home.hero.ecosystemHint)}</p></div>`;
};
