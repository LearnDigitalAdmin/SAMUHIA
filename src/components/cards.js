import { esc, each } from '../lib/html.js';
import { productBySlug } from '../lib/data.js';
import { icon } from './brand.js';

export const badge = (t) => `<span class="badge">${esc(t)}</span>`;

export const productCard = (p, i) => `
<article class="card" data-reveal style="--c:${esc(p.color)}">
  <div class="top"><div class="pi">${icon(p.slug, 40)}</div><span class="idx">0${i + 1}</span></div>
  <div class="thumb" aria-hidden="true">${each(p.presentation.chartBars, (h) => `<i style="height:${h}%"></i>`)}</div>
  <span class="cat">${esc(p.category)}</span>
  <h3>${esc(p.name)}</h3>${badge(p.status)}
  <p>${esc(p.description)}</p>
  <p><strong>For:</strong> ${esc(p.audience)}</p>
  <a class="lnk" href="/products/${esc(p.slug)}/">Explore ${esc(p.name)} →</a>
</article>`;

export const solutionCard = (s, { dark = false } = {}) => `
<article class="card${dark ? ' on-dark' : ''}" data-reveal>
  <h3>${esc(s.title)}</h3>
  <p>${esc(s.description)}</p>
  <a class="lnk" href="/solutions/${esc(s.slug)}/">Explore ${esc(productBySlug(s.product).name)} →</a>
</article>`;

/** Compact list of related products (internal linking). */
export const relatedList = (slugs) =>
  `<ul class="related">${each(slugs, (slug) => {
    const p = productBySlug(slug);
    return `<li><a href="/products/${esc(p.slug)}/" style="--c:${esc(p.color)}"><span class="pi">${icon(p.slug, 32)}</span><span>${esc(p.name)}<small>${esc(p.category)}</small></span></a></li>`;
  })}</ul>`;
