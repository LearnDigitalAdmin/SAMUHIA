import { esc, each } from '../lib/html.js';
import { pages, products } from '../lib/data.js';
import { priceBlock } from '../components/pricing.js';
import { icon } from '../components/brand.js';
import * as ld from '../seo/jsonld.js';
import { pricingMarkdown } from '../seo/markdown.js';

export const pricingPage = () => {
  const c = pages.pricing;
  const paid = products.filter((p) => p.plans.length);
  const other = products.filter((p) => !p.plans.length);
  return {
    path: '/pricing/',
    title: c.seoTitle,
    description: c.description,
    crumbs: [{ label: 'Pricing' }],
    hasMarkdown: true,
    markdown: pricingMarkdown(),
    jsonld: [ld.webPage({ path: '/pricing/', title: c.seoTitle, description: c.description }), ...paid.map(ld.softwareApplication)],
    body: `<div class="page wrap"><p class="eyebrow">Pricing</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p>
${each(paid, (p) => `<section aria-labelledby="p-${esc(p.slug)}"><h2 id="p-${esc(p.slug)}" style="display:flex;align-items:center;gap:12px"><span class="pi" style="width:40px;height:40px">${icon(p.slug, 40)}</span><a href="/products/${esc(p.slug)}/" style="color:inherit;text-decoration:none">${esc(p.name)}</a></h2>${priceBlock(p)}</section>`)}
<section aria-labelledby="p-other"><h2 id="p-other">${esc(other.map((p) => p.name).join(' and '))}</h2><div class="grid g2">${each(other, (p) => `<div class="card"><h3><a href="/products/${esc(p.slug)}/" style="color:inherit;text-decoration:none">${esc(p.name)}</a></h3><p>${esc(p.priceSummary)}</p>${p.priceNote ? `<p>${esc(p.priceNote)}</p>` : ''}</div>`)}</div></section>
<p class="muted" style="margin-top:28px">${esc(c.footnote)}</p></div>`,
  };
};
