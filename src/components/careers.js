import { esc, each } from '../lib/html.js';
import { site, careers, productBySlug, abs } from '../lib/data.js';
import { fill, kes, planEarnings, serviceNet, manualEntryPrice, scenario } from '../lib/earnings.js';
import { icon } from './brand.js';

const f = (s) => esc(fill(s));
export const applyUrl = () => productBySlug('desk').appUrl;
export const careerPaths = () => careers.paths;
export const pathUrl = (slug) => `/careers/${slug}/`;
const statusClass = (s) => (s === 'Live' ? 'live' : s === 'Rolling out' ? 'soon' : 'disc');

export const applyButtons = ({ secondary = true } = {}) => {
  const h = careers.hub;
  return `<div class="row"><a class="btn pri" href="${esc(applyUrl())}" rel="noopener">${esc(h.applyLabel)}</a>${secondary ? `<a class="btn" href="/careers/#earnings">${esc(h.secondaryLabel)}</a>` : ''}</div><p class="muted cr-note">${esc(h.applyNote)}</p>`;
};

export const statStrip = (items) =>
  `<dl class="cr-stats">${each(items, (s) => `<div><dt>${f(s.label)}</dt><dd>${f(s.value)}</dd></div>`)}</dl>`;

export const pathCards = (current) =>
  `<div class="cr-paths">${each(careerPaths(), (p) => {
    const prod = p.product ? productBySlug(p.product) : null;
    return `<a class="cr-path${p.slug === current ? ' cur' : ''}" href="${pathUrl(p.slug)}"${p.slug === current ? ' aria-current="page"' : ''} style="--c:${esc(prod ? prod.color : '#0F6B54')}">
  <span class="cr-k">${p.kind === 'rank' ? 'Rank' : 'Focus'}</span>
  <span class="cr-ic">${prod ? icon(prod.slug, 36) : `<b>${p.rank === 'senior' ? 'S' : 'C'}</b>`}</span>
  <strong>${esc(p.name)}</strong><span>${f(p.short)}</span><em>View path →</em></a>`;
  })}</div>`;

export const streamsTable = (keys) => {
  const rows = careers.streams.filter((s) => !keys || keys.includes(s.key));
  return `<div class="cr-tw"><table class="cr-t"><caption class="sr-only">Ways to earn on Samuhia Desk</caption><thead><tr><th>Stream</th><th>How you earn</th><th>Estimate</th><th>Status</th></tr></thead><tbody>${each(
    rows,
    (s) => `<tr><th scope="row" data-label="Stream"><strong>${esc(s.name)}</strong><small>${f(s.what)}</small></th><td data-label="How you earn">${f(s.rate)}</td><td data-label="Estimate">${f(s.example)}</td><td data-label="Status"><span class="cr-st ${statusClass(s.status)}">${esc(s.status)}</span></td></tr>`
  )}</tbody></table></div>`;
};

export const planTable = (slug, rank = 'both') => {
  const p = productBySlug(slug);
  const rows = planEarnings(slug);
  const col = (r, n) => `<td data-label="${r === 'clerk' ? 'Clerk' : 'Senior'}" class="${rank === r ? 'hl' : ''}"><strong>${kes(n)}</strong></td>`;
  return `<h3 class="cr-h3">${esc(p.name)} subscriptions: your estimate per account, per month</h3><div class="cr-tw"><table class="cr-t"><caption class="sr-only">${esc(p.name)} commission estimates by plan</caption><thead><tr><th>Plan</th><th>Customer pays</th><th>Clerk ${careers.assumptions.rankSharePct.clerk}%</th><th>Senior ${careers.assumptions.rankSharePct.senior}%</th></tr></thead><tbody>${each(
    rows,
    (r) => `<tr><th scope="row" data-label="Plan">${esc(r.name)}</th><td data-label="Customer pays">${kes(r.price)} / month</td>${col('clerk', r.clerk)}${col('senior', r.senior)}</tr>`
  )}</tbody></table></div>`;
};

export const serviceTable = () => {
  const a = careers.assumptions;
  const price = (r) => (r.records ? manualEntryPrice(r.records) : a[r.price]);
  return `<h3 class="cr-h3">Desk services: what the customer pays and what you keep</h3><div class="cr-tw"><table class="cr-t"><caption class="sr-only">Desk service prices and agent earnings</caption><thead><tr><th>Service</th><th>Customer pays</th><th>You earn, about</th></tr></thead><tbody>${each(
    careers.serviceRows,
    (r) => `<tr><th scope="row" data-label="Service">${esc(r.service)}</th><td data-label="Customer pays">${kes(price(r))}</td><td data-label="You earn, about" class="hl"><strong>${kes(serviceNet(price(r)))}</strong></td></tr>`
  )}</tbody></table></div><p class="muted cr-note">You keep ${fill('{{keepPct}}')}% of the amount left after the payment fee, on every rank. Manual entry price is the record tier plus a ${kes(a.manualEntryServiceFeeKes)} service fee.</p>`;
};

export const scenarioCards = () =>
  `<div class="cr-sc">${each(careers.scenarios.map(scenario), (s) => `<article class="cr-card"><span class="cr-k">${s.rank === 'senior' ? 'Senior' : 'Clerk'} · illustrative month</span><h3>${esc(s.name)}</h3><p class="muted">${esc(s.blurb)}</p><ul>${each(s.computed, (l) => `<li><span>${esc(l.label)}</span><b>${kes(l.amount)}</b></li>`)}</ul><div class="cr-tot"><span>About</span><strong>${kes(s.total)}</strong></div></article>`)}</div><p class="muted cr-note">${f(careers.scenarioNote)}</p>`;

export const journey = () =>
  `<ol class="cr-j">${each(careers.journey, (j, i) => `<li><span class="n">${i + 1}</span><div><strong>${esc(j.title)}</strong><p>${f(j.text)}</p></div></li>`)}</ol>`;

export const rulesList = () => `<ul class="chk cr-rules">${each(careers.rules, (r) => `<li>${f(r)}</li>`)}</ul>`;

export const bullets = (items) => `<ul class="chk">${each(items, (x) => `<li>${f(x)}</li>`)}</ul>`;

export const faqList = (items) => each(items, (q) => `<details><summary>${f(q.q)}</summary><p>${f(q.a)}</p></details>`);

export const jumpNav = (items) => `<div class="cr-jump" role="navigation" aria-label="On this page">${each(items, ([id, label]) => `<a href="#${esc(id)}">${esc(label)}</a>`)}</div>`;

/** Plain-anchor share links (work with JS off) + progressive copy/share buttons. */
export const shareBar = ({ path, title }) => {
  const url = abs(path);
  const text = `${title} — ${site.name}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const ext = 'target="_blank" rel="noopener noreferrer"';
  return `<aside class="cr-share" aria-label="Share this page"><div><strong>Share this path</strong><code>${esc(url.replace(/^https?:\/\//, ''))}</code></div><div class="cr-sl">
<a href="https://wa.me/?text=${t}%20${u}" ${ext}>WhatsApp</a>
<a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" ${ext}>LinkedIn</a>
<a href="https://twitter.com/intent/tweet?text=${t}&amp;url=${u}" ${ext}>X</a>
<a href="https://www.facebook.com/sharer/sharer.php?u=${u}" ${ext}>Facebook</a>
<a href="mailto:?subject=${t}&amp;body=${u}">Email</a>
<button type="button" class="cr-copy" data-copy="${esc(url)}" data-title="${esc(text)}" hidden>Copy link</button></div></aside>`;
};

export const otherRoles = () =>
  `<div class="cr-other"><div><h2 id="other-roles">${esc(careers.hub.otherTitle)}</h2><p>${f(careers.hub.otherText)}</p></div><a class="btn" href="mailto:${esc(site.email)}?subject=Expression%20of%20interest">Send an expression of interest</a></div>`;
