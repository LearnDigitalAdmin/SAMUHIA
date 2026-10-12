import { esc, each } from '../lib/html.js';
import { site, products, solutions, build } from '../lib/data.js';
import { lockup } from './brand.js';

const col = (title, links) => `<div><p class="ftitle">${esc(title)}</p><ul>${each(links, (l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)}</ul></div>`;

export const footer = () => {
  const year = build.date.getFullYear();
  const social = site.social.length
    ? each(site.social, (s) => `<a href="${esc(s.url)}" rel="me noopener">${esc(s.name)}</a>`)
    : '';
  return `
<footer>
  <div class="wrap">
    <div class="fbrand">
      <a href="/" aria-label="${esc(site.name)} home">${lockup('samuhia', 44, { reversed: true })}</a>
      <p>${esc(site.shortDescription)}</p>
      <p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a> · <a href="tel:${esc(site.phone)}">${esc(site.phoneDisplay)}</a> · <a href="https://wa.me/${esc(site.whatsapp)}" rel="noopener">WhatsApp</a></p>
    </div>
    <div class="cols">
      ${col('Products', products.map((p) => ({ label: p.name, href: `/products/${p.slug}/` })))}
      ${col('Solutions', solutions.map((s) => ({ label: s.title.replace(/^For /, ''), href: `/solutions/${s.slug}/` })))}
      ${each(site.footerColumns, (c) => col(c.title, c.links))}
    </div>
    <div class="fmark" aria-hidden="true">${esc(site.name)}</div>
    <div class="fb"><span>© ${site.foundingYear}–${year} ${esc(site.legalName)}. All rights reserved.</span><span>Built in ${esc(site.countryName)}${social ? ' · ' + social : ''}</span></div>
  </div>
</footer>`;
};
