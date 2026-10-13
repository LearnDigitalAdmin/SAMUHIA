import { esc } from '../lib/html.js';
import { pages, careers, abs, productBySlug } from '../lib/data.js';
import { fill } from '../lib/earnings.js';
import * as ld from '../seo/jsonld.js';
import { careersMarkdown, careerPathMarkdown } from '../seo/markdown.js';
import {
  applyButtons, statStrip, pathCards, streamsTable, planTable, serviceTable, scenarioCards, journey, rulesList, bullets, faqList,
  jumpNav, shareBar, otherRoles, careerPaths, pathUrl,
} from '../components/careers.js';

const f = (s) => esc(fill(s));
const faqItems = (items) => items.map((q) => ({ q: fill(q.q), a: fill(q.a) }));

export const careersHub = () => {
  const c = pages.careers;
  const h = careers.hub;
  const crumbs = [{ label: 'Company', href: '/about/' }, { label: 'Careers' }];
  const faqs = faqItems(careers.faq);
  return {
    path: '/careers/',
    title: c.seoTitle,
    description: fill(c.description),
    crumbs,
    hasMarkdown: true,
    markdown: careersMarkdown(),
    jsonld: [
      ld.webPage({ path: '/careers/', title: c.seoTitle, description: fill(c.description), type: 'CollectionPage' }),
      {
        '@type': 'ItemList',
        name: 'Samuhia Desk career paths',
        itemListElement: careerPaths().map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(pathUrl(p.slug)), name: p.name })),
      },
      ld.faqPage(faqs),
    ],
    body: `<div class="page wrap"><article>
  <header class="cr-hero"><p class="eyebrow">${esc(h.eyebrow)}</p><h1>${esc(c.title)}</h1><p class="lead">${f(c.lead)}</p>
    <ul class="cr-pts">${h.heroPoints.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    ${applyButtons()}</header>
  ${statStrip(h.stats)}
  ${jumpNav([['paths', 'Paths'], ['earnings', 'Earnings'], ['estimates', 'Estimates'], ['how-it-works', 'How it works'], ['rules', 'Rules'], ['faq', 'FAQ'], ['other-roles', 'Other roles']])}
  <section aria-labelledby="paths"><h2 id="paths">${esc(h.pathsTitle)}</h2><p class="lead">${f(h.pathsLead)}</p>${pathCards()}</section>
  <section aria-labelledby="earnings"><h2 id="earnings">${esc(h.earnTitle)}</h2><p class="lead">${f(h.earnLead)}</p>${streamsTable()}${serviceTable()}</section>
  <section aria-labelledby="estimates"><h2 id="estimates">${esc(h.estimatesTitle)}</h2><p class="lead">${f(h.estimatesLead)}</p>${scenarioCards()}</section>
  <section aria-labelledby="how-it-works"><h2 id="how-it-works">${esc(h.journeyTitle)}</h2>${journey()}${applyButtons({ secondary: false })}</section>
  <section aria-labelledby="rules"><h2 id="rules">${esc(h.rulesTitle)}</h2><p class="lead">${f(h.rulesLead)}</p>${rulesList()}</section>
  <section aria-labelledby="faq"><h2 id="faq">${esc(h.faqTitle)}</h2>${faqList(careers.faq)}</section>
  <section aria-labelledby="other-roles">${otherRoles()}</section>
  ${shareBar({ path: '/careers/', title: c.seoTitle })}
</article></div>`,
  };
};

export const careerPathPage = (p) => {
  const path = pathUrl(p.slug);
  const description = fill(p.description);
  const crumbs = [{ label: 'Company', href: '/about/' }, { label: 'Careers', href: '/careers/' }, { label: p.name }];
  const next = careers.paths.find((x) => x.slug === p.next);
  const prod = p.product ? productBySlug(p.product) : null;
  const wantsServices = p.earns.includes('services');
  const tables = (p.tables || []).map((slug) => planTable(slug, p.tableRank)).join('');
  const faqs = faqItems(p.faq);
  return {
    path,
    title: p.seoTitle,
    description,
    crumbs,
    hasMarkdown: true,
    markdown: careerPathMarkdown(p),
    jsonld: [ld.webPage({ path, title: p.seoTitle, description }), ld.faqPage(faqs)],
    body: `<div class="page wrap"><article>
  <header class="cr-hero" style="--c:${esc(prod ? prod.color : '#0F6B54')}"><p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.headline)}</h1><p class="lead">${f(p.lead)}</p>${applyButtons()}</header>
  ${jumpNav([['role', 'The role'], ['earnings', 'Earnings'], ['start', 'How to start'], ['faq', 'FAQ'], ['paths', 'All paths']])}
  <section aria-labelledby="role"><h2 id="role">The role</h2><div class="grid g2"><div class="cr-card"><h3>Who it suits</h3>${bullets(p.forWho)}</div><div class="cr-card"><h3>What you do</h3>${bullets(p.youDo)}</div></div></section>
  <section aria-labelledby="earnings"><h2 id="earnings">What you can earn</h2>
    <p class="cr-call">${f(p.callout)}</p>
    ${streamsTable(p.earns)}${tables}${wantsServices ? serviceTable() : ''}</section>
  <section aria-labelledby="start"><h2 id="start">How to start</h2>${journey()}${applyButtons({ secondary: false })}</section>
  <section aria-labelledby="rules"><h2 id="rules">Before you apply</h2>${rulesList()}</section>
  <section aria-labelledby="faq"><h2 id="faq">Questions</h2>${faqList(p.faq)}</section>
  <section aria-labelledby="paths"><h2 id="paths">${next ? `Next: ${esc(next.name)}` : 'All paths'}</h2>${pathCards(p.slug)}<p style="margin-top:18px"><a href="/careers/">← All careers at SAMUHIA</a>${prod ? ` · <a href="/products/${esc(prod.slug)}/">About ${esc(prod.name)}</a>` : ''} · <a href="/products/desk/">About Samuhia Desk</a></p></section>
  ${shareBar({ path, title: p.seoTitle })}
</article></div>`,
  };
};

export const allCareerPages = () => [careersHub(), ...careers.paths.map(careerPathPage)];
