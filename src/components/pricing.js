import { esc, each } from '../lib/html.js';

export const planCards = (p) =>
  p.plans.length
    ? `<div class="plans">${each(p.plans, (pl) => `<article class="plan${pl.highlight ? ' hl' : ''}" style="--c:${esc(p.color)}">${pl.tag ? `<span class="tag">${esc(pl.tag)}</span>` : ''}<h3>${esc(pl.name)}</h3><div class="pr">${esc(pl.price)}${pl.per ? ` <small>${esc(pl.per)}</small>` : ''}</div><p class="muted" style="font-size:.86rem">${esc(pl.description)}</p><ul>${each(pl.features, (x) => `<li>${esc(x)}</li>`)}</ul></article>`)}</div>`
    : '';

export const priceBlock = (p) =>
  p.plans.length
    ? `${planCards(p)}${p.priceNote ? `<p class="muted" style="margin-top:16px">${esc(p.priceNote)}</p>` : ''}`
    : `<div class="card" style="max-width:640px"><h3>Pricing</h3><p>${esc(p.priceSummary)}</p>${p.priceNote ? `<p>${esc(p.priceNote)}</p>` : ''}</div>`;
