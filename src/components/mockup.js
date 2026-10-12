import { esc, each } from '../lib/html.js';
import { icon } from './brand.js';

const chart = (c) => `<svg viewBox="0 0 100 40" preserveAspectRatio="none" class="ch" aria-hidden="true"><path d="M0 34 L16 28 L32 31 L48 18 L64 22 L80 10 L100 6 L100 40 L0 40Z" fill="${esc(c)}" fill-opacity=".12"/><path d="M0 34 L16 28 L32 31 L48 18 L64 22 L80 10 L100 6" fill="none" stroke="${esc(c)}" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`;

/**
 * Illustrative product UI. Uses demo numbers only, so it is hidden from
 * assistive tech and marked data-nosnippet so search/LLM snippets never quote it as fact.
 */
export const mockup = (p) => {
  const m = p.presentation;
  return `<div class="mock" data-nosnippet aria-hidden="true" style="--c:${esc(p.color)}">
  <div class="tb"><b></b><b></b><b></b><span>${esc(p.appUrl.replace(/^https?:\/\//, ''))}</span></div>
  <div class="mk"><aside><div class="lg">${icon(p.slug, 24, { lazy: false })}</div>${each(m.mockNav, (n) => `<span>${esc(n)}</span>`)}</aside>
  <div class="mm"><div class="kp">${each(m.mockKpis, (k) => `<div class="kpi"><small>${esc(k.label)}</small><strong>${esc(k.value)}</strong></div>`)}</div>
  ${chart(p.color)}
  <div>${each(m.mockRows, (r) => `<div class="rw"><span>${esc(r.a)}</span><span class="muted">${esc(r.b)}</span><em class="${/Due|Pending/.test(r.status) ? 'w' : ''}">${esc(r.status)}</em></div>`)}</div>
  <div class="note">Illustrative mockup data — not SAMUHIA statistics.</div></div></div></div>`;
};
