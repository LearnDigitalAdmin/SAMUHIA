import { esc, each } from '../lib/html.js';
import { site, pages, solutions, productBySlug } from '../lib/data.js';
import { solutionCard } from '../components/cards.js';
import { faq } from '../components/faq.js';
import { botCallout } from '../components/whatsapp.js';
import * as ld from '../seo/jsonld.js';
import { solutionMarkdown, solutionsIndexMarkdown } from '../seo/markdown.js';

export const solutionsIndex = () => {
  const c = pages.solutions;
  return {
    path: '/solutions/',
    title: c.seoTitle,
    description: c.description,
    crumbs: [{ label: 'Solutions' }],
    hasMarkdown: true,
    markdown: solutionsIndexMarkdown(),
    jsonld: [ld.webPage({ path: '/solutions/', title: c.seoTitle, description: c.description, type: 'CollectionPage' })],
    body: `<div class="page wrap"><p class="eyebrow">Solutions</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p><div class="grid g3" style="margin-top:40px">${each(solutions, (s) => solutionCard(s))}</div></div>`,
  };
};

export const solutionPage = (s) => {
  const p = productBySlug(s.product);
  const path = `/solutions/${s.slug}/`;
  const title = `${s.title.replace(/^For /, '')}: ${p.name} | ${site.name}`;
  const description = `${s.description} Recommended: ${p.name}, ${p.category.toLowerCase()} from ${site.name}.`;
  return {
    path,
    title,
    description,
    crumbs: [{ label: 'Solutions', href: '/solutions/' }, { label: s.title }],
    hasMarkdown: true,
    markdown: solutionMarkdown(s),
    jsonld: [ld.webPage({ path, title, description })],
    body: `<div class="page wrap"><article>
  <p class="eyebrow">Solution</p><h1>${esc(s.title)}</h1><p class="lead">${esc(s.description)}</p>
  <section aria-labelledby="rec"><h2 id="rec">Recommended: ${esc(p.name)}</h2><p>${esc(p.longDescription)}</p></section>
  <section aria-labelledby="does"><h2 id="does">What you can do</h2><ul class="chk">${each(p.features.slice(0, 8), (f) => `<li>${esc(f)}</li>`)}</ul></section>
  ${p.whatsappBot ? botCallout({ id: 'whatsapp-bot', title: 'Also on WhatsApp', text: p.whatsappBot }) : ''}
  <section aria-labelledby="price"><h2 id="price">Pricing</h2><p>${esc(p.priceSummary)}</p></section>
  <section aria-labelledby="qa"><h2 id="qa">Common questions</h2>${faq(p.faq.slice(0, 3))}</section>
  <div class="row"><a class="btn pri" href="/products/${esc(p.slug)}/">Explore ${esc(p.name)}</a><a class="btn" href="${esc(p.appUrl)}" rel="noopener">${esc(p.ctaLabel.startsWith('Learn') ? 'Visit platform' : p.ctaLabel)}</a></div>
</article></div>`,
  };
};

export const allSolutionPages = () => [solutionsIndex(), ...solutions.map(solutionPage)];
