import { esc, each } from '../lib/html.js';
import { pages, features, featureBySlug, productBySlug } from '../lib/data.js';
import { relatedList } from '../components/cards.js';
import { facts } from '../components/facts.js';
import { faq } from '../components/faq.js';
import * as ld from '../seo/jsonld.js';
import { featureMarkdown, featuresIndexMarkdown } from '../seo/markdown.js';

const featureCard = (f) => `
<article class="card" data-reveal>
  <span class="cat">${esc(productBySlug(f.product).name)} feature</span>
  <h3>${esc(f.name)}</h3>
  <p>${esc(f.cardDescription)}</p>
  <p><strong>On:</strong> ${esc(f.channels.join(' and '))}</p>
  <a class="lnk" href="/features/${esc(f.slug)}/">Explore ${esc(f.name)} →</a>
</article>`;

export const featuresIndex = () => {
  const c = pages.features;
  return {
    path: '/features/',
    title: c.seoTitle,
    description: c.description,
    crumbs: [{ label: 'Features' }],
    hasMarkdown: true,
    markdown: featuresIndexMarkdown(),
    jsonld: [ld.webPage({ path: '/features/', title: c.seoTitle, description: c.description, type: 'CollectionPage' }), ld.featureItemList()],
    body: `<div class="page wrap"><p class="eyebrow">Features</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p><div class="grid g2" style="margin-top:40px">${each(features, featureCard)}</div></div>`,
  };
};

export const featurePage = (f) => {
  const p = productBySlug(f.product);
  const path = `/features/${f.slug}/`;
  const cta = `<a class="btn pri" href="${esc(f.ctaHref)}" rel="noopener">${esc(f.ctaLabel)}</a>`;
  const cta2 = `<a class="btn" href="${esc(f.ctaSecondaryHref)}">${esc(f.ctaSecondaryLabel)}</a>`;
  const others = (f.relatedFeatures || []).map(featureBySlug);
  const body = `<div class="page wrap"><article>
  <p class="eyebrow">${esc(f.kicker)}</p>
  <h1>${esc(f.title)}</h1>
  <p class="lead">${esc(f.lead)}</p>
  <div class="row">${cta}${cta2}</div>
  <section aria-labelledby="problem"><h2 id="problem">The problem</h2><p>${esc(f.problem)}</p></section>
  <section aria-labelledby="capabilities"><h2 id="capabilities">${esc(f.capabilitiesTitle)}</h2><ul class="chk">${each(f.capabilities, (x) => `<li>${esc(x)}</li>`)}</ul></section>
  <section aria-labelledby="how"><h2 id="how">How it works</h2><ol class="steps">${each(f.steps, (s) => `<li>${esc(s)}</li>`)}</ol></section>
  <section aria-labelledby="safeguards"><h2 id="safeguards">${esc(f.safeguards.title)}</h2><ul class="chk">${each(f.safeguards.items, (x) => `<li>${esc(x)}</li>`)}</ul></section>
  ${each(f.audiences, (a) => `<section aria-labelledby="${esc(a.id)}"><h2 id="${esc(a.id)}">${esc(a.title)}</h2><p>${esc(a.lead)}</p><ul class="chk">${each(a.items, (x) => `<li>${esc(x)}</li>`)}</ul></section>`)}
  <section aria-labelledby="glance"><h2 id="glance">At a glance</h2>${facts(f.facts)}</section>
  <section aria-labelledby="part"><h2 id="part">Part of ${esc(p.name)}</h2><p style="margin-bottom:18px">${esc(f.name)} is a feature of <a href="/products/${esc(p.slug)}/">${esc(p.name)}</a>, SAMUHIA's property management product.${others.length ? ` See also: ${others.map((o) => `<a href="/features/${esc(o.slug)}/">${esc(o.name)}</a>`).join(', ')}.` : ''}</p>${relatedList(f.related)}</section>
  <section aria-labelledby="faq"><h2 id="faq">FAQ</h2>${faq(f.faq)}</section>
  <div class="row">${cta}${cta2}<a class="btn" href="/features/">All features</a></div>
</article></div>`;
  return {
    path,
    title: f.seoTitle,
    description: f.description,
    crumbs: [{ label: 'Features', href: '/features/' }, { label: f.name }],
    ogType: 'website',
    hasMarkdown: true,
    markdown: featureMarkdown(f),
    body,
    jsonld: [ld.webPage({ path, title: f.seoTitle, description: f.description, extra: { mainEntity: { '@id': ld.featureService(f)['@id'] } } }), ld.featureService(f), ld.faqPage(f.faq)],
  };
};

export const allFeaturePages = () => [featuresIndex(), ...features.map(featurePage)];
