import { esc, each } from '../lib/html.js';
import { site, pages, products, solutions, featureBySlug } from '../lib/data.js';
import { productCard, badge, relatedList } from '../components/cards.js';
import { icon } from '../components/brand.js';
import { mockup } from '../components/mockup.js';
import { botCallout } from '../components/whatsapp.js';
import { facts } from '../components/facts.js';
import { faq } from '../components/faq.js';
import { priceBlock } from '../components/pricing.js';
import * as ld from '../seo/jsonld.js';
import { productMarkdown, productsIndexMarkdown } from '../seo/markdown.js';

export const productsIndex = () => {
  const c = pages.products;
  const crumbs = [{ label: 'Products' }];
  return {
    path: '/products/',
    title: c.seoTitle,
    description: c.description,
    crumbs,
    hasMarkdown: true,
    markdown: productsIndexMarkdown(),
    jsonld: [ld.webPage({ path: '/products/', title: c.seoTitle, description: c.description, type: 'CollectionPage' }), ld.productItemList()],
    body: `<div class="page wrap"><p class="eyebrow">Products</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p><div class="grid g3" style="margin-top:40px">${each(products, productCard)}</div></div>`,
  };
};

export const productPage = (p) => {
  const path = `/products/${p.slug}/`;
  const solution = solutions.find((s) => s.slug === p.solution);
  const title = `${p.name} — ${p.category} | ${site.name}`;
  const withAudience = `${p.description} Built for ${p.audience.charAt(0).toLowerCase()}${p.audience.slice(1)}.`;
  const description = withAudience.length <= 160 ? withAudience : p.description;
  const crumbs = [{ label: 'Products', href: '/products/' }, { label: p.name }];
  const cta = `<a class="btn pri" href="${esc(p.appUrl)}" rel="noopener">${esc(p.ctaLabel)}</a>`;
  const body = `<div class="page wrap"><article>
  <div class="grid g2" style="align-items:center;gap:48px">
    <div>
      <div class="pi" style="width:52px;height:52px">${icon(p.slug, 52, { lazy: false })}</div>
      <p class="eyebrow" style="margin-top:16px">${esc(p.category)}</p>
      <h1>${esc(p.name)}</h1>
      <p class="lead">${esc(p.longDescription)}</p>
      <p style="margin-top:14px">${badge(p.status)}</p>
      <div class="row">${cta}${p.plans.length ? `<a class="btn" href="#pricing">View pricing</a>` : ''}</div>
    </div>
    ${mockup(p)}
  </div>
  <section aria-labelledby="problem"><h2 id="problem">The problem</h2><p>${esc(p.problem)}</p></section>
  <section aria-labelledby="capabilities"><h2 id="capabilities">Core capabilities</h2><ul class="chk">${each(p.features, (f) => `<li>${esc(f)}</li>`)}</ul></section>
  ${p.featureSlugs?.length ? `<section aria-labelledby="featured"><h2 id="featured">Featured capabilities</h2><div class="grid g2">${each(p.featureSlugs.map(featureBySlug), (f) => `<article class="card"><h3>${esc(f.name)}</h3><p>${esc(f.cardDescription)}</p><a class="lnk" href="/features/${esc(f.slug)}/">Read about ${esc(f.name)} →</a></article>`)}</div></section>` : ''}
  <section aria-labelledby="how"><h2 id="how">How it works</h2><ol class="steps">${each(p.steps, (s) => `<li>${esc(s)}</li>`)}</ol></section>
  ${p.whatsappBot ? botCallout({ id: 'whatsapp-bot', title: `${p.name} on WhatsApp`, text: p.whatsappBot }) : ''}
  <section aria-labelledby="glance"><h2 id="glance">At a glance</h2>${facts(p.facts)}</section>
  <section aria-labelledby="audience"><h2 id="audience">Who it's for</h2><p>${esc(p.audience)}.</p>${solution ? `<p style="margin-top:10px"><a href="/solutions/${esc(solution.slug)}/">See the ${esc(solution.title.replace(/^For /, ''))} solution →</a></p>` : ''}</section>
  <section aria-labelledby="pricing"><h2 id="pricing">Pricing</h2>${priceBlock(p)}</section>
  <section aria-labelledby="ecosystem"><h2 id="ecosystem">Part of the SAMUHIA ecosystem</h2><p style="margin-bottom:18px">${esc(p.connects)}</p>${relatedList(p.related)}</section>
  ${p.careersCta ? `<section aria-labelledby="careers"><div class="product-careers"><div><h2 id="careers">${esc(p.careersCta.title)}</h2><p>${esc(p.careersCta.text)}</p></div><a class="btn pri" href="${esc(p.careersCta.href)}">${esc(p.careersCta.label)}</a></div></section>` : ''}
  <section aria-labelledby="faq"><h2 id="faq">FAQ</h2>${faq(p.faq)}</section>
  <div class="row">${cta}<a class="btn" href="/products/">All products</a></div>
</article></div>`;
  return {
    path,
    title,
    description,
    crumbs,
    ogType: 'website',
    hasMarkdown: true,
    markdown: productMarkdown(p),
    body,
    jsonld: [ld.webPage({ path, title, description, type: 'WebPage', extra: { mainEntity: { '@id': ld.softwareApplication(p)['@id'] } } }), ld.softwareApplication(p), ld.faqPage(p.faq)],
  };
};

export const allProductPages = () => [productsIndex(), ...products.map(productPage)];
