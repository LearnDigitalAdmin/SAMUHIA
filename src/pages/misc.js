import { esc, each } from '../lib/html.js';
import { site, bot, pages, products } from '../lib/data.js';
import { botCallout, botButton } from '../components/whatsapp.js';
import * as ld from '../seo/jsonld.js';

export const resourcesPage = () => {
  const c = pages.resources;
  return {
    path: '/resources/',
    title: c.seoTitle,
    description: c.description,
    noindex: !!c.draft, // thin "coming soon" page: keep out of search until real content exists
    crumbs: [{ label: 'Resources' }],
    jsonld: [ld.webPage({ path: '/resources/', title: c.seoTitle, description: c.description })],
    body: `<div class="page wrap"><p class="eyebrow">Resources</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p><div class="grid g3" style="margin-top:40px">${each(c.sections, (x) => `<div class="card"><h3>${esc(x)}</h3><p>Coming soon.</p></div>`)}</div></div>`,
  };
};

export const supportPage = () => {
  const c = pages.support;
  const status = site.contact.statusPageUrl
    ? `<section aria-labelledby="status"><h2 id="status">System status</h2><p><a href="${esc(site.contact.statusPageUrl)}" rel="noopener">View system status →</a></p></section>`
    : '';
  return {
    path: '/support/',
    title: c.seoTitle,
    description: c.description,
    crumbs: [{ label: 'Support' }],
    jsonld: [ld.webPage({ path: '/support/', title: c.seoTitle, description: c.description })],
    body: `<div class="page wrap"><p class="eyebrow">Support</p><h1>${esc(c.title)}</h1>${botCallout({ id: 'support-bot', title: 'Fastest way to get started: WhatsApp', text: 'Message the SAMUHIA WhatsApp bot to pay rent, get a rent invoice, open My Chama, use Landlord Watch or search for a house to rent. For help from our team, choose a product below.' })}<div class="grid g3" style="margin-top:32px">${each([...products.map((p) => p.name), 'General'], (x) => `<a class="card link" href="/contact/?topic=${encodeURIComponent(x)}"><h3>${esc(x)}</h3><p>Contact support →</p></a>`)}</div>${status}</div>`,
  };
};

export const contactPage = () => {
  const c = pages.contact;
  return {
    path: '/contact/',
    title: c.seoTitle,
    description: c.description,
    crumbs: [{ label: 'Contact' }],
    jsonld: [ld.webPage({ path: '/contact/', title: c.seoTitle, description: c.description, type: 'ContactPage' })],
    body: `<div class="page wrap"><p class="eyebrow">Contact</p><h1>${esc(c.title)}</h1>
<div class="grid g2" style="margin-top:32px;gap:48px">
  <form id="contact-form" action="mailto:${esc(site.email)}" method="post" enctype="text/plain" data-email="${esc(site.email)}" data-endpoint="${esc(site.contact.formEndpoint)}">
    <label>Name<input name="name" autocomplete="name" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label>Product<select name="product" id="product"><option>General</option>${each(products, (p) => `<option>${esc(p.name)}</option>`)}</select></label>
    <label>Message<textarea name="message" rows="5" required></textarea></label>
    <button class="btn pri" type="submit">Send message</button>
    <p class="muted" id="form-status" role="status"></p>
  </form>
  <div>
    <p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
    <p><a href="mailto:${esc(site.altEmail)}">${esc(site.altEmail)}</a></p>
    <p><a href="tel:${esc(site.phone)}">${esc(site.phoneDisplay)}</a><br><a href="https://wa.me/${esc(site.whatsapp)}" rel="noopener">WhatsApp</a></p>
    <p><strong>${esc(bot.name)}</strong><br><a href="${esc(bot.url)}" rel="noopener">${esc(bot.phoneSpaced)}</a><br><span class="muted">Pay rent, get invoices, Landlord Watch, House to Rent and My Chama.</span></p>
    ${site.social.length ? `<p class="muted" style="margin-top:12px">${each(site.social, (s) => `<a href="${esc(s.url)}" rel="me noopener">${esc(s.name)}</a> `)}</p>` : ''}
  </div>
</div></div>`,
  };
};

const legal = (key) => {
  const c = pages[key];
  return {
    path: `/${key}/`,
    title: `${c.seoTitle} | ${site.name}`,
    description: c.description,
    noindex: !!c.draft, // remove "draft" in content/pages.json once real legal text is in place
    crumbs: [{ label: c.title }],
    jsonld: [ld.webPage({ path: `/${key}/`, title: c.seoTitle, description: c.description })],
    body: `<div class="page wrap"><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p></div>`,
  };
};
export const privacyPage = () => legal('privacy');
export const termsPage = () => legal('terms');

export const notFoundPage = () => {
  const c = pages.notFound;
  return {
    path: '/404.html',
    file: '404.html',
    isNotFound: true,
    noindex: true,
    title: `${c.seoTitle} | ${site.name}`,
    description: c.description,
    jsonld: [],
    body: `<div class="page wrap"><div class="big404" aria-hidden="true">404</div><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p><div class="row"><a class="btn pri" href="/">Back to ${esc(site.name)}</a><a class="btn" href="/products/">Explore products</a>${botButton('Chat on WhatsApp', { cls: 'btn' })}</div></div>`,
  };
};
