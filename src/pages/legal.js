import { esc, each } from '../lib/html.js';
import { site, pages, legal } from '../lib/data.js';
import { inline } from '../lib/inline.js';
import * as ld from '../seo/jsonld.js';

// Content lives in src/content/legal.json. {{tokens}} are filled from legal.company.
const fill = (s) =>
  String(s).replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in legal.company)) throw new Error(`legal.json: unknown token {{${k}}}`);
    return legal.company[k];
  });
const t = (s) => inline(fill(s));

const block = (b, label) => {
  switch (b.type) {
    case 'p': return `<p>${t(b.text)}</p>`;
    case 'ul': return `<ul>${each(b.items, (i) => `<li>${t(i)}</li>`)}</ul>`;
    case 'ol': return `<ol>${each(b.items, (i) => `<li>${t(i)}</li>`)}</ol>`;
    case 'note': return `<div class="lg-note lg-${esc(b.tone || 'info')}">${b.title ? `<strong>${esc(fill(b.title))}</strong>` : ''}<p>${t(b.text)}</p></div>`;
    case 'table':
      return `<div class="lg-tw" role="region" aria-label="${esc(label)}" tabindex="0"><table><thead><tr>${each(b.head, (h) => `<th scope="col">${esc(h)}</th>`)}</tr></thead><tbody>${each(b.rows, (r) => `<tr>${each(r, (c) => `<td>${t(c)}</td>`)}</tr>`)}</tbody></table></div>`;
    default: throw new Error(`legal.json: unknown block type ${b.type}`);
  }
};

const legalPage = (key, other) => {
  const c = pages[key];
  const doc = legal[key];
  const co = legal.company;
  const path = `/${key}/`;
  const title = `${c.seoTitle} | ${site.name}`;
  const body = `<div class="page wrap"><article class="lg">
  <header><p class="eyebrow">Legal</p><h1>${esc(c.title)}</h1><p class="lead">${t(doc.intro)}</p>
  <p class="muted lg-meta">Version ${esc(co.version)} · Effective ${esc(co.effective)} · Last updated ${esc(co.updated)}</p></header>
  <aside class="lg-short" aria-labelledby="short"><h2 id="short">${esc(doc.summaryTitle)}</h2><ul>${each(doc.summary, (i) => `<li>${t(i)}</li>`)}</ul></aside>
  <nav class="lg-toc" aria-label="Contents"><p class="ftitle">Contents</p><ol>${each(doc.sections, (s) => `<li><a href="#${esc(s.id)}">${esc(s.title)}</a></li>`)}</ol></nav>
  ${each(doc.sections, (s, i) => `<section aria-labelledby="${esc(s.id)}"><h2 id="${esc(s.id)}">${i + 1}. ${esc(s.title)}</h2>${each(s.blocks, (b) => block(b, s.title))}</section>`)}
  <p class="lg-other"><a href="${esc(other.href)}">${esc(other.label)} →</a></p>
</article></div>`;
  return {
    path,
    title,
    description: c.description,
    crumbs: [{ label: c.title }],
    jsonld: [ld.webPage({ path, title, description: c.description })],
    body,
  };
};

export const privacyPage = () => legalPage('privacy', { href: '/terms/', label: 'Read the Terms of Use' });
export const termsPage = () => legalPage('terms', { href: '/privacy/', label: 'Read the Privacy Policy' });
