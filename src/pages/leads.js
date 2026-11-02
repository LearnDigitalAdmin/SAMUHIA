import { esc, each } from '../lib/html.js';
import { site, leads, abs } from '../lib/data.js';
import { icon } from '../components/brand.js';
import { faq } from '../components/faq.js';
import { shareBar } from '../components/careers.js';
import { leadProduct, leadFaq, formEmbedSrc, leadWhatsappUrl } from '../lib/leads.js';
import * as ld from '../seo/jsonld.js';
import { leadMarkdown } from '../seo/markdown.js';

/**
 * /products/plot-yangu/get-started/ — lead-capture page for prospective Plot Yangu customers
 * (landlords, agencies, developers, cooperatives, caretakers). Not linked from Samuhia Desk / careers pages.
 *
 * Search engines do not index the content of a cross-origin iframe, so everything that should rank
 * (headline, audience, benefits, steps, FAQ) is real HTML on this page; the Google Form is the conversion widget.
 */
export const leadPage = () => {
  const p = leadProduct();
  const path = leads.path;
  const faqs = leadFaq();
  const crumbs = [{ label: 'Products', href: '/products/' }, { label: p.name, href: `/products/${p.slug}/` }, { label: 'Get started' }];

  const body = `<div class="page wrap"><article>
  <header class="ld-hero" style="--c:${esc(p.color)}">
    <div class="pi" style="width:52px;height:52px">${icon(p.slug, 52, { lazy: false })}</div>
    <p class="eyebrow">${esc(leads.eyebrow)}</p>
    <h1>${esc(leads.title)}</h1>
    <p class="lead">${esc(leads.lead)}</p>
    <ul class="ld-pts">${each(leads.points, (x) => `<li>${esc(x)}</li>`)}</ul>
    <div class="row"><a class="btn pri" href="#form">${esc(leads.primaryCta)}</a><a class="btn" href="/products/${esc(p.slug)}/#pricing">${esc(leads.secondaryCta)}</a></div>
  </header>

  <section aria-labelledby="form">
    <h2 id="form">${esc(leads.formTitle)}</h2>
    <p class="lead">${esc(leads.formLead)}</p>
    <div class="ld-who"><h3>${esc(leads.audienceTitle)}</h3><ul class="chk">${each(leads.audience, (x) => `<li>${esc(x)}</li>`)}</ul></div>
    <p class="muted ld-fallback">${esc(leads.fallbackIntro)} <a href="${esc(leads.formUrl)}" target="_blank" rel="noopener">${esc(leads.fallbackLabel)} →</a></p>
    <div class="ld-frame" style="--ld-h:${Number(leads.formHeight)}px;--ld-h-m:${Number(leads.formHeightMobile)}px">
      <iframe src="${esc(formEmbedSrc())}" title="${esc(leads.iframeTitle)}" width="640" height="${Number(leads.formHeight)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"><a href="${esc(leads.formUrl)}" target="_blank" rel="noopener">${esc(leads.fallbackLabel)}</a></iframe>
    </div>
    <p class="muted ld-consent">${esc(leads.consent)} <a href="/privacy/#enquiries">${esc(leads.privacyLabel)}</a>.</p>
  </section>

  <section aria-labelledby="talk">
    <div class="ld-talk"><div><h2 id="talk">${esc(leads.talkTitle)}</h2><p>${esc(leads.talkText)}</p><p class="ld-num"><a href="tel:${esc(site.phone)}">${esc(site.phoneDisplay)}</a> · <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p></div><a class="btn pri" href="${esc(leadWhatsappUrl())}" rel="noopener">WhatsApp us</a></div>
  </section>

  <section aria-labelledby="benefits"><h2 id="benefits">${esc(leads.benefitsTitle)}</h2>
    <div class="grid g3">${each(leads.benefits, (b) => `<article class="card"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></article>`)}</div>
  </section>

  <section aria-labelledby="how"><h2 id="how">${esc(leads.stepsTitle)}</h2><ol class="steps">${each(p.steps, (s) => `<li>${esc(s)}</li>`)}</ol>
    <p style="margin-top:18px"><a href="/products/${esc(p.slug)}/">Read the full Plot Yangu overview →</a></p>
  </section>

  <section aria-labelledby="faq"><h2 id="faq">${esc(leads.faqTitle)}</h2>${faq(faqs)}</section>

  <div class="row"><a class="btn pri" href="#form">${esc(leads.primaryCta)}</a><a class="btn" href="/products/${esc(p.slug)}/">About Plot Yangu</a></div>
  ${shareBar({ path, title: 'Get Plot Yangu', label: 'Share this page', text: 'Plot Yangu: manage rental properties and M-Pesa rent in one app' })}
</article></div>`;

  return {
    path,
    title: leads.seoTitle,
    description: leads.description,
    crumbs,
    ogType: 'website',
    hasMarkdown: true,
    markdown: leadMarkdown(),
    body,
    jsonld: [ld.webPage({ path, title: leads.seoTitle, description: leads.description, type: 'ContactPage', extra: { relatedLink: abs(`/products/${p.slug}/`) } }), ld.faqPage(faqs)],
  };
};
